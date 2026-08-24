import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { BRAND_IMAGES } from '@/lib/constants';

/**
 * Bloc présentation (CDC §2.1).
 */
export default function IntroBlock() {
  return (
    <section className="section bg-cauris-cream/40">
      <div className="container-cauris">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Notre raison d&apos;être
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-cauris-black mb-6">
              Épicentre d&apos;innovations numériques au cœur de l&apos;Afrique francophone
            </h2>
            <div className="space-y-4 text-cauris-gray-text leading-relaxed">
              <p>
                CAURIS DIGITAL propulse les projets d&apos;innovation technologique à fort
                potentiel, en mettant au service des entrepreneurs un écosystème complet de
                ressources, d&apos;outils, de formations et de connexions — pour les accompagner de
                la conceptualisation jusqu&apos;à la commercialisation de leur produit.
              </p>
              <p>
                Notre incubateur opère depuis Yaoundé, capitale économique et technologique du
                Cameroun, avec un ancrage profond dans les réalités africaines. Grâce à notre
                programme de mentorat entièrement accessible en ligne, nous accompagnons des
                porteurs de projets dans toute l&apos;Afrique francophone, en Europe et au-delà. La
                géographie n&apos;est plus un obstacle à l&apos;excellence.
              </p>
              <p className="font-medium text-cauris-black">
                Nous croyons que l&apos;Afrique n&apos;a pas besoin d&apos;importer
                l&apos;innovation. Elle la fabrique, ici, maintenant, avec ses propres codes, ses
                propres marchés et ses propres solutions.
              </p>
            </div>
            <div className="mt-8">
              <Button href="/a-propos" variant="secondary">
                Découvrir CAURIS DIGITAL
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative aspect-[3/4] rounded-card overflow-hidden shadow-card bg-cauris-orange/10">
                    <Image
                      src={BRAND_IMAGES.introPitch}
                      alt="Entrepreneure africaine présentant son pitch"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square rounded-card overflow-hidden shadow-card bg-cauris-cream">
                    <Image
                      src={BRAND_IMAGES.introMentoring}
                      alt="Session de mentorat avec une entrepreneure africaine"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                {/* Décalage uniquement sur sm+ pour l'effet mosaïque, droit sur mobile */}
                <div className="space-y-3 sm:space-y-4 sm:pt-12">
                  <div className="relative aspect-square rounded-card overflow-hidden shadow-card bg-cauris-black">
                    <Image
                      src={BRAND_IMAGES.introCoworking}
                      alt="Atelier collectif au sein de l'écosystème CAURIS DIGITAL"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[3/4] rounded-card overflow-hidden shadow-card bg-cauris-orange">
                    <Image
                      src={BRAND_IMAGES.introWorkshop}
                      alt="Entrepreneurs africains en session de travail collaboratif"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Badge +80 — inline sous la mosaïque sur mobile, en superposition sur sm+ */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-4 sm:-left-4 bg-white rounded-card shadow-card-hover px-5 py-4 border border-gray-100 max-w-full sm:max-w-[200px] flex items-baseline sm:block gap-3">
                <p className="text-2xl font-heading font-bold text-cauris-orange">+80</p>
                <p className="text-xs text-cauris-gray-secondary">startups accompagnées par an</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
