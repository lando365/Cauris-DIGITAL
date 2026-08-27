import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendMock = vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null });

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: sendMock } };
  }),
}));

import { POST } from './route';

function postJson(body: unknown) {
  return POST(
    new Request('http://localhost:3000/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  );
}

describe('POST /api/newsletter (intégration)', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });

  it('rejette une adresse email invalide', async () => {
    const res = await postJson({ email: 'pas-un-email', consent: true });
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('rejette une inscription sans consentement (RM-N02)', async () => {
    const res = await postJson({ email: 'valide@example.com', consent: false });
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('honeypot rempli : répond succès sans envoyer d\'email (anti-spam)', async () => {
    const res = await postJson({
      email: 'bot@example.com',
      consent: true,
      website: 'http://spam.example',
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('inscription valide : envoie un email de confirmation', async () => {
    const res = await postJson({ email: 'nouvel-inscrit@example.com', consent: true });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock.mock.calls[0][0].to).toEqual(['nouvel-inscrit@example.com']);
  });
});
