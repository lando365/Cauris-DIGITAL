import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { loginAsAdmin } from './helpers';

const prisma = new PrismaClient();
const TEST_SLUG = 'e2e-startup-demo-day';

// CDC V2 §12.4, Scénario 3 — Admin : connexion, création d'une startup,
// vérification sur le site public, déconnexion.
test('un admin se connecte, crée une startup visible publiquement, puis se déconnecte', async ({
  page,
}) => {
  await loginAsAdmin(page);

  await page.goto('/admin/startups/new');
  await page.fill('#slug', TEST_SLUG);
  await page.fill('#name', 'E2E Demo Day Startup');
  await page.fill('#tagline', 'Une startup créée par un test E2E.');
  await page.fill('#description', 'Description de test générée par Playwright.');
  await page.fill('#countryName', 'Cameroun');
  await page.fill('#countryCode', 'CM');
  await page.fill('#year', String(new Date().getFullYear()));
  await page.getByRole('button', { name: /créer la startup/i }).click();

  await expect(page).toHaveURL(/\/admin\/startups$/, { timeout: 15_000 });
  await expect(page.getByText('E2E Demo Day Startup')).toBeVisible();

  // Vérification sur le site public
  await page.goto(`/fr/startups/${TEST_SLUG}`);
  await expect(page.getByRole('heading', { name: 'E2E Demo Day Startup' })).toBeVisible();

  // Déconnexion
  await page.goto('/admin');
  await page.getByRole('button', { name: /déconnexion/i }).click();
  await expect(page).toHaveURL(/\/admin\/login$/, { timeout: 15_000 });

  // Une fois déconnecté, /admin doit rediriger vers /admin/login (pas d'accès résiduel)
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test.afterAll(async () => {
  await prisma.startup.deleteMany({ where: { slug: TEST_SLUG } });
  await prisma.$disconnect();
});
