'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminUser } from '@/lib/require-admin';
import { cancelScheduledEvent, CalendlyError } from '@/lib/calendly';

export type CancelAppointmentState = { error?: string } | undefined;

/** Annule un rendez-vous Calendly (ADMIN uniquement) — action réelle, l'invité est notifié. */
export async function cancelAppointment(eventUri: string): Promise<CancelAppointmentState> {
  await requireAdminUser('ADMIN');

  try {
    await cancelScheduledEvent(eventUri, 'Annulé par CAURIS DIGITAL depuis l’espace admin.');
  } catch (err) {
    const message =
      err instanceof CalendlyError ? err.message : "Impossible d'annuler ce rendez-vous.";
    return { error: message };
  }

  revalidatePath('/admin/appointments');
  return undefined;
}
