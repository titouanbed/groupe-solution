/* ═══════════════════════════════════════════════════════════
   Extension du registre : Hérault élargi + Gard proche (Nîmes, Petite Camargue,
   Vidourle). Même format et mêmes règles que montpellier-communes.mjs :
   contenu propre à chaque commune, aucun fait local non vérifié.
   Importé et fusionné par montpellier-communes.mjs.
   ═══════════════════════════════════════════════════════════ */
export const EXTENSION = [
  /* ═════════════════ BASSIN DE THAU & LITTORAL OUEST ═════════════════ */
  {
    slug: 'vic-la-gardiole', name: 'Vic-la-Gardiole', cp: '34110', lat: 43.4900, lng: 3.7970, metro: false, secteur: 'Bassin de Thau',
    profil: "Entre l'étang de Vic, le massif de la Gardiole et la plage des Aresquiers, Vic-la-Gardiole est un village préservé où la nature fait l'économie : tourisme doux, vigne, campings et activités de plein air.",
    reperes: ["l'étang de Vic", 'la plage des Aresquiers', 'le massif de la Gardiole', 'le vieux village'],
    tissu: "campings et hébergements, activités nature et nautiques, vignerons, artisans",
    web: {
      angle: "Les vacanciers qui visent une plage sauvage près de Montpellier tapent « Aresquiers » ou « Vic-la-Gardiole » : ceux qui répondent avec un site clair et une réservation directe captent ce public avant qu'il ne file vers les grandes stations.",
      faq: { q: "Mon camping ou mon gîte dépend des plateformes : comment reprendre la main ?", a: "Avec un site qui prend les réservations directes, un calendrier synchronisé avec les plateformes et une fiche Google soignée. Chaque réservation directe, c'est une commission de moins et un client que vous pouvez recontacter l'année suivante." }
    },
    auto: {
      angle: "À Vic-la-Gardiole, la saison concentre en quelques semaines l'essentiel des réservations, des arrivées et des questions pratiques.",
      cases: [
        ['Arrivées et départs automatisés', "Horaires d'accueil, plan d'accès, règlement et code du portail envoyés au bon moment, sans répondre dix fois à la même question."],
        ['Réservations d\'activités nature', "Kayak, balades, location de vélos : créneaux en ligne, paiement, rappel la veille et report automatique si le vent se lève."],
        ['Relance de la clientèle fidèle', "Les clients de l'été reçoivent en hiver une proposition pour revenir aux mêmes dates, avant d'aller voir ailleurs."]
      ],
      faq: { q: "Peut-on proposer un report automatique quand la météo est mauvaise ?", a: "Oui : l'outil repère les réservations concernées et envoie aux clients une proposition de nouveau créneau en un clic. Vous gardez la décision de déclencher, le reste suit." }
    }
  },
  {
    slug: 'mireval', name: 'Mireval', cp: '34110', lat: 43.5080, lng: 3.8020, metro: false, secteur: 'Bassin de Thau',
    profil: "Au pied de la Gardiole, Mireval a donné son nom à une appellation de muscat. Village viticole entre Montpellier et Frontignan, il accueille aussi des artisans et des familles attirés par le cadre.",
    reperes: ['le vignoble du Muscat de Mireval', 'le massif de la Gardiole', 'le centre du village', "l'étang de Vic tout proche"],
    tissu: "caves et domaines, artisans, indépendants, commerces de proximité",
    web: {
      angle: "Le Muscat de Mireval est connu des amateurs, beaucoup moins des moteurs de recherche. Un domaine qui raconte son histoire en ligne et vend en direct transforme une appellation discrète en clientèle fidèle.",
      faq: { q: "Comment valoriser une appellation peu connue sur internet ?", a: "En racontant le terroir, les cuvées et les accords, en proposant la visite et l'achat en ligne, et en répondant aux recherches précises (muscat, vin doux, cadeau). Les petites appellations ont souvent peu de concurrence en ligne : c'est une opportunité." }
    },
    auto: {
      angle: "Les caves de Mireval vendent au caveau, aux professionnels et en ligne, souvent avec une toute petite équipe.",
      cases: [
        ['Commandes de fin d\'année', "Coffrets et commandes d'entreprise pris en ligne, préparation par date et factures générées automatiquement."],
        ['Stock unique caveau + boutique', "Chaque vente au caveau met à jour la boutique en ligne : aucune cuvée vendue deux fois."],
        ['Invitations ciblées', "Portes ouvertes et nouveaux millésimes proposés en priorité aux clients qui ont déjà acheté."]
      ],
      faq: { q: "Les commandes de comités d'entreprise peuvent-elles être automatisées ?", a: "Oui : un formulaire dédié calcule le devis selon les quantités et les coffrets, et le bon de commande, la facture et le planning de préparation suivent automatiquement." }
    }
  },
  {
    slug: 'marseillan', name: 'Marseillan', cp: '34340', lat: 43.3560, lng: 3.5280, metro: false, secteur: 'Bassin de Thau',
    profil: "Port de caractère au bord de l'étang de Thau, Marseillan abrite la maison Noilly Prat et une station balnéaire, Marseillan-Plage. Conchyliculture, vigne, tourisme et plaisance font vivre la commune toute l'année.",
    reperes: ['le port de Marseillan', 'Marseillan-Plage', 'la maison Noilly Prat', "l'étang de Thau", 'le Canal du Midi tout proche'],
    tissu: "restaurants et commerces du port, conchyliculteurs, campings et locations, vignerons, métiers de la plaisance",
    web: {
      angle: "Entre le port et Marseillan-Plage, deux clientèles cherchent en ligne : les visiteurs d'un jour au port, et les vacanciers installés pour la semaine. Un site qui parle à chacun, au bon moment, remplit les tables comme les agendas.",
      faq: { q: "Mon restaurant est sur le port : comment sortir devant les autres sur Google ?", a: "Fiche Google impeccable (photos du lieu et des plats, horaires de saison, avis récents), menu en ligne et réservation directe. Sur un port très fréquenté, c'est souvent la fiche la plus complète qui gagne." }
    },
    auto: {
      angle: "À Marseillan, l'été fait exploser les demandes : réservations, locations, commandes de coquillages et questions pratiques arrivent en même temps.",
      cases: [
        ['Locations saisonnières pilotées', "Ménages, remises de clés, états des lieux et messages aux voyageurs orchestrés automatiquement à Marseillan-Plage."],
        ['Commandes de coquillages', "Commandes des particuliers et des restaurants prises en ligne, préparées par créneau de retrait."],
        ['Réservations de bateaux et d\'anneaux', "Demandes de location ou de places au port centralisées, confirmées et facturées sans aller-retour."]
      ],
      faq: { q: "Je gère plusieurs locations à Marseillan-Plage : qu'est-ce qui s'automatise ?", a: "Le planning des ménages, les messages aux voyageurs, les codes d'accès, les états des lieux et les comptes rendus aux propriétaires. Vous gardez la relation, l'outil fait le suivi." }
    }
  },
  {
    slug: 'agde', name: 'Agde', cp: '34300', lat: 43.3100, lng: 3.4750, metro: false, secteur: "Agde & Pézenas",
    profil: "Cité de basalte avec sa cathédrale fortifiée et son écluse ronde sur le Canal du Midi, Agde englobe aussi Le Cap d'Agde, l'une des plus grandes stations balnéaires de la Méditerranée française. Une économie touristique massive, doublée d'une vie locale à l'année.",
    reperes: ["la cathédrale Saint-Étienne en basalte", "l'écluse ronde du Canal du Midi", "Le Cap d'Agde", 'le Grau d\'Agde', "l'Hérault"],
    tissu: "hôtellerie et résidences, restaurants, agences immobilières et de location, nautisme, commerces, artisans",
    web: {
      angle: "Au Cap d'Agde, la concurrence en ligne est féroce et les visiteurs décident en quelques secondes sur leur téléphone. Un site rapide, multilingue, avec réservation directe, fait la différence entre une saison pleine et une saison subie.",
      faq: { q: "Au Cap d'Agde, faut-il un site en plusieurs langues ?", a: "Pour l'hôtellerie, la location et les activités, souvent oui : une part importante des visiteurs vient d'autres pays. On adapte les langues à votre clientèle réelle, en commençant par l'anglais et l'allemand si c'est pertinent." }
    },
    auto: {
      angle: "À Agde, les volumes de la saison sont ceux d'une ville bien plus grande : réservations, recrutement saisonnier, locations et messages clients se comptent par centaines.",
      cases: [
        ['Recrutement saisonnier automatisé', "Candidatures centralisées, tri selon vos critères, entretiens planifiés : le savoir-faire de notre plateforme Solution Recrutement, à l'échelle de votre établissement."],
        ['Gestion locative à grande échelle', "Arrivées, départs, ménages, cautions et comptes rendus propriétaires gérés sans tableur."],
        ['Demandes multilingues triées', "Chaque demande est comprise, résumée et reçoit une première réponse dans la langue du client."]
      ],
      faq: { q: "Pouvez-vous m'aider à recruter pour la saison ?", a: "Oui, c'est un domaine où Groupe Solution est très à l'aise : notre plateforme Solution Recrutement traite des centaines de milliers d'offres. On adapte cette logique à vos besoins : centraliser, trier, planifier les entretiens." }
    }
  },
  {
    slug: 'pezenas', name: 'Pézenas', cp: '34120', lat: 43.4590, lng: 3.4230, metro: false, secteur: "Agde & Pézenas",
    profil: "Ville de Molière aux hôtels particuliers remarquables, Pézenas est un haut lieu des métiers d'art, des antiquaires et du tourisme culturel. Son centre historique attire toute l'année visiteurs et amateurs de belles choses.",
    reperes: ['le centre historique et ses hôtels particuliers', 'les ateliers des métiers d\'art', 'les antiquaires', 'le souvenir de Molière', 'le marché du samedi'],
    tissu: "artisans et métiers d'art, antiquaires et brocanteurs, restaurants, hébergements de charme, domaines viticoles",
    web: {
      angle: "À Pézenas, on vend du savoir-faire et de l'authenticité. Le site doit montrer l'atelier, les pièces, les mains — et permettre de commander ou de réserver une visite, pour prolonger la découverte après le séjour.",
      faq: { q: "Artisan d'art à Pézenas : vendre en ligne, c'est possible pour des pièces uniques ?", a: "Oui : une boutique qui présente chaque pièce avec ses photos et son histoire, plus une prise de commande sur-mesure. Beaucoup de visiteurs découvrent votre atelier en vacances et achètent une fois rentrés chez eux." }
    },
    auto: {
      angle: "Les artisans d'art et commerces piscénois gèrent des pièces uniques, des commandes sur-mesure et une clientèle dispersée partout en France.",
      cases: [
        ['Commandes sur-mesure suivies', "Demande qualifiée par un court formulaire, devis et acompte en ligne, étapes de fabrication envoyées automatiquement au client."],
        ['Inventaire de pièces uniques', "Une pièce vendue à l'atelier disparaît de la boutique en ligne : fini les ventes en double."],
        ['Expéditions préparées', "Étiquettes, assurance et suivi générés automatiquement pour les envois fragiles."]
      ],
      faq: { q: "Mes pièces sont toutes différentes : comment les mettre en ligne sans y passer des heures ?", a: "On met en place une saisie rapide depuis votre téléphone : photos, dimensions, prix. La fiche se construit automatiquement et part en ligne après votre validation." }
    }
  },
  {
    slug: 'beziers', name: 'Béziers', cp: '34500', lat: 43.3440, lng: 3.2160, metro: false, secteur: 'Biterrois',
    profil: "Dominée par la cathédrale Saint-Nazaire, traversée par le Canal du Midi et ses neuf écluses de Fonseranes, Béziers est la deuxième ville de l'Hérault. Commerce, vigne, rugby et feria rythment une économie à part entière, distincte de Montpellier.",
    reperes: ['les neuf écluses de Fonseranes', 'la cathédrale Saint-Nazaire', 'les allées Paul-Riquet', 'le Canal du Midi', 'les zones d\'activités'],
    tissu: "commerces du centre, PME et artisans, négoce viticole, services, restauration",
    web: {
      angle: "Les Biterrois cherchent « à Béziers », pas à Montpellier. Une entreprise qui travaille son référencement local sur le Biterrois s'adresse à un bassin de plus de cent mille habitants, avec une concurrence en ligne souvent moins affûtée qu'à Montpellier.",
      faq: { q: "Vous êtes à Montpellier : pouvez-vous vraiment travailler pour une entreprise de Béziers ?", a: "Oui. L'essentiel se fait à distance, et Béziers est à moins d'une heure : on vient quand c'est utile. Surtout, on travaille votre visibilité sur le Biterrois, avec des contenus qui parlent de votre ville et de vos clients." }
    },
    auto: {
      angle: "À Béziers, beaucoup de PME et de négociants gèrent encore commandes, factures et relances à la main.",
      cases: [
        ['Négoce : commandes et documents', "Bons de commande, documents d'accompagnement et factures générés à partir d'une seule saisie."],
        ['Relances et trésorerie', "Relances automatiques des impayés et tableau de trésorerie à jour chaque matin."],
        ['Prise de rendez-vous et rappels', "Pour les commerces et services : réservation en ligne, rappels et avis Google demandés automatiquement."]
      ],
      faq: { q: "Nous sommes une PME biterroise avec un ERP ancien : c'est un obstacle ?", a: "Non. On automatise autour de votre ERP (e-mails, fichiers, relances) en récupérant et en réinjectant les données par les moyens disponibles. Remplacer l'ERP n'est presque jamais la première étape." }
    }
  },

  /* ═════════════════ CŒUR D'HÉRAULT & VALLÉE ═════════════════ */
  {
    slug: 'clermont-l-herault', name: "Clermont-l'Hérault", cp: '34800', lat: 43.6270, lng: 3.4320, metro: false, secteur: "Cœur d'Hérault",
    profil: "Ville centre du Cœur d'Hérault, à quelques minutes du lac du Salagou, Clermont-l'Hérault vit de son marché, de ses commerces, de l'olive et d'un tourisme de pleine nature en plein essor. Le carrefour de l'A75 et de l'A750 en fait un point de passage.",
    reperes: ['le lac du Salagou', 'le carrefour A75 / A750', 'le marché', 'la vieille ville', 'les oliveraies'],
    tissu: "commerces et artisans, activités de pleine nature, producteurs d'olives et d'huile, hébergements, PME",
    web: {
      angle: "Les visiteurs du Salagou et les automobilistes de l'A75 cherchent où manger, dormir, louer un VTT. Les entreprises clermontaises visibles sur ces recherches captent un flux qui, sinon, ne fait que passer.",
      faq: { q: "Comment capter les visiteurs du lac du Salagou ?", a: "En étant présent sur leurs recherches (activités, location, restaurant, hébergement autour du Salagou), avec des photos réelles, des horaires de saison à jour et la réservation en ligne. C'est un public qui décide souvent sur place, sur mobile." }
    },
    auto: {
      angle: "Commerces, producteurs et prestataires de loisirs clermontais jonglent entre vente sur place, commandes et réservations.",
      cases: [
        ['Vente d\'huile et de produits en ligne', "Boutique, stock et expéditions reliés : les ventes au moulin et en ligne partagent le même inventaire."],
        ['Activités de pleine nature', "Réservations, décharges signées en ligne, rappels et reports météo automatiques."],
        ['Commandes en click & collect', "Commande en ligne, préparation, SMS quand c'est prêt : idéal les jours de marché."]
      ],
      faq: { q: "Je vends sur les marchés et au magasin : peut-on tout relier ?", a: "Oui : un seul stock pour le magasin, les marchés (via une caisse mobile) et la boutique en ligne, avec les ventes qui remontent automatiquement dans votre comptabilité." }
    }
  },
  {
    slug: 'lodeve', name: 'Lodève', cp: '34700', lat: 43.7310, lng: 3.3190, metro: false, secteur: "Cœur d'Hérault",
    profil: "Au pied du Larzac, Lodève est une ancienne cité épiscopale avec sa cathédrale Saint-Fulcran et son atelier de la Manufacture de la Savonnerie. Une ville d'art et d'histoire, porte d'entrée vers les grands causses.",
    reperes: ['la cathédrale Saint-Fulcran', 'la Manufacture de la Savonnerie', 'le musée de Lodève', 'la porte du Larzac', "l'A75"],
    tissu: "commerces du centre, artisans, hébergements et activités de randonnée, associations culturelles, services",
    web: {
      angle: "À Lodève, le tourisme culturel et la randonnée amènent des visiteurs qui préparent tout en ligne. Les commerces et hébergements qui y sont bien présentés profitent d'un flux que les grandes villes ne captent pas.",
      faq: { q: "Une petite ville comme Lodève a-t-elle intérêt à investir en ligne ?", a: "Oui, justement : la concurrence est faible et les visiteurs cherchent activement. Une fiche Google soignée et un site simple suffisent souvent à devenir la référence locale de votre activité." }
    },
    auto: {
      angle: "Les structures lodévoises sont souvent petites : chaque heure de gestion gagnée compte.",
      cases: [
        ['Réservations d\'hébergement', "Calendrier synchronisé, acomptes et messages aux randonneurs automatisés."],
        ['Billetterie et adhésions', "Pour les associations culturelles : inscriptions, paiements et rappels gérés sans tableur."],
        ['Devis et factures d\'artisan', "Modèles prêts, calculs automatiques, relances intégrées."]
      ],
      faq: { q: "Une association peut-elle se faire aider ?", a: "Oui : adhésions, billetterie, paiements en ligne et convocations automatiques soulagent énormément les bénévoles, pour un coût adapté aux moyens associatifs." }
    }
  },
  {
    slug: 'aniane', name: 'Aniane', cp: '34150', lat: 43.6860, lng: 3.5860, metro: false, secteur: "Vallée de l'Hérault",
    profil: "Née autour de son abbaye, Aniane est la porte du Pont du Diable et des gorges de l'Hérault, sur la route de Saint-Guilhem-le-Désert. Son terroir est réputé, avec des domaines viticoles de renom.",
    reperes: ["l'abbaye d'Aniane", 'le Pont du Diable', "les gorges de l'Hérault", 'la route de Saint-Guilhem-le-Désert', 'les domaines viticoles'],
    tissu: "domaines viticoles, activités de canoë et de baignade, restaurants, hébergements, artisans",
    web: {
      angle: "Le Pont du Diable attire des foules chaque été. Les activités et domaines d'Aniane qui apparaissent quand ces visiteurs cherchent « canoë », « dégustation » ou « restaurant près du Pont du Diable » font leur saison.",
      faq: { q: "Comment profiter de la fréquentation du Pont du Diable ?", a: "En répondant aux recherches des visiteurs (activités, dégustation, restaurant à proximité) avec une fiche Google soignée, des horaires de saison à jour et la réservation en ligne, y compris en dernière minute sur mobile." }
    },
    auto: {
      angle: "À Aniane, l'activité touristique est intense et concentrée : réservations, groupes et questions pratiques s'enchaînent tout l'été.",
      cases: [
        ['Location de canoës en ligne', "Créneaux, paiement, décharge signée et rappel du point de rendez-vous : le client arrive prêt."],
        ['Dégustations au domaine', "Réservations, groupes et visites guidées planifiés automatiquement."],
        ['Gestion de l\'affluence', "Créneaux limités, liste d'attente et messages en cas de fermeture de la rivière."]
      ],
      faq: { q: "Pouvez-vous gérer les annulations liées au niveau de la rivière ?", a: "Oui : un message automatique prévient les clients concernés et propose un report ou un remboursement selon vos règles, sans un appel." }
    }
  },
  {
    slug: 'montarnaud', name: 'Montarnaud', cp: '34570', lat: 43.6470, lng: 3.6970, metro: false, secteur: "Vallée de l'Hérault",
    profil: "Sur l'A750 entre Montpellier et Gignac, Montarnaud a beaucoup grandi en attirant des familles et des artisans séduits par la garrigue et la proximité de la métropole.",
    reperes: ["l'A750", 'le centre du village', 'la garrigue', 'la route de Gignac'],
    tissu: "artisans du bâtiment, indépendants, commerces de proximité, services à domicile",
    web: {
      angle: "Les artisans de Montarnaud travaillent autant à Montpellier que dans la vallée de l'Hérault. Leur site doit capter les recherches de toute cette zone, preuves à l'appui.",
      faq: { q: "Je suis artisan à Montarnaud : dois-je viser Montpellier ou la vallée ?", a: "Les deux, honnêtement : une fiche Google en zone d'intervention et des réalisations localisées des deux côtés. C'est la preuve de chantiers réels qui convainc, pas une liste de villes." }
    },
    auto: {
      angle: "Les entreprises montarnéennes passent beaucoup de temps sur la route : l'administratif doit tourner sans elles.",
      cases: [
        ['Devis depuis le chantier', "Métrés et photos sur téléphone, devis prêt avant de repartir."],
        ['Planning optimisé', "Chantiers regroupés par secteur pour limiter les allers-retours sur l'A750."],
        ['Relances et avis', "Relances des devis et demandes d'avis automatiques après chaque chantier."]
      ],
      faq: { q: "Ai-je besoin d'un ordinateur pour tout ça ?", a: "Non : l'essentiel se fait depuis votre téléphone. Les outils sont conçus pour le terrain." }
    }
  },

  /* ═════════════════ PIC SAINT-LOUP & CÉVENNES ═════════════════ */
  {
    slug: 'les-matelles', name: 'Les Matelles', cp: '34270', lat: 43.7290, lng: 3.8130, metro: false, secteur: 'Pic Saint-Loup',
    profil: "Village médiéval aux ruelles de pierre, niché entre garrigue et vignes à la sortie nord de Montpellier, Les Matelles attire promeneurs et amateurs de patrimoine en route vers le Pic Saint-Loup.",
    reperes: ['le village médiéval', 'les ruelles de pierre', 'la garrigue', 'la route du Pic Saint-Loup'],
    tissu: "artisans d'art, gîtes et chambres d'hôtes, domaines, indépendants",
    web: {
      angle: "Aux Matelles, la clientèle vient pour le charme. Le site doit transmettre ce charme en quelques photos et permettre de réserver ou de commander immédiatement.",
      faq: { q: "Mon activité est dans un village touristique : que doit montrer mon site ?", a: "Le lieu, les gens, les produits, avec de vraies photos, puis une action claire : réserver, commander, venir. Le visiteur doit se projeter en dix secondes." }
    },
    auto: {
      angle: "Les petites structures des Matelles gèrent accueil, réservations et ventes avec peu de temps.",
      cases: [
        ['Réservations directes', "Chambres, ateliers ou visites réservés et payés en ligne, avec rappels."],
        ['Messages aux visiteurs', "Accès, horaires et recommandations envoyés automatiquement."],
        ['Vente en ligne', "Créations ou produits vendus en ligne, stock synchronisé avec la boutique."]
      ],
      faq: { q: "Et si je veux garder un contact humain avec mes clients ?", a: "C'est l'objectif : l'automatisation prend les messages répétitifs pour que vous ayez plus de temps pour les vrais échanges." }
    }
  },
  {
    slug: 'combaillaux', name: 'Combaillaux', cp: '34980', lat: 43.6730, lng: 3.7670, metro: false, secteur: 'Pic Saint-Loup',
    profil: "Petit village de garrigue au nord-ouest de Montpellier, entre Grabels et Saint-Gély-du-Fesc, Combaillaux est prisé pour son calme. De nombreux indépendants et consultants y travaillent depuis chez eux.",
    reperes: ['le vieux village', 'la garrigue', 'la route de Saint-Gély', 'les chemins de randonnée'],
    tissu: "consultants et indépendants, artisans, professions libérales, services à domicile",
    web: {
      angle: "Pour un consultant ou un artisan installé à Combaillaux, la clientèle est surtout à Montpellier. Le site doit inspirer confiance à distance, sans local ni vitrine.",
      faq: { q: "Consultant indépendant, ai-je besoin d'un site ou LinkedIn suffit ?", a: "LinkedIn aide à être trouvé par votre réseau ; le site vous rend crédible auprès de ceux qui ne vous connaissent pas et capte les recherches Google. Les deux se complètent." }
    },
    auto: {
      angle: "Les indépendants combaillaulais gagnent surtout du temps sur la prospection et l'administratif.",
      cases: [
        ['Propositions commerciales préparées', "À partir de vos notes d'appel, une proposition est rédigée dans votre format."],
        ['Agenda en libre-service', "Prise de rendez-vous et visios planifiées sans échange de messages."],
        ['Facturation et relances', "Factures envoyées à échéance, relances automatiques."]
      ],
      faq: { q: "L'IA peut-elle écrire mes propositions commerciales ?", a: "Elle prépare une première version fidèle à vos notes et à votre style ; vous relisez, ajustez et envoyez. C'est un gain de temps, pas un remplacement de votre expertise." }
    }
  },
  {
    slug: 'vailhauques', name: 'Vailhauquès', cp: '34570', lat: 43.6720, lng: 3.7200, metro: false, secteur: 'Pic Saint-Loup',
    profil: "Village de garrigue à l'ouest du Pic Saint-Loup, Vailhauquès offre un cadre naturel préservé à vingt minutes de Montpellier. Artisans, indépendants et quelques activités de nature y sont installés.",
    reperes: ['le village', 'la garrigue', 'les chemins de randonnée', 'la route de Montarnaud'],
    tissu: "artisans, indépendants, activités de nature, gîtes",
    web: {
      angle: "À Vailhauquès, pas de passage : une entreprise existe en ligne ou n'existe pas. Fiche Google complète et site clair sont la base.",
      faq: { q: "Combien de temps pour apparaître sur Google ?", a: "Une fiche Google bien remplie peut apparaître en quelques jours à quelques semaines sur les recherches locales. Le site se positionne progressivement, surtout avec des contenus utiles et des avis." }
    },
    auto: {
      angle: "Pour les petites entreprises de Vailhauquès, l'enjeu est de répondre vite sans être collé au téléphone.",
      cases: [
        ['Réponses immédiates', "Chaque demande reçoit une réponse personnalisée et les prochaines étapes."],
        ['Devis et relances', "Modèles, calculs et relances automatiques."],
        ['Réservations', "Créneaux et paiements en ligne pour les activités et hébergements."]
      ],
      faq: { q: "Peut-on commencer par une seule automatisation ?", a: "C'est ce qu'on recommande : la plus rentable d'abord, on mesure, puis on décide ensemble de la suite." }
    }
  },
  {
    slug: 'saint-martin-de-londres', name: 'Saint-Martin-de-Londres', cp: '34380', lat: 43.7900, lng: 3.7300, metro: false, secteur: 'Pic Saint-Loup',
    profil: "Village médiéval aux portes des Cévennes, à deux pas du Ravin des Arcs, Saint-Martin-de-Londres est un bourg centre pour les villages alentour, entre randonnée, vigne et vie locale.",
    reperes: ['le village médiéval et son église romane', 'le Ravin des Arcs', 'la route des Cévennes', 'le causse'],
    tissu: "commerces du bourg, artisans, hébergements, activités de randonnée, producteurs",
    web: {
      angle: "Randonneurs du Ravin des Arcs et habitants des villages voisins cherchent en ligne où manger, dormir ou trouver un artisan. Être bien référencé ici, c'est devenir le réflexe de tout un bassin rural.",
      faq: { q: "Mon commerce sert tous les villages autour : comment le faire savoir ?", a: "Avec une fiche Google et un site qui affichent clairement votre zone de desserte (livraisons, interventions), et des contenus qui parlent de ces villages. Les habitants ruraux cherchent beaucoup en ligne." }
    },
    auto: {
      angle: "Les entreprises de Saint-Martin-de-Londres couvrent un vaste secteur rural : organisation et gestion prennent du temps.",
      cases: [
        ['Tournées de livraison', "Commandes regroupées et tournée préparée par village."],
        ['Hébergement de randonneurs', "Réservations, paniers-repas et informations d'itinéraire envoyés automatiquement."],
        ['Facturation groupée', "Interventions facturées automatiquement en fin de semaine."]
      ],
      faq: { q: "La connexion internet est parfois faible chez nous : est-ce un problème ?", a: "Non, les outils terrain peuvent fonctionner hors ligne et se synchroniser dès que le réseau revient." }
    }
  },
  {
    slug: 'ganges', name: 'Ganges', cp: '34190', lat: 43.9340, lng: 3.7080, metro: false, secteur: 'Cévennes héraultaises',
    profil: "Ancienne capitale du bas de soie, Ganges est la ville centre des Cévennes héraultaises, au bord de l'Hérault et près des gorges et de la grotte des Demoiselles. Commerce, tourisme vert et artisanat animent le bassin.",
    reperes: ["l'histoire de la soie", "les gorges de l'Hérault", 'la grotte des Demoiselles toute proche', 'le centre-ville', 'le marché du vendredi'],
    tissu: "commerces du centre, artisans, activités de pleine nature, hébergements, producteurs cévenols",
    web: {
      angle: "Ganges est le pôle commercial de tout un bassin cévenol. Les habitants des villages alentour et les visiteurs des gorges y cherchent des commerces et services : ceux qui sont visibles en ligne récupèrent cette clientèle.",
      faq: { q: "Les clients de Ganges comparent-ils vraiment en ligne ?", a: "Oui, notamment les visiteurs et les nouveaux habitants. Et pour les habitants de longue date, un site et une fiche Google à jour évitent les déplacements inutiles (horaires, disponibilité), ce qu'ils apprécient." }
    },
    auto: {
      angle: "Les entreprises gangeoises servent un large territoire de montagne : commandes, livraisons et réservations demandent de l'organisation.",
      cases: [
        ['Produits cévenols en ligne', "Oignons doux, miel, châtaignes, charcuterie : vente en ligne, stock et expéditions synchronisés."],
        ['Activités des gorges', "Réservations de canoë, spéléo, rando : paiement, décharge et rappels automatiques."],
        ['Commandes des commerces', "Click & collect et livraisons regroupées par village."]
      ],
      faq: { q: "Vendre des produits locaux en ligne, ça vaut le coup ?", a: "Souvent oui : les visiteurs qui ont goûté vos produits en vacances veulent en recommander chez eux. Une boutique simple et une expédition bien organisée prolongent la saison toute l'année." }
    }
  },

  /* ═════════════════ PAYS DE L'OR & LUNELLOIS ═════════════════ */
  {
    slug: 'mudaison', name: 'Mudaison', cp: '34130', lat: 43.6340, lng: 4.0300, metro: false, secteur: "Pays de l'Or",
    profil: "Village de la plaine entre Mauguio et Baillargues, Mudaison garde une tradition agricole et une vie de village, tout en accueillant artisans et familles travaillant sur la métropole.",
    reperes: ['le centre du village', 'la plaine agricole', 'la proximité de Mauguio', 'la route de Baillargues'],
    tissu: "exploitations agricoles, artisans, indépendants, commerces de proximité",
    web: {
      angle: "Les artisans et producteurs de Mudaison travaillent pour toute la métropole est. Leur présence en ligne doit refléter cette zone, pas seulement le village.",
      faq: { q: "Je suis producteur : un site m'aide-t-il à vendre en direct ?", a: "Oui : présenter vos produits, vos points de vente et permettre la commande en ligne avec retrait à la ferme ou livraison groupée. La vente directe se développe beaucoup autour de Montpellier." }
    },
    auto: {
      angle: "À Mudaison, producteurs et artisans veulent passer moins de temps au bureau et plus sur le terrain.",
      cases: [
        ['Paniers et commandes en ligne', "Commandes de la semaine consolidées pour la récolte et la préparation."],
        ['Devis rapides', "Devis d'artisan préparés depuis le téléphone."],
        ['Facturation et relances', "Factures et relances envoyées sans intervention."]
      ],
      faq: { q: "Peut-on vendre aux restaurateurs de Montpellier plus facilement ?", a: "Oui : un catalogue professionnel en ligne avec vos disponibilités de la semaine, commandes consolidées et factures automatiques." }
    }
  },
  {
    slug: 'lansargues', name: 'Lansargues', cp: '34130', lat: 43.6520, lng: 4.0750, metro: false, secteur: "Pays de l'Or",
    profil: "Village agricole au nord de l'étang de l'Or, Lansargues a gardé des traditions camarguaises vivaces et une économie tournée vers la terre, entre vignes, maraîchage et élevage.",
    reperes: ["l'étang de l'Or", 'les traditions camarguaises', 'la plaine agricole', 'le centre du village'],
    tissu: "exploitations agricoles, manades et traditions taurines, artisans, commerces",
    web: {
      angle: "Entre Montpellier et la Camargue, Lansargues attire des visiteurs curieux de traditions et de produits du terroir. Une présence en ligne authentique transforme cette curiosité en visites et en ventes.",
      faq: { q: "Une exploitation agricole a-t-elle besoin d'un site ?", a: "Pour vendre en direct, accueillir des visiteurs ou des groupes, oui. Un site simple avec vos produits, vos horaires et un moyen de commander suffit souvent." }
    },
    auto: {
      angle: "Les exploitations et artisans de Lansargues gagnent du temps en automatisant commandes et administratif.",
      cases: [
        ['Vente directe organisée', "Commandes en ligne, retrait à la ferme par créneaux, paiement à la commande."],
        ['Accueil de groupes', "Demandes, devis et confirmations pour les visites et journées à thème."],
        ['Registres et traçabilité', "Interventions enregistrées en quelques secondes sur téléphone."]
      ],
      faq: { q: "Pouvez-vous gérer les réservations de groupes pour des journées traditionnelles ?", a: "Oui : formulaire de demande, devis automatique selon le nombre de participants, acompte en ligne et informations pratiques envoyées aux organisateurs." }
    }
  },
  {
    slug: 'candillargues', name: 'Candillargues', cp: '34130', lat: 43.6180, lng: 4.0700, metro: false, secteur: "Pays de l'Or",
    profil: "Petit village posé au bord de l'étang de l'Or, Candillargues offre un cadre naturel rare entre Montpellier et La Grande-Motte, avec son port de pêche sur l'étang et ses sentiers.",
    reperes: ["l'étang de l'Or", 'le port de l\'étang', 'les sentiers nature', 'le centre du village'],
    tissu: "artisans, indépendants, activités nature, pêcheurs et producteurs",
    web: {
      angle: "À Candillargues, les entreprises sont petites et rayonnent de Montpellier au littoral. Une présence en ligne claire leur permet de toucher les deux bassins.",
      faq: { q: "Comment être visible à la fois vers Montpellier et vers la mer ?", a: "En définissant une zone d'intervention réaliste sur Google et en montrant des réalisations des deux côtés. On construit votre visibilité autour de vos vrais clients." }
    },
    auto: {
      angle: "Les indépendants de Candillargues cherchent surtout à répondre vite et à facturer sans y penser.",
      cases: [
        ['Réponses automatiques', "Demandes centralisées et accusé de réception personnalisé."],
        ['Devis et factures', "Modèles, calculs et relances intégrés."],
        ['Avis clients', "Demande d'avis au bon moment après chaque prestation."]
      ],
      faq: { q: "Quel budget prévoir ?", a: "On part de votre gain : on estime le temps perdu et on ne propose que ce qui est nettement rentable. Le devis est clair, sans engagement." }
    }
  },
  {
    slug: 'lunel-viel', name: 'Lunel-Viel', cp: '34400', lat: 43.6790, lng: 4.0930, metro: false, secteur: 'Pays de Lunel',
    profil: "Voisine de Lunel, Lunel-Viel est une commune résidentielle et viticole du Pays de Lunel, qui accueille artisans et familles entre Montpellier et Nîmes.",
    reperes: ['le centre du village', 'les vignes', 'la proximité de Lunel', "l'axe Montpellier–Nîmes"],
    tissu: "artisans, indépendants, viticulteurs, commerces de proximité",
    web: {
      angle: "Entre Montpellier et Nîmes, les artisans de Lunel-Viel peuvent viser deux bassins. Leur site doit l'affirmer avec des preuves concrètes.",
      faq: { q: "Faut-il créer une page par ville où j'interviens ?", a: "Pas des pages vides copiées-collées : Google les ignore. Mieux vaut une zone d'intervention claire, des réalisations localisées et, si le volume le justifie, quelques pages réellement différentes." }
    },
    auto: {
      angle: "À Lunel-Viel, artisans et indépendants veulent réduire le temps passé sur les devis et les relances.",
      cases: [
        ['Demandes qualifiées', "Formulaire intelligent qui recueille toutes les infos nécessaires au devis."],
        ['Relances automatiques', "Devis et factures relancés au bon moment."],
        ['Planning partagé', "Chantiers et rendez-vous visibles sur téléphone, mis à jour en temps réel."]
      ],
      faq: { q: "C'est compliqué à prendre en main ?", a: "Non : on conçoit des outils simples, on les teste avec vous et on reste disponible les premières semaines." }
    }
  },
  {
    slug: 'marsillargues', name: 'Marsillargues', cp: '34590', lat: 43.6640, lng: 4.1780, metro: false, secteur: 'Pays de Lunel',
    profil: "Aux portes de la Petite Camargue, au bord du Vidourle, Marsillargues est connue pour son château et ses traditions taurines. Une commune agricole et vivante, tournée vers la Camargue.",
    reperes: ['le château de Marsillargues', 'le Vidourle', 'la Petite Camargue', 'les traditions taurines'],
    tissu: "exploitations agricoles, manades, artisans, commerces",
    web: {
      angle: "Aux portes de la Camargue, les activités de Marsillargues attirent des visiteurs en quête d'authenticité. Un site qui montre le terrain et permet de réserver capte ce public.",
      faq: { q: "Comment attirer des visiteurs dans une activité de tradition camarguaise ?", a: "Photos et vidéos authentiques, explications claires de ce qu'on vit sur place, réservation en ligne et fiche Google active. Les visiteurs cherchent l'expérience, montrez-la." }
    },
    auto: {
      angle: "Les structures de Marsillargues gèrent visites, groupes et ventes avec de petites équipes.",
      cases: [
        ['Réservations de visites et journées', "Créneaux, acomptes, informations pratiques et rappels automatiques."],
        ['Devis pour groupes et événements', "Devis calculé selon le nombre et les options, envoyé automatiquement."],
        ['Vente de produits du terroir', "Commandes en ligne, retrait ou expédition."]
      ],
      faq: { q: "Peut-on gérer les demandes de groupes et de comités d'entreprise ?", a: "Oui : formulaire dédié, devis automatique, convention et facture générées, rappels avant la date." }
    }
  },

  /* ═════════════════ GARD : PETITE CAMARGUE, VIDOURLE, NÎMES ═════════════════ */
  {
    slug: 'aigues-mortes', name: 'Aigues-Mortes', cp: '30220', lat: 43.5660, lng: 4.1920, metro: false, secteur: 'Petite Camargue',
    profil: "Cité médiévale ceinte de remparts, avec la Tour de Constance et ses salins roses, Aigues-Mortes accueille des visiteurs du monde entier. Tourisme, sel, vin des sables et traditions camarguaises font son économie.",
    reperes: ['les remparts', 'la Tour de Constance', 'les salins', 'la Petite Camargue', 'le canal du Rhône à Sète'],
    tissu: "restaurants et commerces de la cité, hébergements, activités et visites, domaines, artisans",
    web: {
      angle: "À l'intérieur des remparts, des dizaines de restaurants et boutiques se disputent des visiteurs pressés, souvent étrangers. Le choix se fait sur Google Maps, en quelques secondes : photos, avis et langues décident.",
      faq: { q: "Mon établissement est dans la cité : comment me démarquer des voisins ?", a: "Par une fiche Google irréprochable (photos, avis récents, horaires), un site multilingue avec menu ou offre claire, et la réservation en ligne. Dans un lieu très touristique, les détails font la différence." }
    },
    auto: {
      angle: "À Aigues-Mortes, les volumes touristiques imposent une organisation sans faille, dans plusieurs langues.",
      cases: [
        ['Réservations multilingues', "Réservations et questions traitées dans la langue du client, confirmations automatiques."],
        ['Visites et activités', "Billetterie, créneaux, rappels et gestion des groupes sans téléphone."],
        ['Avis et réputation', "Demandes d'avis automatiques après la visite pour rester en tête des résultats."]
      ],
      faq: { q: "Mes clients parlent anglais, allemand, espagnol : c'est gérable ?", a: "Oui : les messages automatiques et les réponses aux questions fréquentes partent dans la langue du client, avec votre validation si vous le souhaitez." }
    }
  },
  {
    slug: 'le-grau-du-roi', name: 'Le Grau-du-Roi', cp: '30240', lat: 43.5370, lng: 4.1360, metro: false, secteur: 'Petite Camargue',
    profil: "Port de pêche authentique et station balnéaire, Le Grau-du-Roi abrite Port-Camargue, l'un des plus grands ports de plaisance d'Europe, et le Seaquarium. Pêche, nautisme et tourisme se partagent le front de mer.",
    reperes: ['Port-Camargue', 'le port de pêche et le chenal', "l'Espiguette", 'le Seaquarium', 'le phare'],
    tissu: "métiers du nautisme, pêche et poissonneries, restaurants, hébergements et locations, commerces",
    web: {
      angle: "Plaisanciers de Port-Camargue, vacanciers de l'Espiguette, amateurs de poisson frais : chaque public cherche différemment. Un site qui parle à la bonne cible, avec réservation ou commande, remplit l'agenda.",
      faq: { q: "Je travaille dans le nautisme à Port-Camargue : quel site pour mes clients ?", a: "Un site qui présente clairement vos services (entretien, gardiennage, location, vente), vos tarifs ou un devis en ligne, et vos disponibilités. Les plaisanciers comparent sérieusement avant de confier leur bateau." }
    },
    auto: {
      angle: "Au Grau-du-Roi, nautisme, pêche et tourisme génèrent un flux continu de demandes, de réservations et de devis.",
      cases: [
        ['Devis d\'entretien de bateaux', "Type de bateau, prestation, photos : devis préparé automatiquement, planning d'atelier mis à jour."],
        ['Commandes de poisson frais', "Arrivage du jour publié, commandes des particuliers et restaurants prises en ligne."],
        ['Locations saisonnières', "Réservations, cautions, états des lieux et messages aux locataires automatisés."]
      ],
      faq: { q: "Pouvez-vous gérer le planning d'un atelier nautique ?", a: "Oui : demandes, devis, rendez-vous de mise à l'eau ou de sortie, rappels et facturation, avec une vue claire de la charge de l'atelier." }
    }
  },
  {
    slug: 'sommieres', name: 'Sommières', cp: '30250', lat: 43.7850, lng: 4.0890, metro: false, secteur: 'Vidourle',
    profil: "Au bord du Vidourle, avec son pont romain et son château, Sommières est une petite cité médiévale vivante, célèbre pour son marché du samedi. Commerces, artisans et tourisme y prospèrent entre Montpellier et Nîmes.",
    reperes: ['le pont romain', 'le château', 'le Vidourle', 'le marché du samedi', 'les ruelles médiévales'],
    tissu: "commerces du centre, artisans et métiers d'art, restaurants, hébergements, producteurs",
    web: {
      angle: "Le marché du samedi et le charme médiéval attirent des visiteurs de Montpellier et de Nîmes. Les commerces sommiérois bien présents en ligne transforment la balade du week-end en clientèle régulière.",
      faq: { q: "Comment fidéliser les visiteurs du marché ?", a: "En leur donnant une raison de revenir ou de commander : site avec vos produits, commande en ligne, newsletter simple et fiche Google active. Beaucoup de visiteurs cherchent à retrouver un commerçant découvert au marché." }
    },
    auto: {
      angle: "À Sommières, commerces et artisans gèrent ventes sur place, marché et commandes à distance.",
      cases: [
        ['Précommandes pour le marché', "Les clients réservent en ligne et récupèrent leurs produits au stand le samedi."],
        ['Stock unique', "Boutique, marché et site en ligne partagent le même inventaire."],
        ['Fidélisation', "Offres et nouveautés envoyées aux clients réguliers automatiquement."]
      ],
      faq: { q: "Les précommandes pour le marché, comment ça marche ?", a: "Le client choisit ses produits en ligne avant le samedi, paie ou non à l'avance, et vous recevez une liste de préparation par client. Moins d'attente au stand, plus de ventes." }
    }
  },
  {
    slug: 'nimes', name: 'Nîmes', cp: '30000', lat: 43.8370, lng: 4.3600, metro: false, secteur: 'Nîmes',
    profil: "Avec ses Arènes, la Maison Carrée inscrite au patrimoine mondial et les Jardins de la Fontaine, Nîmes est une grande ville à part entière, préfecture du Gard. Un bassin économique dense, voisin et complémentaire de Montpellier.",
    reperes: ['les Arènes', 'la Maison Carrée', 'les Jardins de la Fontaine', "l'Écusson nîmois", 'les zones d\'activités'],
    tissu: "commerces, PME et artisans, professions libérales, tourisme et restauration, services aux entreprises",
    web: {
      angle: "Les Nîmois cherchent « à Nîmes » et privilégient les entreprises de leur ville. Pour y être visible, il faut un référencement local construit pour Nîmes, pas une page Montpellier recyclée.",
      faq: { q: "Pourquoi travailler avec une entreprise montpelliéraine quand on est à Nîmes ?", a: "Parce qu'on apporte une double compétence rare — site et automatisation sur-mesure — et qu'on travaille votre visibilité spécifiquement sur Nîmes. Nîmes est à moins d'une heure : on vient quand c'est utile." }
    },
    auto: {
      angle: "Les PME et cabinets nîmois font face aux mêmes tâches répétitives que partout : saisie, relances, documents, rendez-vous — à grande échelle.",
      cases: [
        ['Collecte de documents clients', "Listes personnalisées, dépôt en ligne et relances automatiques pour cabinets et agences."],
        ['Commandes et facturation', "Du devis à la facture sans ressaisie, avec suivi des paiements."],
        ['Tableau de bord hebdomadaire', "Indicateurs clés envoyés chaque lundi, sans export manuel."]
      ],
      faq: { q: "Intervenez-vous régulièrement à Nîmes ?", a: "Oui. Le diagnostic et le suivi se font à distance, et on se déplace à Nîmes pour les étapes où la présence compte : observation d'un process, formation, lancement." }
    }
  }
];
