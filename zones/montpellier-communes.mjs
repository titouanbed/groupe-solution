/* ═══════════════════════════════════════════════════════════
   REGISTRE DES COMMUNES — Montpellier, sa métropole et ses alentours.
   Source de vérité unique pour DEUX familles de pages :
     • /montpellier/site-internet-{slug}.html  (création de site — charte silo)
       → généré par zones/generate-montpellier.mjs
     • /automatisation/{slug}.html             (logiciel & automatisation — charte holding)
       → généré par zones/generate-automatisation.mjs

   Règle anti-« doorway » (Google) : chaque commune porte SON contenu —
   portrait, repères réels, tissu économique, angle site, 3 cas
   d'automatisation propres à son économie et 2 questions de FAQ.
   Jamais de find-replace d'une commune à l'autre. Si on ne connaît pas
   un fait avec certitude, on ne l'écrit pas.

   Champs :
     slug, name, cp, lat, lng       → identité + carte + communes voisines
     metro                           → membre de Montpellier Méditerranée Métropole
     secteur                         → libellé de bassin (affichage + regroupement)
     profil                          → portrait de la commune (2-3 phrases)
     reperes[]                       → lieux / quartiers / zones qui parlent aux habitants
     tissu                           → qui sont les entreprises ici
     web.angle                       → pourquoi un site / une fiche Google change la donne ICI
     web.faq {q,a}                   → question propre à la commune (page site)
     auto.angle                      → ce qui se répète dans les entreprises d'ici
     auto.cases [[titre, texte]×3]   → automatisations concrètes pour CE tissu
     auto.faq {q,a}                  → question propre à la commune (page automatisation)

   Ajouter une commune = une entrée ici, puis :
     node zones/generate-montpellier.mjs && node zones/generate-automatisation.mjs
     node zones/generate-sitemap.mjs
   ═══════════════════════════════════════════════════════════ */

import { EXTENSION } from './communes-extension.mjs';
import { EXTENSION_2 } from './communes-extension-2.mjs';

export const HUB = { name: 'Montpellier', lat: 43.6108, lng: 3.8767 };

const BASE = [
  /* ═════════════════ MÉTROPOLE — SUD & LITTORAL ═════════════════ */
  {
    slug: 'lattes', name: 'Lattes', cp: '34970', lat: 43.5670, lng: 3.9030, metro: true, secteur: 'Sud de la métropole',
    profil: "Entre Port Ariane, les étangs et les zones commerciales de Boirargues, Lattes mêle quartiers résidentiels, cliniques, commerces de destination et artisans. C'est une commune où l'on vient en voiture, après avoir comparé en ligne.",
    reperes: ['Port Ariane', 'Boirargues', 'Maurin', 'le site archéologique Lattara', "l'étang du Méjean"],
    tissu: "commerces de destination, restaurants de Port Ariane, professions de santé, artisans du bâtiment et services à domicile",
    web: {
      angle: "À Lattes, le client compare trois enseignes sur son téléphone avant de prendre la voiture. Celle qui a un site rapide, des horaires à jour et des avis visibles gagne le déplacement — les autres ne sont même pas vues.",
      faq: { q: "Je suis à Boirargues, à côté des grandes enseignes : un petit site peut-il vraiment exister ?", a: "Oui, parce que la recherche locale ne se joue pas sur la taille. Une fiche Google soignée, un site qui répond précisément à « votre métier + Lattes » et des avis réguliers suffisent souvent à passer devant une enseigne nationale sur les recherches de proximité." }
    },
    auto: {
      angle: "Les entreprises lattoises traitent beaucoup de demandes entrantes — réservations, devis, rendez-vous — qui arrivent par téléphone, formulaire et messagerie en même temps.",
      cases: [
        ['Réservations de restaurant centralisées', "Les demandes du site, de Google et des messageries arrivent dans un seul planning, avec confirmation et rappel automatiques la veille pour limiter les tables vides à Port Ariane."],
        ['Devis artisan en moins de 5 minutes', "Le client décrit son chantier et joint des photos ; une première estimation part seule, vous validez d'un clic avant l'envoi."],
        ['Relances patients et clients', "Rappels de rendez-vous, documents à fournir, avis Google demandés au bon moment — sans que le secrétariat y passe ses fins de journée."]
      ],
      faq: { q: "Mon cabinet à Lattes utilise déjà un logiciel métier : faut-il tout changer ?", a: "Non. On se branche sur ce que vous utilisez déjà (agenda, logiciel métier, tableur, messagerie) et on automatise les échanges entre eux. Le but est de retirer des tâches, pas d'ajouter un outil à apprendre." }
    }
  },
  {
    slug: 'perols', name: 'Pérols', cp: '34470', lat: 43.5650, lng: 3.9550, metro: true, secteur: 'Sud de la métropole',
    profil: "Pérols vit au rythme du Parc des Expositions et de la Sud de France Arena, à quelques minutes de l'aéroport et des plages. Salons, concerts et saison estivale font varier l'activité du simple au triple selon les semaines.",
    reperes: ['le Parc des Expositions', 'la Sud de France Arena', "l'étang de l'Or", 'le centre ancien', 'la route des plages'],
    tissu: "restaurants et hôtels, traiteurs et prestataires événementiels, commerces de bord de route, artisans et locations saisonnières",
    web: {
      angle: "Les visiteurs d'un salon ou d'un concert à l'Arena cherchent « restaurant près du Parc Expo » ou « hôtel Pérols » depuis leur téléphone, souvent le jour même. Être visible à ce moment-là, c'est capter une clientèle que vos voisins laissent passer.",
      faq: { q: "Comment profiter des événements du Parc des Expositions et de l'Arena ?", a: "En travaillant les recherches liées aux événements (restaurant, parking, hébergement près du Parc Expo), en tenant vos horaires spéciaux à jour sur Google et en proposant la réservation en ligne pour les soirs de forte affluence." }
    },
    auto: {
      angle: "À Pérols, l'activité arrive par pics : un grand salon ou un concert peut remplir une semaine entière. Ce qui ne tient pas, ce sont les tâches manuelles au moment où tout arrive en même temps.",
      cases: [
        ['Calendrier des événements branché sur vos plannings', "Les dates de salons et concerts alimentent automatiquement vos prévisions de personnel et de stock : plus de semaine prise de court."],
        ['Devis traiteur et événementiel standardisés', "Nombre de couverts, formule, date : le devis se calcule et part avec le bon de commande, la facture d'acompte suit seule."],
        ['Messages clients en saison', "Confirmation, accès, horaires, rappel la veille : les questions répétitives des visiteurs reçoivent une réponse sans mobiliser l'équipe."]
      ],
      faq: { q: "Mon activité est très saisonnière : est-ce rentable d'automatiser ?", a: "C'est justement là que c'est le plus rentable : l'automatisation absorbe les pics sans recruter en urgence, puis ne coûte presque rien les semaines calmes. On chiffre le gain sur vos semaines les plus chargées avant de commencer." }
    }
  },
  {
    slug: 'villeneuve-les-maguelone', name: 'Villeneuve-lès-Maguelone', cp: '34750', lat: 43.5330, lng: 3.8630, metro: true, secteur: 'Sud de la métropole',
    profil: "Entre étangs, salins et la cathédrale de Maguelone posée sur son île, Villeneuve-lès-Maguelone garde une ambiance de village tout en étant à un quart d'heure de Montpellier. Tourisme nature, plage et vie locale s'y croisent.",
    reperes: ['la cathédrale de Maguelone', 'les étangs et salins', 'la plage', 'le centre du village', 'la voie verte du littoral'],
    tissu: "commerces du village, activités de plein air et de tourisme nature, hébergements, artisans et indépendants",
    web: {
      angle: "Les visiteurs de Maguelone et de la plage préparent leur sortie sur Google Maps : où manger, où louer un vélo, où dormir. Une commune de cette taille laisse beaucoup de place à qui se donne la peine d'être bien présenté en ligne.",
      faq: { q: "Mon activité ne tourne vraiment que l'été : le site sert-il le reste de l'année ?", a: "Oui : il prépare la saison. Les réservations de juillet se décident souvent au printemps. Un site qui prend les réservations et les acomptes en ligne vous évite aussi de courir après les confirmations en pleine saison." }
    },
    auto: {
      angle: "Les petites structures du village cumulent les rôles : accueil, réservations, comptabilité. Chaque heure de gestion reprise, c'est une heure de plus pour les clients.",
      cases: [
        ['Réservations et acomptes en ligne', "Le client choisit son créneau, paie l'acompte, reçoit sa confirmation : vous n'avez plus qu'à ouvrir le planning le matin."],
        ["Suivi météo et reports automatiques", "Pour une activité de plein air, un avis de mauvais temps déclenche la proposition de report aux clients concernés, sans appel un par un."],
        ['Facturation et relances de paiement', "Factures générées à la fin de la prestation, relances polies à J+7 et J+15 : la trésorerie ne dépend plus de votre mémoire."]
      ],
      faq: { q: "Je suis seul dans mon entreprise, est-ce vraiment pour moi ?", a: "C'est même le cas le plus fréquent. Quand on est seul, la moindre tâche répétitive se fait sur votre temps libre. On commence par la plus pénible, on mesure, et on n'avance que si le gain est net." }
    }
  },
  {
    slug: 'saint-jean-de-vedas', name: 'Saint-Jean-de-Védas', cp: '34430', lat: 43.5770, lng: 3.8300, metro: true, secteur: 'Ouest de la métropole',
    profil: "Au croisement de l'A9 et de l'A709, desservie par le tram, Saint-Jean-de-Védas concentre de grandes zones d'activités et commerciales au sud-ouest de Montpellier. Beaucoup d'entreprises B2B, de négoce et de services y ont leur siège.",
    reperes: ['le terminus du tram ligne 2', 'les zones d\'activités le long de l\'A9', 'le centre du village', 'le parc du Terral', 'les zones commerciales'],
    tissu: "PME B2B, négoce et distribution, concessions, artisans du bâtiment, commerces de zone et services aux entreprises",
    web: {
      angle: "À Saint-Jean-de-Védas, beaucoup d'entreprises vendent à d'autres entreprises. Un acheteur professionnel juge votre sérieux en trente secondes sur votre site : références, délais, zone d'intervention. S'il n'y trouve rien, il appelle le concurrent.",
      faq: { q: "Mon entreprise est B2B : un site sert-il vraiment à trouver des clients ?", a: "Oui, différemment. Il sert d'abord à rassurer un acheteur qui vous a été recommandé, puis à capter les recherches précises (« fournisseur + métier + Montpellier »). Une page par offre avec des références concrètes fait souvent plus qu'une campagne de prospection." }
    },
    auto: {
      angle: "Dans les zones d'activités védasiennes, le temps perdu est rarement là où on l'attend : ressaisies entre devis, commandes et factures, relances, rapprochements de fichiers.",
      cases: [
        ['Du devis à la facture sans ressaisie', "Le devis accepté devient bon de commande, puis bon de livraison, puis facture — les informations ne sont saisies qu'une fois."],
        ['Suivi des commandes fournisseurs', "Les confirmations et retards fournisseurs sont lus automatiquement et mettent à jour vos délais clients ; vous n'êtes alerté que s'il faut agir."],
        ['Tableau de bord hebdomadaire', "Chiffre signé, marge, impayés, commandes en retard : un résumé clair arrive chaque lundi matin, sans export Excel."]
      ],
      faq: { q: "Nous avons déjà un ERP : que pouvez-vous ajouter ?", a: "Ce qui se passe autour de l'ERP : les e-mails qui arrivent, les fichiers fournisseurs, les tableurs parallèles, les relances. On connecte ces flux à votre ERP pour que l'équipe arrête de faire le lien à la main." }
    }
  },
  {
    slug: 'fabregues', name: 'Fabrègues', cp: '34690', lat: 43.5510, lng: 3.7770, metro: true, secteur: 'Ouest de la métropole',
    profil: "Au pied du massif de la Gardiole, sur l'axe Montpellier–Sète, Fabrègues a grandi autour de ses zones d'activités tout en gardant son centre de village et ses domaines viticoles.",
    reperes: ['le massif de la Gardiole', 'les zones d\'activités', 'le centre du village', 'les domaines viticoles', "l'axe vers Sète"],
    tissu: "artisans du bâtiment, entreprises de transport et de logistique, domaines viticoles, commerces de proximité",
    web: {
      angle: "Les artisans de Fabrègues interviennent de Montpellier à Sète. Sur Google, il faut donc être trouvé pour toutes ces communes, pas seulement la sienne — c'est ce qu'une vraie stratégie de pages locales permet.",
      faq: { q: "J'interviens jusqu'à Sète et Frontignan : comment être visible sur toute ma zone ?", a: "En combinant une fiche Google bien paramétrée (zone d'intervention), un site qui présente clairement vos secteurs et des réalisations localisées. On évite les pages copiées-collées, qui ne fonctionnent plus." }
    },
    auto: {
      angle: "Pour les entreprises fabréguoises qui roulent toute la journée, la paperasse se fait le soir. C'est exactement ce qu'on retire.",
      cases: [
        ['Bons d\'intervention signés sur téléphone', "Le technicien remplit et fait signer sur place ; le rapport et la facture partent automatiquement au client."],
        ['Planification des tournées', "Les chantiers de la semaine sont regroupés par secteur pour limiter les trajets entre Montpellier, Sète et l'arrière-pays."],
        ['Ventes en ligne pour un domaine', "Commandes de vin, stocks et étiquettes d'expédition synchronisés : plus de double saisie entre la boutique et le chai."]
      ],
      faq: { q: "Mes équipes ne sont pas à l'aise avec l'informatique, est-ce un problème ?", a: "Non, c'est un critère de conception. Un bon outil terrain tient en un ou deux écrans, avec de gros boutons. On le teste avec vos équipes avant de le généraliser." }
    }
  },
  {
    slug: 'saussan', name: 'Saussan', cp: '34570', lat: 43.5720, lng: 3.7740, metro: true, secteur: 'Ouest de la métropole',
    profil: "Petit village de l'ouest montpelliérain entre Fabrègues et Pignan, Saussan a gardé ses vignes et sa vie de village tout en accueillant de nombreux indépendants installés à domicile.",
    reperes: ['le centre du village', 'les vignes', 'la route de Fabrègues', 'la route de Pignan'],
    tissu: "indépendants et professions libérales à domicile, artisans, viticulteurs, micro-entreprises de services",
    web: {
      angle: "Beaucoup d'entrepreneurs de Saussan travaillent seuls, depuis chez eux. Sans vitrine physique, le site et la fiche Google sont la seule preuve que l'entreprise existe et qu'elle est sérieuse.",
      faq: { q: "Je travaille depuis chez moi à Saussan : puis-je avoir une fiche Google sans afficher mon adresse ?", a: "Oui. Google permet de masquer l'adresse et d'afficher une zone d'intervention à la place. On la configure avec vous pour rester visible sans exposer votre domicile." }
    },
    auto: {
      angle: "Quand on est seul, le temps administratif est pris sur le temps facturable. À Saussan comme ailleurs, c'est le premier gisement.",
      cases: [
        ['Prise de rendez-vous en ligne', "Vos créneaux libres sont proposés directement aux clients ; plus d'aller-retour de messages pour caler un rendez-vous."],
        ['Devis et factures automatiques', "Un modèle par prestation, les montants se calculent, la facture part à la fin de la mission, les relances aussi."],
        ['Comptabilité préparée', "Les justificatifs reçus par e-mail sont classés et transmis à votre comptable chaque mois, sans tri manuel."]
      ],
      faq: { q: "Pour une micro-entreprise, ça ne coûte pas trop cher ?", a: "On part de votre gain réel : si une automatisation ne vous fait pas gagner nettement plus qu'elle ne coûte, on vous le dit et on ne la fait pas. Notre devise : on gagne de l'argent uniquement si vous en gagnez." }
    }
  },
  {
    slug: 'pignan', name: 'Pignan', cp: '34570', lat: 43.5840, lng: 3.7630, metro: true, secteur: 'Ouest de la métropole',
    profil: "Pignan, avec son château et l'abbaye du Vignogoul toute proche, est un bourg vivant de l'ouest de la métropole : un vrai cœur commerçant, des vignerons et une population qui travaille souvent à Montpellier.",
    reperes: ['le château de Pignan', "l'abbaye du Vignogoul", 'le cœur de village', 'les caves et domaines'],
    tissu: "commerces du centre-bourg, vignerons et caves, artisans, professions de santé et services de proximité",
    web: {
      angle: "Les habitants de Pignan cherchent d'abord près de chez eux — mais tapent souvent « Montpellier » par réflexe. Un site bien construit doit capter les deux recherches.",
      faq: { q: "Mes clients tapent « Montpellier » et pas « Pignan » : comment ressortir quand même ?", a: "En travaillant les deux : une fiche Google bien ancrée à Pignan pour la proximité, et un site qui explique clairement que vous desservez l'ouest montpelliérain, avec des contenus qui le prouvent." }
    },
    auto: {
      angle: "Les commerces et domaines pignanais gèrent souvent en parallèle la vente sur place, les commandes à distance et les réseaux sociaux.",
      cases: [
        ['Click & collect pour le commerce du bourg', "Commande en ligne, préparation, SMS quand c'est prêt : un canal de vente de plus sans alourdir la journée."],
        ['Fichier clients vivant pour la cave', "Chaque achat enrichit la fiche client ; les invitations aux portes ouvertes ciblent ceux qui ont vraiment acheté."],
        ['Publications planifiées', "Une séance par mois pour préparer les publications ; elles partent seules sur Google et les réseaux."]
      ],
      faq: { q: "Je veux vendre mon vin en ligne sans y passer mes soirées : possible ?", a: "Oui : boutique, stock, préparation des colis et facturation peuvent être reliés. Vous gardez la main sur les prix et les millésimes, le reste suit automatiquement." }
    }
  },
  {
    slug: 'laverune', name: 'Lavérune', cp: '34880', lat: 43.5910, lng: 3.8060, metro: true, secteur: 'Ouest de la métropole',
    profil: "Aux portes de Montpellier, Lavérune est connue pour son château des Évêques et son parc. Une commune résidentielle et paisible, où s'installent de nombreux indépendants et professions libérales.",
    reperes: ['le château des Évêques', 'le parc du château', 'le centre du village', 'la Mosson'],
    tissu: "professions libérales, consultants et indépendants, artisans, commerces de proximité",
    web: {
      angle: "À Lavérune, la clientèle vient souvent par recommandation. Le site ne sert pas à être découvert par hasard : il transforme la recommandation en prise de contact, en rassurant tout de suite.",
      faq: { q: "Mes clients viennent par bouche-à-oreille : ai-je besoin d'un site ?", a: "Oui, car la personne recommandée vérifie presque toujours en ligne avant d'appeler. Si elle ne trouve rien, ou un site daté, la recommandation se perd. Un site simple et sérieux suffit à la convertir." }
    },
    auto: {
      angle: "Les indépendants lavérunois perdent surtout du temps sur l'administratif : prises de rendez-vous, comptes rendus, facturation.",
      cases: [
        ['Comptes rendus générés', "À partir de vos notes ou d'un enregistrement, un compte rendu propre est préparé ; vous relisez et envoyez."],
        ['Agenda en libre-service', "Les clients réservent sur vos créneaux, reçoivent un rappel et le lien de visio si besoin."],
        ['Onboarding client automatique', "Contrat, questionnaire de départ, documents à fournir : tout part dès la signature, avec relance si rien ne revient."]
      ],
      faq: { q: "L'IA peut-elle vraiment rédiger mes comptes rendus ?", a: "Elle prépare une base fiable à partir de vos notes, dans votre style. Vous gardez toujours la relecture et la décision : on ne retire que la mise en forme, pas votre expertise." }
    }
  },
  {
    slug: 'cournonterral', name: 'Cournonterral', cp: '34660', lat: 43.5590, lng: 3.7200, metro: true, secteur: 'Ouest de la métropole',
    profil: "Connue loin à la ronde pour la fête des Pailhasses, Cournonterral est un bourg de caractère à l'ouest de la métropole, entouré de vignes et de garrigue, avec une vraie vie associative et commerçante.",
    reperes: ['la fête des Pailhasses', 'le centre ancien', 'la garrigue', 'les vignes', 'la route de Cournonsec'],
    tissu: "commerces du centre, artisans, vignerons, associations et petites entreprises de services",
    web: {
      angle: "Dans un bourg comme Cournonterral, tout le monde connaît les commerces… sauf les nouveaux habitants, de plus en plus nombreux. Eux cherchent sur Google. Une fiche à jour et un site simple les font venir dès la première semaine.",
      faq: { q: "Les nouveaux arrivants de Cournonterral me trouvent-ils vraiment en ligne ?", a: "Ce sont eux qui cherchent le plus : ils ne connaissent pas encore les adresses. Une fiche Google complète (photos, horaires, avis) et un site clair suffisent souvent à capter cette clientèle." }
    },
    auto: {
      angle: "Artisans et commerçants de Cournonterral jonglent entre le terrain et la gestion. Les tâches répétitives s'accumulent en fin de semaine.",
      cases: [
        ['Demandes de devis triées', "Les demandes reçues par formulaire, e-mail ou message sont regroupées, complétées si besoin, et classées par urgence."],
        ['Rappels d\'entretien clients', "Chaudière, jardin, véhicule : un rappel part automatiquement au bon moment et remplit votre planning des mois creux."],
        ['Gestion d\'association simplifiée', "Adhésions, cotisations, convocations et relances : pour les associations très actives du bourg, tout suit sans tableur."]
      ],
      faq: { q: "Pouvez-vous aussi aider une association du village ?", a: "Oui : adhésions en ligne, paiements, listes de membres et convocations automatiques. C'est souvent quelques heures de travail qui soulagent des bénévoles toute l'année." }
    }
  },
  {
    slug: 'cournonsec', name: 'Cournonsec', cp: '34660', lat: 43.5490, lng: 3.7060, metro: true, secteur: 'Ouest de la métropole',
    profil: "Village de garrigue à l'extrémité ouest de la métropole, Cournonsec a vu arriver de nombreuses familles tout en gardant son caractère. On y trouve des artisans, des indépendants et des activités tournées vers la nature.",
    reperes: ['le vieux village', 'la garrigue', 'les chemins de randonnée', 'la route de Gigean'],
    tissu: "artisans, indépendants à domicile, activités de nature et de loisirs, petits commerces",
    web: {
      angle: "À Cournonsec, la plupart des entreprises n'ont pas de vitrine sur rue. Leur visibilité se joue entièrement en ligne, sur une zone qui va de Montpellier au bassin de Thau.",
      faq: { q: "Je n'ai pas de local commercial : comment être visible ?", a: "Avec une fiche Google en zone d'intervention, un site qui montre vos réalisations et une page claire par service. Pour un artisan sans vitrine, c'est ce qui remplace la devanture." }
    },
    auto: {
      angle: "Les artisans et indépendants de Cournonsec passent un temps précieux à répondre, relancer et facturer.",
      cases: [
        ['Réponse immédiate aux demandes', "Chaque demande reçoit un accusé de réception personnalisé avec les informations utiles et les prochaines étapes, même quand vous êtes sur un chantier."],
        ['Relances de devis non signés', "Un devis sans réponse est relancé poliment à J+5 et J+12 ; vous êtes prévenu dès qu'il est accepté."],
        ['Avis clients collectés', "Une fois la prestation terminée, le client reçoit une demande d'avis au bon moment : votre note Google monte sans effort."]
      ],
      faq: { q: "Combien de temps faut-il pour mettre en place une première automatisation ?", a: "Pour une relance de devis ou une collecte d'avis, quelques jours. On commence toujours par la tâche la plus simple et la plus rentable pour que vous voyiez l'effet rapidement." }
    }
  },
  {
    slug: 'murviel-les-montpellier', name: 'Murviel-lès-Montpellier', cp: '34570', lat: 43.6050, lng: 3.7380, metro: true, secteur: 'Ouest de la métropole',
    profil: "Village perché au milieu de la garrigue et des vignes, Murviel-lès-Montpellier abrite le site archéologique d'Altimurium. Un cadre prisé, calme, où vivent de nombreux indépendants et quelques domaines.",
    reperes: ["le site archéologique d'Altimurium", 'le village perché', 'la garrigue', 'les domaines viticoles'],
    tissu: "indépendants, artisans d'art, gîtes et chambres d'hôtes, domaines viticoles",
    web: {
      angle: "Gîtes, artisans d'art, domaines : à Murviel, l'offre est rare et de qualité, mais souvent invisible. Un beau site avec réservation en ligne évite de dépendre à 100 % des plateformes qui prennent leur commission.",
      faq: { q: "Je loue un gîte via les grandes plateformes : pourquoi un site en plus ?", a: "Pour que vos clients fidèles et ceux qui vous trouvent sur Google réservent en direct, sans commission. Le site récupère aussi les demandes de groupes et de séjours longs que les plateformes gèrent mal." }
    },
    auto: {
      angle: "Les petites structures murviellaises gèrent réservations, accueil et communication avec très peu de mains.",
      cases: [
        ['Calendriers synchronisés', "Réservations directes et plateformes alimentent un seul calendrier : fini les doubles réservations."],
        ['Accueil automatisé des voyageurs', "Instructions d'arrivée, code d'accès, recommandations locales : envoyés au bon moment, dans la langue du client."],
        ['Commandes d\'artisanat d\'art', "Demandes sur-mesure qualifiées par un court formulaire, devis et acompte en ligne, suivi de fabrication envoyé au client."]
      ],
      faq: { q: "Mes clients sont souvent étrangers : peut-on gérer plusieurs langues ?", a: "Oui. Les messages automatiques peuvent partir dans la langue du client, et le site peut être proposé en anglais ou dans d'autres langues selon votre clientèle." }
    }
  },
  {
    slug: 'saint-georges-d-orques', name: "Saint-Georges-d'Orques", cp: '34680', lat: 43.6120, lng: 3.7810, metro: true, secteur: 'Ouest de la métropole',
    profil: "Terroir viticole reconnu aux portes de Montpellier, Saint-Georges-d'Orques est un village de vignerons devenu aussi un lieu de vie recherché, entre caves, domaines et nouveaux quartiers.",
    reperes: ['le terroir viticole de Saint-Georges-d\'Orques', 'les caves et domaines', 'le centre du village', 'la route de Juvignac'],
    tissu: "domaines et caves, oenotourisme, artisans, commerces et services de proximité",
    web: {
      angle: "Les amateurs de vin et les Montpelliérains en balade cherchent « domaine Saint-Georges-d'Orques » ou « dégustation près de Montpellier ». Un site qui raconte le domaine et permet de réserver une visite transforme la curiosité en visite, puis en commande.",
      faq: { q: "Un domaine a-t-il besoin d'un site si ses vins sont chez les cavistes ?", a: "Oui : c'est lui qui crée le lien direct avec le client final (visites, événements, vente en ligne) et qui porte votre histoire. Les ventes directes sont aussi les plus rentables." }
    },
    auto: {
      angle: "Les domaines du village cumulent production, vente au caveau, export, événements et administratif.",
      cases: [
        ['Réservation de dégustations', "Créneaux de visite en ligne, rappel la veille, questionnaire de goût : le groupe arrive attendu, vous préparez les bonnes bouteilles."],
        ['Vente en ligne reliée au chai', "Commandes, stock par cuvée, étiquettes d'expédition et factures synchronisés automatiquement."],
        ['Déclarations et documents préparés', "Les données de ventes sont consolidées pour préparer vos déclarations et vos tableaux de suivi sans ressaisie."]
      ],
      faq: { q: "Pouvez-vous relier la boutique en ligne à mon logiciel de cave ?", a: "Dans la plupart des cas, oui, via les exports ou les connecteurs existants. Si ce n'est pas possible, on met en place une synchronisation simple pour qu'aucune commande ne soit ressaisie." }
    }
  },
  {
    slug: 'juvignac', name: 'Juvignac', cp: '34990', lat: 43.6140, lng: 3.8110, metro: true, secteur: 'Ouest de la métropole',
    profil: "Terminus du tram ligne 3, Juvignac a fortement grandi avec le quartier des Constellations, tout en gardant le golf de Fontcaude et le vieux village. Une commune jeune, familiale, très connectée.",
    reperes: ['le terminus du tram ligne 3', 'le quartier des Constellations', 'le golf de Fontcaude', 'le vieux village', 'la Mosson'],
    tissu: "commerces et services de quartier, professions de santé, coachs et activités de loisirs, artisans",
    web: {
      angle: "Population jeune, habitudes mobiles : à Juvignac, on réserve son coiffeur, son coach ou son kiné depuis son téléphone. Une activité qui ne propose pas la réservation en ligne perd ces clients sans même le savoir.",
      faq: { q: "La réservation en ligne est-elle indispensable pour mon activité à Juvignac ?", a: "Pour les services du quotidien (beauté, santé, sport, loisirs), c'est devenu un critère de choix. Elle réduit aussi les appels pendant que vous travaillez et, avec les rappels, les rendez-vous oubliés." }
    },
    auto: {
      angle: "Les activités de service juvignacoises vivent de la récurrence : abonnements, séances, rendez-vous réguliers.",
      cases: [
        ['Abonnements et séances gérés seuls', "Paiement récurrent, décompte des séances, relance avant expiration : l'administratif du club ou du studio disparaît."],
        ['Liste d\'attente intelligente', "Un créneau se libère ? La première personne en liste est prévenue et peut le prendre en un clic."],
        ['Fidélisation automatique', "Un client qui ne revient plus depuis six semaines reçoit un message personnalisé ; ceux qui reviennent souvent sont remerciés."]
      ],
      faq: { q: "J'utilise déjà une application de réservation : que pouvez-vous ajouter ?", a: "Tout ce qu'elle ne fait pas : relier les paiements à votre comptabilité, relancer les clients inactifs, produire vos statistiques. On travaille avec votre outil au lieu de le remplacer." }
    }
  },
  {
    slug: 'grabels', name: 'Grabels', cp: '34790', lat: 43.6480, lng: 3.7990, metro: true, secteur: 'Nord-ouest de la métropole',
    profil: "Au nord-ouest de Montpellier, à deux pas du pôle santé et recherche d'Euromédecine, Grabels mêle vieux village, quartiers récents comme la Valsière et garrigue. Beaucoup de chercheurs, soignants et entrepreneurs y vivent.",
    reperes: ['le vieux village', 'le quartier de la Valsière', 'la proximité d\'Euromédecine', 'la Mosson', 'la garrigue'],
    tissu: "professions de santé, start-up et consultants, artisans, commerces de proximité",
    web: {
      angle: "Proche d'Euromédecine, Grabels accueille une clientèle exigeante et pressée. Pour un cabinet, un consultant ou un artisan, le site doit aller droit au but : ce que vous faites, pour qui, comment prendre rendez-vous.",
      faq: { q: "Je suis professionnel de santé : que puis-je mettre sur mon site ?", a: "Les informations pratiques, vos spécialités, l'accès, la prise de rendez-vous et des contenus d'information, dans le respect des règles de votre ordre. On vous accompagne pour rester clair et conforme." }
    },
    auto: {
      angle: "Cabinets, laboratoires et jeunes entreprises grabellois manipulent beaucoup de documents et de données.",
      cases: [
        ['Documents patients ou clients classés', "Les pièces reçues par e-mail sont reconnues, renommées et rangées dans le bon dossier, avec alerte si un document manque."],
        ['Veille et synthèse automatisées', "Pour les équipes de recherche et les consultants : les nouvelles publications sur vos sujets sont collectées et résumées chaque semaine."],
        ['Qualification des demandes entrantes', "Les demandes sont analysées et orientées vers la bonne personne avec un résumé ; plus aucune ne se perd."]
      ],
      faq: { q: "Mes données sont sensibles : comment sont-elles protégées ?", a: "On privilégie des outils hébergés en Europe, on limite les accès au strict nécessaire et on documente les traitements pour votre conformité RGPD. Quand une donnée ne doit pas sortir, elle ne sort pas." }
    }
  },

  /* ═════════════════ MÉTROPOLE — NORD ═════════════════ */
  {
    slug: 'castelnau-le-lez', name: 'Castelnau-le-Lez', cp: '34170', lat: 43.6330, lng: 3.9010, metro: true, secteur: 'Nord-est de la métropole',
    profil: "Le long du Lez et du tram ligne 2, Castelnau-le-Lez est la ville la plus peuplée de la métropole après Montpellier. Sièges d'entreprises, cabinets, commerces du Sablassou : le tissu économique y est dense et très tertiaire.",
    reperes: ['les bords du Lez', 'le tram ligne 2', 'le Sablassou', 'le centre-ville', 'les zones d\'activités'],
    tissu: "cabinets (expertise, conseil, avocats), professions de santé, sièges de PME, commerces et services",
    web: {
      angle: "À Castelnau-le-Lez, un prospect compare souvent trois cabinets ou trois prestataires avant d'appeler. Le site qui explique le mieux, avec des cas concrets et une prise de rendez-vous simple, décroche l'appel.",
      faq: { q: "Castelnau est très concurrentiel : comment se démarquer en ligne ?", a: "En étant plus précis que les autres : une page par expertise, des exemples réels, des réponses aux vraies questions de vos clients et une prise de contact sans friction. La précision bat le volume." }
    },
    auto: {
      angle: "Les cabinets et PME castelnauviens passent une grande partie de leur temps sur des tâches à faible valeur : saisie, relances, préparation de dossiers.",
      cases: [
        ['Collecte de pièces clients', "Chaque client reçoit sa liste de documents, les dépose en ligne, est relancé automatiquement ; vous voyez l'état de chaque dossier d'un coup d'œil."],
        ['Préparation de dossiers', "Les informations sont extraites des documents reçus et pré-remplissent vos modèles ; le collaborateur vérifie au lieu de saisir."],
        ['Reporting client automatique', "Chaque mois, un rapport clair part à chaque client avec ses indicateurs, sans copier-coller."]
      ],
      faq: { q: "Pour un cabinet d'expertise ou d'avocats, qu'est-ce qui s'automatise vraiment ?", a: "La collecte et le tri des pièces, l'extraction d'informations, les relances, la préparation des premières versions de documents et le suivi des échéances. Le conseil et la signature restent les vôtres." }
    }
  },
  {
    slug: 'clapiers', name: 'Clapiers', cp: '34830', lat: 43.6570, lng: 3.8890, metro: true, secteur: 'Nord de la métropole',
    profil: "Commune verte et résidentielle au nord de Montpellier, Clapiers accueille aussi Cap Alpha, pépinière d'entreprises de la métropole : un mélange rare de villages, de familles et de jeunes entreprises innovantes.",
    reperes: ['Cap Alpha', 'le centre du village', 'les bords du Lez', 'le parc de Clapiers'],
    tissu: "start-up et jeunes entreprises innovantes, consultants, artisans, commerces et services de proximité",
    web: {
      angle: "À Clapiers, deux publics cherchent en ligne : les familles, qui veulent un artisan ou un service de confiance près de chez elles, et les entreprises, qui cherchent un partenaire sérieux. Le site doit parler clairement à l'un ou à l'autre.",
      faq: { q: "Je lance mon entreprise à Clapiers : par quoi commencer en ligne ?", a: "Par une fiche Google complète et un site simple d'une à trois pages qui explique précisément votre offre. On peut enrichir ensuite, mais ces bases font déjà l'essentiel des premiers contacts." }
    },
    auto: {
      angle: "Les jeunes entreprises de Cap Alpha comme les artisans clapiérois ont le même problème : peu de mains, beaucoup à faire.",
      cases: [
        ['CRM qui se remplit seul', "Chaque e-mail, appel ou formulaire crée ou met à jour la fiche du prospect ; les relances sont programmées automatiquement."],
        ['Prototype d\'outil métier', "Pour une start-up, on construit rapidement une première version fonctionnelle à montrer à vos clients ou investisseurs."],
        ['Onboarding de nouveaux clients', "Contrat, facture, accès, e-mail de bienvenue : tout s'enchaîne dès la signature."]
      ],
      faq: { q: "Travaillez-vous avec des start-up en phase de lancement ?", a: "Oui. On peut construire un premier outil ou automatiser vos process pour tenir la croissance sans recruter trop tôt. Et si le projet s'y prête, on peut même discuter d'un partenariat plutôt que d'une prestation." }
    }
  },
  {
    slug: 'jacou', name: 'Jacou', cp: '34830', lat: 43.6610, lng: 3.9120, metro: true, secteur: 'Nord de la métropole',
    profil: "Terminus nord du tram ligne 2, Jacou est une commune résidentielle agréable, organisée autour du parc et du château de Bocaud. Commerces de proximité, artisans et professions libérales y servent une clientèle très locale.",
    reperes: ['le château et le parc de Bocaud', 'le terminus du tram ligne 2', 'le centre commerçant', 'la route de Teyran'],
    tissu: "commerces de proximité, professions libérales et paramédicales, artisans, services à la personne",
    web: {
      angle: "À Jacou, on choisit volontiers un commerce ou un artisan de la commune — encore faut-il savoir qu'il existe. Les recherches « près de moi » sont le premier réflexe : c'est là qu'il faut apparaître.",
      faq: { q: "Comment apparaître sur les recherches « près de moi » à Jacou ?", a: "C'est surtout la fiche Google qui compte : catégorie juste, photos, horaires, avis récents, publications. Le site vient confirmer et convertir. On s'occupe des deux ensemble." }
    },
    auto: {
      angle: "Les activités de proximité jacoumardes perdent du temps sur le téléphone, les rendez-vous et les rappels.",
      cases: [
        ['Standard qui ne sonne plus pour rien', "Les questions fréquentes (horaires, tarifs, accès) reçoivent une réponse automatique par message ; vous ne prenez que les vrais appels."],
        ['Rappels de rendez-vous par SMS', "La veille, un rappel avec possibilité de décaler : moins de rendez-vous manqués, planning plus plein."],
        ['Avis Google après chaque prestation', "Une demande d'avis bien placée, au bon moment : votre fiche devient la plus crédible du quartier."]
      ],
      faq: { q: "Les rappels SMS, ça marche vraiment contre les rendez-vous manqués ?", a: "Oui, c'est l'une des automatisations les plus rentables pour une activité sur rendez-vous : un rappel la veille avec une option pour décaler libère le créneau au lieu de le perdre." }
    }
  },
  {
    slug: 'le-cres', name: 'Le Crès', cp: '34920', lat: 43.6480, lng: 3.9400, metro: true, secteur: 'Est de la métropole',
    profil: "Entre Castelnau et Vendargues, Le Crès s'est développé autour de son lac et de ses zones d'activités. Une commune dynamique, bien reliée, où cohabitent familles, artisans et entreprises de services.",
    reperes: ['le lac du Crès', 'les zones d\'activités', 'le centre-ville', 'la route de Nîmes'],
    tissu: "artisans du bâtiment, entreprises de services, commerces, professions libérales",
    web: {
      angle: "Les entreprises crésoises travaillent sur toute la métropole est. Le site doit donc prouver qu'on intervient partout — Castelnau, Vendargues, Castries — avec des réalisations locales en preuve.",
      faq: { q: "Est-ce utile de montrer mes chantiers sur mon site ?", a: "C'est ce qui convainc le plus. Des photos avant/après localisées (« salle de bain au Crès », « terrasse à Vendargues ») rassurent le client et aident Google à comprendre où vous intervenez." }
    },
    auto: {
      angle: "Dans les entreprises du Crès, la croissance se heurte vite au temps de gestion : devis, planning, facturation.",
      cases: [
        ['Planning d\'équipes partagé', "Les chantiers, les absences et les véhicules dans un seul planning mis à jour en temps réel, visible sur téléphone."],
        ['Devis à partir de photos', "Le client envoie ses photos et ses dimensions ; une estimation est préparée, vous validez et envoyez."],
        ['Suivi de chantier pour le client', "Le client reçoit automatiquement les étapes clés (démarrage, avancement, fin) : moins d'appels, plus de confiance."]
      ],
      faq: { q: "Peut-on commencer petit, sur une seule tâche ?", a: "C'est ce qu'on recommande. On choisit la tâche qui vous coûte le plus, on l'automatise, on mesure le gain. Ensuite seulement on décide ensemble de la suite." }
    }
  },
  {
    slug: 'teyran', name: 'Teyran', cp: '34820', lat: 43.6850, lng: 3.9290, metro: false, secteur: 'Nord de Montpellier',
    profil: "Au nord-est de Montpellier, entre Jacou et Assas, Teyran est une commune résidentielle au milieu de la garrigue. Beaucoup d'indépendants y travaillent depuis chez eux et rayonnent vers la métropole.",
    reperes: ['le centre du village', 'la garrigue', 'la route de Jacou', 'la route d\'Assas'],
    tissu: "indépendants et professions libérales, artisans, services à domicile",
    web: {
      angle: "Pour un indépendant installé à Teyran, la clientèle est surtout à Montpellier et dans le nord de la métropole. Le site doit capter ces recherches, pas seulement celles du village.",
      faq: { q: "Faut-il écrire « Montpellier » ou « Teyran » sur mon site ?", a: "Les deux, de façon honnête : votre base à Teyran, et les secteurs que vous desservez réellement. Google récompense la clarté ; il pénalise les listes de villes sans contenu." }
    },
    auto: {
      angle: "À Teyran, les indépendants gagnent surtout du temps sur l'administratif et la relation client.",
      cases: [
        ['Devis, factures et relances', "Tout part automatiquement selon vos modèles, avec relance polie des impayés."],
        ['Agenda synchronisé', "Vos disponibilités sont proposées en ligne et synchronisées avec votre agenda personnel."],
        ['Newsletter qui s\'écrit à partir de votre actualité', "Vos réalisations du mois deviennent un e-mail aux clients, préparé automatiquement, que vous validez."]
      ],
      faq: { q: "Teyran n'est pas dans la métropole : intervenez-vous quand même ?", a: "Bien sûr. On travaille avec les entreprises de tout l'Hérault ; le premier échange se fait par téléphone ou visio, et on se déplace quand le projet le demande." }
    }
  },
  {
    slug: 'assas', name: 'Assas', cp: '34820', lat: 43.7030, lng: 3.9000, metro: false, secteur: 'Nord de Montpellier',
    profil: "Village au pied du massif, dominé par son château, Assas marque la transition entre la métropole et le Grand Pic Saint-Loup. Cadre calme, vignes, et des indépendants attachés au lieu.",
    reperes: ['le château d\'Assas', 'le vieux village', 'les vignes', 'la route de Teyran'],
    tissu: "indépendants, artisans, domaines et activités de loisirs, hébergements",
    web: {
      angle: "Entre Montpellier et le Pic Saint-Loup, les entreprises d'Assas visent deux clientèles : les Montpelliérains à quelques minutes, et les visiteurs de l'arrière-pays. Un site clair permet de parler aux deux.",
      faq: { q: "Mon activité est à la campagne : les gens me trouvent-ils sur Google ?", a: "Oui, à condition d'être bien référencé sur les recherches de votre métier dans le secteur (Pic Saint-Loup, nord de Montpellier). Les recherches géographiques sont très précises aujourd'hui : c'est une chance pour les activités rurales." }
    },
    auto: {
      angle: "Les petites entreprises assasoises gèrent souvent tout de front, avec peu de temps pour l'administratif.",
      cases: [
        ['Réservations et paiements en ligne', "Pour un hébergement ou une activité : réservation, acompte, confirmation et rappel, sans aller-retour de messages."],
        ['Relances et facturation', "Factures envoyées à la fin de la prestation, relances automatiques, rapprochement bancaire simplifié."],
        ['Contenus planifiés', "Photos du lieu et actualités préparées une fois par mois, publiées automatiquement sur Google et les réseaux."]
      ],
      faq: { q: "Faut-il être très équipé informatiquement ?", a: "Non. Un téléphone et une adresse e-mail suffisent pour démarrer. On s'appuie sur des outils simples, et c'est nous qui gérons la partie technique." }
    }
  },
  {
    slug: 'prades-le-lez', name: 'Prades-le-Lez', cp: '34730', lat: 43.6980, lng: 3.8650, metro: true, secteur: 'Nord de la métropole',
    profil: "Au bord du Lez, Prades-le-Lez accueille le domaine départemental de Restinclières. Une commune résidentielle nichée dans la verdure, porte d'entrée vers le Pic Saint-Loup.",
    reperes: ['le domaine de Restinclières', 'les bords du Lez', 'le centre du village', 'la route du Pic Saint-Loup'],
    tissu: "artisans, indépendants, activités de nature, commerces de proximité",
    web: {
      angle: "À Prades-le-Lez, beaucoup de clients viennent de Montpellier ou des villages voisins. Le site doit montrer clairement jusqu'où vous intervenez et pourquoi on vous fait confiance.",
      faq: { q: "Mon activité est surtout saisonnière (nature, loisirs) : que faire hors saison ?", a: "Préparer la suivante : le site capte les demandes de groupes, d'écoles et d'entreprises qui réservent longtemps à l'avance, et entretient le lien avec vos clients par e-mail." }
    },
    auto: {
      angle: "Les entreprises pradéennes, souvent petites, gagnent le plus en supprimant les aller-retours avec les clients.",
      cases: [
        ['Formulaire de demande intelligent', "Le client répond à quelques questions ; vous recevez une demande complète au lieu de trois échanges pour comprendre le besoin."],
        ['Réservations de groupes', "Écoles, entreprises, associations : devis, convention et facture générés à partir d'une seule demande."],
        ['Relances et avis', "Relance des devis sans réponse et demande d'avis après prestation, automatiquement."]
      ],
      faq: { q: "Que se passe-t-il si l'automatisation fait une erreur ?", a: "On prévoit des garde-fous : validation humaine sur ce qui compte (prix, engagement), alertes en cas d'anomalie, et un suivi les premières semaines. Rien de critique ne part sans votre accord." }
    }
  },
  {
    slug: 'montferrier-sur-lez', name: 'Montferrier-sur-Lez', cp: '34980', lat: 43.6680, lng: 3.8570, metro: true, secteur: 'Nord de la métropole',
    profil: "Commune résidentielle huppée au nord de Montpellier, Montferrier-sur-Lez abrite le campus de recherche de Baillarguet. Une population exigeante, beaucoup de cadres, chercheurs et professions libérales.",
    reperes: ['le campus de Baillarguet', 'le vieux village et son château', 'les bords du Lez', 'la route de Mende'],
    tissu: "professions libérales, consultants, chercheurs entrepreneurs, artisans haut de gamme, services à domicile",
    web: {
      angle: "À Montferrier-sur-Lez, la clientèle attend un niveau de présentation élevé. Un site daté ou approximatif suffit à faire perdre un chantier ou un client, même sur recommandation.",
      faq: { q: "Je vise une clientèle haut de gamme : qu'est-ce qui compte sur un site ?", a: "La sobriété, des photos de qualité, des références crédibles et une prise de contact très simple. Moins de texte, plus de preuves. On conçoit le site comme votre meilleure carte de visite." }
    },
    auto: {
      angle: "Consultants, chercheurs entrepreneurs et professions libérales de Montferrier ont en commun un temps très cher, trop souvent absorbé par l'administratif.",
      cases: [
        ['Analyse de documents volumineux', "Contrats, rapports, appels d'offres : les points clés sont extraits et résumés, vous lisez l'essentiel."],
        ['Propositions commerciales préparées', "À partir d'un brief, une première proposition est rédigée dans votre format ; vous l'ajustez."],
        ['Suivi de projets clients', "Jalons, livrables et relances suivis automatiquement ; un point d'étape part au client chaque semaine."]
      ],
      faq: { q: "Pouvez-vous construire un outil sur-mesure pour valoriser une recherche ?", a: "Oui : transformer un modèle, un algorithme ou une base de données en outil utilisable par des clients, c'est précisément notre métier d'éditeur. On en discute dans un premier appel de dix minutes." }
    }
  },
  {
    slug: 'saint-clement-de-riviere', name: 'Saint-Clément-de-Rivière', cp: '34980', lat: 43.6830, lng: 3.8420, metro: false, secteur: 'Nord de Montpellier',
    profil: "Au nord de Montpellier, Saint-Clément-de-Rivière associe quartiers résidentiels recherchés et la zone commerciale de Trifontaine. Une commune active, entre commerce, santé et services.",
    reperes: ['la zone de Trifontaine', 'le vieux village', 'la route de Ganges', 'la garrigue'],
    tissu: "commerces de zone, professions de santé, services aux particuliers, artisans",
    web: {
      angle: "Autour de Trifontaine, les commerces se disputent des clients qui ont déjà comparé en ligne. La fiche Google et les avis font souvent la différence avant même que le client se gare.",
      faq: { q: "Mon commerce est dans une zone commerciale : un site est-il utile ?", a: "Oui, pour montrer ce que vous avez en stock, vos services et vos horaires, et pour capter les recherches précises (« produit + nord Montpellier »). Le client qui a vérifié en ligne achète plus souvent." }
    },
    auto: {
      angle: "Les commerces et services de Saint-Clément doivent tenir stocks, commandes, rendez-vous et relation client en même temps.",
      cases: [
        ['Stock visible en ligne', "Votre stock se met à jour sur le site automatiquement ; le client vérifie la disponibilité avant de venir."],
        ['Commandes et réservations d\'articles', "Le client réserve en ligne, vous préparez, il vient retirer : moins d'appels, plus de ventes."],
        ['Programme de fidélité automatique', "Points, offres d'anniversaire, relances des clients inactifs : sans carte papier ni saisie."]
      ],
      faq: { q: "Pouvez-vous connecter ma caisse au site ?", a: "Dans la plupart des cas, oui, via les connecteurs de votre logiciel de caisse. On vérifie la compatibilité dès le premier échange." }
    }
  },
  {
    slug: 'saint-gely-du-fesc', name: 'Saint-Gély-du-Fesc', cp: '34980', lat: 43.6930, lng: 3.8060, metro: false, secteur: 'Nord de Montpellier',
    profil: "Commune dynamique du nord montpelliérain, sur la route du Pic Saint-Loup, Saint-Gély-du-Fesc a un vrai tissu commerçant, des familles actives et de nombreux indépendants.",
    reperes: ['le centre commerçant', 'la route de Ganges', 'la direction du Pic Saint-Loup', 'les quartiers résidentiels'],
    tissu: "commerces, professions de santé, services à la personne, artisans, indépendants",
    web: {
      angle: "À Saint-Gély, les habitants privilégient les commerces et artisans du nord, pour éviter les bouchons vers Montpellier. Être bien référencé sur « votre métier + Saint-Gély-du-Fesc » capte ce réflexe local.",
      faq: { q: "Mes concurrents sont à Montpellier : ai-je un avantage à être à Saint-Gély ?", a: "Oui : la proximité. Beaucoup d'habitants du nord cherchent à éviter la ville. Un site et une fiche Google qui mettent en avant votre localisation et votre réactivité en font un vrai argument." }
    },
    auto: {
      angle: "Les entreprises saint-gilloises de service vivent de rendez-vous, de devis et de clients récurrents.",
      cases: [
        ['Rendez-vous en ligne avec acompte', "Pour les prestations longues ou coûteuses, l'acompte sécurise le créneau et réduit les annulations."],
        ['Relance des clients récurrents', "Entretien annuel, contrôle, renouvellement : le client est prévenu à temps, vous remplissez votre planning."],
        ['Suivi des devis', "Chaque devis a un statut ; relances automatiques et alerte quand un devis important reste sans réponse."]
      ],
      faq: { q: "Est-ce que l'automatisation rend la relation client plus froide ?", a: "C'est l'inverse quand c'est bien fait : les messages sont personnalisés et partent au bon moment, et vous avez plus de temps pour les échanges qui comptent vraiment." }
    }
  },

  /* ═════════════════ MÉTROPOLE — EST ═════════════════ */
  {
    slug: 'vendargues', name: 'Vendargues', cp: '34740', lat: 43.6570, lng: 3.9700, metro: true, secteur: 'Est de la métropole',
    profil: "Vendargues est l'un des grands pôles économiques de l'est montpelliérain grâce à la zone d'activités du Salaison, au carrefour des axes vers Nîmes. Industrie, logistique, négoce et artisans y côtoient un centre de village vivant.",
    reperes: ['la zone d\'activités du Salaison', 'le centre du village', 'les axes vers Nîmes et l\'A9', 'le Salaison'],
    tissu: "PME industrielles et logistiques, négoce, artisans du bâtiment, entreprises de services B2B",
    web: {
      angle: "Au Salaison, vos clients sont d'autres entreprises. Elles cherchent un fournisseur fiable, vérifient vos capacités et vos délais en ligne, et demandent un devis au premier qui répond clairement.",
      faq: { q: "Mon entreprise est dans la zone du Salaison : quel site pour du B2B ?", a: "Un site qui présente vos capacités (équipements, délais, zone de livraison), vos références et un formulaire de demande de devis précis. On vise la qualité des demandes plus que leur nombre." }
    },
    auto: {
      angle: "Dans les entreprises de la zone du Salaison, le volume est là : commandes, livraisons, stocks, facturation. Chaque ressaisie se paie à grande échelle.",
      cases: [
        ['Commandes clients traitées automatiquement', "Les bons de commande reçus par e-mail ou PDF sont lus et saisis dans votre système ; l'équipe ne fait plus que vérifier."],
        ['Suivi logistique en temps réel', "Statut des livraisons, retards transporteurs et preuves de livraison remontent seuls, le client est informé automatiquement."],
        ['Rapprochement factures / bons de livraison', "Les écarts entre commandes, livraisons et factures fournisseurs sont détectés automatiquement : fini les contrôles ligne à ligne."]
      ],
      faq: { q: "Nous traitons des centaines de commandes par semaine : c'est adapté ?", a: "C'est exactement le terrain de Groupe Solution : nos plateformes traitent déjà des centaines de milliers d'offres. Plus le volume est élevé, plus chaque minute gagnée par commande compte." }
    }
  },
  {
    slug: 'castries', name: 'Castries', cp: '34160', lat: 43.6790, lng: 3.9850, metro: true, secteur: 'Est de la métropole',
    profil: "Dominée par son château et traversée par son aqueduc, Castries est un bourg historique de l'est montpelliérain, entouré de garrigue. Commerces, artisans et entreprises de services y rayonnent sur les villages voisins.",
    reperes: ['le château de Castries', "l'aqueduc", 'le centre ancien', 'la garrigue', 'les zones d\'activités'],
    tissu: "commerces du centre, artisans, entreprises de services, hébergements et activités touristiques",
    web: {
      angle: "Castries sert de pôle pour tous les villages alentour : Sussargues, Saint-Drézéry, Beaulieu, Montaud. Un site bien référencé capte les recherches de tout ce bassin, pas seulement de la commune.",
      faq: { q: "Mes clients viennent des villages autour de Castries : comment les toucher ?", a: "En indiquant clairement votre zone de desserte sur le site et la fiche Google, avec des réalisations dans ces villages. C'est plus efficace que de créer des pages vides pour chaque commune." }
    },
    auto: {
      angle: "Les entreprises castriotes rayonnent sur un grand secteur rural : les trajets et la gestion prennent une place énorme.",
      cases: [
        ['Tournées optimisées', "Les interventions de la semaine sont organisées par village pour réduire les kilomètres et le temps perdu."],
        ['Accueil et réservations pour les visiteurs', "Visites, hébergements, événements : réservations, confirmations et rappels automatiques."],
        ['Facturation groupée', "Les interventions sont facturées automatiquement en fin de semaine ou de mois, avec relances intégrées."]
      ],
      faq: { q: "Le premier appel engage-t-il à quelque chose ?", a: "Non. Dix minutes pour comprendre votre activité et repérer ce qui peut être automatisé. Vous repartez avec des pistes concrètes, que vous travailliez avec nous ou non." }
    }
  },
  {
    slug: 'baillargues', name: 'Baillargues', cp: '34670', lat: 43.6620, lng: 4.0120, metro: true, secteur: 'Est de la métropole',
    profil: "Desservie par sa gare TER et proche de l'A9, Baillargues est une commune active de l'est montpelliérain, avec ses zones d'activités et le golf de Massane. Un bon équilibre entre entreprises, commerces et vie résidentielle.",
    reperes: ['la gare TER', 'le golf de Massane', 'les zones d\'activités', 'le centre du village', 'la proximité de l\'A9'],
    tissu: "PME et artisans, entreprises de services, commerces, activités de loisirs et d'événementiel",
    web: {
      angle: "Entre Montpellier et Lunel, les entreprises baillarguoises visent une clientèle large. Le site doit montrer une zone d'intervention claire et des preuves concrètes de sérieux.",
      faq: { q: "J'organise des événements ou des séminaires : que doit faire mon site ?", a: "Présenter clairement vos espaces et formules, afficher les disponibilités et permettre une demande de devis complète en ligne. Les organisateurs comparent vite : la clarté fait la différence." }
    },
    auto: {
      angle: "À Baillargues, les PME commencent souvent à ressentir le poids de la gestion quand elles grandissent : c'est le bon moment pour automatiser.",
      cases: [
        ['Devis événementiel automatique', "Nombre de participants, date, options : le devis se calcule et part avec les disponibilités réelles."],
        ['Pointage et heures des équipes', "Les heures sont saisies sur téléphone et préparées pour la paie, sans ressaisie de fiches papier."],
        ['Relances clients et impayés', "Chaque facture est suivie, les relances partent seules, vous voyez votre trésorerie en temps réel."]
      ],
      faq: { q: "À partir de quelle taille d'entreprise l'automatisation devient-elle rentable ?", a: "Dès qu'une tâche se répète plusieurs fois par semaine. Chez une PME de dix personnes, on trouve généralement plusieurs heures par semaine à récupérer dès le premier diagnostic." }
    }
  },
  {
    slug: 'saint-bres', name: 'Saint-Brès', cp: '34670', lat: 43.6670, lng: 4.0310, metro: true, secteur: 'Est de la métropole',
    profil: "À l'est de la métropole, près de l'A9 et de Baillargues, Saint-Brès est un village viticole qui s'est ouvert à de nombreux artisans et petites entreprises tout en gardant ses vignes.",
    reperes: ['le centre du village', 'les vignes', 'la proximité de l\'A9', 'la route de Baillargues'],
    tissu: "artisans, viticulteurs, petites entreprises de services, indépendants",
    web: {
      angle: "Les artisans de Saint-Brès interviennent de Montpellier à Lunel. Une présence en ligne solide leur permet de choisir leurs chantiers plutôt que de les attendre.",
      faq: { q: "J'ai déjà assez de travail par le bouche-à-oreille : pourquoi investir en ligne ?", a: "Pour choisir vos clients plutôt que les subir : plus de demandes, c'est la possibilité de sélectionner les chantiers les plus rentables et les plus proches. Et une assurance si le bouche-à-oreille ralentit." }
    },
    auto: {
      angle: "Artisans et viticulteurs de Saint-Brès partagent un point commun : le terrain passe avant les papiers, qui s'empilent.",
      cases: [
        ['Devis rapides depuis le chantier', "Métrés et options saisis sur téléphone : le devis part avant que vous soyez remonté dans le camion."],
        ['Traçabilité simplifiée', "Pour les viticulteurs : interventions et traitements enregistrés en quelques secondes, registres prêts pour les contrôles."],
        ['Relances automatiques', "Devis sans réponse, factures impayées : les relances partent seules, poliment."]
      ],
      faq: { q: "Est-ce que je garde la main sur ce qui est envoyé à mes clients ?", a: "Toujours. Vous validez les modèles de messages au départ, et pour tout ce qui engage (prix, dates), une validation d'un clic peut être exigée avant envoi." }
    }
  },
  {
    slug: 'saint-genies-des-mourgues', name: 'Saint-Geniès-des-Mourgues', cp: '34160', lat: 43.6970, lng: 4.0340, metro: true, secteur: 'Est de la métropole',
    profil: "Village de l'est de la métropole au milieu des vignes, Saint-Geniès-des-Mourgues garde une identité agricole forte, avec des domaines, des artisans et de petites entreprises attachées au territoire.",
    reperes: ['le centre du village', 'les domaines viticoles', 'la plaine agricole', 'la route de Castries'],
    tissu: "domaines et exploitations agricoles, artisans, petites entreprises de services",
    web: {
      angle: "Pour un domaine ou un artisan de Saint-Geniès, le site est souvent le seul lien direct avec les clients de Montpellier, à vingt minutes. Il doit donner envie de faire le trajet.",
      faq: { q: "Un petit domaine peut-il vendre en ligne sans logistique compliquée ?", a: "Oui : vente en ligne avec retrait sur place ou livraison locale groupée, par exemple une fois par semaine sur Montpellier. On met en place une solution proportionnée à vos volumes." }
    },
    auto: {
      angle: "Les exploitations et artisans de Saint-Geniès gagnent du temps en automatisant les commandes et la paperasse.",
      cases: [
        ['Commandes groupées et tournées de livraison', "Les commandes de la semaine sont regroupées et la tournée préparée automatiquement."],
        ['Déclarations préparées', "Les données de production et de vente sont consolidées pour préparer vos déclarations sans ressaisie."],
        ['Fichier clients et événements', "Portes ouvertes, vendanges, nouveaux millésimes : les invitations partent aux bons clients."]
      ],
      faq: { q: "Faut-il une connexion internet parfaite ?", a: "Non. Les outils terrain peuvent fonctionner hors connexion et se synchroniser dès que le réseau revient. On en tient compte dans la conception." }
    }
  },
  {
    slug: 'sussargues', name: 'Sussargues', cp: '34160', lat: 43.7120, lng: 4.0030, metro: true, secteur: 'Est de la métropole',
    profil: "Petit village de garrigue au nord de Castries, Sussargues a gardé un rythme paisible. On y trouve des artisans, des indépendants et quelques domaines, avec une clientèle tournée vers l'est montpelliérain.",
    reperes: ['le centre du village', 'la garrigue', 'la route de Castries', 'les domaines'],
    tissu: "artisans, indépendants à domicile, domaines, services à la personne",
    web: {
      angle: "Dans un village comme Sussargues, les entreprises n'ont pas de passage. Tout se joue sur Google : une fiche complète et un site clair suffisent souvent à doubler les demandes.",
      faq: { q: "Un site simple peut-il vraiment faire la différence ?", a: "Pour une activité locale, oui : un site clair, rapide et bien référencé, relié à une fiche Google soignée, apporte souvent plus qu'un site ambitieux mal optimisé. On commence par l'essentiel, on enrichit si ça marche — le tout sur devis." }
    },
    auto: {
      angle: "À Sussargues, les entreprises sont petites : chaque tâche automatisée libère directement du temps pour les clients.",
      cases: [
        ['Réponses automatiques aux demandes', "Chaque demande reçoit une réponse immédiate et personnalisée avec les prochaines étapes."],
        ['Devis et factures en quelques clics', "Modèles prêts, calculs automatiques, envoi et relance intégrés."],
        ['Collecte d\'avis', "Une demande d'avis après chaque prestation fait monter votre note Google."]
      ],
      faq: { q: "Comment savoir ce qui vaut le coup d'être automatisé chez moi ?", a: "C'est l'objet du premier appel de dix minutes : on liste vos tâches répétitives, on estime le temps qu'elles vous coûtent, et on vous dit honnêtement ce qui vaut le coup." }
    }
  },
  {
    slug: 'saint-drezery', name: 'Saint-Drézéry', cp: '34160', lat: 43.7300, lng: 3.9760, metro: true, secteur: 'Nord-est de la métropole',
    profil: "Village viticole au nord-est de la métropole, Saint-Drézéry est entouré de vignes et de garrigue. Domaines, artisans et indépendants y cultivent une économie locale discrète mais active.",
    reperes: ['le vieux village', 'les vignes', 'la garrigue', 'la route de Castries'],
    tissu: "domaines viticoles, artisans, indépendants, gîtes",
    web: {
      angle: "Pour les domaines et gîtes de Saint-Drézéry, le site est la vitrine qui attire les visiteurs de Montpellier et d'ailleurs. Sans lui, on dépend entièrement des plateformes et des salons.",
      faq: { q: "Comment attirer des visiteurs dans un domaine hors des grands circuits ?", a: "Avec un site qui raconte le lieu, des photos soignées, la réservation de visites en ligne et une fiche Google active. Les recherches « domaine près de Montpellier » sont nombreuses et peu travaillées." }
    },
    auto: {
      angle: "Domaines et gîtes drézérois partagent la même contrainte : accueillir, vendre et gérer avec une toute petite équipe.",
      cases: [
        ['Réservations de visites et de séjours', "Créneaux, acomptes, rappels et informations d'accès envoyés automatiquement."],
        ['Boutique en ligne synchronisée', "Commandes, stock et expéditions reliés : aucune vente ne se perd, aucune bouteille n'est vendue deux fois."],
        ['Suivi des clients fidèles', "Anniversaires de commande, nouveaux millésimes, invitations : chaque client reçoit le bon message."]
      ],
      faq: { q: "Je n'ai que quelques heures par mois pour ça : est-ce suffisant ?", a: "Oui. Une fois en place, les automatisations tournent seules ; votre rôle se limite à valider quelques points et à regarder les résultats. C'est justement le but." }
    }
  },
  {
    slug: 'montaud', name: 'Montaud', cp: '34160', lat: 43.7480, lng: 3.9580, metro: true, secteur: 'Nord-est de la métropole',
    profil: "L'une des plus petites communes de la métropole, Montaud est un village de garrigue au nord-est, apprécié pour son calme. Quelques artisans, indépendants et activités de nature y sont installés.",
    reperes: ['le village', 'la garrigue', 'les chemins de randonnée', 'la route de Saint-Drézéry'],
    tissu: "indépendants, artisans, activités de nature, hébergements",
    web: {
      angle: "À Montaud, une entreprise n'a presque aucune chance d'être découverte par hasard. Le site et la fiche Google sont sa seule vitrine — raison de plus pour qu'ils soient impeccables.",
      faq: { q: "Mon village est tout petit : Google me mettra-t-il en avant ?", a: "Oui sur les recherches locales précises, et sur celles du secteur (nord-est de Montpellier, Pic Saint-Loup) si le site est bien construit. La petite taille est même un avantage : moins de concurrence directe." }
    },
    auto: {
      angle: "Pour un indépendant installé à Montaud, chaque déplacement compte : tout ce qui peut se faire à distance doit se faire seul.",
      cases: [
        ['Rendez-vous et visios planifiés', "Les clients réservent un créneau, reçoivent le lien de visio : moins de trajets inutiles."],
        ['Administratif à distance', "Devis, contrats et factures signés et payés en ligne."],
        ['Réservations d\'hébergement', "Calendrier, paiements et messages aux voyageurs automatisés."]
      ],
      faq: { q: "Peut-on tout faire à distance avec vous ?", a: "Oui. Le diagnostic, le suivi et la mise en place se font par téléphone et visio. On se déplace quand c'est utile, sinon on vous fait gagner le trajet." }
    }
  },
  {
    slug: 'beaulieu', name: 'Beaulieu', cp: '34160', lat: 43.7290, lng: 4.0210, metro: true, secteur: 'Nord-est de la métropole',
    profil: "Village du nord-est de la métropole, Beaulieu est connu pour sa tradition de la pierre et ses carrières, au milieu de la garrigue. Artisans et petites entreprises y perpétuent une économie liée au bâti et au territoire.",
    reperes: ['les carrières de pierre', 'le vieux village', 'la garrigue', 'la route de Restinclières'],
    tissu: "artisans du bâti et de la pierre, entreprises du bâtiment, indépendants",
    web: {
      angle: "Tailleurs de pierre, maçons, rénovateurs : à Beaulieu, le savoir-faire se prouve en images. Un site avec des réalisations bien photographiées vaut toutes les plaquettes.",
      faq: { q: "Comment montrer mon savoir-faire d'artisan en ligne ?", a: "Par des réalisations détaillées : photos avant/après, matériaux, contraintes du chantier, localisation. C'est ce qui rassure un client et ce que Google valorise pour les recherches de métier." }
    },
    auto: {
      angle: "Les entreprises du bâti de Beaulieu jonglent avec les devis complexes, les approvisionnements et les chantiers.",
      cases: [
        ['Devis de pierre et de maçonnerie', "Dimensions, matériaux, finitions : le chiffrage se calcule à partir de vos tarifs, vous l'ajustez."],
        ['Suivi des approvisionnements', "Commandes de matériaux suivies automatiquement, alertes en cas de retard avant qu'il ne bloque le chantier."],
        ['Dossier de chantier partagé', "Photos, plans, bons et échanges avec le client regroupés automatiquement par chantier."]
      ],
      faq: { q: "Nos devis sont très variables d'un chantier à l'autre : c'est automatisable ?", a: "La partie répétitive l'est : calculs, mise en forme, conditions, envoi et relance. Votre expertise reste dans les choix techniques ; l'outil vous évite juste de tout retaper." }
    }
  },
  {
    slug: 'restinclieres', name: 'Restinclières', cp: '34160', lat: 43.7240, lng: 4.0350, metro: true, secteur: 'Nord-est de la métropole',
    profil: "Village de l'extrême nord-est de la métropole, entre vignes et garrigue, Restinclières a gardé son caractère rural. Artisans, domaines et indépendants y travaillent pour une clientèle de Montpellier à Lunel.",
    reperes: ['le vieux village', 'les vignes', 'la garrigue', 'la route de Beaulieu'],
    tissu: "artisans, domaines, indépendants, services à domicile",
    web: {
      angle: "Situé entre Montpellier et Lunel, Restinclières permet de viser deux bassins de clientèle. Encore faut-il être visible sur les deux : c'est le rôle du site et de la fiche Google.",
      faq: { q: "Puis-je être visible à la fois côté Montpellier et côté Lunel ?", a: "Oui, en définissant une zone d'intervention cohérente sur Google et en montrant des réalisations des deux côtés sur votre site. On construit votre visibilité autour de vos vrais clients." }
    },
    auto: {
      angle: "Pour les petites entreprises de Restinclières, l'enjeu est simple : moins de temps au bureau, plus sur le terrain.",
      cases: [
        ['Demandes centralisées', "Appels manqués, e-mails, messages, formulaires : tout arrive dans une seule liste, rien ne se perd."],
        ['Planning et confirmations', "Les rendez-vous sont confirmés automatiquement et rappelés la veille."],
        ['Facturation et relances', "Factures générées, envoyées, relancées sans intervention."]
      ],
      faq: { q: "Combien coûte une automatisation ?", a: "Cela dépend de la tâche, mais on part toujours du gain : on estime ce que la tâche vous coûte aujourd'hui et on ne propose que ce qui est nettement rentable. Le devis est clair, sans surprise." }
    }
  },

  /* ═════════════════ EST & ÉTANG DE L'OR ═════════════════ */
  {
    slug: 'mauguio-carnon', name: 'Mauguio-Carnon', cp: '34130', lat: 43.6160, lng: 4.0080, metro: false, secteur: "Pays de l'Or",
    profil: "Mauguio accueille l'aéroport Montpellier-Méditerranée et une importante activité maraîchère autour de l'étang de l'Or, tandis que Carnon, son quartier balnéaire, vit du port et de la plage. Deux économies en une seule commune.",
    reperes: ["l'aéroport Montpellier-Méditerranée", "l'étang de l'Or", 'le port de Carnon', 'le centre de Mauguio', 'les exploitations maraîchères'],
    tissu: "maraîchers et producteurs, entreprises liées à l'aéroport, loueurs et transporteurs, restaurants et commerces balnéaires",
    web: {
      angle: "Entre les voyageurs de l'aéroport, les vacanciers de Carnon et les habitants de Mauguio, les recherches locales sont très différentes. Un bon site parle à la bonne clientèle, au bon moment.",
      faq: { q: "Je travaille avec les voyageurs de l'aéroport : comment les capter ?", a: "En travaillant les recherches liées (« navette aéroport Montpellier », « location près de l'aéroport »), en proposant la réservation en ligne et une fiche Google impeccable. Ces clients décident vite, souvent sur téléphone." }
    },
    auto: {
      angle: "Maraîchers, loueurs et commerces de Mauguio-Carnon gèrent des flux très variables : récoltes, arrivées de vols, saison balnéaire.",
      cases: [
        ['Commandes de producteurs automatisées', "Les commandes des restaurateurs et magasins arrivent sur un bon de commande en ligne ; préparation et tournées suivent automatiquement."],
        ['Réservations suivies selon les vols', "Pour un loueur ou une navette : les retards de vol ajustent automatiquement le planning et préviennent le client."],
        ['Saison balnéaire sous contrôle', "Réservations, cautions, états des lieux et messages aux clients de Carnon gérés sans paperasse."]
      ],
      faq: { q: "Je vends mes légumes aux restaurateurs : peut-on simplifier les commandes ?", a: "Oui : un bon de commande en ligne avec vos produits disponibles de la semaine, les commandes consolidées automatiquement pour la récolte et la tournée, et la facture qui suit. Fini les commandes par SMS à recopier." }
    }
  },
  {
    slug: 'saint-aunes', name: 'Saint-Aunès', cp: '34130', lat: 43.6400, lng: 3.9650, metro: false, secteur: "Pays de l'Or",
    profil: "Entre Montpellier, Le Crès et Mauguio, Saint-Aunès est une commune résidentielle en croissance, bordée de zones d'activités. Beaucoup d'entreprises y trouvent un accès rapide à toute la métropole est.",
    reperes: ['le centre du village', 'les zones d\'activités', 'la route de Mauguio', 'la proximité d\'Odysseum'],
    tissu: "artisans, entreprises de services, commerces, indépendants",
    web: {
      angle: "Proches d'Odysseum et de l'est de Montpellier, les entreprises de Saint-Aunès sont en concurrence avec toute la ville. Un site précis et une fiche Google active font la différence sur les recherches locales.",
      faq: { q: "Comment rivaliser avec les entreprises montpelliéraines ?", a: "En misant sur la précision et la proximité : services détaillés, zone d'intervention claire, avis récents, réactivité. Sur les recherches locales, une petite entreprise bien présentée passe souvent devant une grande mal référencée." }
    },
    auto: {
      angle: "Les entreprises saint-aunésoises gagnent le plus en reliant leurs outils entre eux : agenda, devis, factures, messages.",
      cases: [
        ['Outils connectés entre eux', "Un devis accepté crée le rendez-vous, prévient l'équipe et prépare la facture."],
        ['Suivi client automatique', "Le client est informé à chaque étape, sans que vous ayez à y penser."],
        ['Tableau de bord simple', "Demandes reçues, devis envoyés, chiffre signé : l'essentiel sur une page, mis à jour tout seul."]
      ],
      faq: { q: "J'utilise plusieurs outils qui ne se parlent pas : que pouvez-vous faire ?", a: "Les faire se parler. Dans la majorité des cas, on connecte vos outils existants au lieu de les remplacer, pour que l'information ne soit saisie qu'une seule fois." }
    }
  },
  {
    slug: 'palavas-les-flots', name: 'Palavas-les-Flots', cp: '34250', lat: 43.5280, lng: 3.9300, metro: false, secteur: 'Littoral',
    profil: "Station balnéaire historique des Montpelliérains, Palavas-les-Flots vit de sa plage, de son port, de ses restaurants et du Phare de la Méditerranée. L'été, la population explose ; le reste de l'année, la vie locale reprend.",
    reperes: ['le Phare de la Méditerranée', 'le port', 'les plages', 'les quais du Lez', 'les étangs'],
    tissu: "restaurants et bars, hébergements et locations saisonnières, activités nautiques, commerces de plage",
    web: {
      angle: "À Palavas, les touristes choisissent leur restaurant ou leur activité sur Google Maps, en direct, depuis la plage. Photos, avis, menu et réservation en ligne décident en quelques secondes.",
      faq: { q: "Mon restaurant a déjà une page sur les réseaux : pourquoi un site ?", a: "Parce que Google met en avant les établissements avec un site clair (menu, horaires, réservation). Les réseaux sont utiles pour l'image, le site et la fiche Google pour être choisi au moment de la recherche." }
    },
    auto: {
      angle: "En saison, les entreprises palavasiennes n'ont pas une minute : tout ce qui peut tourner seul doit tourner seul.",
      cases: [
        ['Réservations et liste d\'attente', "Réservations en ligne, rappels et liste d'attente qui remplit automatiquement les annulations."],
        ['Recrutement saisonnier simplifié', "Candidatures centralisées, tri selon vos critères, entretiens planifiés automatiquement — le savoir-faire de nos plateformes de recrutement."],
        ['Locations et cautions', "Contrats, cautions, états des lieux et messages aux locataires sans paperasse."]
      ],
      faq: { q: "Pouvez-vous m'aider à recruter mes saisonniers ?", a: "Oui, c'est un domaine que Groupe Solution connaît bien avec Solution Recrutement : centraliser les candidatures, les trier selon vos critères et planifier les entretiens automatiquement." }
    }
  },
  {
    slug: 'la-grande-motte', name: 'La Grande-Motte', cp: '34280', lat: 43.5610, lng: 4.0850, metro: false, secteur: 'Littoral',
    profil: "Avec ses pyramides signées Jean Balladur, son grand port de plaisance, sa thalasso et son golf, La Grande-Motte est une station à l'identité unique, active une grande partie de l'année grâce aux congrès et au nautisme.",
    reperes: ['les pyramides', 'le port de plaisance', 'le Palais des Congrès', 'le golf', 'les plages'],
    tissu: "hôtels et résidences, restaurants, métiers du nautisme, agences immobilières, commerces et bien-être",
    web: {
      angle: "À La Grande-Motte, la clientèle est à la fois locale, touristique et internationale. Un site rapide, en plusieurs langues, avec réservation directe, évite de laisser une commission à chaque plateforme.",
      faq: { q: "Faut-il un site en anglais pour La Grande-Motte ?", a: "Pour l'hôtellerie, le nautisme et les activités, souvent oui : une partie importante des visiteurs est étrangère. On adapte les langues à votre clientèle réelle." }
    },
    auto: {
      angle: "Hôtels, loueurs de bateaux, agences immobilières : à La Grande-Motte, les demandes arrivent de partout, dans toutes les langues.",
      cases: [
        ['Demandes multilingues traitées', "Les demandes sont comprises, résumées et reçoivent une première réponse dans la langue du client, validée par vous si besoin."],
        ['Gestion locative automatisée', "Pour les agences : entrées, sorties, ménages et messages aux propriétaires orchestrés automatiquement."],
        ['Location de bateaux et d\'équipements', "Réservation, caution, contrat et check-list de départ en ligne."]
      ],
      faq: { q: "Je gère des locations pour des propriétaires : qu'est-ce qui s'automatise ?", a: "Les plannings de ménage et d'entretien, les messages aux voyageurs, les états des lieux, les comptes rendus aux propriétaires et les relevés mensuels. Vous gardez la relation, l'outil fait le suivi." }
    }
  },
  {
    slug: 'lunel', name: 'Lunel', cp: '34400', lat: 43.6750, lng: 4.1360, metro: false, secteur: 'Pays de Lunel',
    profil: "Capitale du Muscat de Lunel et terre de traditions taurines, Lunel est une ville centre à mi-chemin entre Montpellier et Nîmes. Commerces, marchés, artisans et PME y servent tout le Pays de Lunel.",
    reperes: ['le vignoble du Muscat de Lunel', 'les halles et le marché', 'les arènes', 'la gare', 'les zones d\'activités'],
    tissu: "commerces du centre-ville, artisans, caves et domaines, PME, services",
    web: {
      angle: "Entre Montpellier et Nîmes, Lunel est un bassin à part entière. Ses habitants cherchent « à Lunel » et veulent des entreprises du coin : une présence en ligne bien locale capte cette préférence.",
      faq: { q: "Les Lunellois cherchent-ils vraiment des entreprises locales en ligne ?", a: "Oui, et de plus en plus : on préfère un artisan ou un commerce proche. Encore faut-il qu'il apparaisse sur Google avec un site et des avis. C'est souvent là que se fait la différence avec Montpellier." }
    },
    auto: {
      angle: "Commerces, caves et PME lunelloises gèrent ventes, commandes et clients entre boutique, marché et internet.",
      cases: [
        ['Vente multicanale synchronisée', "Boutique, marché et site partagent le même stock ; les ventes remontent automatiquement."],
        ['Commandes de caves et domaines', "Commandes particuliers et professionnels, étiquettes d'expédition et factures gérées sans ressaisie."],
        ['Relances clients fidèles', "Offres saisonnières, nouveautés, invitations : les bons clients sont relancés au bon moment."]
      ],
      faq: { q: "Intervenez-vous à Lunel alors que vous êtes basés dans la métropole de Montpellier ?", a: "Oui, Lunel est à une vingtaine de minutes. Le premier échange se fait par téléphone ou visio, et on se déplace quand le projet le justifie." }
    }
  },

  /* ═════════════════ OUEST & BASSIN DE THAU ═════════════════ */
  {
    slug: 'gigean', name: 'Gigean', cp: '34770', lat: 43.4990, lng: 3.7120, metro: false, secteur: 'Bassin de Thau',
    profil: "Au pied du massif de la Gardiole, où se dresse l'abbaye Saint-Félix-de-Montceau, Gigean est une commune en croissance entre Montpellier et Sète, avec ses zones d'activités et ses domaines.",
    reperes: ["l'abbaye Saint-Félix-de-Montceau", 'le massif de la Gardiole', 'les zones d\'activités', 'le centre du village'],
    tissu: "artisans et entreprises du bâtiment, logistique, commerces, domaines viticoles",
    web: {
      angle: "À mi-chemin entre Montpellier et Sète, les entreprises de Gigean peuvent viser deux bassins. Un site qui l'affiche clairement double la zone de chalandise en ligne.",
      faq: { q: "Je suis entre Montpellier et Sète : quelle zone mettre en avant ?", a: "Celle où vous intervenez vraiment, avec des preuves (chantiers, clients) des deux côtés. Google et vos clients se fient aux réalisations concrètes plus qu'aux listes de villes." }
    },
    auto: {
      angle: "Les entreprises gigeannaises sont souvent sur la route : chaque tâche administrative reprise leur rend du temps utile.",
      cases: [
        ['Interventions sur mobile', "Bons d'intervention, photos et signature client sur téléphone ; la facture part automatiquement."],
        ['Suivi des livraisons', "Statuts de livraison et preuves remontent seuls, le client est informé."],
        ['Relances de devis et d\'impayés', "Relances automatiques, polies, au bon moment."]
      ],
      faq: { q: "Faut-il changer de logiciel de facturation ?", a: "Rarement. On travaille avec votre logiciel actuel et on automatise ce qui se passe autour. Si un changement est vraiment préférable, on vous l'explique avec les chiffres." }
    }
  },
  {
    slug: 'montbazin', name: 'Montbazin', cp: '34560', lat: 43.5160, lng: 3.6960, metro: false, secteur: 'Bassin de Thau',
    profil: "Village viticole entre la Gardiole et le bassin de Thau, Montbazin garde un cœur ancien et une économie tournée vers la vigne, l'artisanat et les petits commerces.",
    reperes: ['le cœur ancien', 'les vignes', 'la Gardiole', 'la route de Gigean'],
    tissu: "viticulteurs et caves, artisans, petits commerces, indépendants",
    web: {
      angle: "Pour les vignerons et artisans de Montbazin, internet ouvre la clientèle de Montpellier et de Sète sans quitter le village. Un site sobre, avec les bonnes informations, suffit à lancer le mouvement.",
      faq: { q: "Je n'ai jamais eu de site : par où commencer ?", a: "Par l'essentiel : qui vous êtes, ce que vous proposez, où vous trouver et comment vous contacter. Une fiche Google complète en parallèle. On s'occupe de tout, vous validez." }
    },
    auto: {
      angle: "À Montbazin, les exploitations et artisans ont surtout besoin de simplifier la vente et l'administratif.",
      cases: [
        ['Vente directe en ligne', "Commandes, retrait au caveau ou livraison locale, paiement en ligne : un canal de plus sans effort."],
        ['Registres et traçabilité', "Interventions et traitements notés en quelques secondes sur téléphone."],
        ['Facturation automatique', "Factures et relances envoyées sans y penser."]
      ],
      faq: { q: "Est-ce adapté à une toute petite exploitation ?", a: "Oui, à condition de rester proportionné : on commence par une seule automatisation utile et peu coûteuse, et on n'ajoute rien qui ne se rembourse pas rapidement." }
    }
  },
  {
    slug: 'poussan', name: 'Poussan', cp: '34560', lat: 43.4890, lng: 3.6710, metro: false, secteur: 'Bassin de Thau',
    profil: "Porte du bassin de Thau, près de l'A9, Poussan est un bourg actif entre vignes et étang, avec ses zones d'activités et un centre ancien de caractère.",
    reperes: ['le centre ancien', "la proximité de l'étang de Thau", 'les zones d\'activités', "l'accès à l'A9"],
    tissu: "artisans, entreprises de transport et de logistique, commerces, viticulteurs, conchyliculteurs voisins",
    web: {
      angle: "Idéalement placée entre Montpellier, Sète et Mèze, une entreprise de Poussan peut rayonner sur tout le bassin de Thau. Le site doit le dire, preuves à l'appui.",
      faq: { q: "Comment être trouvé sur tout le bassin de Thau ?", a: "Avec une fiche Google en zone d'intervention, des réalisations à Sète, Mèze, Balaruc ou Bouzigues sur votre site, et des contenus qui répondent aux questions des clients du bassin." }
    },
    auto: {
      angle: "Transport, logistique, artisanat : à Poussan, la gestion des flux est le premier poste de temps perdu.",
      cases: [
        ['Planification des tournées', "Les livraisons ou interventions du jour sont organisées automatiquement pour limiter les kilomètres."],
        ['Documents de transport générés', "Bons de livraison et documents d'accompagnement produits automatiquement à partir des commandes."],
        ['Suivi client en temps réel', "Le client reçoit l'heure d'arrivée estimée et la preuve de livraison."]
      ],
      faq: { q: "Pouvez-vous gérer des flux importants ?", a: "Oui. Nos systèmes traitent déjà de très gros volumes de données. Pour une entreprise de transport ou de logistique, c'est justement là que l'automatisation rapporte le plus." }
    }
  },
  {
    slug: 'villeveyrac', name: 'Villeveyrac', cp: '34560', lat: 43.5010, lng: 3.6070, metro: false, secteur: 'Bassin de Thau',
    profil: "Au nord du bassin de Thau, Villeveyrac est un village viticole entouré de vignes et de garrigue, célèbre pour l'abbaye de Valmagne, haut lieu du patrimoine et de l'oenotourisme de l'Hérault.",
    reperes: ["l'abbaye de Valmagne", 'le vignoble', 'la garrigue', 'le centre du village', 'la route de Mèze'],
    tissu: "domaines viticoles et caves, oenotourisme et hébergements, artisans, petits commerces",
    web: {
      angle: "Les visiteurs de l'abbaye de Valmagne et les amateurs de vin cherchent où déguster, manger et dormir autour de Villeveyrac. Les domaines et hébergements bien présents en ligne récupèrent ce flux ; les autres le laissent passer.",
      faq: { q: "Comment profiter des visiteurs de l'abbaye de Valmagne ?", a: "En étant visible sur les recherches qu'ils font autour de leur visite (dégustation, restaurant, gîte près de Valmagne), avec une fiche Google soignée et un site qui permet de réserver immédiatement." }
    },
    auto: {
      angle: "Domaines et hébergements de Villeveyrac vivent de l'accueil : réservations, visites, ventes et messages se multiplient en saison.",
      cases: [
        ['Visites et dégustations réservées en ligne', "Créneaux, groupes, rappels et informations d'accès : les visiteurs arrivent attendus."],
        ['Vente du caveau reliée au site', "Les ventes sur place et en ligne partagent le même stock et la même facturation."],
        ['Accueil des voyageurs automatisé', "Instructions d'arrivée, recommandations locales, demande d'avis après le séjour."]
      ],
      faq: { q: "Je suis vigneron, pas informaticien : qui gère la technique ?", a: "Nous. Vous nous dites comment vous travaillez, on construit et on maintient. Votre rôle se limite à valider et à profiter du temps gagné." }
    }
  },
  {
    slug: 'meze', name: 'Mèze', cp: '34140', lat: 43.4260, lng: 3.6060, metro: false, secteur: 'Bassin de Thau',
    profil: "Au bord de l'étang de Thau, Mèze vit de la conchyliculture, du vignoble du Picpoul de Pinet, de son port et du tourisme — avec en prime son musée-parc des dinosaures. Une économie riche, très saisonnière et très locale.",
    reperes: ["l'étang de Thau", 'le port', 'les mas conchylicoles', 'le vignoble du Picpoul de Pinet', 'le musée-parc des dinosaures'],
    tissu: "conchyliculteurs, domaines viticoles, restaurants et commerces du port, hébergements, artisans",
    web: {
      angle: "Huîtres, Picpoul, restaurants du port : les visiteurs du bassin de Thau cherchent « dégustation huîtres Mèze » ou « restaurant port de Mèze ». Les établissements qui y répondent avec un site et une fiche Google soignés remplissent leurs tables et leurs cabanes.",
      faq: { q: "Je suis conchyliculteur : un site m'apporte-t-il des clients ?", a: "Oui : pour la dégustation et la vente directe, les visiteurs cherchent en ligne où aller. Un site avec horaires, produits, réservation et commandes pour les fêtes capte cette clientèle et la fidélise." }
    },
    auto: {
      angle: "À Mèze, conchyliculteurs, domaines et restaurants partagent les mêmes pics : l'été et les fêtes de fin d'année, où tout arrive en même temps.",
      cases: [
        ['Commandes des fêtes sans téléphone', "Les commandes d'huîtres et de coquillages pour Noël et le Nouvel An se prennent en ligne, avec créneaux de retrait et paiement : fini les carnets de commandes."],
        ['Traçabilité et documents sanitaires', "Lots, dates et étiquetage générés automatiquement à partir des ventes, prêts en cas de contrôle."],
        ['Dégustations et restaurant réservés', "Réservations, rappels et liste d'attente pour les cabanes de dégustation et les restaurants du port."]
      ],
      faq: { q: "Pouvez-vous gérer les commandes de fin d'année pour mon mas ?", a: "Oui, c'est l'un des cas les plus rentables : prise de commande en ligne avec quantités, créneaux de retrait et paiement ; les listes de préparation sont générées automatiquement par jour et par créneau." }
    }
  },
  {
    slug: 'bouzigues', name: 'Bouzigues', cp: '34140', lat: 43.4480, lng: 3.6570, metro: false, secteur: 'Bassin de Thau',
    profil: "Petit port du bassin de Thau mondialement associé à ses huîtres, Bouzigues vit de la conchyliculture, de ses restaurants de bord d'étang et de son musée de l'étang de Thau.",
    reperes: ["l'étang de Thau et ses tables conchylicoles", 'le port', "le musée de l'étang de Thau", 'les restaurants du quai'],
    tissu: "conchyliculteurs, restaurants de coquillages, hébergements, commerces du port",
    web: {
      angle: "Le nom de Bouzigues attire des visiteurs de loin. Les mas et restaurants qui apparaissent en premier sur « huîtres Bouzigues » récoltent l'essentiel de ce flux touristique.",
      faq: { q: "Comment ressortir sur « huîtres Bouzigues » face aux autres mas ?", a: "Par une fiche Google active (photos récentes, avis, horaires précis), un site qui présente votre mas, vos produits et la dégustation, et la réservation en ligne. La constance fait la différence." }
    },
    auto: {
      angle: "Les mas et restaurants de Bouzigues doivent gérer les pics touristiques et les fêtes avec des équipes réduites.",
      cases: [
        ['Réservations de dégustation', "Créneaux en ligne, rappels, gestion des groupes : plus de réservations perdues au téléphone."],
        ['Commandes et expéditions', "Commandes pour particuliers et restaurateurs, préparation et étiquetage automatiques."],
        ['Avis et fidélisation', "Demande d'avis après la visite, message aux clients fidèles avant les fêtes."]
      ],
      faq: { q: "Et hors saison ?", a: "Les automatisations tournent aussi pour la vente aux professionnels et les commandes des fêtes. Et comme elles coûtent peu une fois en place, elles restent rentables même quand l'activité ralentit." }
    }
  },
  {
    slug: 'loupian', name: 'Loupian', cp: '34140', lat: 43.4490, lng: 3.6140, metro: false, secteur: 'Bassin de Thau',
    profil: "Entre Mèze et Bouzigues, Loupian est connue pour sa villa gallo-romaine aux mosaïques remarquables. Village viticole et conchylicole, il attire aussi un tourisme culturel.",
    reperes: ['la villa gallo-romaine', 'le vieux village', 'les vignes', "l'étang de Thau"],
    tissu: "domaines viticoles, conchyliculteurs, hébergements, artisans",
    web: {
      angle: "Les visiteurs de la villa gallo-romaine cherchent ensuite où déguster et où dormir. Être présent sur ces recherches, c'est capter une clientèle culturelle souvent fidèle.",
      faq: { q: "Mon gîte à Loupian peut-il se passer des plateformes ?", a: "En partie : un site avec réservation directe récupère les clients fidèles et ceux qui vous trouvent sur Google, sans commission. Les plateformes restent un complément, pas une dépendance." }
    },
    auto: {
      angle: "Les petites structures de Loupian cumulent production, accueil et vente : l'automatisation les soulage sur les trois.",
      cases: [
        ['Calendrier unique pour les séjours', "Réservations directes et plateformes synchronisées automatiquement."],
        ['Vente directe en ligne', "Commandes de vin ou de coquillages, retrait ou livraison, paiement en ligne."],
        ['Messages aux clients', "Confirmation, arrivée, recommandations et demande d'avis envoyés automatiquement."]
      ],
      faq: { q: "Combien de temps pour être opérationnel ?", a: "Pour une réservation en ligne ou des messages automatiques, quelques jours à deux semaines. On livre par étapes pour que vous profitiez des premiers gains rapidement." }
    }
  },
  {
    slug: 'balaruc-les-bains', name: 'Balaruc-les-Bains', cp: '34540', lat: 43.4420, lng: 3.6780, metro: false, secteur: 'Bassin de Thau',
    profil: "Première station thermale de France par le nombre de curistes, Balaruc-les-Bains vit au rythme des cures de trois semaines, au bord de l'étang de Thau. Hébergements, santé, bien-être et commerces en dépendent largement.",
    reperes: ['les thermes', "les bords de l'étang de Thau", 'le centre-ville', 'la promenade'],
    tissu: "hébergements pour curistes, professions de santé, bien-être, restaurants et commerces",
    web: {
      angle: "Les curistes préparent leur séjour des semaines à l'avance, en ligne : hébergement, restaurants, activités pour trois semaines. Un site clair, rassurant et réservable est décisif.",
      faq: { q: "Comment toucher les curistes avant leur arrivée ?", a: "En étant visible sur les recherches qu'ils font en préparant leur cure (location, restaurant, activités à Balaruc), avec un site qui répond à leurs questions pratiques et propose la réservation directe." }
    },
    auto: {
      angle: "À Balaruc, l'activité suit le calendrier des cures : des séjours longs, répétitifs, avec beaucoup de questions pratiques.",
      cases: [
        ['Locations pour curistes automatisées', "Réservation de trois semaines, acompte, contrat, instructions d'arrivée et rappel de fin de séjour."],
        ["Fidélisation d'une cure à l'autre", "Un an après, le curiste reçoit une proposition pour sa prochaine cure, aux mêmes dates."],
        ['Questions pratiques sans téléphone', "Horaires, accès, services : réponses automatiques aux questions fréquentes."]
      ],
      faq: { q: "Mes clients reviennent chaque année : peut-on l'automatiser ?", a: "Oui, c'est très efficace : un message personnalisé au bon moment propose au curiste de réserver à nouveau, avant qu'il ne cherche ailleurs." }
    }
  },
  {
    slug: 'frontignan', name: 'Frontignan', cp: '34110', lat: 43.4480, lng: 3.7560, metro: false, secteur: 'Bassin de Thau',
    profil: "Connue pour son muscat, Frontignan s'étend entre étangs, massif de la Gardiole et plages. Ville active et commerçante, elle combine vignoble, tourisme balnéaire et zones d'activités.",
    reperes: ['le vignoble du Muscat de Frontignan', 'Frontignan-plage', 'le centre-ville', 'la Gardiole', 'les zones d\'activités'],
    tissu: "caves et domaines, commerces, restaurants de plage, artisans, PME",
    web: {
      angle: "Entre les touristes de Frontignan-plage et les habitants du centre, les recherches locales sont nombreuses. Une présence en ligne bien construite capte les deux clientèles.",
      faq: { q: "Faut-il un site différent pour la saison et pour l'année ?", a: "Non : un seul site bien structuré, qui met en avant l'offre de saison l'été et l'offre de l'année le reste du temps. Les contenus se mettent à jour, pas le site entier." }
    },
    auto: {
      angle: "Caves, commerces et PME frontignanaises gèrent des ventes multicanales et des pics saisonniers.",
      cases: [
        ['Vente de muscat en ligne', "Commandes particuliers et professionnels, stock et expéditions synchronisés."],
        ['Gestion des pics d\'été', "Réservations, commandes et messages clients automatisés pendant la saison."],
        ['Suivi des devis et factures', "Relances automatiques, tableau de bord de trésorerie à jour."]
      ],
      faq: { q: "Travaillez-vous avec des PME, pas seulement des petites entreprises ?", a: "Oui. Groupe Solution est éditeur de logiciels : on construit aussi des outils sur-mesure pour des PME aux volumes importants, en commençant toujours par un diagnostic." }
    }
  },
  {
    slug: 'sete', name: 'Sète', cp: '34200', lat: 43.4030, lng: 3.6970, metro: false, secteur: 'Bassin de Thau',
    profil: "Ville portuaire traversée de canaux, dominée par le Mont Saint-Clair, Sète vit de la pêche, du port de commerce, du tourisme et d'une scène culturelle très vivante. Une identité forte, une économie diversifiée.",
    reperes: ['le Mont Saint-Clair', 'les canaux', 'le port de pêche et le port de commerce', 'la Corniche', 'les halles'],
    tissu: "restaurants et commerces, pêche et mareyage, activités portuaires, tourisme et culture, artisans, PME",
    web: {
      angle: "À Sète, la concurrence en ligne est forte, surtout dans la restauration et le tourisme. Les établissements qui se démarquent sont ceux qui racontent une vraie histoire et facilitent la réservation.",
      faq: { q: "Sète est très concurrentielle : un site peut-il vraiment faire la différence ?", a: "Oui, à condition d'être précis : votre spécialité, votre quartier (canaux, Corniche, Mont Saint-Clair), des photos réelles et une réservation simple. On travaille votre singularité plutôt que de ressembler aux autres." }
    },
    auto: {
      angle: "Du mareyeur au restaurant, les entreprises sétoises manipulent des produits frais, des commandes urgentes et des pics touristiques.",
      cases: [
        ['Commandes de produits de la mer', "Les commandes des restaurateurs sont prises en ligne selon l'arrivage du jour, préparées et facturées automatiquement."],
        ['Réservations et événements', "Réservations, privatisations et devis d'événements traités sans échanges interminables."],
        ['Coordination portuaire', "Suivi des arrivées, documents et notifications aux clients automatisés."]
      ],
      faq: { q: "Peut-on adapter les commandes à l'arrivage du jour ?", a: "Oui : chaque matin, les produits disponibles sont mis en ligne pour vos clients professionnels, qui commandent directement. Les bons de préparation et les factures suivent automatiquement." }
    }
  },

  /* ═════════════════ PIC SAINT-LOUP & VALLÉE DE L'HÉRAULT ═════════════════ */
  {
    slug: 'saint-mathieu-de-treviers', name: 'Saint-Mathieu-de-Tréviers', cp: '34270', lat: 43.7680, lng: 3.8590, metro: false, secteur: 'Pic Saint-Loup',
    profil: "Au pied du Pic Saint-Loup et de l'Hortus, Saint-Mathieu-de-Tréviers est le bourg centre du Grand Pic Saint-Loup, au cœur d'un vignoble réputé. Randonneurs, vignerons et commerçants s'y croisent.",
    reperes: ['le Pic Saint-Loup', "l'Hortus", 'le vignoble du Pic Saint-Loup', 'le centre-bourg'],
    tissu: "domaines viticoles, commerces du bourg, activités de pleine nature, hébergements, artisans",
    web: {
      angle: "Le Pic Saint-Loup attire randonneurs et amateurs de vin toute l'année. Domaines, gîtes et commerces qui apparaissent sur leurs recherches captent une clientèle qui revient.",
      faq: { q: "Comment attirer les randonneurs et visiteurs du Pic Saint-Loup ?", a: "En étant présent sur leurs recherches (dégustation, restaurant, gîte au Pic Saint-Loup), avec une fiche Google soignée et un site qui permet de réserver immédiatement, y compris sur mobile en chemin." }
    },
    auto: {
      angle: "Les domaines et structures touristiques du Pic Saint-Loup gèrent des visiteurs nombreux avec de petites équipes.",
      cases: [
        ['Réservation d\'oenotourisme', "Visites, dégustations, accords mets-vins : réservation, paiement et rappels automatiques."],
        ['Club de clients du domaine', "Abonnements de vin, envois périodiques et paiements récurrents gérés seuls."],
        ['Activités de pleine nature', "Réservations, décharges de responsabilité signées en ligne, reports météo automatiques."]
      ],
      faq: { q: "Un club d'abonnés pour mon domaine, c'est compliqué à gérer ?", a: "Pas avec les bons outils : inscription, paiement récurrent, préparation des envois et communication se gèrent automatiquement. Vous choisissez les vins, le reste suit." }
    }
  },
  {
    slug: 'gignac', name: 'Gignac', cp: '34150', lat: 43.6520, lng: 3.5510, metro: false, secteur: "Vallée de l'Hérault",
    profil: "Au bord de l'Hérault et le long de l'A750, Gignac est la ville centre de la vallée de l'Hérault, porte d'entrée vers Saint-Guilhem-le-Désert et le Pont du Diable. Un bassin dynamique entre tourisme, vignoble et zones d'activités.",
    reperes: ["le fleuve Hérault", "l'A750", 'la direction de Saint-Guilhem-le-Désert', 'le centre-ville', 'les zones d\'activités'],
    tissu: "commerces du centre, artisans, PME des zones d'activités, domaines, activités touristiques",
    web: {
      angle: "Entre les visiteurs de Saint-Guilhem et du Pont du Diable et les habitants de la vallée, Gignac concentre beaucoup de recherches locales. Une présence en ligne solide capte les deux publics.",
      faq: { q: "Les touristes de Saint-Guilhem passent par Gignac : comment les arrêter chez moi ?", a: "En étant visible sur les recherches qu'ils font sur la route (restaurant, activités, dégustation près de Saint-Guilhem), avec une fiche Google impeccable et un site qui donne envie de s'arrêter." }
    },
    auto: {
      angle: "Les entreprises gignacoises desservent toute la vallée de l'Hérault : la route et la gestion prennent une grande place.",
      cases: [
        ['Activités touristiques réservées en ligne', "Canoë, visites, sorties : réservation, paiement, décharge et rappels automatiques."],
        ['Interventions dans toute la vallée', "Planning des interventions organisé par secteur, bons et factures sur mobile."],
        ['Relances et suivi client', "Devis, factures et demandes d'avis suivis automatiquement."]
      ],
      faq: { q: "Gignac est loin de Montpellier : est-ce un frein ?", a: "Non : l'A750 met Gignac à une demi-heure, et l'essentiel du travail se fait à distance. On se déplace pour les étapes où c'est utile." }
    }
  }
];

export const COMMUNES = [...BASE, ...EXTENSION, ...EXTENSION_2];

/* ── Utilitaires géographiques partagés par les générateurs ── */
const R = 6371;
const rad = d => d * Math.PI / 180;
export function km(a, b) {
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
export function direction(from, to) {
  const y = to.lat - from.lat, x = (to.lng - from.lng) * Math.cos(rad(from.lat));
  const a = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360; // 0 = est, 90 = nord
  const dirs = ["à l'est", 'au nord-est', 'au nord', 'au nord-ouest', "à l'ouest", 'au sud-ouest', 'au sud', 'au sud-est'];
  return dirs[Math.round(a / 45) % 8];
}
export function neighbours(c, n = 5) {
  return COMMUNES.filter(o => o.slug !== c.slug)
    .map(o => ({ o, d: km(c, o) })).sort((a, b) => a.d - b.d).slice(0, n).map(x => x.o);
}
