/* ═══════════════════════════════════════════════════════════
   Pages « création de site internet » par commune — Montpellier & alentours.
   Source : zones/montpellier-communes.mjs
   Produit : /montpellier/site-internet-{slug}.html  (charte silo, montpellier.css)
   + met à jour le bloc communes de la page hub (entre marqueurs).

   Lancer :  node zones/generate-montpellier.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { COMMUNES, neighbours, km } from './montpellier-communes.mjs';
import { esc, jstr, mapSvg, communesList, distanceText, MAP_CSS, STICKY_CSS } from './lib-local.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = 'montpellier';
const HUB_FILE = 'site-internet-montpellier.html';
const file = c => `site-internet-${c.slug}.html`;
const autoHref = c => `../automatisation/${c.slug}.html`;

/* Nom avec la bonne préposition : « à Lattes », « au Crès », « à La Grande-Motte ». */
export const aName = c => c.name.startsWith('Le ') ? 'au ' + c.name.slice(3) : 'à ' + c.name;

/* Choix déterministe (stable d'une génération à l'autre) dans un pool. */
function pick(pool, seed, n) {
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const out = [], used = new Set();
  while (out.length < n && used.size < pool.length) { const i = h % pool.length; if (!used.has(i)) { used.add(i); out.push(pool[i]); } h = (Math.imul(h, 1103515245) + 12345) >>> 0; }
  return out;
}

/* Questions génériques reformulées commune par commune (3 tirées sur 8). */
const GENERIC_FAQ = [
  c => ({ q: `Combien coûte un site internet ${aName(c)} ?`, a: `Nos sites vitrines démarrent à 250 €. Pour la réservation en ligne, la vente ou un devis automatique, on établit un devis clair après un court échange — le prix est le même ${aName(c)} qu'à Montpellier.` }),
  c => ({ q: `En combien de temps mon site peut-il être en ligne ?`, a: `Pour un site vitrine, comptez en général une à deux semaines entre le premier échange et la mise en ligne, selon la rapidité à rassembler textes et photos. On vous guide à chaque étape.` }),
  c => ({ q: `Faut-il se rencontrer pour travailler ensemble ?`, a: `Non, mais c'est possible. La plupart des échanges se font par téléphone ou visio, ce qui va plus vite. Nous sommes basés à Montpellier, à environ ${Math.max(1, Math.round(km({ lat: 43.6108, lng: 3.8767 }, c)))} km : on se déplace ${aName(c)} quand le projet le demande.` }),
  c => ({ q: `Le référencement Google est-il inclus ?`, a: `Chaque site est livré avec les bases techniques du référencement (vitesse, balises, données structurées, version mobile). La fiche Google Business et le travail local pour ressortir sur « votre métier ${aName(c)} » font l'objet d'un accompagnement dédié.` }),
  c => ({ q: `Qui s'occupe du site une fois en ligne ?`, a: `Vous pouvez le faire vous-même ou nous le confier. Hébergement, sécurité, petites modifications : on propose un suivi simple pour que votre site reste à jour sans que vous ayez à vous en soucier.` }),
  c => ({ q: `Mon site actuel est vieillissant : faut-il tout refaire ?`, a: `Pas forcément. On commence par un audit gratuit : parfois quelques corrections (vitesse, mobile, textes, fiche Google) suffisent. Si une refonte est préférable, on vous explique pourquoi, chiffres à l'appui.` }),
  c => ({ q: `Pourquoi un site plutôt qu'une simple page sur les réseaux sociaux ?`, a: `Les réseaux sont utiles pour l'image, mais Google met en avant les entreprises qui ont un site clair. Et c'est sur le site que le client ${aName(c)} trouve vos services, vos prix et le moyen de vous contacter en un clic.` }),
  c => ({ q: `Le site peut-il aussi me faire gagner du temps ?`, a: `Oui, c'est notre spécialité : prise de rendez-vous, devis automatique, réponses aux questions fréquentes, relances. Le site devient un outil qui travaille pour vous, pas seulement une vitrine.` })
];

const QUIZ = [
  "Quand on tape votre métier suivi de « {c} », vous apparaissez sur la première page Google.",
  "Votre fiche Google Business a des photos récentes, des horaires à jour et au moins 10 avis.",
  "Votre site s'affiche parfaitement et rapidement sur un téléphone.",
  "Un client peut demander un devis ou un rendez-vous en ligne, sans vous appeler.",
  "Vous savez combien de demandes votre site vous a apportées le mois dernier."
];

function faqJsonLd(faq) {
  return faq.map(f => `      { "@type": "Question", "name": ${jstr(f.q)}, "acceptedAnswer": { "@type": "Answer", "text": ${jstr(f.a)} } }`).join(',\n');
}

function page(c) {
  const url = `${HOLDING}/${DIR}/${file(c)}`;
  const { d, dir } = distanceText(c);
  const near = neighbours(c, 6);
  const faq = [c.web.faq, ...pick(GENERIC_FAQ, c.slug, 3).map(f => f(c)), { q: c.auto.faq.q, a: c.auto.faq.a }];
  const tissuShort = c.tissu.split(',').slice(0, 2).join(',');
  const title = `Création de site internet ${aName(c)} (${c.cp}) | GroupSolution`;
  const desc = `Site internet, fiche Google et référencement local pour les ${tissuShort} ${aName(c)}. Sites dès 250 €, audit gratuit en 15 min.`;
  const dist = d <= 2 ? 'aux portes de Montpellier' : `à ${d} km ${dir} de Montpellier`;
  return `<!doctype html>
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
  <meta property="og:image" content="${HOLDING}/rea1.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="geo.region" content="FR-34" />
  <meta name="geo.placename" content="${esc(c.name)}" />
  <meta name="geo.position" content="${c.lat};${c.lng}" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "${url}#service",
        "name": ${jstr('GroupSolution — création de site internet ' + aName(c))},
        "description": ${jstr(desc)},
        "url": "${url}",
        "image": "${HOLDING}/Logo.svg",
        "telephone": "+33782298559",
        "email": "contact@groupsolution.fr",
        "priceRange": "€€",
        "address": { "@type": "PostalAddress", "addressLocality": "Montpellier", "addressRegion": "Occitanie", "postalCode": "34000", "addressCountry": "FR" },
        "areaServed": [
          { "@type": "City", "name": ${jstr(c.name)}, "postalCode": "${c.cp}", "geo": { "@type": "GeoCoordinates", "latitude": ${c.lat}, "longitude": ${c.lng} } },
${near.slice(0, 4).map(n => `          { "@type": "City", "name": ${jstr(n.name)} }`).join(',\n')}
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog", "name": "Services web",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Création de site vitrine" }, "priceSpecification": { "@type": "PriceSpecification", "minPrice": 250, "priceCurrency": "EUR" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Référencement local et fiche Google Business" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatisation (devis, rendez-vous, relances)" } }
          ]
        },
        "parentOrganization": { "@type": "Organization", "name": "Groupe Solution", "url": "${HOLDING}/" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Groupe Solution", "item": "${HOLDING}/" },
          { "@type": "ListItem", "position": 2, "name": "Site internet Montpellier", "item": "${HOLDING}/${DIR}/${HUB_FILE}" },
          { "@type": "ListItem", "position": 3, "name": ${jstr(c.name)}, "item": "${url}" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
${faqJsonLd(faq)}
        ]
      }
    ]
  }
  </script>

  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="montpellier.css">
  <link rel="stylesheet" href="communes.css">
</head>

<body>
  <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
    <symbol id="i-mail" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></symbol>
    <symbol id="i-arrow-right" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></symbol>
    <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></symbol>
    <symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/><path d="M19 16L19.7 18.3L22 19L19.7 19.7L19 22L18.3 19.7L16 19L18.3 18.3L19 16Z"/></symbol>
    <symbol id="i-map-pin" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></symbol>
    <symbol id="i-lightning" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></symbol>
  </svg>

  <nav id="nav">
    <div class="container nav-content">
      <a href="${HUB_FILE}" class="nav-logo"><img src="../Logo.svg" alt="GroupSolution" /></a>
      <ul class="nav-links">
        <li><a href="#votre-commune">${esc(c.name)}</a></li>
        <li><a href="#test">Test gratuit</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#communes">Communes</a></li>
        <li><a href="${HOLDING}/" class="nav-holding">Groupe Solution ↗</a></li>
      </ul>
      <div class="nav-actions">
        <button onclick="openModal()" class="btn btn-primary" style="padding: 8px 16px;">
          <svg class="icon" style="width: 16px; height: 16px;"><use href="#i-mail"/></svg>
          <span>Contact</span>
        </button>
      </div>
    </div>
  </nav>

  <section class="hero gs-hero" id="hero">
    <div class="container hero-content">
      <div class="hero-badge">
        <svg class="icon" style="width: 14px; height: 14px;"><use href="#i-map-pin"/></svg>
        ${esc(c.name)} · ${c.cp} · ${esc(c.secteur)}
      </div>
      <h1>Création de site internet <span class="accent">${esc(aName(c))}</span></h1>
      <p>${esc(c.web.angle)}</p>
      <div class="hero-ctas">
        <button onclick="openModal()" class="btn btn-primary">
          <svg class="icon"><use href="#i-mail"/></svg>
          <span>Parler de mon projet</span>
        </button>
        <a href="#test" class="btn btn-ghost">
          <svg class="icon"><use href="#i-lightning"/></svg>
          <span>Tester ma visibilité (1 min)</span>
        </a>
      </div>
    </div>
  </section>

  <div class="gs-crumbs container" aria-label="Fil d'Ariane">
    <a href="${HOLDING}/">Groupe Solution</a> › <a href="${HUB_FILE}">Site internet Montpellier</a> › <span>${esc(c.name)}</span>
  </div>

  <section id="votre-commune" class="gs-local">
    <div class="container gs-local-grid">
      <div class="reveal">
        <span class="section-tag"><svg class="icon" style="width:14px;height:14px;"><use href="#i-map-pin"/></svg> ${esc(c.name)}, ${esc(dist)}</span>
        <h2>Ce qui compte pour une entreprise <span class="accent">${esc(aName(c))}</span></h2>
        <p>${esc(c.profil)}</p>
        <p>Ici, nos clients sont surtout des <strong>${esc(c.tissu)}</strong>. Leur point commun : des clients qui cherchent sur leur téléphone, comparent en quelques secondes et appellent celui qui inspire le plus confiance.</p>
        <ul class="gs-chips">${c.reperes.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      </div>
      <aside class="gs-local-card reveal">
        <h3>Votre plan d'action ${esc(aName(c))}</h3>
        <ol>
          <li><b>Fiche Google Business</b> complète, catégorisée et animée — la première chose que voit un client de ${esc(c.name)}.</li>
          <li><b>Un site rapide, pensé mobile</b>, qui répond aux questions de vos clients et affiche votre zone réelle d'intervention.</li>
          <li><b>La prise de contact sans friction</b> : devis, rendez-vous ou réservation en ligne, même quand vous êtes occupé.</li>
          <li><b>Des avis réguliers</b>, demandés automatiquement au bon moment.</li>
        </ol>
        <button onclick="openModal()" class="btn btn-primary" style="width:100%;justify-content:center">Recevoir mon plan gratuit</button>
      </aside>
    </div>
  </section>

  <section id="solutions" style="background: var(--gris-clair);">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-globe"/></svg> Nos services ${esc(aName(c))}</span>
        <h2>Trois briques,<br><span class="accent">un seul interlocuteur</span></h2>
        <p>Un site qui donne confiance, une visibilité locale qui dure, et l'automatisation qui vous rend les heures perdues.</p>
      </div>
      <div class="bulles-container">
        <div class="bulle reveal">
          <div class="bulle-image gs-ill gs-ill-web"><svg class="icon"><use href="#i-globe"/></svg></div>
          <div class="bulle-content">
            <h4>Création de site web</h4>
            <p>Vitrine, réservation en ligne ou e-commerce. Pensé mobile en premier, rapide, conforme (mentions légales, RGPD).</p>
            <div class="prix">Dès 250€</div>
            <div class="delai"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-clock"/></svg> En ligne en 1 à 2 semaines</div>
            <button onclick="openModal('Création de site')" class="btn btn-primary bulle-cta" style="justify-content: center;">Mon site ${esc(aName(c))}</button>
          </div>
        </div>
        <div class="bulle reveal">
          <div class="bulle-image gs-ill gs-ill-seo"><svg class="icon"><use href="#i-map-pin"/></svg></div>
          <div class="bulle-content">
            <h4>Référencement local</h4>
            <p>Fiche Google Business, avis, contenus locaux : pour sortir quand on cherche votre métier ${esc(aName(c))} et alentour.</p>
            <div class="prix">Sur devis</div>
            <div class="delai"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-clock"/></svg> Visibilité durable</div>
            <button onclick="openModal('Référencement local')" class="btn btn-primary bulle-cta" style="justify-content: center;">Me positionner</button>
          </div>
        </div>
        <div class="bulle reveal">
          <div class="bulle-image gs-ill gs-ill-auto"><svg class="icon"><use href="#i-lightning"/></svg></div>
          <div class="bulle-content">
            <h4>Automatisation</h4>
            <p>${esc(c.auto.cases[0][0])}, ${esc(c.auto.cases[1][0].charAt(0).toLowerCase() + c.auto.cases[1][0].slice(1))}… le site devient un outil qui travaille pour vous.</p>
            <div class="prix">Sur devis</div>
            <div class="delai"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-clock"/></svg> Des heures gagnées chaque semaine</div>
            <a href="${autoHref(c)}" class="btn btn-primary bulle-cta" style="justify-content: center;">Voir les exemples</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="test" class="gs-quiz-sec">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width:14px;height:14px;"><use href="#i-lightning"/></svg> Test en 1 minute</span>
        <h2>Votre présence en ligne vous fait-elle <span class="accent">perdre des clients</span> ?</h2>
        <p>Cinq affirmations. Répondez honnêtement, le score s'affiche tout de suite — sans laisser vos coordonnées.</p>
      </div>
      <div class="gs-quiz reveal" data-commune="${esc(c.name)}">
${QUIZ.map((q, i) => `        <div class="gs-q"><p>${i + 1}. ${esc(q.replace('{c}', c.name))}</p><div class="gs-yn"><button type="button" data-v="1">Oui</button><button type="button" data-v="0">Non</button></div></div>`).join('\n')}
        <div class="gs-result" hidden aria-live="polite"></div>
      </div>
    </div>
  </section>

  <section id="realisations" style="background: var(--gris-clair); padding: 80px 0;">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-sparkles"/></svg> Nos références</span>
        <h2>Livré, pas <span class="accent">promis</span></h2>
        <p>Une réalisation dans la métropole, et deux plateformes d'automatisation déployées à l'échelle nationale.</p>
      </div>
      <div class="rea-grid">
        <a href="https://twentythreeclean.com/" target="_blank" rel="noopener" class="rea-card reveal">
          <div class="rea-img" style="background-image: url('../rea1.jpg');"></div>
          <div class="rea-content"><h4>23 Twenty Three Clean</h4><p>Lavage auto à domicile à Montpellier — réservation en ligne et devis automatique par photo.</p></div>
        </a>
        <a href="https://solutionsrecrutement.fr/" target="_blank" rel="noopener" class="rea-card reveal">
          <div class="rea-img" style="background-image: url('../rea2.jpg');"></div>
          <div class="rea-content"><h4>Solution Recrutement</h4><p>Plus de 565 000 offres, matching sémantique et chaque correspondance expliquée.</p></div>
        </a>
        <a href="https://solutionalternance.fr/" target="_blank" rel="noopener" class="rea-card reveal">
          <div class="rea-img" style="background-image: url('../rea3.jpg');"></div>
          <div class="rea-content"><h4>Solution Alternance</h4><p>Plateforme d'automatisation avec algorithme de matching par IA, plus de 200 000 offres.</p></div>
        </a>
      </div>
    </div>
  </section>

  <section id="automatisation" class="gs-auto">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width:14px;height:14px;"><use href="#i-sparkles"/></svg> Et derrière le site ?</span>
        <h2>Ce qu'on automatise pour les entreprises <span class="accent">${esc(aName(c))}</span></h2>
        <p>${esc(c.auto.angle)}</p>
      </div>
      <div class="gs-auto-grid">
${c.auto.cases.map(([t, x]) => `        <div class="gs-auto-card reveal"><h4>${esc(t)}</h4><p>${esc(x)}</p></div>`).join('\n')}
      </div>
      <p class="gs-auto-more"><a href="${autoHref(c)}">Automatisation &amp; logiciel sur-mesure ${esc(aName(c))} : tous les détails →</a></p>
    </div>
  </section>

  <section id="processus" style="background: var(--gris-clair);">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-clock"/></svg> Méthode</span>
        <h2>Simple, du premier appel <span class="accent">à la mise en ligne</span></h2>
      </div>
      <div class="process-steps">
        <div class="process-step reveal"><div class="step-num">1</div><h4>Audit gratuit (15 min)</h4><p>On regarde votre présence actuelle ${esc(aName(c))} et ce que font vos concurrents.</p></div>
        <div class="process-step reveal"><div class="step-num">2</div><h4>Plan & devis clair</h4><p>Ce qu'on fait, pourquoi, combien et en combien de temps.</p></div>
        <div class="process-step reveal"><div class="step-num">3</div><h4>Création</h4><p>Site, fiche Google, automatisations : vous validez chaque étape.</p></div>
        <div class="process-step reveal"><div class="step-num">4</div><h4>Suivi</h4><p>Mesure des demandes reçues et ajustements dans la durée.</p></div>
      </div>
    </div>
  </section>

  <section id="faq">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">FAQ</span>
        <h2>Vos questions, <span class="accent">${esc(aName(c))}</span></h2>
      </div>
      <div class="faq">
${faq.map(f => `        <div class="faq-item reveal"><div class="faq-q">${esc(f.q)}</div><div class="faq-a"><p>${esc(f.a)}</p></div></div>`).join('\n')}
      </div>
      <div style="text-align: center; margin-top: 40px;" class="reveal">
        <button onclick="openModal()" class="btn btn-primary" style="background: var(--noir-doux); color: var(--blanc);">J'ai une autre question</button>
      </div>
    </div>
  </section>

  <section id="communes" class="gs-map-sec" style="background: var(--gris-clair);">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width:14px;height:14px;"><use href="#i-map-pin"/></svg> Autour de ${esc(c.name)}</span>
        <h2>On intervient aussi <span class="accent">tout près</span></h2>
        <p>${near.slice(0, 5).map(n => `<a href="${file(n)}">${esc(n.name)}</a>`).join(', ')} — et partout entre Montpellier, la mer, le bassin de Thau et le Pic Saint-Loup.</p>
      </div>
      <div class="gm-wrap reveal">
        ${mapSvg({ current: c.slug, href: n => file(n), hubHref: HUB_FILE, label: `Carte des communes desservies autour de ${c.name}` })}
        <div class="gm-legend"><span><i style="background:#262626"></i>Montpellier (base)</span><span><i style="background:#EC4899"></i>${esc(c.name)}</span><span><i style="background:#9ca3af"></i>Métropole</span><span><i style="background:#d1d5db"></i>Alentours</span></div>
      </div>
      ${communesList({ current: c.slug, href: n => file(n) })}
    </div>
  </section>

  <section class="groupe-band" id="groupe">
    <div class="container">
      <div class="groupe-inner reveal">
        <span class="groupe-kicker"><svg class="icon" style="width:14px;height:14px;"><use href="#i-sparkles"/></svg> Une marque de Groupe Solution</span>
        <h2>Derrière votre site, <span class="accent">un éditeur de logiciels</span></h2>
        <p>Groupe Solution conçoit des systèmes qui absorbent les tâches répétitives, à l'échelle de centaines de milliers de données. C'est ce savoir-faire qu'on met au service des entreprises ${esc(aName(c))}.</p>
        <div class="groupe-ctas">
          <a href="${HOLDING}/echanger.html" class="btn btn-primary"><svg class="icon"><use href="#i-mail"/></svg><span>Prendre rendez-vous</span></a>
          <a href="${autoHref(c)}" class="btn btn-secondary"><svg class="icon"><use href="#i-arrow-right"/></svg><span>Automatiser mon activité</span></a>
        </div>
      </div>
    </div>
  </section>

  <div class="modal-overlay" id="contactModal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal()" aria-label="Fermer"><svg class="icon"><use href="#i-x"/></svg></button>
      <div class="modal-header"><h3>Parlons de votre projet<br><span class="accent">${esc(aName(c))}</span></h3><p>Décrivez votre besoin. Réponse sous 24 h, souvent le jour même.</p></div>
      <form action="https://formspree.io/f/mzebrvjg" method="POST" id="contactForm">
        <input type="hidden" name="commune" value="${esc(c.name)} (${c.cp})" />
        <input type="hidden" name="page" value="site-internet/${c.slug}" />
        <input type="hidden" name="sujet" id="fSujet" value="" />
        <div class="form-group"><label for="fNom">Votre nom</label><input id="fNom" type="text" name="nom" placeholder="ex : Jean Dupont" autocomplete="name" required /></div>
        <div class="gs-2col">
          <div class="form-group"><label for="fTel">Téléphone</label><input id="fTel" type="tel" name="telephone" placeholder="06…" autocomplete="tel" required /></div>
          <div class="form-group"><label for="fMail">Email</label><input id="fMail" type="email" name="email" placeholder="contact@…" autocomplete="email" required /></div>
        </div>
        <div class="form-group"><label for="fEnt">Votre activité</label><input id="fEnt" type="text" name="entreprise" placeholder="ex : ${esc(c.tissu.split(',')[0].trim())} ${esc(aName(c))}" /></div>
        <div class="form-group"><label for="fMsg">Votre projet</label><textarea id="fMsg" name="message" placeholder="Je voudrais un site pour…" required></textarea></div>
        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 14px; font-size: 1.05rem;"><svg class="icon"><use href="#i-arrow-right"/></svg>Envoyer ma demande</button>
      </form>
    </div>
  </div>

  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="../Logo.svg" alt="GroupSolution" />
          <p class="footer-desc">Création de sites internet, référencement local et automatisation ${esc(aName(c))} (${c.cp}) et dans toute la région de Montpellier.</p>
        </div>
        <div class="footer-links">
          <h4>Communes voisines</h4>
          <ul>${near.map(n => `<li><a href="${file(n)}">Site internet ${esc(aName(n))}</a></li>`).join('')}</ul>
        </div>
        <div class="footer-links">
          <h4>Groupe Solution</h4>
          <ul>
            <li><a href="${HOLDING}/">Le site du groupe ↗</a></li>
            <li><a href="${autoHref(c)}">Automatisation ${esc(aName(c))}</a></li>
            <li><a href="${HUB_FILE}">Agence web Montpellier</a></li>
            <li><a href="${HOLDING}/echanger.html">Prendre rendez-vous</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Contact direct</h4>
          <p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-phone"/></svg><a href="tel:+33782298559">07 82 29 85 59</a></p>
          <p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-mail"/></svg><a href="mailto:contact@groupsolution.fr">contact@groupsolution.fr</a></p>
          <p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-map-pin"/></svg>Montpellier, Hérault</p>
        </div>
      </div>
      <div class="footer-bottom">© 2026 GroupSolution SAS. Tous droits réservés.</div>
    </div>
  </footer>

  <div class="gs-sticky"><a class="s1" href="tel:+33782298559">📞 Appeler</a><button class="s2" type="button" onclick="openModal()">Mon projet ${esc(aName(c))}</button></div>

  <script src="communes.js" defer></script>
  <script src="/analytics.js" defer></script>
</body>
</html>
`;
}

/* ── Écriture des pages ── */
for (const c of COMMUNES) writeFileSync(join(ROOT, DIR, file(c)), page(c), 'utf8');

/* ── Bloc communes de la page hub (entre marqueurs) ── */
const hubPath = join(ROOT, DIR, HUB_FILE);
let hub = readFileSync(hubPath, 'utf8');
const block = `<!-- COMMUNES:START (généré par zones/generate-montpellier.mjs — ne pas éditer à la main) -->
  <section id="communes" class="gs-map-sec" style="background: var(--gris-clair);">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width:14px;height:14px;"><use href="#i-map-pin"/></svg> ${COMMUNES.length} communes couvertes</span>
        <h2>Votre commune a <span class="accent">sa propre page</span></h2>
        <p>Les 30 communes de la Métropole, le bassin de Thau, le littoral, le Pic Saint-Loup, Lunel et la vallée de l'Hérault : chaque page parle de votre territoire, de vos clients et de ce qui marche chez vous.</p>
      </div>
      <div class="gm-wrap reveal">
        ${mapSvg({ current: null, href: n => file(n), hubHref: HUB_FILE, label: 'Carte des communes desservies autour de Montpellier' })}
        <div class="gm-legend"><span><i style="background:#262626"></i>Montpellier (base)</span><span><i style="background:#9ca3af"></i>Métropole</span><span><i style="background:#d1d5db"></i>Alentours</span></div>
      </div>
      ${communesList({ href: n => file(n) })}
    </div>
  </section>
  <!-- COMMUNES:END -->`;
if (hub.includes('<!-- COMMUNES:START')) {
  hub = hub.replace(/<!-- COMMUNES:START[\s\S]*?<!-- COMMUNES:END -->/, block);
} else {
  hub = hub.replace('<section class="groupe-band"', block + '\n\n  <section class="groupe-band"');
}
if (!hub.includes('communes.css')) hub = hub.replace('<link rel="stylesheet" href="montpellier.css">', '<link rel="stylesheet" href="montpellier.css">\n  <link rel="stylesheet" href="communes.css">');
writeFileSync(hubPath, hub, 'utf8');

/* ── CSS additionnelle (composants communes) ── */
writeFileSync(join(ROOT, DIR, 'communes.css'), `/* Généré par zones/generate-montpellier.mjs — composants des pages communes */
:root{--gm-bg:#fff;--gm-line:#e5e7eb;--gm-ink:#1a1a1a;--gm-muted:#6b7280;--gm-dot:#d1d5db;--gm-metro:#9ca3af;--gm-acc:#EC4899}
.gs-hero{background:radial-gradient(90% 70% at 85% 10%,rgba(236,72,153,.55),transparent 60%),radial-gradient(70% 60% at 10% 100%,rgba(16,185,129,.28),transparent 60%),linear-gradient(160deg,#141821 0%,#1f2433 55%,#2a1f2e 100%)!important;min-height:auto!important;padding:150px 0 110px!important}
.gs-hero::before{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='2' cy='2' r='1.2' fill='%23ffffff' fill-opacity='.08'/%3E%3C/svg%3E")!important}
.gs-ill{display:grid;place-items:center;background:linear-gradient(135deg,#fdf2f8,#fce7f3)!important}
.gs-ill::after{display:none!important}
.gs-ill .icon{width:64px;height:64px;stroke:#EC4899;stroke-width:1.5}
.gs-ill-seo{background:linear-gradient(135deg,#ecfdf5,#d1fae5)!important}.gs-ill-seo .icon{stroke:#10b981}
.gs-ill-auto{background:linear-gradient(135deg,#eff6ff,#dbeafe)!important}.gs-ill-auto .icon{stroke:#3b82f6}
.gs-crumbs{padding:14px 20px 0;font-size:13px;color:var(--gris)}
.gs-crumbs a{color:var(--gris);text-decoration:none}.gs-crumbs a:hover{color:var(--rose-fonce)}
.gs-local{padding:70px 0}
.gs-local-grid{display:grid;grid-template-columns:1.25fr .85fr;gap:48px;align-items:start}
.gs-local h2{font-size:clamp(1.7rem,3.4vw,2.4rem);font-weight:800;line-height:1.15;margin:14px 0 18px}
.gs-local h2 .accent,.gs-auto h2 .accent{background:linear-gradient(135deg,var(--rose),var(--rose-fonce));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.gs-local p{color:var(--gris);font-size:1.05rem;margin-bottom:14px;line-height:1.75}
.gs-local p strong{color:var(--gris-fonce)}
.gs-chips{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.gs-chips li{background:var(--rose-clair);color:var(--rose-fonce);font-weight:700;font-size:.85rem;padding:7px 13px;border-radius:999px}
.gs-local-card{background:var(--blanc);border:1px solid #f1f1f1;border-radius:22px;box-shadow:var(--box-shadow-lg);padding:30px;position:sticky;top:96px}
.gs-local-card h3{font-size:1.2rem;font-weight:800;margin-bottom:14px}
.gs-local-card ol{padding-left:20px;margin-bottom:22px;color:var(--gris);font-size:.95rem}
.gs-local-card li{margin-bottom:10px;line-height:1.55}.gs-local-card b{color:var(--gris-fonce)}
.gs-quiz-sec{padding:80px 0}
.gs-quiz{max-width:760px;margin:0 auto;background:var(--blanc);border:1px solid #f1f1f1;border-radius:22px;box-shadow:var(--box-shadow-lg);padding:14px 28px}
.gs-q{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 0;border-bottom:1px solid #f3f4f6}
.gs-q p{font-weight:600;font-size:.98rem;line-height:1.5}
.gs-yn{display:flex;gap:8px;flex-shrink:0}
.gs-yn button{padding:9px 16px;border-radius:999px;border:1.5px solid #e5e7eb;background:#fff;font:700 .9rem Inter,sans-serif;cursor:pointer;transition:var(--transition)}
.gs-yn button:hover{border-color:var(--rose-fonce)}
.gs-yn button.on[data-v="1"]{background:#10b981;border-color:#10b981;color:#fff}
.gs-yn button.on[data-v="0"]{background:var(--rose-fonce);border-color:var(--rose-fonce);color:#fff}
.gs-result{padding:24px 0 12px;text-align:center}
.gs-result .score{font-size:2.6rem;font-weight:800;line-height:1}
.gs-result p{color:var(--gris);margin:10px auto 18px;max-width:520px}
.gs-auto{padding:80px 0}
.gs-auto-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.gs-auto-card{background:var(--blanc);border:1px solid #f1f1f1;border-radius:18px;padding:26px;box-shadow:var(--box-shadow);transition:var(--transition)}
.gs-auto-card:hover{transform:translateY(-4px);box-shadow:var(--box-shadow-lg)}
.gs-auto-card h4{font-size:1.05rem;font-weight:800;margin-bottom:10px}
.gs-auto-card p{color:var(--gris);font-size:.95rem;line-height:1.6}
.gs-auto-more{text-align:center;margin-top:30px}
.gs-auto-more a,.section-header p a{color:var(--rose-fonce);font-weight:700;text-decoration:none}
.gs-map-sec{padding:80px 0}
.gs-2col{display:grid;grid-template-columns:1fr 1fr;gap:15px}
@media(max-width:860px){.gs-local-grid,.gs-auto-grid{grid-template-columns:1fr}.gs-local-card{position:static}}
@media(max-width:560px){.gs-q{flex-direction:column;align-items:flex-start}.gs-2col{grid-template-columns:1fr}}
${MAP_CSS}
${STICKY_CSS}
`, 'utf8');

console.log(`✓ ${COMMUNES.length} pages site internet générées dans /${DIR}/ + hub mis à jour + communes.css`);
