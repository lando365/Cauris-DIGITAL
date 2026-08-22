import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isEventPast } from '@/lib/event-status';

// GET /api/events — CDC V2 §6.2. Liste des événements à venir et passés,
// uniquement ceux publiés (isPublished=true). isPast est calculé à la volée (RM-E02).
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10) || 20));

  const where = { isPublished: true };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { startDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count({ where }),
  ]);

  const data = events.map((e) => ({ ...e, isPast: isEventPast(e.startDate) }));

  return NextResponse.json({ data, meta: { page, limit, total } });
}
