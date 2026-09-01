import { FAQ_ITEMS } from '@/lib/constants';

const STOPWORDS = new Set([
  'le',
  'la',
  'les',
  'de',
  'des',
  'du',
  'un',
  'une',
  'et',
  'ou',
  'est',
  'es',
  'suis',
  'sont',
  'qui',
  'que',
  'quoi',
  'quel',
  'quelle',
  'quels',
  'quelles',
  'comment',
  'pourquoi',
  'ce',
  'cette',
  'ces',
  'pour',
  'avec',
  'dans',
  'sur',
  'par',
  'a',
  'au',
  'aux',
  'mon',
  'ma',
  'mes',
  'votre',
  'vos',
  'je',
  'tu',
  'il',
  'elle',
  'on',
  'nous',
  'vous',
  'ils',
  'elles',
  'se',
  'sa',
  'son',
  'ses',
  'si',
  'y',
  'en',
  'ne',
  'pas',
  'plus',
  'sans',
]);

// Plage Unicode des diacritiques combinants (U+0300-U+036F), produits par
// normalize('NFD') — on les retire pour comparer les mots sans accents.
const COMBINING_DIACRITICS = /[̀-ͯ]/g;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS, '')
    .replace(/[^a-z0-9\s]/g, ' ');
}

function keywords(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

export interface FaqMatch {
  question: string;
  answer: string;
  score: number;
}

const FLAT_FAQ: { q: string; a: string }[] = FAQ_ITEMS.flatMap((theme) =>
  theme.items.map((item) => ({ q: item.q, a: item.a }))
);

const MIN_SCORE = 1;

/**
 * Score chaque FAQ par recouvrement de mots-clés avec la question posée.
 * Un match sur la question (q) pèse deux fois plus qu'un match sur la réponse (a).
 */
export function findBestFaqMatch(userInput: string): FaqMatch | null {
  const inputWords = keywords(userInput);
  if (inputWords.length === 0) return null;

  let best: FaqMatch | null = null;

  for (const { q, a } of FLAT_FAQ) {
    const questionWords = new Set(keywords(q));
    const answerWords = new Set(keywords(a));

    let score = 0;
    for (const word of inputWords) {
      if (questionWords.has(word)) score += 2;
      else if (answerWords.has(word)) score += 1;
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { question: q, answer: a, score };
    }
  }

  return best && best.score >= MIN_SCORE ? best : null;
}

export type SmallTalkIntent = 'thanks' | 'greeting';

const THANKS_WORDS = ['merci', 'remercie', 'thanks', 'thank'];
const GREETING_WORDS = ['bonjour', 'bonsoir', 'salut', 'coucou', 'hello', 'hi', 'hey'];

/**
 * Détecte les messages de politesse (remerciement, salutation) pour répondre
 * autrement qu'avec le message de repli générique "aucune réponse trouvée".
 */
export function detectSmallTalk(userInput: string): SmallTalkIntent | null {
  const normalized = normalize(userInput);
  const containsWord = (words: string[]) =>
    words.some((word) => new RegExp(`\\b${word}\\b`).test(normalized));

  if (containsWord(THANKS_WORDS)) return 'thanks';
  if (containsWord(GREETING_WORDS)) return 'greeting';
  return null;
}
