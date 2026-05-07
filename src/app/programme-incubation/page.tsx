import type { Metadata } from 'next';
import {
  ArrowRight,
  Check,
  Calendar,
  Users,
  Trophy,
  Globe,
  MapPin,
  ClipboardCheck,
  MessageSquare,
  Mail,
  Rocket,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import FinalCTA from '@/components/sections/FinalCTA';
import { PROGRAMS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Programme Incubation — CAURIS DIGITAL | 6 mois pour lancer votre startup tech',
  description:
    'Rejoignez le programme d\'incubation de 6 mois de CAURIS DIGITAL. Mentorat, ressources, réseau et accompagnement pour lancer votre startup tech depuis l\'Afrique.',
};

const incubation = PROGRAMS.find((p) => p.id === 'incubation')!;

const PHASES = [
  {
    period: 'Mois 1-2',
    title: 'Fondations',
    description:
      'Clarification du problème et de la solution. Validation du marché (interviews clients, terrain). Construction du business model. Premiers prototypes ou MVP. Ateliers : Design Thinking, Lean Startup, Business Model Canvas.',
  },
  {
    period: 'Mois 3-4',
    title: 'Construction',
    description:
      'Développement du produit ou service. Premiers utilisateurs test. Itérations rapides basées sur les retours. Construction de l\'équipe. Ateliers : product management, développement commercial, communication.',
  },
  {
    period: 'Mois 5-6',
    title: 'Mise sur le marché',
    description:
      'Stratégie go-to-market. Premiers revenus ou contrats. Préparation du pitch investisseurs. Construction du dossier de levée de fonds. Demo Day : présentation publique devant investisseurs et partenaires.',
  },
];

const PROFILE_CRITERIA = [
  'Vous avez une idée de startup technologique avec un potentiel de marché en Afrique ou à l\'international',
  'Vous avez (ou cherchez) une équipe complémentaire — technique, business ou les deux',
  'Vous êtes disponible pour vous engager sérieusement pendant 6 mois',
  'Vous êtes ouvert au feedback, même difficile, et prêt à pivoter si nécessaire',
  'Votre projet s\'inscrit dans un de nos secteurs prioritaires (Agritech, Fintech, Edtech, Healthtech, Smart Cities)',
  'Vous êtes basé en Afrique francophone ou disposé à interagir en français',
];

const APPLICATION_STEPS = [
  {
    icon: ClipboardCheck,
    title: 'Étape 1 — Candidature en ligne',
    description:
      'Remplissez le formulaire de candidature en ligne (15 minutes environ). Joignez un pitch deck ou une présentation de votre projet (facultatif mais fortement recommandé).',
  },
  {
    icon: MessageSquare,
    title: 'Étape 2 — Entretien',
    description:
      'Notre équipe examine toutes les candidatures dans un délai de 2 semaines. Les dossiers retenus sont contactés pour un entretien de 30 minutes (en visioconférence ou en présentiel).',
  },
  {
    icon: Mail,
    title: 'Étape 3 — Annonce',
    description:
      'Annonce des résultats. Les startups sélectionnées reçoivent leur lettre d\'admission et signent la convention de participation.',
  },
  {
    icon: Rocket,
    title: 'Étape 4 — Lancement',
    description:
      'Lancement du programme. Journée d\'orientation collective (en ligne ou en présentiel) et début des sessions de mentorat.',
  },
];

const PROGRAM_TESTIMONIALS = [
  {
    name: '[Prénom NOM]',
    startup: '[Nom startup]',
    location: '[Pays]',
    promo: 'Promo [Année]',
    quote:
      'J\'ai candidaté depuis Brazzaville, sans savoir si ça marcherait à distance. Le programme m\'a montré que la qualité du mentorat ne dépend pas de la géographie. J\'ai eu accès aux mêmes ressources que ceux qui étaient à Yaoundé.',
  },
  {
    name: '[Prénom NOM]',
    startup: '[Nom startup]',
    location: '[Pays]',
    promo: 'Promo [Année]',
    quote:
      'Le moment le plus fort : le Demo Day. Présenter devant des investisseurs réels, avec un vrai produit et de vrais clients — après seulement 6 mois. Je n\'aurais jamais cru y arriver si vite sans CAURIS DIGITAL.',
  },
];

export default function IncubationProgramPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-cauris-cream/40 relative overflow-hidden">
        <div className="container-cauris relative">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
                Programme phare CAURIS DIGITAL
              </p>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-cauris-black mb-6">
                Programme Incubation
              </h1>
              <p className="text-lg text-cauris-gray-text leading-relaxed mb-8">
                <strong className="text-cauris-black">6 mois</strong> pour transformer votre idée en
                entreprise. <strong className="text-cauris-black">Gratuit. Exigeant. Transformateur.</strong>
              </p>

              <div className="mb-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cauris-gray-text">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  <strong>Durée :</strong> 6 mois
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  Présentiel à Yaoundé
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  Mentorat en ligne disponible partout
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button href="#candidater" size="lg">
                  Candidater maintenant
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button href="#programme" variant="tertiary">
                  Découvrir le programme
                </Button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="aspect-[4/5] rounded-card overflow-hidden shadow-card-hover">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
                  alt="Session de pitch durant le programme d'incubation"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Présentation du programme */}
      <section id="programme" className="section">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <SectionTitle
              eyebrow="Présentation"
              title="Un programme gratuit, intensif et humain"
              align="left"
            />
            <div className="mt-8 space-y-5 text-cauris-gray-text leading-relaxed">
              <p>
                Le programme Incubation de CAURIS DIGITAL est notre programme fondateur. Il
                s&apos;adresse aux porteurs de projets technologiques qui ont une idée, une équipe
                (ou les prémices d&apos;une équipe) et la conviction que leur solution peut changer
                quelque chose — en Afrique et au-delà.
              </p>
              <p>
                Pendant 6 mois, vous bénéficiez d&apos;un accompagnement structuré et personnalisé :
                ateliers collectifs, sessions de mentorat individuel, accès à notre réseau de
                partenaires, espace de travail collaboratif et une communauté d&apos;entrepreneurs
                qui se soutient mutuellement.
              </p>
              <p>
                Le programme est <strong>gratuit</strong> pour les startups sélectionnées. CAURIS
                DIGITAL <strong>ne prend pas de participation au capital</strong>. Notre
                investissement, c&apos;est le temps, l&apos;expertise et le réseau que nous mettons
                à votre service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ce que vous obtenez */}
      <section className="section bg-cauris-gray-bg">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Ce que vous obtenez"
            title="Tout ce qu'il faut pour passer de l'idée au marché"
          />

          <div className="mt-14 grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {incubation.benefits.map((benefit, i) => (
              <Reveal key={benefit} delay={i * 50}>
                <div className="flex items-start gap-3 bg-white p-5 rounded-card border border-gray-100">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-cauris-orange/10 text-cauris-orange flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm text-cauris-gray-text leading-relaxed">{benefit}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Déroulement par phase */}
      <section className="section">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Déroulement du programme"
            title="Comment se déroule le programme ?"
            description="Six mois structurés en trois phases progressives — de la clarification du problème jusqu'au Demo Day."
          />

          <div className="mt-14 max-w-4xl mx-auto space-y-6">
            {PHASES.map((phase, i) => (
              <Reveal key={phase.period} delay={i * 100}>
                <article className="relative bg-white border border-gray-100 rounded-card p-6 lg:p-8 hover:border-cauris-orange/30 transition-colors">
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 w-14 h-14 rounded-card bg-cauris-orange text-white flex flex-col items-center justify-center text-xs font-bold leading-tight">
                      <span className="text-[10px] uppercase tracking-wider opacity-90">Phase</span>
                      <span className="text-lg">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cauris-orange mb-1">
                        {phase.period}
                      </p>
                      <h3 className="font-heading font-bold text-xl text-cauris-black mb-3">
                        {phase.title}
                      </h3>
                      <p className="text-cauris-gray-text leading-relaxed">{phase.description}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Profil recherché */}
      <section className="section bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
            <Reveal>
              <SectionTitle
                eyebrow="Profil recherché"
                title="Qui peut candidater ?"
                align="left"
              />
              <p className="mt-6 text-cauris-gray-text leading-relaxed">
                Nous ne cherchons pas la perfection. Nous cherchons la conviction, la rigueur et le
                potentiel. Voici les critères que nous évaluons :
              </p>
              <ul className="mt-6 space-y-3">
                {PROFILE_CRITERIA.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-cauris-success/15 text-cauris-success flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" aria-hidden="true" />
                    </span>
                    <span className="text-cauris-gray-text">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-cauris-gray-secondary italic">
                Les candidats hors de Yaoundé peuvent participer intégralement en ligne. Aucun
                déplacement physique n&apos;est obligatoire. Le programme complet est accessible à
                distance via notre plateforme de mentorat en ligne.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="bg-cauris-black text-white rounded-card p-8 lg:p-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cauris-orange mb-2">
                  Bon à savoir
                </p>
                <h3 className="font-heading font-bold text-2xl mb-4">
                  Promotion 100% accessible à distance
                </h3>
                <p className="text-white/85 leading-relaxed mb-5">
                  Que vous soyez à Dakar, Abidjan, Lomé, Kinshasa, Paris ou Montréal, vous pouvez
                  rejoindre le programme depuis chez vous. Notre plateforme de mentorat asynchrone
                  + sessions live garantit la même qualité d&apos;accompagnement, où que vous soyez.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/10">
                  <div>
                    <p className="text-3xl font-heading font-bold text-cauris-orange">12</p>
                    <p className="text-xs text-white/70">startups par promotion</p>
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold text-cauris-orange">3 mois</p>
                    <p className="text-xs text-white/70">de suivi post-programme</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="section">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Ils l'ont vécu"
            title="Ce qu'en disent nos anciens participants"
          />
          <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {PROGRAM_TESTIMONIALS.map((t, i) => (
              <Reveal key={`${t.name}-${i}`} delay={i * 100}>
                <article className="card bg-white p-7 lg:p-8 border border-gray-100 h-full">
                  <p className="text-cauris-gray-text leading-relaxed mb-5 italic">
                    « {t.quote} »
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cauris-orange to-cauris-orange-light flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(1) || 'P'}
                    </div>
                    <div>
                      <p className="font-semibold text-cauris-black text-sm">
                        {t.name} — fondateur·rice de {t.startup}
                      </p>
                      <p className="text-xs text-cauris-gray-secondary">
                        {t.location}, {t.promo}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Processus de candidature */}
      <section id="candidater" className="section bg-cauris-gray-bg scroll-mt-24">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Comment candidater ?"
            title="Le processus en 4 étapes"
            description="De la soumission de votre dossier au lancement du programme — en moins d'un mois."
          />

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {APPLICATION_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={i * 80}>
                  <article className="bg-white rounded-card p-6 border border-gray-100 h-full relative">
                    <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-cauris-orange text-white flex items-center justify-center font-bold shadow-cta">
                      {i + 1}
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-cauris-orange/10 text-cauris-orange flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-cauris-black mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-cauris-gray-text leading-relaxed">
                      {step.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <Button href="/contact?objet=candidature-incubation" size="lg">
              Déposer ma candidature
              <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="mt-4 text-sm text-cauris-gray-secondary">
              Trophée <Trophy className="inline w-4 h-4 text-cauris-orange" /> remis aux 12
              startups sélectionnées · <Users className="inline w-4 h-4 text-cauris-orange" />{' '}
              promotion limitée
            </p>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
