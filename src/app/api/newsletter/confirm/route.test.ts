import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/newsletter-token';

const sendMock = vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null });
const createContactMock = vi.fn().mockResolvedValue({ data: {}, error: null });

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return {
      emails: { send: sendMock },
      contacts: { create: createContactMock },
    };
  }),
}));

import { GET } from './route';

const TEST_EMAIL = 'itest-newsletter-confirm@example.com';

function confirm(token: string, firstName?: string) {
  const url = new URL('http://localhost:3000/api/newsletter/confirm');
  url.searchParams.set('token', token);
  if (firstName) url.searchParams.set('firstName', firstName);
  return GET(new Request(url));
}

describe('GET /api/newsletter/confirm (intégration)', () => {
  beforeEach(() => {
    sendMock.mockClear();
    createContactMock.mockClear();
  });

  afterAll(async () => {
    await prisma.newsletterSubscriber.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.$disconnect();
  });

  it('sans jeton : redirige vers la page erreur (raison=manquant)', async () => {
    const res = await GET(new Request('http://localhost:3000/api/newsletter/confirm'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/newsletter/erreur?raison=manquant');
  });

  it('jeton invalide : redirige vers la page erreur (raison=invalide)', async () => {
    const res = await confirm('jeton-invalide');
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/newsletter/erreur?raison=invalide');
  });

  it('jeton valide : crée l\'abonné en base et redirige vers la confirmation', async () => {
    const token = createToken(TEST_EMAIL, 'confirm');
    const res = await confirm(token, 'Jean');

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/newsletter/confirmee');

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: TEST_EMAIL },
    });
    expect(subscriber?.status).toBe('ACTIVE');
    expect(subscriber?.consentGiven).toBe(true);
    expect(createContactMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1); // email de bienvenue
  });

  it('une réinscription réactive le compte plutôt que de dupliquer la ligne (RM-N03)', async () => {
    await prisma.newsletterSubscriber.update({
      where: { email: TEST_EMAIL },
      data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() },
    });

    const token = createToken(TEST_EMAIL, 'confirm');
    await confirm(token);

    const rows = await prisma.newsletterSubscriber.findMany({ where: { email: TEST_EMAIL } });
    expect(rows).toHaveLength(1);
    expect(rows[0].status).toBe('ACTIVE');
    expect(rows[0].unsubscribedAt).toBeNull();
  });
});
