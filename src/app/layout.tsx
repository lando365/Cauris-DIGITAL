import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';

/**
 * Layout racine minimal — obligatoire pour Next.js (un seul <html>/<body>
 * dans toute l'app), mais tout le contenu réel (Header, Footer, provider
 * next-intl, etc.) vit dans src/app/[locale]/layout.tsx, imbriqué ici.
 *
 * `getLocale()` fonctionne même à ce niveau (au-dessus du segment [locale])
 * car le middleware a déjà résolu la locale pour toute la requête — on
 * l'utilise pour que <html lang> reflète toujours la vraie langue affichée,
 * pas seulement la langue par défaut (WCAG 3.1.1).
 *
 * `metadataBase` est redéfini ici (en plus de [locale]/layout.tsx) car
 * opengraph-image.tsx/twitter-image.tsx vivent au même niveau que ce fichier,
 * pas sous [locale] — sans ça, Next résout leurs URLs vers localhost en prod.
 */

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caurisdigital.org'),
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        {/* Preconnect aux domaines externes pour réduire la latence */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">{children}</body>
    </html>
  );
}
