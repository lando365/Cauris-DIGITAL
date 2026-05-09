/**
 * Constantes globales du site CAURIS DIGITAL
 * Conformes au cahier des charges v1.0 - Avril 2026
 */

export const SITE_CONFIG = {
  name: 'CAURIS DIGITAL',
  tagline: 'Incubateur numérique d\'excellence',
  shortTagline: 'Propulser l\'innovation numérique africaine — depuis Yaoundé, pour le monde.',
  description:
    'CAURIS DIGITAL stimule l\'entrepreneuriat tech et forme les entrepreneurs numériques de demain. Basé à Yaoundé, actif partout dans le monde.',
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
      { label: 'Conseil d\'administration', href: '/a-propos#ca' },
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
      { label: 'Lab d\'innovation', href: '/innovation-corporative#lab' },
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
  { value: 5, suffix: '+', label: 'Années d\'accompagnement' },
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
      'Les technologies au service de l\'agriculture africaine, de la chaîne alimentaire et de la transition climatique. Parce que nourrir l\'Afrique est le défi du siècle.',
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
      'Les plateformes et outils qui révolutionnent l\'accès à l\'éducation en Afrique. De l\'école primaire à la formation professionnelle, en passant par les métiers du numérique.',
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
      'Un programme d\'accompagnement intensif conçu pour transformer votre idée en produit viable, en vous donnant accès à notre réseau de mentors, nos outils et notre communauté.',
    href: '/programme-incubation',
    cta: 'En savoir plus',
    benefits: [
      'Mentorat individuel hebdomadaire avec un expert de votre secteur',
      'Accès à l\'espace de travail collaboratif à Yaoundé',
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
    format: '100% en ligne — accessible depuis n\'importe où dans le monde',
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
      'CAURIS DIGITAL n\'est pas juste un incubateur. C\'est une famille. En six mois, j\'ai transformé une idée floue en produit que des clients paient vraiment. Le mentorat en ligne m\'a permis de continuer depuis Douala sans quitter mon travail.',
  },
  {
    name: 'Jean-Paul M.',
    startup: 'PayEasy',
    location: 'Cameroun',
    quote:
      'Ce qui m\'a le plus frappé, c\'est la qualité des mentors. Des professionnels qui ont vraiment construit des entreprises. Pas juste des théoriciens. Grâce à leur réseau, j\'ai obtenu mon premier client corporate en semaine 8 du programme.',
  },
  {
    name: 'Rodrigue K.',
    startup: 'MédikAfrique',
    location: 'Congo-Brazzaville',
    quote:
      'Je suis basé à Brazzaville. Rejoindre CAURIS DIGITAL en ligne semblait risqué. En réalité, le programme était encore plus structuré que ce que j\'espérais. Aujourd\'hui mon app a 12 000 utilisateurs actifs.',
  },
];

/**
 * Logos partenaires (CDC §2.1)
 */
export const PARTNERS = [
  { name: 'Union Africaine', logo: '/partners/au.svg' },
  { name: 'Banque Africaine de Développement', logo: '/partners/bad.svg' },
  { name: 'CEMAC', logo: '/partners/cemac.svg' },
  { name: 'Université de Yaoundé I', logo: '/partners/uy1.svg' },
  { name: 'Polytechnique Yaoundé', logo: '/partners/polytech.svg' },
  { name: 'Orange Digital Center', logo: '/partners/orange.svg' },
];

/**
 * Startups vedettes (placeholder — à remplacer via CMS)
 */
export const FEATURED_STARTUPS = [
  { name: 'FarmTrack', sector: 'Agritech', country: '🇨🇲', countryName: 'Cameroun', status: 'Diplômée' as const, year: 2024, tagline: 'Traçabilité agricole pour petits producteurs.', description: 'Plateforme de traçabilité de la chaîne agricole pour les coopératives camerounaises. Permet aux petits producteurs de prouver l\'origine et la qualité de leurs récoltes.' },
  { name: 'PayEasy', sector: 'Fintech', country: '🇨🇲', countryName: 'Cameroun', status: 'En incubation' as const, year: 2025, tagline: 'Paiement digital pour PME africaines.', description: 'Solution de paiement multi-moyens (Mobile Money, carte, virement) pour les PME camerounaises et CEMAC.' },
  { name: 'MédikAfrique', sector: 'Healthtech', country: '🇨🇬', countryName: 'Congo-Brazzaville', status: 'Alumni' as const, year: 2023, tagline: 'Téléconsultation médicale accessible.', description: 'App de téléconsultation médicale connectant 12 000 utilisateurs actifs aux médecins certifiés en Afrique centrale.' },
  { name: 'EduConnect', sector: 'Edtech', country: '🇸🇳', countryName: 'Sénégal', status: 'Diplômée' as const, year: 2024, tagline: 'Plateforme d\'apprentissage mobile-first.', description: 'LMS mobile-first pour les écoles primaires et secondaires. Optimisé pour les zones à faible connectivité.' },
  { name: 'AgriPredict', sector: 'Agritech', country: '🇧🇫', countryName: 'Burkina Faso', status: 'En incubation' as const, year: 2025, tagline: 'IA prédictive pour l\'agriculture.', description: 'Modèles d\'IA prédictive pour anticiper les rendements agricoles et optimiser les semis selon les conditions climatiques.' },
  { name: 'CryptoSahel', sector: 'Fintech', country: '🇲🇱', countryName: 'Mali', status: 'Diplômée' as const, year: 2023, tagline: 'Microfinance via blockchain.', description: 'Plateforme de microfinance basée sur la blockchain, opérationnelle au Mali et en cours d\'expansion en Afrique de l\'Ouest.' },
  { name: 'GreenWatt', sector: 'Smart Cities', country: '🇨🇮', countryName: 'Côte d\'Ivoire', status: 'En incubation' as const, year: 2025, tagline: 'Énergie solaire connectée pour les ménages.', description: 'Kits solaires intelligents avec paiement à l\'usage pour les ménages non raccordés au réseau électrique.' },
  { name: 'TaxiSafe', sector: 'Smart Cities', country: '🇨🇲', countryName: 'Cameroun', status: 'Alumni' as const, year: 2022, tagline: 'Mobilité urbaine sécurisée.', description: 'Service de transport urbain avec géolocalisation, paiement digital et notation des chauffeurs. Présent à Yaoundé et Douala.' },
  { name: 'LingaLearn', sector: 'Edtech', country: '🇨🇩', countryName: 'RDC', status: 'En incubation' as const, year: 2025, tagline: 'Apprendre les langues africaines en ligne.', description: 'Plateforme d\'apprentissage des langues africaines (Lingala, Swahili, Wolof, Bambara) avec leçons audio et professeurs natifs.' },
];

/**
 * Valeurs fondatrices (Textes_Site_v1 — 6 valeurs)
 */
export const VALUES = [
  {
    id: 'excellence',
    title: 'Excellence',
    description:
      'Nous imposons des standards professionnels internationaux à tous nos programmes. Pas de demi-mesure : si vous êtes chez CAURIS DIGITAL, c\'est pour construire quelque chose de grand.',
    icon: 'Trophy',
  },
  {
    id: 'inclusion',
    title: 'Inclusion',
    description:
      'Nous croyons que le talent n\'a pas de genre, d\'origine sociale ou de région. Notre programme est ouvert à tous les profils — avec une attention particulière pour les femmes entrepreneures et les porteurs de projets de zones rurales.',
    icon: 'Users',
  },
  {
    id: 'impact',
    title: 'Impact',
    description:
      'Chaque startup que nous accompagnons doit avoir un impact mesurable : sur ses utilisateurs, sur sa communauté, sur son marché. L\'impact n\'est pas une option — c\'est un critère de sélection.',
    icon: 'Target',
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    description:
      'Nous construisons ensemble. Entrepreneurs, mentors, partenaires et alumni forment une communauté active où le partage de ressources, d\'expériences et de contacts est la norme.',
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
      'Ces partenaires nous apportent leur soutien institutionnel, leur légitimité et leur réseau pour renforcer l\'impact de nos programmes sur les politiques publiques numériques en Afrique.',
  },
  {
    id: 'financiers',
    title: 'Partenaires financiers',
    description:
      'Nos partenaires financiers apportent aux startups de CAURIS DIGITAL un accès privilégié au financement — des premières bourses d\'amorçage aux tours de table en série A.',
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
      'Nos partenaires corporatifs co-innovent avec nos startups, les accompagnent et leur ouvrent les portes de marchés et de réseaux qu\'il leur serait impossible d\'atteindre seuls.',
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
        q: 'Qu\'est-ce que CAURIS DIGITAL ?',
        a: 'CAURIS DIGITAL est un incubateur numérique basé à Yaoundé, Cameroun. Nous accompagnons les startups technologiques africaines de la phase d\'idée jusqu\'à la commercialisation de leur produit. Nous offrons deux programmes principaux : le programme Incubation (6 mois) et le programme Accélération (12 semaines). Notre mentorat est accessible en ligne depuis n\'importe où dans le monde.',
      },
      {
        q: 'Pourquoi le nom « Cauris Digital » ?',
        a: 'Le cauris est une coquillage qui a servi de monnaie d\'échange à travers toute l\'Afrique pendant des siècles. Il symbolise la valeur, la connexion et l\'échange. Ce nom représente notre mission : créer de la valeur, connecter les entrepreneurs et faciliter les échanges entre les talents africains et les marchés mondiaux.',
      },
      {
        q: 'CAURIS DIGITAL est-il lié à une université ou une institution publique ?',
        a: 'CAURIS DIGITAL est une association indépendante. Nous travaillons en partenariat avec des universités, des institutions publiques et des acteurs privés, mais nous sommes organisationnellement autonomes. Cette indépendance nous permet d\'agir rapidement et de nous adapter aux besoins de nos entrepreneurs.',
      },
    ],
  },
  {
    theme: 'Candidatures et sélection',
    items: [
      {
        q: 'Qui peut candidater aux programmes de CAURIS DIGITAL ?',
        a: 'Tout porteur de projet tech avec une idée viable peut candidater. Vous n\'avez pas besoin d\'être camerounais ou basé à Yaoundé — nos programmes sont ouverts à tous les entrepreneurs francophones ou anglophones d\'Afrique et de la diaspora. Il n\'y a pas d\'âge minimum ou maximum, pas de formation préalable requise.',
      },
      {
        q: 'Est-ce que je dois être à Yaoundé pour participer ?',
        a: 'Non. Nos programmes sont accessibles en ligne depuis n\'importe où dans le monde. Si vous êtes à Dakar, Abidjan, Kinshasa, Paris ou Montréal, vous pouvez bénéficier du même niveau d\'accompagnement que quelqu\'un qui est physiquement présent à Yaoundé. Les participants locaux ont en plus accès à notre espace de coworking.',
      },
      {
        q: 'Mon projet doit-il être dans le numérique pour être éligible ?',
        a: 'Oui. Nous nous spécialisons dans les startups technologiques. Cela inclut les applications mobiles, les plateformes web, les solutions SaaS, les technologies IoT, l\'intelligence artificielle, la blockchain et les hardwares tech. Un projet purement traditionnel sans composante technologique ne serait pas sélectionné.',
      },
      {
        q: 'Quelle est la durée du processus de sélection ?',
        a: 'Après la clôture des candidatures, notre équipe examine tous les dossiers dans un délai de 2 semaines. Les candidats présélectionnés sont contactés pour un entretien de 30 minutes en visioconférence. Les résultats définitifs sont annoncés dans les 4 semaines suivant la clôture.',
      },
      {
        q: 'Est-il possible de candidater à plusieurs sessions ?',
        a: 'Oui, absolument. Si votre candidature n\'est pas retenue lors d\'une session, vous pouvez vous améliorer et candidater à nouveau lors de la session suivante. Certains de nos meilleurs entrepreneurs ont candidaté deux fois avant d\'être sélectionnés.',
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
        a: 'Non. CAURIS DIGITAL ne prend aucune participation au capital des startups qu\'il accompagne. Notre modèle est fondé sur l\'impact, pas sur le retour financier direct. Certains partenaires de notre réseau peuvent proposer des investissements en échange d\'equity — mais cela est toujours à votre initiative et votre discrétion.',
      },
      {
        q: 'Proposez-vous des financements directs aux startups ?',
        a: 'Nous ne finançons pas directement les startups. En revanche, nous les connectons activement à notre réseau d\'investisseurs — business angels, fonds d\'amorçage africains et internationaux, programmes de subventions institutionnels. L\'accès à ce réseau est l\'un des avantages les plus cités par nos alumni.',
      },
    ],
  },
  {
    theme: 'Mentorat et accompagnement',
    items: [
      {
        q: 'Comment fonctionne le mentorat en ligne ?',
        a: 'Les sessions de mentorat se tiennent via visioconférence (Google Meet, Zoom ou Microsoft Teams). Chaque entrepreneur bénéficie d\'une session individuelle hebdomadaire d\'une heure avec son mentor attitré, plus l\'accès aux sessions collectives en ligne. Notre plateforme de suivi permet de planifier les sessions, partager des documents et suivre les objectifs entre les sessions.',
      },
      {
        q: 'Comment sont choisis les mentors ?',
        a: 'Nos mentors sont des professionnels sélectionnés pour leur expertise sectorielle et leur expérience entrepreneuriale. Ils ont eux-mêmes fondé ou dirigé des entreprises, levé des fonds ou accompagné des startups. Nous travaillons avec des mentors basés au Cameroun, en Afrique de l\'Ouest, en Europe et en Amérique du Nord. Chaque entrepreneur est mis en relation avec un ou plusieurs mentors pertinents pour son secteur et son stade de développement.',
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
        a: 'Oui. Nous acceptons des partenariats événementiels ponctuels pour nos Demo Days, notre Journée de l\'Innovation Ouverte et nos ateliers thématiques. Contactez-nous pour recevoir notre brochure sponsoring.',
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
