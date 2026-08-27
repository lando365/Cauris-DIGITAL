import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ArticleCategory, Prisma } from '@prisma/client';

const CATEGORIES: ArticleCategory[] = [
  'ANNONCES',
  'PORTRAITS',
  'RESSOURCES',
  'EVENEMENTS',
  'OPINIONS',
];

// GET /api/articles — CDC V2 §6.2. Liste publique, paginée, filtrable par catégorie.
// Seuls les articles PUBLISHED dont publishedAt est passé sont retournés
// (les brouillons et publications programmées dans le futur restent invisibles).
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10) || 20));

  const where: Prisma.ArticleWhereInput = {
    status: 'PUBLISHED',
    publishedAt: { lte: new Date() },
  };
  const category = searchParams.get('category');
  if (category && CATEGORIES.includes(category as ArticleCategory)) {
    where.category = category as ArticleCategory;
  }

  const [data, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({ data, meta: { page, limit, total } });
}
