import { randomUUID } from 'crypto';
import { prisma } from './prisma';

// CDC V2 §7.1 : durée de session 24h, prolongée à chaque action active.
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export async function createDbSession(userId: string) {
  const sessionToken = randomUUID();
  const expires = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: { sessionToken, userId, expires },
  });

  return { sessionToken, expires };
}

/**
 * Vérifie qu'un jeton de session correspond à une session encore valide en base
 * (non expirée, non révoquée) et prolonge son expiration. C'est cette vérification
 * DB — impossible à faire dans le middleware Edge — qui assure la "révocation
 * immédiate" exigée par le CDC §7.1 : supprimer la ligne Session invalide
 * immédiatement le jeton, même si le cookie JWT reste valide jusqu'à son expiry.
 */
export async function validateDbSession(sessionToken: string) {
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || session.expires < new Date() || !session.user.isActive) {
    return null;
  }

  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  await prisma.session.update({
    where: { sessionToken },
    data: { expires },
  });

  return session.user;
}

export async function revokeDbSession(sessionToken: string) {
  await prisma.session.deleteMany({ where: { sessionToken } });
}
