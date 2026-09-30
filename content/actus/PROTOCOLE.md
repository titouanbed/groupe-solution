# Protocole de publication des actus quotidiennes

Ce protocole est suivi à la lettre par l'agent automatique qui publie chaque matin, sans relecture humaine.
Règle d'or : **dans le doute, on ne publie pas.** Un jour sans actus vaut mieux qu'une seule erreur en ligne.

## 1. Collecte (actualités des 7 derniers jours au maximum)

Thèmes, par ordre de priorité pour nos lecteurs (dirigeants de TPE/PME, artisans, commerçants, professions libérales) :
1. Réglementation qui les touche : facturation électronique, AI Act, RGPD / CNIL, cybersécurité (NIS 2), identité numérique, accessibilité.
2. IA utile en entreprise : nouveaux modèles et outils majeurs, agents IA, agents vocaux, lecture de documents, standards (MCP…).
3. IA et numérique en France et en Europe : acteurs français/européens, annonces publiques, open data, services publics numériques.
4. Cybersécurité : alertes majeures concernant les TPE/PME (sources officielles : ANSSI, cybermalveillance.gouv.fr, CNIL).

Exclus : rumeurs, fuites, tribunes d'opinion, levées de fonds mineures, faits divers, sujets politiques partisans, cours de bourse.

## 2. Vérification (obligatoire pour chaque actualité)

- Rechercher le sujet avec l'outil de recherche web, **au moins 2 requêtes différentes**.
- Retenir une actualité **uniquement si au moins 2 sources indépendantes (domaines différents)** confirment les mêmes faits :
  date, acteurs, chiffres. Privilégier la source primaire (site officiel de l'organisme, communiqué, Journal officiel,
  service-public.fr, economie.gouv.fr, cnil.fr, europa.eu, blog officiel de l'entreprise) + un média reconnu.
- Si deux sources divergent sur un chiffre ou une date : ne pas citer ce chiffre, ou abandonner l'actualité.
- Ne jamais extrapoler : écrire uniquement ce que les sources disent, au passé ou au présent, sans « devrait », « pourrait » inventés.
- Réseaux sociaux, vidéos et agrégateurs anonymes ne comptent pas comme sources.
- Ne jamais reprendre une actualité déjà publiée dans les 21 derniers jours (voir les fichiers existants).

## 3. Rédaction

Fichier `content/actus/AAAA-MM-JJ.json` (date du jour, heure de Paris) :

```json
{
  "date": "AAAA-MM-JJ",
  "titre": "Titre du numéro (les 2 ou 3 sujets forts)",
  "intro": "2 phrases qui résument la journée pour un dirigeant.",
  "items": [
    {
      "cat": "Réglementation | IA | IA européenne | IA & données | Identité numérique | Cybersécurité | Numérique | Données | Automatisation | Entreprises | Open data | Infrastructures",
      "titre": "Titre factuel (≤ 120 caractères)",
      "resume": "Les faits vérifiés, datés, sourcés (120 à 900 caractères).",
      "pourquoi": "Ce que ça change concrètement pour une entreprise, sans exagération.",
      "action": "À faire cette semaine : une action concrète et réaliste pour une TPE/PME (30 à 280 caractères, facultatif mais recommandé).",
      "sources": [ { "nom": "Nom du site", "url": "https://…" }, { "nom": "…", "url": "https://…" } ],
      "lien": { "label": "Page liée du site (optionnel)", "url": "../veille/… ou ../../automatisation/" }
    }
  ]
}
```

- 3 à 6 actualités. Moins de 3 actualités vérifiées → **ne rien publier ce jour-là.**
- Chaque actu doit être **utile à un dirigeant** : `pourquoi` explique l'impact réel, `action` donne le geste concret de la semaine (vérifier un paramètre, poser une question à son expert-comptable, tester un outil gratuit…). Jamais de conseil juridique ou fiscal péremptoire : on renvoie vers le professionnel compétent.
- Privilégier ce que les autres ne font pas : l'angle PME française et outre-mer, la date qui compte, l'action à mener.
- Français, vouvoiement, ton sobre et factuel.
- Jamais de prix de nos prestations (tout est sur devis), jamais de client cité, jamais de chiffre non sourcé.
- `lien` : seulement vers une page qui existe (`lab/veille/*.html`, `lab/api.html`, `automatisation/`, `outils/…`).

## 4. Contrôle et publication

```bash
node scripts/verify-actus.mjs content/actus/AAAA-MM-JJ.json   # doit afficher ✓, sinon corriger ou abandonner
npm run actus                                                 # pages, RSS, accueil, Lab, plan, index, sitemap
git add -A && git commit -m "Actus du AAAA-MM-JJ" && git push origin main
```

Si le contrôle échoue et qu'une correction n'est pas possible sans affaiblir la vérification : supprimer le fichier et ne rien publier.

---

# Passage flash de mi-journée (lundi au vendredi)

Objectif : que le site suive l'actualité en temps réel sans jamais baisser l'exigence.
- Chercher les actualités **des 12 dernières heures** sur les mêmes thèmes (au moins 3 requêtes WebSearch).
- Ne retenir que ce qui est **majeur pour une TPE/PME** (réglementation publiée, alerte cyber officielle, sortie d'un outil IA de premier plan) et **confirmé par 2 sources indépendantes**.
- S'il existe déjà un fichier du jour : **ajouter** l'actu à ses `items` (6 au maximum). Sinon, ne publier que si l'on atteint 3 actus vérifiées.
- Rien de majeur ou de vérifié → **ne rien publier, ne rien commiter**. C'est le cas normal.
- Contrôle, `npm run actus`, commit « Actus flash du AAAA-MM-JJ », push : comme le matin.

# Publications complémentaires (même exigence de vérité)

Calendrier (heure de Paris), en plus des actus quotidiennes :
- **Lundi** : un **dossier de fond** → `content/dossiers/AAAA-MM-JJ-slug.json` (page `/lab/dossiers/slug.html`).
- **Mardi et jeudi** : une **question de dirigeant** → `content/questions/slug.json` (page `/lab/questions/slug.html`).

Les actus du jour passent toujours en premier. Si le temps ou la vérification manquent, on publie les actus seules.

## Dossier (lundi)

- Sujet : le thème le plus important des 7 à 14 derniers jours pour une TPE/PME (réglementation, IA utile, cybersécurité, données), jamais déjà traité dans `content/dossiers/` ni `lab/veille/`.
- 1 200 à 1 800 mots utiles : situations concrètes, étapes pratiques, pièges à éviter. Pas de remplissage.
- Format : `date`, `slug`, `cat`, `titre` (≤ 90 car.), `description` (140–160 car.), `chapo`, `sections` [{`h2`, `paragraphes`[], `liste`[] optionnelle}] (5 à 7), `aRetenir` (3–5), `faq` [{`q`,`a`}] (4–5, formulées comme on les tape dans Google), `sources` (≥ 4, ≥ 3 domaines), `liens` (2–4 pages internes existantes, chemins relatifs depuis `/lab/dossiers/`).
- Chaque date, chiffre, nom de texte ou d'organisme : confirmé par ≥ 2 sources indépendantes (dont la source officielle si elle existe).

## Question (mardi, jeudi)

- Prendre la première question non traitée de `content/questions/A-TRAITER.md` (ou une question plus actuelle vue pendant la veille), la reformuler telle qu'un dirigeant la taperait, et la cocher dans le fichier une fois publiée.
- Format : `date`, `slug`, `cat`, `question` (finit par « ? »), `description` (140–160 car.), `reponseCourte` (2–3 phrases, ≤ 320 car.), `sections` (3 à 5, 600 à 1 000 mots), `sources` (≥ 3, ≥ 2 domaines), `liens` (1–3 pages internes existantes, chemins relatifs depuis `/lab/questions/`).

## Contrôle et publication

```bash
node scripts/verify-content.mjs content/dossiers/AAAA-MM-JJ-slug.json   # ou content/questions/slug.json
npm run publish        # actus + dossiers + questions + Lab + plan + index + sitemap
```
Contrôle en échec et correction impossible sans affaiblir la vérification → supprimer le fichier, ne pas le publier.
Rédaction signée « La rédaction de Groupe Solution » (générée automatiquement par le site) : ne jamais écrire à la première personne au nom de Titouan.

## Laboratoire d'idées (mercredi et vendredi)

- Ajouter **2 nouvelles idées** dans `content/idees/secteurs.json`, dans le secteur qui a le moins d'idées (à égalité : ordre du fichier), en s'inspirant des actualités vérifiées de la semaine (nouveau modèle, nouvel outil, nouvelle donnée ouverte, nouvelle réglementation).
- Niveau exigé : une **rupture** qui change l'expérience du client final ou le modèle économique (voir la doctrine dans `api/_innovation.mjs`), jamais un simple réglage ; au moins une des deux idées avec `audace` 3.
- Même format que les idées existantes (`titre`, `probleme`, `idee`, `techno`, `local`, `audace`), réalisables aujourd'hui, jamais de prix, de client, de chiffre inventé ; le champ `local` décline l'idée pour un territoire précis (littoral, rural, grande ville, outre-mer).
- Contrôle : `node -e "JSON.parse(require('fs').readFileSync('content/idees/secteurs.json','utf8'))"` puis `npm run publish` (qui régénère aussi `/idees/`).
