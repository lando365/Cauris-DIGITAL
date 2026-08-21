import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/require-admin';

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// GET /api/admin/subscribers/export — CDC V2 §6.3.7, ADMIN uniquement.
// Format pensé pour un ré-import Mailchimp/Brevo (CDC §3.3.5).
export async function GET() {
  const user = await getAuthenticatedAdmin('ADMIN');
  if (!user) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Réservé aux administrateurs.' } },
      { status: 403 }
    );
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });

  const header = ['Email', 'Prénom', 'Statut', 'Source', "Date d'inscription", 'Date de désinscription'];
  const rows = subscribers.map((s) =>
    [
      s.email,
      s.firstName ?? '',
      s.status,
      s.source ?? '',
      s.createdAt.toISOString(),
      s.unsubscribedAt?.toISOString() ?? '',
    ]
      .map((v) => csvEscape(String(v)))
      .join(',')
  );

  const csv = [header.join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="newsletter-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
