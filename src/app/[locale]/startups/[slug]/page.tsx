import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Globe,
  Linkedin,
  Trophy,
  Users,
  Code,
  Award,
  TrendingUp,
} from 'lucide-react';
import type { Startup as DisplayStartup } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { prisma } from '@/lib/prisma';
import { mapStartup } from '@/lib/content-mappers';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// CDC V2 §4.3.1 : détail public en cache ISR (revalidate 60s). Pas de
// generateStaticParams : une startup créée après le build doit rester
// accessible immédiatement (dynamicParams reste true par défaut).
export const revalidate = 60;

async function getRelatedStartups(current: DisplayStartup, limit = 3): Promise<DisplayStartup[]> {
  const others = await prisma.startup.findMany({
    where: { slug: { not: current.slug } },
    take: 30,
    orderBy: { createdAt: 'desc' },
  });
  const mapped = others.map(mapStartup);
  const sameSector = mapped.filter((s) => s.sector === current.sector);
  const sameCountry = mapped.filter(
    (s) => s.countryName === current.countryName && s.sector !== current.sector
  );
  const rest = mapped.filter(
    (s) => s.sector !== current.sector && s.countryName !== current.countryName
  );
  return [...sameSector, ...sameCountry, ...rest].slice(0, limit);
}

/**
 * Métadonnées SEO dynamiques par startup (CDC §7.1).
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = await prisma.startup.findUnique({ where: { slug } });
  if (!record) {
    return { title: 'Startup introuvable' };
  }
  const startup = mapStartup(record);
  return {
    title: `${startup.name} — ${startup.tagline}`,
    description: startup.description,
    openGraph: {
      title: `${startup.name} | CAURIS DIGITAL`,
      description: startup.description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${startup.name} | CAURIS DIGITAL`,
      description: startup.description,
    },
  };
}

/**
 * Couleur du badge statut.
 */
function getStatusStyle(status: string): string {
  if (status === 'Diplômée')
    return 'bg-cauris-success/10 text-cauris-success-text border-cauris-success/30';
  if (status === 'Alumni') return 'bg-cauris-black/5 text-cauris-black border-cauris-black/20';
  return 'bg-cauris-orange/10 text-cauris-orange border-cauris-orange/30';
}

export default async function StartupDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const record = await prisma.startup.findUnique({ where: { slug } });
  if (!record) notFound();
  const startup = mapStartup(record);

  const related = await getRelatedStartups(startup, 3);

  return (
    <>
      {/* JSON-LD pour SEO (Schema.org Organization) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: startup.name,
            description: startup.description,
            url: startup.website,
            foundingDate: startup.foundedYear?.toString(),
            address: {
              '@type': 'PostalAddress',
              addressLocality: startup.city,
              addressCountry: startup.countryName,
            },
          }),
        }}
      />

      {/* ============ HERO ============ */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-cauris-cream/40">
        <div className="container-cauris">
          {/* Fil d'Ariane */}
          <Link
            href="/startups"
            className="inline-flex items-center gap-2 text-sm text-cauris-gray-secondary hover:text-cauris-orange mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Retour aux startups
          </Link>

          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start max-w-6xl">
            <div className="lg:col-span-3">
              {/* Sector + status */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cauris-orange">
                  {startup.sector}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(startup.status)}`}
                >
                  {startup.status}
                </span>
              </div>

              {/* Nom + drapeau */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-cauris-black mb-4">
                {startup.name} <span className="text-3xl sm:text-4xl">{startup.country}</span>
              </h1>

              {/* Tagline */}
              <p className="text-xl text-cauris-orange font-medium mb-6">{startup.tagline}</p>

              {/* Méta */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cauris-gray-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  {startup.city ? `${startup.city}, ` : ''}
                  {startup.countryName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  Promo {startup.year}
                </span>
                {startup.foundedYear && (
                  <span className="inline-flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                    Fondée en {startup.foundedYear}
                  </span>
                )}
              </div>
            </div>

            {/* Logo placeholder */}
            <div className="lg:col-span-2">
              <div className="aspect-square max-w-sm mx-auto rounded-card bg-gradient-to-br from-cauris-orange to-cauris-orange-light flex items-center justify-center text-white font-heading font-extrabold text-8xl shadow-card-hover">
                {startup.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTENU PRINCIPAL ============ */}
      <section className="section">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-16 max-w-6xl">
            {/* Colonne principale : description longue + technos + achievements */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description longue */}
              {startup.longDescription && (
                <Reveal>
                  <div>
                    <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-5">
                      La startup
                    </h2>
                    <p className="text-base lg:text-lg text-cauris-gray-text leading-relaxed">
                      {startup.longDescription}
                    </p>
                  </div>
                </Reveal>
              )}

              {/* Technologies */}
              {startup.technologies && startup.technologies.length > 0 && (
                <Reveal delay={100}>
                  <div>
                    <h2 className="flex items-center gap-2 font-heading font-bold text-xl lg:text-2xl text-cauris-black mb-5">
                      <Code className="w-6 h-6 text-cauris-orange" aria-hidden="true" />
                      Stack technique
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {startup.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-full bg-cauris-cream text-sm font-medium text-cauris-gray-text"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Achievements */}
              {startup.achievements && startup.achievements.length > 0 && (
                <Reveal delay={150}>
                  <div>
                    <h2 className="flex items-center gap-2 font-heading font-bold text-xl lg:text-2xl text-cauris-black mb-5">
                      <Trophy className="w-6 h-6 text-cauris-orange" aria-hidden="true" />
                      Étapes marquantes
                    </h2>
                    <ul className="space-y-3">
                      {startup.achievements.map((a) => (
                        <li key={a} className="flex items-start gap-3">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-cauris-orange shrink-0" />
                          <span className="text-cauris-gray-text leading-relaxed">{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Sidebar : Fiche d'identité */}
            <aside className="lg:col-span-1">
              <Reveal delay={200}>
                <div className="lg:sticky lg:top-28 space-y-6">
                  {/* Chiffres-clés */}
                  {startup.metrics && startup.metrics.length > 0 && (
                    <div className="bg-cauris-black text-white rounded-card p-6 lg:p-7">
                      <h3 className="flex items-center gap-2 font-heading font-bold text-lg mb-5">
                        <TrendingUp className="w-5 h-5 text-cauris-orange" aria-hidden="true" />
                        Chiffres-clés
                      </h3>
                      <div className="space-y-4">
                        {startup.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="pb-4 last:pb-0 border-b last:border-b-0 border-white/10"
                          >
                            <p className="text-2xl lg:text-3xl font-heading font-bold text-cauris-orange">
                              {m.value}
                            </p>
                            <p className="text-xs text-white/70 mt-0.5">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fondateurs */}
                  {startup.founders && startup.founders.length > 0 && (
                    <div className="bg-white border border-gray-100 rounded-card p-6 lg:p-7 shadow-card">
                      <h3 className="flex items-center gap-2 font-heading font-bold text-base text-cauris-black mb-4">
                        <Users className="w-5 h-5 text-cauris-orange" aria-hidden="true" />
                        {startup.founders.length > 1 ? 'Fondateurs' : 'Fondateur'}
                      </h3>
                      <ul className="space-y-2">
                        {startup.founders.map((f) => (
                          <li key={f} className="text-sm text-cauris-gray-text">
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Liens */}
                  <div className="bg-white border border-gray-100 rounded-card p-6 lg:p-7 shadow-card">
                    <h3 className="font-heading font-bold text-base text-cauris-black mb-4">
                      Liens
                    </h3>
                    <ul className="space-y-3">
                      {startup.website ? (
                        <li>
                          <a
                            href={startup.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-cauris-gray-text hover:text-cauris-orange transition-colors"
                          >
                            <Globe className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                            Site web
                          </a>
                        </li>
                      ) : (
                        <li className="inline-flex items-center gap-2 text-sm text-cauris-gray-secondary/60 italic">
                          <Globe className="w-4 h-4" aria-hidden="true" />
                          Site web à venir
                        </li>
                      )}
                      {startup.linkedin ? (
                        <li>
                          <a
                            href={startup.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-cauris-gray-text hover:text-cauris-orange transition-colors"
                          >
                            <Linkedin className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                            LinkedIn
                          </a>
                        </li>
                      ) : (
                        <li className="inline-flex items-center gap-2 text-sm text-cauris-gray-secondary/60 italic">
                          <Linkedin className="w-4 h-4" aria-hidden="true" />
                          LinkedIn à venir
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {/* ============ CTA candidater ============ */}
      <section className="relative py-20 bg-cauris-orange overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container-cauris relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl leading-tight mb-4">
              Votre startup pourrait être la prochaine.
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Comme {startup.name}, rejoignez le programme d&apos;
              {startup.status === 'Diplômée' ? 'incubation' : 'accompagnement'} de CAURIS DIGITAL
              pour transformer votre idée en succès.
            </p>
            <Link
              href="/contact?objet=candidature"
              className="inline-flex items-center gap-2 rounded-btn bg-white px-8 py-4 text-base font-semibold uppercase tracking-wide text-cauris-orange transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Déposer ma candidature
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ Startups liées ============ */}
      {related.length > 0 && (
        <section className="section bg-cauris-gray-bg">
          <div className="container-cauris">
            <div className="flex items-end justify-between mb-10 max-w-6xl">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange mb-2">
                  Découvrir aussi
                </p>
                <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black">
                  Startups similaires
                </h2>
              </div>
              <Link
                href="/startups"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-cauris-orange hover:underline"
              >
                Voir toutes nos startups
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-6xl">
              {related.map((s) => {
                const statusStyle = getStatusStyle(s.status);
                return (
                  <Link
                    key={s.slug}
                    href={`/startups/${s.slug}`}
                    className="card group p-6 border border-gray-100 h-full flex flex-col bg-white hover:border-cauris-orange/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cauris-orange to-cauris-orange-light flex items-center justify-center text-white font-heading font-bold text-lg">
                        {s.name.charAt(0)}
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full border ${statusStyle}`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-cauris-black mb-1 group-hover:text-cauris-orange transition-colors">
                      {s.name} <span className="text-base">{s.country}</span>
                    </h3>
                    <p className="text-xs text-cauris-gray-secondary uppercase tracking-wider mb-3">
                      {s.sector} · {s.countryName}
                    </p>
                    <p className="text-sm text-cauris-orange font-medium">{s.tagline}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
