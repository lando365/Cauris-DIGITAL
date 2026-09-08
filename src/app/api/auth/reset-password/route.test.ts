import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const sendMock = vi.fn().mockResolvedValue({ data: {}, error: null });
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: sendMock } };
  }),
}));

import { POST } from './route';

const TEST_EMAIL = 'itest-reset-password@example.com';
const INACTIVE_EMAIL = 'itest-reset-password-inactive@example.com';

function post(body: unknown) {
  return POST(
    new Request('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  );
}

describe('POST /api/auth/reset-password (intégration)', () => {
  beforeAll(async () => {
    const passwordHash = await bcrypt.hash('OldPassword123!', 10);
    await prisma.user.createMany({
      data: [
        { email: TEST_EMAIL, name: 'Itest Reset', passwordHash, role: 'EDITOR', isActive: true },
        {
          email: INACTIVE_EMAIL,
          name: 'Itest Inactif',
          passwordHash,
          role: 'EDITOR',
          isActive: false,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [TEST_EMAIL, INACTIVE_EMAIL] } } });
  });

  it('rejette un corps de requête non-JSON (400)', async () => {
    const res = await POST(
      new Request('http://localhost:3000/api/auth/reset-password', { method: 'POST', body: '{' })
    );
    expect(res.status).toBe(400);
  });

  it('rejette un email au format invalide (400)', async () => {
    const res = await post({ email: 'pas-un-email' });
    expect(res.status).toBe(400);
  });

  it('répond de façon générique pour un email inexistant (anti-énumération, RM-U — OWASP §9.3)', async () => {
    sendMock.mockClear();
    const res = await post({ email: 'inconnu-itest@example.com' });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toMatch(/Si un compte existe/);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('répond de façon générique pour un compte désactivé, sans envoyer d’email', async () => {
    sendMock.mockClear();
    const res = await post({ email: INACTIVE_EMAIL });
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('envoie un email de réinitialisation pour un compte actif existant', async () => {
    sendMock.mockClear();
    const res = await post({ email: TEST_EMAIL });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toMatch(/Si un compte existe/);
    if (process.env.RESEND_API_KEY) {
      expect(sendMock).toHaveBeenCalledTimes(1);
      const [args] = sendMock.mock.calls[0] as [{ to: string[]; subject: string }];
      expect(args.to).toContain(TEST_EMAIL);
    }
  });
});
