import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { EventForm } from '../../EventForm';
import { updateEvent } from '../../actions';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const action = updateEvent.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">
        Modifier « {event.title} »
      </h1>
      <EventForm event={event} action={action} submitLabel="Enregistrer" />
    </div>
  );
}
