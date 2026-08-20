import NextAuth from 'next-auth';
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { authConfig } from './auth.config';

const intlMiddleware = createMiddleware(routing);

// Instance NextAuth dédiée au middleware, construite UNIQUEMENT à partir de
// auth.config.ts (aucun provider, aucune dépendance Node) — voir le commentaire
// dans auth.ts pour pourquoi src/auth.ts ne peut pas être importé ici.
const { auth } = NextAuth(authConfig);

// /admin est hors du routing [locale] (CDC V2 §8.1 : URL /admin, pas /fr/admin).
// Ici on ne fait qu'un contrôle rapide de présence du JWT (compatible Edge runtime,
// pas d'accès Prisma/DB possible ici) : redirige vers /admin/login si absent.
// Le contrôle autoritaire (session non révoquée, rôle) est fait côté serveur par
// requireAdminUser() — voir src/lib/require-admin.ts.
async function adminGate(req: NextRequest) {
  if (req.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = await auth();
  if (!session?.user) {
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return adminGate(req);
  }
  return intlMiddleware(req);
}

export const config = {
  // Exclut /api, les internes Next.js, les routes d'images de métadonnées
  // (opengraph-image, twitter-image) et tout chemin avec une extension de
  // fichier (icon.png, sitemap.xml, robots.txt, etc.).
  matcher: ['/((?!api|_next|_vercel|opengraph-image|twitter-image|.*\\..*).*)'],
};
