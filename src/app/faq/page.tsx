import type { Metadata } from 'next';
import { ArrowRight, MessageCircleQuestion } from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Accordion from '@/components/ui/Accordion';
import Reveal from '@/components/ui/Reveal';
import { FAQ_ITEMS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'FAQ — Questions fréquentes sur CAURIS DIGITAL et nos programmes',
  description:
    'Trouvez les réponses à toutes vos questions sur les programmes d\'incubation et d\'accélération de CAURIS DIGITAL, les candidatures, le mentorat en ligne et les partenariats.',
};

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Questions fréquentes
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cauris-black mb-6">
              Questions fréquentes
            </h1>
            <p className="text-lg text-cauris-gray-text leading-relaxed">
              Vous avez une question ? La réponse est probablement ici. Sinon, contactez-nous
              directement.
            </p>
          </div>
        </div>
      </section>

      {/* Liste des thèmes + accordéons */}
      <section className="section">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {/* Sommaire latéral (sticky) */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cauris-gray-secondary mb-4">
                  Thèmes
                </p>
                <nav aria-label="Navigation FAQ par thème">
                  <ul className="space-y-2">
                    {FAQ_ITEMS.map((theme, i) => (
                      <li key={theme.theme}>
                        <a
                          href={`#theme-${i}`}
                          className="block py-2 px-3 rounded-btn text-sm text-cauris-gray-text hover:bg-cauris-cream hover:text-cauris-orange transition-colors"
                        >
                          {theme.theme}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Accordéons */}
            <div className="lg:col-span-3 space-y-12">
              {FAQ_ITEMS.map((theme, themeIdx) => (
                <Reveal key={theme.theme} delay={themeIdx * 60}>
                  <section id={`theme-${themeIdx}`} className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-9 h-9 rounded-lg bg-cauris-orange text-white flex items-center justify-center font-heading font-bold text-sm">
                        {themeIdx + 1}
                      </span>
                      <h2 className="font-heading font-bold text-xl lg:text-2xl text-cauris-black">
                        {theme.theme}
                      </h2>
                    </div>
                    <Accordion items={theme.items} multiple />
                  </section>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA fin de page */}
      <section className="section bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex w-16 h-16 rounded-full bg-cauris-orange/10 text-cauris-orange items-center justify-center mb-6">
              <MessageCircleQuestion className="w-8 h-8" aria-hidden="true" />
            </div>
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4">
              Vous n&apos;avez pas trouvé la réponse à votre question ?
            </h2>
            <p className="text-cauris-gray-text leading-relaxed mb-8">
              Notre équipe est à votre disposition. Écrivez-nous et nous vous répondrons sous 48h
              ouvrées.
            </p>
            <Button href="/contact" size="lg">
              Contactez-nous
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
