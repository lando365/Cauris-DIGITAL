import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';
import { prisma } from '@/lib/prisma';

const TEST_NAME_A = 'ITest Partner Institutionnel';
const TEST_NAME_B = 'ITest Partner Corporatif';

describe('GET /api/partners (intégration)', () => {
  beforeAll(async () => {
    await prisma.partner.createMany({
      data: [
        { name: TEST_NAME_A, category: 'INSTITUTIONNEL', displayOrder: 999 },
        { name: TEST_NAME_B, category: 'CORPORATIF', displayOrder: 999 },
      ],
    });
  });

  afterAll(async () => {
    await prisma.partner.deleteMany({ where: { name: { in: [TEST_NAME_A, TEST_NAME_B] } } });
  });

  it('retourne tous les partenaires sans filtre', async () => {
    const res = await GET(new NextRequest('http://localhost:3000/api/partners'));
    const json = await res.json();
    const names = json.data.map((p: { name: string }) => p.name);

    expect(names).toContain(TEST_NAME_A);
    expect(names).toContain(TEST_NAME_B);
  });

  it('filtre par catégorie', async () => {
    const res = await GET(new NextRequest('http://localhost:3000/api/partners?category=CORPORATIF'));
    const json = await res.json();
    const names = json.data.map((p: { name: string }) => p.name);

    expect(names).toContain(TEST_NAME_B);
    expect(names).not.toContain(TEST_NAME_A);
  });
});
