/* ═══════════════════════════════════════════════════════════
   COULISSES — « Comment ce site fonctionne ». Tout ce qui est écrit ici doit rester VRAI :
   les chiffres sont calculés à la génération (index de l'assistant, sitemap, communes).
   Produit : /lab/coulisses.html   ·   Lancer : node zones/generate-coulisses.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { COMMUNES } from './montpellier-communes.mjs';
import { head, foot } from './generate-actus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const idx = JSON.parse(readFileSync(join(ROOT, 'assets', 'site-index.json'), 'utf8'));
const urls = (readFileSync(join(ROOT, 'sitemap.xml'), 'utf8').match(/<loc>/g) || []).length;
const nIdees = existsSync(join(ROOT, 'content', 'idees', 'secteurs.json')) ? JSON.parse(readFileSync(join(ROOT, 'content', 'idees', 'secteurs.json'), 'utf8')).secteurs.reduce((a, s) => a + s.idees.length, 0) : 0;
const fmt = n => n.toLocaleString('fr-FR');

const BLOCS = [
  ['01', 'Une conversation plutôt qu’un menu', `L’accueil n’est pas une vitrine : c’est une question. Le visiteur décrit son entreprise, et un assistant propulsé par Claude (Anthropic) lui répond en s’appuyant sur ${fmt(idx.n)} passages extraits de nos ${fmt(idx.c ? new Set(idx.c.map(c => c.u)).size : 0)} pages, sélectionnés à chaque question par un moteur de recherche qui tourne dans le navigateur. S’il n’y a pas de clé d’IA, le même moteur répond seul, gratuitement. Une conduite de conversation lui dit quand aller droit au but et quand poser une question de plus.`, ['Claude Opus 5.5', 'Recherche locale type BM25', 'Repli sans IA']],
  ['02', 'Des plans et des maquettes générés en direct', `Après le premier échange, le visiteur peut demander un plan d’innovation (un flux d’étapes, une idée phare, un premier pas) ou une esquisse de son futur site. L’IA répond en JSON validé par un schéma, puis le navigateur le dessine. Côté serveur, des garde-fous rejettent tout prix, plafonnent les longueurs et n’autorisent que des pages existantes du site.`, ['Sorties structurées', 'Interface générative', 'Garde-fous serveur']],
  ['03', 'Un site qui s’adapte, sans pistage', `Le site devine la commune du visiteur à partir de sa connexion, sans la conserver, et retient dans le navigateur uniquement les pages qu’il a lues ici. Il propose alors la page de sa commune, la prochaine étape la plus utile, ou un appel au bon moment de la journée. Avec l’accord explicite du visiteur, une IA réécrit même le titre et l’accroche de certaines pages pour lui. Chaque suggestion a un bouton « Pourquoi ? » et un interrupteur.`, ['Géolocalisation approximative', 'Stockage local', 'Consentement explicite']],
  ['04', 'Une rédaction qui publie chaque matin, et qui vérifie', `Un agent publie chaque jour les actualités de l’IA et du numérique utiles aux entreprises, un dossier de fond le lundi et une question de dirigeant le mardi et le jeudi. Règle : chaque fait doit être confirmé par au moins deux sources indépendantes. Un script refuse la publication si une source manque, si un prix ou un client apparaît, ou si le sujet a déjà été traité.`, ['Publication automatique', '2 sources minimum', 'Contrôle avant mise en ligne']],
  ['05', 'Le pouls des dirigeants', `Sous chaque actualité, les lecteurs votent en un clic : utile, à surveiller, pas pour moi. Les résultats s’affichent en direct. L’adresse IP n’est jamais stockée : seule une empreinte irréversible sert à éviter les doublons, et elle s’efface après 30 jours.`, ['Votes en direct', 'Empreinte SHA-256 salée', 'Redis serverless']],
  ['06', 'Un laboratoire d’idées qui se nourrit tout seul', `${nIdees ? fmt(nIdees) + ' idées d’innovation classées par secteur, et un' : 'Un'} fil en direct : quand un visiteur fait générer son plan d’innovation, il peut en publier une version anonyme, rédigée par l’IA sans aucun nom ni détail identifiant. Les idées s’accumulent par secteur et par territoire.`, ['Publication anonyme', 'Par secteur et par zone', 'Temps réel']],
  ['07', `${COMMUNES.length} communes, ${COMMUNES.length} illustrations, zéro photo de banque d’images`, `Chaque commune a ses pages et sa propre affiche : paysage (mer, étang, vignes, garrigue, montagne) et monument emblématique sont déduits de sa description, dessinés en SVG par du code, puis convertis en image. Les textes locaux sont écrits commune par commune, et un contrôle mesure la part de texte unique de chaque page.`, ['Art génératif SVG', 'Contenu unique mesuré', `${fmt(urls)} URL dans le sitemap`]],
  ['08', 'Des données ouvertes, en direct', `Météo, état de la mer, informations légales des entreprises, adresses : le site interroge en direct des services publics gratuits et montre, sur de vraies démonstrations, ce qu’on peut construire avec.`, ['Open data', 'API publiques', 'Démonstrations en direct']],
  ['09', 'Une mise en ligne surveillée par un robot', `À chaque publication, un robot attend le déploiement, vérifie que les pages clés, l’assistant, les formulaires et les votes répondent, puis signale les pages nouvelles aux moteurs de recherche compatibles avec IndexNow. Les demandes de contact partent par e-mail, avec un service de secours si le premier ne répond pas.`, ['GitHub Actions', 'IndexNow', 'Double canal d’envoi']]
];

const url = `${HOLDING}/lab/coulisses.html`;
const title = 'Comment ce site fonctionne : IA, génération en direct, sans pistage | Groupe Solution';
const desc = 'Les coulisses de groupsolution.fr : assistant IA, plans et maquettes générés en direct, personnalisation sans pistage, publication vérifiée chaque matin, art génératif.';
const jsonld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'TechArticle', headline: 'Comment ce site fonctionne', description: desc, url, inLanguage: 'fr-FR', author: { '@type': 'Organization', name: 'Groupe Solution' }, publisher: { '@type': 'Organization', name: 'Groupe Solution', logo: { '@type': 'ImageObject', url: HOLDING + '/Logo.svg' } } },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' }, { '@type': 'ListItem', position: 2, name: 'Lab', item: HOLDING + '/lab/' }, { '@type': 'ListItem', position: 3, name: 'Coulisses', item: url }] }] };
const CSS = `<style>
.coHero{background:radial-gradient(60% 90% at 85% 0%,rgba(182,156,255,.16),transparent 60%),radial-gradient(60% 90% at 10% 0%,rgba(230,30,77,.12),transparent 60%)}
.coList{display:grid;gap:16px;max-width:900px;margin:0 auto}
.coItem{display:grid;grid-template-columns:70px 1fr;gap:18px;background:var(--white);border:1px solid var(--line);border-radius:var(--r-l);padding:24px;box-shadow:var(--sh-s)}
.coItem .n{font-family:var(--serif);font-size:38px;line-height:1;background:linear-gradient(135deg,#E61E4D,#B69CFF);-webkit-background-clip:text;background-clip:text;color:transparent}
.coItem h2{font-size:clamp(20px,2.4vw,26px);margin:0 0 8px}.coItem p{margin:0;color:var(--secondary);line-height:1.7;font-size:15.5px}
.coItem .t{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.coItem .t i{font-style:normal;font-size:12px;font-weight:700;border:1px solid var(--line2);border-radius:999px;padding:4px 10px}
@media(max-width:600px){.coItem{grid-template-columns:1fr;gap:6px}}
</style>`;
const html = head({ title, desc, url, jsonld, pre: '../', ogType: 'article' }).replace('</head>', CSS + '</head>') + `
  <div class="wrap crumbs"><a href="../index.html">Groupe Solution</a> › <a href="./">Lab</a> › <span>Coulisses</span></div>
  <section class="hero coHero" style="padding-bottom:26px"><div class="wrap day" style="text-align:center">
    <div class="kicker reveal">Coulisses · transparence totale</div>
    <h1 class="reveal" style="margin-top:16px">Comment ce site fonctionne.</h1>
    <p class="lead reveal" style="margin-left:auto;margin-right:auto">Ce site est notre meilleure démonstration : tout ce qu’il fait, nous pouvons le construire pour vous. Voici ce qui tourne sous le capot.</p>
  </div></section>
  <section class="sec" style="padding-top:6px"><div class="wrap">
    <div class="coList">
${BLOCS.map(([n, h, p, t]) => `      <article class="coItem reveal"><span class="n">${n}</span><div><h2>${h}</h2><p>${p}</p><div class="t">${t.map(x => `<i>${x}</i>`).join('')}</div></div></article>`).join('\n')}
    </div>
    <div class="archive" style="max-width:900px"><a href="../#heroAI">Essayer l’assistant<span>page d’accueil</span></a><a href="../idees/">Le Laboratoire d’idées<span>en direct</span></a><a href="../confidentialite.html">Vos données<span>confidentialité</span></a></div>
  </div></section>` + foot('../', 'coulisses');
writeFileSync(join(ROOT, 'lab', 'coulisses.html'), html, 'utf8');
console.log('✓ lab/coulisses.html');
