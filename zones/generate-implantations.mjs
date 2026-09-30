/* ═══════════════════════════════════════════════════════════
   Génère /implantations.html (page holding) à partir du registre central
   zones/zones.mjs. Ajouter un territoire dans le registre + relancer ce
   script → la page « Nos Implantations » est à jour automatiquement.

   Lancer :  node zones/generate-implantations.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ZONES } from './zones.mjs';
import { COMMUNES } from './montpellier-communes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function chips(zone) {
  if (zone.status === 'coming') {
    // villes préparées, non cliquables tant que les pages ne sont pas générées
    return zone.cities.map(c => `<span class="soon">${esc(c.name)}</span>`).join('\n          ');
  }
  if (zone.cities && zone.cities.length) {
    return zone.cities.map(c => `<a href="${zone.slug}/site-internet-${c.slug}.html">${esc(c.name)}</a>`).join('\n          ');
  }
  if (zone.implantChips) {
    return zone.implantChips.map(c => `<a href="${esc(c.href)}">${esc(c.label)}</a>`).join('\n          ');
  }
  return '';
}

function card(zone) {
  const online = zone.status !== 'coming';
  const state = online
    ? `<span class="terrState">En ligne</span>`
    : `<span class="terrState soon">En préparation</span>`;
  const hasBlog = online && ((zone.cities && zone.cities.some(c => c.faq)) || zone.region);
  const go = online
    ? `<div class="terrGo"><a class="go" href="${zone.slug}/${zone.regionPage}">${zone.slug === 'mayotte' ? 'Titouan à Mayotte' : 'Nos solutions ' + (/^[AEIOUÉ]/.test(zone.name) ? 'en ' : 'à ') + esc(zone.name)} →</a>${hasBlog ? `<a class="go2" href="${zone.slug}/${zone.guides ? zone.guides[0].href : 'blog/'}">Guides &amp; conseils ${esc(zone.name)} →</a>` : ''}</div>`
    : `<div class="terrGo"><span class="soonNote">Bientôt disponible</span></div>`;
  return `      <div class="terrCard reveal">
        <div class="terrTop"><span class="terrCode">${esc(zone.name)} · ${esc(zone.code)}</span>${state}</div>
        <h3>${esc(zone.name)}</h3>
        <p>${esc(zone.implantTagline)}</p>
        <div class="terrChips">
          ${chips(zone)}
        </div>
        ${go}
      </div>`;
}


/* Carte Montpellier (base du groupe) — pilotée par zones/montpellier-communes.mjs */
const TOP = ['castelnau-le-lez', 'lattes', 'perols', 'vendargues', 'clapiers', 'saint-jean-de-vedas', 'meze', 'villeveyrac', 'sete'];
const montpellierCard = `      <div class="terrCard reveal">
        <div class="terrTop"><span class="terrCode">Hérault · 34</span><span class="terrState">En ligne</span></div>
        <h3>Montpellier &amp; Hérault</h3>
        <p>Notre agence est à Saint-Jean-de-Védas, aux portes de Montpellier : création de sites, référencement local et automatisation sur-mesure pour les entreprises de Montpellier et de ${COMMUNES.length} communes alentour — de la Métropole au bassin de Thau.</p>
        <div class="terrChips">
          ${TOP.map(sl => COMMUNES.find(c => c.slug === sl)).map(c => `<a href="montpellier/site-internet-${c.slug}.html">${esc(c.name)}</a>`).join('\n          ')}
        </div>
        <div class="terrGo"><a class="go" href="montpellier/site-internet-montpellier.html">Notre agence de Saint-Jean-de-Védas →</a><a class="go2" href="automatisation/">Automatisation &amp; logiciel sur-mesure →</a></div>
      </div>`;

const cards = [ZONES[0], null, ...ZONES.slice(1)].map(z => z ? card(z) : montpellierCard).join('\n\n');

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nos implantations — Montpellier, La Réunion, Mayotte, Antilles, Guyane, Pacifique | Groupe Solution</title>
  <meta name="description" content="Les implantations locales de Groupe Solution : Montpellier et ${COMMUNES.length} communes de l'Hérault et du Gard, La Réunion, Mayotte, Guyane, Martinique, Guadeloupe, Nouvelle-Calédonie et Polynésie française." />
  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
  <link rel="canonical" href="https://www.groupsolution.fr/implantations.html" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="Groupe Solution" />
  <meta property="og:title" content="Nos implantations — Montpellier, La Réunion, Mayotte, Antilles, Guyane, Pacifique | Groupe Solution" />
  <meta property="og:description" content="Les implantations locales de Groupe Solution : Montpellier et ${COMMUNES.length} communes de l'Hérault et du Gard, La Réunion, Mayotte, Guyane, Martinique, Guadeloupe, Nouvelle-Calédonie et Polynésie française." />
  <meta property="og:url" content="https://www.groupsolution.fr/implantations.html" />
  <meta property="og:image" content="https://www.groupsolution.fr/assets/visuel-solutions.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  <style>
    .impSection{padding:64px 0 110px;background:var(--paper)}
    .impHead{max-width:640px;margin-bottom:44px}
    .impHead h2{font-size:clamp(28px,3.4vw,46px);line-height:1.04;letter-spacing:-.02em;margin-top:14px}
    .impHead p{color:var(--secondary);line-height:1.75;font-size:15px;margin-top:16px}

    .terr{display:grid;grid-template-columns:1fr 1fr;gap:24px}
    .terrCard{border:1px solid var(--line);background:var(--white);border-radius:var(--r-l);box-shadow:var(--sh-s);padding:36px;display:flex;flex-direction:column;transition:transform .3s var(--ease),box-shadow .3s var(--ease),border-color .3s}
    .terrCard:hover{transform:translateY(-4px);box-shadow:var(--sh-l);border-color:var(--line2)}
    .terrTop{display:flex;align-items:center;gap:12px;margin-bottom:14px}
    .terrCode{font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--olive2);font-weight:800;background:var(--olive-soft);padding:6px 12px;border-radius:999px}
    .terrState{margin-left:auto;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--green);font-weight:800;background:var(--green-soft);padding:6px 12px;border-radius:999px;display:inline-flex;align-items:center;gap:6px}
    .terrState::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--green)}
    .terrState.soon{color:var(--amber);background:var(--amber-soft)}
    .terrState.soon::before{background:var(--amber)}
    .terrCard h3{font-family:var(--serif);font-weight:500;font-size:clamp(24px,2.6vw,32px);line-height:1.08;letter-spacing:-.02em}
    .terrCard p{color:var(--secondary);font-size:14.5px;line-height:1.7;margin-top:12px}
    .terrChips{display:flex;flex-wrap:wrap;gap:9px;margin-top:20px}
    .terrChips a,.terrChips span{font-size:13px;font-weight:700;border-radius:999px;padding:8px 15px;border:1px solid var(--line)}
    .terrChips a{color:var(--olive2);background:var(--sand);transition:border-color .2s,color .2s,background .2s}
    .terrChips a:hover{border-color:var(--olive);color:var(--ink);background:var(--olive-soft)}
    .terrChips span{color:var(--muted);background:var(--paper);border-style:dashed}
    .terrGo{margin-top:auto;padding-top:22px;display:flex;flex-direction:column;gap:9px;align-items:flex-start}
    .terrGo .go{font-size:14px;font-weight:800;color:var(--acc);display:inline-flex;align-items:center;gap:7px;transition:gap .2s var(--ease)}
    .terrGo .go:hover{gap:10px}
    .terrGo .go2{font-size:13.5px;font-weight:700;color:var(--olive2);text-decoration:none;transition:color .2s}
    .terrGo .go2:hover{color:var(--ink)}
    .terrGo .soonNote{font-size:13px;font-weight:700;color:var(--muted)}

    .impCta{margin-top:56px;background:var(--white);border:1px solid var(--line);border-radius:var(--r-xl);box-shadow:var(--sh-m);padding:clamp(34px,4vw,54px);display:flex;justify-content:space-between;align-items:center;gap:36px;flex-wrap:wrap}
    .impCta p{font-family:var(--serif);font-weight:500;font-size:clamp(24px,3vw,36px);line-height:1.12;letter-spacing:-.02em;max-width:620px}

    @media(max-width:820px){.terr{grid-template-columns:1fr}}
  </style>
  <script type="application/ld+json">{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Groupe Solution", "item": "https://www.groupsolution.fr/"}, {"@type": "ListItem", "position": 2, "name": "Implantations", "item": "https://www.groupsolution.fr/implantations.html"}]}</script>
</head>
<body>
<header class="nav"><div class="wrap navin">
  <a class="brand" href="index.html" aria-label="Groupe Solution — accueil"><img src="Logo.svg" alt="Groupe Solution" /></a>
  <nav class="links"><a href="articles/">Ressources</a>
    <a href="solutions.html">Solutions</a>
    <a href="realisations.html">Réalisations</a>
    <a href="partenariats.html">Partenariats</a>
    <a href="automatisation/">Automatisation</a>
    <a href="implantations.html" class="active">Implantations</a>
    <a href="a-propos.html">À propos</a>
    <a class="cta" href="echanger.html">Échanger ↗</a>
  </nav>
</div></header>

<main>
  <section class="phead"><div class="wrap">
    <div class="kicker reveal">Implantations</div>
    <h1 class="reveal">Présents là où <i>vous êtes</i>.</h1>
    <p class="lead reveal">Notre agence est à Saint-Jean-de-Védas, dans la métropole de Montpellier, et Titouan Bedos, notre fondateur, est à Mayotte. De là, Groupe Solution accompagne les entreprises de l’Hérault, de Mayotte, de toute la France et de l’outre-mer : mêmes moteurs, même technologie, adaptés à chaque territoire.</p>
  </div></section>

  <section class="impSection"><div class="wrap">
    <div class="impHead reveal"><div class="kicker">Nos territoires</div><h2>Chaque territoire a ses réalités.</h2><p>Ses secteurs, ses contraintes, ses clients : nos pages et nos solutions sont pensées pour chacun d’eux, avec la même exigence.</p></div>

    <div class="terr">
${cards}
    </div>

    <div class="impCta reveal">
      <p>Votre entreprise est ailleurs&nbsp;? Nous travaillons avec les entreprises de toute la France.</p>
      <a class="btn" href="echanger.html">Parlons de votre projet →</a>
    </div>
  </div></section>
</main>

<footer><div class="wrap foot">
  <span class="footBrand"><img src="Logo.svg" alt="Groupe Solution" /> © <span id="year"></span> Groupe Solution</span>
  <nav>
    <a href="solutions.html">Solutions</a>
    <a href="realisations.html">Réalisations</a>
    <a href="partenariats.html">Partenariats</a>
    <a href="implantations.html">Implantations</a>
    <a href="a-propos.html">À propos</a>
    <a href="echanger.html">Échanger</a>
    <a href="plan-du-site.html">Plan du site</a>
  </nav>
</div></footer>

<script src="site.js"></script>
<script src="/analytics.js" defer></script>
</body>
</html>
`;

writeFileSync(join(ROOT, 'implantations.html'), html, 'utf8');
console.log('✓ implantations.html régénérée depuis le registre (' + ZONES.length + ' territoires).');
