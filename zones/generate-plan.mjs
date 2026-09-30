/* ═══════════════════════════════════════════════════════════
   PLAN DU SITE (HTML) — toutes les pages indexables, regroupées par rubrique.
   Produit : /plan-du-site.html   (lancer après tous les générateurs)
   ═══════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { HOLDING } from './zones.mjs';
import { esc } from './lib-local.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const list = cmd => execSync(cmd, { cwd: ROOT }).toString().trim().split('\n').filter(Boolean);
const files = [...new Set([...list("git ls-files '*.html'"), ...list("git ls-files --others --exclude-standard '*.html'")])]
  .filter(f => !/^mayotte\/ecole-mayotte\//.test(f) && f !== 'plan-du-site.html' && !/^_/.test(f));

const ZONE_NAMES = { reunion: 'La Réunion', mayotte: 'Mayotte', guyane: 'Guyane', martinique: 'Martinique', guadeloupe: 'Guadeloupe', 'nouvelle-caledonie': 'Nouvelle-Calédonie', 'polynesie-francaise': 'Polynésie française' };
function group(f) {
  if (!f.includes('/')) return ['1', 'Groupe Solution'];
  if (f.startsWith('services/')) return ['1s', 'Nos services — site internet, IA, automatisation, logiciel'];
  if (f.startsWith('automatisation/')) return ['2', 'Automatisation & logiciel sur-mesure — Montpellier et Hérault'];
  if (/^montpellier\/guides\//.test(f)) return ['5', 'Guides pratiques'];
  if (/^montpellier\/site-internet-.*-montpellier\.html$/.test(f)) return ['3b', 'Site internet par métier'];
  if (/^montpellier\/site-internet-montpellier-/.test(f)) return ['3a', 'Site internet — quartiers de Montpellier'];
  if (f.startsWith('montpellier/')) return ['3', 'Création de site internet — Montpellier, Hérault et Gard'];
  if (f.startsWith('lab/actus/')) return ['6b', 'Actus IA & numérique'];
  if (f.startsWith('idees/')) return ['6e', 'Laboratoire d’idées'];
  if (f.startsWith('lab/dossiers/')) return ['6c', 'Dossiers de la semaine'];
  if (f.startsWith('lab/questions/')) return ['6d', 'Questions de dirigeants'];
  if (f.startsWith('lab/veille/')) return ['6a', 'Veille'];
  if (f.startsWith('lab/')) return ['6', 'Lab : innovation, API et données'];
  if (f.startsWith('outils/')) return ['4', 'Outils gratuits'];
  if (f.startsWith('articles/')) return ['7', 'Ressources'];
  const z = f.split('/')[0];
  if (ZONE_NAMES[z]) return ['8' + z, 'Territoire : ' + ZONE_NAMES[z]];
  return ['9', 'Autres pages'];
}

const groups = new Map();
for (const f of files) {
  const html = readFileSync(join(ROOT, f), 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  if (/name=["']robots["'][^>]*noindex/i.test(head) || /http-equiv=["']refresh/i.test(head)) continue;
  const title = (head.match(/<title>([\s\S]*?)<\/title>/) || [, f])[1].replace(/\s*[|—–]\s*(GroupSolution|Groupe Solution)\s*$/, '').replace(/&amp;/g, '&').trim();
  const [k, label] = group(f);
  if (!groups.has(k)) groups.set(k, { label, items: [] });
  groups.get(k).items.push({ href: f.replace(/index\.html$/, '') || './', title });
}
const sorted = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
sorted.forEach(([, g]) => g.items.sort((a, b) => a.title.localeCompare(b.title, 'fr')));
const total = sorted.reduce((n, [, g]) => n + g.items.length, 0);

const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plan du site | Groupe Solution</title>
  <meta name="description" content="Plan du site Groupe Solution : ${total} pages — automatisation, sites internet par commune, quartier et métier, guides, Lab, veille, actus et territoires." />
  <link rel="canonical" href="${HOLDING}/plan-du-site.html" />
  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/holding-local.css" />
  <style>
    .plan{columns:3 280px;column-gap:36px}
    .pg{break-inside:avoid;margin-bottom:30px}
    .pg h2{font-size:21px;font-weight:600;margin-bottom:10px}
    .pg h2 small{font-family:var(--sans);font-size:12px;color:var(--muted);font-weight:700;margin-left:6px}
    .pg ul{list-style:none;display:grid;gap:4px}
    .pg a{font-size:14px;color:var(--secondary)}.pg a:hover{color:var(--acc)}
  </style>
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Plan du site', item: HOLDING + '/plan-du-site.html' }] })}</script>
</head>
<body>
<header class="nav"><div class="wrap navin"><a class="brand" href="index.html" aria-label="Groupe Solution — accueil"><img src="Logo.svg" alt="Groupe Solution" /></a><nav class="links"><a href="automatisation/">Automatisation</a><a href="montpellier/site-internet-montpellier.html">Sites internet</a><a href="lab/">Lab</a><a href="recherche.html">Rechercher</a><a class="cta" href="tel:+33782298559">07 82 29 85 59</a></nav></div></header>
<main>
  <div class="wrap crumbs"><a href="index.html">Groupe Solution</a> › <span>Plan du site</span></div>
  <section class="sec" style="padding-top:30px"><div class="wrap">
    <div class="secHead"><div class="kicker">${total} pages</div><h1 style="font-size:clamp(32px,4.4vw,48px);margin-top:14px">Plan du site</h1><p>Toutes nos pages, de l'accueil aux ${groups.get('3')?.items.length || 0} pages communes. Vous cherchez quelque chose de précis ? <a href="recherche.html" style="font-weight:800;border-bottom:2px solid var(--acc)">Rechercher</a>.</p></div>
    <div class="plan">
${sorted.map(([, g]) => `      <div class="pg"><h2>${esc(g.label)}<small>${g.items.length}</small></h2><ul>${g.items.map(i => `<li><a href="${esc(i.href)}">${esc(i.title)}</a></li>`).join('')}</ul></div>`).join('\n')}
    </div>
  </div></section>
</main>
<footer><div class="wrap foot"><span class="footBrand"><img src="Logo.svg" alt="Groupe Solution" /> © <span id="year"></span> Groupe Solution</span><nav><a href="index.html">Accueil</a><a href="recherche.html">Rechercher</a><a href="echanger.html">Échanger</a></nav></div></footer>
<script src="assets/holding-local.js" defer></script>
<script src="/analytics.js" defer></script>
</body>
</html>
`;
writeFileSync(join(ROOT, 'plan-du-site.html'), html, 'utf8');
console.log(`✓ plan-du-site.html : ${total} pages en ${sorted.length} rubriques`);
