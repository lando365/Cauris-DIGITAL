import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SITE_CONFIG } from '@/lib/constants';
import { verifyToken } from '@/lib/newsletter-token';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { prisma } from '@/lib/prisma';

// Les emails sont envoyés hors contexte de requête (pas de locale "courante") :
// on utilise toujours la langue par défaut pour les liens (CDC §6.6).
const L = DEFAULT_LOCALE;

/**
 * Désinscription en un clic (CDC §6.5 — « la gestion des désabonnements est
 * automatique via le prestataire »). Lien inclus dans l'email de bienvenue.
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

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.warn('[newsletter/unsubscribe] RESEND_API_KEY ou RESEND_AUDIENCE_ID non configurés.');
    console.log('[newsletter/unsubscribe] Désinscription (mode dev):', email);
    return NextResponse.redirect(new URL(`/${L}/newsletter/desinscrit`, siteUrl));
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.contacts.update({
    email,
    audienceId,
    unsubscribed: true,
  });

  if (error) {
    console.error('[newsletter/unsubscribe] Erreur Resend contacts.update:', error);
    return NextResponse.redirect(new URL(`/${L}/newsletter/erreur?raison=serveur`, siteUrl));
  }

  console.log('[newsletter/unsubscribe] Désinscription effectuée ✓', email);
  return NextResponse.redirect(new URL(`/${L}/newsletter/desinscrit`, siteUrl));
}
