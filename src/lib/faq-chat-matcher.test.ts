import { describe, expect, it } from 'vitest';
import { findBestFaqMatch } from '@/lib/faq-chat-matcher';

describe('findBestFaqMatch', () => {
  it('matches a question by keyword overlap, ignoring accents and case', () => {
    const match = findBestFaqMatch('Est-ce que je dois être à Yaoundé pour participer ?');
    expect(match).not.toBeNull();
    expect(match?.question).toBe('Est-ce que je dois être à Yaoundé pour participer ?');
  });

  it('matches loosely phrased questions via shared keywords', () => {
    const match = findBestFaqMatch('vous prenez des parts dans ma startup ?');
    expect(match).not.toBeNull();
    expect(match?.question).toContain('capital');
  });

  it('returns null for input with no overlapping keywords', () => {
    expect(findBestFaqMatch('bonjour')).toBeNull();
    expect(findBestFaqMatch('xyzabc123')).toBeNull();
  });

  it('returns null for empty or whitespace-only input', () => {
    expect(findBestFaqMatch('')).toBeNull();
    expect(findBestFaqMatch('   ')).toBeNull();
  });

  it('is case-insensitive', () => {
    const lower = findBestFaqMatch('mentorat en ligne comment ça marche');
    const upper = findBestFaqMatch('MENTORAT EN LIGNE COMMENT ÇA MARCHE');
    expect(lower?.question).toBe(upper?.question);
  });
});
