import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { isEventPast } from '@/lib/event-status';
import { EventsAdminView } from './EventsAdminView';

export default async function AdminEventsPage() {
  const user = await requireAdminUser();
  const events = await prisma.event.findMany({ orderBy: { startDate: 'desc' } });

  const serialized = events.map((e) => ({
    id: e.id,
    title: e.title,
    type: e.type,
    startDateIso: e.startDate.toISOString(),
    isPast: isEventPast(e.startDate),
    isPublished: e.isPublished,
  }));

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

      <EventsAdminView events={serialized} canDelete={user.role === 'ADMIN'} />
    </div>
  );
}
