'use client';

import { useTransition } from 'react';
import type { SubscriberStatus } from '@prisma/client';
import { unsubscribeSubscriber, deleteSubscriber } from './actions';

export function SubscriberRowActions({
  id,
  email,
  status,
}: {
  id: string;
  email: string;
  status: SubscriberStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      {status === 'ACTIVE' && (
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
      )}
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm(`Supprimer définitivement les données de « ${email} » ? Cette action est irréversible.`)) {
            startTransition(() => deleteSubscriber(id));
          }
        }}
        className="text-sm text-red-600 hover:underline disabled:opacity-50"
      >
        {isPending ? '…' : 'Supprimer'}
      </button>
    </div>
  );
}
