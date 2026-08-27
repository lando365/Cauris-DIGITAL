import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { getSubscriptionGrowth } from '@/lib/newsletter-stats';
import { GrowthChart } from '@/components/admin/GrowthChart';
import { UnsubscribeButton } from './UnsubscribeButton';

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const user = await requireAdminUser();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const where = q ? { email: { contains: q, mode: 'insensitive' as const } } : {};

  const [subscribers, totalActive, newThisMonth, growth] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
    prisma.newsletterSubscriber.count({
      where: { status: 'ACTIVE', createdAt: { gte: startOfMonth } },
    }),
    getSubscriptionGrowth(30),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-montserrat text-xl font-bold text-cauris-black">Newsletter</h1>
        {user.role === 'ADMIN' && (
          <a
            href="/api/admin/subscribers/export"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-cauris-black hover:bg-gray-50"
          >
            Exporter en CSV
          </a>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-2xl font-bold text-cauris-orange">{totalActive}</p>
          <p className="text-sm text-cauris-gray-secondary">Inscrits actifs</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-2xl font-bold text-cauris-orange">{newThisMonth}</p>
          <p className="text-sm text-cauris-gray-secondary">Nouveaux ce mois-ci</p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <GrowthChart data={growth} label="Évolution des inscriptions (30 derniers jours)" />
      </div>

      <form className="mb-4" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Rechercher par email…"
          className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </form>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-cauris-gray-secondary">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Prénom</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Source</th>
              <th className="px-4 py-2">Date d'inscription</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2 font-medium text-cauris-black">{s.email}</td>
                <td className="px-4 py-2">{s.firstName ?? '—'}</td>
                <td className="px-4 py-2">{s.status}</td>
                <td className="px-4 py-2">{s.source ?? '—'}</td>
                <td className="px-4 py-2">{s.createdAt.toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-2">
                  {user.role === 'ADMIN' && s.status === 'ACTIVE' && (
                    <UnsubscribeButton id={s.id} email={s.email} />
                  )}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-cauris-gray-secondary">
                  Aucun inscrit pour l'instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
