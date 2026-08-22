import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD manquants (voir .env).');
  }

  await page.goto('/admin/login');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.getByRole('button', { name: /se connecter/i }).click();
  await expect(page).toHaveURL(/\/admin$/, { timeout: 15_000 });
}
