/* ═══════════════════════════════════════════════════════════
   OUTILS GRATUITS (aimants à liens + conversion) — charte holding.
   Produit : /outils/index.html, /outils/prix-site-internet.html,
             /outils/test-visibilite-google.html, /outils/calculateur-automatisation.html
   Logique interactive : /assets/outils.js (grille de prix éditable en tête de fichier).

   Lancer :  node zones/generate-outils.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { esc } from './lib-local.mjs';
import { STICKY_CSS } from './lib-local.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = 'outils';
mkdirSync(join(ROOT, DIR), { recursive: true });
const FORM = 'https://formspree.io/f/mzebrvjg';

const TOOLS = [
  { slug: 'prix-site-internet', name: 'Simulateur de prix de site internet', short: 'Combien coûte votre site ?', icon: '€',
    title: 'Simulateur prix site internet : estimez votre devis en 1 min | GroupSolution',
    desc: "Simulateur gratuit : type de site, pages, options (réservation, e-commerce, rédaction, multilingue). Obtenez une fourchette de prix indicative en une minute.",
    lead: "Vitrine, réservation, e-commerce, sur-mesure : choisissez ce dont vous avez besoin, le simulateur affiche une fourchette indicative et ce qu'elle comprend. Sans inscription." },
  { slug: 'test-visibilite-google', name: 'Test de visibilité Google', short: 'Votre entreprise est-elle visible ?', icon: 'G',
    title: 'Test de visibilité Google gratuit pour entreprise locale | GroupSolution',
    desc: "10 questions pour mesurer la visibilité locale de votre entreprise sur Google et Google Maps. Score immédiat et 3 actions prioritaires personnalisées.",
    lead: "Dix questions sur votre fiche Google, votre site et vos avis. Vous obtenez un score sur 100 et les trois actions qui vous rapporteront le plus de clients, dans l'ordre." },
  { slug: 'calculateur-automatisation', name: 'Calculateur de gain d\'automatisation', short: 'Combien vous coûtent vos tâches répétitives ?', icon: '⏱',
    title: 'Calculateur : combien vous coûtent vos tâches répétitives ? | GroupSolution',
    desc: "Devis, saisie, relances, rendez-vous, documents : cochez vos tâches répétitives et calculez le temps et l'argent récupérables grâce à l'automatisation.",
    lead: "Cochez les tâches qui reviennent chaque semaine dans votre entreprise, ajustez les temps, et voyez ce qu'elles vous coûtent vraiment — et ce que l'automatisation peut vous rendre." }
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
    .tool{max-width:1000px;margin:0 auto;background:var(--white);border:1px solid var(--line);border-radius:var(--r-xl);box-shadow:var(--sh-m);overflow:hidden}
    .toolGrid{display:grid;grid-template-columns:1.25fr .75fr}
    .toolIn{padding:34px}
    .toolOut{background:var(--ink);color:#fff;padding:34px;display:flex;flex-direction:column;gap:14px;position:sticky;top:90px;align-self:start;min-height:100%}
    .toolOut .big{font-family:var(--serif);font-size:clamp(34px,4.4vw,50px);line-height:1.05;letter-spacing:-.03em}
    .toolOut .lbl{font-size:13px;color:#BDB9AE;font-weight:600}
    .toolOut ul{list-style:none;display:grid;gap:7px;font-size:14px;color:#E7E4DC}
    .toolOut li::before{content:"✓ ";color:#7DD3B0;font-weight:800}
    .toolOut .btn{margin-top:6px}
    .fs{border:0;margin:0 0 26px}
    .fs legend{font-weight:800;font-size:15px;margin-bottom:12px}
    .opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}
    .opt{position:relative}
    .opt input{position:absolute;opacity:0;pointer-events:none}
    .opt span{display:block;height:100%;padding:13px 15px;border:1.5px solid var(--line2);border-radius:14px;cursor:pointer;font-size:14px;font-weight:700;transition:border-color .15s,background .15s}
    .opt span small{display:block;font-weight:500;color:var(--muted);font-size:12.5px;margin-top:3px}
    .opt input:checked + span{border-color:var(--acc);background:var(--acc-soft)}
    .opt input:focus-visible + span{outline:3px solid var(--acc-ring)}
    .range label{display:block;font-size:14px;font-weight:700}.range label b{float:right;font-family:var(--serif);font-size:18px;color:var(--olive2)}
    .range input{width:100%;margin-top:10px;accent-color:var(--acc)}
    .q{padding:16px 0;border-bottom:1px solid var(--line)}
    .q p{font-weight:700;font-size:15px;margin-bottom:10px}
    .q .opts{grid-template-columns:repeat(3,1fr)}
    .q .opt span{text-align:center;padding:10px}
    .score{font-family:var(--serif);font-size:64px;line-height:1}
    .bar{height:10px;border-radius:99px;background:rgba(255,255,255,.14);overflow:hidden}.bar i{display:block;height:100%;width:0;background:#E61E4D;transition:width .5s var(--ease)}
    .actions{counter-reset:a;display:grid;gap:10px}
    .actions div{counter-increment:a;background:rgba(255,255,255,.07);border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.5}
    .actions div::before{content:counter(a) ". ";font-weight:800;color:#FF7A99}
    .task{display:grid;grid-template-columns:auto 1fr 120px;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
    .task input[type=checkbox]{width:20px;height:20px;accent-color:var(--acc)}
    .task label{font-weight:700;font-size:14.5px}.task label small{display:block;font-weight:500;color:var(--muted);font-size:12.5px}
    .task input[type=number]{width:100%;padding:9px 10px;border:1px solid var(--line2);border-radius:10px;font-family:var(--sans);font-size:14px}
    .disclaimer{max-width:1000px;margin:14px auto 0;font-size:12.5px;color:var(--muted);text-align:center}
    .toolsGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .toolCard{display:flex;flex-direction:column;background:var(--white);border:1px solid var(--line);border-radius:var(--r-l);padding:30px;box-shadow:var(--sh-s);transition:transform .3s var(--ease),box-shadow .3s var(--ease)}
    .toolCard:hover{transform:translateY(-5px);box-shadow:var(--sh-l)}
    .toolCard .ic{width:52px;height:52px;border-radius:16px;background:var(--acc-soft);color:var(--acc);display:grid;place-items:center;font-family:var(--serif);font-size:24px;font-weight:600;margin-bottom:18px}
    .toolCard h2{font-size:24px;font-weight:600}.toolCard p{color:var(--secondary);font-size:15px;margin-top:10px;flex:1}
    .toolCard .go{margin-top:18px;font-weight:800;color:var(--acc)}
    @media(max-width:900px){.toolGrid,.toolsGrid{grid-template-columns:1fr}.toolOut{position:static}.q .opts{grid-template-columns:1fr 1fr 1fr}}
    @media(max-width:600px){.toolIn,.toolOut{padding:24px}.task{grid-template-columns:auto 1fr;}.task input[type=number]{grid-column:2}}
  </style>
  <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
  </script>
</head>
<body>
<header class="nav"><div class="wrap navin"><a class="brand" href="../index.html" aria-label="Groupe Solution — accueil"><img src="../Logo.svg" alt="Groupe Solution" /></a><nav class="links"><a href="./">Outils gratuits</a><a href="../automatisation/">Automatisation</a><a href="../montpellier/site-internet-montpellier.html">Sites internet</a><a href="../montpellier/guides/">Guides</a><a class="cta" href="#contact">Être rappelé</a></nav></div></header>
<main>`;

const foot = `</main>
<footer><div class="wrap foot">
  <span class="footBrand"><img src="../Logo.svg" alt="Groupe Solution" /> © <span id="year"></span> Groupe Solution · Montpellier</span>
  <nav>
    <a href="../index.html">Accueil</a>
    <a href="./">Outils gratuits</a>
    <a href="prix-site-internet.html">Simulateur de prix</a>
    <a href="test-visibilite-google.html">Test Google</a>
    <a href="calculateur-automatisation.html">Calculateur</a>
    <a href="../montpellier/guides/">Guides</a>
    <a href="../echanger.html">Échanger</a>
  </nav>
</div></footer>
<div class="gs-sticky"><a class="s1" href="tel:+33782298559">📞 Appeler</a><a class="s2" href="#contact">Être rappelé</a></div>
<script src="../assets/outils.js" defer></script>
<script src="../assets/holding-local.js" defer></script>
<script src="/analytics.js" defer></script>
</body>
</html>
`;

const express = (tool, h2, p) => `
  <section class="sec alt" id="contact"><div class="wrap">
    <div class="express reveal" id="express">
      <h2>${h2}</h2>
      <p>${p}</p>
      <form id="expressForm" action="${FORM}" method="POST">
        <input type="hidden" name="page" value="outils/${tool}" />
        <input type="hidden" name="resultat" id="toolResult" value="" />
        <label class="full">Votre projet ou votre question<textarea name="message" required></textarea></label>
        <label>Votre nom<input name="nom" autocomplete="name" required /></label>
        <label>Téléphone ou email<input name="contact" autocomplete="email" required /></label>
        <label class="full">Votre activité et votre commune (optionnel)<input name="entreprise" placeholder="ex : restaurant à Sète" /></label>
        <button class="btn" type="submit">Envoyer →</button>
      </form>
      <p class="alts">Plus rapide : <a href="tel:+33782298559">07 82 29 85 59</a> · <a href="../echanger.html#rendez-vous">Réserver 10 min en visio</a></p>
    </div>
  </div></section>`;

const faqBlock = faq => `
  <section class="sec" id="faq"><div class="wrap">
    <div class="secHead center reveal"><div class="kicker">Questions fréquentes</div><h2>Bon à savoir.</h2></div>
    <div class="faq">
${faq.map(f => `      <details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n')}
    </div>
  </div></section>`;

const others = cur => `
  <section class="sec"><div class="wrap">
    <div class="secHead center reveal"><div class="kicker">Les autres outils</div><h2>Continuez le diagnostic.</h2></div>
    <div class="toolsGrid">${TOOLS.filter(t => t.slug !== cur).map(t => `
      <a class="toolCard reveal" href="${t.slug}.html"><div class="ic">${t.icon}</div><h2>${esc(t.name)}</h2><p>${esc(t.lead)}</p><span class="go">Essayer →</span></a>`).join('')}
      <a class="toolCard reveal" href="../montpellier/guides/"><div class="ic">¶</div><h2>Guides pratiques</h2><p>Prix d'un site, Google Maps, devis automatiques, obligations légales, relances d'impayés : nos guides détaillés.</p><span class="go">Lire →</span></a>
    </div>
  </div></section>`;

function ld(t, faq) {
  const url = `${HOLDING}/${DIR}/${t.slug}.html`;
  return { url, jsonld: { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebApplication', name: t.name, url, description: t.desc, applicationCategory: 'BusinessApplication', operatingSystem: 'Tous (navigateur web)', isAccessibleForFree: true, inLanguage: 'fr-FR', offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR' }, provider: { '@type': 'Organization', name: 'Groupe Solution', url: HOLDING + '/' } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Outils gratuits', item: `${HOLDING}/${DIR}/` }, { '@type': 'ListItem', position: 3, name: t.name, item: url }] },
    { '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  ] } };
}

const hero = (t, kicker) => `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <a href="./">Outils gratuits</a> › <span>${esc(t.name)}</span></div>
  <section class="hero" style="padding-bottom:40px"><div class="wrap" style="max-width:820px;text-align:center">
    <div class="kicker reveal">${kicker}</div>
    <h1 class="reveal">${esc(t.short)}</h1>
    <p class="lead reveal" style="margin-left:auto;margin-right:auto">${esc(t.lead)}</p>
  </div></section>`;

/* ── 1. Simulateur de prix ── */
function prix() {
  const t = TOOLS[0];
  const faq = [
    { q: 'Le prix affiché est-il un devis ?', a: "Non, c'est une fourchette indicative calculée à partir de projets courants. Le devis définitif dépend de vos contenus, de vos intégrations et de vos délais ; il est gratuit et sans engagement." },
    { q: 'Pourquoi les prix des sites varient-ils autant ?', a: "Parce qu'un « site » peut aller d'une page de présentation à une plateforme avec paiement, réservation et connexions à vos logiciels. Le nombre de pages, la rédaction, les fonctionnalités et le suivi font l'essentiel de l'écart." },
    { q: "Qu'est-ce qui est compris dans nos sites ?", a: "Un site rapide et pensé mobile, les bases techniques du référencement, la conformité (mentions légales, cookies) et la mise en ligne. Le site et le nom de domaine vous appartiennent." },
    { q: 'Y a-t-il des frais chaque mois ?', a: "L'hébergement et le nom de domaine ont un coût annuel modeste. Le suivi (mises à jour, sécurité, modifications) est optionnel et proposé à part, sans engagement imposé." }
  ];
  const { url, jsonld } = ld(t, faq);
  const opt = (name, type, value, label, small, checked) => `<label class="opt"><input type="${type}" name="${name}" value="${value}"${checked ? ' checked' : ''} /><span>${label}${small ? `<small>${small}</small>` : ''}</span></label>`;
  return head({ title: t.title, desc: t.desc, url, jsonld }) + hero(t, 'Outil gratuit · 1 minute') + `
  <section class="sec" style="padding-top:10px"><div class="wrap">
    <div class="tool reveal" id="prixTool"><div class="toolGrid">
      <div class="toolIn">
        <fieldset class="fs"><legend>1. Quel type de site ?</legend><div class="opts">
          ${opt('type', 'radio', 'vitrine', 'Vitrine simple', '1 à 3 pages, présentation et contact', true)}
          ${opt('type', 'radio', 'vitrine-plus', 'Vitrine complète', 'Plusieurs pages, services, réalisations')}
          ${opt('type', 'radio', 'reservation', 'Réservation / rendez-vous', 'Créneaux, acomptes, rappels')}
          ${opt('type', 'radio', 'ecommerce', 'Boutique en ligne', 'Catalogue, paiement, livraison')}
          ${opt('type', 'radio', 'surmesure', 'Plateforme sur-mesure', 'Espace client, logique métier')}
        </div></fieldset>
        <fieldset class="fs range"><legend>2. Combien de pages environ ?</legend><label>Pages <b id="pagesOut">5</b><input type="range" id="pages" min="1" max="40" value="5" /></label></fieldset>
        <fieldset class="fs"><legend>3. Options utiles</legend><div class="opts">
          ${opt('opt', 'checkbox', 'redaction', 'Rédaction des textes', 'Optimisés pour Google')}
          ${opt('opt', 'checkbox', 'gbp', 'Fiche Google Business', 'Création / optimisation')}
          ${opt('opt', 'checkbox', 'multilingue', 'Version anglaise', 'ou autre langue')}
          ${opt('opt', 'checkbox', 'logo', 'Logo / identité', 'Création ou refonte simple')}
          ${opt('opt', 'checkbox', 'devisauto', 'Devis automatique', 'Formulaire intelligent, photos')}
          ${opt('opt', 'checkbox', 'blog', 'Blog / actualités', 'Pour le référencement')}
        </div></fieldset>
        <fieldset class="fs"><legend>4. Suivi après mise en ligne</legend><div class="opts">
          ${opt('suivi', 'radio', 'non', 'Je gère moi-même', '', true)}
          ${opt('suivi', 'radio', 'oui', 'Suivi mensuel', 'Mises à jour, sécurité, modifications')}
        </div></fieldset>
      </div>
      <aside class="toolOut" aria-live="polite">
        <span class="lbl">Estimation indicative</span>
        <div class="big" id="prixOut">—</div>
        <span class="lbl" id="suiviOut"></span>
        <ul id="prixList"></ul>
        <a class="btn" href="#contact" id="prixCta">Recevoir un devis précis →</a>
        <span class="lbl">Gratuit, sans engagement · réponse sous 24 h</span>
      </aside>
    </div></div>
    <p class="disclaimer">Fourchettes indicatives constatées sur des projets courants, hors photos professionnelles et frais d'hébergement/nom de domaine. Le devis final dépend de votre projet.</p>
  </div></section>
${faqBlock(faq)}
${express(t.slug, 'Recevez votre devis précis', "Votre estimation est jointe automatiquement. Ajoutez quelques mots sur votre activité : je vous réponds sous 24 h avec un devis clair.")}
${others(t.slug)}
` + foot;
}

/* ── 2. Test de visibilité ── */
const QUESTIONS = [
  ['gbp', 'Avez-vous une fiche Google Business Profile validée ?', 15, "Créez et validez votre fiche Google Business Profile : c'est elle qui vous fait apparaître sur Google Maps et dans le « pack local »."],
  ['cat', 'La catégorie principale de votre fiche décrit-elle exactement votre métier ?', 8, "Choisissez la catégorie principale la plus précise possible (ex. « Plombier » plutôt que « Entreprise de bâtiment ») : c'est l'un des premiers critères de classement local."],
  ['avis', 'Avez-vous plus de 20 avis Google, dont certains de moins de 3 mois ?', 12, "Mettez en place une demande d'avis systématique après chaque prestation (un simple lien par SMS ou e-mail) : volume et fraîcheur des avis pèsent lourd."],
  ['rep', 'Répondez-vous à tous vos avis, y compris les négatifs ?', 6, "Répondez à chaque avis, poliment et rapidement : Google et les futurs clients le voient."],
  ['photos', 'Votre fiche contient-elle des photos récentes (moins de 6 mois) ?', 7, "Ajoutez régulièrement de vraies photos (équipe, locaux, réalisations) : les fiches illustrées reçoivent plus de clics."],
  ['site', 'Avez-vous un site internet relié à votre fiche Google ?', 12, "Reliez un site rapide à votre fiche : il confirme à Google votre activité et votre zone, et convertit les visiteurs."],
  ['mobile', 'Votre site s\'affiche-t-il parfaitement et rapidement sur téléphone ?', 10, "Rendez votre site rapide et lisible sur mobile : la majorité des recherches locales se font sur téléphone."],
  ['local', 'Votre site mentionne-t-il clairement votre ville et votre zone d\'intervention ?', 10, "Indiquez clairement votre ville et votre zone réelle sur le site (textes, pages de services, réalisations localisées)."],
  ['nap', 'Vos nom, adresse et téléphone sont-ils identiques partout (site, Google, annuaires, réseaux) ?', 8, "Harmonisez nom, adresse et téléphone sur tous vos supports : les incohérences brouillent Google."],
  ['contact', 'Un client peut-il demander un devis ou réserver en ligne en moins d\'une minute ?', 12, "Ajoutez un moyen de contact immédiat : devis en ligne, réservation ou rappel — sinon le visiteur retourne voir le concurrent."]
];
function test() {
  const t = TOOLS[1];
  const faq = [
    { q: 'Ce test remplace-t-il un audit ?', a: "C'est un premier repère fiable sur les critères les plus importants du référencement local. L'audit gratuit de 15 minutes va plus loin : positionnement réel sur vos mots-clés, concurrents, fiche et site analysés en détail." },
    { q: 'Mes réponses sont-elles enregistrées ?', a: "Non : le calcul se fait dans votre navigateur. Rien n'est envoyé, sauf si vous choisissez de nous transmettre votre résultat via le formulaire." },
    { q: 'Quel score viser ?', a: "Au-dessus de 80, vous êtes bien placé pour votre zone. Entre 50 et 80, quelques actions ciblées font souvent une grosse différence. En dessous de 50, vous laissez probablement une bonne partie de vos clients potentiels à vos concurrents." },
    { q: 'En combien de temps voit-on des résultats ?', a: "Les améliorations de fiche Google (catégorie, photos, avis) peuvent jouer en quelques semaines. Le référencement du site progresse sur plusieurs mois, surtout avec des contenus utiles et locaux." }
  ];
  const { url, jsonld } = ld(t, faq);
  return head({ title: t.title, desc: t.desc, url, jsonld }) + hero(t, 'Outil gratuit · 2 minutes') + `
  <section class="sec" style="padding-top:10px"><div class="wrap">
    <div class="tool reveal" id="testTool" data-q='${JSON.stringify(QUESTIONS.map(([k, , w, a]) => ({ k, w, a }))).replace(/'/g, '&#39;')}'><div class="toolGrid">
      <div class="toolIn">
${QUESTIONS.map(([k, q], i) => `        <div class="q"><p>${i + 1}. ${esc(q)}</p><div class="opts">
          <label class="opt"><input type="radio" name="${k}" value="1" /><span>Oui</span></label>
          <label class="opt"><input type="radio" name="${k}" value="0.5" /><span>En partie</span></label>
          <label class="opt"><input type="radio" name="${k}" value="0" /><span>Non / je ne sais pas</span></label>
        </div></div>`).join('\n')}
      </div>
      <aside class="toolOut" aria-live="polite">
        <span class="lbl">Votre score de visibilité locale</span>
        <div class="score" id="testScore">–</div>
        <div class="bar"><i id="testBar"></i></div>
        <span class="lbl" id="testMsg">Répondez aux questions : le score se met à jour en direct.</span>
        <div class="actions" id="testActions"></div>
        <a class="btn" href="#contact" id="testCta">Recevoir mon audit gratuit →</a>
      </aside>
    </div></div>
  </div></section>
${faqBlock(faq)}
${express(t.slug, 'Allez plus loin : audit gratuit de 15 min', "Votre score est joint automatiquement. Dites-nous votre activité et votre commune : on regarde votre fiche, votre site et vos concurrents, et on vous dit quoi faire en priorité.")}
${others(t.slug)}
` + foot;
}

/* ── 3. Calculateur d'automatisation ── */
const TASKS = [
  ['devis', 'Rédiger et envoyer des devis', 'Chiffrage, mise en forme, envoi', 3],
  ['saisie', 'Ressaisir des commandes ou des données', "D'un e-mail, PDF ou tableur vers un logiciel", 4],
  ['relances', 'Relancer devis et factures impayées', 'E-mails, appels, suivi', 2],
  ['rdv', 'Gérer les rendez-vous et rappels', 'Appels, messages, confirmations', 3],
  ['docs', 'Classer et chercher des documents', 'Pièces clients, justificatifs', 2],
  ['reporting', 'Préparer des tableaux de suivi', 'Exports, copier-coller, calculs', 2],
  ['questions', 'Répondre aux mêmes questions', 'Horaires, tarifs, disponibilité', 2],
  ['factures', 'Établir les factures', 'Après chaque prestation ou commande', 2]
];
function calc() {
  const t = TOOLS[2];
  const faq = [
    { q: 'Pourquoi 60 % et pas 100 % ?', a: "Parce qu'une automatisation honnête laisse à l'humain la décision et les cas particuliers. 60 % est une hypothèse prudente ; sur certaines tâches très répétitives (relances, saisie), le taux réel est souvent plus élevé." },
    { q: 'Combien coûte une automatisation ?', a: "Ça dépend de la tâche, mais on part toujours du gain calculé ici : on ne propose que ce qui se rembourse nettement. Notre devise : nous gagnons de l'argent uniquement si vous en gagnez." },
    { q: 'Mes réponses sont-elles envoyées quelque part ?', a: "Non, le calcul se fait dans votre navigateur. Vous pouvez choisir de nous transmettre le résultat via le formulaire pour en discuter." },
    { q: 'Et si je ne sais pas combien de temps je passe sur chaque tâche ?', a: "Gardez les valeurs par défaut, elles correspondent à ce qu'on observe souvent dans les petites entreprises. Lors de l'appel, on affine ensemble." }
  ];
  const { url, jsonld } = ld(t, faq);
  return head({ title: t.title, desc: t.desc, url, jsonld }) + hero(t, 'Outil gratuit · 1 minute') + `
  <section class="sec" style="padding-top:10px"><div class="wrap">
    <div class="tool reveal" id="calcTool"><div class="toolGrid">
      <div class="toolIn">
        <fieldset class="fs"><legend>1. Vos tâches répétitives (heures par semaine, toute l'équipe)</legend>
${TASKS.map(([k, l, s, h], i) => `          <div class="task"><input type="checkbox" id="t-${k}" data-k="${k}"${i < 4 ? ' checked' : ''} /><label for="t-${k}">${esc(l)}<small>${esc(s)}</small></label><input type="number" min="0" max="80" step="0.5" value="${h}" aria-label="Heures par semaine — ${esc(l)}" data-h="${k}" /></div>`).join('\n')}
        </fieldset>
        <fieldset class="fs range"><legend>2. Coût horaire chargé moyen</legend><label>Coût horaire <b id="rateOut">35 €</b><input type="range" id="rate" min="15" max="150" step="5" value="35" /></label></fieldset>
      </div>
      <aside class="toolOut" aria-live="polite">
        <span class="lbl">Coût annuel de ces tâches</span>
        <div class="big" id="calcCost">—</div>
        <span class="lbl" id="calcHours"></span>
        <ul>
          <li id="calcSaved"></li>
          <li id="calcDays"></li>
          <li id="calcTop"></li>
        </ul>
        <a class="btn" href="#contact" id="calcCta">Voir ce qu'on peut automatiser →</a>
        <span class="lbl">Hypothèse : 60 % automatisable, 45 semaines/an.</span>
      </aside>
    </div></div>
  </div></section>
${faqBlock(faq)}
${express(t.slug, 'Transformez ce chiffre en plan d’action', "Votre calcul est joint automatiquement. En 10 minutes d'appel, on identifie la première automatisation à mettre en place et ce qu'elle vous rapportera.")}
${others(t.slug)}
` + foot;
}

/* ── Index ── */
function index() {
  const url = `${HOLDING}/${DIR}/`;
  const title = 'Outils gratuits pour entreprises : prix de site, visibilité Google, automatisation | Groupe Solution';
  const desc = "Trois outils gratuits et sans inscription : simulateur de prix de site internet, test de visibilité Google et calculateur du coût de vos tâches répétitives.";
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: 'Outils gratuits Groupe Solution', url, description: desc, hasPart: TOOLS.map(t => ({ '@type': 'WebApplication', name: t.name, url: `${HOLDING}/${DIR}/${t.slug}.html` })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Outils gratuits', item: url }] }] };
  return head({ title, desc, url, jsonld }) + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <span>Outils gratuits</span></div>
  <section class="hero" style="padding-bottom:30px"><div class="wrap" style="max-width:820px;text-align:center">
    <div class="kicker reveal">Gratuit · sans inscription</div>
    <h1 class="reveal">Trois outils pour y voir clair, en quelques minutes.</h1>
    <p class="lead reveal" style="margin-left:auto;margin-right:auto">Avant de parler à qui que ce soit, faites le point vous-même : combien coûterait votre site, êtes-vous visible sur Google, combien vous coûtent vos tâches répétitives.</p>
  </div></section>
  <section class="sec" style="padding-top:20px"><div class="wrap">
    <div class="toolsGrid">${TOOLS.map(t => `
      <a class="toolCard reveal" href="${t.slug}.html"><div class="ic">${t.icon}</div><h2>${esc(t.name)}</h2><p>${esc(t.lead)}</p><span class="go">Essayer →</span></a>`).join('')}
    </div>
  </div></section>
${express('index', 'Une question plus précise ?', 'Décrivez votre situation en deux phrases, je vous réponds sous 24 h.')}
` + foot;
}

writeFileSync(join(ROOT, DIR, 'prix-site-internet.html'), prix(), 'utf8');
writeFileSync(join(ROOT, DIR, 'test-visibilite-google.html'), test(), 'utf8');
writeFileSync(join(ROOT, DIR, 'calculateur-automatisation.html'), calc(), 'utf8');
writeFileSync(join(ROOT, DIR, 'index.html'), index(), 'utf8');
console.log('✓ 3 outils + index générés dans /outils/');
