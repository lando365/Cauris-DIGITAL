import { prisma } from '@/lib/prisma';

export interface DailyCount {
  date: string; // YYYY-MM-DD
  count: number;
}

/**
 * Nombre de nouvelles inscriptions newsletter par jour sur les N derniers
 * jours (CDC V2 §3.3.5, §8.2.1 : "graphique d'évolution... sur 30 jours").
 * Renvoie un point par jour, y compris les jours à 0 inscription.
 */
export async function getSubscriptionGrowth(days: number): Promise<DailyCount[]> {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const counts = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    counts.set(d.toISOString().slice(0, 10), 0);
  }
  for (const s of subscribers) {
    const key = s.createdAt.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()].map(([date, count]) => ({ date, count }));
}
