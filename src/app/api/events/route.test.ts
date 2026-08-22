import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';
import { prisma } from '@/lib/prisma';

const TEST_SLUG_PUBLISHED_PAST = 'itest-event-published-past';
const TEST_SLUG_PUBLISHED_FUTURE = 'itest-event-published-future';
const TEST_SLUG_UNPUBLISHED = 'itest-event-unpublished';

describe('GET /api/events (intégration)', () => {
  beforeAll(async () => {
    await prisma.event.createMany({
      data: [
        {
          slug: TEST_SLUG_PUBLISHED_PAST,
          title: 'Événement passé de test',
          description: 'Test',
          type: 'WEBINAIRE',
          startDate: new Date(Date.now() - 86_400_000), // hier
          location: 'En ligne',
          isPublished: true,
        },
        {
          slug: TEST_SLUG_PUBLISHED_FUTURE,
          title: 'Événement futur de test',
          description: 'Test',
          type: 'DEMO_DAY',
          startDate: new Date(Date.now() + 86_400_000), // demain
          location: 'Yaoundé',
          isPublished: true,
        },
        {
          slug: TEST_SLUG_UNPUBLISHED,
          title: 'Événement non publié de test',
          description: 'Test',
          type: 'ATELIER',
          startDate: new Date(Date.now() + 86_400_000),
          location: 'Yaoundé',
          isPublished: false,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.event.deleteMany({
      where: {
        slug: { in: [TEST_SLUG_PUBLISHED_PAST, TEST_SLUG_PUBLISHED_FUTURE, TEST_SLUG_UNPUBLISHED] },
      },
    });
  });

  it('ne retourne que les événements publiés', async () => {
    const res = await GET(new NextRequest('http://localhost:3000/api/events?limit=100'));
    const json = await res.json();
    const slugs = json.data.map((e: { slug: string }) => e.slug);

    expect(slugs).toContain(TEST_SLUG_PUBLISHED_PAST);
    expect(slugs).toContain(TEST_SLUG_PUBLISHED_FUTURE);
    expect(slugs).not.toContain(TEST_SLUG_UNPUBLISHED);
  });

  it('calcule isPast correctement pour chaque événement (RM-E02)', async () => {
    const res = await GET(new NextRequest('http://localhost:3000/api/events?limit=100'));
    const json = await res.json();

    const past = json.data.find((e: { slug: string }) => e.slug === TEST_SLUG_PUBLISHED_PAST);
    const future = json.data.find((e: { slug: string }) => e.slug === TEST_SLUG_PUBLISHED_FUTURE);

    expect(past.isPast).toBe(true);
    expect(future.isPast).toBe(false);
  });
});
