import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SITE_CONFIG } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

/**
 * Endpoint de réception des messages de contact (CDC §6.1).
 *
 * Reçoit un multipart/form-data (et non plus du JSON) car le formulaire
 * "Candidature startup" peut inclure un pitch deck PDF joint à l'email.
 *
 * Flow :
 *  1. Validation côté serveur (anti-spam, champs, email, longueur, fichier)
 *  2. Envoi de l'email via Resend (https://resend.com), avec pièce jointe le cas échéant
 *  3. Réponse JSON au client
 *
 * Configuration requise dans .env.local :
 *  - RESEND_API_KEY        → clé API Resend (https://resend.com/api-keys)
 *  - CONTACT_EMAIL_FROM    → email expéditeur vérifié sur Resend (ex: noreply@caurisdigital.org)
 *  - CONTACT_EMAIL_TO      → email destinataire de l'équipe (ex: hello@caurisdigital.org)
 *
 * En l'absence de RESEND_API_KEY, le message est uniquement loggé en console (mode dev fallback).
 */

const MAX_PITCH_DECK_BYTES = 5 * 1024 * 1024; // 5 Mo

// Sujets qui impliquent les champs "Candidature startup" / "Partenariat corporate" (CDC §6.1)
const STARTUP_APPLICATION_SUBJECTS = new Set([
  'candidature',
  'candidature-incubation',
  'candidature-acceleration',
]);
const CORPORATE_SUBJECT = 'partenariat-corporate';

function str(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const firstName = str(formData.get('firstName'));
    const lastName = str(formData.get('lastName'));
    const email = str(formData.get('email'));
    const country = str(formData.get('country'));
    const subject = str(formData.get('subject'));
    const message = str(formData.get('message'));
    const consent = formData.get('consent');
    const website = str(formData.get('website')); // honeypot
    const recaptchaToken = str(formData.get('recaptchaToken'));

    // Champs spécifiques "Candidature startup"
    const startupName = str(formData.get('startupName'));
    const sector = str(formData.get('sector'));
    const stage = str(formData.get('stage'));
    const pitchDeckEntry = formData.get('pitchDeck');
    const pitchDeck = pitchDeckEntry instanceof File && pitchDeckEntry.size > 0 ? pitchDeckEntry : null;

    // Champs spécifiques "Partenariat corporate"
    const company = str(formData.get('company'));
    const phone = str(formData.get('phone'));

    // 1. Honeypot anti-spam — si rempli, on fait croire que tout va bien sans rien faire
    if (website) {
      return NextResponse.json({ success: true });
    }

    // 2. Validation des champs communs
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs marqués d\'une * sont obligatoires.' },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }
    if (message.length < 20) {
      return NextResponse.json(
        { error: 'Votre message doit faire au moins 20 caractères.' },
        { status: 400 },
      );
    }
    if (message.length > 10_000) {
      return NextResponse.json(
        { error: 'Votre message ne peut pas dépasser 10 000 caractères.' }, // CDC V2 §7.5
        { status: 400 },
      );
    }
    if (!consent) {
      return NextResponse.json(
        { error: 'Vous devez accepter la politique de confidentialité.' },
        { status: 400 },
      );
    }

    // 2bis. Validation "Candidature startup"
    const isStartupApplication = STARTUP_APPLICATION_SUBJECTS.has(subject);
    if (isStartupApplication && (!startupName || !sector || !stage)) {
      return NextResponse.json(
        { error: 'Nom de la startup, secteur et stade du projet sont obligatoires pour une candidature.' },
        { status: 400 },
      );
    }
    if (pitchDeck) {
      if (pitchDeck.type !== 'application/pdf') {
        return NextResponse.json({ error: 'Le pitch deck doit être un fichier PDF.' }, { status: 400 });
      }
      if (pitchDeck.size > MAX_PITCH_DECK_BYTES) {
        return NextResponse.json({ error: 'Le pitch deck dépasse 5 Mo.' }, { status: 400 });
      }
    }

    // 2ter. Validation "Partenariat corporate"
    if (subject === CORPORATE_SUBJECT && (!company || !phone)) {
      return NextResponse.json(
        { error: 'Société et téléphone sont obligatoires pour une demande de partenariat.' },
        { status: 400 },
      );
    }

    // 2quater. Vérification reCAPTCHA v3 (CDC §6.1)
    let recaptchaScore: number | null = null;
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret && recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken, recaptchaSecret);
      recaptchaScore = recaptchaResult.score;
      if (!recaptchaResult.success) {
        console.warn('[contact] reCAPTCHA invalide:', recaptchaResult.errorCodes);
        return NextResponse.json(
          { error: 'Vérification anti-spam échouée. Réessayez en rafraîchissant la page.' },
          { status: 400 },
        );
      }
      if (recaptchaResult.score < 0.5) {
        console.warn(
          `[contact] reCAPTCHA score trop bas: ${recaptchaResult.score} — rejet probable bot`,
        );
        return NextResponse.json(
          { error: 'Votre soumission semble suspecte. Si vous êtes humain, contactez-nous par email directement.' },
          { status: 403 },
        );
      }
      console.log(`[contact] reCAPTCHA OK (score: ${recaptchaResult.score})`);
    } else if (recaptchaSecret && !recaptchaToken) {
      console.warn('[contact] RECAPTCHA_SECRET_KEY configurée mais aucun token reçu du client.');
    }

    // 2quinquies. Persistance en base (CDC §5.3.6) — les champs spécifiques
    // candidature/partenariat (startup, secteur, société...) n'ont pas de colonne
    // dédiée dans ContactMessage : ils sont repris dans le corps du message stocké,
    // comme déjà fait pour l'email envoyé à l'équipe.
    const dbMessageParts = [message];
    if (startupName) dbMessageParts.push(`Startup : ${startupName}`);
    if (sector) dbMessageParts.push(`Secteur : ${sector}`);
    if (stage) dbMessageParts.push(`Stade du projet : ${stage}`);
    if (company) dbMessageParts.push(`Société : ${company}`);
    if (phone) dbMessageParts.push(`Téléphone : ${phone}`);

    // CDC V2 §7.7 : "Logs IP : 30 jours (hachage)" — l'IP n'est jamais stockée en
    // clair, seulement son empreinte, suffisante pour du rate-limiting/anti-abus
    // sans conserver une donnée personnelle directement identifiante.
    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const ipAddress = rawIp ? hashIp(rawIp) : null;

    await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        country: country || null,
        subject: SUBJECT_LABELS[subject] ?? subject,
        message: dbMessageParts.join('\n\n'),
        ipAddress,
        recaptchaScore,
      },
    });

    // 3. Construction de l'email
    const fullName = `${firstName} ${lastName}`.trim();
    const safeMessage = message.slice(0, 10000); // garde-fou anti-payload trop gros
    const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
    const subjectLine = `[CAURIS] ${subjectLabel} — ${fullName}${startupName ? ` (${startupName})` : ''}`;

    const extraRows: string[] = [];
    if (startupName) extraRows.push(row('Startup', startupName));
    if (sector) extraRows.push(row('Secteur', sector));
    if (stage) extraRows.push(row('Stade du projet', stage));
    if (company) extraRows.push(row('Société', company));
    if (phone) extraRows.push(row('Téléphone', phone));

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
        <body style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #E8640A; margin-bottom: 8px;">${escape(subjectLabel)}</h2>
          <p style="color: #6C757D; font-size: 14px; margin-top: 0;">Site CAURIS DIGITAL — ${SITE_CONFIG.url}</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6C757D; width: 140px;">Nom</td><td style="padding: 6px 0; font-weight: 600;">${escape(fullName)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6C757D;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escape(email)}" style="color: #E8640A;">${escape(email)}</a></td></tr>
            ${country ? `<tr><td style="padding: 6px 0; color: #6C757D;">Pays</td><td style="padding: 6px 0;">${escape(country)}</td></tr>` : ''}
            ${extraRows.join('')}
          </table>

          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

          <h3 style="color: #1A1A2E; font-size: 16px;">${isStartupApplication ? 'Pitch :' : 'Message :'}</h3>
          <div style="background: #FFF5EE; border-left: 4px solid #E8640A; padding: 16px 20px; border-radius: 6px; white-space: pre-wrap;">${escape(safeMessage)}</div>

          ${pitchDeck ? `<p style="color: #6C757D; font-size: 13px; margin-top: 16px;">📎 Pitch deck joint : ${escape(pitchDeck.name)}</p>` : ''}

          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

          <p style="color: #6C757D; font-size: 12px;">
            Cet email a été envoyé automatiquement depuis le site CAURIS DIGITAL.<br />
            Pour répondre, utilisez directement l'adresse : <a href="mailto:${escape(email)}" style="color: #E8640A;">${escape(email)}</a>
          </p>
        </body>
      </html>
    `;

    const text =
      `Nouveau message via le formulaire de contact CAURIS DIGITAL — ${subjectLabel}\n\n` +
      `Nom : ${fullName}\n` +
      `Email : ${email}\n` +
      `${country ? `Pays : ${country}\n` : ''}` +
      `${startupName ? `Startup : ${startupName}\n` : ''}` +
      `${sector ? `Secteur : ${sector}\n` : ''}` +
      `${stage ? `Stade du projet : ${stage}\n` : ''}` +
      `${company ? `Société : ${company}\n` : ''}` +
      `${phone ? `Téléphone : ${phone}\n` : ''}` +
      `\n${isStartupApplication ? 'Pitch' : 'Message'} :\n${safeMessage}\n\n` +
      `${pitchDeck ? `Pitch deck joint : ${pitchDeck.name}\n\n` : ''}` +
      `---\nRépondre directement à : ${email}`;

    // 4. Mode fallback dev — si pas de clé Resend, on log juste
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[contact] RESEND_API_KEY non configurée. Mode log uniquement.');
      console.log('[contact]', { fullName, email, subject, country, startupName, company, message: safeMessage.slice(0, 80) + '…' });
      return NextResponse.json({
        success: true,
        message: 'Votre message a bien été reçu. Réponse dans les plus brefs délais.',
        dev: true,
      });
    }

    // 5. Envoi via Resend, avec pièce jointe le cas échéant
    const resend = new Resend(apiKey);
    const from = process.env.CONTACT_EMAIL_FROM ?? 'CAURIS DIGITAL <onboarding@resend.dev>';
    const to = process.env.CONTACT_EMAIL_TO ?? SITE_CONFIG.email;

    const attachments = pitchDeck
      ? [{ filename: pitchDeck.name, content: Buffer.from(await pitchDeck.arrayBuffer()) }]
      : undefined;

    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: subjectLine,
      html,
      text,
      attachments,
    });

    if (error) {
      console.error('[contact] Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Impossible d\'envoyer le message pour le moment. Réessayez plus tard.' },
        { status: 500 },
      );
    }

    console.log('[contact] Message envoyé ✓', data?.id);

    return NextResponse.json({
      success: true,
      message: 'Votre message a bien été reçu. Réponse dans les plus brefs délais.',
    });
  } catch (error) {
    console.error('[contact] Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur. Réessayez plus tard.' }, { status: 500 });
  }
}

const SUBJECT_LABELS: Record<string, string> = {
  candidature: 'Candidature à un programme',
  'candidature-incubation': 'Candidature programme Incubation',
  'candidature-acceleration': 'Candidature programme Accélération',
  'partenariat-corporate': 'Partenariat corporate',
  mentorat: 'Demande de mentorat',
  presse: 'Presse et médias',
  evenement: 'Invitation à un événement',
  autre: 'Nouveau message via le formulaire de contact',
};

function row(label: string, value: string): string {
  return `<tr><td style="padding: 6px 0; color: #6C757D;">${escape(label)}</td><td style="padding: 6px 0; font-weight: 600;">${escape(value)}</td></tr>`;
}

/**
 * Échappe les caractères HTML dangereux dans le contenu utilisateur
 * (XSS protection basique pour les emails HTML).
 */
function escape(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Empreinte SHA-256 d'une adresse IP (CDC V2 §7.7) — jamais l'IP en clair.
 */
function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

interface RecaptchaResult {
  success: boolean;
  score: number;
  action?: string;
  errorCodes?: string[];
}

/**
 * Vérifie un token reCAPTCHA v3 auprès des serveurs Google.
 * Documentation : https://developers.google.com/recaptcha/docs/v3
 */
async function verifyRecaptcha(token: string, secret: string): Promise<RecaptchaResult> {
  try {
    const params = new URLSearchParams({ secret, response: token });
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!res.ok) {
      console.error('[recaptcha] HTTP non-OK:', res.status);
      return { success: false, score: 0, errorCodes: ['http-error'] };
    }

    const data = (await res.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      'error-codes'?: string[];
    };

    return {
      success: data.success === true,
      score: typeof data.score === 'number' ? data.score : 0,
      action: data.action,
      errorCodes: data['error-codes'],
    };
  } catch (err) {
    console.error('[recaptcha] Erreur réseau:', err);
    return { success: false, score: 0, errorCodes: ['network-error'] };
  }
}
