import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const EDITOR_EMAIL = 'e2e-editor-rbac@example.com';
const EDITOR_PASSWORD = 'Ee2eEditorRbac1!';

// CDC V2 §13 EX-08 — Contrôle RBAC (Middleware Next.js + handlers API).
// Complète les tests fonctionnels existants : vérifie que l'accès est bien
// refusé, pas seulement que l'accès autorisé fonctionne.

test.describe('RBAC — accès non authentifié', () => {
  test('GET /api/admin/subscribers/export refuse (403) sans session', async ({ request }) => {
    const res = await request.get('/api/admin/subscribers/export');
    expect(res.status()).toBe(403);
    const json = await res.json();
    expect(json.error.code).toBe('FORBIDDEN');
  });

  test('GET /api/admin/messages/export refuse (403) sans session', async ({ request }) => {
    const res = await request.get('/api/admin/messages/export');
    expect(res.status()).toBe(403);
  });

  test('/admin/startups redirige vers /admin/login sans session', async ({ page }) => {
    await page.goto('/admin/startups');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('RBAC — rôle EDITOR sur module ADMIN uniquement', () => {
  test.beforeAll(async () => {
    const passwordHash = await bcrypt.hash(EDITOR_PASSWORD, 12);
    await prisma.user.upsert({
      where: { email: EDITOR_EMAIL },
      update: { passwordHash, role: 'EDITOR', isActive: true },
      create: { email: EDITOR_EMAIL, name: 'E2E Editor RBAC', passwordHash, role: 'EDITOR' },
    });
  });

  test('un EDITOR est redirigé hors de /admin/users (RM-U03)', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('#email', EDITOR_EMAIL);
    await page.fill('#password', EDITOR_PASSWORD);
    await page.getByRole('button', { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 15_000 });

    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { name: 'Utilisateurs' })).not.toBeVisible();
  });

  test.afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: EDITOR_EMAIL } });
  });
});

test.afterAll(async () => {
  await prisma.$disconnect();
});
