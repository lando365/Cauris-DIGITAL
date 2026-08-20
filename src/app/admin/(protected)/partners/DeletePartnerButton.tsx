'use client';

import { useTransition } from 'react';
import { deletePartner } from './actions';

export function DeletePartnerButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Supprimer définitivement le partenaire « ${name} » ?`)) {
          startTransition(() => deletePartner(id));
        }
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? '…' : 'Supprimer'}
    </button>
  );
}
