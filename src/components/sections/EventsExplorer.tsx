'use client';

import { useState, useMemo } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Tag } from 'lucide-react';

type EventType = 'Demo Day' | 'Atelier' | 'Conférence' | 'Hackathon' | 'Webinaire' | 'Networking';

interface Event {
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

/**
 * Données d'exemple — à remplacer par CMS.
 * Le statut "À venir / Passé" est calculé dynamiquement par rapport à la date du jour.
 */
const EVENTS: Event[] = [
  {
    id: 'demo-day-promo-2026',
    title: 'Demo Day — Promotion 2026 du programme Incubation',
    type: 'Demo Day',
    date: '2026-09-15',
    time: '15:00 GMT+1',
    place: 'Hôtel Hilton, Yaoundé',
    online: false,
    description:
      'Découvrez les 12 startups de la promotion 2026. Pitchs en direct devant un jury d\'investisseurs africains et internationaux. Networking et cocktail de clôture.',
    registerUrl: '#',
    free: true,
  },
  {
    id: 'atelier-pitch-investisseurs',
    title: 'Atelier : Préparer son pitch investisseurs',
    type: 'Atelier',
    date: '2026-06-20',
    time: '10:00 GMT+1',
    place: 'En ligne (Zoom)',
    online: true,
    description:
      'Atelier de 3 heures animé par notre directrice des programmes : structure du pitch, narratif, financials et préparation aux objections. Limité à 30 participants.',
    registerUrl: '#',
    free: true,
  },
  {
    id: 'webinaire-fintech-afrique',
    title: 'Webinaire : Fintech Afrique — Tendances 2026',
    type: 'Webinaire',
    date: '2026-07-12',
    time: '17:00 GMT+1',
    place: 'En ligne',
    online: true,
    description:
      'Table ronde avec des fondateurs et investisseurs leaders de la fintech africaine. Quels sont les modèles qui décollent ? Où va l\'argent ? Q&A en fin de session.',
    registerUrl: '#',
    free: true,
  },
  {
    id: 'journee-innovation-2026',
    title: 'Journée de l\'Innovation Ouverte 2026',
    type: 'Conférence',
    date: '2026-11-08',
    time: '09:00 GMT+1',
    place: 'Centre de Conférences, Yaoundé',
    online: false,
    description:
      'Notre événement annuel : startups, corporates, investisseurs et institutions réunis autour des enjeux tech africains. Pitchs, tables rondes, networking et annonces partenaires.',
    registerUrl: '#',
    free: false,
    price: '15 000 FCFA (gratuit pour startups CAURIS)',
  },
  // Événement passé (exemple)
  {
    id: 'hackathon-agritech-2025',
    title: 'Hackathon Agritech : nourrir l\'Afrique de demain',
    type: 'Hackathon',
    date: '2025-11-20',
    time: '09:00 GMT+1',
    place: 'Université de Yaoundé I',
    online: false,
    description:
      '48 heures pour imaginer les solutions agricoles de demain. 80 participants, 12 équipes finalistes, 3 prix décernés. Édition 2025 sponsorisée par Orange Digital Center.',
    registerUrl: '#',
    free: true,
  },
  {
    id: 'demo-day-promo-2025',
    title: 'Demo Day — Promotion 2025 du programme Incubation',
    type: 'Demo Day',
    date: '2025-09-12',
    time: '15:00 GMT+1',
    place: 'Hôtel Hilton, Yaoundé',
    online: false,
    description:
      'Présentation publique des startups diplômées de la promotion 2025. Édition record : 250 participants, 8 partenariats annoncés, 1,2M€ en intentions d\'investissement.',
    registerUrl: '#',
    free: true,
  },
];

const TYPE_COLORS: Record<EventType, string> = {
  'Demo Day': 'bg-cauris-orange text-white',
  Atelier: 'bg-cauris-success/15 text-cauris-success',
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

export default function EventsExplorer() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const today = new Date().toISOString().slice(0, 10);

  const { upcoming, past } = useMemo(() => {
    const upc: Event[] = [];
    const pst: Event[] = [];
    EVENTS.forEach((e) => {
      if (e.date >= today) upc.push(e);
      else pst.push(e);
    });
    upc.sort((a, b) => a.date.localeCompare(b.date));
    pst.sort((a, b) => b.date.localeCompare(a.date));
    return { upcoming: upc, past: pst };
  }, [today]);

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
            À venir <span className="ml-1 opacity-60">({upcoming.length})</span>
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
            Passés <span className="ml-1 opacity-60">({past.length})</span>
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
