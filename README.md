# Groupe Solution — site institutionnel

Site vitrine du holding Groupe Solution (6 pages) + prise de rendez-vous Google Calendar.
HTML/CSS/JS statique (Source Serif 4 + Plus Jakarta Sans, palette olive, hairlines) et
fonctions serverless Vercel pour la réservation.

## Déploiement

- **Hébergement :** Vercel (équipe `groupe-solution`) — déploiement automatique à chaque push sur `main`.
- **Production :** https://groupe-solution.vercel.app
- Site statique servi depuis la racine ; dossier `/api` = fonctions serverless (aucun build).

## Structure

| | |
|---|---|
| `index.html` | Accueil |
| `solutions.html` · `realisations.html` · `partenariats.html` · `a-propos.html` · `echanger.html` | Pages secondaires |
| `styles.css` · `site.js` | Design system + JS partagés |
| `contact.css` · `contact.js` | Composants de contact partagés (RDV, diagnostic, CTA) |
| `api/` | Fonctions Vercel : `availability.mjs`, `book.mjs`, `_shared.mjs` (logique créneaux + OAuth Google) |
| `scripts/` | `test-slots.mjs` (tests), `google-oauth-setup.mjs` (génération du refresh token) |

## Prise de RDV Google Calendar

Fonctionne en **mode démonstration** (créneaux fictifs, mention visible) tant que les identifiants
Google ne sont pas fournis. Pour l'activer réellement, voir **[NOTES-RDV-GoogleCalendar.md](NOTES-RDV-GoogleCalendar.md)** :
renseigner `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`,
`BOOKING_TIMEZONE` dans les variables d'environnement Vercel.

## Développement

```bash
npm install
npm run test:slots      # tests de la logique de créneaux (buffer 30 min, horaires, free/busy)
```
