import type { DailyCount } from '@/lib/newsletter-stats';

/**
 * Petit graphique en barres SVG, sans dépendance externe — le besoin
 * (CDC V2 §3.3.5, §8.2.1, §8.2.6) est une simple évolution sur N jours,
 * pas un tableau de bord analytique.
 */
export function GrowthChart({ data, label }: { data: DailyCount[]; label: string }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const width = 560;
  const height = 120;
  const barGap = 2;
  const barWidth = data.length > 0 ? width / data.length - barGap : 0;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-cauris-gray-text">{label}</p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={`${label} : ${data.reduce((sum, d) => sum + d.count, 0)} inscriptions sur ${data.length} jours`}
      >
        {data.map((d, i) => {
          const barHeight = (d.count / max) * (height - 20);
          const x = i * (barWidth + barGap);
          const y = height - barHeight;
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={y}
                width={Math.max(barWidth, 1)}
                height={Math.max(barHeight, d.count > 0 ? 2 : 0)}
                fill="#E8640A"
                opacity={d.count > 0 ? 1 : 0.15}
                rx={1}
              >
                <title>
                  {d.date} — {d.count} inscription{d.count !== 1 ? 's' : ''}
                </title>
              </rect>
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-cauris-gray-secondary">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
