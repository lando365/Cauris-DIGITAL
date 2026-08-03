'use client';

import Script from 'next/script';
import { usePathname } from '@/i18n/navigation';

/**
 * Charge le SDK Google reCAPTCHA v3 — UNIQUEMENT sur les pages qui en ont besoin.
 *
 * Optimisation Lighthouse : reCAPTCHA pèse ~120 KB de JS bloquant. Inutile de le
 * charger sur les pages sans formulaire (homepage, articles, etc.) — on le limite
 * aux routes qui contiennent un formulaire protégé (actuellement /contact).
 *
 * Si NEXT_PUBLIC_RECAPTCHA_SITE_KEY n'est pas configurée, le composant ne fait rien.
 */

// Routes qui contiennent un formulaire protégé par reCAPTCHA.
// Ajouter ici toute nouvelle route qui utilise useRecaptcha().
const RECAPTCHA_ROUTES = ['/contact'];

export default function RecaptchaScript() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const pathname = usePathname();

  if (!siteKey) return null;

  // On charge le script uniquement si l'utilisateur est sur une page concernée
  const shouldLoad = RECAPTCHA_ROUTES.some((route) => pathname?.startsWith(route));
  if (!shouldLoad) return null;

  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
      strategy="lazyOnload"
    />
  );
}
