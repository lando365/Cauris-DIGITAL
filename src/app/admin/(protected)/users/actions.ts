'use server';

import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { logAudit } from '@/lib/audit-log';
import { createUserSchema, updateUserSchema, passwordSchema } from '@/lib/validations/user';

export type UserFormState = { error?: string } | undefined;

export async function createUser(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const actor = await requireAdminUser('ADMIN'); // RM-U03

  const parsed = createUserSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
    role: formData.get('role'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: 'Cet email est déjà utilisé.' }; // RM-U02
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const created = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role,
      passwordHash,
    },
  });

  await logAudit({
    action: 'CREATE',
    entityType: 'User',
    entityId: created.id,
    entityLabel: created.email,
    user: actor,
    metadata: { role: created.role },
  });

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function updateUser(
  id: string,
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const currentUser = await requireAdminUser('ADMIN'); // RM-U03

  const parsed = updateUserSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    isActive: formData.get('isActive') === 'on',
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return { error: 'Utilisateur introuvable.' };
  }

  if (id === currentUser.id && parsed.data.role !== target.role) {
    return { error: 'Vous ne pouvez pas modifier votre propre rôle.' }; // RM-U04
  }

  const roleChanged = parsed.data.role !== target.role;

  await prisma.user.update({ where: { id }, data: parsed.data });

  if (roleChanged) {
    await logAudit({
      action: 'ROLE_CHANGE',
      entityType: 'User',
      entityId: target.id,
      entityLabel: target.email,
      user: currentUser,
      metadata: { fromRole: target.role, toRole: parsed.data.role },
    });
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export type ResetPasswordState = { error?: string; newPassword?: string } | undefined;

function generateTempPassword(): string {
  // Respecte RM-U01 par construction (12+ car., 1 maj., 1 chiffre, 1 spécial).
  const base = randomBytes(9).toString('base64').replace(/[+/=]/g, '');
  return `${base}Ax9!`;
}

export async function resetUserPassword(
  id: string,
  _prevState: ResetPasswordState
): Promise<ResetPasswordState> {
  await requireAdminUser('ADMIN'); // RM-U03

  const newPassword = generateTempPassword();
  passwordSchema.parse(newPassword); // garde-fou : échoue bruyamment si generateTempPassword casse un jour
  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id },
    data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
  });

  return { newPassword };
}
