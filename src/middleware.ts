import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclut /api, les internes Next.js, les routes d'images de métadonnées
  // (opengraph-image, twitter-image) et tout chemin avec une extension de
  // fichier (icon.png, sitemap.xml, robots.txt, etc.).
  matcher: ['/((?!api|_next|_vercel|opengraph-image|twitter-image|.*\\..*).*)'],
};
