import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  Check,
  Calendar,
  Globe,
  Compass,
  TrendingUp,
  Coins,
  Users,
  Rocket,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import FinalCTA from '@/components/sections/FinalCTA';
import { BRAND_IMAGES } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('AccelerationPage');
  return { title: t('metaTitle'), description: t('metaDescription') };
}

const PHASE_ICONS = [Compass, TrendingUp, Coins, Users, Rocket] as const;
const PHASE_IDS = ['diagnostic', 'growth', 'revenue', 'funding', 'demoday'] as const;
const COMPARISON_IDS = [
  'stage',
  'duration',
  'format',
  'intensity',
  'goal',
  'cost',
  'demoday',
] as const;

interface ProgramData {
  benefits: string[];
}

export default async function AccelerationProgramPage() {
  const t = await getTranslations('AccelerationPage');
  const tData = await getTranslations('ProgramsData');
  const data = tData.raw('acceleration') as ProgramData;
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-cauris-cream/40 relative overflow-hidden">
        <div className="container-cauris relative">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
                {t('heroEyebrow')}
              </p>
              <h1 className="font-heading font-extrabold text-3xl xs:text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-cauris-black mb-6 break-words">
                {t('h1')}
              </h1>
              <p className="text-lg text-cauris-gray-text leading-relaxed mb-8">
                <strong className="text-cauris-black">{t('heroDuration')}</strong>{' '}
                {t('heroSubtitle')}{' '}
                <strong className="text-cauris-black">{t('heroOnline')}</strong>{' '}
                {t('heroAccessible')}
              </p>

              <div className="mb-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cauris-gray-text">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  <strong>{t('durationLabel')}</strong> {t('durationValue')}
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  {t('onlineSessions')}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button href="#candidater" size="lg">
                  {t('applyNext')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button href="#programme" variant="tertiary">
                  {t('discoverProgram')}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="relative aspect-[4/5] rounded-card overflow-hidden shadow-card-hover">
                <Image
                  src={BRAND_IMAGES.accelerationHero}
                  alt={t('heroImageAlt')}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section id="programme" className="section">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <SectionTitle
              eyebrow={t('presentationEyebrow')}
              title={t('presentationTitle')}
              align="left"
            />
            <div className="mt-8 space-y-5 text-cauris-gray-text leading-relaxed">
              <p>
                {t('presentationParagraph1Start')}{' '}
                <strong className="text-cauris-black">{t('presentationParagraph1Strong')}</strong>.
              </p>
              <p>{t('presentationParagraph2')}</p>
              <p>
                {t('presentationParagraph3Start')}{' '}
                <strong className="text-cauris-black">{t('presentationParagraph3Strong')}</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau comparatif */}
      <section className="section bg-cauris-gray-bg">
        <div className="container-cauris">
          <SectionTitle
            eyebrow={t('comparisonEyebrow')}
            title={t('comparisonTitle')}
            description={t('comparisonDescription')}
          />

          <div className="mt-14 max-w-5xl mx-auto">
            <div className="overflow-x-auto rounded-card shadow-card border border-gray-100 bg-white -mx-4 sm:mx-0">
              {/* Hint scroll horizontal sur mobile */}
              <p className="sm:hidden text-xs text-cauris-gray-secondary italic text-center py-2 bg-cauris-cream/30">
                {t('mobileScrollHint')}
              </p>
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-cauris-black text-white">
                    <th className="text-left px-5 py-4 font-heading font-semibold text-sm uppercase tracking-wider whitespace-nowrap">
                      {t('tableCriterion')}
                    </th>
                    <th className="text-left px-5 py-4 font-heading font-semibold text-sm uppercase tracking-wider whitespace-nowrap">
                      {t('tableIncubation')}
                    </th>
                    <th className="text-left px-5 py-4 font-heading font-semibold text-sm uppercase tracking-wider bg-cauris-orange whitespace-nowrap">
                      {t('tableAcceleration')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_IDS.map((id, i) => {
                    const row = t.raw(`comparison.${id}`) as {
                      criterion: string;
                      incubation: string;
                      acceleration: string;
                    };
                    return (
                      <tr key={id} className={i % 2 === 0 ? 'bg-white' : 'bg-cauris-cream/30'}>
                        <td className="px-5 py-4 font-semibold text-cauris-black text-sm">
                          {row.criterion}
                        </td>
                        <td className="px-5 py-4 text-cauris-gray-text text-sm">
                          {row.incubation}
                        </td>
                        <td className="px-5 py-4 text-cauris-gray-text text-sm border-l-2 border-cauris-orange/30 bg-cauris-orange/5">
                          {row.acceleration}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Le programme semaine par semaine */}
      <section className="section">
        <div className="container-cauris">
          <SectionTitle
            eyebrow={t('timelineEyebrow')}
            title={t('timelineTitle')}
            description={t('timelineDescription')}
          />

          <div className="mt-14 grid lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
            {PHASE_IDS.map((id, i) => {
              const Icon = PHASE_ICONS[i];
              const phase = t.raw(`phases.${id}`) as {
                period: string;
                title: string;
                description: string;
              };
              return (
                <Reveal key={id} delay={i * 80}>
                  <article className="bg-white border border-gray-100 rounded-card p-6 lg:p-7 hover:border-cauris-orange/30 transition-colors h-full">
                    <div className="flex items-start gap-5">
                      <div className="shrink-0 w-12 h-12 rounded-card bg-cauris-orange/10 text-cauris-orange flex items-center justify-center">
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cauris-orange mb-1">
                          {phase.period}
                        </p>
                        <h3 className="font-heading font-bold text-lg text-cauris-black mb-3">
                          {phase.title}
                        </h3>
                        <p className="text-sm text-cauris-gray-text leading-relaxed">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ce que vous obtenez */}
      <section className="section bg-cauris-cream/40">
        <div className="container-cauris">
          <SectionTitle eyebrow={t('benefitsEyebrow')} title={t('benefitsTitle')} />

          <div className="mt-14 grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {data.benefits.map((benefit, i) => (
              <Reveal key={benefit} delay={i * 50}>
                <div className="flex items-start gap-3 bg-white p-5 rounded-card border border-gray-100">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-cauris-orange/10 text-cauris-orange flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm text-cauris-gray-text leading-relaxed">{benefit}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Profil recherché */}
      <section id="candidater" className="section scroll-mt-24">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
            <Reveal>
              <SectionTitle
                eyebrow={t('profileEyebrow')}
                title={t('profileTitle')}
                align="left"
              />
              <p className="mt-6 text-cauris-gray-text leading-relaxed">{t('profileIntro')}</p>
              <ul className="mt-6 space-y-3">
                {(t.raw('profileCriteria') as string[]).map((item) => (
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
              <div className="bg-cauris-orange text-white rounded-card p-8 lg:p-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80 mb-2">
                  {t('readyLabel')}
                </p>
                <h3 className="font-heading font-bold text-2xl mb-4">{t('readyTitle')}</h3>
                <p className="text-white/90 leading-relaxed mb-6">{t('readyText')}</p>
                <Button
                  href="/contact?objet=candidature-acceleration"
                  className="bg-white text-cauris-orange hover:bg-cauris-cream"
                >
                  {t('applyButton')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
