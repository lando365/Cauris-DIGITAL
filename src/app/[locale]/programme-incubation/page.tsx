import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  Check,
  Calendar,
  Users,
  Trophy,
  Globe,
  MapPin,
  ClipboardCheck,
  MessageSquare,
  Mail,
  Rocket,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import FinalCTA from '@/components/sections/FinalCTA';
import { BRAND_IMAGES } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('IncubationPage');
  return { title: t('metaTitle'), description: t('metaDescription') };
}

const PHASE_IDS = ['foundations', 'building', 'launch'] as const;
const APPLICATION_STEP_ICONS = [ClipboardCheck, MessageSquare, Mail, Rocket] as const;
const APPLICATION_STEP_IDS = ['step1', 'step2', 'step3', 'step4'] as const;
const TESTIMONIAL_IDS = ['testimonial1', 'testimonial2'] as const;

interface ProgramData {
  benefits: string[];
}

export default async function IncubationProgramPage() {
  const t = await getTranslations('IncubationPage');
  const tData = await getTranslations('ProgramsData');
  const data = tData.raw('incubation') as ProgramData;
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
                <strong className="text-cauris-black">{t('heroTagline')}</strong>
              </p>

              <div className="mb-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cauris-gray-text">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  <strong>{t('durationLabel')}</strong> {t('durationValue')}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  {t('inPersonLocation')}
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  {t('onlineMentoring')}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button href="#candidater" size="lg">
                  {t('applyNow')}
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
                  src={BRAND_IMAGES.incubationHero}
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

      {/* Présentation du programme */}
      <section id="programme" className="section">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <SectionTitle eyebrow={t('presentationEyebrow')} title={t('presentationTitle')} align="left" />
            <div className="mt-8 space-y-5 text-cauris-gray-text leading-relaxed">
              <p>{t('presentationParagraph1')}</p>
              <p>{t('presentationParagraph2')}</p>
              <p>
                {t('presentationParagraph3Start')} <strong>{t('free')}</strong>{' '}
                {t('presentationParagraph3Mid')} <strong>{t('noEquity')}</strong>{' '}
                {t('presentationParagraph3End')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ce que vous obtenez */}
      <section className="section bg-cauris-gray-bg">
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

      {/* Déroulement par phase */}
      <section className="section">
        <div className="container-cauris">
          <SectionTitle
            eyebrow={t('timelineEyebrow')}
            title={t('timelineTitle')}
            description={t('timelineDescription')}
          />

          <div className="mt-14 max-w-4xl mx-auto space-y-6">
            {PHASE_IDS.map((id, i) => {
              const phase = t.raw(`phases.${id}`) as {
                period: string;
                title: string;
                description: string;
              };
              return (
                <Reveal key={id} delay={i * 100}>
                  <article className="relative bg-white border border-gray-100 rounded-card p-6 lg:p-8 hover:border-cauris-orange/30 transition-colors">
                    <div className="flex items-start gap-5">
                      <div className="shrink-0 w-14 h-14 rounded-card bg-cauris-orange text-white flex flex-col items-center justify-center text-xs font-bold leading-tight">
                        <span className="text-[10px] uppercase tracking-wider opacity-90">
                          {t('phaseLabel')}
                        </span>
                        <span className="text-lg">{i + 1}</span>
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cauris-orange mb-1">
                          {phase.period}
                        </p>
                        <h3 className="font-heading font-bold text-xl text-cauris-black mb-3">
                          {phase.title}
                        </h3>
                        <p className="text-cauris-gray-text leading-relaxed">{phase.description}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Profil recherché */}
      <section className="section bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
            <Reveal>
              <SectionTitle eyebrow={t('profileEyebrow')} title={t('profileTitle')} align="left" />
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
              <p className="mt-6 text-sm text-cauris-gray-secondary italic">{t('remoteNote')}</p>
            </Reveal>

            <Reveal delay={150}>
              <div className="bg-cauris-black text-white rounded-card p-8 lg:p-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cauris-orange-light mb-2">
                  {t('goodToKnowLabel')}
                </p>
                <h3 className="font-heading font-bold text-2xl mb-4">{t('goodToKnowTitle')}</h3>
                <p className="text-white/85 leading-relaxed mb-5">{t('goodToKnowText')}</p>
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/10">
                  <div>
                    <p className="text-3xl font-heading font-bold text-cauris-orange">12</p>
                    <p className="text-xs text-white/70">{t('startupsPerCohort')}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold text-cauris-orange">
                      {t('threeMonths')}
                    </p>
                    <p className="text-xs text-white/70">{t('postProgramSupport')}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="section">
        <div className="container-cauris">
          <SectionTitle eyebrow={t('testimonialsEyebrow')} title={t('testimonialsTitle')} />
          <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {TESTIMONIAL_IDS.map((id, i) => {
              const testimonial = t.raw(id) as {
                name: string;
                startup: string;
                location: string;
                promo: string;
                quote: string;
              };
              return (
                <Reveal key={id} delay={i * 100}>
                  <article className="card bg-white p-7 lg:p-8 border border-gray-100 h-full">
                    <p className="text-cauris-gray-text leading-relaxed mb-5 italic">
                      « {testimonial.quote} »
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cauris-orange to-cauris-orange-light flex items-center justify-center text-white font-bold text-sm">
                        {/* On extrait la première lettre non-spéciale (ignore les crochets des placeholders [Prénom NOM]) */}
                        {testimonial.name
                          .replace(/[[\]]/g, '')
                          .trim()
                          .charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-semibold text-cauris-black text-sm">
                          {t('founderOf', { name: testimonial.name, startup: testimonial.startup })}
                        </p>
                        <p className="text-xs text-cauris-gray-secondary">
                          {testimonial.location}, {testimonial.promo}
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

      {/* Processus de candidature */}
      <section id="candidater" className="section bg-cauris-gray-bg scroll-mt-24">
        <div className="container-cauris">
          <SectionTitle
            eyebrow={t('applyEyebrow')}
            title={t('applyTitle')}
            description={t('applyDescription')}
          />

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {APPLICATION_STEP_IDS.map((id, i) => {
              const Icon = APPLICATION_STEP_ICONS[i];
              const step = t.raw(`steps.${id}`) as { title: string; description: string };
              return (
                <Reveal key={id} delay={i * 80}>
                  <article className="bg-white rounded-card p-6 border border-gray-100 h-full relative">
                    <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-cauris-orange text-white flex items-center justify-center font-bold shadow-cta">
                      {i + 1}
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-cauris-orange/10 text-cauris-orange flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-cauris-black mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-cauris-gray-text leading-relaxed">
                      {step.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <Button href="/contact?objet=candidature-incubation" size="lg">
              {t('applyButton')}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-cauris-gray-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-cauris-orange shrink-0" aria-hidden="true" />
                {t('trophyBadge')}
              </span>
              <span className="hidden sm:inline" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cauris-orange shrink-0" aria-hidden="true" />
                {t('limitedCohort')}
              </span>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
