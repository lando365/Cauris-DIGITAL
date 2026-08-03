import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Building2, Banknote, GraduationCap, Briefcase } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import {
  PARTNER_CATEGORIES,
  PARTNERS_INSTITUTIONNELS,
  PARTNERS_FINANCIERS,
  PARTNERS_ACADEMIQUES,
  PARTNERS_CORPORATIFS,
  type PartnerLogo,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Nos partenaires — CAURIS DIGITAL | Écosystème tech africain',
  description:
    'Découvrez les partenaires institutionnels, financiers, académiques et corporatifs qui soutiennent la mission de CAURIS DIGITAL en Afrique francophone.',
};

const PARTNERS_BY_CATEGORY: Record<string, PartnerLogo[]> = {
  institutionnels: PARTNERS_INSTITUTIONNELS,
  financiers: PARTNERS_FINANCIERS,
  academiques: PARTNERS_ACADEMIQUES,
  corporatifs: PARTNERS_CORPORATIFS,
};

const CATEGORY_ICONS = {
  institutionnels: Building2,
  financiers: Banknote,
  academiques: GraduationCap,
  corporatifs: Briefcase,
} as const;

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Notre écosystème
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cauris-black mb-6">
              Nos partenaires
            </h1>
            <p className="text-lg text-cauris-gray-text leading-relaxed">
              CAURIS DIGITAL ne travaille pas seul. Notre force, c&apos;est notre réseau.
              Institutions, universités, entreprises, fonds d&apos;investissement et organisations
              internationales — ensemble, nous construisons l&apos;écosystème tech africain de
              demain.
            </p>
          </div>
        </div>
      </section>

      {/* 4 catégories de partenaires */}
      {PARTNER_CATEGORIES.map((category, catIdx) => {
        const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS];
        const partners = PARTNERS_BY_CATEGORY[category.id] || [];
        const isAlt = catIdx % 2 === 1;
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
                    Catégorie {catIdx + 1}
                  </p>
                  <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4">
                    {category.title}
                  </h2>
                  <p className="text-cauris-gray-text leading-relaxed">{category.description}</p>
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
                              aria-label={`Visiter le site de ${partner.name}`}
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
              Vous souhaitez rejoindre notre réseau de partenaires ?
            </h2>
            <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed">
              Que vous soyez une institution, une entreprise, une université ou un fonds
              d&apos;investissement, nous serions ravis d&apos;explorer une collaboration avec vous.
            </p>
            <a
              href="/contact?objet=partenariat-corporate"
              className="inline-flex items-center gap-2 rounded-btn bg-white px-8 py-4 text-base font-semibold uppercase tracking-wide text-cauris-orange transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Devenir partenaire
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
