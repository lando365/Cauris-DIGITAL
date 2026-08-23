import { test, expect } from '@playwright/test';
import { del } from '@vercel/blob';
import { loginAsAdmin } from './helpers';

// CDC V2 §12.7 — Tests de sécurité : "Upload malveillant : fichier > 2 Mo,
// format non supporté (EXE, PHP)."

test.describe('Upload malveillant', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('rejette un format non supporté (.exe)', async ({ page }) => {
    const res = await page.request.post('/api/admin/upload', {
      multipart: {
        entityType: 'startup',
        file: {
          name: 'malware.exe',
          mimeType: 'application/x-msdownload',
          buffer: Buffer.from('MZ fake executable content'),
        },
      },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('UNSUPPORTED_FORMAT');
  });

  test('rejette un fichier .jpg renommé en réalité PHP (extension/MIME incohérents)', async ({ page }) => {
    const res = await page.request.post('/api/admin/upload', {
      multipart: {
        entityType: 'startup',
        file: {
          name: 'shell.php',
          mimeType: 'application/x-httpd-php',
          buffer: Buffer.from('<?php echo "test"; ?>'),
        },
      },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('UNSUPPORTED_FORMAT');
  });

  test('rejette un logo startup > 2 Mo (RM-S05)', async ({ page }) => {
    const oversized = Buffer.alloc(2 * 1024 * 1024 + 1, 'a');
    const res = await page.request.post('/api/admin/upload', {
      multipart: {
        entityType: 'startup',
        file: {
          name: 'big-logo.jpg',
          mimeType: 'image/jpeg',
          buffer: oversized,
        },
      },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('FILE_TOO_LARGE');
  });

  test('rejette une image article > 5 Mo (RM-A04)', async ({ page }) => {
    const oversized = Buffer.alloc(5 * 1024 * 1024 + 1, 'a');
    const res = await page.request.post('/api/admin/upload', {
      multipart: {
        entityType: 'article',
        file: {
          name: 'big-cover.jpg',
          mimeType: 'image/jpeg',
          buffer: oversized,
        },
      },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('FILE_TOO_LARGE');
  });

  test('rejette le SVG pour une image article (formats limités à JPG/PNG/WEBP)', async ({ page }) => {
    const res = await page.request.post('/api/admin/upload', {
      multipart: {
        entityType: 'article',
        file: {
          name: 'cover.svg',
          mimeType: 'image/svg+xml',
          buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
        },
      },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('UNSUPPORTED_FORMAT');
  });

  test('accepte un logo JPG valide sous 2 Mo', async ({ page }) => {
    const res = await page.request.post('/api/admin/upload', {
      multipart: {
        entityType: 'startup',
        file: {
          name: 'logo.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from('fake but valid-looking jpeg bytes'),
        },
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.url).toContain('.jpg');
    await del(json.url);
  });
});

test('refuse (403) un upload sans session admin', async ({ request }) => {
  const res = await request.post('/api/admin/upload', {
    multipart: {
      entityType: 'startup',
      file: { name: 'logo.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('x') },
    },
  });
  expect(res.status()).toBe(403);
});
