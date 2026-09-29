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

## Montpellier & alentours (89 communes, 7 quartiers, 14 métiers)

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

## Règles de contenu (impératives)

- **Aucun prix affiché** : toutes les prestations sont « sur devis, gratuit et personnalisé ».
- **Aucun client cité nommément** (seules les plateformes du groupe servent de preuve).
- **Rien d'invérifiable** : pas de statistique inventée, formulations prudentes sur les calendriers réglementaires.

## Innovation, illustrations et données en direct

| Script | Produit |
|---|---|
| `node zones/generate-art.mjs` | `/assets/communes/{slug}.jpg` : une illustration unique par commune/quartier (paysage + repère emblématique), rendue via Chromium |
| `node zones/generate-veille.mjs` | `/lab/veille/` : articles de veille (MCP, agents vocaux, facturation électronique, AI Act, RAG…) |
| `node zones/generate-lab.mjs` | `/lab/` (radar technologique) + `/lab/api.html` (catalogue d'API + démos en direct) — à lancer après la veille |

- `zones/automatisations-avancees.mjs` : catalogue d'automatisations de pointe, sélectionnées automatiquement selon le tissu économique de chaque commune / métier.
- `assets/live.js` : météo, état de la mer et données INSEE en direct sur chaque page commune + démos du Lab (API publiques, aucune clé). Open-Meteo est gratuit pour un usage non commercial : vérifier ses conditions / souscrire l'offre commerciale si nécessaire.

## Tout régénérer

```bash
npm run generate          # tous les générateurs dans le bon ordre (+ --art pour les illustrations)
npm run actus             # après avoir ajouté un fichier content/actus/AAAA-MM-JJ.json
```

## Actus quotidiennes

Un fichier par jour dans `content/actus/AAAA-MM-JJ.json` : `date`, `titre`, `intro`, `items[]`
(`cat`, `titre`, `resume`, `pourquoi` = ce que ça change pour une entreprise, `sources[]` = `{nom, url https}`
**obligatoire**, `lien` optionnel vers une page du site). Le générateur refuse une actu sans source.
Produit les pages `/lab/actus/`, le flux RSS et le bloc « Actus » de l'accueil.

## Assistant du site

- `assets/assistant.js` (chargé sur toutes les pages via `analytics.js`) : répond gratuitement à partir de
  `assets/site-index.json` (généré par `zones/generate-search-index.mjs`), + appel / rappel / visio.
- `api/assistant.mjs` : si la variable d'environnement Vercel `ANTHROPIC_API_KEY` est définie, les réponses
  sont rédigées par Claude (modèle `claude-opus-5-5` par défaut, modifiable via `ASSISTANT_MODEL`), à partir
  des extraits du site, avec les règles : pas de prix, pas de client cité, rien d'inventé.
- `/recherche.html` : recherche plein texte sur tout le site.

## Mise en production

Vercel déploie automatiquement la branche `main`. Pour publier : fusionner la branche de travail dans `main`
(pull request sur GitHub → « Merge »). Chaque pull request reçoit aussi une URL de prévisualisation Vercel.
