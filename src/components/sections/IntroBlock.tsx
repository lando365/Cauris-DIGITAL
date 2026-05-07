import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

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
                CAURIS DIGITAL propulse les projets d&apos;innovation technologique à fort potentiel,
                en mettant au service des entrepreneurs un écosystème complet de ressources,
                d&apos;outils, de formations et de connexions — pour les accompagner de la
                conceptualisation jusqu&apos;à la commercialisation de leur produit.
              </p>
              <p>
                Notre incubateur opère depuis Yaoundé, capitale économique et technologique du
                Cameroun, avec un ancrage profond dans les réalités africaines. Grâce à notre
                programme de mentorat entièrement accessible en ligne, nous accompagnons des
                porteurs de projets dans toute l&apos;Afrique francophone, en Europe et au-delà.
                La géographie n&apos;est plus un obstacle à l&apos;excellence.
              </p>
              <p className="font-medium text-cauris-black">
                Nous croyons que l&apos;Afrique n&apos;a pas besoin d&apos;importer l&apos;innovation.
                Elle la fabrique, ici, maintenant, avec ses propres codes, ses propres marchés et
                ses propres solutions.
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-card overflow-hidden shadow-card bg-cauris-orange/10">
                    <img
                      src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&q=80"
                      alt="Entrepreneure africaine en pitch"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="aspect-square rounded-card overflow-hidden shadow-card bg-cauris-cream">
                    <img
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
                      alt="Session de mentorat"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-square rounded-card overflow-hidden shadow-card bg-cauris-black">
                    <img
                      src="https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&q=80"
                      alt="Coworking moderne"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-card overflow-hidden shadow-card bg-cauris-orange">
                    <img
                      src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80"
                      alt="Tableau blanc workshop"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-card shadow-card-hover px-5 py-4 border border-gray-100 max-w-[200px]">
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
