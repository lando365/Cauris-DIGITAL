import { prisma } from '@/lib/prisma';
import type { AuditAction, Prisma } from '@prisma/client';

interface LogAuditParams {
  action: AuditAction;
  entityType: string;
  entityId: string;
  entityLabel?: string;
  user: { id: string; email: string };
  metadata?: Record<string, unknown>;
}

/**
 * Journalise une action admin sensible (CDC V2 §7.6 : création, suppression,
 * modification de rôle). Ne doit jamais faire échouer l'action métier : un
 * problème de journalisation est loggé côté serveur mais ne bloque rien.
 */
export async function logAudit({
  action,
  entityType,
  entityId,
  entityLabel,
  user,
  metadata,
}: LogAuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        entityLabel,
        userId: user.id,
        userEmail: user.email,
        metadata: metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error('[audit-log] Échec de la journalisation:', error);
  }
}
