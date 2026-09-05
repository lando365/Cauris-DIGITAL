/**
 * Constantes globales du site CAURIS DIGITAL
 * Conformes au cahier des charges v1.0 - Avril 2026
 */
import type {
  Sector,
  StartupStatus,
  ArticleCategory as PrismaArticleCategory,
} from '@prisma/client';

export const SITE_CONFIG = {
  name: 'CAURIS DIGITAL',
  tagline: "Incubateur numérique d'excellence",
  shortTagline: "Propulser l'innovation numérique africaine — depuis Yaoundé, pour le monde.",
  description:
    "CAURIS DIGITAL stimule l'entrepreneuriat tech et forme les entrepreneurs numériques de demain. Basé à Yaoundé, actif partout dans le monde.",
  url: 'https://caurisdigital.org',
  email: 'hello@caurisdigital.org',
  phone: '+237 6 XX XX XX XX',
  address: 'Yaoundé, Cameroun',
  fullAddress: '[Adresse complète], Yaoundé, Cameroun',
  hours: 'Lundi au vendredi, 8h00–18h00 (GMT+1)',
  founded: 2021,
  social: {
    linkedin: 'https://linkedin.com/company/cauris-digital',
    twitter: 'https://twitter.com/caurisdigital',
    youtube: 'https://youtube.com/@caurisdigital',
    facebook: 'https://facebook.com/caurisdigital',
  },
} as const;

/**
 * Chiffres clés (CDC §2.1 + Textes_Site_v1). Le libellé (label) est
 * traduisible : voir le namespace next-intl "KeyNumbersData", indexé par id.
 */
export const KEY_NUMBERS = [
  { id: 'yearsSupport', value: 5, suffix: '+' },
  { id: 'startupsSupported', value: 80, suffix: '+' },
  { id: 'capitalRaised', value: 2, suffix: 'M$' },
  { id: 'jobsCreated', value: 300, suffix: '+' },
  { id: 'expertsMentors', value: 40, suffix: '+' },
  { id: 'topIncubators', value: 10, prefix: 'Top ' },
] as const;

/**
 * Secteurs d'activité (Textes_Site_v1 — 5 secteurs). title/description/tags
 * sont traduisibles : voir le namespace next-intl "SectorsData", indexé par id.
 */
export const SECTORS = [
  { id: 'agritech', icon: 'Sprout' },
  { id: 'fintech', icon: 'Banknote' },
  { id: 'edtech', icon: 'GraduationCap' },
  { id: 'healthtech', icon: 'HeartPulse' },
  { id: 'smart-cities', icon: 'Building2' },
] as const;

/**
 * Programmes (Textes_Site_v1). Le contenu textuel est traduisible : voir le
 * namespace next-intl "ProgramsData", indexé par id.
 */
export const PROGRAMS = [
  { id: 'incubation', href: '/programme-incubation' },
  { id: 'acceleration', href: '/programme-acceleration' },
] as const;

/**
 * Témoignages (Textes_Site_v1). name/startup sont des noms propres (non
 * traduits) ; location/quote sont traduisibles : voir le namespace next-intl
 * "TestimonialsData", indexé par id.
 */
export const TESTIMONIALS = [
  { id: 'amina', name: 'Amina N.', startup: 'FarmTrack' },
  { id: 'jeanPaul', name: 'Jean-Paul M.', startup: 'PayEasy' },
  { id: 'rodrigue', name: 'Rodrigue K.', startup: 'MédikAfrique' },
] as const;

/**
 * Startup affichée côté public. sector/status portent la valeur brute de
 * l'enum Prisma (stable, indépendante de la langue) ; la traduction se fait
 * à l'affichage via le namespace next-intl "Enums".
 */
export interface Startup {
  slug: string;
  name: string;
  sector: Sector;
  country: string; // Drapeau emoji
  countryName: string; // Nom du pays
  city?: string; // Ville (optionnel)
  status: StartupStatus;
  year: number; // Année d'entrée dans le programme
  foundedYear?: number; // Année de fondation
  tagline: string;
  description: string; // Description courte (200 mots max — CDC §6.4)
  longDescription?: string; // Description longue pour la page détail
  technologies?: string[]; // Stack technique
  founders?: string[]; // Noms fondateurs
  metrics?: Array<{ label: string; value: string }>;
  website?: string;
  linkedin?: string;
  achievements?: string[]; // Étapes marquantes
}

/**
 * Valeurs fondatrices (Textes_Site_v1 — 6 valeurs). title/description sont
 * traduisibles : voir le namespace next-intl "ValuesData", indexé par id.
 */
export const VALUES = [
  { id: 'excellence', icon: 'Trophy' },
  { id: 'inclusion', icon: 'Users' },
  { id: 'impact', icon: 'Target' },
  { id: 'collaboration', icon: 'Handshake' },
  { id: 'enracinement', icon: 'Globe2' },
  { id: 'ouverture', icon: 'Globe' },
] as const;

/**
 * Catégories partenaires (Textes_Site_v1). title/description sont
 * traduisibles : voir le namespace next-intl "PartnerCategoriesData", indexé
 * par id.
 */
export const PARTNER_CATEGORIES = [
  {
    id: 'institutionnels',
  },
  {
    id: 'financiers',
  },
  {
    id: 'academiques',
  },
  {
    id: 'corporatifs',
  },
] as const;

/**
 * FAQ (Textes_Site_v1 — 15 questions)
 */
export const FAQ_ITEMS = [
  {
    theme: 'À propos de CAURIS DIGITAL',
    items: [
      {
        q: "Qu'est-ce que CAURIS DIGITAL ?",
        a: "CAURIS DIGITAL est un incubateur numérique basé à Yaoundé, Cameroun. Nous accompagnons les startups technologiques africaines de la phase d'idée jusqu'à la commercialisation de leur produit. Nous offrons deux programmes principaux : le programme Incubation (6 mois) et le programme Accélération (12 semaines). Notre mentorat est accessible en ligne depuis n'importe où dans le monde.",
      },
      {
        q: 'Pourquoi le nom « Cauris Digital » ?',
        a: "Le cauris est une coquillage qui a servi de monnaie d'échange à travers toute l'Afrique pendant des siècles. Il symbolise la valeur, la connexion et l'échange. Ce nom représente notre mission : créer de la valeur, connecter les entrepreneurs et faciliter les échanges entre les talents africains et les marchés mondiaux.",
      },
      {
        q: 'CAURIS DIGITAL est-il lié à une université ou une institution publique ?',
        a: "CAURIS DIGITAL est une association indépendante. Nous travaillons en partenariat avec des universités, des institutions publiques et des acteurs privés, mais nous sommes organisationnellement autonomes. Cette indépendance nous permet d'agir rapidement et de nous adapter aux besoins de nos entrepreneurs.",
      },
    ],
  },
  {
    theme: 'Candidatures et sélection',
    items: [
      {
        q: 'Qui peut candidater aux programmes de CAURIS DIGITAL ?',
        a: "Tout porteur de projet tech avec une idée viable peut candidater. Vous n'avez pas besoin d'être camerounais ou basé à Yaoundé — nos programmes sont ouverts à tous les entrepreneurs francophones ou anglophones d'Afrique et de la diaspora. Il n'y a pas d'âge minimum ou maximum, pas de formation préalable requise.",
      },
      {
        q: 'Est-ce que je dois être à Yaoundé pour participer ?',
        a: "Non. Nos programmes sont accessibles en ligne depuis n'importe où dans le monde. Si vous êtes à Dakar, Abidjan, Kinshasa, Paris ou Montréal, vous pouvez bénéficier du même niveau d'accompagnement que quelqu'un qui est physiquement présent à Yaoundé. Les participants locaux ont en plus accès à notre espace de coworking.",
      },
      {
        q: 'Mon projet doit-il être dans le numérique pour être éligible ?',
        a: "Oui. Nous nous spécialisons dans les startups technologiques. Cela inclut les applications mobiles, les plateformes web, les solutions SaaS, les technologies IoT, l'intelligence artificielle, la blockchain et les hardwares tech. Un projet purement traditionnel sans composante technologique ne serait pas sélectionné.",
      },
      {
        q: 'Quelle est la durée du processus de sélection ?',
        a: 'Après la clôture des candidatures, notre équipe examine tous les dossiers dans un délai de 2 semaines. Les candidats présélectionnés sont contactés pour un entretien de 30 minutes en visioconférence. Les résultats définitifs sont annoncés dans les 4 semaines suivant la clôture.',
      },
      {
        q: 'Est-il possible de candidater à plusieurs sessions ?',
        a: "Oui, absolument. Si votre candidature n'est pas retenue lors d'une session, vous pouvez vous améliorer et candidater à nouveau lors de la session suivante. Certains de nos meilleurs entrepreneurs ont candidaté deux fois avant d'être sélectionnés.",
      },
    ],
  },
  {
    theme: 'Financement et coût',
    items: [
      {
        q: 'Les programmes sont-ils payants ?',
        a: 'Le programme Incubation est entièrement gratuit pour les startups sélectionnées. Le programme Accélération peut demander une contribution symbolique selon les cohortes — les conditions exactes sont précisées lors de chaque appel à candidatures. Consultez notre page programme pour les détails de la session en cours.',
      },
      {
        q: 'CAURIS DIGITAL prend-il des parts dans le capital de ma startup ?',
        a: "Non. CAURIS DIGITAL ne prend aucune participation au capital des startups qu'il accompagne. Notre modèle est fondé sur l'impact, pas sur le retour financier direct. Certains partenaires de notre réseau peuvent proposer des investissements en échange d'equity — mais cela est toujours à votre initiative et votre discrétion.",
      },
      {
        q: 'Proposez-vous des financements directs aux startups ?',
        a: "Nous ne finançons pas directement les startups. En revanche, nous les connectons activement à notre réseau d'investisseurs — business angels, fonds d'amorçage africains et internationaux, programmes de subventions institutionnels. L'accès à ce réseau est l'un des avantages les plus cités par nos alumni.",
      },
    ],
  },
  {
    theme: 'Mentorat et accompagnement',
    items: [
      {
        q: 'Comment fonctionne le mentorat en ligne ?',
        a: "Les sessions de mentorat se tiennent via visioconférence (Google Meet, Zoom ou Microsoft Teams). Chaque entrepreneur bénéficie d'une session individuelle hebdomadaire d'une heure avec son mentor attitré, plus l'accès aux sessions collectives en ligne. Notre plateforme de suivi permet de planifier les sessions, partager des documents et suivre les objectifs entre les sessions.",
      },
      {
        q: 'Comment sont choisis les mentors ?',
        a: "Nos mentors sont des professionnels sélectionnés pour leur expertise sectorielle et leur expérience entrepreneuriale. Ils ont eux-mêmes fondé ou dirigé des entreprises, levé des fonds ou accompagné des startups. Nous travaillons avec des mentors basés au Cameroun, en Afrique de l'Ouest, en Europe et en Amérique du Nord. Chaque entrepreneur est mis en relation avec un ou plusieurs mentors pertinents pour son secteur et son stade de développement.",
      },
    ],
  },
  {
    theme: 'Partenariats corporate',
    items: [
      {
        q: 'Comment devenir partenaire de CAURIS DIGITAL ?',
        a: 'Contactez notre équipe via le formulaire de partenariat sur notre site (rubrique Innovation Corporative) ou écrivez-nous à hello@caurisdigital.org. Nous organisons une réunion de découverte pour comprendre vos enjeux et vous proposer la formule de partenariat la plus adaptée.',
      },
      {
        q: 'Peut-on sponsoriser un événement sans être partenaire annuel ?',
        a: "Oui. Nous acceptons des partenariats événementiels ponctuels pour nos Demo Days, notre Journée de l'Innovation Ouverte et nos ateliers thématiques. Contactez-nous pour recevoir notre brochure sponsoring.",
      },
    ],
  },
] as const;

/**
 * Banque d'images du site CAURIS DIGITAL.
 *
 * Les images sont stockées localement dans `public/images/entrepreneurs/`
 * et servies sous l'URL `/images/entrepreneurs/...`.
 *
 * Mettre à jour ces chemins lorsque de nouvelles photos seront disponibles.
 */
export const BRAND_IMAGES = {
  // Hero homepage — fond plein écran (équipe d'entrepreneurs africains)
  heroBackground: '/images/entrepreneurs/equipe-jeunes-africains-bureau.webp',

  // IntroBlock — grille 4 images (entrepreneurs au travail)
  introPitch: '/images/entrepreneurs/femme-dirigeante-bras-croises.avif',
  introMentoring: '/images/entrepreneurs/entrepreneur-portrait.jpg',
  introCoworking: '/images/entrepreneurs/entrepreneur-bureau.jpg',
  introWorkshop: '/images/entrepreneurs/entrepreneur-succes.png',

  // À propos — image principale "Notre histoire"
  aboutHistory: '/images/entrepreneurs/femme-entrepreneure-portrait.jpg',

  // Programme Incubation — hero
  incubationHero: '/images/entrepreneurs/entrepreneur-bureau.jpg',

  // Programme Accélération — hero
  accelerationHero: '/images/entrepreneurs/femme-dirigeante-bras-croises.avif',

  // Innovation Corporative — image de section
  corporateMeeting: '/images/entrepreneurs/equipe-jeunes-africains-bureau.webp',
} as const;

/**
 * Portraits d'équipe — photos placeholder.
 * Format carré 400×400 recommandé par le CDC.
 */
export const TEAM_PHOTOS = {
  directorGeneral: '/images/entrepreneurs/entrepreneur-portrait.jpg',
  programDirector: '/images/entrepreneurs/femme-entrepreneure-portrait.jpg',
  mentorshipLead: '/images/entrepreneurs/entrepreneur-succes.png',
  communicationLead: '/images/entrepreneurs/femme-dirigeante-bras-croises.avif',
} as const;

/**
 * Logos partenaires (CDC §3.10 — Page Partenaires)
 * Stockés dans public/images/partenaires/
 */
export interface PartnerLogo {
  name: string;
  logo: string;
  url?: string;
}

/**
 * Catégories de blog : valeur brute de l'enum Prisma ArticleCategory
 * (indépendante de la langue) ; la traduction se fait à l'affichage via le
 * namespace next-intl "Enums".
 */
export type ArticleCategory = PrismaArticleCategory;

export const ARTICLE_CATEGORIES: ReadonlyArray<'ALL' | ArticleCategory> = [
  'ALL',
  'ANNONCES',
  'PORTRAITS',
  'RESSOURCES',
  'EVENEMENTS',
  'OPINIONS',
];

export const ARTICLE_CATEGORY_COLORS: Record<ArticleCategory, string> = {
  ANNONCES: 'bg-cauris-orange/10 text-cauris-orange',
  PORTRAITS: 'bg-pink-100 text-pink-700',
  RESSOURCES: 'bg-cauris-success/10 text-cauris-success-text',
  EVENEMENTS: 'bg-purple-100 text-purple-700',
  OPINIONS: 'bg-blue-100 text-blue-700',
};

/**
 * Structure d'un article (Textes_Site_v1 §11 — Modèle d'article type)
 */
export interface Article {
  slug: string;
  title: string;
  excerpt: string; // Méta description / Extrait (max ~160 caractères)
  category: ArticleCategory;
  date: string; // ISO YYYY-MM-DD
  author: string;
  readingTime: number; // minutes
  image: string;
  imageCaption?: string;
  /** Contenu de l'article structuré en paragraphes et sections */
  content: ArticleSection[];
}

export interface ArticleSection {
  type: 'paragraph' | 'h2' | 'h3' | 'quote' | 'list';
  text?: string;
  items?: string[];
  citation?: string;
}

