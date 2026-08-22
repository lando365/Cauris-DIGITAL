'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import {
  ARTICLE_CATEGORIES,
  type Article,
  type ArticleCategory,
} from '@/lib/constants';
import ArticleCard from '@/components/ui/ArticleCard';

const PAGE_SIZE = 6;

/**
 * Explorateur du blog : filtres par catégorie + recherche + pagination.
 * Les articles viennent de la base (Server Component parent).
 */
export default function NewsExplorer({ articles }: { articles: Article[] }) {
  const [category, setCategory] = useState<'Toutes' | ArticleCategory>('Toutes');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== 'Toutes' && a.category !== category) return false;
      if (q && !`${a.title} ${a.excerpt}`.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [articles, category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleCategoryChange = (cat: 'Toutes' | ArticleCategory) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <section className="section">
      <div className="container-cauris">
        {/* Filtres : catégories + recherche */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {ARTICLE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-cauris-orange text-white shadow-cta'
                    : 'bg-cauris-cream text-cauris-gray-text hover:bg-cauris-orange/10 hover:text-cauris-orange'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative lg:max-w-xs lg:w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cauris-gray-secondary"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher un article…"
              className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors text-sm bg-white"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cauris-gray-secondary hover:text-cauris-orange"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Articles */}
        {visible.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="font-heading font-bold text-xl text-cauris-black mb-2">
              Aucun article ne correspond à votre recherche
            </h3>
            <p className="text-cauris-gray-text">
              Essayez avec d&apos;autres mots-clés ou changez de catégorie.
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {visible.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Pagination des articles"
                className="mt-14 flex items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="px-4 py-2 rounded-btn border border-gray-200 text-sm font-medium text-cauris-gray-text hover:border-cauris-orange hover:text-cauris-orange disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    aria-current={safePage === p ? 'page' : undefined}
                    className={`w-10 h-10 rounded-btn text-sm font-semibold transition-colors ${
                      safePage === p
                        ? 'bg-cauris-orange text-white'
                        : 'border border-gray-200 text-cauris-gray-text hover:border-cauris-orange hover:text-cauris-orange'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="px-4 py-2 rounded-btn border border-gray-200 text-sm font-medium text-cauris-gray-text hover:border-cauris-orange hover:text-cauris-orange disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                  <ArrowRight className="inline w-3.5 h-3.5 ml-1" />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
