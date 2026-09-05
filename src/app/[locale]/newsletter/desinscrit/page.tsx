import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { MailX } from 'lucide-react';
import Button from '@/components/ui/Button';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('NewsletterUnsubscribedPage');
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

export default async function NewsletterUnsubscribedPage() {
  const t = await getTranslations('NewsletterUnsubscribedPage');
  return (
    <section className="min-h-[80vh] flex items-center pt-32 pb-20">
      <div className="container-cauris text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-cauris-gray-bg text-cauris-gray-secondary items-center justify-center mb-6">
          <MailX className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cauris-black mb-4">
          {t('title')}
        </h1>
        <p className="text-cauris-gray-text max-w-md mx-auto mb-8">{t('text')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">{t('backHome')}</Button>
        </div>
      </div>
    </section>
  );
}
