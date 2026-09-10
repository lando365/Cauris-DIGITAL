import type {
  Startup as PrismaStartup,
  Partner as PrismaPartner,
  Article as PrismaArticle,
  Event as PrismaEvent,
} from '@prisma/client';
import type {
  Startup as DisplayStartup,
  PartnerLogo,
  Article as DisplayArticle,
  ArticleSection,
} from './constants';
import type { Event as DisplayEvent } from '@/components/sections/EventsExplorer';
import { computeReadingTime } from './reading-time';

export type Locale = 'fr' | 'en';

// Convertit un code pays ISO 3166-1 alpha-2 (ex: "CM") en emoji drapeau.
// Les données V1 codaient le drapeau en dur ; côté base, seul countryCode existe.
/** Convertit un code pays ISO 3166-1 alpha-2 (ex: "CM") en emoji drapeau. */
export function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

// Sélectionne le champ *En quand la locale est "en" et qu'une traduction a
// été saisie, avec repli sur le champ français sinon (contenu non traduit
// par l'éditeur, ou locale française).
function pick(fr: string, en: string | null | undefined, locale: Locale): string {
  return locale === 'en' && en ? en : fr;
}

function pickOptional(
  fr: string | null | undefined,
  en: string | null | undefined,
  locale: Locale
): string | undefined {
  if (locale === 'en' && en) return en;
  return fr ?? undefined;
}

function pickArray(fr: string[], en: string[], locale: Locale): string[] {
  return locale === 'en' && en.length ? en : fr;
}

/**
 * Convertit une Startup Prisma vers le format attendu par les composants
 * d'affichage existants (StartupsExplorer, FeaturedStartups, page détail).
 * Isole la migration V1 → Prisma sans toucher aux composants d'UI eux-mêmes.
 *
 * sector/status portent la valeur brute de l'enum Prisma (stable, indépendante
 * de la langue) — la traduction se fait à l'affichage via le namespace
 * next-intl "Enums", jamais ici. Les champs de contenu (tagline, description...)
 * utilisent en revanche les colonnes *En saisies dans l'admin, avec repli sur
 * le français quand la traduction anglaise n'existe pas encore.
 */
export function mapStartup(s: PrismaStartup, locale: Locale = 'fr'): DisplayStartup {
  const achievements = pickArray(s.achievements, s.achievementsEn, locale);
  const metricsSource =
    locale === 'en' && s.metricsEn ? s.metricsEn : s.metrics;
  return {
    slug: s.slug,
    name: s.name,
    sector: s.sector,
    country: countryCodeToFlag(s.countryCode),
    countryName: s.countryName,
    city: s.city ?? undefined,
    status: s.status,
    year: s.year,
    foundedYear: s.foundedYear ?? undefined,
    tagline: pick(s.tagline, s.taglineEn, locale),
    description: pick(s.description, s.descriptionEn, locale),
    longDescription: pickOptional(s.longDescription, s.longDescriptionEn, locale),
    technologies: s.technologies.length ? s.technologies : undefined,
    founders: s.founders.length ? s.founders : undefined,
    metrics: (metricsSource as Array<{ label: string; value: string }> | null) ?? undefined,
    website: s.websiteUrl ?? undefined,
    linkedin: s.linkedinUrl ?? undefined,
    achievements: achievements.length ? achievements : undefined,
  };
}

const FALLBACK_ARTICLE_IMAGE = '/images/entrepreneurs/equipe-jeunes-africains-bureau.webp';

// Le contenu Prisma est du texte Markdown/HTML brut (CDC §5.3.3), tandis que
// le rendu existant attend une liste de blocs typés (ArticleSection[]).
// Simplification volontaire : on ne parse pas la syntaxe Markdown (titres,
// gras, listes...), on préserve seulement les coupures de paragraphe (lignes
// vides) pour un rendu lisible sans dépendance supplémentaire.
function contentToSections(content: string): ArticleSection[] {
  return content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((text) => ({ type: 'paragraph' as const, text }));
}

type ArticleWithAuthor = PrismaArticle & { author: { name: string } };

/**
 * Convertit un Article Prisma (+ auteur) vers le format d'affichage attendu
 * par les composants existants, en sélectionnant la locale demandée.
 */
export function mapArticle(a: ArticleWithAuthor, locale: Locale = 'fr'): DisplayArticle {
  const content = pick(a.content, a.contentEn, locale);
  return {
    slug: a.slug,
    title: pick(a.title, a.titleEn, locale),
    excerpt: pick(a.excerpt, a.excerptEn, locale),
    category: a.category,
    date: (a.publishedAt ?? a.createdAt).toISOString().slice(0, 10),
    author: a.author.name,
    // Recalculé sur le contenu réellement affiché plutôt que sur le champ
    // `readingTime` stocké (qui ne reflète que la version française).
    readingTime: computeReadingTime(content),
    image: a.coverImageUrl ?? FALLBACK_ARTICLE_IMAGE,
    content: contentToSections(content),
  };
}

/**
 * Convertit un Event Prisma vers le format d'affichage EventsExplorer,
 * en sélectionnant la locale demandée.
 */
export function mapEvent(e: PrismaEvent, locale: Locale = 'fr'): DisplayEvent {
  return {
    id: e.slug,
    title: pick(e.title, e.titleEn, locale),
    type: e.type,
    date: e.startDate.toISOString().slice(0, 10),
    time:
      e.startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' GMT+1',
    // "En ligne" n'est pas mis ici : c'est un libellé traduisible, calculé à
    // l'affichage par le composant à partir du booléen `online`.
    place: e.location,
    online: e.isOnline,
    description: pick(e.description, e.descriptionEn, locale),
    registerUrl: e.registerUrl ?? '#',
    free: e.isFree,
    price: e.price ?? undefined,
  };
}

/** Convertit un Partner Prisma vers le format PartnerLogo attendu à l'affichage. */
export function mapPartner(p: PrismaPartner): PartnerLogo {
  return {
    name: p.name,
    logo: p.logoUrl ?? '/images/partenaires/placeholder.webp',
    url: p.websiteUrl ?? undefined,
  };
}
