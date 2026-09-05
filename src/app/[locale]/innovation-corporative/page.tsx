import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  ArrowRight,
  Search,
  Users,
  FlaskConical,
  Lightbulb,
  CalendarDays,
  Eye,
  Star,
  Building2,
  FileText,
  Megaphone,
  Briefcase,
  Check,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import { BRAND_IMAGES } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('CorporatePage');
  return { title: t('metaTitle'), description: t('metaDescription') };
}

const SERVICE_ICONS = [Search, Users, FlaskConical, Lightbulb, CalendarDays] as const;
const SERVICE_IDS = ['scouting', 'coCreation', 'pilots', 'reverseMentoring', 'openInnovationDay'] as const;

const BENEFIT_ICONS = [Eye, Star, Building2, Briefcase, FileText, Megaphone] as const;
const BENEFIT_IDS = [
  'visibility',
  'priorityAccess',
  'observerSeat',
  'exclusiveEvents',
  'biannualReport',
  'coBranding',
] as const;

export default async function InnovationCorporativePage() {
  const t = await getTranslations('CorporatePage');
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-cauris-black text-white relative overflow-hidden">
        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cauris-orange blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-cauris-orange blur-3xl" />
        </div>

        <div className="container-cauris relative">
          <div className="max-w-4xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange-light">
              {t('heroEyebrow')}
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
              {t('heroTitleStart')} <span className="text-gradient-orange">CAURIS DIGITAL</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/85 leading-relaxed mb-10 max-w-3xl">
              {t('heroSubtitle')}
            </p>

            <Button
              href="/contact?objet=partenariat-corporate"
              size="lg"
              className="bg-cauris-orange hover:bg-cauris-orange-dark text-white"
            >
              {t('heroButton')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pitch entreprises */}
      <section id="lab" className="section">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <SectionTitle
              eyebrow={t('whyUsEyebrow')}
              title={t('whyUsTitle')}
              align="left"
            />
            <div className="mt-8 space-y-5 text-cauris-gray-text leading-relaxed">
              <p>{t('whyUsParagraph1')}</p>
              <p>
                {t('whyUsParagraph2Start')} <strong className="text-cauris-black">{t('whyUsParagraph2Strong')}</strong>
                . {t('whyUsParagraph2End')}
              </p>
              <p>{t('whyUsParagraph3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services proposés */}
      <section id="programmes" className="section bg-cauris-gray-bg">
        <div className="container-cauris">
          <SectionTitle
            eyebrow={t('servicesEyebrow')}
            title={t('servicesTitle')}
            description={t('servicesDescription')}
          />

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {SERVICE_IDS.map((id, i) => {
              const Icon = SERVICE_ICONS[i];
              const service = t.raw(`services.${id}`) as { title: string; description: string };
              return (
                <Reveal key={id} delay={i * 80}>
                  <article className="card bg-white p-7 h-full border border-gray-100">
                    <div className="w-14 h-14 rounded-xl bg-cauris-orange/10 text-cauris-orange flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-cauris-black mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-cauris-gray-text leading-relaxed">
                      {service.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pourquoi devenir partenaire */}
      <section className="section">
        <div className="container-cauris">
          <SectionTitle
            eyebrow={t('benefitsEyebrow')}
            title={t('benefitsTitle')}
            description={t('benefitsDescription')}
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {BENEFIT_IDS.map((id, i) => {
              const Icon = BENEFIT_ICONS[i];
              const benefit = t.raw(`benefits.${id}`) as { title: string; description: string };
              return (
                <Reveal key={id} delay={i * 60}>
                  <div className="flex items-start gap-4 bg-cauris-cream/40 rounded-card p-5 h-full border border-cauris-orange/10">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-cauris-orange text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-base text-cauris-black mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-cauris-gray-text leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pour qui ? */}
      <section className="section bg-cauris-gray-bg">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            <Reveal>
              <SectionTitle
                eyebrow={t('audienceEyebrow')}
                title={t('audienceTitle')}
                align="left"
              />
              <p className="mt-6 text-cauris-gray-text leading-relaxed">{t('audienceIntro')}</p>
              <ul className="mt-6 space-y-3">
                {(t.raw('targetAudience') as string[]).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-cauris-success/15 text-cauris-success flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" aria-hidden="true" />
                    </span>
                    <span className="text-cauris-gray-text">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={150}>
              <div className="relative aspect-square rounded-card overflow-hidden shadow-card-hover">
                <Image
                  src={BRAND_IMAGES.corporateMeeting}
                  alt={t('meetingImageAlt')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA final dédié corporate */}
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
