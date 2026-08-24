# Guide de démarrage — CAURIS DIGITAL

Bienvenue ! Ce guide vous explique comment **lancer le site en local**, **publier le code sur GitHub**, et **déployer en production sur Vercel**.

---

## Étape 1 — Lancer le site en local (5 minutes)

### Prérequis

- **Node.js 18.17+ ou 20+** (recommandé : 22) — [téléchargement](https://nodejs.org/)
- **Git** — [téléchargement](https://git-scm.com/downloads)

### Commandes

Ouvrez un terminal (PowerShell, CMD ou Git Bash) **dans le dossier `cauris-digital`** :

```bash
# 1. Installer les dépendances (~ 30 secondes)
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Le site est accessible sur **http://localhost:3000** dans votre navigateur.

> Modifiez n'importe quel fichier `.tsx` et la page se recharge automatiquement (hot reload).

---

## Étape 2 — Publier sur GitHub

### 2.1 Créer un nouveau repo

1. Connectez-vous sur [github.com](https://github.com) avec votre compte (Sandranaijoh99).
2. Cliquez sur **New repository** (ou allez sur https://github.com/new).
3. Remplissez :
   - **Repository name** : `cauris-digital`
   - **Description** : `Site web institutionnel CAURIS DIGITAL — Incubateur numérique d'excellence`
   - **Public** ou **Private** : votre choix (Public recommandé pour TFE).
   - **NE COCHEZ PAS** "Initialize with README", `.gitignore`, ou licence (le projet a déjà tout ça).
4. Cliquez sur **Create repository**.

GitHub vous affiche une page avec des commandes. Notez l'URL du repo, qui ressemble à :

```
https://github.com/Sandranaijoh99/cauris-digital.git
```

### 2.2 Initialiser et pousser le code

Dans le terminal, **dans le dossier `cauris-digital`** :

```bash
# Configuration Git (à faire une fois)
git config --global user.name "Sandra"
git config --global user.email "Sandranaijoh99@gmail.com"

# Initialiser le repo local
git init -b main

# Premier commit
git add .
git commit -m "feat: initial commit — MVP CAURIS DIGITAL (Accueil + 3 pages)

- Setup Next.js 14 + TypeScript + Tailwind CSS
- Charte graphique CAURIS (orange #E8640A, polices Inter/Montserrat)
- Header sticky avec smart navbar + Footer 4 colonnes
- Page Accueil : Hero, partenaires, présentation, chiffres clés animés,
  programmes, secteurs, startups vedettes, témoignages, CTA final
- Page À propos : équipe, valeurs, conseil d'administration
- Page Programme Incubation : ressources, calendrier, éligibilité
- Page Contact : formulaire validé + honeypot anti-spam, coordonnées, carte
- API routes : /api/contact, /api/newsletter
- SEO : sitemap.xml, robots.txt, Open Graph
- Accessibilité WCAG 2.1 AA : skip link, focus visible, ARIA"

# Lier au repo distant (REMPLACEZ l'URL par celle de votre repo)
git remote add origin https://github.com/Sandranaijoh99/cauris-digital.git

# Pousser
git push -u origin main
```

**Si Git vous demande votre mot de passe** : il faut un **token d'accès personnel**, pas votre mot de passe GitHub.

1. https://github.com/settings/tokens → **Generate new token (classic)**
2. Cochez `repo` (full control of private repositories)
3. Copiez le token et collez-le quand Git le demande comme mot de passe.

### 2.3 Vérifier

Rafraîchissez votre page GitHub : tous les fichiers doivent apparaître dans le repo.

---

## Étape 3 — Workflow de développement progressif

À partir de maintenant, on travaille **par lots de fonctionnalités**. À chaque ajout :

```bash
# Voir les changements
git status

# Ajouter les fichiers modifiés
git add .

# Commit avec un message clair (convention)
git commit -m "feat: ajout page Startups avec filtres"
# ou
git commit -m "fix: correction responsive du header mobile"
# ou
git commit -m "docs: mise à jour README"

# Pousser sur GitHub
git push
```

### Convention de commits (Conventional Commits)

| Préfixe     | Usage                               |
| ----------- | ----------------------------------- |
| `feat:`     | Nouvelle fonctionnalité             |
| `fix:`      | Correction de bug                   |
| `docs:`     | Documentation                       |
| `style:`    | Mise en forme (CSS, espaces…)       |
| `refactor:` | Refacto sans changement fonctionnel |
| `perf:`     | Optimisation performance            |
| `test:`     | Ajout/modif de tests                |
| `chore:`    | Maintenance, dépendances            |

---

## Étape 4 — Déploiement en production sur Vercel (gratuit)

Une fois le code sur GitHub, **2 minutes pour mettre en ligne** :

1. Allez sur [vercel.com](https://vercel.com) → **Sign up with GitHub**.
2. Cliquez sur **Add New… → Project**.
3. Sélectionnez le repo `cauris-digital`.
4. Vercel détecte automatiquement Next.js. Cliquez sur **Deploy**.
5. Au bout de 60 secondes, vous obtenez une URL publique du type :
   ```
   https://cauris-digital.vercel.app
   ```

À chaque `git push`, Vercel redéploie automatiquement.

### Brancher un domaine personnalisé

Quand vous achèterez `caurisdigital.org` (Namecheap, OVH, Infomaniak…) :

1. Vercel → projet → **Settings → Domains**
2. Ajoutez `caurisdigital.org`
3. Vercel vous donne les DNS à configurer chez votre registrar.
4. SSL/HTTPS automatique avec Let's Encrypt.

---

## Étape 5 — Suite du développement

### V1.5 — Pages restantes

- `/startups` — Portefeuille avec filtres
- `/programme-acceleration`
- `/innovation-corporative`
- `/evenements`, `/actualites`, `/partenaires`, `/faq`

### V2 — CMS Sanity

Pour permettre à l'équipe CAURIS d'ajouter des articles, startups et événements **sans toucher au code** :

1. Créez un compte sur [sanity.io](https://www.sanity.io) (gratuit jusqu'à 3 utilisateurs).
2. Renseignez `NEXT_PUBLIC_SANITY_PROJECT_ID` dans `.env.local`.
3. On installera `next-sanity` et on définira les schémas dans `src/sanity/schemas/`.

### V2 — Email réel pour le formulaire contact

Choisir un service :

- **Resend** (recommandé, 100 emails/jour gratuit) — [resend.com](https://resend.com)
- **SendGrid** (free tier 100/jour)
- **SMTP classique** (OVH, Gmail, etc.)

Renseignez les variables dans `.env.local` puis adaptez `src/app/api/contact/route.ts`.

### V2 — Newsletter Mailchimp/Brevo

Voir `src/app/api/newsletter/route.ts` — la structure est prête, il manque juste l'appel API au prestataire.

---

## Dépannage

### "npm: command not found"

→ Installez Node.js : https://nodejs.org/

### "Permission denied" lors du push

→ Utilisez un token d'accès personnel GitHub (pas votre mot de passe). Voir 2.2 ci-dessus.

### Erreur de build "Failed to fetch font Inter"

→ C'est un faux positif réseau pendant le développement. Sur Vercel, ça fonctionne sans problème.

### Le port 3000 est déjà utilisé

→ Tuez le process : `npx kill-port 3000` puis relancez `npm run dev`.

---

## Ressources

- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation Tailwind** : https://tailwindcss.com/docs
- **Lucide Icons** : https://lucide.dev/icons
- **Cahier des charges** : voir `CAURIS_DIGITAL_Cahier_des_Charges_v1.docx`

---

Bon développement ! 🚀
