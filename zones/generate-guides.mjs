/* ═══════════════════════════════════════════════════════════
   Guides longs « Montpellier » — contenu informationnel + conversion.
   Produit : /montpellier/guides/{slug}.html + /montpellier/guides/index.html
   (charte silo : ../montpellier.css + ../communes.css, styles article inline)

   Lancer :  node zones/generate-guides.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'montpellier', 'guides');
const SITE = 'https://www.groupsolution.fr';
const BASE = `${SITE}/montpellier/guides/`;
const DATE = '2026-09-29';

/* ── Liens utilisés dans les contenus ─────────────────────── */
const L = {
  offre: '../site-internet-montpellier.html',
  auto: '../../automatisation/',
  config: '../../outils/configurateur-site-internet.html',
  visi: '../../outils/test-visibilite-google.html',
  calc: '../../outils/calculateur-automatisation.html',
  rdv: 'https://www.groupsolution.fr/echanger.html#rendez-vous',
  tel: 'tel:+33782298559',
};
const commune = (slug, name) => `<a href="../site-internet-${slug}.html">${name}</a>`;
const guide = (slug, text) => `<a href="${slug}.html">${text}</a>`;

/* ── Petits composants de contenu ─────────────────────────── */
const box = (items, title = 'À retenir') =>
  `<aside class="g-box"><p class="g-box-t">${title}</p><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></aside>`;

const note = html => `<aside class="g-note">${html}</aside>`;

const table = (head, rows, caption = '') =>
  `<div class="g-table"><table>${caption ? `<caption>${caption}</caption>` : ''}<thead><tr>${head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

const cta = ({ title, text, href, label, href2, label2 }) =>
  `<div class="g-cta"><p class="g-cta-t">${title}</p><p>${text}</p><div class="g-cta-b"><a class="btn btn-primary" href="${href}">${label}</a>${href2 ? `<a class="btn btn-secondary" href="${href2}">${label2}</a>` : ''}</div></div>`;

const GUIDES = [];

/* ═══════════════ 1. PRIX D'UN SITE INTERNET ═══════════════ */
GUIDES.push({
  slug: 'prix-site-internet-montpellier',
  title: "Prix d'un site internet à Montpellier : lire un devis | GroupSolution",
  description: "Prix d'un site internet à Montpellier : les facteurs qui font varier un devis, les coûts récurrents à identifier, les pièges et la méthode pour comparer.",
  h1: "Prix d'un site internet à Montpellier : ce qui fait varier le devis",
  short: "Périmètre, contenus, fonctionnalités, intégrations, suivi, propriété : les facteurs qui font varier un devis et la méthode pour les comparer.",
  intro: `<p>Vous avez demandé plusieurs devis pour votre site et les montants n'ont rien à voir entre eux, pour ce qui ressemble pourtant au même projet. C'est la situation la plus courante chez les artisans, commerçants et indépendants que nous rencontrons à Montpellier, et elle n'a rien d'anormal : le mot « site internet » recouvre des réalités très différentes.</p>
<p>Plutôt que de vous donner des fourchettes qui ne correspondront jamais exactement à votre situation, ce guide vous explique <strong>ce qui fait réellement varier un devis</strong>, les dépenses récurrentes que l'on oublie presque toujours, les pièges à éviter et une méthode simple pour comparer des propositions qui ne se ressemblent pas.</p>`,
  sections: [
    { id: 'pourquoi-ecarts', h2: 'Pourquoi deux devis peuvent être si différents', html: `
<p>Un devis de site internet est d'abord un devis de <strong>temps passé</strong> et de <strong>responsabilités prises</strong>. Deux prestataires peuvent employer les mêmes mots (« site vitrine », « responsive », « optimisé pour Google ») et ne pas prévoir du tout le même travail derrière.</p>
<p>L'un part d'un thème prêt à l'emploi, vous laisse écrire les textes et s'arrête à la mise en ligne. L'autre conçoit une structure pensée pour votre métier, rédige les contenus, configure votre fiche Google, relie le formulaire à vos outils et assure le suivi. Les deux devis peuvent être parfaitement honnêtes. Ils ne vendent simplement pas la même chose.</p>
<p>La bonne question n'est donc pas « combien coûte un site ? », mais « qu'est-ce que ce devis comprend, et qu'est-ce qu'il ne comprend pas ? ».</p>
${box([
  "Comparez ce qui est inclus, pas seulement le montant final.",
  "Un devis bas n'est pas suspect s'il est clair sur ce qu'il exclut ; un devis vague l'est davantage.",
  "Le contenu, les fonctionnalités et l'après-mise en ligne expliquent l'essentiel des écarts.",
])}` },
    { id: 'facteurs', h2: 'Les 7 facteurs qui font varier un devis', html: `
<p>Voici les facteurs que nous retrouvons dans pratiquement tous les projets, avec leur poids habituel sur le devis et la question à poser au prestataire pour y voir clair.</p>
${table(['Facteur', 'Impact sur le devis', 'Question à poser'], [
  ['Périmètre (pages, parcours)', 'Moyen', 'Combien de pages et de parcours différents sont prévus, précisément ?'],
  ['Contenus (textes, photos, vidéos)', 'Fort', 'Qui rédige, qui fournit et retouche les visuels ?'],
  ['Fonctionnalités', 'Fort', 'Quelles fonctionnalités exactes, listées une par une ?'],
  ['Intégrations avec vos outils', 'Moyen à fort', 'Le site sera-t-il relié à mon agenda, ma facturation, mon CRM ?'],
  ['Design (thème adapté ou création)', 'Moyen', 'Part-on d\'un modèle existant ou d\'une maquette dédiée ?'],
  ['Délais', 'Faible à moyen', 'Le délai demandé implique-t-il une majoration ou des compromis ?'],
  ['Suivi et propriété', 'Moyen', 'Qu\'est-ce qui est inclus après la livraison, et à qui appartient quoi ?'],
], "Poids indicatif, variable selon les projets")}
<h3>1. Le périmètre</h3>
<p>Le nombre de pages compte moins qu'on le croit. Ce qui pèse, c'est le nombre de <strong>parcours différents</strong> : un visiteur qui veut un devis, un autre qui veut réserver, un troisième qui cherche vos horaires. Chaque parcours demande une réflexion, des contenus et des tests. Pour un artisan de ${commune('castelnau-le-lez', 'Castelnau-le-Lez')} ou un cabinet de ${commune('lattes', 'Lattes')}, un site court mais bien construit suffit souvent.</p>
<h3>2. Les contenus</h3>
<p>C'est le facteur le plus sous-estimé. Rédiger des textes clairs, adaptés à la recherche locale et à votre clientèle, prend du temps. Organiser une séance photo aussi. Si vous fournissez tout, le devis baisse ; si le prestataire s'en charge, il monte, et c'est généralement là que se joue la qualité du résultat.</p>
<h3>3. Les fonctionnalités</h3>
<p>Un formulaire de contact n'a rien à voir avec une réservation connectée à un agenda, un paiement en ligne, un espace client ou un calcul automatique de devis. Chaque fonctionnalité doit être listée, décrite et testée. Méfiez-vous des lignes du type « module de réservation » sans aucun détail sur les règles (durées, acomptes, annulations).</p>
<h3>4. Les intégrations</h3>
<p>Relier le site à vos outils (agenda, logiciel de devis et facturation, CRM, messagerie SMS) évite les ressaisies et fait gagner du temps chaque semaine. C'est aussi un travail spécifique, qui dépend de ce que vos outils permettent. Un prestataire sérieux vous dira ce qui est possible, ce qui ne l'est pas, et ce qui nécessite un abonnement tiers.</p>
<h3>5. Le design</h3>
<p>Un thème existant bien adapté donne souvent un excellent résultat pour une activité locale. Une création sur mesure se justifie quand l'image de marque est centrale ou que les parcours sont atypiques. Ni l'un ni l'autre n'est « meilleur » : l'important est de savoir ce qui est prévu.</p>
<h3>6. Les délais</h3>
<p>Un délai très court peut impliquer une majoration, ou des compromis sur les contenus et les tests. Dans les faits, le délai dépend souvent davantage de la remise de vos textes, photos et validations que du travail du prestataire.</p>
<h3>7. Le suivi et la propriété</h3>
<p>Hébergement, mises à jour, sauvegardes, modifications, référencement dans la durée : certains l'incluent, d'autres le facturent à part, d'autres ne le proposent pas. Et à la fin, qui possède le nom de domaine, le site, les comptes Google ? Ce facteur n'apparaît pas toujours dans le montant de départ, mais il pèse lourd sur plusieurs années.</p>` },
    { id: 'couts-recurrents', h2: 'Les coûts récurrents à identifier dès le départ', html: `
<p>Le devis de création n'est que la première ligne. Voici les postes qui reviennent ensuite, et qu'une proposition sérieuse doit au minimum mentionner, même si elle ne les facture pas elle-même.</p>
${table(['Poste', 'Récurrence', 'Ce qu\'il faut vérifier'], [
  ['Nom de domaine', 'Annuelle', 'Enregistré à votre nom, renouvellement automatique activé.'],
  ['Hébergement', 'Mensuelle ou annuelle', 'Qui le gère, où sont les serveurs, quelles sauvegardes ?'],
  ['Maintenance (mises à jour, sécurité)', 'Mensuelle ou à l\'intervention', 'Indispensable sur un CMS comme WordPress : qui s\'en charge ?'],
  ['Abonnements tiers (réservation, paiement, e-mailing)', 'Mensuelle, parfois à la transaction', 'Quels outils, à quel nom, résiliables comment ?'],
  ['Modifications après livraison', 'Ponctuelle', 'Combien de retouches incluses, comment sont facturées les suivantes ?'],
  ['Contenus (photos, textes, pages locales)', 'Ponctuelle', 'Prévu dans le devis ou à votre charge ?'],
])}
<p>Le poste le plus piégeux reste la <strong>maintenance</strong>. Un site WordPress non mis à jour pendant longtemps devient une cible pour les attaques automatisées. Si votre devis ne dit rien à ce sujet, posez la question : qui fait les mises à jour, à quelle fréquence, et qui répare si le site tombe ?</p>
${box([
  "Comparez le coût total sur plusieurs années : création + récurrent.",
  "Nom de domaine et comptes doivent être à votre nom, ou transférables sans condition.",
  "Photos et textes pèsent souvent plus sur les résultats que le choix de la technologie.",
])}` },
    { id: 'comparer', h2: 'Comment comparer deux devis qui ne se ressemblent pas', html: `
<p>Posez les devis côte à côte et vérifiez, ligne par ligne, les points suivants. Si une réponse manque, demandez-la par écrit.</p>
<ol>
<li><strong>Périmètre</strong> : pages, parcours et fonctionnalités listés un par un, nombre d'allers-retours de corrections inclus.</li>
<li><strong>Contenu</strong> : qui rédige, qui fournit et retouche les photos, qui intègre les mentions légales et la politique de confidentialité.</li>
<li><strong>Propriété</strong> : à qui appartiennent le nom de domaine, le code, les contenus et les comptes (hébergement, Google Business Profile, Search Console) ?</li>
<li><strong>Référencement</strong> : balises, vitesse, données structurées, fiche Google. « Optimisé SEO » sans détail ne veut rien dire.</li>
<li><strong>Après la livraison</strong> : maintenance, hébergement, délai d'intervention en cas de panne, conditions d'une modification.</li>
<li><strong>Engagement</strong> : durée minimale, conditions de résiliation, ce que vous récupérez si vous partez.</li>
</ol>
<p>Un conseil pratique : envoyez la <strong>même description de projet</strong> à chaque prestataire. Sans base commune, vous comparez des projets différents, pas des prix. Notre guide ${guide('choisir-agence-web-montpellier', 'pour choisir son agence web à Montpellier')} détaille les douze questions à poser avant de signer.</p>` },
    { id: 'pieges', h2: 'Les pièges les plus fréquents', html: `
<ul>
<li><strong>Le « site offert » contre un long abonnement</strong> : sur la durée, ce modèle revient souvent plus cher qu'une création payée une fois, et le site n'est pas toujours récupérable à la fin. Ce n'est pas illégal, mais il faut le choisir en connaissance de cause.</li>
<li><strong>Le nom de domaine au nom du prestataire</strong> : vous en dépendez pour toujours, et un changement d'agence devient compliqué.</li>
<li><strong>Le devis sans liste de fonctionnalités</strong> : tout ce qui n'est pas écrit sera discuté (et souvent facturé) plus tard.</li>
<li><strong>Les options gadgets</strong> : animations lourdes, carrousels, chat qui ne répond pas. Elles ralentissent le site et n'aident pas à convertir.</li>
<li><strong>Les promesses de position sur Google</strong> : personne ne contrôle l'algorithme. Un prestataire peut s'engager sur des actions, pas sur un classement.</li>
<li><strong>L'oubli du légal</strong> : mentions légales, cookies, confidentialité. C'est votre responsabilité d'éditeur ; vérifiez que c'est prévu (voir notre guide ${guide('obligations-legales-site-internet', 'sur les obligations légales d\'un site pro')}).</li>
</ul>
${box([
  "Tout ce qui n'est pas écrit dans le devis n'est pas inclus.",
  "Méfiez-vous des garanties de résultat sur Google.",
  "Vérifiez ce que vous récupérez en cas de départ : domaine, contenus, accès.",
], 'À retenir')}` },
    { id: 'notre-approche', h2: 'Comment nous établissons un devis chez GroupSolution', html: `
<p>Chez nous, <strong>tout est sur devis, gratuit et personnalisé</strong>. Pas de grille affichée, parce que deux projets qui portent le même nom n'ont presque jamais le même périmètre : un site vitrine pour un restaurant de ${commune('sete', 'Sète')} et un autre pour un électricien de ${commune('vendargues', 'Vendargues')} n'ont ni les mêmes parcours, ni les mêmes contenus, ni les mêmes outils à connecter.</p>
<p>Notre devis détaille chaque élément : pages, fonctionnalités, contenus pris en charge, intégrations, référencement de base, hébergement et suivi. Il précise aussi ce qui vous appartient (nom de domaine, site, comptes) et ce que vous récupérez si vous partez.</p>
<p>Notre particularité tient surtout à ce qu'on construit derrière le site : les automatisations qui vous évitent de ressaisir, relancer ou rappeler. Par exemple, une entreprise de services à domicile peut proposer à ses clients d'envoyer quelques photos et recevoir un devis préparé automatiquement, que le gérant valide avant envoi. C'est ce qui transforme un site vitrine en outil de travail.</p>
${cta({ title: 'Décrivez votre projet en quelques minutes', text: "Notre configurateur de projet (gratuit) vous aide à lister vos pages, fonctionnalités et besoins. Vous obtenez une base claire pour demander et comparer des devis.", href: L.config, label: 'Ouvrir le configurateur de projet', href2: L.offre, label2: 'Voir notre offre site internet' })}` },
    { id: 'preparer', h2: 'Préparer sa demande pour obtenir un devis précis', html: `
<p>Plus votre demande est précise, plus les devis seront comparables et justes. Avant de contacter des prestataires, préparez :</p>
<ul>
<li><strong>Vos objectifs</strong> : recevoir des appels, des demandes de devis, des réservations, vendre en ligne ? Un objectif principal suffit souvent.</li>
<li><strong>Votre zone</strong> : Montpellier, votre quartier, les communes que vous desservez (par exemple ${commune('perols', 'Pérols')} ou ${commune('saint-jean-de-vedas', 'Saint-Jean-de-Védas')}).</li>
<li><strong>Vos contenus disponibles</strong> : logo, photos de réalisations, avis clients, descriptions de vos services.</li>
<li><strong>Vos outils actuels</strong> : agenda, logiciel de devis et facturation, messagerie. Ils conditionnent les intégrations possibles.</li>
<li><strong>Vos contraintes</strong> : date de lancement souhaitée, budget envisagé, personnes qui valideront.</li>
<li><strong>Deux ou trois sites que vous aimez</strong>, et pourquoi.</li>
</ul>
<p>Et si vous hésitez entre un site plus riche et une automatisation, posez-vous une question simple : combien de temps passez-vous chaque semaine à envoyer des devis, relancer ou confirmer des rendez-vous ? Notre <a href="${L.calc}">calculateur d'automatisation</a> vous aide à le visualiser.</p>` },
  ],
  faq: [
    { q: "Pourquoi ne pas afficher de prix sur votre site ?", a: "Parce qu'un prix affiché sans connaître le projet serait soit trompeur, soit gonflé pour couvrir tous les cas. Nous préférons un devis gratuit et personnalisé, qui détaille exactement ce qui est inclus." },
    { q: "Faut-il payer un abonnement mensuel pour un site internet ?", a: "Pas forcément pour la création, mais il y a toujours des coûts récurrents : nom de domaine, hébergement et, selon la technologie, maintenance. L'important est de les connaître dès le devis et de pouvoir les résilier sans perdre votre site." },
    { q: "Qu'est-ce qui fait le plus varier le prix d'un site ?", a: "Dans nos projets, ce sont surtout les contenus (qui rédige, qui fournit les photos), les fonctionnalités (réservation, paiement, espace client, devis automatique) et les intégrations avec vos outils existants." },
    { q: "Comment savoir si un devis est honnête ?", a: "Un devis honnête liste précisément les pages, les fonctionnalités, les contenus pris en charge, le suivi et la propriété des éléments livrés. Un devis vague, quel que soit son montant, est plus risqué qu'un devis détaillé." },
    { q: "Le prix comprend-il le référencement ?", a: "Cela dépend totalement du prestataire. Demandez la liste précise de ce qui est fait : structure des pages, balises, vitesse, données structurées, création ou optimisation de la fiche Google. Le référencement continu est généralement une prestation distincte." },
  ],
  related: ['choisir-agence-web-montpellier', 'apparaitre-google-maps-montpellier', 'obligations-legales-site-internet'],
});

/* ═══════════════ 2. GOOGLE MAPS ═══════════════ */
GUIDES.push({
  slug: 'apparaitre-google-maps-montpellier',
  title: 'Apparaître en haut de Google Maps à Montpellier | GroupSolution',
  description: "Méthode pas à pas pour remonter dans Google Maps à Montpellier : catégories, zone desservie, avis, photos, NAP et erreurs qui font disparaître une fiche.",
  h1: 'Apparaître en haut de Google Maps à Montpellier : méthode pas à pas',
  short: "Catégories, zone desservie, avis, photos, cohérence NAP : la méthode complète pour remonter dans le « pack local », et les erreurs à éviter.",
  intro: `<p>Quand quelqu'un tape « plombier Montpellier » ou « restaurant près de moi », Google affiche d'abord une carte avec trois établissements, le fameux « pack local », avant même les sites internet. Pour une activité de proximité, c'est souvent là que se jouent la majorité des appels.</p>
<p>Bonne nouvelle : contrairement au référencement classique, le classement dans Google Maps repose en grande partie sur des éléments que vous contrôlez directement. Mauvaise nouvelle : à Montpellier, la concurrence est forte dans la plupart des métiers, et les approximations se paient. Voici la méthode que nous appliquons, étape par étape.</p>`,
  sections: [
    { id: 'criteres', h2: 'Comment Google classe les fiches locales', html: `
<p>Google l'indique lui-même dans son aide : le classement local repose sur trois familles de critères.</p>
${table(['Critère', 'Ce que Google regarde', 'Votre marge de manœuvre'], [
  ['Pertinence', 'Votre fiche correspond-elle à la recherche ? Catégories, services, description, contenu du site.', 'Forte'],
  ['Distance', "Éloignement entre l'internaute (ou le lieu cherché) et votre établissement.", 'Faible : vous ne déménagerez pas pour Google'],
  ['Notoriété (« prominence »)', 'Avis, note, mentions sur le web, liens vers votre site, ancienneté, activité de la fiche.', 'Moyenne à forte, mais demande de la régularité'],
])}
<p>La distance explique une frustration fréquente : vous êtes premier quand vous cherchez depuis votre atelier de ${commune('vendargues', 'Vendargues')}, et invisible depuis le centre de Montpellier. C'est normal. Dans une métropole dense, le rayon dans lequel vous pouvez apparaître en tête est souvent limité à quelques kilomètres pour les métiers très concurrentiels. L'objectif réaliste est d'élargir progressivement ce rayon, pas d'être premier partout.</p>
${box([
  "Pertinence et notoriété se travaillent ; la distance, beaucoup moins.",
  "Testez votre position depuis plusieurs points de la ville, pas seulement depuis votre bureau.",
  "Dans une métropole, visez d'abord votre quartier et vos communes voisines.",
])}` },
    { id: 'fiche', h2: 'Étape 1 : une fiche Google Business Profile complète et exacte', html: `
<h3>Le nom : votre vrai nom, rien d'autre</h3>
<p>Le nom de la fiche doit être celui que vous utilisez réellement (enseigne, devanture, factures). Ajouter « Plombier Montpellier pas cher » au nom fonctionne parfois quelques semaines, puis la fiche est signalée par un concurrent ou détectée, et peut être suspendue. C'est l'erreur la plus fréquente, et la plus coûteuse.</p>
<h3>Les catégories : le réglage le plus sous-estimé</h3>
<p>La <strong>catégorie principale</strong> pèse lourd dans la pertinence. Choisissez la plus précise possible (« Électricien » plutôt que « Entreprise de bâtiment »), puis ajoutez des catégories secondaires uniquement si elles correspondent à une activité réelle. Regardez les catégories des trois concurrents qui apparaissent en tête sur votre requête : c'est un bon indice de ce que Google associe à cette recherche.</p>
<h3>Adresse ou zone desservie ?</h3>
<p>Si vous recevez vos clients (boutique, cabinet, restaurant), affichez l'adresse. Si vous vous déplacez chez eux (artisan, service à domicile) sans accueillir de public, Google demande de <strong>masquer l'adresse</strong> et de renseigner une zone desservie. Attention : la zone desservie ne vous fait pas apparaître magiquement dans toutes les villes listées ; le classement reste calculé à partir de votre adresse réelle. Listez les communes où vous intervenez vraiment : Montpellier, ${commune('lattes', 'Lattes')}, ${commune('perols', 'Pérols')}, etc.</p>
<h3>Services, horaires, attributs, description</h3>
<p>Remplissez tout : liste des services avec une phrase de description chacun, horaires (y compris exceptionnels les jours fériés), attributs (accessibilité, paiement), description de 750 caractères qui explique clairement ce que vous faites et où. Une fiche complète inspire confiance aux internautes autant qu'à l'algorithme.</p>` },
    { id: 'avis', h2: 'Étape 2 : des avis réguliers, et des réponses', html: `
<p>Les avis jouent sur la notoriété et, surtout, sur le taux de clic : entre deux fiches proches, l'internaute choisit presque toujours celle qui a le plus d'avis récents et détaillés.</p>
<ul>
<li><strong>Demandez systématiquement</strong>, au bon moment : juste après une intervention réussie, par SMS, avec le lien direct vers le formulaire d'avis. C'est un processus qui s'automatise très bien.</li>
<li><strong>Visez la régularité</strong> plutôt que le volume : quelques avis chaque mois valent mieux que trente d'un coup puis plus rien.</li>
<li><strong>Répondez à tous les avis</strong>, positifs comme négatifs, de façon personnelle. Une réponse calme à un avis négatif rassure souvent plus qu'une note parfaite.</li>
<li><strong>N'achetez jamais d'avis</strong> et n'offrez pas de contrepartie en échange : c'est contraire aux règles de Google, et les faux avis constituent une pratique commerciale trompeuse en droit français.</li>
</ul>
${box([
  "Automatisez la demande d'avis juste après la prestation : c'est le levier le plus rentable.",
  "Répondez à chaque avis, surtout aux négatifs.",
  "Pas d'avis achetés, pas de récompense : le risque dépasse largement le gain.",
])}` },
    { id: 'activite', h2: 'Étape 3 : photos et publications, les signaux d\'une fiche vivante', html: `
<p>Une fiche avec des photos récentes et réelles (vos locaux, votre équipe, vos réalisations, votre véhicule) est plus consultée qu'une fiche avec un logo seul. Ajoutez des photos régulièrement, idéalement prises sur place, plutôt que des images de banque.</p>
<p>Les <strong>publications</strong> (actualités, offres, événements) ont un effet direct modeste sur le classement, mais elles montrent que l'entreprise est active et donnent de la matière aux internautes qui hésitent. Une publication tous les quinze jours suffit : un chantier terminé à ${commune('castelnau-le-lez', 'Castelnau-le-Lez')}, une nouveauté à la carte, une disponibilité pour la semaine.</p>
<p>Pensez aussi aux <strong>questions-réponses</strong> et aux messages si vous pouvez y répondre rapidement. Une question sans réponse depuis six mois fait mauvaise impression.</p>` },
    { id: 'nap-site', h2: 'Étape 4 : cohérence NAP et pages locales sur votre site', html: `
<h3>La cohérence NAP</h3>
<p>NAP signifie <em>Name, Address, Phone</em> : nom, adresse, téléphone. Ces informations doivent être <strong>strictement identiques</strong> partout où votre entreprise apparaît : fiche Google, site internet, Pages Jaunes, annuaires professionnels, réseaux sociaux, Apple Plans, Bing. Un ancien numéro sur un annuaire, une adresse abrégée différemment, un ancien nom commercial : chaque incohérence brouille le signal.</p>
<h3>Des pages locales utiles, pas des pages copiées</h3>
<p>Votre site renforce la pertinence de la fiche. Une page par service principal, et une page par zone importante <em>si vous avez quelque chose de spécifique à y dire</em> (réalisations sur place, délais d'intervention, particularités locales). Dix pages identiques où seul le nom de la ville change sont au mieux ignorées, au pire pénalisantes.</p>
<p>Sur chaque page, affichez vos coordonnées complètes, une carte ou un plan d'accès et, idéalement, des données structurées <code>LocalBusiness</code>. Reliez la fiche Google à la page la plus pertinente du site (souvent l'accueil ou la page de la ville principale).</p>
${cta({ title: 'Où en est votre visibilité locale ?', text: "Notre test gratuit passe en revue votre fiche, votre site et vos points faibles face aux concurrents de votre secteur.", href: L.visi, label: 'Tester ma visibilité Google', href2: L.offre, label2: 'Découvrir notre offre site + fiche' })}` },
    { id: 'erreurs', h2: 'Les erreurs qui font disparaître une fiche', html: `
${table(['Erreur', 'Conséquence possible', 'Ce qu\'il faut faire'], [
  ['Mots-clés ajoutés au nom', 'Suspension ou modification forcée', 'Utiliser le nom réel de l\'entreprise'],
  ['Adresse de domiciliation ou bureau virtuel', 'Fiche refusée ou suspendue', 'Adresse réelle d\'accueil, ou zone desservie avec adresse masquée'],
  ['Plusieurs fiches pour un même lieu', 'Suppression des doublons, perte des avis', 'Une seule fiche par établissement réel'],
  ['Changement d\'adresse ou de nom brutal', 'Nouvelle vérification, baisse temporaire', 'Anticiper, garder les preuves (Kbis, factures)'],
  ['Avis achetés ou échangés', 'Avis supprimés, avertissement public', 'Demander des avis à de vrais clients'],
  ['Fiche abandonnée (horaires faux, photos anciennes)', 'Baisse progressive de visibilité', 'Une vérification mensuelle de 15 minutes'],
])}
<p>Si votre fiche est suspendue, ne créez pas une nouvelle fiche : faites une demande de réexamen avec des justificatifs (photos de la devanture, extrait Kbis, facture à l'adresse). Les délais de traitement varient, de quelques jours à plusieurs semaines.</p>` },
    { id: 'metropole', h2: 'Ce qui change dans une métropole concurrentielle comme Montpellier', html: `
<p>À Montpellier, pour les métiers les plus recherchés (plombier, serrurier, électricien, restaurant, coiffeur, avocat), des dizaines de fiches se disputent les trois places du pack local. Trois conséquences pratiques :</p>
<ul>
<li><strong>Le détail fait la différence</strong> : la catégorie exacte, un avis de plus par mois, une réponse rapide aux messages. Aucun levier isolé ne suffit.</li>
<li><strong>Le quartier compte</strong> : Antigone, Port Marianne, Beaux-Arts, Ovalie… Les internautes précisent souvent leur recherche, et vos contenus peuvent mentionner les quartiers où vous travaillez réellement.</li>
<li><strong>Les communes voisines sont une opportunité</strong> : il est souvent plus facile de dominer « électricien ${commune('saint-jean-de-vedas', 'Saint-Jean-de-Védas')} » que « électricien Montpellier ». Pour une entreprise basée à ${commune('meze', 'Mèze')} ou ${commune('sete', 'Sète')}, la stratégie est différente : moins de concurrence directe, mais une zone plus étendue à couvrir.</li>
</ul>
<p>Enfin, votre fiche Google ne convertit pas seule : une fois que l'internaute clique, il atterrit sur votre site ou vous appelle. Si le site est lent ou que personne ne répond, le travail est perdu. C'est pourquoi nous relions souvent la fiche à un système de rappel ou de devis automatique : voir notre guide ${guide('automatiser-devis-artisan', 'pour automatiser ses devis quand on est artisan')}.</p>
${box([
  "Commencez par votre quartier et vos communes voisines, puis élargissez.",
  "Un quart d'heure par semaine sur la fiche (avis, photos, publication) vaut mieux qu'une grosse opération annuelle.",
  "La fiche amène le contact ; le site et la réactivité le transforment.",
])}` },
  ],
  faq: [
    { q: 'Combien de temps faut-il pour remonter dans Google Maps ?', a: "Les corrections de base (catégories, informations, cohérence NAP) produisent souvent un effet en quelques semaines. Gagner des places durablement sur une requête concurrentielle à Montpellier demande plutôt plusieurs mois de régularité, notamment sur les avis." },
    { q: 'Peut-on apparaître dans Google Maps sans local ?', a: "Oui. Les entreprises qui se déplacent chez leurs clients peuvent créer une fiche avec zone desservie et adresse masquée. Il faut toutefois une adresse réelle pour la vérification ; une domiciliation ou un bureau virtuel n'est généralement pas accepté." },
    { q: 'Faut-il payer Google pour être en haut de la carte ?', a: "Non, le classement naturel dans Google Maps est gratuit. Des annonces payantes peuvent apparaître au-dessus du pack local, mais elles sont signalées comme sponsorisées et ne modifient pas votre classement naturel." },
    { q: 'Est-ce que le nombre d\'avis compte plus que la note ?', a: "Les deux comptent, avec la récence et le contenu des avis. En pratique, une fiche avec de nombreux avis récents et détaillés, et des réponses du gérant, inspire plus confiance qu'une note parfaite sur trois avis anciens." },
    { q: 'Mon concurrent a des mots-clés dans son nom, que faire ?', a: "Vous pouvez proposer une modification via le bouton « Suggérer une modification » de sa fiche, ou le signaler via les outils de Google. Évitez surtout de l'imiter : le risque de suspension de votre propre fiche est réel." },
  ],
  related: ['prix-site-internet-montpellier', 'choisir-agence-web-montpellier', 'automatiser-devis-artisan'],
});

/* ═══════════════ 3. AUTOMATISER SES DEVIS ═══════════════ */
GUIDES.push({
  slug: 'automatiser-devis-artisan',
  title: 'Automatiser ses devis quand on est artisan | GroupSolution',
  description: "Du formulaire au devis signé : comment automatiser vos devis d'artisan, quels outils, relances, signature, et ce qu'il vaut mieux ne pas automatiser.",
  h1: 'Automatiser ses devis quand on est artisan : du formulaire au devis signé',
  short: "Le flux complet, les outils, le devis par photos, les relances et la signature électronique, et ce qu'il vaut mieux garder à la main.",
  intro: `<p>Le soir, après la journée de chantier, il reste les devis. Rappeler le client pour avoir les dimensions, ouvrir le logiciel, retrouver les prix, envoyer le PDF, puis attendre une réponse qui ne vient pas. Beaucoup d'artisans nous disent y passer plusieurs heures par semaine, et perdre des chantiers simplement parce que le devis est parti trop tard.</p>
<p>Automatiser ses devis ne veut pas dire laisser une machine fixer vos prix. Cela veut dire supprimer tout ce qui est répétitif autour : collecter les bonnes informations, préremplir, envoyer, relancer, faire signer. Voici comment construire ce flux, étape par étape, avec des exemples concrets.</p>`,
  sections: [
    { id: 'flux', h2: 'Le flux complet, du premier contact à la signature', html: `
<p>Un devis automatisé suit toujours à peu près le même chemin. L'idée est d'identifier, à chaque étape, ce que vous faites aujourd'hui à la main et qui pourrait se faire seul.</p>
${table(['Étape', 'Aujourd\'hui (souvent)', 'Automatisé'], [
  ['1. Demande', 'Appel pendant un chantier, message vocal, SMS', 'Formulaire guidé sur le site ou lien envoyé par SMS'],
  ['2. Qualification', 'Rappel pour poser les questions', 'Questions obligatoires, photos, dimensions, adresse'],
  ['3. Chiffrage', 'Calcul de tête ou sur tableur le soir', 'Prix calculé depuis votre grille, ou brouillon prérempli'],
  ['4. Envoi', 'PDF envoyé par mail quand vous avez le temps', 'Devis envoyé en quelques minutes, par mail et SMS'],
  ['5. Relance', 'Souvent oubliée', 'Relances programmées à J+2, J+7, J+15'],
  ['6. Signature', 'Impression, signature, scan ou photo', 'Signature électronique en un clic, acompte en ligne'],
  ['7. Suite', 'Ressaisie dans l\'agenda et la facturation', 'Création du chantier, rappel au client, facture d\'acompte'],
])}
<p>Vous n'êtes pas obligé de tout automatiser d'un coup. Dans nos projets, les étapes 1, 2, 5 et 6 apportent l'essentiel du gain, parce qu'elles suppriment des allers-retours sans toucher à votre expertise.</p>
${box([
  "L'automatisation porte sur la collecte, l'envoi, la relance et la signature, pas sur votre savoir-faire.",
  "Commencez par le formulaire de qualification et les relances : c'est là que se perd le plus de temps.",
  "Un devis envoyé rapidement a plus de chances d'être signé qu'un devis parfait envoyé une semaine plus tard.",
])}` },
    { id: 'formulaire', h2: 'Étape 1 : un formulaire qui pose les bonnes questions', html: `
<p>La plupart des rappels servent à obtenir des informations qui auraient pu être demandées dès le départ. Un bon formulaire de demande de devis remplace ce premier appel :</p>
<ul>
<li><strong>Type de prestation</strong> sous forme de choix (pas un champ libre) : cela permet ensuite d'appliquer la bonne grille de prix.</li>
<li><strong>Questions conditionnelles</strong> : si le client choisit « remplacement de chauffe-eau », on lui demande la capacité et l'emplacement ; s'il choisit « salle de bains complète », la surface.</li>
<li><strong>Photos obligatoires</strong> quand elles sont utiles : un tableau électrique, une fuite, un mur à repeindre. Une photo évite souvent un déplacement de repérage.</li>
<li><strong>Adresse et délai souhaité</strong> : pour vérifier que c'est dans votre zone (par exemple Montpellier, ${commune('castelnau-le-lez', 'Castelnau-le-Lez')}, ${commune('vendargues', 'Vendargues')}) et que vous êtes disponible.</li>
</ul>
<p>Le formulaire peut vivre sur votre site, mais aussi être envoyé par SMS en réponse automatique quand vous ne pouvez pas décrocher : « Je suis sur un chantier, décrivez votre besoin ici et je vous envoie un devis rapidement. »</p>` },
    { id: 'photos', h2: 'Le devis par photos : un exemple concret', html: `
<p>Prenons une entreprise de services à domicile, par exemple un service de lavage automobile ou de nettoyage. Sans outil, chaque demande passe par un échange de messages pour connaître le véhicule ou le logement, son état et les prestations souhaitées. Avec un parcours adapté, <strong>le client envoie quelques photos</strong> et choisit ses prestations ; <strong>le devis est préparé automatiquement</strong>, puis envoyé tel quel ou après validation du gérant.</p>
<p>Ce qui rend ce modèle efficace :</p>
<ul>
<li>le prix dépend de critères <strong>visibles et objectivables</strong> (taille, état, options choisies) ;</li>
<li>le gérant garde la main : il peut ajuster si les photos révèlent un cas particulier ;</li>
<li>le client obtient une réponse rapide, au moment où il est le plus motivé.</li>
</ul>
<p>Le même principe s'applique à beaucoup de métiers : nettoyage, peinture, petite rénovation, pose de menuiseries standard, entretien d'espaces verts, débarras. Dès que votre prix repose sur quelques paramètres que l'on peut photographier ou mesurer, un devis automatique ou semi-automatique est envisageable.</p>
${cta({ title: 'Combien de temps vous feraient gagner des devis automatiques ?', text: "Indiquez votre nombre de demandes par semaine et le temps passé sur chacune : le calculateur estime les heures récupérées.", href: L.calc, label: 'Calculer mon gain de temps', href2: L.auto, label2: 'Voir nos automatisations' })}` },
    { id: 'chiffrage', h2: 'Étape 2 : chiffrer automatiquement… ou presque', html: `
<p>Il y a trois niveaux possibles, à choisir selon votre métier :</p>
<h3>Le devis entièrement automatique</h3>
<p>Adapté aux prestations standardisées : le prix est calculé à partir de votre grille et envoyé tel quel. C'est le cas d'un lavage auto à domicile, d'un nettoyage de vitres au mètre carré ou d'un forfait de dépannage.</p>
<h3>Le brouillon prérempli, validé par vous</h3>
<p>Le cas le plus fréquent chez les artisans du bâtiment. Le système prépare le devis avec les lignes et quantités probables ; vous vérifiez, ajustez, et cliquez sur « envoyer ». Vous ne partez plus d'une page blanche, et vous gardez le contrôle sur chaque ligne.</p>
<h3>La fourchette indicative, puis la visite</h3>
<p>Pour les chantiers complexes, le formulaire donne une estimation large, clairement présentée comme indicative, et propose directement un créneau de visite. Vous filtrez ainsi les demandes hors budget avant de vous déplacer.</p>
<p>Côté outils, de nombreux logiciels de devis et facturation pour artisans (Obat, Tolteck, Axonaut, Sellsy, Pennylane, entre autres) permettent de gérer une bibliothèque d'ouvrages et de prix. Des outils d'automatisation comme Make, Zapier ou n8n servent de lien entre votre formulaire, votre logiciel et votre messagerie. Le bon choix dépend de ce que vous utilisez déjà : l'idée n'est pas d'ajouter un outil, mais de relier ceux que vous avez.</p>` },
    { id: 'ia', h2: 'Ce que l\'IA change aujourd\'hui dans le traitement des devis', html: `
<p>Les automatisations « classiques » suivent des règles fixes : si le client coche telle case, on applique tel prix. Les outils d'intelligence artificielle récents permettent d'aller plus loin sur les tâches qui demandaient jusqu'ici une lecture humaine. Il est possible, par exemple :</p>
<ul>
<li><strong>d'extraire automatiquement les informations d'un document</strong> : un plan, un ancien devis, un cahier des charges envoyé en PDF, une photo de plaque signalétique d'appareil. L'IA en tire les dimensions, références ou quantités utiles et préremplit le devis ;</li>
<li><strong>de faire analyser les photos envoyées</strong> pour proposer une première qualification (type de surface, état apparent, éléments à prévoir), que vous confirmez ou corrigez ;</li>
<li><strong>de confier le premier échange à un agent IA</strong> qui pose les questions manquantes par e-mail, SMS ou chat, au lieu d'attendre votre rappel le soir ;</li>
<li><strong>d'utiliser un assistant vocal</strong> qui répond au téléphone quand vous êtes sur un chantier, note la demande, qualifie le besoin et vous transmet un résumé écrit ;</li>
<li><strong>d'orchestrer vos outils via leurs API</strong> : le formulaire, l'IA, votre logiciel de devis, votre agenda et votre messagerie échangent directement les données, sans ressaisie.</li>
</ul>
<p>Deux précautions restent indispensables. D'abord, <strong>l'IA peut se tromper</strong> : sur tout ce qui engage un prix ou une responsabilité, une validation humaine doit rester dans la boucle. Ensuite, les données de vos clients (photos de leur domicile, coordonnées) doivent être traitées conformément au RGPD, avec des outils dont vous connaissez les conditions d'hébergement et d'utilisation des données.</p>
${box([
  "L'IA est utile pour lire, extraire, qualifier et résumer ; la décision de prix reste la vôtre.",
  "Un assistant vocal ou un agent IA peut absorber le premier contact pendant vos chantiers.",
  "Les API permettent de relier vos outils existants plutôt que d'en empiler de nouveaux.",
])}` },
    { id: 'relances-signature', h2: 'Étapes 3 et 4 : relances et signature électronique', html: `
<h3>Des relances qui partent toutes seules</h3>
<p>Un devis sans relance est souvent un devis oublié, pas refusé. Un calendrier simple suffit :</p>
<ul>
<li><strong>J+2</strong> : « Avez-vous bien reçu le devis ? Des questions ? » par SMS.</li>
<li><strong>J+7</strong> : relance par e-mail, avec rappel de la date de validité et, si pertinent, de vos disponibilités.</li>
<li><strong>J+15</strong> : dernier message court. Si le client a choisi quelqu'un d'autre, demandez-lui pourquoi : c'est une information précieuse.</li>
</ul>
<p>Les relances s'arrêtent automatiquement dès que le devis est signé ou refusé. C'est ce détail qui évite les maladresses.</p>
<h3>La signature électronique</h3>
<p>Une signature électronique simple (un clic avec vérification par e-mail ou code SMS), telle que la proposent la plupart des logiciels de devis ou des services comme Yousign ou Docusign, est généralement suffisante pour un devis entre professionnel et particulier. Elle est reconnue par le règlement européen eIDAS. Couplée à un paiement d'acompte en ligne, elle transforme un « oui » oral en engagement réel, le jour même.</p>
${box([
  "Trois relances maximum, qui s'arrêtent dès la réponse du client.",
  "Signature en ligne + acompte immédiat : moins de chantiers qui s'évaporent.",
  "Chaque devis signé peut déclencher la suite : agenda, facture d'acompte, message de confirmation.",
])}` },
    { id: 'ne-pas-automatiser', h2: 'Ce qu\'il ne faut PAS automatiser', html: `
<p>L'automatisation mal placée fait fuir les clients. Voici ce que nous recommandons de garder humain :</p>
<ul>
<li><strong>Le prix des chantiers complexes</strong> : rénovation, pathologies du bâti, accès difficile. Une estimation automatique trop basse vous engage vis-à-vis du client ; trop haute, elle le fait fuir.</li>
<li><strong>La réponse à une réclamation</strong> ou à un client mécontent. Un message automatique à ce moment-là envenime la situation.</li>
<li><strong>Les urgences</strong> : fuite, panne de chauffage en hiver, porte claquée. Le client veut une voix, pas un formulaire. Le système peut en revanche vous alerter immédiatement.</li>
<li><strong>Les mentions obligatoires</strong> : l'automatisation doit reprendre un modèle de devis conforme (identification, détail des prestations, prix HT et TTC, validité, conditions de paiement, assurance professionnelle pour les métiers du bâtiment…), mais c'est à vous de vérifier qu'il est complet et à jour.</li>
</ul>
<p>Le bon critère : automatisez ce qui est répétitif et prévisible ; gardez pour vous ce qui demande du jugement ou de l'empathie.</p>
${table(['À automatiser', 'À garder à la main'], [
  ['Collecte des informations et photos', 'Chiffrage des chantiers atypiques'],
  ['Envoi du devis et accusé de réception', 'Négociation et remises'],
  ['Relances programmées', 'Gestion des réclamations'],
  ['Signature et acompte', 'Urgences et situations sensibles'],
  ['Création du chantier et de la facture d\'acompte', 'Validation finale des devis importants'],
])}
<p>Une fois les devis signés, il reste à être payé : notre guide ${guide('relances-factures-impayees-automatiques', 'pour relancer ses factures impayées automatiquement')} prolonge ce flux jusqu'à l'encaissement.</p>` },
  ],
  faq: [
    { q: 'Un devis automatique a-t-il la même valeur qu\'un devis classique ?', a: "Oui, à condition qu'il comporte les mentions obligatoires et qu'il soit accepté par le client (signature manuscrite ou électronique). La manière dont il a été produit ne change pas sa valeur ; son contenu, si." },
    { q: 'Faut-il changer de logiciel de devis pour automatiser ?', a: "Pas forcément. Dans beaucoup de cas, on relie votre logiciel actuel à un formulaire et à une messagerie grâce à un outil d'automatisation. On ne recommande un changement que si l'outil actuel ne permet aucun échange de données." },
    { q: 'Mes clients vont-ils accepter de remplir un formulaire ?', a: "Si le formulaire est court, clair sur mobile et promet une réponse rapide, oui. Ceux qui préfèrent appeler peuvent toujours le faire ; le formulaire traite simplement la majorité des demandes simples sans vous interrompre." },
    { q: 'Combien coûte la mise en place d\'un devis automatique ?', a: "Cela dépend du niveau d'automatisation (devis entièrement automatique, brouillon prérempli, fourchette) et des outils à connecter. Chez GroupSolution, c'est sur devis, après un échange pour comprendre votre façon de chiffrer." },
    { q: 'Est-ce adapté aux petites entreprises ?', a: "C'est même là que le gain est souvent le plus visible : un artisan seul ou une petite équipe n'a personne pour gérer les demandes pendant les chantiers. Automatiser la collecte et les relances libère du temps pour le métier." },
  ],
  related: ['relances-factures-impayees-automatiques', 'apparaitre-google-maps-montpellier', 'prix-site-internet-montpellier'],
});

/* ═══════════════ 4. OBLIGATIONS LÉGALES ═══════════════ */
GUIDES.push({
  slug: 'obligations-legales-site-internet',
  title: 'Obligations légales d\'un site pro en 2026 | GroupSolution',
  description: "Mentions légales, RGPD, cookies, CGV, rétractation, médiateur, accessibilité : les obligations d'un site internet professionnel en 2026, expliquées.",
  h1: 'Site internet professionnel : les obligations légales en 2026 (mentions, RGPD, cookies, CGV, accessibilité)',
  short: "Mentions légales, RGPD, bandeau cookies, CGV, rétractation, médiateur, accessibilité : la check-list pour un site pro en règle.",
  intro: `<p>Beaucoup de sites de TPE à Montpellier et dans l'Hérault ont été mis en ligne sans que personne ne se pose la question du cadre légal. Pas de mentions légales, un bandeau cookies décoratif, des CGV copiées sur un concurrent. Tant que tout va bien, rien ne se passe. Le jour où un client conteste une commande, où un concurrent signale le site ou où la CNIL reçoit une plainte, ces oublis deviennent un vrai problème.</p>
<p>Ce guide fait le tour des obligations qui s'appliquent à la plupart des sites professionnels, avec un objectif pratique : savoir ce qui doit figurer sur votre site et ce qu'il faut vérifier. <strong>Il ne remplace pas un conseil juridique</strong> : pour un cas particulier (profession réglementée, vente de produits spécifiques, traitement de données sensibles), faites valider vos documents par un avocat ou un juriste.</p>`,
  sections: [
    { id: 'panorama', h2: 'Vue d\'ensemble : qui est concerné par quoi ?', html: `
${table(['Obligation', 'Site vitrine', 'Site avec formulaire / RDV', 'E-commerce'], [
  ['Mentions légales', 'Oui', 'Oui', 'Oui'],
  ['Politique de confidentialité (RGPD)', 'Oui dès qu\'il y a des données personnelles', 'Oui', 'Oui'],
  ['Consentement cookies', 'Si cookies non essentiels (statistiques, publicité, vidéos intégrées…)', 'Idem', 'Idem'],
  ['CGV', 'Non obligatoire en ligne, mais à communiquer aux clients pros sur demande', 'Selon l\'activité', 'Oui'],
  ['Droit de rétractation (B2C)', 'Non', 'Selon les prestations vendues à distance', 'Oui, sauf exceptions'],
  ['Médiateur de la consommation', 'Oui si vous vendez à des particuliers', 'Idem', 'Oui (B2C)'],
  ['Accessibilité', 'Selon la taille et le secteur', 'Selon la taille et le secteur', 'Oui pour de nombreux sites marchands depuis juin 2025, hors micro-entreprises'],
], 'Synthèse simplifiée — les cas particuliers existent')}
${box([
  "Mentions légales et politique de confidentialité : quasiment tous les sites professionnels.",
  "Cookies : c'est la présence de traceurs non essentiels qui déclenche l'obligation de consentement.",
  "Dès que vous vendez à des particuliers, pensez rétractation et médiateur.",
])}` },
    { id: 'mentions', h2: 'Les mentions légales', html: `
<p>Elles découlent principalement de la loi pour la confiance dans l'économie numérique (LCEN) et du Code de commerce. Elles doivent être <strong>facilement accessibles</strong>, en pratique via un lien en pied de page sur toutes les pages.</p>
<h3>Pour une société</h3>
<ul>
<li>dénomination sociale, forme juridique et montant du capital ;</li>
<li>adresse du siège social ;</li>
<li>numéro d'immatriculation (RCS ou répertoire des métiers) et, le cas échéant, numéro de TVA intracommunautaire ;</li>
<li>adresse e-mail et numéro de téléphone ;</li>
<li>nom du directeur ou de la directrice de la publication ;</li>
<li>nom, adresse et téléphone de l'hébergeur du site.</li>
</ul>
<h3>Pour un entrepreneur individuel ou micro-entrepreneur</h3>
<p>Nom et prénom, adresse professionnelle (ou de domiciliation), numéro SIREN/SIRET, coordonnées de contact, et les informations sur l'hébergeur. Les professions réglementées (avocats, architectes, professionnels de santé, agents immobiliers…) ont des mentions supplémentaires : ordre ou organisme professionnel, titre, règles professionnelles applicables, carte professionnelle, assurance.</p>
<p>L'absence de mentions légales est pénalement sanctionnable (la LCEN prévoit jusqu'à un an d'emprisonnement et 75 000 € d'amende pour une personne physique, davantage pour une personne morale). Dans les faits, c'est surtout un signal de manque de sérieux pour les clients… et une page très simple à mettre en place.</p>` },
    { id: 'rgpd', h2: 'RGPD : la politique de confidentialité et les formulaires', html: `
<p>Dès que votre site collecte des données personnelles (formulaire de contact, demande de devis, prise de rendez-vous, newsletter, compte client), le RGPD s'applique. Pour une petite entreprise, cela se traduit concrètement par :</p>
<ul>
<li><strong>Une politique de confidentialité</strong> claire : quelles données, pour quoi faire, sur quelle base légale, pendant combien de temps, qui y a accès (y compris vos sous-traitants : hébergeur, outil d'e-mailing, CRM), comment exercer ses droits (accès, rectification, suppression, opposition) et le droit de saisir la CNIL.</li>
<li><strong>Une information au niveau du formulaire</strong> : quelques lignes sous le bouton d'envoi, avec un lien vers la politique complète.</li>
<li><strong>La minimisation</strong> : ne demandez que ce qui est utile. Une date de naissance pour un devis de peinture n'a aucune justification.</li>
<li><strong>Le consentement pour la prospection</strong> : envoyer une newsletter commerciale à des particuliers suppose en principe leur accord préalable, avec une case non pré-cochée. Entre professionnels, les règles sont plus souples si le message concerne leur activité, mais un lien de désinscription reste obligatoire.</li>
<li><strong>Un registre des traitements</strong>, même simple, pour savoir ce que vous collectez et où ces données sont stockées.</li>
</ul>
<p>Les sanctions prévues par le RGPD peuvent atteindre 20 millions d'euros ou 4 % du chiffre d'affaires mondial ; en pratique, la CNIL proportionne ses sanctions à la taille de l'entreprise et à la gravité des faits, et commence souvent par une mise en demeure.</p>` },
    { id: 'cookies', h2: 'Cookies : ce que la CNIL attend', html: `
<p>Les règles sont précisées par les lignes directrices et la recommandation de la CNIL publiées en 2020. Les principes essentiels :</p>
<ul>
<li><strong>Consentement préalable</strong> : aucun cookie non essentiel (mesure d'audience non exemptée, publicité, réseaux sociaux, vidéos YouTube intégrées…) ne doit être déposé avant que l'internaute ait accepté.</li>
<li><strong>Refuser aussi facilement qu'accepter</strong> : un bouton « Tout refuser » au même niveau et aussi visible que « Tout accepter ». La CNIL a sanctionné plusieurs grands sites sur ce point précis.</li>
<li><strong>Pas de consentement par défaut</strong> : continuer à naviguer ne vaut pas acceptation, et les cases ne doivent pas être pré-cochées.</li>
<li><strong>Pouvoir changer d'avis</strong> : un lien permanent (souvent en pied de page) permet de retirer son consentement.</li>
<li><strong>Durées limitées</strong> : la CNIL recommande de conserver le choix de l'internaute pendant une durée raisonnable (elle cite six mois comme référence) et de limiter la durée de vie des traceurs.</li>
</ul>
<p>Certains traceurs sont <strong>exemptés de consentement</strong> : ceux strictement nécessaires au fonctionnement (panier, connexion, mémorisation du choix cookies) et certains outils de mesure d'audience configurés pour produire uniquement des statistiques anonymes, dans les conditions fixées par la CNIL. Un site vitrine sans publicité, avec une mesure d'audience exemptée, peut ainsi se passer de bandeau, à condition d'informer les visiteurs dans sa politique de confidentialité.</p>
${box([
  "Un bandeau qui ne bloque rien avant le clic ne sert à rien juridiquement.",
  "« Tout refuser » doit être aussi visible que « Tout accepter ».",
  "Moins de traceurs = moins d'obligations, et souvent un site plus rapide.",
])}
${cta({ title: 'Votre site est-il en règle ?', text: "Nous livrons nos sites avec mentions légales, politique de confidentialité et gestion des cookies intégrées. Parlons de votre projet ou de la mise à niveau de votre site actuel.", href: L.offre, label: 'Découvrir notre offre site internet', href2: L.rdv, label2: 'Prendre rendez-vous' })}` },
    { id: 'cgv', h2: 'CGV, droit de rétractation et médiateur (vente aux particuliers)', html: `
<h3>Les conditions générales de vente</h3>
<p>Pour un site marchand qui vend à des particuliers, les CGV doivent être accessibles avant la commande et acceptées par le client. Elles précisent notamment : les caractéristiques essentielles des produits ou services, les prix TTC et frais de livraison, les modalités de paiement, de livraison ou d'exécution, les garanties légales (conformité, vices cachés), le droit de rétractation, les modalités de réclamation et le recours au médiateur. Le bouton final doit indiquer clairement que la commande implique un paiement (par exemple « Commander avec obligation de paiement »).</p>
<p>Copier les CGV d'un concurrent est une mauvaise idée : elles ne correspondent ni à vos produits, ni à vos délais, ni à votre organisation. Elles peuvent aussi contenir des clauses abusives que vous endosseriez.</p>
<h3>Le droit de rétractation</h3>
<p>Pour la vente à distance à un consommateur, le principe est un <strong>délai de rétractation de 14 jours</strong> (article L221-18 du Code de la consommation), sans avoir à se justifier. Le vendeur doit en informer le client avant la commande et lui fournir un formulaire type de rétractation. Si cette information manque, le délai peut être prolongé jusqu'à douze mois. Il existe des exceptions (biens confectionnés sur mesure, denrées périssables, prestations pleinement exécutées avec accord exprès du client, etc.), à vérifier pour votre activité.</p>
<h3>Le médiateur de la consommation</h3>
<p>Tout professionnel qui vend à des particuliers doit adhérer à un dispositif de médiation de la consommation et en communiquer les coordonnées (sur le site, dans les CGV, sur les devis ou factures). C'est souvent via votre fédération professionnelle ou un organisme de médiation agréé. Le défaut d'information est passible d'une amende administrative.</p>
${note(`À noter : les CGV plus anciennes renvoient souvent vers la plateforme européenne de règlement en ligne des litiges (RLL). Cette plateforme a été fermée en 2025 ; vérifiez que vos documents ne mentionnent plus ce lien et faites relire vos CGV si elles datent de plusieurs années.`)}` },
    { id: 'accessibilite', h2: 'Accessibilité numérique : où en est-on ?', html: `
<p>L'accessibilité consiste à rendre un site utilisable par les personnes en situation de handicap : navigation au clavier, textes alternatifs sur les images, contrastes suffisants, formulaires correctement étiquetés, vidéos sous-titrées.</p>
<p>Le cadre a évolué :</p>
<ul>
<li>les organismes publics et les entreprises au chiffre d'affaires élevé sont soumis depuis plusieurs années à des obligations (référentiel RGAA, déclaration d'accessibilité) ;</li>
<li>depuis le <strong>28 juin 2025</strong>, la transposition de l'Acte européen sur l'accessibilité étend des exigences à certains produits et services, dont de nombreux <strong>services de commerce électronique</strong>. Les micro-entreprises qui fournissent des services (moins de 10 salariés et chiffre d'affaires ou total de bilan n'excédant pas 2 millions d'euros) en sont en principe exemptées.</li>
</ul>
<p>Même si vous êtes exempté, les bonnes pratiques d'accessibilité améliorent l'expérience de tous les visiteurs, en particulier sur mobile, et vont dans le même sens que le référencement. Nous les appliquons par défaut sur nos sites.</p>` },
    { id: 'checklist', h2: 'La check-list à passer sur votre site', html: `
${table(['Vérification', 'Où regarder'], [
  ['Lien « Mentions légales » présent sur toutes les pages', 'Pied de page'],
  ['Identité complète, SIREN/RCS, hébergeur renseignés', 'Page mentions légales'],
  ['Politique de confidentialité à jour (outils actuels, durées)', 'Pied de page + sous chaque formulaire'],
  ['Aucun cookie non essentiel avant consentement', 'Outils de développement du navigateur, onglet stockage'],
  ['Bouton « Tout refuser » visible au premier niveau', 'Bandeau cookies'],
  ['CGV accessibles et acceptées avant commande', 'Tunnel de commande'],
  ['Information sur la rétractation + formulaire type', 'CGV, confirmation de commande'],
  ['Coordonnées du médiateur de la consommation', 'CGV, site, devis, factures'],
  ['Images avec texte alternatif, contrastes lisibles', 'Audit rapide avec un outil d\'accessibilité'],
])}
<p>Si vous faites refaire votre site, ces éléments doivent figurer dans le devis. C'est d'ailleurs l'une des questions de notre guide ${guide('choisir-agence-web-montpellier', 'pour choisir son agence web')}. Et si vous comparez des offres, notre guide ${guide('prix-site-internet-montpellier', 'sur le prix d\'un site internet')} rappelle que la rédaction de ces pages est parfois facturée à part.</p>` },
  ],
  faq: [
    { q: 'Un site vitrine sans formulaire doit-il avoir une politique de confidentialité ?', a: "S'il ne collecte aucune donnée personnelle et ne dépose aucun traceur, l'obligation est limitée. En pratique, presque tous les sites collectent quelque chose (statistiques, formulaire, cartes intégrées) : une politique courte et exacte reste recommandée." },
    { q: 'Le bandeau cookies est-il obligatoire ?', a: "Il est nécessaire dès que le site utilise des traceurs soumis au consentement (publicité, réseaux sociaux, mesure d'audience non exemptée, certaines vidéos intégrées). Un site qui n'utilise que des traceurs exemptés peut s'en passer, mais doit informer ses visiteurs." },
    { q: 'Les CGV sont-elles obligatoires pour un artisan ?', a: "Un artisan qui ne vend pas en ligne n'est pas tenu de publier des CGV sur son site, mais il doit informer ses clients avant la prestation (prix, conditions, garanties) et communiquer ses conditions de vente aux professionnels qui les demandent. Le devis joue souvent ce rôle pour les particuliers." },
    { q: 'Qui est responsable si mon agence a oublié les mentions légales ?', a: "L'éditeur du site, c'est-à-dire vous, reste responsable du contenu publié. D'où l'intérêt de prévoir la conformité légale dans le contrat avec votre prestataire et de vérifier le site à la livraison." },
    { q: 'Mon petit commerce doit-il rendre son site accessible ?', a: "Si vous êtes une micro-entreprise au sens de la réglementation, vous êtes en principe exempté des nouvelles obligations pour les services. Les bonnes pratiques restent utiles et peu coûteuses si elles sont prévues dès la création du site. En cas de doute, faites vérifier votre situation." },
  ],
  related: ['prix-site-internet-montpellier', 'choisir-agence-web-montpellier', 'relances-factures-impayees-automatiques'],
});

/* ═══════════════ 5. RELANCES FACTURES IMPAYÉES ═══════════════ */
GUIDES.push({
  slug: 'relances-factures-impayees-automatiques',
  title: 'Relancer ses factures impayées automatiquement | GroupSolution',
  description: "Calendrier J-3 à J+30, modèles de messages, pénalités, indemnité de 40 €, outils : relancez vos factures impayées sans abîmer la relation client.",
  h1: 'Relancer ses factures impayées automatiquement sans abîmer la relation client',
  short: "Calendrier de relance, modèles de messages prêts à l'emploi, pénalités, indemnité de 40 € et tableau de bord de trésorerie.",
  intro: `<p>Relancer un client qui ne paie pas, personne n'aime ça. On repousse, on se dit qu'il a sûrement oublié, on ne veut pas paraître insistant… et trois mois plus tard, la facture n'est toujours pas réglée. Pour une TPE, quelques factures en retard suffisent à tendre la trésorerie.</p>
<p>La solution n'est pas d'être plus agressif, c'est d'être <strong>plus régulier</strong>. Une relance automatique, polie et prévisible, fait partie du processus normal : le client ne la prend pas personnellement, et vous n'avez plus à y penser. Voici un calendrier éprouvé, des modèles de messages, le cadre légal à connaître et les outils pour mettre tout ça en place.</p>`,
  sections: [
    { id: 'avant', h2: 'Avant la relance : une facture qui se paie facilement', html: `
<p>Une bonne partie des retards vient d'une facture mal préparée. Avant même de penser relance, vérifiez :</p>
<ul>
<li><strong>La date d'échéance est explicite</strong> (« à régler avant le 15 octobre 2026 ») plutôt que « à 30 jours ».</li>
<li><strong>Le paiement est simple</strong> : IBAN bien visible, lien de paiement par carte, référence à indiquer dans le virement.</li>
<li><strong>La facture arrive à la bonne personne</strong> : dans une entreprise cliente, c'est souvent la comptabilité, pas votre interlocuteur habituel.</li>
<li><strong>Les mentions obligatoires sont présentes</strong>, notamment, entre professionnels, le taux des pénalités de retard et l'indemnité forfaitaire pour frais de recouvrement.</li>
<li><strong>Un acompte</strong> a été demandé à la commande pour les prestations importantes : c'est la meilleure protection contre les impayés.</li>
</ul>
${note(`Réforme de la facturation électronique : depuis le 1<sup>er</sup> septembre 2026, toutes les entreprises assujetties à la TVA doivent pouvoir recevoir des factures électroniques entre professionnels ; l'obligation d'émission s'étend progressivement (2026 pour les grandes entreprises et ETI, 2027 pour les PME et micro-entreprises, selon le calendrier en vigueur). C'est l'occasion de choisir un outil qui gère aussi les relances. Vérifiez le calendrier qui vous concerne auprès de votre expert-comptable.`)}` },
    { id: 'calendrier', h2: 'Le calendrier de relance J-3 / J+7 / J+15 / J+30', html: `
<p>Voici le rythme que nous mettons en place le plus souvent. Il s'adapte à votre secteur, mais sa logique reste la même : prévenir, rappeler, insister, formaliser.</p>
${table(['Moment', 'Canal', 'Ton', 'Objectif'], [
  ['J-3 (avant échéance)', 'E-mail', 'Informatif, cordial', 'Rappeler l\'échéance, faciliter le paiement'],
  ['J+7', 'E-mail + SMS', 'Courtois, factuel', 'Signaler le retard, vérifier qu\'il n\'y a pas de problème'],
  ['J+15', 'E-mail + appel', 'Ferme, personnel', 'Obtenir une date de paiement précise'],
  ['J+30', 'Courrier recommandé / e-mail formel', 'Formel', 'Mise en demeure, rappel des pénalités'],
  ['Au-delà', 'Selon le montant', 'Juridique', 'Recouvrement amiable ou judiciaire'],
])}
<p>Deux règles pour que l'automatisation ne se retourne pas contre vous :</p>
<ul>
<li><strong>Tout s'arrête dès le paiement</strong>. Le système doit être relié à votre compte bancaire ou à votre logiciel de facturation pour détecter les règlements. Relancer un client qui a payé la veille est la pire façon d'abîmer la relation.</li>
<li><strong>L'appel de J+15 reste humain</strong>. C'est le moment où l'on découvre un litige, un changement d'interlocuteur ou une difficulté passagère. Un appel bien mené débloque plus de situations que n'importe quel e-mail.</li>
</ul>
${box([
  "La relance J-3 n'est pas une relance : c'est un service, et elle réduit nettement les oublis.",
  "Automatisez les messages, gardez l'appel.",
  "Aucune relance ne doit partir sur une facture déjà payée ou contestée.",
])}` },
    { id: 'modeles', h2: 'Modèles de messages à adapter', html: `
<h3>J-3 : le rappel amical</h3>
<blockquote>Bonjour [Prénom], petit rappel : la facture n° [numéro] de [montant] € arrive à échéance le [date]. Vous pouvez la régler par virement (IBAN ci-dessous) ou par carte via ce lien : [lien]. Belle journée, [Signature]</blockquote>
<h3>J+7 : le constat courtois</h3>
<blockquote>Bonjour [Prénom], sauf erreur de notre part, nous n'avons pas encore reçu le règlement de la facture n° [numéro] ([montant] €), échue le [date]. S'il s'agit d'un oubli, voici le lien de paiement : [lien]. Si quelque chose pose problème sur cette facture, dites-le-moi, on regarde ensemble. Merci, [Signature]</blockquote>
<h3>J+15 : la relance ferme</h3>
<blockquote>Bonjour [Prénom], la facture n° [numéro] de [montant] € reste impayée à ce jour, malgré notre précédent message. Pouvez-vous nous indiquer la date à laquelle le règlement sera effectué ? Je vous appellerai [jour] pour faire le point. Cordialement, [Signature]</blockquote>
<h3>J+30 : la mise en demeure</h3>
<blockquote>Madame, Monsieur, malgré nos relances des [dates], la facture n° [numéro] d'un montant de [montant] €, échue le [date], demeure impayée. Nous vous mettons en demeure de régler cette somme sous huit jours à compter de la réception du présent courrier. À défaut, nous serons contraints d'engager une procédure de recouvrement. Nous vous rappelons que, conformément à nos conditions de vente, des pénalités de retard ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 € sont exigibles. [Signature]</blockquote>
<p>Personnalisez toujours le prénom, le numéro et le montant : un message générique est plus facile à ignorer. Et relisez vos modèles une fois par an.</p>
${cta({ title: 'Et si vos relances partaient toutes seules ?', text: "Nous connectons votre facturation, votre banque et votre messagerie pour que chaque relance parte au bon moment et s'arrête dès le paiement.", href: L.auto, label: 'Découvrir nos automatisations', href2: L.calc, label2: 'Estimer le temps gagné' })}` },
    { id: 'legal', h2: 'Pénalités de retard et indemnité forfaitaire de 40 €', html: `
<h3>Entre professionnels</h3>
<p>Le Code de commerce (article L441-10) prévoit que, en cas de retard de paiement entre professionnels :</p>
<ul>
<li>des <strong>pénalités de retard</strong> sont exigibles de plein droit, sans qu'un rappel soit nécessaire. À défaut de taux fixé dans vos conditions, c'est le taux de la BCE majoré de 10 points ; un taux contractuel ne peut pas être inférieur à trois fois le taux d'intérêt légal ;</li>
<li>une <strong>indemnité forfaitaire pour frais de recouvrement de 40 €</strong> est due pour chaque facture payée en retard. Si vos frais réels de recouvrement sont plus élevés, une indemnisation complémentaire peut être demandée sur justificatifs.</li>
</ul>
<p>Ces mentions doivent figurer sur vos factures et vos conditions de vente. Les délais de paiement sont eux aussi encadrés : sauf cas particuliers, pas plus de 60 jours à compter de la date d'émission de la facture, ou 45 jours fin de mois si c'est prévu au contrat.</p>
<p>Faut-il réellement appliquer ces pénalités ? C'est une décision commerciale. Beaucoup d'entreprises les mentionnent systématiquement et ne les réclament qu'aux clients récidivistes ou en cas de procédure. Le simple fait qu'elles figurent dans la mise en demeure accélère souvent le paiement.</p>
<h3>Avec des particuliers</h3>
<p>L'indemnité de 40 € ne s'applique pas aux consommateurs. En cas de retard, des intérêts au taux légal peuvent courir à compter de la mise en demeure. Avec les particuliers, la prévention (acompte, paiement à la livraison ou à la fin de l'intervention) reste la meilleure approche.</p>
<h3>Si rien ne bouge</h3>
<p>Après la mise en demeure, plusieurs voies existent : la procédure simplifiée de recouvrement des petites créances confiée à un commissaire de justice (pour les créances de faible montant, si le débiteur l'accepte), l'injonction de payer devant le tribunal compétent (tribunal de commerce de Montpellier entre commerçants, tribunal judiciaire dans les autres cas), ou une société de recouvrement. Pour les montants importants, demandez conseil à un professionnel du droit.</p>
${box([
  "Entre pros : pénalités de retard + 40 € par facture, à condition de les mentionner.",
  "Avec les particuliers : pas d'indemnité de 40 €, misez sur l'acompte.",
  "La mise en demeure écrite est l'étape préalable à presque toutes les procédures.",
])}` },
    { id: 'outils', h2: 'Quels outils pour automatiser les relances ?', html: `
<p>Trois approches, selon votre organisation :</p>
${table(['Approche', 'Pour qui', 'Avantages', 'Limites'], [
  ['Fonction relance de votre logiciel de facturation', 'TPE qui facturent depuis un seul outil', 'Rapide à activer, peu coûteux', 'Messages peu personnalisables, souvent e-mail seul'],
  ['Outil dédié au recouvrement / à la gestion du poste client', 'Volume de factures important, plusieurs relanceurs', 'Scénarios avancés, suivi détaillé', 'Abonnement supplémentaire, intégration à prévoir'],
  ['Automatisation sur-mesure', 'Facturation répartie sur plusieurs outils, besoins spécifiques', 'SMS, e-mail, appel planifié, rapprochement bancaire, tableau de bord', 'Mise en place initiale plus longue'],
])}
<p>La plupart des logiciels de facturation courants (Pennylane, Axonaut, Sellsy, Qonto, Tiime et d'autres) proposent des relances automatiques par e-mail. Vérifiez surtout trois points : la détection automatique des paiements, la possibilité d'exclure un client ou une facture (litige en cours), et l'envoi par SMS, souvent plus efficace auprès des particuliers et des artisans.</p>` },
    { id: 'ia', h2: 'Aller plus loin : IA, agents et orchestration', html: `
<p>Au-delà des scénarios de relance à dates fixes, les outils actuels ouvrent d'autres possibilités. Il est possible, par exemple :</p>
<ul>
<li><strong>d'extraire automatiquement les données des factures et des relevés</strong> grâce à l'IA (montant, échéance, référence, émetteur), y compris depuis des PDF ou des factures reçues par e-mail, pour alimenter votre tableau de suivi sans saisie ;</li>
<li><strong>de rapprocher les paiements</strong> : un virement au libellé approximatif peut être associé à la bonne facture, avec une validation de votre part en cas de doute ;</li>
<li><strong>de confier à un agent IA la rédaction des relances</strong> en tenant compte de l'historique du client (bon payeur habituel, litige en cours, échéancier accordé), plutôt que d'envoyer le même texte à tout le monde ;</li>
<li><strong>de trier les réponses des clients</strong> : « déjà payé », « facture contestée », « demande de délai ». Chaque cas déclenche la suite adaptée, et les situations sensibles vous sont remontées ;</li>
<li><strong>d'utiliser un assistant vocal</strong> pour un rappel téléphonique courtois de premier niveau, à condition d'être transparent sur le fait qu'il s'agit d'un assistant automatisé ;</li>
<li><strong>d'orchestrer l'ensemble via les API</strong> de votre banque, de votre logiciel de facturation et de votre messagerie, pour que tout reste synchronisé.</li>
</ul>
<p>Ces outils ne remplacent pas le jugement : un client en difficulté, un litige ou un partenaire important méritent un échange humain. L'IA sert à préparer le terrain, pas à gérer seule la relation. Veillez aussi à ce que les données financières de vos clients soient traitées dans un cadre conforme au RGPD.</p>` },
    { id: 'tableau-de-bord', h2: 'Le tableau de bord de trésorerie : voir venir plutôt que subir', html: `
<p>Les relances traitent le symptôme. Un tableau de bord simple vous permet d'anticiper. Il n'a pas besoin d'être sophistiqué ; il doit répondre, en un coup d'œil, à quatre questions :</p>
<ul>
<li><strong>Combien m'est-il dû aujourd'hui ?</strong> Total des factures émises non réglées.</li>
<li><strong>Combien est en retard, et depuis quand ?</strong> Répartition 0-15 jours, 15-30 jours, plus de 30 jours.</li>
<li><strong>Qui sont les mauvais payeurs récurrents ?</strong> Pour ajuster les conditions (acompte plus élevé, paiement à la commande).</li>
<li><strong>Quel est mon délai moyen d'encaissement ?</strong> Et s'améliore-t-il depuis la mise en place des relances ?</li>
</ul>
<p>Pour une entreprise de services à ${commune('saint-jean-de-vedas', 'Saint-Jean-de-Védas')} ou un artisan de ${commune('perols', 'Pérols')}, ce tableau peut tenir sur un écran et se mettre à jour tout seul à partir de la facturation et de la banque. Couplé aux relances automatiques et à ${guide('automatiser-devis-artisan', 'des devis automatisés')}, il boucle le cycle complet : de la demande du client jusqu'à l'argent sur le compte.</p>` },
  ],
  faq: [
    { q: 'Les relances automatiques ne risquent-elles pas de vexer mes clients ?', a: "Pas si elles sont polies, personnalisées et s'arrêtent dès le paiement. Les clients professionnels reçoivent ce type de rappels de la plupart de leurs fournisseurs ; c'est l'absence de régularité qui surprend, pas la relance." },
    { q: 'L\'indemnité de 40 € est-elle automatique ?', a: "Entre professionnels, elle est due de plein droit pour chaque facture payée en retard, et doit être mentionnée sur vos factures. Libre à vous ensuite de la réclamer ou non ; elle ne s'applique pas aux clients particuliers." },
    { q: 'Quand envoyer une mise en demeure ?', a: "En général après deux ou trois relances restées sans effet, souvent autour de 30 jours de retard. Elle doit être écrite, idéalement par lettre recommandée avec accusé de réception, et fixer un délai précis pour payer." },
    { q: 'Faut-il relancer par SMS ?', a: "Le SMS est souvent plus lu que l'e-mail, notamment par les particuliers et les petites entreprises. Il fonctionne bien pour les rappels courts (J-3, J+7), en complément de l'e-mail qui contient la facture." },
    { q: 'Peut-on automatiser les relances sans changer de logiciel de facturation ?', a: "Souvent oui. On peut relier votre logiciel actuel, votre banque et une messagerie SMS/e-mail grâce à une automatisation, sans migrer vos données." },
  ],
  related: ['automatiser-devis-artisan', 'obligations-legales-site-internet', 'choisir-agence-web-montpellier'],
});

/* ═══════════════ 6. CHOISIR SON AGENCE WEB ═══════════════ */
GUIDES.push({
  slug: 'choisir-agence-web-montpellier',
  title: 'Agence web à Montpellier : 12 questions à poser | GroupSolution',
  description: "Propriété du site, hébergement, délais, SEO, maintenance, contrat : les 12 questions à poser à une agence web à Montpellier avant de signer.",
  h1: 'Choisir son agence web à Montpellier : 12 questions à poser avant de signer',
  short: "Propriété, hébergement, délais, référencement, maintenance, contrat : les questions qui évitent les mauvaises surprises.",
  intro: `<p>Montpellier compte un grand nombre d'agences web, de freelances et de plateformes qui promettent toutes un site « moderne, rapide et optimisé ». Sur une plaquette, elles se ressemblent. Les différences apparaissent après la signature : un nom de domaine que vous ne pouvez pas récupérer, un abonnement impossible à résilier, un site livré sans aucun référencement, un interlocuteur qui ne répond plus.</p>
<p>Les douze questions ci-dessous sont celles que nous vous conseillons de poser à tout prestataire, nous compris. Pour chacune, nous indiquons la réponse à attendre et le signal d'alerte.</p>`,
  sections: [
    { id: 'propriete', h2: 'Propriété et technique : ce qui vous appartient vraiment', html: `
<h3>1. À qui appartiendra le nom de domaine ?</h3>
<p><strong>Réponse attendue :</strong> « À vous, enregistré à votre nom ou à celui de votre entreprise. » Le nom de domaine est votre adresse sur internet ; s'il est au nom de l'agence, vous en dépendez pour toujours. <strong>Signal d'alerte :</strong> une réponse floue, ou « on s'en occupe, ne vous inquiétez pas ».</p>
<h3>2. Serai-je propriétaire du site et de ses contenus ?</h3>
<p>Textes, photos, design, code : demandez ce qui vous est cédé et ce qui reste la propriété de l'agence. Certaines offres « tout compris » louent en réalité un site que vous ne pouvez pas emporter. Vérifiez aussi que les photos utilisées sont libres de droits ou vous appartiennent.</p>
<h3>3. Où sera hébergé le site, et puis-je changer d'hébergeur ?</h3>
<p>L'hébergement conditionne la vitesse, la sécurité et votre liberté. Demandez le nom de l'hébergeur, la localisation des serveurs, la fréquence des sauvegardes, et surtout la procédure si vous souhaitez partir : pouvez-vous récupérer une copie complète du site ?</p>
<h3>4. Aurai-je les accès à mes comptes ?</h3>
<p>Fiche Google Business Profile, Google Search Console, statistiques, outil de réservation : ces comptes doivent être créés à votre nom, avec l'agence en simple gestionnaire. Si l'agence les crée à son nom, vous perdez votre historique et vos avis en cas de départ.</p>
${box([
  "Nom de domaine, comptes Google et contenus : à votre nom, sans exception.",
  "Demandez par écrit ce que vous récupérez si vous changez de prestataire.",
  "Une agence sérieuse n'a aucune raison de refuser ces points.",
])}` },
    { id: 'projet', h2: 'Déroulé du projet : délais, contenus, interlocuteur', html: `
<h3>5. Quel est le délai réaliste, et de quoi dépend-il ?</h3>
<p>Un site vitrine prend en général quelques semaines ; un site avec réservation ou boutique, davantage. Le délai dépend souvent plus de la remise de vos contenus (textes, photos, validations) que du travail de l'agence. Une bonne réponse détaille les étapes et ce qui est attendu de vous à chacune.</p>
<h3>6. Qui rédige les textes et fournit les photos ?</h3>
<p>C'est l'un des principaux postes de coût et de retard. Si vous devez tout écrire vous-même, sachez-le avant de signer. Si l'agence rédige, demandez si les textes sont pensés pour le référencement local (Montpellier, votre quartier, les communes que vous desservez comme ${commune('lattes', 'Lattes')} ou ${commune('castelnau-le-lez', 'Castelnau-le-Lez')}).</p>
<h3>7. Qui sera mon interlocuteur, du devis à l'après-livraison ?</h3>
<p>Dans certaines structures, le commercial qui vous vend le site disparaît après la signature, et vous parlez ensuite à un support anonyme. Un interlocuteur unique, qui connaît votre projet, fait gagner beaucoup de temps et évite les incompréhensions.</p>
<h3>8. Pouvez-vous me montrer des sites réalisés… et vérifiables ?</h3>
<p>Un portfolio de maquettes ne prouve pas grand-chose. Demandez des sites en ligne, avec le nom des entreprises, et n'hésitez pas à contacter un ou deux clients. Regardez les sites sur votre téléphone : sont-ils rapides, clairs, faciles à utiliser ? Apparaissent-ils sur Google quand on cherche leur métier et leur ville ?</p>
${cta({ title: 'Posez-nous ces 12 questions', text: "Nous répondons à chacune par écrit dans notre proposition : propriété, hébergement, délais, référencement, maintenance. Un premier échange de 15 minutes suffit pour cadrer votre projet.", href: L.rdv, label: 'Prendre rendez-vous', href2: L.offre, label2: 'Voir notre offre site internet' })}` },
    { id: 'apres', h2: 'Référencement, maintenance et contrat', html: `
<h3>9. Qu'est-ce qui est inclus en référencement ?</h3>
<p>« Optimisé pour le SEO » est une formule sans valeur si elle n'est pas détaillée. Demandez précisément : structure des titres, balises title et description rédigées page par page, vitesse de chargement, version mobile, données structurées, création ou optimisation de la fiche Google, déclaration dans la Search Console. Le référencement continu (contenus, avis, liens) est une prestation distincte : il est normal qu'il soit facturé à part, à condition que ce soit dit.</p>
<h3>10. Comment se passe la maintenance, et combien coûte une modification ?</h3>
<p>Qui fait les mises à jour de sécurité ? Que se passe-t-il si le site tombe un samedi ? Combien coûte l'ajout d'une page ou le changement d'un tarif ? Pouvez-vous modifier vous-même les textes simples ? Ces réponses pèsent plus sur votre quotidien que le design.</p>
<h3>11. Quelle est la durée d'engagement, et comment résilier ?</h3>
<p>Lisez le contrat. Les offres de « site gratuit » ou à petit prix mensuel s'accompagnent souvent d'un engagement de plusieurs années, avec des conditions de sortie strictes. Ce modèle n'est pas illégal, mais il faut le choisir en connaissance de cause et calculer le coût total. Vérifiez aussi que le contrat mentionne la conformité légale du site (mentions, cookies, confidentialité) : voir notre guide ${guide('obligations-legales-site-internet', 'sur les obligations légales d\'un site pro')}.</p>
${table(['Question', 'Bonne réponse', 'Signal d\'alerte'], [
  ['Nom de domaine', 'À votre nom', 'Au nom de l\'agence'],
  ['Propriété du site', 'Cédé à la livraison, export possible', 'Location, site non récupérable'],
  ['Comptes Google', 'Créés à votre nom', 'Créés et gardés par l\'agence'],
  ['Référencement', 'Liste précise des actions', '« Optimisé SEO » sans détail'],
  ['Maintenance', 'Périmètre, délai d\'intervention, tarif', '« On verra au besoin »'],
  ['Engagement', 'Durée claire, sortie simple', 'Engagement long, pénalités de résiliation'],
  ['Portfolio', 'Sites en ligne, clients joignables', 'Maquettes uniquement'],
])}` },
    { id: 'rapporte', h2: '12. Qu\'est-ce qui fera que ce site me rapporte ?', html: `
<p>C'est la question la plus importante, et celle que l'on pose le moins. Un site vitrine joli mais passif coûte de l'argent. Un site qui rapporte a quelques caractéristiques identifiables :</p>
<ul>
<li><strong>Il est trouvé</strong> : bien positionné sur les recherches locales qui comptent pour vous, relié à une fiche Google soignée. Notre guide ${guide('apparaitre-google-maps-montpellier', 'pour apparaître en haut de Google Maps')} détaille cette partie.</li>
<li><strong>Il convertit</strong> : en moins de cinq secondes, le visiteur comprend ce que vous faites, où, et comment vous contacter. Le numéro est cliquable, le formulaire court.</li>
<li><strong>Il travaille à votre place</strong> : prise de rendez-vous, devis automatique, relances, confirmation par SMS. C'est ce qui fait gagner des heures chaque semaine.</li>
<li><strong>Il se mesure</strong> : vous savez combien d'appels, de demandes de devis et de réservations il génère chaque mois.</li>
</ul>
<p>Demandez à l'agence comment elle compte mesurer ces résultats, et ce qu'elle propose si les demandes n'arrivent pas. Une réponse concrète vaut mieux qu'une promesse de « première page de Google », que personne ne peut garantir honnêtement.</p>
<p>Chez GroupSolution, c'est précisément notre parti pris : un site, et le système qui travaille derrière. Par exemple, une entreprise de services à domicile peut proposer à ses clients d'envoyer des photos et recevoir un devis préparé automatiquement. Pour un commerce de ${commune('sete', 'Sète')} ou un artisan de ${commune('vendargues', 'Vendargues')}, ce sera plutôt une prise de rendez-vous, une demande d'avis automatique ou un rappel des devis en attente.</p>
${box([
  "Un bon prestataire répond par écrit, précisément, à chacune de ces 12 questions.",
  "Méfiez-vous des garanties de position sur Google : personne ne contrôle l'algorithme.",
  "Jugez un site sur ce qu'il vous fait gagner (appels, devis, heures), pas seulement sur son apparence.",
])}` },
    { id: 'methode', h2: 'Méthode : comparer trois agences en une semaine', html: `
<ol>
<li><strong>Jour 1</strong> : listez vos objectifs (appels, devis, réservations), vos pages indispensables et votre budget. Un document d'une page suffit.</li>
<li><strong>Jours 2-3</strong> : contactez trois prestataires, envoyez-leur le même document et les 12 questions.</li>
<li><strong>Jours 4-5</strong> : comparez les réponses dans un tableau, en calculant le coût total sur trois ans (création + hébergement + maintenance + abonnements). Notre guide ${guide('prix-site-internet-montpellier', 'sur le prix d\'un site internet à Montpellier')} explique ce qui fait varier ces montants.</li>
<li><strong>Jours 6-7</strong> : appelez un client de chaque agence, puis décidez. Privilégiez la clarté des réponses plutôt que le prix le plus bas.</li>
</ol>
<p>Vous pouvez aussi commencer par décrire votre projet avec notre <a href="${L.config}">configurateur de projet (gratuit)</a> : vous arriverez aux rendez-vous avec une base claire, identique pour chaque prestataire.</p>` },
  ],
  faq: [
    { q: 'Vaut-il mieux une agence locale à Montpellier ?', a: "La proximité aide pour les rendez-vous et la connaissance du tissu local (quartiers, communes, concurrence), mais ce n'est pas un critère suffisant. La clarté du contrat, la propriété de vos actifs et la qualité du suivi comptent davantage." },
    { q: 'Freelance ou agence : que choisir ?', a: "Un freelance est souvent plus léger et très réactif, mais seul face aux imprévus. Une agence offre plus de compétences et de continuité, avec une organisation plus lourde. Dans les deux cas, posez les mêmes questions sur la propriété, la maintenance et l'engagement." },
    { q: 'Une agence peut-elle garantir la première place sur Google ?', a: "Non, personne ne contrôle l'algorithme de Google. Une agence peut s'engager sur des actions précises et sur la mesure des résultats, pas sur une position garantie. Méfiez-vous de ce type de promesse." },
    { q: 'Comment récupérer mon nom de domaine s\'il est au nom de mon ancienne agence ?', a: "Demandez par écrit le transfert du domaine et le code de transfert (code AUTH). Si l'agence refuse, vérifiez votre contrat ; pour un nom de domaine en .fr, l'Afnic, qui gère cette extension, prévoit des procédures de résolution des litiges." },
    { q: 'Quel budget prévoir pour un site professionnel à Montpellier ?', a: "Il dépend surtout du périmètre, des contenus, des fonctionnalités et du suivi attendu. Le plus fiable est de décrire précisément votre projet et de demander des devis détaillés sur la même base. Chez GroupSolution, le devis est gratuit et personnalisé." },
  ],
  related: ['prix-site-internet-montpellier', 'apparaitre-google-maps-montpellier', 'obligations-legales-site-internet'],
});

/* ═══════════════════════════════════════════════════════════
   RENDU
   ═══════════════════════════════════════════════════════════ */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = html => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
const countWords = html => strip(html).split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
const plain = html => strip(html).replace(/\s+/g, ' ').trim();
const ld = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const bySlug = slug => GUIDES.find(g => g.slug === slug);
const AUTO_FIRST = new Set(['automatiser-devis-artisan', 'relances-factures-impayees-automatiques']);

const ARTICLE_CSS = `
.g-main{padding:96px 0 40px}
.g-wrap{max-width:760px;margin:0 auto;padding:0 20px}
.g-crumbs{font-size:13px;color:var(--gris);margin:8px 0 22px;line-height:1.6}
.g-crumbs a{color:var(--gris);text-decoration:none}.g-crumbs a:hover{color:var(--rose-fonce)}
.g-kicker{display:inline-block;background:var(--rose-clair);color:var(--rose-fonce);font-weight:700;font-size:.8rem;padding:5px 12px;border-radius:999px;margin-bottom:14px}
.g-head h1{font-size:clamp(1.8rem,4.6vw,2.6rem);line-height:1.15;font-weight:800;letter-spacing:-.02em;margin-bottom:16px;overflow-wrap:break-word}
.g-meta{display:flex;flex-wrap:wrap;gap:6px 16px;color:var(--gris);font-size:.9rem;margin-bottom:28px}
.g-article{font-size:1.08rem;line-height:1.8;color:#262626;overflow-wrap:break-word}
.g-article p,.g-article ul,.g-article ol,.g-article blockquote{margin:0 0 1.1em}
.g-article ul,.g-article ol{padding-left:1.3em}
.g-article li{margin-bottom:.45em}
.g-article h2{font-size:clamp(1.45rem,3.4vw,1.85rem);line-height:1.25;font-weight:800;margin:2.2em 0 .7em;scroll-margin-top:90px;letter-spacing:-.01em}
.g-article h3{font-size:1.2rem;line-height:1.35;font-weight:700;margin:1.6em 0 .5em;scroll-margin-top:90px}
.g-article a{color:#be185d;text-decoration:underline;text-underline-offset:2px}
.g-article a.btn{text-decoration:none}
.g-article code{background:#f3f4f6;padding:1px 6px;border-radius:6px;font-size:.92em}
.g-article blockquote{border-left:4px solid var(--rose);background:#fafafa;padding:14px 18px;border-radius:0 12px 12px 0;font-size:1rem;color:#374151}
.g-intro{font-size:1.15rem}
.g-toc{background:var(--gris-clair);border:1px solid #eee;border-radius:16px;padding:20px 24px;margin:26px 0 10px}
.g-toc p{font-weight:800;margin-bottom:8px;font-size:1rem}
.g-toc ol{margin:0;padding-left:1.3em;font-size:1rem;line-height:1.7}
.g-toc a{color:var(--gris-fonce);text-decoration:none}.g-toc a:hover{color:var(--rose-fonce);text-decoration:underline}
.g-box{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:16px;padding:18px 22px;margin:1.6em 0}
.g-box-t{font-weight:800;color:#047857;margin-bottom:6px!important;font-size:.95rem;text-transform:uppercase;letter-spacing:.04em}
.g-box ul{margin:0!important;font-size:1rem}
.g-note{background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;padding:16px 20px;margin:1.6em 0;font-size:1rem}
.g-table{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:1.5em 0;border:1px solid #e5e7eb;border-radius:14px}
.g-table table{width:100%;border-collapse:collapse;font-size:.95rem;line-height:1.5;min-width:520px}
.g-table caption{caption-side:bottom;text-align:left;font-size:.82rem;color:var(--gris);padding:10px 14px}
.g-table th,.g-table td{padding:11px 14px;text-align:left;vertical-align:top;border-bottom:1px solid #f0f0f0}
.g-table thead th{background:#1f2433;color:#fff;font-weight:700;font-size:.88rem}
.g-table tbody th{font-weight:700;color:var(--gris-fonce)}
.g-table tbody tr:nth-child(even){background:#fafafa}
.g-table tbody tr:last-child th,.g-table tbody tr:last-child td{border-bottom:0}
.g-cta{background:linear-gradient(135deg,#1f2433,#2a1f2e);color:#fff;border-radius:20px;padding:26px 26px 24px;margin:2em 0}
.g-cta p{color:#e5e7eb;margin-bottom:14px!important;font-size:1rem}
.g-cta .g-cta-t{color:#fff;font-weight:800;font-size:1.25rem;margin-bottom:6px!important;line-height:1.3}
.g-cta-b{display:flex;flex-wrap:wrap;gap:10px}
.g-cta .btn{font-size:.95rem}
.g-faq{margin-top:2.4em}
.g-faq details{border:1px solid #e5e7eb;border-radius:14px;padding:0 18px;margin-bottom:10px;background:#fff}
.g-faq summary{cursor:pointer;font-weight:700;padding:15px 0;list-style:none;display:flex;justify-content:space-between;gap:14px;font-size:1.02rem;line-height:1.45}
.g-faq summary::-webkit-details-marker{display:none}
.g-faq summary::after{content:"+";color:var(--rose-fonce);font-size:1.3rem;line-height:1;flex-shrink:0}
.g-faq details[open] summary::after{content:"–"}
.g-faq details p{padding-bottom:14px;margin:0!important;font-size:1rem;color:#374151}
.g-author{display:flex;gap:14px;align-items:center;border-top:1px solid #eee;margin-top:2.4em;padding-top:20px;font-size:.95rem;color:var(--gris)}
.g-author b{color:var(--gris-fonce)}
.g-related{max-width:1000px;margin:10px auto 60px;padding:0 20px}
.g-related h2,.g-list h2{font-size:1.4rem;font-weight:800;margin-bottom:16px}
.g-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.g-card{display:flex;flex-direction:column;gap:8px;background:#fff;border:1px solid #eee;border-radius:18px;padding:22px;text-decoration:none;color:var(--gris-fonce);box-shadow:var(--box-shadow);transition:var(--transition)}
.g-card:hover{transform:translateY(-3px);box-shadow:var(--box-shadow-lg)}
.g-card strong{font-size:1.05rem;line-height:1.35}
.g-card span{color:var(--gris);font-size:.93rem;line-height:1.55}
.g-card em{font-style:normal;color:var(--rose-fonce);font-weight:700;font-size:.85rem;margin-top:auto}
.g-list{max-width:1000px;margin:0 auto 60px;padding:0 20px}
.nav-actions .btn{text-decoration:none}
@media(max-width:600px){.g-main{padding-top:84px}.g-article{font-size:1.04rem}.g-cta{padding:22px 18px}.g-cta-b .btn{width:100%;justify-content:center}.g-toc{padding:16px 18px}}
`;

const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
    <symbol id="i-mail" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></symbol>
    <symbol id="i-arrow-right" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></symbol>
    <symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/><path d="M19 16L19.7 18.3L22 19L19.7 19.7L19 22L18.3 19.7L16 19L18.3 18.3L19 16Z"/></symbol>
    <symbol id="i-map-pin" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></symbol>
  </svg>`;

const NAV = `<nav id="nav">
    <div class="container nav-content">
      <a href="../site-internet-montpellier.html" class="nav-logo"><img src="../../Logo.svg" alt="GroupSolution" /></a>
      <ul class="nav-links">
        <li><a href="index.html">Guides</a></li>
        <li><a href="prix-site-internet-montpellier.html">Prix</a></li>
        <li><a href="../../automatisation/">Automatisation</a></li>
        <li><a href="https://www.groupsolution.fr/" class="nav-holding">Groupe Solution ↗</a></li>
      </ul>
      <div class="nav-actions">
        <a href="tel:+33782298559" class="btn btn-primary" style="padding: 8px 16px;">
          <svg class="icon" style="width: 16px; height: 16px;"><use href="#i-phone"/></svg>
          <span>Contact</span>
        </a>
      </div>
    </div>
  </nav>`;

const TAIL = `<section class="groupe-band" id="groupe">
    <div class="container">
      <div class="groupe-inner reveal">
        <span class="groupe-kicker">
          <svg class="icon" style="width:14px;height:14px;"><use href="#i-sparkles"/></svg>
          Une marque de Groupe Solution
        </span>
        <h2>Montpellier fait partie de <span class="accent">Groupe Solution</span></h2>
        <p>Éditeur de logiciels &amp; d'automatisations sur-mesure. Au-delà du digital local, le groupe conçoit des systèmes qui absorbent vos tâches répétitives — partout en France et dans les DOM-TOM.</p>
        <div class="groupe-ctas">
          <a href="https://www.groupsolution.fr/echanger.html#rendez-vous" class="btn btn-primary">
            <svg class="icon"><use href="#i-mail"/></svg>
            <span>Prendre rendez-vous</span>
          </a>
          <a href="https://www.groupsolution.fr/" class="btn btn-secondary">
            <svg class="icon"><use href="#i-arrow-right"/></svg>
            <span>Découvrir Groupe Solution</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="../../Logo.svg" alt="GroupSolution Agence Digitale" />
          <p class="footer-desc">Création de sites et automatisation sur-mesure pour les commerces et PME de Montpellier et sa métropole.</p>
        </div>
        <div class="footer-links">
          <h4>Guides</h4>
          <ul>
${GUIDES.map(g => `            <li><a href="${g.slug}.html">${esc(g.h1.split(' : ')[0])}</a></li>`).join('\n')}
          </ul>
        </div>
        <div class="footer-links">
          <h4>Zones couvertes</h4>
          <ul>
            <li><a href="../site-internet-montpellier.html">Montpellier</a></li>
            <li><a href="../site-internet-lattes.html">Lattes</a></li>
            <li><a href="../site-internet-perols.html">Pérols</a></li>
            <li><a href="../site-internet-castelnau-le-lez.html">Castelnau-le-Lez</a></li>
            <li><a href="../site-internet-vendargues.html">Vendargues</a></li>
            <li><a href="../site-internet-meze.html">Mèze</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Contact Direct</h4>
          <p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-phone"/></svg><a href="tel:+33782298559">07 82 29 85 59</a></p>
          <p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-mail"/></svg><a href="mailto:contact@groupsolution.fr">contact@groupsolution.fr</a></p>
          <p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-map-pin"/></svg>Montpellier, Hérault</p>
        </div>
      </div>
      <div class="footer-bottom">© 2026 GroupSolution SAS. Tous droits réservés.</div>
    </div>
  </footer>

  <script>
    window.addEventListener('scroll', function () {
      document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
    (function () {
      var els = document.querySelectorAll('.reveal');
      if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('visible'); }); return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.1 });
      els.forEach(function (el) { io.observe(el); });
    })();
  </script>
  <div class="gs-sticky"><a class="s1" href="tel:+33782298559"><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:6px"><path d="M6.5 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/></svg>Appeler</a><a class="s2" href="https://www.groupsolution.fr/echanger.html#rendez-vous">Être rappelé</a></div>
  <script src="/analytics.js" defer></script>`;

function head({ title, description, url, ogType, jsonld }) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="GroupSolution" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/rea1.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${SITE}/rea1.jpg" />
  <link rel="icon" type="image/svg+xml" href="../../favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../montpellier.css">
  <link rel="stylesheet" href="../communes.css">
  <style>${ARTICLE_CSS}</style>
  ${ld(jsonld)}
</head>`;
}

const ORG = { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Groupe Solution', url: `${SITE}/`, logo: { '@type': 'ImageObject', url: `${SITE}/Logo.svg` } };
const crumbsLd = (extra) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { name: 'Groupe Solution', item: `${SITE}/` },
    { name: 'Site internet Montpellier', item: `${SITE}/montpellier/site-internet-montpellier.html` },
    { name: 'Guides', item: `${BASE}index.html` },
    ...extra,
  ].map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })),
});

function finalCta(g) {
  return AUTO_FIRST.has(g.slug)
    ? cta({ title: 'On en parle 15 minutes ?', text: "Décrivez-nous votre façon de travailler aujourd'hui : nous vous dirons honnêtement ce qui vaut la peine d'être automatisé, et ce qui ne l'est pas.", href: L.auto, label: 'Voir nos automatisations', href2: L.rdv, label2: 'Prendre rendez-vous' })
    : cta({ title: 'Un site qui vous amène des clients, et le système derrière', text: "Site vitrine, réservation, devis automatiques et référencement local pour les pros de Montpellier et de l'Hérault. Devis gratuit et personnalisé, sans engagement.", href: L.offre, label: 'Découvrir notre offre site internet', href2: L.rdv, label2: 'Prendre rendez-vous' });
}

function renderGuide(g) {
  const url = `${BASE}${g.slug}.html`;
  const toc = `<nav class="g-toc" aria-label="Sommaire"><p>Sommaire</p><ol>${g.sections.map(s => `<li><a href="#${s.id}">${s.h2}</a></li>`).join('')}<li><a href="#faq">Questions fréquentes</a></li></ol></nav>`;
  const body = g.sections.map(s => `<section id="${s.id}"><h2>${s.h2}</h2>${s.html}</section>`).join('\n');
  const faq = `<section class="g-faq" id="faq"><h2>Questions fréquentes</h2>${g.faq.map(f => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</section>`;
  const articleHtml = `<div class="g-intro">${g.intro}</div>${toc}${body}${finalCta(g)}${faq}`;
  g.words = countWords(`<h1>${g.h1}</h1>${articleHtml}`);
  g.readingMinutes = g.readingMinutes || Math.max(3, Math.round(g.words / 220));
  const related = g.related.map(bySlug);

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: g.h1.length > 110 ? g.h1.split(' : ')[0] : g.h1,
        description: g.description,
        datePublished: DATE,
        dateModified: DATE,
        inLanguage: 'fr-FR',
        wordCount: g.words,
        image: `${SITE}/rea1.jpg`,
        author: { '@type': 'Person', name: 'Titouan Bedos', url: `${SITE}/a-propos.html` },
        publisher: ORG,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      },
      crumbsLd([{ name: g.h1.split(' : ')[0], item: url }]),
      {
        '@type': 'FAQPage',
        mainEntity: g.faq.map(f => ({ '@type': 'Question', name: plain(f.q), acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })),
      },
    ],
  };

  return `${head({ title: g.title, description: g.description, url, ogType: 'article', jsonld })}

<body>
  ${SPRITE}

  ${NAV}

  <main class="g-main">
    <div class="g-wrap">
      <div class="g-crumbs"><a href="https://www.groupsolution.fr/">Groupe Solution</a> › <a href="../site-internet-montpellier.html">Site internet Montpellier</a> › <a href="index.html">Guides</a> › <span>${esc(g.h1.split(' : ')[0])}</span></div>
      <header class="g-head">
        <span class="g-kicker">Guide · Montpellier &amp; Hérault</span>
        <h1>${g.h1}</h1>
        <div class="g-meta"><span>Par <b>Titouan Bedos</b>, fondateur de GroupSolution</span><span>Publié le <time datetime="${DATE}">29 septembre 2026</time></span><span>${g.readingMinutes} min de lecture</span></div>
      </header>
      <article class="g-article">
${articleHtml}
        <div class="g-author"><span>Rédigé par <b>Titouan Bedos</b>, fondateur de GroupSolution, agence web et éditeur d'automatisations à Montpellier. Une question sur ce guide ? <a href="tel:+33782298559">07 82 29 85 59</a> · <a href="mailto:contact@groupsolution.fr">contact@groupsolution.fr</a></span></div>
      </article>
    </div>

    <section class="g-related" aria-labelledby="related-t">
      <h2 id="related-t">À lire aussi</h2>
      <div class="g-cards">
${related.map(r => `        <a class="g-card" href="${r.slug}.html"><strong>${r.h1.split(' : ')[0]}</strong><span>${r.short}</span><em>Lire le guide →</em></a>`).join('\n')}
      </div>
    </section>
  </main>

  ${TAIL}
</body>
</html>
`;
}

function renderIndex() {
  const url = `${BASE}index.html`;
  const title = 'Guides : site internet, Google et automatisation à Montpellier | GroupSolution';
  const description = "Nos guides pratiques pour les pros de Montpellier et de l'Hérault : prix d'un site, Google Maps, devis automatiques, obligations légales, relances et choix d'agence.";
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${url}#page`, url, name: title, description, inLanguage: 'fr-FR', publisher: ORG,
        mainEntity: { '@type': 'ItemList', itemListElement: GUIDES.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: `${BASE}${g.slug}.html`, name: g.h1 })) },
      },
      crumbsLd([]),
    ],
  };
  return `${head({ title, description, url, ogType: 'website', jsonld })}

<body>
  ${SPRITE}

  ${NAV}

  <main class="g-main">
    <div class="g-wrap">
      <div class="g-crumbs"><a href="https://www.groupsolution.fr/">Groupe Solution</a> › <a href="../site-internet-montpellier.html">Site internet Montpellier</a> › <span>Guides</span></div>
      <header class="g-head">
        <span class="g-kicker">Guides pratiques</span>
        <h1>Guides : site internet, Google et automatisation à Montpellier</h1>
      </header>
      <div class="g-article">
        <p class="g-intro">Des réponses concrètes aux questions que nous posent chaque semaine les artisans, commerçants, indépendants et PME de Montpellier et de l'Hérault : combien coûte un site, comment être trouvé sur Google Maps, que peut-on automatiser, quelles obligations légales respecter. Sans jargon, et sans promesses intenables.</p>
      </div>
    </div>
    <section class="g-list" aria-label="Liste des guides">
      <div class="g-cards">
${GUIDES.map(g => `        <a class="g-card" href="${g.slug}.html"><strong>${g.h1}</strong><span>${g.short}</span><em>${g.readingMinutes} min de lecture →</em></a>`).join('\n')}
      </div>
    </section>
    <div class="g-wrap">
      <div class="g-article">
        ${cta({ title: 'Vous préférez en parler directement ?', text: "Un premier échange de 15 minutes pour faire le point sur votre site, votre visibilité Google ou vos tâches répétitives. Gratuit et sans engagement.", href: L.rdv, label: 'Prendre rendez-vous', href2: L.offre, label2: 'Voir notre offre site internet' })}
      </div>
    </div>
  </main>

  ${TAIL}
</body>
</html>
`;
}

/* ── Écriture ─────────────────────────────────────────────── */
mkdirSync(OUT_DIR, { recursive: true });
const pages = GUIDES.map(g => [g, renderGuide(g)]);   // calcule words/readingMinutes avant l'index
for (const [g, html] of pages) writeFileSync(join(OUT_DIR, `${g.slug}.html`), html);
writeFileSync(join(OUT_DIR, 'index.html'), renderIndex());

for (const g of GUIDES) {
  const warn = [];
  if (g.title.length > 70) warn.push(`title ${g.title.length} car.`);
  if (g.description.length < 140 || g.description.length > 160) warn.push(`description ${g.description.length} car.`);
  if (g.words < 1300) warn.push(`${g.words} mots < 1300`);
  console.log(`✓ montpellier/guides/${g.slug}.html — ${g.words} mots, ${g.readingMinutes} min${warn.length ? '  ⚠ ' + warn.join(', ') : ''}`);
}
console.log('✓ montpellier/guides/index.html');
