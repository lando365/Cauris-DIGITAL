# 🚀 Déploiement sur Vercel — CAURIS DIGITAL

Ce guide te accompagne du commit final jusqu'à un site en ligne sur Vercel.

## ⏱️ Temps total estimé : 20 minutes

---

## Étape 0 — Pousser tous les changements sur GitHub

Avant tout, vérifie qu'il n'y a aucun changement local non poussé :

```powershell
cd "C:\Users\tefl2407\Desktop\TFE\Projet Stage\cauris-digital"

# Vérifier les changements
git status

# Si des changements non commités existent :
git add -A
git commit -m "feat(deploy): finaliser le projet avant déploiement Vercel"
git push origin main
```

⚠️ Vercel déploie **à partir de la branche `main` de GitHub**. Si tu n'as pas pushé, Vercel ne verra pas tes derniers changements.

---

## Étape 1 — Créer un compte Vercel (3 min)

1. Va sur **https://vercel.com**
2. Clique sur **« Sign Up »** en haut à droite
3. Choisis **« Continue with GitHub »** (le plus simple — ça utilise déjà ton compte GitHub `lando365`)
4. Autorise Vercel à accéder à tes repos GitHub
5. Plan : choisis **« Hobby »** (gratuit, parfait pour ce projet)

---

## Étape 2 — Importer le projet (2 min)

1. Une fois connectée, tu arrives sur le dashboard
2. Clique sur **« Add New… »** → **« Project »**
3. Tu vois la liste de tes repos GitHub
4. Cherche **`Cauris-DIGITAL`** et clique **« Import »**

### Configuration du build

Vercel détecte automatiquement Next.js. Vérifie ces valeurs (devraient être pré-remplies) :

| Champ                | Valeur                            |
| -------------------- | --------------------------------- |
| **Framework Preset** | `Next.js`                         |
| **Build Command**    | `next build` (laisser par défaut) |
| **Output Directory** | `.next` (laisser par défaut)      |
| **Install Command**  | `npm install`                     |
| **Node.js Version**  | `20.x` ou `22.x` (récent)         |

---

## Étape 3 — Configurer les variables d'environnement (5 min)

Dans la page d'import, **avant** de cliquer "Deploy", déroule la section **« Environment Variables »**.

Ajoute ces variables (une par une, ou colle en bloc avec le bouton "Paste .env") :

```bash
# === Site ===
NEXT_PUBLIC_SITE_URL=https://cauris-digital.vercel.app

# === Resend (formulaire de contact + newsletter) ===
RESEND_API_KEY=re_TA_CLE_RESEND
RESEND_AUDIENCE_ID=TON_ID_AUDIENCE
CONTACT_EMAIL_FROM=CAURIS DIGITAL <onboarding@resend.dev>
CONTACT_EMAIL_TO=kamteflorentin3@gmail.com

# === reCAPTCHA v3 ===
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6L...ta-site-key
RECAPTCHA_SECRET_KEY=6L...ta-secret-key
```

💡 **Comment récupérer les valeurs** : ouvre ton fichier local `.env.local` et copie les valeurs exactes.

> ⚠️ Les valeurs **NE doivent PAS** être entre guillemets dans Vercel (contrairement à ton .env.local où ce serait OK).

---

## Étape 4 — Déployer (3 min)

1. Clique sur **« Deploy »** en bas de la page
2. Vercel lance le build → tu vois des logs en temps réel
3. Si tout va bien (~2-3 min), tu vois 🎉 **« Congratulations! »**
4. **Ton URL** apparaît : `https://cauris-digital.vercel.app` (ou similaire)
5. Clique sur **« Visit »** ou **« Open in new tab »** → ton site est en ligne ! 🚀

### Si le build échoue

Regarde les logs d'erreur dans le panneau de droite. Erreurs courantes :

| Erreur                     | Solution                                                       |
| -------------------------- | -------------------------------------------------------------- |
| `Module not found: resend` | Vérifier que `package.json` contient bien `"resend": "^4.0.1"` |
| Type errors                | Lancer `npm run type-check` localement et corriger             |
| `RESEND_API_KEY undefined` | Vérifier que la variable est bien ajoutée dans Vercel          |
| Build timeout              | Le plan Hobby a 45 min max — devrait largement suffire         |

Tu peux **redéployer** en cliquant sur **« Redeploy »** une fois le problème corrigé.

---

## Étape 5 — Ajouter le domaine Vercel à reCAPTCHA (2 min)

Maintenant que tu connais ton URL Vercel, il faut l'autoriser dans Google reCAPTCHA :

1. Va sur https://www.google.com/recaptcha/admin
2. Clique sur ton site **« cauris-digital »**
3. ⚙️ **Paramètres** (icône en haut à droite)
4. Dans **« Domaines »**, ajoute (Entrée après chacun) :
   - `cauris-digital.vercel.app` (ton URL exacte)
   - `cauris-digital-git-main-lando365.vercel.app` (URL de preview, optionnel)
5. Clique **« Enregistrer »**

⏳ Attendre ~30 secondes que les changements soient pris en compte.

---

## Étape 6 — Tester le site en production (5 min)

Ouvre ton URL Vercel et teste :

### ✅ Checklist de recette (CDC §13.3)

#### Pages principales

- [ ] `/` (Accueil) — Hero, sections, footer chargent
- [ ] `/a-propos` — équipe, valeurs visibles
- [ ] `/programme-incubation` — phases, témoignages
- [ ] `/programme-acceleration` — tableau comparatif
- [ ] `/innovation-corporative` — services
- [ ] `/startups` — filtres dynamiques fonctionnels
- [ ] `/evenements` — onglets À venir/Passés
- [ ] `/actualites` — liste articles + recherche
- [ ] `/actualites/amina-farmtrack-portrait` — page article
- [ ] `/faq` — accordéons
- [ ] `/partenaires` — 17 logos affichés
- [ ] `/contact` — formulaire + carte Yaoundé
- [ ] `/mentions-legales` — texte
- [ ] `/politique-de-confidentialite` — texte

#### Fonctionnalités critiques

- [ ] **Formulaire de contact** : envoyer un test → email reçu
- [ ] **Newsletter** : inscription test → contact ajouté à Resend
- [ ] **Cookie banner** : apparaît à la première visite
- [ ] **Menu mobile** : hamburger fonctionne sur 375px
- [ ] **Sitemap** : ouvrir `https://ton-url/sitemap.xml`
- [ ] **Robots** : ouvrir `https://ton-url/robots.txt`

#### Partage social

- [ ] **Image OG** : ouvrir `https://ton-url/opengraph-image` → image générée
- [ ] **Test Facebook OG** : [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/) → coller l'URL
- [ ] **Test LinkedIn** : [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/) → coller l'URL

#### Performance

- [ ] **Lighthouse mobile ≥ 85** (Chrome DevTools → Lighthouse → Mobile)
- [ ] **Lighthouse desktop ≥ 90**
- [ ] **HTTPS actif** (cadenas vert dans la barre d'adresse)

---

## 🎉 C'est tout !

Tu peux maintenant **partager l'URL à ton chef de stage** pour qu'il voie le site en condition réelle.

### Pour les redéploiements futurs

Vercel redéploie automatiquement à **chaque push sur la branche `main`** :

```powershell
# Tu modifies du code
git add .
git commit -m "feat: ..."
git push

# Vercel détecte le push et redéploie automatiquement (~2 min)
```

Tu peux suivre les déploiements sur **vercel.com → ton projet → Deployments**.

---

## 🌐 Plus tard : domaine personnalisé

Quand `caurisdigital.org` sera acheté :

1. Vercel → ton projet → **Settings → Domains**
2. Ajouter `caurisdigital.org`
3. Vercel te donne 2-3 enregistrements DNS à configurer chez ton registrar (Namecheap, OVH…)
4. Une fois la propagation faite (~30 min), le site est accessible sur ton vrai domaine
5. ⚙️ N'oublie pas de :
   - Ajouter `caurisdigital.org` à reCAPTCHA (déjà fait)
   - Vérifier `caurisdigital.org` sur Resend pour pouvoir envoyer depuis `noreply@caurisdigital.org`
   - Mettre à jour `NEXT_PUBLIC_SITE_URL` dans Vercel
