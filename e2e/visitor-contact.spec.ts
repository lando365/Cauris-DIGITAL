import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TEST_EMAIL = 'jean.e2e@example.com';

// CDC V2 §12.4, Scénario 2 — Visiteur : soumettre le formulaire de contact
// et vérifier la page de confirmation.
test('un visiteur soumet le formulaire de contact et voit la confirmation', async ({ page }) => {
  await page.goto('/fr/contact');

  await page.fill('#firstName', 'Jean');
  await page.fill('#lastName', 'Testeur');
  await page.fill('#email', TEST_EMAIL);
  await page.selectOption('#subject', 'autre');
  await page.fill(
    '#message',
    'Ceci est un message de test end-to-end envoyé automatiquement par Playwright.'
  );
  await page.check('#consent');

  await page.getByRole('button', { name: /envoyer/i }).click();

  await expect(page.getByText('Merci pour votre message !')).toBeVisible({ timeout: 15_000 });
});

test.afterAll(async () => {
  await prisma.contactMessage.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});
