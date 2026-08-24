# Tests de charge k6 — CDC V2 §12.5

k6 n'est pas un paquet npm : c'est un binaire à installer séparément.

## Installation

```bash
# Windows (winget)
winget install k6 --source winget

# ou Chocolatey
choco install k6

# ou binaire portable : https://github.com/grafana/k6/releases
```

## Exécution

Contre un serveur local (`npm run build && npm run start`, port 3000 par défaut) :

```bash
k6 run k6/startups-read.js
k6 run k6/contact-submit.js
k6 run k6/admin-login.js -e SEED_ADMIN_EMAIL=admin@caurisdigital.org -e SEED_ADMIN_PASSWORD=xxx
k6 run k6/admin-dashboard.js -e SEED_ADMIN_EMAIL=admin@caurisdigital.org -e SEED_ADMIN_PASSWORD=xxx
```

Contre une URL de staging/preview Vercel (recommandé par le CDC §12.5, avant mise en production) :

```bash
k6 run k6/startups-read.js -e BASE_URL=https://<preview-url>.vercel.app
```

## Scénarios (CDC V2 §12.5)

| Script               | Scénario                                       | Charge                        | Résultat attendu              |
| -------------------- | ---------------------------------------------- | ----------------------------- | ----------------------------- |
| `startups-read.js`   | Lecture liste startups (`/api/startups`)       | 100 requêtes simultanées      | P95 < 200 ms, 0 erreur        |
| `contact-submit.js`  | Soumission formulaire contact (`/api/contact`) | 50 soumissions/min            | Toutes traitées, 0 perte      |
| `admin-login.js`     | Connexion admin simultanée                     | 10 admins en parallèle        | Pas de dégradation de session |
| `admin-dashboard.js` | Dashboard avec données réelles                 | 20 requêtes simultanées admin | P95 < 500 ms                  |

## Note sur `admin-login.js` / `admin-dashboard.js`

Les 10 (ou 20) VUs se connectent tous avec le **même** compte seedé
(`SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`) — c'est le seul compte de test
disponible sans provisionner des comptes dédiés. Ça teste bien la
simultanéité de sessions/requêtes visée par le CDC, mais pas des identités
distinctes. Chaque VU reproduit le flux réel de NextAuth v5 (Credentials) :
`GET /api/auth/csrf` → `POST /api/auth/callback/credentials` → cookie de
session réutilisé pour les requêtes suivantes.

## Vérification

Les 4 scripts ont été exécutés (k6 v2.2.0, binaire portable) en réduisant
volontairement VUs/durée, contre un build de production local
(`npm run build && npm run start`) : tous les `checks` passent à 100 %
(statuts HTTP, flux CSRF → credentials → session NextAuth, contenu des
réponses). Les seuils de latence (P95 < 200 ms / < 500 ms) ne sont **pas**
tenus en local — attendu sur une machine de dev partageant ses ressources
avec d'autres outils, pas sur l'infra Vercel réelle visée par le CDC
("tests de charge exécutés en staging avant mise en production", §12.5).
À rejouer en pleine charge (100/50/10/20) contre une URL de preview Vercel
pour un résultat représentatif.
