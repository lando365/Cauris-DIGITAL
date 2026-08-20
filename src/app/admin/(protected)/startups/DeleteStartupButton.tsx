'use client';

import { useTransition } from 'react';
import { deleteStartup } from './actions';

export function DeleteStartupButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Supprimer définitivement la startup « ${name} » ?`)) {
          startTransition(() => deleteStartup(id));
        }
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? '…' : 'Supprimer'}
    </button>
  );
}
