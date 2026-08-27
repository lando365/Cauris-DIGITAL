# Configuration reCAPTCHA v3 — Protection anti-bot du formulaire de contact

Ce guide explique comment activer la protection reCAPTCHA v3 sur le formulaire de contact du site CAURIS DIGITAL.

## ⏱️ Temps requis : ~5 minutes

## Pourquoi reCAPTCHA v3 ?

- ✅ **Invisible** pour les humains — pas de "je ne suis pas un robot" agaçant
- ✅ Score de 0 (bot) à 1 (humain) — on rejette si < 0.5
- ✅ Évalue le comportement (souris, clavier, parcours) en arrière-plan
- ✅ Combine avec le honeypot et la validation côté serveur déjà en place

## 1. Créer un site reCAPTCHA

1. Va sur https://www.google.com/recaptcha/admin/create
2. Connecte-toi avec ton compte Google (le même que d'habitude)
3. Remplis le formulaire :
   - **Label** : `cauris-digital`
   - **Type reCAPTCHA** : sélectionne **« reCAPTCHA v3 »**
   - **Domaines** : ajoute (une ligne par domaine) :
     - `localhost` (pour le dev)
     - `127.0.0.1` (pour le dev)
     - `caurisdigital.org` (pour la prod, ajoute-le quand le domaine sera prêt)
     - `*.vercel.app` (pour les déploiements de preview Vercel)
   - **Propriétaires** : ton email Google est déjà rempli
   - ✅ Cocher **« Accepter les conditions d'utilisation de reCAPTCHA »**
4. Clique sur **« Envoyer »**

## 2. Récupérer les deux clés

Google te montre maintenant **2 clés** :

| Clé                                            | Visibilité                        | À placer dans                    |
| ---------------------------------------------- | --------------------------------- | -------------------------------- |
| **Clé du site** (commence souvent par `6L...`) | Publique (visible côté client)    | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` |
| **Clé secrète** (commence aussi par `6L...`)   | Secrète (côté serveur uniquement) | `RECAPTCHA_SECRET_KEY`           |

> 📋 Tu peux retrouver ces clés à tout moment sur https://www.google.com/recaptcha/admin → ton site → ⚙️ **Paramètres**.

## 3. Configurer `.env.local`

Ouvre ton fichier **`.env.local`** dans VS Code et ajoute (ou décommente) les 2 lignes :

```bash
# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ La clé **publique** doit obligatoirement avoir le préfixe `NEXT_PUBLIC_` pour être accessible côté client.

## 4. Redémarrer le serveur

Les variables `.env.local` sont lues au démarrage uniquement :

```powershell
# Ctrl+C dans le terminal, puis :
npm run dev
```

## 5. Tester

1. Aller sur http://localhost:3000/contact
2. Ouvrir la **console du navigateur** (F12 → onglet Console)
3. Remplir et envoyer le formulaire
4. Dans le terminal `npm run dev`, tu devrais voir un log du genre :
   ```
   [contact] reCAPTCHA OK (score: 0.9)
   [contact] Message envoyé ✓ <id>
   ```

✅ Si tu vois le score → tout est OK !

## 6. Pour le déploiement Vercel

Quand tu déploieras sur Vercel :

1. **Settings → Environment Variables** du projet
2. Ajouter les 2 variables (avec les bonnes clés du dashboard Google) :
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`
3. Vérifier que **`caurisdigital.org`** et **`*.vercel.app`** sont bien dans la liste des domaines autorisés du site reCAPTCHA
4. Redéployer

## 🆘 Dépannage

| Problème                                       | Solution                                                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| L'API renvoie "Vérification anti-spam échouée" | Vérifier que les clés sont bonnes et que `localhost` est dans les domaines autorisés sur le dashboard Google             |
| Score trop bas → soumission refusée            | C'est normal en mode test. Tester depuis un autre navigateur, ou interagir naturellement avec la page avant de soumettre |
| Badge reCAPTCHA visible en bas-droite          | C'est masqué via CSS (`.grecaptcha-badge`). Si tu veux le réafficher : retirer le bloc CSS dans `globals.css`            |
| `RECAPTCHA_SECRET_KEY` non détectée            | Redémarrer `npm run dev` après ajout. Les variables `.env.local` ne sont lues qu'au démarrage.                           |
| Erreur "invalid-input-secret"                  | La `RECAPTCHA_SECRET_KEY` n'est pas correcte → re-copier depuis le dashboard Google                                      |

## ✅ Mode dev sans clés

Si tu n'as **pas encore** configuré reCAPTCHA, le formulaire fonctionne quand même :

- Le composant `RecaptchaScript` ne charge rien (retourne `null`)
- Le hook `useRecaptcha` retourne `isEnabled = false`
- L'API route saute la vérification
- Seul le honeypot et les validations standards protègent

C'est pratique pour développer rapidement sans dépendre de Google.

## 📊 Surveiller les scores

Sur https://www.google.com/recaptcha/admin → ton site, tu vois des **stats** :

- Volume de requêtes
- Distribution des scores (utile pour ajuster le seuil 0.5 si beaucoup de faux positifs)
- Erreurs récentes

Si beaucoup de requêtes légitimes sont bloquées (score 0.3-0.4), tu peux baisser le seuil dans `src/app/api/contact/route.ts` (rechercher `score < 0.5`).
