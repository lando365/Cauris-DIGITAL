import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { eventRegistrationSchema } from '@/lib/validations/event-registration';

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

  const fullName = `${reg.firstName} ${reg.lastName}`.trim();
  const text =
    `Nouvelle inscription — ${eventTitle}\n\n` +
    `Nom : ${fullName}\n` +
    `Email : ${reg.email}\n` +
    `${reg.phone ? `Téléphone : ${reg.phone}\n` : ''}` +
    `Participants : ${reg.guestsCount}\n` +
    `${reg.message ? `\nMessage :\n${reg.message}\n` : ''}`;

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: reg.email,
    subject: `[CAURIS] Inscription — ${eventTitle} — ${fullName}`,
    text,
  });

  if (error) {
    console.error('[event-register] Erreur Resend:', error);
  }
}
