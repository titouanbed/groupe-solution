// Contrôle automatique d'un numéro d'actus AVANT publication.
//   node scripts/verify-actus.mjs content/actus/AAAA-MM-JJ.json
// Code de sortie ≠ 0 au moindre problème → la publication doit être annulée.
import { readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const file = process.argv[2];
if (!file) { console.error('Usage : node scripts/verify-actus.mjs content/actus/AAAA-MM-JJ.json'); process.exit(2); }
const errors = [], warn = [];
const fail = m => errors.push(m);

let d;
try { d = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { console.error('✗ JSON invalide : ' + e.message); process.exit(1); }

/* 1. Structure et date */
const date = basename(file, '.json');
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail('Nom de fichier attendu : AAAA-MM-JJ.json');
if (d.date !== date) fail(`Le champ date (${d.date}) doit correspondre au nom du fichier (${date})`);
const today = new Date().toISOString().slice(0, 10);
if (date > today) fail('Date dans le futur');
['titre', 'intro'].forEach(k => { if (typeof d[k] !== 'string' || d[k].trim().length < 20) fail(`Champ « ${k} » manquant ou trop court`); });
if (!Array.isArray(d.items) || d.items.length < 3 || d.items.length > 7) fail('Entre 3 et 7 actualités sont requises (sinon ne rien publier ce jour-là)');

/* 2. Règles de contenu du site */
const FORBIDDEN = [
  [/\d[\d\s]*(?:[.,]\d+)?\s?(?:€|euros?)\b.{0,40}\b(nos|notre|chez nous|groupe solution|groupsolution)\b|\b(nos|notre)\s+(tarif|prix|offre)s?\b[^.]{0,40}\d/i, 'prix de nos prestations'],
  [/twenty\s*three|twentythreeclean/i, 'client cité nommément'],
  [/\b(selon nos informations|rumeur|il se murmure|aurait déclaré|serait sur le point)\b/i, 'information non confirmée'],
  [/\b(lorem|todo|xxx|\[à compléter\])\b/i, 'texte provisoire']
];
const CATS = ['Réglementation', 'IA', 'IA européenne', 'IA & données', 'Identité numérique', 'Cybersécurité', 'Numérique', 'Données', 'Automatisation', 'Entreprises', 'Open data', 'Infrastructures'];

/* 3. Actualités */
const prevTitles = readdirSync(dirname(file)).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f !== basename(file)).sort().slice(-21)
  .flatMap(f => { try { return JSON.parse(readFileSync(join(dirname(file), f), 'utf8')).items.map(i => i.titre); } catch { return []; } });
const words = s => new Set(s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(w => w.length > 3));
const sim = (a, b) => { const A = words(a), B = words(b); const i = [...A].filter(w => B.has(w)).length; return i / Math.max(1, Math.min(A.size, B.size)); };

(d.items || []).forEach((it, n) => {
  const tag = `Actu #${n + 1}`;
  ['cat', 'titre', 'resume', 'pourquoi'].forEach(k => { if (typeof it[k] !== 'string' || !it[k].trim()) fail(`${tag} : champ « ${k} » manquant`); });
  if (it.titre && it.titre.length > 120) fail(`${tag} : titre trop long (> 120 caractères)`);
  if (it.resume && (it.resume.length < 120 || it.resume.length > 900)) fail(`${tag} : résumé entre 120 et 900 caractères`);
  if (it.pourquoi && it.pourquoi.length < 60) fail(`${tag} : « ce que ça change » trop court`);
  if (it.cat && !CATS.includes(it.cat)) warn.push(`${tag} : catégorie inhabituelle « ${it.cat} »`);
  if (it.action != null && (typeof it.action !== 'string' || it.action.length < 30 || it.action.length > 280)) fail(`${tag} : « à faire cette semaine » entre 30 et 280 caractères`);
  const text = [it.titre, it.resume, it.pourquoi, it.action || ''].join(' ');
  FORBIDDEN.forEach(([re, why]) => { if (re.test(text)) fail(`${tag} : contenu interdit (${why})`); });
  // Sources : au moins 2, https, domaines distincts, pas de réseaux sociaux / agrégateurs vidéo comme seule base
  const src = Array.isArray(it.sources) ? it.sources : [];
  if (src.length < 2) fail(`${tag} : au moins 2 sources indépendantes sont exigées`);
  const doms = new Set();
  src.forEach((s, k) => {
    let u; try { u = new URL(s.url); } catch { fail(`${tag} source ${k + 1} : URL invalide`); return; }
    if (u.protocol !== 'https:') fail(`${tag} source ${k + 1} : https obligatoire`);
    if (!s.nom || s.nom.length < 2) fail(`${tag} source ${k + 1} : nom manquant`);
    const dom = u.hostname.replace(/^www\./, '').split('.').slice(-2).join('.');
    if (/^(x\.com|twitter\.com|facebook\.com|youtube\.com|tiktok\.com|instagram\.com|linkedin\.com|reddit\.com)$/.test(dom)) fail(`${tag} source ${k + 1} : réseau social non accepté comme source`);
    doms.add(dom);
  });
  if (src.length >= 2 && doms.size < 2) fail(`${tag} : les sources doivent venir de domaines différents`);
  if (it.lien && !/^\.\.\/|^\//.test(it.lien.url || '')) fail(`${tag} : lien interne invalide`);
  // Doublons
  (d.items || []).forEach((o, m) => { if (m > n && sim(it.titre || '', o.titre || '') > 0.7) fail(`${tag} : doublon avec l'actu #${m + 1}`); });
  prevTitles.forEach(t => { if (sim(it.titre || '', t) > 0.75) fail(`${tag} : déjà publiée récemment (« ${t} »)`); });
});

warn.forEach(w => console.warn('⚠ ' + w));
if (errors.length) { errors.forEach(e => console.error('✗ ' + e)); console.error(`\n${errors.length} problème(s) : NE PAS PUBLIER.`); process.exit(1); }
console.log(`✓ ${file} : ${d.items.length} actualités vérifiées (structure, sources, règles de contenu, doublons).`);
