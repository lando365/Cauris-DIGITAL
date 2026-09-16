import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Calendar, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';
import { EventRegistrationForm } from './EventRegistrationForm';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function pick(fr: string, en: string | null, locale: string): string {
  return locale === 'en' && en ? en : fr;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'EventRegistrationPage' });
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: t('metaTitleFallback') };
  return { title: t('metaTitle', { event: pick(event.title, event.titleEn, locale) }) };
}

/**
 * Formulaire d'inscription dédié à un événement précis — distinct du
 * formulaire de contact générique. Les soumissions sont persistées et
 * visibles dans l'admin (module Inscriptions), voir POST /api/events/[slug]/register.
 */
export default async function EventRegistrationPage({ params }: PageProps) {
  const { slug } = await params;
  const [t, tEnum, locale] = await Promise.all([
    getTranslations('EventRegistrationPage'),
    getTranslations('Enums'),
    getLocale(),
  ]);

  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.isPublished) {
    notFound();
  }

  const title = pick(event.title, event.titleEn, locale);
  const isClosed = event.startDate <= new Date();

  return (
    <section className="min-h-[80vh] pt-32 pb-20">
      <div className="container-cauris max-w-xl">
        <Link
          href="/evenements"
          className="inline-flex items-center gap-1 text-sm text-cauris-gray-secondary hover:text-cauris-orange mb-6"
        >
          ← {t('backToEvents')}
        </Link>

        <p className="text-sm text-cauris-orange font-semibold uppercase tracking-wider mb-2">
          {tEnum(`eventType.${event.type}`)}
        </p>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cauris-black mb-4">
          {t('title', { event: title })}
        </h1>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-cauris-gray-secondary mb-8 pb-8 border-b border-gray-100">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
            {event.startDate.toLocaleDateString(locale, {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
            {event.isOnline ? t('online') : event.location}
          </span>
          {!event.isFree && event.price && (
            <span className="font-semibold text-cauris-black">{event.price}</span>
          )}
        </div>

        {isClosed ? (
          <p className="text-cauris-gray-text">{t('closed')}</p>
        ) : (
          <EventRegistrationForm slug={event.slug} />
        )}
      </div>
    </section>
  );
}
