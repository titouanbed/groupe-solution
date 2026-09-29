/* ═══════════════════════════════════════════════════════════
   INDEX DE CONTENU DU SITE — alimente l'assistant et la page /recherche.html.
   Découpe chaque page indexable en passages (titre, description, sections,
   questions/réponses de FAQ). Produit /assets/site-index.json.

   Lancer :  node zones/generate-search-index.mjs   (après les autres générateurs)
   ═══════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { COMMUNES } from './montpellier-communes.mjs';
import { QUARTIERS, METIERS } from './montpellier-plus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = execSync("git ls-files '*.html'", { cwd: ROOT }).toString().trim().split('\n')
  .concat(execSync("git ls-files --others --exclude-standard '*.html'", { cwd: ROOT }).toString().trim().split('\n'))
  .filter(f => f && !/^mayotte\/ecole-mayotte\//.test(f) && !/^_/.test(f));

const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&#x27;/g, '’').replace(/&[a-z]+;/g, ' ');
const clean = s => decode(s.replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const cut = (s, n) => s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s;

const chunks = [];
const seen = new Set();
const seenText = new Set();
const push = c => { const key = c.h + '|' + c.x.slice(0, 120); if (c.h && seenText.has(key)) return false; seenText.add(key); chunks.push(c); return true; };
for (const f of [...new Set(files)]) {
  const html = readFileSync(join(ROOT, f), 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  if (/name=["']robots["'][^>]*noindex/i.test(head) || /http-equiv=["']refresh/i.test(head)) continue;
  const url = '/' + f.replace(/index\.html$/, '');
  if (seen.has(url)) continue; seen.add(url);
  const title = clean((head.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1]).replace(/\s*[|—–-]\s*(GroupSolution|Groupe Solution)$/, '');
  const desc = decode((head.match(/name="description" content="([^"]*)"/) || [, ''])[1]);
  const body = html.slice(html.indexOf('<body'));
  const kind = /^montpellier\/site-internet-.*-montpellier\.html$/.test(f) ? 'metier' : /^montpellier\/site-internet-/.test(f) ? 'site' : /^automatisation\//.test(f) ? 'auto'
    : /guides\//.test(f) ? 'guide' : /lab\/veille\//.test(f) ? 'veille' : /lab\/actus\//.test(f) ? 'actus' : /^outils\//.test(f) ? 'outil' : /^lab\//.test(f) ? 'lab' : f.includes('/') ? 'zone' : 'groupe';
  chunks.push({ u: url, t: title, h: '', x: cut(desc, 300), k: kind });
  // FAQ (accordéons silo et <details>)
  const faqRe = /<div class="faq-q">([\s\S]*?)<\/div>\s*<div class="faq-a">([\s\S]*?)<\/div>|<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g;
  let m, nf = 0;
  while ((m = faqRe.exec(body)) && nf < 6) { if (push({ u: url, t: title, h: clean(m[1] || m[3]), x: cut(clean(m[2] || m[4]), 420), k: kind, q: 1 })) nf++; }
  // Sections : h2/h3 + texte qui suit
  const secRe = /<h[23][^>]*>([\s\S]*?)<\/h[23]>([\s\S]*?)(?=<h[23][^>]*>|<footer|$)/g;
  let ns = 0;
  while ((m = secRe.exec(body)) && ns < 6) {
    const h = clean(m[1]), x = clean(m[2]);
    if (!h || x.length < 80 || /Questions|FAQ|Plan du site/i.test(h)) continue;
    if (push({ u: url, t: title, h, x: cut(x, 360), k: kind })) ns++;
  }
}
/* Connaissances structurées : lieux, métiers, services (intentions de l'assistant). */
const places = [...COMMUNES, ...QUARTIERS].map(c => ({ n: c.name, cp: c.cp, s: c.secteur, site: '/montpellier/' + (c.file || `site-internet-${c.slug}.html`), auto: c.placeType === 'Place' ? '/automatisation/' : `/automatisation/${c.slug}.html`, t: c.tissu }));
const metiers = METIERS.map(m => ({ l: m.label, p: m.plural, u: `/montpellier/site-internet-${m.slug}-montpellier.html` }));
let services = [];
try { services = execSync("ls services/*.html", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim().split('\n').filter(f => !f.endsWith('index.html')).map(f => {
  const h = readFileSync(join(ROOT, f), 'utf8'); return { t: clean((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, f])[1]).replace(/\s+([.,])/g, '$1'), u: '/' + f };
}); } catch {}
writeFileSync(join(ROOT, 'assets', 'site-index.json'), JSON.stringify({ v: 2, n: chunks.length, c: chunks, places, metiers, services }), 'utf8');
/* Même savoir, compact, pour le prompt système de l'assistant IA (api/assistant.mjs). */
const kb = `Pages communes (site internet | automatisation) :\n` + places.map(p => `${p.n} (${p.cp}) : ${p.site} | ${p.auto}`).join('\n') +
  `\n\nPages métiers :\n` + metiers.map(m => `${m.l} : ${m.u}`).join('\n') +
  `\n\nServices :\n` + (services.length ? services.map(s => `${s.t} : ${s.u}`).join('\n') : '(voir /automatisation/ et /montpellier/site-internet-montpellier.html)') +
  `\n\nAutres pages utiles : /outils/configurateur-site-internet.html (configurateur de projet), /outils/test-visibilite-google.html, /outils/calculateur-automatisation.html, /montpellier/guides/ (guides), /lab/ (radar technologique), /lab/api.html, /lab/veille/, /lab/actus/, /realisations.html, /echanger.html#rendez-vous, /plan-du-site.html`;
writeFileSync(join(ROOT, 'api', '_knowledge.mjs'), '// Généré par zones/generate-search-index.mjs — ne pas éditer.\nexport const COMMUNE_COUNT = ' + COMMUNES.length + ';\nexport const SITE_KNOWLEDGE = ' + JSON.stringify(kb) + ';\n', 'utf8');
console.log(`✓ assets/site-index.json : ${chunks.length} passages, ${seen.size} pages, ${(JSON.stringify(chunks).length / 1024).toFixed(0)} Ko`);
