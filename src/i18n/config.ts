/**
 * Configuration centrale du multilingue.
 *
 * Mode : "sans routing i18n" — la langue est stockée dans un cookie
 * et lue côté serveur. Les URLs ne changent pas (pas de /fr/ ou /en/).
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

export const LOCALE_COOKIE_NAME = 'cauris-locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an

/**
 * Vérifie qu'une chaîne est une locale supportée.
 */
export function isValidLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
