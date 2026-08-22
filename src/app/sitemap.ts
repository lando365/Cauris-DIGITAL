import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { routing } from '@/i18n/routing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caurisdigital.org';

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

interface StaticPage {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

// Pages statiques principales
const STATIC_PAGES: StaticPage[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/a-propos', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/programme-incubation', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/programme-acceleration', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/startups', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/innovation-corporative', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/evenements', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/actualites', changeFrequency: 'daily', priority: 0.7 },
  { path: '/partenaires', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/mentions-legales', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/politique-de-confidentialite', changeFrequency: 'yearly', priority: 0.3 },
];

/**
 * Émet une entrée par locale pour un chemin donné, avec les alternates
 * hreflang pointant vers les autres langues (CDC §6.6 / §7.1).
 */
function localizedEntries(
  path: string,
  lastModified: Date,
  changeFrequency: ChangeFrequency,
  priority: number,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
  );

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = STATIC_PAGES.flatMap((p) =>
    localizedEntries(p.path, now, p.changeFrequency, p.priority),
  );

  const [articles, startups] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED', publishedAt: { lte: now } },
      select: { slug: true, publishedAt: true, createdAt: true },
    }),
    prisma.startup.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  // Pages d'articles dynamiques
  const articleEntries = articles.flatMap((article) =>
    localizedEntries(
      `/actualites/${article.slug}`,
      article.publishedAt ?? article.createdAt,
      'monthly',
      0.5,
    ),
  );

  // Pages de détail startup dynamiques
  const startupEntries = startups.flatMap((startup) =>
    localizedEntries(`/startups/${startup.slug}`, startup.updatedAt, 'monthly', 0.5),
  );

  return [...staticEntries, ...articleEntries, ...startupEntries];
}
