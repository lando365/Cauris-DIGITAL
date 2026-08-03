import { NextResponse } from 'next/server';
import {
  LOCALE_COOKIE_NAME,
  LOCALE_COOKIE_MAX_AGE,
  isValidLocale,
} from '@/i18n/config';

/**
 * Route pour persister le choix de langue de l'utilisateur.
 *
 * Appelée depuis LanguageSwitcher.tsx :
 *   POST /api/locale  { locale: 'fr' | 'en' }
 *
 * Définit le cookie `cauris-locale` avec une durée d'un an,
 * puis le composant client recharge la page pour appliquer la nouvelle langue.
 */
export async function POST(request: Request) {
  try {
    const { locale } = await request.json();

    if (!isValidLocale(locale)) {
      return NextResponse.json(
        { error: 'Locale invalide. Valeurs supportées : fr, en' },
        { status: 400 },
      );
    }

    const res = NextResponse.json({ success: true, locale });
    res.cookies.set(LOCALE_COOKIE_NAME, locale, {
      maxAge: LOCALE_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      httpOnly: false, // accessible côté client si besoin de relire
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}
