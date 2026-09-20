import { describe, it, expect, vi } from 'vitest';

const getAuthenticatedAdminMock = vi.fn();
vi.mock('@/lib/require-admin', () => ({
  getAuthenticatedAdmin: (...args: unknown[]) => getAuthenticatedAdminMock(...args),
}));

const putMock = vi.fn().mockResolvedValue({ url: 'https://blob.example.com/fake.jpg' });
vi.mock('@vercel/blob', () => ({
  put: (...args: unknown[]) => putMock(...args),
}));

import { POST } from './route';

function buildRequest(form: FormData) {
  return new Request('http://localhost:3000/api/admin/upload', { method: 'POST', body: form });
}

// En-têtes réels (magic bytes) des formats acceptés : le serveur vérifie le contenu,
// pas seulement le type MIME déclaré.
const SIGNATURES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff, 0xe0],
  'image/png': [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  'image/webp': [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50],
};

function makeFile(name: string, type: string, size: number): File {
  const bytes = new Uint8Array(Math.max(size, 16));
  bytes.set(SIGNATURES[type] ?? []);
  return new File([bytes], name, { type });
}

function makeFileWithContent(name: string, type: string, content: string): File {
  return new File([content], name, { type });
}

describe('POST /api/admin/upload (intégration — CDC V2 §5.5, §12.7)', () => {
  it('refuse (403) sans session admin/éditeur', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce(null);
    const form = new FormData();
    form.set('file', makeFile('logo.jpg', 'image/jpeg', 100));
    form.set('entityType', 'startup');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(403);
  });

  it('rejette une requête sans fichier (400)', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    form.set('entityType', 'startup');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(400);
  });

  it("rejette un type d'entité invalide (400)", async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    form.set('file', makeFile('logo.jpg', 'image/jpeg', 100));
    form.set('entityType', 'bogus');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(400);
  });

  it('rejette un logo startup > 2 Mo (RM-S05)', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    form.set('file', makeFile('logo.jpg', 'image/jpeg', 3 * 1024 * 1024));
    form.set('entityType', 'startup');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('FILE_TOO_LARGE');
  });

  it('rejette un format MIME non supporté (GIF)', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    form.set('file', makeFile('logo.gif', 'image/gif', 100));
    form.set('entityType', 'startup');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('UNSUPPORTED_FORMAT');
  });

  it('rejette une extension de fichier incohérente avec le MIME déclaré (défense en profondeur)', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    // MIME déclaré "image/jpeg" mais extension .php — cas d'un exécutable renommé.
    form.set('file', makeFile('logo.php', 'image/jpeg', 100));
    form.set('entityType', 'startup');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('UNSUPPORTED_FORMAT');
  });

  it('rejette le SVG pour une image article (formats limités à JPG/PNG/WEBP)', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    form.set('file', makeFile('cover.svg', 'image/svg+xml', 100));
    form.set('entityType', 'article');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('UNSUPPORTED_FORMAT');
  });

  it('rejette un fichier déclaré image/jpeg dont le contenu est un exécutable (magic bytes)', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    // Type MIME et extension corrects, mais contenu "MZ" (en-tête d'exécutable Windows).
    form.set('file', makeFileWithContent('logo.jpg', 'image/jpeg', 'MZ fake executable content'));
    form.set('entityType', 'startup');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('UNSUPPORTED_FORMAT');
  });

  it('rejette un PNG déclaré dont le contenu est en réalité un JPEG', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    form.set(
      'file',
      new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0])], 'logo.png', {
        type: 'image/png',
      })
    );
    form.set('entityType', 'startup');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(400);
  });

  it('rejette un SVG contenant du script actif', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    form.set(
      'file',
      makeFileWithContent(
        'logo.svg',
        'image/svg+xml',
        '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
      )
    );
    form.set('entityType', 'startup');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(400);
  });

  it('accepte un SVG sain pour un logo', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    form.set(
      'file',
      makeFileWithContent(
        'logo.svg',
        'image/svg+xml',
        '<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>'
      )
    );
    form.set('entityType', 'startup');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(200);
  });

  it('accepte un logo JPG valide sous 2 Mo et nomme le fichier sans suffixe cover', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    form.set('file', makeFile('logo.jpg', 'image/jpeg', 100));
    form.set('entityType', 'startup');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.url).toBe('https://blob.example.com/fake.jpg');

    const [pathnameArg] = putMock.mock.calls.at(-1) as [string];
    expect(pathnameArg).toMatch(/^startup-[0-9a-f]+-\d+\.jpg$/);
  });

  it('accepte une image de couverture article et nomme le fichier avec le suffixe cover', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1' });
    const form = new FormData();
    form.set('file', makeFile('cover.png', 'image/png', 100));
    form.set('entityType', 'article');

    const res = await POST(buildRequest(form));
    expect(res.status).toBe(200);

    const [pathnameArg] = putMock.mock.calls.at(-1) as [string];
    expect(pathnameArg).toMatch(/^article-[0-9a-f]+-cover-\d+\.png$/);
  });
});
