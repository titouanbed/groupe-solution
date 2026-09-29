/* ═══════════════════════════════════════════════════════════
   Pages PILIERS nationales « services » (non géographiques).
   Produit : /services/{slug}.html (8 pages) + /services/index.html
   Charte : ../assets/holding-local.css + typo d'article inline.

   Lancer :  node zones/generate-services.mjs

   Règles de contenu : aucun prix, aucun client cité, aucune
   statistique inventée. Tout est « sur devis, gratuit et personnalisé ».
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'services');
const SITE = 'https://www.groupsolution.fr';
const BASE = `${SITE}/services/`;
const OG_IMAGE = `${SITE}/assets/visuel-solutions.jpg`;
const TEL = 'tel:+33782298559';
const TEL_TXT = '07 82 29 85 59';
const RDV = 'https://www.groupsolution.fr/echanger.html#rendez-vous';
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap" rel="stylesheet" />';

/* ── Les 8 services (cartes, maillage, index) ─────────────── */
const SERVICES = [
  { slug: 'creation-site-internet', name: 'Création de site internet', blurb: 'Site vitrine, réservation, e-commerce ou plateforme : un site professionnel conçu pour être trouvé et pour faire appeler.' },
  { slug: 'agence-ia-entreprise', name: 'Intégrer l’IA en entreprise', blurb: 'Cas d’usage utiles, données maîtrisées, AI Act, souveraineté : l’intelligence artificielle appliquée à votre activité réelle.' },
  { slug: 'automatisation-processus', name: 'Automatisation des processus', blurb: 'Devis, commandes, relances, documents, reporting : les tâches répétitives prises en charge par des systèmes fiables.' },
  { slug: 'logiciel-sur-mesure', name: 'Logiciel sur-mesure', blurb: 'Une application métier construite autour de votre façon de travailler, dont vous restez propriétaire.' },
  { slug: 'agent-ia-chatbot', name: 'Agent IA et chatbot', blurb: 'Assistant client multilingue, assistant interne sur vos documents, agents qui agissent dans vos outils, avec garde-fous.' },
  { slug: 'agent-vocal-ia', name: 'Agent vocal IA', blurb: 'Un standard téléphonique intelligent qui décroche, prend les rendez-vous, transfère et résume chaque appel.' },
  { slug: 'integration-api-connecteurs', name: 'Intégration d’API', blurb: 'CRM, ERP, agenda, comptabilité, e-commerce, données publiques : vos outils connectés, sans double saisie.' },
  { slug: 'referencement-local', name: 'Référencement local', blurb: 'Fiche Google Business Profile, avis, pages locales honnêtes, données structurées : être trouvé près de chez vos clients.' },
];

/* ── Ressources internes (toutes existantes) ──────────────── */
const METIERS = {
  restaurant: 'Restaurant', artisan: 'Artisan du bâtiment', 'professionnel-de-sante': 'Professionnel de santé',
  avocat: 'Avocat', 'expert-comptable': 'Expert-comptable', 'agence-immobiliere': 'Agence immobilière',
  'coiffeur-esthetique': 'Coiffeur et esthétique', 'coach-salle-de-sport': 'Coach et salle de sport',
  'hebergement-gite': 'Hébergement et gîte', 'domaine-viticole': 'Domaine viticole',
  'commerce-boutique': 'Commerce et boutique', 'garage-automobile': 'Garage automobile',
  'organisme-de-formation': 'Organisme de formation', 'services-a-domicile': 'Services à domicile',
};
const VEILLE = {
  'mcp-model-context-protocol': 'MCP : connecter l’IA à vos outils',
  'agents-ia-computer-use': 'Agents IA et portails sans API',
  'agents-vocaux-ia': 'Agents vocaux IA au téléphone',
  'facturation-electronique-2026': 'Facturation électronique 2026-2027',
  'ai-act-pme': 'AI Act : ce qu’une PME doit savoir',
  'open-data-api-gouv': 'Open data et API publiques',
  'rag-assistant-documents': 'Assistant IA sur vos documents (RAG)',
  'ia-vision-documents': 'Lire factures et bons avec l’IA',
};
const GUIDES = {
  'prix-site-internet-montpellier': 'Prix d’un site internet : lire un devis',
  'apparaitre-google-maps-montpellier': 'Apparaître en haut de Google Maps',
  'automatiser-devis-artisan': 'Automatiser ses devis quand on est artisan',
  'obligations-legales-site-internet': 'Obligations légales d’un site pro',
  'relances-factures-impayees-automatiques': 'Relancer ses factures impayées automatiquement',
  'choisir-agence-web-montpellier': 'Choisir son agence web : 12 questions à poser',
};
const OUTILS = {
  'configurateur-site-internet': 'Configurateur de projet web et IA',
  'test-visibilite-google': 'Test de visibilité Google',
  'calculateur-automatisation': 'Calculateur de tâches répétitives',
};

/* ── Raccourcis de liens utilisables dans les contenus ─────── */
const svc = (slug, text) => `<a href="${slug}.html">${text}</a>`;
const veille = (slug, text) => `<a href="../lab/veille/${slug}.html">${text || VEILLE[slug]}</a>`;
const guide = (slug, text) => `<a href="../montpellier/guides/${slug}.html">${text || GUIDES[slug]}</a>`;
const outil = (slug, text) => `<a href="../outils/${slug}.html">${text || OUTILS[slug]}</a>`;
const metier = (slug, text) => `<a href="../montpellier/site-internet-${slug}-montpellier.html">${text || METIERS[slug]}</a>`;
const HUB = (text = 'automatisation et logiciel sur-mesure') => `<a href="../automatisation/">${text}</a>`;
const SITEMTP = (text = 'création de site internet à Montpellier') => `<a href="../montpellier/site-internet-montpellier.html">${text}</a>`;

/* ── Composants de contenu ────────────────────────────────── */
const keep = (items, title = 'À retenir') =>
  `<aside class="keep"><p class="keepT">${title}</p><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></aside>`;

const table = (caption, head, rows) =>
  `<div class="tbl"><table><caption>${caption}</caption><thead><tr>${head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

const ctaBox = (title, text) =>
  `<aside class="ctaBox"><p class="ctaT">${title}</p><p>${text}</p><div class="ctaBtns"><a class="btn" href="${TEL}">Appeler le ${TEL_TXT}</a><a class="btn dark" href="#contact">Formulaire express</a><a class="btn ghost" href="${RDV}">Réserver 10 min en visio</a></div></aside>`;

const ul = items => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
const ol = items => `<ol>${items.map(i => `<li>${i}</li>`).join('')}</ol>`;

const PAGES = [];

/* ═══════════════════════ 1. CRÉATION DE SITE INTERNET ═══════════════════════ */
PAGES.push({
  slug: 'creation-site-internet',
  title: 'Création de site internet professionnel | Groupe Solution',
  desc: 'Création de site internet professionnel : vitrine, réservation, e-commerce ou plateforme. Méthode, référencement intégré, propriété du site. Devis gratuit.',
  crumb: 'Création de site internet',
  kicker: 'Site vitrine · réservation · e-commerce · plateforme',
  h1: 'Création de site internet professionnel : <em>un site qui travaille pour vous</em>.',
  lead: 'Un site web professionnel n’est pas une plaquette en ligne : c’est l’outil qui fait appeler, réserver ou acheter. Voici comment nous concevons des sites internet pour les TPE et PME — et tout ce qu’il faut savoir avant de lancer le vôtre.',
  serviceName: 'Création de site internet professionnel',
  serviceType: 'Création de site internet',
  sections: [
    { id: 'pourquoi', h2: 'Pourquoi créer un site internet professionnel aujourd’hui ?', html: `
<p>Avant d’appeler une entreprise, la plupart des gens la cherchent en ligne. Ils veulent vérifier qu’elle existe, qu’elle fait bien ce qu’ils cherchent, qu’elle intervient chez eux et qu’elle inspire confiance. Un réseau social ou une fiche Google aident, mais ils ne remplacent pas un <strong>site internet professionnel</strong> que vous contrôlez : c’est le seul endroit où vous choisissez le message, l’ordre des informations et la façon dont on vous contacte.</p>
<p>La création d’un site web n’a donc de sens que si l’on part de cette question : <em>qu’est-ce que le visiteur doit faire en arrivant ?</em> Appeler, demander un devis, réserver une table, prendre rendez-vous, acheter, s’inscrire. Tout le reste — le design, la technique, le référencement — sert cet objectif. C’est ce qui distingue un site qui rapporte d’un site qui se contente d’exister.</p>` },
    { id: 'types', h2: 'Site vitrine, réservation, e-commerce ou plateforme : quel site choisir ?', html: `
<p>On parle souvent de « site vitrine » par défaut. En réalité, il existe plusieurs familles de sites, et le bon choix dépend de ce que vous vendez et de la façon dont vos clients passent à l’action.</p>
${table('Types de sites internet : quand les choisir et leurs limites', ['Type de site', 'Quand le choisir', 'Limites à connaître'], [
  ['Site vitrine', 'Vous vendez un service sur devis ou en direct (artisan, cabinet, commerce de proximité). Objectif : faire appeler ou écrire.', 'Ne prend pas de paiement ; son efficacité dépend beaucoup de la clarté des pages et du référencement.'],
  ['Site avec réservation', 'Votre activité fonctionne sur créneaux (restaurant, soins, coaching, hébergement, location).', 'Il faut synchroniser l’agenda ou le planning existant pour éviter les doubles réservations.'],
  ['Site e-commerce', 'Vous vendez des produits ou des prestations standardisées payables en ligne.', 'Demande un catalogue tenu à jour, une logistique, des conditions générales de vente et un suivi régulier.'],
  ['Plateforme ou portail', 'Vous mettez en relation plusieurs publics, gérez des comptes utilisateurs ou beaucoup de données.', 'Projet plus long, qui relève du ' + '<a href="logiciel-sur-mesure.html">logiciel sur-mesure</a>' + ' ; il se construit par étapes.'],
])}
<p>Ces formats se combinent : un site vitrine peut intégrer une prise de rendez-vous, un site e-commerce peut accueillir un espace client. Le groupe exploite lui-même des plateformes en production — Solution Recrutement (plus de 565 000 offres), Solution Alternance (plus de 200 000 offres avec matching par IA) et Aides Particuliers — ce qui nous permet d’accompagner un projet du simple site vitrine jusqu’au portail à fort volume.</p>` },
    { id: 'rapporte', h2: 'Ce qui fait un site web qui rapporte', html: `
<h3>Un message compris en quelques secondes</h3>
<p>Le haut de la page d’accueil doit dire, sans jargon, ce que vous faites, pour qui et où. « Plombier chauffagiste, dépannage et rénovation de salle de bain » est plus utile qu’un slogan abstrait. Le visiteur doit savoir immédiatement qu’il est au bon endroit.</p>
<h3>Des appels à l’action visibles partout</h3>
<p>Numéro de téléphone cliquable sur mobile, formulaire court, bouton de réservation : l’action principale doit être accessible sans chercher. Un formulaire de trois ou quatre champs obtient en général plus de demandes qu’un formulaire de quinze questions.</p>
<h3>Rapide, lisible et pensé pour le mobile</h3>
<p>Une grande partie des visites se fait sur smartphone, souvent en situation (dans la rue, entre deux rendez-vous). Un site léger, qui s’affiche vite et reste lisible au pouce, est une condition de base, pas une option.</p>
<h3>Des preuves plutôt que des promesses</h3>
<p>Photos réelles de votre travail, avis clients authentiques, zone d’intervention claire, informations pratiques à jour : ce sont ces éléments concrets qui rassurent. Les superlatifs (« le meilleur », « n°1 ») convainquent rarement.</p>
<h3>Des pages qui répondent aux vraies questions</h3>
<p>Chaque service important mérite sa page : ce que vous faites, comment, en combien de temps, sous quelles conditions. Ces pages servent à la fois le visiteur et le référencement.</p>
${keep(['Un site professionnel se juge au nombre de demandes qu’il génère, pas seulement à son apparence.', 'Téléphone cliquable, formulaire court et réservation doivent être visibles sur mobile.', 'Les preuves concrètes (photos, avis, informations pratiques) comptent plus que les slogans.'])}` },
    { id: 'seo', h2: 'Le référencement naturel intégré dès la conception', html: `
<p>Le référencement (SEO) ne s’ajoute pas « après » : il se décide au moment où l’on définit l’arborescence du site. Concrètement, un site bien conçu pour Google et pour les moteurs de réponse par IA comprend :</p>
${ul([
  'une <strong>structure claire</strong> : une page par service ou par famille de produits, avec un titre et une description uniques ;',
  'des <strong>balises propres</strong> (titres hiérarchisés, textes alternatifs des images, adresses de pages lisibles) ;',
  'des <strong>données structurées</strong> (schema.org) qui décrivent votre entreprise, vos services et vos questions fréquentes ;',
  'des <strong>performances soignées</strong> : images compressées, code léger, affichage rapide ;',
  'une cohérence avec votre <strong>fiche Google Business Profile</strong> si vous avez une clientèle locale — voir notre page ' + svc('referencement-local', 'référencement local') + '.',
])}
<p>Pour savoir où vous en êtes aujourd’hui, notre ${outil('test-visibilite-google')} donne une première lecture gratuite de votre présence sur Google.</p>` },
    { id: 'methode', h2: 'Notre méthode de création de site web, étape par étape', html: `
${ol([
  '<strong>Un échange de 10 minutes</strong> pour comprendre votre activité, vos clients et ce que le site doit produire.',
  '<strong>Un cadrage écrit</strong> : pages, fonctionnalités, contenus à fournir, intégrations (agenda, paiement, CRM), calendrier.',
  '<strong>Une maquette</strong> de la page d’accueil et d’une page type, validée avec vous avant tout développement.',
  '<strong>Le développement</strong>, avec un site de prévisualisation que vous pouvez consulter à chaque étape.',
  '<strong>Les contenus</strong> : nous vous aidons à rédiger et structurer les textes pour qu’ils soient clairs et bien référencés.',
  '<strong>La mise en ligne</strong> : nom de domaine, sécurité (HTTPS), redirections si vous remplacez un ancien site, déclaration à Google.',
  '<strong>Le suivi</strong> : mesure des demandes reçues, ajustements, évolutions selon vos besoins.',
])}
<p>Le délai dépend surtout de la taille du site et de la disponibilité des contenus : en général quelques semaines pour un site vitrine, davantage pour une boutique ou une plateforme. Nous vous donnons un calendrier précis dans la proposition. Pour préparer le projet, le ${outil('configurateur-site-internet')} vous aide à formaliser votre besoin en deux minutes.</p>` },
    { id: 'propriete', h2: 'À qui appartient votre site internet ?', html: `
<p>C’est la question que beaucoup de dirigeants oublient de poser — et qui coûte cher le jour où l’on veut changer de prestataire. Avant de signer, vérifiez :</p>
${ul([
  'que le <strong>nom de domaine</strong> est enregistré à votre nom (ou à celui de votre entreprise) ;',
  'que vous disposez des <strong>accès administrateur</strong> au site, à l’hébergement et aux outils de mesure ;',
  'que les <strong>contenus</strong> (textes, photos que vous avez fournies ou payées) vous appartiennent ;',
  'ce que devient le <strong>code</strong> et s’il peut être repris par un autre prestataire ;',
  'les conditions de sortie si vous arrêtez un abonnement.',
])}
<p>Quel que soit le prestataire, exigez que ces points figurent par écrit dans la proposition. Notre guide ${guide('choisir-agence-web-montpellier')} détaille les autres questions utiles.</p>
${keep(['Le nom de domaine doit être à votre nom.', 'Demandez noir sur blanc ce qui vous appartient et comment récupérer votre site.'])}` },
    { id: 'legal', h2: 'Obligations légales, accessibilité et sécurité', html: `
<p>Un site professionnel doit afficher des mentions légales, informer sur l’usage des cookies et recueillir le consentement lorsqu’il est requis, et respecter le RGPD pour les données collectées par les formulaires. Un site marchand ajoute des conditions générales de vente et les informations précontractuelles prévues par le Code de la consommation. Depuis juin 2025, certaines exigences d’accessibilité issues de la directive européenne sur l’accessibilité s’appliquent aussi à de nombreux services en ligne, notamment de commerce électronique (avec des exemptions pour les microentreprises de services). Le détail est dans notre guide ${guide('obligations-legales-site-internet')}.</p>
<p>Côté sécurité : certificat HTTPS, mises à jour, sauvegardes, protection des formulaires contre le spam. Ce sont des tâches invisibles mais indispensables, à prévoir dans le suivi.</p>` },
    { id: 'choisir', h2: 'Agence web, freelance ou outil en ligne : comment choisir ?', html: `
<p>Les créateurs de sites en ligne conviennent à un besoin simple si vous avez le temps de vous en occuper vous-même. Un freelance peut être un excellent choix pour un projet bien délimité. Une agence web ou un éditeur comme Groupe Solution se justifie lorsque le site doit s’intégrer à d’autres outils (agenda, CRM, facturation), évoluer vers de l’${svc('automatisation-processus', 'automatisation')} ou accueillir un ${svc('agent-ia-chatbot', 'assistant IA')}, ou lorsque vous voulez un interlocuteur unique sur la durée.</p>
<p>Quant au budget, il n’existe pas de « prix standard » honnête : tout dépend du nombre de pages, des fonctionnalités, des intégrations et des contenus. Nos devis sont gratuits et personnalisés ; notre guide ${guide('prix-site-internet-montpellier')} explique comment comparer des propositions.</p>` },
  ],
  ctaAfter: 3,
  ctaTitle: 'Un projet de site ? Parlons-en 10 minutes.',
  ctaText: 'Vous repartez avec des recommandations concrètes, même si vous ne travaillez pas avec nous. Devis gratuit et personnalisé.',
  faq: [
    { q: 'Combien coûte la création d’un site internet professionnel ?', a: 'Il n’existe pas de prix unique : le coût dépend du nombre de pages, des fonctionnalités (réservation, paiement, espace client), des intégrations avec vos outils et de la prise en charge des contenus. Chez Groupe Solution, chaque projet fait l’objet d’un devis gratuit et personnalisé, établi après un court échange.' },
    { q: 'Comment créer un site internet pour son entreprise ?', a: 'Commencez par définir ce que le visiteur doit faire (appeler, réserver, acheter), listez vos services et vos questions clients, puis choisissez le type de site adapté. Un prestataire vous accompagne ensuite sur la maquette, le développement, les contenus, la mise en ligne et le référencement.' },
    { q: 'Quelle différence entre un site vitrine et un site e-commerce ?', a: 'Un site vitrine présente votre activité et génère des contacts (appels, demandes de devis). Un site e-commerce permet de vendre et d’encaisser en ligne ; il demande un catalogue à jour, une logistique et des conditions générales de vente.' },
    { q: 'Combien de temps faut-il pour créer un site web ?', a: 'En général quelques semaines pour un site vitrine, davantage pour une boutique en ligne ou une plateforme. Le facteur qui fait le plus varier le délai est la disponibilité des contenus (textes, photos). Un calendrier précis figure dans la proposition.' },
    { q: 'Agence web ou freelance pour créer mon site ?', a: 'Un freelance convient bien à un projet délimité. Une agence ou un éditeur se justifie quand le site doit se connecter à d’autres outils, évoluer vers l’automatisation ou l’IA, ou quand vous voulez un interlocuteur unique dans la durée. Dans tous les cas, vérifiez la propriété du site et le suivi proposé.' },
    { q: 'Suis-je propriétaire de mon site internet ?', a: 'Vous devriez l’être : exigez que le nom de domaine soit à votre nom, que vous ayez les accès administrateur et que la propriété des contenus et les conditions de récupération du site soient écrites dans le contrat. Chez Groupe Solution, ces points sont précisés par écrit dans chaque proposition.' },
  ],
  metiers: ['restaurant', 'artisan', 'professionnel-de-sante', 'commerce-boutique', 'hebergement-gite'],
  veille: ['ai-act-pme', 'facturation-electronique-2026'],
  guides: ['prix-site-internet-montpellier', 'obligations-legales-site-internet', 'choisir-agence-web-montpellier', 'apparaitre-google-maps-montpellier'],
  form: { h2: 'Parlez-nous de votre projet de site', p: 'Deux phrases suffisent. Je vous réponds avec une première recommandation concrète — gratuitement, sans engagement.', ph: 'Ex : je suis artisan, je veux un site qui fasse appeler et qui présente mes chantiers…', btn: 'Recevoir ma recommandation →', label: 'Votre projet de site' },
});

/* ═══════════════════════ 2. AGENCE IA ═══════════════════════ */
PAGES.push({
  slug: 'agence-ia-entreprise',
  title: 'Agence IA : intégrer l’IA en entreprise | Groupe Solution',
  desc: 'Agence IA pour TPE et PME : cas d’usage concrets, méthode, données, AI Act, souveraineté et choix des modèles pour intégrer l’IA en entreprise. Devis gratuit.',
  crumb: 'Agence IA',
  kicker: 'Intelligence artificielle · cas d’usage · AI Act · souveraineté',
  h1: 'Agence IA : intégrer l’intelligence artificielle <em>dans votre entreprise</em>.',
  lead: 'L’IA est utile quand elle résout un problème précis, sur vos données, avec un contrôle humain là où il faut. Voici comment nous intégrons l’intelligence artificielle dans les TPE et PME — cas d’usage, méthode, données, réglementation et choix des modèles.',
  serviceName: 'Intégration de l’intelligence artificielle en entreprise',
  serviceType: 'Conseil et intégration en intelligence artificielle',
  sections: [
    { id: 'definition', h2: 'Intégrer l’IA en entreprise : de quoi parle-t-on vraiment ?', html: `
<p>Derrière le mot « IA » se cachent des technologies différentes. Les <strong>modèles de langage</strong> comprennent et rédigent du texte ; les <strong>modèles de vision</strong> lisent des documents, des photos ou des plans ; les <strong>modèles vocaux</strong> transcrivent et parlent ; les <strong>modèles de prévision</strong> anticipent des volumes ou des ventes. Une agence IA sérieuse commence par choisir la bonne brique pour le bon problème — et reconnaît quand une simple règle ou un tableur fera mieux l’affaire.</p>
<p>Intégrer l’intelligence artificielle dans une entreprise, ce n’est pas « installer ChatGPT ». C’est brancher un modèle sur vos données, vos outils et vos processus, avec des règles claires : ce qu’il a le droit de faire, ce qu’il doit faire valider, et comment on vérifie qu’il se trompe peu.</p>` },
    { id: 'cas', h2: 'Les cas d’usage de l’IA qui fonctionnent en TPE et PME', html: `
<p>Les projets qui réussissent ont un point commun : une tâche fréquente, bien identifiée, dont on peut mesurer le résultat. Quelques exemples typiques :</p>
${table('Cas d’usage de l’IA en entreprise et niveau de contrôle recommandé', ['Cas d’usage', 'Ce que fait l’IA', 'Contrôle humain recommandé'], [
  ['Lecture de documents', 'Extrait les données de factures, bons de commande, bons de livraison, formulaires scannés.', 'Validation des champs incertains ; contrôle par échantillon.'],
  ['Assistant sur vos documents (RAG)', 'Répond aux questions de l’équipe en citant la procédure ou le contrat source.', 'Sources affichées ; droits d’accès respectés.'],
  ['Réponses aux clients', 'Répond en plusieurs langues aux questions fréquentes, qualifie la demande.', 'Transfert vers un humain dès que la demande sort du périmètre.'],
  ['Rédaction assistée', 'Prépare devis, courriers, fiches produits, comptes rendus.', 'Relecture systématique avant envoi.'],
  ['Tri et routage', 'Classe les e-mails et demandes entrantes, détecte l’urgence.', 'Revue régulière des erreurs de classement.'],
  ['Téléphone', 'Un agent vocal décroche, prend les rendez-vous, résume l’appel.', 'Transfert des urgences ; information de l’appelant.'],
])}
<p>Chacun de ces cas a sa page dédiée : ${svc('agent-ia-chatbot', 'agents IA et chatbots')}, ${svc('agent-vocal-ia', 'agent vocal IA')}, ${svc('automatisation-processus', 'automatisation des processus')}. Pour la lecture de documents, notre article ${veille('ia-vision-documents')} décrit l’état de l’art ; pour l’assistant interne, voir ${veille('rag-assistant-documents')}.</p>
${keep(['Les meilleurs projets IA partent d’une tâche fréquente et mesurable.', 'Plus l’erreur coûte cher, plus la validation humaine doit être présente.'])}` },
    { id: 'methode', h2: 'Notre méthode : partir d’un problème, pas d’une technologie', html: `
${ol([
  '<strong>Diagnostic</strong> : en un échange, nous identifions les tâches qui mobilisent le plus de temps ou génèrent le plus d’erreurs.',
  '<strong>Prototype sur vos données réelles</strong> : quelques dizaines de documents ou de conversations suffisent souvent à savoir si l’approche tient la route.',
  '<strong>Mesure</strong> : taux de bonnes réponses, cas d’échec, temps gagné. On décide sur des faits.',
  '<strong>Mise en production</strong> : intégration dans vos outils, journalisation, alertes, procédure de reprise en main par un humain.',
  '<strong>Formation et suivi</strong> : votre équipe apprend à utiliser l’outil, à en connaître les limites et à signaler les erreurs.',
])}
<p>Cette démarche progressive évite l’écueil classique du « grand projet IA » qui ne sort jamais du stade de la démonstration. Elle permet aussi d’arrêter tôt si l’IA n’apporte pas assez — ce que nous vous dirons franchement.</p>` },
    { id: 'donnees', h2: 'Vos données : le vrai carburant de l’IA, et le vrai risque', html: `
<p>Un modèle d’IA ne vaut que par les données qu’on lui donne. Des procédures obsolètes, des tarifs contradictoires ou des fiches incomplètes produiront des réponses fausses, même avec le meilleur modèle du marché. Une partie du travail consiste donc à <strong>identifier les sources de référence</strong> et à les tenir à jour.</p>
<p>Côté protection, plusieurs règles s’imposent :</p>
${ul([
  '<strong>Minimiser</strong> : n’envoyer au modèle que ce qui est nécessaire à la tâche ;',
  '<strong>Respecter les droits d’accès</strong> : un assistant interne ne doit pas révéler à un salarié un document qu’il ne pourrait pas ouvrir ;',
  '<strong>Vérifier les conditions du fournisseur</strong> : utilisation ou non de vos données pour l’entraînement, durée de conservation, localisation des serveurs ;',
  '<strong>Appliquer le RGPD</strong> dès que des données personnelles sont traitées : base légale, information des personnes, registre des traitements ;',
  '<strong>Journaliser</strong> les échanges pour pouvoir analyser une erreur et l’expliquer.',
])}` },
    { id: 'ai-act', h2: 'AI Act : ce qui s’applique concrètement à une PME', html: `
<p>Le règlement européen sur l’intelligence artificielle (AI Act) s’applique par étapes. Pour la grande majorité des TPE et PME qui utilisent des outils d’IA, trois points comptent :</p>
${ul([
  '<strong>La maîtrise de l’IA (article 4)</strong>, applicable depuis le 2 février 2025 : les personnes qui utilisent des systèmes d’IA pour le compte de l’entreprise doivent disposer d’un niveau suffisant de compréhension de ces outils.',
  '<strong>La transparence (article 50)</strong>, applicable depuis le 2 août 2026 : une personne qui échange avec un chatbot ou un agent vocal doit en être informée, sauf si c’est évident.',
  '<strong>Les pratiques interdites</strong>, applicables depuis le 2 février 2025, qui concernent des usages très spécifiques (manipulation, notation sociale, certaines formes de reconnaissance des émotions au travail…).',
])}
<p>Les obligations des systèmes dits « à haut risque » (recrutement, crédit, éducation…) ont été reportées par le règlement « omnibus IA » de juillet 2026. Notre article ${veille('ai-act-pme')} détaille le calendrier à jour. Nous intégrons ces exigences dès la conception : mention de l’IA, documentation, contrôle humain.</p>` },
    { id: 'souverainete', h2: 'Souveraineté et hébergement des données', html: `
<p>Toutes les entreprises n’ont pas les mêmes contraintes. Un cabinet qui traite des données sensibles n’a pas le même niveau d’exigence qu’un commerce qui veut répondre plus vite aux questions sur ses horaires. Plusieurs options existent :</p>
${ul([
  'utiliser un grand fournisseur de modèles via une offre entreprise, avec des engagements contractuels sur les données ;',
  'privilégier un <strong>fournisseur européen</strong> (Mistral AI, par exemple) ou un hébergement dans l’Union européenne ;',
  '<strong>héberger un modèle ouvert</strong> (« open-weight ») sur une infrastructure que vous maîtrisez, lorsque la confidentialité prime.',
])}
<p>Il faut aussi tenir compte des lois extraterritoriales auxquelles certains fournisseurs sont soumis. Nous vous présentons les compromis de chaque option — qualité, coût d’exploitation, confidentialité — plutôt qu’une solution unique.</p>` },
    { id: 'modeles', h2: 'Comment choisir le bon modèle d’IA ?', html: `
${table('Choisir un modèle d’IA : options, usages et limites', ['Option', 'Quand la choisir', 'Limites'], [
  ['Grands modèles généralistes via API', 'Tâches de compréhension ou de rédaction complexes, plusieurs langues, raisonnement.', 'Dépendance à un fournisseur ; coût à l’usage ; conditions à vérifier sur les données.'],
  ['Modèles européens', 'Besoin de souveraineté ou de fournisseur soumis au droit européen.', 'Choix plus restreint selon les tâches ; à tester sur vos cas réels.'],
  ['Modèles ouverts auto-hébergés', 'Données très sensibles, volumes élevés et réguliers.', 'Infrastructure à gérer ; performances variables selon la taille du modèle.'],
  ['Petits modèles spécialisés', 'Tâches répétitives et bien cadrées (classement, extraction).', 'Moins polyvalents ; demandent parfois un ajustement.'],
])}
<p>Les modèles évoluent très vite. C’est pourquoi nous concevons les intégrations pour pouvoir <strong>changer de modèle sans tout reconstruire</strong>, et nous comparons les options sur vos propres exemples avant de trancher. Pour connecter l’IA à vos logiciels, les standards comme le protocole MCP facilitent cette indépendance : voir ${veille('mcp-model-context-protocol')}.</p>
${keep(['Le meilleur modèle est celui qui réussit vos cas réels au coût le plus raisonnable.', 'Une architecture qui permet de changer de modèle protège votre investissement.'])}` },
    { id: 'partenaire', h2: 'Agence IA : comment reconnaître un bon partenaire ?', html: `
<p>Quelques questions simples permettent de trier les propositions : l’agence vous montre-t-elle un prototype sur vos données avant un engagement important ? Explique-t-elle ce qui se passe quand l’IA se trompe ? Vous dit-elle où sont hébergées vos données ? Pouvez-vous changer de modèle ou de prestataire ? Et surtout : accepte-t-elle de vous dire qu’un projet ne vaut pas la peine ?</p>
<p>Groupe Solution est un éditeur de logiciels : nous exploitons nous-mêmes des plateformes en production, dont Solution Alternance et son matching par IA sur plus de 200 000 offres. Nous savons ce qu’implique de faire tourner l’IA au quotidien, au-delà de la démonstration. Nos devis sont gratuits et personnalisés.</p>` },
  ],
  ctaAfter: 2,
  ctaTitle: 'Où l’IA peut-elle vous faire gagner du temps ?',
  ctaText: 'En 10 minutes, nous identifions un ou deux cas d’usage réalistes pour votre activité. Sans engagement.',
  faq: [
    { q: 'Comment intégrer l’IA dans une petite entreprise ?', a: 'Partez d’une tâche fréquente et mesurable (lecture de documents, réponses aux questions récurrentes, rédaction de devis), testez un prototype sur vos données réelles, mesurez le résultat, puis intégrez l’outil dans vos logiciels avec un contrôle humain adapté.' },
    { q: 'Qu’est-ce qu’une agence IA ?', a: 'C’est un prestataire qui conçoit et intègre des solutions d’intelligence artificielle dans les processus d’une entreprise : choix des modèles, connexion aux données et aux outils, garde-fous, conformité et suivi. Groupe Solution le fait en tant qu’éditeur de logiciels.' },
    { q: 'Combien coûte l’intégration de l’intelligence artificielle en entreprise ?', a: 'Le coût dépend du cas d’usage, du volume de données, des intégrations nécessaires et du modèle retenu. Nous établissons un devis gratuit et personnalisé après un premier échange et, si besoin, un prototype.' },
    { q: 'L’AI Act concerne-t-il les PME ?', a: 'Oui : l’obligation de maîtrise de l’IA (article 4) s’applique depuis le 2 février 2025 et l’obligation d’informer les personnes qu’elles échangent avec une IA (article 50) depuis le 2 août 2026. Les obligations des systèmes à haut risque ont été reportées par le règlement omnibus IA de juillet 2026.' },
    { q: 'Mes données sont-elles utilisées pour entraîner l’IA ?', a: 'Cela dépend du fournisseur et de l’offre choisie. Les offres professionnelles prévoient généralement des engagements sur ce point, qu’il faut vérifier. Il est aussi possible de choisir un fournisseur européen ou d’héberger un modèle ouvert sur une infrastructure maîtrisée.' },
    { q: 'Quelle IA choisir pour son entreprise : ChatGPT, Mistral ou autre ?', a: 'Il n’y a pas de réponse universelle. Nous comparons plusieurs modèles sur vos propres exemples, en tenant compte de la qualité, du coût, de la confidentialité et de la souveraineté, et nous concevons l’intégration pour pouvoir changer de modèle plus tard.' },
  ],
  metiers: ['expert-comptable', 'avocat', 'professionnel-de-sante', 'organisme-de-formation'],
  veille: ['ai-act-pme', 'rag-assistant-documents', 'ia-vision-documents', 'mcp-model-context-protocol', 'agents-ia-computer-use'],
  guides: ['automatiser-devis-artisan', 'relances-factures-impayees-automatiques'],
  form: { h2: 'Quelle tâche confieriez-vous à l’IA ?', p: 'Décrivez-la en deux phrases. Je vous réponds avec une première piste concrète — gratuitement, sans engagement.', ph: 'Ex : nous recevons des dizaines de bons de commande en PDF à ressaisir chaque semaine…', btn: 'Recevoir ma piste IA →', label: 'La tâche à confier à l’IA' },
});

/* ═══════════════════════ 3. AUTOMATISATION DES PROCESSUS ═══════════════════════ */
PAGES.push({
  slug: 'automatisation-processus',
  title: 'Automatisation des processus métier | Groupe Solution',
  desc: 'Automatisation des processus métier : devis, commandes, relances, documents, reporting. RPA, API ou agents IA, comment choisir quoi automatiser. Devis gratuit.',
  crumb: 'Automatisation des processus',
  kicker: 'Devis · commandes · relances · documents · reporting',
  h1: 'Automatisation des processus métier : <em>moins de ressaisie, plus de temps utile</em>.',
  lead: 'Chaque semaine, des heures partent dans des tâches qui se répètent : copier une commande d’un outil à l’autre, relancer une facture, compiler un tableau. Voici comment automatiser ces processus de façon fiable, quelles technologies choisir et par où commencer.',
  serviceName: 'Automatisation des processus métier',
  serviceType: 'Automatisation des processus',
  sections: [
    { id: 'definition', h2: 'Qu’est-ce que l’automatisation des processus métier ?', html: `
<p>Automatiser un processus, c’est confier à un système les étapes répétitives d’un travail qui suit des règles : recevoir une information, la vérifier, la transformer, la transmettre au bon endroit, prévenir la bonne personne. L’humain garde la décision, la relation client et le traitement des cas particuliers ; la machine absorbe le volume.</p>
<p>On parle aussi d’<strong>automatisation des tâches</strong>, de <strong>workflow automatisé</strong> ou d’<strong>automatisation des flux</strong>. Derrière ces termes, l’objectif est le même : supprimer la double saisie, réduire les oublis et raccourcir les délais, sans bouleverser la façon dont votre équipe travaille.</p>` },
    { id: 'exemples', h2: 'Ce que l’on automatise le plus souvent', html: `
<h3>Les devis</h3>
<p>Une demande arrive par le site ou par e-mail ; le système en extrait les informations, prépare un devis à partir de votre grille, vous le soumet pour validation et l’envoie. Les relances de devis sans réponse partent ensuite automatiquement. Notre guide ${guide('automatiser-devis-artisan')} détaille ce scénario.</p>
<h3>Les commandes</h3>
<p>Une commande reçue sur la boutique en ligne, par e-mail ou via un bon PDF est enregistrée une seule fois, puis transmise au stock, à la préparation et à la facturation, sans ressaisie.</p>
<h3>Les relances</h3>
<p>Factures impayées, documents manquants, rendez-vous à confirmer : des relances graduées, polies et personnalisées, qui s’arrêtent dès que le client a répondu. Voir ${guide('relances-factures-impayees-automatiques')}.</p>
<h3>Les documents</h3>
<p>Lecture automatique des factures fournisseurs, bons de livraison ou formulaires, classement, renommage, archivage ; génération de contrats, attestations ou comptes rendus à partir de modèles.</p>
<h3>Le reporting</h3>
<p>Un tableau de bord qui se met à jour seul à partir de vos outils, et un point hebdomadaire envoyé automatiquement, au lieu d’un tableur reconstruit à la main chaque lundi.</p>` },
    { id: 'technologies', h2: 'RPA, API ou agents IA : trois façons d’automatiser', html: `
<p>Toutes les automatisations ne se construisent pas de la même manière. Le choix de la technique dépend surtout de vos logiciels et de la nature de la tâche.</p>
${table('RPA, API ou agents IA : quand choisir chaque approche', ['Approche', 'Quand la choisir', 'Limites'], [
  ['Intégration par API', 'Vos logiciels proposent une API (la plupart des outils récents). C’est la voie la plus fiable et la plus rapide à l’exécution.', 'Nécessite une API documentée et les droits d’accès ; certaines API sont payantes ou limitées.'],
  ['RPA (robot logiciel)', 'Un logiciel ancien ou un portail n’a pas d’API : le robot reproduit les clics d’un utilisateur.', 'Fragile quand l’interface change ; à réserver aux cas sans alternative.'],
  ['Agent IA', 'La tâche demande de comprendre un texte libre, un document ou une demande ambiguë, puis d’agir.', 'Résultats probabilistes : il faut des garde-fous, une validation humaine sur les cas incertains et un suivi.'],
  ['Outils no-code (Make, Zapier, n8n…)', 'Enchaînements simples entre outils populaires, faible volume.', 'Coûts qui montent avec le volume ; logique difficile à maintenir quand elle se complexifie.'],
])}
<p>En pratique, une bonne automatisation combine souvent ces approches : l’API pour les échanges de données, l’IA pour lire ou comprendre, et un robot uniquement là où rien d’autre n’est possible. Pour approfondir : ${svc('integration-api-connecteurs', 'intégration d’API')}, ${svc('agent-ia-chatbot', 'agents IA')} et notre article ${veille('agents-ia-computer-use')}.</p>
${keep(['Quand une API existe, c’est presque toujours la meilleure option.', 'L’IA sert à comprendre ; les règles et les API servent à exécuter de façon fiable.'])}` },
    { id: 'choisir', h2: 'Comment choisir quoi automatiser en premier ?', html: `
<p>Tout n’est pas bon à automatiser. Une tâche est une bonne candidate si elle coche plusieurs de ces critères :</p>
${ul([
  '<strong>Fréquence</strong> : elle revient chaque jour ou chaque semaine ;',
  '<strong>Règles stables</strong> : on peut expliquer à quelqu’un comment la faire en quelques phrases ;',
  '<strong>Volume</strong> : plusieurs personnes ou plusieurs heures y sont consacrées ;',
  '<strong>Coût de l’erreur</strong> : un oubli ou une faute de frappe a des conséquences (facture non envoyée, commande perdue) ;',
  '<strong>Données disponibles</strong> : l’information existe déjà quelque part sous forme numérique.',
])}
<p>À l’inverse, une tâche rare, très variable ou qui repose sur un jugement subtil gagne rarement à être automatisée entièrement. Un conseil souvent négligé : <strong>simplifier avant d’automatiser</strong>. Automatiser un processus confus ne fait que produire de la confusion plus vite.</p>
<p>Pour chiffrer le temps que vous consacrez aujourd’hui à ces tâches, utilisez notre ${outil('calculateur-automatisation')}.</p>` },
    { id: 'roi', h2: 'Mesurer le retour sur investissement, honnêtement', html: `
<p>Le gain d’une automatisation ne se résume pas aux heures économisées. En général, on observe aussi :</p>
${ul([
  'moins d’erreurs de saisie et d’oublis ;',
  'des délais de réponse plus courts pour vos clients ;',
  'une meilleure visibilité sur l’activité (ce qui est en cours, en retard, à relancer) ;',
  'des collaborateurs libérés des tâches qu’ils apprécient le moins ;',
  'une capacité à absorber plus d’activité sans alourdir l’organisation.',
])}
<p>Pour que ce retour soit réel, il faut le mesurer : temps passé et nombre d’erreurs avant, puis après. Nous définissons ces indicateurs avec vous dès le cadrage. Notre principe : ne proposer que ce qui a de bonnes chances de se rembourser nettement — et vous dire quand ce n’est pas le cas.</p>` },
    { id: 'methode', h2: 'Notre méthode d’automatisation', html: `
${ol([
  '<strong>Cartographier</strong> le processus tel qu’il se passe vraiment, avec la personne qui le fait.',
  '<strong>Simplifier</strong> : supprimer les étapes inutiles avant de les automatiser.',
  '<strong>Prototyper</strong> sur un petit périmètre et des cas réels.',
  '<strong>Garder l’humain dans la boucle</strong> pour les validations importantes et les cas inhabituels.',
  '<strong>Surveiller</strong> : alertes en cas d’échec, journal des actions, reprise manuelle possible.',
  '<strong>Étendre</strong> progressivement à d’autres étapes ou d’autres processus.',
])}
<p>Nos automatisations se branchent sur les outils que vous utilisez déjà. Quand les outils du marché ne suffisent plus, nous développons un ${svc('logiciel-sur-mesure', 'logiciel sur-mesure')} dont vous restez propriétaire.</p>` },
    { id: 'facturation', h2: 'Facturation électronique : une occasion d’automatiser', html: `
<p>La réforme de la facturation électronique en France impose à toutes les entreprises assujetties à la TVA de pouvoir <strong>recevoir</strong> des factures électroniques depuis le 1<sup>er</sup> septembre 2026 ; l’obligation d’<strong>émission</strong> s’appliquera aux PME et micro-entreprises à partir du 1<sup>er</sup> septembre 2027, selon le calendrier en vigueur. Ce changement est l’occasion de revoir toute la chaîne : réception, rapprochement avec les commandes, validation, paiement, relances. Notre article ${veille('facturation-electronique-2026')} fait le point.</p>
${keep(['Commencez par un processus fréquent, stable et coûteux en erreurs.', 'Mesurez avant et après : c’est la seule façon de connaître le vrai gain.', 'Une automatisation doit prévenir quand elle échoue.'])}` },
  ],
  ctaAfter: 2,
  ctaTitle: 'Quelle tâche vous prend le plus de temps ?',
  ctaText: 'En 10 minutes, nous regardons si elle peut être automatisée et comment. Devis gratuit et personnalisé.',
  faq: [
    { q: 'Qu’est-ce que l’automatisation des processus en entreprise ?', a: 'C’est le fait de confier à un système les étapes répétitives d’un travail qui suit des règles (saisie, transfert de données, relances, génération de documents), pour que l’équipe se concentre sur la décision et la relation client.' },
    { q: 'Quelles tâches automatiser en priorité dans une PME ?', a: 'Les tâches fréquentes, aux règles stables, qui mobilisent beaucoup de temps et dont l’erreur coûte cher : devis, saisie des commandes, relances de factures, lecture de documents, reporting. Les tâches rares ou très variables gagnent rarement à être automatisées.' },
    { q: 'Quelle différence entre RPA et automatisation par API ?', a: 'L’automatisation par API fait dialoguer directement les logiciels : elle est rapide et fiable. La RPA reproduit les clics d’un utilisateur sur une interface ; elle sert quand aucune API n’existe, mais elle est plus fragile aux changements d’écran.' },
    { q: 'Combien coûte l’automatisation d’un processus ?', a: 'Cela dépend du nombre d’étapes, des logiciels à connecter et du besoin éventuel d’IA. Nous établissons un devis gratuit et personnalisé après un échange, en partant du temps que la tâche vous coûte aujourd’hui.' },
    { q: 'L’automatisation va-t-elle remplacer mes salariés ?', a: 'Ce n’est pas l’objectif. On retire le volume répétitif (ressaisie, relances, tri) pour que l’équipe se consacre aux tâches à valeur ajoutée. L’humain garde la main sur les validations importantes.' },
    { q: 'Faut-il utiliser Zapier, Make ou un développement sur-mesure ?', a: 'Les outils no-code conviennent aux enchaînements simples et à faible volume. Quand la logique se complexifie, que les volumes augmentent ou que la fiabilité devient critique, un développement sur-mesure est souvent plus robuste et plus maîtrisable. Nous vous recommandons l’option la plus simple qui suffit.' },
  ],
  metiers: ['artisan', 'expert-comptable', 'garage-automobile', 'services-a-domicile', 'agence-immobiliere'],
  veille: ['facturation-electronique-2026', 'ia-vision-documents', 'agents-ia-computer-use', 'open-data-api-gouv'],
  guides: ['automatiser-devis-artisan', 'relances-factures-impayees-automatiques'],
  form: { h2: 'Quelle tâche vous prend le plus de temps ?', p: 'Décrivez-la en deux phrases. Je vous réponds avec une première piste d’automatisation — gratuitement, sans engagement.', ph: 'Ex : je ressaisis chaque commande dans deux logiciels…', btn: 'Recevoir ma piste d’automatisation →', label: 'La tâche répétitive' },
});

/* ═══════════════════════ 4. LOGICIEL SUR-MESURE ═══════════════════════ */
PAGES.push({
  slug: 'logiciel-sur-mesure',
  title: 'Logiciel sur-mesure et application métier | Groupe Solution',
  desc: 'Logiciel sur-mesure et application métier : quand le choisir, cadrage, MVP, propriété du code, maintenance. Par un éditeur de logiciels. Devis gratuit.',
  crumb: 'Logiciel sur-mesure',
  kicker: 'Application métier · outil interne · plateforme · MVP',
  h1: 'Logiciel sur-mesure et application métier : <em>l’outil construit autour de votre façon de travailler</em>.',
  lead: 'Quand les logiciels du marché vous obligent à contourner, ressaisir ou jongler entre tableurs, un développement sur-mesure peut devenir rentable. Voici comment savoir si c’est votre cas, et comment mener le projet sans mauvaise surprise.',
  serviceName: 'Développement de logiciel sur-mesure et d’application métier',
  serviceType: 'Développement de logiciel sur-mesure',
  sections: [
    { id: 'definition', h2: 'Qu’est-ce qu’un logiciel sur-mesure ?', html: `
<p>Un <strong>logiciel sur-mesure</strong> (ou <strong>application métier sur-mesure</strong>) est développé spécifiquement pour une entreprise, à partir de ses processus, de son vocabulaire et de ses contraintes. Il peut prendre la forme d’une application web accessible depuis un navigateur, d’une application mobile, d’un outil interne de gestion, d’un portail client ou d’une plateforme ouverte au public.</p>
<p>À l’opposé, un logiciel du marché (souvent vendu en abonnement, « SaaS ») est conçu pour des milliers d’entreprises à la fois. Il est rapide à mettre en place, mais c’est à vous de vous adapter à lui. Aucune des deux options n’est meilleure dans l’absolu : tout dépend de ce que votre activité a de spécifique.</p>` },
    { id: 'choix', h2: 'Sur-mesure ou logiciel du marché : comment décider ?', html: `
${table('Logiciel du marché, connecteurs ou développement sur-mesure : comparer les options', ['Option', 'Quand la choisir', 'Limites'], [
  ['Logiciel du marché seul', 'Votre besoin est standard (comptabilité, paie, agenda) et bien couvert par des éditeurs reconnus.', 'Vous adaptez vos pratiques à l’outil ; les fonctionnalités évoluent au rythme de l’éditeur.'],
  ['Logiciels du marché + connecteurs', 'Chaque outil fait bien son travail, mais ils ne se parlent pas.', 'Suffit tant que la logique reste simple ; voir ' + '<a href="integration-api-connecteurs.html">intégration d’API</a>' + '.'],
  ['Développement sur-mesure', 'Votre processus est différenciant, ou aucun outil ne couvre votre métier sans contournements lourds.', 'Investissement initial, cadrage exigeant, maintenance à prévoir.'],
  ['Hybride', 'Garder les briques standard (compta, paiement) et développer seulement la partie spécifique.', 'Demande une architecture propre pour que l’ensemble reste cohérent.'],
])}
<p>Dans la majorité des cas que nous rencontrons, la bonne réponse est <strong>hybride</strong> : on conserve ce qui marche et l’on développe uniquement ce qui manque. Nous vous recommandons un outil existant quand il suffit — et nous vous le disons.</p>` },
    { id: 'signes', h2: 'Les signes qu’un logiciel sur-mesure devient utile', html: `
${ul([
  'Des <strong>tableurs partagés</strong> sont devenus le vrai système de gestion, avec des versions contradictoires ;',
  'la même information est <strong>saisie deux ou trois fois</strong> dans des outils différents ;',
  'vous payez plusieurs abonnements pour n’utiliser qu’une petite partie de chacun ;',
  'votre façon de travailler est un <strong>avantage concurrentiel</strong> que les outils standards ne savent pas reproduire ;',
  'vos clients ou partenaires ont besoin d’un <strong>espace dédié</strong> (suivi de dossier, commande, documents) ;',
  'la croissance est freinée parce que le processus actuel ne supporte pas plus de volume.',
])}
<p>Si plusieurs de ces situations vous parlent, un échange de 10 minutes permet souvent de voir s’il faut un logiciel complet, une ${svc('automatisation-processus', 'automatisation ciblée')} ou simplement un meilleur paramétrage de vos outils actuels.</p>
${keep(['Le sur-mesure se justifie quand votre processus est spécifique ou que les contournements coûtent cher.', 'La solution hybride — standard + spécifique — est souvent la plus raisonnable.'])}` },
    { id: 'cadrage', h2: 'Le cadrage : ce qu’on écrit avant d’écrire du code', html: `
<p>La plupart des projets de développement qui dérapent le font faute de cadrage. Avant de coder, nous formalisons avec vous :</p>
${ul([
  'les <strong>utilisateurs</strong> et ce que chacun doit pouvoir faire ;',
  'les <strong>parcours clés</strong> décrits pas à pas (« le technicien clôture une intervention sur son téléphone ») ;',
  'les <strong>données</strong> manipulées, leur origine et leur sensibilité ;',
  'les <strong>outils à connecter</strong> (comptabilité, CRM, agenda, messagerie) ;',
  'les <strong>priorités</strong> : ce qui est indispensable au démarrage et ce qui peut attendre ;',
  'les critères de réussite qui permettront de dire que le projet a atteint son but.',
])}
<p>Ce document devient la référence commune. Il permet d’établir un devis précis — toujours gratuit et personnalisé — et d’éviter les malentendus.</p>` },
    { id: 'mvp', h2: 'Commencer par un MVP : une première version utile, vite', html: `
<p>Plutôt que de tout construire d’un bloc, nous livrons d’abord un <strong>MVP</strong> (produit minimum viable) : la plus petite version du logiciel qui résout déjà le problème principal. Vos équipes l’utilisent en conditions réelles ; leurs retours orientent la suite.</p>
<p>Cette approche a trois avantages : vous obtenez un bénéfice plus tôt, vous limitez le risque de développer des fonctionnalités inutiles, et le budget suit la valeur réellement constatée. Les développements se font ensuite par itérations courtes, avec une version de test que vous pouvez consulter à tout moment.</p>` },
    { id: 'propriete', h2: 'Propriété du code et réversibilité', html: `
<p>Un logiciel sur-mesure est un actif de votre entreprise. Il est essentiel de savoir, avant de commencer, <strong>à qui appartiendra le code</strong>, où il sera stocké, et comment un autre prestataire pourrait le reprendre si nécessaire. Nous vous recommandons d’exiger :</p>
${ul([
  'la cession des droits sur le code spécifique développé pour vous, précisée au contrat ;',
  'l’accès au dépôt de code source et à la documentation technique ;',
  'des comptes d’hébergement et de services tiers ouverts à votre nom quand c’est possible ;',
  'l’usage de technologies répandues plutôt que propriétaires, pour ne pas dépendre d’un seul prestataire.',
])}
<p>Chez Groupe Solution, ces points sont traités par écrit dans chaque proposition.</p>` },
    { id: 'maintenance', h2: 'Maintenance, sécurité et évolutions', html: `
<p>Un logiciel vit : les navigateurs évoluent, les bibliothèques reçoivent des correctifs de sécurité, les API des outils connectés changent, et votre activité aussi. Il faut donc prévoir dès le départ :</p>
${ul([
  'les <strong>mises à jour de sécurité</strong> et les sauvegardes ;',
  'la <strong>surveillance</strong> (alertes en cas d’erreur ou d’indisponibilité) ;',
  'un <strong>canal clair</strong> pour signaler un problème et un délai de prise en charge ;',
  'un budget d’<strong>évolutions</strong> pour faire grandir l’outil avec vous.',
])}
<p>Côté technologies, nous privilégions des briques éprouvées et largement utilisées : applications web responsives utilisables sur ordinateur, tablette et smartphone, API documentées, bases de données standards. Une application web bien conçue évite souvent de développer séparément des applications iOS et Android.</p>` },
    { id: 'preuve', h2: 'Un éditeur de logiciels, pas seulement un prestataire', html: `
<p>Groupe Solution conçoit et exploite ses propres plateformes en production : Solution Recrutement, qui référence plus de 565 000 offres d’emploi, Solution Alternance, avec plus de 200 000 offres et un matching par IA, et Aides Particuliers. Faire tourner ces services au quotidien nous oblige aux mêmes exigences que celles que nous appliquons à vos projets : performance, sécurité, suivi et évolutions continues.</p>
<p>Nous accompagnons des indépendants comme des PME, à Montpellier et partout en France. Pour aller plus loin sur l’intégration de l’IA dans une application métier, consultez notre page ${svc('agence-ia-entreprise', 'agence IA')}.</p>
${keep(['Cadrage écrit, puis MVP, puis itérations : c’est le chemin le plus sûr.', 'Le code spécifique doit vous appartenir et pouvoir être repris.', 'La maintenance fait partie du projet, pas d’une option.'])}` },
  ],
  ctaAfter: 2,
  ctaTitle: 'Votre besoin justifie-t-il un logiciel sur-mesure ?',
  ctaText: 'En 10 minutes, nous vous disons honnêtement si un outil existant suffit ou s’il faut développer. Devis gratuit et personnalisé.',
  faq: [
    { q: 'Combien coûte un logiciel sur-mesure ?', a: 'Le coût dépend du nombre d’utilisateurs et de parcours, des outils à connecter, des exigences de sécurité et du périmètre de la première version. Nous établissons un devis gratuit et personnalisé après un cadrage, en commençant si possible par un MVP.' },
    { q: 'Quand choisir un logiciel sur-mesure plutôt qu’un logiciel du marché ?', a: 'Quand votre processus est spécifique ou différenciant, quand les contournements (tableurs, doubles saisies) coûtent cher, ou quand aucun outil ne couvre votre métier. Si un logiciel existant suffit, mieux vaut l’utiliser et le connecter à vos autres outils.' },
    { q: 'Qu’est-ce qu’une application métier ?', a: 'C’est un logiciel dédié aux tâches propres à un métier : gestion des interventions, suivi de dossiers, planification, devis techniques, portail client. Elle peut être standard ou développée sur-mesure.' },
    { q: 'Qu’est-ce qu’un MVP en développement logiciel ?', a: 'Un produit minimum viable est la plus petite version d’un logiciel qui résout déjà le problème principal. Il permet de tester l’outil en conditions réelles et d’orienter les développements suivants selon les retours des utilisateurs.' },
    { q: 'Suis-je propriétaire du code de mon logiciel sur-mesure ?', a: 'Cela dépend du contrat : la cession des droits sur le code spécifique doit y être prévue explicitement, avec l’accès au code source et à la documentation. Chez Groupe Solution, ces points sont précisés par écrit dans chaque proposition.' },
    { q: 'Combien de temps pour développer une application métier ?', a: 'Cela varie fortement selon le périmètre. Une première version ciblée (MVP) peut être livrée bien plus vite qu’un logiciel complet ; les évolutions se font ensuite par itérations courtes. Un calendrier précis figure dans la proposition.' },
  ],
  metiers: ['organisme-de-formation', 'services-a-domicile', 'agence-immobiliere', 'garage-automobile'],
  veille: ['open-data-api-gouv', 'mcp-model-context-protocol', 'rag-assistant-documents'],
  guides: ['choisir-agence-web-montpellier', 'automatiser-devis-artisan'],
  form: { h2: 'Décrivez l’outil qui vous manque', p: 'Deux phrases suffisent. Je vous réponds avec une première orientation — outil existant, connecteurs ou sur-mesure — gratuitement.', ph: 'Ex : nous gérons nos interventions sur trois tableurs et des SMS…', btn: 'Recevoir ma première orientation →', label: 'L’outil qui vous manque' },
});

/* ═══════════════════════ 5. AGENT IA ET CHATBOT ═══════════════════════ */
PAGES.push({
  slug: 'agent-ia-chatbot',
  title: 'Agent IA et chatbot d’entreprise | Groupe Solution',
  desc: 'Agent IA et chatbot d’entreprise : assistant client multilingue, assistant interne sur vos documents (RAG), agents connectés à vos outils. Devis gratuit.',
  crumb: 'Agent IA et chatbot',
  kicker: 'Assistant client · assistant interne RAG · agents connectés',
  h1: 'Agent IA et chatbot d’entreprise : <em>des assistants utiles, fiables et encadrés</em>.',
  lead: 'Un bon chatbot ne se contente pas de réciter une FAQ : il comprend la question, répond à partir de vos informations vérifiées, sait passer la main à un humain et, si vous le souhaitez, agit dans vos outils. Voici comment nous concevons des agents IA pour les entreprises.',
  serviceName: 'Agent IA et chatbot d’entreprise',
  serviceType: 'Développement d’agents IA et de chatbots',
  sections: [
    { id: 'differences', h2: 'Chatbot, assistant IA, agent IA : quelles différences ?', html: `
<p>Les termes se mélangent souvent. Ils désignent pourtant des niveaux d’autonomie différents, avec des niveaux de précaution différents.</p>
${table('Chatbot, assistant IA et agent IA : usages et limites', ['Type', 'Ce qu’il fait', 'Quand le choisir', 'Limites'], [
  ['Chatbot à scénarios', 'Suit un arbre de questions et de réponses prédéfinies.', 'Quelques questions très répétitives, parcours simple.', 'Rigide ; frustrant dès que la question sort du script.'],
  ['Assistant IA conversationnel', 'Comprend le langage naturel et répond à partir de vos contenus.', 'Questions variées de clients ou de salariés.', 'Doit être limité à des sources fiables pour éviter les réponses inventées.'],
  ['Agent IA', 'Comprend, puis agit : crée un rendez-vous, met à jour une fiche, prépare un devis.', 'Tâches qui demandent à la fois de comprendre et d’exécuter.', 'Exige des permissions limitées, des validations et un journal des actions.'],
])}
<p>Le bon choix dépend du risque : plus l’outil peut agir, plus les garde-fous doivent être solides.</p>` },
    { id: 'client', h2: 'L’assistant client multilingue', html: `
<p>Installé sur votre site ou votre messagerie, un <strong>chatbot IA</strong> répond à toute heure aux questions fréquentes : horaires, tarifs publiés, disponibilités, zone d’intervention, suivi de commande, documents à fournir. Il comprend les questions formulées de mille façons et peut répondre dans la langue du visiteur, ce qui est précieux dans les zones touristiques ou pour une clientèle internationale.</p>
<p>Son rôle le plus utile est souvent la <strong>qualification</strong> : il recueille les informations nécessaires (besoin, adresse, délai, coordonnées) et transmet une demande complète à votre équipe, au lieu d’un simple « rappelez-moi ». Dès qu’une question sort de son périmètre ou que le client le demande, il passe la main à un humain.</p>` },
    { id: 'rag', h2: 'L’assistant interne branché sur vos documents (RAG)', html: `
<p>Procédures, fiches techniques, contrats, conventions, notes internes : l’information existe mais on perd du temps à la chercher. Un <strong>assistant interne</strong> fondé sur la technique du RAG (génération augmentée par la recherche) interroge vos documents, retrouve les passages pertinents et répond <strong>en citant ses sources</strong>, pour que chacun puisse vérifier.</p>
<p>Deux conditions sont indispensables : des documents de référence à jour, et le <strong>respect des droits d’accès</strong> — un salarié ne doit obtenir que les réponses issues de documents qu’il a le droit de consulter. Notre article ${veille('rag-assistant-documents')} explique le fonctionnement en détail.</p>
${keep(['Un assistant fiable répond à partir de vos sources, et les cite.', 'Le passage de relais vers un humain doit être simple et rapide.'])}` },
    { id: 'agents', h2: 'Des agents IA qui agissent dans vos outils : API, MCP et navigation', html: `
<p>Un agent IA devient vraiment utile quand il peut <strong>agir</strong> : consulter une disponibilité dans l’agenda, créer une fiche dans le CRM, préparer une facture, lancer une relance. Pour cela, il doit être connecté à vos logiciels.</p>
${ul([
  '<strong>Par API</strong> : la méthode la plus fiable, quand vos outils en proposent une — voir ' + svc('integration-api-connecteurs', 'intégration d’API') + ' ;',
  '<strong>Par MCP (Model Context Protocol)</strong> : un standard ouvert apparu fin 2024 qui décrit de façon commune les outils mis à disposition d’une IA — voir ' + veille('mcp-model-context-protocol') + ' ;',
  '<strong>Par navigation</strong> (« computer use ») : l’agent utilise une interface comme le ferait un humain, pour les portails qui n’ont pas d’API — voir ' + veille('agents-ia-computer-use') + '.',
])}
<p>Dans tous les cas, l’agent ne reçoit que les permissions strictement nécessaires : lire l’agenda n’implique pas de pouvoir supprimer des rendez-vous.</p>` },
    { id: 'usages', h2: 'Exemples d’usages d’un chatbot IA selon les métiers', html: `
<p>Un assistant IA n’a pas le même rôle d’un secteur à l’autre. Quelques scénarios typiques, à adapter à chaque entreprise :</p>
${ul([
  '<strong>Hébergement et tourisme</strong> : questions sur l’accès, les horaires d’arrivée, les équipements, les activités alentour, dans la langue du voyageur ;',
  '<strong>Restauration</strong> : horaires, réservation, menus du moment ; pour les allergènes, l’assistant ne répond qu’à partir d’informations validées par l’établissement et renvoie vers l’équipe en cas de doute ;',
  '<strong>Organisme de formation</strong> : programmes, prérequis, dates de sessions, modalités d’inscription et de financement, avec transfert vers un conseiller pour les cas particuliers ;',
  '<strong>Immobilier</strong> : qualification des demandes de visite (budget, secteur, délai) avant transmission à l’agent ;',
  '<strong>Commerce en ligne</strong> : suivi de commande, disponibilité, retours et échanges, en lien avec la boutique.',
])}
<p>Dans chaque cas, le principe est le même : l’assistant traite le répétitif, recueille les bonnes informations et laisse à l’équipe ce qui demande du jugement. Pour un assistant qui doit aussi agir dans vos logiciels, l’${svc('integration-api-connecteurs', 'intégration d’API')} est l’étape clé.</p>` },
    { id: 'garde-fous', h2: 'Les garde-fous indispensables', html: `
${ul([
  '<strong>Périmètre défini</strong> : l’assistant sait ce dont il peut parler et ce qu’il doit refuser ;',
  '<strong>Sources contrôlées</strong> : il répond à partir de vos contenus validés, pas de sa mémoire générale, pour les sujets factuels ;',
  '<strong>Validation humaine</strong> pour les actions sensibles (envoi d’un devis, remboursement, modification d’un contrat) ;',
  '<strong>Protection contre les manipulations</strong> : un message ou un document malveillant ne doit pas pouvoir détourner l’agent de ses consignes (injection d’instructions) ;',
  '<strong>Journal</strong> des conversations et des actions, pour analyser et corriger ;',
  '<strong>Tests réguliers</strong> sur un jeu de questions de référence, surtout après une mise à jour de contenu ou de modèle.',
])}` },
    { id: 'conformite', h2: 'Transparence, RGPD et AI Act', html: `
<p>Depuis le 2 août 2026, l’article 50 du règlement européen sur l’IA impose d’<strong>informer les personnes qu’elles échangent avec une IA</strong>, sauf si c’est évident. Un simple message d’accueil clair suffit en général. Le RGPD s’applique dès que l’assistant collecte des données personnelles : information des utilisateurs, durée de conservation, sécurité, choix de fournisseurs offrant des garanties. Notre article ${veille('ai-act-pme')} détaille ces obligations, et notre page ${svc('agence-ia-entreprise', 'agence IA')} aborde la souveraineté et le choix des modèles.</p>` },
    { id: 'methode', h2: 'Notre méthode pour un chatbot qui fonctionne', html: `
${ol([
  'Lister les <strong>questions réelles</strong> de vos clients ou de vos équipes (e-mails, appels, messages).',
  'Rassembler et nettoyer les <strong>sources de référence</strong>.',
  'Construire un prototype et le tester sur un <strong>jeu de questions</strong> représentatif, y compris des questions pièges.',
  'Définir les règles de <strong>passage à un humain</strong> et les actions autorisées.',
  'Mettre en ligne progressivement, <strong>mesurer</strong> (questions non résolues, satisfaction), améliorer.',
])}
<p>Et parfois, la conclusion est qu’un chatbot n’est pas la bonne réponse : une page FAQ mieux rédigée ou un formulaire plus clair peut suffire. Nous vous le dirons.</p>
${keep(['Plus un agent peut agir, plus ses permissions doivent être limitées et ses actions journalisées.', 'Informez les utilisateurs qu’ils échangent avec une IA : c’est une obligation depuis août 2026.'])}` },
  ],
  ctaAfter: 2,
  ctaTitle: 'Un assistant IA serait-il utile chez vous ?',
  ctaText: 'En 10 minutes, nous regardons les questions que vous recevez et ce qu’un agent IA pourrait prendre en charge. Devis gratuit et personnalisé.',
  faq: [
    { q: 'Comment créer un chatbot IA pour son entreprise ?', a: 'Listez les questions réelles de vos clients, rassemblez des sources de référence fiables, construisez un prototype testé sur ces questions, définissez quand il doit passer la main à un humain, puis mettez-le en ligne progressivement en mesurant les questions non résolues.' },
    { q: 'Quelle différence entre un chatbot et un agent IA ?', a: 'Un chatbot répond à des questions. Un agent IA comprend la demande puis agit dans vos outils : il crée un rendez-vous, met à jour une fiche client ou prépare un document. Il demande donc des permissions limitées, des validations et un journal des actions.' },
    { q: 'Un chatbot IA peut-il répondre dans plusieurs langues ?', a: 'Oui, les modèles de langage actuels comprennent et rédigent dans de nombreuses langues. Il faut toutefois vérifier la qualité des réponses dans chaque langue visée et s’assurer que les informations de référence sont correctement comprises.' },
    { q: 'Qu’est-ce qu’un assistant IA RAG ?', a: 'C’est un assistant qui recherche d’abord les passages pertinents dans vos documents, puis rédige une réponse à partir de ces passages en citant ses sources. Cela limite les réponses inventées et permet de vérifier l’information.' },
    { q: 'Faut-il signaler qu’un chatbot est une intelligence artificielle ?', a: 'Oui. Depuis le 2 août 2026, l’article 50 du règlement européen sur l’IA impose d’informer les personnes qu’elles interagissent avec un système d’IA, sauf si c’est évident. Un message d’accueil clair suffit en général.' },
    { q: 'Combien coûte un chatbot ou un agent IA pour entreprise ?', a: 'Le coût dépend du périmètre, du nombre de sources, des outils à connecter, du volume de conversations et du modèle retenu. Nous établissons un devis gratuit et personnalisé après un premier échange.' },
  ],
  metiers: ['hebergement-gite', 'restaurant', 'agence-immobiliere', 'organisme-de-formation', 'commerce-boutique'],
  veille: ['rag-assistant-documents', 'mcp-model-context-protocol', 'agents-ia-computer-use', 'ai-act-pme'],
  guides: ['obligations-legales-site-internet'],
  form: { h2: 'Quelles questions vous pose-t-on sans cesse ?', p: 'Décrivez-les en deux phrases. Je vous réponds avec une première idée d’assistant IA — gratuitement, sans engagement.', ph: 'Ex : nos clients demandent tous les jours le suivi de leur commande et les délais…', btn: 'Recevoir ma première idée →', label: 'Les questions récurrentes' },
});

/* ═══════════════════════ 6. AGENT VOCAL IA ═══════════════════════ */
PAGES.push({
  slug: 'agent-vocal-ia',
  title: 'Agent vocal IA : standard téléphonique IA | Groupe Solution',
  desc: 'Agent vocal IA et standard téléphonique intelligent : prise d’appels 24 h/24, rendez-vous, transfert, résumé. Transparence AI Act et RGPD inclus. Devis gratuit.',
  crumb: 'Agent vocal IA',
  kicker: 'Standard intelligent · prise de RDV · transfert · résumé d’appel',
  h1: 'Agent vocal IA : <em>un standard téléphonique intelligent</em> qui ne laisse plus d’appel sans réponse.',
  lead: 'Chaque appel manqué peut être un client qui appelle le concurrent suivant. Un agent vocal IA décroche, comprend la demande, répond à partir de vos informations, prend le rendez-vous ou transfère à la bonne personne. Voici ce qu’il sait faire, ses limites et les règles à respecter.',
  serviceName: 'Agent vocal IA et standard téléphonique intelligent',
  serviceType: 'Agent vocal IA',
  sections: [
    { id: 'definition', h2: 'Qu’est-ce qu’un agent vocal IA ?', html: `
<p>Un <strong>agent vocal IA</strong> (on parle aussi de <strong>standard téléphonique IA</strong>, de <strong>réceptionniste virtuelle</strong> ou d’<strong>assistant vocal d’entreprise</strong>) est un logiciel qui répond au téléphone et converse en langage naturel. Il enchaîne trois briques : la reconnaissance de la parole, un modèle de langage qui comprend la demande et décide de la réponse, et une synthèse vocale qui parle.</p>
<p>Contrairement au serveur vocal interactif classique (« tapez 1, tapez 2 »), l’appelant parle normalement : « Je voudrais décaler mon rendez-vous de jeudi à la semaine prochaine. » L’agent comprend, vérifie l’agenda, propose un créneau et confirme. Notre article ${veille('agents-vocaux-ia')} présente l’état de l’art de ces technologies.</p>` },
    { id: 'usages', h2: 'Ce qu’un standard téléphonique intelligent peut faire', html: `
<h3>Décrocher à toute heure</h3>
<p>Pendant que vous êtes en rendez-vous, sur un chantier ou fermé, l’agent prend l’appel au lieu de laisser sonner dans le vide ou de renvoyer vers une messagerie que peu de gens utilisent.</p>
<h3>Prendre, déplacer ou annuler des rendez-vous</h3>
<p>Connecté à votre agenda ou à votre logiciel de réservation, il propose les créneaux disponibles et enregistre le rendez-vous directement, avec confirmation par SMS ou e-mail si vous le souhaitez.</p>
<h3>Répondre aux questions fréquentes</h3>
<p>Horaires, adresse, accès, documents à apporter, prestations proposées : il répond à partir des informations que vous avez validées, et uniquement celles-là.</p>
<h3>Transférer à la bonne personne</h3>
<p>Urgence, client important, demande complexe : l’agent transfère l’appel selon vos règles, ou prend un message complet si personne n’est disponible.</p>
<h3>Transcrire et résumer chaque appel</h3>
<p>Après chaque conversation, vous recevez un résumé structuré (qui, pourquoi, ce qui a été convenu, ce qu’il reste à faire), qui peut alimenter votre CRM automatiquement.</p>` },
    { id: 'comparatif', h2: 'Répondeur, SVI, secrétariat ou agent vocal IA : que choisir ?', html: `
${table('Solutions de prise d’appels : quand les choisir et leurs limites', ['Solution', 'Quand la choisir', 'Limites'], [
  ['Répondeur / messagerie', 'Très peu d’appels, clientèle habituée à laisser un message.', 'Beaucoup d’appelants raccrochent sans laisser de message.'],
  ['Serveur vocal interactif (SVI)', 'Orientation simple vers quelques services.', 'Rigide ; ne répond pas aux questions et ne prend pas de rendez-vous par la conversation.'],
  ['Secrétariat externalisé', 'Besoin d’écoute humaine, situations délicates, forte empathie.', 'Plages horaires limitées selon le contrat ; peu intégré à vos outils.'],
  ['Agent vocal IA', 'Volume d’appels répétitifs (RDV, infos pratiques), besoin de couverture étendue et d’intégration à l’agenda.', 'Moins adapté aux conversations très émotionnelles ou complexes, qui doivent être transférées à un humain.'],
])}
<p>Ces solutions se combinent : l’agent vocal traite les demandes simples et transfère le reste à votre équipe ou à votre secrétariat.</p>
${keep(['L’agent vocal absorbe les appels répétitifs ; les humains gardent les appels délicats.', 'Le transfert vers un humain doit être prévu dès la conception.'])}` },
    { id: 'metiers', h2: 'Exemples d’usages d’un agent vocal selon les métiers', html: `
${ul([
  '<strong>Cabinet de santé</strong> : prise, report et annulation de rendez-vous, informations pratiques. L’agent ne donne jamais d’avis médical et, face à une situation qui semble urgente, oriente immédiatement vers les numéros d’urgence (15 ou 112) ou vers le praticien selon vos consignes ;',
  '<strong>Garage automobile</strong> : rendez-vous d’entretien, demande de devis, point sur l’avancement d’un véhicule si l’information est disponible dans votre logiciel ;',
  '<strong>Restaurant</strong> : réservations, horaires, accès, sans interrompre le service en cuisine ou en salle ;',
  '<strong>Coiffure et esthétique</strong> : prise de rendez-vous par prestation et par collaborateur, rappels de la veille ;',
  '<strong>Services à domicile et artisans</strong> : recueil des demandes d’intervention avec adresse, nature du problème et disponibilités, transmis à l’équipe sous forme de fiche complète.',
])}
<p>À chaque fois, l’agent est configuré avec vos informations, vos règles de transfert et votre ton. Il ne remplace pas l’accueil humain : il prend le relais quand celui-ci n’est pas disponible, ou traite le flux répétitif pour que l’équipe se consacre aux appels qui comptent.</p>` },
    { id: 'ai-act', h2: 'Informer l’appelant : l’obligation de l’AI Act (article 50)', html: `
<p>Depuis le <strong>2 août 2026</strong>, l’article 50 du règlement européen sur l’intelligence artificielle impose que les personnes soient informées qu’elles interagissent avec un système d’IA, sauf si c’est évident au vu du contexte. Au téléphone, une voix de synthèse réaliste ne rend pas la chose évidente : l’agent doit donc <strong>se présenter comme un assistant automatique</strong> dès le début de l’appel. Le règlement « omnibus IA » de juillet 2026, qui a reporté d’autres obligations, n’a pas reporté celle-ci.</p>
<p>Nos agents vocaux intègrent systématiquement cette annonce, formulée simplement : « Bonjour, vous êtes en ligne avec l’assistant automatique de… ». Voir aussi ${veille('ai-act-pme')}.</p>` },
    { id: 'rgpd', h2: 'RGPD et enregistrement des appels', html: `
<p>Un agent vocal traite des données personnelles : numéro de téléphone, voix, contenu de la conversation. Le RGPD impose notamment :</p>
${ul([
  'd’<strong>informer l’appelant</strong> du traitement et, le cas échéant, de l’enregistrement ou de la transcription, et de ses droits ;',
  'de définir une <strong>finalité précise</strong> et une <strong>durée de conservation limitée</strong> des enregistrements et transcriptions ;',
  'de ne collecter que les informations <strong>nécessaires</strong> ;',
  'de choisir des <strong>prestataires offrant des garanties</strong> sur la sécurité et la localisation des données ;',
  'de documenter le traitement dans votre registre.',
])}
<p>Pour les données sensibles (santé notamment), les exigences sont renforcées : nous en tenons compte dans le choix de l’architecture et des fournisseurs. Les recommandations de la CNIL sur l’écoute et l’enregistrement des appels constituent une bonne référence.</p>` },
    { id: 'integration', h2: 'Garder votre numéro et connecter vos outils', html: `
<p>Dans la plupart des cas, il n’est pas nécessaire de changer de numéro : un <strong>renvoi d’appel</strong> (systématique, en cas de non-réponse ou hors horaires) suffit à faire décrocher l’agent. Il se connecte ensuite à vos outils : agenda ou logiciel de réservation, CRM, messagerie, outil de tickets. Ces connexions reposent sur les mêmes principes que nos ${svc('integration-api-connecteurs', 'intégrations d’API')}.</p>` },
    { id: 'limites', h2: 'Limites honnêtes et méthode', html: `
<p>Un agent vocal IA n’est pas infaillible. Le bruit de fond, une mauvaise connexion, un accent prononcé ou un vocabulaire très technique peuvent dégrader la compréhension. Un léger temps de réponse peut aussi se faire sentir. C’est pourquoi nous suivons une méthode prudente :</p>
${ol([
  'écouter ou lister les <strong>motifs d’appel réels</strong> ;',
  'définir ce que l’agent traite seul, ce qu’il transfère et ce qu’il refuse ;',
  'tester avec des <strong>appels simulés</strong> variés avant la mise en service ;',
  'démarrer sur une plage limitée (hors horaires par exemple), puis étendre ;',
  'relire régulièrement les résumés pour <strong>améliorer</strong> les réponses.',
])}
<p>Cette approche s’inscrit dans une démarche plus large d’${svc('agence-ia-entreprise', 'intégration de l’IA en entreprise')} ; pour l’écrit, voir notre page ${svc('agent-ia-chatbot', 'agent IA et chatbot')}.</p>
${keep(['L’agent doit annoncer qu’il est une IA dès le début de l’appel.', 'Informez les appelants de l’enregistrement ou de la transcription et limitez la conservation.', 'Commencez sur une plage horaire limitée et élargissez après vérification.'])}` },
  ],
  ctaAfter: 2,
  ctaTitle: 'Combien d’appels manquez-vous chaque semaine ?',
  ctaText: 'En 10 minutes, nous regardons vos motifs d’appel et ce qu’un agent vocal pourrait prendre en charge. Devis gratuit et personnalisé.',
  faq: [
    { q: 'Qu’est-ce qu’un agent vocal IA ?', a: 'C’est un logiciel qui répond au téléphone et converse en langage naturel : il reconnaît la parole, comprend la demande grâce à un modèle de langage et répond avec une voix de synthèse. Il peut prendre des rendez-vous, répondre aux questions fréquentes et transférer les appels.' },
    { q: 'Un standard téléphonique IA peut-il prendre des rendez-vous ?', a: 'Oui, s’il est connecté à votre agenda ou à votre logiciel de réservation. Il propose les créneaux disponibles, enregistre le rendez-vous et peut envoyer une confirmation par SMS ou e-mail.' },
    { q: 'Faut-il prévenir l’appelant qu’il parle à une IA ?', a: 'Oui. Depuis le 2 août 2026, l’article 50 du règlement européen sur l’IA impose d’informer les personnes qu’elles interagissent avec un système d’IA, sauf si c’est évident. Au téléphone, l’agent doit se présenter comme un assistant automatique dès le début de l’appel.' },
    { q: 'Peut-on garder son numéro de téléphone avec un agent vocal IA ?', a: 'Dans la plupart des cas, oui : un renvoi d’appel depuis votre ligne existante (systématique, en cas de non-réponse ou hors horaires) permet à l’agent de décrocher sans changer de numéro.' },
    { q: 'L’enregistrement des appels par une IA est-il conforme au RGPD ?', a: 'Il peut l’être, à condition d’informer l’appelant, de définir une finalité précise, de limiter la durée de conservation, de ne collecter que le nécessaire et de choisir des prestataires offrant des garanties. Les recommandations de la CNIL sont une bonne référence.' },
    { q: 'Combien coûte un agent vocal IA pour une entreprise ?', a: 'Le coût dépend du volume d’appels, des intégrations (agenda, CRM), des langues et du niveau de personnalisation. Nous établissons un devis gratuit et personnalisé après un premier échange.' },
  ],
  metiers: ['professionnel-de-sante', 'garage-automobile', 'restaurant', 'coiffeur-esthetique', 'services-a-domicile'],
  veille: ['agents-vocaux-ia', 'ai-act-pme'],
  guides: ['apparaitre-google-maps-montpellier'],
  form: { h2: 'Parlez-nous de vos appels', p: 'Décrivez en deux phrases qui vous appelle et pourquoi. Je vous réponds avec une première piste — gratuitement, sans engagement.', ph: 'Ex : je rate des appels pendant mes rendez-vous, surtout pour des prises de RDV…', btn: 'Recevoir ma piste d’agent vocal →', label: 'Vos appels aujourd’hui' },
});

/* ═══════════════════════ 7. INTÉGRATION D'API ═══════════════════════ */
PAGES.push({
  slug: 'integration-api-connecteurs',
  title: 'Intégration API et connexion de vos outils | Groupe Solution',
  desc: 'Intégration d’API et connecteurs : CRM, ERP, agenda, comptabilité, e-commerce, open data, webhooks et MCP. Vos outils connectés, sans ressaisie. Devis gratuit.',
  crumb: 'Intégration d’API',
  kicker: 'CRM · ERP · agenda · comptabilité · e-commerce · open data',
  h1: 'Intégration d’API : <em>connecter vos outils</em> pour ne plus rien ressaisir.',
  lead: 'Votre site, votre CRM, votre agenda, votre logiciel de facturation et votre boutique en ligne détiennent chacun une partie de l’information. Les relier par API supprime la double saisie et les oublis. Voici comment fonctionne une intégration, ce que l’on peut connecter et comment la rendre fiable.',
  serviceName: 'Intégration d’API et connexion des outils métier',
  serviceType: 'Intégration d’API',
  sections: [
    { id: 'api', h2: 'Une API, c’est quoi ? L’explication simple', html: `
<p>Une <strong>API</strong> (interface de programmation) est une porte d’entrée qu’un logiciel ouvre pour que d’autres logiciels puissent lui parler de façon structurée : « donne-moi les rendez-vous de demain », « crée ce client », « enregistre cette facture ». Au lieu qu’une personne copie des informations d’un écran à l’autre, les logiciels échangent directement les données.</p>
<p>L’<strong>intégration d’API</strong> consiste à concevoir ces échanges : quelles données circulent, dans quel sens, à quel moment, et que se passe-t-il en cas d’erreur. Un <strong>connecteur</strong> est le composant qui réalise cet échange entre deux outils précis.</p>` },
    { id: 'quoi', h2: 'Ce que l’on connecte le plus souvent', html: `
${ul([
  '<strong>CRM</strong> : les demandes du site et les appels arrivent directement dans la fiche client, avec leur historique ;',
  '<strong>ERP et gestion commerciale</strong> : commandes, stocks, tarifs et bons de livraison synchronisés ;',
  '<strong>Agenda et réservation</strong> : disponibilités affichées sur le site, rendez-vous créés sans double saisie ;',
  '<strong>Comptabilité et facturation</strong> : factures, paiements et relances rapprochés automatiquement ;',
  '<strong>E-commerce</strong> : commandes transmises à la préparation, statuts renvoyés au client ;',
  '<strong>Messagerie, SMS, signature électronique</strong> : envois déclenchés au bon moment ;',
  '<strong>Données publiques (open data)</strong> : vérification d’un numéro SIRET via l’API Recherche d’entreprises, normalisation des adresses avec la Base Adresse Nationale, jours fériés, données géographiques.',
])}
<p>Les API publiques françaises sont une mine sous-exploitée : notre article ${veille('open-data-api-gouv')} présente les plus utiles pour une entreprise.</p>` },
    { id: 'methodes', h2: 'API, webhooks, fichiers, MCP : les méthodes d’intégration', html: `
${table('Méthodes d’intégration : quand les choisir et leurs limites', ['Méthode', 'Quand la choisir', 'Limites'], [
  ['API REST (requêtes à la demande)', 'Lire ou écrire des données dans un outil moderne, de façon contrôlée.', 'Quotas d’appels ; authentification à gérer ; l’API peut évoluer.'],
  ['Webhooks (notifications)', 'Réagir immédiatement à un événement : nouvelle commande, paiement reçu, formulaire envoyé.', 'Il faut un point de réception fiable et gérer les notifications en double ou manquées.'],
  ['Échange de fichiers (CSV, SFTP)', 'Logiciels anciens ou partenaires qui ne proposent que des exports.', 'Pas de temps réel ; formats fragiles si les colonnes changent.'],
  ['Plateformes no-code d’intégration', 'Enchaînements simples entre outils grand public.', 'Coût croissant avec le volume ; logique difficile à auditer quand elle grossit.'],
  ['MCP (Model Context Protocol)', 'Mettre vos outils à disposition d’un assistant ou d’un agent IA de façon standard.', 'Standard récent ; permissions et sécurité à concevoir avec soin.'],
  ['Robot logiciel (RPA)', 'Aucune API ni export disponible.', 'Fragile aux changements d’interface ; dernier recours.'],
])}
${keep(['Webhooks pour réagir tout de suite, API pour lire et écrire, fichiers quand il n’y a rien d’autre.', 'Chaque intégration doit prévoir ce qui se passe quand un outil ne répond pas.'])}` },
    { id: 'exemples', h2: 'Exemples concrets de flux connectés', html: `
<h3>Du formulaire au devis</h3>
<p>Une demande envoyée depuis le site crée la fiche dans le CRM, vérifie le SIRET du client professionnel grâce aux données publiques, normalise l’adresse et prépare un brouillon de devis dans l’outil de facturation. Vous n’avez plus qu’à relire et envoyer.</p>
<h3>De la réservation au planning</h3>
<p>Une réservation en ligne bloque le créneau dans l’agenda de la bonne personne, envoie une confirmation au client et un rappel la veille. Une annulation libère automatiquement le créneau.</p>
<h3>De la commande à la comptabilité</h3>
<p>Une commande payée sur la boutique en ligne décrémente le stock, déclenche la préparation, génère la facture et l’écriture comptable, puis informe le client de l’expédition.</p>
<h3>Du tableau de bord au pilotage</h3>
<p>Les chiffres clés (demandes, devis signés, factures en retard) sont extraits chaque nuit de vos outils et réunis dans un tableau de bord unique, sans export manuel.</p>
${keep(['Un flux bien conçu désigne l’outil qui fait foi pour chaque donnée.', 'La relecture humaine reste possible aux étapes qui engagent l’entreprise.'])}` },
    { id: 'mcp', h2: 'MCP : brancher l’IA sur vos outils', html: `
<p>Le <strong>Model Context Protocol</strong> est un protocole ouvert présenté fin 2024, adopté depuis par plusieurs grands acteurs de l’IA. Il décrit de façon standard les outils et les données qu’on met à disposition d’un modèle d’IA. Concrètement, un « serveur MCP » exposant votre agenda ou votre CRM peut être utilisé par différents assistants, sans refaire l’intégration pour chacun.</p>
<p>C’est une brique précieuse pour les ${svc('agent-ia-chatbot', 'agents IA')} qui doivent agir dans vos logiciels, à condition de définir finement les permissions : lecture seule quand c’est suffisant, validation humaine pour les actions sensibles. Pour aller plus loin : ${veille('mcp-model-context-protocol')}.</p>` },
    { id: 'fiabilite', h2: 'Rendre une intégration fiable et sûre', html: `
<p>Une intégration qui marche le jour de la démonstration n’est pas forcément une intégration fiable. Les points qui font la différence :</p>
${ul([
  '<strong>Gestion des erreurs et reprises</strong> : si un outil est indisponible, l’échange est retenté, puis signalé ;',
  '<strong>Idempotence</strong> : une même commande reçue deux fois ne doit pas être créée deux fois ;',
  '<strong>Journalisation</strong> : chaque échange est tracé pour comprendre un écart ;',
  '<strong>Respect des quotas</strong> imposés par les API ;',
  '<strong>Sécurité des accès</strong> : clés et jetons stockés de façon sécurisée, droits minimaux, authentification OAuth quand l’outil la propose ;',
  '<strong>Surveillance</strong> : une alerte vous prévient si un flux s’arrête, avant que vos clients ne le remarquent ;',
  '<strong>Documentation</strong> : ce qui est connecté, comment, et qui contacter.',
])}` },
    { id: 'facturation', h2: 'Facturation électronique : un chantier d’intégration', html: `
<p>Avec la réforme de la facturation électronique, les factures transitent par des plateformes agréées. La réception est obligatoire pour toutes les entreprises assujetties à la TVA depuis le 1<sup>er</sup> septembre 2026, et l’émission le sera pour les PME et micro-entreprises à partir du 1<sup>er</sup> septembre 2027, selon le calendrier en vigueur. Connecter votre plateforme de facturation à votre gestion commerciale, à votre comptabilité et à vos relances est un gain direct. Voir ${veille('facturation-electronique-2026')}.</p>` },
    { id: 'methode', h2: 'Notre méthode d’intégration', html: `
${ol([
  '<strong>Inventaire</strong> de vos outils, de leurs API ou exports, et des flux de données actuels (y compris manuels).',
  '<strong>Schéma des flux</strong> : quelle donnée va où, quel outil fait foi en cas de désaccord.',
  '<strong>Développement</strong> des connecteurs et tests sur des données réelles, dans un environnement séparé.',
  '<strong>Mise en service</strong> progressive, avec surveillance renforcée au démarrage.',
  '<strong>Suivi</strong> : adaptation quand un éditeur fait évoluer son API.',
])}
<p>L’intégration est souvent la première étape d’une ${svc('automatisation-processus', 'automatisation des processus')} plus large, ou le socle d’un ${svc('logiciel-sur-mesure', 'logiciel sur-mesure')}. Pour estimer le temps perdu en ressaisies, essayez le ${outil('calculateur-automatisation')}.</p>` },
  ],
  ctaAfter: 2,
  ctaTitle: 'Quels outils aimeriez-vous voir se parler ?',
  ctaText: 'En 10 minutes, nous regardons vos logiciels et ce qui peut être connecté. Devis gratuit et personnalisé.',
  faq: [
    { q: 'Qu’est-ce qu’une intégration API ?', a: 'C’est la mise en place d’échanges automatiques de données entre logiciels via leurs interfaces de programmation (API) : par exemple, une commande du site créée automatiquement dans la gestion commerciale, puis facturée, sans ressaisie.' },
    { q: 'Comment connecter son CRM à son site internet ?', a: 'Le formulaire du site envoie les données au CRM via son API ou un webhook, en créant ou mettant à jour la fiche contact. Il faut prévoir la gestion des doublons, les champs obligatoires, le consentement RGPD et une alerte en cas d’échec.' },
    { q: 'Quelle différence entre une API et un webhook ?', a: 'Avec une API, votre système va chercher ou envoyer des données quand il le décide. Avec un webhook, c’est l’outil source qui prévient immédiatement votre système qu’un événement s’est produit (nouvelle commande, paiement reçu).' },
    { q: 'Que faire si mon logiciel n’a pas d’API ?', a: 'On peut passer par des exports de fichiers automatisés, une base de données accessible, ou en dernier recours un robot logiciel qui reproduit les actions d’un utilisateur. Ces solutions sont moins robustes qu’une API et demandent davantage de surveillance.' },
    { q: 'Qu’est-ce que le protocole MCP ?', a: 'Le Model Context Protocol est un standard ouvert, présenté fin 2024, qui décrit de façon commune les outils et données mis à disposition d’un modèle d’IA. Il permet de connecter un assistant IA à vos logiciels sans refaire l’intégration pour chaque assistant.' },
    { q: 'Combien coûte l’intégration d’une API ?', a: 'Le coût dépend du nombre d’outils à relier, de la qualité de leurs API, du volume de données et des exigences de fiabilité. Nous établissons un devis gratuit et personnalisé après un inventaire de vos outils.' },
  ],
  metiers: ['commerce-boutique', 'expert-comptable', 'hebergement-gite', 'domaine-viticole'],
  veille: ['open-data-api-gouv', 'mcp-model-context-protocol', 'facturation-electronique-2026', 'agents-ia-computer-use'],
  guides: ['relances-factures-impayees-automatiques', 'automatiser-devis-artisan'],
  form: { h2: 'Quels outils voulez-vous connecter ?', p: 'Listez-les en deux phrases. Je vous réponds avec une première piste d’intégration — gratuitement, sans engagement.', ph: 'Ex : ma boutique en ligne, mon logiciel de facturation et mon tableur de stock…', btn: 'Recevoir ma piste d’intégration →', label: 'Vos outils à connecter' },
});

/* ═══════════════════════ 8. RÉFÉRENCEMENT LOCAL ═══════════════════════ */
PAGES.push({
  slug: 'referencement-local',
  title: 'Référencement local et Google Business Profile | Groupe Solution',
  desc: 'Référencement local (SEO local) : fiche Google Business Profile, Google Maps, avis clients, pages locales, données structurées, moteurs IA. Devis gratuit.',
  crumb: 'Référencement local',
  kicker: 'Google Maps · Google Business Profile · avis · SEO local',
  h1: 'Référencement local : <em>être trouvé par les clients qui vous cherchent près de chez eux</em>.',
  lead: '« Plombier près de moi », « restaurant ouvert maintenant », « expert-comptable + ville » : ces recherches mènent à la carte Google et aux premiers résultats locaux. Voici comment fonctionne le référencement local, ce qui compte vraiment et ce qu’il vaut mieux éviter.',
  serviceName: 'Référencement local et optimisation Google Business Profile',
  serviceType: 'Référencement local (SEO local)',
  sections: [
    { id: 'definition', h2: 'Le référencement local, c’est quoi ?', html: `
<p>Le <strong>référencement local</strong> (ou <strong>SEO local</strong>) regroupe les actions qui permettent à une entreprise d’apparaître quand quelqu’un cherche un produit ou un service près de lui : dans le bloc de carte des résultats Google (souvent appelé « pack local »), dans Google Maps, et dans les résultats classiques associés à une ville ou à un quartier.</p>
<p>Pour un commerce, un artisan, un cabinet ou un restaurant, c’est souvent la source de contacts la plus directe : la personne qui cherche a généralement un besoin immédiat et une intention forte. Le référencement local repose sur deux piliers indissociables : votre <strong>fiche Google Business Profile</strong> et votre <strong>site internet</strong>.</p>` },
    { id: 'criteres', h2: 'Comment Google classe les résultats locaux', html: `
<p>Google indique lui-même que son classement local repose principalement sur trois facteurs :</p>
${ul([
  '<strong>La pertinence</strong> : votre fiche et votre site correspondent-ils à ce que la personne cherche ?',
  '<strong>La distance</strong> : à quelle distance êtes-vous du lieu de la recherche ou de la zone indiquée ?',
  '<strong>La notoriété</strong> (« prominence ») : votre entreprise est-elle connue et reconnue, en ligne comme hors ligne — avis, liens, mentions, articles ?',
])}
<p>Vous ne pouvez pas changer la distance. En revanche, vous pouvez travailler la pertinence et la notoriété, durablement. Aucun prestataire honnête ne peut garantir une première place : il peut en revanche mettre en place tout ce qui la rend possible.</p>` },
    { id: 'fiche', h2: 'Optimiser sa fiche Google Business Profile', html: `
${ul([
  '<strong>Catégorie principale</strong> juste (la plus précise possible) et catégories secondaires pertinentes ;',
  '<strong>Nom</strong> réel de l’entreprise, sans mots-clés ajoutés (c’est contraire aux règles de Google et peut entraîner une suspension) ;',
  '<strong>Adresse ou zone desservie</strong>, horaires à jour y compris les horaires exceptionnels ;',
  '<strong>Description</strong> claire de vos activités, <strong>services ou produits</strong> détaillés ;',
  '<strong>Photos réelles</strong> et récentes : locaux, équipe, réalisations ;',
  '<strong>Posts</strong> réguliers (actualités, offres, événements) et réponses aux questions ;',
  'un <strong>lien vers la bonne page</strong> de votre site, et un moyen de contact ou de réservation.',
])}
<p>Notre guide ${guide('apparaitre-google-maps-montpellier')} détaille chaque réglage, et notre ${outil('test-visibilite-google')} vous donne un premier diagnostic gratuit.</p>
${keep(['Une fiche complète, exacte et vivante est la base du référencement local.', 'N’ajoutez jamais de mots-clés dans le nom de votre fiche.'])}` },
    { id: 'avis', h2: 'Les avis clients : les obtenir, y répondre, rester dans les règles', html: `
<p>Les avis jouent à la fois sur la notoriété et sur la décision du client. La bonne pratique est simple : <strong>demander systématiquement</strong> un avis aux clients satisfaits, au bon moment (après une intervention réussie, une commande livrée), avec un lien direct. Un message automatique bien placé peut s’en charger.</p>
<p>Répondez à tous les avis, positifs comme négatifs, de façon courtoise et factuelle : ces réponses sont lues par vos futurs clients. En revanche, n’achetez jamais d’avis, ne rédigez pas de faux avis et ne conditionnez pas une remise à un avis positif : ces pratiques sont contraires aux règles de Google et la publication de faux avis constitue une pratique commerciale trompeuse au regard du droit français.</p>` },
    { id: 'pages-locales', h2: 'Des pages locales utiles, pas des pages de villes copiées-collées', html: `
<p>Une tentation fréquente consiste à créer des dizaines de pages identiques où seul le nom de la ville change. Google les considère comme des <strong>pages satellites</strong> (« doorway pages ») et ses règles anti-spam les visent explicitement : elles risquent d’affaiblir tout le site.</p>
<p>Une page locale n’a de sens que si elle apporte une information propre au lieu : zone réellement desservie, délais d’intervention, contraintes locales, réalisations dans le secteur, accès, stationnement, informations pratiques. Mieux vaut quelques pages réellement utiles qu’une centaine de pages vides.</p>
${table('Leviers du référencement local : effet et limites', ['Levier', 'Effet attendu', 'Limites'], [
  ['Fiche Google Business Profile complète', 'Pertinence et visibilité dans la carte.', 'Doit être tenue à jour ; ne suffit pas seule dans les secteurs concurrentiels.'],
  ['Avis clients réguliers', 'Notoriété et taux de clic.', 'Demande une démarche continue ; interdiction des faux avis.'],
  ['Pages de services et pages locales utiles', 'Pertinence sur les recherches « service + ville ».', 'Contenu original indispensable ; pas de copier-coller.'],
  ['Cohérence nom-adresse-téléphone', 'Confiance des moteurs dans vos informations.', 'À vérifier sur tous les annuaires et réseaux.'],
  ['Données structurées LocalBusiness', 'Compréhension de votre activité par les moteurs.', 'N’apporte pas de visibilité garantie.'],
  ['Liens et mentions locales', 'Notoriété (presse, partenaires, associations).', 'Se construit dans la durée ; éviter les liens achetés.'],
])}` },
    { id: 'technique', h2: 'Données structurées, cohérence et site internet', html: `
<p>Votre site doit confirmer ce que dit votre fiche. Trois points techniques comptent particulièrement :</p>
${ul([
  'des <strong>données structurées</strong> schema.org (LocalBusiness ou un type plus précis) qui décrivent votre nom, adresse, téléphone, horaires, zone desservie ;',
  'une <strong>cohérence stricte</strong> du nom, de l’adresse et du téléphone sur le site, la fiche, les annuaires et les réseaux sociaux ;',
  'une <strong>page par service</strong> principal, rapide et lisible sur mobile, avec un numéro cliquable.',
])}
<p>C’est pour cela que nous intégrons le référencement dès la ${svc('creation-site-internet', 'création du site internet')}.</p>` },
    { id: 'ia', h2: 'Moteurs de réponse IA : être cité par ChatGPT, Gemini ou Perplexity', html: `
<p>De plus en plus de recherches passent par des réponses générées par IA, dans les moteurs de recherche ou dans les assistants conversationnels. Ces outils s’appuient sur des sources qu’ils jugent fiables et cohérentes. Les mêmes fondamentaux aident donc : informations exactes et concordantes partout, pages qui répondent clairement aux questions que se posent vos clients (prestations, zone, délais, conditions), FAQ, avis authentiques et mentions sur des sites reconnus. Il n’existe pas de technique garantie pour être cité ; il existe en revanche de bonnes pratiques qui augmentent vos chances.</p>` },
    { id: 'zone', h2: 'Mesurer et suivre dans la durée', html: `
<p>Les statistiques de la fiche Google Business Profile (appels, demandes d’itinéraire, clics vers le site) et la Google Search Console permettent de suivre l’évolution. Le référencement local est un travail continu : une fiche abandonnée et des avis sans réponse perdent du terrain face à des concurrents actifs.</p>
<p>Nous accompagnons les entreprises de Montpellier, de l’Hérault et du Gard, et partout ailleurs en France à distance. Pour un projet local, voir aussi notre page ${SITEMTP()}.</p>
${keep(['Pertinence, distance, notoriété : travaillez les deux que vous maîtrisez.', 'Des pages locales utiles plutôt que des pages de villes dupliquées.', 'Demandez des avis régulièrement et répondez à chacun.'])}` },
  ],
  ctaAfter: 2,
  ctaTitle: 'Où en est votre visibilité locale ?',
  ctaText: 'En 10 minutes, nous regardons votre fiche, vos avis et votre site, et vous donnons les priorités. Devis gratuit et personnalisé.',
  faq: [
    { q: 'Comment apparaître en premier sur Google Maps ?', a: 'Aucune méthode ne garantit la première place, car Google classe selon la pertinence, la distance et la notoriété. Une fiche Google Business Profile complète et à jour, des avis réguliers auxquels vous répondez, un site cohérent et des pages de services utiles maximisent vos chances.' },
    { q: 'Qu’est-ce que le référencement local ?', a: 'C’est l’ensemble des actions qui permettent à une entreprise d’apparaître dans les résultats de recherche géolocalisés : pack local de Google, Google Maps et résultats associés à une ville. Il repose sur la fiche Google Business Profile, le site internet, les avis et la notoriété locale.' },
    { q: 'Comment optimiser sa fiche Google Business Profile ?', a: 'Choisissez la catégorie principale la plus précise, utilisez le nom réel de l’entreprise, tenez à jour adresse ou zone desservie et horaires, détaillez vos services, ajoutez des photos réelles, publiez régulièrement et répondez aux avis et aux questions.' },
    { q: 'Comment avoir plus d’avis Google ?', a: 'Demandez systématiquement un avis aux clients satisfaits, au bon moment, avec un lien direct. Un message automatique après une prestation peut s’en charger. N’achetez jamais d’avis et ne conditionnez aucun avantage à un avis positif.' },
    { q: 'Faut-il créer une page par ville pour le SEO local ?', a: 'Seulement si chaque page apporte une information propre au lieu (zone desservie, délais, réalisations, informations pratiques). Des pages identiques où seul le nom de la ville change sont considérées par Google comme des pages satellites et peuvent pénaliser le site.' },
    { q: 'Combien coûte le référencement local d’une entreprise ?', a: 'Le coût dépend de l’état de votre fiche et de votre site, de la concurrence dans votre secteur et du suivi souhaité. Nous établissons un devis gratuit et personnalisé après un premier diagnostic.' },
  ],
  metiers: ['restaurant', 'artisan', 'coiffeur-esthetique', 'garage-automobile', 'coach-salle-de-sport'],
  veille: ['open-data-api-gouv'],
  guides: ['apparaitre-google-maps-montpellier', 'choisir-agence-web-montpellier', 'obligations-legales-site-internet'],
  form: { h2: 'Où en est votre visibilité sur Google ?', p: 'Indiquez votre activité et votre ville. Je vous réponds avec les premières priorités — gratuitement, sans engagement.', ph: 'Ex : garage à Lunel, ma fiche Google a peu d’avis et je n’apparais pas sur la carte…', btn: 'Recevoir mes priorités →', label: 'Votre activité et votre ville' },
});

/* ═══════════════════════════════════════════════════════════
   RENDU
   ═══════════════════════════════════════════════════════════ */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = s => String(s).replace(/<[^>]+>/g, '');
const ld = obj => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');

const ORG = {
  '@type': 'Organization',
  '@id': `${SITE}/#org`,
  name: 'Groupe Solution',
  url: `${SITE}/`,
  logo: `${SITE}/Logo.svg`,
  telephone: '+33782298559',
  email: 'contact@groupsolution.fr',
  address: { '@type': 'PostalAddress', addressLocality: 'Montpellier', postalCode: '34000', addressRegion: 'Occitanie', addressCountry: 'FR' },
};
const AREA = [
  { '@type': 'Country', name: 'France' },
  { '@type': 'AdministrativeArea', name: 'Hérault' },
  { '@type': 'City', name: 'Montpellier' },
];

const STYLE = `<style>
.heroDevise .lab{min-width:max-content}
.callCard .rdv{display:block;margin-top:10px;font-size:14px;font-weight:700;color:var(--secondary);text-decoration:underline;text-underline-offset:3px}
.artSec{padding:40px 0 92px}
.art{max-width:780px;margin:0 auto;font-size:17px;line-height:1.8;color:#2B2A26;overflow-wrap:break-word}
.art h2{font-size:clamp(26px,3.4vw,36px);line-height:1.15;margin:64px 0 18px;scroll-margin-top:90px}
.art h3{font-size:21px;font-weight:600;line-height:1.3;margin:30px 0 8px}
.art p{margin:0 0 18px}
.art ul,.art ol{margin:0 0 22px;padding-left:24px}.art li{margin:0 0 8px;padding-left:4px}
.art a{color:var(--acc-d);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
.art a:hover{color:var(--ink)}
.art strong{color:var(--ink)}
.toc{background:var(--white);border:1px solid var(--line);border-radius:var(--r-m);padding:22px 26px;margin:0 0 8px}
.toc p{font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:800;color:var(--muted);margin:0 0 10px}
.toc ol{margin:0;padding-left:22px;font-size:15.5px;line-height:1.6}.toc li{margin:0 0 6px}
.toc a{color:var(--ink);text-decoration:none;font-weight:600}.toc a:hover{color:var(--acc)}
.keep{background:var(--olive-soft);border:1px solid #DDE2D5;border-radius:var(--r-m);padding:20px 24px;margin:8px 0 28px}
.keepT{font-size:12px!important;letter-spacing:.1em;text-transform:uppercase;font-weight:800;color:var(--olive2);margin:0 0 8px!important}
.keep ul{margin:0;padding-left:20px;font-size:16px;color:var(--olive2)}.keep li{margin:0 0 4px}
.tbl{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:8px 0 28px;border:1px solid var(--line);border-radius:16px;background:var(--white)}
.tbl table{border-collapse:collapse;width:100%;min-width:600px;font-size:15px;line-height:1.55}
.tbl caption{caption-side:top;text-align:left;padding:14px 16px 6px;font-weight:800;font-size:13px;color:var(--muted)}
.tbl th,.tbl td{padding:12px 16px;border-top:1px solid var(--line);text-align:left;vertical-align:top}
.tbl thead th{background:var(--sand);font-size:12.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--secondary)}
.tbl tbody th{font-weight:700;color:var(--ink);min-width:150px}
.tbl td{color:var(--secondary)}
.ctaBox{background:var(--ink);color:#fff;border-radius:var(--r-l);padding:28px 30px;margin:36px 0}
.ctaBox .ctaT{font-family:var(--serif);font-size:24px;line-height:1.25;margin:0 0 8px;color:#fff}
.ctaBox p{color:#D9D6CE;margin:0 0 18px;font-size:16px}
.ctaBtns{display:flex;flex-wrap:wrap;gap:10px}
.ctaBox .btn{padding:13px 20px;font-size:15px;text-decoration:none;color:#fff}
.ctaBox .btn.dark{background:#fff;color:var(--ink)}
.ctaBox .btn.ghost{color:#fff;border-color:rgba(255,255,255,.35)}
.case a.more{display:inline-block;margin-top:14px;font-weight:800;font-size:14px;color:var(--ink);border-bottom:2px solid var(--acc)}
.case h3 a:hover{color:var(--acc)}
.res{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.res div{background:var(--white);border:1px solid var(--line);border-radius:var(--r-m);padding:22px}
.res h3{font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-family:var(--sans);font-weight:800;color:var(--muted);margin-bottom:10px}
.res ul{list-style:none;display:grid;gap:8px;font-size:14.5px}
.res a{font-weight:600;color:var(--ink)}.res a:hover{color:var(--acc)}
.zoneTxt{max-width:820px;margin:34px auto 0;text-align:center;color:var(--secondary);font-size:16px;line-height:1.7}
.zoneTxt a{color:var(--ink);font-weight:700;border-bottom:1px solid var(--acc)}
@media(max-width:960px){.res{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.res{grid-template-columns:1fr}.art{font-size:16.5px}.ctaBox{padding:24px 20px}.ctaBtns{flex-direction:column}.ctaBtns .btn{width:100%}.toc{padding:18px 18px}}

.gs-sticky{display:none}
@media(max-width:760px){
  .gs-sticky{display:flex;position:fixed;left:10px;right:10px;bottom:10px;z-index:900;gap:8px;background:rgba(23,22,19,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:8px;border-radius:18px;box-shadow:0 14px 40px rgba(0,0,0,.28)}
  .gs-sticky a,.gs-sticky button{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:13px 10px;border-radius:12px;font:800 14px/1 inherit;font-family:inherit;text-decoration:none;border:0;cursor:pointer}
  .gs-sticky .s1{background:#fff;color:#171613}
  .gs-sticky .s2{background:#E61E4D;color:#fff}
  body{padding-bottom:84px}
}
</style>`;

function head({ title, desc, url, jsonld }) {
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
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  ${FONTS}
  <link rel="stylesheet" href="../assets/holding-local.css" />
  ${STYLE}
  <script type="application/ld+json">
${ld(jsonld)}
  </script>
</head>
<body>
<header class="nav"><div class="wrap navin"><a class="brand" href="../index.html" aria-label="Groupe Solution — accueil"><img src="../Logo.svg" alt="Groupe Solution" /></a><nav class="links"><a href="./">Services</a><a href="../automatisation/">Automatisation</a><a href="../montpellier/site-internet-montpellier.html">Sites internet</a><a href="../lab/">Lab</a><a class="cta" href="#contact">Discutons 10 min</a></nav></div></header>
<main>`;
}

function hero({ kicker, h1, lead }) {
  return `
  <section class="hero"><div class="wrap heroGrid">
    <div>
      <div class="kicker reveal">${kicker}</div>
      <h1 class="reveal">${h1}</h1>
      <p class="lead reveal">${lead}</p>
      <div class="heroDevise reveal"><span class="lab">Nos devis</span><b>Sur devis, gratuit et personnalisé. Montpellier, partout en France et dans les DOM-TOM.</b></div>
    </div>
    <div class="reveal"><div class="callCard">
      <span class="callBadge">10 minutes suffisent</span>
      <h2>Parlons de votre projet, sans engagement.</h2>
      <p class="sub">Un appel direct avec l’équipe. Vous repartez avec des pistes concrètes.</p>
      <a class="btn" href="${TEL}">Appeler le ${TEL_TXT} →</a>
      <a class="alt" href="#contact">ou décrire mon besoin par écrit</a>
      <a class="rdv" href="${RDV}">Réserver une visio de 10 min</a>
      <span class="micro">Réponse sous 24 h, souvent le jour même</span>
    </div></div>
  </div></section>`;
}

function contactForm(page, f) {
  return `
  <section class="sec alt" id="contact"><div class="wrap">
    <div class="express reveal" id="express">
      <div class="kicker" style="display:flex;width:max-content;margin:0 auto 16px">Réponse sous 24 h</div>
      <h2>${f.h2}</h2>
      <p>${f.p}</p>
      <form id="expressForm" action="https://formspree.io/f/mzebrvjg" method="POST">
        <input type="hidden" name="page" value="${page}" />
        <label class="full">${f.label}<textarea name="message" required placeholder="${esc(f.ph)}"></textarea></label>
        <label>Votre nom<input name="nom" autocomplete="name" required /></label>
        <label>Téléphone ou email<input name="contact" autocomplete="email" required /></label>
        <label class="full">Votre activité (optionnel)<input name="entreprise" placeholder="Votre secteur" /></label>
        <button class="btn" type="submit">${f.btn}</button>
      </form>
      <p class="alts">Vous préférez parler ? <a href="${TEL}">${TEL_TXT}</a> · <a href="${RDV}">Réserver une visio de 10 min</a></p>
    </div>
  </div></section>`;
}

const FOOT = `
</main>
<footer><div class="wrap foot">
  <span class="footBrand"><img src="../Logo.svg" alt="Groupe Solution" /> © <span id="year"></span> Groupe Solution · Montpellier</span>
  <nav>
    <a href="../index.html">Accueil</a>
    <a href="./">Services</a>
    <a href="../automatisation/">Automatisation</a>
    <a href="../solutions.html">Solutions</a>
    <a href="../realisations.html">Réalisations</a>
    <a href="../montpellier/site-internet-montpellier.html">Sites internet</a>
    <a href="../echanger.html">Échanger</a>
    <a href="../plan-du-site.html">Plan du site</a>
  </nav>
</div></footer>
<div class="gs-sticky"><a class="s1" href="${TEL}">📞 Appeler</a><a class="s2" href="#contact">Discutons 10 min</a></div>
<script src="../assets/holding-local.js" defer></script>
<script src="/analytics.js" defer></script>
</body>
</html>
`;

const ZONE = `<p class="zoneTxt">Basés à Montpellier, nous intervenons dans toute la métropole, dans l’Hérault et le Gard, partout en France à distance et dans les DOM-TOM (<a href="../implantations.html">nos implantations</a>). Chaque projet est sur devis, gratuit et personnalisé.</p>`;

function faqHtml(faq) {
  return `
  <section class="sec alt"><div class="wrap">
    <div class="secHead center reveal"><div class="kicker">Questions fréquentes</div><h2>Vos questions, nos réponses.</h2></div>
    <div class="faq">
${faq.map(f => `      <details class="reveal"><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n')}
    </div>
  </div></section>`;
}

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
        provider: ORG,
        areaServed: AREA,
        offers: { '@type': 'Offer', description: 'Sur devis, gratuit et personnalisé' },
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
        mainEntity: p.faq.map(f => ({ '@type': 'Question', name: strip(f.q), acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } })),
      },
    ],
  };

  const toc = `<nav class="toc" aria-label="Sommaire"><p>Sommaire</p><ol>${p.sections.map(s => `<li><a href="#${s.id}">${s.h2}</a></li>`).join('')}<li><a href="#faq">Questions fréquentes</a></li></ol></nav>`;
  const body = p.sections.map((s, i) => {
    let h = `<h2 id="${s.id}">${s.h2}</h2>${s.html}`;
    if (i === p.ctaAfter) h += ctaBox(p.ctaTitle, p.ctaText);
    return h;
  }).join('\n');

  const others = SERVICES.filter(s => s.slug !== p.slug);
  const related = `
  <section class="sec alt"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">Nos autres services</div><h2>Tout ce qu’un éditeur de logiciels peut faire pour vous.</h2><p>Sites internet, intelligence artificielle, automatisation et logiciels sur-mesure : des briques qui se combinent. <a class="go" href="./">Voir tous nos services</a></p></div>
    <div class="cases">
${others.map((s, i) => `      <article class="case reveal"><div class="n">${i + 1}</div><h3><a href="${s.slug}.html">${s.name}</a></h3><p>${s.blurb}</p><a class="more" href="${s.slug}.html">En savoir plus →</a></article>`).join('\n')}
    </div>
  </div></section>`;

  const li = (href, t) => `<li><a href="${href}">${t}</a></li>`;
  const resources = `
  <section class="sec"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">Pour aller plus loin</div><h2>Guides, veille et outils gratuits.</h2><p>Pour préparer votre projet, voir notre hub ${HUB()} et notre offre de ${SITEMTP()}.</p></div>
    <div class="res">
      <div class="reveal"><h3>Selon votre métier</h3><ul>${p.metiers.map(m => li(`../montpellier/site-internet-${m}-montpellier.html`, METIERS[m])).join('')}</ul></div>
      <div class="reveal"><h3>Articles de veille</h3><ul>${p.veille.map(v => li(`../lab/veille/${v}.html`, VEILLE[v])).join('')}</ul></div>
      <div class="reveal"><h3>Guides pratiques</h3><ul>${p.guides.map(g => li(`../montpellier/guides/${g}.html`, GUIDES[g])).join('')}</ul></div>
      <div class="reveal"><h3>Outils gratuits</h3><ul>${Object.keys(OUTILS).map(o => li(`../outils/${o}.html`, OUTILS[o])).join('')}${li('../automatisation/', 'Hub automatisation')}</ul></div>
    </div>
    ${ZONE}
  </div></section>`;

  return head({ title: p.title, desc: p.desc, url, jsonld }) + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <a href="./">Services</a> › <span>${p.crumb}</span></div>
${hero(p)}
  <section class="artSec"><div class="wrap">
    <article class="art">
${toc}
${body}
${ctaBox('Prêt à en parler ?', 'Appelez-nous, écrivez-nous en deux phrases ou réservez une visio de 10 minutes. Le devis est gratuit et personnalisé.')}
    </article>
  </div></section>
${related}
${resources}
${faqHtml(p.faq).replace('<section class="sec alt">', '<section class="sec alt" id="faq">')}
${contactForm(`services/${p.slug}`, p.form)}
${FOOT}`;
}

function renderIndex() {
  const url = BASE;
  const title = 'Nos services : sites, IA, automatisation | Groupe Solution';
  const desc = 'Nos services : création de site internet, intégration de l’IA, automatisation, logiciel sur-mesure, agents IA et vocaux, API, SEO local. Devis gratuit.';
  const faq = [
    { q: 'Quels services propose Groupe Solution ?', a: 'Création de sites internet, intégration de l’intelligence artificielle, automatisation des processus, logiciels et applications métier sur-mesure, agents IA et chatbots, agents vocaux, intégration d’API et référencement local.' },
    { q: 'Où intervenez-vous ?', a: 'Nous sommes basés à Montpellier et intervenons dans l’Hérault et le Gard, partout en France à distance et dans les DOM-TOM.' },
    { q: 'Combien coûtent vos services ?', a: 'Chaque projet est sur devis, gratuit et personnalisé, établi après un court échange pour comprendre votre besoin.' },
  ];
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${url}#page`, name: 'Nos services', url, description: desc,
        isPartOf: { '@type': 'WebSite', name: 'Groupe Solution', url: `${SITE}/` },
        about: ORG,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: SERVICES.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: `${BASE}${s.slug}.html` })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };
  return head({ title, desc, url, jsonld }) + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <span>Services</span></div>
${hero({
  kicker: 'Sites internet · IA · automatisation · logiciels',
  h1: 'Nos services : sites internet, IA, automatisation <em>et logiciels sur-mesure</em>.',
  lead: 'Groupe Solution est un éditeur de logiciels et d’automatisations sur-mesure, qui crée aussi des sites internet. Nous exploitons nos propres plateformes en production — Solution Recrutement (plus de 565 000 offres), Solution Alternance (plus de 200 000 offres, matching par IA) et Aides Particuliers — et mettons ce savoir-faire au service des TPE et PME.',
})}
  <section class="sec alt"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">8 services</div><h2>Ce que nous faisons pour vous.</h2><p>Chaque service a sa page complète : méthode, options, limites, obligations et questions fréquentes. Sans jargon et sans promesse intenable.</p></div>
    <div class="cases">
${SERVICES.map((s, i) => `      <article class="case reveal"><div class="n">${i + 1}</div><h3><a href="${s.slug}.html">${s.name}</a></h3><p>${s.blurb}</p><a class="more" href="${s.slug}.html">Découvrir →</a></article>`).join('\n')}
    </div>
  </div></section>
  <section class="sec"><div class="wrap">
    <div class="secHead reveal"><div class="kicker">Notre façon de travailler</div><h2>Partir de votre problème, pas d’une technologie.</h2></div>
    <div class="steps">
      <div class="step reveal"><h3>Échange de 10 min</h3><p>Nous comprenons votre activité et ce qui vous fait perdre du temps ou des clients.</p></div>
      <div class="step reveal"><h3>Proposition écrite</h3><p>Périmètre, calendrier, propriété, suivi : tout est écrit. Devis gratuit et personnalisé.</p></div>
      <div class="step reveal"><h3>Première version</h3><p>Une version utile rapidement, testée sur vos cas réels, puis améliorée.</p></div>
      <div class="step reveal"><h3>Suivi dans la durée</h3><p>Mesure des résultats, maintenance, évolutions selon vos besoins.</p></div>
    </div>
    ${ZONE}
    <p class="zoneTxt">Voir aussi : ${HUB('notre hub automatisation')} · ${SITEMTP('sites internet à Montpellier')} · <a href="../outils/">nos outils gratuits</a> · <a href="../lab/veille/">notre veille</a> · <a href="../montpellier/guides/">nos guides</a></p>
  </div></section>
${faqHtml(faq)}
${contactForm('services/index', { h2: 'Parlez-nous de votre besoin', p: 'Deux phrases suffisent. Je vous réponds avec une première piste concrète — gratuitement, sans engagement.', ph: 'Ex : je veux un site qui fasse appeler et automatiser mes devis…', btn: 'Recevoir ma première piste →', label: 'Votre besoin' })}
${FOOT}`;
}

/* ── Écriture ─────────────────────────────────────────────── */
mkdirSync(OUT_DIR, { recursive: true });
for (const p of PAGES) {
  writeFileSync(join(OUT_DIR, `${p.slug}.html`), renderPage(p));
  console.log(`services/${p.slug}.html`);
}
writeFileSync(join(OUT_DIR, 'index.html'), renderIndex());
console.log('services/index.html');
