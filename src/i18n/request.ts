import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import type { Locale } from './config';

/**
 * Configuration server-side de next-intl (mode routing — CDC §6.6).
 *
 * La locale vient désormais du segment d'URL [locale] (résolu par le
 * middleware), pas d'un cookie ou de l'en-tête Accept-Language.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = routing.locales.includes(requested as Locale)
    ? (requested as Locale)
    : routing.defaultLocale;

  const messages = (await import(`./messages/${locale}.json`)).default;
  return { locale, messages };
});
