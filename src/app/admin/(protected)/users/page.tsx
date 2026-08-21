import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';

export default async function AdminUsersPage() {
  await requireAdminUser('ADMIN'); // RM-U03 : module réservé ADMIN
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-montserrat text-xl font-bold text-cauris-black">Utilisateurs</h1>
        <Link
          href="/admin/users/new"
          className="rounded-md bg-cauris-orange px-4 py-2 text-sm font-semibold text-white hover:bg-cauris-orange-dark"
        >
          + Nouvel utilisateur
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-cauris-gray-secondary">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rôle</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Dernière connexion</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2 font-medium text-cauris-black">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">{u.isActive ? 'Actif' : 'Désactivé'}</td>
                <td className="px-4 py-2">
                  {u.lastLoginAt ? u.lastLoginAt.toLocaleString('fr-FR') : '—'}
                </td>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/users/${u.id}/edit`}
                    className="text-cauris-orange hover:underline"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
