'use client';

import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { resetPasswordWithToken, type ResetPasswordFormState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-cauris-orange px-4 py-2.5 font-semibold text-white transition-colors hover:bg-cauris-orange-dark disabled:opacity-60"
    >
      {pending ? 'Réinitialisation…' : 'Réinitialiser le mot de passe'}
    </button>
  );
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const action: (
    state: ResetPasswordFormState,
    formData: FormData
  ) => Promise<ResetPasswordFormState> = resetPasswordWithToken.bind(null, token);
  const [state, formAction] = useFormState(action, undefined);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cauris-black px-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-xl">
          <p className="mb-4 text-sm text-cauris-gray-text">
            Lien de réinitialisation manquant ou invalide.
          </p>
          <Link
            href="/admin/forgot-password"
            className="text-sm font-semibold text-cauris-orange hover:underline"
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cauris-black px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center font-montserrat text-xl font-bold text-cauris-black">
          CAURIS DIGITAL
        </h1>
        <p className="mb-6 text-center text-sm text-cauris-gray-secondary">Nouveau mot de passe</p>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-cauris-gray-text"
            >
              Nouveau mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cauris-orange focus:outline-none focus:ring-1 focus:ring-cauris-orange"
            />
            <p className="mt-1 text-xs text-cauris-gray-secondary">
              12 caractères minimum, avec majuscule, chiffre et caractère spécial.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-cauris-gray-text"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cauris-orange focus:outline-none focus:ring-1 focus:ring-cauris-orange"
            />
          </div>

          {state?.error && (
            <p role="alert" className="text-sm text-red-600">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
