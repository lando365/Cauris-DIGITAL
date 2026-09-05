import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('NewsletterErrorPage');
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

const REASON_IDS = ['expire', 'invalide', 'manquant', 'serveur'] as const;

interface PageProps {
  searchParams: Promise<{ raison?: string }>;
}

export default async function NewsletterErrorPage({ searchParams }: PageProps) {
  const { raison } = await searchParams;
  const t = await getTranslations('NewsletterErrorPage');
  const reasonId = REASON_IDS.find((id) => id === raison) ?? 'invalide';
  const message = t(`reasons.${reasonId}`);

  return (
    <section className="min-h-[80vh] flex items-center pt-32 pb-20">
      <div className="container-cauris text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-cauris-error/10 text-cauris-error items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cauris-black mb-4">
          {t('title')}
        </h1>
        <p className="text-cauris-gray-text max-w-md mx-auto mb-8">{message}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">{t('backHome')}</Button>
          <Button href="/contact" variant="secondary">
            {t('contactUs')}
          </Button>
        </div>
      </div>
    </section>
  );
}
