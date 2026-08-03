import type { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Lien invalide',
  robots: { index: false, follow: false },
};

const MESSAGES: Record<string, string> = {
  expire:
    'Ce lien a expiré (il n\'est valable que 48 heures). Réinscrivez-vous depuis le pied de page pour recevoir un nouveau lien.',
  invalide: 'Ce lien n\'est pas valide. Vérifiez que vous avez copié l\'adresse complète depuis l\'email.',
  manquant: 'Aucun lien de confirmation n\'a été fourni.',
  serveur: 'Une erreur technique est survenue. Réessayez dans quelques minutes.',
};

interface PageProps {
  searchParams: { raison?: string };
}

export default function NewsletterErrorPage({ searchParams }: PageProps) {
  const message = MESSAGES[searchParams.raison ?? ''] ?? MESSAGES.invalide;

  return (
    <section className="min-h-[80vh] flex items-center pt-32 pb-20">
      <div className="container-cauris text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-cauris-error/10 text-cauris-error items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-cauris-black mb-4">
          Lien invalide ou expiré
        </h1>
        <p className="text-cauris-gray-text max-w-md mx-auto mb-8">{message}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">Retour à l&apos;accueil</Button>
          <Button href="/contact" variant="secondary">
            Nous contacter
          </Button>
        </div>
      </div>
    </section>
  );
}
