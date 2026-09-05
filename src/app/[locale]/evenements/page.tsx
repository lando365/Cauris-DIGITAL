import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import EventsExplorer from '@/components/sections/EventsExplorer';
import NewsletterForm from '@/components/forms/NewsletterForm';
import { Mail } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { mapEvent } from '@/lib/content-mappers';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('EventsPage');
  return { title: t('metaTitle'), description: t('metaDescription') };
}

// CDC V2 §4.3.1 : liste publique en cache ISR (revalidate 60s).
export const revalidate = 60;

export default async function EventsPage() {
  const t = await getTranslations('EventsPage');
  const records = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { startDate: 'desc' },
  });
  const events = records.map(mapEvent);
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

      {/* Liste événements */}
      <EventsExplorer events={events} />

      {/* Newsletter événements */}
      <section className="section bg-cauris-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cauris-orange blur-3xl" />
        </div>
        <div className="container-cauris relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex w-14 h-14 rounded-full bg-cauris-orange/15 text-cauris-orange items-center justify-center mb-5">
              <Mail className="w-7 h-7" aria-hidden="true" />
            </div>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              {t('newsletterEyebrow')}
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-h2 leading-tight text-white mb-4">
              {t('newsletterTitle')}
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              {t('newsletterText')}
            </p>
            <div className="mt-8 max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
