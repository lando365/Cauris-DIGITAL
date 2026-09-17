/**
 * Client minimal pour l'API Calendly v2 (module admin "Rendez-vous").
 *
 * Nécessite un jeton d'accès personnel (portée "Planification" : users,
 * scheduled_events, invitees) dans la variable CALENDLY_API_TOKEN.
 * Doc : https://developer.calendly.com/api-docs
 */

const CALENDLY_API_BASE = 'https://api.calendly.com';

export class CalendlyError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'CalendlyError';
  }
}

function getToken(): string {
  const token = process.env.CALENDLY_API_TOKEN;
  if (!token) {
    throw new CalendlyError("CALENDLY_API_TOKEN n'est pas configuré.");
  }
  return token;
}

async function calendlyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${CALENDLY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new CalendlyError(
      body?.message ?? `Erreur Calendly (${res.status})`,
      res.status
    );
  }

  return res.json() as Promise<T>;
}

export interface CalendlyUser {
  uri: string;
  name: string;
  email: string;
  current_organization: string;
}

export interface CalendlyScheduledEvent {
  uri: string;
  name: string | null;
  status: 'active' | 'canceled';
  start_time: string;
  end_time: string;
  location: { type: string; location?: string; join_url?: string } | null;
}

export interface CalendlyInvitee {
  uri: string;
  name: string;
  email: string;
  status: 'active' | 'canceled';
}

/** Extrait l'UUID (dernier segment) d'une URI de ressource Calendly. */
export function calendlyUuid(uri: string): string {
  return uri.split('/').pop() ?? uri;
}

export async function getCalendlyUser(): Promise<CalendlyUser> {
  const { resource } = await calendlyFetch<{ resource: CalendlyUser }>('/users/me');
  return resource;
}

export async function listScheduledEvents(params: {
  userUri: string;
  status: 'active' | 'canceled';
  count?: number;
}): Promise<CalendlyScheduledEvent[]> {
  const query = new URLSearchParams({
    user: params.userUri,
    status: params.status,
    sort: params.status === 'active' ? 'start_time:asc' : 'start_time:desc',
    count: String(params.count ?? 25),
  });
  const { collection } = await calendlyFetch<{ collection: CalendlyScheduledEvent[] }>(
    `/scheduled_events?${query.toString()}`
  );
  return collection;
}

export async function getEventInvitees(eventUri: string): Promise<CalendlyInvitee[]> {
  const uuid = calendlyUuid(eventUri);
  const { collection } = await calendlyFetch<{ collection: CalendlyInvitee[] }>(
    `/scheduled_events/${uuid}/invitees`
  );
  return collection;
}

/** Annule un rendez-vous côté Calendly — action réelle (l'invité est notifié). */
export async function cancelScheduledEvent(eventUri: string, reason: string): Promise<void> {
  const uuid = calendlyUuid(eventUri);
  await calendlyFetch(`/scheduled_events/${uuid}/cancellation`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}
