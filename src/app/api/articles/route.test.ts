import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';
import { prisma } from '@/lib/prisma';

const TEST_SLUG_PUBLISHED = 'itest-article-published';
const TEST_SLUG_DRAFT = 'itest-article-draft';
const TEST_SLUG_FUTURE = 'itest-article-scheduled-future';

describe('GET /api/articles (intégration)', () => {
  let authorId: string;

  beforeAll(async () => {
    const author = await prisma.user.findFirst();
    if (!author) throw new Error('Aucun utilisateur en base — impossible de tester Article.');
    authorId = author.id;

    await prisma.article.createMany({
      data: [
        {
          slug: TEST_SLUG_PUBLISHED,
          title: 'Article publié de test',
          excerpt: 'Test',
          content: 'Test',
          category: 'ANNONCES',
          readingTime: 1,
          status: 'PUBLISHED',
          publishedAt: new Date(Date.now() - 60_000), // il y a 1 min
          authorId,
        },
        {
          slug: TEST_SLUG_DRAFT,
          title: 'Article brouillon de test',
          excerpt: 'Test',
          content: 'Test',
          category: 'ANNONCES',
          readingTime: 1,
          status: 'DRAFT',
          authorId,
        },
        {
          slug: TEST_SLUG_FUTURE,
          title: 'Article programmé dans le futur',
          excerpt: 'Test',
          content: 'Test',
          category: 'ANNONCES',
          readingTime: 1,
          status: 'PUBLISHED',
          publishedAt: new Date(Date.now() + 86_400_000), // demain
          authorId,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.article.deleteMany({
      where: { slug: { in: [TEST_SLUG_PUBLISHED, TEST_SLUG_DRAFT, TEST_SLUG_FUTURE] } },
    });
  });

  it('retourne uniquement les articles publiés dont la date est passée', async () => {
    const res = await GET(new NextRequest('http://localhost:3000/api/articles?limit=100'));
    const json = await res.json();

    const slugs = json.data.map((a: { slug: string }) => a.slug);
    expect(slugs).toContain(TEST_SLUG_PUBLISHED);
    expect(slugs).not.toContain(TEST_SLUG_DRAFT); // brouillon jamais visible publiquement
    expect(slugs).not.toContain(TEST_SLUG_FUTURE); // publication programmée pas encore atteinte
  });

  it('filtre par catégorie', async () => {
    const res = await GET(
      new NextRequest('http://localhost:3000/api/articles?category=ANNONCES&limit=100')
    );
    const json = await res.json();
    const slugs = json.data.map((a: { slug: string }) => a.slug);
    expect(slugs).toContain(TEST_SLUG_PUBLISHED);
  });
});
