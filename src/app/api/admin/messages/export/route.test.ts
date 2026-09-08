import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

const getAuthenticatedAdminMock = vi.fn();
vi.mock('@/lib/require-admin', () => ({
  getAuthenticatedAdmin: (...args: unknown[]) => getAuthenticatedAdminMock(...args),
}));

import { GET } from './route';

const TEST_EMAIL = 'itest-export-message@example.com';

describe('GET /api/admin/messages/export (intégration)', () => {
  beforeAll(async () => {
    await prisma.contactMessage.create({
      data: {
        firstName: 'Jean',
        lastName: 'Test',
        email: TEST_EMAIL,
        subject: 'Sujet, avec virgule',
        message: 'Ligne 1\nLigne 2',
        status: 'UNREAD',
      },
    });
  });

  afterAll(async () => {
    await prisma.contactMessage.deleteMany({ where: { email: TEST_EMAIL } });
  });

  it('refuse (403) sans utilisateur ADMIN authentifié', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce(null);
    const res = await GET();
    expect(res.status).toBe(403);
  });

  it('renvoie un CSV avec en-têtes et champs échappés (ADMIN authentifié)', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1', role: 'ADMIN' });
    const res = await GET();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/csv');
    expect(res.headers.get('Content-Disposition')).toContain('attachment');

    const csv = await res.text();
    expect(csv).toContain('Prénom,Nom,Email');
    expect(csv).toContain(TEST_EMAIL);
    expect(csv).toContain('"Sujet, avec virgule"'); // csvEscape() sur une valeur contenant une virgule
  });
});
