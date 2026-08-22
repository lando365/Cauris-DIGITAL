import { describe, it, expect } from 'vitest';
import { computeReadingTime } from './reading-time';

// CDC V2 RM-A06 : calcul automatique à 250 mots/min, arrondi au supérieur, minimum 1 min.
describe('computeReadingTime (RM-A06)', () => {
  it('retourne 1 minute pour un texte très court', () => {
    expect(computeReadingTime('Un texte court.')).toBe(1);
  });

  it('retourne 1 minute pour une chaîne vide', () => {
    expect(computeReadingTime('')).toBe(1);
  });

  it('calcule correctement pour 250 mots (exactement 1 minute)', () => {
    const text = new Array(250).fill('mot').join(' ');
    expect(computeReadingTime(text)).toBe(1);
  });

  it('arrondit au supérieur pour 251 mots (un peu plus d’1 minute)', () => {
    const text = new Array(251).fill('mot').join(' ');
    expect(computeReadingTime(text)).toBe(2);
  });

  it('calcule correctement pour 500 mots (2 minutes)', () => {
    const text = new Array(500).fill('mot').join(' ');
    expect(computeReadingTime(text)).toBe(2);
  });

  it('ignore les espaces multiples lors du comptage des mots', () => {
    const text = 'mot1    mot2\n\nmot3';
    expect(computeReadingTime(text)).toBe(1);
  });
});
