# Sauvegarde automatisée — CDC V2 §9.6

`backup.yml` exporte la base PostgreSQL chaque dimanche à 03:00 UTC et pousse le
dump compressé vers un **dépôt GitHub privé séparé** (jamais dans ce dépôt
public, ni dans ses artefacts Actions — publiquement visibles sur un repo
public).

## Mise en place (à faire une seule fois)

1. Créer un dépôt GitHub **privé** dédié, ex. `cauris-digital-backups`.
2. Générer un Personal Access Token (fine-grained) avec accès **Contents:
   Read and write** limité à ce seul dépôt.
3. Dans les paramètres de **ce** dépôt (`cauris-digital`) → Settings →
   Secrets and variables → Actions, ajouter :
   - `BACKUP_DATABASE_URL` — la connexion PostgreSQL **directe** (port 5432,
     pas la connexion poolée pgbouncer utilisée par l'app — équivalent de
     `DIRECT_URL` dans `.env`).
   - `BACKUP_REPO` — `votre-compte/cauris-digital-backups`.
   - `BACKUP_REPO_TOKEN` — le token créé à l'étape 2.
4. Tester manuellement : onglet **Actions** → "Sauvegarde hebdomadaire de la
   base de données" → **Run workflow**.

## Procédure de restauration

```bash
# Récupérer le dump depuis le dépôt privé de backups, puis :
gunzip -c backup-2026-08-24.sql.gz | psql "$DATABASE_URL"
```

RTO estimé : ~10-30 min (cf. CDC §9.6). Restauration à tester périodiquement
sur une base de test, pas directement en production.

## Rétention

- Le workflow supprime automatiquement les dumps de plus de 90 jours à
  chaque exécution (conservation longue durée : 3 mois, CDC §9.6).
- Fréquence hebdomadaire → RPO (perte de données maximale) : ~7 jours.

# Tests E2E sur preview Vercel — CDC V2 §12.4

`e2e.yml` attend le déploiement Vercel Preview associé à chaque push (via
l'événement GitHub `deployment_status` émis par l'intégration Vercel), puis
exécute la suite Playwright (`e2e/*.spec.ts`) directement contre cette URL
déployée.

## Mise en place (à faire une seule fois)

1. Le dépôt doit déjà être connecté à Vercel via l'app GitHub officielle
   (Vercel → Project Settings → Git) — c'est elle qui déclenche l'événement,
   pas ce workflow.
2. Dans Settings → Secrets and variables → Actions de ce dépôt, ajouter :
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — identifiants d'un compte
     ADMIN existant réellement dans la base utilisée par les déploiements
     Preview (cf. `npm run db:seed`, CDC §11.3).
3. Tester manuellement sans attendre de déploiement : onglet **Actions** →
   "Tests E2E sur preview Vercel" → **Run workflow**, en renseignant
   optionnellement une URL de preview existante.

## Limites connues

- Les tests s'exécutent en série (`fullyParallel: false` dans
  `playwright.config.ts`) contre un environnement partagé — une preview
  concurrente qui modifierait les mêmes données pourrait provoquer des faux
  négatifs occasionnels.
- En cas d'échec, les traces Playwright (`test-results/`) sont publiées comme
  artefact du run (onglet Actions du run concerné), consultables via
  `npx playwright show-trace <fichier>.zip`.
