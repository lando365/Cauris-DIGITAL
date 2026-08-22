// CDC V2 RM-E02 : isPast n'est pas une colonne stockée, calculé dynamiquement.
export function isEventPast(startDate: Date, now: Date = new Date()): boolean {
  return startDate < now;
}
