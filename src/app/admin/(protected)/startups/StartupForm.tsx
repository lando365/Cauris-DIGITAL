'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { Startup } from '@prisma/client';
import type { StartupFormState } from './actions';
import { FileUploadField } from '@/components/admin/FileUploadField';

const SECTORS = ['AGRITECH', 'FINTECH', 'EDTECH', 'HEALTHTECH', 'SMART_CITIES'] as const;
const STATUSES = ['EN_INCUBATION', 'DIPLOMEE', 'ALUMNI'] as const;

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

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-cauris-gray-text">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ''}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cauris-orange focus:outline-none focus:ring-1 focus:ring-cauris-orange"
      />
    </div>
  );
}

export function StartupForm({
  startup,
  action,
  submitLabel,
}: {
  startup?: Startup;
  action: (state: StartupFormState, formData: FormData) => Promise<StartupFormState>;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {startup?.slug && (
        <a
          href={`/fr/startups/${startup.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-semibold text-cauris-orange hover:underline"
        >
          Aperçu de la page publique ↗
        </a>
      )}

      <fieldset className="space-y-4">
        <legend className="mb-2 font-montserrat text-sm font-bold text-cauris-black">
          Identité
        </legend>
        <Field label="Slug (URL)" name="slug" defaultValue={startup?.slug} required />
        <Field label="Nom" name="name" defaultValue={startup?.name} required />
        <Field label="Phrase d'accroche" name="tagline" defaultValue={startup?.tagline} required />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-montserrat text-sm font-bold text-cauris-black">
          Description
        </legend>
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-cauris-gray-text"
          >
            Description courte
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            defaultValue={startup?.description}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cauris-orange focus:outline-none focus:ring-1 focus:ring-cauris-orange"
          />
        </div>
        <div>
          <label
            htmlFor="longDescription"
            className="mb-1 block text-sm font-medium text-cauris-gray-text"
          >
            Description longue (page détail)
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            rows={5}
            defaultValue={startup?.longDescription ?? ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cauris-orange focus:outline-none focus:ring-1 focus:ring-cauris-orange"
          />
        </div>
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-4">
        <legend className="col-span-2 mb-2 font-montserrat text-sm font-bold text-cauris-black">
          Classification
        </legend>
        <div>
          <label htmlFor="sector" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Secteur
          </label>
          <select
            id="sector"
            name="sector"
            defaultValue={startup?.sector ?? SECTORS[0]}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={startup?.status ?? STATUSES[0]}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <Field label="Pays" name="countryName" defaultValue={startup?.countryName} required />
        <Field
          label="Code pays (ISO, ex: CM)"
          name="countryCode"
          defaultValue={startup?.countryCode}
          required
        />
        <Field label="Ville" name="city" defaultValue={startup?.city ?? ''} />
        <Field
          label="Année d'entrée au programme"
          name="year"
          type="number"
          defaultValue={startup?.year}
          required
        />
        <Field
          label="Année de fondation"
          name="foundedYear"
          type="number"
          defaultValue={startup?.foundedYear ?? ''}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-montserrat text-sm font-bold text-cauris-black">
          Liens & image
        </legend>
        <FileUploadField
          label="Logo"
          name="logoUrl"
          entityType="startup"
          defaultValue={startup?.logoUrl}
        />
        <Field
          label="Site web (https://…)"
          name="websiteUrl"
          defaultValue={startup?.websiteUrl ?? ''}
        />
        <Field label="LinkedIn" name="linkedinUrl" defaultValue={startup?.linkedinUrl ?? ''} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-montserrat text-sm font-bold text-cauris-black">
          Technologies, fondateurs, étapes marquantes
        </legend>
        <p className="text-xs text-cauris-gray-secondary">Une valeur par ligne.</p>
        <div>
          <label
            htmlFor="technologies"
            className="mb-1 block text-sm font-medium text-cauris-gray-text"
          >
            Technologies
          </label>
          <textarea
            id="technologies"
            name="technologies"
            rows={3}
            defaultValue={startup?.technologies.join('\n') ?? ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="founders"
            className="mb-1 block text-sm font-medium text-cauris-gray-text"
          >
            Fondateurs
          </label>
          <textarea
            id="founders"
            name="founders"
            rows={2}
            defaultValue={startup?.founders.join('\n') ?? ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="achievements"
            className="mb-1 block text-sm font-medium text-cauris-gray-text"
          >
            Étapes marquantes
          </label>
          <textarea
            id="achievements"
            name="achievements"
            rows={3}
            defaultValue={startup?.achievements.join('\n') ?? ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-cauris-gray-text">
        <input type="checkbox" name="isFeatured" defaultChecked={startup?.isFeatured} />
        Mettre en avant sur la page d'accueil
      </label>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
