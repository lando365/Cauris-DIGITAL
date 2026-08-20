import { EventForm } from '../EventForm';
import { createEvent } from '../actions';

export default function NewEventPage() {
  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">Nouvel événement</h1>
      <EventForm action={createEvent} submitLabel="Créer l'événement" />
    </div>
  );
}
