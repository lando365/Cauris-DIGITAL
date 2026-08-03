import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isValidLocale, type Locale } from './config';

/**
 * Configuration server-side de next-intl.
 *
 * Détermine la langue active à utiliser pour le SSR, par ordre de priorité :
 *  1. Cookie utilisateur (s'il a explicitement choisi via le LanguageSwitcher)
 *  2. Header Accept-Language du navigateur
 *  3. Locale par défaut (français)
 *
 * Charge ensuite le fichier de traduction correspondant.
 */
export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  const messages = (await import(`./messages/${locale}.json`)).default;
  return { locale, messages };
});

/**
 * Détermine la locale active depuis cookies / headers.
 * Helper utilisable aussi depuis des Server Components.
 */
export async function resolveLocale(): Promise<Locale> {
  // 1. Cookie utilisateur (choix explicite)
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  if (isValidLocale(cookieValue)) {
    return cookieValue;
  }

  // 2. Accept-Language du navigateur
  try {
    const headersList = headers();
    const acceptLanguage = headersList.get('accept-language') ?? '';
    const preferred = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase().slice(0, 2));
    for (const lang of preferred) {
      if (isValidLocale(lang)) {
        return lang;
      }
    }
  } catch {
    // headers() peut throw dans certains contextes — on tombe sur le default
  }

  // 3. Fallback
  return DEFAULT_LOCALE;
}
