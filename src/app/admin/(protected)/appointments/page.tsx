import Link from 'next/link';
import { requireAdminUser } from '@/lib/require-admin';
import {
  getCalendlyUser,
  listScheduledEvents,
  getEventInvitees,
  CalendlyError,
  type CalendlyScheduledEvent,
} from '@/lib/calendly';
import { AppointmentRowActions } from './AppointmentRowActions';

const TABS = [
  { label: 'À venir', value: 'active' as const },
  { label: 'Annulés', value: 'canceled' as const },
];

interface AppointmentRow {
  event: CalendlyScheduledEvent;
  inviteeName: string;
  inviteeEmail: string;
}

/**
 * Module admin "Rendez-vous" — lit les événements planifiés via l'API
 * Calendly (CALENDLY_API_TOKEN) et permet de les annuler directement.
 * Aucune donnée Calendly n'est stockée en base : tout est lu en direct.
 */
export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const user = await requireAdminUser();
  const activeTab = status === 'canceled' ? 'canceled' : 'active';

  let rows: AppointmentRow[] = [];
  let errorMessage: string | null = null;

  try {
    const calendlyUser = await getCalendlyUser();
    const events = await listScheduledEvents({ userUri: calendlyUser.uri, status: activeTab });
    rows = await Promise.all(
      events.map(async (event) => {
        const invitees = await getEventInvitees(event.uri);
        const invitee = invitees[0];
        return {
          event,
          inviteeName: invitee?.name ?? '—',
          inviteeEmail: invitee?.email ?? '—',
        };
      })
    );
  } catch (err) {
    errorMessage =
      err instanceof CalendlyError
        ? err.message
        : 'Impossible de contacter Calendly pour le moment.';
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-montserrat text-xl font-bold text-cauris-black">Rendez-vous</h1>
      </div>

      <div className="mb-4 flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/appointments?status=${tab.value}`}
            className={`px-4 py-2 text-sm ${
              activeTab === tab.value
                ? 'border-b-2 border-cauris-orange font-semibold text-cauris-orange'
                : 'text-cauris-gray-secondary hover:text-cauris-black'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Connexion à Calendly impossible</p>
          <p className="mt-1">{errorMessage}</p>
          <p className="mt-2 text-xs text-red-600">
            Vérifie que <code>CALENDLY_API_TOKEN</code> est configuré avec la portée
            « Planification » + « Gestion des utilisateurs » (lecture).
          </p>
        </div>
      )}

      {!errorMessage && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-cauris-gray-secondary">
              <tr>
                <th className="px-4 py-2">Invité</th>
                <th className="px-4 py-2">Événement</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Lien</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ event, inviteeName, inviteeEmail }) => (
                <tr key={event.uri} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2">
                    <p className="font-medium text-cauris-black">{inviteeName}</p>
                    <p className="text-xs text-cauris-gray-secondary">{inviteeEmail}</p>
                  </td>
                  <td className="px-4 py-2">{event.name ?? '—'}</td>
                  <td className="px-4 py-2">
                    {new Date(event.start_time).toLocaleString('fr-FR', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-4 py-2">
                    {event.location?.join_url ? (
                      <a
                        href={event.location.join_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cauris-orange hover:underline"
                      >
                        Rejoindre
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {activeTab === 'active' && (
                      <AppointmentRowActions
                        eventUri={event.uri}
                        canCancel={user.role === 'ADMIN'}
                      />
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-cauris-gray-secondary">
                    Aucun rendez-vous {activeTab === 'active' ? 'à venir' : 'annulé'} pour
                    l&apos;instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
