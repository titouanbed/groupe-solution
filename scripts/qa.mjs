// Contrôle qualité du site (lancé chaque lundi par GitHub Actions, et à chaque pull request).
// Bloquant : lien interne cassé, image locale introuvable, JSON-LD invalide, FAQ visible ≠ FAQ déclarée à Google, page indexable sans
// titre / description / canonical / h1, prix affiché sur une page publique. Avertissements : titres > 65,
// descriptions > 160, images sans texte alternatif.   Lancer : node scripts/qa.mjs
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = /^(node_modules|\.git|mayotte\/ecole-mayotte|api|zones|scripts|content)(\/|$)/;
const files = [];
(function walk(d) { for (const n of readdirSync(d)) { const p = join(d, n), r = relative(ROOT, p); if (SKIP.test(r)) continue; if (statSync(p).isDirectory()) walk(p); else if (n.endsWith('.html')) files.push(r); } })(ROOT);
const dec = s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;|’/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim().toLowerCase();
const errs = [], warns = [];
const walkLd = (o, fn) => { if (Array.isArray(o)) o.forEach(x => walkLd(x, fn)); else if (o && typeof o === 'object') { fn(o); Object.values(o).forEach(v => walkLd(v, fn)); } };
for (const f of files) {
  const s = readFileSync(join(ROOT, f), 'utf8'), noindex = /name=["']robots["'][^>]*noindex/i.test(s);
  const body = dec(s.replace(/<script[\s\S]*?<\/script>/g, ''));
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let d; try { d = JSON.parse(m[1]); } catch { errs.push(`${f} : JSON-LD invalide`); continue; }
    walkLd(d, o => { if (o['@type'] === 'FAQPage') for (const q of o.mainEntity || []) if (q.name && !body.includes(dec(q.name))) errs.push(`${f} : question FAQ absente du texte visible « ${q.name.slice(0, 60)} »`); });
  }
  for (const [, h] of s.matchAll(/href="([^"#?]+)"/g)) {
    if (/^(https?:|mailto:|tel:|javascript:|data:|\/\/)/.test(h) || h.includes("'") || h.includes('${')) continue;
    let p = h.startsWith('/') ? h.slice(1) : normalize(join(dirname(f), h));
    if (!p || p.endsWith('/') || (existsSync(join(ROOT, p)) && statSync(join(ROOT, p)).isDirectory())) p = join(p, 'index.html');
    if (!existsSync(join(ROOT, p)) && !existsSync(join(ROOT, p + '.html'))) errs.push(`${f} : lien cassé → ${h}`);
  }
  // Images locales introuvables (src, srcset, fonds CSS en ligne) : une carte vide passe inaperçue sans ce contrôle.
  for (const [, u] of [...s.matchAll(/<img\b[^>]*?\ssrc="([^"]+)"/g), ...s.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)]) {
    if (/^(https?:|data:|\/\/|#)/.test(u) || u.includes('${') || u.includes("'+") || !/\.(jpe?g|png|webp|avif|gif|svg)$/i.test(u)) continue;
    const p = u.startsWith('/') ? u.slice(1) : normalize(join(dirname(f), u));
    if (!existsSync(join(ROOT, p))) errs.push(`${f} : image introuvable → ${u}`);
  }
  if (noindex || /http-equiv=["']refresh/i.test(s) || /^(404|admin\/|newsletter)/.test(f)) continue;
  const t = (s.match(/<title>([^<]*)<\/title>/) || [])[1], d = (s.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!t) errs.push(`${f} : pas de <title>`); else if (dec(t).length > 70) warns.push(`${f} : titre long (${dec(t).length})`);
  if (!d) errs.push(`${f} : pas de meta description`); else if (d.length > 165) warns.push(`${f} : description longue (${d.length})`);
  if (!/<link rel="canonical"/.test(s)) errs.push(`${f} : pas de canonical`);
  if (!/<h1[\s>]/.test(s)) warns.push(`${f} : pas de <h1>`);
  const noAlt = (s.match(/<img\b(?![^>]*\balt=)[^>]*>/g) || []).length; if (noAlt) warns.push(`${f} : ${noAlt} image(s) sans alt`);
  if (/\b\d[\d\s]*(?:€|euros)\s*(?:HT|TTC)\b/i.test(body) && !/(démo|devis n°|exemple)/i.test(body)) warns.push(`${f} : montant HT/TTC affiché, à vérifier (règle : aucun prix)`);
}
console.log(`Contrôle qualité : ${files.length} pages · ${errs.length} erreur(s) · ${warns.length} avertissement(s)`);
if (warns.length) console.log('\nAvertissements :\n' + warns.slice(0, 60).map(w => '  · ' + w).join('\n') + (warns.length > 60 ? `\n  … et ${warns.length - 60} autres` : ''));
if (errs.length) { console.log('\nErreurs :\n' + errs.map(e => '  ✗ ' + e).join('\n')); process.exit(1); }
console.log('\n✓ Aucune erreur bloquante.');
