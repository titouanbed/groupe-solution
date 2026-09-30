/* ═══════════════════════════════════════════════════════════
   FINITION SEO — passe finale sur toutes les pages publiques, après les générateurs.
   • <meta description> > 160 caractères : on garde les phrases entières qui tiennent,
     sinon on coupe au dernier mot entier (jamais au milieu d'un mot).
   • <title> > 65 caractères : on retire le suffixe « | Groupe Solution » (la marque reste dans
     les données structurées et le nom du site), et on remplace « — » par « : » raccourci si besoin.
   • og:/twitter: title & description suivent la version corrigée quand ils étaient identiques ;
     pages sans aperçu de partage : balises Open Graph ajoutées (titre, description, URL canonique).
   Lancer : node zones/seo-polish.mjs   (idempotent)
   ═══════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = /^(node_modules|mayotte\/ecole-mayotte|\.git|api|scripts|zones|content)(\/|$)/;
const dec = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const enc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function fitDesc(d, max = 160) {
  d = d.replace(/\s+/g, ' ').trim();
  if (d.length <= max) return d;
  const parts = d.match(/[^.!?…]+[.!?…]+(\s|$)/g) || [];
  let out = '';
  for (const p of parts) { if ((out + p).trim().length <= max) out += p; else break; }
  out = out.trim();
  if (out.length >= 70) return out;
  const cut = d.slice(0, max - 1).replace(/[\s,;:–—-]+\S*$/, '').replace(/[\s,;:–—-]+$/, '');
  return cut + '…';
}
export function fitTitle(t, max = 65) {
  t = t.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const noBrand = t.replace(/\s*[|–—-]\s*Groupe ?Solution[^|]*$/i, '').trim();
  return noBrand.length >= 20 ? noBrand : t;
}

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n), r = relative(ROOT, p);
    if (SKIP.test(r)) continue;
    if (statSync(p).isDirectory()) walk(p, out); else if (n.endsWith('.html')) out.push(p);
  }
  return out;
}

let nd = 0, nt = 0, no = 0;
for (const f of walk(ROOT)) {
  const s = readFileSync(f, 'utf8');
  if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(s)) continue;
  let o = s;
  const md = o.match(/<meta name="description" content="([^"]*)"/);
  if (md) {
    const old = dec(md[1]), neu = fitDesc(old);
    if (neu !== old) {
      nd++;
      o = o.split(`content="${md[1]}"`).join(`content="${enc(neu)}"`);
    }
  }
  const mt = o.match(/<title>([^<]*)<\/title>/);
  if (mt) {
    const old = dec(mt[1]), neu = fitTitle(old);
    if (neu !== old) {
      nt++;
      o = o.replace(mt[0], `<title>${enc(neu)}</title>`).split(`content="${mt[1]}"`).join(`content="${enc(neu)}"`);
    }
  }
  // Aperçu de partage (LinkedIn, WhatsApp…) : ajouté quand la page n'en a pas.
  if (!/property=["']og:title["']/.test(o)) {
    const t = (o.match(/<title>([^<]*)<\/title>/) || [])[1], d = (o.match(/<meta name="description" content="([^"]*)"/) || [])[1];
    const c = (o.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (t && d && c) {
      no++;
      o = o.replace('</head>', `  <meta property="og:type" content="website" />\n  <meta property="og:site_name" content="Groupe Solution" />\n  <meta property="og:title" content="${t}" />\n  <meta property="og:description" content="${d}" />\n  <meta property="og:url" content="${c}" />\n  <meta property="og:image" content="https://www.groupsolution.fr/assets/og-accueil.jpg" />\n  <meta name="twitter:card" content="summary_large_image" />\n</head>`);
    }
  }
  if (o !== s) writeFileSync(f, o, 'utf8');
}
console.log(`✓ Finition SEO : ${nd} descriptions et ${nt} titres ajustés, ${no} aperçus de partage ajoutés`);
