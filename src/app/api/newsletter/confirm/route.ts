import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SITE_CONFIG } from '@/lib/constants';
import { createToken, verifyToken } from '@/lib/newsletter-token';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { prisma } from '@/lib/prisma';

// Les emails sont envoyés hors contexte de requête (pas de locale "courante") :
// on utilise toujours la langue par défaut pour les liens (CDC §6.6).
const L = DEFAULT_LOCALE;

/**
 * Endpoint de confirmation newsletter — étape 2/2 du double opt-in (CDC §6.5).
 *
 * Appelé par le lien cliqué dans l'email envoyé par POST /api/newsletter.
 * C'est ICI (et seulement ici) que le contact est réellement ajouté à
 * l'audience Resend et que l'email de bienvenue part.
 */
export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_CONFIG.url;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const firstName = searchParams.get('firstName')?.slice(0, 80) || undefined;

  if (!token) {
    return NextResponse.redirect(new URL(`/${L}/newsletter/erreur?raison=manquant`, siteUrl));
  }

  const result = verifyToken(token, 'confirm');
  if (!result.valid || !result.email) {
    const raison = result.reason === 'expired' ? 'expire' : 'invalide';
    return NextResponse.redirect(new URL(`/${L}/newsletter/erreur?raison=${raison}`, siteUrl));
  }

  const email = result.email;

  // Persistance en base (CDC §5.3.7) — indépendante de Resend, source de vérité
  // pour le dashboard admin. RM-N03 : une réinscription réactive le compte
  // (status ACTIVE, unsubscribedAt remis à zéro) plutôt que de dupliquer la ligne.
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: {
      email,
      firstName: firstName ?? null,
      source: 'footer',
      consentGiven: true,
      consentDate: new Date(),
    },
    update: {
      status: 'ACTIVE',
      unsubscribedAt: null,
    },
  });

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.warn('[newsletter/confirm] RESEND_API_KEY ou RESEND_AUDIENCE_ID non configurés.');
    console.log('[newsletter/confirm] Confirmation (mode dev):', email);
    return NextResponse.redirect(new URL(`/${L}/newsletter/confirmee`, siteUrl));
  }

  const resend = new Resend(apiKey);

  const { error: contactError } = await resend.contacts.create({
    email,
    firstName,
    unsubscribed: false,
    audienceId,
  });

  if (contactError) {
    const msg = String(contactError.message ?? '').toLowerCase();
    const alreadySubscribed = msg.includes('already') || msg.includes('exist');
    if (!alreadySubscribed) {
      console.error('[newsletter/confirm] Erreur Resend contacts.create:', contactError);
      return NextResponse.redirect(new URL(`/${L}/newsletter/erreur?raison=serveur`, siteUrl));
    }
  }

  console.log('[newsletter/confirm] Inscription confirmée ✓', email);

  // Email de bienvenue, avec lien de désinscription automatique (CDC §6.5 — un clic).
  const from = process.env.CONTACT_EMAIL_FROM ?? 'CAURIS DIGITAL <onboarding@resend.dev>';
  const unsubscribeToken = createToken(email, 'unsubscribe');
  const unsubscribeUrl = new URL('/api/newsletter/unsubscribe', siteUrl);
  unsubscribeUrl.searchParams.set('token', unsubscribeToken);

  const welcomeHtml = `
    <!DOCTYPE html>
    <html lang="fr">
      <body style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFF5EE;">
        <div style="background: #1A1A2E; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">
            Bienvenue dans la communauté <span style="color: #E8640A;">CAURIS DIGITAL</span> 🌍
          </h1>
        </div>

        <div style="background: white; padding: 32px 28px; border-radius: 0 0 12px 12px;">
          <p>Bonjour${firstName ? ` <strong>${escape(firstName)}</strong>` : ''},</p>

          <p>Votre inscription est confirmée. Bienvenue dans la communauté CAURIS DIGITAL !</p>

          <p>Vous faites maintenant partie d'un réseau d'entrepreneurs, mentors et partenaires qui construisent l'Afrique numérique de demain.</p>

          <h3 style="color: #1A1A2E; margin-top: 28px; margin-bottom: 12px;">Pour commencer :</h3>

          <ul style="padding-left: 20px;">
            <li style="margin-bottom: 8px;">
              <a href="${siteUrl}/${L}/programme-incubation" style="color: #E8640A; text-decoration: none; font-weight: 600;">Découvrez nos programmes d'incubation et d'accélération</a>
            </li>
            <li style="margin-bottom: 8px;">
              <a href="${siteUrl}/${L}/startups" style="color: #E8640A; text-decoration: none; font-weight: 600;">Explorez les startups que nous accompagnons</a>
            </li>
            <li style="margin-bottom: 8px;">
              <a href="${siteUrl}/${L}/contact?objet=candidature" style="color: #E8640A; text-decoration: none; font-weight: 600;">Candidatez si vous avez un projet tech</a>
            </li>
          </ul>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-style: italic;">À très bientôt,</p>
            <p style="margin: 4px 0 0; font-weight: 600;">L'équipe CAURIS DIGITAL</p>
          </div>
        </div>

        <p style="text-align: center; color: #6C757D; font-size: 11px; margin-top: 20px;">
          Vous recevez cet email suite à la confirmation de votre inscription à la newsletter CAURIS DIGITAL.<br />
          <a href="${unsubscribeUrl.toString()}" style="color: #6C757D;">Se désinscrire en un clic</a>
        </p>
      </body>
    </html>
  `;

  const welcomeText =
    `Bienvenue dans la communauté CAURIS DIGITAL 🌍\n\n` +
    `Bonjour${firstName ? ` ${firstName}` : ''},\n\n` +
    `Votre inscription est confirmée. Bienvenue dans la communauté CAURIS DIGITAL !\n\n` +
    `Pour commencer :\n` +
    `→ Découvrez nos programmes : ${siteUrl}/${L}/programme-incubation\n` +
    `→ Explorez les startups : ${siteUrl}/${L}/startups\n` +
    `→ Candidatez : ${siteUrl}/${L}/contact?objet=candidature\n\n` +
    `À très bientôt,\n` +
    `L'équipe CAURIS DIGITAL\n\n` +
    `Se désinscrire : ${unsubscribeUrl.toString()}`;

  const { error: emailError } = await resend.emails.send({
    from,
    to: [email],
    subject: 'Bienvenue dans la communauté CAURIS DIGITAL 🌍',
    html: welcomeHtml,
    text: welcomeText,
  });

  if (emailError) {
    // L'inscription a déjà réussi côté audience — un échec d'envoi du mail de
    // bienvenue ne doit pas faire échouer la confirmation pour l'utilisateur.
    console.warn('[newsletter/confirm] Email de bienvenue non envoyé:', emailError);
  }

  return NextResponse.redirect(new URL(`/${L}/newsletter/confirmee`, siteUrl));
}

function escape(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
