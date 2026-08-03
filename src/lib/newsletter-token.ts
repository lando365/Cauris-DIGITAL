import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Jetons signés (HMAC-SHA256) pour le double opt-in newsletter (CDC §6.5).
 *
 * Pas de base de données dans ce projet V1 : plutôt que de stocker un état
 * "en attente de confirmation" quelque part, le jeton est auto-porteur —
 * il encode l'email, l'usage (confirm/unsubscribe) et une expiration, signés
 * avec un secret serveur. La vérification se fait sans lire ni écrire nulle
 * part, ce qui reste cohérent avec l'architecture "tout en dur" de la V1.
 */

export type TokenPurpose = 'confirm' | 'unsubscribe';

const CONFIRM_TOKEN_TTL_SECONDS = 60 * 60 * 48; // 48h pour confirmer l'inscription
const UNSUBSCRIBE_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 400; // ~13 mois, largement suffisant

function getSecret(): string {
  const secret = process.env.NEWSLETTER_TOKEN_SECRET || process.env.RESEND_API_KEY;
  if (!secret) {
    // Mode dev sans aucune clé configurée : secret de repli non sécurisé,
    // acceptable uniquement en local (voir README / SETUP_RESEND.md).
    return 'dev-fallback-secret-do-not-use-in-production';
  }
  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function createToken(email: string, purpose: TokenPurpose): string {
  const ttl = purpose === 'confirm' ? CONFIRM_TOKEN_TTL_SECONDS : UNSUBSCRIBE_TOKEN_TTL_SECONDS;
  const expiresAt = Math.floor(Date.now() / 1000) + ttl;
  const payload = `${email.toLowerCase().trim()}|${purpose}|${expiresAt}`;
  const encodedPayload = base64url(payload);
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

interface VerifyResult {
  valid: boolean;
  email?: string;
  reason?: 'malformed' | 'signature' | 'expired' | 'purpose';
}

export function verifyToken(token: string, expectedPurpose: TokenPurpose): VerifyResult {
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
  const [email, purpose, expiresAtStr] = payload.split('|');
  if (!email || !purpose || !expiresAtStr) return { valid: false, reason: 'malformed' };
  if (purpose !== expectedPurpose) return { valid: false, reason: 'purpose' };

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() / 1000 > expiresAt) {
    return { valid: false, reason: 'expired' };
  }

  return { valid: true, email };
}
