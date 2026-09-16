'use client';

import { useTransition } from 'react';
import { deleteRegistration } from './actions';

export function RegistrationRowActions({ id, canDelete }: { id: string; canDelete: boolean }) {
  const [isPending, startTransition] = useTransition();

  if (!canDelete) return null;

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm('Supprimer définitivement cette inscription ?')) {
          startTransition(() => deleteRegistration(id));
        }
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? '…' : 'Supprimer'}
    </button>
  );
}
