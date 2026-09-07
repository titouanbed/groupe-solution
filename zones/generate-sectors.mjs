/* ═══════════════════════════════════════════════════════════
   Générateur de PILIERS SECTORIELS (par métier × territoire).
   Source : zones/zones.mjs + zones/sectors.mjs.
   Produit /{zone}/secteurs/{secteur}.html + /{zone}/secteurs/index.html.

   Ne génère qu'un couple (zone × secteur) si son contenu est rédigé
   dans CONTENT → rollout zone par zone sans page vide.

   Lancer :  node zones/generate-sectors.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ZONES, HOLDING } from './zones.mjs';
import { SECTORS, CONTENT } from './sectors.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const jstr = s => JSON.stringify(String(s));

const ICONS = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="i-arrow-right" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></symbol>
</svg>`;

const HEAD_STYLE = `<style>
  .blognav{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(255,255,255,.98);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.05);padding:12px 0}
  .blognav .container{display:flex;align-items:center;justify-content:space-between;gap:16px}
  .blognav .nav-logo img{height:32px}
  .blognav .bnl{display:flex;gap:22px;align-items:center}
  .blognav .bnl a{color:var(--gris-fonce);font-weight:500;font-size:.88rem;text-decoration:none;white-space:nowrap}
  .blognav .bnl a:hover{color:var(--rose-fonce)}
  main{padding-top:0}
  .article-head{padding:96px 0 26px;background:linear-gradient(135deg,var(--rose-clair) 0%,var(--blanc) 100%)}
  .breadcrumb{font-size:12.5px;color:var(--gris);font-weight:600}
  .breadcrumb a{color:var(--rose-fonce);text-decoration:none}
  .article-tag{display:inline-flex;align-items:center;gap:6px;background:var(--blanc);color:var(--rose-fonce);border:1px solid var(--rose);padding:5px 13px;border-radius:999px;font-size:.75rem;font-weight:700;margin:16px 0 4px}
  .article-head h1{font-size:clamp(1.9rem,4.2vw,2.9rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-top:10px;max-width:24ch;color:var(--gris-fonce)}
  .article-meta{margin-top:14px;color:var(--gris);font-size:.85rem;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
  .article-body{padding:34px 0 50px;background:var(--blanc)}
  .prose{max-width:760px;margin:0 auto;font-size:1.06rem;line-height:1.8;color:#374151}
  .prose .lead{font-size:1.2rem;line-height:1.7;color:var(--gris-fonce);font-weight:500;margin-bottom:8px}
  .prose h2{font-size:clamp(1.35rem,2.4vw,1.7rem);font-weight:800;line-height:1.2;margin:38px 0 12px;color:var(--gris-fonce)}
  .prose p{margin:14px 0}
  .prose ul{margin:14px 0;padding-left:22px}
  .prose li{margin:9px 0}
  .prose strong{color:var(--gris-fonce);font-weight:700}
  .callout{background:var(--rose-clair);border-left:3px solid var(--rose-fonce);border-radius:12px;padding:20px 26px;margin:30px 0}
  .callout p{margin:0;font-weight:500;color:var(--gris-fonce)}
  .article-cta{max-width:760px;margin:10px auto 0;background:var(--gris-fonce);color:var(--blanc);border-radius:20px;padding:36px 34px;text-align:center}
  .article-cta h3{font-size:1.5rem;font-weight:800;margin-bottom:10px}
  .article-cta p{opacity:.85;margin-bottom:22px}
  .article-cta .btn{background:var(--rose);color:var(--noir)}
  .article-cta .btn:hover{background:var(--rose-fonce);color:var(--blanc)}
  .guides{max-width:760px;margin:44px auto 0}
  .guides h3{font-size:1.15rem;font-weight:800;margin-bottom:14px}
  .guides .glist{display:grid;gap:12px}
  .guides a{display:flex;justify-content:space-between;align-items:center;gap:14px;background:var(--blanc);border:1px solid var(--gris-clair);border-radius:14px;padding:16px 20px;text-decoration:none;color:var(--gris-fonce);font-weight:600;box-shadow:var(--box-shadow);transition:var(--transition)}
  .guides a:hover{border-color:var(--rose);transform:translateY(-2px)}
  .guides a span{color:var(--rose-fonce)}
  .cities-mesh{max-width:760px;margin:26px auto 0;display:flex;flex-wrap:wrap;gap:9px}
  .cities-mesh a{font-size:.85rem;font-weight:600;color:var(--rose-fonce);background:var(--rose-clair);border:1px solid var(--rose);border-radius:999px;padding:7px 14px;text-decoration:none}
  .cities-mesh a:hover{background:var(--rose);color:var(--noir)}
  /* hub */
  .blogindex{padding:120px 0 90px;background:var(--paper,#f9fafb)}
  .blogindex .head{text-align:center;max-width:680px;margin:0 auto 44px}
  .blogindex h1{font-size:clamp(2rem,4vw,2.8rem);font-weight:800;line-height:1.1}
  .blogindex .head p{color:var(--gris);font-size:1.1rem;margin-top:14px}
  .bgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;max-width:960px;margin:0 auto}
  .bcard{background:var(--blanc);border:1px solid var(--gris-clair);border-radius:16px;padding:26px;text-decoration:none;color:var(--gris-fonce);box-shadow:var(--box-shadow);transition:var(--transition);display:flex;flex-direction:column;gap:10px}
  .bcard:hover{transform:translateY(-4px);box-shadow:var(--box-shadow-lg);border-color:var(--rose)}
  .bcard .em{font-size:1.6rem}
  .bcard .t{font-size:.72rem;font-weight:700;color:var(--rose-fonce);text-transform:uppercase;letter-spacing:.08em}
  .bcard h3{font-size:1.1rem;font-weight:700;line-height:1.3}
  .bcard p{font-size:.92rem;color:var(--gris);line-height:1.55}
  .bcard .more{margin-top:auto;color:var(--rose-fonce);font-weight:700;font-size:.9rem}
  @media(max-width:760px){.blognav .bnl a:not(.bn-cta){display:none}}
</style>`;

function faqBlock(faq) {
  if (!faq || !faq.length) return '';
  const items = faq.map(f => `      <div class="faq-item reveal"><div class="faq-q">${esc(f.q)}</div><div class="faq-a"><p>${esc(f.a)}</p></div></div>`).join('\n');
  return `\n  <section id="faq" style="background:var(--gris-clair);padding:60px 0">
    <div class="container">
      <div class="section-header"><span class="section-tag">FAQ</span><h2 style="font-size:1.8rem">Questions fréquentes</h2></div>
      <div class="faq">\n${items}\n      </div>
    </div>
  </section>`;
}
const faqJsonLd = faq => (faq || []).slice(0, 4)
  .map(f => `    { "@type": "Question", "name": ${jstr(f.q)}, "acceptedAnswer": { "@type": "Answer", "text": ${jstr(f.a)} } }`).join(',\n');

/* Secteurs de la zone qui ont un contenu rédigé */
const zoneSectors = zone => SECTORS.filter(s => CONTENT[s.slug] && CONTENT[s.slug][zone.slug]);

/* La zone a-t-elle un index de blog généré ? (même condition que generate-blog) */
const hasBlog = zone => !!(zone.region || (zone.cities && zone.cities.some(c => c.faq)));

function sectorPage(sector, zone) {
  const c = CONTENT[sector.slug][zone.slug];
  const url = `${HOLDING}/${zone.slug}/secteurs/${sector.slug}.html`;
  const regionUrl = `../${zone.regionPage}`;
  const body = `        <p class="lead">${c.lead}</p>\n` +
    c.sections.map(s => `        <h2>${esc(s.h2)}</h2>\n${s.html.split('\n').map(l => '        ' + l).join('\n')}`).join('\n') +
    (c.callout ? `\n        <div class="callout"><p>${esc(c.callout)}</p></div>` : '');

  const others = zoneSectors(zone).filter(s => s.slug !== sector.slug)
    .map(s => `        <a href="${s.slug}.html">${esc(CONTENT[s.slug][zone.slug].title)} <span>Lire →</span></a>`).join('\n');

  const cityMesh = (zone.cities && zone.cities.length)
    ? `\n      <div class="cities-mesh">${zone.cities.map(ci => `<a href="../site-internet-${ci.slug}.html">Agence web ${esc(ci.name)}</a>`).join('')}</div>`
    : '';

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(c.title)} | GroupSolution</title>
  <meta name="description" content="${esc(c.desc)}" />
  <meta name="keywords" content="${esc(c.keywords)}" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${jstr(c.title)},
    "description": ${jstr(c.desc)},
    "inLanguage": "fr",
    "datePublished": "2026-09-07",
    "author": { "@type": "Organization", "name": "GroupSolution" },
    "publisher": { "@type": "Organization", "name": "Groupe Solution", "url": "${HOLDING}" },
    "mainEntityOfPage": ${jstr(url)},
    "about": ${jstr(sector.label + ' — ' + zone.name)}
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": ${jstr('Agence ' + zone.name)}, "item": ${jstr(HOLDING + '/' + zone.slug + '/' + zone.regionPage)} },
      { "@type": "ListItem", "position": 2, "name": "Secteurs", "item": ${jstr(HOLDING + '/' + zone.slug + '/secteurs/')} },
      { "@type": "ListItem", "position": 3, "name": ${jstr(c.title)} }
    ]
  }
  </script>
  <script type="application/ld+json">
  { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
${faqJsonLd(c.faq)}
  ] }
  </script>

  <link rel="canonical" href="${url}" />
  <link rel="icon" type="image/svg+xml" href="../../Logo.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/silo.css" />
  ${HEAD_STYLE}
</head>
<body>
  ${ICONS}
  <nav class="blognav"><div class="container">
    <a href="${regionUrl}" class="nav-logo"><img src="../../Logo.svg" alt="GroupSolution ${esc(zone.name)}" /></a>
    <div class="bnl">
      <a href="index.html">Secteurs ${esc(zone.name)}</a>
      <a href="${regionUrl}">L'agence ${esc(zone.name)}</a>
      ${hasBlog(zone) ? '<a href="../blog/">Guides</a>' : ''}
      <a href="#" onclick="openModal();return false;" class="bn-cta btn btn-primary" style="padding:8px 16px">Contact</a>
    </div>
  </div></nav>

  <main>
    <header class="article-head"><div class="container">
      <div class="breadcrumb"><a href="${regionUrl}">Agence ${esc(zone.name)}</a> › <a href="index.html">Secteurs</a> › ${esc(sector.label)}</div>
      <span class="article-tag"><svg class="icon" style="width:13px;height:13px"><use href="#i-clock"/></svg> ${esc(c.tag)}</span>
      <h1>${esc(c.h1)}</h1>
      <div class="article-meta"><span>Par GroupSolution</span><span>·</span><span>Lecture 4 min</span></div>
    </div></header>

    <section class="article-body"><div class="container">
      <article class="prose">
${body}
      </article>
${cityMesh}
${others ? `      <div class="guides">
        <h3>Autres secteurs en ${esc(zone.name)}</h3>
        <div class="glist">
${others}
        </div>
      </div>` : ''}

      <div class="article-cta" style="margin-top:44px">
        <h3>Un projet web en ${esc(zone.name)} ?</h3>
        <p>Audit gratuit de 15 minutes. On regarde votre situation et on vous dit quoi faire, sans engagement.</p>
        <a href="${regionUrl}" class="btn btn-primary" style="display:inline-flex">Voir l'agence ${esc(zone.name)} →</a>
      </div>
    </div></section>
${faqBlock(c.faq)}
  </main>

  <footer style="background:var(--noir-doux);color:#a1a1aa;padding:40px 0;text-align:center;font-size:.85rem"><div class="container">
    <p style="margin-bottom:10px"><a href="${regionUrl}" style="color:var(--rose)">Agence web ${esc(zone.name)}</a> · <a href="index.html" style="color:var(--rose)">Nos secteurs</a> · <a href="https://www.groupsolution.fr" style="color:var(--rose)">Groupe Solution</a></p>
    <p>© 2026 GroupSolution SAS. Tous droits réservés.</p>
  </div></footer>

  <div class="modal-overlay" id="contactModal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal()" aria-label="Fermer"><svg class="icon"><use href="#i-x"/></svg></button>
      <div class="modal-header"><h3>Parlons de votre projet <br><span class="accent">en ${esc(zone.name)}</span></h3><p>Décrivez votre besoin, je vous recontacte sous 24h.</p></div>
      <form action="https://formspree.io/f/mzebrvjg" method="POST" id="contactForm">
        <div class="form-group"><label>Votre nom</label><input type="text" name="nom" required /></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
          <div class="form-group"><label>Téléphone</label><input type="tel" name="telephone" required /></div>
          <div class="form-group"><label>Email</label><input type="email" name="email" required /></div>
        </div>
        <div class="form-group"><label>Votre projet</label><textarea name="message" placeholder="Je voudrais un site web pour..." required></textarea></div>
        <input type="hidden" name="_zone" value="${esc(zone.name)} — via secteur (${esc(sector.label)})" />
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center"><svg class="icon"><use href="#i-arrow-right"/></svg> Envoyer ma demande</button>
      </form>
    </div>
  </div>

  <script>
    const modal=document.getElementById('contactModal'),body=document.body;
    function openModal(){modal.classList.add('open');body.classList.add('modal-open');}
    function closeModal(){modal.classList.remove('open');body.classList.remove('modal-open');}
    modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
    document.querySelectorAll('.faq-q').forEach(q=>q.addEventListener('click',()=>{const i=q.parentElement,o=i.classList.contains('open');document.querySelectorAll('.faq-item').forEach(x=>x.classList.remove('open'));if(!o)i.classList.add('open');}));
    const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.1});
    document.querySelectorAll('.reveal').forEach(el=>ob.observe(el));
  </script>
  <script src="/analytics.js" defer></script>
</body>
</html>
`;
}

function hubPage(zone, sectors) {
  const cards = sectors.map(s => {
    const c = CONTENT[s.slug][zone.slug];
    return `        <a class="bcard" href="${s.slug}.html"><span class="em">${s.emoji}</span><span class="t">${esc(s.label)}</span><h3>${esc(c.h1)}</h3><p>${esc(c.lead.slice(0, 130))}…</p><span class="more">Lire le guide →</span></a>`;
  }).join('\n');

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sites internet par secteur — ${esc(zone.name)} | GroupSolution</title>
  <meta name="description" content="Nos guides web par métier en ${esc(zone.name)} : restauration, tourisme &amp; hébergement, bâtiment. Comment un site et Google développent votre activité, secteur par secteur." />
  <link rel="canonical" href="${HOLDING}/${zone.slug}/secteurs/" />
  <link rel="icon" type="image/svg+xml" href="../../Logo.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/silo.css" />
  ${HEAD_STYLE}
</head>
<body>
  ${ICONS}
  <nav class="blognav"><div class="container">
    <a href="../${zone.regionPage}" class="nav-logo"><img src="../../Logo.svg" alt="GroupSolution ${esc(zone.name)}" /></a>
    <div class="bnl">
      <a href="../${zone.regionPage}">L'agence ${esc(zone.name)}</a>
      ${hasBlog(zone) ? '<a href="../blog/">Guides</a>' : ''}
      <a href="https://www.groupsolution.fr">Groupe Solution ↗</a>
    </div>
  </div></nav>
  <main><section class="blogindex"><div class="container">
    <div class="head">
      <h1>Votre secteur, notre expertise — ${esc(zone.name)}</h1>
      <p>Chaque métier a ses codes en ligne. Voici comment un site web et Google font venir vos clients, secteur par secteur, en ${esc(zone.name)}.</p>
    </div>
    <div class="bgrid">
${cards}
    </div>
  </div></section></main>
  <footer style="background:var(--noir-doux);color:#a1a1aa;padding:40px 0;text-align:center;font-size:.85rem"><div class="container">
    <p><a href="../${zone.regionPage}" style="color:var(--rose)">Agence web ${esc(zone.name)}</a>${hasBlog(zone) ? ' · <a href="../blog/" style="color:var(--rose)">Guides</a>' : ''} · <a href="https://www.groupsolution.fr" style="color:var(--rose)">Groupe Solution</a></p>
    <p>© 2026 GroupSolution SAS.</p>
  </div></footer>
  <script src="/analytics.js" defer></script>
</body>
</html>
`;
}

let n = 0, hubs = 0;
for (const zone of ZONES) {
  if (zone.status !== 'online') continue;
  const sectors = zoneSectors(zone);
  if (!sectors.length) continue;
  const dir = join(ROOT, zone.slug, 'secteurs');
  mkdirSync(dir, { recursive: true });
  for (const sector of sectors) {
    writeFileSync(join(dir, `${sector.slug}.html`), sectorPage(sector, zone), 'utf8');
    n++;
  }
  writeFileSync(join(dir, 'index.html'), hubPage(zone, sectors), 'utf8');
  hubs++;
  console.log('✓', `${zone.slug}/secteurs/ — ${sectors.length} piliers`);
}
console.log(`\n${n} piliers sectoriels + ${hubs} hubs générés.`);
