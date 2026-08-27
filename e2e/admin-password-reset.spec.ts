import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createPasswordResetToken } from '../src/lib/password-reset-token';

const prisma = new PrismaClient();

// CDC V2 §6.3.1, §7.2 — Réinitialisation de mot de passe en libre-service par
// email (token unique à usage unique, valable 1h).
//
// Utilise un compte ADMIN dédié et jetable, jamais le compte seedé partagé
// (SEED_ADMIN_EMAIL) : les specs s'exécutent en parallèle sur plusieurs
// workers, et muter le mot de passe du compte partagé casse les autres
// tests qui appellent loginAsAdmin() en même temps (constaté en pratique).

const TEST_EMAIL = 'e2e-password-reset@example.com';
const INITIAL_PASSWORD = 'MotDePasseInitial-E2E-1!';
const NEW_PASSWORD = 'Nouveau-Mdp-E2E-1!';

test.describe('Réinitialisation de mot de passe', () => {
  test.beforeAll(async () => {
    const passwordHash = await bcrypt.hash(INITIAL_PASSWORD, 12);
    await prisma.user.upsert({
      where: { email: TEST_EMAIL },
      update: { passwordHash, role: 'ADMIN', isActive: true },
      create: { email: TEST_EMAIL, name: 'E2E Password Reset', passwordHash, role: 'ADMIN' },
    });
  });

  test('POST /api/auth/reset-password répond de façon générique (anti-énumération)', async ({
    request,
  }) => {
    const resKnown = await request.post('/api/auth/reset-password', {
      data: { email: TEST_EMAIL },
    });
    const resUnknown = await request.post('/api/auth/reset-password', {
      data: { email: 'inconnu-e2e@example.com' },
    });
    expect(resKnown.status()).toBe(200);
    expect(resUnknown.status()).toBe(200);
    expect(await resKnown.json()).toEqual(await resUnknown.json());
  });

  test('un lien valide permet de définir un nouveau mot de passe, connexion possible ensuite', async ({
    page,
  }) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: TEST_EMAIL } });
    const token = createPasswordResetToken(user.id, user.passwordHash);

    await page.goto(`/admin/reset-password?token=${encodeURIComponent(token)}`);
    await page.fill('#password', NEW_PASSWORD);
    await page.fill('#confirmPassword', NEW_PASSWORD);
    await page.getByRole('button', { name: /réinitialiser le mot de passe/i }).click();

    await expect(page).toHaveURL(/\/admin\/login\?reset=success/, { timeout: 15_000 });
    await expect(page.getByText(/mot de passe réinitialisé/i)).toBeVisible();

    // Connexion avec le NOUVEAU mot de passe.
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', NEW_PASSWORD);
    await page.getByRole('button', { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 15_000 });
  });

  test('un jeton lié à un ancien mot de passe est rejeté (usage unique)', async ({ page }) => {
    // Jeton signé avec l'empreinte du mot de passe INITIAL (avant le test
    // précédent) — doit être rejeté puisque le mot de passe a changé depuis.
    const user = await prisma.user.findUniqueOrThrow({ where: { email: TEST_EMAIL } });
    const initialPasswordHash = await bcrypt.hash(INITIAL_PASSWORD, 12);
    const staleToken = createPasswordResetToken(user.id, initialPasswordHash);

    await page.goto(`/admin/reset-password?token=${encodeURIComponent(staleToken)}`);
    await page.fill('#password', 'AutreMotDePasse123!');
    await page.fill('#confirmPassword', 'AutreMotDePasse123!');
    await page.getByRole('button', { name: /réinitialiser le mot de passe/i }).click();

    await expect(page.getByText(/lien de réinitialisation invalide/i)).toBeVisible();
  });

  test.afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.$disconnect();
  });
});
