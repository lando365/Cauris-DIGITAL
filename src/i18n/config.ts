/**
 * Configuration centrale du multilingue.
 *
 * Mode : routing i18n avec préfixe d'URL (/fr/, /en/ — CDC §6.6).
 * La locale vient du segment d'URL [locale], résolu par le middleware
 * (voir src/middleware.ts et src/i18n/routing.ts).
 *
 * Pour ajouter une langue :
 *  1. Ajouter le code à `LOCALES`
 *  2. Créer le fichier `messages/[code].json`
 *  3. Ajouter le label dans `LOCALE_LABELS`
 */

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export const LOCALE_LABELS: Record<Locale, { native: string; short: string; flag: string }> = {
  fr: { native: 'Français', short: 'FR', flag: '🇫🇷' },
  en: { native: 'English', short: 'EN', flag: '🇬🇧' },
};
