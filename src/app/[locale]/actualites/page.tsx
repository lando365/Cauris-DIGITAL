import type { Metadata } from 'next';
import NewsExplorer from '@/components/sections/NewsExplorer';

export const metadata: Metadata = {
  title: 'Actualités CAURIS DIGITAL — Tech, Innovation et Entrepreneuriat en Afrique',
  description:
    'Suivez l\'actualité de CAURIS DIGITAL et de l\'écosystème tech africain : portraits d\'entrepreneurs, annonces de promotions, analyses et ressources pour startups.',
};

export default function NewsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Notre blog
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cauris-black mb-6">
              Actualités
            </h1>
            <p className="text-lg text-cauris-gray-text leading-relaxed">
              Nos annonces, portraits d&apos;entrepreneurs, analyses et ressources pour construire
              votre startup.
            </p>
          </div>
        </div>
      </section>

      <NewsExplorer />
    </>
  );
}
