'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DeleteEventButton } from './DeleteEventButton';

export interface AdminEvent {
  id: string;
  title: string;
  type: string;
  startDateIso: string;
  isPast: boolean;
  isPublished: boolean;
}

const MONTH_LABEL = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildMonthGrid(month: Date): Date[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstOfMonth = new Date(year, monthIndex, 1);
  // Lundi = 0 ... Dimanche = 6 (getDay() renvoie 0 = dimanche)
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, monthIndex, 1 - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

// CDC V2 §8.2.4 : "Vue calendrier mensuel + vue liste."
export function EventsAdminView({ events, canDelete }: { events: AdminEvent[]; canDelete: boolean }) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [month, setMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const eventsByDay = new Map<string, AdminEvent[]>();
  for (const e of events) {
    const key = e.startDateIso.slice(0, 10);
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), e]);
  }

  return (
    <div>
      <div className="mb-4 inline-flex rounded-md border border-gray-300 bg-white p-1 text-sm">
        <button
          type="button"
          onClick={() => setView('list')}
          className={`rounded px-3 py-1 font-semibold ${view === 'list' ? 'bg-cauris-orange text-white' : 'text-cauris-gray-text'}`}
        >
          Liste
        </button>
        <button
          type="button"
          onClick={() => setView('calendar')}
          className={`rounded px-3 py-1 font-semibold ${view === 'calendar' ? 'bg-cauris-orange text-white' : 'text-cauris-gray-text'}`}
        >
          Calendrier
        </button>
      </div>

      {view === 'list' ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-cauris-gray-secondary">
              <tr>
                <th className="px-4 py-2">Titre</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Date de début</th>
                <th className="px-4 py-2">État</th>
                <th className="px-4 py-2">Publié</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2 font-medium text-cauris-black">{e.title}</td>
                  <td className="px-4 py-2">{e.type}</td>
                  <td className="px-4 py-2">
                    {new Date(e.startDateIso).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-4 py-2">{e.isPast ? 'Passé' : 'À venir'}</td>
                  <td className="px-4 py-2">{e.isPublished ? 'Oui' : 'Non'}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-3">
                      <Link href={`/admin/events/${e.id}/edit`} className="text-cauris-orange hover:underline">
                        Modifier
                      </Link>
                      {canDelete && <DeleteEventButton id={e.id} title={e.title} />}
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-cauris-gray-secondary">
                    Aucun événement pour l&apos;instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
            >
              ← Précédent
            </button>
            <p className="font-montserrat text-sm font-bold capitalize text-cauris-black">
              {MONTH_LABEL.format(month)}
            </p>
            <button
              type="button"
              onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
            >
              Suivant →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs">
            {WEEKDAYS.map((w) => (
              <div key={w} className="px-1 py-1 text-center font-semibold text-cauris-gray-secondary">
                {w}
              </div>
            ))}
            {buildMonthGrid(month).map((day) => {
              const key = dayKey(day);
              const dayEvents = eventsByDay.get(key) ?? [];
              const inCurrentMonth = day.getMonth() === month.getMonth();
              return (
                <div
                  key={key}
                  className={`min-h-[72px] rounded border border-gray-100 p-1 ${
                    inCurrentMonth ? 'bg-white' : 'bg-gray-50 text-cauris-gray-secondary'
                  }`}
                >
                  <p className="mb-1 text-right">{day.getDate()}</p>
                  <ul className="space-y-0.5">
                    {dayEvents.map((e) => (
                      <li key={e.id}>
                        <Link
                          href={`/admin/events/${e.id}/edit`}
                          title={e.title}
                          className="block truncate rounded bg-cauris-orange/10 px-1 py-0.5 text-cauris-orange hover:bg-cauris-orange/20"
                        >
                          {e.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
