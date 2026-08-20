import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { PartnerCategory } from '@prisma/client';

const CATEGORIES: PartnerCategory[] = ['INSTITUTIONNEL', 'FINANCIER', 'ACADEMIQUE', 'CORPORATIF'];

// GET /api/partners — CDC V2 §6.2. Liste des partenaires par catégorie.
// Comme Startup, l'entité Partner n'a pas de champ de publication (§5.3.5) :
// tous les partenaires créés sont publics.
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category');
  const where =
    category && CATEGORIES.includes(category as PartnerCategory)
      ? { category: category as PartnerCategory }
      : {};

  const data = await prisma.partner.findMany({ where, orderBy: { displayOrder: 'asc' } });

  return NextResponse.json({ data });
}
