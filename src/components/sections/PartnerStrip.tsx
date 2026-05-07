import { PARTNERS } from '@/lib/constants';

/**
 * Bande de logos partenaires (CDC §2.1).
 * Affichage horizontal avec défilement automatique.
 * Note : en attendant les vrais logos, on utilise des cartouches typographiques.
 */
export default function PartnerStrip() {
  // Doubler la liste pour la marquee continue
  const logos = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-10 lg:py-12 bg-white border-y border-gray-100" aria-label="Nos partenaires">
      <div className="container-cauris mb-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-cauris-gray-secondary">
          Ils nous font confiance
        </p>
      </div>
      <div className="mask-fade-x overflow-hidden">
        <div className="flex gap-12 lg:gap-16 animate-marquee min-w-max">
          {logos.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex items-center justify-center min-w-[180px] h-14 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all"
            >
              {/* Placeholder logo : nom typographique */}
              <span className="font-heading font-bold text-cauris-gray-secondary uppercase tracking-wider text-sm whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
