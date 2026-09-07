/* ═══════════════════════════════════════════════════════════
   PILIERS SECTORIELS — contenu rédigé sur-mesure par (secteur × zone).
   Objectif : autorité thématique + unicité forte (aucune substitution
   de variable creuse). Chaque entrée CONTENT[secteur][zone] est un texte
   propre au métier ET au territoire.

   Consommé par : zones/generate-sectors.mjs
   → /{zone}/secteurs/{secteur}.html + /{zone}/secteurs/index.html

   Ajouter une zone à un secteur = ajouter CONTENT[secteur][zoneSlug].
   Le générateur ne produit que les couples réellement rédigés.
   ═══════════════════════════════════════════════════════════ */

/* Métadonnées d'affichage des secteurs (ordre = ordre des hubs). */
export const SECTORS = [
  { slug: 'restauration',        label: 'Restauration',            emoji: '🍽️', noun: 'restaurant' },
  { slug: 'tourisme-hebergement', label: 'Tourisme & hébergement', emoji: '🏝️', noun: 'hébergement touristique' },
  { slug: 'batiment-artisans',   label: 'Bâtiment & artisans',     emoji: '🏗️', noun: 'entreprise du bâtiment' },
];

/* Contenu éditorial. Chaque entrée :
   { title, desc, keywords, tag, h1, lead, sections:[{h2, html}], callout, faq:[{q,a}] } */
export const CONTENT = {

  /* ═════════════════ RESTAURATION ═════════════════ */
  restauration: {
    guadeloupe: {
      title: "Créer un site internet pour un restaurant en Guadeloupe",
      desc: "Restaurant, snack, lolo ou traiteur en Guadeloupe : comment un site web et Google captent la clientèle locale et les touristes. Guide GroupSolution, site vitrine dès 250€.",
      keywords: "site internet restaurant Guadeloupe, référencement restaurant 971, menu en ligne Guadeloupe, réservation restaurant Le Gosier, Google restaurant Pointe-à-Pitre, création site lolo",
      tag: "Restauration · Guadeloupe",
      h1: "Site internet pour un restaurant en Guadeloupe : capter les locaux et les touristes",
      lead: "Du lolo de bord de plage au restaurant gastronomique de Saint-François, la restauration guadeloupéenne vit d'une double clientèle : les habitants fidèles et les visiteurs de passage. Aujourd'hui, les deux commencent leur choix sur leur téléphone.",
      sections: [
        { h2: "Une clientèle qui cherche d'abord sur Google et Maps",
          html: "<p>En Guadeloupe, un touriste métropolitain qui arrive au Gosier ou à Sainte-Anne tape « restaurant près de moi » ou « meilleur bokit Grande-Terre » avant même de sortir. S'il ne vous trouve pas — avec vos photos, vos horaires, votre carte et vos avis — il va chez le voisin. Un site rapide couplé à une fiche <strong>Google Business Profile</strong> soignée est aujourd'hui votre première salle d'attente.</p><p>Pour la clientèle locale, c'est pareil : on vérifie si vous êtes ouvert le dimanche, si vous faites à emporter, si le court-bouillon est au menu ce midi. Répondre à ces questions en ligne, c'est déjà remplir des tables.</p>" },
        { h2: "Ce qui fait réserver : carte, photos, avis",
          html: "<ul><li><strong>Une carte à jour</strong> et lisible sur mobile (plus de menu PDF illisible qui met 10 secondes à charger).</li><li><strong>De vraies photos</strong> de vos plats et de la salle : c'est ce qui déclenche l'envie et distingue un restaurant d'un autre.</li><li><strong>Les avis Google</strong> mis en avant et entretenus : en zone touristique, la note compte autant que l'emplacement.</li><li><strong>Le clic-pour-appeler</strong> et l'itinéraire Maps, indispensables pour un client déjà en voiture.</li></ul>" },
        { h2: "À emporter, réservation, livraison : garder la main",
          html: "<p>Beaucoup de restaurateurs passent par les plateformes de livraison et leurs commissions. Un site à vous permet de proposer la réservation ou la commande à emporter <strong>en direct</strong>, sans reverser 20 à 30 % à un intermédiaire. On met en place un formulaire de réservation simple, relié à votre téléphone ou votre e-mail, sans usine à gaz.</p>" },
        { h2: "Notre approche pour la restauration antillaise",
          html: "<p>On conçoit un site vitrine clair, taillé pour le mobile et la recherche locale, avec votre carte, vos photos, vos horaires et un bouton de contact direct. On raccorde le tout à votre fiche Google pour que vous remontiez sur « restaurant + votre ville ». Un site vitrine professionnel démarre à 250€, et on vous forme pour changer votre carte vous-même.</p>" },
      ],
      callout: "En Guadeloupe, la saison touristique haute (décembre-avril) concentre une part énorme du chiffre. Un restaurant bien référencé capte cette clientèle de passage qui, elle, ne vous connaît pas encore : tout se joue en ligne.",
      faq: [
        { q: "J'ai déjà une page Facebook, pourquoi un site en plus ?", a: "Facebook est parfait pour animer votre communauté, mais il n'apparaît pas quand un touriste tape « restaurant Le Gosier » sur Google. Un site + une fiche Google vous rendent visibles au moment exact du choix, et vous appartiennent — contrairement à une page qui dépend d'un algorithme." },
        { q: "Combien coûte un site pour mon restaurant en Guadeloupe ?", a: "Un site vitrine professionnel (carte, photos, horaires, contact, optimisé mobile et Google) démarre à 250€. Si vous voulez la réservation en ligne ou la commande à emporter, on chiffre selon vos besoins, toujours avec un devis clair." },
        { q: "Puis-je changer ma carte moi-même ?", a: "Oui. On construit le site pour que vous puissiez mettre à jour votre menu, vos plats du jour et vos horaires sans nous rappeler, et on vous forme lors de la livraison." },
        { q: "Est-ce utile si je fais surtout du sur-place avec des habitués ?", a: "Oui : même une clientèle fidèle vérifie vos horaires, votre menu et si vous faites à emporter en ligne. Et une bonne présence Google vous amène en continu les nouveaux arrivants et les touristes du secteur." },
      ],
    },
  },

  /* ═════════════════ TOURISME & HÉBERGEMENT ═════════════════ */
  'tourisme-hebergement': {
    guadeloupe: {
      title: "Site internet pour un hébergement touristique en Guadeloupe",
      desc: "Gîte, location saisonnière, meublé ou chambre d'hôtes en Guadeloupe : un site de réservation directe pour échapper aux commissions Airbnb/Booking. Guide GroupSolution, dès 250€.",
      keywords: "site internet gîte Guadeloupe, location saisonnière 971, réservation directe hébergement Guadeloupe, meublé de tourisme Sainte-Anne, site chambre d'hôtes Basse-Terre, éviter commissions Airbnb",
      tag: "Tourisme & hébergement · Guadeloupe",
      h1: "Hébergement touristique en Guadeloupe : votre site de réservation directe",
      lead: "Gîtes de Basse-Terre, meublés de Grande-Terre, chambres d'hôtes des Saintes : la Guadeloupe vit largement du tourisme. Mais chaque réservation passée par une plateforme vous coûte 15 à 25 % de commission. Un site à vous change l'équation.",
      sections: [
        { h2: "Le vrai coût des plateformes",
          html: "<p>Airbnb, Booking et les autres apportent de la visibilité, mais prélèvent une commission sur chaque nuitée et gardent la relation client. Sur une saison complète, ces commissions représentent souvent plusieurs milliers d'euros. Un site de réservation directe ne les fait pas disparaître du jour au lendemain, mais il vous permet de <strong>récupérer les clients qui reviennent</strong> et ceux qui vous ont trouvé par le bouche-à-oreille — sans reverser un centime.</p>" },
        { h2: "Ce qu'attend un voyageur avant de réserver",
          html: "<ul><li>Des <strong>photos qui donnent envie</strong> : la vue, la piscine, la plage à 5 minutes, la terrasse au coucher du soleil.</li><li>Les <strong>infos pratiques</strong> claires : capacité, équipements, distance des sites (plages, Soufrière, plongée), conditions.</li><li>La <strong>confiance</strong> : avis, présentation des hôtes, réponses rapides.</li><li>Un <strong>contact direct</strong> et une demande de disponibilité simples, en français comme en anglais si vous visez l'international.</li></ul>" },
        { h2: "Se rendre visible sur les recherches touristiques",
          html: "<p>Les voyageurs cherchent « location vue mer Sainte-Anne », « gîte Soufrière avec piscine », « où dormir aux Saintes ». Un site bien optimisé sur ces requêtes locales vous positionne en dehors des plateformes, là où la concurrence est moins féroce et où vous captez le voyageur qui veut réserver en direct.</p>" },
        { h2: "Notre approche pour l'hébergement en Guadeloupe",
          html: "<p>On crée un site vitrine élégant qui met en valeur votre bien, avec galerie photo, descriptif, atouts du secteur et formulaire de demande de réservation. Objectif : transformer un site vitrine (dès 250€) en canal de réservation directe qui, saison après saison, réduit votre dépendance aux commissions.</p>" },
      ],
      callout: "La clientèle métropolitaine réserve souvent son séjour d'hiver dès l'automne. Être visible et crédible en ligne à ce moment-là — avec un vrai site, pas seulement une annonce — fait la différence entre une saison pleine et une saison à trous.",
      faq: [
        { q: "Un site va-t-il vraiment remplacer Airbnb et Booking ?", a: "Pas du jour au lendemain, et ce n'est pas le but. Les plateformes restent utiles pour la découverte. Votre site sert à capter les réservations directes — clients fidèles, recommandations, voyageurs qui préfèrent traiter avec vous — et donc à récupérer les commissions sur cette part-là." },
        { q: "Combien coûte un site pour mon gîte ou ma location en Guadeloupe ?", a: "Un site vitrine professionnel avec galerie photo et formulaire de demande démarre à 250€. Pour un moteur de réservation avec calendrier et paiement en ligne, on établit un devis selon vos besoins." },
        { q: "Je loue un seul bien, est-ce que ça vaut le coup ?", a: "Oui. Même pour un seul gîte, quelques réservations directes par an récupérées sur les commissions amortissent largement le site, et vous construisez un actif qui vous appartient." },
        { q: "Pouvez-vous faire un site en français et en anglais ?", a: "Oui, c'est recommandé si vous visez la clientèle internationale. On peut prévoir une version bilingue pour ne pas perdre les voyageurs anglophones." },
      ],
    },
  },

  /* ═════════════════ BÂTIMENT & ARTISANS ═════════════════ */
  'batiment-artisans': {
    guadeloupe: {
      title: "Site internet pour un artisan du bâtiment en Guadeloupe",
      desc: "Maçon, couvreur, électricien, plombier ou entreprise de rénovation en Guadeloupe : un site + Google pour recevoir des demandes de devis. Guide GroupSolution, site vitrine dès 250€.",
      keywords: "site internet artisan Guadeloupe, BTP 971, devis en ligne bâtiment Guadeloupe, référencement plombier Baie-Mahault, entreprise rénovation Pointe-à-Pitre, site maçon couvreur Antilles",
      tag: "Bâtiment & artisans · Guadeloupe",
      h1: "Artisans et bâtiment en Guadeloupe : un site qui génère des demandes de devis",
      lead: "Le BTP guadeloupéen ne manque pas de travail — construction, rénovation, mise aux normes parasismiques et paracycloniques. Mais beaucoup d'artisans restent invisibles en ligne, alors que leurs futurs clients, eux, cherchent sur Google.",
      sections: [
        { h2: "Vos clients cherchent un artisan en ligne, pas dans l'annuaire",
          html: "<p>Quand un particulier de Baie-Mahault a une fuite, ou qu'un propriétaire prépare une rénovation à Pointe-à-Pitre, il tape « plombier près de moi », « couvreur Guadeloupe » ou « entreprise rénovation 971 ». S'il ne tombe que sur vos concurrents, vous ne serez même pas dans la short-list. Un site simple, clair, avec vos réalisations et un bouton devis, vous remet dans la course.</p>" },
        { h2: "Ce qui inspire confiance dans le bâtiment",
          html: "<ul><li><strong>Vos chantiers en photos</strong> (avant/après) : rien ne rassure plus qu'un travail visible.</li><li><strong>Vos spécialités</strong> clairement listées : gros œuvre, toiture, électricité, rénovation, respect des normes parasismiques.</li><li><strong>Les avis clients</strong> et références locales.</li><li><strong>Un formulaire de devis</strong> et un numéro cliquable : capter la demande au moment où elle est chaude.</li></ul>" },
        { h2: "Le contexte antillais : normes et rénovation",
          html: "<p>Aux Antilles, la contrainte sismique et cyclonique est un vrai sujet : les clients cherchent des artisans qui maîtrisent les normes de construction et de mise en sécurité. Mettre en avant cette expertise sur votre site — sans surpromesse — vous distingue et attire des chantiers de rénovation et de mise aux normes, un marché porteur en Guadeloupe.</p>" },
        { h2: "Notre approche pour les artisans du BTP",
          html: "<p>On construit un site vitrine efficace : présentation de vos métiers, galerie de réalisations, zone d'intervention, avis et formulaire de devis relié à votre téléphone. Pas de site vitrine décoratif — un outil qui fait sonner le téléphone. Démarrage à 250€, avec le référencement local pour apparaître sur « votre métier + votre secteur ».</p>" },
      ],
      callout: "Un artisan qui apparaît sur Google avec des photos de chantiers et quelques bons avis capte des demandes de devis en continu — pendant que le concurrent sans site attend encore le bouche-à-oreille.",
      faq: [
        { q: "Je suis débordé, à quoi bon un site si je n'ai pas le temps ?", a: "Un site n'est pas fait pour vous submerger, mais pour choisir vos chantiers : quand les demandes arrivent en ligne, vous prenez les plus rentables et déclinez le reste. C'est un actif qui travaille pour vous même quand vous êtes sur un chantier." },
        { q: "Combien coûte un site pour mon entreprise de bâtiment en Guadeloupe ?", a: "Un site vitrine professionnel avec galerie de réalisations et formulaire de devis démarre à 250€. On adapte selon le nombre de métiers et de pages, avec un devis transparent." },
        { q: "Faut-il beaucoup de photos ?", a: "Quelques bonnes photos de chantiers terminés suffisent pour démarrer. On vous montre comment les prendre correctement avec un simple téléphone, et on enrichit la galerie au fil des chantiers." },
        { q: "Vais-je apparaître sur Google pour ma commune ?", a: "C'est l'objectif : on optimise le site et votre fiche Google pour les recherches « métier + commune » (plombier Baie-Mahault, couvreur Le Gosier…), là où vos clients vous cherchent vraiment." },
      ],
    },
  },

};
