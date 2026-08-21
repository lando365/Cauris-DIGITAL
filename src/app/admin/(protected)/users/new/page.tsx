'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createUser } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-cauris-orange px-5 py-2 text-sm font-semibold text-white hover:bg-cauris-orange-dark disabled:opacity-60"
    >
      {pending ? 'Création…' : "Créer l'utilisateur"}
    </button>
  );
}

export default function NewUserPage() {
  const [state, formAction] = useFormState(createUser, undefined);

  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">Nouvel utilisateur</h1>
      <form action={formAction} className="max-w-md space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Nom
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Rôle
          </label>
          <select
            id="role"
            name="role"
            defaultValue="EDITOR"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="EDITOR">EDITOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Mot de passe initial
          </label>
          <input
            id="password"
            name="password"
            type="text"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-cauris-gray-secondary">
            Minimum 12 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial.
          </p>
        </div>

        {state?.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
