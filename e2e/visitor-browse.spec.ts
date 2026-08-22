import { test, expect } from '@playwright/test';

// CDC V2 §12.4, Scénario 1 — Visiteur : consulter la liste des startups,
// cliquer sur une fiche, lire un article.
test('un visiteur consulte les startups puis lit un article', async ({ page }) => {
  await page.goto('/fr/startups');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const firstStartupLink = page.locator('main a[href*="/fr/startups/"]').first();
  await expect(firstStartupLink).toBeVisible();
  await firstStartupLink.click();

  await expect(page).toHaveURL(/\/fr\/startups\/[a-z0-9-]+/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.goto('/fr/actualites');
  const firstArticleLink = page.locator('main a[href*="/fr/actualites/"]').first();
  await expect(firstArticleLink).toBeVisible();
  await firstArticleLink.click();

  await expect(page).toHaveURL(/\/fr\/actualites\/[a-z0-9-]+/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
