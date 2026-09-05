# ecole-mayotte/

Site statique du projet Academy Mayotte, à déposer **à la racine** du dépôt `groupe-solution` existant (Vercel), à côté de `api/`, `articles/`, `scripts/`, etc. — sans rien y toucher. URL finale prévue : `groupsolution.fr/ecole-mayotte`.

Aucun framework, aucun build step : HTML/CSS/JS statiques, déposables tels quels.

## Arborescence

```
ecole-mayotte/
├── index.html              ← le socle : les 11 sections, dans l'ordre, texte figé
├── README.md                ← ce fichier
├── assets/
│   ├── style.css            ← design partagé (Sora + Inter, fond blanc, lagon = seul accent)
│   └── main.js               ← retour d'annexe à la bonne ancre, sélecteur de profil, envoi du formulaire
└── annexes/
    ├── certificat.html       ← maquette visuelle du certificat d'Implémentation de l'IA en Entreprise
    ├── cprdfop.html          ← le CPRDFOP Mayotte 2023-2027 et ses 4 fiches actions
    ├── financement.html      ← France 2030 régionalisé Mayotte + autres dispositifs (contient l'ancre #france2030)
    ├── modele-economique.html← NPEC, trésorerie, écoles identifiées
    ├── ecosysteme.html       ← GIP FCIP, GRETA-CFA (OIDF : encore à documenter, placeholder en place)
    ├── ia.html               ← prévue, pas encore rédigée ("cette preuve arrive bientôt")
    ├── formation.html        ← idem
    └── chiffres.html         ← idem
```

## Le logo

Le site réutilise `Logo.svg` (et `Logo-light.svg` sur fond sombre) déjà présents à la racine du dépôt, via des chemins relatifs :
- depuis `index.html` : `../Logo.svg`
- depuis une page d'`annexes/` : `../../Logo.svg`

Aucun fichier logo n'a été créé ni dupliqué dans ce dossier. Si l'image ne charge pas (`onerror`), le texte "Groupe Solution" reste affiché seul — jamais d'icône cassée.

## Navigation entre le socle et les annexes

Chaque affirmation sourcée du socle porte un lien (`class="src"`, seul élément coloré du texte) vers son annexe, avec un paramètre `?from=section-X` qui indique d'où on vient. Le bouton **← Retour** de chaque annexe lit ce paramètre en JS (`assets/main.js`) et ramène exactement à cette ancre — jamais en haut de page. Deux sections du socle (4 et 7) renvoient vers l'annexe CPRDFOP ; ça fonctionne dans les deux sens grâce à ce paramètre.

Les annexes pas encore écrites (`ia.html`, `formation.html`, `chiffres.html`, et la partie OIDF de `ecosysteme.html`) affichent un message propre "Cette preuve arrive bientôt" — jamais de 404, jamais de lien mort.

## Photos

Les emplacements photo sont des cadres pointillés avec une légende ("Photo à venir — ..."). Aucune image générée ni banque d'images : à remplacer par les vraies photos quand elles seront disponibles (section 1 : terrain ; section 10 : Titouan et Gilles Bedos).

## Le formulaire de contact — ce qu'il reste à faire

Le formulaire (section 11) est fonctionnel côté code (sélecteur de profil, validation, message de confirmation inline) et pointe vers Formspree, mais **il ne peut pas encore réellement envoyer d'email** :

1. Formspree exige aujourd'hui un compte et un identifiant de formulaire (le mode "juste une adresse email, sans inscription" n'existe plus chez eux) — je ne peux pas créer ce compte à ta place.
2. Va sur [formspree.io](https://formspree.io), crée un compte gratuit, crée un formulaire avec `contact@groupsolution.fr` comme destinataire.
3. Dans `index.html`, remplace `YOUR_FORM_ID` dans `action="https://formspree.io/f/YOUR_FORM_ID"` par l'identifiant fourni.
4. Formspree envoie un email de confirmation à `contact@groupsolution.fr` dès le premier essai — il faut le valider depuis cette boîte mail pour que les envois suivants arrivent réellement.

Tant que ces 4 étapes ne sont pas faites, le formulaire affichera une erreur d'envoi (comportement volontaire et déjà géré dans `main.js`, pas un bug).

## Ce qui reste ouvert avant mise en ligne

- Nom du DAFPIC / contact GIP FCIP Mayotte non confirmé pour la période en cours (signalé dans `ecosysteme.html`).
- Contenu OIDF non recherché à ce stade (signalé en commentaire HTML dans `ecosysteme.html`, à l'attention de l'Agent 2).
- Formulaire Formspree à activer (voir ci-dessus).
- Logo, photos : en attente des vrais fichiers.
