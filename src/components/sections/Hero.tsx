'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Play } from 'lucide-react';
import Button from '@/components/ui/Button';
import { BRAND_IMAGES } from '@/lib/constants';

/**
 * Hero homepage (CDC §2.1) — Traduit via next-intl.
 * H1, sous-titre, CTA principal, image de fond plein écran.
 */
export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative min-h-[88vh] lg:min-h-[92vh] flex items-center pt-16 lg:pt-20 overflow-hidden bg-cauris-black">
      {/* Image de fond — priority pour optimiser le LCP (Largest Contentful Paint) */}
      <div className="absolute inset-0">
        <Image
          src={BRAND_IMAGES.heroBackground}
          alt="Entrepreneurs africains au travail dans un espace de coworking moderne"
          fill
          priority
          quality={80}
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cauris-black/90 via-cauris-black/70 to-cauris-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-cauris-black/80 via-transparent to-transparent" />
      </div>

      {/* Contenu */}
      <div className="container-cauris relative z-10 py-20 lg:py-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-cauris-orange/15 border border-cauris-orange/30 text-cauris-orange text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-cauris-orange animate-pulse" />
            {t('badge')}
          </span>

          <h1 className="font-heading font-extrabold text-white text-4xl sm:text-5xl lg:text-7xl leading-[1.05] mb-6">
            {t('titleStart')}{' '}
            <span className="text-gradient-orange">{t('titleAccent')}</span>{' '}
            {t('titleEnd')}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed max-w-2xl mb-10">
            {t('subtitle')}
          </p>

          {/* CTA — sur mobile, primaire en évidence + secondaire en lien texte ; sur desktop, deux boutons côte à côte */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
            <Button
              href="/contact?objet=candidature"
              size="lg"
              className="w-full sm:w-auto justify-center"
            >
              {t('applyCTA')}
              <ArrowRight className="w-4 h-4" />
            </Button>

            {/* Mobile : lien texte discret. Desktop (sm+) : bouton secondaire complet */}
            <a
              href="#programmes"
              className="sm:hidden inline-flex items-center gap-2 self-start mt-1 px-2 py-2 text-sm text-white/85 font-medium"
            >
              <Play className="w-4 h-4 text-cauris-orange" />
              {t('discoverPrograms')}
            </a>
            <Button
              href="#programmes"
              variant="secondary"
              size="lg"
              className="hidden sm:inline-flex text-white border-white/40 hover:bg-white hover:text-cauris-black"
            >
              <Play className="w-4 h-4" />
              {t('discoverPrograms')}
            </Button>
          </div>
        </div>
      </div>

      {/* Indicateur scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
