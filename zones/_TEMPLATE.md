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
