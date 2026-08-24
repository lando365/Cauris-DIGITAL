'use server';

import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { logAudit } from '@/lib/audit-log';
import { createPasswordResetToken } from '@/lib/password-reset-token';
import { SITE_CONFIG } from '@/lib/constants';
import { createUserSchema, updateUserSchema, passwordSchema } from '@/lib/validations/user';

// CDC V2 §8.2.7 : "Création d'un compte avec envoi d'email d'invitation."
// Le mot de passe choisi par l'admin n'est jamais envoyé en clair par email —
// l'invitation propose plutôt d'en définir un nouveau via le même lien
// signé que la réinitialisation en libre-service (src/lib/password-reset-token.ts).
async function sendInvitationEmail(user: {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const token = createPasswordResetToken(user.id, user.passwordHash);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_CONFIG.url;
  const setPasswordUrl = new URL('/admin/reset-password', siteUrl);
  setPasswordUrl.searchParams.set('token', token);

  if (!apiKey) {
    console.log(
      '[invitation] RESEND_API_KEY absente — lien (mode dev) :',
      setPasswordUrl.toString()
    );
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_EMAIL_FROM ?? 'CAURIS DIGITAL <onboarding@resend.dev>';

  const { error } = await resend.emails.send({
    from,
    to: [user.email],
    subject: 'Votre compte CAURIS DIGITAL — Espace administrateur',
    html: `
      <!DOCTYPE html>
      <html lang="fr">
        <body style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFF5EE;">
          <div style="background: #1A1A2E; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">
              <span style="color: #E8640A;">CAURIS DIGITAL</span> — Espace administrateur
            </h1>
          </div>
          <div style="background: white; padding: 32px 28px; border-radius: 0 0 12px 12px;">
            <p>Bonjour ${user.name},</p>
            <p>Un compte administrateur vient d'être créé pour vous sur le back-office CAURIS DIGITAL.</p>
            <p style="text-align: center; margin: 28px 0;">
              <a href="${setPasswordUrl.toString()}" style="display: inline-block; background: #E8640A; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Définir mon mot de passe
              </a>
            </p>
            <p style="color: #6C757D; font-size: 13px;">Ce lien est valable 1 heure et à usage unique.</p>
          </div>
        </body>
      </html>
    `,
    text: `Compte CAURIS DIGITAL créé\n\nBonjour ${user.name},\n\nUn compte administrateur vient d'être créé pour vous. Définissez votre mot de passe (lien valable 1h) :\n${setPasswordUrl.toString()}`,
  });

  if (error) {
    console.error('[invitation] Erreur Resend:', error);
  }
}

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

  await sendInvitationEmail(created);

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
