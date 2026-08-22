import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GET } from './route';
import { prisma } from '@/lib/prisma';

const TEST_SLUG = 'itest-startup-detail';

describe('GET /api/startups/:slug (intégration)', () => {
  beforeAll(async () => {
    await prisma.startup.create({
      data: {
        slug: TEST_SLUG,
        name: 'ITest Detail',
        tagline: 'Test',
        description: 'Test',
        sector: 'AGRITECH',
        countryName: 'Cameroun',
        countryCode: 'CM',
        status: 'EN_INCUBATION',
        year: 2026,
      },
    });
  });

  afterAll(async () => {
    await prisma.startup.deleteMany({ where: { slug: TEST_SLUG } });
  });

  it('retourne 200 et le détail pour un slug existant', async () => {
    const res = await GET(new Request('http://localhost:3000/api/startups/x'), {
      params: { slug: TEST_SLUG },
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.slug).toBe(TEST_SLUG);
  });

  it('retourne 404 pour un slug inexistant', async () => {
    const res = await GET(new Request('http://localhost:3000/api/startups/x'), {
      params: { slug: 'ce-slug-n-existe-pas' },
    });
    expect(res.status).toBe(404);
  });
});
