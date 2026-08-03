import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import RecaptchaScript from '@/components/layout/RecaptchaScript';
import GoogleAnalytics from '@/components/layout/GoogleAnalytics';

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caurisdigital.org'),
  title: {
    default: 'CAURIS DIGITAL — Incubateur numérique d\'excellence en Afrique francophone',
    template: '%s | CAURIS DIGITAL',
  },
  description:
    'CAURIS DIGITAL stimule l\'entrepreneuriat tech et forme les entrepreneurs numériques de demain en Afrique francophone. Programmes d\'incubation et d\'accélération pour startups.',
  keywords: [
    'incubateur',
    'startup',
    'Afrique francophone',
    'tech',
    'innovation',
    'Cameroun',
    'CEMAC',
    'accélération',
    'entrepreneuriat',
  ],
  authors: [{ name: 'CAURIS DIGITAL' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://caurisdigital.org',
    siteName: 'CAURIS DIGITAL',
    title: 'CAURIS DIGITAL — Incubateur numérique d\'excellence',
    description:
      'Où l\'innovation numérique africaine prend son essor. Programmes d\'incubation et d\'accélération.',
    // L'image OG est générée dynamiquement par src/app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAURIS DIGITAL',
    description: 'Incubateur numérique d\'excellence en Afrique francophone.',
    // L'image Twitter est générée dynamiquement par src/app/twitter-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Récupère la locale et les messages côté serveur (next-intl)
  const locale = await getLocale();
  const messages = await getMessages();

  // Texte du skip-link traduit selon la langue (depuis le namespace Common)
  const skipLinkText = locale === 'en' ? 'Skip to main content' : 'Aller au contenu principal';

  return (
    <html lang={locale} className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        {/* Preconnect aux domaines externes pour réduire la latence */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-cauris-orange focus:text-white focus:px-4 focus:py-2 focus:rounded-btn"
          >
            {skipLinkText}
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <RecaptchaScript />
          {/* Suspense requis car GoogleAnalytics utilise useSearchParams (Next.js 14) */}
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
