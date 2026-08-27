import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { loginAsAdmin } from './helpers';

const prisma = new PrismaClient();
const TEST_EMAIL = 'e2e-message-export@example.com';

// CDC V2 §6.3.7 — Admin : export CSV des messages de contact.
test('un admin exporte les messages de contact au format CSV', async ({ page }) => {
  await prisma.contactMessage.create({
    data: {
      firstName: 'Jean',
      lastName: 'E2E',
      email: TEST_EMAIL,
      subject: 'Nouveau message via le formulaire de contact',
      message: 'Message de test pour la vérification de l\'export CSV.',
    },
  });

  await loginAsAdmin(page);
  await page.goto('/admin/messages');
  await expect(page.getByText(TEST_EMAIL)).toBeVisible();

  const exportLink = page.getByRole('link', { name: /exporter en csv/i });
  await expect(exportLink).toBeVisible();

  const href = await exportLink.getAttribute('href');
  const res = await page.request.get(href!);

  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('text/csv');
  expect(res.headers()['content-disposition']).toContain('attachment');

  const csv = await res.text();
  expect(csv).toContain('Email');
  expect(csv).toContain(TEST_EMAIL);
});

test.afterAll(async () => {
  await prisma.contactMessage.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});
