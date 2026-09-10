'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';

/** Désinscrit manuellement un abonné newsletter, sans effacer ses données (ADMIN uniquement). */
export async function unsubscribeSubscriber(id: string) {
  await requireAdminUser('ADMIN');
  await prisma.newsletterSubscriber.update({
    where: { id },
    data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() },
  });
  revalidatePath('/admin/subscribers');
}

/** Supprime définitivement un abonné newsletter (ADMIN uniquement). */
export async function deleteSubscriber(id: string) {
  await requireAdminUser('ADMIN'); // CDC §6.3.7 : DELETE /api/admin/subscribers/:id, ADMIN uniquement
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath('/admin/subscribers');
}
