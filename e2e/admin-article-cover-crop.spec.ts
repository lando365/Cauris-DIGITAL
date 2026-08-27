import path from 'node:path';
import { test, expect } from '@playwright/test';
import { del } from '@vercel/blob';
import { loginAsAdmin } from './helpers';

// CDC V2 §8.2.3 : "Upload de l'image de couverture avec recadrage."

test('le recadrage de l\'image de couverture s\'affiche et produit une image téléversée', async ({
  page,
}) => {
  await loginAsAdmin(page);
  await page.goto('/admin/articles/new');

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test-cover.png'));

  // La modale de recadrage doit apparaître avant tout envoi.
  await expect(page.getByText("Recadrer l'image")).toBeVisible();

  await page.getByRole('button', { name: /valider le recadrage/i }).click();

  // Une fois confirmé, la modale se ferme et l'aperçu de l'image envoyée apparaît.
  await expect(page.getByText("Recadrer l'image")).not.toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole('button', { name: /retirer/i })).toBeVisible();

  const uploadedUrl = await page.locator('input[name="coverImageUrl"]').inputValue();
  expect(uploadedUrl).toBeTruthy();
  await del(uploadedUrl);
});
