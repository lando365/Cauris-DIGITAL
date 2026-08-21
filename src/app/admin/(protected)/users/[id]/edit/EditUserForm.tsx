'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { User } from '@prisma/client';
import type { UserFormState } from '../../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-cauris-orange px-5 py-2 text-sm font-semibold text-white hover:bg-cauris-orange-dark disabled:opacity-60"
    >
      {pending ? 'Enregistrement…' : 'Enregistrer'}
    </button>
  );
}

export function EditUserForm({
  user,
  isSelf,
  action,
}: {
  user: User;
  isSelf: boolean;
  action: (state: UserFormState, formData: FormData) => Promise<UserFormState>;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Nom
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={user.name}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-cauris-gray-text">Email</label>
        <p className="text-sm text-cauris-gray-secondary">{user.email}</p>
      </div>
      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Rôle
        </label>
        <select
          id="role"
          name="role"
          defaultValue={user.role}
          disabled={isSelf}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
        >
          <option value="EDITOR">EDITOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        {isSelf && (
          <p className="mt-1 text-xs text-cauris-gray-secondary">
            Vous ne pouvez pas modifier votre propre rôle.
          </p>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm text-cauris-gray-text">
        <input type="checkbox" name="isActive" defaultChecked={user.isActive} disabled={isSelf} />
        Compte actif
      </label>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
