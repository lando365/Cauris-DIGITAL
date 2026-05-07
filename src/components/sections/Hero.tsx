import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';
import Button from '@/components/ui/Button';

/**
 * Hero homepage (CDC §2.1).
 * H1, sous-titre, CTA principal, image de fond plein écran.
 */
export default function Hero() {
  return (
    <section className="relative min-h-[88vh] lg:min-h-[92vh] flex items-center pt-16 lg:pt-20 overflow-hidden bg-cauris-black">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80"
          alt="Entrepreneurs africains au travail dans un espace de coworking moderne"
          fill
          priority
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
            Candidatures ouvertes — Promo 2026
          </span>

          <h1 className="font-heading font-extrabold text-white text-4xl sm:text-5xl lg:text-7xl leading-[1.05] mb-6">
            Où l&apos;innovation numérique{' '}
            <span className="text-gradient-orange">africaine</span>{' '}
            prend son essor
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed max-w-2xl mb-10">
            CAURIS DIGITAL stimule l&apos;entrepreneuriat tech et forme les entrepreneurs numériques de demain.
            Basé à Yaoundé, actif partout dans le monde.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button href="/contact?objet=candidature" size="lg">
              Déposer ma candidature
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              href="#programmes"
              variant="secondary"
              size="lg"
              className="text-white border-white/40 hover:bg-white hover:text-cauris-black"
            >
              <Play className="w-4 h-4" />
              Découvrir nos programmes
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
