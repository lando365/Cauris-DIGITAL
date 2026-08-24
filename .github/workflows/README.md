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
