import type { Metadata } from 'next';
import { Linkedin, Trophy, Users, Target, Handshake, Globe2, Globe } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import FinalCTA from '@/components/sections/FinalCTA';
import { VALUES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'À propos de CAURIS DIGITAL — Incubateur numérique, Yaoundé, Cameroun',
  description:
    'Découvrez CAURIS DIGITAL, son histoire, sa mission et l\'équipe qui accompagne les entrepreneurs tech africains depuis Yaoundé, avec un mentorat mondial en ligne.',
};

const VALUE_ICONS = {
  Trophy,
  Users,
  Target,
  Handshake,
  Globe2,
  Globe,
} as const;

/**
 * Équipe (Textes_Site_v1 — bios à personnaliser via CMS)
 * Les noms commençant par "[Prénom NOM]" sont des placeholders à remplacer.
 */
const TEAM = [
  {
    name: '[Prénom NOM]',
    role: 'Directeur Général & Co-fondateur',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Entrepreneur numérique avec [X] ans d\'expérience dans l\'accompagnement de startups africaines. Diplômé en [discipline] de [université]. Passionné par l\'impact de la technologie sur les économies émergentes.',
    linkedin: '#',
  },
  {
    name: '[Prénom NOM]',
    role: 'Directrice des Programmes',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    bio: 'Spécialiste de l\'innovation et de l\'accompagnement entrepreneurial. [X] ans d\'expérience dans le secteur de l\'incubation en Afrique centrale. Co-fondatrice de [projet]. Diplômée de [université].',
    linkedin: '#',
  },
  {
    name: '[Prénom NOM]',
    role: 'Responsable Mentorat & Communauté',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: 'Construit des ponts entre entrepreneurs et experts. Ancien fondateur de [startup]. Expert en développement communautaire et accompagnement de porteurs de projets tech.',
    linkedin: '#',
  },
  {
    name: '[Prénom NOM]',
    role: 'Chargée de Communication & Partenariats',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    bio: 'Experte en communication digitale et en relations institutionnelles. [X] ans d\'expérience dans la promotion de l\'écosystème tech africain. Passionnée par le storytelling et la visibilité des startups africaines.',
    linkedin: '#',
  },
];

/**
 * Conseil d'Administration (Textes_Site_v1 — placeholders à remplacer)
 */
const BOARD = [
  { name: '[Nom du membre]', institution: '[Institution / Titre]' },
  { name: '[Nom du membre]', institution: '[Institution / Titre]' },
  { name: '[Nom du membre]', institution: '[Institution / Titre]' },
  { name: '[Nom du membre]', institution: '[Institution / Titre]' },
  { name: '[Nom du membre]', institution: '[Institution / Titre]' },
  { name: '[Nom du membre]', institution: '[Institution / Titre]' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="max-w-3xl">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange">
              À propos de CAURIS DIGITAL
            </p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cauris-black mb-6">
              Qui nous sommes
            </h1>
            <p className="text-lg text-cauris-gray-text leading-relaxed">
              Un incubateur africain construit par des Africains, pour des Africains —
              et ouvert au monde entier.
            </p>
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section id="qui-sommes-nous" className="section">
        <div className="container-cauris">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-3">
              <Reveal>
                <SectionTitle
                  eyebrow="Notre histoire"
                  title="L'incubateur né d'un constat simple"
                  align="left"
                />
                <div className="mt-8 space-y-5 text-cauris-gray-text leading-relaxed">
                  <p>
                    CAURIS DIGITAL est né d&apos;un constat simple : l&apos;Afrique regorge de talents
                    technologiques, d&apos;idées brillantes et d&apos;entrepreneurs courageux. Ce qui
                    manque, c&apos;est un écosystème structuré pour les faire grandir.
                  </p>
                  <p>
                    Fondé à Yaoundé, au cœur du Cameroun, CAURIS DIGITAL a été créé pour combler ce
                    vide. Notre nom est un symbole : le cauris, cette petite coquillage qui a servi
                    de monnaie d&apos;échange à travers toute l&apos;Afrique pendant des siècles,
                    représente la valeur, la connexion et l&apos;échange — exactement ce que nous
                    facilitons entre entrepreneurs, mentors, investisseurs et marchés.
                  </p>
                  <p>
                    Depuis notre création, nous avons accompagné des dizaines d&apos;entrepreneurs
                    dans les secteurs de la Fintech, de l&apos;Agritech, de l&apos;Edtech et de la
                    Healthtech. Notre modèle hybride — ancrage local à Yaoundé, mentorat accessible
                    en ligne partout dans le monde — nous permet de toucher des fondateurs à Douala,
                    Dakar, Abidjan, Kinshasa, Paris ou Montréal, sans compromis sur la qualité de
                    l&apos;accompagnement.
                  </p>
                  <p>
                    Nous nous inspirons des meilleurs incubateurs mondiaux — Centech à Montréal,
                    Y Combinator à San Francisco, Station F à Paris — pour construire quelque chose
                    d&apos;unique : un modèle d&apos;incubation calibré pour les réalités africaines,
                    avec des solutions conçues pour les marchés africains.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={150} className="lg:col-span-2">
              <div className="space-y-6 lg:sticky lg:top-28">
                <div className="aspect-[4/5] rounded-card overflow-hidden shadow-card-hover">
                  <img
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80"
                    alt="Équipe CAURIS DIGITAL en réunion"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="bg-cauris-black text-white p-6 rounded-card">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cauris-orange mb-2">
                    Notre mission
                  </p>
                  <p className="text-base leading-relaxed">
                    Stimuler l&apos;entrepreneuriat numérique en Afrique francophone en formant,
                    incubant et connectant les entrepreneurs tech de demain — de la conceptualisation
                    jusqu&apos;à la commercialisation de leur produit.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-cauris-cream/40">
        <div className="container-cauris">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
            <Reveal>
              <article className="card bg-white p-8 lg:p-10 h-full border border-gray-100">
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cauris-orange mb-3">
                  Notre mission
                </p>
                <h2 className="font-heading font-bold text-2xl lg:text-3xl text-cauris-black mb-4">
                  Faire éclore les talents tech d&apos;Afrique francophone
                </h2>
                <p className="text-cauris-gray-text leading-relaxed">
                  Stimuler l&apos;entrepreneuriat numérique en Afrique francophone en formant,
                  incubant et connectant les entrepreneurs tech de demain — de la conceptualisation
                  jusqu&apos;à la commercialisation de leur produit.
                </p>
              </article>
            </Reveal>
            <Reveal delay={100}>
              <article className="card bg-cauris-orange text-white p-8 lg:p-10 h-full">
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80 mb-3">
                  Notre vision
                </p>
                <h2 className="font-heading font-bold text-2xl lg:text-3xl mb-4">
                  Une Afrique productrice — pas consommatrice — de tech
                </h2>
                <p className="leading-relaxed text-white/95">
                  Faire de l&apos;Afrique francophone un continent producteur de solutions
                  technologiques mondiales — et non un simple consommateur de technologies importées.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="section bg-cauris-gray-bg">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Nos valeurs fondatrices"
            title="Six principes qui guident chaque décision"
          />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {VALUES.map((value, i) => {
              const Icon = VALUE_ICONS[value.icon as keyof typeof VALUE_ICONS];
              return (
                <Reveal key={value.id} delay={i * 80}>
                  <div className="card bg-white p-7 h-full border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-cauris-orange/10 text-cauris-orange flex items-center justify-center mb-5">
                      {Icon && <Icon className="w-6 h-6" aria-hidden="true" />}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-cauris-black mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-cauris-gray-text leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section id="equipe" className="section bg-white">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Notre équipe"
            title="L'équipe qui vous accompagne"
            description="Des professionnels qui ont eux-mêmes entrepris, construit, raté et réussi — avant de se mettre au service des autres."
          />

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {TEAM.map((member, i) => (
              <Reveal key={`${member.name}-${i}`} delay={i * 80}>
                <article className="group">
                  <div className="aspect-square rounded-card overflow-hidden mb-4 shadow-card group-hover:shadow-card-hover transition-shadow">
                    <img
                      src={member.photo}
                      alt={`Portrait de ${member.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-cauris-black">
                    {member.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1 mb-3">
                    <p className="text-sm text-cauris-orange font-medium">{member.role}</p>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cauris-gray-secondary hover:text-cauris-orange transition-colors"
                      aria-label={`LinkedIn de ${member.name}`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-xs text-cauris-gray-text leading-relaxed">{member.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-xs text-cauris-gray-secondary italic max-w-2xl">
            Note : les noms et bios ci-dessus sont des modèles à personnaliser. Les membres réels
            de l&apos;équipe seront ajoutés via le CMS lors du lancement.
          </p>
        </div>
      </section>

      {/* Conseil d'administration */}
      <section id="ca" className="section bg-cauris-cream/40">
        <div className="container-cauris">
          <SectionTitle
            eyebrow="Gouvernance"
            title="Notre Conseil d'Administration"
            description="Notre conseil d'administration est composé de personnalités reconnues du monde académique, institutionnel et entrepreneurial — garantes de la gouvernance et de l'orientation stratégique de CAURIS DIGITAL."
          />

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOARD.map((member, i) => (
              <Reveal key={`${member.name}-${i}`} delay={i * 60}>
                <div className="bg-white rounded-card p-5 border border-gray-100 hover:border-cauris-orange/30 transition-colors">
                  <p className="font-semibold text-cauris-black">{member.name}</p>
                  <p className="text-sm text-cauris-gray-secondary mt-0.5">{member.institution}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
