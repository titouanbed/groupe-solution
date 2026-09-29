/* ═══════════════════════════════════════════════════════════
   CATALOGUE D'AUTOMATISATIONS AVANCÉES — ce qu'il est possible de construire
   aujourd'hui (IA, agents, vision, prévision, open data, standards récents).
   Formulé comme des CAPACITÉS (« on peut construire »), jamais comme des
   résultats chiffrés ou des références clients.

   Chaque entrée : id, titre, texte, tags (secteurs concernés), tech (briques),
   ex(c) → phrase d'exemple contextualisée à une commune / un métier.
   Tags : all, resto, tourisme, viti, mer, agri, btp, b2b, sante, cabinet,
          commerce, immo, formation, services, asso
   ═══════════════════════════════════════════════════════════ */
const first = c => (c.tissu || '').split(',')[0].trim();

export const AVANCEES = [
  { id: 'agent-vocal', titre: 'Agent vocal IA au téléphone', tags: ['all', 'resto', 'sante', 'services', 'tourisme', 'btp', 'commerce'],
    tech: 'Voix temps réel · compréhension du langage · agenda connecté',
    texte: "Il décroche à toute heure, comprend la demande en langage naturel, répond à partir de vos informations vérifiées, prend le rendez-vous dans votre agenda, transfère les urgences à un humain et vous envoie le résumé de chaque appel.",
    ex: c => `Plus aucun appel manqué quand vous êtes en intervention, en service ou en rendez-vous.` },
  { id: 'conciergerie', titre: 'Conciergerie IA multilingue', tags: ['tourisme', 'resto', 'immo', 'commerce'],
    tech: 'Modèles de langage · base de connaissances · WhatsApp / site / e-mail',
    texte: "Un assistant qui répond aux clients dans leur langue, sur le site, par e-mail ou messagerie, en s'appuyant uniquement sur vos informations validées — et qui passe la main à votre équipe dès que la demande sort du cadre.",
    ex: c => `Idéal face à une clientèle de passage autour de ${c.reperes?.[0] || c.name}.` },
  { id: 'rag', titre: 'Assistant branché sur vos documents (RAG)', tags: ['cabinet', 'sante', 'b2b', 'formation', 'immo', 'all'],
    tech: 'Recherche vectorielle · citations des sources · hébergement européen',
    texte: "Votre équipe pose ses questions en langage naturel ; l'assistant répond en citant la procédure, le contrat ou la fiche technique d'où vient la réponse. Les droits d'accès de chacun sont respectés.",
    ex: c => `La mémoire de l'entreprise devient interrogeable en une phrase, même pour un nouvel arrivant.` },
  { id: 'idp', titre: 'Lecture intelligente de documents', tags: ['b2b', 'cabinet', 'immo', 'btp', 'formation', 'all'],
    tech: 'Modèles vision-langage · extraction structurée · contrôle humain',
    texte: "Factures, bons de commande, bons de livraison, pièces justificatives, documents manuscrits ou photographiés : les informations sont extraites, contrôlées et injectées dans vos logiciels, avec validation humaine sur les cas douteux.",
    ex: c => `Fini la ressaisie ligne à ligne des documents reçus chaque jour.` },
  { id: 'computer-use', titre: 'Agents qui utilisent vos logiciels à votre place', tags: ['b2b', 'cabinet', 'formation', 'immo', 'all'],
    tech: 'Agents IA « computer use » · supervision · journal d’actions',
    texte: "Quand un portail fournisseur, une plateforme administrative ou un vieux logiciel n'a pas d'API, un agent peut piloter l'interface comme un humain : se connecter, remplir, télécharger, vérifier — sous supervision, avec un journal de chaque action.",
    ex: c => `Les allers-retours sur les portails deviennent une tâche de fond.` },
  { id: 'mcp', titre: 'Vos outils connectés à l’IA via MCP', tags: ['all', 'b2b', 'cabinet'],
    tech: 'Model Context Protocol (standard ouvert) · connecteurs · droits d’accès',
    texte: "Le Model Context Protocol permet de brancher proprement votre CRM, votre agenda, vos fichiers ou votre ERP sur un assistant IA, qui peut alors consulter et agir dans vos outils avec des droits que vous définissez.",
    ex: c => `« Prépare-moi le point client de demain » devient une vraie commande, pas une recherche de vingt minutes.` },
  { id: 'prevision', titre: 'Prévision de la demande', tags: ['resto', 'tourisme', 'commerce', 'mer', 'agri', 'viti'],
    tech: 'Apprentissage automatique · météo · calendriers · historique',
    texte: "Un modèle croise votre historique de ventes, la météo, les vacances scolaires, les jours fériés et les événements locaux pour anticiper la fréquentation, les commandes et le personnel nécessaire.",
    ex: c => `Utile là où l'activité varie avec la saison et la météo, comme ${aOr(c)}.` },
  { id: 'meteo', titre: 'Décisions pilotées par la météo', tags: ['tourisme', 'agri', 'viti', 'btp', 'mer'],
    tech: 'API météo et marines · règles métier · notifications',
    texte: "Les prévisions météo (et marines sur le littoral) déclenchent automatiquement les bonnes actions : proposer un report aux clients, alerter une équipe, adapter une commande ou un planning.",
    ex: c => `Pensé pour des activités exposées au vent, à la pluie ou à la chaleur.` },
  { id: 'vision', titre: 'Contrôle par vision artificielle', tags: ['btp', 'agri', 'viti', 'b2b', 'mer', 'commerce'],
    tech: 'Vision par ordinateur · photos terrain · détection et comptage',
    texte: "Des photos de chantier, de produits ou de récoltes analysées automatiquement : détection de défauts, vérification de conformité, comptage, comparaison avant / après, rapport généré.",
    ex: c => `Chaque photo prise sur le terrain devient une donnée exploitable.` },
  { id: 'tournees', titre: 'Optimisation mathématique des tournées', tags: ['b2b', 'services', 'btp', 'agri', 'mer'],
    tech: 'Solveurs de tournées · créneaux · replanification en temps réel',
    texte: "Des algorithmes d'optimisation calculent l'ordre des passages en tenant compte des créneaux clients, des capacités des véhicules et des imprévus, et replanifient en cours de journée.",
    ex: c => `Moins de kilomètres entre ${c.name} et les communes voisines, plus de rendez-vous tenus.` },
  { id: 'anomalies', titre: 'Détection d’anomalies et de fraude', tags: ['b2b', 'cabinet', 'commerce', 'immo'],
    tech: 'Modèles statistiques · règles · alertes',
    texte: "Écarts entre commandes, livraisons et factures, doublons, dérives de marge, changements de RIB suspects : détectés automatiquement, avec une alerte expliquée plutôt qu'un contrôle manuel exhaustif.",
    ex: c => `Les contrôles se concentrent là où il y a vraiment un problème.` },
  { id: 'iot', titre: 'Capteurs connectés et maintenance prédictive', tags: ['resto', 'mer', 'viti', 'agri', 'b2b', 'commerce'],
    tech: 'Capteurs (température, niveau, vibrations) · seuils · modèles prédictifs',
    texte: "Chambres froides, cuves, pompes, machines : des capteurs remontent les mesures en continu, l'outil alerte avant la panne ou la rupture de la chaîne du froid et garde l'historique pour les contrôles.",
    ex: c => `Une alerte sur le téléphone plutôt qu'une mauvaise surprise le lundi matin.` },
  { id: 'matching', titre: 'Matching sémantique expliqué', tags: ['immo', 'formation', 'b2b'],
    tech: 'Représentations sémantiques · explicabilité — notre socle Solution Alternance / Recrutement',
    texte: "Rapprocher des offres et des demandes sur le sens et non sur des mots-clés, et expliquer chaque correspondance : c'est le moteur de nos plateformes, applicable à des biens, des profils, des produits ou des prestataires.",
    ex: c => `La même technologie que nos plateformes nationales, appliquée à votre fichier.` },
  { id: 'transcription', titre: 'Réunions et rendez-vous transcrits et structurés', tags: ['cabinet', 'sante', 'b2b', 'immo', 'formation'],
    tech: 'Reconnaissance vocale · résumé · mise à jour automatique des dossiers',
    texte: "Avec l'accord des participants, l'échange est transcrit, résumé, les actions à mener sont extraites et le dossier client ou le CRM est mis à jour automatiquement.",
    ex: c => `Plus de soirées à rédiger des comptes rendus.` },
  { id: 'facturx', titre: 'Facturation électronique 2026-2027, prête et automatisée', tags: ['all', 'b2b', 'cabinet', 'commerce', 'btp'],
    tech: 'Formats Factur-X / UBL / CII · plateforme agréée · rapprochement automatique',
    texte: "La réforme impose de recevoir les factures au format électronique depuis septembre 2026, puis de les émettre (selon la taille de l'entreprise). On peut en profiter pour automatiser tout le cycle : réception, contrôle, rapprochement avec commandes et paiements.",
    ex: c => `Une contrainte réglementaire transformée en gain de temps.` },
  { id: 'opendata', titre: 'Données enrichies par l’open data public', tags: ['immo', 'b2b', 'cabinet', 'btp', 'all'],
    tech: 'API Recherche d’entreprises (SIRENE) · Base Adresse Nationale · DVF · Géorisques',
    texte: "Fiches clients, prospects ou biens complétées et vérifiées automatiquement à partir des bases publiques ouvertes : identité légale d'une entreprise, adresse normalisée, transactions immobilières, risques naturels.",
    ex: c => `Des données fiables, gratuites et à jour, sans ressaisie.` },
  { id: 'pricing', titre: 'Tarification dynamique encadrée', tags: ['tourisme', 'commerce', 'resto'],
    tech: 'Prévision · taux de remplissage · bornes fixées par vous',
    texte: "Offres et tarifs ajustés selon la demande, la saison, la météo ou le taux de remplissage — toujours dans des bornes que vous fixez, avec un journal de chaque changement.",
    ex: c => `Remplir les creux sans brader les pics.` },
  { id: 'contenus', titre: 'Contenus multimodaux générés sous contrôle', tags: ['commerce', 'tourisme', 'viti', 'immo', 'formation'],
    tech: 'Modèles génératifs texte / image · validation humaine',
    texte: "Fiches produits, descriptions de biens, traductions, publications et visuels produits à partir de vos données, dans votre ton, et validés par vous avant diffusion.",
    ex: c => `Une présence en ligne tenue à jour sans y passer ses soirées.` },
  { id: 'multi-agents', titre: 'Équipes d’agents IA orchestrés', tags: ['cabinet', 'b2b', 'immo', 'formation'],
    tech: 'Orchestration multi-agents · protocoles inter-agents · validation humaine',
    texte: "Plusieurs agents spécialisés — tri, recherche, rédaction, vérification — coopèrent sur un dossier complet ; un humain valide aux étapes clés. C'est l'architecture la plus récente pour traiter des processus longs.",
    ex: c => `Un dossier complet préparé de bout en bout, prêt à être validé.` },
  { id: 'tracabilite', titre: 'Traçabilité de bout en bout', tags: ['mer', 'viti', 'agri', 'commerce'],
    tech: 'Identifiants de lots · QR codes · historique horodaté',
    texte: "Lots, origines, dates et températures suivis du producteur au client, consultables par QR code et exportables en cas de contrôle.",
    ex: c => `Un gage de confiance pour les produits de ${c.name}.` },
  { id: 'jumeau', titre: 'Jumeau numérique de votre activité', tags: ['b2b', 'tourisme', 'sante', 'services'],
    tech: 'Simulation · données de planning et de capacité',
    texte: "Un modèle de votre activité (capacités, plannings, flux) pour simuler une embauche, un nouveau créneau, une hausse d'activité ou une saison avant de décider.",
    ex: c => `Décider sur une simulation plutôt qu'à l'intuition.` },
  { id: 'copilote-terrain', titre: 'Copilote vocal pour le terrain', tags: ['btp', 'services', 'agri', 'viti', 'mer'],
    tech: 'Dictée · compréhension du langage · mises à jour automatiques',
    texte: "Sur un chantier, dans les vignes ou en tournée, vous dictez : l'IA remplit le rapport, commande le matériel, met à jour le planning et prévient le client.",
    ex: c => `Les mains restent sur le travail, la paperasse se fait toute seule.` },
  { id: 'veille', titre: 'Veille automatisée et résumée', tags: ['b2b', 'cabinet', 'sante', 'formation', 'btp'],
    tech: 'Collecte automatique · filtrage par pertinence · synthèse',
    texte: "Marchés publics, évolutions réglementaires, concurrents, publications : collectés, filtrés selon vos critères et résumés chaque semaine.",
    ex: c => `Ne plus rater l'appel d'offres ou la nouvelle règle qui vous concerne.` },
  { id: 'personnalisation', titre: 'Parcours client personnalisé', tags: ['commerce', 'tourisme', 'immo', 'formation'],
    tech: 'Recommandation sémantique · segmentation · e-mails dynamiques',
    texte: "Site et messages qui s'adaptent au profil et au comportement de chaque visiteur : recommandations pertinentes, relances au bon moment, contenu qui parle à chacun.",
    ex: c => `Chaque client voit ce qui l'intéresse vraiment.` }
];
function aOr(c) { return c.aname || (c.name ? 'à ' + c.name : 'chez vous'); }

/* Déduction des tags à partir du tissu économique / profil. */
const KEYS = [
  [/restaur|bar|traiteur|table/i, 'resto'], [/touris|hébergement|gîte|camping|location|hôtel|loisir|nature|nautique|plage|visite|oenotour|randonn|canoë/i, 'tourisme'],
  [/vign|viti|domaine|cave|muscat|picpoul/i, 'viti'], [/conchyl|huître|coquillage|pêche|mareyage|port|nautisme|plaisance/i, 'mer'],
  [/agric|maraîch|producteur|exploitation|manade|olive/i, 'agri'], [/bâtiment|artisan|maçon|rénovation|pierre|bâti/i, 'btp'],
  [/PME|B2B|logisti|négoce|industri|transport|distribution|zone/i, 'b2b'], [/santé|médic|soign|clinique|paramédical|kiné|pharm|thermal|curiste/i, 'sante'],
  [/cabinet|libéral|conseil|avocat|expert|consultant/i, 'cabinet'], [/commerce|boutique|magasin|marché/i, 'commerce'],
  [/immobili/i, 'immo'], [/formation|école|étudiant/i, 'formation'], [/service|domicile/i, 'services'], [/association/i, 'asso']
];
export function tagsFor(text) {
  const t = new Set();
  KEYS.forEach(([re, tag]) => { if (re.test(text)) t.add(tag); });
  return t;
}

/* Sélection déterministe de n automatisations pertinentes (variées d'une page à l'autre). */
export function pickAvancees(seed, text, n = 4) {
  const tags = tagsFor(text);
  let h = 0; for (const ch of seed) h = (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0;
  const scored = AVANCEES.map((a, i) => {
    const hits = a.tags.filter(t => tags.has(t)).length;
    const jitter = ((Math.imul(h ^ (i * 2654435761), 1103515245) >>> 0) % 1000) / 1000;
    return { a, s: hits * 2 + (a.tags.includes('all') ? 0.6 : 0) + jitter * 1.5 };
  }).sort((x, y) => y.s - x.s);
  return scored.slice(0, n).map(x => x.a);
}
