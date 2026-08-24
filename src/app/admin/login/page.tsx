'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-cauris-orange px-4 py-2.5 font-semibold text-white transition-colors hover:bg-cauris-orange-dark disabled:opacity-60"
    >
      {pending ? 'Connexion…' : 'Se connecter'}
    </button>
  );
}

export default function AdminLoginPage() {
  const [error, formAction] = useFormState(loginAction, undefined);
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';

  return (
    <div className="flex min-h-screen items-center justify-center bg-cauris-black px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center font-montserrat text-xl font-bold text-cauris-black">
          CAURIS DIGITAL
        </h1>
        <p className="mb-6 text-center text-sm text-cauris-gray-secondary">
          Espace administrateur
        </p>

        {resetSuccess && (
          <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-center text-sm text-green-700">
            Mot de passe réinitialisé. Vous pouvez vous connecter.
          </p>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-cauris-gray-text">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cauris-orange focus:outline-none focus:ring-1 focus:ring-cauris-orange"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-cauris-gray-text">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cauris-orange focus:outline-none focus:ring-1 focus:ring-cauris-orange"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <SubmitButton />

          <p className="text-center text-sm">
            <Link href="/admin/forgot-password" className="text-cauris-gray-secondary hover:underline">
              Mot de passe oublié ?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
