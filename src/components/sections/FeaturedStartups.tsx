import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { FEATURED_STARTUPS } from '@/lib/constants';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';

/**
 * Startups vedettes (CDC §2.1).
 * Sélection des 6 premières startups pour la homepage — chacune cliquable
 * vers sa page détail /startups/[slug].
 */
export default function FeaturedStartups() {
  // 6 startups en vedette pour l'accueil (grille 2×3 ou 3×2)
  const featured = FEATURED_STARTUPS.slice(0, 6);

  return (
    <section className="section bg-white">
      <div className="container-cauris">
        <SectionTitle
          eyebrow="Nos startups"
          title="Les startups que nous propulsons"
          description="Rencontrez les entrepreneurs qui changent l'Afrique depuis Yaoundé — et bien au-delà."
        />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {featured.map((s, i) => {
            const statusColor =
              s.status === 'Diplômée'
                ? 'bg-cauris-success/10 text-cauris-success-text'
                : s.status === 'Alumni'
                  ? 'bg-cauris-black/5 text-cauris-black'
                  : 'bg-cauris-orange/10 text-cauris-orange';
            return (
              <Reveal key={s.slug} delay={i * 60}>
                {/* Pas de aria-label : le nom accessible se compose déjà à
                    partir de tout le texte visible de la carte (WCAG 2.5.3) */}
                <Link
                  href={`/startups/${s.slug}`}
                  className="card group p-6 border border-gray-100 h-full flex flex-col bg-white hover:border-cauris-orange/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cauris-orange to-cauris-orange-light flex items-center justify-center text-white font-heading font-bold text-lg">
                      {s.name.charAt(0)}
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${statusColor}`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-cauris-black mb-1 group-hover:text-cauris-orange transition-colors">
                    {s.name} <span className="text-base">{s.country}</span>
                  </h3>
                  <p className="text-xs text-cauris-gray-secondary uppercase tracking-wider mb-3">
                    {s.sector} · Promo {s.year}
                  </p>
                  {s.tagline && (
                    <p className="text-sm text-cauris-gray-text leading-snug">{s.tagline}</p>
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button href="/startups" variant="secondary">
            Voir toutes nos startups
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
