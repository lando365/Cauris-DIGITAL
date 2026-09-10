'use server';

import { redirect } from 'next/navigation';
import { signOut } from '@/auth';

/** Déconnecte l'utilisateur admin (révoque la session) et redirige vers la page de connexion. */
export async function logoutAction() {
  await signOut({ redirect: false });
  redirect('/admin/login');
}
