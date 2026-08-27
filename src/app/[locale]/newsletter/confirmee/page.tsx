import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Inscription confirmée',
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmedPage() {
  return (
    <section className="min-h-[80vh] flex items-center pt-32 pb-20">
      <div className="container-cauris text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-cauris-success/15 text-cauris-success-text items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cauris-black mb-4">
          Inscription confirmée !
        </h1>
        <p className="text-cauris-gray-text max-w-md mx-auto mb-8">
          Merci de rejoindre la communauté CAURIS DIGITAL. Un email de bienvenue vient de vous être
          envoyé — vous y trouverez aussi le lien pour vous désinscrire à tout moment.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">Retour à l&apos;accueil</Button>
          <Button href="/startups" variant="secondary">
            Découvrir les startups
          </Button>
        </div>
      </div>
    </section>
  );
}
