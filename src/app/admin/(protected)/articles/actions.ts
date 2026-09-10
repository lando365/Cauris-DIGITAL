'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { logAudit } from '@/lib/audit-log';
import { deleteReplacedBlob, deleteBlobIfManaged } from '@/lib/blob-cleanup';
import { revalidatePublicArticles } from '@/lib/revalidate-public';
import { articleSchema } from '@/lib/validations/article';
import { computeReadingTime } from '@/lib/reading-time';

/** Distingue une publication immédiate d'une publication programmée dans le futur. */
function resolvePublicationDates(status: string, publishedAt: string | undefined) {
  if (status !== 'PUBLISHED') return { publishedAt: null, scheduledAt: null };
  const date = new Date(publishedAt ?? Date.now());
  return { publishedAt: date, scheduledAt: date > new Date() ? date : null };
}

function extractInput(formData: FormData) {
  return {
    slug: formData.get('slug'),
    title: formData.get('title'),
    titleEn: formData.get('titleEn'),
    excerpt: formData.get('excerpt'),
    excerptEn: formData.get('excerptEn'),
    content: formData.get('content'),
    contentEn: formData.get('contentEn'),
    category: formData.get('category'),
    coverImageUrl: formData.get('coverImageUrl'),
    status: formData.get('status'),
    publishedAt: formData.get('publishedAt'),
  };
}

export type ArticleFormState = { error?: string } | undefined;

/**
 * Crée un article (slug unique — RM-A01), calcule le temps de lecture et
 * fixe `publishedAt` si publié directement. Journalise l'action et invalide
 * les caches admin/public.
 */
export async function createArticle(
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const user = await requireAdminUser();

  const parsed = articleSchema.safeParse(extractInput(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  const existing = await prisma.article.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: 'Un article avec ce slug existe déjà.' }; // RM-A01
  }

  const { publishedAt, ...rest } = parsed.data;
  const created = await prisma.article.create({
    data: {
      ...rest,
      readingTime: computeReadingTime(parsed.data.content),
      authorId: user.id,
      ...resolvePublicationDates(parsed.data.status, publishedAt),
    },
  });

  await logAudit({
    action: 'CREATE',
    entityType: 'Article',
    entityId: created.id,
    entityLabel: created.title,
    user,
  });

  revalidatePath('/admin/articles');
  revalidatePublicArticles(created.slug);
  redirect('/admin/articles');
}

/**
 * Met à jour un article (unicité de slug re-vérifiée — RM-A01), recalcule le
 * temps de lecture, supprime l'ancienne image de couverture si remplacée, et
 * invalide les caches admin/public (y compris l'ancien slug si changé).
 */
export async function updateArticle(
  id: string,
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await requireAdminUser();

  const parsed = articleSchema.safeParse(extractInput(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  const existing = await prisma.article.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== id) {
    return { error: 'Un article avec ce slug existe déjà.' }; // RM-A01
  }

  const { publishedAt, ...rest } = parsed.data;
  const before = await prisma.article.findUnique({
    where: { id },
    select: { coverImageUrl: true, slug: true },
  });
  await prisma.article.update({
    where: { id },
    data: {
      ...rest,
      readingTime: computeReadingTime(parsed.data.content),
      ...resolvePublicationDates(parsed.data.status, publishedAt),
    },
  });
  await deleteReplacedBlob(before?.coverImageUrl, parsed.data.coverImageUrl); // CDC V2 §5.5

  revalidatePath('/admin/articles');
  revalidatePublicArticles(before?.slug, parsed.data.slug);
  redirect('/admin/articles');
}

/** Supprime un article et son image de couverture (RM-A05 : ADMIN uniquement), journalise l'action. */
export async function deleteArticle(id: string) {
  // RM-A05 : seul un ADMIN peut supprimer
  const user = await requireAdminUser('ADMIN');
  const deleted = await prisma.article.delete({ where: { id } });
  await deleteBlobIfManaged(deleted.coverImageUrl); // CDC V2 §5.5

  await logAudit({
    action: 'DELETE',
    entityType: 'Article',
    entityId: deleted.id,
    entityLabel: deleted.title,
    user,
  });

  revalidatePath('/admin/articles');
  revalidatePublicArticles(deleted.slug);
}
