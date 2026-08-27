import type {
  Startup as PrismaStartup,
  StartupStatus,
  Sector,
  Partner as PrismaPartner,
  Article as PrismaArticle,
  ArticleCategory as PrismaArticleCategory,
  Event as PrismaEvent,
  EventType as PrismaEventType,
} from '@prisma/client';
import type {
  Startup as DisplayStartup,
  PartnerLogo,
  Article as DisplayArticle,
  ArticleSection,
} from './constants';
import type {
  Event as DisplayEvent,
  EventType as DisplayEventType,
} from '@/components/sections/EventsExplorer';

// Convertit un code pays ISO 3166-1 alpha-2 (ex: "CM") en emoji drapeau.
// Les données V1 codaient le drapeau en dur ; côté base, seul countryCode existe.
export function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const SECTOR_LABELS: Record<Sector, string> = {
  AGRITECH: 'Agritech',
  FINTECH: 'Fintech',
  EDTECH: 'Edtech',
  HEALTHTECH: 'Healthtech',
  SMART_CITIES: 'Smart Cities',
};

const STATUS_LABELS: Record<StartupStatus, DisplayStartup['status']> = {
  EN_INCUBATION: 'En incubation',
  DIPLOMEE: 'Diplômée',
  ALUMNI: 'Alumni',
};

/**
 * Convertit une Startup Prisma vers le format attendu par les composants
 * d'affichage existants (StartupsExplorer, FeaturedStartups, page détail).
 * Isole la migration V1 → Prisma sans toucher aux composants d'UI eux-mêmes.
 */
export function mapStartup(s: PrismaStartup): DisplayStartup {
  return {
    slug: s.slug,
    name: s.name,
    sector: SECTOR_LABELS[s.sector],
    country: countryCodeToFlag(s.countryCode),
    countryName: s.countryName,
    city: s.city ?? undefined,
    status: STATUS_LABELS[s.status],
    year: s.year,
    foundedYear: s.foundedYear ?? undefined,
    tagline: s.tagline,
    description: s.description,
    longDescription: s.longDescription ?? undefined,
    technologies: s.technologies.length ? s.technologies : undefined,
    founders: s.founders.length ? s.founders : undefined,
    metrics: (s.metrics as Array<{ label: string; value: string }> | null) ?? undefined,
    website: s.websiteUrl ?? undefined,
    linkedin: s.linkedinUrl ?? undefined,
    achievements: s.achievements.length ? s.achievements : undefined,
  };
}

const CATEGORY_LABELS: Record<PrismaArticleCategory, DisplayArticle['category']> = {
  ANNONCES: 'Annonces',
  PORTRAITS: 'Portraits',
  RESSOURCES: 'Ressources',
  EVENEMENTS: 'Événements',
  OPINIONS: 'Opinions',
};

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

export function mapArticle(a: ArticleWithAuthor): DisplayArticle {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: CATEGORY_LABELS[a.category],
    date: (a.publishedAt ?? a.createdAt).toISOString().slice(0, 10),
    author: a.author.name,
    readingTime: a.readingTime,
    image: a.coverImageUrl ?? FALLBACK_ARTICLE_IMAGE,
    content: contentToSections(a.content),
  };
}

const EVENT_TYPE_LABELS: Record<PrismaEventType, DisplayEventType> = {
  DEMO_DAY: 'Demo Day',
  ATELIER: 'Atelier',
  WEBINAIRE: 'Webinaire',
  HACKATHON: 'Hackathon',
  NETWORKING: 'Networking',
  CONFERENCE: 'Conférence',
};

export function mapEvent(e: PrismaEvent): DisplayEvent {
  return {
    id: e.slug,
    title: e.title,
    type: EVENT_TYPE_LABELS[e.type],
    date: e.startDate.toISOString().slice(0, 10),
    time:
      e.startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' GMT+1',
    place: e.isOnline ? 'En ligne' : e.location,
    online: e.isOnline,
    description: e.description,
    registerUrl: e.registerUrl ?? '#',
    free: e.isFree,
    price: e.price ?? undefined,
  };
}

export function mapPartner(p: PrismaPartner): PartnerLogo {
  return {
    name: p.name,
    logo: p.logoUrl ?? '/images/partenaires/placeholder.webp',
    url: p.websiteUrl ?? undefined,
  };
}
