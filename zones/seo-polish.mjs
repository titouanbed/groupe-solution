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
export function fitTitle(t, max = 65, hard = 70) {
  t = t.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const noBrand = t.replace(/\s*[|–—-]\s*Groupe? ?Solution[^|]*$/i, '').trim();
  t = noBrand.length >= 20 ? noBrand : t;
  if (t.length <= hard) return t;
  // 1. Une accroche après « : » ou « — » : on garde la partie principale si elle se suffit.
  const m = t.match(/^(.{30,}?)\s+[:—–|]\s+.{12,}$/);
  if (m && m[1].length <= hard) return m[1].replace(/[\s,;:]+$/, '');
  // 2. Énumérations : on retire les éléments du milieu, en partant de la fin (la ville reste).
  let u = t, prev;
  do { prev = u; u = u.replace(/,\s[^,:—–|]+?(?=,\s|\s(?:et|ou)\s)(?!.*,\s[^,:—–|]+?(?:,\s|\s(?:et|ou)\s))/, ''); } while (u.length > hard && u !== prev);
  if (u.length <= hard) return u;
  // 3. Dernier recours : coupe au dernier mot entier, sans mot de liaison en fin — en gardant le lieu final.
  const lieu = (u.match(/\s(?:à|en|au|aux|dans)\s[A-ZÀ-Ý][^,:—–|]{2,30}$/) || [''])[0];
  const cut = s => s.replace(/\s+\S*$/, '').replace(/(\s+(de|des|du|d’|d'|à|au|aux|pour|et|ou|le|la|les|en|sur|avec|un|une))+$/i, '').replace(/[\s,;:–—-]+$/, '');
  if (lieu && lieu.length < 36) return cut(u.slice(0, u.length - lieu.length).slice(0, hard - lieu.length + 1)) + lieu;
  return u.slice(0, hard + 1).replace(/\s+\S*$/, '').replace(/(\s+(de|des|du|d’|d'|à|au|aux|pour|et|ou|le|la|les|en|sur|avec|un|une))+$/i, '').replace(/[\s,;:–—-]+$/, '');
}

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n), r = relative(ROOT, p);
    if (SKIP.test(r)) continue;
    if (statSync(p).isDirectory()) walk(p, out); else if (n.endsWith('.html')) out.push(p);
  }
  return out;
}

// Titres réécrits à la main quand la coupe automatique perdrait le sens (ou le lieu).
const TITRES = {
  'articles/partenariat-techno-metier-partage-valeur.html': 'Partenariat techno-métier : qui apporte quoi, qui gagne quoi',
  'lab/questions/agent-vocal-ia-legal-france.html': 'Agent vocal IA : peut-il légalement répondre à votre téléphone ?',
  'lab/questions/chatgpt-donnees-clients-rgpd.html': 'ChatGPT et données clients : que permet le RGPD ?',
  'montpellier/site-internet-organisme-de-formation-montpellier.html': 'Site internet pour organisme de formation à Montpellier',
  'montpellier/site-internet-services-a-domicile-montpellier.html': 'Site internet pour services à domicile à Montpellier',
  'nouvelle-caledonie/secteurs/batiment-artisans.html': 'Site internet pour une entreprise de BTP en Nouvelle-Calédonie',
  'polynesie-francaise/secteurs/tourisme-hebergement.html': 'Site internet pour pension ou hébergement en Polynésie française',
  'guyane/site-internet-saint-laurent-du-maroni.html': 'Création de site internet à Saint-Laurent-du-Maroni (973)',
  'implantations.html': 'Nos implantations : Montpellier, Mayotte, La Réunion, Antilles, Guyane'
};
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
    const old = dec(mt[1]), neu = TITRES[relative(ROOT, f)] || fitTitle(old);
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
