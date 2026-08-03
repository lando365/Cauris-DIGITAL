import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Calendar, Clock, User } from 'lucide-react';
import { ARTICLE_CATEGORY_COLORS, type Article } from '@/lib/constants';

interface ArticleCardProps {
  article: Article;
  /** Variante compacte (sans image) pour les listes "articles liés". */
  compact?: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Carte d'article réutilisable (NewsExplorer + Articles liés).
 */
export default function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const categoryColor = ARTICLE_CATEGORY_COLORS[article.category];

  return (
    <article className="group flex flex-col h-full">
      {!compact && (
        <Link
          href={`/actualites/${article.slug}`}
          className="relative block overflow-hidden rounded-card mb-4 shadow-card group-hover:shadow-card-hover transition-shadow aspect-[16/10]"
          aria-label={`Lire l'article : ${article.title}`}
        >
          <Image
            src={article.image}
            alt={`Illustration de l'article « ${article.title} »`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}

      <span
        className={`inline-flex self-start text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full mb-3 ${categoryColor}`}
      >
        {article.category}
      </span>

      <h3
        className={`font-heading font-bold leading-tight mb-2 group-hover:text-cauris-orange transition-colors ${
          compact ? 'text-base lg:text-lg' : 'text-lg lg:text-xl'
        } text-cauris-black`}
      >
        <Link href={`/actualites/${article.slug}`}>{article.title}</Link>
      </h3>

      <p
        className={`text-cauris-gray-text leading-relaxed mb-4 line-clamp-2 ${
          compact ? 'text-xs' : 'text-sm'
        }`}
      >
        {article.excerpt}
      </p>

      <div className="mt-auto flex items-center gap-3 text-xs text-cauris-gray-secondary flex-wrap">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          {formatDate(article.date)}
        </span>
        <span aria-hidden>·</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" aria-hidden="true" />
          {article.readingTime} min
        </span>
        {!compact && (
          <>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1 truncate">
              <User className="w-3 h-3" aria-hidden="true" />
              <span className="truncate">{article.author}</span>
            </span>
          </>
        )}
      </div>
    </article>
  );
}
