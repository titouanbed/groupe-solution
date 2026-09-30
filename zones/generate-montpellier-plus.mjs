/* ═══════════════════════════════════════════════════════════
   Pages MÉTIERS (site internet + automatisation) — Montpellier & Hérault.
   Source : zones/montpellier-plus.mjs (METIERS)
   Produit : /montpellier/site-internet-{metier}-montpellier.html
   Prérequis : avoir lancé generate-montpellier.mjs (sprite d'icônes, communes.css).

   Lancer :  node zones/generate-montpellier-plus.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { COMMUNES } from './montpellier-communes.mjs';
import { METIERS, QUARTIERS } from './montpellier-plus.mjs';
import { REA_SECTION, esc } from './lib-local.mjs';
import { pickAvancees, VEILLE_OF } from './automatisations-avancees.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = 'montpellier';
const HUB_FILE = 'site-internet-montpellier.html';
const mFile = m => `site-internet-${m.slug}-montpellier.html`;
const cFile = c => c.file || `site-internet-${c.slug}.html`;
const SPRITE = readFileSync(join(ROOT, DIR, 'site-internet-lattes.html'), 'utf8').match(/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" style="display:none">[\s\S]*?<\/svg>/)[0];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const GENERIC = [
  { q: 'Travaillez-vous uniquement à Montpellier ?', a: `Non : nous sommes basés à Montpellier et intervenons dans ${COMMUNES.length} communes de l'Hérault et du Gard, de Nîmes à Béziers, et partout en France à distance.` },
  { q: 'Le site m’appartient-il ?', a: "Oui. Le site, les contenus et le nom de domaine sont à vous. Vous pouvez gérer vous-même le site ou nous confier le suivi, sans engagement de durée imposé." }
];

function page(m) {
  const url = `${HOLDING}/${DIR}/${mFile(m)}`;
  const faq = [...m.faq, ...GENERIC];
  const communes = m.communes.map(sl => COMMUNES.find(c => c.slug === sl)).filter(Boolean);
  const others = METIERS.filter(o => o.slug !== m.slug);
  const adv = pickAvancees(m.slug, [m.label, m.plural, m.hook, ...m.must].join(' '), 4);
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', '@id': url + '#service', name: m.h1, serviceType: `Création de site internet et automatisation pour ${m.label}`, description: m.desc, url,
        provider: { '@type': 'ProfessionalService', name: 'Groupe Solution', url: `${HOLDING}/${DIR}/${HUB_FILE}`, telephone: '+33782298559', email: 'contact@groupsolution.fr', image: `${HOLDING}/Logo.svg`, address: { '@type': 'PostalAddress', addressLocality: 'Montpellier', postalCode: '34000', addressRegion: 'Occitanie', addressCountry: 'FR' }, parentOrganization: { '@type': 'Organization', name: 'Groupe Solution', url: HOLDING + '/' } },
        areaServed: [{ '@type': 'City', name: 'Montpellier' }, ...communes.map(c => ({ '@type': 'City', name: c.name })), { '@type': 'AdministrativeArea', name: 'Hérault' }],
        audience: { '@type': 'BusinessAudience', audienceType: cap(m.plural) },
        offers: { '@type': 'Offer', description: 'Sur devis, gratuit et personnalisé' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Groupe Solution', item: HOLDING + '/' },
        { '@type': 'ListItem', position: 2, name: 'Site internet Montpellier', item: `${HOLDING}/${DIR}/${HUB_FILE}` },
        { '@type': 'ListItem', position: 3, name: cap(m.label), item: url }] },
      { '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    ]
  };
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(m.title)}</title>
  <meta name="description" content="${esc(m.desc)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="Groupe Solution" />
  <meta property="og:title" content="${esc(m.title)}" />
  <meta property="og:description" content="${esc(m.desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${HOLDING}/rea1.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
  </script>
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="montpellier.css">
  <link rel="stylesheet" href="communes.css">
  <style>
    .mt-sec{padding:80px 0}
    .mt-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;max-width:960px;margin:0 auto}
    .mt-item{display:flex;gap:14px;align-items:flex-start;background:var(--blanc);border:1px solid #f1f1f1;border-radius:16px;padding:18px 20px;box-shadow:var(--box-shadow);font-weight:600;line-height:1.5}
    .mt-item i{flex-shrink:0;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-weight:800;font-size:.85rem;background:#d1fae5;color:#047857}
    .mt-bad .mt-item i{background:#fce7f3;color:#be185d}
    .mt-cases{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
    .mt-base{max-width:960px;margin:34px auto 0;background:var(--blanc);border:1px dashed #e5e7eb;border-radius:18px;padding:22px 26px}.mt-base h3{font-size:1rem;font-weight:800;margin-bottom:10px}.mt-base ul{list-style:none;display:grid;gap:8px;color:var(--gris);font-size:.94rem}.mt-base b{color:var(--gris-fonce)}
    .mt-hook{max-width:760px;margin:0 auto 30px;text-align:center;color:var(--gris);font-size:1.08rem;line-height:1.75}
    .mt-chips{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:10px}
    .mt-chips a{padding:10px 18px;border-radius:999px;background:var(--blanc);border:1px solid #e5e7eb;font-weight:700;font-size:.92rem;color:var(--gris-fonce);text-decoration:none;transition:var(--transition)}
    .mt-chips a:hover{border-color:var(--rose-fonce);color:var(--rose-fonce)}
    .mt-chips a.dark{background:var(--noir-doux);color:#fff;border-color:var(--noir-doux)}
    @media(max-width:960px){.mt-cases{grid-template-columns:1fr 1fr}}
    @media(max-width:640px){.mt-grid,.mt-cases{grid-template-columns:1fr}}
  </style>
</head>
<body>
  ${SPRITE}

  <nav id="nav">
    <div class="container nav-content">
      <a href="${HUB_FILE}" class="nav-logo"><img src="../Logo.svg" alt="GroupSolution" /></a>
      <ul class="nav-links">
        <li><a href="#indispensable">L'essentiel</a></li>
        <li><a href="#automatisation">Automatisation</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="../outils/configurateur-site-internet.html">Configurateur</a></li>
        <li><a href="${HOLDING}/" class="nav-holding">Groupe Solution ↗</a></li>
      </ul>
      <div class="nav-actions">
        <button onclick="openModal()" class="btn btn-primary" style="padding: 8px 16px;"><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-mail"/></svg><span>Contact</span></button>
      </div>
    </div>
  </nav>

  <section class="hero gs-hero" id="hero">
    <div class="container hero-content">
      <div class="hero-badge"><svg class="icon" style="width: 14px; height: 14px;"><use href="#i-sparkles"/></svg> Pour les ${esc(m.plural)} · Montpellier &amp; Hérault</div>
      <h1>${esc(m.h1.replace(/ (à|autour de|dans l’Hérault) .*$/, ''))} <span class="accent">${esc((m.h1.match(/ (à|autour de) .*$/) || [' à Montpellier'])[0].trim())}</span></h1>
      <p>${esc(m.hook)}</p>
      <div class="hero-ctas">
        <button onclick="openModal('${esc(cap(m.label))}')" class="btn btn-primary"><svg class="icon"><use href="#i-mail"/></svg><span>Parler de mon projet</span></button>
        <a href="../outils/configurateur-site-internet.html" class="btn btn-ghost"><svg class="icon"><use href="#i-lightning"/></svg><span>Configurer mon projet</span></a>
      </div>
    </div>
  </section>

  <div class="gs-crumbs container" aria-label="Fil d'Ariane"><a href="${HOLDING}/">Groupe Solution</a> › <a href="${HUB_FILE}">Site internet Montpellier</a> › <span>${esc(cap(m.label))}</span></div>

  <section id="indispensable" class="mt-sec">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width:14px;height:14px;"><use href="#i-globe"/></svg> L'indispensable</span>
        <h2>Ce que doit contenir le site d'un <span class="accent">${esc(m.label)}</span></h2>
        <p>La check-list qu'on applique à chaque projet — utile même si vous ne travaillez pas avec nous.</p>
      </div>
      <div class="mt-grid">
${m.must.map(x => `        <div class="mt-item reveal"><i>✓</i><span>${esc(x)}</span></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="mt-sec mt-bad" style="background:var(--gris-clair)">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Erreurs fréquentes</span>
        <h2>Ce qui fait perdre des clients <span class="accent">sans qu'on le voie</span></h2>
        <p>Ce qu'on constate le plus souvent lors de nos audits gratuits chez les ${esc(m.plural)} de la région.</p>
      </div>
      <div class="mt-grid">
${m.mistakes.map(x => `        <div class="mt-item reveal"><i>✕</i><span>${esc(x)}</span></div>`).join('\n')}
      </div>
      <div style="text-align:center;margin-top:34px" class="reveal"><a href="../outils/test-visibilite-google.html" class="btn btn-primary">Tester ma visibilité Google (2 min)</a></div>
    </div>
  </section>

  <section id="automatisation" class="gs-auto">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width:14px;height:14px;"><use href="#i-sparkles"/></svg> Et derrière le site ?</span>
        <h2>Ce qu'on automatise pour les <span class="accent">${esc(m.plural)}</span></h2>
        <p>Groupe Solution est d'abord un éditeur de logiciels : le site n'est que la partie visible. Voici ce que les technologies d'aujourd'hui permettent de construire pour les ${esc(m.plural)}.</p>
      </div>
      <div class="mt-cases">
${adv.map(a => `        <div class="gs-auto-card reveal"><span class="gs-tech">${esc(a.tech)}</span><h4>${esc(a.titre)}</h4><p>${esc(a.texte)}</p>${VEILLE_OF[a.id] ? `<p style="margin-top:10px"><a href="../lab/veille/${VEILLE_OF[a.id]}.html" style="color:var(--rose-fonce);font-weight:700;text-decoration:none">Notre analyse →</a></p>` : ''}</div>`).join('\n')}
      </div>
      <div class="mt-base reveal"><h3>Et bien sûr, les bases bien faites</h3><ul>${m.cases.map(([t, x]) => `<li><b>${esc(t)}</b> — ${esc(x)}</li>`).join('')}</ul></div>
      <p class="gs-auto-more"><a href="../outils/calculateur-automatisation.html">Calculer le temps que vous pourriez récupérer →</a></p>
    </div>
  </section>

${REA_SECTION()}

  <section id="faq">
    <div class="container">
      <div class="section-header"><span class="section-tag">FAQ</span><h2>Questions de <span class="accent">${esc(m.plural)}</span></h2></div>
      <div class="faq">
${faq.map(f => `        <div class="faq-item reveal"><div class="faq-q">${esc(f.q)}</div><div class="faq-a"><p>${esc(f.a)}</p></div></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="mt-sec" style="background:var(--gris-clair)">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><svg class="icon" style="width:14px;height:14px;"><use href="#i-map-pin"/></svg> Près de chez vous</span>
        <h2>Pour les ${esc(m.plural)} de <span class="accent">toute la région</span></h2>
        <p>Montpellier et ses quartiers, et ${COMMUNES.length} communes de l'Hérault et du Gard.</p>
      </div>
      <div class="mt-chips">
        <a class="dark" href="${HUB_FILE}">Montpellier</a>
${QUARTIERS.slice(0, 3).map(q => `        <a href="${cFile(q)}">${esc(q.name)}</a>`).join('\n')}
${communes.map(c => `        <a href="${cFile(c)}">${esc(c.name)}</a>`).join('\n')}
        <a href="${HUB_FILE}#communes">Toutes les communes →</a>
      </div>
      <div class="section-header" style="margin-top:56px"><h2 style="font-size:1.6rem">Les autres métiers</h2></div>
      <div class="mt-chips">
${others.map(o => `        <a href="${mFile(o)}">${esc(cap(o.label))}</a>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="groupe-band" id="groupe">
    <div class="container">
      <div class="groupe-inner reveal">
        <span class="groupe-kicker"><svg class="icon" style="width:14px;height:14px;"><use href="#i-sparkles"/></svg> Une marque de Groupe Solution</span>
        <h2>Un site, <span class="accent">et le système qui travaille derrière</span></h2>
        <p>Sites sur devis, référencement local et automatisations de pointe, par un éditeur de logiciels basé à Montpellier.</p>
        <div class="groupe-ctas">
          <a href="${HOLDING}/echanger.html#rendez-vous" class="btn btn-primary"><svg class="icon"><use href="#i-mail"/></svg><span>Réserver 10 min</span></a>
          <a href="../automatisation/" class="btn btn-secondary"><svg class="icon"><use href="#i-arrow-right"/></svg><span>Automatisation</span></a>
        </div>
      </div>
    </div>
  </section>

  <div class="modal-overlay" id="contactModal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal()" aria-label="Fermer"><svg class="icon"><use href="#i-x"/></svg></button>
      <div class="modal-header"><h3>Parlons de votre<br><span class="accent">${esc(m.label)}</span></h3><p>Décrivez votre besoin. Réponse sous 24 h ouvrées.</p></div>
      <form action="https://formspree.io/f/mzebrvjg" method="POST" id="contactForm">
        <input type="hidden" name="page" value="metier/${m.slug}" />
        <input type="hidden" name="sujet" id="fSujet" value="" />
        <div class="form-group"><label for="fNom">Votre nom</label><input id="fNom" type="text" name="nom" autocomplete="name" required /></div>
        <div class="gs-2col">
          <div class="form-group"><label for="fTel">Téléphone</label><input id="fTel" type="tel" name="telephone" autocomplete="tel" required /></div>
          <div class="form-group"><label for="fMail">Email</label><input id="fMail" type="email" name="email" autocomplete="email" required /></div>
        </div>
        <div class="form-group"><label for="fEnt">Votre commune</label><input id="fEnt" type="text" name="commune" placeholder="ex : Castelnau-le-Lez" /></div>
        <div class="form-group"><label for="fMsg">Votre projet</label><textarea id="fMsg" name="message" required></textarea></div>
        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 14px; font-size: 1.05rem;"><svg class="icon"><use href="#i-arrow-right"/></svg>Envoyer ma demande</button>
      </form>
    </div>
  </div>

  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo"><img src="../Logo.svg" alt="GroupSolution" /><p class="footer-desc">Sites internet et automatisation pour les ${esc(m.plural)} de Montpellier et de l'Hérault.</p></div>
        <div class="footer-links"><h4>Métiers</h4><ul>${others.slice(0, 6).map(o => `<li><a href="${mFile(o)}">${esc(cap(o.label))}</a></li>`).join('')}</ul></div>
        <div class="footer-links"><h4>Groupe Solution</h4><ul><li><a href="${HOLDING}/">Le site du groupe ↗</a></li><li><a href="../automatisation/">Automatisation</a></li><li><a href="../services/">Nos services</a></li><li><a href="${HUB_FILE}">Agence web Montpellier</a></li><li><a href="../outils/configurateur-site-internet.html">Configurateur de projet</a></li><li><a href="guides/">Guides pratiques</a></li><li><a href="../plan-du-site.html">Plan du site</a></li></ul></div>
        <div class="footer-contact"><h4>Contact direct</h4><p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-phone"/></svg><a href="tel:+33782298559">07 82 29 85 59</a></p><p><svg class="icon" style="width: 16px; height: 16px;"><use href="#i-mail"/></svg><a href="mailto:contact@groupsolution.fr">contact@groupsolution.fr</a></p></div>
      </div>
      <div class="footer-bottom">© 2026 GroupSolution SAS. Tous droits réservés.</div>
    </div>
  </footer>

  <div class="gs-sticky"><a class="s1" href="tel:+33782298559">📞 Appeler</a><button class="s2" type="button" onclick="openModal()">Mon projet</button></div>
  <script src="communes.js" defer></script>
  <script src="/analytics.js" defer></script>
</body>
</html>
`;
}

for (const m of METIERS) writeFileSync(join(ROOT, DIR, mFile(m)), page(m), 'utf8');
console.log(`✓ ${METIERS.length} pages métiers générées dans /${DIR}/`);
