import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('PrivacyPolicyPage');
  return { title: t('metaTitle'), description: t('metaDescription') };
}

const SECTION_IDS = ['donnees-collectees', 'finalite', 'duree', 'droits', 'cookies'] as const;

export default async function PolitiqueConfidentialitePage() {
  const t = await getTranslations('PrivacyPolicyPage');
  const sections = SECTION_IDS.map((id) => ({
    id,
    ...(t.raw(`sections.${id}`) as { title: string; content: string }),
  }));
  return (
    <>
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

      <section className="section">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {/* Sommaire */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cauris-gray-secondary mb-4">
                  {t('tocLabel')}
                </p>
                <nav aria-label={t('tocAriaLabel')}>
                  <ul className="space-y-2">
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="block py-2 px-3 rounded-btn text-sm text-cauris-gray-text hover:bg-cauris-cream hover:text-cauris-orange transition-colors"
                        >
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Contenu */}
            <article className="lg:col-span-3 space-y-12">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4">
                    {section.title}
                  </h2>
                  <p className="text-cauris-gray-text leading-relaxed">{section.content}</p>
                  {section.id === 'droits' && (
                    <p className="text-cauris-gray-text leading-relaxed mt-3">
                      {t('exerciseRightsPrompt')}{' '}
                      <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        className="text-cauris-orange hover:underline"
                      >
                        {SITE_CONFIG.email}
                      </a>
                      .
                    </p>
                  )}
                </div>
              ))}

              <div className="mt-14 p-6 bg-cauris-cream/40 rounded-card border border-cauris-orange/20">
                <p className="text-sm text-cauris-gray-text leading-relaxed mb-3">
                  {t('contactPrompt')}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-cauris-orange font-semibold hover:underline"
                >
                  {t('contactUs')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
