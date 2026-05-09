import type { Metadata } from 'next';
import EventsExplorer from '@/components/sections/EventsExplorer';
import NewsletterForm from '@/components/forms/NewsletterForm';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Événements CAURIS DIGITAL — Conférences, Demo Days, Ateliers tech Afrique',
  description:
    'Retrouvez tous les événements de CAURIS DIGITAL : Demo Days, ateliers, conférences tech, hackathons et webinaires en ligne accessibles depuis partout.',
};

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Agenda
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cauris-black mb-6">
              Événements
            </h1>
            <p className="text-lg text-cauris-gray-text leading-relaxed">
              Demo Days, ateliers, conférences et webinaires. En présentiel à Yaoundé et en ligne
              partout dans le monde.
            </p>
          </div>
        </div>
      </section>

      {/* Liste événements */}
      <EventsExplorer />

      {/* Newsletter événements */}
      <section className="section bg-cauris-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cauris-orange blur-3xl" />
        </div>
        <div className="container-cauris relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex w-14 h-14 rounded-full bg-cauris-orange/15 text-cauris-orange items-center justify-center mb-5">
              <Mail className="w-7 h-7" aria-hidden="true" />
            </div>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Newsletter événements
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-h2 leading-tight text-white mb-4">
              Ne manquez aucun événement CAURIS DIGITAL
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Inscrivez-vous à notre newsletter pour recevoir en priorité les annonces de nos Demo
              Days, ateliers et conférences — en ligne ou à Yaoundé.
            </p>
            <div className="mt-8 max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
