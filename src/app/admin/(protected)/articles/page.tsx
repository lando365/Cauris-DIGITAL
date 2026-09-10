import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { DeleteArticleButton } from './DeleteArticleButton';
import type { Prisma, ArticleCategory, ArticleStatus } from '@prisma/client';

const TABS: { label: string; value: ArticleStatus | 'ALL' }[] = [
  { label: 'Tous', value: 'ALL' },
  { label: 'Brouillons', value: 'DRAFT' },
  { label: 'Publiés', value: 'PUBLISHED' },
  { label: 'Archivés', value: 'ARCHIVED' },
];

const CATEGORIES: ArticleCategory[] = [
  'ANNONCES',
  'PORTRAITS',
  'RESSOURCES',
  'EVENEMENTS',
  'OPINIONS',
];

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; authorId?: string }>;
}) {
  const { status, category, authorId } = await searchParams;
  const user = await requireAdminUser();

  const activeTab = (status as ArticleStatus | undefined) ?? 'ALL';
  const where: Prisma.ArticleWhereInput = {};
  if (activeTab !== 'ALL') {
    where.status = activeTab;
  }
  if (category && CATEGORIES.includes(category as ArticleCategory)) {
    where.category = category as ArticleCategory;
  }
  if (authorId) {
    where.authorId = authorId;
  }

  const [articles, authors] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    }),
    prisma.user.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);

  const filterQuery = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status, category, authorId, ...overrides };
    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `/admin/articles?${qs}` : '/admin/articles';
  };

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
            href={filterQuery({ status: tab.value === 'ALL' ? undefined : tab.value })}
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

      <form className="mb-4 flex flex-wrap gap-3" method="get">
        {status && <input type="hidden" name="status" value={status} />}
        <select
          name="category"
          defaultValue={category ?? ''}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="authorId"
          defaultValue={authorId ?? ''}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">Tous auteurs</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
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
                <td className="px-4 py-2">
                  {a.scheduledAt && a.scheduledAt > new Date()
                    ? `PROGRAMMÉ (${a.scheduledAt.toLocaleDateString('fr-FR')})`
                    : a.status}
                </td>
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
                  Aucun article pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
