# Gabarit de silo géographique — Groupe Solution

Chaque zone (Mayotte, La Réunion, …) est une **landing locale** qui partage la
charte `assets/silo.css` et renvoie son autorité SEO + ses prospects vers le
holding. La 1ʳᵉ zone de référence est `reunion/site-internet-reunion.html`.

## Créer une nouvelle zone en 4 étapes

1. **Copier** `reunion/site-internet-reunion.html` vers `{slug}/site-internet-{slug}.html`
   (ex. `guyane/site-internet-guyane.html`). La profondeur `../` reste identique,
   donc images racine, `../Logo.svg` et `../assets/silo.css` fonctionnent tels quels.

2. **Remplacer les 8 variables géo** dans le nouveau fichier :

   | Variable | Exemple Réunion | Où |
   |---|---|---|
   | `{ZONE}` — nom | La Réunion | title, h1, badges, textes, band |
   | `{slug}` — url | reunion | nom de dossier + fichier + canonical |
   | `{DEPT}` — n° | 974 | title, keywords, textes |
   | `{PRÉFECTURE}` | Saint-Denis | JSON-LD address, footer contact, placeholders |
   | `{VILLES}` | Saint-Denis, Saint-Paul, Saint-Pierre, Le Tampon | JSON-LD `areaServed` |
   | `{gentilé}` | réunionnaises | section Services, À propos |
   | `{SEO title/desc/keywords}` | … à La Réunion (974) … | `<head>` |
   | `{canonical}` | https://www.groupsolution.fr/reunion/site-internet-reunion.html | `<link canonical>` + JSON-LD `url` |

3. **Enregistrer la zone dans le tracking** : ajouter le `{slug}` au tableau
   `ZONES` de `analytics.js` → le `content_group` GA4 se remplit tout seul.

4. **Référencer dans le SEO** : ajouter l'URL de la zone à `sitemap.xml`.

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
