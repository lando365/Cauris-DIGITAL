# 📊 Configuration Google Analytics 4 — CAURIS DIGITAL

Ce guide t'accompagne pour activer le suivi des visites sur le site CAURIS DIGITAL.

## ⏱️ Temps requis : ~15 minutes

## ⚖️ Conformité RGPD

L'intégration GA4 dans ce projet est **RGPD-friendly** :

- ✅ GA4 ne se charge **QUE** si l'utilisateur accepte les cookies via le bandeau
- ✅ Anonymisation IP activée par défaut (`anonymize_ip: true`)
- ✅ Cookie `SameSite=None; Secure`
- ✅ Désactivation en temps réel si l'utilisateur refuse
- ✅ Pas de tracking pendant la phase de chargement (script `afterInteractive`)

---

## 1. Créer une propriété GA4 (5 min)

1. Va sur **https://analytics.google.com** et connecte-toi avec ton compte Google
2. Si premier projet, clique sur **« Commencer à mesurer »**. Sinon, **« Admin »** (engrenage en bas à gauche) → **« Créer »** → **« Compte »**
3. **Étape 1 — Compte** :
   - Nom du compte : `CAURIS DIGITAL`
   - Cocher les options de partage de données (au choix)
4. **Étape 2 — Propriété** :
   - Nom : `CAURIS DIGITAL — Site web`
   - Fuseau horaire : `(GMT+01:00) Yaoundé` (ou Belgique selon ta préférence)
   - Devise : `Euro (EUR)` ou `Franc CFA (XAF)`
5. **Étape 3 — Informations sur l'entreprise** :
   - Secteur : `Éducation` ou `Technologie`
   - Taille : selon le contexte
   - Utilisation : sélectionner ce qui s'applique (générer des leads, mesurer le trafic…)
6. **Étape 4 — Objectif** : `Générer des leads` + `Mesurer le trafic`
7. Cliquer **« Créer »** → accepter les CGU

## 2. Créer un flux de données Web (3 min)

1. Choisir **« Web »** comme plateforme
2. URL du site : `https://cauris-digital.vercel.app`
3. Nom du flux : `Vercel Production`
4. **« Améliorer les mesures »** : laisser tous activés (clics sortants, scroll, etc.)
5. Cliquer **« Créer un flux »**

## 3. Récupérer le Measurement ID

Dans le panneau qui s'ouvre, tu vois **« ID de mesure »** qui ressemble à :

```
G-XXXXXXXXXX
```

📋 **Copie-le.** C'est ce qu'on va mettre dans `.env.local`.

> 💡 Plus tard tu peux le retrouver via : **Admin → Flux de données → ton flux → ID de mesure**.

---

## 4. Configurer en local (`.env.local`)

Ouvre ton `.env.local` et ajoute la ligne :

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

(remplace `XXXXXXXXXX` par les vrais caractères)

⚠️ Le préfixe `NEXT_PUBLIC_` est **obligatoire** — sans lui, la variable n'est pas accessible côté client.

## 5. Configurer sur Vercel (production)

1. Va sur **https://vercel.com/dashboard** → ton projet **`cauris-digital`**
2. **Settings → Environment Variables**
3. Clique **« Add New »** :
   - Key : `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value : `G-XXXXXXXXXX`
   - Environments : cocher **Production**, **Preview** et **Development**
4. Clique **« Save »**
5. **Redéployer** (Deployments → ⋯ → Redeploy)

---

## 6. Tester en local

```powershell
# Ctrl+C pour arrêter, puis :
npm run dev
```

1. Va sur http://localhost:3000
2. **Refuser** d'abord les cookies → vérifier que GA n'est PAS chargé (F12 → Network → pas de requête vers `googletagmanager.com`)
3. **Rafraîchir** la page
4. **Accepter** les cookies → vérifier que GA EST chargé (Network → requête vers `googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`)
5. Naviguer entre les pages → chaque changement de route doit envoyer un `page_view` (visible dans Network)

## 7. Vérifier dans GA en temps réel

1. Dans Google Analytics, va dans **Rapports → Temps réel**
2. Visite ton site dans un autre onglet
3. Tu devrais voir **« 1 utilisateur actif »** apparaître ✅

⏳ Attention : il y a un **délai de quelques secondes** entre la visite et son affichage dans GA.

---

## 8. Ce qui est tracké automatiquement

Avec **« Améliorer les mesures »** activé (étape 2.4) :

| Événement                    | Quand                                           |
| ---------------------------- | ----------------------------------------------- |
| `page_view`                  | Chaque chargement et changement de route        |
| `scroll`                     | Quand l'utilisateur atteint 90% de la page      |
| `click`                      | Sur tous les liens sortants                     |
| `file_download`              | Sur les téléchargements de fichiers (PDF, etc.) |
| `video_*`                    | Sur les vidéos YouTube embed                    |
| `form_start` / `form_submit` | Démarrage et soumission des formulaires         |
| `search`                     | Si l'utilisateur utilise une recherche interne  |

## 9. Personnaliser le tracking (optionnel)

Tu peux ajouter des événements custom dans le code via `window.gtag` :

```typescript
// Exemple : tracker un clic sur "Candidater"
window.gtag?.('event', 'apply_clicked', {
  program: 'incubation',
  source: 'hero_cta',
});
```

---

## 🆘 Dépannage

| Problème                                     | Solution                                                                                              |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| GA ne se charge pas même après acceptation   | Vérifier que `NEXT_PUBLIC_GA_MEASUREMENT_ID` est défini dans `.env.local` et redémarrer `npm run dev` |
| Pas de données dans GA                       | Attendre 24-48h pour les rapports historiques. **Temps réel** doit fonctionner immédiatement.         |
| Erreur "Property invalid"                    | Vérifier que l'ID commence bien par `G-` (pas `UA-` qui est l'ancien Universal Analytics)             |
| Cookie banner ne réapparaît plus pour tester | Ouvrir DevTools → Application → Local Storage → supprimer `cauris-cookie-consent`                     |
| GA tracke pendant les tests automatiques     | Filtrer ton IP dans Admin → Filtres de données                                                        |

---

## 📊 Lecture des rapports GA4

Une fois en place, les rapports utiles pour CAURIS DIGITAL :

- **Acquisition → Sources de trafic** : d'où viennent les visiteurs (Google, LinkedIn, direct…)
- **Engagement → Pages et écrans** : quelles pages sont les plus consultées
- **Engagement → Événements** : conversions (clics sur "Candidater", soumissions formulaire)
- **Démographie** : pays/villes des visiteurs (utile pour mesurer la portée Afrique francophone)
- **Tech → Catégorie d'appareil** : mobile vs desktop (essentiel pour les optimisations)

## 🔒 Vie privée des visiteurs

Avec notre intégration RGPD-friendly :

- **Refus cookies** → AUCUN tracking (le script GA n'est même pas téléchargé)
- **Acceptation cookies** → Tracking activé mais avec :
  - Anonymisation IP (`anonymize_ip: true`)
  - Pas de Google Signals
  - Pas de Google Ads
  - Possibilité de désactivation à tout moment (voir politique de confidentialité)

Notre page **/politique-de-confidentialite** mentionne déjà l'utilisation de GA4.
