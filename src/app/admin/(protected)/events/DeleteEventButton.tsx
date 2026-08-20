'use client';

import { useTransition } from 'react';
import { deleteEvent } from './actions';

export function DeleteEventButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Supprimer définitivement l'événement « ${title} » ?`)) {
          startTransition(() => deleteEvent(id));
        }
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? '…' : 'Supprimer'}
    </button>
  );
}
