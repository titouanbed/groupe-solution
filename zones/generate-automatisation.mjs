/* ═══════════════════════════════════════════════════════════
   Pages « logiciel sur-mesure & automatisation » par commune — charte holding.
   Source : zones/montpellier-communes.mjs
   Produit : /automatisation/index.html (hub Montpellier & Hérault)
             /automatisation/{slug}.html (une page par commune)

   Lancer :  node zones/generate-automatisation.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { COMMUNES, neighbours } from './montpellier-communes.mjs';
import { AVANCEES, pickAvancees, VEILLE_OF } from './automatisations-avancees.mjs';
import { enrichOf, liveSection, LIVE_CSS, heroArt, aName, esc, jstr, mapSvg, communesList, distanceText, MAP_CSS, STICKY_CSS } from './lib-local.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = 'automatisation';
mkdirSync(join(ROOT, DIR), { recursive: true });
const siteHref = c => `../montpellier/site-internet-${c.slug}.html`;
const FORM = 'https://formspree.io/f/mzebrvjg';

/* ── Blocs communs ── */
const head = ({ title, desc, url, jsonld, ogImage }) => `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="Groupe Solution" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${ogImage || HOLDING + '/assets/visuel-solutions.jpg'}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/holding-local.css" />
  <style>${MAP_CSS}${STICKY_CSS}${LIVE_CSS}</style>
  <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
  </script>
</head>
<body>
<header class="nav"><div class="wrap navin"><a class="brand" href="../index.html" aria-label="Groupe Solution — accueil"><img src="../Logo.svg" alt="Groupe Solution" /></a><nav class="links"><a href="../solutions.html">Solutions</a><a href="../realisations.html">Réalisations</a><a href="./">Automatisation</a><a href="../montpellier/site-internet-montpellier.html">Sites internet</a><a href="../a-propos.html">À propos</a><a class="cta" href="#contact">Discutons 10 min</a></nav></div></header>
<main>`;

const foot = `</main>
<footer><div class="wrap foot">
  <span class="footBrand"><img src="../Logo.svg" alt="Groupe Solution" /> © <span id="year"></span> Groupe Solution · Montpellier</span>
  <nav>
    <a href="../index.html">Accueil</a>
    <a href="./">Automatisation</a>
    <a href="../solutions.html">Solutions</a>
    <a href="../realisations.html">Réalisations</a>
    <a href="../montpellier/site-internet-montpellier.html">Sites internet</a>
    <a href="../echanger.html">Échanger</a>
    <a href="../plan-du-site.html">Plan du site</a>
  </nav>
</div></footer>
<div class="gs-sticky"><a class="s1" href="tel:+33782298559">📞 Appeler</a><a class="s2" href="#contact">Discutons 10 min</a></div>
<script src="../assets/live.js" defer></script>
<script src="../assets/holding-local.js" defer></script>
<script src="/analytics.js" defer></script>
</body>
</html>
`;

const calc = (where) => `
  <section class="sec" id="calculateur"><div class="wrap">
    <div class="secHead center reveal"><div class="kicker">Calculateur</div><h2>Combien vous coûtent vos tâches répétitives ?</h2><p>Trois curseurs, un ordre de grandeur honnête. C'est souvent le chiffre qui déclenche la décision${where ? ' — ' + esc(where) : ''}.</p></div>
    <div class="calc reveal" data-calc>
      <div class="calcIn">
        <label>Personnes concernées <span data-out="people"></span><input type="range" name="people" min="1" max="30" value="3" /></label>
        <label>Heures perdues par personne et par semaine <span data-out="hours"></span><input type="range" name="hours" min="1" max="20" value="5" /></label>
        <label>Coût horaire chargé <span data-out="rate"></span><input type="range" name="rate" min="15" max="120" step="5" value="35" /></label>
      </div>
      <div class="calcOut" aria-live="polite">
        <div class="big" data-out="cost"></div>
        <div class="lbl">dépensés chaque année en saisie, relances, copier-coller… (<span data-out="yearh"></span>)</div>
        <div class="row"><div><b data-out="saved"></b><span>récupérables / an*</span></div><div><b data-out="days"></b><span>de travail rendues</span></div></div>
        <a class="btn" href="#contact" data-out="cta">Voir ce qu'on peut récupérer →</a>
      </div>
    </div>
    <p class="calcNote">* Hypothèse prudente : 60 % du temps répétitif automatisable, 45 semaines travaillées. On affine avec vos vrais chiffres lors de l'appel.</p>
  </div></section>`;

const proof = `
  <section class="sec alt"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">La preuve</div><h2>On ne teste pas. On a déjà livré.</h2><p>Trois plateformes conçues et opérées par Groupe Solution, en ligne aujourd'hui — le même socle, spécialisé à chaque fois.</p></div>
    <div class="proof">
      <a class="plat reveal" href="https://solutionsrecrutement.fr" target="_blank" rel="noopener"><span class="tag">En ligne</span><h3>Solution Recrutement</h3><p>Matching sémantique, vivier réactivé en continu, chaque correspondance expliquée.</p><div class="stat"><b>565 000</b>+ offres</div></a>
      <a class="plat reveal" href="https://solutionalternance.fr" target="_blank" rel="noopener"><span class="tag">En ligne</span><h3>Solution Alternance</h3><p>Chaque profil rapproché des offres d'alternance sur les compétences réelles.</p><div class="stat"><b>200 000</b>+ offres comparées</div></a>
      <a class="plat reveal" href="https://aides-particuliers.fr" target="_blank" rel="noopener"><span class="tag">En ligne</span><h3>Aides Particuliers</h3><p>Un diagnostic qui identifie les aides publiques auxquelles un particulier a droit.</p><div class="stat"><b>6</b> catégories d'aides</div></a>
      <a class="plat reveal" href="#contact" style="background:var(--ink);color:#fff;border-color:var(--ink)"><span class="tag" style="background:rgba(255,255,255,.12);color:#fff">Prochain projet</span><h3 style="color:#fff">Le vôtre ?</h3><p style="color:#CFCBBF">Même ingénierie, appliquée à votre activité. On en parle 10 minutes.</p><div class="stat" style="border-color:rgba(255,255,255,.15);color:#CFCBBF">Diagnostic gratuit →</div></a>
    </div>
  </div></section>`;

const method = `
  <section class="sec"><div class="wrap">
    <div class="secHead center reveal"><div class="kicker">Comment ça se passe</div><h2>Du premier appel au premier gain.</h2><p>Pas de cahier des charges de 40 pages. On part d'une tâche, on prouve le gain, on élargit si ça vaut le coup.</p></div>
    <div class="steps">
      <div class="step reveal"><h3>10 minutes d'appel</h3><p>Vous décrivez votre journée type. On repère ce qui se répète.</p></div>
      <div class="step reveal"><h3>Chiffrage du gain</h3><p>Temps récupéré, coût, délai : un devis clair, sans surprise.</p></div>
      <div class="step reveal"><h3>Première automatisation</h3><p>Livrée en quelques jours à quelques semaines, branchée sur vos outils.</p></div>
      <div class="step reveal"><h3>Mesure &amp; suite</h3><p>On mesure le temps gagné. On n'ajoute que ce qui se rembourse.</p></div>
    </div>
  </div></section>`;

const express = (c) => `
  <section class="sec alt" id="contact"><div class="wrap">
    <div class="express reveal" id="express">
      <div class="kicker" style="display:flex;width:max-content;margin:0 auto 16px">Réponse sous 24 h</div>
      <h2>Quelle tâche vous prend le plus de temps${c ? ' ' + esc(aName(c)) : ''} ?</h2>
      <p>Décrivez-la en deux phrases. Je vous réponds avec une première piste concrète — gratuitement, sans engagement.</p>
      <form id="expressForm" action="${FORM}" method="POST">
        <input type="hidden" name="page" value="automatisation/${c ? c.slug : 'hub'}" />
        ${c ? `<input type="hidden" name="commune" value="${esc(c.name)} (${c.cp})" />` : ''}
        <label class="full">La tâche répétitive<textarea name="message" required placeholder="${c ? esc('Ex : ' + c.auto.cases[0][0].toLowerCase() + ', ou une idée plus ambitieuse…') : 'Ex : je ressaisis chaque commande dans deux logiciels…'}"></textarea></label>
        <label>Votre nom<input name="nom" autocomplete="name" required /></label>
        <label>Téléphone ou email<input name="contact" autocomplete="email" required /></label>
        <label class="full">Votre activité (optionnel)<input name="entreprise" placeholder="${c ? esc(c.tissu.split(',')[0].trim()) : 'Votre secteur'}" /></label>
        <button class="btn" type="submit">Recevoir ma piste d'automatisation →</button>
      </form>
      <p class="alts">Vous préférez parler ? <a href="tel:+33782298559">07 82 29 85 59</a> · <a href="../echanger.html#rendez-vous">Réserver une visio de 10 min</a></p>
    </div>
  </div></section>`;

const faqBlock = (faq) => `
  <section class="sec" id="faq"><div class="wrap">
    <div class="secHead center reveal"><div class="kicker">Questions fréquentes</div><h2>Ce qu'on nous demande avant de se lancer.</h2></div>
    <div class="faq">
${faq.map(f => `      <details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n')}
    </div>
  </div></section>`;

const COMMON_FAQ = [
  { q: "L'automatisation va-t-elle remplacer mes salariés ?", a: "Non, et ce n'est pas notre philosophie. On retire le volume répétitif (saisie, relances, tri, copier-coller) pour que vos équipes se concentrent sur la décision et la relation client — ce qu'aucun logiciel ne fait à leur place." },
  { q: "Combien ça coûte ?", a: "Ça dépend de la tâche, mais on part toujours du gain : on estime ce que la tâche vous coûte aujourd'hui et on ne propose que ce qui se rembourse nettement. Notre devise : on gagne de l'argent uniquement si vous en gagnez. Pour certains projets, on peut même partager la valeur créée plutôt que facturer une prestation." },
  { q: "Quelle différence entre un logiciel sur-mesure et un outil du marché ?", a: "Un outil du marché vous oblige à adapter votre façon de travailler. Le sur-mesure s'adapte à vous et se branche sur ce que vous utilisez déjà. On recommande un outil existant quand il suffit — et on vous le dit." }
];

/* ── Page commune ── */
function page(c) {
  const url = `${HOLDING}/${DIR}/${c.slug}.html`;
  const { d, dir } = distanceText(c);
  const near = neighbours(c, 6);
  const E = enrichOf(c);
  const faq = [c.auto.faq, ...(E?.faqAuto ? [E.faqAuto] : []), COMMON_FAQ[c.slug.length % 3], { q: `Intervenez-vous vraiment ${aName(c)} ?`, a: `Oui. Groupe Solution est basé à Montpellier, ${d <= 2 ? 'juste à côté' : `à environ ${d} km`}. Le diagnostic et le suivi se font par téléphone ou visio, et on se déplace ${aName(c)} dès que c'est utile — pour observer un process sur place, former une équipe ou lancer un outil.` }, c.web.faq];
  const title = `Automatisation & logiciel sur-mesure ${aName(c)} (${c.cp}) | Groupe Solution`;
  const adv = pickAvancees(c.slug, [c.tissu, c.profil, c.auto.angle].join(' '), 4);
  const desc = `${adv[0].titre}, ${adv[1].titre.charAt(0).toLowerCase() + adv[1].titre.slice(1)}… Automatisations de pointe et logiciels sur-mesure pour les entreprises ${aName(c)}. Diagnostic gratuit en 10 min.`.slice(0, 200);
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', '@id': url + '#service', name: `Automatisation et logiciel sur-mesure ${aName(c)}`, serviceType: 'Automatisation des processus métier et développement de logiciels sur-mesure', description: desc, url,
        provider: { '@type': 'Organization', '@id': HOLDING + '/#org', name: 'Groupe Solution', url: HOLDING + '/', telephone: '+33782298559', email: 'contact@groupsolution.fr', address: { '@type': 'PostalAddress', addressLocality: 'Montpellier', postalCode: '34000', addressRegion: 'Occitanie', addressCountry: 'FR' } },
        areaServed: [{ '@type': 'City', name: c.name, postalCode: c.cp, geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng } }, ...near.slice(0, 4).map(n => ({ '@type': 'City', name: n.name }))],
        hasOfferCatalog: { '@type': 'OfferCatalog', name: `Automatisations pour les entreprises ${aName(c)}`, itemListElement: adv.map(a => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: a.titre, description: a.texte } })) } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' },
        { '@type': 'ListItem', position: 2, name: 'Automatisation Montpellier', item: `${HOLDING}/${DIR}/` },
        { '@type': 'ListItem', position: 3, name: c.name, item: url }] },
      { '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    ]
  };
  return head({ title, desc, url, jsonld, ogImage: `${HOLDING}/assets/communes/${c.slug}.jpg` }) + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <a href="./">Automatisation</a> › <span>${esc(c.name)}</span></div>

  <section class="hero"><div class="wrap heroGrid">
    <div>
      <div class="kicker reveal">${esc(c.name)} · ${c.cp} · ${esc(c.secteur)}</div>
      <h1 class="reveal">Logiciel sur-mesure &amp; automatisation <em>${esc(aName(c))}</em>.</h1>
      <p class="lead reveal">${esc(c.auto.angle)} On construit les systèmes qui absorbent ce volume — vos équipes gardent la décision et la relation.</p>
      <div class="heroDevise reveal"><span class="lab">Notre devise</span><b>Nous gagnons de l'argent uniquement si vous en gagnez.</b></div>
    </div>
    <div class="reveal">
      <div class="callCard">
        <span class="callBadge">10 minutes suffisent</span>
        <h2>En 10 minutes, on repère ce que votre entreprise ${esc(aName(c))} peut automatiser.</h2>
        <p class="sub">Un appel direct, sans engagement. Vous repartez avec des pistes concrètes, chiffrées.</p>
        <a class="btn" href="tel:+33782298559">Appeler maintenant →</a>
        <a class="alt" href="#contact">ou décrire ma tâche par écrit</a>
        <span class="micro">Réponse le jour même · basé à Montpellier</span>
      </div>
    </div>
  </div></section>

  <section class="sec alt"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">À la pointe</div><h2>Ce qu'on peut construire pour les entreprises ${esc(aName(c))}.</h2><p>Sélectionné pour le tissu économique local — ${esc(c.tissu)} — parmi ce que l'IA et l'automatisation permettent aujourd'hui.</p></div>
    <div class="cases cases4">
${adv.map((a, i) => `      <article class="case reveal"><div class="n">${i + 1}</div><span class="tech">${esc(a.tech)}</span><h3>${esc(a.titre)}</h3><p class="ex">${esc(a.ex(c))}</p>${VEILLE_OF[a.id] ? `<a class="go" style="display:inline-block;margin-top:12px;font-size:13.5px" href="../lab/veille/${VEILLE_OF[a.id]}.html">Notre analyse →</a>` : ''}</article>`).join('\n')}
    </div>
    <div class="bases reveal"><h3>Et les bases, bien faites</h3><ul>${c.auto.cases.map(([t, x]) => `<li><b>${esc(t)}</b> — ${esc(x)}</li>`).join('')}</ul></div>
    <p class="center reveal" style="margin-top:22px"><a class="go" href="../lab/">Voir toutes les technologies que nous suivons →</a></p>
  </div></section>

  <section class="sec alt"><div class="wrap localGrid">
    <div class="reveal">
      <div class="kicker">${esc(c.name)}, vu d'ici</div>
      <h2 style="font-size:clamp(28px,3.6vw,40px);margin-top:16px">On connaît le terrain.</h2>
      <p>${esc(c.profil)}</p>
      <p>Le tissu local : <strong>${esc(c.tissu)}</strong>. Chacun a ses tâches qui se répètent — et c'est là qu'un système bien pensé rend des heures chaque semaine.</p>
      <ul class="chips">${c.reperes.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
${E?.recit ? `      <div class="recit"><b>Scénario type ${esc(aName(c))}</b><p>${esc(E.recit.replace(/^Exemple\s*:\s*/i, ''))}</p></div>
` : ''}    </div>
    <aside class="facts reveal">
      <img class="art" src="../assets/communes/${c.slug}.jpg" alt="Illustration de ${esc(c.name)}" loading="lazy" width="1600" height="900" />
      <dl>
        <dt>Commune</dt><dd>${esc(c.name)} (${c.cp})</dd>
        <dt>Secteur</dt><dd>${esc(c.secteur)}</dd>
        <dt>Depuis Montpellier</dt><dd>${d <= 2 ? 'aux portes de la ville' : `~${d} km ${esc(dir)}`}</dd>
        <dt>Métropole</dt><dd>${c.metro ? 'Oui, Montpellier Méditerranée Métropole' : 'Hors Métropole — on y intervient aussi'}</dd>
        <dt>Premier échange</dt><dd>Téléphone ou visio, sous 24 h</dd>
      </dl>
      <p style="margin-top:18px;font-size:14px">Besoin d'abord d'un site ? <a href="${siteHref(c)}">Création de site internet ${esc(aName(c))} →</a></p>
    </aside>
  </div></section>
${liveSection(c, true)}
  <section class="sec alt"><div class="wrap"><div class="xlink reveal" style="margin-top:0"><p>Conçu par l'équipe qui opère Solution Recrutement, Solution Alternance et Aides Particuliers. Estimez d'abord ce que vos tâches répétitives vous coûtent.</p><a href="../outils/calculateur-automatisation.html">Calculateur gratuit →</a></div></div></section>
${faqBlock(faq)}
${express(c)}

  <section class="sec"><div class="wrap">
    <div class="secHead center reveal"><div class="kicker">Autour de ${esc(c.name)}</div><h2>Les communes voisines.</h2><p>Même approche, adaptée à chaque tissu économique.</p></div>
    <div class="near">${near.map(n => `<a href="${n.slug}.html">Automatisation ${esc(aName(n))}</a>`).join('')}</div>
    <div class="gm-wrap reveal" style="margin-top:30px">${mapSvg({ current: c.slug, href: n => `${n.slug}.html`, hubHref: './', label: `Carte des communes où Groupe Solution intervient autour de ${c.name}` })}</div>
    <div class="xlink reveal"><p>Vous cherchez plutôt un site internet ${esc(aName(c))} ?</p><a href="${siteHref(c)}">Voir l'offre site internet →</a></div>
    <div class="near" style="margin-top:18px"><a href="../outils/calculateur-automatisation.html">Calculateur détaillé →</a><a href="../montpellier/guides/automatiser-devis-artisan.html">Guide : automatiser ses devis</a><a href="../montpellier/guides/relances-factures-impayees-automatiques.html">Guide : relancer les impayés</a><a href="../outils/">Tous nos outils gratuits</a></div>
  </div></section>
` + foot;
}

/* ── Hub /automatisation/ ── */
function hub() {
  const url = `${HOLDING}/${DIR}/`;
  const title = 'Automatisation & logiciel sur-mesure à Montpellier et dans l’Hérault | Groupe Solution';
  const desc = "Éditeur de logiciels basé à Montpellier : agents IA, lecture de documents, agents vocaux, prévisions et automatisation des processus pour les TPE et PME de la métropole, du bassin de Thau au Pic Saint-Loup. Diagnostic gratuit en 10 min.";
  const faq = [...COMMON_FAQ,
    { q: 'Où intervenez-vous ?', a: `Partout autour de Montpellier : les 30 communes de la Métropole, le Pays de l'Or, le littoral, le bassin de Thau (Sète, Mèze, Villeveyrac…), le Pic Saint-Loup, Lunel, la Petite Camargue, et jusqu'à Nîmes, Béziers, Agde, Lodève et Ganges — ${COMMUNES.length} communes ont leur page dédiée. Au-delà, on travaille partout en France à distance.` },
    { q: 'Quels types d’entreprises accompagnez-vous ?', a: "Des indépendants aux PME de plusieurs dizaines de salariés : artisans du bâtiment, commerces, cabinets, domaines viticoles, conchyliculteurs, logistique, tourisme, santé. Le point commun : des tâches qui se répètent chaque semaine." }];
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ProfessionalService', '@id': url + '#service', name: 'Groupe Solution — automatisation et logiciel sur-mesure, Montpellier', description: desc, url, image: HOLDING + '/Logo.svg', telephone: '+33782298559', email: 'contact@groupsolution.fr', priceRange: '€€',
        address: { '@type': 'PostalAddress', addressLocality: 'Montpellier', postalCode: '34000', addressRegion: 'Occitanie', addressCountry: 'FR' },
        geo: { '@type': 'GeoCoordinates', latitude: 43.6108, longitude: 3.8767 },
        areaServed: [{ '@type': 'City', name: 'Montpellier' }, { '@type': 'AdministrativeArea', name: 'Montpellier Méditerranée Métropole' }, { '@type': 'AdministrativeArea', name: 'Hérault' }, ...COMMUNES.map(c => ({ '@type': 'City', name: c.name }))],
        parentOrganization: { '@type': 'Organization', '@id': HOLDING + '/#org', name: 'Groupe Solution', url: HOLDING + '/' } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Automatisation Montpellier', item: url }] },
      { '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    ]
  };
  const EX = ['agent-vocal', 'rag', 'idp', 'computer-use', 'prevision', 'facturx', 'mcp', 'multi-agents', 'vision'].map(id => AVANCEES.find(a => a.id === id));
  return head({ title, desc, url, jsonld }) + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <span>Automatisation Montpellier</span></div>
  <section class="hero"><div class="wrap heroGrid">
    <div>
      <div class="kicker reveal">Montpellier · Hérault · ${COMMUNES.length} communes</div>
      <h1 class="reveal">Automatisation &amp; logiciel sur-mesure <em>à Montpellier</em>.</h1>
      <p class="lead reveal">Devis, commandes, relances, plannings, documents : on construit les systèmes qui absorbent vos tâches répétitives. Basés à Montpellier, on connaît le tissu local — du Salaison à Vendargues aux mas conchylicoles de Mèze.</p>
      <div class="heroDevise reveal"><span class="lab">Notre devise</span><b>Nous gagnons de l'argent uniquement si vous en gagnez.</b></div>
    </div>
    <div class="reveal"><div class="callCard">
      <span class="callBadge">10 minutes suffisent</span>
      <h2>En 10 minutes, on identifie ce que vous pouvez automatiser.</h2>
      <p class="sub">Un appel direct, sans engagement. Vous repartez avec des pistes concrètes.</p>
      <a class="btn" href="tel:+33782298559">Appeler maintenant →</a>
      <a class="alt" href="#contact">ou décrire ma tâche par écrit</a>
      <span class="micro">Réponse le jour même</span>
    </div></div>
  </div></section>

  <section class="sec alt"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">À la pointe</div><h2>Ce que l'on peut construire aujourd'hui.</h2><p>Bien au-delà du devis automatique : agents IA, lecture de documents, agents qui pilotent vos logiciels, prévisions, nouveaux standards — quel que soit le métier.</p></div>
    <div class="cases">
${EX.map((a, i) => `      <article class="case reveal"><div class="n">${i + 1}</div><span class="tech">${esc(a.tech)}</span><h3>${esc(a.titre)}</h3><p>${esc(a.texte)}</p></article>`).join('\n')}
    </div>
  </div></section>
${calc('')}
${proof}

  <section class="sec" id="communes"><div class="wrap">
    <div class="secHead center reveal"><div class="kicker">${COMMUNES.length} communes</div><h2>Votre commune, votre tissu économique.</h2><p>Chaque page présente des cas d'automatisation pensés pour l'économie locale : conchyliculture à Mèze, oenotourisme à Villeveyrac, logistique au Salaison, cabinets à Castelnau…</p></div>
    <div class="gm-wrap reveal">${mapSvg({ current: null, href: n => `${n.slug}.html`, hubHref: './', label: 'Carte des communes où Groupe Solution intervient autour de Montpellier' })}
      <div class="gm-legend"><span><i style="background:#171613"></i>Montpellier (base)</span><span><i style="background:#5F6B54"></i>Métropole</span><span><i style="background:#CFCBBF"></i>Alentours</span></div>
    </div>
    ${communesList({ href: n => `${n.slug}.html` })}
    <div class="near" style="margin-top:18px"><a href="../outils/calculateur-automatisation.html">Calculateur détaillé →</a><a href="../montpellier/guides/automatiser-devis-artisan.html">Guide : automatiser ses devis</a><a href="../montpellier/guides/relances-factures-impayees-automatiques.html">Guide : relancer les impayés</a><a href="../outils/">Tous nos outils gratuits</a></div>
  </div></section>
${method}
${faqBlock(faq)}
${express(null)}
` + foot;
}

for (const c of COMMUNES) writeFileSync(join(ROOT, DIR, `${c.slug}.html`), page(c), 'utf8');
writeFileSync(join(ROOT, DIR, 'index.html'), hub(), 'utf8');
console.log(`✓ ${COMMUNES.length} pages automatisation + hub générés dans /${DIR}/`);
