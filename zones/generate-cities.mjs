/* ═══════════════════════════════════════════════════════════
   Générateur de pages VILLES pour les silos géographiques.
   Source de vérité : zones/zones.mjs (registre central).
   Produit /{zone}/site-internet-{slug}.html pour chaque ville des zones
   'online'. Objectif : maillage local SEO SANS contenu dupliqué → chaque
   ville a titre, hero, intros, section « à propos » et FAQ différenciés.

   Lancer :  node zones/generate-cities.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ZONES, HOLDING } from './zones.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const jstr = s => JSON.stringify(String(s));

function citiesNav(current, cities) {
  return cities.map(c => c.slug === current
    ? `<li><strong style="color:var(--rose-fonce)">${esc(c.name)}</strong></li>`
    : `<li><a href="site-internet-${c.slug}.html">${esc(c.name)}</a></li>`
  ).join('\n            ');
}

function faqHtml(faq) {
  return faq.map(f => `        <div class="faq-item reveal">
          <div class="faq-q">${esc(f.q)}</div>
          <div class="faq-a"><p>${esc(f.a)}</p></div>
        </div>`).join('\n');
}

function faqJsonLd(faq) {
  return faq.slice(0, 3).map(f => `    {
      "@type": "Question",
      "name": ${jstr(f.q)},
      "acceptedAnswer": { "@type": "Answer", "text": ${jstr(f.a)} }
    }`).join(',\n');
}

function areaServedJsonLd(city, zoneName) {
  const cities = city.areaServed.map(n => `      { "@type": "City", "name": ${jstr(n)} }`).join(',\n');
  return cities + `,\n      { "@type": "State", "name": ${jstr(zoneName)} }`;
}

function page(city, zone) {
  const ZONE = zone.slug, ZONE_NAME = zone.name, REGION_PAGE = zone.regionPage, cities = zone.cities;
  const fauna = zone.fauna || ['paille-en-queue.jpg', 'gecko-vert.jpg', 'baleine.jpg'];
  const pageFile = city.pageFile || `site-internet-${city.slug}.html`;
  const url = `${HOLDING}/${ZONE}/${pageFile}`;
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- SEO LOCAL — ${esc(city.name)} (${ZONE_NAME}, ${zone.code}) -->
  <title>${esc(city.title)}</title>
  <meta name="description" content="${esc(city.desc)}" />
  <meta name="keywords" content="${esc(city.keywords)}" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": ${jstr('GroupSolution - Agence Web ' + city.name)},
    "image": "${HOLDING}/Logo.svg",
    "description": ${jstr(city.desc)},
    "areaServed": [
${areaServedJsonLd(city, ZONE_NAME)}
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": ${jstr(city.name)},
      "addressRegion": ${jstr(ZONE_NAME)},
      "addressCountry": "FR"
    },
    "telephone": "+33782298559",
    "email": "contact@groupsolution.fr",
    "url": ${jstr(url)},
    "priceRange": "€€",
    "parentOrganization": { "@type": "Organization", "name": "Groupe Solution", "url": "${HOLDING}" }
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
${faqJsonLd(city.faq)}
    ]
  }
  </script>

  <link rel="canonical" href="${url}" />
  <link rel="icon" type="image/svg+xml" href="../Logo.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../assets/silo.css" />
  <style>
    .hero::before { background: linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.42) 40%, rgba(0,0,0,0.66) 100%); }
    .hero-content { position: relative; }
    .hero-content::before { content:''; position:absolute; inset:-6% -8%; z-index:-1; border-radius:40px; background:radial-gradient(60% 60% at 50% 46%, rgba(0,0,0,0.42), rgba(0,0,0,0) 72%); }
    .villes-band { background: var(--gris-clair); padding: 56px 0; }
    .villes-band h3 { text-align:center; font-size:1.4rem; font-weight:800; margin-bottom:8px; }
    .villes-band p { text-align:center; color:var(--gris); margin-bottom:26px; }
    .villes-grid { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; }
    .villes-grid a, .villes-grid span { padding:12px 20px; border-radius:999px; font-weight:700; font-size:0.95rem; border:1px solid var(--gris-clair); background:var(--blanc); box-shadow:var(--box-shadow); transition:var(--transition); }
    .villes-grid a { color:var(--gris-fonce); text-decoration:none; }
    .villes-grid a:hover { border-color:var(--rose); color:var(--rose-fonce); transform:translateY(-2px); }
    .villes-grid .current { background:var(--rose-clair); color:var(--rose-fonce); border-color:var(--rose); }
    .villes-grid .region { background:var(--noir-doux); color:var(--blanc); border-color:var(--noir-doux); }
  </style>
</head>

<body>
  <!-- ICONS SVG -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
    <symbol id="i-mail" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></symbol>
    <symbol id="i-arrow-right" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></symbol>
    <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></symbol>
    <symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/><path d="M19 16L19.7 18.3L22 19L19.7 19.7L19 22L18.3 19.7L16 19L18.3 18.3L19 16Z"/></symbol>
    <symbol id="i-map-pin" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></symbol>
    <symbol id="i-zap" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></symbol>
    <symbol id="i-lightning" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></symbol>
  </svg>

  <!-- NAVBAR -->
  <nav id="nav">
    <div class="container nav-content">
      <a href="${REGION_PAGE}" class="nav-logo"><img src="../Logo.svg" alt="GroupSolution" /></a>
      <ul class="nav-links">
        <li><a href="#audit">Audit Gratuit</a></li>
        <li><a href="#solutions">Nos Services</a></li>
        <li><a href="#villes">Nos Villes</a></li>
        <li><a href="blog/index.html">Guides</a></li>
        <li><a href="https://www.groupsolution.fr" class="nav-holding">Groupe Solution ↗</a></li>
      </ul>
      <div class="nav-actions">
        <button onclick="openModal()" class="btn btn-primary" style="padding: 8px 16px;">
          <svg class="icon" style="width: 16px; height: 16px;"><use href="#i-mail"/></svg>
          <span>Contact</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero" id="hero" style="background-image: url('../assets/${ZONE}/${city.hero}');">
    <div class="container hero-content">
      <div class="hero-badge">
        <svg class="icon" style="width: 14px; height: 14px;"><use href="#i-sparkles"/></svg>
        ${esc(city.badge)}
      </div>
      <h1>Agence Web & <span class="accent">Digitale</span><br>${esc(city.h1suffix)}</h1>
      <p>${esc(city.heroSub)}</p>
      <div class="hero-ctas">
        <button onclick="openModal()" class="btn btn-primary">
          <svg class="icon"><use href="#i-mail"/></svg>
          <span>Parler de mon projet</span>
        </button>
        <a href="#audit" class="btn btn-ghost">
          <svg class="icon"><use href="#i-zap"/></svg>
          <span>Audit Web Gratuit</span>
        </a>
      </div>
    </div>
  </section>

  <!-- AUDIT -->
  <section class="audit-section" id="audit">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-lightning"/></svg> Stratégie Digitale</span>
        <h2>On commence par un <span class="accent">diagnostic</span> gratuit</h2>
        <p>${esc(city.auditIntro)}</p>
      </div>
      <div class="audit-card reveal">
        <div class="audit-content">
          <h3><span class="accent">Audit 360°</span> de votre entreprise</h3>
          <p>On passe au crible votre site web, vos réseaux sociaux et votre référencement local à ${esc(city.name)}. On identifie où sont vos clients et comment les atteindre.</p>
          <div class="audit-features">
            <div class="audit-feature">Positionnement Google à ${esc(city.name)}</div>
            <div class="audit-feature">Audit de vos réseaux (Insta, Facebook, TikTok)</div>
            <div class="audit-feature">Stratégie d'acquisition locale</div>
            <div class="audit-feature">Devis transparent et sur-mesure</div>
          </div>
        </div>
        <div class="audit-cta">
          <button onclick="openModal()" class="btn btn-primary" style="width: 220px; justify-content: center;"><svg class="icon"><use href="#i-mail"/></svg> Réserver mon audit</button>
          <a href="#solutions" class="btn btn-secondary" style="width: 220px; justify-content: center;"><svg class="icon"><use href="#i-arrow-right"/></svg> Voir notre offre 360</a>
        </div>
      </div>
    </div>
  </section>

  <!-- SERVICES (faune locale) -->
  <section id="solutions">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-globe"/></svg> Nos Services</span>
        <h2>${city.servicesH2}</h2>
        <p>${esc(city.servicesIntro)}</p>
      </div>
      <div class="bulles-container">
        <div class="bulle reveal">
          <div class="bulle-image" style="background-image: url('../assets/${ZONE}/${fauna[0]}');"></div>
          <div class="bulle-content">
            <h4>Création de Sites Web</h4>
            <p>Site vitrine, e-commerce ou plateforme sur-mesure. Un design moderne, adapté aux mobiles et optimisé pour ${esc(city.name)}.</p>
            <div class="prix">Dès 250€</div>
            <div class="delai"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-clock"/></svg> Rapide & Clé en main</div>
            <button onclick="openModal()" class="btn btn-primary bulle-cta" style="justify-content: center;">En savoir plus</button>
          </div>
        </div>
        <div class="bulle reveal">
          <div class="bulle-image" style="background-image: url('../assets/${ZONE}/${fauna[1]}');"></div>
          <div class="bulle-content">
            <h4>Réseaux Sociaux & Ads</h4>
            <p>Community Management sur Facebook, Insta & TikTok. Contenus et publicité (Social Ads) ciblés sur ${esc(city.name)} et ses environs.</p>
            <div class="prix">Sur devis</div>
            <div class="delai"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-clock"/></svg> Acquisition continue</div>
            <button onclick="openModal()" class="btn btn-primary bulle-cta" style="justify-content: center;">Booster ma marque</button>
          </div>
        </div>
        <div class="bulle reveal">
          <div class="bulle-image" style="background-image: url('../assets/${ZONE}/${fauna[2]}');"></div>
          <div class="bulle-content">
            <h4>SEO & Automatisation</h4>
            <p>Dominez Google à ${esc(city.name)} avec le référencement local. Automatisation des relances clients et des prises de RDV par IA.</p>
            <div class="prix">Sur devis</div>
            <div class="delai"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-clock"/></svg> Gain de temps garanti</div>
            <button onclick="openModal()" class="btn btn-primary bulle-cta" style="justify-content: center;">Me positionner 1er</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- RÉALISATIONS (captures réelles) -->
  <section id="realisations" style="background: var(--gris-clair); padding: 80px 0;">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-sparkles"/></svg> Nos Références</span>
        <h2>Ils nous font <span class="accent">confiance</span></h2>
        <p>Du site vitrine épuré à la plateforme logicielle sur-mesure complexe. On code tout.</p>
      </div>
      <div class="rea-grid">
        <a href="https://twentythreeclean.com/" target="_blank" rel="noopener" class="rea-card reveal">
          <div class="rea-img" style="background-image: url('../rea1.jpg');"></div>
          <div class="rea-content"><h4>Twenty Three Clean</h4><p>Site vitrine moderne pour une entreprise de nettoyage professionnel.</p></div>
        </a>
        <a href="https://solutionsrecrutement.fr/" target="_blank" rel="noopener" class="rea-card reveal">
          <div class="rea-img" style="background-image: url('../rea2.jpg');"></div>
          <div class="rea-content"><h4>Solutions Recrutement</h4><p>Développement web avancé pour agence de recrutement.</p></div>
        </a>
        <a href="https://solutionalternance.fr/" target="_blank" rel="noopener" class="rea-card reveal">
          <div class="rea-img" style="background-image: url('../rea3.jpg');"></div>
          <div class="rea-content"><h4>Solution Alternance</h4><p>Plateforme d'automatisation avec algorithme de matching par IA.</p></div>
        </a>
      </div>
      <div style="text-align: center; margin-top: 40px;">
        <p style="color: var(--gris); margin-bottom: 16px;">Un projet en tête à ${esc(city.name)} ? Parlons-en directement.</p>
        <button onclick="openModal()" class="btn btn-primary" style="background: var(--noir-doux); color: var(--blanc);">Discuter de mon projet</button>
      </div>
    </div>
  </section>

  <!-- PROCESSUS -->
  <section id="processus">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-clock"/></svg> Processus</span>
        <h2>Déploiement <span class="accent">efficace</span></h2>
        <p>Un accompagnement de proximité pour les entreprises ${esc(city.gentile)}. Vous restez sur votre métier, on gère la technique et votre image.</p>
      </div>
      <div class="process-steps">
        <div class="process-step reveal"><div class="step-num">1</div><h4>Diagnostic (15 min)</h4><p>On évalue vos besoins (nouveau site, refonte, réseaux, pub locale).</p></div>
        <div class="process-step reveal"><div class="step-num">2</div><h4>Stratégie & Devis</h4><p>Un plan d'action sur-mesure, adapté à votre budget.</p></div>
        <div class="process-step reveal"><div class="step-num">3</div><h4>Création</h4><p>Design du site, configuration du SEO, plannings de publication.</p></div>
        <div class="process-step reveal"><div class="step-num">4</div><h4>Lancement & Suivi</h4><p>Mise en ligne, gestion quotidienne et reporting de vos performances.</p></div>
      </div>
    </div>
  </section>

  <!-- FAQ locale -->
  <section id="faq" style="background: var(--gris-clair);">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">FAQ · ${esc(city.name)}</span>
        <h2>Questions <span class="accent">fréquentes</span></h2>
      </div>
      <div class="faq">
${faqHtml(city.faq)}
      </div>
      <div style="text-align: center; margin-top: 40px;" class="reveal">
        <button onclick="openModal()" class="btn btn-primary" style="background: var(--noir-doux); color: var(--blanc);">J'ai une autre question</button>
      </div>
    </div>
  </section>

  <!-- NOS VILLES (maillage interne) -->
  <section class="villes-band" id="villes">
    <div class="container">
      <h3>GroupSolution partout à ${ZONE_NAME}</h3>
      <p>On accompagne les entreprises sur toute l'île. Trouvez votre agence de proximité :</p>
      <div class="villes-grid">
        <a class="region" href="${REGION_PAGE}">🌴 Toute ${ZONE_NAME}</a>
        ${cities.map(c => c.slug === city.slug
          ? `<span class="current">${esc(c.name)}</span>`
          : `<a href="site-internet-${c.slug}.html">${esc(c.name)}</a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- À PROPOS -->
  <section id="a-propos" style="background: var(--blanc); padding: 80px 0; border-bottom: 1px solid var(--gris-clair);">
    <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; align-items: center; max-width: 900px; margin: 0 auto;">
      <div style="text-align: center;" class="reveal">
        <img src="../photo-president.jpg" alt="Titouan Bedos - Fondateur GroupSolution" style="width: 250px; height: 250px; object-fit: cover; border-radius: 50%; border: 4px solid var(--rose); box-shadow: var(--box-shadow-lg);" onerror="this.src='https://via.placeholder.com/250x250/FFD1DC/EC4899?text=Photo+Titouan'">
      </div>
      <div class="reveal">
        <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 16px; color: var(--gris-fonce);">L'ingénierie digitale, <span class="accent" style="background: linear-gradient(135deg, var(--rose), var(--rose-fonce)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">sans blabla.</span></h2>
        <p style="color: var(--gris); margin-bottom: 16px; font-size: 1.05rem;">Je suis Titouan Bedos, fondateur de GroupSolution. ${esc(city.aboutP)}</p>
        <p style="color: var(--gris); margin-bottom: 16px; font-size: 1.05rem;"><strong>Zones desservies autour de ${esc(city.name)} :</strong> ${esc(city.zones)}.</p>
        <div style="display: flex; gap: 16px;">
          <a href="https://www.groupsolution.fr/a-propos.html" style="font-weight: 600; color: var(--rose-fonce); text-decoration: none; display: flex; align-items: center; gap: 6px;">
            <svg style="width:18px;height:18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            En savoir plus sur le groupe
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- MODALE -->
  <div class="modal-overlay" id="contactModal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal()" aria-label="Fermer"><svg class="icon"><use href="#i-x"/></svg></button>
      <div class="modal-header">
        <h3>Prêt à dominer le web <br><span class="accent">${esc(city.h1suffix)} ?</span></h3>
        <p>Décrivez votre besoin. Je vous recontacte sous 24h.</p>
      </div>
      <form action="https://formspree.io/f/mzebrvjg" method="POST" id="contactForm">
        <div class="form-group"><label>Votre nom</label><input type="text" name="nom" placeholder="ex: Jean Dupont" required /></div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div class="form-group"><label>Téléphone</label><input type="tel" name="telephone" placeholder="06..." required /></div>
          <div class="form-group"><label>Email</label><input type="email" name="email" placeholder="contact@..." required /></div>
        </div>
        <div class="form-group"><label>Votre entreprise ou secteur</label><input type="text" name="entreprise" placeholder="ex: Commerce à ${esc(city.name)}" /></div>
        <div class="form-group"><label>Votre projet</label><textarea name="message" placeholder="Je voudrais un site web pour..." required></textarea></div>
        <input type="hidden" name="_zone" value="${esc(city.name)} (${ZONE_NAME}, ${zone.code})" />
        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;"><svg class="icon"><use href="#i-arrow-right"/></svg> Envoyer ma demande</button>
      </form>
    </div>
  </div>

  <!-- BANDE HOLDING -->
  <section class="groupe-band" id="groupe">
    <div class="container">
      <div class="groupe-inner reveal">
        <span class="groupe-kicker"><svg class="icon" style="width:14px;height:14px;"><use href="#i-sparkles"/></svg> Une marque de Groupe Solution</span>
        <h2>${esc(city.name)} fait partie de <span class="accent">Groupe Solution</span></h2>
        <p>Éditeur de logiciels &amp; d'automatisations sur-mesure. Au-delà du digital local, le groupe conçoit des systèmes qui absorbent vos tâches répétitives — partout en France.</p>
        <div class="groupe-ctas">
          <a href="https://www.groupsolution.fr/echanger.html" class="btn btn-primary"><svg class="icon"><use href="#i-mail"/></svg> <span>Prendre rendez-vous</span></a>
          <a href="https://www.groupsolution.fr" class="btn btn-secondary"><svg class="icon"><use href="#i-arrow-right"/></svg> <span>Découvrir Groupe Solution</span></a>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="../Logo.svg" alt="GroupSolution Agence Digitale" />
          <p class="footer-desc">Agence web à ${esc(city.name)} (${ZONE_NAME}, ${zone.code}). Création de sites, SEO, réseaux sociaux et automatisation.</p>
        </div>
        <div class="footer-links">
          <h4>Nos villes à ${ZONE_NAME}</h4>
          <ul>
            <li><a href="${REGION_PAGE}">Toute ${ZONE_NAME}</a></li>
            ${citiesNav(city.slug, cities)}
          </ul>
        </div>
        <div class="footer-links">
          <h4>Groupe Solution</h4>
          <ul>
            <li><a href="https://www.groupsolution.fr">Le site du groupe ↗</a></li>
            <li><a href="https://www.groupsolution.fr/echanger.html">Prendre rendez-vous</a></li>
            <li><a href="https://www.groupsolution.fr/solutions.html">Nos solutions</a></li>
            <li><a href="https://www.groupsolution.fr/partenariats.html">Partenariats</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Contact Direct</h4>
          <p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-phone"/></svg><a href="tel:+33782298559">07 82 29 85 59</a></p>
          <p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-mail"/></svg><a href="mailto:contact@groupsolution.fr">contact@groupsolution.fr</a></p>
          <p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-map-pin"/></svg>${esc(city.name)}, ${ZONE_NAME}</p>
        </div>
      </div>
      <div class="footer-bottom">© 2026 GroupSolution SAS. Tous droits réservés.${zone.photoCredits ? `<br><span style="font-size:11px;opacity:.65">${esc(zone.photoCredits)}</span>` : ''}</div>
    </div>
  </footer>

  <script>
    const modal = document.getElementById('contactModal');
    const body = document.body;
    function openModal() { modal.classList.add('open'); body.classList.add('modal-open'); }
    function closeModal() { modal.classList.remove('open'); body.classList.remove('modal-open'); }
    modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });

    document.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    const hero = document.querySelector('.hero');
    const photos = ['../assets/${ZONE}/hero-1.jpg', '../assets/${ZONE}/hero-2.jpg', '../assets/${ZONE}/hero-3.jpg'];
    let idx = photos.indexOf('../assets/${ZONE}/${city.hero}'); if (idx < 0) idx = 0;
    photos.forEach(p => { const im = new Image(); im.src = p; });
    setInterval(function () { idx = (idx + 1) % photos.length; hero.style.backgroundImage = "url('" + photos[idx] + "')"; }, 5000);

    window.addEventListener('scroll', () => { document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50); });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function (e) {
        const t = document.querySelector(this.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });

    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.innerHTML; btn.innerHTML = 'Envoi en cours...'; btn.style.opacity = '0.7';
        fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
          .then(r => { if (r.ok) { alert('Merci ! Votre demande a bien été envoyée.'); form.reset(); closeModal(); } else { alert('Une erreur est survenue. Réessayez ou appelez-nous.'); } })
          .catch(() => alert('Connexion impossible. Réessayez dans un instant.'))
          .finally(() => { btn.innerHTML = original; btn.style.opacity = '1'; });
      });
    }
  </script>

  <script src="/analytics.js" defer></script>
</body>
</html>
`;
}

let n = 0;
for (const zone of ZONES) {
  if (zone.status !== 'online') continue;
  const entries = [];
  if (zone.region) entries.push(zone.region);       // page régionale (si définie)
  if (zone.cities) entries.push(...zone.cities);     // pages villes
  for (const entry of entries) {
    if (!entry.faq) continue; // entrée sans contenu détaillé → pas générée
    const pageFile = entry.pageFile || `site-internet-${entry.slug}.html`;
    const out = join(ROOT, zone.slug, pageFile);
    writeFileSync(out, page(entry, zone), 'utf8');
    console.log('✓', `${zone.slug}/${pageFile}`);
    n++;
  }
}
console.log(`\n${n} pages générées.`);
