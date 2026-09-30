/* ═══════════════════════════════════════════════════════════
   Pages PILIERS de référencement national (dossiers de référence).
   Produit : /services/{slug}.html pour les 5 dossiers définis dans
   zones/piliers-contenu.mjs (logiciel PME, application métier,
   logiciel de gestion, automatisation d'entreprise, agents IA par métier).

   Gabarit : réutilise l'en-tête, le style, le formulaire et le pied de page
   de zones/generate-services.mjs (même charte, même navigation).

   Lancer :  node zones/generate-piliers.mjs

   Règles de contenu : aucun prix, aucun montant, aucun client cité,
   aucun témoignage, aucune statistique non sourcée, aucun délai garanti.
   La FAQ visible et le FAQPage JSON-LD sont produits depuis la même source.
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  SITE, BASE, TEL, TEL_TXT, RDV, SERVICES, PILIERS, IDEES, METIERS, VEILLE, GUIDES, OUTILS,
  esc, strip, head, contactForm, FOOT, faqHtml,
} from './generate-services.mjs';
import { PAGES } from './piliers-contenu.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'services');
const ASSISTANT = '/#heroAI';
const PROVIDER = { '@id': `${SITE}/#org`, '@type': 'Organization', name: 'Groupe Solution' };

const EXTRA_STYLE = `<style>
.heroCtas{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
.heroCtas .btn{padding:14px 22px;font-size:15px}
.callCard .ai{display:block;margin-top:10px;font-size:14px;font-weight:700;color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.metier{background:var(--white);border:1px solid var(--line);border-radius:var(--r-m);padding:20px 22px 8px;margin:0 0 18px}
.metier h3{margin-top:0!important}
.metier dl{margin:0 0 10px}
.metier dt{font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:800;color:var(--olive2);margin:10px 0 2px}
.metier dd{margin:0 0 6px;font-size:16px;line-height:1.7}
.metier .mlinks{font-size:14px;margin:6px 0 12px;color:var(--muted)}
.pilNav{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:18px}
.pilNav a{font-size:14px;font-weight:700;color:var(--ink);background:var(--white);border:1px solid var(--line);border-radius:999px;padding:8px 14px}
.pilNav a:hover{border-color:var(--acc)}
@media(max-width:600px){.heroCtas{flex-direction:column}.heroCtas .btn{width:100%}.metier{padding:16px 16px 6px}}
</style>`;

function hero(p) {
  return `
  <section class="hero"><div class="wrap heroGrid">
    <div>
      <div class="kicker reveal">${p.kicker}</div>
      <h1 class="reveal">${p.h1}</h1>
      <p class="lead reveal">${p.lead}</p>
      <div class="heroCtas reveal"><a class="btn" href="${TEL}">Appeler le ${TEL_TXT}</a><a class="btn dark" href="${ASSISTANT}">Décrire mon projet à l’assistant</a></div>
      <div class="heroDevise reveal"><span class="lab">Notre devise</span><b>Nous gagnons de l’argent uniquement si vous en gagnez.</b></div>
    </div>
    <div class="reveal"><div class="callCard">
      <span class="callBadge">10 minutes suffisent</span>
      <h2>Parlons de votre projet, sans engagement.</h2>
      <p class="sub">Un échange direct avec l’équipe. Vous repartez avec des pistes concrètes, même si vous ne travaillez pas avec nous.</p>
      <a class="btn" href="${TEL}">Appeler le ${TEL_TXT} →</a>
      <a class="alt" href="#contact">Être rappelé</a>
      <a class="rdv" href="${RDV}">Réserver une visio de 10 min</a>
      <a class="ai" href="${ASSISTANT}">Décrire mon projet à l’assistant</a>
      <span class="micro">Chaque projet est sur devis</span>
    </div></div>
  </div></section>`;
}

const ctaBox = (title, text) =>
  `<aside class="ctaBox"><p class="ctaT">${title}</p><p>${text}</p><div class="ctaBtns"><a class="btn" href="${TEL}">Appeler le ${TEL_TXT}</a><a class="btn dark" href="#contact">Être rappelé</a><a class="btn ghost" href="${ASSISTANT}">Décrire mon projet à l’assistant</a><a class="btn ghost" href="${RDV}">Visio de 10 min</a></div></aside>`;

const ZONE = `<p class="zoneTxt">Notre agence est à Saint-Jean-de-Védas, dans la métropole de Montpellier, et couvre Montpellier et sa région ; Titouan Bedos, fondateur de Groupe Solution, est à Mayotte et couvre toute l’île. Nous accompagnons les entreprises de toute la France et des outre-mer. Chaque projet est sur devis.</p>`;

const wordCount = html => strip(html).replace(/&[a-z#0-9]+;/gi, ' ').split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;

function renderPage(p) {
  const url = `${BASE}${p.slug}.html`;
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: p.serviceName,
        serviceType: p.serviceType,
        description: p.desc,
        url,
        provider: PROVIDER,
        areaServed: [{ '@type': 'Country', name: 'France' }],
        offers: { '@type': 'Offer', description: 'Sur devis' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: BASE },
          { '@type': 'ListItem', position: 3, name: p.crumb, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  const toc = `<nav class="toc" aria-label="Sommaire"><p>Sommaire</p><ol>${p.sections.map(s => `<li><a href="#${s.id}">${s.h2}</a></li>`).join('')}<li><a href="#faq">Questions fréquentes</a></li></ol></nav>`;
  const body = p.sections.map((s, i) => {
    let h = `<h2 id="${s.id}">${s.h2}</h2>${s.html}`;
    if (i === p.ctaAfter) h += ctaBox(p.ctaTitle, p.ctaText);
    return h;
  }).join('\n');

  const li = (href, t) => `<li><a href="${href}">${t}</a></li>`;
  const otherPil = PILIERS.filter(x => x.slug !== p.slug);
  const related = `
  <section class="sec alt"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">Dossiers de référence</div><h2>Les autres dossiers pour décider.</h2><p>Chaque dossier va au bout du sujet : méthode, critères de choix, limites et questions fréquentes. <a class="go" href="./">Voir tous nos services</a></p></div>
    <div class="cases">
${otherPil.map((s, i) => `      <article class="case reveal"><div class="n">${i + 1}</div><h3><a href="${s.slug}.html">${s.name}</a></h3><p>${s.blurb}</p><a class="more" href="${s.slug}.html">Lire le dossier →</a></article>`).join('\n')}
    </div>
  </div></section>`;

  const resources = `
  <section class="sec"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">Pour aller plus loin</div><h2>Services, idées, veille et outils.</h2><p>Pour trouver l’inspiration, parcourez notre <a class="go" href="../idees/">laboratoire d’idées par secteur</a> et notre hub <a class="go" href="../automatisation/">automatisation et logiciel sur-mesure</a>.</p></div>
    <div class="res">
      <div class="reveal"><h3>Nos services</h3><ul>${p.services.map(s => li(`${s}.html`, SERVICES.find(x => x.slug === s).name)).join('')}</ul></div>
      <div class="reveal"><h3>Idées par secteur</h3><ul>${p.idees.filter(m => IDEES[m]).map(m => li(`../idees/${m}.html`, IDEES[m])).join('')}${li('../idees/', 'Toutes les idées')}</ul></div>
      <div class="reveal"><h3>Veille et guides</h3><ul>${p.veille.map(v => li(`../lab/veille/${v}.html`, VEILLE[v])).join('')}${(p.guides || []).map(g => li(`../montpellier/guides/${g}.html`, GUIDES[g])).join('')}</ul></div>
      <div class="reveal"><h3>Outils gratuits</h3><ul>${Object.keys(OUTILS).map(o => li(`../outils/${o}.html`, OUTILS[o])).join('')}</ul></div>
      ${p.metiers?.length ? `<div class="reveal"><h3>Sites par métier</h3><ul>${p.metiers.map(m => li(`../montpellier/site-internet-${m}-montpellier.html`, METIERS[m])).join('')}</ul></div>` : ''}
    </div>
    ${ZONE}
  </div></section>`;

  const html = head({ title: p.title, desc: p.desc, url, jsonld }).replace('</head>', `${EXTRA_STYLE}\n</head>`) + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <a href="./">Services</a> › <span>${p.crumb}</span></div>
${hero(p)}
  <section class="artSec"><div class="wrap">
    <article class="art">
${toc}
${body}
${ctaBox('Prêt à en parler ?', 'Appelez-nous, demandez à être rappelé, décrivez votre projet à notre assistant ou réservez une visio de 10 minutes. Chaque projet est sur devis.')}
    </article>
  </div></section>
${related}
${resources}
${faqHtml(p.faq.map(f => ({ q: esc(f.q), a: esc(f.a) }))).replace('<section class="sec alt">', '<section class="sec alt" id="faq">')}
${contactForm(`services/${p.slug}`, p.form)}
${FOOT}`;
  return { html, words: wordCount(p.lead + p.sections.map(s => s.h2 + ' ' + s.html).join(' ') + p.faq.map(f => f.q + ' ' + f.a).join(' ')) };
}

mkdirSync(OUT_DIR, { recursive: true });
for (const p of PAGES) {
  const { html, words } = renderPage(p);
  writeFileSync(join(OUT_DIR, `${p.slug}.html`), html);
  console.log(`services/${p.slug}.html — ${words} mots`);
}
