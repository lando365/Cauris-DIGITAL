'use client';

import { useState, useMemo } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Tag } from 'lucide-react';

export type EventType = 'Demo Day' | 'Atelier' | 'Conférence' | 'Hackathon' | 'Webinaire' | 'Networking';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO YYYY-MM-DD
  time: string;
  place: string;
  online: boolean;
  description: string;
  registerUrl: string;
  free: boolean;
  price?: string;
}

const TYPE_COLORS: Record<EventType, string> = {
  'Demo Day': 'bg-cauris-orange text-white',
  Atelier: 'bg-cauris-success/15 text-cauris-success-text',
  Conférence: 'bg-cauris-black text-white',
  Hackathon: 'bg-purple-100 text-purple-700',
  Webinaire: 'bg-blue-100 text-blue-700',
  Networking: 'bg-pink-100 text-pink-700',
};

function formatDate(iso: string): string {
  const date = new Date(iso + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function EventsExplorer({ events }: { events: Event[] }) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const today = new Date().toISOString().slice(0, 10);

  const { upcoming, past } = useMemo(() => {
    const upc: Event[] = [];
    const pst: Event[] = [];
    events.forEach((e) => {
      if (e.date >= today) upc.push(e);
      else pst.push(e);
    });
    upc.sort((a, b) => a.date.localeCompare(b.date));
    pst.sort((a, b) => b.date.localeCompare(a.date));
    return { upcoming: upc, past: pst };
  }, [events, today]);

  const visible = tab === 'upcoming' ? upcoming : past;

  return (
    <section className="section">
      <div className="container-cauris">
        {/* Onglets */}
        <div
          role="tablist"
          aria-label="Filtrer les événements"
          className="inline-flex bg-cauris-cream rounded-btn p-1 mb-10"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'upcoming'}
            onClick={() => setTab('upcoming')}
            className={`px-5 py-2.5 rounded-btn text-sm font-semibold transition-all ${
              tab === 'upcoming'
                ? 'bg-white text-cauris-black shadow-card'
                : 'text-cauris-gray-secondary hover:text-cauris-black'
            }`}
          >
            À venir <span className="ml-1">({upcoming.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'past'}
            onClick={() => setTab('past')}
            className={`px-5 py-2.5 rounded-btn text-sm font-semibold transition-all ${
              tab === 'past'
                ? 'bg-white text-cauris-black shadow-card'
                : 'text-cauris-gray-secondary hover:text-cauris-black'
            }`}
          >
            Passés <span className="ml-1">({past.length})</span>
          </button>
        </div>

        {/* Liste */}
        {visible.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex w-14 h-14 rounded-full bg-cauris-orange/10 text-cauris-orange items-center justify-center mb-4">
              <Calendar className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="font-heading font-bold text-xl text-cauris-black mb-2">
              {tab === 'upcoming' ? 'Aucun événement à venir' : 'Aucun événement passé'}
            </h3>
            <p className="text-cauris-gray-text">
              {tab === 'upcoming'
                ? 'Revenez bientôt — de nouveaux événements sont publiés régulièrement.'
                : 'Les premiers événements seront bientôt archivés ici.'}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
            {visible.map((event) => {
              const typeColor = TYPE_COLORS[event.type];
              const isPast = tab === 'past';
              return (
                <article
                  key={event.id}
                  className={`card p-6 lg:p-7 border border-gray-100 bg-white h-full flex flex-col ${
                    isPast ? 'opacity-90' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${typeColor}`}>
                      <Tag className="w-3 h-3" aria-hidden="true" />
                      {event.type}
                    </span>
                    {!event.free && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-cauris-cream text-cauris-orange">
                        Payant
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-xl text-cauris-black mb-3 leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-sm text-cauris-gray-text leading-relaxed mb-5 flex-1">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-cauris-gray-secondary mb-5 pt-4 border-t border-gray-100">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                      {formatDate(event.date)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                      {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                      {event.place}
                    </p>
                    {event.price && (
                      <p className="text-xs italic">{event.price}</p>
                    )}
                  </div>

                  {!isPast && (
                    <a
                      href={event.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 self-start text-cauris-orange font-semibold text-sm hover:underline"
                    >
                      S&apos;inscrire
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
