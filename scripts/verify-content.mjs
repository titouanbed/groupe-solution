// Contrôle automatique d'un dossier ou d'une question AVANT publication.
//   node scripts/verify-content.mjs content/dossiers/AAAA-MM-JJ-slug.json
//   node scripts/verify-content.mjs content/questions/slug.json
// Code de sortie ≠ 0 au moindre problème → ne pas publier.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const file = process.argv[2];
if (!file) { console.error('Usage : node scripts/verify-content.mjs content/(dossiers|questions)/fichier.json'); process.exit(2); }
const kind = /dossiers/.test(file) ? 'dossier' : /questions/.test(file) ? 'question' : null;
if (!kind) { console.error('✗ Le fichier doit être dans content/dossiers/ ou content/questions/'); process.exit(2); }
const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const errors = [], warn = [], fail = m => errors.push(m);
let d;
try { d = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { console.error('✗ JSON invalide : ' + e.message); process.exit(1); }

const wc = s => String(s || '').split(/\s+/).filter(Boolean).length;
const secText = (d.sections || []).flatMap(s => [s.h2, ...(s.paragraphes || []), ...(s.liste || [])]).join(' ');
const allText = [d.titre, d.question, d.chapo, d.reponseCourte, d.description, secText, ...(d.aRetenir || []), ...(d.faq || []).flatMap(f => [f.q, f.a])].filter(Boolean).join(' ');

/* 1. Structure */
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug || '')) fail('slug invalide (minuscules, chiffres, tirets)');
if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date || '')) fail('date AAAA-MM-JJ obligatoire');
if (d.date > new Date().toISOString().slice(0, 10)) fail('date dans le futur');
if (kind === 'dossier' && basename(file) !== `${d.date}-${d.slug}.json`) fail(`nom de fichier attendu : ${d.date}-${d.slug}.json`);
if (kind === 'question' && basename(file) !== `${d.slug}.json`) fail(`nom de fichier attendu : ${d.slug}.json`);
if (!d.description || d.description.length < 110 || d.description.length > 170) fail('description : 110 à 170 caractères');
if (!Array.isArray(d.sections) || !d.sections.every(s => s.h2 && (s.paragraphes || []).length)) fail('sections : chaque section a un h2 et au moins un paragraphe');
const n = wc(secText);
if (kind === 'dossier') {
  if (!d.titre || d.titre.length > 100) fail('titre obligatoire (≤ 100 caractères)');
  if (!d.chapo || wc(d.chapo) < 20) fail('chapô trop court');
  if (d.sections.length < 4 || d.sections.length > 8) fail('4 à 8 sections');
  if (n < 1000 || n > 2400) fail(`corps : 1 000 à 2 400 mots (actuellement ${n})`);
  if (!Array.isArray(d.aRetenir) || d.aRetenir.length < 3) fail('au moins 3 points « À retenir »');
  if (!Array.isArray(d.faq) || d.faq.length < 3) fail('au moins 3 questions de FAQ');
} else {
  if (!d.question || !/\?\s*$/.test(d.question)) fail('la question doit se terminer par « ? »');
  if (!d.reponseCourte || d.reponseCourte.length > 360 || wc(d.reponseCourte) < 15) fail('réponse courte : 15 mots minimum, 360 caractères maximum');
  if (d.sections.length < 3 || d.sections.length > 6) fail('3 à 6 sections');
  if (n < 500 || n > 1400) fail(`corps : 500 à 1 400 mots (actuellement ${n})`);
}

/* 2. Règles de contenu du site */
const FORBIDDEN = [
  [/\d[\d\s]*(?:[.,]\d+)?\s?(?:€|euros?)\b.{0,40}\b(nos|notre|chez nous|groupe solution|groupsolution)\b|\b(nos|notre)\s+(tarif|prix|offre)s?\b[^.]{0,40}\d/i, 'prix de nos prestations'],
  [/twenty\s*three|twentythreeclean/i, 'client cité nommément'],
  [/\b(nos clients|un de nos clients|notre client)\b/i, 'référence client non vérifiable'],
  [/\b(selon nos informations|rumeur|il se murmure|aurait déclaré|serait sur le point)\b/i, 'information non confirmée'],
  [/\b(garanti|garantie) (de|d’|d')\s*(résultat|classement|première place)/i, 'promesse de résultat'],
  [/\b(lorem|todo|xxx|\[à compléter\])\b/i, 'texte provisoire']
];
FORBIDDEN.forEach(([re, why]) => { if (re.test(allText)) fail(`contenu interdit (${why})`); });

/* 3. Sources */
const src = Array.isArray(d.sources) ? d.sources : [];
const minSrc = kind === 'dossier' ? 4 : 3, minDom = kind === 'dossier' ? 3 : 2;
if (src.length < minSrc) fail(`au moins ${minSrc} sources`);
const doms = new Set();
src.forEach((s, k) => {
  let u; try { u = new URL(s.url); } catch { fail(`source ${k + 1} : URL invalide`); return; }
  if (u.protocol !== 'https:') fail(`source ${k + 1} : https obligatoire`);
  if (!s.nom || s.nom.length < 2) fail(`source ${k + 1} : nom manquant`);
  const dom = u.hostname.replace(/^www\./, '').split('.').slice(-2).join('.');
  if (/^(x\.com|twitter\.com|facebook\.com|youtube\.com|tiktok\.com|instagram\.com|linkedin\.com|reddit\.com|medium\.com)$/.test(dom)) fail(`source ${k + 1} : réseau social / blog ouvert non accepté`);
  doms.add(dom);
});
if (doms.size < minDom) fail(`sources : au moins ${minDom} domaines différents`);

/* 4. Liens internes : doivent exister */
const base = join(ROOT, 'lab', kind === 'dossier' ? 'dossiers' : 'questions');
(d.liens || []).forEach((l, k) => {
  if (!l.label || !l.url || /^https?:/.test(l.url)) { fail(`lien ${k + 1} : lien interne relatif attendu`); return; }
  const p = resolve(base, l.url.split('#')[0]);
  if (!existsSync(p) && !existsSync(join(p, 'index.html'))) fail(`lien ${k + 1} : page introuvable (${l.url})`);
});

/* 5. Doublons */
const dir = dirname(file);
const norm = s => new Set(String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(w => w.length > 3));
const sim = (a, b) => { const A = norm(a), B = norm(b); const i = [...A].filter(w => B.has(w)).length; return i / Math.max(1, Math.min(A.size, B.size)); };
readdirSync(dir).filter(f => f.endsWith('.json') && f !== basename(file)).forEach(f => {
  try { const o = JSON.parse(readFileSync(join(dir, f), 'utf8')); if (o.slug === d.slug) fail(`slug déjà utilisé (${f})`); if (sim(d.titre || d.question, o.titre || o.question) > 0.75) fail(`sujet trop proche de ${f}`); } catch { }
});

warn.forEach(w => console.warn('⚠ ' + w));
if (errors.length) { errors.forEach(e => console.error('✗ ' + e)); console.error(`\n${errors.length} problème(s) : NE PAS PUBLIER.`); process.exit(1); }
console.log(`✓ ${file} : ${kind} vérifié (${n} mots, ${src.length} sources / ${doms.size} domaines, liens internes OK).`);
