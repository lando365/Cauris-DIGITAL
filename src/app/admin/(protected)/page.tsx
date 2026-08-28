import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSubscriptionGrowth } from '@/lib/newsletter-stats';
import { GrowthChart } from '@/components/admin/GrowthChart';

export default async function AdminDashboardPage() {
  const [
    startupCount,
    articleCount,
    upcomingEventCount,
    unreadMessageCount,
    activeSubscriberCount,
    recentMessages,
    recentArticles,
    growth,
  ] = await Promise.all([
    prisma.startup.count(),
    prisma.article.count(),
    prisma.event.count({ where: { isPublished: true, startDate: { gte: new Date() } } }),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: { id: true, title: true, publishedAt: true },
    }),
    getSubscriptionGrowth(30),
  ]);

  const counters = [
    { label: 'Startups', value: startupCount },
    { label: 'Articles', value: articleCount },
    { label: 'Événements à venir', value: upcomingEventCount },
    { label: 'Messages non lus', value: unreadMessageCount },
    { label: 'Inscrits newsletter actifs', value: activeSubscriberCount },
  ];

  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">Tableau de bord</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {counters.map((c) => (
          <div key={c.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-2xl font-bold text-cauris-orange">{c.value}</p>
            <p className="text-sm text-cauris-gray-secondary">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <GrowthChart data={growth} label="Inscriptions newsletter (30 derniers jours)" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 font-montserrat text-sm font-bold text-cauris-black">
            Derniers messages
          </h2>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-cauris-gray-secondary">Aucun message pour l&apos;instant.</p>
          ) : (
            <ul className="space-y-2">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-cauris-gray-text">
                    {m.firstName} {m.lastName} — {m.subject}
                  </span>
                  <span className="ml-2 shrink-0 text-xs text-cauris-gray-secondary">
                    {m.createdAt.toLocaleDateString('fr-FR')}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/messages"
            className="mt-3 inline-block text-xs font-semibold text-cauris-orange hover:underline"
          >
            Voir tous les messages
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 font-montserrat text-sm font-bold text-cauris-black">
            Dernières publications
          </h2>
          {recentArticles.length === 0 ? (
            <p className="text-sm text-cauris-gray-secondary">
              Aucun article publié pour l&apos;instant.
            </p>
          ) : (
            <ul className="space-y-2">
              {recentArticles.map((a) => (
                <li key={a.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-cauris-gray-text">{a.title}</span>
                  <span className="ml-2 shrink-0 text-xs text-cauris-gray-secondary">
                    {a.publishedAt?.toLocaleDateString('fr-FR')}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/articles"
            className="mt-3 inline-block text-xs font-semibold text-cauris-orange hover:underline"
          >
            Voir tous les articles
          </Link>
        </div>
      </div>
    </div>
  );
}
