import type { Metadata } from 'next';
import { MailX } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Désinscription confirmée',
  robots: { index: false, follow: false },
};

export default function NewsletterUnsubscribedPage() {
  return (
    <section className="min-h-[80vh] flex items-center pt-32 pb-20">
      <div className="container-cauris text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-cauris-gray-bg text-cauris-gray-secondary items-center justify-center mb-6">
          <MailX className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cauris-black mb-4">
          Vous êtes désinscrit·e
        </h1>
        <p className="text-cauris-gray-text max-w-md mx-auto mb-8">
          Vous ne recevrez plus la newsletter CAURIS DIGITAL. Vous pouvez vous réinscrire à tout
          moment depuis le pied de page du site.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">Retour à l&apos;accueil</Button>
        </div>
      </div>
    </section>
  );
}
