import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { DeleteArticleButton } from './DeleteArticleButton';
import type { ArticleStatus } from '@prisma/client';

const TABS: { label: string; value: ArticleStatus | 'ALL' }[] = [
  { label: 'Tous', value: 'ALL' },
  { label: 'Brouillons', value: 'DRAFT' },
  { label: 'Publiés', value: 'PUBLISHED' },
  { label: 'Archivés', value: 'ARCHIVED' },
];

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const user = await requireAdminUser();

  const activeTab = (status as ArticleStatus | undefined) ?? 'ALL';
  const articles = await prisma.article.findMany({
    where: activeTab === 'ALL' ? {} : { status: activeTab },
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-montserrat text-xl font-bold text-cauris-black">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-md bg-cauris-orange px-4 py-2 text-sm font-semibold text-white hover:bg-cauris-orange-dark"
        >
          + Nouvel article
        </Link>
      </div>

      <div className="mb-4 flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === 'ALL' ? '/admin/articles' : `/admin/articles?status=${tab.value}`}
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

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-cauris-gray-secondary">
            <tr>
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">Catégorie</th>
              <th className="px-4 py-2">Auteur</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Temps de lecture</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2 font-medium text-cauris-black">{a.title}</td>
                <td className="px-4 py-2">{a.category}</td>
                <td className="px-4 py-2">{a.author.name}</td>
                <td className="px-4 py-2">{a.status}</td>
                <td className="px-4 py-2">{a.readingTime} min</td>
                <td className="px-4 py-2">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="text-cauris-orange hover:underline"
                    >
                      Modifier
                    </Link>
                    {user.role === 'ADMIN' && <DeleteArticleButton id={a.id} title={a.title} />}
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-cauris-gray-secondary">
                  Aucun article pour l'instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
