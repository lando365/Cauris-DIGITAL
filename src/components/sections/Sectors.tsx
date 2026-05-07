import { Sprout, Banknote, GraduationCap, HeartPulse, Building2 } from 'lucide-react';
import { SECTORS } from '@/lib/constants';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';

const ICONS = {
  Sprout,
  Banknote,
  GraduationCap,
  HeartPulse,
  Building2,
} as const;

/**
 * Secteurs d'activité (Textes_Site_v1 — 5 secteurs).
 */
export default function Sectors() {
  return (
    <section className="section bg-cauris-gray-bg">
      <div className="container-cauris">
        <SectionTitle
          eyebrow="Nos secteurs d'activité"
          title="Nous accompagnons les solutions à fort impact"
          description="CAURIS DIGITAL s'intéresse aux projets technologiques qui répondent à des enjeux concrets du continent africain. Nous sélectionnons des startups à fort potentiel de croissance et d'impact social."
        />

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SECTORS.map((sector, i) => {
            const Icon = ICONS[sector.icon as keyof typeof ICONS];
            return (
              <Reveal key={sector.id} delay={i * 100}>
                <article className="card group p-7 lg:p-8 h-full bg-white border border-gray-100">
                  <div className="w-14 h-14 rounded-xl bg-cauris-orange/10 group-hover:bg-cauris-orange flex items-center justify-center mb-5 transition-colors">
                    <Icon
                      className="w-7 h-7 text-cauris-orange group-hover:text-white transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-cauris-black mb-3">
                    {sector.title}
                  </h3>
                  <p className="text-sm text-cauris-gray-text leading-relaxed mb-5">
                    {sector.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sector.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-cauris-cream text-cauris-orange"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
