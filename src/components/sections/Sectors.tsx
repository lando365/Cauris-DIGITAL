import { getTranslations } from 'next-intl/server';
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
export default async function Sectors() {
  const t = await getTranslations('Sectors');
  const tData = await getTranslations('SectorsData');
  return (
    <section className="section bg-cauris-gray-bg">
      <div className="container-cauris">
        <SectionTitle
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SECTORS.map((sector, i) => {
            const Icon = ICONS[sector.icon as keyof typeof ICONS];
            const data = tData.raw(sector.id) as {
              title: string;
              description: string;
              tags: string[];
            };
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
                    {data.title}
                  </h3>
                  <p className="text-sm text-cauris-gray-text leading-relaxed mb-5">
                    {data.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.tags.map((tag) => (
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
