import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Linkedin, Trophy, Users, Target, Handshake, Globe2, Globe } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import FinalCTA from '@/components/sections/FinalCTA';
import { VALUES, TEAM_PHOTOS, BRAND_IMAGES } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('AboutPage');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

const VALUE_ICONS = {
  Trophy,
  Users,
  Target,
  Handshake,
  Globe2,
  Globe,
} as const;

const TEAM_IDS = ['directorGeneral', 'programDirector', 'mentorshipLead', 'communicationLead'] as const;
const TEAM_PHOTO_MAP = {
  directorGeneral: TEAM_PHOTOS.directorGeneral,
  programDirector: TEAM_PHOTOS.programDirector,
  mentorshipLead: TEAM_PHOTOS.mentorshipLead,
  communicationLead: TEAM_PHOTOS.communicationLead,
} as const;

const BOARD_COUNT = 6;

export default async function AboutPage() {
  const t = await getTranslations('AboutPage');
  const tValues = await getTranslations('ValuesData');
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-cauris-cream/40">
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

      {/* Notre histoire */}
      <section id="qui-sommes-nous" className="section">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-3">
              <Reveal>
                <SectionTitle eyebrow={t('storyEyebrow')} title={t('storyTitle')} align="left" />
                <div className="mt-8 space-y-5 text-cauris-gray-text leading-relaxed">
                  <p>{t('storyParagraph1')}</p>
                  <p>{t('storyParagraph2')}</p>
                  <p>{t('storyParagraph3')}</p>
                  <p>{t('storyParagraph4')}</p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={150} className="lg:col-span-2">
              <div className="space-y-6 lg:sticky lg:top-28">
                <div className="relative aspect-[4/5] rounded-card overflow-hidden shadow-card-hover">
                  <Image
                    src={BRAND_IMAGES.aboutHistory}
                    alt={t('historyImageAlt')}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="bg-cauris-black text-white p-6 rounded-card">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cauris-orange-light mb-2">
                    {t('missionLabel')}
                  </p>
                  <p className="text-base leading-relaxed">{t('missionCalloutText')}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
            <Reveal>
              <article className="card bg-white p-8 lg:p-10 h-full border border-gray-100">
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange mb-3">
                  {t('missionLabel')}
                </p>
                <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4">
                  {t('missionTitle')}
                </h2>
                <p className="text-cauris-gray-text leading-relaxed">{t('missionCalloutText')}</p>
              </article>
            </Reveal>
            <Reveal delay={100}>
              <article className="card bg-cauris-orange text-white p-8 lg:p-10 h-full">
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80 mb-3">
                  {t('visionLabel')}
                </p>
                <h2 className="font-heading font-bold text-2xl lg:text-3xl mb-4">
                  {t('visionTitle')}
                </h2>
                <p className="leading-relaxed text-white/95">{t('visionText')}</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="section bg-cauris-gray-bg">
        <div className="container-cauris">
          <SectionTitle eyebrow={t('valuesEyebrow')} title={t('valuesTitle')} />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {VALUES.map((value, i) => {
              const Icon = VALUE_ICONS[value.icon as keyof typeof VALUE_ICONS];
              const data = tValues.raw(value.id) as { title: string; description: string };
              return (
                <Reveal key={value.id} delay={i * 80}>
                  <div className="card bg-white p-7 h-full border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-cauris-orange/10 text-cauris-orange flex items-center justify-center mb-5">
                      {Icon && <Icon className="w-6 h-6" aria-hidden="true" />}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-cauris-black mb-2">
                      {data.title}
                    </h3>
                    <p className="text-sm text-cauris-gray-text leading-relaxed">
                      {data.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section id="equipe" className="section bg-white">
        <div className="container-cauris">
          <SectionTitle
            eyebrow={t('teamEyebrow')}
            title={t('teamTitle')}
            description={t('teamDescription')}
          />

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {TEAM_IDS.map((id, i) => {
              const member = t.raw(`team.${id}`) as { name: string; role: string; bio: string };
              return (
                <Reveal key={id} delay={i * 80}>
                  <article className="group">
                    <div className="relative aspect-square rounded-card overflow-hidden mb-4 shadow-card group-hover:shadow-card-hover transition-shadow">
                      <Image
                        src={TEAM_PHOTO_MAP[id]}
                        alt={t('portraitAlt', { name: member.name })}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-cauris-black">
                      {member.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1 mb-3">
                      <p className="text-sm text-cauris-orange font-medium">{member.role}</p>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cauris-gray-secondary hover:text-cauris-orange transition-colors"
                        aria-label={t('linkedinAlt', { name: member.name })}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-xs text-cauris-gray-text leading-relaxed">{member.bio}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
          {/* TODO développeur : remplacer les placeholders [Prénom NOM] par les vraies bios
              via le CMS avant la mise en ligne. Voir Audit §3.3. */}
        </div>
      </section>

      {/* Conseil d'administration */}
      <section id="ca" className="section bg-cauris-cream/40">
        <div className="container-cauris">
          <SectionTitle
            eyebrow={t('boardEyebrow')}
            title={t('boardTitle')}
            description={t('boardDescription')}
          />

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: BOARD_COUNT }, (_, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="bg-white rounded-card p-5 border border-gray-100 hover:border-cauris-orange/30 transition-colors">
                  <p className="font-semibold text-cauris-black">{t('boardMemberName')}</p>
                  <p className="text-sm text-cauris-gray-secondary mt-0.5">
                    {t('boardMemberInstitution')}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
