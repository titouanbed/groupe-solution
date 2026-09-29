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

## Montpellier & alentours (75 communes, 7 quartiers, 14 métiers)

Deux familles de pages générées depuis **un seul registre** : `zones/montpellier-communes.mjs` (+ `zones/communes-extension.mjs` pour Nîmes, Béziers, Agde, Cévennes…)
(portrait, repères, tissu économique, cas d'automatisation et FAQ propres à chaque commune).

| Script | Produit |
|---|---|
| `node zones/generate-montpellier.mjs` | `/montpellier/site-internet-{commune}.html` (création de site, charte silo) + bloc carte du hub |
| `node zones/generate-automatisation.mjs` | `/automatisation/` (hub) + `/automatisation/{commune}.html` (logiciel & automatisation, charte holding) |
| `node zones/generate-montpellier-plus.mjs` | `/montpellier/site-internet-{metier}-montpellier.html` (14 métiers, registre `zones/montpellier-plus.mjs` — quartiers inclus dans generate-montpellier) |
| `node zones/generate-guides.mjs` | `/montpellier/guides/` (6 guides longs + index) |
| `node zones/generate-outils.mjs` | `/outils/` : simulateur de prix (grille éditable en tête de `assets/outils.js`), test de visibilité Google, calculateur d'automatisation |
| `node zones/generate-implantations.mjs` | `/implantations.html` (inclut la carte Montpellier) |
| `node zones/generate-sitemap.mjs` | `/sitemap.xml` (après `git add`) |

Ne pas éditer ces pages à la main : modifier le registre ou le générateur, puis relancer.
Règle : jamais de contenu copié d'une commune à l'autre, et aucun fait local non vérifié.

`llms.txt` (racine) résume l'entreprise et ses pages clés pour les moteurs de réponse IA.
