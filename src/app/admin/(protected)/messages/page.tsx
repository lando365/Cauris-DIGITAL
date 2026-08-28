import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { MessageRowActions } from './MessageRowActions';
import type { ContactMessageStatus } from '@prisma/client';

const TABS: { label: string; value: ContactMessageStatus | 'ALL' }[] = [
  { label: 'Tous', value: 'ALL' },
  { label: 'Non lus', value: 'UNREAD' },
  { label: 'Lus', value: 'READ' },
  { label: 'Traités', value: 'REPLIED' },
  { label: 'Archivés', value: 'ARCHIVED' },
];

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const user = await requireAdminUser();

  const activeTab = (status as ContactMessageStatus | undefined) ?? 'ALL';
  const messages = await prisma.contactMessage.findMany({
    where: activeTab === 'ALL' ? {} : { status: activeTab },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-montserrat text-xl font-bold text-cauris-black">Messages</h1>
        {user.role === 'ADMIN' && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- déclenche un téléchargement de fichier, pas une navigation
          <a
            href="/api/admin/messages/export"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-cauris-black hover:bg-gray-50"
          >
            Exporter en CSV
          </a>
        )}
      </div>

      <div className="mb-4 flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === 'ALL' ? '/admin/messages' : `/admin/messages?status=${tab.value}`}
            className={`px-4 py-2 text-sm ${
              activeTab === tab.value
                ? 'border-b-2 border-cauris-orange font-semibold text-cauris-orange'
                : 'text-cauris-gray-secondary hover:text-cauris-black'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-cauris-black">
                  {m.firstName} {m.lastName}{' '}
                  <span className="font-normal text-cauris-gray-secondary">— {m.subject}</span>
                </p>
                <p className="text-xs text-cauris-gray-secondary">
                  {m.email} · {m.country ?? '—'} · {m.createdAt.toLocaleString('fr-FR')}
                </p>
              </div>
              <MessageRowActions id={m.id} status={m.status} canDelete={user.role === 'ADMIN'} />
            </div>
            <p className="whitespace-pre-wrap text-sm text-cauris-gray-text">{m.message}</p>
            <a
              href={`mailto:${m.email}`}
              className="mt-2 inline-block text-sm text-cauris-orange hover:underline"
            >
              Répondre par email
            </a>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-cauris-gray-secondary">
            Aucun message pour l&apos;instant.
          </p>
        )}
      </div>
    </div>
  );
}
