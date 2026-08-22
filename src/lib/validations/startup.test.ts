import { describe, it, expect } from 'vitest';
import { startupSchema, parseListField } from './startup';

const currentYear = new Date().getFullYear();

const validInput = {
  slug: 'farmtrack',
  name: 'FarmTrack',
  tagline: 'Traçabilité agricole pour petits producteurs.',
  description: 'Une description de test suffisamment longue.',
  sector: 'AGRITECH',
  countryName: 'Cameroun',
  countryCode: 'cm',
  status: 'EN_INCUBATION',
  year: currentYear,
};

describe('startupSchema', () => {
  it('accepte une entrée valide', () => {
    const result = startupSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('met en majuscules le code pays', () => {
    const result = startupSchema.parse(validInput);
    expect(result.countryCode).toBe('CM');
  });

  // RM-S02 : l'année d'entrée au programme ne peut pas être dans le futur
  it('refuse une année de programme dans le futur (RM-S02)', () => {
    const result = startupSchema.safeParse({ ...validInput, year: currentYear + 1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('futur');
    }
  });

  it('accepte l’année courante (RM-S02, cas limite)', () => {
    const result = startupSchema.safeParse({ ...validInput, year: currentYear });
    expect(result.success).toBe(true);
  });

  // RM-S03 : l'année de fondation doit être <= année courante
  it('refuse une année de fondation dans le futur (RM-S03)', () => {
    const result = startupSchema.safeParse({ ...validInput, foundedYear: currentYear + 1 });
    expect(result.success).toBe(false);
  });

  it('accepte une année de fondation absente (optionnelle)', () => {
    const result = startupSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  // RM-S04 : websiteUrl doit commencer par https://
  it('refuse un site web en http:// (RM-S04)', () => {
    const result = startupSchema.safeParse({ ...validInput, websiteUrl: 'http://example.com' });
    expect(result.success).toBe(false);
  });

  it('accepte un site web en https:// (RM-S04)', () => {
    const result = startupSchema.safeParse({ ...validInput, websiteUrl: 'https://example.com' });
    expect(result.success).toBe(true);
  });

  it('accepte un websiteUrl vide (champ optionnel)', () => {
    const result = startupSchema.safeParse({ ...validInput, websiteUrl: '' });
    expect(result.success).toBe(true);
  });

  // RM-S07 : le nom doit contenir entre 2 et 100 caractères
  it('refuse un nom de moins de 2 caractères (RM-S07)', () => {
    const result = startupSchema.safeParse({ ...validInput, name: 'A' });
    expect(result.success).toBe(false);
  });

  it('refuse un nom de plus de 100 caractères (RM-S07)', () => {
    const result = startupSchema.safeParse({ ...validInput, name: 'A'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('accepte un nom de exactement 2 caractères (cas limite RM-S07)', () => {
    const result = startupSchema.safeParse({ ...validInput, name: 'AB' });
    expect(result.success).toBe(true);
  });

  it('refuse un slug avec des majuscules ou espaces', () => {
    const result = startupSchema.safeParse({ ...validInput, slug: 'Farm Track' });
    expect(result.success).toBe(false);
  });

  it('refuse un secteur hors de l’énumération du CDC', () => {
    const result = startupSchema.safeParse({ ...validInput, sector: 'BLOCKCHAIN' });
    expect(result.success).toBe(false);
  });

  it('refuse un code pays qui ne fait pas 2 caractères', () => {
    const result = startupSchema.safeParse({ ...validInput, countryCode: 'CMR' });
    expect(result.success).toBe(false);
  });
});

describe('parseListField', () => {
  it('découpe une valeur par ligne et retire les lignes vides', () => {
    expect(parseListField('React\n\nNode.js\n  PostgreSQL  ')).toEqual([
      'React',
      'Node.js',
      'PostgreSQL',
    ]);
  });

  it('retourne un tableau vide pour une valeur non-string', () => {
    expect(parseListField(null)).toEqual([]);
  });
});
