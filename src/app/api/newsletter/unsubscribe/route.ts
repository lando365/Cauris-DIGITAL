import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SITE_CONFIG } from '@/lib/constants';
import { verifyToken } from '@/lib/newsletter-token';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { prisma } from '@/lib/prisma';

// Les emails sont envoyés hors contexte de requête (pas de locale "courante") :
// on utilise toujours la langue par défaut pour les liens (CDC §6.6).
const L = DEFAULT_LOCALE;

const UNSUBSCRIBE_REASON_MAX_LENGTH = 500;

/** Désabonne l'email chez Resend (best effort) et journalise le résultat. */
async function unsubscribeFromResend(email: string, logPrefix: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.warn(`${logPrefix} RESEND_API_KEY ou RESEND_AUDIENCE_ID non configurés.`);
    console.log(`${logPrefix} Désinscription (mode dev):`, email);
    return true;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.contacts.update({ email, audienceId, unsubscribed: true });

  if (error) {
    console.error(`${logPrefix} Erreur Resend contacts.update:`, error);
    return false;
  }

  console.log(`${logPrefix} Désinscription effectuée ✓`, email);
  return true;
}

/**
 * Désinscription en un clic — variante GET historique, conservée pour les emails
 * de bienvenue déjà envoyés avec un lien pointant directement ici. Les nouveaux
 * emails renvoient plutôt vers la page `/newsletter/desinscription`, qui affiche
 * un petit formulaire (raison du départ) avant d'appeler POST ci-dessous.
 */
export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_CONFIG.url;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL(`/${L}/newsletter/erreur?raison=manquant`, siteUrl));
  }

  const result = verifyToken(token, 'unsubscribe');
  if (!result.valid || !result.email) {
    const raison = result.reason === 'expired' ? 'expire' : 'invalide';
    return NextResponse.redirect(new URL(`/${L}/newsletter/erreur?raison=${raison}`, siteUrl));
  }

  const email = result.email;

  await prisma.newsletterSubscriber.updateMany({
    where: { email },
    data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() },
  });

  const resendOk = await unsubscribeFromResend(email, '[newsletter/unsubscribe]');
  if (!resendOk) {
    return NextResponse.redirect(new URL(`/${L}/newsletter/erreur?raison=serveur`, siteUrl));
  }

  return NextResponse.redirect(new URL(`/${L}/newsletter/desinscrit`, siteUrl));
}

/**
 * Désinscription avec message optionnel — appelée par le formulaire de la page
 * `/newsletter/desinscription`. Le jeton est le même (usage `unsubscribe`) que
 * celui du lien historique ci-dessus.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === 'string' ? body.token : undefined;
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!token) {
    return NextResponse.json({ error: 'Jeton manquant.' }, { status: 400 });
  }

  const result = verifyToken(token, 'unsubscribe');
  if (!result.valid || !result.email) {
    return NextResponse.json(
      { error: result.reason === 'expired' ? 'Ce lien a expiré.' : 'Ce lien est invalide.' },
      { status: 400 }
    );
  }

  const email = result.email;

  await prisma.newsletterSubscriber.updateMany({
    where: { email },
    data: {
      status: 'UNSUBSCRIBED',
      unsubscribedAt: new Date(),
      unsubscribeReason: message ? message.slice(0, UNSUBSCRIBE_REASON_MAX_LENGTH) : null,
    },
  });

  const resendOk = await unsubscribeFromResend(email, '[newsletter/unsubscribe]');
  if (!resendOk) {
    return NextResponse.json({ error: 'Erreur serveur. Réessayez plus tard.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
