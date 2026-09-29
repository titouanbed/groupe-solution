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
  'Pays de Lunel', 'Bassin de Thau', 'Pic Saint-Loup', "Vallée de l'Hérault"
];

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

const LABELLED = new Set(['sete', 'lunel', 'meze', 'la-grande-motte', 'gignac', 'palavas-les-flots', 'saint-mathieu-de-treviers', 'villeveyrac', 'vendargues', 'lattes', 'juvignac', 'castelnau-le-lez']);

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
