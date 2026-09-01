import { describe, expect, it } from 'vitest';
import { detectSmallTalk, findBestFaqMatch } from '@/lib/faq-chat-matcher';

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

describe('detectSmallTalk', () => {
  it('detects a thank-you message in French and English', () => {
    expect(detectSmallTalk('merci pour ton aide')).toBe('thanks');
    expect(detectSmallTalk('Merci beaucoup !')).toBe('thanks');
    expect(detectSmallTalk('thanks a lot')).toBe('thanks');
    expect(detectSmallTalk('thank you')).toBe('thanks');
  });

  it('detects a greeting in French and English', () => {
    expect(detectSmallTalk('bonjour')).toBe('greeting');
    expect(detectSmallTalk('salut !')).toBe('greeting');
    expect(detectSmallTalk('hi')).toBe('greeting');
    expect(detectSmallTalk('hello there')).toBe('greeting');
  });

  it('does not match a word that only contains a small-talk substring', () => {
    // "merciless" contains "merci" as a substring but is a different word
    expect(detectSmallTalk('merciless')).toBeNull();
  });

  it('returns null for FAQ-style questions', () => {
    expect(detectSmallTalk('comment fonctionne le mentorat en ligne')).toBeNull();
  });
});
