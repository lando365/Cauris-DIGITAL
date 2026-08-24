import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { createPasswordResetToken } from '@/lib/password-reset-token';
import { SITE_CONFIG } from '@/lib/constants';

// POST /api/auth/reset-password — CDC V2 §6.3.1 : "Demande de
// réinitialisation du mot de passe". Réponse volontairement identique que
// l'email existe ou non (anti-énumération de comptes, CDC §9.3 OWASP).
export async function POST(request: Request) {
  const GENERIC_RESPONSE = NextResponse.json({
    message: 'Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.',
  });

  let email: string;
  try {
    const body = await request.json();
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  } catch {
    return NextResponse.json({ error: { message: 'Requête invalide.' } }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: { message: 'Adresse email invalide.' } }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    return GENERIC_RESPONSE;
  }

  const token = createPasswordResetToken(user.id, user.passwordHash);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_CONFIG.url;
  const resetUrl = new URL('/admin/reset-password', siteUrl);
  resetUrl.searchParams.set('token', token);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[reset-password] RESEND_API_KEY absente — lien (mode dev) :', resetUrl.toString());
    return GENERIC_RESPONSE;
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_EMAIL_FROM ?? 'CAURIS DIGITAL <onboarding@resend.dev>';

  const { error } = await resend.emails.send({
    from,
    to: [user.email],
    subject: 'Réinitialisation de votre mot de passe — CAURIS DIGITAL',
    html: `
      <!DOCTYPE html>
      <html lang="fr">
        <body style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFF5EE;">
          <div style="background: #1A1A2E; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">
              <span style="color: #E8640A;">CAURIS DIGITAL</span> — Espace administrateur
            </h1>
          </div>
          <div style="background: white; padding: 32px 28px; border-radius: 0 0 12px 12px;">
            <p>Bonjour ${user.name},</p>
            <p>Une demande de réinitialisation de mot de passe a été effectuée pour votre compte. Ce lien est valable <strong>1 heure</strong> et à usage unique.</p>
            <p style="text-align: center; margin: 28px 0;">
              <a href="${resetUrl.toString()}" style="display: inline-block; background: #E8640A; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Réinitialiser mon mot de passe
              </a>
            </p>
            <p style="color: #6C757D; font-size: 13px;">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email — votre mot de passe actuel reste valide.</p>
          </div>
        </body>
      </html>
    `,
    text: `Réinitialisation de mot de passe — CAURIS DIGITAL\n\nBonjour ${user.name},\n\nUne demande de réinitialisation a été effectuée pour votre compte. Ce lien est valable 1 heure et à usage unique :\n${resetUrl.toString()}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.`,
  });

  if (error) {
    console.error('[reset-password] Erreur Resend:', error);
  }

  return GENERIC_RESPONSE;
}
