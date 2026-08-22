import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { isEventPast } from '@/lib/event-status';
import { DeleteEventButton } from './DeleteEventButton';

export default async function AdminEventsPage() {
  const user = await requireAdminUser();
  const events = await prisma.event.findMany({ orderBy: { startDate: 'desc' } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-montserrat text-xl font-bold text-cauris-black">Événements</h1>
        <Link
          href="/admin/events/new"
          className="rounded-md bg-cauris-orange px-4 py-2 text-sm font-semibold text-white hover:bg-cauris-orange-dark"
        >
          + Nouvel événement
        </Link>
      </div>

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
                <td className="px-4 py-2">{e.startDate.toLocaleString('fr-FR')}</td>
                <td className="px-4 py-2">{isEventPast(e.startDate) ? 'Passé' : 'À venir'}</td>
                <td className="px-4 py-2">{e.isPublished ? 'Oui' : 'Non'}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/events/${e.id}/edit`}
                      className="text-cauris-orange hover:underline"
                    >
                      Modifier
                    </Link>
                    {user.role === 'ADMIN' && <DeleteEventButton id={e.id} title={e.title} />}
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-cauris-gray-secondary">
                  Aucun événement pour l'instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
