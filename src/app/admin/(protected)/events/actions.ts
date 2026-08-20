'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { eventSchema } from '@/lib/validations/event';

function extractInput(formData: FormData) {
  return {
    slug: formData.get('slug'),
    title: formData.get('title'),
    description: formData.get('description'),
    type: formData.get('type'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    location: formData.get('location'),
    isOnline: formData.get('isOnline') === 'on',
    isFree: formData.get('isFree') === 'on',
    price: formData.get('price'),
    registerUrl: formData.get('registerUrl'),
    imageUrl: formData.get('imageUrl'),
    isPublished: formData.get('isPublished') === 'on',
  };
}

export type EventFormState = { error?: string } | undefined;

export async function createEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const user = await requireAdminUser();

  const parsed = eventSchema.safeParse(extractInput(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  const existing = await prisma.event.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: 'Un événement avec ce slug existe déjà.' };
  }

  const { startDate, endDate, ...rest } = parsed.data;
  await prisma.event.create({
    data: {
      ...rest,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      createdBy: user.id,
    },
  });

  revalidatePath('/admin/events');
  redirect('/admin/events');
}

export async function updateEvent(
  id: string,
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireAdminUser();

  const parsed = eventSchema.safeParse(extractInput(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  const existing = await prisma.event.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== id) {
    return { error: 'Un événement avec ce slug existe déjà.' };
  }

  const { startDate, endDate, ...rest } = parsed.data;
  await prisma.event.update({
    where: { id },
    data: {
      ...rest,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  revalidatePath('/admin/events');
  redirect('/admin/events');
}

export async function deleteEvent(id: string) {
  await requireAdminUser('ADMIN');
  await prisma.event.delete({ where: { id } });
  revalidatePath('/admin/events');
}
