import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/articles/:slug — CDC V2 §6.2. Un brouillon ou une publication
// programmée dans le futur n'est pas visible publiquement (même par slug direct).
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } });

  if (
    !article ||
    article.status !== 'PUBLISHED' ||
    article.publishedAt === null ||
    article.publishedAt > new Date()
  ) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Article introuvable.' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: article });
}
