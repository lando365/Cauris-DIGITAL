import type { Metadata } from 'next';
import {
  ArrowRight,
  Check,
  Calendar,
  Globe,
  Compass,
  TrendingUp,
  Coins,
  Users,
  Rocket,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import FinalCTA from '@/components/sections/FinalCTA';
import { PROGRAMS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Programme Accélération — CAURIS DIGITAL | 12 semaines pour accélérer votre croissance',
  description:
    'Programme d\'accélération intensif de 12 semaines, 100% en ligne. Pour les startups tech africaines prêtes à passer à l\'échelle. Accès mondial, mentors experts.',
};

const acceleration = PROGRAMS.find((p) => p.id === 'acceleration')!;

const PHASES = [
  {
    icon: Compass,
    period: 'Semaines 1-2',
    title: 'Diagnostic stratégique',
    description:
      'Audit complet de votre startup : product-market fit, modèle économique, structure d\'équipe, stratégie de croissance actuelle. Identification des 3 leviers prioritaires à activer.',
  },
  {
    icon: TrendingUp,
    period: 'Semaines 3-5',
    title: 'Croissance et acquisition',
    description:
      'Stratégie de croissance data-driven. Growth hacking adapté aux marchés africains. Optimisation de l\'acquisition client. Segmentation et ciblage. KPIs et tableaux de bord.',
  },
  {
    icon: Coins,
    period: 'Semaines 6-8',
    title: 'Modèle économique et revenus',
    description:
      'Optimisation du pricing. Nouvelles sources de revenus. Partenariats stratégiques. Expansion géographique. Négociation et closing commercial.',
  },
  {
    icon: Users,
    period: 'Semaines 9-10',
    title: 'Financement et investisseurs',
    description:
      'Préparation du pitch investisseurs. Construction du dossier de levée. Valorisation de la startup. Simulation d\'entretiens avec des investisseurs réels.',
  },
  {
    icon: Rocket,
    period: 'Semaines 11-12',
    title: 'Demo Day et après',
    description:
      'Répétition et finalisation du pitch. Demo Day ouvert aux investisseurs africains et internationaux. Plan d\'action post-programme. Intégration dans le réseau alumni CAURIS DIGITAL.',
  },
];

const PROFILE_CRITERIA = [
  'Votre startup a un produit ou service fonctionnel (pas juste une idée)',
  'Vous avez des premiers utilisateurs, clients ou revenus (même modestes)',
  'Vous pouvez consacrer au moins 15 heures par semaine au programme',
  'Vous êtes prêt à remettre en question vos hypothèses et à pivoter si nécessaire',
  'Vous cherchez à lever des fonds ou à accélérer significativement votre croissance dans les 12 mois',
];

const COMPARISON = [
  { criterion: 'Stade du projet', incubation: 'Idée / Pré-prototype', acceleration: 'MVP validé / Premiers clients' },
  { criterion: 'Durée', incubation: '6 mois', acceleration: '12 semaines' },
  { criterion: 'Format', incubation: 'Hybride (présentiel + online)', acceleration: '100% en ligne' },
  { criterion: 'Intensité', incubation: 'Progressive', acceleration: 'Très intensive' },
  { criterion: 'Objectif', incubation: 'Valider et construire', acceleration: 'Accélérer et scaler' },
  { criterion: 'Coût', incubation: 'Gratuit', acceleration: 'Gratuit / Contribution symbolique' },
  { criterion: 'Demo Day', incubation: 'Oui (fin de programme)', acceleration: 'Oui (accès investisseurs internationaux)' },
];

export default function AccelerationProgramPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-cauris-cream/40 relative overflow-hidden">
        <div className="container-cauris relative">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
                Pour startups en croissance
              </p>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-cauris-black mb-6">
                Programme Accélération
              </h1>
              <p className="text-lg text-cauris-gray-text leading-relaxed mb-8">
                <strong className="text-cauris-black">12 semaines</strong> pour faire avancer votre
                startup de 12 mois.{' '}
                <strong className="text-cauris-black">100% en ligne.</strong> Accessible depuis
                n&apos;importe où dans le monde.
              </p>

              <div className="mb-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cauris-gray-text">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  <strong>Durée :</strong> 12 semaines
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cauris-orange" aria-hidden="true" />
                  Entièrement en ligne — sessions live + mentorat asynchrone
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button href="#candidater" size="lg">
                  Candidater au prochain programme
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
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80"
                  alt="Entrepreneur en visioconférence durant le programme d'accélération"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section id="programme" className="section">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <SectionTitle
              eyebrow="Présentation"
              title="Pour les startups prêtes à passer à l'échelle"
              align="left"
            />
            <div className="mt-8 space-y-5 text-cauris-gray-text leading-relaxed">
              <p>
                Le programme Accélération s&apos;adresse aux startups qui ont déjà un produit, des
                premiers utilisateurs ou clients, et qui sont prêtes à accélérer leur croissance.
                Ce n&apos;est pas un programme de démarrage —{' '}
                <strong className="text-cauris-black">
                  c&apos;est un programme de passage à l&apos;échelle
                </strong>
                .
              </p>
              <p>
                En 12 semaines intenses, vous bénéficiez d&apos;un mentorat de haut niveau,
                d&apos;une mise en réseau internationale et d&apos;outils concrets pour doubler
                votre croissance, renforcer votre modèle économique et préparer votre prochaine
                levée de fonds.
              </p>
              <p>
                Le programme est intégralement disponible en ligne. Nos entrepreneurs accèdent aux
                sessions depuis Yaoundé, Dakar, Abidjan, Lomé, Paris, Bruxelles ou Montréal —
                <strong className="text-cauris-black"> sans contrainte géographique</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau comparatif */}
      <section className="section bg-cauris-gray-bg">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Incubation vs Accélération"
            title="Quelle différence entre nos deux programmes ?"
            description="Choisissez le programme qui correspond au stade de votre projet."
          />

          <div className="mt-14 max-w-5xl mx-auto">
            <div className="overflow-x-auto rounded-card shadow-card border border-gray-100 bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-cauris-black text-white">
                    <th className="text-left px-5 py-4 font-heading font-semibold text-sm uppercase tracking-wider">
                      Critère
                    </th>
                    <th className="text-left px-5 py-4 font-heading font-semibold text-sm uppercase tracking-wider">
                      Programme Incubation
                    </th>
                    <th className="text-left px-5 py-4 font-heading font-semibold text-sm uppercase tracking-wider bg-cauris-orange">
                      Programme Accélération
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr
                      key={row.criterion}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-cauris-cream/30'}
                    >
                      <td className="px-5 py-4 font-semibold text-cauris-black text-sm">
                        {row.criterion}
                      </td>
                      <td className="px-5 py-4 text-cauris-gray-text text-sm">
                        {row.incubation}
                      </td>
                      <td className="px-5 py-4 text-cauris-gray-text text-sm border-l-2 border-cauris-orange/30 bg-cauris-orange/5">
                        {row.acceleration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Le programme semaine par semaine */}
      <section className="section">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Déroulement"
            title="Le programme semaine par semaine"
            description="Cinq phases pour transformer votre startup en moteur de croissance."
          />

          <div className="mt-14 grid lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
            {PHASES.map((phase, i) => {
              const Icon = phase.icon;
              return (
                <Reveal key={phase.period} delay={i * 80}>
                  <article className="bg-white border border-gray-100 rounded-card p-6 lg:p-7 hover:border-cauris-orange/30 transition-colors h-full">
                    <div className="flex items-start gap-5">
                      <div className="shrink-0 w-12 h-12 rounded-card bg-cauris-orange/10 text-cauris-orange flex items-center justify-center">
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cauris-orange mb-1">
                          {phase.period}
                        </p>
                        <h3 className="font-heading font-bold text-lg text-cauris-black mb-3">
                          {phase.title}
                        </h3>
                        <p className="text-sm text-cauris-gray-text leading-relaxed">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ce que vous obtenez */}
      <section className="section bg-cauris-cream/40">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Ce que vous obtenez"
            title="Les bénéfices concrets du programme"
          />

          <div className="mt-14 grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {acceleration.benefits.map((benefit, i) => (
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

      {/* Profil recherché */}
      <section id="candidater" className="section scroll-mt-24">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
            <Reveal>
              <SectionTitle
                eyebrow="Profil recherché"
                title="Êtes-vous prêt pour le programme Accélération ?"
                align="left"
              />
              <p className="mt-6 text-cauris-gray-text leading-relaxed">
                Le programme Accélération est exigeant. Nous cherchons des fondateurs qui ont déjà
                fait leurs preuves et qui veulent franchir un palier décisif. Vérifiez si vous
                correspondez :
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
            </Reveal>

            <Reveal delay={150}>
              <div className="bg-cauris-orange text-white rounded-card p-8 lg:p-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80 mb-2">
                  Prêt à candidater ?
                </p>
                <h3 className="font-heading font-bold text-2xl mb-4">
                  Notre prochaine cohorte vous attend
                </h3>
                <p className="text-white/90 leading-relaxed mb-6">
                  Programme intensif de 12 semaines avec mentors internationaux, accès aux
                  investisseurs et Demo Day mondial. Les meilleures startups de la cohorte sont
                  introduites à notre réseau de fonds africains et européens.
                </p>
                <Button
                  href="/contact?objet=candidature-acceleration"
                  className="bg-white text-cauris-orange hover:bg-cauris-cream"
                >
                  Candidater au programme Accélération
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
