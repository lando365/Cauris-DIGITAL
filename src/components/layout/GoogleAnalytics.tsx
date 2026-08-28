'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useHasMounted } from '@/lib/hooks/useHasMounted';

/**
 * Google Analytics 4 — RGPD-compliant.
 *
 * Le tracker n'est chargé que SI l'utilisateur a explicitement accepté les
 * cookies via le bandeau (CookieBanner.tsx → localStorage).
 *
 * Émission d'événements :
 *  - `page_view` à chaque changement de route (Next.js SPA navigation)
 *  - Tous les events GA4 standards
 *
 * Configuration .env.local / Vercel :
 *  - NEXT_PUBLIC_GA_MEASUREMENT_ID  (ex: G-XXXXXXXXXX)
 *
 * Si la variable est absente, le composant rend null (mode dev sans GA).
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = 'cauris-cookie-consent';

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // État local : consentement utilisateur. Lu depuis localStorage au montage.
  const [hasConsent, setHasConsent] = useState(false);
  const mounted = useHasMounted();

  // Au montage côté client : lire le consentement actuel
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture ponctuelle d'un système externe (localStorage) au montage, pas d'état dérivé
      setHasConsent(stored === 'accepted');
    } catch {
      // localStorage inaccessible (mode privé strict) → on n'active pas GA
    }
  }, []);

  // Écoute les changements de consentement (event custom émis par CookieBanner)
  useEffect(() => {
    const onConsentChange = (e: Event) => {
      const ce = e as CustomEvent<{ consent: 'accepted' | 'refused' }>;
      setHasConsent(ce.detail.consent === 'accepted');
    };
    window.addEventListener('cauris-cookie-consent', onConsentChange);
    return () => window.removeEventListener('cauris-cookie-consent', onConsentChange);
  }, []);

  // Tracking des changements de route (Next.js App Router → SPA navigation)
  useEffect(() => {
    if (!hasConsent || !measurementId || !window.gtag) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    window.gtag('event', 'page_view', {
      page_path: url,
      page_location: window.location.origin + url,
    });
  }, [pathname, searchParams, hasConsent, measurementId]);

  // Pas de measurement ID configuré → on ne fait rien (mode dev)
  if (!measurementId) return null;

  // Pas hydraté ou pas de consentement → on ne charge pas le script
  if (!mounted || !hasConsent) return null;

  return (
    <>
      {/* Script principal gtag.js — lazyOnload pour ne pas bloquer le rendu
          (chargé pendant le browser idle, après que tout est interactif) */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      {/* Initialisation gtag — même stratégie */}
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  );
}
