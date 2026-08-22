import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { loginAsAdmin } from './helpers';

const prisma = new PrismaClient();
const TEST_EMAIL = 'e2e-subscriber@example.com';

// CDC V2 §12.4, Scénario 5 — Admin : export CSV de la liste des inscrits newsletter.
test('un admin exporte la liste des inscrits newsletter au format CSV', async ({ page }) => {
  await prisma.newsletterSubscriber.create({
    data: { email: TEST_EMAIL, status: 'ACTIVE', consentGiven: true, consentDate: new Date() },
  });

  await loginAsAdmin(page);
  await page.goto('/admin/subscribers');
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
  await prisma.newsletterSubscriber.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});
