'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';

/** Supprime définitivement une inscription à un événement (ADMIN uniquement). */
export async function deleteRegistration(id: string) {
  await requireAdminUser('ADMIN');
  await prisma.eventRegistration.delete({ where: { id } });
  revalidatePath('/admin/registrations');
}
