import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';
import { prisma } from '@/lib/prisma';

// Test d'intégration : appelle le vrai Route Handler Next.js contre la vraie base
// (Supabase). Le CDC V2 §12.3 prévoit "Vitest + Supertest", mais Supertest cible
// un serveur HTTP (Express) — inapplicable aux Route Handlers App Router de
// Next.js, qui sont de simples fonctions (Request) => Response. On obtient le
// même objectif (tester l'endpoint réel de bout en bout) en invoquant directement
// le handler exporté, sans lancer de serveur ni de bibliothèque HTTP intermédiaire.

const TEST_SLUG_A = 'itest-startup-agritech';
const TEST_SLUG_B = 'itest-startup-fintech';

describe('GET /api/startups (intégration)', () => {
  beforeAll(async () => {
    await prisma.startup.createMany({
      data: [
        {
          slug: TEST_SLUG_A,
          name: 'ITest Agritech',
          tagline: 'Test',
          description: 'Test',
          sector: 'AGRITECH',
          countryName: 'Cameroun',
          countryCode: 'CM',
          status: 'EN_INCUBATION',
          year: 2026,
        },
        {
          slug: TEST_SLUG_B,
          name: 'ITest Fintech',
          tagline: 'Test',
          description: 'Test',
          sector: 'FINTECH',
          countryName: 'Sénégal',
          countryCode: 'SN',
          status: 'DIPLOMEE',
          year: 2025,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.startup.deleteMany({ where: { slug: { in: [TEST_SLUG_A, TEST_SLUG_B] } } });
  });

  it('retourne les startups créées, avec la structure de réponse du CDC §6.4', async () => {
    const res = await GET(new NextRequest('http://localhost:3000/api/startups'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty('data');
    expect(json).toHaveProperty('meta.page');
    expect(json).toHaveProperty('meta.limit');
    expect(json).toHaveProperty('meta.total');

    const slugs = json.data.map((s: { slug: string }) => s.slug);
    expect(slugs).toContain(TEST_SLUG_A);
    expect(slugs).toContain(TEST_SLUG_B);
  });

  it('filtre correctement par secteur', async () => {
    const res = await GET(new NextRequest('http://localhost:3000/api/startups?sector=AGRITECH'));
    const json = await res.json();

    const slugs = json.data.map((s: { slug: string }) => s.slug);
    expect(slugs).toContain(TEST_SLUG_A);
    expect(slugs).not.toContain(TEST_SLUG_B);
  });

  it('filtre correctement par statut', async () => {
    const res = await GET(new NextRequest('http://localhost:3000/api/startups?status=DIPLOMEE'));
    const json = await res.json();

    const slugs = json.data.map((s: { slug: string }) => s.slug);
    expect(slugs).toContain(TEST_SLUG_B);
    expect(slugs).not.toContain(TEST_SLUG_A);
  });

  it('respecte la pagination (limit)', async () => {
    const res = await GET(new NextRequest('http://localhost:3000/api/startups?limit=1&page=1'));
    const json = await res.json();

    expect(json.data.length).toBeLessThanOrEqual(1);
    expect(json.meta.limit).toBe(1);
  });
});
