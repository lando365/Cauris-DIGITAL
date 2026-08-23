'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { logAudit } from '@/lib/audit-log';
import { deleteReplacedBlob, deleteBlobIfManaged } from '@/lib/blob-cleanup';
import { articleSchema } from '@/lib/validations/article';
import { computeReadingTime } from '@/lib/reading-time';

function extractInput(formData: FormData) {
  return {
    slug: formData.get('slug'),
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    category: formData.get('category'),
    coverImageUrl: formData.get('coverImageUrl'),
    status: formData.get('status'),
    publishedAt: formData.get('publishedAt'),
  };
}

export type ArticleFormState = { error?: string } | undefined;

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
      publishedAt:
        parsed.data.status === 'PUBLISHED' ? new Date(publishedAt ?? Date.now()) : null,
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
  redirect('/admin/articles');
}

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
  const before = await prisma.article.findUnique({ where: { id }, select: { coverImageUrl: true } });
  await prisma.article.update({
    where: { id },
    data: {
      ...rest,
      readingTime: computeReadingTime(parsed.data.content),
      publishedAt:
        parsed.data.status === 'PUBLISHED' ? new Date(publishedAt ?? Date.now()) : null,
    },
  });
  await deleteReplacedBlob(before?.coverImageUrl, parsed.data.coverImageUrl); // CDC V2 §5.5

  revalidatePath('/admin/articles');
  redirect('/admin/articles');
}

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
}
