import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Mentions légales — CAURIS DIGITAL',
  description:
    'Mentions légales du site CAURIS DIGITAL : éditeur, hébergeur, propriété intellectuelle.',
};

export default function MentionsLegalesPage() {
  return (
    <>
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Informations légales
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cauris-black mb-6">
              Mentions légales
            </h1>
            <p className="text-base text-cauris-gray-secondary italic">
              Document à faire valider par un juriste avant mise en ligne. Cette base de départ
              est conforme aux pratiques standards.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-cauris">
          <article className="max-w-3xl mx-auto prose-cauris">
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4 mt-0">
              Éditeur du site
            </h2>
            <div className="text-cauris-gray-text leading-relaxed mb-10 space-y-2">
              <p>
                <strong className="text-cauris-black">CAURIS DIGITAL</strong>
              </p>
              <p>Association loi [applicable locale]</p>
              <p>Siège social : {SITE_CONFIG.fullAddress}</p>
              <p>
                Email :{' '}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-cauris-orange hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
              </p>
              <p>Téléphone : {SITE_CONFIG.phone}</p>
              <p>Directeur de la publication : [Nom du responsable légal]</p>
            </div>

            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4 mt-12">
              Hébergement
            </h2>
            <div className="text-cauris-gray-text leading-relaxed mb-10">
              <p>
                Ce site est hébergé par <strong>[Nom de l&apos;hébergeur]</strong>,{' '}
                [Adresse de l&apos;hébergeur], [Email ou téléphone de l&apos;hébergeur].
              </p>
            </div>

            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4 mt-12">
              Propriété intellectuelle
            </h2>
            <div className="text-cauris-gray-text leading-relaxed mb-10">
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, logos, vidéos, graphismes)
                est protégé par le droit d&apos;auteur et appartient à CAURIS DIGITAL, sauf
                mention contraire. Toute reproduction, même partielle, est interdite sans
                autorisation écrite préalable.
              </p>
            </div>

            <div className="mt-14 p-6 bg-cauris-cream/40 rounded-card border border-cauris-orange/20">
              <p className="text-sm text-cauris-gray-text leading-relaxed mb-3">
                Pour toute question concernant ces mentions légales :
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-cauris-orange font-semibold hover:underline"
              >
                Contactez-nous
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
