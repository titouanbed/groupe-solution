/* ═══════════════════════════════════════════════════════════
   Pages « Automatisation et logiciel sur-mesure » par territoire d'outre-mer.
   Produit : /{zone}/automatisation-{zone}.html  (7 pages indexables)
   + insère (de façon idempotente) un lien vers cette page dans le hub
     du territoire /{zone}/site-internet-{zone}.html, juste avant la bande
     « Groupe Solution » (marqueurs <!-- gs-auto-outremer:start/end -->).

   Charte : ../assets/silo.css (même gabarit que les pages du territoire).
   Contenu : content/outremer-automatisation.mjs (unique par territoire).

   Règles : aucun prix, aucun montant, aucun délai garanti, aucun client,
   aucun témoignage, aucune statistique non sourcée. Pas d'agence ni de
   bureaux revendiqués hors Saint-Jean-de-Védas et Mayotte.
   FAQ visible et FAQPage JSON-LD produits depuis la même source.

   Lancer :  node zones/generate-automatisation-outremer.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TERRITOIRES } from '../content/outremer-automatisation.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.groupsolution.fr';
const TEL = 'tel:+33782298559';
const TEL_TXT = '07 82 29 85 59';
const RDV = '/echanger.html#rendez-vous';
const ASSISTANT = '/#heroAI';
const PROVIDER = { '@id': `${SITE}/#org`, '@type': 'Organization', name: 'Groupe Solution' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = s => String(s).replace(/<[^>]+>/g, '');
const ld = obj => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');
const ul = items => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
const wordCount = html => strip(html).replace(/&[a-z#0-9]+;/gi, ' ').split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;

const STYLE = `<style>
  .gsnav{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(255,255,255,.98);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.05);padding:12px 0}
  .gsnav .container{display:flex;align-items:center;justify-content:space-between;gap:16px}
  .gsnav .nav-logo img{height:32px;display:block}
  .gsnav .l{display:flex;gap:20px;align-items:center}
  .gsnav .l a{color:var(--gris-fonce);font-weight:500;font-size:.88rem;text-decoration:none;white-space:nowrap}
  .gsnav .l a:hover{color:var(--rose-fonce)}
  .gsnav .l a.btn{font-weight:700;padding:8px 16px}
  .ahead{padding:96px 0 34px;background:linear-gradient(135deg,var(--rose-clair) 0%,var(--blanc) 100%)}
  .crumb{font-size:12.5px;color:var(--gris);font-weight:600;overflow-wrap:anywhere}
  .crumb a{color:var(--rose-fonce);text-decoration:none}
  .tag{display:inline-flex;align-items:center;gap:6px;background:var(--blanc);color:var(--rose-fonce);border:1px solid var(--rose);padding:5px 13px;border-radius:999px;font-size:.75rem;font-weight:700;margin:16px 0 4px}
  .ahead h1{font-size:clamp(1.8rem,4.2vw,2.8rem);font-weight:800;line-height:1.12;letter-spacing:-.02em;margin-top:10px;max-width:24ch;color:var(--gris-fonce)}
  .ahead .lead{font-size:1.12rem;line-height:1.7;color:#374151;max-width:760px;margin-top:16px}
  .ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
  .ctas .btn{padding:12px 18px;font-size:.95rem;text-decoration:none}
  .devise{margin-top:18px;font-size:.92rem;color:var(--gris-fonce)}
  .devise b{font-weight:700}
  .abody{padding:30px 0 56px;background:var(--blanc)}
  .prose{max-width:780px;margin:0 auto;font-size:1.05rem;line-height:1.8;color:#374151;overflow-wrap:break-word}
  .prose h2{font-size:clamp(1.35rem,2.4vw,1.75rem);font-weight:800;line-height:1.22;margin:40px 0 12px;color:var(--gris-fonce);scroll-margin-top:80px}
  .prose h3{font-size:1.12rem;font-weight:700;margin:24px 0 6px;color:var(--gris-fonce)}
  .prose p{margin:14px 0}
  .prose ul,.prose ol{margin:14px 0;padding-left:22px}
  .prose li{margin:9px 0}
  .prose strong{color:var(--gris-fonce);font-weight:700}
  .prose a{color:var(--rose-fonce);text-decoration:underline;text-underline-offset:3px}
  .toc{background:var(--gris-clair);border:1px solid #eee;border-radius:16px;padding:18px 22px;margin:6px 0 10px}
  .toc p{margin:0 0 8px!important;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;font-weight:800;color:var(--gris)}
  .toc ol{margin:0!important;font-size:.95rem;line-height:1.55}
  .toc a{color:var(--gris-fonce);text-decoration:none;font-weight:600}
  .ex{display:grid;gap:14px;margin:18px 0}
  .ex div{border:1px solid #eee;border-radius:16px;padding:16px 18px;background:var(--blanc);box-shadow:var(--box-shadow)}
  .ex h3{margin:0 0 4px!important}
  .ex p{margin:0!important;font-size:1rem}
  .callout{background:var(--rose-clair);border-left:3px solid var(--rose-fonce);border-radius:12px;padding:18px 22px;margin:26px 0}
  .callout p{margin:0!important;color:var(--gris-fonce)}
  .cta2{max-width:780px;margin:34px auto 0;background:var(--gris-fonce);color:var(--blanc);border-radius:20px;padding:30px 26px;text-align:center}
  .cta2 h2{font-size:1.45rem;font-weight:800;margin-bottom:8px;color:var(--blanc)}
  .cta2 p{opacity:.85;margin-bottom:18px}
  .cta2 .ctas{justify-content:center}
  .gfaq{background:var(--gris-clair);padding:56px 0}
  .gfaq h2{font-size:1.8rem;font-weight:800;text-align:center;margin-bottom:22px}
  .gfaq .list{max-width:820px;margin:0 auto}
  .gfaq details{background:var(--blanc);border:1px solid #eee;border-radius:14px;margin-bottom:10px;padding:0 20px}
  .gfaq summary{cursor:pointer;list-style:none;padding:17px 26px 17px 0;font-weight:700;position:relative}
  .gfaq summary::-webkit-details-marker{display:none}
  .gfaq summary::after{content:"+";position:absolute;right:0;top:12px;font-size:1.4rem;color:var(--gris)}
  .gfaq details[open] summary::after{content:"–"}
  .gfaq details p{padding:0 0 18px;color:#374151;line-height:1.7}
  .gform{padding:56px 0;background:var(--blanc)}
  .gform .box{max-width:720px;margin:0 auto;border:1px solid #eee;border-radius:20px;box-shadow:var(--box-shadow-lg);padding:28px 24px}
  .gform h2{font-size:1.6rem;font-weight:800;text-align:center}
  .gform .sub{text-align:center;color:var(--gris);margin:8px 0 20px}
  .gform form{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .gform label{display:flex;flex-direction:column;gap:6px;font-size:.85rem;font-weight:700}
  .gform .full{grid-column:1/-1}
  .gform input,.gform textarea{padding:12px 14px;border:1px solid #ddd;border-radius:12px;font:inherit;font-size:16px;width:100%}
  .gform textarea{min-height:100px;resize:vertical}
  .gform button{grid-column:1/-1;justify-content:center}
  .gform .alts{text-align:center;margin-top:14px;font-size:.92rem;color:var(--gris)}
  .gform .alts a{color:var(--rose-fonce);font-weight:700}
  .gfoot{background:var(--noir-doux);color:#a1a1aa;padding:40px 0 30px;text-align:center;font-size:.88rem}
  .gfoot a{color:var(--rose)}
  .gfoot p{margin:6px 0}
  @media(max-width:760px){.gsnav .l a:not(.btn){display:none}.ctas{flex-direction:column}.ctas .btn{width:100%;justify-content:center}.gform form{grid-template-columns:1fr}.ahead{padding-top:86px}}
</style>`;

function page(t) {
  const url = `${SITE}/${t.slug}/automatisation-${t.slug}.html`;
  const hub = `site-internet-${t.slug}.html`;
  const sections = [
    { id: 'economie', h2: t.ecoH2, html: t.eco },
    { id: 'contraintes', h2: t.contH2, html: t.contraintes },
    { id: 'exemples', h2: `Exemples d’automatisations adaptées ${t.a}`, html: `<p>${t.exIntro}</p><div class="ex">${t.exemples.map(([h, p]) => `<div><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>` },
    { id: 'logiciel', h2: `Logiciel sur-mesure ${t.a} : quand est-ce pertinent ?`, html: t.logiciel },
    { id: 'methode', h2: 'Comment se déroule un projet avec Groupe Solution', html: `
<p>${t.presence}</p>
<ol>
<li><strong>Un appel de 10 minutes</strong>, par téléphone ou en visio, pour comprendre votre activité et repérer ce qui vous fait perdre du temps. ${t.horaire}</li>
<li><strong>Une proposition écrite, sur devis</strong> : automatisations ou modules retenus, outils connectés, validations humaines, propriété du code et des données, suivi.</li>
<li><strong>Une construction par étapes</strong>, testée sur vos cas réels avant d’être généralisée.</li>
<li><strong>La mise en service</strong>, avec prise en main par vos équipes et ajustements.</li>
<li><strong>Le suivi</strong> : maintenance, sécurité, évolutions selon vos priorités.</li>
</ol>
<p>La propriété du code, l’export de vos données et la détention des accès sont toujours fixés par écrit. Et notre devise s’applique partout : <strong>nous gagnons de l’argent uniquement si vous en gagnez</strong>.</p>` },
    { id: 'cadre', h2: 'Données, réglementation et sécurité', html: t.cadre },
    { id: 'aller-plus-loin', h2: 'Pour aller plus loin', html: `
<p>Nos dossiers de référence détaillent chaque sujet : ${[
  ['automatisation-entreprise', 'automatisation d’entreprise'],
  ['logiciel-sur-mesure-pme', 'logiciel sur-mesure pour PME'],
  ['application-metier-sur-mesure', 'application métier sur-mesure'],
  ['logiciel-de-gestion-sur-mesure', 'logiciel de gestion sur-mesure'],
  ['agent-ia-entreprise-exemples', 'agents IA : exemples par métier'],
].map(([s, n]) => `<a href="../services/${s}.html">${n}</a>`).join(', ')}.</p>
${ul([
  `Par secteur ${t.a} : <a href="secteurs/batiment-artisans.html">bâtiment et artisans</a>, <a href="secteurs/restauration.html">restauration</a>, <a href="secteurs/tourisme-hebergement.html">tourisme et hébergement</a> (<a href="secteurs/">tous les secteurs</a>).`,
  `Des idées concrètes par métier dans notre <a href="../idees/">laboratoire d’idées</a>, par exemple pour ${t.idees.map(([s, n]) => `<a href="../idees/${s}.html">${n}</a>`).join(', ')}.`,
  `Votre site internet ${t.a} : <a href="${hub}">création de site internet ${t.a}</a>.`,
  'Un premier chiffrage du temps perdu : notre <a href="../outils/calculateur-automatisation.html">calculateur de tâches répétitives</a>.',
])}` },
  ];

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service', '@id': `${url}#service`,
        name: `Automatisation et logiciel sur-mesure ${t.a}`,
        serviceType: 'Automatisation d’entreprise et développement de logiciel sur-mesure',
        description: t.desc, url, provider: PROVIDER,
        areaServed: [{ '@type': 'State', name: t.name }, ...t.villes.map(v => ({ '@type': 'City', name: v }))],
        offers: { '@type': 'Offer', description: 'Sur devis' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: t.name, item: `${SITE}/${t.slug}/${hub}` },
          { '@type': 'ListItem', position: 3, name: 'Automatisation et logiciel sur-mesure', item: url },
        ],
      },
      { '@type': 'FAQPage', mainEntity: t.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  const ctas = `<div class="ctas"><a class="btn btn-primary" href="${TEL}">Appeler le ${TEL_TXT}</a><a class="btn btn-secondary" href="#contact">Être rappelé</a><a class="btn btn-secondary" href="${ASSISTANT}">Décrire mon projet à l’assistant</a><a class="btn btn-secondary" href="${RDV}">Visio de 10 min</a></div>`;
  const toc = `<div class="toc" role="navigation" aria-label="Sommaire"><p>Sommaire</p><ol>${sections.map(s => `<li><a href="#${s.id}">${s.h2}</a></li>`).join('')}<li><a href="#faq">Questions fréquentes</a></li></ol></div>`;
  const body = sections.map((s, i) => `<h2 id="${s.id}">${s.h2}</h2>${s.html}${i === 2 ? `<div class="callout"><p>${t.callout}</p></div>` : ''}`).join('\n');

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(t.title)}</title>
  <meta name="description" content="${esc(t.desc)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="Groupe Solution" />
  <meta property="og:title" content="${esc(t.title)}" />
  <meta property="og:description" content="${esc(t.desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/assets/og-accueil.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(t.title)}" />
  <meta name="twitter:description" content="${esc(t.desc)}" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/silo.css" />
  ${STYLE}
  <script type="application/ld+json">
${ld(jsonld)}
  </script>
</head>
<body>
  <nav class="gsnav" aria-label="Navigation principale">
    <div class="container">
      <a href="${hub}" class="nav-logo"><img src="../Logo.svg" alt="Groupe Solution" width="120" height="32" /></a>
      <div class="l">
        <a href="${hub}">${esc(t.name)}</a>
        <a href="secteurs/">Secteurs</a>
        <a href="../services/">Services</a>
        <a href="../index.html">Groupe Solution</a>
        <a href="${TEL}" class="btn btn-primary">Appeler</a>
      </div>
    </div>
  </nav>

  <main>
    <header class="ahead"><div class="container">
      <div class="crumb"><a href="../index.html">Groupe Solution</a> › <a href="${hub}">${esc(t.name)}</a> › Automatisation et logiciel sur-mesure</div>
      <span class="tag">${esc(t.tag)}</span>
      <h1>${t.h1}</h1>
      <p class="lead">${t.lead}</p>
      ${ctas}
      <p class="devise">Notre devise : <b>« Nous gagnons de l’argent uniquement si vous en gagnez. »</b> Chaque projet est sur devis.</p>
    </div></header>

    <section class="abody"><div class="container">
      <article class="prose">
${toc}
${body}
      </article>
      <aside class="cta2">
        <h2>Parlons de votre projet ${t.a}</h2>
        <p>Dix minutes suffisent pour savoir ce qui peut être automatisé chez vous, et par où commencer.</p>
        ${ctas}
      </aside>
    </div></section>

    <section class="gfaq" id="faq"><div class="container">
      <h2>Questions fréquentes</h2>
      <div class="list">
${t.faq.map(f => `        <details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n')}
      </div>
    </div></section>

    <section class="gform" id="contact"><div class="container"><div class="box">
      <h2>Être rappelé</h2>
      <p class="sub">Décrivez votre besoin en deux phrases : nous vous rappelons avec une première piste concrète, sans engagement.</p>
      <form action="https://formspree.io/f/mzebrvjg" method="POST">
        <input type="hidden" name="page" value="${t.slug}/automatisation-${t.slug}" />
        <input type="hidden" name="_zone" value="${esc(t.name)} — automatisation" />
        <label class="full">Votre besoin<textarea name="message" required placeholder="${esc(t.placeholder)}"></textarea></label>
        <label>Votre nom<input name="nom" autocomplete="name" required /></label>
        <label>Téléphone ou e-mail<input name="contact" autocomplete="email" required /></label>
        <button class="btn btn-primary" type="submit">Être rappelé →</button>
      </form>
      <p class="alts">Vous préférez parler ? <a href="${TEL}">${TEL_TXT}</a> · <a href="${RDV}">Réserver une visio de 10 min</a> · <a href="mailto:contact@groupsolution.fr">contact@groupsolution.fr</a></p>
    </div></div></section>
  </main>

  <footer class="gfoot"><div class="container">
    <p><a href="${hub}">Site internet ${esc(t.a)}</a> · <a href="secteurs/">Secteurs</a> · <a href="../services/">Services</a> · <a href="../idees/">Idées par secteur</a> · <a href="../echanger.html">Échanger</a> · <a href="../plan-du-site.html">Plan du site</a></p>
    <p>Groupe Solution · éditeur de logiciels et d’automatisations sur-mesure · <a href="${TEL}">${TEL_TXT}</a> · <a href="mailto:contact@groupsolution.fr">contact@groupsolution.fr</a></p>
  </div></footer>
  <script src="/analytics.js" defer></script>
</body>
</html>
`;
  const words = wordCount(t.lead + sections.map(s => s.h2 + ' ' + s.html).join(' ') + t.callout + t.faq.map(f => f.q + ' ' + f.a).join(' '));
  return { html, words };
}

/* ── Lien depuis le hub du territoire (idempotent) ── */
const START = '<!-- gs-auto-outremer:start -->', END = '<!-- gs-auto-outremer:end -->';
function linkHub(t) {
  const f = join(ROOT, t.slug, `site-internet-${t.slug}.html`);
  if (!existsSync(f)) return 'absent';
  let s = readFileSync(f, 'utf8');
  const re = new RegExp(`\\n?\\s*${START}[\\s\\S]*?${END}\\n?`, 'g');
  s = s.replace(re, '\n');
  const block = `
  ${START}
  <section class="gs-auto" aria-label="Automatisation et logiciel sur-mesure" style="padding:34px 0;background:#fff">
    <div class="container" style="max-width:1200px;margin:0 auto;padding:0 20px">
      <a href="automatisation-${t.slug}.html" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;border:1px solid #eee;border-radius:16px;padding:18px 22px;text-decoration:none;color:#1a1a1a;box-shadow:0 4px 20px rgba(0,0,0,.06)">
        <span style="flex:1 1 260px;min-width:0"><strong style="display:block;font-size:1.05rem">Automatisation et logiciel sur-mesure ${t.a}</strong><span style="color:#6b7280;font-size:.95rem">Exemples adaptés ${t.a}, méthode, données et questions fréquentes.</span></span>
        <span style="font-weight:700;color:#EC4899;white-space:nowrap">Lire la page →</span>
      </a>
    </div>
  </section>
  ${END}
`;
  let anchor = s.indexOf('<section class="groupe-band"') >= 0 ? s.lastIndexOf('\n', s.indexOf('<section class="groupe-band"')) : s.lastIndexOf('\n', s.indexOf('<footer'));
  if (anchor < 0) return 'ancre introuvable';
  // Si la section est précédée d'un commentaire HTML (titre de bloc), on insère avant ce commentaire.
  const prev = s.lastIndexOf('\n', anchor - 1);
  if (prev >= 0 && /^\s*<!--(?!\s*gs-auto)[\s\S]*-->\s*$/.test(s.slice(prev + 1, anchor))) anchor = prev;
  s = s.slice(0, anchor) + block + s.slice(anchor + 1);
  writeFileSync(f, s);
  return 'lien ok';
}

for (const t of TERRITOIRES) {
  const { html, words } = page(t);
  writeFileSync(join(ROOT, t.slug, `automatisation-${t.slug}.html`), html);
  console.log(`${t.slug}/automatisation-${t.slug}.html — ${words} mots — hub : ${linkHub(t)}`);
}
