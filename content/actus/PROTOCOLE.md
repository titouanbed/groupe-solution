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
      "sources": [ { "nom": "Nom du site", "url": "https://…" }, { "nom": "…", "url": "https://…" } ],
      "lien": { "label": "Page liée du site (optionnel)", "url": "../veille/… ou ../../automatisation/" }
    }
  ]
}
```

- 3 à 6 actualités. Moins de 3 actualités vérifiées → **ne rien publier ce jour-là.**
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
