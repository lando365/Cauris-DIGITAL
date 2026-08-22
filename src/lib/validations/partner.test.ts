import { describe, it, expect } from 'vitest';
import { partnerSchema } from './partner';

const validInput = {
  name: 'Orange Digital Center',
  category: 'CORPORATIF',
};

describe('partnerSchema', () => {
  it('accepte une entrée valide', () => {
    const result = partnerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('applique les valeurs par défaut (displayOrder=0, isFeatured=false)', () => {
    const result = partnerSchema.parse(validInput);
    expect(result.displayOrder).toBe(0);
    expect(result.isFeatured).toBe(false);
  });

  it('refuse un nom vide', () => {
    const result = partnerSchema.safeParse({ ...validInput, name: '' });
    expect(result.success).toBe(false);
  });

  it('refuse une catégorie hors de l’énumération du CDC (§5.3.5)', () => {
    const result = partnerSchema.safeParse({ ...validInput, category: 'ONG' });
    expect(result.success).toBe(false);
  });

  it('accepte logoUrl et websiteUrl absents (optionnels)', () => {
    const result = partnerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });
});
