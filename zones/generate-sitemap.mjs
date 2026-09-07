/* ═══════════════════════════════════════════════════════════
   Génère /sitemap.xml global à partir des pages réellement
   déployées (source de vérité = le filesystem du site).

   Politique d'inclusion :
     • Toute page .html indexable est incluse.
     • Exclues : pages en `noindex`, stubs de redirection
       (<meta http-equiv="refresh">), le sous-arbre ecole-mayotte
       (hors machine SEO, non touché), et les dossiers techniques.
     • L'URL listée est le <link rel="canonical"> de la page si
       présent, sinon reconstruite depuis le chemin (index.html → /).
       → Les redirections canonicalisées sont dédupliquées d'office.

   Priorité / changefreq déduites du type de page (accueil, région,
   ville, blog, holding…).

   Lancer :  node zones/generate-sitemap.mjs
   ═══════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { HOLDING } from './zones.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TODAY = new Date().toISOString().slice(0, 10);

// 1) Toutes les pages HTML versionnées (git = ce qui est réellement publié)
const files = execSync("git ls-files '*.html'", { cwd: ROOT })
  .toString().trim().split('\n').filter(Boolean);

// Date de dernière modif git de chaque fichier (fallback : aujourd'hui)
function lastmod(f) {
  try {
    const d = execSync(`git log -1 --format=%cs -- "${f}"`, { cwd: ROOT }).toString().trim();
    return d || TODAY;
  } catch { return TODAY; }
}

// Type de page → priorité + changefreq
function meta(url, f) {
  const path = url.replace(HOLDING, '') || '/';
  if (path === '/') return { p: '1.0', c: 'weekly' };
  const isBlog = /\/blog\//.test(f);
  const isBlogIndex = /\/blog\/index\.html$/.test(f) || /\/blog\/$/.test(path);
  const isRegion = /\/site-internet-(reunion|mayotte|guyane|martinique|guadeloupe|nouvelle-caledonie|polynesie-francaise)\.html$/.test(f);
  const isCity = /\/site-internet-[a-z-]+\.html$/.test(f) && !isRegion;
  const isArticleHolding = /^articles\//.test(f);
  if (isRegion) return { p: '0.9', c: 'weekly' };
  if (isBlogIndex) return { p: '0.7', c: 'weekly' };
  if (isCity) return { p: '0.8', c: 'monthly' };
  if (isBlog) return { p: '0.6', c: 'monthly' };
  if (isArticleHolding) return { p: '0.6', c: 'monthly' };
  return { p: '0.7', c: 'monthly' }; // pages holding (solutions, implantations, etc.)
}

const seen = new Map(); // url -> {url, lastmod, p, c}
let skipped = { noindex: 0, redirect: 0, ecole: 0, dup: 0 };

for (const f of files) {
  if (/^mayotte\/ecole-mayotte\//.test(f)) { skipped.ecole++; continue; }

  const html = readFileSync(join(ROOT, f), 'utf8');
  const head = html.slice(0, (html.indexOf('</head>') + 1) || html.length);

  if (/<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(head)) { skipped.noindex++; continue; }
  if (/<meta[^>]+http-equiv=["']refresh["']/i.test(head)) { skipped.redirect++; continue; }

  // URL = canonical déclaré, sinon reconstruit depuis le chemin
  let url;
  const can = head.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (can) {
    url = can[1].replace(/^https?:\/\/(www\.)?groupsolution\.fr/i, HOLDING); // normalise le domaine → www
  } else {
    let p = f.replace(/index\.html$/, '');            // dossier → /
    url = HOLDING + '/' + p;
    url = url.replace(/\/$/, m => (p === '' ? '/' : '/')); // conserve le / final des dossiers
    if (f === 'index.html') url = HOLDING + '/';
  }
  url = url.replace(/([^:])\/\//g, '$1/'); // nettoie les doubles slash éventuels

  if (seen.has(url)) { skipped.dup++; continue; }
  const m = meta(url, f);
  seen.set(url, { url, lastmod: lastmod(f), p: m.p, c: m.c });
}

// Tri : accueil, puis holding, puis par priorité décroissante puis alpha
const order = [...seen.values()].sort((a, b) => {
  if (a.url === HOLDING + '/') return -1;
  if (b.url === HOLDING + '/') return 1;
  if (b.p !== a.p) return Number(b.p) - Number(a.p);
  return a.url.localeCompare(b.url);
});

const body = order.map(e =>
  `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.c}</changefreq>
    <priority>${e.p}</priority>
  </url>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`✓ sitemap.xml généré : ${order.length} URL`);
console.log(`  exclues → ecole-mayotte:${skipped.ecole} · redirections:${skipped.redirect} · noindex:${skipped.noindex} · doublons:${skipped.dup}`);
