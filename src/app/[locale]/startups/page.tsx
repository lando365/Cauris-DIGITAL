import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import StartupsExplorer from '@/components/sections/StartupsExplorer';
import FinalCTA from '@/components/sections/FinalCTA';
import { prisma } from '@/lib/prisma';
import { mapStartup } from '@/lib/content-mappers';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('StartupsPage');
  return { title: t('metaTitle'), description: t('metaDescription') };
}

// CDC V2 §4.3.1 : liste publique en cache ISR (revalidate 60s).
export const revalidate = 60;

export default async function StartupsPage() {
  const t = await getTranslations('StartupsPage');
  const startups = await prisma.startup.findMany({ orderBy: { createdAt: 'desc' } });
  const mapped = startups.map(mapStartup);
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              {t('eyebrow')}
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cauris-black mb-6">
              {t('h1')}
            </h1>
            <p className="text-lg text-cauris-gray-text leading-relaxed">{t('heroSubtitle')}</p>
            <p className="mt-4 text-base text-cauris-gray-secondary leading-relaxed">
              {t('heroDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Explorateur (filtres + grille) */}
      <StartupsExplorer startups={mapped} />

      <FinalCTA />
    </>
  );
}
