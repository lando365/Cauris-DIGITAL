'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { logAudit } from '@/lib/audit-log';
import { partnerSchema } from '@/lib/validations/partner';

function extractInput(formData: FormData) {
  return {
    name: formData.get('name'),
    logoUrl: formData.get('logoUrl'),
    websiteUrl: formData.get('websiteUrl'),
    category: formData.get('category'),
    displayOrder: formData.get('displayOrder') || 0,
    isFeatured: formData.get('isFeatured') === 'on',
  };
}

export type PartnerFormState = { error?: string } | undefined;

export async function createPartner(
  _prevState: PartnerFormState,
  formData: FormData
): Promise<PartnerFormState> {
  const user = await requireAdminUser();

  const parsed = partnerSchema.safeParse(extractInput(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  const created = await prisma.partner.create({ data: { ...parsed.data, createdBy: user.id } });

  await logAudit({
    action: 'CREATE',
    entityType: 'Partner',
    entityId: created.id,
    entityLabel: created.name,
    user,
  });

  revalidatePath('/admin/partners');
  redirect('/admin/partners');
}

export async function updatePartner(
  id: string,
  _prevState: PartnerFormState,
  formData: FormData
): Promise<PartnerFormState> {
  await requireAdminUser();

  const parsed = partnerSchema.safeParse(extractInput(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  await prisma.partner.update({ where: { id }, data: parsed.data });

  revalidatePath('/admin/partners');
  redirect('/admin/partners');
}

export async function deletePartner(id: string) {
  const user = await requireAdminUser('ADMIN');
  const deleted = await prisma.partner.delete({ where: { id } });

  await logAudit({
    action: 'DELETE',
    entityType: 'Partner',
    entityId: deleted.id,
    entityLabel: deleted.name,
    user,
  });

  revalidatePath('/admin/partners');
}
