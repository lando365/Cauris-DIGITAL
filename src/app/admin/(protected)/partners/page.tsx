import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { DeletePartnerButton } from './DeletePartnerButton';

export default async function AdminPartnersPage() {
  const user = await requireAdminUser();
  const partners = await prisma.partner.findMany({ orderBy: { displayOrder: 'asc' } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-montserrat text-xl font-bold text-cauris-black">Partenaires</h1>
        <Link
          href="/admin/partners/new"
          className="rounded-md bg-cauris-orange px-4 py-2 text-sm font-semibold text-white hover:bg-cauris-orange-dark"
        >
          + Nouveau partenaire
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-cauris-gray-secondary">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Catégorie</th>
              <th className="px-4 py-2">Ordre</th>
              <th className="px-4 py-2">En vedette</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2 font-medium text-cauris-black">{p.name}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">{p.displayOrder}</td>
                <td className="px-4 py-2">{p.isFeatured ? 'Oui' : 'Non'}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/partners/${p.id}/edit`}
                      className="text-cauris-orange hover:underline"
                    >
                      Modifier
                    </Link>
                    {user.role === 'ADMIN' && <DeletePartnerButton id={p.id} name={p.name} />}
                  </div>
                </td>
              </tr>
            ))}
            {partners.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-cauris-gray-secondary">
                  Aucun partenaire pour l'instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
