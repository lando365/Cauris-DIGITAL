import { describe, it, expect } from 'vitest';
import { isEventPast } from './event-status';

// CDC V2 RM-E02 : isPast = (startDate < NOW()), calculé dynamiquement, pas de colonne dédiée.
describe('isEventPast (RM-E02)', () => {
  const now = new Date('2026-06-15T12:00:00.000Z');

  it('retourne true pour une date de début dans le passé', () => {
    expect(isEventPast(new Date('2026-06-01T00:00:00.000Z'), now)).toBe(true);
  });

  it('retourne false pour une date de début dans le futur', () => {
    expect(isEventPast(new Date('2026-07-01T00:00:00.000Z'), now)).toBe(false);
  });

  it('retourne false pour une date de début strictement égale à maintenant', () => {
    expect(isEventPast(now, now)).toBe(false);
  });
});
