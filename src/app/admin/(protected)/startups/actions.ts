'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { logAudit } from '@/lib/audit-log';
import { deleteReplacedBlob, deleteBlobIfManaged } from '@/lib/blob-cleanup';
import { startupSchema, parseListField } from '@/lib/validations/startup';

function extractInput(formData: FormData) {
  return {
    slug: formData.get('slug'),
    name: formData.get('name'),
    tagline: formData.get('tagline'),
    description: formData.get('description'),
    longDescription: formData.get('longDescription'),
    sector: formData.get('sector'),
    countryName: formData.get('countryName'),
    countryCode: formData.get('countryCode'),
    city: formData.get('city'),
    status: formData.get('status'),
    year: formData.get('year'),
    foundedYear: formData.get('foundedYear') || undefined,
    logoUrl: formData.get('logoUrl'),
    websiteUrl: formData.get('websiteUrl'),
    linkedinUrl: formData.get('linkedinUrl'),
    technologies: parseListField(formData.get('technologies')),
    founders: parseListField(formData.get('founders')),
    achievements: parseListField(formData.get('achievements')),
    isFeatured: formData.get('isFeatured') === 'on',
  };
}

export type StartupFormState = { error?: string } | undefined;

export async function createStartup(
  _prevState: StartupFormState,
  formData: FormData
): Promise<StartupFormState> {
  // RM-S06 : ADMIN ou EDITOR peuvent créer (seule la suppression est réservée ADMIN)
  const user = await requireAdminUser();

  const parsed = startupSchema.safeParse(extractInput(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  const existing = await prisma.startup.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: 'Un slug identique existe déjà.' }; // RM-S01
  }

  const created = await prisma.startup.create({
    data: { ...parsed.data, createdBy: user.id },
  });

  await logAudit({
    action: 'CREATE',
    entityType: 'Startup',
    entityId: created.id,
    entityLabel: created.name,
    user,
  });

  revalidatePath('/admin/startups');
  redirect('/admin/startups');
}

export async function updateStartup(
  id: string,
  _prevState: StartupFormState,
  formData: FormData
): Promise<StartupFormState> {
  await requireAdminUser();

  const parsed = startupSchema.safeParse(extractInput(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  const existing = await prisma.startup.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== id) {
    return { error: 'Un slug identique existe déjà.' }; // RM-S01
  }

  const before = await prisma.startup.findUnique({ where: { id }, select: { logoUrl: true } });
  await prisma.startup.update({ where: { id }, data: parsed.data });
  await deleteReplacedBlob(before?.logoUrl, parsed.data.logoUrl); // CDC V2 §5.5

  revalidatePath('/admin/startups');
  redirect('/admin/startups');
}

export async function deleteStartup(id: string) {
  // RM-S06 : seul un ADMIN peut supprimer
  const user = await requireAdminUser('ADMIN');
  const deleted = await prisma.startup.delete({ where: { id } });
  await deleteBlobIfManaged(deleted.logoUrl); // CDC V2 §5.5

  await logAudit({
    action: 'DELETE',
    entityType: 'Startup',
    entityId: deleted.id,
    entityLabel: deleted.name,
    user,
  });

  revalidatePath('/admin/startups');
}
