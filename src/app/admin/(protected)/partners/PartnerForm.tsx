'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { Partner } from '@prisma/client';
import type { PartnerFormState } from './actions';
import { FileUploadField } from '@/components/admin/FileUploadField';

const CATEGORIES = ['INSTITUTIONNEL', 'FINANCIER', 'ACADEMIQUE', 'CORPORATIF'] as const;

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

export function PartnerForm({
  partner,
  action,
  submitLabel,
}: {
  partner?: Partner;
  action: (state: PartnerFormState, formData: FormData) => Promise<PartnerFormState>;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Nom
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={partner?.name}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <FileUploadField
        label="Logo"
        name="logoUrl"
        entityType="partner"
        defaultValue={partner?.logoUrl}
      />
      <div>
        <label htmlFor="websiteUrl" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Site web
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          defaultValue={partner?.websiteUrl ?? ''}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            defaultValue={partner?.category ?? CATEGORIES[0]}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="displayOrder" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Ordre d'affichage
          </label>
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            defaultValue={partner?.displayOrder ?? 0}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-cauris-gray-text">
        <input type="checkbox" name="isFeatured" defaultChecked={partner?.isFeatured} />
        Afficher sur la page d'accueil
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
