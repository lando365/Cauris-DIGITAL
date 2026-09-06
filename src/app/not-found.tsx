'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * 404 racine — seul filet de sécurité pour une URL qui ne correspond à
 * aucune route du tout (faute de frappe, lien mort jamais créé), y compris
 * en dehors du segment [locale] où vit src/app/[locale]/not-found.tsx
 * (celui-ci ne se déclenche que via un notFound() explicite dans une page
 * déjà reconnue, ex. un slug de startup inexistant).
 *
 * Next.js rend cette page sans jamais passer par [locale]/layout.tsx, donc
 * sans le NextIntlClientProvider ni le setRequestLocale() qui l'accompagne :
 * les hooks/fonctions next-intl (getTranslations, useTranslations) lèvent
 * "No intl context found" ici. On détecte donc la langue nous-mêmes à partir
 * du chemin, avec un texte bilingue minimal en dur.
 */
const TEXT = {
  fr: {
    title: "Cette page n'existe pas",
    description: "La page que vous cherchez a peut-être été déplacée ou n'existe plus.",
    backHome: "Retour à l'accueil",
    contactUs: 'Nous contacter',
  },
  en: {
    title: "This page doesn't exist",
    description: "The page you're looking for may have been moved or no longer exists.",
    backHome: 'Back to home',
    contactUs: 'Contact us',
  },
} as const;

export default function GlobalNotFound() {
  const pathname = usePathname();
  const locale = pathname?.startsWith('/en') ? 'en' : 'fr';
  const t = TEXT[locale];

  return (
    <section className="min-h-[80vh] flex items-center pt-32 pb-20">
      <div className="container-cauris text-center">
        <p className="font-heading font-extrabold text-[120px] sm:text-[180px] leading-none text-gradient-orange">
          404
        </p>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cauris-black mb-4">
          {t.title}
        </h1>
        <p className="text-cauris-gray-text max-w-md mx-auto mb-8">{t.description}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={`/${locale}`} className="btn-primary">
            {t.backHome}
          </Link>
          <Link href={`/${locale}/contact`} className="btn-secondary">
            {t.contactUs}
          </Link>
        </div>
      </div>
    </section>
  );
}
