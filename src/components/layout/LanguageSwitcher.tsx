'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { Globe, Check } from 'lucide-react';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/config';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * Switcher de langue FR/EN (CDC §6.6 — URLs /fr/ et /en/).
 *
 * Au clic : navigue vers l'équivalent /en/... ou /fr/... de la page courante
 * (préserve la query string, ex. /contact?objet=candidature) via le routeur
 * next-intl, sans rechargement complet de page.
 *
 * Deux variantes d'affichage :
 *  - `inline` (par défaut) : juste `FR | EN` minimal pour le Header desktop
 *  - `dropdown` : menu déroulant complet avec drapeaux pour mobile
 */
interface Props {
  variant?: 'inline' | 'dropdown';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'inline', className }: Props) {
  const t = useTranslations('LanguageSwitcher');
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const switchTo = (newLocale: Locale) => {
    if (newLocale === currentLocale || isPending) return;

    startTransition(() => {
      // Lu au clic (pas via useSearchParams) pour ne pas exiger de limite
      // Suspense ici — Header/LanguageSwitcher sont rendus sur toutes les
      // pages, y compris celles générées statiquement (SSG).
      // window.location.search inclut déjà le "?" s'il y a des paramètres
      const query = typeof window !== 'undefined' ? window.location.search : '';
      router.replace(`${pathname}${query}`, { locale: newLocale });
    });
  };

  // ============ Variante INLINE (Header desktop) ============
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 text-xs font-semibold',
          isPending && 'opacity-60 pointer-events-none',
          className
        )}
        role="group"
        aria-label={t('label')}
      >
        {LOCALES.map((locale, i) => {
          const isActive = locale === currentLocale;
          return (
            <span key={locale} className="contents">
              {i > 0 && (
                <span className="text-cauris-gray-secondary/40 mx-1" aria-hidden="true">
                  |
                </span>
              )}
              <button
                type="button"
                onClick={() => switchTo(locale)}
                disabled={isActive || isPending}
                aria-current={isActive ? 'true' : undefined}
                aria-label={
                  isActive
                    ? t('currentLanguage', { lang: LOCALE_LABELS[locale].native })
                    : t('switchTo', { lang: LOCALE_LABELS[locale].native })
                }
                className={cn(
                  'px-1.5 py-1 rounded transition-colors uppercase tracking-wider',
                  isActive
                    ? 'text-cauris-orange cursor-default'
                    : 'text-cauris-gray-secondary hover:text-cauris-orange cursor-pointer'
                )}
              >
                {LOCALE_LABELS[locale].short}
              </button>
            </span>
          );
        })}
      </div>
    );
  }

  // ============ Variante DROPDOWN (mobile / menu burger) ============
  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-btn border border-gray-200 text-sm text-cauris-gray-text hover:border-cauris-orange transition-colors"
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        {/* Pas de aria-label sur le bouton : le texte visible ("FR"/"EN") doit
            faire partie du nom accessible (WCAG 2.5.3). Ce préfixe sr-only
            donne le contexte sans dupliquer/contredire le texte affiché. */}
        <span className="sr-only">{t('label')}:</span>
        <span>{LOCALE_LABELS[currentLocale].short}</span>
        <span aria-hidden="true">{LOCALE_LABELS[currentLocale].flag}</span>
      </button>

      {open && (
        <>
          {/* Backdrop pour fermer au clic extérieur */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul
            role="listbox"
            aria-label={t('label')}
            className="absolute right-0 top-full mt-2 z-50 min-w-[160px] bg-white rounded-card shadow-card-hover border border-gray-100 py-2"
          >
            {LOCALES.map((locale) => {
              const isActive = locale === currentLocale;
              return (
                <li key={locale} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      switchTo(locale);
                    }}
                    disabled={isActive || isPending}
                    className={cn(
                      'w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                      isActive
                        ? 'text-cauris-orange font-semibold bg-cauris-cream cursor-default'
                        : 'text-cauris-gray-text hover:bg-cauris-cream/50'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true">{LOCALE_LABELS[locale].flag}</span>
                      {LOCALE_LABELS[locale].native}
                    </span>
                    {isActive && (
                      <Check className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
