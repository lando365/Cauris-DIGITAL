import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { loginAsAdmin } from './helpers';

const prisma = new PrismaClient();
const TEST_SLUG = 'e2e-article-publication';

// CDC V2 §12.4, Scénario 4 — Admin : publication d'un article depuis l'état brouillon.
test('un admin crée un brouillon puis le publie, visible ensuite publiquement', async ({
  page,
}) => {
  await loginAsAdmin(page);

  // 1. Création en brouillon
  await page.goto('/admin/articles/new');
  await page.fill('#slug', TEST_SLUG);
  await page.fill('#title', 'Article E2E — publication depuis brouillon');
  await page.fill('#excerpt', 'Extrait de test E2E.');
  await page.fill('#content', 'Contenu de test généré par Playwright pour valider la publication.');
  // Le statut par défaut du formulaire est DRAFT — on ne le touche pas ici.
  await page.getByRole('button', { name: /créer l'article/i }).click();
  await expect(page).toHaveURL(/\/admin\/articles$/, { timeout: 15_000 });

  // L'article en brouillon ne doit PAS être visible publiquement
  const draftCheck = await page.request.get(`/api/articles/${TEST_SLUG}`);
  expect(draftCheck.status()).toBe(404);

  // 2. Édition → publication
  await page
    .getByRole('row', { name: 'Article E2E — publication depuis brouillon' })
    .getByRole('link', { name: /modifier/i })
    .click();
  await expect(page).toHaveURL(/\/admin\/articles\/.+\/edit$/);
  await page.selectOption('#status', 'PUBLISHED');
  await page.getByRole('button', { name: /enregistrer/i }).click();
  await expect(page).toHaveURL(/\/admin\/articles$/, { timeout: 15_000 });

  // 3. Vérification publique
  const publishedCheck = await page.request.get(`/api/articles/${TEST_SLUG}`);
  expect(publishedCheck.status()).toBe(200);

  await page.goto(`/fr/actualites/${TEST_SLUG}`);
  await expect(
    page.getByRole('heading', { name: 'Article E2E — publication depuis brouillon' })
  ).toBeVisible();
});

test.afterAll(async () => {
  await prisma.article.deleteMany({ where: { slug: TEST_SLUG } });
  await prisma.$disconnect();
});
