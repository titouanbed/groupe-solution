/* ═══════════════════════════════════════════════════════════
   LAB — innovation, radar technologique, API & données en direct.
   Produit : /lab/index.html (radar + accès), /lab/api.html (catalogue d'API
   gratuites + 4 démonstrations exécutées en direct dans le navigateur).
   Les articles de veille sont générés par zones/generate-veille.mjs.

   Lancer :  node zones/generate-lab.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { esc, STICKY_CSS } from './lib-local.mjs';
import { loadActus } from './generate-actus.mjs';
const ACTUS = loadActus();

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = 'lab';
mkdirSync(join(ROOT, DIR), { recursive: true });

/* Articles de veille existants (titre lu dans chaque page). */
const VEILLE = readdirSync(join(ROOT, DIR, 'veille')).filter(f => f.endsWith('.html') && f !== 'index.html').map(f => {
  const h = readFileSync(join(ROOT, DIR, 'veille', f), 'utf8');
  return { slug: f.replace('.html', ''), h1: (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, f])[1].replace(/<[^>]+>/g, '').trim() };
});
const vLink = slug => VEILLE.some(v => v.slug === slug) ? `veille/${slug}.html` : null;

/* ── Radar : notre lecture des technologies (Adopter / Tester / Surveiller) ── */
const RADAR = [
  { n: 'Agents vocaux temps réel', r: 'adopter', q: 'ia', why: "Décrocher, comprendre, prendre un rendez-vous : mûr pour la production, avec information claire de l'appelant.", v: 'agents-vocaux-ia' },
  { n: 'RAG (assistant sur documents)', r: 'adopter', q: 'ia', why: "Interroger ses procédures en langage naturel avec citations : fiable si les sources sont bien préparées.", v: 'rag-assistant-documents' },
  { n: 'Lecture de documents par IA', r: 'adopter', q: 'ia', why: "Les modèles vision-langage lisent factures, bons et manuscrits ; le contrôle humain reste sur les cas douteux.", v: 'ia-vision-documents' },
  { n: 'Model Context Protocol (MCP)', r: 'adopter', q: 'integration', why: "Standard ouvert pour brancher l'IA sur ses outils : l'écosystème s'est largement structuré autour.", v: 'mcp-model-context-protocol' },
  { n: 'Facturation électronique', r: 'adopter', q: 'regle', why: "Réception obligatoire depuis septembre 2026, émission selon la taille : autant en faire un gain d'automatisation.", v: 'facturation-electronique-2026' },
  { n: 'Open data public (API gouv)', r: 'adopter', q: 'data', why: "Entreprises, adresses, découpage administratif, jours fériés : des données fiables, gratuites, sans clé.", v: 'open-data-api-gouv' },
  { n: 'Passkeys', r: 'adopter', q: 'integration', why: "Connexion sans mot de passe, résistante à l'hameçonnage, désormais prise en charge par les principaux systèmes.", v: null },
  { n: 'Agents « computer use »', r: 'tester', q: 'ia', why: "Piloter des interfaces sans API : prometteur, à encadrer par supervision et journalisation.", v: 'agents-ia-computer-use' },
  { n: 'Orchestration multi-agents', r: 'tester', q: 'ia', why: "Plusieurs agents spécialisés sur un même dossier, avec validation humaine aux étapes clés.", v: null },
  { n: 'Protocoles inter-agents (A2A)', r: 'tester', q: 'integration', why: "Faire dialoguer des agents de fournisseurs différents : standard jeune, à suivre de près.", v: null },
  { n: 'Modèles open-weight', r: 'tester', q: 'ia', why: "Des modèles performants hébergeables chez soi ou en Europe, utiles pour les données sensibles.", v: null },
  { n: 'llms.txt & moteurs de réponse IA', r: 'tester', q: 'data', why: "Rendre son site lisible par les assistants IA qui répondent à la place des moteurs de recherche.", v: null },
  { n: 'AI Act — conformité', r: 'adopter', q: 'regle', why: "Interdictions, maîtrise de l'IA et transparence déjà applicables ; obligations haut risque reportées à fin 2027 par le règlement omnibus IA (juillet 2026).", v: 'ai-act-pme' },
  { n: 'IA embarquée (WebGPU, on-device)', r: 'surveiller', q: 'ia', why: "Faire tourner des modèles directement dans le navigateur ou sur le téléphone, sans envoyer les données.", v: null },
  { n: 'Portefeuille d’identité numérique européen', r: 'surveiller', q: 'regle', why: "Le règlement eIDAS 2 prévoit un portefeuille d'identité numérique pour les citoyens de l'UE : impact à venir sur les parcours clients.", v: null },
  { n: 'Passeport numérique des produits', r: 'surveiller', q: 'regle', why: "Traçabilité et informations produit exigées progressivement par la réglementation européenne sur l'écoconception.", v: null }
];
const RINGS = { adopter: ['Adopter', 'On le déploie dès maintenant'], tester: ['Tester', 'On l’expérimente sur des cas ciblés'], surveiller: ['Surveiller', 'On le suit de près'] };
const QUADS = { ia: 'Intelligence artificielle', integration: 'Intégration & sécurité', data: 'Données & visibilité', regle: 'Réglementation & standards' };

function radarSvg() {
  const S = 560, C = S / 2, R = { adopter: 95, tester: 175, surveiller: 255 };
  const qa = { ia: [90, 180], integration: [0, 90], data: [180, 270], regle: [270, 360] };
  let dots = '', n = 0;
  const counts = {};
  RADAR.forEach(it => { const k = it.q + it.r; counts[k] = (counts[k] || 0) + 1; });
  const idx = {};
  RADAR.forEach(it => {
    n++; const k = it.q + it.r; idx[k] = (idx[k] || 0) + 1;
    const [a0, a1] = qa[it.q], total = counts[k];
    const ang = (a0 + (a1 - a0) * (idx[k] / (total + 1))) * Math.PI / 180;
    const inner = it.r === 'adopter' ? 25 : it.r === 'tester' ? R.adopter + 12 : R.tester + 12;
    const rad = (inner + R[it.r]) / 2 + ((idx[k] % 2) ? -10 : 10);
    const x = C + rad * Math.cos(ang), y = C - rad * Math.sin(ang);
    it.num = n;
    dots += `<a href="#rd-${n}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" class="rd-${it.r}"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle">${n}</text></a>`;
  });
  return `<svg viewBox="0 0 ${S} ${S}" class="radar" role="img" aria-label="Radar technologique Groupe Solution">
    <circle cx="${C}" cy="${C}" r="${R.surveiller}" class="ring r3"/><circle cx="${C}" cy="${C}" r="${R.tester}" class="ring r2"/><circle cx="${C}" cy="${C}" r="${R.adopter}" class="ring r1"/>
    <line x1="${C}" y1="${C - R.surveiller}" x2="${C}" y2="${C + R.surveiller}" class="axis"/><line x1="${C - R.surveiller}" y1="${C}" x2="${C + R.surveiller}" y2="${C}" class="axis"/>
    <text x="${C}" y="${C - R.adopter + 18}" class="rl" text-anchor="middle">ADOPTER</text><text x="${C}" y="${C - R.tester + 18}" class="rl" text-anchor="middle">TESTER</text><text x="${C}" y="${C - R.surveiller + 18}" class="rl" text-anchor="middle">SURVEILLER</text>
    <text x="14" y="22" class="ql">IA</text><text x="${S - 14}" y="22" class="ql" text-anchor="end">INTÉGRATION</text><text x="14" y="${S - 10}" class="ql">DONNÉES</text><text x="${S - 14}" y="${S - 10}" class="ql" text-anchor="end">RÉGLEMENTATION</text>
    ${dots}
  </svg>`;
}

/* ── Catalogue d'API ── */
const API = [
  { cat: 'Données publiques françaises', items: [
    ['API Recherche d’entreprises', 'recherche-entreprises.api.gouv.fr', 'Gratuite · sans clé', "Identité légale, SIREN, siège, activité et état administratif de toute entreprise française.", "Vérifier un client ou un fournisseur, pré-remplir un formulaire B2B, qualifier des prospects."],
    ['Base Adresse Nationale (géocodage)', 'api-adresse.data.gouv.fr', 'Gratuite · sans clé', "Adresses officielles, autocomplétion et coordonnées GPS ; service progressivement repris par la Géoplateforme de l’IGN.", "Formulaires sans faute de frappe, livraisons, tournées, cartes de clients."],
    ['API Découpage administratif', 'geo.api.gouv.fr', 'Gratuite · sans clé', "Communes, codes INSEE, codes postaux, population, intercommunalités, départements.", "Zones d'intervention, statistiques locales, pages locales à jour."],
    ['Jours fériés', 'calendrier.api.gouv.fr', 'Gratuite · sans clé', "Les jours fériés de métropole et des territoires d'outre-mer, par année.", "Plannings, délais de livraison, prises de rendez-vous qui tiennent compte du calendrier."],
    ['Géorisques', 'georisques.gouv.fr', 'Gratuite', "Risques naturels et technologiques à une adresse (inondation, argiles, sismicité…).", "Immobilier, assurance, bâtiment : informer et anticiper."],
    ['Hub’Eau', 'hubeau.eaufrance.fr', 'Gratuite · sans clé', "Données sur l'eau : qualité, niveaux des nappes, débits des cours d'eau.", "Agriculture, viticulture, collectivités, activités de rivière."],
    ['transport.data.gouv.fr', 'transport.data.gouv.fr', 'Gratuit', "Point d'accès national aux données de transport (horaires, réseaux, vélos, bornes).", "Accès à vos locaux, calcul de trajets, services de mobilité."],
    ['data.gouv.fr', 'data.gouv.fr', 'Gratuit', "La plateforme ouverte des données publiques françaises, avec une API de recherche de jeux de données.", "Trouver la donnée publique qui enrichira votre outil."]
  ] },
  { cat: 'Météo, environnement, énergie', items: [
    ['Open-Meteo', 'open-meteo.com', 'Gratuit pour usage non commercial · offre commerciale', "Prévisions météo, historique, qualité de l'air et prévisions marines (houle, température de la mer).", "Décisions pilotées par la météo, prévision de la demande, activités de plein air."],
    ['Données Météo-France', 'meteofrance.fr', 'Accès via portail · selon conditions', "Observations et prévisions officielles françaises mises à disposition via un portail d'API.", "Agriculture, BTP, événementiel, énergie."],
    ['Open data des réseaux énergétiques', 'odre.opendatasoft.com', 'Gratuit', "Données ouvertes sur la production et la consommation d'électricité et de gaz.", "Pilotage énergétique, reporting, sensibilisation."]
  ] },
  { cat: 'Cartographie', items: [
    ['OpenStreetMap', 'openstreetmap.org', 'Données libres · règles d’usage des services', "La carte collaborative mondiale, réutilisable sous licence ouverte.", "Cartes personnalisées, points d'intérêt, analyses géographiques."],
    ['MapLibre', 'maplibre.org', 'Open source', "Bibliothèque libre d'affichage de cartes vectorielles, rapide et personnalisable.", "Cartes interactives à votre image sur site ou application."],
    ['Géoplateforme IGN', 'geoservices.ign.fr', 'Services ouverts', "Fonds de carte, photographies aériennes, cadastre et géocodage de l'IGN.", "Immobilier, bâtiment, agriculture, collectivités."],
    ['Google Maps Platform', 'mapsplatform.google.com', 'Payant · volume gratuit mensuel par service', "Cartes, itinéraires, lieux, avis et autocomplétion à l'échelle mondiale.", "Recherche de lieux, calcul d'itinéraires, fiches d'établissements."]
  ] },
  { cat: 'Intelligence artificielle', items: [
    ['Modèles de langage (API)', 'anthropic.com · mistral.ai · openai.com · ai.google.dev', 'Payant à l’usage', "Compréhension et génération de texte, vision, voix, outils : le cœur des agents IA.", "Assistants, agents, extraction de documents, rédaction sous contrôle."],
    ['Model Context Protocol', 'modelcontextprotocol.io', 'Standard ouvert', "Protocole ouvert pour connecter un assistant IA à vos outils et données.", "Brancher CRM, agenda, fichiers ou ERP sur l'IA, avec des droits maîtrisés."],
    ['Modèles open-weight', 'huggingface.co', 'Gratuits à télécharger · hébergement à prévoir', "Des modèles de langage, de vision et de parole hébergeables sur vos propres serveurs ou en Europe.", "Données sensibles, maîtrise des coûts, fonctionnement hors ligne."]
  ] },
  { cat: 'Facturation, paiement, communication', items: [
    ['Chorus Pro', 'chorus-pro.gouv.fr', 'Gratuit', "La plateforme de facturation électronique vers le secteur public, avec API via le portail PISTE.", "Entreprises qui facturent l'État, les collectivités et les hôpitaux."],
    ['Stripe', 'stripe.com', 'Commission par transaction', "Paiements en ligne, abonnements, facturation et terminaux.", "Acomptes, abonnements, boutiques, prélèvements."],
    ['Brevo', 'brevo.com', 'Offre gratuite limitée · payant ensuite', "Plateforme française d'e-mails, SMS et marketing automation.", "Relances, campagnes, messages transactionnels."],
    ['WhatsApp Business Platform', 'business.whatsapp.com', 'Payant selon les conversations', "L'API officielle pour échanger avec vos clients sur WhatsApp.", "Assistants conversationnels, confirmations, service client."]
  ] }
];

const head = ({ title, desc, url, jsonld }) => `<!doctype html>
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
  <meta property="og:image" content="${HOLDING}/assets/visuel-solutions.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/holding-local.css" />
  <style>${STICKY_CSS}
    .labHero{background:radial-gradient(70% 90% at 90% 0%,rgba(230,30,77,.14),transparent 60%),radial-gradient(60% 80% at 0% 100%,rgba(95,107,84,.16),transparent 60%)}
    .radarWrap{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
    .radarWrap>div:first-child{position:sticky;top:100px}
    .radar{width:100%;max-width:560px;height:auto;display:block;margin:0 auto}
    .radar .ring{fill:none;stroke:var(--line2);stroke-width:1.5}.radar .r1{fill:rgba(14,122,90,.06)}.radar .r2{fill:rgba(35,104,199,.04)}.radar .r3{fill:rgba(178,124,30,.03)}
    .radar .axis{stroke:var(--line2);stroke-dasharray:4 6}
    .radar .rl{font:800 10px var(--sans);letter-spacing:.14em;fill:var(--muted)}.radar .ql{font:800 11px var(--sans);letter-spacing:.12em;fill:var(--olive2)}
    .radar circle.rd-adopter{fill:var(--green)}.radar circle.rd-tester{fill:var(--blue)}.radar circle.rd-surveiller{fill:var(--amber)}
    .radar a circle{stroke:#fff;stroke-width:2;transition:r .2s}.radar a:hover circle{r:15}
    .radar text:not(.rl):not(.ql){font:800 11px var(--sans);fill:#fff;pointer-events:none}
    .rdList{display:grid;gap:10px}
    .rdItem{display:grid;grid-template-columns:34px 1fr;gap:12px;background:var(--white);border:1px solid var(--line);border-radius:var(--r-m);padding:14px 16px;scroll-margin-top:100px}
    .rdItem:target{border-color:var(--acc);box-shadow:0 0 0 4px var(--acc-soft)}
    .rdNum{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;font-size:13px}
    .rdNum.adopter{background:var(--green)}.rdNum.tester{background:var(--blue)}.rdNum.surveiller{background:var(--amber)}
    .rdItem b{font-size:15px}.rdItem .meta{font-size:11.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-left:6px}
    .rdItem p{font-size:14px;color:var(--secondary);margin-top:4px;line-height:1.5}.rdItem a{font-size:13px;font-weight:800;color:var(--acc)}
    .legend{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-top:14px;font-size:13px;font-weight:700;color:var(--secondary)}
    .legend i{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:6px;vertical-align:-1px}
    .labCards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.labCards.four{grid-template-columns:repeat(4,1fr)}
    .labCard{display:flex;flex-direction:column;background:var(--white);border:1px solid var(--line);border-radius:var(--r-l);padding:28px;box-shadow:var(--sh-s);transition:transform .3s var(--ease),box-shadow .3s var(--ease)}
    .labCard:hover{transform:translateY(-5px);box-shadow:var(--sh-l)}.labCard .k{font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--acc)}
    .labCard h3{font-size:22px;font-weight:600;margin-top:10px}.labCard p{color:var(--secondary);font-size:14.5px;margin-top:10px;flex:1}.labCard .go{margin-top:16px;align-self:flex-start}
    .apiCat{margin-top:46px}.apiCat h2{font-size:clamp(24px,3vw,32px);margin-bottom:18px}
    .apiGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
    .api{background:var(--white);border:1px solid var(--line);border-radius:var(--r-m);padding:20px 22px}
    .api h3{font-size:18px;font-weight:600}.api .dom{font-size:12.5px;color:var(--muted);font-weight:700;word-break:break-word}
    .api .acc{display:inline-block;margin-top:8px;font-size:11.5px;font-weight:800;color:var(--green);background:var(--green-soft);padding:4px 10px;border-radius:999px}
    .api p{font-size:14px;color:var(--secondary);margin-top:10px;line-height:1.55}.api p.use{color:var(--ink);font-weight:600}.api p.use::before{content:"→ ";color:var(--acc)}
    .demos{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
    .demo{background:var(--white);border:1px solid var(--line);border-radius:var(--r-l);padding:26px;box-shadow:var(--sh-s)}
    .demo h3{font-size:20px;font-weight:600}.demo .src{font-size:12px;color:var(--muted);font-weight:700;margin-top:4px}
    .demo .row{display:flex;gap:8px;margin-top:14px}.demo input{flex:1;min-width:0;padding:12px 14px;border:1px solid var(--line2);border-radius:var(--r-s);font-family:var(--sans);font-size:15px;background:var(--sand)}
    .demo input:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--acc-soft);background:#fff}
    .demo button{padding:12px 16px;border-radius:var(--r-s);border:0;background:var(--ink);color:#fff;font-weight:800;cursor:pointer}
    .demoOut{margin-top:14px;display:grid;gap:8px;max-height:340px;overflow:auto}
    .demoRow{background:var(--sand);border-radius:12px;padding:10px 12px;font-size:13.5px;display:grid;gap:2px}.demoRow b{font-size:14px}.demoRow span{color:var(--secondary)}
    .demoRow.past{opacity:.5}.demoWait{font-size:13.5px;color:var(--muted)}
    @media(max-width:1100px){.labCards.four{grid-template-columns:1fr 1fr}}
    @media(max-width:960px){.radarWrap>div:first-child{position:static}.radarWrap,.labCards,.labCards.four,.apiGrid,.demos{grid-template-columns:1fr}}
  </style>
  <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
  </script>
</head>
<body>
<header class="nav"><div class="wrap navin"><a class="brand" href="../index.html" aria-label="Groupe Solution — accueil"><img src="../Logo.svg" alt="Groupe Solution" /></a><nav class="links"><a href="./">Lab</a><a href="actus/">Actus</a><a href="dossiers/">Dossiers</a><a href="questions/">Questions</a><a href="api.html">API &amp; données</a><a href="veille/">Veille</a><a href="../automatisation/">Automatisation</a><a href="../outils/">Outils</a><a class="cta" href="#contact">Discutons 10 min</a></nav></div></header>
<main>`;

const foot = `</main>
<footer><div class="wrap foot">
  <span class="footBrand"><img src="../Logo.svg" alt="Groupe Solution" /> © <span id="year"></span> Groupe Solution · Montpellier</span>
  <nav>
    <a href="../index.html">Accueil</a>
    <a href="./">Lab</a>
    <a href="actus/">Actus</a>
    <a href="dossiers/">Dossiers</a>
    <a href="questions/">Questions</a>
    <a href="pouls/">Le pouls des dirigeants</a>
    <a href="api.html">API &amp; données</a>
    <a href="veille/">Veille</a>
    <a href="../automatisation/">Automatisation</a>
    <a href="../outils/">Outils gratuits</a>
    <a href="../echanger.html">Échanger</a>
  </nav>
</div></footer>
<div class="gs-sticky"><a class="s1" href="tel:+33782298559"><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:6px"><path d="M6.5 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/></svg>Appeler</a><a class="s2" href="#contact">Discutons 10 min</a></div>
<script src="../assets/live.js" defer></script>
<script src="../assets/holding-local.js" defer></script>
<script src="/analytics.js" defer></script>
</body>
</html>
`;

const express = (page, h2, p) => `
  <section class="sec alt" id="contact"><div class="wrap">
    <div class="express reveal" id="express">
      <h2>${h2}</h2>
      <p>${p}</p>
      <form id="expressForm" action="https://formspree.io/f/mzebrvjg" method="POST">
        <input type="hidden" name="page" value="lab/${page}" />
        <label class="full">Votre idée ou votre question<textarea name="message" required placeholder="Ex : connecter notre ERP à un assistant IA, lire automatiquement nos bons de livraison…"></textarea></label>
        <label>Votre nom<input name="nom" autocomplete="name" required /></label>
        <label>Téléphone ou email<input name="contact" autocomplete="email" required /></label>
        <button class="btn" type="submit">Envoyer →</button>
      </form>
      <p class="alts">Plus rapide : <a href="tel:+33782298559">07 82 29 85 59</a> · <a href="../echanger.html#rendez-vous">Réserver 10 min en visio</a></p>
    </div>
  </div></section>`;

function index() {
  const url = `${HOLDING}/${DIR}/`;
  const title = 'Lab Groupe Solution : radar des technologies, API et veille IA';
  const desc = "Notre radar des technologies (agents IA, RAG, MCP, facturation électronique, open data…), un catalogue d'API gratuites avec démos en direct et notre veille.";
  const radar = radarSvg();
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: 'Lab Groupe Solution', url, description: desc, publisher: { '@type': 'Organization', name: 'Groupe Solution', url: HOLDING + '/' } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Lab', item: url }] }] };
  return head({ title, desc, url, jsonld }) + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <span>Lab</span></div>
  <section class="hero labHero"><div class="wrap" style="max-width:860px;text-align:center">
    <div class="kicker reveal">Innovation · mis à jour en continu</div>
    <h1 class="reveal">Le Lab : ce qui arrive, avant que ça devienne évident.</h1>
    <p class="lead reveal" style="margin-left:auto;margin-right:auto">Agents IA, nouveaux standards, données publiques, réglementation : nous testons et suivons en permanence les technologies qui vont changer le quotidien des entreprises — et nous vous disons honnêtement lesquelles sont prêtes.</p>
  </div></section>

  <section class="sec" style="padding-top:20px"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">Radar technologique</div><h2>Notre lecture, sans effet de mode.</h2><p>Au centre, ce que nous déployons déjà. Au bord, ce que nous surveillons. Cliquez sur un point pour lire pourquoi.</p></div>
    <div class="radarWrap">
      <div class="reveal">${radar}<div class="legend"><span><i style="background:var(--green)"></i>Adopter</span><span><i style="background:var(--blue)"></i>Tester</span><span><i style="background:var(--amber)"></i>Surveiller</span></div></div>
      <div class="rdList">
${RADAR.map(it => `        <div class="rdItem" id="rd-${it.num}"><span class="rdNum ${it.r}">${it.num}</span><div><b>${esc(it.n)}</b><span class="meta">${RINGS[it.r][0]} · ${esc(QUADS[it.q])}</span><p>${esc(it.why)}</p>${vLink(it.v) ? `<a href="${vLink(it.v)}">Lire notre analyse →</a>` : ''}</div></div>`).join('\n')}
      </div>
    </div>
  </div></section>

  <section class="sec alt"><div class="wrap">
    <div class="secHead center reveal"><div class="kicker">Explorer</div><h2>Neuf portes d’entrée.</h2></div>
    <div class="labCards four">
      <a class="labCard reveal" href="actus/"><span class="k">Actus · ${esc(new Date(ACTUS[0].date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }))}</span><h3>${esc(ACTUS[0].titre)}</h3><p>L'actualité IA, numérique et réglementaire, sourcée et traduite en impacts concrets.</p><span class="go">Lire →</span></a>
      <a class="labCard reveal" href="api.html"><span class="k">API &amp; données</span><h3>Les API gratuites qui changent la donne</h3><p>Entreprises, adresses, météo, mer, cartographie, IA : le catalogue commenté, avec des démonstrations qui tournent en direct.</p><span class="go">Explorer →</span></a>
      <a class="labCard reveal" href="veille/"><span class="k">Veille</span><h3>Nos analyses de fond</h3><p>${VEILLE.length} articles : MCP, agents vocaux, facturation électronique 2026, AI Act, RAG, open data…</p><span class="go">Lire →</span></a>
      <a class="labCard reveal" href="../outils/"><span class="k">Outils gratuits</span><h3>Faites le point vous-même</h3><p>Configurateur de projet, test de visibilité Google, calculateur du coût de vos tâches répétitives.</p><span class="go">Essayer →</span></a>
      <a class="labCard reveal" href="dossiers/"><span class="k">Dossier de la semaine</span><h3>Un sujet de fond, chaque lundi</h3><p>IA, automatisation, réglementation : expliqué pour les dirigeants, avec ses sources.</p><span class="go">Lire →</span></a>
      <a class="labCard reveal" href="questions/"><span class="k">Questions de dirigeants</span><h3>Vos questions sur l’IA, nos réponses sourcées</h3><p>Une réponse courte, une réponse complète, des sources vérifiées.</p><span class="go">Lire →</span></a>
      <a class="labCard reveal" href="pouls/"><span class="k">Votes en direct</span><h3>Le pouls des dirigeants</h3><p>Utile, à surveiller ou pas pour vous ? Votez sur l’actualité et voyez l’avis des autres entreprises.</p><span class="go">Voter →</span></a>
      <a class="labCard reveal" href="../idees/"><span class="k">Laboratoire d’idées · en direct</span><h3>Réinventer chaque secteur</h3><p>Des idées d’innovation par métier, et les plans imaginés en direct par notre IA avec des entreprises.</p><span class="go">Explorer →</span></a>
      <a class="labCard reveal" href="coulisses.html"><span class="k">Coulisses</span><h3>Comment ce site fonctionne</h3><p>Assistant IA, génération en direct, personnalisation sans pistage, publication vérifiée chaque matin.</p><span class="go">Voir →</span></a>
    </div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">Dernières analyses</div><h2>Veille : ce qu’il faut savoir maintenant.</h2></div>
    <div class="labCards">
${VEILLE.slice(0, 6).map(v => `      <a class="labCard reveal" href="veille/${v.slug}.html"><span class="k">Veille</span><h3>${esc(v.h1)}</h3><span class="go">Lire →</span></a>`).join('\n')}
    </div>
  </div></section>
${express('index', 'Une technologie vous intrigue ?', 'Dites-nous ce que vous avez vu passer ou ce que vous aimeriez automatiser : on vous dit, honnêtement, si c’est prêt pour votre entreprise.')}
` + foot;
}

function api() {
  const url = `${HOLDING}/${DIR}/api.html`;
  const title = 'API gratuites pour entreprises : catalogue et démos en direct | Groupe Solution';
  const desc = "Entreprises (SIRENE), adresses, jours fériés, météo, mer, cartographie, IA : les API gratuites ou ouvertes utiles aux entreprises, avec démos en direct.";
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'TechArticle', headline: 'API gratuites et ouvertes utiles aux entreprises', description: desc, url, datePublished: '2026-09-29', dateModified: '2026-09-29', author: { '@type': 'Person', name: 'Titouan Bedos' }, publisher: { '@type': 'Organization', name: 'Groupe Solution', logo: { '@type': 'ImageObject', url: HOLDING + '/Logo.svg' } } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Lab', item: `${HOLDING}/${DIR}/` }, { '@type': 'ListItem', position: 3, name: 'API & données', item: url }] }] };
  return head({ title, desc, url, jsonld }) + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <a href="./">Lab</a> › <span>API &amp; données</span></div>
  <section class="hero labHero"><div class="wrap" style="max-width:860px;text-align:center">
    <div class="kicker reveal">API &amp; données ouvertes</div>
    <h1 class="reveal">Les API qui font gagner du temps — et qui tournent en direct.</h1>
    <p class="lead reveal" style="margin-left:auto;margin-right:auto">Beaucoup de données utiles aux entreprises sont gratuites et accessibles par API. Testez ci-dessous : chaque démonstration interroge le service en temps réel, depuis votre navigateur.</p>
  </div></section>

  <section class="sec" style="padding-top:20px"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">Démonstrations en direct</div><h2>Essayez, c’est réel.</h2><p>Aucune clé, aucun compte : ce sont des services publics ou ouverts. Imaginez-les branchés sur votre site, votre CRM ou vos formulaires.</p></div>
    <div class="demos">
      <div class="demo reveal" id="demoEntreprise"><h3>Vérifier une entreprise</h3><div class="src">API Recherche d’entreprises (données SIRENE)</div><div class="row"><input type="search" placeholder="Nom ou SIREN d’une entreprise…" aria-label="Nom ou SIREN" /></div><div class="demoOut" aria-live="polite"></div></div>
      <div class="demo reveal" id="demoAdresse"><h3>Adresse sans faute</h3><div class="src">Base Adresse Nationale</div><div class="row"><input type="search" placeholder="Commencez à taper une adresse…" aria-label="Adresse" /></div><div class="demoOut" aria-live="polite"></div></div>
      <div class="demo reveal" id="demoMeteo"><h3>Météo d’une commune</h3><div class="src">Base Adresse Nationale + Open-Meteo</div><div class="row"><input type="search" value="Montpellier" aria-label="Commune" /><button type="button">Voir</button></div><div class="demoOut" aria-live="polite"></div></div>
      <div class="demo reveal" id="demoFeries"><h3>Jours fériés de l’année</h3><div class="src">calendrier.api.gouv.fr</div><div class="demoOut" aria-live="polite"><p class="demoWait">Chargement…</p></div></div>
    </div>
  </div></section>

  <section class="sec alt"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">Catalogue commenté</div><h2>Ce qui existe, et à quoi ça sert.</h2><p>Les conditions d’accès évoluent : vérifiez toujours les conditions d’utilisation à jour de chaque service avant un usage en production — c’est ce que nous faisons pour chaque projet.</p></div>
${API.map(c => `    <div class="apiCat"><h2>${esc(c.cat)}</h2><div class="apiGrid">
${c.items.map(([n, d, acc, what, use]) => `      <div class="api reveal"><h3>${esc(n)}</h3><div class="dom">${esc(d)}</div><span class="acc">${esc(acc)}</span><p>${esc(what)}</p><p class="use">${esc(use)}</p></div>`).join('\n')}
    </div></div>`).join('\n')}
  </div></section>
${express('api', 'Branchons ces données sur vos outils.', 'Dites-nous quelle donnée vous manque ou quelle ressaisie vous fatigue : on vous dit quelle API peut la faire disparaître.')}
` + foot;
}

writeFileSync(join(ROOT, DIR, 'index.html'), index(), 'utf8');
writeFileSync(join(ROOT, DIR, 'api.html'), api(), 'utf8');
console.log(`✓ Lab généré : /lab/ (radar ${RADAR.length} technologies, ${VEILLE.length} articles liés) + /lab/api.html`);
