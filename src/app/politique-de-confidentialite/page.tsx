import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — CAURIS DIGITAL',
  description:
    'Politique de confidentialité de CAURIS DIGITAL : données collectées, finalités, durée de conservation, droits des utilisateurs et politique cookies.',
};

const SECTIONS = [
  {
    id: 'donnees-collectees',
    title: '1. Données collectées',
    content:
      'Nous collectons les données personnelles que vous nous transmettez volontairement via nos formulaires (nom, prénom, email, pays, message). Nous collectons également des données de navigation anonymisées via Google Analytics 4 (pages visitées, durée de session, source de trafic) à des fins d\'amélioration du site.',
  },
  {
    id: 'finalite',
    title: '2. Finalité de la collecte',
    content:
      'Les données des formulaires sont utilisées exclusivement pour : répondre à vos demandes, traiter vos candidatures aux programmes, vous envoyer la newsletter si vous y avez souscrit. Nous ne vendons ni ne partageons vos données personnelles avec des tiers à des fins commerciales.',
  },
  {
    id: 'duree',
    title: '3. Durée de conservation',
    content:
      'Vos données personnelles sont conservées 3 ans à compter de votre dernier contact avec CAURIS DIGITAL, sauf obligation légale différente.',
  },
  {
    id: 'droits',
    title: '4. Vos droits',
    content:
      'Conformément aux lois applicables sur la protection des données, vous disposez d\'un droit d\'accès, de rectification, de suppression et d\'opposition sur vos données.',
  },
  {
    id: 'cookies',
    title: '5. Cookies',
    content:
      'Nous utilisons des cookies analytiques (Google Analytics) et des cookies fonctionnels pour améliorer votre navigation. Vous pouvez refuser les cookies non-essentiels via le bandeau de consentement affiché lors de votre première visite.',
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Vie privée
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cauris-black mb-6">
              Politique de confidentialité
            </h1>
            <p className="text-lg text-cauris-gray-text leading-relaxed">
              Chez CAURIS DIGITAL, nous prenons votre vie privée au sérieux. Voici comment nous
              collectons, utilisons et protégeons vos données.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {/* Sommaire */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cauris-gray-secondary mb-4">
                  Sommaire
                </p>
                <nav aria-label="Sommaire de la politique de confidentialité">
                  <ul className="space-y-2">
                    {SECTIONS.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="block py-2 px-3 rounded-btn text-sm text-cauris-gray-text hover:bg-cauris-cream hover:text-cauris-orange transition-colors"
                        >
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Contenu */}
            <article className="lg:col-span-3 space-y-12">
              {SECTIONS.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4">
                    {section.title}
                  </h2>
                  <p className="text-cauris-gray-text leading-relaxed">{section.content}</p>
                  {section.id === 'droits' && (
                    <p className="text-cauris-gray-text leading-relaxed mt-3">
                      Pour exercer ces droits, écrivez-nous à :{' '}
                      <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        className="text-cauris-orange hover:underline"
                      >
                        {SITE_CONFIG.email}
                      </a>
                      .
                    </p>
                  )}
                </div>
              ))}

              <div className="mt-14 p-6 bg-cauris-cream/40 rounded-card border border-cauris-orange/20">
                <p className="text-sm text-cauris-gray-text leading-relaxed mb-3">
                  Une question concernant vos données personnelles ?
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
        </div>
      </section>
    </>
  );
}
