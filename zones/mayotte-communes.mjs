/* ═══════════════════════════════════════════════════════════
   MAYOTTE (976) — pages par commune ou bassin, où Titouan est installé.
   Faits sûrs uniquement (géographie, équipements connus), aucun prix, aucun client cité.
   Utilisé par zones/zones.mjs → zones/generate-cities.mjs (mayotte/site-internet-<slug>.html).
   ═══════════════════════════════════════════════════════════ */
const PRIX = { q: "Combien coûte un site internet ou une automatisation à Mayotte ?", a: "Il n'y a pas de tarif unique : chaque projet est chiffré sur devis gratuit, après un court échange sur vos besoins. Avec l'IA, c'est souvent bien plus accessible qu'on ne l'imagine, et Titouan, installé à Mayotte, vous répond directement." };
export const MAYOTTE_CITIES = [
  {
    slug: 'mamoudzou', name: 'Mamoudzou', gentile: 'de Mamoudzou', hero: 'hero-cote.jpg',
    title: 'Site internet et automatisation à Mamoudzou (976)',
    desc: "Création de site internet, référencement local et automatisations pour les entreprises de Mamoudzou : Kawéni, Passamaïnty, M'Tsapéré, Cavani. Titouan est installé à Mayotte. Devis gratuit.",
    keywords: "création site internet Mamoudzou, site internet Kawéni, référencement Mamoudzou, automatisation entreprise Mayotte, agence web Mamoudzou",
    badge: 'Installé à Mayotte · Mamoudzou (976)',
    h1suffix: 'à Mamoudzou',
    heroSub: "Chef-lieu et commune la plus peuplée de l'île, Mamoudzou concentre administrations, commerces et la zone d'activités de Kawéni. On donne à votre entreprise une présence en ligne qui fait appeler, et des outils qui font gagner du temps.",
    auditIntro: "En 15 minutes, on regarde comment votre entreprise apparaît quand on la cherche depuis Kawéni, Passamaïnty ou Petite-Terre : fiche Google, site, WhatsApp. Recommandations concrètes, sans engagement.",
    servicesH2: "Votre activité mahoraise,<br><span class=\"accent\">trouvée, choisie, appelée</span>",
    servicesIntro: "À Mamoudzou, les clients comparent sur Google et écrivent sur WhatsApp avant de se déplacer, surtout avec les embouteillages entre Kawéni et le centre. Site rapide, fiche Google à jour, réponses automatiques : on centralise tout.",
    aboutP: "Installé à Mayotte, Titouan accompagne les commerces du centre, les entreprises de la zone de Kawéni et les prestataires qui travaillent avec les administrations, avec des outils pensés pour la réalité de l'île.",
    zones: "Centre et Cavani, Kawéni, M'Tsapéré, Passamaïnty, Tsoundzou, Kawéni zone d'activités",
    areaServed: ['Mamoudzou', 'Kawéni', 'Passamaïnty', "M'Tsapéré"],
    faq: [
      { q: "Pouvez-vous rencontrer les entreprises de Mamoudzou sur place ?", a: "Oui : Titouan est installé à Mayotte. Un premier échange de 10 minutes par téléphone ou en visio suffit pour cadrer, puis on se voit quand c'est utile." },
      { q: "WhatsApp peut-il être relié à mon site et à mes devis ?", a: "Oui. À Mayotte, WhatsApp est souvent le premier canal client : on peut répondre automatiquement aux questions fréquentes, prendre les demandes de devis et les ranger dans votre outil, avec reprise humaine quand il le faut." },
      { q: "Mon entreprise est à Kawéni : comment être trouvé par les clients du centre et de Petite-Terre ?", a: "Avec une fiche Google complète (horaires, photos, accès), des pages qui citent les quartiers que vous servez et un site rapide sur téléphone, même avec une connexion moyenne." },
      PRIX
    ]
  },
  {
    slug: 'koungou', name: 'Koungou', gentile: 'de Koungou', hero: 'hero-lagon.jpg',
    title: 'Site internet et automatisation à Koungou (976)',
    desc: "Sites internet et automatisations pour les entreprises de Koungou, Longoni, Majicavo et Trévani : logistique portuaire, BTP, commerces. Titouan est installé à Mayotte. Devis gratuit.",
    keywords: "site internet Koungou, entreprise Longoni, automatisation logistique Mayotte, site internet Majicavo, port de Longoni entreprise",
    badge: 'Installé à Mayotte · Koungou et Longoni (976)',
    h1suffix: 'à Koungou',
    heroSub: "Avec le port de Longoni, par où arrive l'essentiel des marchandises de l'île, Koungou est le poumon logistique de Mayotte. Transitaires, transporteurs, BTP et commerces y ont besoin d'outils qui suivent le rythme des arrivages.",
    auditIntro: "En 15 minutes, on analyse votre présence en ligne et vos flux (demandes, devis, suivi des livraisons) pour votre activité à Koungou, Longoni, Majicavo ou Trévani.",
    servicesH2: "Des outils à la hauteur<br><span class=\"accent\">du port de Longoni</span>",
    servicesIntro: "Suivi des conteneurs et des arrivages partagé avec vos clients, bons de livraison lus automatiquement, devis préparés en quelques minutes : on automatise ce qui se fait encore à la main entre le port et vos clients.",
    aboutP: "Titouan conçoit à Mayotte des sites et des logiciels sur-mesure pour les entreprises qui vivent au rythme du port : logistique, négoce, matériaux, BTP.",
    zones: "Longoni et son port, Majicavo, Trévani, Kangani, Koungou",
    areaServed: ['Koungou', 'Longoni', 'Majicavo', 'Trévani'],
    faq: [
      { q: "Pouvez-vous informer automatiquement mes clients de l'arrivée de leur marchandise ?", a: "Oui : un suivi partagé (lien, SMS ou WhatsApp) prévient le client à chaque étape, de l'arrivée au port à la livraison, sans que votre équipe ait à rappeler chacun." },
      { q: "Peut-on lire automatiquement les bons de livraison et les factures fournisseurs ?", a: "Oui : une photo ou un PDF suffit, les informations sont vérifiées et envoyées dans votre outil de gestion. C'est aussi la bonne manière de préparer la facturation électronique." },
      { q: "Faites-vous des sites pour les entreprises du BTP de Koungou ?", a: "Oui : un site qui présente vos chantiers, votre zone d'intervention et un formulaire de devis clair, relié à votre agenda et à vos relances." },
      PRIX
    ]
  },
  {
    slug: 'petite-terre', name: 'Petite-Terre', gentile: 'de Petite-Terre', hero: 'hero-plage.jpg',
    title: 'Site internet à Petite-Terre : Dzaoudzi-Labattoir et Pamandzi',
    desc: "Création de site internet et automatisations pour les entreprises de Petite-Terre (Dzaoudzi-Labattoir, Pamandzi) : tourisme, services, commerces proches de l'aéroport. Devis gratuit.",
    keywords: "site internet Petite-Terre, site internet Dzaoudzi, site internet Pamandzi, entreprise Labattoir, agence web Petite-Terre Mayotte",
    badge: 'Installé à Mayotte · Petite-Terre (976)',
    h1suffix: 'à Petite-Terre',
    heroSub: "Dzaoudzi-Labattoir, ancienne capitale, et Pamandzi, avec l'aéroport de l'île : Petite-Terre accueille chaque visiteur qui arrive à Mayotte. Hébergements, loueurs, taxis et services ont tout à gagner à être trouvés avant l'atterrissage.",
    auditIntro: "En 15 minutes, on regarde comment votre activité de Petite-Terre apparaît pour quelqu'un qui prépare son arrivée à Mayotte : Google, cartes, réservations, WhatsApp.",
    servicesH2: "Soyez la première adresse<br><span class=\"accent\">de ceux qui arrivent à Mayotte</span>",
    servicesIntro: "Réservation en ligne, réponses automatiques en français et en anglais, informations pratiques sur la barge et les horaires : on transforme les recherches des voyageurs en réservations.",
    aboutP: "Installé à Mayotte, Titouan connaît le va-et-vient entre Petite-Terre et Grande-Terre : il conçoit des outils qui réservent, confirment et informent sans que vous ayez à décrocher.",
    zones: "Dzaoudzi, Labattoir, Pamandzi et l'aéroport, le quai de la barge",
    areaServed: ['Dzaoudzi', 'Labattoir', 'Pamandzi'],
    faq: [
      { q: "Pouvez-vous faire un site de réservation pour mon hébergement ou ma location de voitures ?", a: "Oui : disponibilités à jour, réservation et paiement en ligne, confirmation automatique et consignes d'arrivée envoyées au bon moment, en français et en anglais." },
      { q: "Mes clients arrivent souvent le soir ou le week-end : comment ne rater aucune demande ?", a: "Un assistant répond automatiquement sur le site et WhatsApp aux questions fréquentes, prend la réservation et vous transmet le reste, avec reprise humaine quand il le faut." },
      { q: "Intervenez-vous aussi sur Grande-Terre ?", a: "Oui, sur toute l'île : Petite-Terre, Mamoudzou, le nord, le centre et le sud." },
      PRIX
    ]
  },
  {
    slug: 'dembeni', name: 'Dembéni', gentile: 'de Dembéni', hero: 'hero-lagon.jpg',
    title: 'Site internet et automatisation à Dembéni (976)',
    desc: "Sites internet et automatisations pour les entreprises de Dembéni, Tsararano, Iloni et Hajangoua, commune du centre universitaire de Mayotte. Titouan est installé à Mayotte. Devis gratuit.",
    keywords: "site internet Dembéni, entreprise Tsararano, automatisation Dembéni, site internet centre Mayotte, organisme de formation Mayotte",
    badge: 'Installé à Mayotte · Dembéni (976)',
    h1suffix: 'à Dembéni',
    heroSub: "Entre Mamoudzou et le sud, Dembéni accueille le centre universitaire de Mayotte et des villages en pleine croissance. Formation, services, commerces de proximité : on vous aide à être trouvé et à gagner du temps.",
    auditIntro: "En 15 minutes, on analyse la présence en ligne de votre activité à Dembéni, Tsararano, Iloni ou Hajangoua, et on repère ce qui peut être automatisé.",
    servicesH2: "Grandir avec<br><span class=\"accent\">le centre de l'île</span>",
    servicesIntro: "Inscriptions et dossiers gérés en ligne, rendez-vous et rappels automatiques, fiche Google à jour : des outils simples pour une commune où la population et les besoins augmentent vite.",
    aboutP: "Titouan accompagne depuis Mayotte les organismes de formation, les services et les commerces du centre de l'île, avec des outils qui fonctionnent aussi sur téléphone et en connexion moyenne.",
    zones: "Dembéni, Tsararano, Iloni, Hajangoua, Ongojou",
    areaServed: ['Dembéni', 'Tsararano', 'Iloni', 'Hajangoua'],
    faq: [
      { q: "Travaillez-vous avec les organismes de formation ?", a: "Oui : inscriptions en ligne, dossiers complets automatiquement, conventions et attestations générées, rappels aux stagiaires. Moins d'administratif, plus de temps pour former." },
      { q: "Mes clients n'ont pas toujours une bonne connexion : est-ce un problème ?", a: "Non : on conçoit des sites légers et des formulaires qui fonctionnent sur téléphone, et WhatsApp peut servir de canal principal quand c'est plus simple pour vos clients." },
      { q: "Pouvez-vous gérer les rendez-vous d'un cabinet ou d'un commerce ?", a: "Oui : prise de rendez-vous en ligne, rappels la veille par SMS ou WhatsApp et liste d'attente automatique." },
      PRIX
    ]
  },
  {
    slug: 'centre-ouest-mayotte', name: 'Centre et Ouest de Mayotte', gentile: 'du Centre et de l’Ouest', hero: 'hero-cote.jpg',
    title: 'Site internet dans le Centre et l’Ouest de Mayotte',
    desc: "Sites internet et automatisations pour les entreprises de Tsingoni (Combani), Sada, Chiconi, Ouangani et M'Tsangamouji : agriculture, artisanat, commerces, tourisme. Devis gratuit.",
    keywords: "site internet Combani, site internet Sada, entreprise Tsingoni, site internet Chiconi, Ouangani, agriculture Mayotte site internet",
    badge: 'Installé à Mayotte · Centre et Ouest (976)',
    h1suffix: 'dans le Centre et l’Ouest',
    heroSub: "De Combani à Sada, de Chiconi à Ouangani, le Centre et l'Ouest vivent d'agriculture, d'artisanat, de commerce de proximité et d'un littoral qui attire les visiteurs. Vendre plus loin que son village devient possible.",
    auditIntro: "En 15 minutes, on regarde comment un client de Mamoudzou ou un visiteur trouve votre activité du Centre ou de l'Ouest, et comment vendre ou réserver en ligne.",
    servicesH2: "Vendre au-delà<br><span class=\"accent\">de son village</span>",
    servicesIntro: "Vente en ligne avec retrait ou livraison, commandes sur WhatsApp rangées automatiquement, fiche Google qui indique l'accès : vos produits et services trouvent des clients dans toute l'île.",
    aboutP: "Installé à Mayotte, Titouan aide les producteurs, artisans et commerces du Centre et de l'Ouest à se faire connaître et à gérer leurs commandes sans y passer leurs soirées.",
    zones: "Tsingoni et Combani, Sada, Chiconi, Ouangani, M'Tsangamouji",
    areaServed: ['Tsingoni', 'Combani', 'Sada', 'Chiconi', 'Ouangani'],
    faq: [
      { q: "Puis-je vendre mes produits agricoles ou artisanaux en ligne ?", a: "Oui : une boutique simple avec paiement en ligne ou à la remise, retrait ou livraison, et des commandes WhatsApp enregistrées automatiquement." },
      { q: "Faites-vous des sites pour l'hébergement et les activités touristiques de l'Ouest ?", a: "Oui : réservation en ligne, disponibilités à jour et réponses automatiques aux questions des visiteurs, en français et en anglais." },
      { q: "Dois-je changer mes habitudes de travail ?", a: "Non : on part de ce que vous faites déjà (téléphone, WhatsApp, cahier de commandes) et on automatise autour, étape par étape." },
      PRIX
    ]
  },
  {
    slug: 'sud-mayotte', name: 'Sud de Mayotte', gentile: 'du Sud', hero: 'hero-choungui.jpg',
    title: 'Site internet dans le Sud de Mayotte (Chirongui, Bandrélé)',
    desc: "Sites internet et automatisations pour les entreprises du Sud de Mayotte : Chirongui, Bandrélé, Bouéni, Kani-Kéli. Tourisme, hébergement, commerces, artisans. Devis gratuit.",
    keywords: "site internet Chirongui, site internet Bandrélé, entreprise Bouéni, Kani-Kéli tourisme site, sud Mayotte site internet",
    badge: 'Installé à Mayotte · Sud (976)',
    h1suffix: 'dans le Sud',
    heroSub: "Autour du mont Choungui, le Sud de Mayotte, de Bandrélé à Kani-Kéli et de Chirongui à Bouéni, attire les visiteurs par ses plages et ses paysages. Hébergements, activités, commerces et artisans peuvent capter cette clientèle avant qu'elle prenne la route.",
    auditIntro: "En 15 minutes, on regarde comment un visiteur ou un client de Mamoudzou trouve votre activité du Sud : Google, cartes, réservation, WhatsApp.",
    servicesH2: "Faire venir les visiteurs<br><span class=\"accent\">jusque dans le Sud</span>",
    servicesIntro: "Réservation en ligne, réponses automatiques, itinéraire et informations pratiques à jour : on transforme les recherches « que faire dans le sud de Mayotte » en réservations chez vous.",
    aboutP: "Titouan accompagne depuis Mayotte les hébergements, activités et commerces du Sud, avec des outils qui travaillent même quand vous êtes sur le terrain.",
    zones: "Chirongui, Bandrélé, Bouéni, Kani-Kéli, les plages du Sud",
    areaServed: ['Chirongui', 'Bandrélé', 'Bouéni', 'Kani-Kéli'],
    faq: [
      { q: "Comment faire réserver les visiteurs avant qu'ils arrivent dans le Sud ?", a: "Avec un site qui apparaît sur les recherches des voyageurs, des disponibilités à jour et une réservation qui se confirme toute seule, avec les consignes d'accès envoyées au bon moment." },
      { q: "Pouvez-vous gérer les annulations liées à la météo ?", a: "Oui : en cas d'alerte ou de mauvais temps, les clients concernés sont prévenus automatiquement et on leur propose une autre date, sans passer la journée au téléphone." },
      { q: "Faites-vous aussi des sites pour les artisans et commerces du Sud ?", a: "Oui : site vitrine, fiche Google complète et demandes de devis rangées automatiquement, pour être trouvé dans toute l'île." },
      PRIX
    ]
  }
];
