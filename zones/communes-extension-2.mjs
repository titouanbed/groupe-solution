/* ═══════════════════════════════════════════════════════════
   Extension 2 : littoral biterrois, vallée de l'Hérault, Gard (Camargue,
   Rhône, Uzège, Cévennes). Mêmes règles : contenu propre et vrai.
   Chaque entrée embarque directement son enrichissement (champ enrich).
   ═══════════════════════════════════════════════════════════ */
export const EXTENSION_2 = [
  {
    slug: 'serignan', name: 'Sérignan', cp: '34410', lat: 43.2810, lng: 3.2770, metro: false, secteur: 'Biterrois',
    profil: "Entre Béziers et la mer, au bord de l'Orb, Sérignan associe un cœur de village commerçant, une plage préservée et le Musée régional d'art contemporain Occitanie, qui en fait une étape culturelle du littoral.",
    reperes: ["l'Orb", 'la plage de Sérignan', "le Musée régional d'art contemporain", 'le centre du village', 'les campings du littoral'],
    tissu: "commerces du centre, campings et hébergements, restaurants, artisans, activités culturelles et de loisirs",
    web: { angle: "À Sérignan, la même entreprise sert des habitants à l'année et des vacanciers l'été. Un site qui sait parler aux deux — horaires de saison, réservation, infos pratiques — évite de perdre la moitié de sa clientèle.",
      faq: { q: "Comment gérer en ligne une clientèle à l'année et une clientèle d'été ?", a: "Avec un site qui met en avant l'offre de saison au bon moment (bannière, horaires, réservation) sans faire disparaître l'offre de l'année. Les contenus changent, la structure reste : c'est simple à tenir à jour." } },
    auto: { angle: "Les entreprises sérignanaises vivent un calendrier en deux temps : un été intense, une vie locale plus calme le reste de l'année.",
      cases: [['Réservations de saison', "Emplacements, locations ou tables réservés et payés en ligne, avec rappels et liste d'attente."], ['Messages aux vacanciers', "Accès, horaires, recommandations et demandes d'avis envoyés automatiquement."], ['Relance hors saison', "Les clients de l'été reçoivent une proposition pour revenir, au bon moment."]],
      faq: { q: "Peut-on préparer la saison dès l'hiver ?", a: "Oui : réservations anticipées, offres pour les clients fidèles et contenus de saison se programment à l'avance, pour que tout tourne dès les premiers beaux jours." } },
    enrich: {
      enjeux: ["Capter les visiteurs du musée d'art contemporain qui cherchent où déjeuner ou dormir sans quitter Sérignan.", "Tenir des horaires justes toute l'année alors qu'ils changent entre la saison et le reste de l'année.", "Rester visible face aux grandes stations voisines sur les recherches « plage » et « camping »."],
      recit: "Exemple : un restaurant du centre de Sérignan reçoit l'été des vacanciers qui réservent au dernier moment, et l'hiver des habitants fidèles. Un site clair affiche la carte de saison et prend les réservations en ligne ; un assistant répond la nuit aux questions sur les horaires et l'accès depuis la plage. En octobre, un message part automatiquement aux clients de l'été pour annoncer les soirées d'hiver. Le gérant garde la main sur tout, sans passer ses soirées au téléphone.",
      faqSite: { q: "Un site peut-il attirer les visiteurs du musée ?", a: "Oui, s'il répond à ce qu'ils cherchent autour de leur visite : où manger, horaires, accès. Une fiche Google soignée et une page claire suffisent souvent à devenir l'adresse de référence près du musée." },
      faqAuto: { q: "Un assistant IA peut-il répondre à nos clients en saison ?", a: "Oui : il répond à partir de vos informations validées (horaires, accès, menus), dans plusieurs langues si besoin, et transmet à l'équipe tout ce qui sort du cadre." } }
  },
  {
    slug: 'valras-plage', name: 'Valras-Plage', cp: '34350', lat: 43.2480, lng: 3.2910, metro: false, secteur: 'Biterrois',
    profil: "Station balnéaire familiale à l'embouchure de l'Orb, Valras-Plage vit de son port, de sa longue plage de sable et d'une activité touristique qui multiplie la population en été.",
    reperes: ["l'embouchure de l'Orb", 'le port', 'la plage', 'le front de mer', 'les campings'],
    tissu: "hébergements et campings, restaurants et commerces du front de mer, activités nautiques, pêche, locations saisonnières",
    web: { angle: "À Valras-Plage, les familles préparent leurs vacances des mois à l'avance puis décident des restaurants et activités sur place, sur leur téléphone. Il faut être visible aux deux moments.",
      faq: { q: "Faut-il un site pour une location saisonnière à Valras-Plage ?", a: "Oui, pour recevoir des réservations directes sans commission et fidéliser les familles qui reviennent chaque été. Un calendrier synchronisé avec les plateformes évite les doubles réservations." } },
    auto: { angle: "À Valras-Plage, l'été concentre l'activité : chaque réservation, arrivée ou question pratique doit être traitée vite.",
      cases: [['Locations sans paperasse', "Contrats, cautions, états des lieux et messages aux locataires automatisés."], ['Activités nautiques réservées', "Créneaux, paiement, décharge en ligne et report automatique selon la météo marine."], ['Poisson du port en ligne', "Arrivage du jour publié, commandes et retraits organisés par créneau."]],
      faq: { q: "Peut-on tenir compte de la météo marine automatiquement ?", a: "Oui : les prévisions de vent et de houle peuvent déclencher des propositions de report aux clients concernés, que vous validez d'un clic." } },
    enrich: {
      enjeux: ["Transformer les familles d'une semaine en clients fidèles qui réservent en direct l'année suivante.", "Absorber le pic d'appels de juillet-août sans recruter un standard supplémentaire.", "Se distinguer sur Google Maps parmi des dizaines d'établissements similaires du front de mer."],
      recit: "Imaginons un loueur de paddles et de kayaks installé près du port de Valras-Plage. En juillet, le téléphone sonne sans arrêt pendant qu'il est sur l'eau. Un agent vocal IA prend les appels, propose les créneaux libres et envoie le lien de paiement ; la veille, la météo marine est vérifiée automatiquement et un report est proposé si le vent forcit. Le soir, il consulte un résumé des réservations et des questions reçues au lieu d'écouter trente messages.",
      faqSite: { q: "Comment ressortir sur Google Maps face aux autres établissements du front de mer ?", a: "Photos récentes et réelles, avis nombreux et récents, horaires de saison exacts, catégorie précise et réservation en ligne : sur un front de mer très fréquenté, c'est la fiche la plus complète qui gagne le clic." },
      faqAuto: { q: "Un agent vocal peut-il prendre les réservations pendant que je travaille ?", a: "Oui : il décroche, comprend la demande, propose les créneaux disponibles et envoie la confirmation. Il indique qu'il s'agit d'un assistant automatique et vous transfère les cas particuliers." } }
  },
  {
    slug: 'vias', name: 'Vias', cp: '34450', lat: 43.3120, lng: 3.4180, metro: false, secteur: "Agde & Pézenas",
    profil: "Entre Agde et Portiragnes, Vias réunit un village ancien et un littoral très tourné vers l'hôtellerie de plein air, traversé par le Canal du Midi.",
    reperes: ['le Canal du Midi', 'Vias-Plage', 'le vieux village', 'les campings'],
    tissu: "campings et hôtellerie de plein air, commerces saisonniers, restaurants, artisans, activités de loisirs",
    web: { angle: "Vias compte de nombreux campings et hébergements : pour se démarquer, il faut un site qui montre l'expérience réelle et permet de réserver en direct, sans dépendre uniquement des comparateurs.",
      faq: { q: "Un camping a-t-il intérêt à investir dans son propre site ?", a: "Oui : réservations directes sans commission, fichier clients à soi, offres pour les habitués. Le site devient le meilleur canal de vente au fil des saisons." } },
    auto: { angle: "L'hôtellerie de plein air de Vias gère en quelques semaines des centaines d'arrivées, de départs et de demandes.",
      cases: [['Arrivées fluides', "Check-in en ligne, plan du camping et code d'accès envoyés avant l'arrivée."], ['Recrutement saisonnier', "Candidatures centralisées, tri et entretiens planifiés automatiquement."], ['Planning d\'entretien', "Ménages et interventions générés à partir des départs du jour."]],
      faq: { q: "Pouvez-vous gérer le recrutement saisonnier d'un camping ?", a: "Oui : c'est un domaine que Groupe Solution maîtrise avec sa plateforme Solution Recrutement. Centraliser, trier selon vos critères et planifier les entretiens se fait automatiquement." } },
    enrich: {
      enjeux: ["Réduire la dépendance aux comparateurs en convertissant les visiteurs du site en réservations directes.", "Préparer la saison en recrutant vite des profils fiables pour l'accueil, l'entretien et l'animation.", "Répondre dans plusieurs langues à une clientèle européenne nombreuse."],
      recit: "Exemple : un camping familial de Vias-Plage reçoit en juin des centaines de demandes en français, néerlandais et allemand. Un assistant multilingue répond à partir des informations validées (tarifs affichés par le camping lui-même, services, animaux), qualifie la demande et propose de réserver en ligne. Le jour de l'arrivée, le plan et le code d'accès partent automatiquement. L'équipe d'accueil passe moins de temps au comptoir et davantage avec les familles.",
      faqSite: { q: "Comment montrer l'ambiance d'un camping sur son site ?", a: "Par des photos et vidéos réelles, un plan interactif des emplacements, les animations de la saison et des avis. Les familles veulent se projeter : montrez ce qu'elles vivront, simplement." },
      faqAuto: { q: "Un assistant peut-il répondre en néerlandais ou en allemand ?", a: "Oui : il répond dans la langue du client à partir de vos informations validées, et vous pouvez relire les réponses sensibles avant envoi." } }
  },
  {
    slug: 'portiragnes', name: 'Portiragnes', cp: '34420', lat: 43.3040, lng: 3.3370, metro: false, secteur: 'Biterrois',
    profil: "Village traversé par le Canal du Midi et prolongé par une station balnéaire, Portiragnes attire plaisanciers du canal, familles et amateurs de nature autour de ses plages.",
    reperes: ['le Canal du Midi', 'Portiragnes-Plage', 'le port du canal', 'le village'],
    tissu: "hébergements, loueurs de bateaux et de vélos, restaurants, commerces saisonniers, artisans",
    web: { angle: "À Portiragnes, les plaisanciers du Canal du Midi et les vacanciers de la plage ne cherchent pas la même chose. Un site bien organisé répond à chacun : escale, location, restaurant, plage.",
      faq: { q: "Comment toucher les plaisanciers qui passent sur le Canal du Midi ?", a: "En étant visible sur les recherches d'escale (restaurant, commerce, services près du canal), avec une fiche Google précise et des horaires de saison. Beaucoup décident au dernier moment, depuis leur bateau." } },
    auto: { angle: "Loueurs et commerces de Portiragnes gèrent des réservations courtes, nombreuses et très dépendantes de la météo.",
      cases: [['Location de vélos et bateaux', "Réservation, caution, contrat et état des lieux en ligne."], ['Escales organisées', "Demandes des plaisanciers centralisées et confirmées automatiquement."], ['Avis après passage', "Demande d'avis envoyée automatiquement pour gagner en visibilité."]],
      faq: { q: "Les cautions peuvent-elles être gérées en ligne ?", a: "Oui : empreinte bancaire à la réservation, restitution automatique si tout va bien, et état des lieux photographié depuis le téléphone." } },
    enrich: {
      enjeux: ["Être trouvé par des plaisanciers qui décident de leur escale en cours de navigation.", "Gérer des locations courtes et nombreuses sans erreurs de caution ni de planning.", "Faire le lien entre la clientèle du canal et celle de la plage."],
      recit: "Imaginons un loueur de vélos près du port du canal à Portiragnes. Les plaisanciers réservent souvent la veille, depuis leur bateau. Le site affiche les vélos disponibles en temps réel, encaisse la caution et envoie le contrat ; au retour, l'état des lieux se fait en trois photos sur téléphone. Un message propose ensuite un itinéraire vers la plage ou vers le village voisin. Le loueur ne gère plus de carnet papier et n'oublie plus aucune caution.",
      faqSite: { q: "Un petit commerce du village a-t-il besoin d'un site ?", a: "Une fiche Google complète est la priorité ; un site simple la complète en présentant vos produits et vos horaires de saison. Pour une activité saisonnière, c'est souvent ce qui fait la différence avec le voisin." },
      faqAuto: { q: "Peut-on afficher la disponibilité en temps réel ?", a: "Oui : le stock (vélos, bateaux, créneaux) est mis à jour à chaque réservation et à chaque retour, et le site n'affiche que ce qui est réellement disponible." } }
  },
  {
    slug: 'pinet', name: 'Pinet', cp: '34850', lat: 43.4050, lng: 3.5100, metro: false, secteur: 'Bassin de Thau',
    profil: "Village viticole au nord de l'étang de Thau, Pinet a donné son nom à une appellation de vin blanc réputée, le Picpoul de Pinet, cultivée sur les coteaux qui dominent l'étang.",
    reperes: ['le vignoble du Picpoul de Pinet', 'les caves et domaines', 'le village', "la vue sur l'étang de Thau"],
    tissu: "domaines viticoles et caves, oenotourisme, artisans, petits commerces",
    web: { angle: "Le Picpoul de Pinet est recherché par les amateurs et les restaurateurs de toute la région. Un domaine qui explique son terroir et vend en ligne capte une demande qui existe déjà.",
      faq: { q: "Comment un domaine de Picpoul peut-il se démarquer en ligne ?", a: "En racontant son terroir et ses cuvées avec de vraies images, en proposant visite et achat en ligne, et en ciblant les recherches d'accords avec les coquillages de l'étang. L'appellation est connue : il faut être visible dessus." } },
    auto: { angle: "Les domaines de Pinet vendent au caveau, aux restaurateurs du bassin de Thau et en ligne, avec de petites équipes.",
      cases: [['Commandes des restaurateurs', "Catalogue pro, commandes consolidées et factures automatiques."], ['Dégustations réservées', "Créneaux, groupes et rappels gérés en ligne."], ['Stock unique', "Caveau, salons et boutique en ligne partagent le même inventaire."]],
      faq: { q: "Peut-on simplifier les commandes des restaurateurs de l'étang ?", a: "Oui : un espace professionnel avec vos tarifs pros, les cuvées disponibles, une commande en quelques clics et une facture générée automatiquement." } },
    enrich: {
      enjeux: ["Capter les amateurs qui cherchent « Picpoul de Pinet » avant un repas de coquillages.", "Gérer la demande professionnelle des restaurants du bassin sans ressaisie.", "Accueillir des visiteurs au domaine sans que la dégustation désorganise le travail des vignes."],
      recit: "Exemple : un domaine familial de Pinet vend une partie de sa récolte aux restaurants du bassin de Thau. Les commandes arrivaient par SMS, parfois le samedi soir. Désormais, un espace pro affiche les cuvées disponibles ; les commandes sont regroupées pour la tournée du mardi et la facture part toute seule. Côté particuliers, la réservation des dégustations se fait en ligne, avec un rappel la veille. La vigneronne consacre son temps au chai plutôt qu'aux carnets de commandes.",
      faqSite: { q: "Faut-il un site en anglais pour un domaine de Picpoul ?", a: "Souvent utile : une partie des visiteurs du bassin de Thau est étrangère. Une version anglaise de l'essentiel (domaine, cuvées, visite, contact) suffit en général." },
      faqAuto: { q: "Peut-on préparer automatiquement les tournées de livraison ?", a: "Oui : les commandes de la semaine sont regroupées par secteur et par jour de livraison, avec les bons de préparation générés automatiquement." } }
  },
  {
    slug: 'saint-guilhem-le-desert', name: 'Saint-Guilhem-le-Désert', cp: '34150', lat: 43.7330, lng: 3.5500, metro: false, secteur: "Vallée de l'Hérault",
    profil: "Blotti au fond des gorges de l'Hérault autour de l'abbaye de Gellone, étape des chemins de Saint-Jacques-de-Compostelle inscrite au patrimoine mondial, Saint-Guilhem-le-Désert accueille chaque année de très nombreux visiteurs.",
    reperes: ["l'abbaye de Gellone", "les gorges de l'Hérault", 'les ruelles médiévales', 'le chemin de Compostelle'],
    tissu: "restaurants et commerces du village, artisans d'art, hébergements, guides et activités de pleine nature",
    web: { angle: "Les visiteurs de Saint-Guilhem préparent leur venue en ligne et cherchent sur place où déjeuner ou acheter un souvenir authentique. Dans un village très fréquenté, les établissements les mieux présentés captent l'essentiel de l'attention.",
      faq: { q: "Comment se démarquer dans un village aussi touristique ?", a: "Par l'authenticité : photos réelles, histoire de votre maison ou de vos créations, avis nombreux, horaires précis et, si possible, réservation ou vente en ligne pour prolonger la visite." } },
    auto: { angle: "À Saint-Guilhem, l'affluence est forte et les équipes réduites : chaque question répétitive est du temps en moins pour les visiteurs.",
      cases: [['Réservations de groupes', "Demandes de groupes et de pèlerins centralisées, devis et confirmations automatiques."], ['Vente des créations en ligne', "Les visiteurs retrouvent et commandent vos pièces une fois rentrés chez eux."], ['Informations pratiques automatiques', "Accès, stationnement, horaires : réponses automatiques aux questions fréquentes."]],
      faq: { q: "Pouvez-vous gérer les réservations de groupes et de pèlerins ?", a: "Oui : un formulaire dédié recueille les informations utiles, un devis ou une confirmation part automatiquement, et un rappel est envoyé avant la date." } },
    enrich: {
      enjeux: ["Informer en amont les visiteurs sur l'accès et le stationnement, une question qui revient sans cesse.", "Prolonger la relation avec des visiteurs venus de loin, qui ne repasseront pas avant longtemps.", "Accueillir les marcheurs du chemin de Compostelle avec des services adaptés et réservables."],
      recit: "Imaginons une artisane céramiste installée dans une ruelle de Saint-Guilhem-le-Désert. Beaucoup de visiteurs admirent ses pièces mais hésitent à les transporter. Un QR code en boutique renvoie vers sa boutique en ligne : chaque pièce unique y est photographiée, décrite et vendue avec une expédition assurée. Quand une pièce part à l'atelier, elle disparaît automatiquement du site. Des mois après leur visite, des clients de toute la France commandent encore.",
      faqSite: { q: "Une boutique en ligne pour des pièces uniques, c'est gérable ?", a: "Oui : chaque pièce a sa fiche, créée en quelques minutes depuis le téléphone, et disparaît dès qu'elle est vendue, en boutique ou en ligne." },
      faqAuto: { q: "Peut-on répondre automatiquement aux questions d'accès et de stationnement ?", a: "Oui : un assistant sur le site et par message répond à partir de vos informations validées, à toute heure, et vous laisse les échanges qui comptent." } }
  },
  {
    slug: 'saint-jean-de-fos', name: 'Saint-Jean-de-Fos', cp: '34150', lat: 43.7010, lng: 3.5520, metro: false, secteur: "Vallée de l'Hérault",
    profil: "Village de potiers à l'entrée des gorges de l'Hérault, près du Pont du Diable, Saint-Jean-de-Fos perpétue une tradition céramique ancienne, mise en valeur par sa maison de la poterie.",
    reperes: ['la tradition potière', 'la maison de la poterie', 'le Pont du Diable tout proche', 'les vignes'],
    tissu: "potiers et artisans d'art, domaines viticoles, hébergements, restaurants",
    web: { angle: "Pour un potier de Saint-Jean-de-Fos, le site est l'atelier ouvert en permanence : il montre le savoir-faire, annonce les stages et permet de commander.",
      faq: { q: "Comment vendre des stages de poterie en ligne ?", a: "Avec un calendrier des stages, une réservation et un acompte en ligne, et des rappels automatiques. Les stagiaires viennent souvent de loin : tout doit être clair avant leur arrivée." } },
    auto: { angle: "Les ateliers de Saint-Jean-de-Fos combinent création, vente, stages et accueil de visiteurs.",
      cases: [['Stages réservés en ligne', "Calendrier, acompte, rappels et liste d'attente automatiques."], ['Commandes sur-mesure', "Demande guidée, devis, suivi de fabrication envoyé au client."], ['Expéditions fragiles', "Étiquettes, assurance et suivi générés automatiquement."]],
      faq: { q: "Peut-on gérer une liste d'attente pour des stages complets ?", a: "Oui : dès qu'une place se libère, la personne suivante est prévenue et peut réserver en un clic." } },
    enrich: {
      enjeux: ["Transformer la visite d'atelier en achat ou en inscription à un stage, même après le départ du visiteur.", "Remplir les stages en basse saison grâce à une clientèle régionale.", "Expédier des pièces fragiles sans perdre de temps en logistique."],
      recit: "Exemple : un atelier de poterie de Saint-Jean-de-Fos propose des stages le week-end. Les inscriptions arrivaient par téléphone et les désistements laissaient des places vides. Le calendrier en ligne encaisse désormais un acompte, envoie le matériel à prévoir et relance la liste d'attente dès qu'une place se libère. Entre deux stages, les créations sont photographiées et mises en vente sur le site en quelques minutes.",
      faqSite: { q: "Que doit montrer le site d'un potier ?", a: "Le geste et l'atelier, des pièces photographiées avec soin, les stages à venir et un moyen simple de commander ou de réserver. Moins de texte, plus d'images vraies." },
      faqAuto: { q: "Les désistements peuvent-ils être comblés automatiquement ?", a: "Oui : une annulation déclenche un message aux personnes en liste d'attente, et la première qui confirme obtient la place." } }
  },
  {
    slug: 'vauvert', name: 'Vauvert', cp: '30600', lat: 43.6940, lng: 4.2760, metro: false, secteur: 'Petite Camargue',
    profil: "Entre Nîmes et la Camargue, Vauvert s'étend des Costières de Nîmes aux marais de la Petite Camargue. Commune agricole et viticole, elle garde de fortes traditions camarguaises.",
    reperes: ['les Costières de Nîmes', 'la Petite Camargue', 'le centre-ville', 'les traditions camarguaises'],
    tissu: "domaines viticoles, exploitations agricoles, artisans, commerces, manades",
    web: { angle: "À Vauvert, beaucoup d'entreprises servent autant Nîmes que la Camargue. Un site qui montre clairement la zone desservie et le savoir-faire local élargit la clientèle.",
      faq: { q: "Faut-il viser Nîmes ou la Camargue sur mon site ?", a: "Les deux si vous y travaillez réellement : zone d'intervention claire sur Google, réalisations localisées et contenus qui parlent de votre terroir. La précision rassure plus qu'une longue liste de villes." } },
    auto: { angle: "Domaines, exploitations et artisans de Vauvert gagnent du temps en automatisant ventes, livraisons et administratif.",
      cases: [['Vente directe organisée', "Commandes en ligne, retrait ou livraison groupée."], ['Accueil de groupes', "Visites et journées réservées, devis et rappels automatiques."], ['Traçabilité simplifiée', "Interventions et lots enregistrés en quelques secondes."]],
      faq: { q: "Pouvez-vous gérer les réservations de journées en manade ?", a: "Oui : formulaire de demande, devis selon le nombre de participants, acompte en ligne et informations pratiques envoyées automatiquement." } },
    enrich: {
      enjeux: ["Faire connaître les vins des Costières au-delà du cercle des habitués.", "Organiser les ventes directes entre Nîmes et la Camargue sans multiplier les allers-retours.", "Présenter les traditions locales aux visiteurs sans perdre en authenticité."],
      recit: "Imaginons un domaine des Costières de Nîmes installé à Vauvert, qui livre des particuliers à Nîmes chaque vendredi. Les commandes passées en ligne sont regroupées automatiquement par quartier, la tournée est calculée pour limiter les kilomètres, et chaque client reçoit l'heure de passage estimée. Les invitations aux portes ouvertes partent en priorité aux clients qui ont déjà commandé. Le vigneron garde ses vendredis pour la livraison, pas pour la paperasse.",
      faqSite: { q: "Un domaine a-t-il besoin d'une boutique en ligne complète ?", a: "Pas forcément au début : un catalogue avec commande et retrait ou livraison groupée suffit souvent. On fait évoluer selon vos volumes." },
      faqAuto: { q: "Peut-on calculer automatiquement la tournée de livraison ?", a: "Oui : les commandes de la semaine sont regroupées et l'ordre de passage est optimisé ; chaque client est prévenu de son créneau." } }
  },
  {
    slug: 'saint-gilles', name: 'Saint-Gilles', cp: '30800', lat: 43.6780, lng: 4.4320, metro: false, secteur: 'Petite Camargue',
    profil: "Porte de la Camargue gardoise, Saint-Gilles est connue pour son abbatiale romane, étape des chemins de Saint-Jacques-de-Compostelle inscrite au patrimoine mondial, et pour son port sur le canal.",
    reperes: ["l'abbatiale de Saint-Gilles", 'le port sur le canal', 'la Camargue gardoise', 'le centre ancien'],
    tissu: "commerces, exploitations agricoles et rizicoles de Camargue, hébergements, loueurs de bateaux, artisans",
    web: { angle: "Pèlerins, plaisanciers et visiteurs de la Camargue passent par Saint-Gilles. Les entreprises qui apparaissent sur leurs recherches transforment ce passage en clientèle.",
      faq: { q: "Comment attirer les visiteurs de l'abbatiale et de la Camargue ?", a: "En répondant à leurs recherches pratiques (où manger, dormir, louer un bateau, visiter), avec une fiche Google soignée, des photos réelles et une réservation simple." } },
    auto: { angle: "À Saint-Gilles, tourisme fluvial, agriculture camarguaise et commerce local se croisent, avec des besoins de réservation et de logistique.",
      cases: [['Location de bateaux', "Réservation, caution, briefing et état des lieux en ligne."], ['Accueil des marcheurs', "Réservations d'étape et informations pratiques envoyées automatiquement."], ['Vente de produits de Camargue', "Commandes en ligne et expéditions organisées."]],
      faq: { q: "Peut-on proposer une réservation d'étape pour les marcheurs de Compostelle ?", a: "Oui : réservation en ligne avec les informations utiles (arrivée, repas, départ), confirmation et rappel automatiques." } },
    enrich: {
      enjeux: ["Capter les pèlerins et marcheurs qui planifient leurs étapes à l'avance, souvent sur mobile.", "Valoriser les produits de Camargue auprès de visiteurs qui veulent en rapporter.", "Gérer la saison fluviale sans multiplier les échanges téléphoniques."],
      recit: "Exemple : une chambre d'hôtes proche de l'abbatiale de Saint-Gilles accueille des marcheurs du chemin de Saint-Jacques. Ils réservent souvent la veille, parfois en langue étrangère. Un formulaire de réservation d'étape recueille l'heure d'arrivée et les besoins de repas, confirme automatiquement et envoie l'itinéraire depuis le chemin. Le lendemain matin, un message propose de laisser un avis. L'hôte se concentre sur l'accueil plutôt que sur les allers-retours de messages.",
      faqSite: { q: "Un hébergement d'étape a-t-il besoin d'un site ?", a: "Oui : les marcheurs comparent et réservent en ligne. Un site clair, en plusieurs langues si possible, avec réservation directe, vous évite de dépendre uniquement des plateformes." },
      faqAuto: { q: "Les messages aux voyageurs peuvent-ils partir dans leur langue ?", a: "Oui : confirmations, informations d'arrivée et demandes d'avis sont envoyées automatiquement dans la langue choisie par le voyageur." } }
  },
  {
    slug: 'beaucaire', name: 'Beaucaire', cp: '30300', lat: 43.8080, lng: 4.6440, metro: false, secteur: 'Rhône gardois',
    profil: "Sur la rive droite du Rhône, face à Tarascon, Beaucaire est dominée par son château médiéval et fut le siège d'une grande foire historique. Ville commerçante et logistique, elle profite de sa position entre Nîmes, Arles et Avignon.",
    reperes: ['le château de Beaucaire', 'le Rhône', 'le port de plaisance', 'le centre historique', 'les zones d’activités'],
    tissu: "commerces, entreprises de logistique et de transport, artisans, restauration, tourisme fluvial",
    web: { angle: "À la croisée du Gard, des Bouches-du-Rhône et du Vaucluse, les entreprises de Beaucaire servent trois bassins. Leur visibilité en ligne doit refléter cette position stratégique.",
      faq: { q: "Comment être visible à la fois côté Gard et côté Provence ?", a: "Avec une zone d'intervention précise sur Google, des pages de services claires et des réalisations localisées des deux côtés du Rhône." } },
    auto: { angle: "Transport, logistique et commerce beaucairois manipulent des flux importants de commandes et de documents.",
      cases: [['Documents de transport lus par IA', "Bons de livraison et lettres de voiture extraits et saisis automatiquement."], ['Suivi des livraisons', "Statuts et preuves de livraison remontent seuls, le client est informé."], ['Rapprochement factures', "Écarts entre commandes, livraisons et factures détectés automatiquement."]],
      faq: { q: "L'IA peut-elle lire nos bons de livraison papier ?", a: "Oui : une photo ou un scan suffit, les informations sont extraites et contrôlées ; les cas douteux vous sont soumis avant intégration." } },
    enrich: {
      enjeux: ["Profiter d'une position entre trois départements sans se disperser dans la communication.", "Réduire la ressaisie des documents de transport et de livraison, très nombreuse dans la logistique.", "Faire connaître l'offre touristique autour du château et du Rhône aux visiteurs de passage."],
      recit: "Imaginons une entreprise de transport basée dans une zone d'activités de Beaucaire. Chaque soir, les chauffeurs rapportent des dizaines de bons de livraison signés. Désormais, ils les photographient sur place : les informations sont lues automatiquement, rapprochées des commandes, et le client reçoit sa preuve de livraison dans l'heure. Les écarts sont signalés à l'exploitation le lendemain matin. La facturation part en fin de semaine sans ressaisie.",
      faqSite: { q: "Une entreprise de logistique a-t-elle besoin d'un site soigné ?", a: "Oui : les donneurs d'ordres vérifient votre sérieux en ligne. Capacités, zone desservie, certifications et un contact direct suffisent à rassurer." },
      faqAuto: { q: "Peut-on envoyer automatiquement les preuves de livraison aux clients ?", a: "Oui : dès que le bon signé est photographié, il est associé à la commande et transmis au client, avec l'heure de livraison." } }
  },
  {
    slug: 'uzes', name: 'Uzès', cp: '30700', lat: 44.0120, lng: 4.4190, metro: false, secteur: 'Uzège',
    profil: "Premier duché de France, Uzès séduit par sa place aux Herbes, son marché réputé et ses rues de pierre blonde. Proche du Pont du Gard, la ville attire une clientèle touristique et résidentielle exigeante.",
    reperes: ['le Duché', 'la place aux Herbes', 'le marché', 'les rues de pierre blonde', 'le Pont du Gard tout proche'],
    tissu: "commerces et boutiques de caractère, restaurants, hébergements de charme, artisans d'art, agences immobilières",
    web: { angle: "À Uzès, la clientèle attend un niveau de présentation élevé. Un site élégant, rapide et bien référencé est indispensable pour les boutiques, tables et hébergements de charme.",
      faq: { q: "Quel site pour un hébergement de charme à Uzès ?", a: "Un site sobre et visuel, avec de très belles photos réelles, la réservation directe et une version anglaise. La clientèle compare beaucoup : l'image doit être à la hauteur du lieu." } },
    auto: { angle: "Commerces, hébergements et agences d'Uzès gèrent une clientèle souvent internationale et exigeante.",
      cases: [['Conciergerie IA multilingue', "Questions des clients traitées dans leur langue, à partir de vos informations validées."], ['Gestion locative de prestige', "Arrivées, ménages et comptes rendus propriétaires orchestrés automatiquement."], ['Précommandes du marché', "Les clients réservent en ligne et retirent au stand le samedi."]],
      faq: { q: "Pouvez-vous gérer une clientèle internationale ?", a: "Oui : messages et réponses automatiques dans plusieurs langues, avec votre validation pour les échanges sensibles." } },
    enrich: {
      enjeux: ["Maintenir une image haut de gamme cohérente entre la boutique physique et la présence en ligne.", "Répondre vite, et en anglais, à une clientèle internationale qui réserve longtemps à l'avance.", "Profiter du marché hebdomadaire pour fidéliser des clients venus de toute la région."],
      recit: "Exemple : une agence de location de maisons de caractère autour d'Uzès reçoit des demandes en anglais, néerlandais et allemand. Un assistant répond à partir des fiches validées des maisons, propose les disponibilités et transmet les demandes sérieuses à l'équipe. Après chaque séjour, le ménage est planifié automatiquement et le propriétaire reçoit un compte rendu. L'agence gère davantage de maisons sans alourdir ses journées.",
      faqSite: { q: "Comment refléter le caractère d'Uzès sur un site ?", a: "Par la sobriété : photos lumineuses et réelles, typographie soignée, peu de texte et une prise de contact immédiate. La qualité perçue en ligne doit égaler celle du lieu." },
      faqAuto: { q: "Les comptes rendus aux propriétaires peuvent-ils être automatiques ?", a: "Oui : séjours, ménages, incidents et revenus du mois sont compilés et envoyés automatiquement à chaque propriétaire." } }
  },
  {
    slug: 'ales', name: 'Alès', cp: '30100', lat: 44.1250, lng: 4.0810, metro: false, secteur: 'Cévennes gardoises',
    profil: "Capitale des Cévennes gardoises, Alès est une ville industrielle et universitaire, siège de l'école d'ingénieurs IMT Mines Alès et d'un pôle mécanique. Commerces, PME et services y rayonnent sur tout le bassin alésien.",
    reperes: ["l'IMT Mines Alès", 'le Pôle mécanique', 'le centre-ville', 'le Gardon', 'la porte des Cévennes'],
    tissu: "PME industrielles et de services, commerces, professions libérales, artisans, établissements d'enseignement",
    web: { angle: "Le bassin alésien forme un marché à part, distinct de Nîmes et de Montpellier. Les entreprises qui travaillent leur référencement « à Alès » y trouvent une concurrence souvent moins préparée en ligne.",
      faq: { q: "Une entreprise d'Alès doit-elle viser Nîmes et Montpellier ?", a: "Commencez par votre bassin, où la demande locale est forte ; élargissez ensuite si vous y travaillez vraiment. La précision géographique est un atout." } },
    auto: { angle: "Les PME alésiennes, souvent industrielles, gèrent des volumes de commandes, de documents et de données qui se prêtent à l'automatisation avancée.",
      cases: [['Lecture de documents techniques', "Bons de commande, plans et fiches extraits et intégrés automatiquement."], ['Maintenance prédictive', "Capteurs et alertes avant la panne sur les machines critiques."], ['Assistant interne sur les procédures', "Les équipes interrogent vos procédures en langage naturel."]],
      faq: { q: "Pouvez-vous travailler avec une PME industrielle ?", a: "Oui : lecture de documents, connexion à l'ERP, capteurs et tableaux de bord font partie de nos sujets. On commence par un diagnostic des tâches les plus coûteuses." } },
    enrich: {
      enjeux: ["Garder les compétences techniques accessibles quand des collaborateurs expérimentés partent à la retraite.", "Réduire la ressaisie entre commandes, production et facturation dans les PME industrielles.", "Recruter dans un bassin où les profils techniques sont très demandés."],
      recit: "Imaginons une PME de mécanique du bassin alésien. Ses procédures sont éparpillées dans des classeurs et dans la mémoire de deux techniciens proches de la retraite. Un assistant interne est branché sur les documents numérisés : un nouveau collaborateur demande « comment régler la presse 3 pour cette pièce ? » et obtient la réponse avec la référence de la procédure. En parallèle, les bons de commande reçus par e-mail sont lus et saisis automatiquement dans l'ERP.",
      faqSite: { q: "Une PME industrielle a-t-elle besoin d'un site travaillé ?", a: "Oui, pour les clients comme pour le recrutement : capacités, certifications, secteurs servis et offres d'emploi. C'est souvent la première impression d'un donneur d'ordres ou d'un candidat." },
      faqAuto: { q: "Qu'est-ce qu'un assistant interne sur nos procédures ?", a: "Un outil qui répond en langage naturel aux questions des équipes, en citant le document d'où vient la réponse, avec les droits d'accès de chacun respectés." } }
  },
  {
    slug: 'vergeze', name: 'Vergèze', cp: '30310', lat: 43.7430, lng: 4.2210, metro: false, secteur: 'Nîmes',
    profil: "Dans la Vistrenque, entre Nîmes et Lunel, Vergèze est connue dans le monde entier pour sa source d'eau gazeuse Perrier. Autour de ce site industriel, la commune accueille artisans, commerces et entreprises de services.",
    reperes: ['la source Perrier', 'la Vistrenque', 'le centre du village', "l'axe Nîmes–Montpellier"],
    tissu: "artisans, sous-traitants et entreprises de services industriels, commerces, indépendants",
    web: { angle: "Entre Nîmes et Montpellier, les entreprises de Vergèze servent deux grandes métropoles. Un site clair sur les capacités et la zone desservie leur ouvre les deux marchés.",
      faq: { q: "Comment un sous-traitant peut-il se rendre visible en ligne ?", a: "En présentant clairement ses capacités, ses certifications, ses secteurs et quelques réalisations, avec un contact direct. Les acheteurs industriels recherchent précisément ces informations." } },
    auto: { angle: "Artisans et sous-traitants de Vergèze gagnent à automatiser documents, plannings et échanges avec leurs donneurs d'ordres.",
      cases: [['Réponses aux demandes de prix', "Demandes analysées, informations manquantes relancées, chiffrage préparé."], ['Planning des interventions', "Chantiers et interventions répartis et suivis en temps réel."], ['Documents qualité', "Rapports et attestations générés automatiquement."]],
      faq: { q: "Peut-on accélérer nos réponses aux demandes de prix ?", a: "Oui : les demandes sont lues, les informations manquantes réclamées automatiquement, et un chiffrage préparé selon vos règles, que vous validez." } },
    enrich: {
      enjeux: ["Répondre plus vite aux demandes de prix des donneurs d'ordres industriels, souvent pressés.", "Produire la documentation qualité exigée sans y passer ses soirées.", "Se faire connaître à la fois des entreprises nîmoises et montpelliéraines."],
      recit: "Exemple : un électricien industriel installé à Vergèze intervient pour plusieurs sites de la Vistrenque. Après chaque intervention, il dicte son rapport sur son téléphone : l'IA le met en forme, joint les photos, génère l'attestation demandée par le client et prépare la facture. Les demandes de prix reçues par e-mail sont triées et complétées automatiquement avant qu'il les chiffre. Il répond en quelques heures au lieu de quelques jours.",
      faqSite: { q: "Faut-il mentionner ses clients industriels sur son site ?", a: "Seulement avec leur accord écrit. Sinon, décrivez les secteurs et types d'interventions : c'est suffisant pour rassurer un acheteur." },
      faqAuto: { q: "Dicter ses rapports d'intervention, c'est fiable ?", a: "Oui, avec une relecture : l'IA met en forme ce que vous dictez, sans inventer ; vous validez avant l'envoi au client." } }
  },
  {
    slug: 'lamalou-les-bains', name: 'Lamalou-les-Bains', cp: '34240', lat: 43.5980, lng: 3.0800, metro: false, secteur: 'Haut-Languedoc',
    profil: "Station thermale de la vallée de l'Orb, au pied des monts du Haut-Languedoc, Lamalou-les-Bains accueille chaque année des curistes et des visiteurs attirés par la nature et les sentiers de randonnée.",
    reperes: ['les thermes', "la vallée de l'Orb", 'le Haut-Languedoc', 'les sentiers de randonnée'],
    tissu: "hébergements pour curistes, professions de santé, restaurants, commerces, activités de nature",
    web: { angle: "Les curistes de Lamalou préparent leur séjour de plusieurs semaines en ligne : hébergement, restaurants, activités. Un site rassurant et réservable fait la différence.",
      faq: { q: "Comment rassurer un curiste qui réserve pour trois semaines ?", a: "Photos réelles, description précise (accès aux thermes, équipements, calme), conditions claires et réservation directe. La confiance se joue sur les détails pratiques." } },
    auto: { angle: "À Lamalou, l'activité suit le rythme des cures : séjours longs, clientèle fidèle et nombreuses questions pratiques.",
      cases: [['Séjours de cure réservés', "Réservation, acompte, contrat et informations d'arrivée automatiques."], ['Fidélisation d\'une cure à l\'autre', "Proposition de réserver les mêmes dates l'année suivante."], ['Questions pratiques', "Réponses automatiques sur l'accès, les horaires et les services."]],
      faq: { q: "Peut-on relancer les curistes pour l'année suivante ?", a: "Oui : un message personnalisé leur propose de réserver à nouveau, au moment où ils préparent leur prochaine cure." } },
    enrich: {
      enjeux: ["Fidéliser une clientèle de curistes qui revient souvent chaque année.", "Rassurer des personnes parfois âgées ou fragilisées avec une information claire et accessible.", "Faire découvrir aux curistes les activités de nature du Haut-Languedoc pendant leur séjour."],
      recit: "Imaginons un propriétaire de meublés à Lamalou-les-Bains qui loue à des curistes. Chaque année, il rappelait lui-même ses anciens locataires pour savoir s'ils revenaient. Désormais, un message part automatiquement onze mois après le séjour, avec les mêmes dates proposées. À l'arrivée, un livret d'accueil numérique rappelle le chemin des thermes, les commerces et les balades faciles. Le propriétaire remplit son calendrier plus tôt et plus sereinement.",
      faqSite: { q: "Un site doit-il être adapté à des visiteurs âgés ?", a: "Oui : textes lisibles, contrastes suffisants, boutons larges et informations pratiques visibles. C'est aussi ce que recommandent les bonnes pratiques d'accessibilité." },
      faqAuto: { q: "Qu'est-ce qu'un livret d'accueil numérique ?", a: "Une page ou un message envoyé avant l'arrivée, qui regroupe accès, codes, équipements et conseils locaux, consultable sur téléphone pendant tout le séjour." } }
  }
];
