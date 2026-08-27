'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    setError(null);
    setStatus('sending');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error?.message ?? 'Une erreur est survenue.');
        setStatus('idle');
        return;
      }
      setStatus('sent');
    } catch {
      setError('Erreur réseau. Réessayez.');
      setStatus('idle');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cauris-black px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center font-montserrat text-xl font-bold text-cauris-black">
          CAURIS DIGITAL
        </h1>
        <p className="mb-6 text-center text-sm text-cauris-gray-secondary">Mot de passe oublié</p>

        {status === 'sent' ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-cauris-gray-text">
              Si un compte existe pour cet email, un lien de réinitialisation valable 1 heure vient
              d'être envoyé.
            </p>
            <Link
              href="/admin/login"
              className="text-sm font-semibold text-cauris-orange hover:underline"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-cauris-gray-text"
              >
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

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-md bg-cauris-orange px-4 py-2.5 font-semibold text-white transition-colors hover:bg-cauris-orange-dark disabled:opacity-60"
            >
              {status === 'sending' ? 'Envoi…' : 'Envoyer le lien de réinitialisation'}
            </button>

            <p className="text-center text-sm">
              <Link href="/admin/login" className="text-cauris-gray-secondary hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
