'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Cookie, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'cauris-cookie-consent';

type Consent = 'accepted' | 'refused' | null;

/**
 * Bandeau de consentement cookies (CDC §10.2 + Textes_Site_v1).
 * Affiché à la première visite, choix mémorisé en localStorage.
 */
export default function CookieBanner() {
  const t = useTranslations('CookieBanner');
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Consent;
      if (stored === 'accepted' || stored === 'refused') {
        setConsent(stored);
      }
    } catch {
      // localStorage indisponible (mode privé strict, etc.) — on affichera le banner
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'refused') => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore
    }
    setConsent(choice);

    // Émet un event custom pour que GoogleAnalytics (et autres trackers
    // RGPD-aware) puissent réagir au changement de consentement en temps réel.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cauris-cookie-consent', { detail: { consent: choice } })
      );
    }
  };

  // Ne rien rendre tant que le composant n'a pas hydraté
  // (évite le flash et les soucis SSR/CSR mismatch)
  if (!mounted || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className={cn(
        'fixed bottom-0 inset-x-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6',
        'animate-fade-in-up'
      )}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-card shadow-card-hover border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 p-5 lg:p-6">
          <div className="shrink-0 w-12 h-12 rounded-lg bg-cauris-orange/10 text-cauris-orange flex items-center justify-center self-start">
            <Cookie className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2
              id="cookie-banner-title"
              className="font-heading font-bold text-base text-cauris-black mb-1"
            >
              {t('title')}
            </h2>
            <p id="cookie-banner-desc" className="text-sm text-cauris-gray-text leading-relaxed">
              {t('description')}{' '}
              <Link
                href="/politique-de-confidentialite#cookies"
                className="text-cauris-orange hover:underline font-medium"
              >
                {t('policyLink')}
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleChoice('accepted')}
                className="bg-cauris-orange hover:bg-cauris-orange-dark text-white px-5 py-2.5 rounded-btn text-sm font-semibold uppercase tracking-wide transition-colors"
              >
                {t('accept')}
              </button>
              <button
                type="button"
                onClick={() => handleChoice('refused')}
                className="bg-white border border-gray-200 hover:border-cauris-orange hover:text-cauris-orange text-cauris-gray-text px-5 py-2.5 rounded-btn text-sm font-semibold transition-colors"
              >
                {t('refuse')}
              </button>
              <Link
                href="/politique-de-confidentialite#cookies"
                className="text-sm text-cauris-gray-secondary hover:text-cauris-orange underline-offset-2 hover:underline"
              >
                {t('learnMore')}
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleChoice('refused')}
            aria-label={t('closeButton')}
            className="self-start p-1 text-cauris-gray-secondary hover:text-cauris-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
