/* ═══════════════════════════════════════════════════════════
   ACTUS QUOTIDIENNES — IA, numérique, réglementation.
   Source : /content/actus/AAAA-MM-JJ.json (un fichier par jour, voir README).
   Chaque actualité DOIT citer au moins une source vérifiable (nom + URL).

   Produit : /lab/actus/index.html, /lab/actus/{date}.html, /lab/actus/rss.xml
             + bloc « Actus » de l'accueil (entre marqueurs ACTUS:START/END).
   Lancer :  node zones/generate-actus.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { esc, STICKY_CSS } from './lib-local.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'content', 'actus');
const OUT = join(ROOT, 'lab', 'actus');
mkdirSync(OUT, { recursive: true });

export function loadActus() {
  return readdirSync(SRC).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort().reverse().map(f => {
    const d = JSON.parse(readFileSync(join(SRC, f), 'utf8'));
    if (!d.items?.length) throw new Error(`${f} : aucune actualité`);
    d.items.forEach((it, i) => { if (!it.sources?.length || !it.sources.every(s => /^https:\/\//.test(s.url))) throw new Error(`${f} #${i + 1} : source https obligatoire`); });
    return d;
  });
}
export const fdate = iso => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const slugify = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const CSS = `${STICKY_CSS}
.actHero{background:radial-gradient(70% 90% at 90% 0%,rgba(230,30,77,.12),transparent 60%)}
.day{max-width:860px;margin:0 auto}
.dayHead{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:22px}
.dayHead h2{font-size:clamp(24px,3vw,32px)}.dayHead time{font-size:13px;font-weight:800;color:var(--muted);text-transform:capitalize}
.dayIntro{font-size:17px;color:var(--secondary);line-height:1.7;margin-bottom:24px}
.news{background:var(--white);border:1px solid var(--line);border-radius:var(--r-l);padding:26px 28px;margin-bottom:16px;box-shadow:var(--sh-s);scroll-margin-top:100px}
.news:target{border-color:var(--acc);box-shadow:0 0 0 4px var(--acc-soft)}
.news .cat{font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--acc)}
.news h3{font-size:22px;font-weight:600;margin-top:8px;line-height:1.25}
.news p{font-size:15.5px;color:var(--secondary);line-height:1.7;margin-top:10px}
.news .why{background:var(--olive-soft);border-radius:14px;padding:14px 16px;color:var(--olive2);font-weight:600;font-size:14.5px}
.news .why.act{background:#FDECEF;color:#9E1239;margin-top:8px}
.news .why b{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}
.news .src{font-size:13px;color:var(--muted);margin-top:12px}.news .src a{color:var(--ink);font-weight:700;text-decoration:underline}
.news .more{display:inline-block;margin-top:12px;font-weight:800;font-size:14px;border-bottom:2px solid var(--acc)}
.archive{max-width:860px;margin:30px auto 0;display:grid;gap:10px}
.archive a{display:flex;justify-content:space-between;gap:14px;background:var(--white);border:1px solid var(--line);border-radius:var(--r-m);padding:14px 18px;font-weight:700}
.archive a span{color:var(--muted);font-weight:600;font-size:13px;text-transform:capitalize;white-space:nowrap}
.rss{display:inline-flex;gap:8px;align-items:center;font-size:13px;font-weight:800;color:var(--amber);background:var(--amber-soft);padding:7px 13px;border-radius:999px}`;

export const head = ({ title, desc, url, jsonld, pre = '../../', ogType = 'article' }) => `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${url}" />
  <link rel="alternate" type="application/rss+xml" title="Actus IA & numérique — Groupe Solution" href="${HOLDING}/lab/actus/rss.xml" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="Groupe Solution" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${HOLDING}/assets/visuel-ressources.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="${pre}favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${pre}assets/holding-local.css" />
  <style>${CSS}</style>
  <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
  </script>
</head>
<body>
<header class="nav"><div class="wrap navin"><a class="brand" href="${pre}index.html" aria-label="Groupe Solution — accueil"><img src="${pre}Logo.svg" alt="Groupe Solution" /></a><nav class="links"><a href="${pre}lab/actus/">Actus</a><a href="${pre}lab/dossiers/">Dossiers</a><a href="${pre}lab/questions/">Questions</a><a href="${pre}lab/veille/">Veille</a><a href="${pre}lab/">Lab</a><a href="${pre}automatisation/">Automatisation</a><a class="cta" href="tel:+33782298559">07 82 29 85 59</a></nav></div></header>
<main>`;

export const foot = (pre = '../../', page = 'actus') => `
  <section class="sec alt"><div class="wrap">
    <div class="express reveal" id="contact">
      <h2>Une de ces évolutions vous concerne ?</h2>
      <p>On vous dit en 10 minutes ce qu'elle change pour votre entreprise — et ce qu'on peut automatiser au passage.</p>
      <form id="expressForm" action="https://formspree.io/f/mzebrvjg" method="POST">
        <input type="hidden" name="page" value="${page}" />
        <label class="full">Votre question<textarea name="message" required></textarea></label>
        <label>Votre nom<input name="nom" autocomplete="name" required /></label>
        <label>Téléphone ou email<input name="contact" autocomplete="email" required /></label>
        <button class="btn" type="submit">Envoyer →</button>
      </form>
      <p class="alts">Plus rapide : <a href="tel:+33782298559">07 82 29 85 59</a> · <a href="${pre}echanger.html#rendez-vous">Réserver 10 min en visio</a></p>
    </div>
  </div></section>
</main>
<footer><div class="wrap foot">
  <span class="footBrand"><img src="${pre}Logo.svg" alt="Groupe Solution" /> © <span id="year"></span> Groupe Solution · Montpellier</span>
  <nav><a href="${pre}index.html">Accueil</a><a href="${pre}lab/actus/">Actus</a><a href="${pre}lab/dossiers/">Dossiers</a><a href="${pre}lab/questions/">Questions</a><a href="${pre}lab/pouls/">Le pouls</a><a href="${pre}idees/">Laboratoire d’idées</a><a href="${pre}lab/coulisses.html">Coulisses</a><a href="${pre}lab/actus/rss.xml">Flux RSS</a><a href="${pre}lab/veille/">Veille</a><a href="${pre}lab/">Lab</a><a href="${pre}automatisation/">Automatisation</a><a href="${pre}plan-du-site.html">Plan du site</a></nav>
</div></footer>
<div class="gs-sticky"><a class="s1" href="tel:+33782298559"><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:6px"><path d="M6.5 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/></svg>Appeler</a><a class="s2" href="#contact">Poser ma question</a></div>
<script src="${pre}assets/holding-local.js" defer></script>
<script src="${pre}assets/pouls.js" defer></script>
<script src="/analytics.js" defer></script>
</body>
</html>
`;

const newsHTML = (d, it, i, linkBase = '') => `
    <article class="news reveal" id="${slugify(it.titre)}">
      <span class="cat">${esc(it.cat)}</span>
      <h3>${esc(it.titre)}</h3>
      <p>${esc(it.resume)}</p>
      <p class="why"><b>Ce que ça change pour vous</b>${esc(it.pourquoi)}</p>${it.action ? `
      <p class="why act"><b>À faire cette semaine</b>${esc(it.action)}</p>` : ''}
      <p class="src">Sources : ${it.sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener nofollow">${esc(s.nom)}</a>`).join(' · ')}</p>
      ${it.lien ? `<a class="more" href="${linkBase}${esc(it.lien.url)}">${esc(it.lien.label)} →</a>` : ''}
      <div class="poll" data-poll="actu-${d.date}-${slugify(it.titre).slice(0, 80)}" hidden></div>
    </article>`;

function dayPage(d, all) {
  const url = `${HOLDING}/lab/actus/${d.date}.html`;
  const title = `Actus IA & numérique du ${new Date(d.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} | Groupe Solution`;
  const desc = d.intro.length > 158 ? d.intro.slice(0, 155).replace(/\s+\S*$/, '') + '…' : d.intro;
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'NewsArticle', headline: d.titre, description: desc, datePublished: d.date, dateModified: d.date, url, inLanguage: 'fr-FR',
      author: { '@type': 'Person', name: 'Titouan Bedos' }, publisher: { '@type': 'Organization', name: 'Groupe Solution', logo: { '@type': 'ImageObject', url: HOLDING + '/Logo.svg' } },
      image: HOLDING + '/assets/visuel-ressources.jpg', citation: d.items.flatMap(it => it.sources.map(s => s.url)) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Actus', item: `${HOLDING}/lab/actus/` }, { '@type': 'ListItem', position: 3, name: d.date, item: url }] }] };
  const i = all.indexOf(d), prev = all[i + 1], next = all[i - 1];
  return head({ title, desc, url, jsonld }) + `
  <div class="wrap crumbs"><a href="../../index.html">Groupe Solution</a> › <a href="./">Actus</a> › <span>${esc(fdate(d.date))}</span></div>
  <section class="hero actHero" style="padding-bottom:30px"><div class="wrap day">
    <div class="kicker reveal">Actus du ${esc(fdate(d.date))}</div>
    <h1 class="reveal" style="font-size:clamp(30px,4.2vw,46px);margin-top:16px">${esc(d.titre)}</h1>
    <p class="lead reveal">${esc(d.intro)}</p>
  </div></section>
  <section class="sec" style="padding-top:10px"><div class="wrap day">
${d.items.map((it, k) => newsHTML(d, it, k)).join('')}
    <div class="archive">${prev ? `<a href="${prev.date}.html">← ${esc(prev.titre)}<span>${esc(fdate(prev.date))}</span></a>` : ''}${next ? `<a href="${next.date}.html">${esc(next.titre)} →<span>${esc(fdate(next.date))}</span></a>` : ''}<a href="./">Toutes les actus<span>archive</span></a></div>
  </div></section>` + foot();
}

function indexPage(all) {
  const url = `${HOLDING}/lab/actus/`;
  const title = 'Actus IA, numérique et réglementation pour les entreprises | Groupe Solution';
  const desc = "Chaque jour, les actualités de l'IA, du numérique et de la réglementation qui comptent pour les entreprises, sourcées et expliquées : ce que ça change pour vous.";
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: 'Actus IA & numérique', url, description: desc, hasPart: all.map(d => ({ '@type': 'NewsArticle', headline: d.titre, datePublished: d.date, url: `${HOLDING}/lab/actus/${d.date}.html` })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Actus', item: url }] }] };
  const latest = all.slice(0, 5);
  return head({ title, desc, url, jsonld }) + `
  <div class="wrap crumbs"><a href="../../index.html">Groupe Solution</a> › <a href="../">Lab</a> › <span>Actus</span></div>
  <section class="hero actHero" style="padding-bottom:30px"><div class="wrap day" style="text-align:center">
    <div class="kicker reveal">Actus · sourcées et expliquées</div>
    <h1 class="reveal" style="margin-top:16px">L’actualité IA &amp; numérique, traduite pour les entreprises.</h1>
    <p class="lead reveal" style="margin-left:auto;margin-right:auto">Chaque actualité est vérifiée, citée avec ses sources, et accompagnée de ce qu’elle change concrètement pour une entreprise.</p>
    <p class="reveal" style="margin-top:18px"><a class="rss" href="rss.xml">◉ S’abonner au flux RSS</a></p>
  </div></section>
  <section class="sec" style="padding-top:10px"><div class="wrap">
${latest.map(d => `    <div class="day"><div class="dayHead"><h2><a href="${d.date}.html">${esc(d.titre)}</a></h2><time datetime="${d.date}">${esc(fdate(d.date))}</time></div><p class="dayIntro">${esc(d.intro)}</p>${d.items.map((it, k) => newsHTML(d, it, k)).join('')}</div>`).join('\n')}
    ${all.length > 5 ? `<div class="archive"><h2 style="font-size:24px">Archives</h2>${all.slice(5).map(d => `<a href="${d.date}.html">${esc(d.titre)}<span>${esc(fdate(d.date))}</span></a>`).join('')}</div>` : ''}
  </div></section>` + foot();
}

function rss(all) {
  const items = all.flatMap(d => d.items.map(it => `    <item>
      <title>${esc(it.titre)}</title>
      <link>${HOLDING}/lab/actus/${d.date}.html#${slugify(it.titre)}</link>
      <guid isPermaLink="false">${d.date}-${slugify(it.titre)}</guid>
      <pubDate>${new Date(d.date + 'T08:00:00Z').toUTCString()}</pubDate>
      <category>${esc(it.cat)}</category>
      <description>${esc(it.resume + ' — Ce que ça change : ' + it.pourquoi)}</description>
    </item>`)).slice(0, 60).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Actus IA &amp; numérique — Groupe Solution</title>
    <link>${HOLDING}/lab/actus/</link>
    <atom:link href="${HOLDING}/lab/actus/rss.xml" rel="self" type="application/rss+xml" />
    <description>Les actualités de l'IA, du numérique et de la réglementation qui comptent pour les entreprises, sourcées et expliquées.</description>
    <language>fr-fr</language>
    <lastBuildDate>${new Date(all[0].date + 'T08:00:00Z').toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

/* Bloc accueil (3 dernières actus) */
function homeBlock(all) {
  const items = all.flatMap(d => d.items.map(it => ({ d, it }))).slice(0, 3);
  return `<!-- ACTUS:START (généré par zones/generate-actus.mjs) -->
  <section class="sec hx alt" id="actus"><div class="wrap">
    <div class="hxHead reveal"><div class="kicker">En direct · ${esc(fdate(all[0].date))}</div><h2>Ce qui bouge en ce moment.</h2></div>
    <div class="hxNews">
${items.map(({ d, it }) => `      <a class="reveal" href="lab/actus/${d.date}.html#${slugify(it.titre)}"><small>${esc(it.cat)}</small><b>${esc(it.titre)}</b></a>`).join('\n')}
    </div>
    <div class="hxNl reveal"><form id="nlForm"><div><b>L’essentiel du lundi</b><span>Les actus de la semaine et l’action à mener, dans votre boîte mail. Désinscription en un clic.</span></div><input type="email" name="email" required placeholder="Votre e-mail professionnel" autocomplete="email" aria-label="Votre e-mail"><button type="submit">Je m’inscris</button><p class="nlMsg" role="status"></p></form><a class="hxAll" href="lab/actus/">Toutes les actus →</a></div>
    <script>(function(){var f=document.getElementById('nlForm');if(!f)return;f.addEventListener('submit',function(e){e.preventDefault();var b=f.querySelector('button'),m=f.querySelector('.nlMsg');b.disabled=true;fetch('/api/devis',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'newsletter',email:f.email.value,source:'accueil'})}).then(function(r){return r.json().then(function(j){if(!r.ok)throw j;return j;});}).then(function(j){m.textContent=j.deja?'Vous êtes déjà inscrit, merci !':'Presque fini : confirmez votre inscription dans l’e-mail que nous venons d’envoyer.';f.email.value='';if(window.gtag)gtag('event','newsletter_signup');}).catch(function(j){b.disabled=false;m.textContent=(j&&j.message)||'L’inscription n’a pas abouti, réessayez.';});});})();</script>
  </div></section>
  <!-- ACTUS:END -->`;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const all = loadActus();
  all.forEach(d => writeFileSync(join(OUT, `${d.date}.html`), dayPage(d, all), 'utf8'));
  writeFileSync(join(OUT, 'index.html'), indexPage(all), 'utf8');
  writeFileSync(join(OUT, 'rss.xml'), rss(all), 'utf8');
  const idxPath = join(ROOT, 'index.html');
  let idx = readFileSync(idxPath, 'utf8');
  idx = idx.includes('<!-- ACTUS:START') ? idx.replace(/<!-- ACTUS:START[\s\S]*?<!-- ACTUS:END -->/, homeBlock(all)) : idx.replace('  <!-- ══ LA PREUVE ══ -->', homeBlock(all) + '\n\n  <!-- ══ LA PREUVE ══ -->');
  writeFileSync(idxPath, idx, 'utf8');
  console.log(`✓ Actus : ${all.length} jour(s), ${all.reduce((n, d) => n + d.items.length, 0)} actualités, RSS + bloc accueil`);
}
