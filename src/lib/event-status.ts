// CDC V2 RM-E02 : isPast n'est pas une colonne stockée, calculé dynamiquement.
/** Indique si un événement est déjà passé par rapport à `now` (par défaut : maintenant). */
export function isEventPast(startDate: Date, now: Date = new Date()): boolean {
  return startDate < now;
}
