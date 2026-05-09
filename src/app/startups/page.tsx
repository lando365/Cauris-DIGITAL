import type { Metadata } from 'next';
import StartupsExplorer from '@/components/sections/StartupsExplorer';
import FinalCTA from '@/components/sections/FinalCTA';

export const metadata: Metadata = {
  title: 'Startups CAURIS DIGITAL — Les entreprises tech africaines que nous propulsons',
  description:
    'Découvrez les startups technologiques africaines accompagnées par CAURIS DIGITAL : Agritech, Fintech, Edtech, Healthtech, Smart Cities. Des entrepreneurs qui changent l\'Afrique.',
};

export default function StartupsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Notre portefeuille
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cauris-black mb-6">
              Les startups que nous propulsons
            </h1>
            <p className="text-lg text-cauris-gray-text leading-relaxed">
              Des entrepreneurs de toute l&apos;Afrique francophone qui construisent les solutions
              de demain — avec le soutien de CAURIS DIGITAL.
            </p>
            <p className="mt-4 text-base text-cauris-gray-secondary leading-relaxed">
              Chaque startup de notre portefeuille a été sélectionnée pour la qualité de son
              équipe, la pertinence de sa solution et son potentiel d&apos;impact. Qu&apos;elles
              soient encore en incubation ou déjà sur le marché, ce sont elles qui prouvent que
              l&apos;innovation africaine existe, qu&apos;elle est forte et qu&apos;elle mérite
              d&apos;être soutenue.
            </p>
          </div>
        </div>
      </section>

      {/* Explorateur (filtres + grille) */}
      <StartupsExplorer />

      <FinalCTA />
    </>
  );
}
