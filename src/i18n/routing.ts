import { defineRouting } from 'next-intl/routing';
import { LOCALES, DEFAULT_LOCALE } from './config';

/**
 * Configuration du routing i18n (CDC §6.6 — URLs /fr/ et /en/).
 *
 * `localePrefix: 'always'` : les deux langues sont toujours préfixées
 * (/fr/a-propos, /en/a-propos), y compris la langue par défaut — le CDC
 * demande explicitement les deux préfixes de manière symétrique.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
});
