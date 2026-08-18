import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { validateDbSession } from '@/lib/session';
import type { Role } from '@prisma/client';

/**
 * Contrôle d'accès autoritaire pour les Server Components / layouts sous /admin.
 * Le middleware ne fait qu'un contrôle rapide (JWT présent) ; cette fonction fait
 * la vérification réelle en base (session non révoquée, compte actif, rôle) et
 * redirige vers /admin/login si elle échoue.
 */
export async function requireAdminUser(requiredRole?: Role) {
  const session = await auth();
  if (!session?.sessionToken) {
    redirect('/admin/login');
  }

  const user = await validateDbSession(session.sessionToken);
  if (!user) {
    redirect('/admin/login');
  }

  if (requiredRole && user.role !== requiredRole) {
    redirect('/admin');
  }

  return user;
}

/**
 * Même contrôle pour les Route Handlers (/api/admin/*) : ne redirige pas,
 * retourne null pour laisser l'appelant répondre 401/403 en JSON.
 */
export async function getAuthenticatedAdmin(requiredRole?: Role) {
  const session = await auth();
  if (!session?.sessionToken) return null;

  const user = await validateDbSession(session.sessionToken);
  if (!user) return null;

  if (requiredRole && user.role !== requiredRole) return null;

  return user;
}
