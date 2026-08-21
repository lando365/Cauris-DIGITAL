'use client';

import { useTransition } from 'react';
import { unsubscribeSubscriber } from './actions';

export function UnsubscribeButton({ id, email }: { id: string; email: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Désinscrire manuellement « ${email} » ?`)) {
          startTransition(() => unsubscribeSubscriber(id));
        }
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? '…' : 'Désinscrire'}
    </button>
  );
}
