'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { Event } from '@prisma/client';
import type { EventFormState } from './actions';
import { FileUploadField } from '@/components/admin/FileUploadField';

const TYPES = [
  'DEMO_DAY',
  'ATELIER',
  'WEBINAIRE',
  'HACKATHON',
  'NETWORKING',
  'CONFERENCE',
] as const;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-cauris-orange px-5 py-2 text-sm font-semibold text-white hover:bg-cauris-orange-dark disabled:opacity-60"
    >
      {pending ? 'Enregistrement…' : label}
    </button>
  );
}

function toDatetimeLocal(date: Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function EventForm({
  event,
  action,
  submitLabel,
}: {
  event?: Event;
  action: (state: EventFormState, formData: FormData) => Promise<EventFormState>;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          required
          defaultValue={event?.slug}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Titre
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={event?.title}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-cauris-gray-text"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={event?.description}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={event?.type ?? TYPES[0]}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="mb-1 block text-sm font-medium text-cauris-gray-text"
          >
            Lieu (ou « En ligne »)
          </label>
          <input
            id="location"
            name="location"
            required
            defaultValue={event?.location}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="mb-1 block text-sm font-medium text-cauris-gray-text"
          >
            Date et heure de début
          </label>
          <input
            id="startDate"
            name="startDate"
            type="datetime-local"
            required
            defaultValue={toDatetimeLocal(event?.startDate)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Date et heure de fin
          </label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            defaultValue={toDatetimeLocal(event?.endDate)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="registerUrl"
          className="mb-1 block text-sm font-medium text-cauris-gray-text"
        >
          Lien d&apos;inscription (https://…)
        </label>
        <input
          id="registerUrl"
          name="registerUrl"
          defaultValue={event?.registerUrl ?? ''}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <FileUploadField
        label="Image"
        name="imageUrl"
        entityType="event"
        defaultValue={event?.imageUrl}
      />
      <div>
        <label htmlFor="price" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Prix (si payant)
        </label>
        <input
          id="price"
          name="price"
          defaultValue={event?.price ?? ''}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-cauris-gray-text">
          <input type="checkbox" name="isOnline" defaultChecked={event?.isOnline} />
          En ligne
        </label>
        <label className="flex items-center gap-2 text-sm text-cauris-gray-text">
          <input type="checkbox" name="isFree" defaultChecked={event?.isFree ?? true} />
          Gratuit
        </label>
        <label className="flex items-center gap-2 text-sm text-cauris-gray-text">
          <input type="checkbox" name="isPublished" defaultChecked={event?.isPublished} />
          Visible publiquement
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
