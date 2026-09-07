/* ═══════════════════════════════════════════════════════════
   REGISTRE CENTRAL DES ZONES — source de vérité unique.
   Consommé par : generate-cities.mjs (pages villes) et
   generate-implantations.mjs (page « Nos Implantations » du holding).

   Ajouter un territoire = une entrée ici, puis relancer les deux scripts.
   status: 'online'  → pages générées + cartes cliquables
           'coming'  → carte « en préparation » sur Implantations, pas de pages
   ═══════════════════════════════════════════════════════════ */

export const HOLDING = 'https://www.groupsolution.fr';

export const ZONES = [
  /* ───────────────────────── LA RÉUNION (974) ───────────────────────── */
  {
    slug: 'reunion', name: 'La Réunion', code: '974', status: 'online',
    regionPage: 'site-internet-reunion.html',
    fauna: ['paille-en-queue.jpg', 'gecko-vert.jpg', 'baleine.jpg'],
    implantTagline: "Notre agence digitale pour toute l'île de La Réunion : création de sites, SEO local, réseaux sociaux et automatisation, déclinée ville par ville pour coller à chaque bassin.",
    cities: [
      {
        slug: 'saint-denis', name: 'Saint-Denis', gentile: 'dionysiennes', hero: 'hero-1.jpg',
        title: 'Agence Web & Création de Site Internet à Saint-Denis (974) | GroupSolution',
        desc: "Agence web à Saint-Denis de La Réunion : création de sites internet, référencement local (SEO), réseaux sociaux et publicité pour les entreprises du chef-lieu. Audit gratuit.",
        keywords: 'agence web Saint-Denis, création site internet Saint-Denis 974, SEO Saint-Denis Réunion, community management Saint-Denis, agence communication chef-lieu',
        badge: 'Votre agence digitale au chef-lieu (Saint-Denis · 974)',
        h1suffix: 'à Saint-Denis',
        heroSub: "Chef-lieu et cœur administratif de La Réunion, Saint-Denis concentre commerces, services et sièges d'entreprise. On donne à votre activité dionysienne la visibilité qu'elle mérite en ligne.",
        auditIntro: "En 15 minutes, on analyse la présence en ligne de votre commerce ou société à Saint-Denis — du Barachois à Sainte-Clotilde. Recommandations directes, sans blabla.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les entreprises dionysiennes</span>",
        servicesIntro: "Du Chaudron au centre-ville, les entreprises du Nord se battent pour la visibilité. On couvre l'intégralité de vos besoins web, sans jongler entre plusieurs prestataires.",
        aboutP: "Du commerce de proximité de Sainte-Clotilde au cabinet du centre de Saint-Denis, je conçois des outils d'acquisition adaptés à la réalité du chef-lieu.",
        zones: 'Le Barachois, Sainte-Clotilde, Le Chaudron, La Montagne, Bois-de-Nèfles, Saint-François',
        areaServed: ['Saint-Denis', 'Sainte-Clotilde', 'La Montagne', 'Sainte-Marie'],
        faq: [
          { q: "Créez-vous des sites pour les commerces du centre-ville de Saint-Denis ?", a: "Oui, c'est même notre cœur de cible : commerces du Barachois, cabinets, artisans et TPE du chef-lieu. On crée des sites vitrines ou e-commerce pensés pour capter la clientèle du Nord." },
          { q: "Combien coûte un site internet à Saint-Denis ?", a: "Nos sites vitrines professionnels démarrent à 250€. Pour de l'e-commerce ou des fonctionnalités sur-mesure, on établit un devis transparent après un court échange." },
          { q: "Pouvez-vous me positionner sur Google pour « à Saint-Denis 974 » ?", a: "Oui. Le référencement local est notre spécialité : fiche Google Business, mots-clés géolocalisés et contenus optimisés pour apparaître quand un Dionysien cherche votre service." },
          { q: "Gérez-vous aussi les réseaux sociaux des entreprises dionysiennes ?", a: "Tout à fait. Facebook, Instagram et WhatsApp sont rois à Saint-Denis. On crée vos visuels, on rédige vos posts et on pilote vos campagnes publicitaires ciblées sur le Nord." }
        ]
      },
      {
        slug: 'saint-pierre', name: 'Saint-Pierre', gentile: 'saint-pierroises', hero: 'hero-2.jpg',
        title: 'Agence Web & Création de Site Internet à Saint-Pierre (974) | GroupSolution',
        desc: "Agence web à Saint-Pierre, capitale du Sud de La Réunion : création de sites, e-commerce, SEO local, réseaux sociaux et publicité pour les entreprises du bassin sud. Audit gratuit.",
        keywords: 'agence web Saint-Pierre, création site internet Saint-Pierre 974, SEO Sud Réunion, e-commerce Saint-Pierre, community management Terre-Sainte',
        badge: 'Votre agence digitale dans le Sud (Saint-Pierre · 974)',
        h1suffix: 'à Saint-Pierre',
        heroSub: "Capitale du Sud, Saint-Pierre est une ville commerçante, étudiante et festive. On aide les entreprises du bassin sud à transformer cette énergie en clients, en ligne.",
        auditIntro: "En 15 minutes, on passe au crible la présence web de votre activité, du centre de Saint-Pierre à Terre-Sainte. Un premier repère clair, sans engagement.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les entreprises du Sud</span>",
        servicesIntro: "Restaurants, boutiques, prestataires du Sud : la concurrence est vive à Saint-Pierre. On centralise site, réseaux et publicité pour vous démarquer sur tout le bassin.",
        aboutP: "Du restaurant de Terre-Sainte à la boutique du centre de Saint-Pierre, je construis des machines d'acquisition taillées pour le dynamisme commercial du Sud.",
        zones: 'Terre-Sainte, Ravine des Cabris, Bois d’Olive, la Ligne des Bambous, Grand Bois',
        areaServed: ['Saint-Pierre', 'Le Tampon', 'Saint-Louis', 'Petite-Île'],
        faq: [
          { q: "Travaillez-vous avec les restaurants et boutiques de Saint-Pierre ?", a: "Oui, une grande partie de nos clients du Sud sont des commerces, restaurants et prestataires de services. On sait ce qui fait venir la clientèle locale et touristique à Saint-Pierre." },
          { q: "Quel budget pour un site e-commerce à Saint-Pierre ?", a: "Une vitrine démarre à 250€. Pour vendre en ligne (boutique, paiement, livraison sur le Sud), on chiffre selon votre catalogue et vos besoins — devis clair et sans surprise." },
          { q: "Faites-vous de la publicité Facebook/Instagram ciblée sur le bassin sud ?", a: "Oui. On paramètre des campagnes géociblées (Saint-Pierre, Le Tampon, Saint-Louis…) pour toucher précisément les clients potentiels autour de votre établissement." },
          { q: "Peut-on se rencontrer sur place dans le Sud ?", a: "L'échange se fait par visio ou téléphone pour aller vite, mais on reste très disponibles pour les entreprises du Sud. On commence par un audit gratuit de 15 minutes." }
        ]
      },
      {
        slug: 'saint-paul', name: 'Saint-Paul', gentile: 'saint-pauloises', hero: 'hero-3.jpg',
        title: 'Agence Web & Création de Site Internet à Saint-Paul (974) | GroupSolution',
        desc: "Agence web à Saint-Paul dans l'Ouest de La Réunion : sites internet, réservation en ligne, SEO local et réseaux sociaux pour le tourisme, la restauration et les commerces balnéaires. Audit gratuit.",
        keywords: 'agence web Saint-Paul, création site internet Saint-Gilles 974, SEO Ouest Réunion, site réservation tourisme Réunion, community management l’Hermitage',
        badge: 'Votre agence digitale dans l’Ouest (Saint-Paul · 974)',
        h1suffix: 'à Saint-Paul',
        heroSub: "Plus vaste commune de l'île, Saint-Paul et sa côte ouest (Saint-Gilles, l'Hermitage, Boucan Canot) vivent au rythme du tourisme et du balnéaire. On rend votre établissement visible avant que le visiteur n'arrive.",
        auditIntro: "En 15 minutes, on analyse comment votre activité de l'Ouest apparaît en ligne — sur Google, les réseaux et les plateformes que consultent les touristes. Recommandations concrètes.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour l’Ouest et son tourisme</span>",
        servicesIntro: "Loueurs, restaurants de bord de mer, activités nautiques, hébergements : dans l'Ouest, on vous trouve d'abord en ligne. Site, réservation, avis et publicité, on gère tout.",
        aboutP: "De la table de Saint-Gilles au loueur d'activités de l'Hermitage, je conçois des sites qui captent le visiteur au bon moment — avant même qu'il pose ses valises.",
        zones: 'Saint-Gilles-les-Bains, l’Hermitage, Boucan Canot, Plateau Caillou, Le Guillaume, Le Port voisin',
        areaServed: ['Saint-Paul', 'Saint-Gilles-les-Bains', 'La Possession', 'Trois-Bassins'],
        faq: [
          { q: "Créez-vous des sites pour les acteurs du tourisme de l'Ouest (Saint-Gilles, l'Hermitage) ?", a: "Absolument. Hébergements, restaurants de plage, loueurs et activités nautiques : on crée des sites qui donnent envie et rassurent le visiteur avant sa venue à Saint-Paul." },
          { q: "Un site de réservation en ligne pour mon activité balnéaire, c'est possible ?", a: "Oui : réservation de tables, de créneaux d'activités ou d'hébergement, avec confirmation automatique. On automatise aussi les relances pour limiter les no-shows." },
          { q: "Comment être visible auprès des touristes qui cherchent une activité à Saint-Paul ?", a: "Par le référencement local et une fiche Google soignée : quand un visiteur tape « quoi faire à Saint-Gilles » ou « restaurant l'Hermitage », votre établissement doit sortir en premier." },
          { q: "Gérez-vous les avis Google et la e-réputation de mon établissement ?", a: "Oui. Dans le tourisme, l'avis fait la réservation. On met en place la collecte d'avis, le suivi et les réponses pour soigner votre image sur tout l'Ouest." }
        ]
      },
      {
        slug: 'le-port', name: 'Le Port', gentile: 'portoises', hero: 'hero-1.jpg',
        title: 'Agence Web & Création de Site Internet au Port (974) | GroupSolution',
        desc: "Agence web au Port de La Réunion : sites vitrines B2B, SEO, automatisation des devis et réseaux sociaux pour les entreprises industrielles, logistiques et artisanales du pôle portuaire. Audit gratuit.",
        keywords: 'agence web Le Port Réunion, création site internet Le Port 974, site B2B industrie Réunion, automatisation devis, SEO zone Arsenal',
        badge: 'Votre agence digitale au pôle portuaire (Le Port · 974)',
        h1suffix: 'au Port',
        heroSub: "Seul port en eau profonde de l'île, Le Port est le poumon industriel et logistique de La Réunion. On outille les entreprises B2B de la zone pour gagner des clients et du temps.",
        auditIntro: "En 15 minutes, on évalue la présence en ligne de votre société — industrie, logistique, BTP ou artisanat de la zone Arsenal et de la ZI du Port. Diagnostic direct.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les pros du Port</span>",
        servicesIntro: "Ici, moins de vitrine grand public, plus de B2B : un site crédible, un référencement pro et surtout de l'automatisation pour ne plus perdre de temps sur les devis et relances.",
        aboutP: "De la PME industrielle de la ZI à l'artisan du Port, je développe des sites B2B solides et des automatisations qui font gagner des heures sur la gestion.",
        zones: 'Zone Arsenal, ZI du Port, Rivière des Galets, Cambaie voisin, la Possession',
        areaServed: ['Le Port', 'La Possession', 'Saint-Paul'],
        faq: [
          { q: "Accompagnez-vous les entreprises industrielles et logistiques du Port ?", a: "Oui, c'est une spécificité de la zone : PME industrielles, transport, BTP, import-export. On crée des sites B2B crédibles et des outils qui appuient votre force commerciale." },
          { q: "Pouvez-vous créer un site vitrine B2B pour ma société de la zone Arsenal ?", a: "Bien sûr. Un site clair qui présente vos activités, vos références et vos certifications, pensé pour rassurer un donneur d'ordre — à partir de 250€ pour une vitrine." },
          { q: "Automatisez-vous les demandes de devis et les relances clients ?", a: "C'est notre valeur ajoutée : formulaires de devis intelligents, accusés automatiques, relances programmées et suivi. Vos équipes se concentrent sur le métier, pas sur l'administratif." },
          { q: "Faites-vous du référencement pour être trouvé par les professionnels de l'Ouest ?", a: "Oui. On optimise votre visibilité sur les recherches B2B locales (« fournisseur », « prestataire » + votre secteur au Port ou dans l'Ouest) pour capter des demandes qualifiées." }
        ]
      }
    ]
  },

  /* ───────────────────────── MAYOTTE (976) ───────────────────────── */
  {
    slug: 'mayotte', name: 'Mayotte', code: '976', status: 'online',
    regionPage: 'site-internet-mayotte.html',
    implantTagline: "Le guichet unique du numérique à Mayotte : sites internet, community management, publicité locale et transition numérique pour les TPE et PME mahoraises.",
    cities: [],
    implantChips: [
      { label: 'Mamoudzou', href: 'mayotte/site-internet-mayotte.html' },
      { label: 'Catalogue de démos', href: 'mayotte/catalogue-demos.html' }
    ]
  },

  /* ───────────────────────── LA GUYANE (973) ───────────────────────── */
  {
    slug: 'guyane', name: 'La Guyane', code: '973', status: 'online',
    regionPage: 'site-internet-guyane.html',
    fauna: ['ara.jpg', 'paresseux.jpg', 'jaguar.jpg'],
    implantTagline: "L'agence digitale de Groupe Solution en Guyane : sites internet, référencement local, réseaux sociaux et automatisation pour les entreprises de Cayenne, Kourou et l'Ouest guyanais.",
    region: {
      pageFile: 'site-internet-guyane.html', slug: 'guyane', name: 'La Guyane', gentile: 'guyanaises', hero: 'hero-1.jpg',
      title: 'Agence Web & Digitale en Guyane (973) | GroupSolution',
      desc: "Agence web en Guyane : création de sites internet, référencement local (SEO), réseaux sociaux et automatisation pour les entreprises de Cayenne, Kourou, Saint-Laurent-du-Maroni et Matoury. Audit gratuit.",
      keywords: 'agence web Guyane, création site internet Guyane 973, SEO Cayenne, community management Guyane, automatisation entreprise Guyane',
      badge: 'Votre agence digitale en Guyane (973)',
      h1suffix: 'en Guyane',
      heroSub: "De la forêt amazonienne au littoral, la Guyane est un territoire jeune et en pleine croissance. On donne aux entreprises guyanaises les outils numériques pour capter cette dynamique.",
      auditIntro: "En 15 minutes, on analyse la présence en ligne de votre entreprise en Guyane — de Cayenne à l'Ouest. Des recommandations directes, adaptées au marché local.",
      servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les entreprises guyanaises</span>",
      servicesIntro: "Un marché en expansion, une concurrence encore ouverte : c'est le moment de prendre votre place en ligne. Site, SEO, réseaux et automatisation, on gère de A à Z.",
      aboutP: "Du commerce de Cayenne au prestataire de Kourou, je conçois des outils d'acquisition taillés pour un territoire jeune, connecté et en forte croissance.",
      zones: 'Cayenne, Kourou, Saint-Laurent-du-Maroni, Matoury, Rémire-Montjoly, Macouria',
      areaServed: ['Cayenne', 'Kourou', 'Saint-Laurent-du-Maroni', 'Matoury'],
      faq: [
        { q: "Travaillez-vous avec les entreprises de toute la Guyane ?", a: "Oui, de Cayenne à Saint-Laurent-du-Maroni en passant par Kourou et Matoury. Tout se pilote à distance (visio, téléphone), avec la même exigence de proximité." },
        { q: "Combien coûte un site internet en Guyane ?", a: "Nos sites vitrines professionnels démarrent à 250€. Pour de l'e-commerce ou du sur-mesure, on établit un devis transparent après un court échange." },
        { q: "Pourquoi investir dans le web en Guyane maintenant ?", a: "Parce que le marché est jeune et la concurrence digitale encore faible : une présence en ligne soignée vous démarque durablement, avant que tout le monde s'y mette." },
        { q: "Gérez-vous le référencement local et les réseaux sociaux ?", a: "Oui : fiche Google Business, SEO géolocalisé (Cayenne, Kourou…) et community management sur Facebook, Instagram et WhatsApp, très utilisés localement." }
      ]
    },
    cities: [
      {
        slug: 'cayenne', name: 'Cayenne', gentile: 'cayennaises', hero: 'hero-2.jpg',
        title: 'Agence Web & Création de Site Internet à Cayenne (973) | GroupSolution',
        desc: "Agence web à Cayenne, chef-lieu de la Guyane : création de sites internet, SEO local, réseaux sociaux et publicité pour les commerces et entreprises du centre. Audit gratuit.",
        keywords: 'agence web Cayenne, création site internet Cayenne 973, SEO Cayenne Guyane, community management Cayenne, agence communication chef-lieu Guyane',
        badge: 'Votre agence digitale au chef-lieu (Cayenne · 973)',
        h1suffix: 'à Cayenne',
        heroSub: "Chef-lieu et cœur économique de la Guyane, Cayenne concentre commerces, administrations et services. On donne à votre activité cayennaise la visibilité qu'elle mérite en ligne.",
        auditIntro: "En 15 minutes, on analyse la présence en ligne de votre commerce ou société à Cayenne — du centre-ville au marché, jusqu'à Rémire-Montjoly. Recommandations directes.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les entreprises cayennaises</span>",
        servicesIntro: "Commerces du centre, restaurants, prestataires : à Cayenne, la clientèle vous cherche d'abord sur Google et les réseaux. On centralise toute votre présence en ligne.",
        aboutP: "Du commerce du centre de Cayenne au cabinet de Rémire-Montjoly, je conçois des outils d'acquisition adaptés à la réalité du chef-lieu guyanais.",
        zones: 'Centre-ville, Village Chinois, Cabassou, Rémire-Montjoly, Matoury voisin',
        areaServed: ['Cayenne', 'Rémire-Montjoly', 'Matoury'],
        faq: [
          { q: "Créez-vous des sites pour les commerces du centre de Cayenne ?", a: "Oui, c'est notre cœur de cible : commerces, restaurants, artisans et TPE du chef-lieu. On crée des sites vitrines ou e-commerce pensés pour capter la clientèle cayennaise." },
          { q: "Combien coûte un site internet à Cayenne ?", a: "Nos sites vitrines professionnels démarrent à 250€. Pour de l'e-commerce ou des fonctionnalités sur-mesure, on établit un devis transparent après un court échange." },
          { q: "Pouvez-vous me positionner sur Google pour « à Cayenne 973 » ?", a: "Oui. Le référencement local est notre spécialité : fiche Google Business, mots-clés géolocalisés et contenus optimisés pour sortir quand un Cayennais cherche votre service." },
          { q: "Gérez-vous les réseaux sociaux des entreprises cayennaises ?", a: "Tout à fait. Facebook, Instagram et WhatsApp sont incontournables à Cayenne. On crée vos visuels, on rédige vos posts et on pilote vos campagnes publicitaires locales." }
        ]
      },
      {
        slug: 'kourou', name: 'Kourou', gentile: 'kourouciennes', hero: 'hero-3.jpg',
        title: 'Agence Web & Création de Site Internet à Kourou (973) | GroupSolution',
        desc: "Agence web à Kourou, la ville spatiale de Guyane : sites internet professionnels, SEO, réseaux sociaux et automatisation pour les entreprises et prestataires de la cité de l'espace. Audit gratuit.",
        keywords: 'agence web Kourou, création site internet Kourou 973, SEO Kourou Guyane, site entreprise spatial Guyane, automatisation Kourou',
        badge: 'Votre agence digitale à la cité de l’espace (Kourou · 973)',
        h1suffix: 'à Kourou',
        heroSub: "Ville du Centre Spatial Guyanais, Kourou est internationale, technique et exigeante. On outille ses entreprises et prestataires d'un web à la hauteur de leur environnement.",
        auditIntro: "En 15 minutes, on évalue la présence en ligne de votre société à Kourou — commerce, service ou prestataire lié à l'écosystème spatial. Diagnostic direct.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les entreprises kourouciennes</span>",
        servicesIntro: "À Kourou, on croise une clientèle locale et internationale. Un site crédible, un référencement propre et de l'automatisation pour être à la hauteur de la cité de l'espace.",
        aboutP: "Du commerce kouroucien au prestataire gravitant autour du spatial, je développe des sites professionnels et des automatisations qui inspirent confiance.",
        zones: 'Centre-ville, Bourg, l’Anse, Pariacabo, zone du Centre Spatial',
        areaServed: ['Kourou', 'Sinnamary', 'Macouria'],
        faq: [
          { q: "Travaillez-vous avec les prestataires liés au spatial à Kourou ?", a: "Oui. Beaucoup d'entreprises de Kourou servent l'écosystème spatial ou sa population internationale. On crée des sites professionnels, souvent bilingues, qui rassurent ce public exigeant." },
          { q: "Quel budget pour un site professionnel à Kourou ?", a: "Une vitrine démarre à 250€. Pour un site plus complet (bilingue, catalogue, réservation), on chiffre selon vos besoins — devis clair et transparent." },
          { q: "Pouvez-vous faire un site bilingue français / anglais ?", a: "Oui, c'est fréquent à Kourou vu la population internationale. On conçoit des sites multilingues propres, pensés pour le référencement dans chaque langue." },
          { q: "Automatisez-vous la gestion des demandes et des devis ?", a: "C'est une de nos forces : formulaires intelligents, accusés et relances automatiques, prise de RDV en ligne. Vos équipes gagnent du temps sur l'administratif." }
        ]
      },
      {
        slug: 'saint-laurent-du-maroni', name: 'Saint-Laurent-du-Maroni', gentile: 'saint-laurentaises', hero: 'hero-2.jpg',
        title: 'Agence Web & Site Internet à Saint-Laurent-du-Maroni (973) | GroupSolution',
        desc: "Agence web à Saint-Laurent-du-Maroni, dans l'Ouest guyanais : création de sites, SEO local, réseaux sociaux et publicité pour les commerces et entreprises du bassin du Maroni. Audit gratuit.",
        keywords: 'agence web Saint-Laurent-du-Maroni, création site internet Ouest Guyane 973, SEO Saint-Laurent Guyane, community management Maroni',
        badge: 'Votre agence digitale dans l’Ouest (Saint-Laurent · 973)',
        h1suffix: 'à Saint-Laurent-du-Maroni',
        heroSub: "Deuxième ville de Guyane sur les rives du Maroni, Saint-Laurent est jeune, en forte croissance et tournée vers le fleuve. On aide ses commerces à capter ce dynamisme en ligne.",
        auditIntro: "En 15 minutes, on analyse la présence web de votre activité dans l'Ouest guyanais, de Saint-Laurent aux communes du fleuve. Un repère clair, sans engagement.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour l’Ouest guyanais</span>",
        servicesIntro: "Commerces, services, acteurs du transfrontalier : l'Ouest grandit vite et la clientèle se connecte. On centralise site, réseaux et publicité pour vous démarquer sur le bassin du Maroni.",
        aboutP: "Du commerce du centre de Saint-Laurent à l'acteur du transfrontalier, je conçois des sites taillés pour une ville jeune et en pleine expansion.",
        zones: 'Centre-ville, Charbonnière, la Roche, Saint-Jean, communes du Maroni',
        areaServed: ['Saint-Laurent-du-Maroni', 'Mana', 'Apatou'],
        faq: [
          { q: "Créez-vous des sites pour les commerces de Saint-Laurent-du-Maroni ?", a: "Oui, commerces, restaurants et prestataires de l'Ouest sont au cœur de notre clientèle. On crée des sites qui captent une population jeune et connectée." },
          { q: "Le marché de l'Ouest guyanais est-il porteur pour le web ?", a: "Très : Saint-Laurent est l'une des villes qui grandit le plus vite. Se positionner en ligne maintenant, c'est prendre une longueur d'avance durable sur la concurrence." },
          { q: "Faites-vous de la publicité ciblée sur le bassin du Maroni ?", a: "Oui. On paramètre des campagnes géociblées (Saint-Laurent, Mana, Apatou…) pour toucher précisément les clients potentiels autour de votre activité." },
          { q: "Gérez-vous les réseaux sociaux localement ?", a: "Tout à fait. Facebook et WhatsApp sont très utilisés dans l'Ouest. On crée vos contenus et on anime vos pages pour développer votre notoriété locale." }
        ]
      },
      {
        slug: 'matoury', name: 'Matoury', gentile: 'matouriennes', hero: 'hero-1.jpg',
        title: 'Agence Web & Création de Site Internet à Matoury (973) | GroupSolution',
        desc: "Agence web à Matoury, dans l'agglomération de Cayenne : sites internet, SEO, réseaux sociaux et automatisation pour les entreprises des zones d'activités et de l'aéroport Félix Éboué. Audit gratuit.",
        keywords: 'agence web Matoury, création site internet Matoury 973, SEO Matoury Guyane, site B2B zone activité Guyane, automatisation devis Matoury',
        badge: 'Votre agence digitale dans l’agglo (Matoury · 973)',
        h1suffix: 'à Matoury',
        heroSub: "Aux portes de Cayenne et de l'aéroport Félix Éboué, Matoury concentre zones d'activités, logistique et entreprises. On outille ces pros d'un web qui travaille pour eux.",
        auditIntro: "En 15 minutes, on évalue la présence en ligne de votre société à Matoury — commerce, service, logistique ou entreprise des zones d'activités. Diagnostic direct.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les pros de Matoury</span>",
        servicesIntro: "Zones d'activités, logistique, services aux entreprises : à Matoury, on mise sur un site crédible, un référencement pro et de l'automatisation pour gagner du temps.",
        aboutP: "De l'entreprise des zones d'activités de Matoury au commerce de proximité, je développe des sites solides et des automatisations qui font gagner des heures.",
        zones: 'Balata, la Chaumière, Cogneau-Lamirande, zones d’activités, aéroport Félix Éboué',
        areaServed: ['Matoury', 'Cayenne', 'Rémire-Montjoly'],
        faq: [
          { q: "Accompagnez-vous les entreprises des zones d'activités de Matoury ?", a: "Oui : commerces, services, logistique et PME des zones d'activités. On crée des sites crédibles et des outils qui appuient votre développement commercial." },
          { q: "Pouvez-vous créer un site vitrine professionnel pour ma société ?", a: "Bien sûr. Un site clair présentant vos activités, vos références et vos services, pensé pour convaincre — à partir de 250€ pour une vitrine." },
          { q: "Automatisez-vous les demandes de devis et les relances ?", a: "C'est notre valeur ajoutée : formulaires de devis, accusés automatiques, relances programmées et suivi. Vos équipes se concentrent sur le métier." },
          { q: "Référencez-vous mon entreprise sur « Matoury » et l'agglo de Cayenne ?", a: "Oui. On optimise votre visibilité sur les recherches locales de Matoury et de l'agglomération pour capter des demandes qualifiées près de chez vous." }
        ]
      }
    ]
  },

  /* ───────────────────────── LA MARTINIQUE (972) ───────────────────────── */
  {
    slug: 'martinique', name: 'La Martinique', code: '972', status: 'online',
    regionPage: 'site-internet-martinique.html',
    fauna: ['colibri.jpg', 'iguane.jpg', 'tortue.jpg'],
    implantTagline: "L'agence digitale de Groupe Solution en Martinique : sites internet, référencement local, réseaux sociaux et automatisation pour les entreprises de Fort-de-France, du Lamentin et de toute l'île.",
    region: {
      pageFile: 'site-internet-martinique.html', slug: 'martinique', name: 'La Martinique', gentile: 'martiniquaises', hero: 'hero-1.jpg',
      title: 'Agence Web & Digitale en Martinique (972) | GroupSolution',
      desc: "Agence web en Martinique : création de sites internet, référencement local (SEO), réseaux sociaux et automatisation pour les entreprises de Fort-de-France, Le Lamentin, Schœlcher et Le Robert. Audit gratuit.",
      keywords: 'agence web Martinique, création site internet Martinique 972, SEO Fort-de-France, community management Martinique, automatisation entreprise Martinique',
      badge: 'Votre agence digitale en Martinique (972)',
      h1suffix: 'en Martinique',
      heroSub: "De la Montagne Pelée aux plages du Sud, la Martinique conjugue art de vivre et esprit d'entreprise. On donne aux entreprises martiniquaises les outils pour rayonner en ligne, localement et au-delà.",
      auditIntro: "En 15 minutes, on analyse la présence en ligne de votre entreprise en Martinique — de Fort-de-France à l'Atlantique. Des recommandations directes, adaptées au marché local.",
      servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les entreprises martiniquaises</span>",
      servicesIntro: "Commerce, tourisme, services, artisanat : la Martinique regorge de savoir-faire. Encore faut-il être visible. Site, SEO, réseaux et automatisation, on gère de A à Z.",
      aboutP: "Du commerce de Fort-de-France au prestataire du Lamentin, je conçois des outils d'acquisition taillés pour une île où la réputation et le bouche-à-oreille comptent — désormais amplifiés par le web.",
      zones: 'Fort-de-France, Le Lamentin, Schœlcher, Le Robert, Ducos, Le François',
      areaServed: ['Fort-de-France', 'Le Lamentin', 'Schœlcher', 'Le Robert'],
      faq: [
        { q: "Travaillez-vous avec les entreprises de toute la Martinique ?", a: "Oui, de Fort-de-France au Lamentin, de Schœlcher à l'Atlantique. Tout se pilote à distance (visio, téléphone), avec une vraie exigence de proximité." },
        { q: "Combien coûte un site internet en Martinique ?", a: "Nos sites vitrines professionnels démarrent à 250€. Pour de l'e-commerce ou du sur-mesure, on établit un devis transparent après un court échange." },
        { q: "Aidez-vous les acteurs du tourisme et de la restauration ?", a: "Bien sûr : sites, réservation en ligne, avis Google et réseaux sociaux. Le tourisme est clé en Martinique, et la visibilité en ligne fait la réservation." },
        { q: "Gérez-vous le référencement local et les réseaux sociaux ?", a: "Oui : fiche Google Business, SEO géolocalisé (Fort-de-France, Le Lamentin…) et community management sur Facebook, Instagram et WhatsApp, très utilisés localement." }
      ]
    },
    cities: [
      {
        slug: 'fort-de-france', name: 'Fort-de-France', gentile: 'foyalaises', hero: 'hero-3.jpg',
        title: 'Agence Web & Création de Site Internet à Fort-de-France (972) | GroupSolution',
        desc: "Agence web à Fort-de-France, capitale de la Martinique : création de sites internet, SEO local, réseaux sociaux et publicité pour les commerces et entreprises du centre. Audit gratuit.",
        keywords: 'agence web Fort-de-France, création site internet Fort-de-France 972, SEO Fort-de-France Martinique, community management Fort-de-France',
        badge: 'Votre agence digitale à la capitale (Fort-de-France · 972)',
        h1suffix: 'à Fort-de-France',
        heroSub: "Capitale et cœur économique de la Martinique, Fort-de-France concentre commerces, administrations et services. On donne à votre activité foyalaise la visibilité qu'elle mérite en ligne.",
        auditIntro: "En 15 minutes, on analyse la présence en ligne de votre commerce ou société à Fort-de-France — du centre-ville au front de mer, jusqu'à Redoute et Dillon. Recommandations directes.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les entreprises foyalaises</span>",
        servicesIntro: "Commerces du centre, restaurants, prestataires : à Fort-de-France, la clientèle vous cherche d'abord sur Google et les réseaux. On centralise toute votre présence en ligne.",
        aboutP: "Du commerce du centre de Fort-de-France au cabinet de Cluny, je conçois des outils d'acquisition adaptés à la réalité de la capitale martiniquaise.",
        zones: 'Centre-ville, La Savane, Redoute, Dillon, Cluny, Sainte-Thérèse',
        areaServed: ['Fort-de-France', 'Schœlcher', 'Le Lamentin'],
        faq: [
          { q: "Créez-vous des sites pour les commerces du centre de Fort-de-France ?", a: "Oui, c'est notre cœur de cible : commerces, restaurants, artisans et TPE de la capitale. On crée des sites vitrines ou e-commerce pensés pour capter la clientèle foyalaise." },
          { q: "Combien coûte un site internet à Fort-de-France ?", a: "Nos sites vitrines professionnels démarrent à 250€. Pour de l'e-commerce ou des fonctionnalités sur-mesure, on établit un devis transparent après un court échange." },
          { q: "Pouvez-vous me positionner sur Google pour « à Fort-de-France 972 » ?", a: "Oui. Le référencement local est notre spécialité : fiche Google Business, mots-clés géolocalisés et contenus optimisés pour sortir quand un Foyalais cherche votre service." },
          { q: "Gérez-vous les réseaux sociaux des entreprises foyalaises ?", a: "Tout à fait. Facebook, Instagram et WhatsApp sont incontournables à Fort-de-France. On crée vos visuels, on rédige vos posts et on pilote vos campagnes publicitaires locales." }
        ]
      },
      {
        slug: 'le-lamentin', name: 'Le Lamentin', gentile: 'lamentinoises', hero: 'hero-1.jpg',
        title: 'Agence Web & Création de Site Internet au Lamentin (972) | GroupSolution',
        desc: "Agence web au Lamentin, poumon économique de la Martinique : sites internet, SEO, réseaux sociaux et automatisation pour les entreprises des zones d'activités et de l'aéroport Aimé Césaire. Audit gratuit.",
        keywords: 'agence web Le Lamentin, création site internet Le Lamentin 972, SEO Lamentin Martinique, site B2B zone activité Martinique',
        badge: 'Votre agence digitale au pôle économique (Le Lamentin · 972)',
        h1suffix: 'au Lamentin',
        heroSub: "Poumon économique de l'île, avec l'aéroport Aimé Césaire et ses grandes zones d'activités, Le Lamentin concentre commerces, industrie et logistique. On outille ses entreprises d'un web performant.",
        auditIntro: "En 15 minutes, on évalue la présence en ligne de votre société au Lamentin — commerce, service, industrie ou logistique des zones d'activités. Diagnostic direct.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les pros du Lamentin</span>",
        servicesIntro: "Zones commerciales, industrie, services aux entreprises : au Lamentin, on mise sur un site crédible, un référencement pro et de l'automatisation pour gagner du temps.",
        aboutP: "De l'entreprise des zones d'activités du Lamentin au commerce de la Galleria, je développe des sites solides et des automatisations qui font gagner des heures.",
        zones: 'Californie, La Jambette, Acajou, Place d’Armes, aéroport Aimé Césaire',
        areaServed: ['Le Lamentin', 'Ducos', 'Fort-de-France'],
        faq: [
          { q: "Accompagnez-vous les entreprises des zones d'activités du Lamentin ?", a: "Oui : commerces, industrie, logistique et services. On crée des sites crédibles (souvent B2B) et des outils qui appuient votre développement commercial." },
          { q: "Pouvez-vous créer un site vitrine professionnel pour ma société ?", a: "Bien sûr. Un site clair présentant vos activités, vos références et vos services, pensé pour convaincre — à partir de 250€ pour une vitrine." },
          { q: "Automatisez-vous les devis et les relances clients ?", a: "C'est notre valeur ajoutée : formulaires de devis, accusés automatiques, relances programmées et suivi. Vos équipes se concentrent sur le métier." },
          { q: "Référencez-vous mon entreprise sur « Le Lamentin » et l'agglo ?", a: "Oui. On optimise votre visibilité sur les recherches locales du Lamentin et de l'agglomération de Fort-de-France pour capter des demandes qualifiées." }
        ]
      },
      {
        slug: 'schoelcher', name: 'Schœlcher', gentile: 'schœlchéroises', hero: 'hero-2.jpg',
        title: 'Agence Web & Création de Site Internet à Schœlcher (972) | GroupSolution',
        desc: "Agence web à Schœlcher en Martinique : sites internet, SEO local, réseaux sociaux pour les commerces, le tourisme et les acteurs du littoral et du campus universitaire. Audit gratuit.",
        keywords: 'agence web Schœlcher, création site internet Schœlcher 972, SEO Schœlcher Martinique, community management Schœlcher',
        badge: 'Votre agence digitale sur le littoral (Schœlcher · 972)',
        h1suffix: 'à Schœlcher',
        heroSub: "Ville résidentielle et universitaire au nord de Fort-de-France, entre campus, littoral et plages, Schœlcher mêle jeunesse, tourisme et commerces de proximité. On rend votre activité visible en ligne.",
        auditIntro: "En 15 minutes, on analyse comment votre activité schœlchéroise apparaît en ligne — commerce de proximité, restauration, tourisme balnéaire ou service. Recommandations concrètes.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour les entreprises schœlchéroises</span>",
        servicesIntro: "Commerces de proximité, restaurants, hébergements, services aux étudiants : à Schœlcher, on capte une clientèle mêlant habitants, campus et visiteurs. Site, réseaux et SEO, on gère tout.",
        aboutP: "Du restaurant du bord de mer au commerce proche du campus, je conçois des sites qui parlent à une clientèle jeune, locale et de passage.",
        zones: 'Anse Madame, Batelière, Terreville, Fond Lahaye, campus de Schœlcher',
        areaServed: ['Schœlcher', 'Fort-de-France', 'Case-Pilote'],
        faq: [
          { q: "Créez-vous des sites pour les commerces et restaurants de Schœlcher ?", a: "Oui, commerces de proximité, restaurants et hébergements sont au cœur de notre clientèle. On crée des sites qui captent habitants, étudiants et visiteurs." },
          { q: "Un site de réservation pour mon activité touristique, c'est possible ?", a: "Oui : réservation de tables, d'hébergements ou d'activités, avec confirmation automatique. On automatise aussi les relances pour limiter les no-shows." },
          { q: "Comment toucher la clientèle du campus et des environs ?", a: "Par le référencement local et les réseaux sociaux, très suivis par une population jeune. On cible précisément Schœlcher et ses quartiers." },
          { q: "Gérez-vous les avis Google de mon établissement ?", a: "Oui. Les avis font la réputation, surtout dans la restauration et le tourisme. On met en place la collecte et le suivi des avis pour soigner votre image." }
        ]
      },
      {
        slug: 'le-robert', name: 'Le Robert', gentile: 'robertines', hero: 'hero-2.jpg',
        title: 'Agence Web & Création de Site Internet au Robert (972) | GroupSolution',
        desc: "Agence web au Robert, sur la côte atlantique de la Martinique : sites internet, SEO local, réseaux sociaux pour les commerces, le nautisme, la pêche et le tourisme de la baie et des îlets. Audit gratuit.",
        keywords: 'agence web Le Robert, création site internet Le Robert 972, SEO Robert Martinique, site tourisme nautisme Martinique',
        badge: 'Votre agence digitale sur l’Atlantique (Le Robert · 972)',
        h1suffix: 'au Robert',
        heroSub: "Sur la côte atlantique, entre sa célèbre baie, ses îlets et ses fonds blancs, Le Robert vit du nautisme, de la pêche et d'un tourisme authentique. On aide ses entreprises à capter cette clientèle en ligne.",
        auditIntro: "En 15 minutes, on analyse la présence web de votre activité au Robert et sur la côte atlantique — commerce, nautisme, restauration ou hébergement. Un repère clair, sans engagement.",
        servicesH2: "Tout le digital centralisé<br><span class=\"accent\">pour l’Atlantique martiniquais</span>",
        servicesIntro: "Loueurs de bateaux, restaurants, hébergements, commerces : sur la côte atlantique, on vous trouve d'abord en ligne. Site, réservation, avis et publicité, on gère tout.",
        aboutP: "Du loueur d'excursions vers les îlets au restaurant du bourg du Robert, je conçois des sites qui captent le visiteur avant même son arrivée sur la côte atlantique.",
        zones: 'Le bourg, Pointe Savane, Vert-Pré, les îlets du Robert, Trinité voisine',
        areaServed: ['Le Robert', 'La Trinité', 'Le François'],
        faq: [
          { q: "Créez-vous des sites pour les acteurs du nautisme et du tourisme au Robert ?", a: "Absolument. Loueurs de bateaux, excursions vers les îlets, restaurants et hébergements : on crée des sites qui donnent envie et rassurent le visiteur avant sa venue." },
          { q: "Un site de réservation en ligne, c'est adapté à mon activité ?", a: "Oui : réservation d'excursions, de tables ou d'hébergement avec confirmation automatique. Idéal pour une activité saisonnière et touristique." },
          { q: "Comment être visible auprès des touristes qui cherchent une sortie en mer ?", a: "Par le référencement local et une fiche Google soignée : quand un visiteur cherche « excursion îlets Robert » ou « location bateau Martinique », vous devez sortir en premier." },
          { q: "Gérez-vous les réseaux sociaux et les avis ?", a: "Oui. Les belles photos de la baie et des fonds blancs cartonnent sur Instagram, et les avis font la réservation. On anime vos réseaux et on suit votre e-réputation." }
        ]
      }
    ]
  }
];
