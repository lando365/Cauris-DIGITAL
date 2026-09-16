import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { eventRegistrationSchema } from '@/lib/validations/event-registration';
import { SITE_CONFIG } from '@/lib/constants';
import { DEFAULT_LOCALE } from '@/i18n/config';

// Les emails sont envoyés hors contexte de requête (pas de locale "courante") :
// on utilise toujours la langue par défaut pour les liens (CDC §6.6).
const L = DEFAULT_LOCALE;

/**
 * Inscription à un événement — formulaire dédié, distinct du formulaire de
 * contact générique. Toujours persistée en base (visible dans l'admin,
 * module "Inscriptions") ; l'email de notification à l'équipe est best-effort
 * (son échec n'empêche pas l'inscription de réussir).
 */
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  // Honeypot anti-spam — si rempli, on fait croire que tout va bien sans rien faire
  if (typeof body.website === 'string' && body.website) {
    return NextResponse.json({ success: true });
  }

  const parsed = eventRegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.isPublished) {
    return NextResponse.json({ error: 'Événement introuvable.' }, { status: 404 });
  }
  if (event.startDate <= new Date()) {
    return NextResponse.json(
      { error: 'Les inscriptions pour cet événement sont closes.' },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, phone, guestsCount, message } = parsed.data;

  const registration = await prisma.eventRegistration.create({
    data: { eventId: event.id, firstName, lastName, email, phone, guestsCount, message },
  });

  await notifyTeam(event.title, registration).catch((err) => {
    console.warn('[event-register] Notification email non envoyée:', err);
  });

  await sendConfirmationEmail(event, registration).catch((err) => {
    console.warn('[event-register] Email de confirmation non envoyé:', err);
  });

  return NextResponse.json({ success: true });
}

async function notifyTeam(
  eventTitle: string,
  reg: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    guestsCount: number;
    message: string | null;
  }
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[event-register] Inscription (mode dev):', eventTitle, reg.email);
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_EMAIL_FROM ?? 'CAURIS DIGITAL <onboarding@resend.dev>';
  const to = process.env.CONTACT_EMAIL_TO;
  if (!to) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_CONFIG.url;
  const fullName = `${reg.firstName} ${reg.lastName}`.trim();

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
      <body style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #E8640A; margin-bottom: 8px;">Nouvelle inscription — ${escape(eventTitle)}</h2>
        <p style="color: #6C757D; font-size: 14px; margin-top: 0;">Site CAURIS DIGITAL — ${siteUrl}</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6C757D; width: 140px;">Nom</td><td style="padding: 6px 0; font-weight: 600;">${escape(fullName)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6C757D;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escape(reg.email)}" style="color: #E8640A;">${escape(reg.email)}</a></td></tr>
          ${reg.phone ? `<tr><td style="padding: 6px 0; color: #6C757D;">Téléphone</td><td style="padding: 6px 0; font-weight: 600;">${escape(reg.phone)}</td></tr>` : ''}
          <tr><td style="padding: 6px 0; color: #6C757D;">Participants</td><td style="padding: 6px 0; font-weight: 600;">${reg.guestsCount}</td></tr>
        </table>

        ${
          reg.message
            ? `
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <h3 style="color: #1A1A2E; font-size: 16px;">Message :</h3>
        <div style="background: #FFF5EE; border-left: 4px solid #E8640A; padding: 16px 20px; border-radius: 6px; white-space: pre-wrap;">${escape(reg.message)}</div>
        `
            : ''
        }

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="color: #6C757D; font-size: 12px;">
          Cet email a été envoyé automatiquement depuis le site CAURIS DIGITAL.<br />
          Pour répondre, utilisez directement l'adresse : <a href="mailto:${escape(reg.email)}" style="color: #E8640A;">${escape(reg.email)}</a>
        </p>
      </body>
    </html>
  `;

  const text =
    `Nouvelle inscription — ${eventTitle}\n\n` +
    `Nom : ${fullName}\n` +
    `Email : ${reg.email}\n` +
    `${reg.phone ? `Téléphone : ${reg.phone}\n` : ''}` +
    `Participants : ${reg.guestsCount}\n` +
    `${reg.message ? `\nMessage :\n${reg.message}\n` : ''}` +
    `\n---\nRépondre directement à : ${reg.email}`;

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: reg.email,
    subject: `[CAURIS] Inscription — ${eventTitle} — ${fullName}`,
    html,
    text,
  });

  if (error) {
    console.error('[event-register] Erreur Resend:', error);
  }
}

/** Échappe les caractères HTML dangereux dans le contenu utilisateur (XSS protection). */
function escape(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Email de confirmation envoyé à l'inscrit — même charte visuelle que les
 * emails newsletter (bandeau sombre, accent orange, CTA arrondi).
 */
async function sendConfirmationEmail(
  event: { title: string; startDate: Date; location: string; isOnline: boolean; isFree: boolean; price: string | null },
  reg: { firstName: string; email: string; guestsCount: number }
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_CONFIG.url;

  if (!apiKey) {
    console.log('[event-register] Email de confirmation (mode dev):', reg.email);
    return;
  }

  const dateLabel = event.startDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeLabel = event.startDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const placeLabel = event.isOnline ? 'En ligne' : event.location;
  const priceLabel = event.isFree ? 'Gratuit' : (event.price ?? 'Payant');
  const eventsUrl = `${siteUrl}/${L}/evenements`;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
      <body style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFF5EE;">
        <div style="background: #1A1A2E; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">
            Inscription confirmée à <span style="color: #E8640A;">${escape(event.title)}</span>
          </h1>
        </div>

        <div style="background: white; padding: 32px 28px; border-radius: 0 0 12px 12px;">
          <p>Bonjour <strong>${escape(reg.firstName)}</strong>,</p>

          <p>Votre inscription est confirmée. Voici un récapitulatif :</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #FFF5EE; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 12px 16px; color: #6C757D; width: 130px;">Date</td>
              <td style="padding: 12px 16px; font-weight: 600; text-transform: capitalize;">${escape(dateLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #6C757D;">Heure</td>
              <td style="padding: 12px 16px; font-weight: 600;">${escape(timeLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #6C757D;">Lieu</td>
              <td style="padding: 12px 16px; font-weight: 600;">${escape(placeLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #6C757D;">Tarif</td>
              <td style="padding: 12px 16px; font-weight: 600;">${escape(priceLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #6C757D;">Participants</td>
              <td style="padding: 12px 16px; font-weight: 600;">${reg.guestsCount}</td>
            </tr>
          </table>

          <div style="text-align: center; margin: 28px 0;">
            <a href="${eventsUrl}" style="display: inline-block; background: #E8640A; color: white; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 6px;">
              Voir tous nos événements
            </a>
          </div>

          <p style="font-size: 13px; color: #6C757D;">À très bientôt !<br />L'équipe CAURIS DIGITAL</p>
        </div>
      </body>
    </html>
  `;

  const text =
    `Inscription confirmée à ${event.title}\n\n` +
    `Bonjour ${reg.firstName},\n\n` +
    `Votre inscription est confirmée. Récapitulatif :\n` +
    `Date : ${dateLabel}\n` +
    `Heure : ${timeLabel}\n` +
    `Lieu : ${placeLabel}\n` +
    `Tarif : ${priceLabel}\n` +
    `Participants : ${reg.guestsCount}\n\n` +
    `Voir tous nos événements : ${eventsUrl}\n\n` +
    `À très bientôt !\nL'équipe CAURIS DIGITAL`;

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_EMAIL_FROM ?? 'CAURIS DIGITAL <onboarding@resend.dev>';

  const { error } = await resend.emails.send({
    from,
    to: [reg.email],
    subject: `Inscription confirmée — ${event.title}`,
    html,
    text,
  });

  if (error) {
    console.error('[event-register] Erreur Resend (confirmation):', error);
  }
}
