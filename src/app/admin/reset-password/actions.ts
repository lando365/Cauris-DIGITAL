'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyPasswordResetToken } from '@/lib/password-reset-token';
import { passwordSchema } from '@/lib/validations/user';

export type ResetPasswordFormState = { error?: string } | undefined;

export async function resetPasswordWithToken(
  token: string,
  _prevState: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  const parsed = passwordSchema.safeParse(password); // RM-U01
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Mot de passe invalide.' };
  }
  if (password !== confirmPassword) {
    return { error: 'Les mots de passe ne correspondent pas.' };
  }

  // Le userId n'est pas encore connu tant que le jeton n'est pas décodé, mais
  // le décodage a besoin du passwordHash actuel pour vérifier l'empreinte —
  // on extrait donc le userId en clair du payload avant vérification complète.
  const [encodedPayload] = token.split('.');
  let candidateUserId: string | undefined;
  try {
    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    candidateUserId = payload.split('|')[0];
  } catch {
    return { error: 'Lien de réinitialisation invalide ou expiré.' };
  }

  const user = candidateUserId
    ? await prisma.user.findUnique({ where: { id: candidateUserId } })
    : null;
  if (!user) {
    return { error: 'Lien de réinitialisation invalide ou expiré.' };
  }

  const result = verifyPasswordResetToken(token, user.passwordHash);
  if (!result.valid || result.userId !== user.id) {
    return { error: 'Lien de réinitialisation invalide, déjà utilisé ou expiré.' };
  }

  const passwordHash = await bcrypt.hash(parsed.data, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
  });

  redirect('/admin/login?reset=success');
}
