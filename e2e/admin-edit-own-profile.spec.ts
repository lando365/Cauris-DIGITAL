import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { loginAsAdmin } from './helpers';

const prisma = new PrismaClient();

// Régression : le <select> "Rôle" et la case "Compte actif" sont désactivés
// (disabled) sur son propre profil (RM-U04). Un champ HTML désactivé n'est
// jamais envoyé au submit — sans champ caché de secours, le rôle manquant
// faisait échouer la validation Zod ("Invalid option: expected one of
// 'ADMIN'|'EDITOR'"), empêchant même de modifier son propre nom.
test.describe('Modifier son propre profil admin', () => {
  let originalName: string;

  test.beforeAll(async () => {
    const email = process.env.SEED_ADMIN_EMAIL!;
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    originalName = user.name;
  });

  test.afterAll(async () => {
    await prisma.user.update({
      where: { email: process.env.SEED_ADMIN_EMAIL! },
      data: { name: originalName },
    });
    await prisma.$disconnect();
  });

  test('changer son propre nom réussit, sans erreur de validation sur le rôle', async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/users');

    const row = page.locator('tr', { hasText: process.env.SEED_ADMIN_EMAIL! });
    await row.getByRole('link', { name: /modifier/i }).click();
    await expect(page).toHaveURL(/\/admin\/users\/[^/]+\/edit$/);

    // Le rôle est bien désactivé pour son propre compte (RM-U04).
    await expect(page.locator('#role')).toBeDisabled();

    const newName = 'Florentin TEJANG KAMTE (test E2E)';
    await page.fill('#name', newName);
    await page.getByRole('button', { name: /enregistrer/i }).click();

    // Succès attendu : redirection vers la liste, pas de message d'erreur Zod.
    await expect(page).toHaveURL(/\/admin\/users$/, { timeout: 10_000 });
    await expect(page.getByText(/invalid option/i)).toHaveCount(0);
    await expect(page.getByRole('cell', { name: newName })).toBeVisible();
  });
});
