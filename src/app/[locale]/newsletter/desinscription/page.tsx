import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { verifyToken } from '@/lib/newsletter-token';
import { UnsubscribeReasonForm } from './UnsubscribeReasonForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('NewsletterUnsubscribePage');
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

/**
 * Étape intermédiaire avant la désinscription réelle : un simple GET (ce lien
 * vient d'un email) ne modifie rien ici, ce qui évite qu'un scanner de sécurité
 * ou un aperçu de lien ne désinscrive quelqu'un tout seul. La désinscription
 * n'a lieu qu'au clic sur le bouton du formulaire (POST /api/newsletter/unsubscribe).
 */
export default async function NewsletterUnsubscribePage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  const [t, locale] = await Promise.all([
    getTranslations('NewsletterUnsubscribePage'),
    getLocale(),
  ]);

  if (!token) {
    redirect({ href: '/newsletter/erreur?raison=manquant', locale });
  }

  const result = verifyToken(token!, 'unsubscribe');
  if (!result.valid) {
    const raison = result.reason === 'expired' ? 'expire' : 'invalide';
    redirect({ href: `/newsletter/erreur?raison=${raison}`, locale });
  }

  return (
    <section className="min-h-[80vh] flex items-center pt-32 pb-20">
      <div className="container-cauris">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cauris-black mb-4">
            {t('title')}
          </h1>
          <p className="text-cauris-gray-text mb-8">{t('text')}</p>
          <UnsubscribeReasonForm token={token!} />
        </div>
      </div>
    </section>
  );
}
