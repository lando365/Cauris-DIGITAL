import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/startups/:slug — CDC V2 §6.2
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const startup = await prisma.startup.findUnique({ where: { slug } });

  if (!startup) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Startup introuvable.' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: startup });
}
