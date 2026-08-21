'use client';

import { useTransition } from 'react';
import type { ContactMessageStatus } from '@prisma/client';
import { updateMessageStatus, deleteMessage } from './actions';

const STATUSES: ContactMessageStatus[] = ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'];

export function MessageRowActions({
  id,
  status,
  canDelete,
}: {
  id: string;
  status: ContactMessageStatus;
  canDelete: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <select
        defaultValue={status}
        disabled={isPending}
        onChange={(e) =>
          startTransition(() => updateMessageStatus(id, e.target.value as ContactMessageStatus))
        }
        className="rounded-md border border-gray-300 px-2 py-1 text-xs"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {canDelete && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm('Supprimer définitivement ce message ?')) {
              startTransition(() => deleteMessage(id));
            }
          }}
          className="text-xs text-red-600 hover:underline disabled:opacity-50"
        >
          Supprimer
        </button>
      )}
    </div>
  );
}
