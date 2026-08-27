# CAURIS DIGITAL — Site web + back-office

Site web institutionnel et back-office d'administration de **CAURIS DIGITAL**, incubateur numérique d'excellence dédié à l'accompagnement des startups technologiques en Afrique francophone.

Application full-stack : site public multilingue (FR/EN) et dashboard d'administration (gestion des startups, articles, événements, partenaires, messages, newsletter, utilisateurs), avec base de données PostgreSQL et authentification.

## Stack technique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Langage** : TypeScript (`strict: true`)
- **Base de données** : PostgreSQL via [Supabase](https://supabase.com/), ORM [Prisma](https://www.prisma.io/)
- **Authentification** : [NextAuth.js v5](https://authjs.dev/) (Credentials Provider, sessions révocables en base)
- **Validation** : [Zod](https://zod.dev/)
- **Stockage de fichiers** : [Vercel Blob](https://vercel.com/docs/vercel-blob) (logos, images de couverture)
- **Emails transactionnels** : [Resend](https://resend.com/)
- **Internationalisation** : [next-intl](https://next-intl.dev/) (routing `/fr/…` et `/en/…`)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Tests** : [Vitest](https://vitest.dev/) (unitaires/intégration) + [Playwright](https://playwright.dev/) (E2E) + [k6](https://k6.io/) (charge)
- **Déploiement** : [Vercel](https://vercel.com/)

## Structure du projet

```
cauris-digital/
├── src/
│   ├── app/
│   │   ├── [locale]/            # Pages publiques (FR/EN) — accueil, startups, articles…
│   │   ├── admin/
│   │   │   ├── login/           # Connexion admin
│   │   │   └── (protected)/     # Dashboard : startups, articles, événements,
│   │   │                        # partenaires, messages, newsletter, utilisateurs
│   │   └── api/
│   │       ├── admin/           # Export CSV, upload de fichiers
│   │       ├── auth/            # NextAuth.js
│   │       ├── articles|events|partners|startups/   # API publique (lecture)
│   │       ├── contact/         # Formulaire de contact
│   │       └── newsletter/      # Inscription, confirmation, désinscription
│   ├── components/
│   │   ├── admin/               # Composants du dashboard (upload de fichiers…)
│   │   ├── layout/, sections/, forms/, ui/   # Site public
│   ├── i18n/                    # Config next-intl (routing, navigation)
│   ├── lib/                     # Prisma client, validations Zod, auth, audit log…
│   └── auth.ts / auth.config.ts # Configuration NextAuth.js
├── prisma/
│   ├── schema.prisma            # Schéma de la base de données
│   ├── migrations/              # Historique des migrations
│   ├── seed.ts                  # Création du premier compte ADMIN
│   └── seed-content.ts          # Données de démonstration (startups, articles…)
├── e2e/                         # Tests Playwright
├── k6/                          # Scripts de test de charge
├── .github/workflows/           # CI : sauvegarde hebdomadaire de la base
└── public/                      # Assets statiques
```

## Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Variables d'environnement

```bash
cp .env.example .env.local
```

Éditer `.env.local` en suivant les commentaires du fichier — base de données Supabase,
authentification NextAuth, emails Resend, reCAPTCHA, Vercel Blob. Chaque section
explique où récupérer la valeur.

### 3. Base de données

```bash
npm run db:migrate   # applique le schéma Prisma
npm run db:seed      # crée le premier compte ADMIN (SEED_ADMIN_EMAIL/PASSWORD)
```

### 4. Lancement en développement

```bash
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000), le back-office sur `/admin/login`.

### 5. Build de production

```bash
npm run build
npm run start
```

## Scripts disponibles

| Commande                          | Description                                                  |
| --------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                     | Serveur de développement                                     |
| `npm run build` / `npm run start` | Build + serveur de production                                |
| `npm run lint`                    | ESLint                                                       |
| `npm run type-check`              | Vérification TypeScript sans build                           |
| `npm run db:migrate`              | Applique les migrations Prisma                               |
| `npm run db:seed`                 | Crée le premier compte ADMIN                                 |
| `npm run test`                    | Tests unitaires et d'intégration (Vitest)                    |
| `npm run test:watch`              | Vitest en mode watch                                         |
| `npm run test:coverage`           | Vitest avec rapport de couverture                            |
| `npm run test:e2e`                | Tests end-to-end (Playwright, contre un build de production) |

Les tests de charge (`k6/`) s'exécutent avec le binaire [k6](https://k6.io/) — voir `k6/README.md`.

## Espace admin

- Connexion : `/admin/login`
- Deux rôles : **ADMIN** (accès complet, y compris suppression et gestion des utilisateurs) et **EDITOR** (création/modification de contenu, sans suppression).
- Modules : Startups, Articles, Événements, Partenaires, Messages, Newsletter, Utilisateurs (ADMIN uniquement).

## Sauvegardes automatisées

Un export SQL hebdomadaire de la base est poussé vers un dépôt GitHub privé séparé
via GitHub Actions (`.github/workflows/backup.yml`) — voir `.github/workflows/README.md`
pour la mise en place et la procédure de restauration.

## Conformité aux cahiers des charges

Le projet répond au **CDC Site Web v1.0** (design, pages publiques, SEO, accessibilité)
et au **CDC Backend & Base de Données v2.0** (architecture, base de données, authentification,
back-office). Les deux documents sont conservés à la racine du dépôt.

## Déploiement sur Vercel

```bash
npm i -g vercel
vercel
```

Ou via l'interface : connecter le repo GitHub à un projet Vercel. Penser à configurer
toutes les variables d'environnement de `.env.example` dans les paramètres du projet
(Production, et Preview si les previews doivent fonctionner).

## Licence

© 2026 CAURIS DIGITAL — Tous droits réservés.
