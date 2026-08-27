import { PrismaClient } from '@prisma/client';
import {
  FEATURED_STARTUPS,
  ARTICLES,
  PARTNERS_INSTITUTIONNELS,
  PARTNERS_FINANCIERS,
  PARTNERS_ACADEMIQUES,
  PARTNERS_CORPORATIFS,
  type Startup,
  type Article,
  type ArticleSection,
  type PartnerLogo,
} from '../src/lib/constants';

const prisma = new PrismaClient();

// --- Conversions inverses (affichage V1 -> enums Prisma) --------------------

const SECTOR_MAP: Record<string, string> = {
  Agritech: 'AGRITECH',
  Fintech: 'FINTECH',
  Edtech: 'EDTECH',
  Healthtech: 'HEALTHTECH',
  'Smart Cities': 'SMART_CITIES',
};

const STATUS_MAP: Record<string, string> = {
  'En incubation': 'EN_INCUBATION',
  Diplômée: 'DIPLOMEE',
  Alumni: 'ALUMNI',
};

const CATEGORY_MAP: Record<string, string> = {
  Annonces: 'ANNONCES',
  Portraits: 'PORTRAITS',
  Ressources: 'RESSOURCES',
  Événements: 'EVENEMENTS',
  Opinions: 'OPINIONS',
};

// Flag emoji -> code ISO (les 7 pays présents dans FEATURED_STARTUPS)
const FLAG_TO_CODE: Record<string, string> = {
  '🇨🇲': 'CM',
  '🇸🇳': 'SN',
  '🇨🇬': 'CG',
  '🇧🇫': 'BF',
  '🇲🇱': 'ML',
  '🇨🇮': 'CI',
  '🇨🇩': 'CD',
};

function sectionsToMarkdown(sections: ArticleSection[]): string {
  return sections
    .map((s) => {
      if (s.type === 'h2') return `## ${s.text}`;
      if (s.type === 'h3') return `### ${s.text}`;
      if (s.type === 'quote') return `> ${s.text}${s.citation ? `\n> — ${s.citation}` : ''}`;
      if (s.type === 'list' && s.items) return s.items.map((i) => `- ${i}`).join('\n');
      return s.text ?? '';
    })
    .join('\n\n');
}

async function seedStartups(adminId: string) {
  for (const s of FEATURED_STARTUPS as Startup[]) {
    await prisma.startup.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        name: s.name,
        tagline: s.tagline,
        description: s.description,
        longDescription: s.longDescription,
        sector: SECTOR_MAP[s.sector] as never,
        countryName: s.countryName,
        countryCode: FLAG_TO_CODE[s.country] ?? 'CM',
        city: s.city,
        status: STATUS_MAP[s.status] as never,
        year: s.year,
        foundedYear: s.foundedYear,
        technologies: s.technologies ?? [],
        founders: s.founders ?? [],
        metrics: s.metrics ? JSON.parse(JSON.stringify(s.metrics)) : undefined,
        achievements: s.achievements ?? [],
        websiteUrl: s.website,
        linkedinUrl: s.linkedin,
        isFeatured: FEATURED_STARTUPS.indexOf(s) < 6,
        createdBy: adminId,
      },
    });
  }
  console.log(`Startups : ${FEATURED_STARTUPS.length} seedées.`);
}

async function seedArticles(adminId: string) {
  for (const a of ARTICLES as readonly Article[]) {
    const content = sectionsToMarkdown(a.content);
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content,
        category: CATEGORY_MAP[a.category] as never,
        coverImageUrl: a.image,
        readingTime: a.readingTime,
        status: 'PUBLISHED',
        publishedAt: new Date(`${a.date}T09:00:00.000Z`),
        authorId: adminId,
      },
    });
  }
  console.log(`Articles : ${ARTICLES.length} seedés.`);
}

async function seedPartners(adminId: string) {
  const groups: Array<[PartnerLogo[], string]> = [
    [PARTNERS_INSTITUTIONNELS, 'INSTITUTIONNEL'],
    [PARTNERS_FINANCIERS, 'FINANCIER'],
    [PARTNERS_ACADEMIQUES, 'ACADEMIQUE'],
    [PARTNERS_CORPORATIFS, 'CORPORATIF'],
  ];
  let count = 0;
  for (const [list, category] of groups) {
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      const existing = await prisma.partner.findFirst({ where: { name: p.name } });
      if (existing) continue;
      await prisma.partner.create({
        data: {
          name: p.name,
          logoUrl: p.logo,
          websiteUrl: p.url,
          category: category as never,
          displayOrder: i,
          isFeatured: i === 0, // le premier de chaque catégorie alimente la bande homepage
          createdBy: adminId,
        },
      });
      count++;
    }
  }
  console.log(`Partenaires : ${count} seedés.`);
}

interface SeedEvent {
  slug: string;
  title: string;
  type: string;
  startDate: string;
  location: string;
  isOnline: boolean;
  description: string;
  isFree: boolean;
  price?: string;
}

const EVENTS: SeedEvent[] = [
  {
    slug: 'demo-day-promo-2026',
    title: 'Demo Day — Promotion 2026 du programme Incubation',
    type: 'DEMO_DAY',
    startDate: '2026-09-15T15:00:00.000Z',
    location: 'Hôtel Hilton, Yaoundé',
    isOnline: false,
    description:
      "Découvrez les 12 startups de la promotion 2026. Pitchs en direct devant un jury d'investisseurs africains et internationaux. Networking et cocktail de clôture.",
    isFree: true,
  },
  {
    slug: 'atelier-pitch-investisseurs',
    title: 'Atelier : Préparer son pitch investisseurs',
    type: 'ATELIER',
    startDate: '2026-06-20T10:00:00.000Z',
    location: 'En ligne (Zoom)',
    isOnline: true,
    description:
      'Atelier de 3 heures animé par notre directrice des programmes : structure du pitch, narratif, financials et préparation aux objections. Limité à 30 participants.',
    isFree: true,
  },
  {
    slug: 'webinaire-fintech-afrique',
    title: 'Webinaire : Fintech Afrique — Tendances 2026',
    type: 'WEBINAIRE',
    startDate: '2026-07-12T17:00:00.000Z',
    location: 'En ligne',
    isOnline: true,
    description:
      "Table ronde avec des fondateurs et investisseurs leaders de la fintech africaine. Quels sont les modèles qui décollent ? Où va l'argent ? Q&A en fin de session.",
    isFree: true,
  },
  {
    slug: 'journee-innovation-2026',
    title: "Journée de l'Innovation Ouverte 2026",
    type: 'CONFERENCE',
    startDate: '2026-11-08T09:00:00.000Z',
    location: 'Centre de Conférences, Yaoundé',
    isOnline: false,
    description:
      'Notre événement annuel : startups, corporates, investisseurs et institutions réunis autour des enjeux tech africains. Pitchs, tables rondes, networking et annonces partenaires.',
    isFree: false,
    price: '15 000 FCFA (gratuit pour startups CAURIS)',
  },
  {
    slug: 'hackathon-agritech-2025',
    title: "Hackathon Agritech : nourrir l'Afrique de demain",
    type: 'HACKATHON',
    startDate: '2025-11-20T09:00:00.000Z',
    location: 'Université de Yaoundé I',
    isOnline: false,
    description:
      '48 heures pour imaginer les solutions agricoles de demain. 80 participants, 12 équipes finalistes, 3 prix décernés. Édition 2025 sponsorisée par Orange Digital Center.',
    isFree: true,
  },
  {
    slug: 'demo-day-promo-2025',
    title: 'Demo Day — Promotion 2025 du programme Incubation',
    type: 'DEMO_DAY',
    startDate: '2025-09-12T15:00:00.000Z',
    location: 'Hôtel Hilton, Yaoundé',
    isOnline: false,
    description:
      "Présentation publique des startups diplômées de la promotion 2025. Édition record : 250 participants, 8 partenariats annoncés, 1,2M€ en intentions d'investissement.",
    isFree: true,
  },
];

async function seedEvents(adminId: string) {
  for (const e of EVENTS) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug,
        title: e.title,
        description: e.description,
        type: e.type as never,
        startDate: new Date(e.startDate),
        location: e.location,
        isOnline: e.isOnline,
        isFree: e.isFree,
        price: e.price,
        isPublished: true,
        createdBy: adminId,
      },
    });
  }
  console.log(`Événements : ${EVENTS.length} seedés.`);
}

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin)
    throw new Error('Aucun compte ADMIN en base — lancer npm run db:seed avant celui-ci.');

  await seedStartups(admin.id);
  await seedArticles(admin.id);
  await seedPartners(admin.id);
  await seedEvents(admin.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
