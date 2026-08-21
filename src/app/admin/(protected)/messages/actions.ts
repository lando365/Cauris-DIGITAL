'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import type { ContactMessageStatus } from '@prisma/client';

export async function updateMessageStatus(id: string, status: ContactMessageStatus) {
  await requireAdminUser(); // ADMIN ou EDITOR (CDC §6.3.7)
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath('/admin/messages');
}

export async function deleteMessage(id: string) {
  await requireAdminUser('ADMIN'); // ADMIN uniquement (CDC §6.3.7)
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath('/admin/messages');
}
