import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

const getAuthenticatedAdminMock = vi.fn();
vi.mock('@/lib/require-admin', () => ({
  getAuthenticatedAdmin: (...args: unknown[]) => getAuthenticatedAdminMock(...args),
}));

import { GET } from './route';

const TEST_EMAIL = 'itest-export-subscriber@example.com';

describe('GET /api/admin/subscribers/export (intégration)', () => {
  beforeAll(async () => {
    await prisma.newsletterSubscriber.create({
      data: {
        email: TEST_EMAIL,
        firstName: 'Marie',
        status: 'ACTIVE',
        source: 'footer',
        consentGiven: true,
        consentDate: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.newsletterSubscriber.deleteMany({ where: { email: TEST_EMAIL } });
  });

  it('refuse (403) sans utilisateur ADMIN authentifié', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce(null);
    const res = await GET();
    expect(res.status).toBe(403);
  });

  it('renvoie un CSV avec en-têtes et l’inscrit créé (ADMIN authentifié)', async () => {
    getAuthenticatedAdminMock.mockResolvedValueOnce({ id: 'u1', role: 'ADMIN' });
    const res = await GET();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/csv');
    expect(res.headers.get('Content-Disposition')).toContain('attachment');

    const csv = await res.text();
    expect(csv).toContain("Email,Prénom,Statut,Source,Date d'inscription");
    expect(csv).toContain(TEST_EMAIL);
    expect(csv).toContain('Marie');
  });
});
