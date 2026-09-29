/* ═══════════════════════════════════════════════════════════
   Briques partagées des pages communes (site internet + automatisation).
   Carte SVG générée côté serveur : les liens sont dans le HTML (crawlables),
   aucune dépendance JS pour l'afficher.
   ═══════════════════════════════════════════════════════════ */
import { COMMUNES, HUB, km, direction } from './montpellier-communes.mjs';

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const jstr = s => JSON.stringify(String(s));

export const SECTEUR_ORDER = [
  'Nord de la métropole', 'Nord-est de la métropole', 'Nord-ouest de la métropole', 'Est de la métropole',
  'Ouest de la métropole', 'Sud de la métropole', 'Nord de Montpellier', "Pays de l'Or", 'Littoral',
  'Pays de Lunel', 'Petite Camargue', 'Vidourle', 'Nîmes', 'Bassin de Thau', "Agde & Pézenas", 'Biterrois',
  'Pic Saint-Loup', 'Cévennes héraultaises', "Vallée de l'Hérault", "Cœur d'Hérault", 'Haut-Languedoc',
  'Rhône gardois', 'Uzège', 'Cévennes gardoises'
];

/* « à Lattes », « au Crès », « aux Matelles », « à La Grande-Motte ». */
export const aName = c => c.aname ? c.aname : c.name.startsWith('Le ') ? 'au ' + c.name.slice(3) : c.name.startsWith('Les ') ? 'aux ' + c.name.slice(4) : 'à ' + c.name;

export function bySecteur() {
  const map = new Map(SECTEUR_ORDER.map(s => [s, []]));
  COMMUNES.forEach(c => { if (!map.has(c.secteur)) map.set(c.secteur, []); map.get(c.secteur).push(c); });
  for (const list of map.values()) list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  return [...map.entries()].filter(([, l]) => l.length);
}

export function distanceText(c) {
  const d = Math.round(km(HUB, c));
  return { d, dir: direction(HUB, c) };
}

/* Carte schématique : projection équirectangulaire bornée sur les communes. */
const PAD = 26, W = 760;
const lats = [...COMMUNES.map(c => c.lat), HUB.lat], lngs = [...COMMUNES.map(c => c.lng), HUB.lng];
const minLat = Math.min(...lats), maxLat = Math.max(...lats), minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
const K = Math.cos(43.6 * Math.PI / 180);
const SCALE = (W - PAD * 2) / ((maxLng - minLng) * K);
const H = Math.round((maxLat - minLat) * SCALE + PAD * 2);
const px = c => [Math.round(PAD + (c.lng - minLng) * K * SCALE), Math.round(PAD + (maxLat - c.lat) * SCALE)];

const LABELLED = new Set(['sete', 'lunel', 'meze', 'gignac', 'palavas-les-flots', 'villeveyrac', 'nimes', 'beziers', 'agde', 'pezenas', 'lodeve', 'ganges', 'clermont-l-herault', 'aigues-mortes', 'le-grau-du-roi', 'sommieres']);

/**
 * @param {object} o
 * @param {string|null} o.current  slug surligné
 * @param {(c)=>string} o.href     lien de chaque point
 * @param {string} o.hubHref       lien du point Montpellier
 * @param {string} o.label         aria-label
 */
export function mapSvg({ current = null, href, hubHref, label }) {
  const [hx, hy] = px(HUB);
  const dots = COMMUNES.map(c => {
    const [x, y] = px(c);
    const cur = c.slug === current;
    const showLabel = cur || LABELLED.has(c.slug);
    const anchor = x > W - 120 ? 'end' : 'start';
    const tx = anchor === 'end' ? x - 9 : x + 9;
    return `<a href="${href(c)}" class="gm-pt${cur ? ' is-cur' : ''}${c.metro ? ' is-metro' : ''}"><title>${esc(c.name)} (${c.cp})</title><circle cx="${x}" cy="${y}" r="${cur ? 8 : 5}"/>${showLabel ? `<text x="${tx}" y="${y + 4}" text-anchor="${anchor}">${esc(c.name)}</text>` : ''}</a>`;
  }).join('');
  return `<svg class="gm-map" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
  <text class="gm-sea" x="${W - PAD}" y="${H - 10}" text-anchor="end">Mer Méditerranée</text>
  <a href="${hubHref}" class="gm-hub"><title>Montpellier</title><circle cx="${hx}" cy="${hy}" r="11"/><text x="${hx + 15}" y="${hy + 5}">Montpellier</text></a>
  ${dots}
</svg>`;
}

/* CSS de la carte, injectée dans chaque charte (couleurs via variables). */
export const MAP_CSS = `
.gm-wrap{background:var(--gm-bg);border:1px solid var(--gm-line);border-radius:22px;padding:14px;overflow:hidden}
.gm-map{width:100%;height:auto;display:block}
.gm-map text{font-size:12px;font-weight:700;fill:var(--gm-ink);paint-order:stroke;stroke:var(--gm-bg);stroke-width:4px;stroke-linejoin:round;pointer-events:none}
.gm-sea{font-style:italic;font-weight:600!important;fill:var(--gm-muted)!important;font-size:13px!important}
.gm-pt circle{fill:var(--gm-dot);stroke:#fff;stroke-width:2;transition:r .2s,fill .2s}
.gm-pt.is-metro circle{fill:var(--gm-metro)}
.gm-pt:hover circle,.gm-pt:focus circle{fill:var(--gm-acc);r:8}
.gm-pt.is-cur circle{fill:var(--gm-acc);stroke-width:3}
.gm-pt.is-cur text{fill:var(--gm-acc);font-size:14px}
.gm-hub circle{fill:var(--gm-ink);stroke:#fff;stroke-width:3}
.gm-hub text{font-size:14px!important;font-weight:800!important}
.gm-legend{display:flex;gap:18px;flex-wrap:wrap;font-size:12.5px;color:var(--gm-muted);font-weight:600;margin:10px 4px 0}
.gm-legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:-1px}
.gm-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px 28px;margin-top:30px}
.gm-wide{grid-column:span 2}@media(max-width:560px){.gm-wide{grid-column:auto}}
.gm-list h4{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--gm-muted);margin-bottom:8px;font-weight:800}
.gm-list ul{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:6px}
.gm-list a{display:inline-block;padding:5px 11px;border-radius:999px;border:1px solid var(--gm-line);background:#fff;font-size:13.5px;font-weight:600;color:var(--gm-ink);text-decoration:none;transition:border-color .2s,color .2s}
.gm-list a:hover{border-color:var(--gm-acc);color:var(--gm-acc)}
.gm-list a.is-cur{background:var(--gm-acc);border-color:var(--gm-acc);color:#fff}
`;

export function communesList({ current = null, href }) {
  return `<div class="gm-list">${bySecteur().map(([s, list]) => `
    <div><h4>${esc(s)}</h4><ul>${list.map(c => `<li><a href="${href(c)}"${c.slug === current ? ' class="is-cur" aria-current="page"' : ''}>${esc(c.name)}</a></li>`).join('')}</ul></div>`).join('')}
  </div>`;
}

/* Communes du même bassin (maillage ciblé, sans répéter la liste complète sur chaque page). */
export function secteurList({ c, href, hubHref, hubLabel }) {
  const same = COMMUNES.filter(o => o.secteur === c.secteur && o.slug !== c.slug).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  return `<div class="gm-list"><div class="gm-wide"><h4>${esc(c.secteur)}${same.length ? '' : ''}</h4><ul>${same.map(o => `<li><a href="${href(o)}">${esc(o.name)}</a></li>`).join('')}<li><a href="${hubHref}" class="is-cur">${esc(hubLabel)}</a></li></ul></div></div>`;
}

/* Barre d'action mobile collante (appel / message) — commune à toutes les pages locales. */
export const STICKY_CSS = `
.gs-sticky{display:none}
@media(max-width:760px){
  .gs-sticky{display:flex;position:fixed;left:10px;right:10px;bottom:10px;z-index:900;gap:8px;background:rgba(23,22,19,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:8px;border-radius:18px;box-shadow:0 14px 40px rgba(0,0,0,.28)}
  .gs-sticky a,.gs-sticky button{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:13px 10px;border-radius:12px;font:800 14px/1 inherit;font-family:inherit;text-decoration:none;border:0;cursor:pointer}
  .gs-sticky .s1{background:#fff;color:#171613}
  .gs-sticky .s2{background:#E61E4D;color:#fff}
  body{padding-bottom:84px}
}`;

/* Réalisations du groupe (ses propres plateformes — aucun client cité). Chemins relatifs à /montpellier/. */
export const REA_SECTION = (pre = '../') => `
  <section id="realisations" style="background: var(--gris-clair); padding: 80px 0;">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Conçu et codé par nos équipes</span>
        <h2>Livré, pas <span class="accent">promis</span></h2>
        <p>Trois plateformes conçues et opérées par Groupe Solution, en ligne aujourd'hui. La même ingénierie est au service de votre projet.</p>
      </div>
      <div class="rea-grid">
        <a href="https://solutionsrecrutement.fr/" target="_blank" rel="noopener" class="rea-card reveal"><div class="rea-img" style="background-image: url('${pre}rea2.jpg');"></div><div class="rea-content"><h4>Solution Recrutement</h4><p>Plus de 565 000 offres, matching sémantique, chaque correspondance expliquée.</p></div></a>
        <a href="https://solutionalternance.fr/" target="_blank" rel="noopener" class="rea-card reveal"><div class="rea-img" style="background-image: url('${pre}rea3.jpg');"></div><div class="rea-content"><h4>Solution Alternance</h4><p>Chaque profil rapproché de plus de 200 000 offres d'alternance, par IA.</p></div></a>
        <a href="https://aides-particuliers.fr/" target="_blank" rel="noopener" class="rea-card reveal"><div class="rea-img gs-ill gs-ill-seo" style="font:600 64px Georgia,serif;color:#0E7A5A">A</div><div class="rea-content"><h4>Aides Particuliers</h4><p>Un diagnostic qui identifie les aides publiques auxquelles un particulier a droit.</p></div></a>
      </div>
    </div>
  </section>`;

export const heroArt = (slug, pre = '../') => `style="background-image:url('${pre}assets/communes/${slug}.jpg')"`;

/* ── Bloc « en direct » (météo, mer, données INSEE) — rempli par /assets/live.js ── */
const SEA = { 'palavas-les-flots': [43.51, 3.93], 'mauguio-carnon': [43.53, 3.98], 'la-grande-motte': [43.54, 4.08], 'le-grau-du-roi': [43.51, 4.14],
  'sete': [43.38, 3.70], 'agde': [43.26, 3.48], 'marseillan': [43.32, 3.55], 'frontignan': [43.42, 3.76], 'vic-la-gardiole': [43.46, 3.80], 'villeneuve-les-maguelone': [43.50, 3.87] };
const INSEE_NAME = { 'mauguio-carnon': 'Mauguio' };
export function liveSection(c, holding = false) {
  const sea = SEA[c.slug];
  const insee = c.placeType === 'Place' ? 'Montpellier' : (INSEE_NAME[c.slug] || c.name);
  const cp = c.placeType === 'Place' ? '34000' : c.cp;
  const card = (k, t) => `<div class="lv-card"><h4>${t}</h4><div data-lv="${k}"><span class="lv-skel"></span></div></div>`;
  const inner = `<div class="lv-grid">${card('meteo', 'Météo')}${sea ? card('mer', 'La mer') : ''}${card('commune', 'Données officielles')}</div>
      <p class="lv-src">Actualisé en temps réel via des API ouvertes : Open-Meteo${sea ? ' (prévisions marines)' : ''} et geo.api.gouv.fr (INSEE). Le genre d'intégration que nous construisons dans vos outils — <a href="${holding ? '../' : '../'}lab/api.html">voir le Lab</a>.</p>`;
  const attrs = `data-live-place data-lat="${c.lat}" data-lng="${c.lng}" data-cp="${cp}" data-name="${esc(c.name)}" data-insee="${esc(insee)}"${sea ? ` data-sea-lat="${sea[0]}" data-sea-lng="${sea[1]}"` : ''} hidden`;
  return holding
    ? `\n  <section class="sec lv-sec" ${attrs}><div class="wrap"><div class="secHead reveal"><div class="kicker"><span class="lv-dot"></span>En direct</div><h2>${esc(c.name)}, en ce moment.</h2></div>${inner}</div></section>`
    : `\n  <section class="lv-sec" ${attrs}><div class="container"><div class="section-header"><span class="section-tag"><span class="lv-dot"></span>En direct</span><h2>${esc(c.name)}, <span class="accent">en ce moment</span></h2></div>${inner}</div></section>`;
}

export const LIVE_CSS = `
.lv-sec{padding:70px 0}
.lv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px;max-width:1000px;margin:0 auto}
.lv-card{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:20px;padding:22px;box-shadow:0 8px 26px rgba(0,0,0,.06)}
.lv-card h4{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#8C887E;font-weight:800;margin-bottom:12px}
.lv-now{display:flex;gap:14px;align-items:center}.lv-now .lv-ico{font-size:40px;line-height:1;margin:0;color:inherit}
.lv-now b{display:block;font-size:26px;font-weight:800;line-height:1.1}.lv-now span{display:block;font-size:13.5px;color:#6b7280;margin-top:3px}
.lv-days{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid rgba(0,0,0,.06)}
.lv-day{text-align:center;font-size:12.5px;color:#6b7280;display:grid;gap:2px}.lv-day b{font-size:20px}
.lv-src{text-align:center;font-size:12.5px;color:#8C887E;margin-top:16px}.lv-src a{font-weight:700;color:inherit;text-decoration:underline}
.lv-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;margin-right:8px;box-shadow:0 0 0 0 rgba(16,185,129,.6);animation:lvp 1.8s infinite}
@keyframes lvp{0%{box-shadow:0 0 0 0 rgba(16,185,129,.6)}70%{box-shadow:0 0 0 10px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}
.lv-skel{display:block;height:60px;border-radius:12px;background:linear-gradient(90deg,#f3f4f6,#e5e7eb,#f3f4f6);background-size:200% 100%;animation:lvs 1.2s infinite}
@keyframes lvs{0%{background-position:200% 0}100%{background-position:-200% 0}}
@media(prefers-reduced-motion:reduce){.lv-dot,.lv-skel{animation:none}}
`;

/* Contenu rédigé commune par commune (enjeux, récit, FAQ dédiées).
   Page site : enjeux + faqSite. Page automatisation : récit + faqAuto (pas de texte partagé entre les deux). */
let ENRICH = {};
try { ({ ENRICH } = await import('./communes-enrichissement.mjs')); } catch { /* fichier absent : pages sans bloc enrichi */ }
export const enrichOf = c => c.enrich || ENRICH[c.slug] || null;
