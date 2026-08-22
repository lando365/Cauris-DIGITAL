import { describe, it, expect } from 'vitest';
import { articleSchema } from './article';

const validInput = {
  slug: 'guide-pitch-deck-startup',
  title: 'Guide du pitch deck',
  excerpt: 'Comment construire un pitch deck efficace.',
  content: 'Contenu complet de l’article, largement suffisant.',
  category: 'RESSOURCES',
  status: 'DRAFT',
};

describe('articleSchema', () => {
  it('accepte une entrée valide', () => {
    const result = articleSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  // RM-A02 : titre et contenu requis
  it('refuse un titre vide (RM-A02)', () => {
    const result = articleSchema.safeParse({ ...validInput, title: '' });
    expect(result.success).toBe(false);
  });

  it('refuse un contenu vide (RM-A02)', () => {
    const result = articleSchema.safeParse({ ...validInput, content: '' });
    expect(result.success).toBe(false);
  });

  it('refuse une catégorie hors de l’énumération du CDC (§5.3.3)', () => {
    const result = articleSchema.safeParse({ ...validInput, category: 'SPORT' });
    expect(result.success).toBe(false);
  });

  it('refuse un statut hors DRAFT/PUBLISHED/ARCHIVED', () => {
    const result = articleSchema.safeParse({ ...validInput, status: 'SCHEDULED' });
    expect(result.success).toBe(false);
  });

  it('refuse un slug mal formé', () => {
    const result = articleSchema.safeParse({ ...validInput, slug: 'Guide Pitch Deck' });
    expect(result.success).toBe(false);
  });

  it('accepte un coverImageUrl et publishedAt absents (optionnels)', () => {
    const result = articleSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });
});
