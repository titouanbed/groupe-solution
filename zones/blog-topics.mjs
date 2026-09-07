/* ═══════════════════════════════════════════════════════════
   SUJETS D'ARTICLES DE BLOG LOCAL (longue traîne).
   Chaque sujet interpole fortement les données de la ville (nom, gentilé,
   quartiers, angle sectoriel local) pour produire un contenu réellement
   différencié d'une ville à l'autre — pas du texte à trou dupliqué.

   Consommé par zones/generate-blog.mjs.
   ═══════════════════════════════════════════════════════════ */

const YEAR = 2026;

/* Helpers grammaticaux locaux (préposition/contraction correctes selon la ville). */
const localAngle = c => (c.servicesIntro || c.heroSub || '').trim();
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);       // "au Port" -> "Au Port"
const de = c => c.name === 'Le Port' ? 'du Port' : c.name === 'La Guyane' ? 'de la Guyane' : 'de ' + c.name;

export const TOPICS = [
  /* ─────────── TARIFS ─────────── */
  {
    slug: 'prix-site-internet',
    label: 'Tarifs',
    title: c => `Prix d'un site internet ${c.h1suffix} : le vrai budget en ${YEAR}`,
    desc: c => `Combien coûte réellement un site internet ${c.h1suffix} ? Tarifs d'un site vitrine, e-commerce ou sur-mesure, ce qui fait varier le prix, et comment bien investir localement.`,
    keywords: c => `prix site internet ${c.name}, tarif création site web ${c.name}, combien coûte un site ${c.name}, devis site vitrine ${c.name}`,
    body: (c, z) => `
      <p class="lead">« Combien ça coûte, un site internet ? » C'est la première question que se posent les entreprises ${c.gentile} avant de se lancer. La réponse honnête : cela dépend de vos objectifs. Voici les vraies fourchettes, sans langue de bois, pour un projet ${c.h1suffix}.</p>

      <h2>Combien coûte un site internet ${c.h1suffix} ?</h2>
      <p>Chez GroupSolution, on travaille avec des tarifs clairs, pensés pour les TPE et PME locales :</p>
      <ul>
        <li><strong>Site vitrine professionnel — à partir de 250€.</strong> Idéal pour une première présence en ligne crédible : présentation, services, contact, optimisé mobile.</li>
        <li><strong>Site e-commerce — sur devis.</strong> Boutique en ligne, paiement, gestion des produits et des livraisons. Le prix dépend de votre catalogue.</li>
        <li><strong>Plateforme sur-mesure — sur devis.</strong> Réservation, automatisation, espace client : on chiffre selon les fonctionnalités.</li>
      </ul>

      <h2>Ce qui fait varier le prix</h2>
      <p>Deux sites « vitrines » peuvent avoir des budgets très différents. Les principaux facteurs :</p>
      <ul>
        <li>Le <strong>nombre de pages</strong> et la quantité de contenu à produire.</li>
        <li>Les <strong>fonctionnalités</strong> : réservation, e-commerce, espace membre, multilingue…</li>
        <li>La <strong>création de contenu</strong> (textes, photos, logo) si vous n'en avez pas.</li>
        <li>Le <strong>référencement</strong> et l'accompagnement dans la durée.</li>
      </ul>

      <h2>Le web ${c.h1suffix} : un investissement, pas une dépense</h2>
      <p>${localAngle(c)} Un site bien conçu travaille pour vous 24h/24 : il rassure, il informe, et surtout il transforme les recherches locales en clients. ${cap(c.h1suffix)}, être visible en ligne — de ${c.zones ? c.zones.split(',').slice(0, 2).join(' à ').trim() : 'votre quartier'} — c'est capter une clientèle qui, sinon, irait chez le concurrent trouvé en premier sur Google.</p>
      <p>Le bon calcul n'est pas « combien ça coûte », mais « combien ça rapporte » : un seul nouveau client récurrent rembourse souvent un site vitrine.</p>

      <h2>Comment bien choisir votre prestataire ${c.h1suffix}</h2>
      <p>Méfiez-vous des extrêmes : un site à 50€ ne vous rapportera rien, un site à 10 000€ est rarement justifié pour une TPE. Cherchez un partenaire qui&nbsp;:</p>
      <ul>
        <li>vous propose un <strong>devis transparent</strong>, sans coûts cachés&nbsp;;</li>
        <li>comprend votre <strong>marché local</strong> ${c.h1suffix}&nbsp;;</li>
        <li>pense <strong>référencement</strong> dès le départ, pas seulement « joli design »&nbsp;;</li>
        <li>reste joignable <strong>après</strong> la mise en ligne.</li>
      </ul>

      <div class="callout"><p>Le bon budget, c'est celui qui vous rapporte des clients. On commence toujours par un audit gratuit de 15 minutes pour cadrer le vôtre.</p></div>`,
    faq: (c) => [
      { q: `Quel est le prix minimum pour un site internet ${c.h1suffix} ?`, a: `Un site vitrine professionnel démarre à 250€ chez GroupSolution. C'est le meilleur rapport qualité-prix pour une première présence en ligne sérieuse ${c.h1suffix}.` },
      { q: `Y a-t-il des frais cachés (hébergement, maintenance) ?`, a: `Non. On vous présente un devis clair incluant tout ce dont vous avez besoin. L'hébergement et la maintenance éventuelle sont annoncés à l'avance, sans surprise.` },
      { q: `Un site e-commerce coûte-t-il beaucoup plus cher ?`, a: `Plus qu'une vitrine, oui, car il y a la boutique, le paiement et la gestion des produits. On établit un devis sur-mesure selon votre catalogue et vos volumes.` }
    ]
  },

  /* ─────────── VISIBILITÉ LOCALE ─────────── */
  {
    slug: 'visibilite-locale-google',
    label: 'Visibilité',
    title: c => `Être visible sur Google ${c.h1suffix} : le guide ${YEAR}`,
    desc: c => `Comment faire remonter votre entreprise dans les recherches locales ${c.h1suffix} : fiche Google, mots-clés géolocalisés, avis clients et site optimisé. Le guide complet.`,
    keywords: c => `référencement local ${c.name}, être visible Google ${c.name}, SEO local ${c.name}, fiche Google Business ${c.name}`,
    body: (c, z) => `
      <p class="lead">Vos futurs clients ${c.h1suffix} vous cherchent sur Google avant de pousser votre porte. S'ils ne vous trouvent pas, ils trouvent le concurrent. Voici comment prendre la première place sur les recherches locales.</p>

      <h2>Le référencement local, c'est quoi ?</h2>
      <p>C'est l'ensemble des techniques qui font apparaître votre entreprise quand quelqu'un tape « votre métier + ${c.name} » (ou cherche « près de moi »). C'est le levier n°1 pour une entreprise ${c.gentile.replace(/s$/, '')} : ciblé, local, et beaucoup moins concurrentiel qu'une visibilité nationale.</p>

      <h2>1. Votre fiche Google Business Profile</h2>
      <p>C'est la base, et c'est gratuit. Une fiche complète (horaires, photos, services, zone desservie) vous fait apparaître dans le « pack local » — les 3 résultats avec la carte, tout en haut de Google. ${cap(c.h1suffix)}, une fiche soignée fait souvent la différence.</p>

      <h2>2. Des mots-clés géolocalisés</h2>
      <p>Votre site doit parler ${de(c)} explicitement : « votre service ${c.h1suffix} », vos quartiers d'intervention (${c.zones ? c.zones.split(',').slice(0, 3).join(', ').trim() : 'toute la ville'}…). Google comprend ainsi que vous êtes LE bon résultat pour une recherche locale.</p>

      <h2>3. Les avis clients</h2>
      <p>Les avis Google pèsent lourd, à la fois pour votre classement et pour la confiance. Demandez-les systématiquement à vos clients satisfaits, et répondez-y. Une entreprise avec 30 avis à 4,8★ ${c.h1suffix} rassure infiniment plus qu'une fiche vide.</p>

      <h2>4. Un site rapide et optimisé mobile</h2>
      <p>${cap(c.h1suffix)} comme ailleurs, on cherche depuis son téléphone. Un site lent ou mal affiché sur mobile est pénalisé par Google et fait fuir les visiteurs. Vitesse, mobile et contenu local : le trio gagnant.</p>

      <h2>${cap(c.h1suffix)}, jouez la carte de la proximité</h2>
      <p>${localAngle(c)} La bonne nouvelle : la concurrence sur le référencement local reste souvent faible. En soignant ces quatre points, une TPE ${de(c)} peut réellement dominer sa recherche locale — et capter des clients tous les jours, sans budget publicitaire.</p>

      <div class="callout"><p>On audite gratuitement votre visibilité actuelle ${c.h1suffix} et on vous dit, concrètement, quoi améliorer en premier.</p></div>`,
    faq: (c) => [
      { q: `Combien de temps pour être bien référencé ${c.h1suffix} ?`, a: `La fiche Google peut vous faire apparaître en quelques semaines. Le référencement du site progresse sur 3 à 6 mois. La régularité (contenu, avis) fait la différence dans la durée.` },
      { q: `Le référencement local est-il payant ?`, a: `La fiche Google Business est gratuite. Le travail d'optimisation du site et de la stratégie, lui, se prépare — c'est justement ce qu'on fait pour vous ${c.h1suffix}.` },
      { q: `Faut-il faire de la publicité Google en plus ?`, a: `Pas obligatoirement. Un bon référencement naturel local suffit souvent ${c.h1suffix}. La publicité (Ads) sert à accélérer ou à couvrir une demande ponctuelle.` }
    ]
  },

  /* ─────────── RÉSEAUX SOCIAUX ─────────── */
  {
    slug: 'reseaux-sociaux-clients',
    label: 'Réseaux sociaux',
    title: c => `Trouver des clients sur les réseaux sociaux ${c.h1suffix}`,
    desc: c => `Facebook, Instagram, TikTok, WhatsApp : comment transformer les réseaux sociaux en machine à clients pour votre entreprise ${c.h1suffix}. Le guide pratique.`,
    keywords: c => `réseaux sociaux ${c.name}, community management ${c.name}, publicité Facebook ${c.name}, trouver des clients Instagram ${c.name}`,
    body: (c) => `
      <p class="lead">${cap(c.h1suffix)}, une grande partie de vos clients passe ses journées sur les réseaux sociaux. La question n'est pas « faut-il y être », mais « comment y transformer l'attention en clients ». Voici la méthode.</p>

      <h2>Quel réseau pour votre entreprise ${c.h1suffix} ?</h2>
      <ul>
        <li><strong>Facebook &amp; WhatsApp</strong> — incontournables localement : groupes, recommandations, contact direct. Le réflexe n°1 d'une clientèle de proximité.</li>
        <li><strong>Instagram</strong> — pour tout ce qui est visuel (restauration, beauté, artisanat, immobilier). La vitrine qui donne envie.</li>
        <li><strong>TikTok</strong> — pour toucher une audience jeune et créer de la portée rapidement, même sans budget.</li>
      </ul>

      <h2>Créer du contenu qui donne envie</h2>
      <p>Le piège, c'est de ne parler que de soi. Le bon contenu apporte de la valeur&nbsp;: coulisses, conseils, avant/après, réponses aux questions fréquentes de vos clients. Montrez votre expertise et votre visage — la proximité, c'est votre force face aux grandes enseignes.</p>

      <h2>La régularité prime sur la perfection</h2>
      <p>Mieux vaut 2 publications utiles par semaine, régulièrement, qu'une vidéo parfaite tous les deux mois. Un planning simple et tenu bat toujours l'improvisation. C'est là qu'un community manager fait gagner un temps précieux.</p>

      <h2>La publicité locale (Social Ads)</h2>
      <p>Avec quelques euros par jour, on cible précisément les habitants autour de votre établissement (${c.zones ? c.zones.split(',').slice(0, 2).join(', ').trim() : 'votre secteur'}…), par âge et par centre d'intérêt. Idéal pour une ouverture, une promo ou remplir un agenda creux ${c.h1suffix}.</p>

      <h2>Réseaux sociaux + site : le duo gagnant</h2>
      <p>${localAngle(c)} Les réseaux créent l'attention&nbsp;; votre site transforme cette attention en client (réservation, devis, achat). Les deux se renforcent&nbsp;: c'est tout l'intérêt d'un accompagnement global.</p>

      <div class="callout"><p>On gère vos réseaux de A à Z (contenu, publication, publicité) ou on vous forme à le faire. On commence par un audit gratuit de votre présence actuelle.</p></div>`,
    faq: (c) => [
      { q: `Sur quels réseaux mon entreprise ${c.h1suffix} doit-elle être ?`, a: `Rarement tous. On choisit selon votre métier et votre cible : Facebook/WhatsApp pour la proximité, Instagram pour le visuel, TikTok pour la portée. Mieux vaut être excellent sur un ou deux réseaux.` },
      { q: `Combien coûte la gestion des réseaux sociaux ?`, a: `Le Community Management est sur devis, selon la fréquence et le nombre de réseaux. On adapte à votre budget, avec des formules pour TPE. Un audit gratuit permet de cadrer le besoin.` },
      { q: `La publicité Facebook/Instagram, ça marche vraiment localement ?`, a: `Oui, c'est même l'un des leviers les plus rentables ${c.h1suffix} : on cible précisément votre zone et votre clientèle avec un petit budget quotidien.` }
    ]
  },

  /* ─────────── E-COMMERCE ─────────── */
  {
    slug: 'creer-boutique-en-ligne',
    label: 'E-commerce',
    title: c => `Créer une boutique en ligne ${c.h1suffix} : le guide complet`,
    desc: c => `Vendre en ligne quand on est une entreprise ${c.gentile.replace(/s$/, '')} : coûts, étapes, paiement, livraison locale et référencement d'une boutique e-commerce ${c.h1suffix}.`,
    keywords: c => `boutique en ligne ${c.name}, site e-commerce ${c.name}, vendre en ligne ${c.name}, création boutique internet ${c.name}`,
    body: (c) => `
      <p class="lead">Vendre en ligne n'est plus réservé aux grandes enseignes. Une boutique e-commerce bien conçue ouvre votre commerce ${c.h1suffix} 24h/24, au-delà de votre rue et de vos horaires. Voici comment s'y prendre.</p>

      <h2>Pourquoi vendre en ligne ${c.h1suffix} ?</h2>
      <p>Parce que vos clients cherchent — et achètent — de plus en plus sur leur téléphone. Une boutique en ligne vous permet de capter cette demande, de désengorger le comptoir, et de toucher au-delà de votre quartier, sans ouvrir un second point de vente.</p>

      <h2>Combien coûte une boutique e-commerce ?</h2>
      <p>Plus qu'un site vitrine (qui démarre à 250€), car il faut gérer le catalogue, le panier, le paiement sécurisé et les livraisons. Le budget dépend du nombre de produits et des fonctionnalités. On établit un <strong>devis transparent</strong> après avoir compris votre projet.</p>

      <h2>Les points clés d'une boutique qui vend</h2>
      <ul>
        <li><strong>Un paiement simple et rassurant</strong> (carte, et moyens locaux si pertinent).</li>
        <li><strong>Une livraison claire</strong> : retrait en boutique, livraison locale, expédition — adaptée à votre réalité ${c.h1suffix}.</li>
        <li><strong>Des fiches produits soignées</strong> : photos, descriptions, avis.</li>
        <li><strong>Un site rapide sur mobile</strong> — c'est là que se font la majorité des achats.</li>
      </ul>

      <h2>Une boutique invisible ne vend pas</h2>
      <p>${localAngle(c)} Créer la boutique n'est que la moitié du travail : encore faut-il qu'on la trouve. Référencement local, réseaux sociaux et, si besoin, publicité ciblée : on branche votre boutique sur ses sources de trafic dès le départ.</p>

      <div class="callout"><p>De la boutique simple au catalogue complet avec automatisation des commandes, on construit l'e-commerce qui correspond à votre activité ${c.h1suffix}.</p></div>`,
    faq: (c) => [
      { q: `Combien coûte un site e-commerce ${c.h1suffix} ?`, a: `C'est sur devis, car cela dépend du nombre de produits, du paiement et de la livraison. On chiffre clairement après un premier échange, sans engagement.` },
      { q: `Puis-je proposer le retrait en boutique et la livraison locale ?`, a: `Oui, c'est même recommandé ${c.h1suffix} : on paramètre le retrait sur place et/ou la livraison locale, en plus de l'expédition classique.` },
      { q: `Comment les clients vont-ils trouver ma boutique ?`, a: `Par le référencement (Google), les réseaux sociaux et, si utile, la publicité. On pense la visibilité dès la conception, pas après.` }
    ]
  },

  /* ─────────── AUTOMATISATION ─────────── */
  {
    slug: 'automatisation-entreprise',
    label: 'Automatisation',
    title: c => `Automatiser son entreprise ${c.h1suffix} : gagner du temps`,
    desc: c => `Devis, relances, prises de rendez-vous, réseaux : ce que vous pouvez automatiser dans votre entreprise ${c.h1suffix} pour gagner des heures chaque semaine. Le guide.`,
    keywords: c => `automatisation entreprise ${c.name}, gagner du temps ${c.name}, automatiser devis relances ${c.name}, logiciel sur-mesure ${c.name}`,
    body: (c) => `
      <p class="lead">Le vrai luxe d'un chef d'entreprise ${c.h1suffix}, c'est le temps. Or une grande partie de vos journées part dans des tâches répétitives — devis, relances, prises de RDV — qu'une machine peut faire à votre place. C'est le cœur de métier de Groupe Solution.</p>

      <h2>Qu'est-ce qu'on peut automatiser ?</h2>
      <ul>
        <li><strong>Les devis</strong> : formulaire intelligent, envoi automatique, suivi.</li>
        <li><strong>Les relances</strong> : rappels automatiques aux clients qui n'ont pas répondu.</li>
        <li><strong>La prise de rendez-vous</strong> en ligne, sans échanges de mails sans fin.</li>
        <li><strong>Les réseaux sociaux</strong> : publications programmées à l'avance.</li>
        <li><strong>Le suivi client</strong> : chaque demande tracée, rien ne passe à la trappe.</li>
      </ul>

      <h2>Pourquoi ça change tout pour une TPE</h2>
      <p>Automatiser, ce n'est pas déshumaniser : c'est confier à la machine le répétitif pour vous rendre à l'essentiel — la relation client et la décision. Résultat : moins d'oublis, des réponses plus rapides, et des heures récupérées chaque semaine.</p>

      <h2>Un exemple concret ${c.h1suffix}</h2>
      <p>${localAngle(c)} Imaginez : un client remplit une demande sur votre site, reçoit instantanément un accusé, vous êtes notifié, une relance part automatiquement s'il ne donne pas suite, et son rendez-vous s'ajoute à votre agenda. Zéro saisie manuelle. C'est exactement ce type de système que l'on construit.</p>

      <h2>Par où commencer</h2>
      <p>On repère d'abord la tâche qui vous coûte le plus de temps, on l'automatise, on mesure. Puis on étend, étape par étape. Pas besoin de tout révolutionner d'un coup : le premier gain finance souvent le suivant.</p>

      <div class="callout"><p>La devise de Groupe Solution : nous gagnons de l'argent uniquement si vous en gagnez. On commence par identifier, en 15 minutes, ce qui peut être automatisé chez vous.</p></div>`,
    faq: (c) => [
      { q: `L'automatisation, c'est réservé aux grandes entreprises ?`, a: `Non, au contraire : c'est une TPE ${c.h1suffix} qui en profite le plus, car chaque heure gagnée compte. On construit des systèmes à votre taille, sans usine à gaz.` },
      { q: `Que peut-on automatiser en premier ?`, a: `En général les devis, les relances et la prise de rendez-vous : rapide à mettre en place et gain de temps immédiat. On part de ce qui vous pèse le plus.` },
      { q: `Est-ce que ça remplace mes équipes ?`, a: `Non. L'automatisation prend le répétitif ; vos équipes gardent l'essentiel — la relation et la décision. Elles travaillent mieux, pas moins.` }
    ]
  }
];
