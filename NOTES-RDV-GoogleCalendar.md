# Prise de RDV Google Calendar — configuration

Le code est prêt et déployable tel quel. Tant que les identifiants Google ne sont pas
renseignés, le module de RDV fonctionne en **mode démonstration** (créneaux d'exemple,
mention « Démonstration avec données fictives », aucune réservation réelle créée).
Pour l'activer réellement, il reste **une configuration à faire côté Google + Vercel**.

## Ce que Titouan doit faire (une seule fois)

### 1. Projet Google Cloud
1. Console Google Cloud → créer (ou réutiliser) un projet.
2. **Activer l'API Google Calendar** (APIs & Services → Library → Google Calendar API).

### 2. Écran de consentement OAuth — **publié en production**
1. APIs & Services → OAuth consent screen.
2. Type « External », remplir les infos.
3. Scope : `.../auth/calendar`.
4. **Publier l'application en production** (bouton « Publish app »).
   > Important : en mode « Testing », le refresh token expire au bout de 7 jours.
   > La publication en production évite cette expiration (même logique que TwentyThree Clean).

### 3. Identifiant OAuth « Application Web »
1. APIs & Services → Credentials → Create credentials → OAuth client ID → **Web application**.
2. Authorized redirect URI : `http://localhost:53682/callback`
3. Noter le **Client ID** et le **Client secret**.

### 4. Générer le refresh token (en local, une fois)
```bash
npm install
GOOGLE_CLIENT_ID="<client_id>" GOOGLE_CLIENT_SECRET="<client_secret>" npm run oauth:setup
```
Le navigateur s'ouvre → se connecter avec **le compte Google dont le calendrier recevra les RDV**
→ le terminal affiche le `GOOGLE_REFRESH_TOKEN`.

### 5. Variables d'environnement Vercel
Project → Settings → Environment Variables (voir `.env.example`) :

| Variable | Valeur |
|---|---|
| `GOOGLE_CLIENT_ID` | (étape 3) |
| `GOOGLE_CLIENT_SECRET` | (étape 3) |
| `GOOGLE_REFRESH_TOKEN` | (étape 4) |
| `GOOGLE_CALENDAR_ID` | `primary` (ou l'ID d'un calendrier dédié) |
| `BOOKING_TIMEZONE` | `Europe/Paris` |

Redéployer → le module bascule automatiquement en mode réel.

## Réglages disponibilités
Dans `api/_shared.mjs`, objet `CONFIG` :
- `meetingMinutes` (30) · `bufferMinutes` (30, buffer imposé entre créneaux)
- `leadHours` (12, délai minimum) · `horizonDays` (14, fenêtre)
- `openingHours` : horaires d'ouverture par jour (lundi = 1 … vendredi = 5 ; week-end fermé)

## Fonctionnement technique
- `api/availability.mjs` → free/busy Google + génération des créneaux (horaires + buffer).
- `api/book.mjs` → re-vérifie la disponibilité (anti double-réservation) puis crée
  l'évènement avec invitation email + lien Google Meet.
- Aucune dépendance Google lourde : `fetch` natif + `luxon` (fuseaux/DST).
- Tests de la logique de créneaux : `npm run test:slots`.
