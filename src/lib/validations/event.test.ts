import { describe, it, expect } from 'vitest';
import { eventSchema } from './event';

const validInput = {
  slug: 'demo-day-2026',
  title: 'Demo Day 2026',
  description: 'Présentation des startups de la promo 2026.',
  type: 'DEMO_DAY',
  startDate: '2026-09-15T10:00:00.000Z',
  location: 'Yaoundé',
};

describe('eventSchema', () => {
  it('accepte une entrée valide', () => {
    const result = eventSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  // RM-E01 : la date de fin doit être après la date de début
  it('refuse une date de fin antérieure à la date de début (RM-E01)', () => {
    const result = eventSchema.safeParse({
      ...validInput,
      endDate: '2026-09-15T08:00:00.000Z', // avant startDate
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'endDate')).toBe(true);
    }
  });

  it('accepte une date de fin postérieure à la date de début (RM-E01)', () => {
    const result = eventSchema.safeParse({
      ...validInput,
      endDate: '2026-09-15T12:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  // RM-E03 : si isFree = false, le prix est requis
  it('refuse un événement payant sans prix (RM-E03)', () => {
    const result = eventSchema.safeParse({ ...validInput, isFree: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'price')).toBe(true);
    }
  });

  it('accepte un événement payant avec un prix renseigné (RM-E03)', () => {
    const result = eventSchema.safeParse({ ...validInput, isFree: false, price: '10 000 FCFA' });
    expect(result.success).toBe(true);
  });

  it('accepte un événement gratuit sans prix (RM-E03, cas par défaut)', () => {
    const result = eventSchema.safeParse({ ...validInput, isFree: true });
    expect(result.success).toBe(true);
  });

  // RM-E04 : le lien d'inscription doit utiliser HTTPS
  it('refuse un lien d’inscription en http:// (RM-E04)', () => {
    const result = eventSchema.safeParse({ ...validInput, registerUrl: 'http://example.com' });
    expect(result.success).toBe(false);
  });

  it('accepte un lien d’inscription en https:// (RM-E04)', () => {
    const result = eventSchema.safeParse({ ...validInput, registerUrl: 'https://example.com' });
    expect(result.success).toBe(true);
  });

  it('refuse un type d’événement hors de l’énumération du CDC (§5.3.4)', () => {
    const result = eventSchema.safeParse({ ...validInput, type: 'MEETUP' });
    expect(result.success).toBe(false);
  });
});
