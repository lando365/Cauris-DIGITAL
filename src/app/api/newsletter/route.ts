import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SITE_CONFIG } from '@/lib/constants';
import { createToken } from '@/lib/newsletter-token';

/**
 * Endpoint d'inscription newsletter — étape 1/2 : double opt-in (CDC §6.5).
 *
 * Flow :
 *  1. Validation de l'email
 *  2. Génération d'un jeton de confirmation signé (48h de validité)
 *  3. Envoi d'un email « Confirmez votre inscription » contenant le lien
 *  4. Réponse JSON — le contact n'est PAS encore ajouté à l'audience Resend :
 *     ça n'arrive qu'après le clic sur le lien, voir /api/newsletter/confirm
 *
 * Variables .env.local requises :
 *  - RESEND_API_KEY        → même clé que pour le formulaire de contact
 *  - RESEND_AUDIENCE_ID    → ID de l'audience Resend (créée dans le dashboard)
 *  - CONTACT_EMAIL_FROM    → adresse expéditrice vérifiée
 *  - NEWSLETTER_TOKEN_SECRET → secret de signature des liens (voir newsletter-token.ts)
 *
 * En l'absence de configuration, la route log uniquement (mode dev fallback).
 */
export async function POST(request: Request) {
  try {
    const { email, firstName, consent, website } = await request.json();

    // 1. Honeypot anti-spam — si rempli, on fait croire que tout va bien sans rien faire
    if (website) {
      return NextResponse.json({ success: true, message: 'Confirmation enregistrée.' });
    }

    // 2. Validation
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: 'Le consentement est obligatoire.' }, { status: 400 }); // RM-N02
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName =
      typeof firstName === 'string' ? firstName.trim().slice(0, 80) : undefined;

    // 3. Mode fallback dev — pas de clé
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      console.warn(
        '[newsletter] RESEND_API_KEY ou RESEND_AUDIENCE_ID non configurés. Mode log uniquement.'
      );
      console.log('[newsletter] Demande de confirmation (mode dev):', cleanEmail);
      return NextResponse.json({
        success: true,
        message: 'Confirmation enregistrée (mode dev).',
        dev: true,
      });
    }

    const resend = new Resend(apiKey);
    const from = process.env.CONTACT_EMAIL_FROM ?? 'CAURIS DIGITAL <onboarding@resend.dev>';

    // 4. Lien de confirmation signé (double opt-in — pas d'ajout à l'audience ici)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_CONFIG.url;
    const confirmToken = createToken(cleanEmail, 'confirm');
    const confirmUrl = new URL('/api/newsletter/confirm', siteUrl);
    confirmUrl.searchParams.set('token', confirmToken);
    if (cleanFirstName) confirmUrl.searchParams.set('firstName', cleanFirstName);

    const confirmHtml = `
      <!DOCTYPE html>
      <html lang="fr">
        <body style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFF5EE;">
          <div style="background: #1A1A2E; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">
              Confirmez votre inscription à <span style="color: #E8640A;">CAURIS DIGITAL</span>
            </h1>
          </div>

          <div style="background: white; padding: 32px 28px; border-radius: 0 0 12px 12px;">
            <p>Bonjour${cleanFirstName ? ` <strong>${escape(cleanFirstName)}</strong>` : ''},</p>

            <p>Vous avez demandé à recevoir la newsletter de CAURIS DIGITAL. Pour confirmer votre inscription, cliquez sur le bouton ci-dessous :</p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${confirmUrl.toString()}" style="display: inline-block; background: #E8640A; color: white; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 6px;">
                Confirmer mon inscription
              </a>
            </div>

            <p style="font-size: 13px; color: #6C757D;">Ce lien est valable 48 heures. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email sans risque — aucune inscription ne sera enregistrée.</p>
          </div>
        </body>
      </html>
    `;

    const confirmText =
      `Confirmez votre inscription à la newsletter CAURIS DIGITAL\n\n` +
      `Bonjour${cleanFirstName ? ` ${cleanFirstName}` : ''},\n\n` +
      `Cliquez sur ce lien pour confirmer votre inscription (valable 48h) :\n${confirmUrl.toString()}\n\n` +
      `Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.`;

    const { error: emailError } = await resend.emails.send({
      from,
      to: [cleanEmail],
      subject: 'Confirmez votre inscription à la newsletter CAURIS DIGITAL',
      html: confirmHtml,
      text: confirmText,
    });

    if (emailError) {
      if (isResendTestModeRestriction(emailError)) {
        console.warn(
          `[newsletter] Email de confirmation non envoyé à ${cleanEmail} ` +
            `(mode test Resend — domaine non vérifié). Voir docs/SETUP_RESEND.md.`
        );
        // On ne peut pas garantir que l'utilisateur recevra le lien : on le
        // signale clairement plutôt que de prétendre que tout s'est bien passé.
        return NextResponse.json(
          {
            error:
              "Le service d'emails est en mode test et ne peut pas encore envoyer à cette adresse. Réessayez plus tard ou contactez-nous directement.",
          },
          { status: 503 }
        );
      }
      console.error('[newsletter] Erreur envoi email de confirmation:', emailError);
      return NextResponse.json(
        { error: "Impossible d'envoyer l'email de confirmation. Réessayez plus tard." },
        { status: 500 }
      );
    }

    console.log('[newsletter] Email de confirmation envoyé ✓', cleanEmail);

    return NextResponse.json({
      success: true,
      message: 'Vérifiez votre boîte mail pour confirmer votre inscription.',
    });
  } catch (error) {
    console.error('[newsletter] Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur. Réessayez plus tard.' }, { status: 500 });
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
 * Détecte si l'erreur Resend correspond à la restriction du mode test
 * (uniquement envoi vers l'email du propriétaire tant qu'aucun domaine n'est vérifié).
 */
function isResendTestModeRestriction(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { statusCode?: number; name?: string; message?: string };
  if (e.statusCode !== 403) return false;
  if (e.name !== 'validation_error') return false;
  const msg = String(e.message ?? '').toLowerCase();
  return (
    msg.includes('testing emails') ||
    msg.includes('your own email') ||
    msg.includes('verify a domain')
  );
}
