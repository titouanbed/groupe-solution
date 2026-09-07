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
  }
];
