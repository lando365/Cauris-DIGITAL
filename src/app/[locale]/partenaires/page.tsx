import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  ExternalLink,
  Building2,
  Banknote,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Reveal from '@/components/ui/Reveal';
import { PARTNER_CATEGORIES, type PartnerLogo } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import { mapPartner } from '@/lib/content-mappers';
import type { PartnerCategory } from '@prisma/client';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('PartnersPage');
  return { title: t('metaTitle'), description: t('metaDescription') };
}

// CDC V2 §4.3.1 : liste publique en cache ISR (revalidate 60s).
export const revalidate = 60;

const CATEGORY_ICONS = {
  institutionnels: Building2,
  financiers: Banknote,
  academiques: GraduationCap,
  corporatifs: Briefcase,
} as const;

const CATEGORY_ID_TO_PRISMA: Record<string, PartnerCategory> = {
  institutionnels: 'INSTITUTIONNEL',
  financiers: 'FINANCIER',
  academiques: 'ACADEMIQUE',
  corporatifs: 'CORPORATIF',
};

export default async function PartnersPage() {
  const t = await getTranslations('PartnersPage');
  const tCategories = await getTranslations('PartnerCategoriesData');
  const records = await prisma.partner.findMany({ orderBy: { displayOrder: 'asc' } });
  const mapped = records.map((p) => ({ ...mapPartner(p), category: p.category }));
  const PARTNERS_BY_CATEGORY: Record<string, PartnerLogo[]> = {};
  for (const id of Object.keys(CATEGORY_ID_TO_PRISMA)) {
    PARTNERS_BY_CATEGORY[id] = mapped.filter((p) => p.category === CATEGORY_ID_TO_PRISMA[id]);
  }

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
          </div>
        </div>
      </section>

      {/* 4 catégories de partenaires */}
      {PARTNER_CATEGORIES.map((category, catIdx) => {
        const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS];
        const partners = PARTNERS_BY_CATEGORY[category.id] || [];
        const isAlt = catIdx % 2 === 1;
        const data = tCategories.raw(category.id) as { title: string; description: string };
        return (
          <section
            key={category.id}
            id={category.id}
            className={`section scroll-mt-24 ${isAlt ? 'bg-cauris-gray-bg' : 'bg-white'}`}
          >
            <div className="container-cauris">
              <div className="grid lg:grid-cols-3 gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
                <Reveal className="lg:col-span-1">
                  <div className="w-14 h-14 rounded-xl bg-cauris-orange/10 text-cauris-orange flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cauris-orange mb-2">
                    {t('categoryLabel', { n: catIdx + 1 })}
                  </p>
                  <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4">
                    {data.title}
                  </h2>
                  <p className="text-cauris-gray-text leading-relaxed">{data.description}</p>
                </Reveal>

                <Reveal delay={150} className="lg:col-span-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {partners.map((partner) => {
                      const inner = (
                        <div className="relative w-full h-20 flex items-center justify-center">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={180}
                            height={80}
                            className="max-h-16 max-w-full object-contain transition-transform group-hover:scale-105"
                            unoptimized
                          />
                        </div>
                      );
                      return (
                        <div
                          key={partner.name}
                          className="card bg-white p-5 border border-gray-100 flex flex-col items-center justify-center min-h-[140px] text-center hover:border-cauris-orange/30 transition-colors group"
                          title={partner.name}
                        >
                          {partner.url ? (
                            <a
                              href={partner.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full"
                              aria-label={t('visitSite', { name: partner.name })}
                            >
                              {inner}
                              <span className="inline-flex items-center gap-1 mt-3 text-[11px] text-cauris-gray-secondary group-hover:text-cauris-orange transition-colors">
                                {partner.name}
                                <ExternalLink
                                  className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                  aria-hidden="true"
                                />
                              </span>
                            </a>
                          ) : (
                            <>
                              {inner}
                              <span className="mt-3 text-[11px] text-cauris-gray-secondary">
                                {partner.name}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA devenir partenaire */}
      <section className="relative py-20 lg:py-section-lg bg-cauris-orange overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container-cauris relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed">{t('ctaText')}</p>
            <Link
              href="/contact?objet=partenariat-corporate"
              className="inline-flex items-center gap-2 rounded-btn bg-white px-8 py-4 text-base font-semibold uppercase tracking-wide text-cauris-orange transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              {t('ctaButton')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
