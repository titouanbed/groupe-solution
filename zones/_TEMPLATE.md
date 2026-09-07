# Gabarit de silo géographique — Groupe Solution

Chaque zone (Mayotte, La Réunion, …) est une **landing locale** qui partage la
charte `assets/silo.css` et renvoie son autorité SEO + ses prospects vers le
holding. Tout est piloté par un **registre central** : `zones/zones.mjs`.

## Architecture industrialisée

- **`zones/zones.mjs`** — source de vérité unique : la liste des territoires et,
  pour chacun, ses villes + tout le contenu différencié (titres, hero, FAQ…).
- **`zones/generate-cities.mjs`** — génère `/{zone}/site-internet-{ville}.html`
  pour chaque ville des zones `status: 'online'`.
- **`zones/generate-implantations.mjs`** — régénère `/implantations.html`
  (page holding) : une carte par territoire, cliquable si `online`, badge
  « En préparation » si `coming`.

## Ajouter / activer une zone

1. **Déclarer la zone** dans `zones/zones.mjs` : `slug`, `name`, `code`, `status`,
   `regionPage`, `implantTagline`, et la liste `cities` (chaque ville avec son
   contenu différencié : `title`, `desc`, `keywords`, `badge`, `h1suffix`,
   `heroSub`, `auditIntro`, `servicesH2`, `servicesIntro`, `aboutP`, `zones`,
   `areaServed`, `faq[]`). Mettre `status: 'coming'` tant que les pages/visuels
   ne sont pas prêts (carte « En préparation », sans lien).

2. **Ajouter le `slug` au tableau `ZONES`** de `analytics.js` → `content_group`
   GA4 automatique.

3. **Déposer les visuels locaux** dans `/assets/{slug}/` (voir règle d'or ci-dessous),
   puis passer la zone en `status: 'online'`.

4. **Générer + référencer** :
   ```
   node zones/generate-cities.mjs
   node zones/generate-implantations.mjs
   ```
   puis ajouter les URLs de la zone (région + villes) à `sitemap.xml`.

> ⚠️ Ne pas éditer à la main les pages villes ni `implantations.html` : elles sont
> **générées**. Toute modif se fait dans `zones.mjs` (ou le template du générateur)
> puis on relance les scripts.

## 🖼️ Règle d'or — VISUELS LOCAUX PROPRES À CHAQUE ZONE (obligatoire)

**Ne jamais réutiliser les photos d'une autre zone ni des visuels génériques
partagés.** Chaque territoire doit avoir SES propres images de haute qualité,
**authentiquement locales** : de vrais paysages du territoire (nature, reliefs,
côtes) et, pour les 3 cartes de services, de la **faune/flore emblématique** de
la zone — pas de stock générique de ville/métropole qui n'a rien à voir avec le
lieu. Exemple Réunion : hero = pitons / cirques / mer de nuages ; services =
paille-en-queue, gecko vert, baleine à bosse.

Convention de stockage : **`/assets/{slug}/`** (ex. `/assets/reunion/`).
Chaque zone héberge **9 visuels** en local (jamais de hotlink) :

| Fichier | Usage | Résolution conseillée |
|---|---|---|
| `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg` | fond du hero (rotation) | ~1600×1000 |
| `web.jpg`, `social.jpg`, `seo.jpg` | 3 cartes de services | ~800×560 |
| `rea-1.jpg`, `rea-2.jpg`, `rea-3.jpg` | 3 cartes « réalisations » | ~800×560 |

Méthode : **vérifier visuellement chaque image avant de la retenir** (contact-sheet),
choisir des visuels **distincts de ceux du holding et des autres zones**, puis
télécharger en local (source libre type Unsplash, ou photos de marque fournies).
La photo du fondateur (`../photo-president.jpg`) reste partagée (personne réelle).

Astuce lisibilité : si un visuel de hero est clair (plage, aérien), renforcer
l'overlay dans un `<style>` de la page :
`.hero::before { background: linear-gradient(to bottom, rgba(0,0,0,.34), rgba(0,0,0,.58)); }`

## Invariants à NE PAS toucher (déjà en place dans le gabarit)

- **Ponts holding** : lien nav « Groupe Solution ↗ », bande d'appartenance
  (CTA `…/echanger.html` + `www.groupsolution.fr`), colonne footer « Groupe Solution ».
- **SEO** : `<link rel="canonical">`, JSON-LD `ProfessionalService` +
  `parentOrganization`, JSON-LD `FAQPage`.
- **Tracking** : `<script src="/analytics.js" defer></script>` avant `</body>`.
- **Offre & tarifs** : identiques au groupe (sites dès 250€, reste sur devis).

## Garde-fous

- **Ne jamais inventer** de chiffres, de clients ni de réalisations spécifiques à
  la zone. Adapter uniquement la localisation. Les réalisations affichées sont les
  vraies références du groupe.
- **Re-thématiser une zone** (optionnel) : redéfinir `--rose` / `--rose-fonce` /
  `--rose-clair` dans un `<style>` de la page, après le lien vers `silo.css`.
