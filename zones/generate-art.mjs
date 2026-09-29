/* ═══════════════════════════════════════════════════════════
   ILLUSTRATIONS UNIQUES PAR LIEU — affiches générées par code.
   Chaque commune / quartier reçoit une composition propre, déduite de son
   paysage réel (mer, étang, vignes, garrigue, montagne, ville) et de son
   repère emblématique (phare, abbaye, cathédrale, arènes, pont, écluses…).
   Ce sont des ILLUSTRATIONS (pas des photos) : honnêtes, uniques, légères.

   Produit : /assets/communes/{slug}.jpg (1600×900) via Chromium (Playwright).
   Lancer :  node zones/generate-art.mjs            (toutes)
             node zones/generate-art.mjs meze sete  (sélection)
   ═══════════════════════════════════════════════════════════ */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { COMMUNES } from './montpellier-communes.mjs';
import { QUARTIERS } from './montpellier-plus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'communes');
mkdirSync(OUT, { recursive: true });
const W = 1600, H = 900;

/* ── Aléatoire déterministe ── */
function rng(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ── Palettes (ciel haut, ciel bas, soleil, lointain, milieu, premier plan, eau, accent) ── */
const PALETTES = [
  { n: 'aube', sky: ['#2B2E5A', '#F4A26B'], sun: '#FFE1A8', far: '#6B5B8C', mid: '#4B3F6B', near: '#241E3A', water: '#3E4A7A', acc: '#FF8A7A' },
  { n: 'midi', sky: ['#5BA4D9', '#DDF0F7'], sun: '#FFF6D5', far: '#8FB3C9', mid: '#5E8A6E', near: '#2F4A3A', water: '#2E7FA8', acc: '#F2C14E' },
  { n: 'couchant', sky: ['#3B1F4A', '#F07B5B'], sun: '#FFD27A', far: '#8A4C6B', mid: '#5A2E4F', near: '#2A1528', water: '#6A3A5E', acc: '#FFB36B' },
  { n: 'ocre', sky: ['#E9A86A', '#FBE3B8'], sun: '#FFF3D6', far: '#C98B63', mid: '#9C6A4A', near: '#5A3A28', water: '#4F8FA0', acc: '#E75A4A' },
  { n: 'lagune', sky: ['#1E5B6E', '#A6E1D8'], sun: '#FDF7E3', far: '#5E9E9A', mid: '#3F7A6E', near: '#1F4540', water: '#2B8C9A', acc: '#F7B267' },
  { n: 'crepuscule', sky: ['#141A33', '#E86A7A'], sun: '#FFC4A8', far: '#4A4A7A', mid: '#2F2F55', near: '#15152B', water: '#3A3F6E', acc: '#FF7E9A' }
];

/* ── Déduction du paysage et du repère ── */
const txt = c => [c.profil, ...(c.reperes || []), c.tissu, c.secteur].join(' ');
function scene(c) {
  const t = txt(c);
  if (c.placeType === 'Place' || /Nîmes|Béziers|Castelnau-le-Lez/.test(c.name)) return 'ville';
  if (/plage|station balnéaire|littoral|Méditerranée|Espiguette|Corniche|Cap d'Agde/i.test(t)) return 'mer';
  if (/étang/i.test(t)) return 'etang';
  if (/Cévennes|Larzac|causse|gorges|Salagou|Pic Saint-Loup|Hortus|Ravin/i.test(t)) return 'montagne';
  if (/vign|domaine|muscat|picpoul|terroir/i.test(t)) return 'vignes';
  return 'garrigue';
}
function landmark(c) {
  const t = txt(c);
  const rules = [[/phare/i, 'phare'], [/pyramide/i, 'pyramides'], [/arènes|Maison Carrée/i, 'arenes'], [/écluse/i, 'ecluse'],
    [/Pont du Diable|pont romain/i, 'pont'], [/Tour de Constance|remparts/i, 'tour'], [/cathédrale/i, 'cathedrale'],
    [/abbaye/i, 'abbaye'], [/château/i, 'chateau'], [/port de plaisance|Port-Camargue|port de pêche|le port\b|port de Marseillan|Port Ariane/i, 'port']];
  for (const [re, k] of rules) if (re.test(t)) return k;
  if (c.placeType === 'Place' || scene(c) === 'ville') return 'ville';
  return 'village';
}

/* ── Formes ── */
function ridge(r, y0, amp, step, rough) {
  let y = y0, d = `M0 ${H} L0 ${y0}`;
  for (let x = 0; x <= W + step; x += step) { y += (r() - 0.5) * rough; y = Math.max(y0 - amp, Math.min(y0 + amp * 0.4, y)); d += ` L${x} ${y.toFixed(1)}`; }
  return d + ` L${W} ${H} Z`;
}
function peak(cx, base, w, h) { return `M${cx - w} ${base} C${cx - w * 0.5} ${base - h * 0.35} ${cx - w * 0.18} ${base - h * 0.9} ${cx} ${base - h} C${cx + w * 0.12} ${base - h * 0.8} ${cx + w * 0.3} ${base - h * 0.55} ${cx + w} ${base} Z`; }
function pine(x, y, s, fill) {
  return `<g fill="${fill}"><rect x="${x - 2 * s}" y="${y - 60 * s}" width="${4 * s}" height="${60 * s}"/><ellipse cx="${x}" cy="${y - 64 * s}" rx="${46 * s}" ry="${14 * s}"/><ellipse cx="${x - 18 * s}" cy="${y - 56 * s}" rx="${26 * s}" ry="${9 * s}"/><ellipse cx="${x + 20 * s}" cy="${y - 58 * s}" rx="${28 * s}" ry="${9 * s}"/></g>`;
}
function cypress(x, y, s, fill) { return `<path fill="${fill}" d="M${x} ${y - 90 * s} C${x + 12 * s} ${y - 60 * s} ${x + 12 * s} ${y - 20 * s} ${x + 6 * s} ${y} L${x - 6 * s} ${y} C${x - 12 * s} ${y - 20 * s} ${x - 12 * s} ${y - 60 * s} ${x} ${y - 90 * s} Z"/>`; }
function bush(x, y, s, fill) { return `<g fill="${fill}"><circle cx="${x}" cy="${y}" r="${18 * s}"/><circle cx="${x + 16 * s}" cy="${y + 4 * s}" r="${14 * s}"/><circle cx="${x - 15 * s}" cy="${y + 5 * s}" r="${12 * s}"/></g>`; }

/* Repères : silhouettes posées sur (x, y = sol), échelle s. */
const LM = {
  phare: (x, y, s, f, a) => `<g><path d="M${x - 40 * s} ${y - 20 * s} L${x - 700} ${y - 180 * s} L${x - 700} ${y - 120 * s} Z M${x + 40 * s} ${y - 20 * s} L${x + 700} ${y - 200 * s} L${x + 700} ${y - 130 * s} Z" transform="translate(0 ${-230 * s})" fill="${a}" opacity=".18"/>
    <path fill="${f}" d="M${x - 26 * s} ${y} L${x - 16 * s} ${y - 210 * s} L${x + 16 * s} ${y - 210 * s} L${x + 26 * s} ${y} Z"/><rect x="${x - 22 * s}" y="${y - 236 * s}" width="${44 * s}" height="${26 * s}" fill="${f}"/><rect x="${x - 14 * s}" y="${y - 262 * s}" width="${28 * s}" height="${26 * s}" fill="${a}"/><path d="M${x - 18 * s} ${y - 262 * s} L${x} ${y - 284 * s} L${x + 18 * s} ${y - 262 * s} Z" fill="${f}"/>
    <rect x="${x - 16 * s}" y="${y - 150 * s}" width="${32 * s}" height="${14 * s}" fill="${a}" opacity=".5"/><rect x="${x - 19 * s}" y="${y - 80 * s}" width="${38 * s}" height="${14 * s}" fill="${a}" opacity=".5"/></g>`,
  pyramides: (x, y, s, f) => [[-160, 190, 150], [0, 250, 210], [170, 170, 130], [300, 120, 90]].map(([dx, w, h]) => {
    let d = ''; const steps = 7;
    for (let i = 0; i < steps; i++) { const ww = w * s * (1 - i / steps), hh = h * s / steps; d += `M${x + dx * s - ww / 2} ${y - i * hh} h${ww} v${-hh} h${-ww} Z `; }
    return `<path fill="${f}" d="${d}"/>`; }).join(''),
  arenes: (x, y, s, f, a) => { let g = `<path fill="${f}" d="M${x - 230 * s} ${y} L${x - 230 * s} ${y - 120 * s} Q${x} ${y - 150 * s} ${x + 230 * s} ${y - 120 * s} L${x + 230 * s} ${y} Z"/>`;
    for (let row = 0; row < 2; row++) for (let i = 0; i < 12; i++) { const ax = x - 210 * s + i * 38 * s, ay = y - 30 * s - row * 50 * s; g += `<path fill="${a}" opacity=".55" d="M${ax} ${ay} v${-22 * s} a${10 * s} ${10 * s} 0 0 1 ${20 * s} 0 v${22 * s} Z"/>`; }
    return g; },
  ecluse: (x, y, s, f, a) => { let g = ''; for (let i = 0; i < 6; i++) { const sx = x - 260 * s + i * 90 * s, sy = y - i * 22 * s; g += `<rect x="${sx}" y="${sy - 40 * s}" width="${92 * s}" height="${40 * s + i * 22 * s}" fill="${f}"/><rect x="${sx + 8 * s}" y="${sy - 34 * s}" width="${76 * s}" height="${10 * s}" fill="${a}" opacity=".7"/>`; } return g; },
  pont: (x, y, s, f) => { let d = `M${x - 330 * s} ${y - 120 * s} H${x + 330 * s} V${y} H${x - 330 * s} Z`; let holes = '';
    [-220, 0, 220].forEach((dx, i) => { const r = (i === 1 ? 95 : 75) * s; holes += `M${x + dx * s - r} ${y} A${r} ${r} 0 0 1 ${x + dx * s + r} ${y} Z`; });
    return `<path fill="${f}" fill-rule="evenodd" d="${d} ${holes}"/>`; },
  tour: (x, y, s, f) => { let g = `<rect x="${x - 360 * s}" y="${y - 70 * s}" width="${720 * s}" height="${70 * s}" fill="${f}"/>`;
    for (let i = 0; i < 24; i++) g += `<rect x="${x - 360 * s + i * 30 * s}" y="${y - 84 * s}" width="${16 * s}" height="${14 * s}" fill="${f}"/>`;
    g += `<rect x="${x - 60 * s}" y="${y - 230 * s}" width="${120 * s}" height="${230 * s}" rx="${10 * s}" fill="${f}"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="${x - 60 * s + i * 22 * s}" y="${y - 246 * s}" width="${14 * s}" height="${16 * s}" fill="${f}"/>`;
    return g; },
  cathedrale: (x, y, s, f, a) => `<path fill="${f}" d="M${x - 200 * s} ${y} V${y - 120 * s} L${x - 60 * s} ${y - 170 * s} L${x + 80 * s} ${y - 120 * s} V${y} Z"/>
    <rect x="${x + 70 * s}" y="${y - 250 * s}" width="${90 * s}" height="${250 * s}" fill="${f}"/>${[0, 1, 2, 3].map(i => `<rect x="${x + 70 * s + i * 24 * s}" y="${y - 266 * s}" width="${14 * s}" height="${16 * s}" fill="${f}"/>`).join('')}
    <circle cx="${x - 60 * s}" cy="${y - 110 * s}" r="${22 * s}" fill="${a}" opacity=".6"/><rect x="${x + 102 * s}" y="${y - 200 * s}" width="${26 * s}" height="${50 * s}" rx="${13 * s}" fill="${a}" opacity=".5"/>`,
  abbaye: (x, y, s, f, a) => `<path fill="${f}" d="M${x - 240 * s} ${y} V${y - 100 * s} L${x - 80 * s} ${y - 150 * s} L${x + 60 * s} ${y - 100 * s} V${y} Z"/>
    <path fill="${f}" d="M${x + 50 * s} ${y} V${y - 210 * s} L${x + 100 * s} ${y - 280 * s} L${x + 150 * s} ${y - 210 * s} V${y} Z"/>
    ${[0, 1, 2, 3, 4].map(i => `<path fill="${a}" opacity=".55" d="M${x - 220 * s + i * 52 * s} ${y - 20 * s} v${-40 * s} a${14 * s} ${14 * s} 0 0 1 ${28 * s} 0 v${40 * s} Z"/>`).join('')}
    <rect x="${x + 88 * s}" y="${y - 200 * s}" width="${24 * s}" height="${40 * s}" rx="${12 * s}" fill="${a}" opacity=".6"/>`,
  chateau: (x, y, s, f, a) => { let g = `<rect x="${x - 170 * s}" y="${y - 110 * s}" width="${340 * s}" height="${110 * s}" fill="${f}"/>`;
    [-170, 170].forEach(dx => { g += `<rect x="${x + dx * s - 38 * s}" y="${y - 180 * s}" width="${76 * s}" height="${180 * s}" fill="${f}"/><path fill="${f}" d="M${x + dx * s - 46 * s} ${y - 180 * s} L${x + dx * s} ${y - 240 * s} L${x + dx * s + 46 * s} ${y - 180 * s} Z"/>`; });
    for (let i = 0; i < 9; i++) g += `<rect x="${x - 130 * s + i * 30 * s}" y="${y - 126 * s}" width="${16 * s}" height="${16 * s}" fill="${f}"/>`;
    g += `<path fill="${a}" opacity=".5" d="M${x - 24 * s} ${y} v${-50 * s} a${24 * s} ${24 * s} 0 0 1 ${48 * s} 0 v${50 * s} Z"/>`; return g; },
  port: (x, y, s, f, a, r) => { let g = ''; for (let i = 0; i < 7; i++) { const bx = x - 330 * s + i * 110 * s + (r() - 0.5) * 30 * s, h = (120 + r() * 90) * s;
    g += `<path fill="${f}" d="M${bx - 44 * s} ${y - 6 * s} L${bx + 44 * s} ${y - 6 * s} L${bx + 32 * s} ${y + 14 * s} L${bx - 32 * s} ${y + 14 * s} Z"/><rect x="${bx - 2 * s}" y="${y - 6 * s - h}" width="${4 * s}" height="${h}" fill="${f}"/>`;
    if (i % 2 === 0) g += `<path fill="${a}" opacity=".75" d="M${bx + 3 * s} ${y - h} L${bx + 3 * s} ${y - 14 * s} L${bx + 60 * s} ${y - 14 * s} Z"/>`; } return g; },
  ville: (x, y, s, f, a, r) => { let g = ''; let bx = x - 420 * s;
    while (bx < x + 420 * s) { const w = (40 + r() * 70) * s, h = (80 + r() * 220) * s; g += `<rect x="${bx}" y="${y - h}" width="${w}" height="${h}" fill="${f}"/>`;
      for (let wy = y - h + 14 * s; wy < y - 16 * s; wy += 26 * s) for (let wx = bx + 8 * s; wx < bx + w - 12 * s; wx += 18 * s) if (r() > 0.55) g += `<rect x="${wx}" y="${wy}" width="${8 * s}" height="${10 * s}" fill="${a}" opacity=".7"/>`;
      bx += w + 6 * s; } return g; },
  village: (x, y, s, f, a, r) => { let g = ''; for (let i = 0; i < 9; i++) { const hx = x - 260 * s + i * 60 * s + (r() - 0.5) * 20 * s, w = (50 + r() * 30) * s, h = (40 + r() * 50) * s;
    g += `<rect x="${hx}" y="${y - h}" width="${w}" height="${h}" fill="${f}"/><path fill="${f}" d="M${hx - 6 * s} ${y - h} L${hx + w / 2} ${y - h - 24 * s} L${hx + w + 6 * s} ${y - h} Z"/>`;
    if (r() > 0.4) g += `<rect x="${hx + w / 2 - 5 * s}" y="${y - h + 12 * s}" width="${10 * s}" height="${14 * s}" fill="${a}" opacity=".7"/>`; }
    g += `<rect x="${x - 24 * s}" y="${y - 190 * s}" width="${48 * s}" height="${190 * s}" fill="${f}"/><path fill="${f}" d="M${x - 30 * s} ${y - 190 * s} L${x} ${y - 236 * s} L${x + 30 * s} ${y - 190 * s} Z"/><rect x="${x - 9 * s}" y="${y - 176 * s}" width="${18 * s}" height="${26 * s}" rx="${9 * s}" fill="${a}" opacity=".7"/>`;
    return g; }
};

function svg(c) {
  const r = rng(c.slug);
  const P = PALETTES[Math.floor(r() * PALETTES.length)];
  const sc = scene(c), lm = landmark(c);
  const horizon = sc === 'mer' || sc === 'etang' ? 560 + r() * 40 : 600 + r() * 40;
  const sunX = 250 + r() * 1100, sunY = 180 + r() * 200, sunR = 70 + r() * 60;
  let g = '';
  // Soleil + halo
  g += `<circle cx="${sunX}" cy="${sunY}" r="${sunR * 3.2}" fill="url(#halo)"/><circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${P.sun}"/>`;
  // Nuages stylisés
  for (let i = 0; i < 4; i++) { const cx = r() * W, cy = 90 + r() * 220, w = 160 + r() * 260; g += `<rect x="${cx}" y="${cy}" width="${w}" height="${10 + r() * 10}" rx="10" fill="#fff" opacity="${0.12 + r() * 0.18}"/>`; }
  // Lointain
  if (sc === 'montagne') {
    g += `<path fill="${P.far}" d="${ridge(r, horizon - 170, 120, 40, 90)}"/>`;
    g += `<path fill="${P.mid}" opacity=".9" d="${peak(400 + r() * 800, horizon + 10, 260 + r() * 120, 330 + r() * 80)}"/>`;
  } else {
    g += `<path fill="${P.far}" opacity=".85" d="${ridge(r, horizon - 60, 70, 60, 40)}"/>`;
  }
  // Eau
  if (sc === 'mer' || sc === 'etang') {
    g += `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#water)"/>`;
    for (let i = 0; i < 28; i++) { const y = horizon + 12 + r() * (H - horizon - 20), x = r() * W, w = 40 + r() * 180; g += `<rect x="${x}" y="${y}" width="${w}" height="3" rx="2" fill="#fff" opacity="${0.08 + r() * 0.2}"/>`; }
    g += `<rect x="${sunX - 40}" y="${horizon}" width="80" height="${H - horizon}" fill="${P.sun}" opacity=".12"/>`;
    if (sc === 'etang' && /conchyl|huître|coquillage|tables/i.test(txt(c))) {
      for (let row = 0; row < 3; row++) { const y = horizon + 40 + row * 55; for (let x = 80 + row * 40; x < W - 80; x += 34) g += `<rect x="${x}" y="${y}" width="3" height="${22 + row * 6}" fill="${P.near}" opacity=".7"/>`; g += `<rect x="60" y="${y}" width="${W - 120}" height="3" fill="${P.near}" opacity=".6"/>`; }
    }
  }
  // Terre intermédiaire
  const landY = sc === 'mer' || sc === 'etang' ? horizon + 4 : horizon;
  if (sc !== 'mer' && sc !== 'etang') g += `<path fill="${P.mid}" d="${ridge(r, landY + 30, 40, 80, 30)}"/>`;
  // Vignes en perspective
  if (sc === 'vignes' || (sc === 'garrigue' && /vign/i.test(txt(c)))) {
    const vx = W * (0.3 + r() * 0.4), vy = landY + 40;
    for (let i = -14; i <= 14; i++) g += `<path d="M${vx + i * 8} ${vy} L${vx + i * 150} ${H}" stroke="${P.near}" stroke-width="${5 + Math.abs(i) * 0.6}" opacity=".55" stroke-dasharray="2 9"/>`;
  }
  // Repère emblématique
  const lx = sc === 'ville' ? W / 2 : 300 + r() * 1000;
  const ly = sc === 'mer' || sc === 'etang' ? horizon + (lm === 'port' ? 30 : 6) : landY + 40;
  const s = lm === 'ville' ? 1 : 0.9 + r() * 0.3;
  g += `<g opacity=".96">${LM[lm](lx, ly, s, P.near, P.acc, r)}</g>`;
  // Premier plan : garrigue, pins, cyprès
  if (sc !== 'mer' && sc !== 'etang') {
    g += `<path fill="${P.near}" d="${ridge(r, H - 90, 30, 50, 24)}"/>`;
    for (let i = 0; i < 7; i++) g += bush(r() * W, H - 70 + r() * 40, 0.8 + r() * 0.9, P.near);
    g += pine(80 + r() * 220, H - 60, 1.4 + r() * 0.6, P.near);
    if (r() > 0.4) g += pine(W - 120 - r() * 220, H - 50, 1.2 + r() * 0.6, P.near);
    if (r() > 0.5) g += cypress(W * (0.6 + r() * 0.3), H - 70, 1.3, P.near);
  } else {
    g += `<path fill="${P.near}" d="M0 ${H} L0 ${H - 60} Q${W * 0.2} ${H - 90} ${W * 0.35} ${H - 50} L${W * 0.35} ${H} Z"/>`;
    g += pine(120 + r() * 120, H - 60, 1.3, P.near);
  }
  const cap = `${c.name.toUpperCase()} · ${c.lat.toFixed(2)}°N ${c.lng.toFixed(2)}°E`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset="1" stop-color="${P.sky[1]}"/></linearGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.water}" stop-opacity=".85"/><stop offset="1" stop-color="${P.near}"/></linearGradient>
  <radialGradient id="halo"><stop offset="0" stop-color="${P.sun}" stop-opacity=".55"/><stop offset="1" stop-color="${P.sun}" stop-opacity="0"/></radialGradient>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
${g}
<rect width="${W}" height="${H}" filter="url(#grain)"/>
<text x="${W - 40}" y="${H - 34}" text-anchor="end" font-family="Georgia, serif" font-size="22" letter-spacing="4" fill="#fff" opacity=".7">${cap.replace(/&/g, '&amp;')}</text>
</svg>`;
}

/* ── Rendu JPG via Chromium ── */
const only = process.argv.slice(2);
const places = [...COMMUNES, ...QUARTIERS].filter(c => !only.length || only.includes(c.slug));
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs').catch(() => import('playwright'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
for (const c of places) {
  const s = svg(c);
  await page.setContent(`<html><body style="margin:0">${s}</body></html>`);
  await page.screenshot({ path: join(OUT, `${c.slug}.jpg`), type: 'jpeg', quality: 80, clip: { x: 0, y: 0, width: W, height: H } });
}
await browser.close();
console.log(`✓ ${places.length} illustrations générées dans /assets/communes/`);
