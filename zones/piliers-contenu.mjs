/* ═══════════════════════════════════════════════════════════
   Contenu des pages PILIERS (dossiers de référence) — lu par
   zones/generate-piliers.mjs.

   Règles : aucun prix, aucun montant, aucun pourcentage de gain,
   aucun délai garanti (tout est « sur devis »), aucun client cité,
   aucun témoignage, aucune statistique non sourcée.
   Les FAQ sont en texte brut (pas de HTML) : le même texte alimente
   la FAQ visible et le FAQPage JSON-LD.
   ═══════════════════════════════════════════════════════════ */
import { keep, table, ul, ol, METIERS, VEILLE, GUIDES, OUTILS, IDEES } from './generate-services.mjs';

/* ── Liens internes (tous vers des pages existantes, vérifiées au build de contrôle) ── */
const svc = (slug, text) => `<a href="${slug}.html">${text}</a>`;
const pil = svc;
const idee = (slug, text) => `<a href="../idees/${slug}.html">${text || 'idées IA : ' + (IDEES[slug] || slug).toLowerCase()}</a>`;
const metier = (slug, text) => `<a href="../montpellier/site-internet-${slug}-montpellier.html">${text || METIERS[slug]}</a>`;
const veille = (slug, text) => `<a href="../lab/veille/${slug}.html">${text || VEILLE[slug]}</a>`;
const guide = (slug, text) => `<a href="../montpellier/guides/${slug}.html">${text || GUIDES[slug]}</a>`;
const outil = (slug, text) => `<a href="../outils/${slug}.html">${text || OUTILS[slug]}</a>`;
const IDEES_HUB = (text = 'laboratoire d’idées par secteur') => `<a href="../idees/">${text}</a>`;
const AUTO_HUB = (text = 'hub automatisation') => `<a href="../automatisation/">${text}</a>`;

/* ── Blocs communs, réécrits pour chaque page afin d’éviter le contenu dupliqué ── */
const projet = (intro, steps, outro) => `<p>${intro}</p>${ol(steps)}<p>${outro}</p>`;

export const PAGES = [];

/* ═══════════════════════ A. LOGICIEL SUR-MESURE POUR PME ═══════════════════════ */
PAGES.push({
  slug: 'logiciel-sur-mesure-pme',
  title: 'Logiciel sur-mesure pour PME : le guide complet | Groupe Solution',
  desc: 'Logiciel sur-mesure pour PME : quand le choisir plutôt qu’un outil du marché, comment se déroule le projet, propriété du code, RGPD. Sur devis.',
  crumb: 'Logiciel sur-mesure pour PME',
  kicker: 'PME · outil unique · propriété du code · évolutif',
  h1: 'Logiciel sur-mesure pour PME : <em>quand il devient rentable, et comment le réussir</em>.',
  lead: 'Une PME finit souvent par travailler avec cinq outils qui ne se parlent pas, trois fichiers Excel « de secours » et une personne qui recopie les données de l’un à l’autre. Ce guide explique quand un logiciel sur-mesure devient la bonne réponse, quand il ne l’est pas, et comment mener le projet sans prendre de risque inutile.',
  serviceName: 'Développement de logiciel sur-mesure pour PME',
  serviceType: 'Développement de logiciel sur-mesure',
  services: ['logiciel-sur-mesure', 'integration-api-connecteurs', 'automatisation-processus', 'agence-ia-entreprise'],
  idees: ['industrie-pme', 'transport-logistique', 'artisan', 'expert-comptable', 'services-a-domicile'],
  veille: ['facturation-electronique-2026', 'mcp-model-context-protocol', 'ai-act-pme'],
  guides: ['relances-factures-impayees-automatiques'],
  metiers: ['artisan', 'expert-comptable', 'garage-automobile'],
  sections: [
    { id: 'definition', h2: 'Logiciel sur-mesure pour PME : de quoi parle-t-on exactement ?', html: `
<p>Un <strong>logiciel sur-mesure</strong> est un programme conçu pour une entreprise précise, à partir de sa façon réelle de travailler : ses étapes, ses documents, ses règles de calcul, ses exceptions. À l’inverse, un logiciel du marché (un CRM, un ERP, un outil de planning vendu en abonnement) est pensé pour des milliers d’entreprises à la fois ; c’est à vous de vous adapter à lui.</p>
<p>Pour une PME, « sur-mesure » ne veut pas dire « tout réinventer ». Dans la grande majorité des projets, on conserve les briques standard qui fonctionnent bien — la comptabilité, la messagerie, le paiement en ligne — et l’on construit uniquement ce qui fait la spécificité de l’entreprise : le calcul d’un devis complexe, le suivi d’un chantier, la traçabilité d’un lot, la coordination entre le bureau et le terrain. Le logiciel sur-mesure devient alors le <strong>centre de gravité</strong> qui relie les autres outils.</p>
<p>C’est notre métier principal : Groupe Solution est un éditeur de logiciels et d’automatisations sur-mesure. Nous exploitons aussi nos propres plateformes en production — Solution Recrutement, Solution Alternance et Aides Particuliers — ce qui nous oblige à appliquer à nous-mêmes les exigences de fiabilité, de sécurité et de maintenance que nous recommandons à nos clients.</p>` },
    { id: 'signaux', h2: 'Les signaux qui montrent qu’une PME a besoin de son propre logiciel', html: `
<p>Aucun dirigeant ne se réveille en se disant « il me faut un logiciel sur-mesure ». En revanche, les mêmes symptômes reviennent très souvent :</p>
${ul([
  '<strong>La double saisie est devenue normale.</strong> Une commande est saisie dans le logiciel commercial, recopiée dans le planning, puis ressaisie dans la facturation. Chaque recopie coûte du temps et crée des erreurs.',
  '<strong>Le vrai outil de pilotage est un fichier Excel.</strong> Il est devenu énorme, une seule personne le comprend, et il casse quand quelqu’un insère une colonne.',
  '<strong>Vous payez des fonctions que vous n’utilisez pas</strong>, tout en contournant celles qui vous manquent avec des bricolages.',
  '<strong>Votre savoir-faire ne rentre dans aucune case.</strong> Votre méthode de calcul, votre circuit de validation ou votre relation client sont justement ce qui vous distingue de vos concurrents — et aucun logiciel standard ne les reproduit.',
  '<strong>La croissance bloque.</strong> Recruter une personne de plus ne suffit plus, parce que l’information circule mal entre les équipes, les sites ou les agences.',
  '<strong>Vos clients ou partenaires réclament un accès</strong> : suivre leur commande, déposer un document, signer un bon, consulter un historique.',
])}
${keep(['Deux ou trois de ces signaux réunis justifient au minimum une étude sérieuse.', 'Un seul signal se règle parfois avec une simple intégration entre outils existants, sans logiciel complet.'])}
<p>Dans ce second cas, notre page ${svc('integration-api-connecteurs', 'intégration d’API et connecteurs')} ou notre dossier ${pil('automatisation-entreprise', 'automatisation d’entreprise')} seront plus adaptés. Le ${outil('calculateur-automatisation')} aide aussi à mesurer le temps réellement perdu sur les tâches répétitives.</p>` },
    { id: 'comparatif', h2: 'Sur-mesure ou logiciel du marché : le comparatif honnête', html: `
<p>Le bon choix dépend moins de la technologie que de la place que l’outil occupe dans votre activité. Voici les critères que nous examinons avec chaque PME.</p>
${table('Logiciel du marché, sur-mesure ou approche hybride : critères de décision', ['Critère', 'Logiciel du marché', 'Logiciel sur-mesure'], [
  ['Démarrage', 'Immédiat : on crée un compte et on paramètre.', 'Il faut d’abord cadrer puis construire une première version.'],
  ['Adéquation au métier', 'Bonne pour les processus standard (comptabilité, paie, messagerie).', 'Totale : l’outil suit vos étapes, vos règles et vos exceptions.'],
  ['Évolutions', 'Décidées par l’éditeur, pour l’ensemble de ses clients.', 'Décidées par vous, au rythme de votre activité.'],
  ['Coût dans le temps', 'Abonnement par utilisateur qui augmente avec l’équipe.', 'Investissement initial puis maintenance ; pas de licence par utilisateur imposée par un tiers.'],
  ['Dépendance', 'Au modèle économique et à la feuille de route de l’éditeur.', 'Au prestataire, sauf si la propriété du code et la documentation sont prévues par écrit.'],
  ['Données', 'Stockées selon les conditions de l’éditeur.', 'Stockées là où vous le décidez, dans un format que vous contrôlez.'],
])}
<h3>L’approche hybride, souvent la plus raisonnable</h3>
<p>Pour la plupart des PME, la meilleure réponse est hybride : garder les logiciels du marché pour les fonctions génériques, et développer sur-mesure la partie qui porte votre valeur, reliée aux autres outils par des API. Vous gardez la robustesse des outils éprouvés, sans vous plier à leurs limites là où cela compte.</p>
<p>Et parfois, la bonne réponse est de <strong>ne rien développer</strong>. Si un outil existant couvre l’essentiel de votre besoin et que le reste relève du confort, nous vous le dirons : c’est la conséquence directe de notre devise, « nous gagnons de l’argent uniquement si vous en gagnez ».</p>` },
    { id: 'exemples', h2: 'Exemples de logiciels sur-mesure utiles en PME', html: `
<p>Les exemples ci-dessous sont des cas types, décrits pour vous aider à vous projeter. Ils se combinent souvent dans un même outil.</p>
<h3>Chiffrage et devis complexes</h3>
<p>Un moteur de devis qui applique vos règles (métrés, coefficients, options, contraintes techniques), produit un document propre et garde l’historique des versions. C’est typiquement le cas des ${metier('artisan', 'artisans du bâtiment')} et des industriels qui fabriquent à la demande ; notre guide ${guide('automatiser-devis-artisan')} détaille la démarche.</p>
<h3>Suivi de production, de chantier ou d’intervention</h3>
<p>Une application qui suit chaque dossier de la commande à la livraison : étapes, photos, bons signés, pièces utilisées, temps passé. Le bureau voit l’avancement en temps réel, le terrain n’a plus à rappeler pour transmettre une information. Voir aussi notre dossier ${pil('application-metier-sur-mesure', 'application métier sur-mesure')}.</p>
<h3>Gestion commerciale et relation client propres à votre cycle de vente</h3>
<p>Quand votre cycle de vente comporte des étapes spécifiques (visite technique, étude, validation d’un financeur), un outil sur-mesure les suit sans les déformer, relance au bon moment et prépare les documents.</p>
<h3>Portail client ou partenaire</h3>
<p>Un espace sécurisé où vos clients suivent leur dossier, déposent des pièces, valident un devis ou téléchargent leurs factures. Il réduit fortement les appels du type « où en est ma commande ? ».</p>
<h3>Tableau de bord de direction</h3>
<p>Un écran unique qui agrège les chiffres des différents outils (ventes, production, trésorerie prévisionnelle) et alerte sur les écarts. Notre dossier ${pil('logiciel-de-gestion-sur-mesure', 'logiciel de gestion sur-mesure')} approfondit ce sujet.</p>
<p>Pour des idées plus sectorielles, parcourez notre ${IDEES_HUB()}, par exemple les pages ${idee('industrie-pme', 'industrie et PME')} ou ${idee('transport-logistique', 'transport et logistique')}.</p>` },
    { id: 'projet', h2: 'Comment se déroule un projet, de l’appel de 10 minutes au suivi', html: projet(
      'Un projet de logiciel réussi ne commence pas par du code, mais par une compréhension précise de votre activité. Voici les étapes que nous suivons.',
      [
        '<strong>Un appel de 10 minutes</strong>, par téléphone ou en visio, pour comprendre votre activité, ce qui vous fait perdre du temps et ce que vous attendez. Vous repartez avec un premier avis franc, y compris si le sur-mesure ne se justifie pas.',
        '<strong>Une proposition écrite, sur devis</strong> : périmètre de la première version, étapes, intégrations avec vos outils, responsabilités de chacun, conditions de propriété et de maintenance.',
        '<strong>La construction par étapes</strong> : une première version utile, centrée sur le cœur du besoin, que vous testez sur vos cas réels. Chaque étape est validée avant la suivante, ce qui limite le risque et permet d’ajuster.',
        '<strong>La mise en service</strong> : reprise des données existantes, formation des utilisateurs, période d’accompagnement pendant laquelle on corrige vite ce que le terrain fait remonter.',
        '<strong>Le suivi</strong> : maintenance, mises à jour de sécurité, sauvegardes, puis évolutions selon vos priorités.',
      ],
      'Le calendrier dépend du périmètre et de la disponibilité de vos équipes pour les validations ; il est précisé dans la proposition plutôt que promis à l’avance. Pour préparer l’échange, le ' + outil('configurateur-site-internet') + ' vous aide à formaliser votre besoin.'
    ) },
    { id: 'devis', h2: 'Ce qui influence le devis d’un logiciel sur-mesure', html: `
<p>Nous ne publions pas de grille tarifaire, parce qu’un chiffre sans périmètre n’a aucun sens. En revanche, voici honnêtement ce qui fait varier un devis :</p>
${ul([
  'le <strong>nombre d’écrans et de parcours</strong> différents (un outil pour une équipe n’est pas un outil pour le bureau, le terrain et les clients) ;',
  'la <strong>complexité des règles métier</strong> : calculs, validations, exceptions, droits d’accès par profil ;',
  'le <strong>nombre et la qualité des intégrations</strong> : un logiciel qui propose une API documentée se connecte plus facilement qu’un outil fermé ;',
  'la <strong>reprise des données</strong> existantes, surtout si elles sont dispersées dans plusieurs fichiers ;',
  'les <strong>exigences particulières</strong> : fonctionnement hors ligne, application mobile, hébergement imposé, traçabilité réglementaire ;',
  'le <strong>niveau de suivi</strong> attendu après la mise en service.',
])}
<p>Le levier le plus efficace pour maîtriser un budget est de bien choisir le périmètre de la première version : commencer par ce qui fait gagner le plus de temps ou d’argent, puis financer la suite par les gains obtenus.</p>` },
    { id: 'propriete', h2: 'Propriété du code et des données : ce qu’il faut écrire noir sur blanc', html: `
<p>C’est le point que trop de PME découvrent le jour où elles veulent changer de prestataire. Quel que soit le fournisseur, faites préciser par écrit, avant de signer :</p>
${ul([
  'à qui appartient le <strong>code source</strong> développé pour vous, et dans quelles conditions il vous est remis ;',
  'que vos <strong>données</strong> vous appartiennent et peuvent être exportées à tout moment dans un format ouvert et documenté ;',
  'qui détient les <strong>comptes d’hébergement</strong>, les noms de domaine et les clés d’accès aux services tiers ;',
  'ce que contient la <strong>documentation</strong> (installation, architecture, procédures) pour qu’une autre équipe puisse reprendre le logiciel ;',
  'les conditions de <strong>réversibilité</strong> en fin de contrat.',
])}
<p>Chez Groupe Solution, ces points figurent dans chaque proposition. Ils se négocient au cas par cas, mais ils ne restent jamais implicites.</p>` },
    { id: 'securite', h2: 'Sécurité, RGPD et obligations à anticiper', html: `
<p>Un logiciel de gestion contient des informations sensibles : clients, salariés, prix, marges. La sécurité se conçoit dès le départ : authentification solide, droits d’accès par rôle, chiffrement des échanges, journalisation des actions sensibles, sauvegardes testées, mises à jour régulières.</p>
<p>Côté RGPD, le logiciel doit permettre de ne collecter que les données nécessaires, de fixer des durées de conservation, de répondre aux demandes d’accès ou d’effacement, et de documenter les sous-traitants (hébergeur, services d’IA, envoi d’e-mails). Si des fonctions d’intelligence artificielle sont intégrées, le règlement européen sur l’IA impose notamment une information claire des personnes dans certains cas ; notre article ${veille('ai-act-pme')} fait le point.</p>
<p>Enfin, la réforme de la facturation électronique concerne directement les logiciels de gestion : toutes les entreprises assujetties à la TVA doivent pouvoir recevoir des factures électroniques depuis le 1<sup>er</sup> septembre 2026, et l’obligation d’émission s’étend aux PME et microentreprises au 1<sup>er</sup> septembre 2027, via une plateforme agréée. Un outil sur-mesure ne remplace pas cette plateforme : il s’y connecte. Le détail est dans notre article ${veille('facturation-electronique-2026')}.</p>` },
  ],
  ctaAfter: 3,
  ctaTitle: 'Votre PME a-t-elle besoin d’un logiciel sur-mesure ?',
  ctaText: 'En 10 minutes, nous vous disons franchement si le sur-mesure se justifie, ou si un outil existant bien connecté suffit.',
  faq: [
    { q: 'Combien coûte un logiciel sur-mesure pour une PME ?', a: 'Il n’existe pas de prix standard honnête : le coût dépend du nombre d’écrans et de profils, de la complexité des règles métier, des intégrations, de la reprise des données et du suivi attendu. Chez Groupe Solution, chaque projet est sur devis, établi après un appel de 10 minutes et un cadrage écrit.' },
    { q: 'Quand un logiciel sur-mesure est-il plus pertinent qu’un logiciel du marché ?', a: 'Quand votre façon de travailler est ce qui vous distingue, quand la double saisie et les fichiers Excel se multiplient, quand les abonnements par utilisateur s’accumulent sans couvrir votre besoin, ou quand vos clients réclament un accès en ligne. Pour les fonctions génériques comme la comptabilité ou la paie, un logiciel du marché reste généralement le meilleur choix.' },
    { q: 'Combien de temps faut-il pour développer un logiciel sur-mesure ?', a: 'Cela dépend du périmètre et de la disponibilité de vos équipes pour les validations. Nous construisons par étapes, en commençant par une première version utile ; le calendrier est précisé dans la proposition plutôt que promis à l’avance.' },
    { q: 'Serai-je propriétaire du code et de mes données ?', a: 'La propriété du code source, l’export des données, la détention des comptes d’hébergement et la documentation doivent être fixés par écrit avant de signer. Chez Groupe Solution, ces points figurent dans chaque proposition.' },
    { q: 'Peut-on garder nos logiciels actuels ?', a: 'Oui, et c’est souvent recommandé. Le logiciel sur-mesure se connecte à vos outils existants, comme la comptabilité, l’agenda ou le paiement, par des API, et ne remplace que ce qui ne convient pas.' },
    { q: 'Que se passe-t-il après la mise en service ?', a: 'Le logiciel a besoin d’un suivi : mises à jour de sécurité, sauvegardes, corrections et évolutions. Le niveau de suivi est défini dans la proposition et peut évoluer avec vos besoins.' },
    { q: 'Travaillez-vous avec les PME de toute la France ?', a: 'Oui. Notre agence est à Saint-Jean-de-Védas, dans la métropole de Montpellier, notre fondateur est à Mayotte, et nous accompagnons les entreprises de toute la France et des outre-mer. Le premier échange de 10 minutes se fait par téléphone ou en visio.' },
  ],
  form: { h2: 'Décrivez le logiciel dont votre PME a besoin', p: 'Deux phrases suffisent. Nous vous rappelons avec un premier avis franc, sans engagement.', ph: 'Ex : nous saisissons chaque commande trois fois entre le devis, le planning et la facturation…', btn: 'Être rappelé →', label: 'Votre besoin' },
});

/* ═══════════════════════ B. APPLICATION MÉTIER SUR-MESURE ═══════════════════════ */
PAGES.push({
  slug: 'application-metier-sur-mesure',
  title: 'Application métier sur-mesure : web et mobile | Groupe Solution',
  desc: 'Application métier sur-mesure, web ou mobile : terrain, bureau, portail client. Conception, hors ligne, intégrations, propriété du code. Sur devis.',
  crumb: 'Application métier sur-mesure',
  kicker: 'Terrain · bureau · portail client · web et mobile',
  h1: 'Application métier sur-mesure : <em>l’outil taillé pour les gestes de vos équipes</em>.',
  lead: 'Une application métier réussie se reconnaît à un détail : les équipes l’ouvrent sans qu’on le leur demande. Voici comment concevoir une application web ou mobile sur-mesure qui colle au travail réel, du chantier au bureau, et comment éviter les pièges classiques.',
  serviceName: 'Développement d’application métier sur-mesure',
  serviceType: 'Développement d’application métier web et mobile',
  services: ['logiciel-sur-mesure', 'integration-api-connecteurs', 'agent-ia-chatbot', 'creation-site-internet'],
  idees: ['services-a-domicile', 'artisan', 'garage-automobile', 'organisme-de-formation', 'transport-logistique'],
  veille: ['ia-vision-documents', 'rag-assistant-documents', 'agents-ia-computer-use'],
  metiers: ['services-a-domicile', 'artisan', 'organisme-de-formation'],
  sections: [
    { id: 'definition', h2: 'Qu’est-ce qu’une application métier sur-mesure ?', html: `
<p>Une <strong>application métier</strong> est un outil numérique dédié à une tâche précise de votre activité : réaliser une intervention, suivre un chantier, gérer un stock, préparer une tournée, accueillir un client, instruire un dossier. Elle se distingue d’un site internet, qui s’adresse au public, et d’un logiciel de gestion global, qui couvre toute l’entreprise.</p>
<p>Elle est dite <strong>sur-mesure</strong> lorsqu’elle est conçue à partir de vos propres gestes : les informations que le technicien doit saisir, dans quel ordre, avec quelles vérifications, sur quel appareil et dans quelles conditions (en gants, en plein soleil, sans réseau). C’est cette précision qui fait la différence entre un outil adopté et un outil contourné.</p>
${keep(['Une application métier sert une tâche précise, pour des utilisateurs précis.', 'Elle réussit quand elle fait gagner du temps dès la première semaine à ceux qui l’utilisent.'])}` },
    { id: 'types', h2: 'Les quatre grandes familles d’applications métier', html: `
<h3>1. L’application de terrain</h3>
<p>Pour les techniciens, livreurs, intervenants à domicile ou chefs de chantier : consultation du planning, fiche d’intervention, photos, signature du client, relevé de pièces et de temps. Les informations remontent au bureau sans ressaisie. C’est l’un des usages les plus fréquents chez les ${metier('services-a-domicile', 'entreprises de services à domicile')} et les ${metier('artisan', 'artisans')}.</p>
<h3>2. L’outil de back-office</h3>
<p>Pour le bureau : traitement des demandes, planification, validation, préparation des documents, suivi des dossiers. Il remplace souvent un ensemble de tableurs et de boîtes mail partagées.</p>
<h3>3. Le portail client ou partenaire</h3>
<p>Un espace sécurisé où vos clients, fournisseurs ou prescripteurs déposent des documents, suivent l’avancement, valident un devis ou prennent rendez-vous. Il est souvent relié à votre ${svc('creation-site-internet', 'site internet')}.</p>
<h3>4. L’outil interne augmenté par l’IA</h3>
<p>Une application qui intègre des fonctions d’intelligence artificielle : lire un bon de livraison photographié, répondre aux questions des équipes à partir de vos procédures, préparer un compte rendu. Nos articles ${veille('ia-vision-documents')} et ${veille('rag-assistant-documents')} décrivent ces briques.</p>` },
    { id: 'format', h2: 'Application web, mobile native ou PWA : quel format choisir ?', html: `
<p>Le format se choisit selon l’usage, pas selon la mode. Voici les trois options principales.</p>
${table('Formats d’application métier : avantages et limites', ['Format', 'Points forts', 'Limites'], [
  ['Application web', 'Fonctionne dans le navigateur, sur ordinateur, tablette et téléphone ; aucune installation ; mise à jour instantanée pour tous.', 'Accès limité à certaines fonctions du téléphone ; demande en principe une connexion.'],
  ['Application web installable (PWA)', 'S’installe sur l’écran d’accueil, peut fonctionner en partie hors ligne, une seule base de code pour tous les appareils.', 'Certaines fonctions avancées restent réservées aux applications natives selon les systèmes.'],
  ['Application mobile native', 'Accès complet aux capteurs (appareil photo, GPS, Bluetooth), meilleure intégration au téléphone.', 'Publication sur les magasins d’applications, deux plateformes à maintenir, mises à jour moins immédiates.'],
])}
<p>Pour la plupart des outils internes, une <strong>application web responsive</strong>, éventuellement installable, est le meilleur compromis. Le natif se justifie quand l’usage intensif du matériel du téléphone ou le fonctionnement hors ligne complet sont au cœur du besoin.</p>` },
    { id: 'terrain', h2: 'Concevoir pour le terrain : hors ligne, simplicité, rapidité', html: `
<p>Une application de terrain est jugée en quelques secondes, souvent dans de mauvaises conditions. Les principes que nous appliquons :</p>
${ul([
  '<strong>Observer avant de dessiner</strong> : passer du temps avec les utilisateurs, comprendre ce qu’ils font réellement, pas ce que dit la procédure.',
  '<strong>Le moins de saisie possible</strong> : listes préremplies, photos plutôt que texte, dictée vocale, valeurs par défaut intelligentes.',
  '<strong>Le mode hors ligne</strong> quand le réseau est incertain (sous-sols, zones rurales, bâtiments en construction) : les données sont stockées sur l’appareil puis synchronisées au retour du réseau.',
  '<strong>De grands boutons, un contraste fort</strong>, une lecture possible en plein soleil et d’une seule main.',
  '<strong>Des retours immédiats</strong> : l’utilisateur doit savoir que son action a été enregistrée.',
])}
<p>Ces choix paraissent modestes ; ce sont pourtant eux qui déterminent si l’application sera adoptée. Pour trouver des idées par activité, consultez notre ${IDEES_HUB()}, par exemple ${idee('services-a-domicile', 'les idées pour les services à domicile')} ou ${idee('garage-automobile', 'pour les garages')}.</p>` },
    { id: 'integrations', h2: 'Une application reliée à vos autres outils', html: `
<p>Une application métier isolée recrée le problème qu’elle devait résoudre. Elle doit échanger avec votre environnement : agenda, CRM, logiciel de comptabilité ou de facturation, outil de paie, messagerie, stockage de documents, parfois des services publics ou des données ouvertes. Les échanges passent par des <strong>API</strong> quand elles existent, et par d’autres techniques (imports automatisés, lecture de documents, automatisation de portails) quand elles n’existent pas.</p>
<p>Notre page ${svc('integration-api-connecteurs', 'intégration d’API et connecteurs')} détaille ces méthodes, et notre article ${veille('agents-ia-computer-use')} explique comment traiter les portails qui n’offrent aucune API.</p>` },
    { id: 'projet', h2: 'Le déroulé d’un projet d’application métier', html: projet(
      'Nous construisons les applications métier par petites étapes, avec les futurs utilisateurs dans la boucle.',
      [
        '<strong>Appel de 10 minutes</strong> : qui utilisera l’application, pour quelle tâche, dans quelles conditions, avec quels outils existants.',
        '<strong>Proposition sur devis</strong> : parcours retenus pour la première version, format (web, installable ou natif), intégrations, propriété et suivi, le tout écrit.',
        '<strong>Maquettes cliquables</strong> testées par quelques utilisateurs réels, puis <strong>construction par étapes</strong> avec une version de test à chaque jalon.',
        '<strong>Mise en service</strong> progressive : un groupe pilote d’abord, puis toute l’équipe ; reprise des données et prise en main accompagnée.',
        '<strong>Suivi</strong> : corrections, mises à jour de sécurité, compatibilité avec les nouvelles versions des navigateurs et des téléphones, évolutions.',
      ],
      'Commencer par un groupe pilote permet de corriger les irritants avant qu’ils ne découragent toute l’équipe. Le calendrier est fixé dans la proposition, selon le périmètre retenu.'
    ) },
    { id: 'devis', h2: 'Ce qui fait varier le devis d’une application métier', html: `
${ul([
  'le <strong>nombre de profils</strong> (technicien, responsable, client, administrateur) et de parcours ;',
  'le <strong>format</strong> : une application web coûte en général moins à maintenir que deux applications natives ;',
  'le <strong>fonctionnement hors ligne</strong> et la synchronisation, qui demandent une conception soignée ;',
  'les <strong>intégrations</strong> avec vos logiciels et leur ouverture technique ;',
  'les <strong>fonctions d’IA</strong> (lecture de documents, assistant, transcription), qui ajoutent des coûts d’usage à anticiper ;',
  'la <strong>reprise des données</strong> et la formation des utilisateurs.',
])}
<p>Nous préférons un périmètre de départ resserré et utile, plutôt qu’une application complète livrée tard et peu utilisée.</p>` },
    { id: 'erreurs', h2: 'Les cinq erreurs qui font échouer une application métier', html: `
${ol([
  '<strong>Concevoir sans les utilisateurs.</strong> Une application imaginée uniquement par la direction reproduit la procédure officielle, pas le travail réel. Les contournements apparaissent dès la première semaine.',
  '<strong>Vouloir tout couvrir dès la première version.</strong> Plus le périmètre initial est large, plus la mise en service recule et plus les utilisateurs attendent. Une première version resserrée, utilisée tous les jours, vaut mieux qu’un outil complet livré tard.',
  '<strong>Oublier les conditions d’usage.</strong> Réseau absent, écran au soleil, mains occupées, téléphone partagé : ces contraintes se traitent à la conception, pas après les premières plaintes.',
  '<strong>Laisser l’application isolée.</strong> Si le bureau doit encore recopier ce que le terrain a saisi, le gain disparaît. Les échanges avec les autres logiciels font partie du cœur du projet.',
  '<strong>Négliger le suivi.</strong> Les systèmes des téléphones et des navigateurs évoluent, les besoins aussi. Une application sans maintenance se dégrade silencieusement jusqu’au jour où elle ne fonctionne plus.',
])}
<p>Chacune de ces erreurs se prévient par la méthode décrite plus haut : observation, périmètre resserré, groupe pilote, intégrations dès le départ et suivi écrit dans la proposition.</p>` },
    { id: 'propriete', h2: 'Propriété, sécurité et RGPD', html: `
<p>Faites préciser par écrit à qui appartient le code source, qui détient les comptes de publication (magasins d’applications, hébergement, nom de domaine), comment exporter vos données et ce que contient la documentation. Ces éléments conditionnent votre liberté future.</p>
<p>Côté sécurité : authentification adaptée (y compris sur un téléphone partagé), droits par profil, chiffrement des échanges, possibilité de révoquer l’accès d’un appareil perdu, journalisation des opérations sensibles. Côté RGPD : informer les salariés et les clients, limiter la géolocalisation à ce qui est nécessaire et proportionné, fixer des durées de conservation, encadrer les sous-traitants. Si l’application intègre de l’IA, l’information des utilisateurs et le contrôle humain sont prévus dès la conception ; voir ${veille('ai-act-pme')}.</p>` },
  ],
  ctaAfter: 3,
  ctaTitle: 'Une application pour vos équipes ?',
  ctaText: 'Décrivez la tâche à outiller : nous vous disons en 10 minutes quel format et quel périmètre de départ ont du sens.',
  faq: [
    { q: 'Quelle différence entre une application métier et un logiciel de gestion ?', a: 'Une application métier outille une tâche précise pour des utilisateurs précis, par exemple les interventions sur le terrain. Un logiciel de gestion couvre plus largement l’entreprise : ventes, stocks, facturation, pilotage. Les deux peuvent se combiner et échanger leurs données.' },
    { q: 'Faut-il une application mobile native ou une application web ?', a: 'Pour la plupart des outils internes, une application web responsive, éventuellement installable sur l’écran d’accueil, suffit et se maintient plus simplement. L’application native se justifie quand l’usage intensif du téléphone, par exemple les capteurs ou le fonctionnement hors ligne complet, est au cœur du besoin.' },
    { q: 'Une application métier peut-elle fonctionner sans réseau ?', a: 'Oui. Les données peuvent être enregistrées sur l’appareil puis synchronisées automatiquement quand la connexion revient. Cette fonction demande une conception soignée et se décide dès le cadrage.' },
    { q: 'Combien coûte une application métier sur-mesure ?', a: 'Le coût dépend du nombre de profils et de parcours, du format choisi, du fonctionnement hors ligne, des intégrations et des éventuelles fonctions d’IA. Chaque projet est sur devis, après un appel de 10 minutes.' },
    { q: 'Comment faire adopter l’application par les équipes ?', a: 'En l’imaginant avec elles : observation du travail réel, maquettes testées par de futurs utilisateurs, démarrage avec un groupe pilote, formation courte et corrections rapides des premiers irritants.' },
    { q: 'Qui est propriétaire de l’application ?', a: 'La propriété du code, la détention des comptes de publication et d’hébergement, l’export des données et la documentation doivent être écrits dans la proposition. Chez Groupe Solution, ces points sont toujours précisés avant de commencer.' },
    { q: 'L’application peut-elle se connecter à nos logiciels actuels ?', a: 'Oui, c’est même indispensable pour éviter la double saisie. Nous utilisons les API de vos logiciels lorsqu’elles existent, et d’autres méthodes d’échange automatisé lorsqu’elles n’existent pas.' },
  ],
  form: { h2: 'Décrivez l’application dont vos équipes ont besoin', p: 'Qui l’utilise, pour quoi faire, sur quel appareil : deux phrases suffisent. Nous vous rappelons.', ph: 'Ex : nos techniciens remplissent des fiches papier que le bureau ressaisit le soir…', btn: 'Être rappelé →', label: 'Votre besoin' },
});

/* ═══════════════════════ C. LOGICIEL DE GESTION SUR-MESURE ═══════════════════════ */
PAGES.push({
  slug: 'logiciel-de-gestion-sur-mesure',
  title: 'Logiciel de gestion sur-mesure pour entreprise | Groupe Solution',
  desc: 'Logiciel de gestion sur-mesure : devis, stocks, planning, facturation, pilotage. ERP ou sur-mesure, facture électronique, données, RGPD. Sur devis.',
  crumb: 'Logiciel de gestion sur-mesure',
  kicker: 'Devis · stocks · planning · facturation · pilotage',
  h1: 'Logiciel de gestion sur-mesure : <em>toute votre activité dans un outil qui vous ressemble</em>.',
  lead: 'Devis dans un outil, planning dans un autre, stocks sur un tableur, factures ailleurs : la gestion d’entreprise se disperse vite. Ce dossier explique ce que peut couvrir un logiciel de gestion sur-mesure, comment le comparer à un ERP du marché, et comment préparer la migration de vos données sans interrompre l’activité.',
  serviceName: 'Développement de logiciel de gestion sur-mesure',
  serviceType: 'Logiciel de gestion d’entreprise sur-mesure',
  services: ['logiciel-sur-mesure', 'automatisation-processus', 'integration-api-connecteurs', 'agence-ia-entreprise'],
  idees: ['commerce-boutique', 'industrie-pme', 'domaine-viticole', 'expert-comptable', 'transport-logistique'],
  veille: ['facturation-electronique-2026', 'open-data-api-gouv', 'ia-vision-documents'],
  guides: ['relances-factures-impayees-automatiques'],
  metiers: ['commerce-boutique', 'domaine-viticole', 'garage-automobile'],
  sections: [
    { id: 'perimetre', h2: 'Ce que couvre un logiciel de gestion sur-mesure', html: `
<p>Un <strong>logiciel de gestion</strong> centralise les informations qui font tourner l’entreprise. Sur-mesure, il ne contient que les modules utiles, organisés selon votre logique. Les briques les plus courantes :</p>
${ul([
  '<strong>Clients et contacts</strong> : fiches, historique des échanges, documents, relances.',
  '<strong>Devis et commandes</strong> : chiffrage selon vos règles, transformation en commande, suivi des acomptes.',
  '<strong>Stocks et achats</strong> : entrées, sorties, inventaires, seuils d’alerte, commandes fournisseurs, traçabilité des lots.',
  '<strong>Planning et ressources</strong> : affectation des équipes, des machines ou des véhicules, gestion des indisponibilités.',
  '<strong>Facturation et encaissements</strong> : factures, avoirs, relances, rapprochement des paiements, export vers la comptabilité.',
  '<strong>Pilotage</strong> : tableaux de bord, marges par affaire, alertes, prévisions.',
])}
<p>La comptabilité générale et la paie, très normées, restent en général dans des logiciels spécialisés, avec lesquels le logiciel de gestion échange automatiquement.</p>` },
    { id: 'erp', h2: 'ERP du marché, logiciel sur-mesure ou approche hybride ?', html: `
${table('Gestion d’entreprise : trois approches comparées', ['Approche', 'Quand elle convient', 'Points de vigilance'], [
  ['ERP ou logiciel de gestion du marché', 'Vos processus sont proches des standards de votre secteur et l’outil couvre l’essentiel de votre besoin sans adaptation lourde.', 'Paramétrage parfois long, licences par utilisateur, personnalisations coûteuses et fragiles lors des mises à jour.'],
  ['Logiciel de gestion sur-mesure', 'Votre organisation est spécifique (métier de niche, multi-activités, circuit de validation propre) ou votre avantage concurrentiel repose sur vos processus.', 'Demande un cadrage rigoureux, une propriété du code écrite et un suivi dans la durée.'],
  ['Hybride', 'Vous gardez des outils standard pour la comptabilité, la paie ou la boutique en ligne, et construisez le cœur de gestion qui vous manque.', 'La qualité des connexions entre outils devient déterminante.'],
])}
<p>Un bon indicateur : si vous passez plus de temps à contourner votre logiciel qu’à l’utiliser, ou si un « fichier maître » tenu à côté fait foi, le standard a probablement atteint ses limites. Notre dossier ${pil('logiciel-sur-mesure-pme', 'logiciel sur-mesure pour PME')} détaille les signaux d’alerte.</p>` },
    { id: 'exemples', h2: 'Exemples de logiciels de gestion sur-mesure par activité', html: `
<p>Des cas types, pour illustrer ce qu’un outil adapté change au quotidien :</p>
${ul([
  '<strong>Commerce et négoce</strong> : stock partagé entre boutique physique et vente en ligne, réassort suggéré, étiquettes, fidélité. Voir ' + idee('commerce-boutique', 'les idées pour le commerce') + '.',
  '<strong>Industrie et atelier</strong> : ordres de fabrication, nomenclatures, suivi des temps, traçabilité des lots, maintenance préventive. Voir ' + idee('industrie-pme', 'les idées pour l’industrie') + '.',
  '<strong>Domaine viticole</strong> : parcelles, travaux, cuverie, stocks de bouteilles, ventes au caveau et export. Voir ' + idee('domaine-viticole', 'les idées pour les domaines') + '.',
  '<strong>Transport et logistique</strong> : ordres de transport, tournées, preuves de livraison, facturation selon les grilles de chaque client. Voir ' + idee('transport-logistique', 'les idées pour la logistique') + '.',
  '<strong>Entreprises de services</strong> : contrats, interventions récurrentes, planning, facturation périodique automatique.',
])}
<p>D’autres pistes par secteur dans notre ${IDEES_HUB()}.</p>` },
    { id: 'migration', h2: 'Quitter Excel et migrer vos données sans casse', html: `
<p>La migration fait peur, à juste titre : c’est là que se perdent les historiques et que naissent les doublons. Une méthode sérieuse comporte :</p>
${ol([
  '<strong>L’inventaire</strong> des sources : tableurs, anciens logiciels, dossiers partagés, carnets.',
  '<strong>Le nettoyage</strong> : doublons, formats incohérents, champs vides, clients inactifs.',
  '<strong>La correspondance</strong> entre anciennes et nouvelles structures, validée avec vous.',
  '<strong>Une migration à blanc</strong>, vérifiée sur des cas réels avant la bascule.',
  '<strong>La bascule</strong> à un moment choisi, avec une courte période de fonctionnement en parallèle si nécessaire.',
])}
${keep(['Vos données historiques ont de la valeur : elles doivent être reprises, nettoyées et vérifiées.', 'Une migration se teste avant la bascule, jamais le jour même.'])}` },
    { id: 'facture', h2: 'Facturation électronique : ce que votre logiciel de gestion doit prévoir', html: `
<p>La réforme française de la facturation électronique entre en vigueur par étapes. Depuis le <strong>1<sup>er</sup> septembre 2026</strong>, toutes les entreprises assujetties à la TVA établies en France doivent être en mesure de <strong>recevoir</strong> des factures électroniques ; les grandes entreprises et les ETI doivent aussi les émettre. L’obligation d’<strong>émission</strong> s’étend aux PME et aux microentreprises au <strong>1<sup>er</sup> septembre 2027</strong>. Les échanges passent par des plateformes agréées, et s’accompagnent d’une transmission de certaines données à l’administration (e-reporting).</p>
<p>Concrètement, un logiciel de gestion sur-mesure doit produire des factures dans un format structuré accepté (comme Factur-X, UBL ou CII), se connecter à la plateforme agréée que vous avez choisie, récupérer les factures reçues et leurs statuts, et conserver les mentions obligatoires. Il ne remplace pas la plateforme agréée : il s’y branche. C’est aussi une excellente occasion d’automatiser la saisie des factures fournisseurs et les relances. Détails et calendrier dans notre article ${veille('facturation-electronique-2026')} ; pour les relances, voir notre guide ${guide('relances-factures-impayees-automatiques')}.</p>` },
    { id: 'pas-sur-mesure', h2: 'Quand ne pas choisir un logiciel de gestion sur-mesure', html: `
<p>Le sur-mesure n’est pas une fin en soi. Il vaut mieux s’en abstenir, ou le repousser, dans plusieurs situations :</p>
${ul([
  '<strong>Votre besoin est standard</strong> et un logiciel reconnu de votre secteur le couvre presque entièrement : mieux vaut le paramétrer correctement et le connecter à vos autres outils.',
  '<strong>Vos processus ne sont pas encore stabilisés</strong> : une entreprise en pleine réorganisation doit d’abord clarifier sa façon de travailler, sous peine de figer dans le code une organisation provisoire.',
  '<strong>Personne ne peut consacrer de temps au projet</strong> : un logiciel de gestion se construit avec quelqu’un qui connaît le terrain, répond aux questions et valide les étapes.',
  '<strong>Le problème est ponctuel</strong> : un export automatique, une relance ou un tableau de bord suffisent parfois, sans refondre toute la gestion.',
])}
<p>Dans ces cas, nous vous le disons dès le premier échange. Notre dossier ${pil('automatisation-entreprise', 'automatisation d’entreprise')} présente les solutions plus légères, souvent suffisantes pour retrouver du temps sans lancer un chantier complet.</p>` },
    { id: 'projet', h2: 'Un projet mené par étapes, sans interrompre l’activité', html: projet(
      'Un logiciel de gestion touche au cœur de l’entreprise : on ne le déploie pas d’un bloc.',
      [
        '<strong>Appel de 10 minutes</strong> pour situer vos outils actuels, vos irritants et vos priorités.',
        '<strong>Proposition sur devis</strong> découpée en modules, avec l’ordre de mise en place, les intégrations, la reprise des données, la propriété et le suivi.',
        '<strong>Construction module par module</strong>, en commençant par celui qui soulage le plus vite (souvent devis et facturation, ou planning).',
        '<strong>Mise en service</strong> de chaque module après une migration à blanc et une prise en main accompagnée.',
        '<strong>Suivi</strong> : maintenance, sécurité, évolutions réglementaires, nouveaux modules selon vos priorités.',
      ],
      'Ce découpage permet de profiter des premiers gains rapidement et d’ajuster la suite à la lumière de l’usage réel.'
    ) },
    { id: 'devis', h2: 'Ce qui influence le devis d’un logiciel de gestion', html: `
<p>Sans grille tarifaire, voici les facteurs déterminants : le nombre de modules et leur profondeur ; la complexité des règles (tarifs par client, remises, conditions de paiement, multi-sociétés, multi-sites) ; le volume et l’état des données à reprendre ; le nombre d’intégrations (comptabilité, banque, plateforme de facturation, boutique en ligne, paie) ; les exigences de traçabilité ; le niveau de suivi souhaité. Chaque projet est sur devis, après un premier échange.</p>` },
    { id: 'donnees', h2: 'Propriété des données, sécurité et RGPD', html: `
<p>Un logiciel de gestion concentre vos données les plus précieuses. Avant de signer, faites écrire : la propriété du code et des données, l’export complet dans un format ouvert, la détention des comptes d’hébergement, le contenu de la documentation, les conditions de réversibilité.</p>
<p>La sécurité repose sur des droits d’accès par rôle (tout le monde n’a pas à voir les marges ou les salaires), l’authentification forte pour les comptes sensibles, la journalisation des modifications, des sauvegardes testées et des mises à jour régulières. Le RGPD impose de limiter les données collectées, de fixer des durées de conservation, de gérer les demandes des personnes et d’encadrer les sous-traitants. Les obligations comptables de conservation des pièces sont à articuler avec ces durées ; votre expert-comptable est le bon interlocuteur pour ce point.</p>` },
  ],
  ctaAfter: 2,
  ctaTitle: 'Votre gestion tient sur trop d’outils ?',
  ctaText: 'Montrez-nous vos outils actuels en 10 minutes : nous vous disons ce qui peut être unifié, et par où commencer.',
  faq: [
    { q: 'Qu’est-ce qu’un logiciel de gestion sur-mesure ?', a: 'C’est un outil conçu pour votre entreprise qui centralise les informations utiles à son fonctionnement, comme les clients, les devis, les stocks, le planning, la facturation et le pilotage, selon vos propres règles et avec uniquement les modules dont vous avez besoin.' },
    { q: 'Faut-il choisir un ERP ou un logiciel de gestion sur-mesure ?', a: 'Un ERP du marché convient lorsque vos processus sont proches des standards de votre secteur. Le sur-mesure se justifie lorsque votre organisation est spécifique ou que votre avantage concurrentiel repose sur vos processus. Une approche hybride, qui garde la comptabilité et la paie dans des logiciels spécialisés, est souvent la plus raisonnable.' },
    { q: 'Mon logiciel de gestion doit-il gérer la facture électronique ?', a: 'Oui, il doit pouvoir se connecter à une plateforme agréée. Depuis le 1er septembre 2026, toutes les entreprises assujetties à la TVA établies en France doivent pouvoir recevoir des factures électroniques, et l’obligation d’émission s’étend aux PME et microentreprises au 1er septembre 2027. Le logiciel ne remplace pas la plateforme agréée : il s’y connecte.' },
    { q: 'Comment reprendre les données de nos fichiers Excel ?', a: 'Par une migration méthodique : inventaire des sources, nettoyage des doublons et des formats, correspondance validée avec vous, migration à blanc vérifiée sur des cas réels, puis bascule à un moment choisi.' },
    { q: 'Combien coûte un logiciel de gestion sur-mesure ?', a: 'Le coût dépend du nombre de modules, de la complexité des règles, du volume de données à reprendre, des intégrations et du suivi souhaité. Chaque projet est sur devis, établi après un appel de 10 minutes.' },
    { q: 'Peut-on le déployer progressivement ?', a: 'Oui, c’est même recommandé. Nous construisons et mettons en service le logiciel module par module, en commençant par celui qui soulage le plus vite, sans interrompre l’activité.' },
    { q: 'Qui garde la propriété des données ?', a: 'Vos données doivent rester les vôtres et pouvoir être exportées à tout moment dans un format ouvert. Ce point, comme la propriété du code et la détention des comptes d’hébergement, est fixé par écrit dans la proposition.' },
  ],
  form: { h2: 'Décrivez votre gestion actuelle', p: 'Quels outils, quels irritants : deux phrases suffisent. Nous vous rappelons avec une première piste.', ph: 'Ex : devis sur Word, planning sur tableau blanc, stocks sur Excel, factures dans un autre logiciel…', btn: 'Être rappelé →', label: 'Votre situation' },
});

/* ═══════════════════════ D. AUTOMATISATION D'ENTREPRISE ═══════════════════════ */
PAGES.push({
  slug: 'automatisation-entreprise',
  title: 'Automatisation d’entreprise : processus et IA | Groupe Solution',
  desc: 'Automatisation d’entreprise : quels processus automatiser, avec quels outils (no-code, code, IA), comment mesurer les gains et garder le contrôle. Sur devis.',
  crumb: 'Automatisation d’entreprise',
  kicker: 'Processus · outils · intelligence artificielle',
  h1: 'Automatisation d’entreprise : <em>processus, outils et IA, la méthode complète</em>.',
  lead: 'Automatiser une entreprise ne consiste pas à tout confier à des robots, mais à retirer aux équipes les tâches répétitives qui n’apportent rien, tout en gardant la main sur les décisions. Voici une méthode complète : quoi automatiser, avec quels outils, dans quel ordre, et avec quels garde-fous.',
  serviceName: 'Automatisation d’entreprise : processus, outils et intelligence artificielle',
  serviceType: 'Automatisation des processus d’entreprise',
  services: ['automatisation-processus', 'integration-api-connecteurs', 'agent-ia-chatbot', 'agent-vocal-ia'],
  idees: ['expert-comptable', 'agence-immobiliere', 'transport-logistique', 'organisme-de-formation', 'association-collectivite'],
  veille: ['mcp-model-context-protocol', 'agents-ia-computer-use', 'facturation-electronique-2026', 'ai-act-pme'],
  guides: ['automatiser-devis-artisan', 'relances-factures-impayees-automatiques'],
  metiers: ['expert-comptable', 'agence-immobiliere', 'avocat'],
  sections: [
    { id: 'definition', h2: 'Qu’est-ce que l’automatisation d’entreprise ?', html: `
<p>L’<strong>automatisation d’entreprise</strong> regroupe tout ce qui permet à une tâche de s’exécuter sans intervention humaine, ou avec une simple validation. On peut la représenter en trois niveaux, qui se combinent :</p>
${ol([
  '<strong>Les règles</strong> : « quand une commande est payée, créer la facture et prévenir l’entrepôt ». Simples, fiables, prévisibles.',
  '<strong>Les intégrations</strong> : faire circuler automatiquement les données entre vos outils (site, CRM, agenda, comptabilité, messagerie) pour supprimer la double saisie.',
  '<strong>L’intelligence artificielle</strong> : traiter ce qui n’est pas structuré — lire un e-mail ou une facture, classer une demande, rédiger une réponse, résumer un appel — là où une règle fixe ne suffit pas.',
])}
<p>Un bon projet utilise le niveau le plus simple qui résout le problème. L’IA est puissante, mais une règle claire reste préférable quand elle suffit : elle coûte moins cher à faire tourner et ne se trompe pas.</p>` },
    { id: 'quoi', h2: 'Ce que l’on automatise, service par service', html: `
${table('Exemples d’automatisations par fonction de l’entreprise', ['Fonction', 'Exemples d’automatisations', 'Niveau le plus fréquent'], [
  ['Ventes', 'Qualification des demandes entrantes, création de fiches dans le CRM, relances de devis, prise de rendez-vous.', 'Intégrations et IA'],
  ['Administration et finance', 'Saisie des factures fournisseurs, rapprochement bancaire, relances d’impayés, export comptable.', 'Règles, IA de lecture'],
  ['Ressources humaines', 'Tri des candidatures, parcours d’arrivée, collecte des justificatifs, planning des absences.', 'Règles et intégrations'],
  ['Opérations', 'Planification des interventions, commandes fournisseurs au seuil, suivi de livraison, bons signés.', 'Intégrations'],
  ['Service client', 'Réponses aux questions fréquentes, suivi de commande, accueil téléphonique, tri des e-mails.', 'IA avec garde-fous'],
  ['Direction', 'Tableaux de bord consolidés, alertes sur écarts, rapport hebdomadaire préparé automatiquement.', 'Intégrations'],
])}
<p>Pour des exemples par métier, voir notre dossier ${pil('agent-ia-entreprise-exemples', 'agents IA : exemples concrets par métier')} et notre ${IDEES_HUB()}.</p>` },
    { id: 'outils', h2: 'Les outils : no-code, code sur-mesure, RPA et agents IA', html: `
<h3>Les plateformes no-code et low-code</h3>
<p>Des outils de type Zapier, Make ou n8n relient des applications par des scénarios visuels. Ils sont parfaits pour démarrer vite sur des flux simples. Leurs limites apparaissent avec le volume, la complexité des règles, le coût par opération et la difficulté à tester et à documenter des dizaines de scénarios.</p>
<h3>Le code sur-mesure</h3>
<p>Un programme écrit pour votre besoin, hébergé sur votre infrastructure ou celle de votre choix. Il demande plus de conception au départ, mais offre robustesse, traçabilité, tests automatisés et coûts d’exécution maîtrisés. C’est notre spécialité d’${svc('logiciel-sur-mesure', 'éditeur de logiciels sur-mesure')}.</p>
<h3>La RPA et l’automatisation de navigation</h3>
<p>Quand un logiciel ou un portail n’offre aucune API, un robot peut reproduire les clics d’un utilisateur. C’est une solution de dernier recours, plus fragile, mais parfois indispensable ; les agents capables de piloter une interface la rendent plus souple (voir ${veille('agents-ia-computer-use')}).</p>
<h3>Les agents IA</h3>
<p>Un agent IA combine un modèle de langage et des outils qu’il a le droit d’utiliser : lire un dossier, consulter un agenda, créer un brouillon, mettre à jour une fiche. Des standards comme le protocole MCP facilitent ces branchements (voir ${veille('mcp-model-context-protocol')}). Ils excellent sur les tâches variées, à condition d’être encadrés.</p>
${keep(['Le no-code pour tester et pour les flux simples.', 'Le code sur-mesure pour ce qui est critique, volumineux ou complexe.', 'L’IA uniquement là où il faut comprendre du texte, de la voix ou des images.'])}` },
    { id: 'prioriser', h2: 'Comment choisir quoi automatiser en premier', html: `
<p>La tentation est de commencer par ce qui est techniquement amusant. La bonne méthode consiste à noter chaque tâche candidate sur quatre critères :</p>
${ul([
  '<strong>La fréquence</strong> : combien de fois par jour, par semaine ou par mois ?',
  '<strong>Le temps unitaire</strong> : combien de minutes à chaque fois, en comptant les interruptions ?',
  '<strong>Le coût d’une erreur</strong> : une faute de saisie sur une facture ou une commande coûte parfois bien plus que le temps passé.',
  '<strong>La stabilité du processus</strong> : un processus qui change tous les mois doit d’abord être clarifié.',
])}
<p>Les meilleures candidates sont fréquentes, chronophages, sujettes aux erreurs et stables. Notre ${outil('calculateur-automatisation')} vous aide à chiffrer le temps en jeu avec vos propres données. Les gains réels dépendent de votre situation : nous les estimons avec vous, sur vos chiffres, sans promesse générique.</p>` },
    { id: 'exemple', h2: 'Exemple de chaîne automatisée : de la demande client à la facture', html: `
<p>Pour rendre les choses concrètes, voici une chaîne type dans une entreprise de services. Chaque étape peut être mise en place séparément.</p>
${ol([
  '<strong>La demande arrive</strong> par le site, par e-mail ou par téléphone. Un agent IA la lit, identifie le client (ou crée sa fiche dans le CRM) et classe la demande par type et par urgence.',
  '<strong>Le devis est préparé</strong> à partir de vos règles de chiffrage et de vos tarifs. Un collaborateur le relit et le valide en un clic ; il part avec un lien de signature électronique.',
  '<strong>Le devis signé déclenche la suite</strong> : création du dossier, demande d’acompte, proposition de créneaux d’intervention selon le planning des équipes.',
  '<strong>L’intervention est réalisée</strong> : le technicien remplit une fiche sur son téléphone, photos et signature à l’appui ; les informations remontent sans ressaisie.',
  '<strong>La facture est émise</strong> automatiquement à partir du dossier, transmise dans le format exigé par la facturation électronique, puis suivie : relance aimable à l’échéance, alerte au responsable si le retard persiste.',
  '<strong>Le tableau de bord se met à jour</strong> : chiffre d’affaires, encours, délais moyens, sans que personne n’ait à compiler de tableur.',
])}
<p>Dans cette chaîne, l’humain garde les décisions (valider un devis, traiter un litige) et l’automatisation se charge des recopies, des relances et des vérifications. Pour les artisans, notre guide ${guide('automatiser-devis-artisan')} détaille la partie devis ; pour les impayés, voir ${guide('relances-factures-impayees-automatiques')}.</p>` },
    { id: 'controle', h2: 'Garder le contrôle : humain dans la boucle et traçabilité', html: `
<p>Une automatisation fiable se reconnaît à ce qui se passe quand quelque chose sort de l’ordinaire. Nos principes :</p>
${ul([
  '<strong>Validation humaine</strong> pour les actions engageantes : envoi d’un devis, paiement, réponse sensible à un client.',
  '<strong>Journal de chaque action</strong> : qui (ou quel automatisme) a fait quoi, quand, à partir de quelles données.',
  '<strong>Alertes en cas d’échec</strong> plutôt qu’un silence qui laisse croire que tout va bien.',
  '<strong>Possibilité de revenir au manuel</strong> à tout moment, sans perte de données.',
  '<strong>Périmètre explicite</strong> pour les agents IA : ce qu’ils ont le droit de lire, de proposer et d’exécuter.',
])}` },
    { id: 'projet', h2: 'Comment se déroule un projet d’automatisation', html: projet(
      'Nous procédons par petites automatisations utiles, mises en service rapidement puis consolidées.',
      [
        '<strong>Appel de 10 minutes</strong> pour repérer les tâches répétitives qui pèsent le plus.',
        '<strong>Proposition sur devis</strong> : automatisations retenues, outils utilisés, points de validation humaine, propriété des scénarios et des accès, suivi.',
        '<strong>Construction par étapes</strong>, une automatisation après l’autre, testée sur des cas réels avant d’être généralisée.',
        '<strong>Mise en service</strong> avec une période d’observation : on vérifie les résultats, on ajuste les règles, on traite les cas particuliers.',
        '<strong>Suivi</strong> : surveillance, maintenance quand un outil connecté change, nouvelles automatisations.',
      ],
      'Le calendrier est fixé dans la proposition selon le nombre d’automatisations et d’outils à connecter. Pour les entreprises de la région de Montpellier, notre ' + AUTO_HUB('hub automatisation et logiciel sur-mesure') + ' présente l’offre locale.'
    ) },
    { id: 'devis', h2: 'Ce qui influence le devis d’une automatisation', html: `
${ul([
  'le <strong>nombre de processus</strong> et d’outils à connecter ;',
  'l’<strong>ouverture technique</strong> de ces outils (API documentée, export, ou absence d’accès) ;',
  'la <strong>part d’IA</strong> nécessaire, qui implique aussi des coûts d’usage à anticiper ;',
  'les <strong>volumes</strong> traités et les exigences de fiabilité ;',
  'le <strong>niveau de suivi</strong> et de surveillance attendu.',
])}
<p>Chaque projet est sur devis. Fidèles à notre devise — « nous gagnons de l’argent uniquement si vous en gagnez » — nous commençons par les automatisations dont le bénéfice est le plus clair pour vous.</p>` },
    { id: 'cadre', h2: 'Propriété, sécurité, RGPD et AI Act', html: `
<p>Faites écrire à qui appartiennent les scénarios, le code et la documentation, qui détient les comptes des plateformes utilisées et les clés d’API, et comment tout récupérer en fin de contrat. Une automatisation dont vous n’avez pas les accès est une dépendance.</p>
<p>Les automatisations manipulent souvent des données personnelles : elles doivent respecter le RGPD (minimisation, durées de conservation, sous-traitants identifiés, transferts hors Union européenne encadrés). Lorsque de l’IA intervient, le règlement européen sur l’IA prévoit notamment d’informer les personnes qui échangent avec un système d’IA ; voir ${veille('ai-act-pme')}. Enfin, la facturation électronique, obligatoire en réception depuis le 1<sup>er</sup> septembre 2026 et en émission pour les PME et microentreprises au 1<sup>er</sup> septembre 2027, est une bonne occasion d’automatiser toute la chaîne des factures (${veille('facturation-electronique-2026', 'notre article')}).</p>` },
  ],
  ctaAfter: 3,
  ctaTitle: 'Quelles tâches pourriez-vous ne plus faire ?',
  ctaText: 'En 10 minutes, nous repérons avec vous les automatisations les plus utiles pour votre entreprise.',
  faq: [
    { q: 'Qu’est-ce que l’automatisation d’entreprise ?', a: 'C’est l’ensemble des moyens qui permettent à une tâche de s’exécuter sans intervention humaine ou avec une simple validation : des règles, des intégrations entre logiciels et, lorsque c’est utile, de l’intelligence artificielle pour traiter du texte, de la voix ou des documents.' },
    { q: 'Quels processus automatiser en premier ?', a: 'Ceux qui sont fréquents, chronophages, sujets aux erreurs et stables : saisie des factures, relances, création de fiches clients, prise de rendez-vous, reporting. Un processus qui change souvent doit d’abord être clarifié.' },
    { q: 'Faut-il utiliser un outil no-code ou du code sur-mesure ?', a: 'Le no-code convient pour tester et pour des flux simples. Le code sur-mesure est préférable pour ce qui est critique, volumineux ou complexe, car il offre robustesse, traçabilité, tests et coûts d’exécution maîtrisés. Les deux peuvent coexister.' },
    { q: 'L’IA est-elle indispensable pour automatiser ?', a: 'Non. Beaucoup d’automatisations reposent sur de simples règles et intégrations. L’IA devient utile lorsqu’il faut comprendre un contenu non structuré, comme un e-mail, une facture photographiée ou un appel.' },
    { q: 'Comment garder le contrôle sur les automatisations ?', a: 'En prévoyant une validation humaine pour les actions engageantes, un journal de chaque action, des alertes en cas d’échec, la possibilité de revenir au manuel et un périmètre explicite pour les agents IA.' },
    { q: 'Combien coûte un projet d’automatisation ?', a: 'Le coût dépend du nombre de processus et d’outils à connecter, de leur ouverture technique, de la part d’IA, des volumes et du suivi attendu. Chaque projet est sur devis, établi après un appel de 10 minutes.' },
    { q: 'Combien de temps gagne-t-on en automatisant ?', a: 'Cela dépend entièrement de vos volumes et de vos processus. Nous estimons les gains avec vous à partir de vos propres chiffres, et notre calculateur gratuit de tâches répétitives permet d’en faire une première estimation.' },
  ],
  form: { h2: 'Quelle tâche voulez-vous automatiser ?', p: 'Décrivez une tâche répétitive en deux phrases : nous vous rappelons avec une première piste concrète.', ph: 'Ex : chaque matin, nous recopions les commandes reçues par e-mail dans notre logiciel…', btn: 'Être rappelé →', label: 'Votre tâche répétitive' },
});

/* ═══════════════════════ E. AGENT IA : EXEMPLES PAR MÉTIER ═══════════════════════ */
const M = (h3, fait, outils, garde, links = '') => `<div class="metier"><h3>${h3}</h3><dl><dt>Ce que fait l’agent</dt><dd>${fait}</dd><dt>Outils branchés</dt><dd>${outils}</dd><dt>Garde-fous</dt><dd>${garde}</dd></dl>${links ? `<p class="mlinks">${links}</p>` : ''}</div>`;
const LK = (ideeSlug, metierSlug) => [ideeSlug && IDEES[ideeSlug] ? idee(ideeSlug, 'Idées IA pour ce secteur') : '', metierSlug ? metier(metierSlug, 'Site internet pour ce métier') : ''].filter(Boolean).join(' · ');

PAGES.push({
  slug: 'agent-ia-entreprise-exemples',
  title: 'Agent IA pour entreprise : exemples par métier | Groupe Solution',
  desc: 'Agent IA pour entreprise : 18 exemples concrets par métier (BTP, restaurant, comptable, santé, commerce…), outils branchés et garde-fous. Sur devis.',
  crumb: 'Agent IA : exemples par métier',
  kicker: '18 métiers · outils branchés · garde-fous',
  h1: 'Agent IA pour entreprise : <em>exemples concrets par métier</em>.',
  lead: 'Un agent IA n’est utile que s’il fait quelque chose de précis, dans vos outils, avec des limites claires. Voici dix-huit métiers passés en revue : ce que l’agent fait concrètement, ce à quoi il est branché, et les garde-fous à prévoir.',
  serviceName: 'Conception et intégration d’agents IA pour entreprise',
  serviceType: 'Agent IA pour entreprise',
  services: ['agent-ia-chatbot', 'agent-vocal-ia', 'agence-ia-entreprise', 'automatisation-processus'],
  idees: ['restaurant', 'artisan', 'professionnel-de-sante', 'agence-immobiliere', 'hebergement-gite'],
  veille: ['mcp-model-context-protocol', 'agents-vocaux-ia', 'rag-assistant-documents', 'ai-act-pme'],
  metiers: ['restaurant', 'artisan', 'avocat', 'professionnel-de-sante'],
  sections: [
    { id: 'definition', h2: 'Agent IA, chatbot, automatisation : ce qui change', html: `
<p>Un <strong>chatbot</strong> répond à des questions. Une <strong>automatisation</strong> exécute une suite d’étapes fixée à l’avance. Un <strong>agent IA</strong> combine les deux : il comprend une demande formulée librement (un e-mail, un appel, un message), décide quelles actions mener parmi celles qu’on lui a autorisées, les exécute dans vos outils et rend compte. Par exemple : lire la demande d’un client, vérifier les disponibilités dans l’agenda, proposer deux créneaux, puis créer le rendez-vous une fois la réponse reçue.</p>
<p>Techniquement, un agent repose sur un modèle de langage, des <strong>outils</strong> qu’il peut appeler (API de vos logiciels, recherche dans vos documents, envoi de messages), et un <strong>cadre</strong> : instructions, droits d’accès, validations humaines et journal. Des standards comme ${veille('mcp-model-context-protocol', 'le protocole MCP')} simplifient le branchement aux outils, et ${veille('rag-assistant-documents', 'la recherche dans vos documents (RAG)')} lui permet de s’appuyer sur vos propres informations plutôt que sur des généralités.</p>` },
    { id: 'lire', h2: 'Comment lire les exemples ci-dessous', html: `
<p>Chaque fiche décrit un agent type, réaliste avec les technologies actuelles. Ce ne sont pas des produits sur étagère : chaque agent se conçoit à partir de vos outils, de vos règles et de votre ton. Les « outils branchés » sont des catégories ; nous travaillons avec les logiciels que vous utilisez déjà quand ils le permettent. Les garde-fous sont indispensables : un agent sans limites claires n’a pas sa place dans une entreprise.</p>` },
    { id: 'metiers', h2: 'Dix-huit exemples d’agents IA par métier', html: `
${M('1. Artisan du bâtiment',
  'Il répond aux demandes de devis reçues par le site, par e-mail ou par message, pose les questions manquantes (surface, accès, photos), prépare un pré-chiffrage selon vos règles et propose une date de visite technique.',
  'Formulaire du site, messagerie, agenda, outil de devis, stockage des photos.',
  'Aucun devis n’est envoyé sans votre validation ; les prix viennent de votre base, jamais de l’imagination du modèle.',
  LK('artisan', 'artisan'))}
${M('2. Restaurant',
  'Il prend les réservations au téléphone et par message, y compris dans d’autres langues, note allergies et demandes particulières, gère la liste d’attente et répond aux questions pratiques (horaires, accès, menus).',
  'Agent vocal, logiciel de réservation, plan de salle, fiche Google Business Profile.',
  'Informations sur les allergènes issues uniquement de vos fiches validées ; transfert vers l’équipe pour les groupes et les demandes inhabituelles.',
  LK('restaurant', 'restaurant'))}
${M('3. Cabinet d’expertise comptable',
  'Il relance les clients pour les pièces manquantes, lit les justificatifs reçus, les classe par dossier et prépare les écritures à valider par le collaborateur.',
  'Portail de dépôt de pièces, logiciel de production comptable, messagerie, lecture de documents.',
  'Aucune écriture n’est validée automatiquement ; chaque proposition est tracée et vérifiable ; données hébergées selon vos exigences de confidentialité.',
  LK('expert-comptable', 'expert-comptable'))}
${M('4. Cabinet d’avocat',
  'Il accueille les demandes de premier contact, qualifie le domaine de droit, vérifie les conflits d’intérêts dans votre base et propose un rendez-vous ; en interne, il recherche dans vos modèles et vos notes.',
  'Formulaire, agenda, logiciel de gestion de cabinet, base documentaire interne.',
  'L’agent ne donne jamais de conseil juridique ; secret professionnel respecté par un hébergement et des accès strictement maîtrisés.',
  LK('avocat', 'avocat'))}
${M('5. Agence immobilière',
  'Il répond aux questions sur les annonces, qualifie les acquéreurs et locataires (budget, critères, calendrier), organise les visites et relance après visite.',
  'Logiciel de transaction, portails d’annonces, agenda des négociateurs, messagerie.',
  'Critères de sélection conformes au droit de la non-discrimination ; aucune promesse sur le prix ou la disponibilité sans validation.',
  LK('agence-immobiliere', 'agence-immobiliere'))}
${M('6. Garage automobile',
  'Il prend les rendez-vous d’entretien, prépare l’ordre de réparation à partir de la plaque et du motif, prévient le client quand le véhicule est prêt et envoie le devis complémentaire à valider.',
  'Logiciel de garage, agenda atelier, SMS, messagerie.',
  'Tout travail supplémentaire exige l’accord écrit du client ; aucun diagnostic technique affirmé par l’agent.',
  LK('garage-automobile', 'garage-automobile'))}
${M('7. E-commerce',
  'Il répond aux questions sur les produits, le suivi de commande et les retours, propose des alternatives en cas de rupture et prépare les demandes de remboursement.',
  'Boutique en ligne, transporteurs, outil de service client, base produits.',
  'Remboursements et gestes commerciaux soumis à validation au-delà de règles fixées par vous ; informations produits tirées du catalogue uniquement.')}
${M('8. Santé et cabinet médical',
  'Il gère la prise de rendez-vous, les rappels, les annulations et les questions administratives (documents à apporter, accès, tarifs affichés).',
  'Agenda médical, téléphonie, SMS.',
  'Aucun avis médical, orientation immédiate vers le 15 ou le praticien en cas d’urgence exprimée ; données de santé hébergées chez un hébergeur certifié HDS lorsque c’est requis.',
  LK('professionnel-de-sante', 'professionnel-de-sante'))}
${M('9. Transport et logistique',
  'Il saisit les ordres de transport reçus par e-mail, répond aux demandes de suivi, prévient les destinataires des créneaux de livraison et collecte les preuves de livraison.',
  'Logiciel de gestion des transports, messagerie, géolocalisation, application chauffeur.',
  'Les tarifs spéciaux et les litiges passent par l’exploitation ; chaque ordre créé est vérifiable.',
  LK('transport-logistique'))}
${M('10. Industrie',
  'Il répond aux demandes de disponibilité et de délai à partir de l’état réel de la production, prépare les accusés de réception de commande et aide les équipes à retrouver une procédure ou une fiche technique.',
  'ERP ou gestion de production, base documentaire qualité, messagerie.',
  'Délais annoncés uniquement à partir des données de production, avec validation commerciale ; accès en lecture seule aux systèmes critiques.',
  LK('industrie-pme'))}
${M('11. Hôtellerie et gîte',
  'Il répond aux voyageurs avant, pendant et après le séjour, dans leur langue : disponibilités, arrivée autonome, recommandations locales, demandes particulières.',
  'Logiciel de réservation ou gestionnaire de canaux, messagerie, livret d’accueil numérique.',
  'Aucune modification de réservation ou de tarif sans validation ; réponses fondées sur votre livret et vos règles.',
  LK('hebergement-gite', 'hebergement-gite'))}
${M('12. Organisme de formation',
  'Il renseigne les candidats sur les programmes, vérifie les prérequis, gère les inscriptions, envoie convocations et documents, et collecte les évaluations.',
  'Logiciel de gestion de formation, agenda des sessions, messagerie, signature électronique.',
  'Aucune information sur les financements qui ne soit issue de vos contenus validés ; décisions d’admission prises par l’équipe.',
  LK('organisme-de-formation', 'organisme-de-formation'))}
${M('13. Services à domicile',
  'Il reçoit les demandes des familles, propose des créneaux compatibles avec les plannings des intervenants, gère les remplacements et prévient en cas de retard.',
  'Logiciel de planification, application des intervenants, téléphonie, SMS.',
  'Les situations sensibles (santé, sécurité d’une personne) sont immédiatement transmises à un responsable humain.',
  LK('services-a-domicile', 'services-a-domicile'))}
${M('14. Association et collectivité',
  'Il répond aux questions des usagers ou des adhérents sur les démarches et les horaires, oriente vers le bon service et pré-remplit les demandes.',
  'Site internet, base de connaissances, outil de gestion des demandes, données publiques ouvertes.',
  'Réponses limitées aux informations publiées et à jour ; transparence sur le fait qu’il s’agit d’une IA ; accessibilité soignée.',
  LK('association-collectivite'))}
${M('15. Commerce de détail',
  'Il indique la disponibilité d’un produit en magasin, prend les réservations et les commandes à retirer, et répond aux questions sur les horaires et les services.',
  'Caisse et gestion de stock, boutique en ligne, messagerie, fiche Google Business Profile.',
  'Disponibilités lues en temps réel dans le stock ; aucune promotion inventée.',
  LK('commerce-boutique', 'commerce-boutique'))}
${M('16. Coiffure et esthétique',
  'Il prend et déplace les rendez-vous, adapte la durée selon la prestation, relance les clients habituels et remplit les créneaux libérés.',
  'Logiciel de réservation, SMS, messagerie, réseaux sociaux.',
  'Pas de conseil sur des soins à risque ; questions techniques transmises au professionnel.',
  LK('coiffeur-esthetique', 'coiffeur-esthetique'))}
${M('17. Salle de sport et coaching',
  'Il gère les réservations de cours, les listes d’attente, les questions sur les abonnements et la relance des membres inactifs.',
  'Logiciel de gestion des membres, planning des cours, messagerie.',
  'Aucun conseil médical ; résiliations et litiges traités par l’équipe.',
  LK('coach-salle-de-sport', 'coach-salle-de-sport'))}
${M('18. Domaine viticole',
  'Il répond aux professionnels et aux particuliers sur les cuvées et les disponibilités, organise les visites et dégustations, et prépare les commandes.',
  'Gestion des stocks de bouteilles, boutique en ligne, agenda du caveau, messagerie.',
  'Vente d’alcool conforme à la réglementation (vérification de la majorité en ligne notamment) ; tarifs professionnels réservés aux comptes validés.',
  LK('domaine-viticole', 'domaine-viticole'))}
<p>Vous ne trouvez pas votre métier ? Notre ${IDEES_HUB()} propose d’autres pistes, et l’assistant de notre page d’accueil peut explorer votre cas en quelques questions.</p>` },
    { id: 'gardefous', h2: 'Les garde-fous communs à tous les agents', html: `
${ul([
  '<strong>Un périmètre écrit</strong> : ce que l’agent peut lire, proposer et exécuter, et ce qui lui est interdit.',
  '<strong>La validation humaine</strong> pour les actions engageantes : envoi d’un devis, paiement, engagement contractuel, réponse sensible.',
  '<strong>Des sources maîtrisées</strong> : l’agent s’appuie sur vos données et vos documents validés, et dit qu’il ne sait pas plutôt que d’inventer.',
  '<strong>La transparence</strong> : les personnes savent qu’elles échangent avec une IA et peuvent joindre un humain.',
  '<strong>Un journal complet</strong> des échanges et des actions, pour contrôler et améliorer.',
  '<strong>Des tests sur vos cas réels</strong> avant la mise en service, puis une surveillance régulière.',
])}` },
    { id: 'projet', h2: 'Comment se déroule un projet d’agent IA', html: projet(
      'Un agent IA se construit en partant d’un seul cas d’usage bien choisi, puis s’étend.',
      [
        '<strong>Appel de 10 minutes</strong> : le cas d’usage, les outils en place, les volumes, les limites à respecter.',
        '<strong>Proposition sur devis</strong> : périmètre de l’agent, outils branchés, garde-fous, hébergement et choix du modèle, propriété, suivi.',
        '<strong>Construction par étapes</strong> : d’abord un agent qui propose sans agir, testé sur vos cas réels ; puis, une fois la qualité vérifiée, l’autorisation d’exécuter certaines actions.',
        '<strong>Mise en service</strong> progressive, avec relecture des échanges et ajustement des instructions.',
        '<strong>Suivi</strong> : qualité des réponses, évolution des modèles, nouvelles actions autorisées.',
      ],
      'Pour les appels téléphoniques, voir notre page ' + svc('agent-vocal-ia', 'agent vocal IA') + ' et notre article ' + veille('agents-vocaux-ia') + '.'
    ) },
    { id: 'devis', h2: 'Ce qui influence le devis d’un agent IA', html: `
<p>Le nombre d’outils branchés et leur ouverture technique ; le nombre d’actions autorisées ; la quantité et la qualité des documents sur lesquels l’agent s’appuie ; les canaux (site, e-mail, messagerie, téléphone) ; les langues ; les exigences d’hébergement et de confidentialité ; les volumes, qui déterminent les coûts d’usage des modèles ; le niveau de suivi. Chaque projet est sur devis.</p>` },
    { id: 'cadre', h2: 'Données, propriété, RGPD et AI Act', html: `
<p>Faites écrire à qui appartiennent les instructions, les connecteurs, le code et les journaux, où sont hébergées les données, quels fournisseurs de modèles sont utilisés et si vos données peuvent servir à entraîner leurs modèles. Le RGPD s’applique pleinement : information des personnes, minimisation, durées de conservation, sous-traitants et transferts hors Union européenne encadrés.</p>
<p>Le règlement européen sur l’IA (AI Act) s’applique progressivement ; il prévoit notamment que les personnes soient informées lorsqu’elles interagissent avec un système d’IA, et encadre plus strictement certains usages dits à haut risque, par exemple dans le recrutement. Notre article ${veille('ai-act-pme')} fait le point pour les PME.</p>` },
  ],
  ctaAfter: 2,
  ctaTitle: 'Quel agent IA pour votre métier ?',
  ctaText: 'Décrivez votre activité : nous identifions avec vous le cas d’usage le plus utile pour commencer.',
  faq: [
    { q: 'Qu’est-ce qu’un agent IA pour entreprise ?', a: 'C’est un programme qui s’appuie sur un modèle de langage pour comprendre une demande formulée librement, choisir des actions parmi celles qu’on lui a autorisées, les exécuter dans vos outils, comme l’agenda, le CRM ou la messagerie, et rendre compte, dans un cadre défini par des règles et des validations humaines.' },
    { q: 'Quelle différence entre un chatbot et un agent IA ?', a: 'Un chatbot répond à des questions. Un agent IA peut en plus agir : créer un rendez-vous, préparer un devis, mettre à jour une fiche client, dans la limite des droits qui lui sont accordés.' },
    { q: 'Un agent IA peut-il se tromper ?', a: 'Oui, c’est pourquoi il doit s’appuyer sur vos données validées, dire qu’il ne sait pas plutôt que d’inventer, faire valider les actions engageantes par un humain et conserver un journal de ses actions. Il est testé sur vos cas réels avant la mise en service.' },
    { q: 'Quels outils un agent IA peut-il utiliser ?', a: 'Tous ceux qui offrent un accès technique : agenda, CRM, logiciel métier, boutique en ligne, messagerie, téléphonie, base documentaire. Lorsqu’un outil n’a pas d’API, d’autres méthodes existent, comme l’automatisation de navigation, avec davantage de précautions.' },
    { q: 'Combien coûte un agent IA ?', a: 'Le coût dépend du nombre d’outils branchés, des actions autorisées, des canaux, des langues, des exigences d’hébergement, des volumes et du suivi. Chaque projet est sur devis, établi après un appel de 10 minutes.' },
    { q: 'Mes données sont-elles protégées ?', a: 'Elles doivent l’être : hébergement choisi selon vos exigences, accès limités, fournisseurs de modèles identifiés et contractuellement encadrés, conformité au RGPD. Ces points sont fixés par écrit dans la proposition.' },
    { q: 'Faut-il informer les clients qu’ils parlent à une IA ?', a: 'Oui. Le règlement européen sur l’IA prévoit que les personnes soient informées lorsqu’elles interagissent avec un système d’IA, et c’est de toute façon une bonne pratique de confiance. Les clients doivent aussi pouvoir joindre un humain.' },
  ],
  form: { h2: 'Décrivez votre métier et votre besoin', p: 'Deux phrases suffisent : nous vous rappelons avec une idée d’agent adaptée à votre activité.', ph: 'Ex : nous sommes un garage, le téléphone sonne sans arrêt pour des prises de rendez-vous…', btn: 'Être rappelé →', label: 'Votre activité et votre besoin' },
});
