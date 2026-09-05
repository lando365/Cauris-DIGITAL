import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('LegalNoticePage');
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function MentionsLegalesPage() {
  const t = await getTranslations('LegalNoticePage');
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
            <p className="text-base text-cauris-gray-secondary italic">{t('draftNotice')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-cauris">
          <article className="max-w-3xl mx-auto prose-cauris">
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4 mt-0">
              {t('publisherTitle')}
            </h2>
            <div className="text-cauris-gray-text leading-relaxed mb-10 space-y-2">
              <p>
                <strong className="text-cauris-black">CAURIS DIGITAL</strong>
              </p>
              <p>{t('associationLaw')}</p>
              <p>
                {t('headOffice')} {SITE_CONFIG.fullAddress}
              </p>
              <p>
                {t('email')}{' '}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-cauris-orange hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
              </p>
              <p>
                {t('phone')} {SITE_CONFIG.phone}
              </p>
              <p>{t('publicationDirector')}</p>
            </div>

            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4 mt-12">
              {t('hostingTitle')}
            </h2>
            <div className="text-cauris-gray-text leading-relaxed mb-10">
              <p>
                {t('hostingTextStart')} <strong>{t('hostingName')}</strong>, {t('hostingAddress')},{' '}
                {t('hostingContact')}.
              </p>
            </div>

            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4 mt-12">
              {t('ipTitle')}
            </h2>
            <div className="text-cauris-gray-text leading-relaxed mb-10">
              <p>{t('ipText')}</p>
            </div>

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
      </section>
    </>
  );
}
