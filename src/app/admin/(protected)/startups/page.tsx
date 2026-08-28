import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { DeleteStartupButton } from './DeleteStartupButton';
import type { Prisma, Sector, StartupStatus } from '@prisma/client';

const SECTORS: Sector[] = ['AGRITECH', 'FINTECH', 'EDTECH', 'HEALTHTECH', 'SMART_CITIES'];
const STATUSES: StartupStatus[] = ['EN_INCUBATION', 'DIPLOMEE', 'ALUMNI'];

export default async function AdminStartupsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sector?: string; status?: string }>;
}) {
  const { q, sector, status } = await searchParams;
  const user = await requireAdminUser();

  const where: Prisma.StartupWhereInput = {};
  if (q) {
    where.name = { contains: q, mode: 'insensitive' };
  }
  if (sector && SECTORS.includes(sector as Sector)) {
    where.sector = sector as Sector;
  }
  if (status && STATUSES.includes(status as StartupStatus)) {
    where.status = status as StartupStatus;
  }

  const startups = await prisma.startup.findMany({ where, orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-montserrat text-xl font-bold text-cauris-black">Startups</h1>
        <Link
          href="/admin/startups/new"
          className="rounded-md bg-cauris-orange px-4 py-2 text-sm font-semibold text-white hover:bg-cauris-orange-dark"
        >
          + Nouvelle startup
        </Link>
      </div>

      <form className="mb-4 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un nom…"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
        <select
          name="sector"
          defaultValue={sector ?? ''}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">Tous secteurs</option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status ?? ''}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">Tous statuts</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Filtrer
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-cauris-gray-secondary">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Secteur</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">En vedette</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {startups.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2 font-medium text-cauris-black">{s.name}</td>
                <td className="px-4 py-2">{s.sector}</td>
                <td className="px-4 py-2">{s.status}</td>
                <td className="px-4 py-2">{s.isFeatured ? 'Oui' : 'Non'}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/startups/${s.id}/edit`}
                      className="text-cauris-orange hover:underline"
                    >
                      Modifier
                    </Link>
                    {user.role === 'ADMIN' && <DeleteStartupButton id={s.id} name={s.name} />}
                  </div>
                </td>
              </tr>
            ))}
            {startups.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-cauris-gray-secondary">
                  Aucune startup pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
