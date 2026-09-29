/* ═══════════════════════════════════════════════════════════
   Montpellier intra-muros (7 quartiers officiels) + pages MÉTIERS.
   Consommé par zones/generate-montpellier-plus.mjs.
   Mêmes règles que le registre des communes : contenu propre, faits sûrs.
   ═══════════════════════════════════════════════════════════ */

/* Les quartiers réutilisent le gabarit « commune » (champs identiques),
   avec quelques surcharges : aname, file, autoHref, placeType. */
const Q = (o) => ({ metro: true, secteur: 'Montpellier', placeType: 'Place', autoHref: '../automatisation/', file: `site-internet-montpellier-${o.slug}.html`, ...o });

export const QUARTIERS = [
  Q({
    slug: 'centre', name: 'Montpellier Centre', aname: 'dans le centre de Montpellier', cp: '34000', lat: 43.6100, lng: 3.8770,
    profil: "Écusson, Comédie, Antigone, Saint-Roch, Beaux-Arts, Boutonnet, Arceaux, Figuerolles : le centre de Montpellier concentre la plus forte densité de commerces, de restaurants et de cabinets de la région. On y circule à pied, en tram, et on choisit presque toujours sur son téléphone.",
    reperes: ["l'Écusson", 'la place de la Comédie', 'Antigone', 'la gare Saint-Roch', 'les Beaux-Arts', 'Boutonnet', 'les Arceaux', 'Figuerolles'],
    tissu: "boutiques, restaurants et bars, cabinets et professions libérales, instituts et salons, hébergements touristiques",
    web: {
      angle: "Dans l'Écusson, dix restaurants ou boutiques du même type se trouvent à moins de trois cents mètres. Le client choisit sur Google Maps en marchant : photos, avis, horaires et un site rapide décident en quelques secondes qui aura la visite.",
      faq: { q: "Dans l'Écusson, la concurrence est énorme : peut-on vraiment ressortir sur Google ?", a: "Oui, en jouant sur la précision : une fiche Google complète et animée, une catégorie exacte, des photos récentes, beaucoup d'avis récents et un site qui répond aux recherches de votre rue ou de votre spécialité. Dans une zone dense, les petits détails pèsent lourd." }
    },
    auto: {
      angle: "Les commerces et cabinets du centre gèrent un flux constant : réservations, questions, commandes, touristes et étudiants.",
      cases: [
        ['Réservations et liste d\'attente', "Réservations en ligne, rappels, liste d'attente qui remplit automatiquement les annulations — indispensable les soirs de forte affluence."],
        ['Réponses aux questions répétitives', "Horaires, accès en tram, disponibilité, tarifs : réponses automatiques par message, 24 h/24."],
        ['Avis Google au bon moment', "Une demande d'avis après chaque visite : dans le centre, c'est ce qui fait passer devant le voisin."]
      ],
      faq: { q: "Les touristes étrangers peuvent-ils réserver facilement ?", a: "Oui : site et messages automatiques en anglais (ou autre langue utile), réservation en quelques clics sur mobile. Une part importante de la clientèle du centre en profite." }
    }
  }),
  Q({
    slug: 'port-marianne', name: 'Port Marianne', cp: '34000', lat: 43.6030, lng: 3.8980,
    profil: "Autour de l'hôtel de ville, du bassin Jacques-Cœur, de Richter et d'Odysseum, Port Marianne est le quartier d'affaires et de la ville nouvelle de Montpellier : sièges d'entreprises, start-up, écoles, commerces et résidences récentes, desservis par les trams 1 et 3.",
    reperes: ["l'hôtel de ville", 'le bassin Jacques-Cœur', 'Richter', 'Odysseum', 'Parc Marianne', 'les Consuls de Mer'],
    tissu: "sièges de PME, start-up et entreprises du numérique, cabinets de conseil, commerces et restaurants, services aux entreprises",
    web: {
      angle: "À Port Marianne, vos prospects sont souvent des entreprises et des cadres pressés. Ils jugent votre sérieux sur votre site en trente secondes : clarté de l'offre, références, facilité de prise de rendez-vous.",
      faq: { q: "Je suis une entreprise B2B à Port Marianne : quel site pour convaincre ?", a: "Un site qui explique précisément ce que vous faites pour qui, avec des cas clients, une page par offre et une prise de rendez-vous immédiate. Pour du B2B, la clarté vaut plus que les effets visuels." }
    },
    auto: {
      angle: "Les entreprises tertiaires de Port Marianne passent un temps considérable sur la prospection, le reporting et les tâches administratives.",
      cases: [
        ['CRM qui se remplit tout seul', "E-mails, appels et formulaires créent et mettent à jour les fiches prospects ; les relances sont programmées automatiquement."],
        ['Reporting client automatique', "Chaque mois, un rapport clair part à chaque client, sans copier-coller."],
        ['Outil métier sur-mesure', "Quand aucun logiciel du marché ne colle à votre process, on construit le vôtre — c'est notre métier d'éditeur."]
      ],
      faq: { q: "Nous sommes une start-up : pouvez-vous construire notre produit ?", a: "Oui, ou une première version pour valider le marché. Et si le projet s'y prête, on peut discuter d'un partenariat plutôt que d'une prestation : on apporte la technologie, vous apportez le marché." }
    }
  }),
  Q({
    slug: 'hopitaux-facultes', name: 'Hôpitaux-Facultés', aname: 'dans le quartier Hôpitaux-Facultés', cp: '34090', lat: 43.6320, lng: 3.8520,
    profil: "Au nord de Montpellier, le quartier Hôpitaux-Facultés réunit le CHU, les campus universitaires, Euromédecine et des quartiers résidentiels comme Aiguelongue ou Malbosc. C'est le cœur santé, recherche et étudiant de la ville.",
    reperes: ['le CHU (Lapeyronie, Gui de Chauliac)', 'les campus universitaires', 'Euromédecine', 'Aiguelongue', 'Malbosc', 'le Plan des Quatre Seigneurs'],
    tissu: "professions de santé, laboratoires et biotech, chercheurs entrepreneurs, services aux étudiants, commerces de quartier",
    web: {
      angle: "Patients, étudiants, chercheurs : trois publics exigeants et pressés. Un cabinet ou un service du quartier doit être trouvé tout de suite, avec des infos pratiques impeccables et une prise de rendez-vous simple.",
      faq: { q: "Je m'installe comme praticien près du CHU : par quoi commencer ?", a: "Une fiche Google exacte (spécialité, accès, horaires), un site sobre et conforme aux règles de votre profession, et une prise de rendez-vous en ligne. Les patients cherchent d'abord la proximité et la disponibilité." }
    },
    auto: {
      angle: "Cabinets, laboratoires et jeunes entreprises de la santé manipulent beaucoup de documents, de rendez-vous et de données sensibles.",
      cases: [
        ['Documents patients classés', "Pièces reçues reconnues, renommées et rangées, alerte si un document manque."],
        ['Veille scientifique résumée', "Nouvelles publications sur vos sujets collectées et résumées chaque semaine."],
        ['Questionnaires avant rendez-vous', "Le patient remplit en ligne, vous arrivez préparé ; les données vont au bon endroit."]
      ],
      faq: { q: "Et la confidentialité des données de santé ?", a: "On privilégie des outils hébergés en Europe, adaptés aux données sensibles, avec des accès limités et une documentation des traitements. Ce qui ne doit pas sortir ne sort pas." }
    }
  }),
  Q({
    slug: 'mosson', name: 'Mosson', aname: 'dans le quartier de la Mosson', cp: '34080', lat: 43.6200, lng: 3.8220,
    profil: "À l'ouest de Montpellier, le quartier Mosson — La Paillade, les Hauts de Massane, Celleneuve — est desservi par le terminus du tram 1 et abrite le stade de la Mosson. Un quartier jeune, où l'entrepreneuriat, le commerce de proximité et le tissu associatif sont très vivants.",
    reperes: ['La Paillade', 'les Hauts de Massane', 'Celleneuve', 'le stade de la Mosson', 'le terminus du tram 1'],
    tissu: "commerces de proximité, auto-entrepreneurs et jeunes entreprises, artisans, associations, services à la personne",
    web: {
      angle: "Beaucoup d'entrepreneurs de la Mosson se lancent avec peu de moyens. Un site simple, chiffré sur devis selon vos moyens, et une fiche Google bien faite donnent tout de suite une image professionnelle et les premiers clients.",
      faq: { q: "Je lance mon activité avec un petit budget : qu'est-ce qui compte le plus ?", a: "D'abord une fiche Google complète (gratuite) et un site simple d'une à trois pages qui explique clairement votre offre et comment vous contacter. C'est souvent suffisant pour obtenir les premiers clients ; on enrichit ensuite." }
    },
    auto: {
      angle: "Pour les jeunes entreprises et associations du quartier, chaque heure compte : l'administratif ne doit pas freiner l'activité.",
      cases: [
        ['Devis et factures automatiques', "Modèles prêts, calculs, envoi et relance — idéal pour démarrer proprement."],
        ['Adhésions et inscriptions associatives', "Inscriptions, paiements et listes de membres sans tableur."],
        ['Prise de rendez-vous en ligne', "Créneaux proposés directement, rappels automatiques."]
      ],
      faq: { q: "Aidez-vous les associations du quartier ?", a: "Oui : adhésions en ligne, paiements, convocations et suivi des membres. Des outils simples qui soulagent énormément les bénévoles, avec un budget adapté." }
    }
  }),
  Q({
    slug: 'cevennes', name: 'Les Cévennes', aname: 'dans le quartier des Cévennes', cp: '34070', lat: 43.6150, lng: 3.8470,
    profil: "Quartier populaire et résidentiel de l'ouest de Montpellier, Les Cévennes — Alco, le Petit Bard, la Pergola — est traversé par la route de Lodève. Commerces de proximité, artisans et services y servent une population nombreuse et diverse.",
    reperes: ['Alco', 'le Petit Bard', 'la Pergola', 'la route de Lodève', 'les commerces de quartier'],
    tissu: "commerces de proximité, artisans, services à la personne, associations, indépendants",
    web: {
      angle: "Dans un quartier très habité comme Les Cévennes, les clients cherchent d'abord près de chez eux. Être bien placé sur les recherches « près de moi » suffit souvent à remplir un planning.",
      faq: { q: "Mes clients sont surtout du quartier : ai-je vraiment besoin d'internet ?", a: "Oui, car même les voisins vérifient sur Google : horaires, avis, téléphone. Une fiche à jour vous évite des clients perdus et vous amène les nouveaux habitants." }
    },
    auto: {
      angle: "Les petites entreprises du quartier gagnent surtout du temps sur le téléphone et les rendez-vous.",
      cases: [
        ['Rappels de rendez-vous', "SMS la veille avec possibilité de décaler : moins d'absences."],
        ['Réponses automatiques', "Questions fréquentes traitées par message, vous ne prenez que les vrais appels."],
        ['Avis clients', "Demande d'avis après chaque prestation pour gagner en visibilité locale."]
      ],
      faq: { q: "Est-ce que ça coûte cher ?", a: "On part de votre gain réel et on commence petit. Si une automatisation ne vous fait pas gagner nettement plus qu'elle ne coûte, on ne la fait pas." }
    }
  }),
  Q({
    slug: 'croix-d-argent', name: "Croix d'Argent", aname: "dans le quartier de la Croix d'Argent", cp: '34070', lat: 43.5930, lng: 3.8580,
    profil: "Au sud-ouest de Montpellier, la Croix d'Argent — Estanove, Mas Drevon, Lemasson, Tastavin, Pas du Loup, Bagatelle, Ovalie — est un grand quartier résidentiel et familial, avec ses commerces, ses artisans et le stade de rugby d'Ovalie.",
    reperes: ['Estanove', 'le Mas Drevon', 'Lemasson', 'Tastavin', 'Pas du Loup', 'Ovalie et le stade de rugby'],
    tissu: "artisans du bâtiment et de la rénovation, commerces de proximité, services aux familles, professions de santé",
    web: {
      angle: "À la Croix d'Argent, les familles cherchent un artisan, un praticien ou un commerce de confiance, proche de chez elles. Les avis et les réalisations montrées en ligne font la décision.",
      faq: { q: "Artisan à la Croix d'Argent : comment rassurer les familles ?", a: "En montrant des chantiers réels (avant/après, quartier, délais), en affichant des avis récents et en répondant vite aux demandes. La confiance se gagne avec des preuves." }
    },
    auto: {
      angle: "Artisans et services de la Croix d'Argent veulent répondre vite sans y passer leurs soirées.",
      cases: [
        ['Devis à partir de photos', "Le client envoie ses photos, une estimation est prête, vous validez."],
        ['Suivi de chantier pour le client', "Étapes clés envoyées automatiquement : moins d'appels, plus de confiance."],
        ['Rappels d\'entretien', "Chaudière, clim, jardin : le client est relancé au bon moment."]
      ],
      faq: { q: "Peut-on démarrer par les relances de devis ?", a: "Oui, c'est souvent le meilleur point de départ : rapide à mettre en place et immédiatement rentable." }
    }
  }),
  Q({
    slug: 'pres-d-arenes', name: "Près d'Arènes", aname: "dans le quartier Près d'Arènes", cp: '34070', lat: 43.5890, lng: 3.8800,
    profil: "Au sud de Montpellier, le quartier Près d'Arènes — Saint-Martin, Tournezy, les Aiguerelles, la zone de Garosud — mêle habitat, commerces et une importante activité économique, avec PME, artisans et logistique urbaine.",
    reperes: ['Garosud', 'Saint-Martin', 'Tournezy', 'les Aiguerelles', "l'avenue de Palavas"],
    tissu: "PME et artisans des zones d'activités, logistique et distribution, commerces, services",
    web: {
      angle: "À Garosud comme dans les rues de Saint-Martin, beaucoup d'entreprises vendent à d'autres entreprises ou à des particuliers de toute la métropole. Le site doit montrer capacités, délais et zone desservie.",
      faq: { q: "Mon entreprise est à Garosud : comment être trouvé par des clients de toute la métropole ?", a: "Avec une fiche Google précise, des pages de services claires et des références localisées. Les clients professionnels recherchent un fournisseur fiable et réactif : montrez-le." }
    },
    auto: {
      angle: "Les PME de Près d'Arènes gèrent commandes, livraisons et facturation à un rythme soutenu.",
      cases: [
        ['Commandes saisies automatiquement', "Bons de commande reçus par e-mail lus et saisis dans votre système."],
        ['Suivi des livraisons', "Statuts et preuves de livraison remontent seuls, le client est informé."],
        ['Rapprochement factures', "Écarts entre commandes, livraisons et factures détectés automatiquement."]
      ],
      faq: { q: "Nos volumes sont importants : c'est adapté ?", a: "Oui, c'est même là que l'automatisation rapporte le plus. Nos plateformes traitent déjà des centaines de milliers d'offres." }
    }
  })
];

/* ═══════════════════════════════════════════════════════════
   MÉTIERS — une page pilier par métier (site + automatisation), Montpellier.
   ═══════════════════════════════════════════════════════════ */
export const METIERS = [
  {
    slug: 'restaurant', label: 'restaurant', plural: 'restaurateurs', h1: 'Site internet pour restaurant à Montpellier',
    title: 'Site internet pour restaurant à Montpellier | GroupSolution',
    desc: "Site de restaurant à Montpellier : menu, réservation en ligne, click & collect, fiche Google Maps et avis. Moins de tables vides. Devis gratuit, audit offert.",
    hook: "À Montpellier, un client choisit son restaurant sur Google Maps en moins d'une minute : photos, note, menu, possibilité de réserver. Si l'un manque, il passe au suivant.",
    must: ["Le menu à jour, lisible sur mobile (pas un PDF illisible)", "La réservation en ligne, reliée à votre planning", "Horaires, jours de fermeture et congés toujours exacts", "Des photos réelles de la salle, de la terrasse et des plats", "Le click & collect ou la vente à emporter si vous en faites", "L'accès (tram, parking) et un bouton d'appel direct"],
    mistakes: ["Menu en PDF ou photo de l'ardoise illisible sur téléphone", "Horaires différents entre le site, Google et les réseaux", "Aucune réponse aux avis, surtout aux négatifs", "Dépendre entièrement d'une plateforme de réservation qui prend une commission par couvert"],
    cases: [['Rappels anti no-show', "Confirmation et rappel la veille avec lien d'annulation : les tables se libèrent au lieu d'être perdues."], ['Liste d\'attente automatique', "Une annulation ? La table est proposée automatiquement au client suivant."], ['Avis après le repas', "Un message de remerciement avec lien vers Google le lendemain : la note monte, la fiche aussi."], ['Commandes fournisseurs', "Les ventes du jour alimentent une proposition de commande pour le lendemain."]],
    faq: [{ q: "Pourquoi un site si je suis déjà sur les plateformes de réservation ?", a: "Pour que les clients qui vous trouvent sur Google réservent en direct, sans commission, et pour garder la maîtrise de votre image et de votre fichier clients. Les plateformes restent un complément." }, { q: "Combien coûte un site de restaurant ?", a: "Tout est sur devis, gratuit : le prix dépend de ce que vous voulez (menu et infos pratiques, réservation intégrée, click & collect, plusieurs langues, automatisations). Vous recevez un devis détaillé avant tout engagement." }],
    communes: ['palavas-les-flots', 'sete', 'meze', 'la-grande-motte', 'lattes', 'perols', 'marseillan', 'aigues-mortes']
  },
  {
    slug: 'artisan', label: 'artisan du bâtiment', plural: 'artisans', h1: 'Site internet pour artisan à Montpellier',
    title: 'Site internet pour artisan du bâtiment à Montpellier | GroupSolution',
    desc: "Plombier, électricien, maçon, peintre, menuisier à Montpellier : un site qui montre vos chantiers et des devis automatiques. Plus de demandes qualifiées, devis gratuit.",
    hook: "Plombier, électricien, maçon, peintre, menuisier, paysagiste : à Montpellier, le client tape « votre métier + sa commune », regarde trois fiches et appelle celle qui montre de vrais chantiers et de bons avis.",
    must: ["Vos réalisations en photos avant/après, localisées", "Votre zone d'intervention réelle (communes, délais)", "Un formulaire de devis qui pose les bonnes questions (et accepte les photos)", "Vos assurances et qualifications (décennale, labels) visibles", "Un bouton d'appel direct sur mobile", "Des avis clients récents"],
    mistakes: ["Un site sans aucune photo de chantier", "Des pages copiées pour chaque ville, sans contenu réel", "Un formulaire trop vague qui oblige à rappeler pour comprendre le besoin", "Laisser les demandes du week-end sans réponse jusqu'au lundi"],
    cases: [['Devis par photos', "Le client décrit son besoin et envoie ses photos ; une estimation est préparée, vous validez d'un clic."], ['Relances de devis', "J+5 et J+12, poliment ; vous êtes prévenu dès qu'un devis est signé."], ['Planning et tournées', "Chantiers regroupés par secteur pour limiter les trajets dans la métropole."], ['Rappels d\'entretien', "Chaudière, clim, toiture : le client est relancé chaque année, votre planning se remplit en basse saison."]],
    faq: [{ q: "J'ai déjà trop de travail : pourquoi un site ?", a: "Pour choisir vos chantiers : plus de demandes qualifiées, c'est la possibilité de privilégier les plus rentables et les plus proches. Et une sécurité si le bouche-à-oreille ralentit." }, { q: "Et si je n'ai pas le temps de m'en occuper ?", a: "On s'occupe de tout : textes, photos à partir de vos chantiers, fiche Google. Votre rôle : nous envoyer des photos depuis votre téléphone de temps en temps." }],
    communes: ['vendargues', 'le-cres', 'fabregues', 'saint-jean-de-vedas', 'castries', 'montarnaud', 'beaulieu', 'cournonsec']
  },
  {
    slug: 'professionnel-de-sante', label: 'professionnel de santé', plural: 'praticiens', h1: 'Site internet pour professionnel de santé à Montpellier',
    title: 'Site internet kiné, ostéo, infirmier, dentiste à Montpellier | GroupSolution',
    desc: "Kinésithérapeutes, ostéopathes, infirmiers, dentistes, psychologues à Montpellier : site sobre et conforme, infos pratiques, prise de RDV, rappels automatiques.",
    hook: "Kiné, ostéopathe, infirmier, dentiste, psychologue, orthophoniste : vos futurs patients cherchent un praticien proche, disponible et rassurant. Et votre site doit respecter les règles de communication de votre profession.",
    must: ["Spécialités, actes pratiqués et publics accueillis", "Accès (tram, parking, accessibilité PMR) et horaires", "La prise de rendez-vous en ligne (compatible avec votre outil existant)", "Une présentation sobre, factuelle, conforme à votre code de déontologie", "Les informations pratiques : tarifs conventionnés, documents à apporter", "Une fiche Google exacte et complète"],
    mistakes: ["Un ton publicitaire incompatible avec les règles de votre ordre", "Des informations pratiques absentes (accès, documents)", "Un téléphone qui sonne en pleine séance pour des questions répétitives", "Une fiche Google créée par un tiers, avec des infos fausses"],
    cases: [['Rappels de rendez-vous', "Rappel la veille avec possibilité de décaler : moins de rendez-vous manqués."], ['Questionnaire préalable', "Le patient remplit en ligne ses antécédents et motifs ; vous arrivez préparé."], ['Documents classés', "Ordonnances et comptes rendus reçus rangés automatiquement dans le bon dossier."], ['Réponses aux questions fréquentes', "Horaires, accès, documents, tarifs : réponses automatiques, le secrétariat respire."]],
    faq: [{ q: "J'utilise déjà un agenda médical en ligne : le site sert-il encore ?", a: "Oui : il présente votre pratique, rassure, apparaît sur Google et redirige vers votre agenda. Les deux se complètent." }, { q: "Qu'est-ce que je n'ai pas le droit de mettre ?", a: "Cela dépend de votre profession et de son ordre (publicité comparative, témoignages, promesses de résultat sont souvent encadrés). On construit un site factuel et informatif, et on vous invite à valider les points sensibles auprès de votre ordre." }],
    communes: ['castelnau-le-lez', 'grabels', 'montferrier-sur-lez', 'lattes', 'juvignac', 'jacou', 'saint-gely-du-fesc', 'balaruc-les-bains']
  },
  {
    slug: 'avocat', label: 'avocat', plural: 'avocats', h1: 'Site internet pour avocat à Montpellier',
    title: "Site internet pour cabinet d'avocat à Montpellier | GroupSolution",
    desc: "Cabinet d'avocat à Montpellier : site conforme aux règles de la profession, pages par domaine, prise de RDV, collecte automatique des pièces clients.",
    hook: "Un justiciable qui cherche un avocat à Montpellier tape souvent son problème précis (« avocat divorce Montpellier », « licenciement abusif »). Il appelle le cabinet qui explique clairement le domaine et facilite le premier rendez-vous.",
    must: ["Une page par domaine d'intervention, rédigée pour le justiciable", "Honoraires : mode de calcul et première consultation expliqués", "Prise de rendez-vous en ligne ou en visio", "Présentation des avocats et de leurs spécialités", "Mentions obligatoires de la profession", "Des contenus utiles (questions fréquentes par domaine)"],
    mistakes: ["Un site institutionnel froid qui ne répond à aucune question concrète", "Tous les domaines sur une seule page", "Pas de moyen simple de prendre un premier rendez-vous", "Des contenus trop techniques pour un particulier"],
    cases: [['Collecte des pièces', "Liste personnalisée par dossier, dépôt en ligne, relances automatiques jusqu'au dossier complet."], ['Premier rendez-vous qualifié', "Un court questionnaire en amont : vous savez de quoi il s'agit avant l'appel."], ['Suivi des échéances', "Délais et audiences suivis, rappels automatiques au cabinet et au client."], ['Facturation et provisions', "Demandes de provision, factures et relances envoyées automatiquement."]],
    faq: [{ q: "Un site d'avocat doit-il respecter des règles particulières ?", a: "Oui, la communication des avocats est encadrée par les règles de la profession. On construit un site informatif et sobre, et on vous laisse valider chaque contenu au regard de votre déontologie." }, { q: "L'automatisation est-elle compatible avec le secret professionnel ?", a: "Oui, avec des outils hébergés en Europe, des accès limités et aucun traitement de données sensibles hors de votre contrôle. On documente tout." }],
    communes: ['castelnau-le-lez', 'lattes', 'saint-jean-de-vedas', 'nimes', 'beziers', 'sete', 'lunel', 'montferrier-sur-lez']
  },
  {
    slug: 'expert-comptable', label: 'cabinet comptable', plural: 'experts-comptables', h1: 'Site et automatisation pour cabinet comptable à Montpellier',
    title: 'Site internet et automatisation pour expert-comptable à Montpellier | GroupSolution',
    desc: "Cabinets d'expertise comptable à Montpellier : site qui attire les bons clients, collecte automatique des pièces, onboarding et relances. Des heures gagnées par dossier.",
    hook: "Pour un cabinet comptable, le site attire des clients — mais le vrai gisement est ailleurs : la collecte des pièces, les relances et la saisie qui dévorent les journées des collaborateurs.",
    must: ["Vos offres par profil (créateurs, TPE, professions libérales, SCI…)", "Un simulateur ou une grille d'honoraires indicative", "Un espace de dépôt de documents simple", "La prise de rendez-vous en ligne", "Des contenus sur les échéances et questions fréquentes", "Des témoignages ou cas clients (dans le respect des règles)"],
    mistakes: ["Un site généraliste qui ne parle à aucun profil", "Des clients qui envoient leurs pièces par e-mail, en vrac", "Des relances manuelles qui prennent des heures en période fiscale", "Un onboarding client sans process"],
    cases: [['Collecte des pièces automatisée', "Chaque client reçoit sa liste, dépose en ligne, est relancé ; vous voyez l'état de chaque dossier d'un coup d'œil."], ['Extraction des données', "Les informations des justificatifs sont extraites et pré-remplissent vos outils ; le collaborateur vérifie."], ['Onboarding client', "Lettre de mission, questionnaire, accès et documents envoyés dès la signature."], ['Rappels d\'échéances', "Chaque client reçoit ses échéances et ce qu'il doit fournir, au bon moment."]],
    faq: [{ q: "Vous remplacez notre logiciel de production ?", a: "Non. On automatise ce qui l'entoure : collecte, tri, relances, extraction. Votre logiciel de production reste au centre." }, { q: "Combien de temps peut-on gagner ?", a: "Cela dépend du cabinet, mais la collecte et les relances représentent souvent plusieurs heures par collaborateur et par semaine en période chargée. On le mesure ensemble avant de chiffrer." }],
    communes: ['castelnau-le-lez', 'lattes', 'saint-jean-de-vedas', 'clapiers', 'mauguio-carnon', 'sete', 'lunel', 'nimes']
  },
  {
    slug: 'agence-immobiliere', label: 'agence immobilière', plural: 'agents immobiliers', h1: 'Site internet pour agence immobilière à Montpellier',
    title: 'Site internet et automatisation pour agence immobilière à Montpellier | GroupSolution',
    desc: "Agence immobilière à Montpellier : site qui génère des mandats, estimation en ligne, relances acquéreurs et rapprochement automatique biens / demandes.",
    hook: "À Montpellier, les portails captent les acquéreurs ; votre site doit capter les vendeurs. Estimation en ligne, expertise locale et réactivité font signer les mandats.",
    must: ["Une estimation en ligne qui génère des contacts vendeurs", "Des pages par quartier et par commune, avec votre expertise locale", "Vos biens synchronisés avec votre logiciel", "Des avis clients visibles", "La prise de rendez-vous pour une estimation", "Les mentions et barèmes d'honoraires obligatoires"],
    mistakes: ["Un site qui ne fait que dupliquer les annonces des portails", "Aucune page de contenu local (quartiers, prix, conseils)", "Des demandes d'acquéreurs traitées à la main, trop tard", "Pas de suivi des vendeurs qui ne sont pas encore prêts"],
    cases: [['Rapprochement biens / acquéreurs', "Chaque nouveau bien est comparé aux demandes en cours et les acquéreurs pertinents sont prévenus — notre savoir-faire de matching, déjà à l'échelle de centaines de milliers d'offres."], ['Relances vendeurs', "Les propriétaires qui ont fait une estimation reçoivent un suivi personnalisé jusqu'au mandat."], ['Visites planifiées', "Créneaux proposés automatiquement, confirmations et comptes rendus."], ['Gestion locative', "Quittances, relances, états des lieux et messages aux propriétaires automatisés."]],
    faq: [{ q: "Le matching automatique, c'est vraiment utile pour une agence ?", a: "Oui : c'est exactement ce que font nos plateformes à grande échelle. Appliqué à votre portefeuille, chaque bien trouve plus vite ses acquéreurs, et chaque acquéreur est rappelé au bon moment." }, { q: "Pouvez-vous connecter notre logiciel de transaction ?", a: "Dans la plupart des cas, via les exports ou connecteurs existants. On vérifie la compatibilité au premier échange." }],
    communes: ['castelnau-le-lez', 'lattes', 'la-grande-motte', 'palavas-les-flots', 'saint-gely-du-fesc', 'sete', 'agde', 'le-grau-du-roi']
  },
  {
    slug: 'coiffeur-esthetique', label: 'salon de coiffure ou institut', plural: 'salons et instituts', h1: 'Site internet pour salon de coiffure et institut à Montpellier',
    title: 'Site internet pour coiffeur et institut de beauté à Montpellier | GroupSolution',
    desc: "Salon de coiffure, barbier, institut, onglerie à Montpellier : réservation en ligne, prestations et tarifs, rappels SMS et fidélisation automatique.",
    hook: "Coiffure, barbier, esthétique, onglerie : vos clientes réservent le soir sur leur téléphone. Sans réservation en ligne, vous perdez celles qui ne veulent pas appeler pendant vos heures d'ouverture.",
    must: ["La réservation en ligne par prestation et par collaborateur", "La carte des prestations avec prix et durées", "Des photos de réalisations (et le lien Instagram)", "Horaires, accès et parking", "Les cartes cadeaux en ligne", "Une fiche Google avec beaucoup d'avis"],
    mistakes: ["Obliger à appeler pour réserver", "Des tarifs absents ou obsolètes", "Aucun rappel : des créneaux perdus chaque semaine", "Des clientes fidèles jamais relancées"],
    cases: [['Rappels SMS', "La veille, avec lien pour décaler : les no-shows chutent."], ['Relance au bon rythme', "Une cliente coloration est relancée après six semaines, une coupe homme après quatre."], ['Cartes cadeaux en ligne', "Vendues et envoyées automatiquement, surtout avant les fêtes."], ['Fidélité sans carte papier', "Points, offres d'anniversaire, parrainage : tout suit automatiquement."]],
    faq: [{ q: "J'utilise déjà une appli de réservation : le site sert-il à quelque chose ?", a: "Oui : il vous rend visible sur Google, présente votre univers et vos réalisations, et renvoie vers votre réservation. On automatise aussi ce que votre appli ne fait pas (relances, fidélité, avis)." }, { q: "Les relances automatiques, ça ne fait pas trop commercial ?", a: "Pas si elles sont bien dosées et personnalisées : un rappel au bon moment est perçu comme un service." }],
    communes: ['juvignac', 'castelnau-le-lez', 'lattes', 'jacou', 'saint-jean-de-vedas', 'le-cres', 'frontignan', 'lunel']
  },
  {
    slug: 'coach-salle-de-sport', label: 'coach sportif ou salle de sport', plural: 'coachs et salles', h1: 'Site internet pour coach sportif et salle de sport à Montpellier',
    title: 'Site internet pour coach sportif, yoga, salle de sport à Montpellier | GroupSolution',
    desc: "Coachs, studios de yoga et pilates, salles de sport à Montpellier : réservation de séances, abonnements, paiements récurrents et relances automatiques.",
    hook: "Coach à domicile, studio de yoga ou de pilates, box de cross-training : à Montpellier, l'offre est dense. Ceux qui remplissent leurs cours proposent un essai simple, une réservation en ligne et un suivi qui donne envie de revenir.",
    must: ["Le planning des cours et la réservation en ligne", "Une séance d'essai facile à réserver", "Les formules et tarifs clairs", "Votre approche, vos diplômes, vos résultats (sans promesse abusive)", "Le paiement en ligne et les abonnements", "Des avis et témoignages"],
    mistakes: ["Planning en image non mis à jour", "Inscription par message privé", "Aucune relance des élèves qui décrochent", "Gérer les abonnements dans un tableur"],
    cases: [['Abonnements et paiements récurrents', "Prélèvements, décompte des séances, relance avant expiration."], ['Liste d\'attente', "Un cours complet ? Les inscrits en attente sont prévenus dès qu'une place se libère."], ['Relance des élèves inactifs', "Un message personnalisé après trois semaines d'absence."], ['Suivi de progression', "Pour les coachs : bilans et programmes envoyés automatiquement."]],
    faq: [{ q: "Je suis coach indépendant à domicile : quel site ?", a: "Un site simple qui présente votre approche, vos zones d'intervention dans la métropole, vos formules et une réservation de séance d'essai. C'est souvent suffisant pour remplir un planning." }, { q: "Peut-on gérer les paiements récurrents ?", a: "Oui, avec des solutions de paiement sécurisées : abonnements, cartes de séances, relances des impayés." }],
    communes: ['juvignac', 'castelnau-le-lez', 'lattes', 'perols', 'clapiers', 'saint-gely-du-fesc', 'sete', 'la-grande-motte']
  },
  {
    slug: 'hebergement-gite', label: 'hébergement', plural: 'hébergeurs', h1: 'Site internet pour gîte, chambre d\'hôtes et hôtel autour de Montpellier',
    title: "Site internet pour gîte, chambre d'hôtes et hôtel près de Montpellier | GroupSolution",
    desc: "Gîtes, chambres d'hôtes, hôtels et locations autour de Montpellier : réservation directe sans commission, calendrier synchronisé, messages voyageurs automatiques.",
    hook: "Chaque réservation passée par une plateforme vous coûte une commission. Un site avec réservation directe, bien référencé, récupère les clients fidèles et ceux qui vous trouvent sur Google.",
    must: ["La réservation et le paiement en ligne (acompte)", "Un calendrier synchronisé avec les plateformes", "De belles photos et une description honnête", "Les environs : plages, vignobles, Pic Saint-Loup, Montpellier", "Plusieurs langues si votre clientèle est internationale", "Les conditions d'annulation claires"],
    mistakes: ["Dépendre à 100 % des plateformes", "Des doubles réservations faute de synchronisation", "Répondre dix fois par jour aux mêmes questions", "Ne jamais recontacter les anciens clients"],
    cases: [['Calendrier unique', "Réservations directes et plateformes synchronisées automatiquement."], ['Messages voyageurs', "Confirmation, instructions d'arrivée, codes, recommandations et demande d'avis au bon moment."], ['Ménages et entretien', "Planning des ménages généré à partir des réservations, prestataires prévenus."], ['Fidélisation', "Les anciens clients reçoivent une offre pour revenir, en direct."]],
    faq: [{ q: "Faut-il quitter les plateformes ?", a: "Non : elles apportent de la visibilité. L'objectif est d'augmenter la part des réservations directes, plus rentables, pas de s'en priver." }, { q: "La synchronisation des calendriers est-elle fiable ?", a: "Oui avec les bons outils ; on la met en place et on la teste avant la saison." }],
    communes: ['villeveyrac', 'murviel-les-montpellier', 'saint-mathieu-de-treviers', 'aniane', 'les-matelles', 'vic-la-gardiole', 'loupian', 'marseillan']
  },
  {
    slug: 'domaine-viticole', label: 'domaine viticole', plural: 'vignerons', h1: 'Site internet pour domaine viticole et cave autour de Montpellier',
    title: 'Site internet et vente en ligne pour domaine viticole dans l’Hérault | GroupSolution',
    desc: "Domaines et caves de l'Hérault : site qui raconte votre terroir, boutique en ligne, réservation de dégustations, club de clients et commandes pro automatisées.",
    hook: "Saint-Georges-d'Orques, Pic Saint-Loup, Picpoul de Pinet, muscats de Frontignan, Mireval et Lunel : l'Hérault regorge de terroirs. Les domaines qui vendent en direct racontent leur histoire en ligne et rendent l'achat facile.",
    must: ["L'histoire du domaine, du terroir et des cuvées", "Une boutique en ligne reliée à votre stock", "La réservation de visites et dégustations", "Les points de vente et cavistes", "Le respect de la loi Évin dans la communication", "Un espace pro pour cavistes et restaurateurs"],
    mistakes: ["Un site vitrine sans possibilité d'acheter", "Un stock en ligne qui ne correspond pas au caveau", "Aucune relation suivie avec les clients qui ont acheté", "Des commandes pro gérées par téléphone et e-mail"],
    cases: [['Boutique reliée au chai', "Commandes, stock par cuvée, étiquettes d'expédition et factures synchronisés."], ['Dégustations réservées', "Créneaux, groupes, rappels et informations d'accès automatiques."], ['Club de clients', "Abonnements, envois périodiques et paiements récurrents gérés seuls."], ['Commandes professionnelles', "Espace pro avec tarifs dédiés, bons de commande et factures automatiques."]],
    faq: [{ q: "Vendre du vin en ligne, c'est compliqué ?", a: "Les contraintes (loi Évin, âge légal, expédition, droits) se gèrent bien avec les bons outils. On met en place une solution adaptée à vos volumes." }, { q: "Pouvez-vous gérer les commandes de fin d'année ?", a: "Oui : coffrets, commandes d'entreprise, créneaux de retrait et préparation organisés automatiquement." }],
    communes: ['saint-georges-d-orques', 'saint-mathieu-de-treviers', 'villeveyrac', 'meze', 'mireval', 'frontignan', 'lunel', 'aniane']
  },
  {
    slug: 'commerce-boutique', label: 'commerce', plural: 'commerçants', h1: 'Site internet pour commerce et boutique à Montpellier',
    title: 'Site internet et click & collect pour commerce à Montpellier | GroupSolution',
    desc: "Boutiques et commerces à Montpellier : site, click & collect, stock visible en ligne, fiche Google et fidélisation automatique. Vendez aussi quand la boutique est fermée.",
    hook: "Avant de se déplacer, vos clients vérifient en ligne : êtes-vous ouvert, avez-vous le produit, combien ça coûte ? Le commerce qui répond à ces trois questions gagne la visite.",
    must: ["Horaires exacts et fiche Google soignée", "Vos produits phares ou votre catalogue en ligne", "Le click & collect ou la réservation d'articles", "Le stock visible si possible", "Les cartes cadeaux", "Un moyen de contact immédiat"],
    mistakes: ["Aucune idée de ce qu'on trouve en boutique depuis internet", "Une boutique en ligne séparée, avec un stock jamais à jour", "Pas de fichier clients", "Des réseaux sociaux actifs mais aucun site"],
    cases: [['Stock synchronisé', "Caisse et site partagent le même inventaire, mis à jour automatiquement."], ['Click & collect', "Commande en ligne, préparation, SMS quand c'est prêt."], ['Fidélisation', "Points, anniversaires, relances des clients inactifs."], ['Réassort', "Alertes de stock bas et proposition de commande fournisseur."]],
    faq: [{ q: "Un petit commerce a-t-il besoin d'une boutique en ligne ?", a: "Pas toujours d'un e-commerce complet : souvent, un catalogue avec réservation ou click & collect suffit et coûte beaucoup moins cher." }, { q: "Peut-on relier ma caisse au site ?", a: "Dans la plupart des cas, oui, via les connecteurs de votre logiciel de caisse." }],
    communes: ['saint-clement-de-riviere', 'lattes', 'castelnau-le-lez', 'pignan', 'lunel', 'sommieres', 'sete', 'clermont-l-herault']
  },
  {
    slug: 'garage-automobile', label: 'garage automobile', plural: 'garagistes', h1: 'Site internet pour garage automobile à Montpellier',
    title: 'Site internet et prise de RDV pour garage automobile à Montpellier | GroupSolution',
    desc: "Garages, carrosseries, centres d'entretien à Montpellier : prise de rendez-vous en ligne, devis, rappels d'entretien et de contrôle technique automatiques.",
    hook: "Vidange, freins, pneus, carrosserie : l'automobiliste compare les garages proches, les avis et la possibilité de réserver en ligne. Les rappels d'entretien font revenir les clients chaque année.",
    must: ["La prise de rendez-vous en ligne par prestation", "Des prix indicatifs pour les prestations courantes", "Les marques et services pris en charge", "Un formulaire de devis carrosserie avec photos", "Horaires, accès, véhicule de prêt éventuel", "Des avis clients"],
    mistakes: ["Tout faire par téléphone", "Aucun rappel d'entretien : les clients partent chez un centre auto", "Pas de suivi après la prestation", "Une fiche Google incomplète"],
    cases: [['Rappels d\'entretien', "Révision, pneus, contrôle technique : le client est relancé au bon moment."], ['Devis carrosserie par photos', "Photos du dommage, estimation préparée, rendez-vous proposé."], ['Suivi de réparation', "Le client est prévenu automatiquement quand son véhicule est prêt."], ['Avis après passage', "Demande d'avis automatique pour renforcer votre fiche Google."]],
    faq: [{ q: "Les rappels d'entretien, ça marche vraiment ?", a: "C'est l'une des automatisations les plus rentables pour un garage : elle fait revenir les clients qui, sinon, iraient ailleurs." }, { q: "Et si j'ai déjà un logiciel de garage ?", a: "On s'y connecte quand c'est possible pour récupérer les dates d'entretien et déclencher les rappels." }],
    communes: ['vendargues', 'saint-jean-de-vedas', 'le-cres', 'fabregues', 'mauguio-carnon', 'lunel', 'gignac', 'frontignan']
  },
  {
    slug: 'organisme-de-formation', label: 'organisme de formation', plural: 'organismes de formation', h1: 'Site et automatisation pour organisme de formation à Montpellier',
    title: 'Site internet et automatisation pour organisme de formation à Montpellier | GroupSolution',
    desc: "Organismes de formation et CFA à Montpellier : catalogue, inscriptions, convocations, émargement et attestations automatisés. Le savoir-faire de Solution Alternance.",
    hook: "Catalogue, inscriptions, convocations, émargements, attestations, suivi qualité : un organisme de formation croule sous l'administratif. C'est notre terrain : notre plateforme Solution Alternance rapproche déjà des profils de plus de 200 000 offres.",
    must: ["Un catalogue clair, avec programmes, prérequis, durées et tarifs", "L'inscription ou la demande d'information en ligne", "Les indicateurs de résultats attendus par votre certification", "Les modalités d'accès, de financement et d'accessibilité", "Les prochaines sessions et leurs dates", "Des témoignages d'apprenants"],
    mistakes: ["Des programmes en PDF introuvables sur Google", "Des inscriptions gérées par e-mail et tableur", "Des convocations et attestations faites à la main", "Aucun suivi des prospects qui ont demandé une information"],
    cases: [['Inscriptions et convocations', "Inscription en ligne, dossier complet, convocation envoyée automatiquement."], ['Émargement et attestations', "Émargement numérique, attestations générées et envoyées en fin de session."], ['Rapprochement candidats / entreprises', "Pour les CFA : matching des apprentis et des offres, comme Solution Alternance."], ['Relance des prospects', "Les demandes d'information sont suivies jusqu'à l'inscription."]],
    faq: [{ q: "Vous connaissez les contraintes des organismes de formation ?", a: "Oui : avec Solution Alternance, on travaille au quotidien sur l'apprentissage, les offres et le rapprochement des profils. On sait ce que représentent inscriptions, suivi et indicateurs." }, { q: "Peut-on automatiser les documents qualité ?", a: "Une grande partie : convocations, émargements, attestations, questionnaires de satisfaction et tableaux d'indicateurs se génèrent automatiquement." }],
    communes: ['castelnau-le-lez', 'lattes', 'saint-jean-de-vedas', 'clapiers', 'grabels', 'nimes', 'beziers', 'sete']
  },
  {
    slug: 'services-a-domicile', label: 'services à domicile', plural: 'entreprises de services à domicile', h1: 'Site internet pour services à domicile à Montpellier',
    title: 'Site internet pour ménage, jardinage, lavage auto à domicile à Montpellier | GroupSolution',
    desc: "Ménage, jardinage, lavage auto, bricolage, garde : site avec devis ou réservation en ligne, planning des intervenants et facturation automatique. Devis sur mesure.",
    hook: "Ménage, jardinage, bricolage, lavage auto à domicile : le client veut un prix et un créneau tout de suite, sans rappeler. Le site peut le permettre : le client décrit son besoin ou envoie des photos, et reçoit une proposition sans attendre.",
    must: ["Un devis instantané ou une réservation en ligne", "Votre zone d'intervention (communes desservies)", "Les tarifs ou fourchettes de prix", "Les avantages fiscaux si votre activité y ouvre droit", "Des avis clients", "Un paiement en ligne simple"],
    mistakes: ["Obliger à appeler pour avoir un prix", "Un planning d'intervenants tenu à la main", "Des factures et attestations faites en fin d'année dans l'urgence", "Aucune relance des clients ponctuels"],
    cases: [['Devis instantané par photos', "Le client décrit son besoin, envoie ses photos et reçoit une proposition sans appel ; vous validez avant envoi."], ['Planning des intervenants', "Interventions réparties par secteur, intervenants prévenus, clients confirmés automatiquement."], ['Facturation et attestations', "Factures après chaque intervention et documents annuels générés automatiquement."], ['Récurrence', "Les clients ponctuels reçoivent une proposition d'abonnement au bon moment."]],
    faq: [{ q: "Un devis automatique à partir de photos, c'est réaliste ?", a: "Oui : l'analyse d'images et quelques questions bien posées suffisent pour préparer une proposition que vous validez avant envoi. On l'adapte à votre métier et à vos règles de prix." }, { q: "Mon activité ouvre droit au crédit d'impôt : que mettre en avant ?", a: "Si votre activité est déclarée comme service à la personne, l'avantage fiscal est un argument fort à afficher clairement, avec les conditions exactes. On vous aide à le présenter sans erreur." }],
    communes: ['lattes', 'castelnau-le-lez', 'saint-gely-du-fesc', 'juvignac', 'perols', 'mauguio-carnon', 'teyran', 'palavas-les-flots']
  }
];

/* Liens transverses (guides rédigés par zones/generate-guides.mjs + outils /outils/). */
export const GUIDES_LINKS = [
  ['prix-site-internet-montpellier', 'Prix d’un site internet'],
  ['apparaitre-google-maps-montpellier', 'Apparaître sur Google Maps'],
  ['automatiser-devis-artisan', 'Automatiser ses devis'],
  ['obligations-legales-site-internet', 'Obligations légales d’un site'],
  ['relances-factures-impayees-automatiques', 'Relancer les impayés'],
  ['choisir-agence-web-montpellier', 'Choisir son agence web']
];
export const OUTILS_LINKS = [
  ['configurateur-site-internet', 'Configurateur de projet'],
  ['test-visibilite-google', 'Test de visibilité Google'],
  ['calculateur-automatisation', 'Calculateur d’automatisation']
];
