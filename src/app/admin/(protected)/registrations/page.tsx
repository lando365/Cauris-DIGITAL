import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { RegistrationRowActions } from './RegistrationRowActions';

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ eventId?: string }>;
}) {
  const { eventId } = await searchParams;
  const user = await requireAdminUser();

  const [registrations, events] = await Promise.all([
    prisma.eventRegistration.findMany({
      where: eventId ? { eventId } : {},
      include: { event: { select: { id: true, title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.event.findMany({
      select: { id: true, title: true },
      orderBy: { startDate: 'desc' },
    }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-montserrat text-xl font-bold text-cauris-black">Inscriptions</h1>
      </div>

      <form className="mb-4 flex gap-2" method="get">
        <select
          name="eventId"
          defaultValue={eventId ?? ''}
          className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Tous les événements</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-cauris-black hover:bg-gray-50"
        >
          Filtrer
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-cauris-gray-secondary">
            <tr>
              <th className="px-4 py-2">Événement</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Téléphone</th>
              <th className="px-4 py-2">Participants</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/registrations?eventId=${r.eventId}`}
                    className="text-cauris-orange hover:underline"
                  >
                    {r.event.title}
                  </Link>
                </td>
                <td className="px-4 py-2 font-medium text-cauris-black">
                  {r.firstName} {r.lastName}
                </td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">{r.phone ?? '—'}</td>
                <td className="px-4 py-2">{r.guestsCount}</td>
                <td className="px-4 py-2">{r.createdAt.toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-2">
                  <RegistrationRowActions id={r.id} canDelete={user.role === 'ADMIN'} />
                </td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-cauris-gray-secondary">
                  Aucune inscription pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
