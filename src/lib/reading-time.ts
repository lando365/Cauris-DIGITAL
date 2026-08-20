// CDC V2 RM-A06 : readingTime calculé automatiquement (250 mots/min), jamais saisi manuellement.
const WORDS_PER_MINUTE = 250;

export function computeReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
