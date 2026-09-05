import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { mapPartner } from '@/lib/content-mappers';

/**
 * Bande de logos partenaires (CDC §2.1). Priorité aux partenaires marqués
 * "isFeatured" dans l'admin, complétés si besoin pour ne jamais afficher une
 * bande vide. Défilement marquee automatique.
 */
export default async function PartnerStrip() {
  const t = await getTranslations('PartnerStrip');
  const featuredRecords = await prisma.partner.findMany({
    where: { isFeatured: true },
    orderBy: { displayOrder: 'asc' },
    take: 6,
  });
  let records = featuredRecords;
  if (records.length < 6) {
    const fillers = await prisma.partner.findMany({
      where: { isFeatured: false },
      orderBy: { displayOrder: 'asc' },
      take: 6 - records.length,
    });
    records = [...records, ...fillers];
  }
  const partners = records.map(mapPartner);
  // On double la liste pour la marquee continue (boucle infinie sans saut)
  const logos = [...partners, ...partners];

  return (
    <section
      className="py-10 lg:py-12 bg-white border-y border-gray-100"
      aria-label={t('ariaLabel')}
    >
      <div className="container-cauris mb-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-cauris-gray-secondary">
          {t('trustedBy')}
        </p>
      </div>
      <div className="mask-fade-x overflow-hidden">
        <div className="flex items-center gap-12 lg:gap-16 animate-marquee min-w-max">
          {logos.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="relative flex items-center justify-center min-w-[140px] h-14 lg:h-16 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all"
              title={partner.name}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={64}
                className="max-h-full max-w-[140px] object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
