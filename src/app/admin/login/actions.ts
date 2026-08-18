'use server';

import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { prisma } from '@/lib/prisma';
import { isLocked } from '@/lib/login-rate-limit';

export async function loginAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return 'Email et mot de passe requis.';
  }

  // Pré-contrôle du verrouillage (RM-U05) : message dédié sans passer par
  // authorize(), pour éviter de compter une nouvelle tentative sur un compte
  // déjà bloqué et pour renvoyer le message exact exigé par le CDC.
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && (await isLocked(user.id))) {
    return 'Trop de tentatives. Réessayez dans 15 minutes.';
  }

  try {
    // redirect: false — on gère la redirection nous-mêmes ci-dessous plutôt que
    // de dépendre de la résolution interne de redirectTo (peu fiable en local
    // sans trustHost sur cette version bêta de NextAuth v5).
    await signIn('credentials', { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Email ou mot de passe incorrect.';
    }
    throw error;
  }

  redirect('/admin');
}
