import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
} from 'lucide-react';
import {
  ARTICLE_CATEGORY_COLORS,
  SITE_CONFIG,
  type Article as DisplayArticle,
} from '@/lib/constants';
import Button from '@/components/ui/Button';
import ArticleCard from '@/components/ui/ArticleCard';
import { prisma } from '@/lib/prisma';
import { mapArticle } from '@/lib/content-mappers';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// CDC V2 §4.3.1 : détail public en cache ISR (revalidate 60s). Pas de
// generateStaticParams : un article publié après le build doit rester
// accessible immédiatement.
export const revalidate = 60;

async function getPublishedArticleBySlug(slug: string) {
  const record = await prisma.article.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });
  if (
    !record ||
    record.status !== 'PUBLISHED' ||
    !record.publishedAt ||
    record.publishedAt > new Date()
  ) {
    return null;
  }
  return mapArticle(record);
}

async function getRelatedArticles(current: DisplayArticle, limit = 3): Promise<DisplayArticle[]> {
  const records = await prisma.article.findMany({
    where: { status: 'PUBLISHED', publishedAt: { lte: new Date() }, slug: { not: current.slug } },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 30,
  });
  const mapped = records.map(mapArticle);
  return mapped.filter((a) => a.category === current.category).slice(0, limit);
}

/**
 * Métadonnées SEO dynamiques par article (CDC §7.1).
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) {
    const t = await getTranslations('ArticleDetail');
    return { title: t('notFoundTitle') };
  }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      images: [{ url: article.image, width: 1200, height: 675, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const t = await getTranslations('ArticleDetail');
  const tEnum = await getTranslations('Enums');
  const locale = await getLocale();
  const related = await getRelatedArticles(article, 3);
  const shareUrl = `${SITE_CONFIG.url}/actualites/${article.slug}`;
  const categoryColor = ARTICLE_CATEGORY_COLORS[article.category];

  return (
    <>
      {/* JSON-LD pour SEO (CDC §7.1 — Données structurées Schema.org) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.excerpt,
            image: article.image,
            datePublished: article.date,
            author: { '@type': 'Organization', name: article.author },
            publisher: {
              '@type': 'Organization',
              name: SITE_CONFIG.name,
              logo: { '@type': 'ImageObject', url: `${SITE_CONFIG.url}/og-image.jpg` },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': shareUrl },
          }),
        }}
      />

      {/* Hero article */}
      <article>
        <header className="pt-32 pb-10 lg:pt-40 lg:pb-14 bg-cauris-cream/40">
          <div className="container-cauris">
            <div className="max-w-3xl">
              {/* Fil d'Ariane */}
              <Link
                href="/actualites"
                className="inline-flex items-center gap-2 text-sm text-cauris-gray-secondary hover:text-cauris-orange mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                {t('backToNews')}
              </Link>

              {/* Catégorie */}
              <span
                className={`inline-flex text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full mb-5 ${categoryColor}`}
              >
                {tEnum(`category.${article.category}`)}
              </span>

              {/* Titre */}
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-cauris-black mb-6">
                {article.title}
              </h1>

              {/* Méta */}
              <div className="flex items-center gap-4 text-sm text-cauris-gray-secondary flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  {formatDate(article.date, locale)}
                </span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  {t('readingTime', { minutes: article.readingTime })}
                </span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  {article.author}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Image principale */}
        <div className="container-cauris">
          <div className="max-w-4xl mx-auto -mt-2 mb-12">
            <figure>
              <div className="relative rounded-card overflow-hidden shadow-card-hover aspect-[16/9]">
                <Image
                  src={article.image}
                  alt={article.imageCaption ?? article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
              {article.imageCaption && (
                <figcaption className="mt-3 text-xs text-cauris-gray-secondary italic text-center">
                  {article.imageCaption}
                </figcaption>
              )}
            </figure>
          </div>
        </div>

        {/* Corps de l'article */}
        <div className="container-cauris pb-16 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
            {/* Boutons de partage (sticky) */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-28 flex lg:flex-col gap-3">
                <p className="hidden lg:block text-[10px] uppercase tracking-wider font-semibold text-cauris-gray-secondary mb-1">
                  {t('share')}
                </p>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-cauris-cream hover:bg-cauris-orange hover:text-white text-cauris-gray-text flex items-center justify-center transition-colors"
                  aria-label={t('shareLinkedin')}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-cauris-cream hover:bg-cauris-orange hover:text-white text-cauris-gray-text flex items-center justify-center transition-colors"
                  aria-label={t('shareTwitter')}
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-cauris-cream hover:bg-cauris-orange hover:text-white text-cauris-gray-text flex items-center justify-center transition-colors"
                  aria-label={t('shareFacebook')}
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(shareUrl)}`}
                  className="w-10 h-10 rounded-full bg-cauris-cream hover:bg-cauris-orange hover:text-white text-cauris-gray-text flex items-center justify-center transition-colors"
                  aria-label={t('shareEmail')}
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </aside>

            {/* Contenu */}
            <div className="lg:col-span-11 order-1 lg:order-2">
              <div className="prose prose-cauris max-w-3xl mx-auto">
                {article.content.map((block, i) => {
                  if (block.type === 'paragraph') {
                    return (
                      <p
                        key={i}
                        className="text-base lg:text-lg text-cauris-gray-text leading-relaxed mb-6"
                      >
                        {block.text}
                      </p>
                    );
                  }
                  if (block.type === 'h2') {
                    return (
                      <h2
                        key={i}
                        className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mt-12 mb-5"
                      >
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === 'h3') {
                    return (
                      <h3
                        key={i}
                        className="font-heading font-bold text-xl text-cauris-black mt-10 mb-4"
                      >
                        {block.text}
                      </h3>
                    );
                  }
                  if (block.type === 'quote') {
                    return (
                      <blockquote
                        key={i}
                        className="my-10 px-6 py-5 border-l-4 border-cauris-orange bg-cauris-cream/40 rounded-r-card"
                      >
                        <p className="font-heading text-lg lg:text-xl text-cauris-black italic leading-relaxed mb-2">
                          « {block.text} »
                        </p>
                        {block.citation && (
                          <footer className="text-sm text-cauris-gray-secondary">
                            — {block.citation}
                          </footer>
                        )}
                      </blockquote>
                    );
                  }
                  if (block.type === 'list' && block.items) {
                    return (
                      <ul key={i} className="my-6 space-y-2">
                        {block.items.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 text-base text-cauris-gray-text leading-relaxed"
                          >
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cauris-orange shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return null;
                })}
              </div>

              {/* CTA fin d'article (Textes_Site_v1 §11) */}
              <div className="max-w-3xl mx-auto mt-16">
                <div className="bg-cauris-orange text-white rounded-card p-8 lg:p-10 text-center">
                  <p className="font-heading font-bold text-xl lg:text-2xl mb-4 leading-tight">
                    {t('ctaTitle')}
                  </p>
                  <p className="text-white/90 leading-relaxed mb-6">{t('ctaText')}</p>
                  <Link
                    href="/programme-incubation"
                    className="inline-flex items-center gap-2 rounded-btn bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cauris-orange transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {t('ctaButton')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Articles liés */}
      {related.length > 0 && (
        <section className="section bg-cauris-gray-bg">
          <div className="container-cauris">
            <div className="flex items-end justify-between mb-10 max-w-6xl mx-auto">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange mb-2">
                  {t('relatedEyebrow')}
                </p>
                <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black">
                  {t('relatedTitle')}
                </h2>
              </div>
              <Link
                href="/actualites"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-cauris-orange hover:underline"
              >
                {t('viewAllNews')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
