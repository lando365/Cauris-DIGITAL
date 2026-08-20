import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma, Sector, StartupStatus } from '@prisma/client';

const SECTORS: Sector[] = ['AGRITECH', 'FINTECH', 'EDTECH', 'HEALTHTECH', 'SMART_CITIES'];
const STATUSES: StartupStatus[] = ['EN_INCUBATION', 'DIPLOMEE', 'ALUMNI'];

// GET /api/startups — CDC V2 §6.2. Liste publique, filtrable et paginée.
// L'entité Startup n'a pas de champ de publication (§5.3.2) : toutes les
// startups créées sont publiques, contrairement à Article/Event.
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10) || 20));

  const where: Prisma.StartupWhereInput = {};
  const sector = searchParams.get('sector');
  const country = searchParams.get('country');
  const status = searchParams.get('status');
  if (sector && SECTORS.includes(sector as Sector)) where.sector = sector as Sector;
  if (country) where.countryCode = country.toUpperCase();
  if (status && STATUSES.includes(status as StartupStatus)) where.status = status as StartupStatus;

  const [data, total] = await Promise.all([
    prisma.startup.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.startup.count({ where }),
  ]);

  return NextResponse.json({ data, meta: { page, limit, total } });
}
