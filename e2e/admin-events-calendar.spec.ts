import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

// CDC V2 §8.2.3 (aperçu Markdown temps réel) et §8.2.4 (vue calendrier).

test('la vue calendrier des événements admin bascule sans erreur', async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/admin/events');

  await expect(page.getByRole('button', { name: 'Liste' })).toBeVisible();
  await page.getByRole('button', { name: 'Calendrier' }).click();

  // Grille 7 colonnes (jours de la semaine) visible sans erreur de rendu.
  await expect(page.getByText('Lun', { exact: true })).toBeVisible();
  await expect(page.getByText('Dim', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /précédent/i }).click();
  await page.getByRole('button', { name: /suivant/i }).click();
});

test("l'aperçu Markdown de l'éditeur d'article se met à jour en temps réel", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/admin/articles/new');

  await page.fill('#content', '## Titre de section\n\nUn **paragraphe** en gras.');

  // react-markdown doit avoir rendu un vrai <h2> et un <strong>, pas du texte brut.
  await expect(page.locator('h2', { hasText: 'Titre de section' })).toBeVisible();
  await expect(page.locator('strong', { hasText: 'paragraphe' })).toBeVisible();
});
