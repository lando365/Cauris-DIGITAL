import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import FAQChatWidget from '@/components/layout/FAQChatWidget';
import RecaptchaScript from '@/components/layout/RecaptchaScript';
import GoogleAnalytics from '@/components/layout/GoogleAnalytics';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'RootMetadata' });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caurisdigital.org'),
    title: {
      default: t('title'),
      template: '%s | CAURIS DIGITAL',
    },
    description: t('description'),
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
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
      url: 'https://caurisdigital.org',
      siteName: 'CAURIS DIGITAL',
      title: t('ogTitle'),
      description: t('ogDescription'),
      // L'image OG est générée dynamiquement par src/app/opengraph-image.tsx
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitterTitle'),
      description: t('twitterDescription'),
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
}

/** Génère les 2 locales au build (SSG) — CDC §6.6. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Segment [locale] catch-all : toute valeur invalide (ex: fichier inconnu) → 404
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Active le rendu statique pour cette locale (recommandé par next-intl)
  setRequestLocale(locale);

  const messages = await getMessages();

  // Texte du skip-link traduit selon la langue (depuis le namespace Common)
  const skipLinkText = locale === 'en' ? 'Skip to main content' : 'Aller au contenu principal';

  return (
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
      <FAQChatWidget />
      <RecaptchaScript />
      {/* Suspense requis car GoogleAnalytics utilise useSearchParams (Next.js 14) */}
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
    </NextIntlClientProvider>
  );
}
