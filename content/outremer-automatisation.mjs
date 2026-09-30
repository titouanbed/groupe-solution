/* ═══════════════════════════════════════════════════════════
   Contenu des pages « Automatisation et logiciel sur-mesure » par territoire
   d'outre-mer — lu par zones/generate-automatisation-outremer.mjs.

   Règles : faits vérifiables et formulés avec prudence ; aucun chiffre
   non sourcé, aucun prix, aucun délai garanti, aucun client cité.
   Mayotte : Titouan Bedos, fondateur, est sur place et couvre toute l'île.
   Autres territoires : ni agence ni bureaux revendiqués.
   FAQ en texte brut (même texte pour la FAQ visible et le JSON-LD).
   ═══════════════════════════════════════════════════════════ */

const PRESENCE = n => `Nous accompagnons les entreprises ${n} comme celles de toute la France : notre agence est à Saint-Jean-de-Védas, dans la métropole de Montpellier, et Titouan Bedos, fondateur de Groupe Solution, est à Mayotte.`;

/* Cadre commun aux départements et régions d'outre-mer (droit de l'Union applicable) */
const CADRE_DROM = (tva) => `
<p>${'Comme partout dans l’Union européenne, le <strong>RGPD</strong> s’applique : chaque automatisation doit limiter les données collectées, fixer des durées de conservation, identifier ses sous-traitants (hébergeur, fournisseur de modèle d’IA, envoi de SMS) et encadrer les éventuels transferts hors Union européenne. Le <strong>règlement européen sur l’IA</strong> (AI Act) s’applique progressivement ; il prévoit notamment d’informer les personnes lorsqu’elles échangent avec un système d’IA.'}</p>
<p>${tva}</p>
<p>Côté sécurité, nos principes ne changent pas d’un territoire à l’autre : droits d’accès par rôle, authentification forte pour les comptes sensibles, journal des actions, sauvegardes testées et mises à jour régulières. Et pour les actions engageantes — envoyer un devis, payer, répondre à une réclamation sensible — une validation humaine reste la règle.</p>`;

export const TERRITOIRES = [];

/* ═══════════════════════ LA RÉUNION ═══════════════════════ */
TERRITOIRES.push({
  slug: 'reunion', name: 'La Réunion', a: 'à La Réunion', tag: 'La Réunion (974) · automatisation · logiciel · IA',
  villes: ['Saint-Denis', 'Saint-Pierre', 'Saint-Paul', 'Le Port', 'Le Tampon', 'Saint-André'],
  title: 'Automatisation et logiciel sur-mesure à La Réunion (974)',
  desc: 'Automatisation et logiciel sur-mesure à La Réunion : exemples adaptés au commerce, au BTP, au tourisme et aux services, méthode, RGPD. Sur devis.',
  h1: 'Automatisation et logiciel sur-mesure à La Réunion',
  lead: 'Commerce qui dépend des arrivages maritimes, BTP très actif, tourisme de pleine nature, services aux collectivités : les entreprises réunionnaises ont des contraintes que les outils standard ignorent souvent. Voici ce que l’automatisation et le logiciel sur-mesure peuvent concrètement changer sur l’île.',
  ecoH2: 'Le tissu économique réunionnais et ce qu’il implique',
  eco: `
<p>L’économie de La Réunion repose très largement sur les <strong>services</strong> : commerce, services aux entreprises et aux particuliers, santé, et un secteur public important. Le <strong>BTP</strong> y occupe une place notable, porté par le logement et les équipements publics. L’agriculture reste structurée autour de la <strong>filière canne-sucre-rhum</strong>, et le <strong>tourisme</strong> s’appuie sur des paysages exceptionnels — les « pitons, cirques et remparts » sont inscrits au patrimoine mondial de l’UNESCO depuis 2010.</p>
<p>L’île importe une grande partie de ce qu’elle consomme, principalement par le Grand Port Maritime situé au Port. Les marchandises importées sont soumises à l’octroi de mer, et les délais d’acheminement pèsent sur la gestion des stocks. Le tissu est composé en grande majorité de TPE et de PME, souvent dirigées par des personnes qui cumulent la production, la vente et l’administratif.</p>
<p>Conséquence directe : les gains les plus rapides viennent de l’<strong>administratif</strong> (devis, factures, relances, dossiers), de la <strong>gestion des approvisionnements</strong> et de la <strong>relation client</strong>, qui absorbent un temps considérable dans les petites structures.</p>`,
  contH2: 'Les contraintes propres à La Réunion',
  contraintes: `
<ul>
<li><strong>Le décalage horaire</strong> : La Réunion vit à l’heure UTC+4, sans heure d’été. Elle a donc trois heures d’avance sur la métropole en hiver, deux en été. Quand vos fournisseurs ou votre siège métropolitains commencent leur journée, la vôtre est déjà bien avancée.</li>
<li><strong>L’insularité et les délais d’approvisionnement</strong> : une rupture de stock ne se rattrape pas en vingt-quatre heures. Anticiper les commandes devient un enjeu de trésorerie autant que de service.</li>
<li><strong>La saison cyclonique</strong>, pendant l’été austral, avec son système d’alertes : il faut pouvoir prévenir rapidement clients et équipes, reprogrammer des interventions, sécuriser les données.</li>
<li><strong>La circulation</strong> : les trajets entre le nord, l’ouest, le sud et l’est de l’île, souvent saturés aux heures de pointe, rendent la planification des tournées déterminante.</li>
<li><strong>La saisonnalité touristique</strong> et les vacances scolaires, qui font varier fortement l’activité de nombreux secteurs.</li>
</ul>`,
  exIntro: 'Des cas types, réalistes avec les technologies actuelles, pensés pour les réalités de l’île :',
  exemples: [
    ['Réassort qui tient compte du délai maritime', 'Un outil qui suit vos ventes et vos stocks, intègre le délai réel d’acheminement de chaque fournisseur et vous propose les commandes à passer au bon moment, avant la rupture.'],
    ['Reprogrammation en cas d’alerte cyclonique', 'En un geste, les rendez-vous et interventions de la période concernée sont décalés, les clients prévenus par SMS ou e-mail, et de nouveaux créneaux proposés dès la levée de l’alerte.'],
    ['Suivi de chantier pour le BTP', 'Photos, bons d’intervention, avancement, réserves et documents des sous-traitants remontent du chantier sans ressaisie ; le bureau prépare la situation de travaux et la facture à partir des données du terrain.'],
    ['Veille des marchés publics', 'Une veille automatique des avis publiés au BOAMP et sur les profils d’acheteurs, filtrée selon vos métiers et votre zone, avec préparation des pièces administratives récurrentes.'],
    ['Réservations et messages voyageurs', 'Pour les hébergements et les activités de loisirs : réponses aux questions fréquentes en plusieurs langues, confirmations, consignes d’arrivée et rappels météo, avec relais humain pour les cas particuliers.'],
    ['Un back-office qui travaille pendant le décalage', 'Les commandes et demandes reçues de métropole en fin de journée réunionnaise sont triées, saisies et préparées automatiquement : le matin, vos équipes n’ont plus qu’à valider.'],
  ],
  callout: 'La meilleure première automatisation est rarement la plus spectaculaire : c’est celle qui supprime une tâche que vous faites tous les jours, et qui vous agace.',
  logiciel: `
<p>Un logiciel sur-mesure se justifie à La Réunion quand votre organisation ne rentre pas dans les outils nationaux : gestion multi-sites entre le nord et le sud, règles d’approvisionnement propres à l’import, planning d’équipes qui intègre les temps de trajet réels, ou activité mêlant vente, pose et maintenance. Il se connecte à vos outils existants plutôt que de les remplacer, et se construit par étapes, en commençant par ce qui fait gagner le plus de temps.</p>
<p>Si votre besoin est couvert par un logiciel du marché bien paramétré, nous vous le dirons. Voir notre dossier <a href="../services/logiciel-sur-mesure-pme.html">logiciel sur-mesure pour PME</a> pour les critères de choix.</p>`,
  presence: PRESENCE('de La Réunion'),
  horaire: 'Nous choisissons ensemble un créneau pratique compte tenu du décalage horaire.',
  cadre: CADRE_DROM('La Réunion appliquant la TVA, à des taux qui lui sont propres, les entreprises assujetties y sont en principe concernées par la <strong>facturation électronique</strong> : réception obligatoire depuis le 1<sup>er</sup> septembre 2026, émission pour les PME et microentreprises au 1<sup>er</sup> septembre 2027, via une plateforme agréée. Vérifiez votre situation précise avec votre expert-comptable ; notre article <a href="../lab/veille/facturation-electronique-2026.html">facturation électronique 2026-2027</a> fait le point.'),
  idees: [['artisan', 'les artisans du bâtiment'], ['commerce-boutique', 'le commerce'], ['hebergement-gite', 'l’hébergement']],
  placeholder: 'Ex : nous sommes un commerce à Saint-Pierre, nos ruptures de stock viennent des délais de livraison…',
  faq: [
    { q: 'Travaillez-vous avec des entreprises de La Réunion ?', a: 'Oui. Nous accompagnons les entreprises de La Réunion comme celles de toute la France. Le premier échange de 10 minutes se fait par téléphone ou en visio, sur un créneau choisi en tenant compte du décalage horaire.' },
    { q: 'Quelles tâches automatiser en priorité dans une entreprise réunionnaise ?', a: 'Celles qui reviennent tous les jours et prennent du temps : devis, factures et relances, saisie des commandes, suivi des approvisionnements soumis aux délais maritimes, réponses aux questions fréquentes des clients et planification des interventions.' },
    { q: 'Le décalage horaire avec la métropole pose-t-il problème ?', a: 'Non. La Réunion a trois heures d’avance sur la métropole en hiver et deux en été. Les rendez-vous sont fixés dans la plage commune, et les automatisations peuvent justement tirer parti du décalage en préparant le travail pendant que l’une des deux équipes est hors de ses horaires.' },
    { q: 'Les entreprises réunionnaises sont-elles concernées par la facturation électronique ?', a: 'En principe oui pour les entreprises assujetties à la TVA : réception obligatoire depuis le 1er septembre 2026 et émission pour les PME et microentreprises au 1er septembre 2027, via une plateforme agréée. Votre expert-comptable peut confirmer votre situation précise.' },
    { q: 'Combien coûte une automatisation ou un logiciel sur-mesure ?', a: 'Il n’y a pas de prix standard : le coût dépend du nombre de processus, des outils à connecter, de la part d’intelligence artificielle et du suivi souhaité. Chaque projet est sur devis, établi après un appel de 10 minutes.' },
    { q: 'Mes données restent-elles sous mon contrôle ?', a: 'Oui. La propriété du code et des données, l’export dans un format ouvert et la détention des accès sont fixés par écrit dans la proposition, et les traitements respectent le RGPD.' },
  ],
});

/* ═══════════════════════ MAYOTTE ═══════════════════════ */
TERRITOIRES.push({
  slug: 'mayotte', name: 'Mayotte', a: 'à Mayotte', tag: 'Mayotte (976) · sur place · automatisation · logiciel',
  villes: ['Mamoudzou', 'Koungou', 'Dzaoudzi', 'Pamandzi', 'Dembéni', 'Sada', 'Chirongui'],
  title: 'Automatisation et logiciel sur-mesure à Mayotte (976)',
  desc: 'Automatisation et logiciel sur-mesure à Mayotte, par un fondateur installé sur l’île : BTP, commerce, services, dossiers, hors ligne, RGPD. Sur devis.',
  h1: 'Automatisation et logiciel sur-mesure à Mayotte',
  lead: 'Reconstruction, coupures, trajets imprévisibles, dossiers administratifs lourds : à Mayotte, chaque heure gagnée compte. Titouan Bedos, fondateur de Groupe Solution, vit à Mayotte et accompagne les entreprises de toute l’île, de Grande-Terre à Petite-Terre, avec des outils pensés pour les réalités locales.',
  ecoH2: 'L’économie mahoraise et ce qu’elle implique',
  eco: `
<p>Mayotte est devenue le 101<sup>e</sup> département français en 2011, puis une région ultrapériphérique de l’Union européenne en 2014. Son économie repose fortement sur le <strong>secteur public</strong>, le <strong>commerce</strong>, le <strong>BTP</strong> et une multitude de <strong>petites entreprises</strong> de services. La population y est particulièrement jeune, ce qui nourrit des besoins importants en logement, en équipements, en formation et en services.</p>
<p>Le passage du cyclone Chido, en décembre 2024, a durement touché l’île. La reconstruction mobilise fortement les entreprises du bâtiment, les commerces de matériaux, les transporteurs et les services, avec une pression forte sur les délais, les approvisionnements et les dossiers (assurances, aides, marchés publics).</p>
<p>La quasi-totalité des marchandises arrive par le port de Longoni. Pour une petite entreprise mahoraise, le temps passé à suivre les commandes, relancer les paiements, monter des dossiers et répondre au téléphone est souvent le premier frein à la croissance : c’est précisément là que l’automatisation apporte le plus.</p>`,
  contH2: 'Les contraintes propres à Mayotte',
  contraintes: `
<ul>
<li><strong>Le décalage horaire</strong> : Mayotte vit à l’heure UTC+3, sans heure d’été, soit deux heures d’avance sur la métropole en hiver et une heure en été.</li>
<li><strong>Les coupures</strong> d’eau, d’électricité ou de réseau, qui imposent des outils capables de fonctionner hors ligne et de se synchroniser au retour de la connexion.</li>
<li><strong>Les trajets</strong> : embouteillages autour de Mamoudzou, liaison par barge entre Petite-Terre et Grande-Terre, routes du sud et du nord. Un planning réaliste doit intégrer ces temps.</li>
<li><strong>Les approvisionnements</strong> par conteneurs, avec des délais et des aléas qui obligent à anticiper.</li>
<li><strong>Le plurilinguisme</strong> : le français côtoie le shimaoré et le kibushi. Les modèles d’IA actuels maîtrisent encore mal ces deux langues ; nous le disons franchement et prévoyons un relais humain plutôt qu’une traduction approximative.</li>
</ul>`,
  exIntro: 'Des cas types pensés pour le terrain mahorais :',
  exemples: [
    ['Suivi de chantier et de reconstruction', 'Photos avant et après, avancement, matériaux utilisés, bons signés : tout remonte du chantier vers le bureau, même sans réseau, et alimente directement les situations de travaux, les factures et les dossiers d’assurance ou d’aide.'],
    ['Une application qui fonctionne hors ligne', 'Fiches d’intervention, inventaires, relevés : les équipes saisissent sur leur téléphone sans connexion, et tout se synchronise automatiquement quand le réseau revient.'],
    ['Planning qui intègre les trajets et la barge', 'Un planning d’interventions qui tient compte des temps de trajet réels, des horaires de la barge et des zones de l’île, et prévient automatiquement les clients en cas de retard.'],
    ['Stocks et arrivages de conteneurs', 'Un suivi des commandes fournisseurs, des arrivages au port de Longoni et des stocks, avec alertes avant rupture et réservation des marchandises attendues pour vos clients.'],
    ['Dossiers administratifs préparés automatiquement', 'Les pièces récurrentes (attestations, extraits, références) sont rassemblées et tenues à jour, les dossiers de marchés publics ou de demandes d’aide pré-remplis, les échéances rappelées à temps.'],
    ['Accueil client par messagerie', 'Réponses aux questions fréquentes, prise de rendez-vous et confirmations sur les messageries très utilisées sur l’île, en français, avec transfert immédiat vers un humain pour les autres langues et les cas particuliers.'],
  ],
  callout: 'Être sur place change tout : les outils sont testés dans les vraies conditions de l’île — réseau, trajets, coupures — avant d’être mis en service.',
  logiciel: `
<p>Un logiciel sur-mesure se justifie à Mayotte lorsque les outils nationaux supposent une connexion permanente, des délais de livraison courts ou une organisation standard. C’est souvent le cas pour les entreprises du BTP en pleine reconstruction, les commerces qui gèrent des arrivages irréguliers, ou les structures de services dont les équipes circulent sur toute l’île. Le logiciel se construit par étapes, avec les personnes qui l’utiliseront, et reste relié à vos outils de comptabilité et de facturation.</p>
<p>Pour comparer avec un logiciel du marché, voir notre dossier <a href="../services/application-metier-sur-mesure.html">application métier sur-mesure</a>.</p>`,
  presence: 'Titouan Bedos, fondateur de Groupe Solution, est installé à Mayotte et couvre toute l’île, de Mamoudzou au sud de Grande-Terre et à Petite-Terre. Un rendez-vous sur place est possible. Groupe Solution dispose aussi de son agence à Saint-Jean-de-Védas, dans la métropole de Montpellier.',
  horaire: 'Le premier échange peut aussi se faire directement dans vos locaux.',
  cadre: CADRE_DROM('La <strong>TVA</strong> n’étant pas applicable à Mayotte à ce jour, la portée de la réforme de la facturation électronique, liée à la TVA, y diffère de la métropole : faites le point avec votre expert-comptable. Automatiser la production, l’envoi et le suivi de vos factures reste de toute façon l’un des gains les plus rapides. Pour le calendrier national, voir notre article <a href="../lab/veille/facturation-electronique-2026.html">facturation électronique 2026-2027</a>.'),
  idees: [['artisan', 'les artisans du bâtiment'], ['commerce-boutique', 'le commerce'], ['services-a-domicile', 'les services à domicile']],
  placeholder: 'Ex : entreprise du BTP à Mamoudzou, nos bons de chantier papier se perdent et la facturation prend du retard…',
  faq: [
    { q: 'Êtes-vous présents à Mayotte ?', a: 'Oui. Titouan Bedos, fondateur de Groupe Solution, vit à Mayotte et couvre toute l’île, Grande-Terre comme Petite-Terre. Un premier rendez-vous peut se faire sur place, par téléphone ou en visio.' },
    { q: 'Vos outils fonctionnent-ils malgré les coupures de réseau ?', a: 'Oui, lorsque c’est nécessaire nous concevons des applications capables de fonctionner hors ligne : les données sont enregistrées sur l’appareil puis synchronisées automatiquement au retour de la connexion.' },
    { q: 'Pouvez-vous aider les entreprises du BTP engagées dans la reconstruction ?', a: 'Oui. Suivi de chantier avec photos, bons signés, suivi des matériaux, préparation des situations de travaux, des factures et des dossiers d’assurance ou d’aide : ce sont des automatisations particulièrement utiles dans le contexte actuel.' },
    { q: 'L’assistant IA peut-il répondre en shimaoré ou en kibushi ?', a: 'Les modèles d’intelligence artificielle actuels maîtrisent encore mal le shimaoré et le kibushi. Nous préférons le dire franchement : l’assistant répond en français et transfère vers un humain pour les autres langues, plutôt que de risquer des réponses approximatives.' },
    { q: 'La facturation électronique s’applique-t-elle à Mayotte ?', a: 'La réforme est liée à la TVA, qui n’est pas applicable à Mayotte à ce jour ; sa portée y diffère donc de la métropole. Votre expert-comptable peut confirmer votre situation. Automatiser vos factures et vos relances reste utile dans tous les cas.' },
    { q: 'Combien coûte un projet d’automatisation à Mayotte ?', a: 'Chaque projet est sur devis : le coût dépend des tâches à automatiser, des outils à connecter, du fonctionnement hors ligne éventuel et du suivi souhaité. Le devis est établi après un premier échange de 10 minutes.' },
  ],
});

/* ═══════════════════════ GUADELOUPE ═══════════════════════ */
TERRITOIRES.push({
  slug: 'guadeloupe', name: 'La Guadeloupe', a: 'en Guadeloupe', tag: 'Guadeloupe (971) · automatisation · logiciel · IA',
  villes: ['Pointe-à-Pitre', 'Les Abymes', 'Baie-Mahault', 'Le Gosier', 'Basse-Terre', 'Sainte-Anne'],
  title: 'Automatisation et logiciel sur-mesure en Guadeloupe (971)',
  desc: 'Automatisation et logiciel sur-mesure en Guadeloupe : négoce, tourisme, BTP, logistique inter-îles, exemples concrets, méthode et RGPD. Sur devis.',
  h1: 'Automatisation et logiciel sur-mesure en Guadeloupe',
  lead: 'Un archipel, une zone d’activités parmi les plus denses des Antilles, un tourisme international et des liaisons inter-îles à organiser : les entreprises guadeloupéennes jonglent avec des contraintes que peu d’outils standard prennent en compte. Voici comment l’automatisation et le logiciel sur-mesure peuvent les alléger.',
  ecoH2: 'Le tissu économique guadeloupéen et ce qu’il implique',
  eco: `
<p>La Guadeloupe est un <strong>archipel</strong> : Basse-Terre et Grande-Terre, reliées par un pont sur la Rivière Salée, et les îles de Marie-Galante, des Saintes et de La Désirade. Son économie est dominée par les <strong>services</strong> et le <strong>commerce</strong>, avec un secteur public important. La zone d’activités de <strong>Jarry</strong>, à Baie-Mahault, concentre une grande partie du négoce, de la distribution et de la logistique, à proximité du port.</p>
<p>Le <strong>tourisme</strong> est un moteur majeur, notamment sur la côte sud de Grande-Terre (Le Gosier, Sainte-Anne, Saint-François), avec une clientèle métropolitaine et internationale. L’agriculture garde des filières emblématiques — <strong>banane</strong>, <strong>canne</strong> et <strong>rhum</strong> — et le <strong>BTP</strong> reste un secteur actif.</p>
<p>Pour ces entreprises, les gains d’automatisation se concentrent sur trois terrains : la <strong>chaîne commande-livraison-facture</strong> du négoce, la <strong>relation client</strong> du tourisme et des services, et la <strong>coordination</strong> d’équipes réparties sur plusieurs îles.</p>`,
  contH2: 'Les contraintes propres à la Guadeloupe',
  contraintes: `
<ul>
<li><strong>Le décalage horaire</strong> : la Guadeloupe vit à l’heure UTC−4, sans heure d’été, soit cinq heures de retard sur la métropole en hiver et six en été. Quand vous ouvrez, les fournisseurs métropolitains ont déjà déjeuné.</li>
<li><strong>La logistique d’archipel</strong> : desservir Marie-Galante, Les Saintes ou La Désirade suppose de composer avec les horaires des traversées.</li>
<li><strong>Le fret maritime</strong> et l’octroi de mer, qui allongent les délais et compliquent le calcul des prix de revient.</li>
<li><strong>La saison cyclonique</strong> et les épisodes d’échouement de sargasses, qui perturbent l’activité touristique et les interventions.</li>
<li><strong>La circulation</strong> autour de l’agglomération pointoise, qui pèse sur les tournées.</li>
</ul>`,
  exIntro: 'Des cas types, adaptés à l’économie de l’archipel :',
  exemples: [
    ['Commandes professionnelles sans ressaisie', 'Pour le négoce et la distribution : les commandes reçues par e-mail, par portail ou par téléphone sont lues, saisies automatiquement, vérifiées contre le stock et confirmées au client.'],
    ['Prix de revient qui intègrent fret et octroi de mer', 'Un outil qui calcule automatiquement le coût complet de chaque produit importé, à partir des factures fournisseurs, du fret et des taxes, pour fixer des prix justes sans tableur.'],
    ['Tournées et interventions inter-îles', 'Un planning qui regroupe les interventions à Marie-Galante ou aux Saintes selon les horaires des traversées, et prévient automatiquement les clients concernés.'],
    ['Messages voyageurs multilingues', 'Pour les hébergements, les loueurs et les prestataires d’activités : réponses en français, en anglais ou en espagnol, confirmations, consignes d’arrivée et informations pratiques, avec relais humain.'],
    ['Communication de crise automatisée', 'En cas d’alerte météo, les rendez-vous sont décalés en masse, les clients prévenus et les équipes informées, sans passer la journée au téléphone.'],
    ['Reporting préparé pendant la nuit', 'Les chiffres de la journée sont consolidés automatiquement et envoyés au siège ou aux associés en métropole avant le début de leur matinée.'],
  ],
  callout: 'Dans un archipel, chaque déplacement évité ou mieux regroupé est un gain direct : la planification automatique est souvent la première automatisation rentable.',
  logiciel: `
<p>Un logiciel sur-mesure se justifie en Guadeloupe quand votre activité combine plusieurs métiers (vente, installation, maintenance), plusieurs sites ou plusieurs îles, ou des règles de prix propres à l’import. Il relie vos outils existants — comptabilité, caisse, boutique en ligne — et se construit par étapes. Si un logiciel du marché suffit, nous vous le dirons ; notre dossier <a href="../services/logiciel-de-gestion-sur-mesure.html">logiciel de gestion sur-mesure</a> détaille les critères.</p>`,
  presence: PRESENCE('de la Guadeloupe'),
  horaire: 'Le créneau est choisi en tenant compte des cinq ou six heures de décalage avec la métropole.',
  cadre: CADRE_DROM('La Guadeloupe appliquant la TVA, à des taux qui lui sont propres, les entreprises assujetties y sont en principe concernées par la <strong>facturation électronique</strong> : réception obligatoire depuis le 1<sup>er</sup> septembre 2026, émission pour les PME et microentreprises au 1<sup>er</sup> septembre 2027, via une plateforme agréée. Faites confirmer votre situation par votre expert-comptable ; voir aussi notre article <a href="../lab/veille/facturation-electronique-2026.html">facturation électronique 2026-2027</a>.'),
  idees: [['commerce-boutique', 'le commerce'], ['hebergement-gite', 'l’hébergement'], ['transport-logistique', 'le transport et la logistique']],
  placeholder: 'Ex : négoce à Jarry, nous ressaisissons chaque commande reçue par e-mail dans notre logiciel…',
  faq: [
    { q: 'Accompagnez-vous les entreprises de Guadeloupe ?', a: 'Oui. Nous accompagnons les entreprises de la Guadeloupe comme celles de toute la France. Le premier échange de 10 minutes se fait par téléphone ou en visio, sur un créneau adapté au décalage horaire.' },
    { q: 'Que peut-on automatiser dans une entreprise de négoce à Jarry ?', a: 'La saisie des commandes reçues par e-mail ou par portail, la vérification du stock, les confirmations aux clients, le calcul des prix de revient incluant fret et octroi de mer, la facturation et les relances.' },
    { q: 'Comment gérez-vous le décalage horaire ?', a: 'La Guadeloupe a cinq heures de retard sur la métropole en hiver et six en été. Les échanges se font dans la plage commune, et les automatisations peuvent préparer le travail pendant les heures où l’autre rive est fermée.' },
    { q: 'Un assistant IA peut-il répondre aux touristes en anglais ?', a: 'Oui. Un assistant peut répondre en français, en anglais ou en espagnol à partir de vos informations validées, confirmer les réservations et transmettre à votre équipe les demandes particulières.' },
    { q: 'La facturation électronique concerne-t-elle les entreprises guadeloupéennes ?', a: 'En principe oui pour les entreprises assujetties à la TVA : réception obligatoire depuis le 1er septembre 2026 et émission pour les PME et microentreprises au 1er septembre 2027, via une plateforme agréée. Votre expert-comptable peut confirmer votre cas.' },
    { q: 'Combien coûte un projet ?', a: 'Chaque projet est sur devis, établi après un appel de 10 minutes : le coût dépend des tâches à automatiser, des outils à connecter, de la part d’intelligence artificielle et du suivi souhaité.' },
  ],
});

/* ═══════════════════════ MARTINIQUE ═══════════════════════ */
TERRITOIRES.push({
  slug: 'martinique', name: 'La Martinique', a: 'en Martinique', tag: 'Martinique (972) · automatisation · logiciel · IA',
  villes: ['Fort-de-France', 'Le Lamentin', 'Schœlcher', 'Le Robert', 'Le François', 'Sainte-Marie'],
  title: 'Automatisation et logiciel sur-mesure en Martinique (972)',
  desc: 'Automatisation et logiciel sur-mesure en Martinique : commerce, tourisme, agroalimentaire, services, exemples concrets, méthode et RGPD. Sur devis.',
  h1: 'Automatisation et logiciel sur-mesure en Martinique',
  lead: 'Escales de croisière, filières rhum et banane, commerce concentré autour de Fort-de-France et du Lamentin, trafic dense : les entreprises martiniquaises ont besoin d’outils qui collent à leur rythme. Voici ce que l’automatisation et le logiciel sur-mesure peuvent concrètement leur apporter.',
  ecoH2: 'Le tissu économique martiniquais et ce qu’il implique',
  eco: `
<p>Depuis 2016, la Martinique est administrée par une collectivité unique, la Collectivité territoriale de Martinique. Son économie est largement tertiaire : <strong>commerce</strong>, <strong>services</strong>, <strong>santé</strong> et <strong>secteur public</strong>. L’activité économique se concentre dans l’axe Fort-de-France – Le Lamentin, où se trouvent le Grand Port Maritime, l’aéroport et de nombreuses zones d’activités.</p>
<p>L’île compte des filières emblématiques : la <strong>banane</strong> et le <strong>rhum agricole</strong>, qui bénéficie d’une appellation d’origine contrôlée « Martinique ». Le <strong>tourisme</strong> combine séjours, croisière et plaisance, avec une saisonnalité marquée. Le tissu d’entreprises est dominé par des TPE et PME.</p>
<p>Les automatisations les plus utiles portent sur la <strong>gestion commerciale</strong> et les approvisionnements, la <strong>relation client</strong> (réservations, questions, suivi) et la <strong>traçabilité</strong> dans l’agroalimentaire.</p>`,
  contH2: 'Les contraintes propres à la Martinique',
  contraintes: `
<ul>
<li><strong>Le décalage horaire</strong> : la Martinique vit à l’heure UTC−4, sans heure d’été, soit cinq heures de retard sur la métropole en hiver et six en été.</li>
<li><strong>Le trafic</strong> sur l’axe Fort-de-France – Le Lamentin et vers le nord et le sud de l’île, qui rend les tournées difficiles à prévoir.</li>
<li><strong>L’insularité</strong> : approvisionnements par voie maritime, octroi de mer, délais à anticiper.</li>
<li><strong>Les pics d’activité</strong> liés aux escales de croisière, aux vacances et aux événements, qui saturent l’accueil téléphonique.</li>
<li><strong>Les aléas climatiques</strong> : saison cyclonique et épisodes de sargasses sur certaines côtes.</li>
</ul>`,
  exIntro: 'Des cas types, adaptés aux réalités martiniquaises :',
  exemples: [
    ['Traçabilité des lots en agroalimentaire', 'Pour les producteurs et transformateurs : suivi des lots de la matière première au produit fini, étiquetage, documents d’expédition et historique consultable en quelques secondes.'],
    ['Réservations d’excursions un jour d’escale', 'Un assistant qui répond aux visiteurs en plusieurs langues, vérifie les disponibilités, confirme la réservation et rappelle l’heure de départ, pour absorber les pics sans saturer l’équipe.'],
    ['Tournées qui tiennent compte du trafic', 'Un planning d’interventions qui regroupe les rendez-vous par secteur, évite les heures de pointe connues et prévient automatiquement le client de l’heure d’arrivée.'],
    ['Click and collect pour le commerce', 'Stock en ligne synchronisé avec la caisse, commandes à retirer préparées, notification au client : le commerce de proximité gagne un canal sans ressaisie.'],
    ['Relances et encaissements automatisés', 'Factures envoyées automatiquement, relances graduées à l’échéance, rapprochement des paiements : la trésorerie se suit sans y passer ses soirées.'],
    ['Veille des marchés publics', 'Une veille des avis publiés au BOAMP et sur les profils d’acheteurs, filtrée selon votre activité, avec préparation des pièces administratives récurrentes.'],
  ],
  callout: 'Automatiser, c’est d’abord libérer du temps pour ce qui ne s’automatise pas : la relation avec vos clients et la qualité de votre travail.',
  logiciel: `
<p>Un logiciel sur-mesure se justifie en Martinique quand votre activité a des règles que les outils nationaux ignorent : traçabilité propre à une filière, prix de revient à l’import, organisation multi-sites, ou combinaison de vente, installation et maintenance. Il se connecte à vos outils existants et se construit par étapes. Voir notre dossier <a href="../services/logiciel-sur-mesure-pme.html">logiciel sur-mesure pour PME</a> pour décider sereinement.</p>`,
  presence: PRESENCE('de la Martinique'),
  horaire: 'Le créneau est choisi dans la plage commune avec la métropole.',
  cadre: CADRE_DROM('La Martinique appliquant la TVA, à des taux qui lui sont propres, les entreprises assujetties y sont en principe concernées par la <strong>facturation électronique</strong> : réception obligatoire depuis le 1<sup>er</sup> septembre 2026, émission pour les PME et microentreprises au 1<sup>er</sup> septembre 2027, via une plateforme agréée. Faites confirmer votre situation par votre expert-comptable ; voir notre article <a href="../lab/veille/facturation-electronique-2026.html">facturation électronique 2026-2027</a>.'),
  idees: [['commerce-boutique', 'le commerce'], ['restaurant', 'la restauration'], ['industrie-pme', 'l’industrie et l’agroalimentaire']],
  placeholder: 'Ex : prestataire d’excursions à Fort-de-France, le téléphone sature les jours d’escale…',
  faq: [
    { q: 'Travaillez-vous avec des entreprises de Martinique ?', a: 'Oui. Nous accompagnons les entreprises de la Martinique comme celles de toute la France. Le premier échange de 10 minutes se fait par téléphone ou en visio.' },
    { q: 'Quelles automatisations pour une entreprise touristique martiniquaise ?', a: 'Un assistant multilingue pour les réservations et les questions, des confirmations et rappels automatiques, la synchronisation des plannings et des disponibilités, et un relais humain pour les demandes particulières.' },
    { q: 'Peut-on automatiser la traçabilité dans l’agroalimentaire ?', a: 'Oui. Un outil sur-mesure peut suivre chaque lot de la matière première au produit fini, générer les étiquettes et les documents d’expédition, et retrouver instantanément l’historique d’un produit.' },
    { q: 'Le décalage horaire complique-t-il le projet ?', a: 'Non. La Martinique a cinq heures de retard sur la métropole en hiver et six en été : les rendez-vous se fixent dans la plage commune, et les automatisations peuvent tirer parti du décalage pour préparer le travail.' },
    { q: 'La facturation électronique s’applique-t-elle en Martinique ?', a: 'En principe oui pour les entreprises assujetties à la TVA : réception obligatoire depuis le 1er septembre 2026 et émission pour les PME et microentreprises au 1er septembre 2027, via une plateforme agréée. Votre expert-comptable peut confirmer votre situation.' },
    { q: 'Combien coûte une automatisation ?', a: 'Chaque projet est sur devis, établi après un appel de 10 minutes, selon les tâches à automatiser, les outils à connecter et le suivi souhaité.' },
  ],
});

/* ═══════════════════════ GUYANE ═══════════════════════ */
TERRITOIRES.push({
  slug: 'guyane', name: 'La Guyane', a: 'en Guyane', tag: 'Guyane (973) · automatisation · logiciel · IA',
  villes: ['Cayenne', 'Kourou', 'Saint-Laurent-du-Maroni', 'Matoury', 'Rémire-Montjoly'],
  title: 'Automatisation et logiciel sur-mesure en Guyane (973)',
  desc: 'Automatisation et logiciel sur-mesure en Guyane : BTP, logistique fluviale, sous-traitance industrielle, hors ligne, exemples, méthode. Sur devis.',
  h1: 'Automatisation et logiciel sur-mesure en Guyane',
  lead: 'Un territoire immense couvert de forêt amazonienne, des communes accessibles seulement par le fleuve ou les airs, une filière spatiale exigeante et une population en forte croissance : en Guyane, les outils doivent fonctionner là où les autres s’arrêtent. Voici ce que l’automatisation et le logiciel sur-mesure peuvent y apporter.',
  ecoH2: 'Le tissu économique guyanais et ce qu’il implique',
  eco: `
<p>La Guyane est la plus vaste région française, largement couverte par la forêt amazonienne, frontalière du Brésil et du Suriname. Elle est administrée depuis 2016 par la Collectivité territoriale de Guyane. La population, jeune, y connaît une croissance démographique parmi les plus fortes de France, ce qui soutient la demande en <strong>logement</strong>, en <strong>équipements</strong> et en <strong>services</strong>.</p>
<p>L’économie s’appuie sur le <strong>secteur public</strong>, le <strong>BTP</strong>, le <strong>commerce</strong> et, singularité guyanaise, la <strong>filière spatiale</strong> autour du Centre spatial guyanais de Kourou, qui fait travailler de nombreux sous-traitants. La pêche, la filière bois et l’agriculture complètent ce tissu.</p>
<p>Les besoins d’automatisation sont donc très concrets : <strong>logistique</strong> vers les communes isolées, <strong>documentation et traçabilité</strong> pour les entreprises qui travaillent avec des donneurs d’ordres exigeants, <strong>gestion de chantiers</strong> et <strong>relation client</strong>.</p>`,
  contH2: 'Les contraintes propres à la Guyane',
  contraintes: `
<ul>
<li><strong>Le décalage horaire</strong> : la Guyane vit à l’heure UTC−3, sans heure d’été, soit quatre heures de retard sur la métropole en hiver et cinq en été.</li>
<li><strong>L’enclavement</strong> : le réseau routier dessert surtout le littoral ; plusieurs communes de l’intérieur ne sont accessibles que par pirogue ou par avion, ce qui complique la logistique et les interventions.</li>
<li><strong>La connectivité inégale</strong> hors du littoral, qui impose des outils capables de fonctionner hors ligne.</li>
<li><strong>Le plurilinguisme</strong> : français, créole guyanais, portugais, langues amérindiennes et bushinengué, notamment. Un accueil en portugais ou en anglais est réaliste avec l’IA actuelle ; pour d’autres langues, un relais humain reste préférable.</li>
<li><strong>Le climat équatorial</strong>, avec ses saisons des pluies qui perturbent les chantiers et les déplacements.</li>
</ul>`,
  exIntro: 'Des cas types, pensés pour les réalités guyanaises :',
  exemples: [
    ['Applications de terrain hors ligne', 'Fiches d’intervention, relevés, inventaires et photos saisis sans réseau, sur le fleuve ou en forêt, puis synchronisés automatiquement au retour sur le littoral.'],
    ['Logistique vers les communes isolées', 'Suivi des commandes, des chargements et des départs par pirogue ou par avion, manifestes préparés automatiquement, clients prévenus de l’arrivée de leur marchandise.'],
    ['Documentation qualité pour la sous-traitance', 'Pour les entreprises qui travaillent avec des donneurs d’ordres exigeants, comme ceux de la filière spatiale : procédures, habilitations, certificats et rapports tenus à jour, avec alertes avant échéance.'],
    ['Suivi de chantier pour le BTP', 'Avancement, photos, matériaux, météo et bons signés remontent du chantier ; situations de travaux et factures sont préparées à partir des données réelles.'],
    ['Accueil client multilingue', 'Un assistant qui répond en français, en portugais ou en anglais aux questions fréquentes et à la prise de rendez-vous, avec transfert vers votre équipe pour les autres langues et les cas particuliers.'],
    ['Veille des marchés publics', 'Une veille automatique des avis publiés au BOAMP et sur les profils d’acheteurs, filtrée selon vos métiers, avec préparation des pièces administratives récurrentes.'],
  ],
  callout: 'En Guyane, un outil qui exige une connexion permanente est un outil qui s’arrête : le fonctionnement hors ligne se décide dès la conception.',
  logiciel: `
<p>Un logiciel sur-mesure se justifie en Guyane lorsque vos opérations sortent du cadre prévu par les outils nationaux : logistique fluviale ou aérienne, équipes sans réseau, exigences documentaires fortes, organisation entre Cayenne, Kourou et Saint-Laurent-du-Maroni. Il se relie à vos outils existants et se construit par étapes. Notre dossier <a href="../services/application-metier-sur-mesure.html">application métier sur-mesure</a> détaille la conception pour le terrain.</p>`,
  presence: PRESENCE('de la Guyane'),
  horaire: 'Le créneau est choisi dans la plage commune avec la métropole.',
  cadre: CADRE_DROM('La <strong>TVA</strong> n’étant pas applicable en Guyane à ce jour, la portée de la réforme de la facturation électronique, liée à la TVA, y diffère de la métropole : faites le point avec votre expert-comptable. Automatiser la production et le suivi de vos factures reste utile dans tous les cas ; voir notre article <a href="../lab/veille/facturation-electronique-2026.html">facturation électronique 2026-2027</a> pour le cadre national.'),
  idees: [['transport-logistique', 'le transport et la logistique'], ['industrie-pme', 'l’industrie'], ['artisan', 'les artisans du bâtiment']],
  placeholder: 'Ex : nous livrons des communes de l’intérieur et suivons les chargements sur un tableur…',
  faq: [
    { q: 'Accompagnez-vous les entreprises de Guyane ?', a: 'Oui. Nous accompagnons les entreprises de la Guyane comme celles de toute la France. Le premier échange de 10 minutes se fait par téléphone ou en visio.' },
    { q: 'Vos applications fonctionnent-elles sans réseau ?', a: 'Oui, lorsque c’est nécessaire : les données sont enregistrées sur l’appareil, sur le fleuve ou en forêt, puis synchronisées automatiquement quand la connexion revient.' },
    { q: 'Pouvez-vous aider les sous-traitants de la filière spatiale ?', a: 'Nous concevons des outils de documentation, de traçabilité et de suivi des habilitations adaptés aux exigences de donneurs d’ordres exigeants. Le périmètre est défini avec vous et avec les règles de votre client.' },
    { q: 'Un assistant IA peut-il répondre en portugais ?', a: 'Oui. Un assistant peut répondre en français, en portugais ou en anglais à partir de vos informations validées. Pour les autres langues parlées en Guyane, un relais humain reste préférable avec les technologies actuelles.' },
    { q: 'La facturation électronique s’applique-t-elle en Guyane ?', a: 'La réforme est liée à la TVA, qui n’est pas applicable en Guyane à ce jour ; sa portée y diffère donc de la métropole. Votre expert-comptable peut confirmer votre situation.' },
    { q: 'Combien coûte un projet ?', a: 'Chaque projet est sur devis, établi après un appel de 10 minutes, selon les tâches à automatiser, les outils à connecter, le fonctionnement hors ligne éventuel et le suivi souhaité.' },
  ],
});

/* ═══════════════════════ NOUVELLE-CALÉDONIE ═══════════════════════ */
TERRITOIRES.push({
  slug: 'nouvelle-caledonie', name: 'La Nouvelle-Calédonie', a: 'en Nouvelle-Calédonie', tag: 'Nouvelle-Calédonie (988) · automatisation · logiciel · IA',
  villes: ['Nouméa', 'Dumbéa', 'Mont-Dore', 'Païta', 'Koné'],
  title: 'Automatisation et logiciel sur-mesure en Nouvelle-Calédonie',
  desc: 'Automatisation et logiciel sur-mesure en Nouvelle-Calédonie : nickel, commerce, services, tourisme, cadre local (TGC, CFP), exemples. Sur devis.',
  h1: 'Automatisation et logiciel sur-mesure en Nouvelle-Calédonie',
  lead: 'Franc Pacifique, TGC, droit du travail local, provinces aux réalités très différentes, dix heures d’écart avec Paris en hiver : les entreprises calédoniennes ont besoin d’outils pensés pour leur cadre, pas de logiciels métropolitains plaqués. Voici ce que l’automatisation et le logiciel sur-mesure peuvent leur apporter.',
  ecoH2: 'Le tissu économique calédonien et ce qu’il implique',
  eco: `
<p>La Nouvelle-Calédonie est une collectivité à statut particulier, organisée en trois provinces : Sud, Nord et Îles Loyauté. Elle dispose de compétences étendues, notamment en matière fiscale et de droit du travail. Sa monnaie est le <strong>franc CFP</strong>, et la taxe sur la consommation y est la <strong>TGC</strong> (taxe générale sur la consommation), et non la TVA.</p>
<p>Le <strong>nickel</strong>, avec ses activités minières et métallurgiques et leurs nombreux sous-traitants, a longtemps structuré l’économie ; la filière traverse une période difficile. Les <strong>services</strong>, le <strong>commerce</strong>, le <strong>BTP</strong>, le <strong>tourisme</strong>, l’aquaculture et le secteur public complètent le tissu, très concentré dans le Grand Nouméa. Les événements de mai 2024 ont durement touché de nombreuses entreprises.</p>
<p>Dans ce contexte, les priorités sont souvent la <strong>maîtrise des coûts</strong>, le <strong>suivi de la trésorerie</strong> et la capacité à faire autant avec des équipes resserrées : exactement ce que permettent des automatisations bien ciblées.</p>`,
  contH2: 'Les contraintes propres à la Nouvelle-Calédonie',
  contraintes: `
<ul>
<li><strong>Le décalage horaire</strong> : la Nouvelle-Calédonie vit à l’heure UTC+11, soit dix heures d’avance sur la métropole en hiver et neuf en été. Les journées de travail ne se recouvrent presque pas.</li>
<li><strong>Un cadre local spécifique</strong> : TGC, franc CFP, droit du travail calédonien, protection sociale gérée par la CAFAT. Les logiciels conçus pour la métropole s’y adaptent mal.</li>
<li><strong>L’éloignement</strong> : approvisionnements par voie maritime sur de longues distances, délais et coûts à anticiper.</li>
<li><strong>Des provinces aux réalités différentes</strong>, entre le Grand Nouméa, la Brousse et les Îles, avec des déplacements longs et une connectivité variable.</li>
<li><strong>Le contexte économique</strong>, qui rend chaque investissement plus exigeant : il doit se justifier par des gains clairs.</li>
</ul>`,
  exIntro: 'Des cas types, adaptés au cadre calédonien :',
  exemples: [
    ['Devis et factures conformes au cadre local', 'Un outil qui applique automatiquement les taux de TGC, travaille en francs CFP, produit des documents aux mentions requises et exporte proprement vers votre comptabilité.'],
    ['Maintenance et habilitations pour les sous-traitants industriels', 'Suivi des équipements, des interventions, des habilitations et des documents de sécurité, avec alertes avant échéance et rapports générés automatiquement pour le donneur d’ordres.'],
    ['Tableau de bord de trésorerie', 'Encaissements attendus, dettes fournisseurs, échéances et prévisions consolidés automatiquement, avec relances clients graduées : une vision claire pour décider vite.'],
    ['Réassort adapté aux délais maritimes', 'Pour le commerce et la distribution : commandes suggérées selon les ventes, les stocks et le délai réel de chaque fournisseur, pour éviter à la fois les ruptures et le surstock.'],
    ['Accueil touristique multilingue', 'Pour les hébergements et les prestataires d’activités : réponses en français et en anglais aux visiteurs de la région Pacifique, confirmations et informations pratiques, avec relais humain.'],
    ['Un back-office asynchrone avec la métropole', 'Les demandes adressées aux fournisseurs métropolitains partent en fin de journée calédonienne ; leurs réponses, reçues pendant la nuit, sont triées et résumées pour le lendemain matin.'],
  ],
  callout: 'Avec neuf à dix heures d’écart, l’asynchrone devient un atout : bien automatisé, le travail avance pendant que chacun dort.',
  logiciel: `
<p>Un logiciel sur-mesure est souvent plus pertinent en Nouvelle-Calédonie qu’ailleurs, précisément parce que les outils standard sont conçus pour la TVA, l’euro et le droit du travail métropolitain. Un outil construit pour le cadre calédonien évite les contournements permanents. Il se relie à vos logiciels existants et se construit par étapes, en commençant par ce qui rapporte ou économise le plus. Voir notre dossier <a href="../services/logiciel-de-gestion-sur-mesure.html">logiciel de gestion sur-mesure</a>.</p>`,
  presence: PRESENCE('de Nouvelle-Calédonie'),
  horaire: 'Compte tenu de l’écart horaire, nous fixons les échanges en début de matinée en métropole, c’est-à-dire en fin de journée à Nouméa.',
  cadre: `
<p>La Nouvelle-Calédonie n’applique pas directement le droit de l’Union européenne : le <strong>RGPD</strong> et le règlement européen sur l’IA ne s’y appliquent pas en tant que tels, et le cadre de protection des données y a ses spécificités. Nous appliquons dans tous les cas les mêmes principes que le RGPD — minimisation, durées de conservation, sous-traitants identifiés, information des personnes, transparence lorsqu’une IA intervient — ce qui protège aussi vos échanges avec des partenaires européens.</p>
<p>La réforme française de la facturation électronique est liée à la TVA, qui ne s’applique pas en Nouvelle-Calédonie : le cadre y est différent. Vos outils doivent en revanche respecter les règles locales de TGC et de facturation ; votre expert-comptable est le bon interlocuteur pour les valider.</p>
<p>Côté sécurité : droits d’accès par rôle, authentification forte, journal des actions, sauvegardes testées et validation humaine pour les actions engageantes.</p>`,
  idees: [['industrie-pme', 'l’industrie'], ['commerce-boutique', 'le commerce'], ['hebergement-gite', 'l’hébergement']],
  placeholder: 'Ex : PME à Nouméa, nos devis et factures en TGC sont faits à la main sur un tableur…',
  faq: [
    { q: 'Accompagnez-vous les entreprises de Nouvelle-Calédonie ?', a: 'Oui. Nous accompagnons les entreprises de Nouvelle-Calédonie comme celles de toute la France. Le premier échange de 10 minutes se fait par téléphone ou en visio, en début de matinée en métropole, soit en fin de journée à Nouméa.' },
    { q: 'Vos outils gèrent-ils la TGC et le franc CFP ?', a: 'Oui. Un outil sur-mesure peut appliquer les taux de TGC, travailler en francs CFP et produire des documents conformes aux règles locales, à valider avec votre expert-comptable.' },
    { q: 'Le RGPD s’applique-t-il en Nouvelle-Calédonie ?', a: 'Le RGPD européen ne s’y applique pas en tant que tel et le cadre de protection des données y a ses spécificités. Nous appliquons néanmoins les mêmes principes de protection dans tous nos projets.' },
    { q: 'Comment travailler avec dix heures de décalage ?', a: 'En tirant parti de l’asynchrone : les échanges en direct se font dans la courte plage commune, et les automatisations préparent le travail pendant la nuit de l’un ou de l’autre. L’écart est de dix heures en hiver et de neuf en été.' },
    { q: 'Que peut-on automatiser pour un sous-traitant de la filière nickel ?', a: 'Le suivi des équipements et des interventions, la gestion des habilitations et des documents de sécurité avec alertes avant échéance, et la production automatique des rapports demandés par le donneur d’ordres.' },
    { q: 'Combien coûte un projet ?', a: 'Chaque projet est sur devis, établi après un appel de 10 minutes, selon les tâches à automatiser, les outils à connecter et le suivi souhaité.' },
  ],
});

/* ═══════════════════════ POLYNÉSIE FRANÇAISE ═══════════════════════ */
TERRITOIRES.push({
  slug: 'polynesie-francaise', name: 'La Polynésie française', a: 'en Polynésie française', tag: 'Polynésie française (987) · automatisation · logiciel · IA',
  villes: ['Papeete', 'Faaa', 'Punaauia', 'Pirae', 'Bora-Bora', 'Moorea-Maiao'],
  title: 'Automatisation et logiciel sur-mesure en Polynésie française',
  desc: 'Automatisation et logiciel sur-mesure en Polynésie française : tourisme, fret inter-îles, perliculture, commerce, cadre local, exemples. Sur devis.',
  h1: 'Automatisation et logiciel sur-mesure en Polynésie française',
  lead: 'Cent dix-huit îles réparties en cinq archipels, un tourisme international, un fret inter-îles rythmé par les goélettes et les avions, onze à douze heures d’écart avec Paris : en Polynésie française, un bon outil doit d’abord composer avec la géographie. Voici ce que l’automatisation et le logiciel sur-mesure peuvent y apporter.',
  ecoH2: 'Le tissu économique polynésien et ce qu’il implique',
  eco: `
<p>La Polynésie française est une collectivité d’outre-mer dotée d’une large autonomie. Elle compte 118 îles réparties en cinq archipels : la Société, les Tuamotu, les Marquises, les Australes et les Gambier. Sa monnaie est le <strong>franc CFP</strong>, et elle dispose de sa propre fiscalité, dont une TVA locale distincte de la TVA française.</p>
<p>Le <strong>tourisme</strong> est l’un des piliers de l’économie, de l’hôtellerie internationale aux pensions de famille. La <strong>perle de culture</strong>, produite notamment aux Tuamotu et aux Gambier, la <strong>pêche</strong> et des productions comme la <strong>vanille</strong> et le coprah complètent un tissu où dominent les <strong>services</strong>, le <strong>commerce</strong> et le secteur public, concentrés à Tahiti.</p>
<p>Pour ces entreprises, l’enjeu est de <strong>coordonner</strong> des flux entre Tahiti et les îles, d’<strong>accueillir</strong> une clientèle internationale et de <strong>tenir l’administratif</strong> avec des équipes réduites.</p>`,
  contH2: 'Les contraintes propres à la Polynésie française',
  contraintes: `
<ul>
<li><strong>Le décalage horaire</strong> : Tahiti vit à l’heure UTC−10, soit onze heures de retard sur la métropole en hiver et douze en été (les Marquises et les Gambier ont leur propre fuseau).</li>
<li><strong>La dispersion géographique</strong> : le fret et les déplacements entre les îles dépendent des goélettes et des vols inter-îles, avec des fréquences variables selon les archipels.</li>
<li><strong>Une connectivité inégale</strong> selon les îles, qui peut imposer des outils capables de fonctionner hors ligne.</li>
<li><strong>Un cadre local spécifique</strong> : TVA polynésienne, franc CFP, protection sociale gérée par la CPS, réglementations propres au Pays.</li>
<li><strong>La saisonnalité touristique</strong> et une clientèle venue de nombreux pays, qui s’exprime dans plusieurs langues.</li>
</ul>`,
  exIntro: 'Des cas types, pensés pour la géographie polynésienne :',
  exemples: [
    ['Réservations et transferts coordonnés', 'Pour les hôtels et les pensions de famille : un assistant répond en français et en anglais, confirme la réservation et coordonne les informations de transfert selon les horaires des vols et des navettes maritimes.'],
    ['Suivi du fret inter-îles', 'Commandes des clients des îles, préparation, départs des goélettes ou des vols, manifestes et notifications d’arrivée suivis automatiquement, sans tableau blanc ni appels à répétition.'],
    ['Traçabilité des lots pour les filières d’export', 'Pour la perliculture ou d’autres productions : suivi des lots, classement, documents d’expédition et historique, dans un outil adapté à votre filière.'],
    ['Applications hors ligne dans les îles', 'Inventaires, interventions et relevés saisis sans réseau dans les îles éloignées, puis synchronisés automatiquement à la reconnexion.'],
    ['Devis et factures conformes au cadre local', 'Documents en francs CFP avec la TVA polynésienne appliquée automatiquement, relances graduées et export vers la comptabilité.'],
    ['Un back-office qui profite du décalage', 'Les demandes adressées aux fournisseurs métropolitains partent en fin de journée tahitienne ; les réponses, reçues pendant la nuit, sont triées et résumées pour le matin.'],
  ],
  callout: 'Entre Tahiti et les îles, chaque information qui circule seule, sans appel ni ressaisie, fait gagner du temps à tout le monde.',
  logiciel: `
<p>Un logiciel sur-mesure est souvent pertinent en Polynésie française, parce que les outils standard sont pensés pour la TVA française, l’euro et une logistique continentale. Un outil conçu pour le fret inter-îles, le franc CFP et la fiscalité locale évite les bricolages permanents. Il se relie à vos logiciels existants et se construit par étapes. Voir notre dossier <a href="../services/logiciel-sur-mesure-pme.html">logiciel sur-mesure pour PME</a>.</p>`,
  presence: PRESENCE('de Polynésie française'),
  horaire: 'Compte tenu de l’écart horaire, nous fixons les échanges en fin de journée en métropole, c’est-à-dire en matinée à Tahiti.',
  cadre: `
<p>La Polynésie française n’applique pas directement le droit de l’Union européenne : le <strong>RGPD</strong> et le règlement européen sur l’IA ne s’y appliquent pas en tant que tels, et le cadre de protection des données y a ses spécificités. Nous appliquons néanmoins les mêmes principes de protection — minimisation, durées de conservation, sous-traitants identifiés, information des personnes, transparence lorsqu’une IA intervient — ce qui rassure aussi vos clients européens.</p>
<p>La réforme française de la facturation électronique est liée à la TVA française, qui ne s’applique pas en Polynésie française, dotée de sa propre fiscalité : le cadre y est différent. Vos outils doivent respecter les règles locales ; votre expert-comptable est le bon interlocuteur pour les valider.</p>
<p>Côté sécurité : droits d’accès par rôle, authentification forte, journal des actions, sauvegardes testées et validation humaine pour les actions engageantes.</p>`,
  idees: [['hebergement-gite', 'l’hébergement'], ['transport-logistique', 'le transport et la logistique'], ['restaurant', 'la restauration']],
  placeholder: 'Ex : pension de famille à Moorea, nous gérons réservations et transferts par messages, à la main…',
  faq: [
    { q: 'Accompagnez-vous les entreprises de Polynésie française ?', a: 'Oui. Nous accompagnons les entreprises de Polynésie française comme celles de toute la France. Le premier échange de 10 minutes se fait par téléphone ou en visio, en matinée à Tahiti, soit en fin de journée en métropole.' },
    { q: 'Vos outils gèrent-ils le franc CFP et la TVA polynésienne ?', a: 'Oui. Un outil sur-mesure peut travailler en francs CFP, appliquer la fiscalité locale et produire des documents conformes, à valider avec votre expert-comptable.' },
    { q: 'Peut-on automatiser le suivi du fret vers les îles ?', a: 'Oui. Commandes, préparation, départs des goélettes ou des vols, manifestes et notifications d’arrivée peuvent être suivis automatiquement dans un outil adapté à votre organisation.' },
    { q: 'Comment travailler avec onze ou douze heures de décalage ?', a: 'En organisant les échanges en direct dans la plage commune et en laissant les automatisations préparer le travail pendant la nuit de l’un ou de l’autre. Tahiti a onze heures de retard sur la métropole en hiver et douze en été.' },
    { q: 'Le RGPD s’applique-t-il en Polynésie française ?', a: 'Le RGPD européen ne s’y applique pas en tant que tel et le cadre de protection des données y a ses spécificités. Nous appliquons néanmoins les mêmes principes de protection dans tous nos projets.' },
    { q: 'Combien coûte un projet ?', a: 'Chaque projet est sur devis, établi après un appel de 10 minutes, selon les tâches à automatiser, les outils à connecter, le fonctionnement hors ligne éventuel et le suivi souhaité.' },
  ],
});
