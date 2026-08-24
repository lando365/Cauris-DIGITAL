import { createHmac, timingSafeEqual, createHash } from 'crypto';

/**
 * Jeton signé (HMAC-SHA256) pour la réinitialisation de mot de passe en
 * libre-service (CDC V2 §6.3.1, §7.2 : "token unique à usage unique,
 * valable 1 heure").
 *
 * Même approche auto-porteuse que newsletter-token.ts (pas de table dédiée),
 * avec un mécanisme d'usage unique sans stockage : le jeton embarque une
 * empreinte du passwordHash actuel de l'utilisateur au moment de l'émission.
 * Dès que le mot de passe change (via ce flux ou une réinitialisation admin),
 * l'empreinte ne correspond plus et l'ancien jeton devient invalide de
 * lui-même — inutile de le révoquer explicitement quelque part.
 */

const RESET_TOKEN_TTL_SECONDS = 60 * 60; // 1 heure (§7.2)

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET manquant — requis pour signer les jetons de réinitialisation.');
  }
  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

function fingerprint(passwordHash: string): string {
  return createHash('sha256').update(passwordHash).digest('base64url').slice(0, 16);
}

export function createPasswordResetToken(userId: string, currentPasswordHash: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + RESET_TOKEN_TTL_SECONDS;
  const payload = `${userId}|${expiresAt}|${fingerprint(currentPasswordHash)}`;
  const encodedPayload = base64url(payload);
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

interface VerifyResult {
  valid: boolean;
  userId?: string;
  reason?: 'malformed' | 'signature' | 'expired' | 'already-used';
}

export function verifyPasswordResetToken(token: string, currentPasswordHash: string): VerifyResult {
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, reason: 'malformed' };
  const [encodedPayload, signature] = parts;

  const expectedSignature = sign(encodedPayload);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, reason: 'signature' };
  }

  const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  const [userId, expiresAtStr, tokenFingerprint] = payload.split('|');
  if (!userId || !expiresAtStr || !tokenFingerprint) return { valid: false, reason: 'malformed' };

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() / 1000 > expiresAt) {
    return { valid: false, reason: 'expired' };
  }

  if (tokenFingerprint !== fingerprint(currentPasswordHash)) {
    return { valid: false, reason: 'already-used' };
  }

  return { valid: true, userId };
}
