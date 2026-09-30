/* ═══════════════════════════════════════════════════════════
   LABORATOIRE D'IDÉES — idées d'innovation par secteur, et fil des idées publiées EN DIRECT
   depuis l'accueil (plans d'innovation générés par notre IA, publiés anonymement sur clic du visiteur).
   Source : /content/idees/secteurs.json   ·   Direct : /api/idees
   Produit : /idees/index.html + /idees/{secteur}.html
   Lancer :  node zones/generate-idees.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { esc } from './lib-local.mjs';
import { head, foot } from './generate-actus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'content', 'idees', 'secteurs.json');
if (!existsSync(SRC)) { console.log('ℹ️ content/idees/secteurs.json absent : Laboratoire d’idées non généré'); process.exit(0); }
const { secteurs } = JSON.parse(readFileSync(SRC, 'utf8'));
const OUT = join(ROOT, 'idees'); mkdirSync(OUT, { recursive: true });
const metierPage = slug => existsSync(join(ROOT, 'montpellier', `site-internet-${slug}-montpellier.html`)) ? `../montpellier/site-internet-${slug}-montpellier.html` : null;
const crumbs = items => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });

const CSS = `<style>
.idHero{background:radial-gradient(60% 90% at 85% 0%,rgba(182,156,255,.18),transparent 60%),radial-gradient(60% 90% at 10% 0%,rgba(230,30,77,.12),transparent 60%)}
.idGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
.idGrid a{display:grid;gap:6px;background:var(--white);border:1px solid var(--line);border-radius:var(--r-l);padding:20px;box-shadow:var(--sh-s);transition:border-color .2s,transform .2s}
.idGrid a:hover{border-color:var(--acc);transform:translateY(-2px)}.idGrid b{font-size:18px}.idGrid p{margin:0;color:var(--secondary);font-size:14px;line-height:1.5}.idGrid span{font-size:12.5px;font-weight:800;color:var(--acc)}
.idCards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.idCard{background:var(--white);border:1px solid var(--line);border-radius:var(--r-l);padding:22px;box-shadow:var(--sh-s);display:grid;gap:8px;align-content:start}
.idCard h3{font-size:19px;line-height:1.25;margin:0}.idCard .pb{font-size:13.5px;color:var(--muted);margin:0}.idCard p{margin:0;font-size:14.5px;line-height:1.6;color:var(--secondary)}
.idCard .tech{display:flex;flex-wrap:wrap;gap:6px}.idCard .tech i{font-style:normal;font-size:12px;font-weight:700;background:var(--acc-soft);color:var(--acc);padding:3px 9px;border-radius:999px}
.idCard .loc{font-size:13px;color:var(--olive2);background:var(--olive-soft);border-radius:10px;padding:8px 10px}
.idCard .aud{font-size:12px;font-weight:800;color:var(--muted);letter-spacing:.04em}.idCard .aud b{color:var(--acc);letter-spacing:2px}
.idLive{margin-top:10px}.idLive .head{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-bottom:14px}
.idLive .dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#28C840;margin-right:8px;box-shadow:0 0 0 0 rgba(40,200,64,.6);animation:idPulse 1.8s infinite}
@keyframes idPulse{70%{box-shadow:0 0 0 10px rgba(40,200,64,0)}100%{box-shadow:0 0 0 0 rgba(40,200,64,0)}}
.idLive select{min-height:42px;border:1px solid var(--line2);border-radius:12px;padding:0 12px;font:600 14px var(--sans);background:#fff}
.idLive .empty{color:var(--secondary);font-size:15px}
.idCta{margin:34px 0 0;padding:26px;border-radius:22px;background:var(--ink);color:#fff;text-align:center}.idCta h2{color:#fff;font-size:clamp(22px,3vw,30px)}.idCta p{opacity:.85;margin:8px auto 16px;max-width:520px}.idCta .btn{background:var(--acc)}
</style>`;

const liveScript = secteur => `
<script>
(function () {
  var box = document.getElementById('idLive'); if (!box) return;
  var list = box.querySelector('.list'), sel = box.querySelector('select'), all = [];
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function paint() {
    var z = sel.value, items = all.filter(function (x) { return !z || x.zone === z; });
    list.innerHTML = items.length ? items.map(function (x) {
      return '<article class="idCard"><span class="aud">' + esc(x.zone) + ' · ' + esc(x.date) + '</span><h3>' + esc(x.titre) + '</h3><p>' + esc(x.idee) + '</p>' + (x.etapes && x.etapes.length ? '<div class="tech">' + x.etapes.map(function (e) { return '<i>' + esc(e) + '</i>'; }).join('') + '</div>' : '') + '</article>';
    }).join('') : '<p class="empty">Aucune idée publiée pour cette zone pour l’instant. Soyez le premier : décrivez votre entreprise sur la page d’accueil.</p>';
  }
  fetch('/api/idees${secteur ? '?secteur=' + secteur : ''}').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
    all = d.idees || []; box.hidden = false;
    var zones = []; all.forEach(function (x) { if (x.zone && zones.indexOf(x.zone) < 0) zones.push(x.zone); });
    sel.innerHTML = '<option value="">Toutes les zones</option>' + zones.sort().map(function (z) { return '<option>' + esc(z) + '</option>'; }).join('');
    sel.addEventListener('change', paint); paint();
  }).catch(function () {});
})();
</script>`;
const liveBlock = (secteur, label) => `
    <div class="idLive" id="idLive" hidden>
      <div class="head"><h2 style="font-size:clamp(22px,3vw,30px);margin:0"><span class="dot"></span>En direct${label ? ' · ' + esc(label) : ''}</h2><select aria-label="Filtrer par zone"></select></div>
      <p class="dayIntro" style="margin-top:-6px">Les plans d’innovation imaginés par notre IA avec des entreprises sur la page d’accueil, publiés anonymement à leur demande.</p>
      <div class="idCards list"></div>
    </div>`;
const ctaBlock = `
    <div class="idCta"><h2>Et pour votre entreprise ?</h2><p>Décrivez-la en une phrase : notre IA imagine avec vous un plan d’innovation sur-mesure, en direct.</p><a class="btn" href="../#heroAI">Imaginer mon plan →</a></div>`;
const audace = n => `<span class="aud">Audace <b>${'●'.repeat(n)}${'○'.repeat(3 - n)}</b></span>`;

function sectorPage(s) {
  const url = `${HOLDING}/idees/${s.slug}.html`;
  const title = `Idées d’innovation pour ${s.label.toLowerCase()} : IA, automatisation | Groupe Solution`;
  const desc = `${s.accroche} ${s.idees.length} idées concrètes d’innovation pour ${s.label.toLowerCase()}, et les plans imaginés en direct par notre IA.`;
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: `Idées d’innovation — ${s.label}`, url, description: desc,
      mainEntity: { '@type': 'ItemList', itemListElement: s.idees.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.titre, description: x.idee })) } },
    crumbs([['Groupe Solution', HOLDING + '/'], ['Laboratoire d’idées', `${HOLDING}/idees/`], [s.label, url]])] };
  const mp = metierPage(s.slug);
  return head({ title, desc, url, jsonld, pre: '../', ogType: 'website' }).replace('</head>', CSS + '</head>') + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <a href="./">Laboratoire d’idées</a> › <span>${esc(s.label)}</span></div>
  <section class="hero idHero" style="padding-bottom:26px"><div class="wrap day" style="text-align:center">
    <div class="kicker reveal">Laboratoire d’idées · ${esc(s.label)}</div>
    <h1 class="reveal" style="margin-top:16px">Réinventer le métier : ${esc(s.label.toLowerCase())}.</h1>
    <p class="lead reveal" style="margin-left:auto;margin-right:auto">${esc(s.accroche)}</p>
  </div></section>
  <section class="sec" style="padding-top:6px"><div class="wrap">
    <div class="idCards">
${s.idees.map(x => `      <article class="idCard reveal">${audace(x.audace || 1)}<h3>${esc(x.titre)}</h3><p class="pb">Le problème : ${esc(x.probleme)}</p><p>${esc(x.idee)}</p><div class="tech">${(x.techno || []).map(t => `<i>${esc(t)}</i>`).join('')}</div>${x.local ? `<p class="loc">📍 ${esc(x.local)}</p>` : ''}</article>`).join('\n')}
    </div>
    <p class="dayIntro" style="margin-top:18px;font-size:14px">Des pistes réalisables avec les technologies d’aujourd’hui, à adapter à chaque entreprise. ${mp ? `Voir aussi : <a href="${mp}" style="text-decoration:underline">site internet pour ${esc(s.label.toLowerCase())}</a> · ` : ''}<a href="../services/" style="text-decoration:underline">nos services</a>.</p>
${liveBlock(s.slug, s.label)}
${ctaBlock}
    <div class="archive"><a href="./">Tous les secteurs<span>Laboratoire d’idées</span></a><a href="../lab/">Le Lab<span>veille & technologies</span></a></div>
  </div></section>${liveScript(s.slug)}` + foot('../', 'idees-' + s.slug);
}

function indexPage() {
  const url = `${HOLDING}/idees/`;
  const title = 'Laboratoire d’idées : innover dans chaque secteur avec l’IA | Groupe Solution';
  const desc = 'Des idées d’innovation concrètes pour chaque secteur d’activité — IA, automatisation, logiciel — et les plans imaginés en direct par notre IA avec des entreprises.';
  const n = secteurs.reduce((a, s) => a + s.idees.length, 0);
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: 'Laboratoire d’idées', url, description: desc, hasPart: secteurs.map(s => ({ '@type': 'CollectionPage', name: s.label, url: `${url}${s.slug}.html` })) },
    crumbs([['Groupe Solution', HOLDING + '/'], ['Laboratoire d’idées', url]])] };
  return head({ title, desc, url, jsonld, pre: '../', ogType: 'website' }).replace('</head>', CSS + '</head>') + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <span>Laboratoire d’idées</span></div>
  <section class="hero idHero" style="padding-bottom:26px"><div class="wrap day" style="text-align:center">
    <div class="kicker reveal">Laboratoire d’idées · ${n} idées · mis à jour en direct</div>
    <h1 class="reveal" style="margin-top:16px">Chaque secteur peut être réinventé.</h1>
    <p class="lead reveal" style="margin-left:auto;margin-right:auto">Agents IA, vision, prévision, logiciels qui se parlent : des idées concrètes pour ${secteurs.length} secteurs, et le fil en direct des plans que notre IA imagine avec des entreprises.</p>
  </div></section>
  <section class="sec" style="padding-top:6px"><div class="wrap">
    <div class="idGrid">
${secteurs.map(s => `      <a class="reveal" href="${s.slug}.html"><span>${s.idees.length} idées</span><b>${esc(s.label)}</b><p>${esc(s.accroche)}</p></a>`).join('\n')}
    </div>
${liveBlock('', '')}
${ctaBlock}
  </div></section>${liveScript('')}` + foot('../', 'idees');
}

secteurs.forEach(s => writeFileSync(join(OUT, s.slug + '.html'), sectorPage(s), 'utf8'));
writeFileSync(join(OUT, 'index.html'), indexPage(), 'utf8');
console.log(`✓ Laboratoire d’idées : ${secteurs.length} secteurs, ${secteurs.reduce((a, s) => a + s.idees.length, 0)} idées`);
