import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

const sendMock = vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null });

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: sendMock } };
  }),
}));

import { POST } from './route';

const TEST_SLUG = 'itest-event-registration';
const PAST_SLUG = 'itest-event-registration-past';
let eventId: string;

function register(slug: string, body: Record<string, unknown>) {
  return POST(
    new Request(`http://localhost:3000/api/events/${slug}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ slug }) }
  );
}

describe('POST /api/events/[slug]/register (intégration)', () => {
  beforeAll(async () => {
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const event = await prisma.event.create({
      data: {
        slug: TEST_SLUG,
        title: 'Événement de test',
        description: 'Description de test',
        type: 'WEBINAIRE',
        startDate: future,
        location: 'En ligne',
        isOnline: true,
        isPublished: true,
      },
    });
    eventId = event.id;

    await prisma.event.create({
      data: {
        slug: PAST_SLUG,
        title: 'Événement passé de test',
        description: 'Description de test',
        type: 'WEBINAIRE',
        startDate: past,
        location: 'En ligne',
        isOnline: true,
        isPublished: true,
      },
    });
  });

  afterAll(async () => {
    await prisma.event.deleteMany({ where: { slug: { in: [TEST_SLUG, PAST_SLUG] } } });
    await prisma.$disconnect();
  });

  it('événement introuvable : renvoie 404', async () => {
    const res = await register('slug-inexistant', {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
    });
    expect(res.status).toBe(404);
  });

  it('événement déjà passé : renvoie 400', async () => {
    const res = await register(PAST_SLUG, {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
    });
    expect(res.status).toBe(400);
  });

  it('champs invalides : renvoie 400', async () => {
    const res = await register(TEST_SLUG, {
      firstName: '',
      lastName: 'Dupont',
      email: 'pas-un-email',
    });
    expect(res.status).toBe(400);
  });

  it('honeypot rempli : renvoie succès sans rien enregistrer', async () => {
    const res = await register(TEST_SLUG, {
      firstName: 'Bot',
      lastName: 'Spam',
      email: 'bot@example.com',
      website: 'http://spam.example.com',
    });
    expect(res.status).toBe(200);

    const rows = await prisma.eventRegistration.findMany({ where: { email: 'bot@example.com' } });
    expect(rows).toHaveLength(0);
  });

  it('inscription valide : enregistre et renvoie succès', async () => {
    const res = await register(TEST_SLUG, {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '+237600000000',
      guestsCount: 2,
      message: 'Hâte d’y être !',
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    const registration = await prisma.eventRegistration.findFirst({
      where: { email: 'jean.dupont@example.com', eventId },
    });
    expect(registration?.firstName).toBe('Jean');
    expect(registration?.guestsCount).toBe(2);
  });
});
