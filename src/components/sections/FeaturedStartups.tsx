import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import { prisma } from '@/lib/prisma';
import { mapStartup } from '@/lib/content-mappers';

/**
 * Startups vedettes (CDC §2.1). Celles marquées "isFeatured" dans l'admin
 * (bouton "Mettre en avant sur la page d'accueil") ; complétées par les plus
 * récentes si moins de 6 sont marquées, pour ne jamais afficher une grille vide.
 */
export default async function FeaturedStartups() {
  const t = await getTranslations('FeaturedStartups');
  const tEnum = await getTranslations('Enums');
  const featuredRecords = await prisma.startup.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  let records = featuredRecords;
  if (records.length < 6) {
    const fillers = await prisma.startup.findMany({
      where: { isFeatured: false },
      orderBy: { createdAt: 'desc' },
      take: 6 - records.length,
    });
    records = [...records, ...fillers];
  }

  const featured = records.map(mapStartup);

  return (
    <section className="section bg-white">
      <div className="container-cauris">
        <SectionTitle
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {featured.map((s, i) => {
            const statusColor =
              s.status === 'DIPLOMEE'
                ? 'bg-cauris-success/10 text-cauris-success-text'
                : s.status === 'ALUMNI'
                  ? 'bg-cauris-black/5 text-cauris-black'
                  : 'bg-cauris-orange/10 text-cauris-orange';
            return (
              <Reveal key={s.slug} delay={i * 60}>
                {/* Pas de aria-label : le nom accessible se compose déjà à
                    partir de tout le texte visible de la carte (WCAG 2.5.3) */}
                <Link
                  href={`/startups/${s.slug}`}
                  className="card group p-6 border border-gray-100 h-full flex flex-col bg-white hover:border-cauris-orange/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cauris-orange to-cauris-orange-light flex items-center justify-center text-white font-heading font-bold text-lg">
                      {s.name.charAt(0)}
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${statusColor}`}
                    >
                      {tEnum(`status.${s.status}`)}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-cauris-black mb-1 group-hover:text-cauris-orange transition-colors">
                    {s.name} <span className="text-base">{s.country}</span>
                  </h3>
                  <p className="text-xs text-cauris-gray-secondary uppercase tracking-wider mb-3">
                    {tEnum(`sector.${s.sector}`)} · {t('cohort', { year: s.year })}
                  </p>
                  {s.tagline && (
                    <p className="text-sm text-cauris-gray-text leading-snug">{s.tagline}</p>
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button href="/startups" variant="secondary">
            {t('viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
