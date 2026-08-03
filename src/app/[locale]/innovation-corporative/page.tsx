import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ArrowRight,
  Search,
  Users,
  FlaskConical,
  Lightbulb,
  CalendarDays,
  Eye,
  Star,
  Building2,
  FileText,
  Megaphone,
  Briefcase,
  Check,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import { BRAND_IMAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Innovation Corporative — CAURIS DIGITAL | Co-innover avec les startups africaines',
  description:
    'CAURIS DIGITAL accompagne les grandes entreprises dans leur stratégie d\'open innovation en Afrique. Scouting, co-création et pilotes avec les meilleures startups tech africaines.',
};

const SERVICES = [
  {
    icon: Search,
    title: 'Scouting technologique',
    description:
      'Nous identifions pour vous les startups africaines les plus pertinentes par rapport à vos enjeux stratégiques. Analyse du marché, mapping des acteurs, présélection et mise en relation directe.',
  },
  {
    icon: Users,
    title: 'Programmes de co-création',
    description:
      'Nous organisons des ateliers de co-innovation entre vos équipes et nos startups. Design sprints, hackathons ciblés, ateliers de résolution de problèmes avec des entrepreneurs agiles et créatifs.',
  },
  {
    icon: FlaskConical,
    title: 'Pilotes et POC',
    description:
      'Nous facilitons des expérimentations concrètes entre votre entreprise et nos startups. Un pilote cadré, avec des objectifs clairs, un budget défini et un suivi rigoureux. Zéro bureaucratie inutile.',
  },
  {
    icon: Lightbulb,
    title: 'Programme de mentorat inversé',
    description:
      'Vos cadres dirigeants deviennent mentors de nos startups — et en retour, ils sont exposés aux pratiques agiles, aux nouvelles technologies et aux modèles économiques disruptifs que développent nos entrepreneurs.',
  },
  {
    icon: CalendarDays,
    title: 'Journée de l\'Innovation Ouverte',
    description:
      'Un événement annuel organisé par CAURIS DIGITAL qui rassemble startups, corporates, investisseurs et institutions autour des enjeux tech africains. Pitchs, tables rondes, networking et annonces de partenariats.',
  },
];

const BENEFITS = [
  {
    icon: Eye,
    title: 'Visibilité forte',
    description:
      'Sur le site, les événements et les communications de CAURIS DIGITAL.',
  },
  {
    icon: Star,
    title: 'Accès prioritaire aux startups',
    description:
      'Avant Demo Day, contactez les pépites de nos promotions en avant-première.',
  },
  {
    icon: Building2,
    title: 'Siège observateur',
    description:
      'Au Conseil d\'Orientation Stratégique de CAURIS DIGITAL.',
  },
  {
    icon: Briefcase,
    title: 'Événements exclusifs',
    description:
      'Rencontres startups, petits-déjeuners, tables rondes sectorielles dédiées partenaires.',
  },
  {
    icon: FileText,
    title: 'Rapport semestriel',
    description:
      'Sur l\'évolution de l\'écosystème tech africain rédigé par notre équipe.',
  },
  {
    icon: Megaphone,
    title: 'Co-branding',
    description:
      'Opportunités de communication partagée sur nos réseaux et lors d\'événements communs.',
  },
];

const TARGET_AUDIENCE = [
  'Grandes entreprises et groupes industriels',
  'Banques et établissements financiers',
  'Opérateurs télécom et fournisseurs de services numériques',
  'ONG et organisations internationales',
  'Institutions publiques cherchant à innover en Afrique',
];

export default function InnovationCorporativePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-cauris-black text-white relative overflow-hidden">
        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cauris-orange blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-cauris-orange blur-3xl" />
        </div>

        <div className="container-cauris relative">
          <div className="max-w-4xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              Pour les grandes entreprises
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
              L&apos;innovation corporative avec{' '}
              <span className="text-gradient-orange">CAURIS DIGITAL</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/85 leading-relaxed mb-10 max-w-3xl">
              Connectez votre entreprise aux startups tech africaines les plus prometteuses.
              Accédez à l&apos;innovation de demain — aujourd&apos;hui.
            </p>

            <Button
              href="/contact?objet=partenariat-corporate"
              size="lg"
              className="bg-cauris-orange hover:bg-cauris-orange-dark text-white"
            >
              Devenir partenaire corporate
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pitch entreprises */}
      <section id="lab" className="section">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <SectionTitle
              eyebrow="Pourquoi nous"
              title="Pourquoi co-innover avec CAURIS DIGITAL ?"
              align="left"
            />
            <div className="mt-8 space-y-5 text-cauris-gray-text leading-relaxed">
              <p>
                L&apos;Afrique est le continent à la croissance la plus rapide du monde. Ses
                marchés sont en pleine transformation numérique. Ses startups développent des
                solutions radicalement nouvelles — souvent plus adaptées aux contraintes locales
                que les produits importés.
              </p>
              <p>
                CAURIS DIGITAL est <strong className="text-cauris-black">votre porte d&apos;entrée vers cet écosystème</strong>.
                En devenant partenaire corporate, votre entreprise accède à un flux constant de
                startups sélectionnées, à des opportunités de co-développement et à un
                positionnement fort dans l&apos;économie numérique africaine.
              </p>
              <p>
                Nous travaillons avec des grandes entreprises, des banques, des opérateurs
                télécom, des ONG et des organisations internationales qui cherchent à innover en
                Afrique — sans partir de zéro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services proposés */}
      <section id="programmes" className="section bg-cauris-gray-bg">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Nos services"
            title="Nos services d'innovation corporative"
            description="Cinq dispositifs sur-mesure pour propulser votre stratégie d'open innovation en Afrique."
          />

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.title} delay={i * 80}>
                  <article className="card bg-white p-7 h-full border border-gray-100">
                    <div className="w-14 h-14 rounded-xl bg-cauris-orange/10 text-cauris-orange flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-cauris-black mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-cauris-gray-text leading-relaxed">
                      {service.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pourquoi devenir partenaire */}
      <section className="section">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Avantages partenaires"
            title="Ce que vous gagnez en tant que partenaire"
            description="Six bénéfices concrets pour donner à votre entreprise une longueur d'avance."
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <Reveal key={benefit.title} delay={i * 60}>
                  <div className="flex items-start gap-4 bg-cauris-cream/40 rounded-card p-5 h-full border border-cauris-orange/10">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-cauris-orange text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-base text-cauris-black mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-cauris-gray-text leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pour qui ? */}
      <section className="section bg-cauris-gray-bg">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            <Reveal>
              <SectionTitle
                eyebrow="Pour qui ?"
                title="Avec qui travaillons-nous ?"
                align="left"
              />
              <p className="mt-6 text-cauris-gray-text leading-relaxed">
                Notre programme corporate s&apos;adresse aux organisations qui croient en
                l&apos;innovation africaine et veulent en être actrices. Nous sélectionnons nos
                partenaires en fonction de leur engagement réel et de leur capacité à apporter de
                la valeur à nos startups.
              </p>
              <ul className="mt-6 space-y-3">
                {TARGET_AUDIENCE.map((item) => (
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
              <div className="relative aspect-square rounded-card overflow-hidden shadow-card-hover">
                <Image
                  src={BRAND_IMAGES.corporateMeeting}
                  alt="Entrepreneurs africains en réunion stratégique avec un partenaire corporate"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA final dédié corporate */}
      <section className="relative py-20 lg:py-section-lg bg-cauris-orange overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container-cauris relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
              Prêt à innover avec nous ?
            </h2>
            <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed">
              Contactez-nous pour organiser une réunion de découverte. Nous vous proposerons la
              formule de partenariat la plus adaptée à vos enjeux stratégiques.
            </p>
            <a
              href="/contact?objet=partenariat-corporate"
              className="inline-flex items-center gap-2 rounded-btn bg-white px-8 py-4 text-base font-semibold uppercase tracking-wide text-cauris-orange transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Discuter d&apos;un partenariat
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
