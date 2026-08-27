import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/newsletter-token';

const updateContactMock = vi.fn().mockResolvedValue({ data: {}, error: null });

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { contacts: { update: updateContactMock } };
  }),
}));

import { GET } from './route';

const TEST_EMAIL = 'itest-newsletter-unsubscribe@example.com';

function unsubscribe(token: string) {
  const url = new URL('http://localhost:3000/api/newsletter/unsubscribe');
  url.searchParams.set('token', token);
  return GET(new Request(url));
}

describe('GET /api/newsletter/unsubscribe (intégration)', () => {
  beforeAll(async () => {
    await prisma.newsletterSubscriber.create({
      data: { email: TEST_EMAIL, status: 'ACTIVE', consentGiven: true, consentDate: new Date() },
    });
  });

  afterAll(async () => {
    await prisma.newsletterSubscriber.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.$disconnect();
  });

  it('sans jeton : redirige vers la page erreur (raison=manquant)', async () => {
    const res = await GET(new Request('http://localhost:3000/api/newsletter/unsubscribe'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/newsletter/erreur?raison=manquant');
  });

  it('jeton invalide : redirige vers la page erreur (raison=invalide)', async () => {
    const res = await unsubscribe('jeton-invalide');
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/newsletter/erreur?raison=invalide');
  });

  it('jeton valide : marque l\'abonné désinscrit et redirige (désinscription en un clic)', async () => {
    const token = createToken(TEST_EMAIL, 'unsubscribe');
    const res = await unsubscribe(token);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/newsletter/desinscrit');

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: TEST_EMAIL },
    });
    expect(subscriber?.status).toBe('UNSUBSCRIBED');
    expect(subscriber?.unsubscribedAt).not.toBeNull();
    expect(updateContactMock).toHaveBeenCalledTimes(1);
  });
});
