import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GET } from './route';
import { prisma } from '@/lib/prisma';

const TEST_SLUG_PUBLISHED = 'itest-article-detail-published';
const TEST_SLUG_DRAFT = 'itest-article-detail-draft';

describe('GET /api/articles/:slug (intégration)', () => {
  beforeAll(async () => {
    const author = await prisma.user.findFirst();
    if (!author) throw new Error('Aucun utilisateur en base — impossible de tester Article.');

    await prisma.article.createMany({
      data: [
        {
          slug: TEST_SLUG_PUBLISHED,
          title: 'Détail publié de test',
          excerpt: 'Test',
          content: 'Test',
          category: 'ANNONCES',
          readingTime: 1,
          status: 'PUBLISHED',
          publishedAt: new Date(Date.now() - 60_000),
          authorId: author.id,
        },
        {
          slug: TEST_SLUG_DRAFT,
          title: 'Détail brouillon de test',
          excerpt: 'Test',
          content: 'Test',
          category: 'ANNONCES',
          readingTime: 1,
          status: 'DRAFT',
          authorId: author.id,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.article.deleteMany({
      where: { slug: { in: [TEST_SLUG_PUBLISHED, TEST_SLUG_DRAFT] } },
    });
  });

  it('retourne 200 et le contenu pour un article publié', async () => {
    const res = await GET(new Request('http://localhost:3000/api/articles/x'), {
      params: { slug: TEST_SLUG_PUBLISHED },
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.slug).toBe(TEST_SLUG_PUBLISHED);
  });

  it('retourne 404 pour un brouillon, même en accès direct par slug', async () => {
    const res = await GET(new Request('http://localhost:3000/api/articles/x'), {
      params: { slug: TEST_SLUG_DRAFT },
    });
    expect(res.status).toBe(404);
  });

  it('retourne 404 pour un slug inexistant', async () => {
    const res = await GET(new Request('http://localhost:3000/api/articles/x'), {
      params: { slug: 'ce-slug-n-existe-pas' },
    });
    expect(res.status).toBe(404);
  });
});
