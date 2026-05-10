import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://caurisdigital.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/a-propos`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/programme-incubation`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/programme-acceleration`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/startups`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/innovation-corporative`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/evenements`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/actualites`, lastModified, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/partenaires`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/faq`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/mentions-legales`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/politique-de-confidentialite`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
