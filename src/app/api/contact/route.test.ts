import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

const sendMock = vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null });

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: sendMock } };
  }),
}));

import { POST } from './route';

const TEST_EMAIL = 'itest-contact@example.com';

function baseFields(): Record<string, string> {
  return {
    firstName: 'Jean',
    lastName: 'Testeur',
    email: TEST_EMAIL,
    subject: 'autre',
    message: 'Ceci est un message de test avec largement plus de vingt caractères.',
    consent: 'on',
  };
}

function postForm(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return POST(new Request('http://localhost:3000/api/contact', { method: 'POST', body: formData }));
}

describe('POST /api/contact (intégration)', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });

  afterAll(async () => {
    await prisma.contactMessage.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.$disconnect();
  });

  it('honeypot rempli : répond succès sans rien envoyer ni persister', async () => {
    const res = await postForm({ ...baseFields(), website: 'http://spam.example' });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();

    const rows = await prisma.contactMessage.findMany({ where: { email: TEST_EMAIL } });
    expect(rows).toHaveLength(0);
  });

  it('rejette une adresse email invalide', async () => {
    const res = await postForm({ ...baseFields(), email: 'pas-un-email' });
    expect(res.status).toBe(400);
  });

  it('rejette un message de moins de 20 caractères', async () => {
    const res = await postForm({ ...baseFields(), message: 'trop court' });
    expect(res.status).toBe(400);
  });

  it('rejette un message de plus de 10 000 caractères (CDC V2 §7.5)', async () => {
    const res = await postForm({ ...baseFields(), message: 'a'.repeat(10_001) });
    expect(res.status).toBe(400);
  });

  it('rejette une soumission sans consentement', async () => {
    const fields = baseFields();
    delete (fields as Partial<typeof fields>).consent;
    const res = await postForm(fields);
    expect(res.status).toBe(400);
  });

  it('candidature startup : exige startupName/secteur/stade', async () => {
    const res = await postForm({ ...baseFields(), subject: 'candidature' });
    expect(res.status).toBe(400);
  });

  it('partenariat corporate : exige société/téléphone', async () => {
    const res = await postForm({ ...baseFields(), subject: 'partenariat-corporate' });
    expect(res.status).toBe(400);
  });

  it('soumission valide : envoie l\'email et persiste le message en base', async () => {
    const res = await postForm(baseFields());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);

    const stored = await prisma.contactMessage.findFirst({ where: { email: TEST_EMAIL } });
    expect(stored).not.toBeNull();
    expect(stored?.firstName).toBe('Jean');
  });
});
