/**
 * Constantes globales du site CAURIS DIGITAL
 * Conformes au cahier des charges v1.0 - Avril 2026
 */

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
 * Navigation principale (CDC §4.1)
 */
export const MAIN_NAV = [
  {
    label: 'À propos',
    href: '/a-propos',
    submenu: [
      { label: 'Qui sommes-nous ?', href: '/a-propos#qui-sommes-nous' },
      { label: 'Notre équipe', href: '/a-propos#equipe' },
      { label: "Conseil d'administration", href: '/a-propos#ca' },
    ],
  },
  {
    label: 'Startups',
    href: '/startups',
    submenu: [
      { label: 'Programme Incubation', href: '/programme-incubation' },
      { label: 'Programme Accélération', href: '/programme-acceleration' },
      { label: 'Nos startups', href: '/startups' },
      { label: 'Entrepreneurs en résidence', href: '/startups#residence' },
    ],
  },
  {
    label: 'Innovation Corporative',
    href: '/innovation-corporative',
    submenu: [
      { label: "Lab d'innovation", href: '/innovation-corporative#lab' },
      { label: 'Partenaires', href: '/partenaires' },
      { label: 'Programmes corporatifs', href: '/innovation-corporative#programmes' },
    ],
  },
  { label: 'Événements', href: '/evenements' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Partenaires', href: '/partenaires' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
] as const;

/**
 * Chiffres clés (CDC §2.1 + Textes_Site_v1)
 * À mettre à jour chaque trimestre via le CMS.
 */
export const KEY_NUMBERS = [
  { value: 5, suffix: '+', label: "Années d'accompagnement" },
  { value: 80, suffix: '+', label: 'Startups accompagnées' },
  { value: 2, suffix: 'M$', label: 'Capitaux levés' },
  { value: 300, suffix: '+', label: 'Emplois créés' },
  { value: 40, suffix: '+', label: 'Experts & mentors' },
  { value: 10, prefix: 'Top ', label: 'Incubateurs africains' },
] as const;

/**
 * Secteurs d'activité (Textes_Site_v1 — 5 secteurs)
 */
export const SECTORS = [
  {
    id: 'agritech',
    title: 'Agritech & Climatech',
    description:
      "Les technologies au service de l'agriculture africaine, de la chaîne alimentaire et de la transition climatique. Parce que nourrir l'Afrique est le défi du siècle.",
    icon: 'Sprout',
    tags: ['IA agricole', 'IoT rural', 'Drones', 'Satellite', 'Gestion eau'],
  },
  {
    id: 'fintech',
    title: 'Fintech & Inclusion financière',
    description:
      'Les solutions qui donnent accès aux services financiers aux populations non bancarisées. Mobile money, épargne, crédit, assurance et paiement digital pour tous.',
    icon: 'Banknote',
    tags: ['Mobile Money', 'Blockchain', 'API bancaires', 'Scoring alternatif', 'Crypto'],
  },
  {
    id: 'edtech',
    title: 'Edtech & Formation numérique',
    description:
      "Les plateformes et outils qui révolutionnent l'accès à l'éducation en Afrique. De l'école primaire à la formation professionnelle, en passant par les métiers du numérique.",
    icon: 'GraduationCap',
    tags: ['LMS', 'IA pédagogique', 'Multimédia', 'Mobile learning', 'Gamification'],
  },
  {
    id: 'healthtech',
    title: 'Healthtech & Bien-être',
    description:
      'Les solutions de santé numérique adaptées aux réalités africaines. Télémédecine, gestion hospitalière, diagnostic assisté par IA, logistique pharmaceutique.',
    icon: 'HeartPulse',
    tags: ['IA médicale', 'Télémédecine', 'Mobile health', 'Données patients', 'E-pharmacie'],
  },
  {
    id: 'smart-cities',
    title: 'Smart Cities & Mobilité',
    description:
      'Les technologies qui rendent les villes africaines plus intelligentes, plus durables et plus vivables. Transport, gestion des déchets, énergie, sécurité urbaine.',
    icon: 'Building2',
    tags: ['IoT urbain', 'Big data', 'Mobilité électrique', 'Énergie solaire', 'Smart grid'],
  },
] as const;

/**
 * Programmes (Textes_Site_v1)
 */
export const PROGRAMS = [
  {
    id: 'incubation',
    name: 'Incubation',
    badge: 'Programme',
    duration: '6 mois',
    format: 'Présentiel à Yaoundé + Mentorat en ligne disponible partout',
    tagline: 'Transformer votre idée en produit viable.',
    description:
      "Un programme d'accompagnement intensif conçu pour transformer votre idée en produit viable, en vous donnant accès à notre réseau de mentors, nos outils et notre communauté.",
    href: '/programme-incubation',
    cta: 'En savoir plus',
    benefits: [
      'Mentorat individuel hebdomadaire avec un expert de votre secteur',
      "Accès à l'espace de travail collaboratif à Yaoundé",
      'Sessions collectives : business model, pitch, juridique, marketing',
      'Accès à la communauté des alumni et entrepreneurs en résidence',
      'Connexion avec notre réseau de partenaires institutionnels et investisseurs',
      'Préparation et participation au Demo Day de fin de programme',
      'Certificat de participation reconnu par notre réseau partenaire',
      'Accompagnement post-programme pendant 3 mois supplémentaires',
    ],
  },
  {
    id: 'acceleration',
    name: 'Accélération',
    badge: 'Programme',
    duration: '12 semaines',
    format: "100% en ligne — accessible depuis n'importe où dans le monde",
    tagline: 'Faire avancer votre startup de 12 mois en 12 semaines.',
    description:
      'Un programme personnalisé pour les startups en phase de croissance. Objectif : franchir votre prochain palier de développement en 12 semaines chrono.',
    href: '/programme-acceleration',
    cta: 'Explorer le programme',
    benefits: [
      'Audit complet de votre startup et identification des leviers prioritaires',
      'Stratégie de croissance data-driven adaptée aux marchés africains',
      'Optimisation du pricing et nouvelles sources de revenus',
      'Préparation du pitch investisseurs et dossier de levée',
      'Demo Day ouvert aux investisseurs africains et internationaux',
      'Intégration dans le réseau alumni CAURIS DIGITAL',
    ],
  },
] as const;

/**
 * Témoignages (Textes_Site_v1)
 */
export const TESTIMONIALS = [
  {
    name: 'Amina N.',
    startup: 'FarmTrack',
    location: 'Promo 2024',
    quote:
      "CAURIS DIGITAL n'est pas juste un incubateur. C'est une famille. En six mois, j'ai transformé une idée floue en produit que des clients paient vraiment. Le mentorat en ligne m'a permis de continuer depuis Douala sans quitter mon travail.",
  },
  {
    name: 'Jean-Paul M.',
    startup: 'PayEasy',
    location: 'Cameroun',
    quote:
      "Ce qui m'a le plus frappé, c'est la qualité des mentors. Des professionnels qui ont vraiment construit des entreprises. Pas juste des théoriciens. Grâce à leur réseau, j'ai obtenu mon premier client corporate en semaine 8 du programme.",
  },
  {
    name: 'Rodrigue K.',
    startup: 'MédikAfrique',
    location: 'Congo-Brazzaville',
    quote:
      "Je suis basé à Brazzaville. Rejoindre CAURIS DIGITAL en ligne semblait risqué. En réalité, le programme était encore plus structuré que ce que j'espérais. Aujourd'hui mon app a 12 000 utilisateurs actifs.",
  },
];

/**
 * Startups vedettes (placeholder — à remplacer via CMS)
 */
export interface Startup {
  slug: string;
  name: string;
  sector: string;
  country: string; // Drapeau emoji
  countryName: string; // Nom du pays
  city?: string; // Ville (optionnel)
  status: 'En incubation' | 'Diplômée' | 'Alumni';
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

export const FEATURED_STARTUPS: Startup[] = [
  {
    slug: 'farmtrack',
    name: 'FarmTrack',
    sector: 'Agritech',
    country: '🇨🇲',
    countryName: 'Cameroun',
    city: 'Yaoundé',
    status: 'Diplômée',
    year: 2024,
    foundedYear: 2023,
    tagline: 'Traçabilité agricole pour petits producteurs.',
    description:
      "Plateforme de traçabilité de la chaîne agricole pour les coopératives camerounaises. Permet aux petits producteurs de prouver l'origine et la qualité de leurs récoltes.",
    longDescription:
      "FarmTrack équipe les coopératives agricoles d'un système de traçabilité hybride (SMS pour les producteurs, dashboard web pour les coopératives, certificats blockchain pour les acheteurs internationaux). La plateforme permet aux petits producteurs de cacao, café et palme de prouver l'origine et la qualité de leurs récoltes, et d'accéder à des prix justes sur les marchés internationaux. Aujourd'hui, 12 coopératives clientes utilisent FarmTrack au Cameroun, totalisant plus de 1 200 producteurs tracés.",
    technologies: ['Blockchain', 'IoT rural', 'SMS Gateway', 'Cartographie satellite'],
    founders: ['Amina N.'],
    metrics: [
      { label: 'Coopératives clientes', value: '12' },
      { label: 'Producteurs tracés', value: '1 200+' },
      { label: "Chiffre d'affaires mensuel", value: '50 000 FCFA' },
    ],
    achievements: [
      'Demo Day 2024 : présentation devant 50 investisseurs',
      'Premier partenariat avec un acheteur européen (en négociation)',
      'Candidate au programme Accélération 2026',
    ],
  },
  {
    slug: 'payeasy',
    name: 'PayEasy',
    sector: 'Fintech',
    country: '🇨🇲',
    countryName: 'Cameroun',
    city: 'Douala',
    status: 'En incubation',
    year: 2025,
    foundedYear: 2024,
    tagline: 'Paiement digital pour PME africaines.',
    description:
      'Solution de paiement multi-moyens (Mobile Money, carte, virement) pour les PME camerounaises et CEMAC.',
    longDescription:
      "PayEasy démocratise le paiement digital pour les petites et moyennes entreprises de la zone CEMAC. La plateforme unifie tous les moyens de paiement (Mobile Money MTN/Orange, cartes Visa/Mastercard, virements bancaires) en une seule interface, avec un dashboard de gestion adapté aux réalités africaines (multi-devises, comptabilité simplifiée, gestion d'équipe).",
    technologies: ['Mobile Money APIs', 'Stripe', 'Node.js', 'PostgreSQL'],
    founders: ['Jean-Paul M.'],
    metrics: [
      { label: 'PME clientes', value: '47' },
      { label: 'Transactions/mois', value: '8 000+' },
      { label: 'Premier client corporate', value: 'Semaine 8' },
    ],
  },
  {
    slug: 'medikafrique',
    name: 'MédikAfrique',
    sector: 'Healthtech',
    country: '🇨🇬',
    countryName: 'Congo-Brazzaville',
    city: 'Brazzaville',
    status: 'Alumni',
    year: 2023,
    foundedYear: 2022,
    tagline: 'Téléconsultation médicale accessible.',
    description:
      'App de téléconsultation médicale connectant 12 000 utilisateurs actifs aux médecins certifiés en Afrique centrale.',
    longDescription:
      "MédikAfrique connecte les populations rurales et urbaines à des médecins certifiés via une application mobile simple d'utilisation. La plateforme propose des consultations en visioconférence, du suivi médical à distance et un service d'ordonnance électronique reconnu par les pharmacies partenaires. Présent au Congo-Brazzaville, en RDC et au Gabon.",
    technologies: ['React Native', 'WebRTC', 'IA diagnostic', 'PWA'],
    founders: ['Rodrigue K.'],
    metrics: [
      { label: 'Utilisateurs actifs', value: '12 000+' },
      { label: 'Médecins partenaires', value: '85' },
      { label: 'Pays couverts', value: '3' },
    ],
    achievements: [
      'Lauréate du Demo Day 2023',
      'Levée de fonds seed 200K€ en 2024',
      "Expansion en Afrique de l'Ouest prévue 2026",
    ],
  },
  {
    slug: 'educonnect',
    name: 'EduConnect',
    sector: 'Edtech',
    country: '🇸🇳',
    countryName: 'Sénégal',
    city: 'Dakar',
    status: 'Diplômée',
    year: 2024,
    foundedYear: 2023,
    tagline: "Plateforme d'apprentissage mobile-first.",
    description:
      'LMS mobile-first pour les écoles primaires et secondaires. Optimisé pour les zones à faible connectivité.',
    longDescription:
      "EduConnect est une plateforme d'apprentissage conçue spécifiquement pour les écoles africaines. Mobile-first, elle fonctionne en mode hors-ligne avec synchronisation automatique quand la connexion est disponible. Les enseignants peuvent créer leurs cours, les élèves accèdent à des contenus pédagogiques adaptés au programme local, et les parents suivent les progrès en temps réel.",
    technologies: ['React Native', 'Service Workers', 'Firebase', 'SQLite'],
    founders: ['Fatou S.'],
    metrics: [
      { label: 'Écoles équipées', value: '24' },
      { label: 'Élèves actifs', value: '3 500+' },
      { label: 'Pays couverts', value: '2' },
    ],
  },
  {
    slug: 'agripredict',
    name: 'AgriPredict',
    sector: 'Agritech',
    country: '🇧🇫',
    countryName: 'Burkina Faso',
    city: 'Ouagadougou',
    status: 'En incubation',
    year: 2025,
    foundedYear: 2024,
    tagline: "IA prédictive pour l'agriculture.",
    description:
      "Modèles d'IA prédictive pour anticiper les rendements agricoles et optimiser les semis selon les conditions climatiques.",
    longDescription:
      "AgriPredict combine intelligence artificielle, données satellite et capteurs IoT au sol pour prédire les rendements agricoles avec une précision de ±5%. La startup accompagne les coopératives sahéliennes dans l'optimisation de leurs semis, l'anticipation des sécheresses et la gestion intelligente de l'irrigation.",
    technologies: ['TensorFlow', 'Données satellite', 'IoT capteurs', 'Python'],
    founders: ['Issaka T.', 'Marie K.'],
    metrics: [
      { label: 'Hectares analysés', value: '4 500' },
      { label: 'Précision prédictive', value: '94%' },
      { label: 'Coopératives clientes', value: '7' },
    ],
  },
  {
    slug: 'cryptosahel',
    name: 'CryptoSahel',
    sector: 'Fintech',
    country: '🇲🇱',
    countryName: 'Mali',
    city: 'Bamako',
    status: 'Diplômée',
    year: 2023,
    foundedYear: 2022,
    tagline: 'Microfinance via blockchain.',
    description:
      "Plateforme de microfinance basée sur la blockchain, opérationnelle au Mali et en cours d'expansion en Afrique de l'Ouest.",
    longDescription:
      "CryptoSahel transforme la microfinance grâce à la blockchain. La startup permet aux populations non-bancarisées d'accéder à des microcrédits, à l'épargne et au transfert d'argent sans frais via une application mobile. Les contrats intelligents garantissent la transparence et réduisent les coûts opérationnels de 60% comparé aux institutions classiques.",
    technologies: ['Ethereum L2', 'Smart contracts', 'Solidity', 'React Native'],
    founders: ['Sékou D.'],
    metrics: [
      { label: 'Utilisateurs', value: '8 200+' },
      { label: 'Microcrédits accordés', value: '4 100' },
      { label: 'Taux de remboursement', value: '97%' },
    ],
  },
  {
    slug: 'greenwatt',
    name: 'GreenWatt',
    sector: 'Smart Cities',
    country: '🇨🇮',
    countryName: "Côte d'Ivoire",
    city: 'Abidjan',
    status: 'En incubation',
    year: 2025,
    foundedYear: 2024,
    tagline: 'Énergie solaire connectée pour les ménages.',
    description:
      "Kits solaires intelligents avec paiement à l'usage pour les ménages non raccordés au réseau électrique.",
    longDescription:
      "GreenWatt rend l'énergie solaire accessible aux foyers ivoiriens hors-réseau grâce à un modèle de paiement à l'usage (pay-as-you-go). Les kits solaires connectés sont monitorés à distance et financés via Mobile Money en versements quotidiens abordables. Plus de 800 foyers déjà équipés.",
    technologies: ['IoT (LoRaWAN)', 'Mobile Money APIs', 'Edge computing'],
    founders: ['Amadou Y.'],
    metrics: [
      { label: 'Foyers équipés', value: '850' },
      { label: 'kWh produits/mois', value: '12 000' },
      { label: 'CO₂ évité (an)', value: '85 tonnes' },
    ],
  },
  {
    slug: 'taxisafe',
    name: 'TaxiSafe',
    sector: 'Smart Cities',
    country: '🇨🇲',
    countryName: 'Cameroun',
    city: 'Yaoundé & Douala',
    status: 'Alumni',
    year: 2022,
    foundedYear: 2021,
    tagline: 'Mobilité urbaine sécurisée.',
    description:
      'Service de transport urbain avec géolocalisation, paiement digital et notation des chauffeurs. Présent à Yaoundé et Douala.',
    longDescription:
      "TaxiSafe digitalise le transport urbain camerounais avec une application qui combine géolocalisation en temps réel, paiement digital via Mobile Money et système de notation des chauffeurs. Plus de 400 chauffeurs vérifiés desservent Yaoundé et Douala, avec un focus sur la sécurité (vérification d'identité, bouton SOS, partage de trajet).",
    technologies: ['Flutter', 'Google Maps SDK', 'Stripe', 'Firebase'],
    founders: ['Patrick N.'],
    metrics: [
      { label: 'Chauffeurs vérifiés', value: '420' },
      { label: 'Courses/mois', value: '18 000+' },
      { label: 'Note moyenne', value: '4.7/5' },
    ],
    achievements: ['Partenariat avec une compagnie de taxi camerounaise', 'Profitable depuis 2024'],
  },
  {
    slug: 'lingalearn',
    name: 'LingaLearn',
    sector: 'Edtech',
    country: '🇨🇩',
    countryName: 'RDC',
    city: 'Kinshasa',
    status: 'En incubation',
    year: 2025,
    foundedYear: 2024,
    tagline: 'Apprendre les langues africaines en ligne.',
    description:
      "Plateforme d'apprentissage des langues africaines (Lingala, Swahili, Wolof, Bambara) avec leçons audio et professeurs natifs.",
    longDescription:
      "LingaLearn est la première plateforme dédiée à l'apprentissage des langues africaines. La startup propose des cours interactifs de Lingala, Swahili, Wolof et Bambara, avec leçons audio enregistrées par des locuteurs natifs et des sessions live avec des professeurs certifiés. Cible : la diaspora africaine, les expatriés et les Africains souhaitant retrouver leurs racines linguistiques.",
    technologies: ['Next.js', 'WebRTC', 'IA prononciation', 'Stripe'],
    founders: ['Christelle M.'],
    metrics: [
      { label: 'Langues disponibles', value: '4' },
      { label: 'Apprenants actifs', value: '1 200+' },
      { label: 'Pays des apprenants', value: '32' },
    ],
  },
];

/**
 * Valeurs fondatrices (Textes_Site_v1 — 6 valeurs)
 */
export const VALUES = [
  {
    id: 'excellence',
    title: 'Excellence',
    description:
      "Nous imposons des standards professionnels internationaux à tous nos programmes. Pas de demi-mesure : si vous êtes chez CAURIS DIGITAL, c'est pour construire quelque chose de grand.",
    icon: 'Trophy',
  },
  {
    id: 'inclusion',
    title: 'Inclusion',
    description:
      "Nous croyons que le talent n'a pas de genre, d'origine sociale ou de région. Notre programme est ouvert à tous les profils — avec une attention particulière pour les femmes entrepreneures et les porteurs de projets de zones rurales.",
    icon: 'Users',
  },
  {
    id: 'impact',
    title: 'Impact',
    description:
      "Chaque startup que nous accompagnons doit avoir un impact mesurable : sur ses utilisateurs, sur sa communauté, sur son marché. L'impact n'est pas une option — c'est un critère de sélection.",
    icon: 'Target',
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    description:
      "Nous construisons ensemble. Entrepreneurs, mentors, partenaires et alumni forment une communauté active où le partage de ressources, d'expériences et de contacts est la norme.",
    icon: 'Handshake',
  },
  {
    id: 'enracinement',
    title: 'Enracinement africain',
    description:
      'Nos solutions partent des besoins réels du continent. Nous ne copions pas les modèles étrangers — nous les adaptons, les challengeons et créons nos propres réponses aux enjeux africains.',
    icon: 'Globe2',
  },
  {
    id: 'ouverture',
    title: 'Ouverture mondiale',
    description:
      'Ancrés à Yaoundé, connectés au monde. Nos entrepreneurs accèdent à des mentors internationaux, des partenaires européens et des marchés globaux — sans quitter leur continent.',
    icon: 'Globe',
  },
] as const;

/**
 * Catégories partenaires (Textes_Site_v1)
 */
export const PARTNER_CATEGORIES = [
  {
    id: 'institutionnels',
    title: 'Partenaires institutionnels',
    description:
      "Ces partenaires nous apportent leur soutien institutionnel, leur légitimité et leur réseau pour renforcer l'impact de nos programmes sur les politiques publiques numériques en Afrique.",
  },
  {
    id: 'financiers',
    title: 'Partenaires financiers',
    description:
      "Nos partenaires financiers apportent aux startups de CAURIS DIGITAL un accès privilégié au financement — des premières bourses d'amorçage aux tours de table en série A.",
  },
  {
    id: 'academiques',
    title: 'Partenaires académiques',
    description:
      'Nos partenaires académiques enrichissent nos programmes de leur expertise et offrent à nos entrepreneurs un accès aux recherches de pointe, aux laboratoires et aux talents universitaires.',
  },
  {
    id: 'corporatifs',
    title: 'Partenaires corporatifs',
    description:
      "Nos partenaires corporatifs co-innovent avec nos startups, les accompagnent et leur ouvrent les portes de marchés et de réseaux qu'il leur serait impossible d'atteindre seuls.",
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
 * Objets du formulaire de contact (Textes_Site_v1)
 */
export const CONTACT_OBJECTS = [
  'Candidature à un programme',
  'Partenariat corporate',
  'Demande de mentorat',
  'Presse et médias',
  'Invitation à un événement',
  'Autre',
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

export const PARTNERS_INSTITUTIONNELS: PartnerLogo[] = [
  {
    name: 'Organisation Internationale de la Francophonie',
    logo: '/images/partenaires/oif.jpg',
    url: 'https://www.francophonie.org',
  },
  {
    name: 'Union Africaine',
    logo: '/images/partenaires/union-africaine.webp',
    url: 'https://au.int',
  },
  { name: 'CEMAC', logo: '/images/partenaires/cemac.webp' },
  { name: 'Agence de Promotion des PME', logo: '/images/partenaires/agence-promotion-pme.webp' },
];

export const PARTNERS_FINANCIERS: PartnerLogo[] = [
  {
    name: 'Banque Africaine de Développement',
    logo: '/images/partenaires/banque-africaine-developpement.webp',
    url: 'https://www.afdb.org',
  },
  {
    name: 'AfricInvest',
    logo: '/images/partenaires/africinvest.jpeg',
    url: 'https://www.africinvest.com',
  },
  {
    name: 'Partech Africa',
    logo: '/images/partenaires/partech-africa.jpeg',
    url: 'https://partechpartners.com',
  },
  {
    name: 'Janngo Capital',
    logo: '/images/partenaires/janngo-capital.jpg',
    url: 'https://janngo.capital',
  },
];

export const PARTNERS_ACADEMIQUES: PartnerLogo[] = [
  { name: 'Université de Yaoundé I', logo: '/images/partenaires/universite-yaounde-1.jpg' },
  { name: 'Université de Yaoundé II', logo: '/images/partenaires/universite-yaounde-2.gif' },
  { name: 'École Polytechnique de Yaoundé', logo: '/images/partenaires/polytechnique-yaounde.jpg' },
  { name: 'Université de Douala', logo: '/images/partenaires/universite-douala.jpg' },
];

export const PARTNERS_CORPORATIFS: PartnerLogo[] = [
  {
    name: 'Orange Digital Center',
    logo: '/images/partenaires/orange-digital-center.webp',
    url: 'https://orangedigitalcenters.com',
  },
  {
    name: 'MTN Foundation',
    logo: '/images/partenaires/mtn-foundation.jpg',
    url: 'https://www.mtn.com',
  },
  { name: 'Ecobank', logo: '/images/partenaires/ecobank.webp', url: 'https://ecobank.com' },
  { name: 'Société Générale Cameroun', logo: '/images/partenaires/societe-generale-cameroun.webp' },
  {
    name: 'TotalEnergies',
    logo: '/images/partenaires/totalenergies.jpg',
    url: 'https://totalenergies.com',
  },
];

/**
 * Logos partenaires affichés sur la homepage (bandeau "Ils nous font confiance").
 * Sélection des plus prestigieux pour maximiser la crédibilité.
 */
export const HOMEPAGE_PARTNERS: PartnerLogo[] = [
  PARTNERS_INSTITUTIONNELS[0], // OIF
  PARTNERS_INSTITUTIONNELS[1], // Union Africaine
  PARTNERS_FINANCIERS[0], // BAD
  PARTNERS_CORPORATIFS[0], // Orange Digital Center
  PARTNERS_ACADEMIQUES[0], // Univ Yaoundé I
  PARTNERS_CORPORATIFS[1], // MTN Foundation
];

/**
 * Catégories de blog (Textes_Site_v1 §11)
 */
export type ArticleCategory = 'Annonces' | 'Portraits' | 'Ressources' | 'Événements' | 'Opinions';

export const ARTICLE_CATEGORIES: ReadonlyArray<'Toutes' | ArticleCategory> = [
  'Toutes',
  'Annonces',
  'Portraits',
  'Ressources',
  'Événements',
  'Opinions',
];

export const ARTICLE_CATEGORY_COLORS: Record<ArticleCategory, string> = {
  Annonces: 'bg-cauris-orange/10 text-cauris-orange',
  Portraits: 'bg-pink-100 text-pink-700',
  Ressources: 'bg-cauris-success/10 text-cauris-success-text',
  Événements: 'bg-purple-100 text-purple-700',
  Opinions: 'bg-blue-100 text-blue-700',
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

/**
 * Articles du blog (placeholders — à remplacer via CMS)
 * Structure conforme au modèle d'article du doc Textes_Site_v1 §11 :
 *  - Introduction (50-100 mots)
 *  - Corps : 3-5 sections H2/H3 (400-800 mots)
 *  - Conclusion + CTA (50-100 mots)
 */
export const ARTICLES: ReadonlyArray<Article> = [
  {
    slug: 'amina-farmtrack-portrait',
    title: 'Amina a transformé une idée en startup qui fait 50K FCFA/mois en 6 mois',
    excerpt:
      "73% des startups africaines échouent en moins d'un an. Amina N. ne fait pas partie de ces statistiques — voici son parcours.",
    category: 'Portraits',
    date: '2026-04-15',
    author: 'Équipe CAURIS DIGITAL',
    readingTime: 6,
    image: '/images/entrepreneurs/femme-entrepreneure-portrait.jpg',
    imageCaption:
      'Entrepreneure tech, fondatrice de FarmTrack — placeholder à remplacer par la vraie photo.',
    content: [
      {
        type: 'paragraph',
        text: "73% des startups africaines échouent en moins d'un an. Amina N. ne fait pas partie de ces statistiques — et son parcours dans le programme Incubation peut inspirer toute une génération de fondateurs africains qui doutent.",
      },
      {
        type: 'h2',
        text: "D'une idée floue à un produit que les clients paient",
      },
      {
        type: 'paragraph',
        text: "En septembre 2024, Amina rejoint la promotion de notre programme Incubation avec un constat simple : les petits producteurs de cacao de la région du Centre n'ont aucun moyen de prouver l'origine de leurs récoltes aux acheteurs internationaux. Une opportunité de plusieurs millions de FCFA leur échappe chaque année.",
      },
      {
        type: 'paragraph',
        text: "Pendant les deux premiers mois, Amina passe ses semaines en immersion terrain. Elle interviewe 47 coopératives, comprend leur quotidien, identifie les vrais points de friction. C'est cette phase de validation — souvent négligée — qui fera toute la différence.",
      },
      {
        type: 'h2',
        text: 'Le pivot décisif au mois 3',
      },
      {
        type: 'paragraph',
        text: "Sa première idée — une app mobile pour les producteurs — se heurte à la réalité : 60% des producteurs n'ont pas de smartphone. Avec son mentor sectoriel, elle pivote vers un modèle hybride : SMS pour les producteurs, dashboard web pour les coopératives, certificats blockchain pour les acheteurs.",
      },
      {
        type: 'quote',
        text: "Sans le feedback brutal mais bienveillant de mon mentor, j'aurais persisté pendant 6 mois sur la mauvaise piste. C'est ça la vraie valeur d'un programme comme CAURIS DIGITAL.",
        citation: 'Amina N., fondatrice de FarmTrack',
      },
      {
        type: 'h2',
        text: 'Les premiers revenus',
      },
      {
        type: 'paragraph',
        text: "Au mois 5, Amina signe son premier contrat : 3 coopératives s'abonnent au service pour 15 000 FCFA/mois chacune. Au mois 6, le chiffre passe à 12 coopératives. Aujourd'hui, FarmTrack génère 50 000 FCFA par mois en récurrent et négocie un partenariat avec un acheteur européen.",
      },
      {
        type: 'h3',
        text: 'Les chiffres clés de FarmTrack',
      },
      {
        type: 'list',
        items: [
          '12 coopératives clientes payantes',
          '1 200 producteurs tracés sur la plateforme',
          "50 000 FCFA/mois de chiffre d'affaires récurrent",
          '1 partenariat en négociation avec un acheteur européen',
        ],
      },
      {
        type: 'h2',
        text: 'Et après ?',
      },
      {
        type: 'paragraph',
        text: "Amina vient de candidater au programme Accélération pour franchir le palier suivant : passer de 12 à 100 coopératives en 12 semaines. Une trajectoire que beaucoup pensent réservée aux startups de la Silicon Valley. À CAURIS DIGITAL, nous prouvons chaque jour que l'Afrique a ses propres champions.",
      },
    ],
  },
  {
    slug: 'candidatures-promo-2026',
    title: 'Les candidatures pour la Promotion 2026 du programme Incubation sont ouvertes',
    excerpt:
      'Du 1er mai au 30 juin 2026, déposez votre dossier pour rejoindre les 12 startups de notre prochaine cohorte.',
    category: 'Annonces',
    date: '2026-05-01',
    author: 'Équipe CAURIS DIGITAL',
    readingTime: 4,
    image: '/images/entrepreneurs/equipe-jeunes-africains-bureau.webp',
    content: [
      {
        type: 'paragraph',
        text: "C'est officiel : la prochaine session du programme Incubation de CAURIS DIGITAL ouvre ses candidatures aujourd'hui. 12 places. 6 mois d'accompagnement intensif. Une opportunité unique pour transformer votre idée en startup viable.",
      },
      {
        type: 'h2',
        text: "Ce qu'on cherche cette année",
      },
      {
        type: 'paragraph',
        text: "Pour la promo 2026, nous mettons un focus particulier sur cinq secteurs prioritaires : Agritech, Fintech, Edtech, Healthtech et Smart Cities. Les projets en phase d'idéation ou de prototypage sont les bienvenus — pas besoin d'avoir déjà un produit fini.",
      },
      {
        type: 'h2',
        text: 'Comment candidater ?',
      },
      {
        type: 'list',
        items: [
          'Remplissez le formulaire en ligne (15 minutes environ)',
          'Joignez un pitch deck ou présentation de votre projet (facultatif mais recommandé)',
          'Décrivez votre équipe et votre engagement temps plein sur 6 mois',
          'Date limite : 30 juin 2026 à 23h59 GMT+1',
        ],
      },
      {
        type: 'h2',
        text: 'Le processus de sélection',
      },
      {
        type: 'paragraph',
        text: 'Toutes les candidatures sont examinées dans les 2 semaines suivant la clôture. Les dossiers retenus sont contactés pour un entretien de 30 minutes. Les résultats finaux sont annoncés au plus tard 4 semaines après la clôture.',
      },
      {
        type: 'paragraph',
        text: "Le programme démarre le 15 septembre 2026 par une journée d'orientation à Yaoundé (et en ligne pour les participants à distance). Ne tardez pas — les meilleures candidatures sont souvent les premières arrivées.",
      },
    ],
  },
  {
    slug: 'guide-pitch-deck-startup',
    title: 'Le guide ultime du pitch deck pour startups tech africaines',
    excerpt:
      'Structure, narratif, financials, design : tout ce que vous devez savoir pour construire un pitch deck qui convainc.',
    category: 'Ressources',
    date: '2026-03-22',
    author: 'Équipe CAURIS DIGITAL',
    readingTime: 12,
    image: '/images/entrepreneurs/entrepreneur-bureau.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'Un pitch deck convaincant peut faire la différence entre une levée de fonds réussie et un projet qui reste dans les cartons. Pourtant, beaucoup de fondateurs africains commettent les mêmes erreurs : trop de texte, pas assez de chiffres, narratif confus.',
      },
      {
        type: 'h2',
        text: 'La structure recommandée',
      },
      {
        type: 'paragraph',
        text: 'Un bon pitch deck contient entre 10 et 15 slides. Pas plus. Voici la structure que nous recommandons à toutes les startups de notre programme :',
      },
      {
        type: 'list',
        items: [
          'Slide 1 — Cover : nom de la startup, baseline, logo',
          'Slide 2 — Problème : le pain point que vous résolvez',
          'Slide 3 — Solution : votre produit en 1 phrase',
          'Slide 4 — Marché : taille du marché, croissance',
          'Slide 5 — Traction : utilisateurs, revenus, croissance',
          "Slide 6 — Business model : comment vous gagnez de l'argent",
          'Slide 7 — Concurrence : qui est sur le marché, votre différenciation',
          'Slide 8 — Équipe : pourquoi vous êtes les bonnes personnes',
          'Slide 9 — Roadmap : où vous allez dans 12-24 mois',
          'Slide 10 — Ask : combien vous levez et pour quoi',
        ],
      },
      {
        type: 'h2',
        text: 'Les erreurs à éviter',
      },
      {
        type: 'paragraph',
        text: 'Trop de texte : aucun investisseur ne lit 200 mots par slide. Visez 30 mots maximum, et appuyez-vous sur des visuels forts. Chiffres flous : si vous écrivez "marché énorme", vous avez perdu. Donnez des chiffres précis avec leur source.',
      },
      {
        type: 'h2',
        text: 'Adapter au contexte africain',
      },
      {
        type: 'paragraph',
        text: 'Un investisseur basé à Paris ou New York ne connaît pas toujours les spécificités du marché africain. Anticipez les questions : pénétration mobile, taux de bancarisation, infrastructures télécom. Citez vos sources (BAD, Banque Mondiale, GSMA).',
      },
      {
        type: 'quote',
        text: 'Les meilleurs decks que je vois racontent une histoire — pas une suite de slides. Le narratif doit être limpide en 3 minutes.',
        citation: 'Investisseur partenaire de CAURIS DIGITAL',
      },
    ],
  },
  {
    slug: 'fintech-afrique-tendances-2026',
    title: 'Fintech Afrique : les 5 tendances qui vont marquer 2026',
    excerpt:
      'Mobile money, embedded finance, crypto, scoring alternatif, banque verte : analyse des modèles qui décollent.',
    category: 'Opinions',
    date: '2026-02-10',
    author: 'Équipe CAURIS DIGITAL',
    readingTime: 9,
    image: '/images/entrepreneurs/entrepreneur-portrait.jpg',
    content: [
      {
        type: 'paragraph',
        text: "La fintech africaine attire plus de capitaux que jamais. Mais derrière le buzz, certains modèles décollent vraiment, d'autres s'essoufflent. Notre analyse des cinq tendances qui marqueront 2026.",
      },
      {
        type: 'h2',
        text: '1. Embedded finance — la finance partout',
      },
      {
        type: 'paragraph',
        text: "Les services financiers s'intègrent directement dans les apps non-financières : e-commerce, mobilité, agritech. Plutôt qu'aller à la banque, le crédit vient à vous via votre app de livraison ou votre coopérative agricole. Une révolution silencieuse mais structurelle.",
      },
      {
        type: 'h2',
        text: '2. Scoring alternatif — au-delà du CV bancaire',
      },
      {
        type: 'paragraph',
        text: "Avec 60% d'adultes non-bancarisés en Afrique, les modèles classiques de scoring sont inopérants. Les nouvelles startups exploitent les données alternatives : historique mobile money, comportement social, données satellite pour l'agriculture.",
      },
      {
        type: 'h2',
        text: "3. Crypto — passé la hype, l'utilité réelle",
      },
      {
        type: 'paragraph',
        text: 'Après les excès de 2021-2022, les usages crypto utiles émergent : transferts transfrontaliers à bas coût, stablecoins comme alternative aux monnaies locales volatiles, financement participatif décentralisé. La régulation reste le principal frein.',
      },
      {
        type: 'h2',
        text: '4. Banque verte — financer la transition',
      },
      {
        type: 'paragraph',
        text: "L'Afrique sera le continent le plus impacté par le changement climatique. Les fintechs vertes financent l'agriculture résiliente, l'énergie solaire, l'efficacité énergétique. Un marché de plusieurs milliards qui ne fait que commencer.",
      },
      {
        type: 'h2',
        text: '5. Souveraineté technologique',
      },
      {
        type: 'paragraph',
        text: 'Les banques centrales africaines accélèrent sur les CBDC (monnaies numériques de banque centrale). Le e-CFA est en test au Sénégal, le e-Naira en circulation au Nigeria. Une bataille stratégique pour la souveraineté monétaire du continent.',
      },
    ],
  },
  {
    slug: 'demo-day-2025-recap',
    title: "Demo Day 2025 : les 12 startups qui ont marqué l'édition",
    excerpt:
      "Retour sur la promo 2025 du programme Incubation : 12 pitchs, 250 participants, 8 partenariats, 1,2M€ en intentions d'investissement.",
    category: 'Événements',
    date: '2025-12-05',
    author: 'Équipe CAURIS DIGITAL',
    readingTime: 7,
    image: '/images/entrepreneurs/entrepreneur-succes.png',
    content: [
      {
        type: 'paragraph',
        text: "Le Demo Day 2025 a tenu toutes ses promesses : une salle comble à l'Hôtel Hilton de Yaoundé, 250 participants, 12 startups sur scène et un total de 1,2M€ en intentions d'investissement annoncées. Récap.",
      },
      {
        type: 'h2',
        text: "Les chiffres-clés de l'édition",
      },
      {
        type: 'list',
        items: [
          '12 startups diplômées sur scène',
          '250 participants : investisseurs, corporates, médias, alumni',
          '8 partenariats signés sur place',
          "1,2M€ en intentions d'investissement annoncées",
          '32 pays représentés dans le public (en ligne et présentiel)',
        ],
      },
      {
        type: 'h2',
        text: 'Les startups qui ont fait sensation',
      },
      {
        type: 'paragraph',
        text: 'Trois startups se sont particulièrement démarquées. FarmTrack a annoncé son premier contrat avec un acheteur européen pendant le Demo Day même. PayEasy a levé 200K€ en seed round. TaxiSafe a signé un partenariat avec une grande compagnie de taxi camerounaise.',
      },
      {
        type: 'h2',
        text: 'Et maintenant ?',
      },
      {
        type: 'paragraph',
        text: "Toutes les startups de la promo 2025 entrent dans notre réseau Alumni. Elles bénéficient d'un suivi de 3 mois post-programme et d'un accès à vie à notre communauté. Plusieurs ont déjà candidaté au programme Accélération pour franchir le palier suivant.",
      },
    ],
  },
  {
    slug: 'femmes-entrepreneures-afrique',
    title: 'Femmes entrepreneures : pourquoi nous doublons leur représentation en 2026',
    excerpt:
      "L'Afrique est le continent où les femmes entreprennent le plus — mais où elles peinent le plus à lever des fonds. Notre engagement.",
    category: 'Annonces',
    date: '2026-03-08',
    author: 'Équipe CAURIS DIGITAL',
    readingTime: 5,
    image: '/images/entrepreneurs/femme-dirigeante-bras-croises.avif',
    content: [
      {
        type: 'paragraph',
        text: "À l'occasion de la Journée internationale des droits des femmes, nous prenons un engagement public : doubler la représentation féminine dans nos promotions d'ici 2027. Voici pourquoi et comment.",
      },
      {
        type: 'h2',
        text: 'Un paradoxe africain',
      },
      {
        type: 'paragraph',
        text: "L'Afrique subsaharienne est la région du monde où le taux de femmes entrepreneures est le plus élevé (26% selon le GEM). Pourtant, c'est aussi la région où elles reçoivent le moins de financements : moins de 5% des fonds levés en capital-risque vont à des startups dirigées par des femmes.",
      },
      {
        type: 'h2',
        text: 'Nos engagements concrets',
      },
      {
        type: 'list',
        items: [
          'Atteindre 50% de femmes fondatrices dans la promo 2027',
          'Lancer un programme de mentorat dédié aux femmes entrepreneures',
          "Créer un réseau d'alumnae actives dans la mise en relation",
          "Sensibiliser nos partenaires investisseurs à l'investissement responsable",
          'Publier nos chiffres de diversité chaque trimestre en toute transparence',
        ],
      },
      {
        type: 'quote',
        text: "L'innovation africaine ne peut être complète qu'en s'appuyant sur tous ses talents. Exclure les femmes, c'est exclure la moitié du potentiel.",
        citation: 'Direction CAURIS DIGITAL',
      },
      {
        type: 'h2',
        text: 'Comment vous pouvez agir',
      },
      {
        type: 'paragraph',
        text: 'Vous êtes femme entrepreneure et avez un projet tech ? Candidatez à notre programme Incubation. Vous êtes mentor ou investisseur ? Rejoignez notre réseau et engagez-vous à parrainer au moins une femme fondatrice. Vous êtes une entreprise partenaire ? Demandez-nous nos critères de diversité dans nos sélections.',
      },
    ],
  },
];

/**
 * Helper : récupère un article par son slug.
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/**
 * Helper : récupère des articles liés (même catégorie, hors article courant).
 */
export function getRelatedArticles(currentSlug: string, limit = 3): Article[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return [];
  return ARTICLES.filter((a) => a.slug !== currentSlug && a.category === current.category).slice(
    0,
    limit
  );
}

/**
 * Helper : récupère une startup par son slug.
 */
export function getStartupBySlug(slug: string): Startup | undefined {
  return FEATURED_STARTUPS.find((s) => s.slug === slug);
}

/**
 * Helper : récupère des startups liées (même secteur ou même pays, hors startup courante).
 */
export function getRelatedStartups(currentSlug: string, limit = 3): Startup[] {
  const current = getStartupBySlug(currentSlug);
  if (!current) return [];
  // Priorité : même secteur, puis même pays, puis le reste
  const sameSector = FEATURED_STARTUPS.filter(
    (s) => s.slug !== currentSlug && s.sector === current.sector
  );
  const sameCountry = FEATURED_STARTUPS.filter(
    (s) =>
      s.slug !== currentSlug && s.countryName === current.countryName && s.sector !== current.sector
  );
  const others = FEATURED_STARTUPS.filter(
    (s) =>
      s.slug !== currentSlug && s.sector !== current.sector && s.countryName !== current.countryName
  );
  return [...sameSector, ...sameCountry, ...others].slice(0, limit);
}
