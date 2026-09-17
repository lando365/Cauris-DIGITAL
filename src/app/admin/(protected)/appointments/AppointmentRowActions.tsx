'use client';

import { useState, useTransition } from 'react';
import { cancelAppointment } from './actions';

export function AppointmentRowActions({
  eventUri,
  canCancel,
}: {
  eventUri: string;
  canCancel: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  if (!canCancel) return null;

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (!confirm('Annuler ce rendez-vous ? La personne inscrite sera notifiée par email.')) {
            return;
          }
          setError('');
          startTransition(async () => {
            const result = await cancelAppointment(eventUri);
            if (result?.error) setError(result.error);
          });
        }}
        className="text-sm text-red-600 hover:underline disabled:opacity-50"
      >
        {isPending ? '…' : 'Annuler'}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
