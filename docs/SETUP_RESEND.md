# Configuration Resend — Formulaire de contact

Ce guide explique comment activer l'envoi réel d'emails depuis le formulaire de contact du site CAURIS DIGITAL.

## ⏱️ Temps requis : ~10 minutes

## 1. Créer un compte Resend (gratuit)

1. Aller sur https://resend.com
2. Cliquer sur **« Sign up »** (en haut à droite)
3. S'inscrire avec une adresse email professionnelle (par exemple `hello@caurisdigital.org` quand il sera disponible, ou ton email perso pour les tests)
4. Confirmer l'email reçu

> 💡 **Free tier** : 100 emails par jour, 3 000 emails par mois. Largement suffisant pour la phase de recette et le lancement.

## 2. Récupérer une clé API

1. Une fois connecté, aller sur https://resend.com/api-keys
2. Cliquer sur **« Create API Key »**
3. Donner un nom : `cauris-digital-dev` (par exemple)
4. Permission : **« Full access »** (ou « Sending access only » pour plus de sécurité)
5. Cliquer sur **« Create »**
6. **⚠️ Copier la clé immédiatement** — elle ne sera plus affichée après. Elle commence par `re_...`

## 3. Configurer `.env.local`

Dans le dossier `cauris-digital/`, créer un fichier nommé **`.env.local`** (à côté de `.env.example`) :

```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Resend
RESEND_API_KEY=re_VOTRE_CLE_ICI

# Pour tester rapidement (utilise l'email du compte Resend) :
CONTACT_EMAIL_FROM=CAURIS DIGITAL <onboarding@resend.dev>
CONTACT_EMAIL_TO=votre.email@gmail.com
```

> ⚠️ **Important** : le fichier `.env.local` est **automatiquement ignoré par Git** (voir `.gitignore`). Ne jamais commit ta clé API.

## 4. Tester localement

```powershell
cd "C:\Users\tefl2407\Desktop\TFE\Projet Stage\cauris-digital"
npm install      # pour installer Resend
npm run dev
```

Puis :
1. Aller sur http://localhost:3000/contact
2. Remplir le formulaire avec ton vrai email
3. Cliquer sur **« Envoyer le message »**
4. **Vérifier ta boîte mail** (et le dossier Spam au besoin)

Tu devrais recevoir un bel email formaté avec les couleurs CAURIS DIGITAL contenant le message.

## 5. (Plus tard) Vérifier un domaine pour la production

Pour pouvoir envoyer **depuis** une adresse `@caurisdigital.org` (au lieu de `onboarding@resend.dev`) :

1. Aller sur https://resend.com/domains
2. Cliquer sur **« Add Domain »**
3. Entrer `caurisdigital.org`
4. Ajouter les 3-4 enregistrements DNS (SPF, DKIM, DMARC) chez ton registrar (Namecheap, OVH, etc.)
5. Attendre la propagation DNS (5-30 minutes)
6. Mettre à jour `.env.local` (et `.env.production` sur Vercel) :
   ```
   CONTACT_EMAIL_FROM=CAURIS DIGITAL <hello@caurisdigital.org>
   ```

## 6. Pour le déploiement Vercel

Quand tu déploieras sur Vercel :
1. Aller dans **Settings → Environment Variables** du projet
2. Ajouter les 3 variables :
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL_FROM`
   - `CONTACT_EMAIL_TO`
3. Redéployer

## 🆘 Dépannage

| Problème | Solution |
|---|---|
| L'email n'arrive pas | Vérifier le dossier Spam. Vérifier que `CONTACT_EMAIL_TO` est correct. |
| Erreur "Forbidden" Resend | Vérifier que la clé API n'a pas été révoquée. En créer une nouvelle. |
| Erreur "Domain not verified" | Utiliser `onboarding@resend.dev` comme `CONTACT_EMAIL_FROM` en attendant la vérif domaine. |
| `RESEND_API_KEY` non détectée | Redémarrer `npm run dev`. Les variables `.env.local` ne sont lues qu'au démarrage. |

## ✅ Mode dev sans clé

Si tu n'as **pas encore** de clé Resend, le formulaire fonctionne quand même : il log juste le message dans la console du terminal `npm run dev` au lieu d'envoyer un email. Pratique pour développer sans dépendre du service.

---

# 📬 Newsletter — Configuration de l'Audience Resend

La newsletter du footer utilise la fonctionnalité **Audiences** de Resend (même compte que pour le formulaire de contact).

## ⏱️ Temps requis : ~3 minutes

## 1. Créer une audience dans Resend

1. Va sur https://resend.com/audiences
2. Clique sur **« Create Audience »**
3. Nom : **`CAURIS Newsletter`** (ou ce que tu veux)
4. Clique sur **« Create »**

## 2. Récupérer l'ID de l'audience

Une fois l'audience créée, son ID apparaît dans l'URL du dashboard :

```
https://resend.com/audiences/78f5e0fa-XXXX-XXXX-XXXX-XXXXXXXXXXXX
                                ↑ celui-ci (entre /audiences/ et /contacts ou la fin)
```

Copie cet ID.

## 3. Ajouter à `.env.local`

Ouvre ton fichier `.env.local` et ajoute la ligne :

```bash
RESEND_AUDIENCE_ID=78f5e0fa-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

## 4. Redémarrer le serveur

```powershell
# Ctrl+C pour arrêter, puis :
npm run dev
```

## 5. Tester (double opt-in — CDC §6.5)

L'inscription se fait en 2 étapes : un email de confirmation d'abord, puis l'ajout réel à
l'audience seulement après clic sur le lien.

1. Aller sur **n'importe quelle page** du site (la newsletter est dans le footer)
2. Saisir un email **différent** de celui du compte Resend
3. Cliquer sur la flèche →
4. Vérifier :
   - ✅ Message "Vérifiez votre boîte mail pour confirmer votre inscription."
   - ✅ Email "Confirmez votre inscription" reçu sur l'email saisi
   - ⚠️ Le contact n'apparaît **pas encore** dans l'audience à ce stade — c'est normal
5. Cliquer sur le bouton **"Confirmer mon inscription"** dans l'email
6. Vérifier :
   - ✅ Redirection vers une page "Inscription confirmée !"
   - ✅ Email de bienvenue reçu, avec un lien "Se désinscrire en un clic" en bas
   - ✅ Contact apparaît maintenant dans https://resend.com/audiences

Ajoute aussi `NEWSLETTER_TOKEN_SECRET` dans `.env.local` (une chaîne aléatoire longue) — elle
signe les liens de confirmation/désinscription. Sans elle, un secret de repli non sécurisé est
utilisé en dev, mais elle est **obligatoire en production**.

## 🆘 Dépannage newsletter

| Problème | Solution |
|---|---|
| "Confirmation enregistrée (mode dev)" | C'est que `RESEND_AUDIENCE_ID` est vide. Vérifie ton `.env.local`. |
| L'email de confirmation n'arrive pas | Vérifier Spams. Vérifier que `CONTACT_EMAIL_FROM` est correct dans `.env.local`. |
| Le lien de confirmation redirige vers une page d'erreur | Le lien a plus de 48h, ou `NEWSLETTER_TOKEN_SECRET` a changé entre l'envoi et le clic (redémarrage serveur avec un secret différent). Réinscris-toi. |
| Erreur "Audience not found" | L'ID copié est incorrect — vérifier l'URL exacte dans le dashboard Resend. |

## 📊 Envoyer une vraie newsletter plus tard

Une fois que ton audience a des abonnés, tu peux leur envoyer des broadcasts directement depuis le dashboard Resend :

1. https://resend.com/broadcasts → **« Create Broadcast »**
2. Choisir ton audience CAURIS Newsletter
3. Rédiger le sujet + le contenu (éditeur visuel intégré)
4. Envoyer ou programmer l'envoi

Pas besoin de coder quoi que ce soit côté site — la collecte des emails se fait via le formulaire, et l'envoi se fait depuis le dashboard.
