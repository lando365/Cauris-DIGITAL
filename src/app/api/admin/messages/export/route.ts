import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/require-admin';

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// GET /api/admin/messages/export — CDC V2 §6.3.7, ADMIN uniquement.
export async function GET() {
  const user = await getAuthenticatedAdmin('ADMIN');
  if (!user) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Réservé aux administrateurs.' } },
      { status: 403 }
    );
  }

  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

  const header = [
    'Prénom',
    'Nom',
    'Email',
    'Pays',
    'Sujet',
    'Message',
    'Statut',
    'Date de réception',
  ];
  const rows = messages.map((m) =>
    [
      m.firstName,
      m.lastName,
      m.email,
      m.country ?? '',
      m.subject,
      m.message.replace(/\n/g, ' '),
      m.status,
      m.createdAt.toISOString(),
    ]
      .map((v) => csvEscape(String(v)))
      .join(',')
  );

  const csv = [header.join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="messages-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
