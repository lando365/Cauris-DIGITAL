import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const [startupCount, articleCount, unreadMessageCount, activeSubscriberCount] =
    await Promise.all([
      prisma.startup.count(),
      prisma.article.count(),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
    ]);

  const counters = [
    { label: 'Startups', value: startupCount },
    { label: 'Articles', value: articleCount },
    { label: 'Messages non lus', value: unreadMessageCount },
    { label: 'Inscrits newsletter actifs', value: activeSubscriberCount },
  ];

  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">Tableau de bord</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {counters.map((c) => (
          <div key={c.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-2xl font-bold text-cauris-orange">{c.value}</p>
            <p className="text-sm text-cauris-gray-secondary">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
