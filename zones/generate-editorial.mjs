/* ═══════════════════════════════════════════════════════════
   ÉDITORIAL — Dossiers de la semaine, Questions des dirigeants, Le pouls.
   Sources : /content/dossiers/AAAA-MM-JJ-slug.json · /content/questions/slug.json
   (formats décrits dans content/actus/PROTOCOLE.md ; contrôle : node scripts/verify-content.mjs).

   Produit : /lab/dossiers/{slug}.html + index · /lab/questions/{slug}.html + index · /lab/pouls/
   Lancer :  node zones/generate-editorial.mjs
   ═══════════════════════════════════════════════════════════ */
import { writeFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { HOLDING } from './zones.mjs';
import { esc } from './lib-local.mjs';
import { head, foot, fdate, slugify, loadActus } from './generate-actus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const load = dir => {
  const d = join(ROOT, 'content', dir);
  if (!existsSync(d)) return [];
  return readdirSync(d).filter(f => f.endsWith('.json')).map(f => {
    const x = JSON.parse(readFileSync(join(d, f), 'utf8'));
    if (!x.slug || !x.date || !x.sources?.length || !x.sources.every(s => /^https:\/\//.test(s.url))) throw new Error(`${dir}/${f} : slug, date et sources https obligatoires`);
    return x;
  }).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
};
export const loadDossiers = () => load('dossiers');
export const loadQuestions = () => load('questions');

const org = { '@type': 'Organization', name: 'Groupe Solution', url: HOLDING + '/', logo: { '@type': 'ImageObject', url: HOLDING + '/Logo.svg' } };
const author = { '@type': 'Organization', name: 'La rédaction de Groupe Solution', url: HOLDING + '/' };
const crumbs = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });
const words = x => JSON.stringify(x).split(/\s+/).length;
const readMin = x => Math.max(2, Math.round(words(x) / 220));

const sectionsHTML = secs => secs.map(s => `
      <h2 id="${slugify(s.h2)}">${esc(s.h2)}</h2>
${(s.paragraphes || []).map(p => `      <p>${esc(p)}</p>`).join('\n')}
${s.liste?.length ? `      <ul>${s.liste.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}`).join('\n');
const sourcesHTML = src => `<div class="edSrc"><h2>Sources</h2><ol>${src.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener nofollow">${esc(s.nom)}</a></li>`).join('')}</ol><p>Chaque date et chiffre de cette page a été vérifié auprès d’au moins deux sources indépendantes. Une erreur ? <a href="mailto:contact@groupsolution.fr">Signalez-la</a> et nous la corrigeons.</p></div>`;
const liensHTML = l => l?.length ? `<div class="edLinks">${l.map(x => `<a href="${esc(x.url)}">${esc(x.label)} →</a>`).join('')}</div>` : '';
const ctaHTML = (txt) => `<aside class="edCta"><b>${esc(txt)}</b><span>10 minutes au téléphone, sans engagement : on regarde ce que ça change pour votre entreprise.</span><div><a class="btn" href="tel:+33782298559">07 82 29 85 59</a><a class="alt" href="../../echanger.html#rendez-vous">Réserver 10 min en visio</a></div></aside>`;
const related = (list, cur, base, label) => {
  const others = list.filter(x => x.slug !== cur.slug).slice(0, 4);
  return others.length ? `<div class="edRel"><h2>${label}</h2>${others.map(x => `<a href="${base}${x.slug}.html">${esc(x.titre || x.question)}<span>${esc(fdate(x.date))}</span></a>`).join('')}</div>` : '';
};

/* ── Dossier ── */
function dossierPage(d, all, questions) {
  const url = `${HOLDING}/lab/dossiers/${d.slug}.html`;
  const title = `${d.titre} | Groupe Solution`;
  const toc = d.sections.map(s => `<a href="#${slugify(s.h2)}">${esc(s.h2)}</a>`).join('');
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: d.titre, description: d.description, datePublished: d.date, dateModified: d.maj || d.date, url, inLanguage: 'fr-FR', author, publisher: org,
      image: HOLDING + '/assets/visuel-ressources.jpg', articleSection: d.cat, wordCount: words(d.sections), citation: d.sources.map(s => s.url) },
    ...(d.faq?.length ? [{ '@type': 'FAQPage', mainEntity: d.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
    crumbs([['Groupe Solution', HOLDING + '/'], ['Dossiers', `${HOLDING}/lab/dossiers/`], [d.titre, url]])] };
  return head({ title, desc: d.description, url, jsonld }) + `
  <div class="wrap crumbs"><a href="../../index.html">Groupe Solution</a> › <a href="./">Dossiers</a> › <span>${esc(d.cat)}</span></div>
  <section class="hero actHero" style="padding-bottom:26px"><div class="wrap day">
    <div class="kicker reveal">Dossier · ${esc(d.cat)} · ${readMin(d.sections)} min de lecture</div>
    <h1 class="reveal" style="font-size:clamp(30px,4.2vw,48px);margin-top:16px">${esc(d.titre)}</h1>
    <p class="lead reveal">${esc(d.chapo)}</p>
    <p class="edMeta">La rédaction de Groupe Solution · publié le ${esc(fdate(d.date))}${d.maj ? ` · mis à jour le ${esc(fdate(d.maj))}` : ''}</p>
  </div></section>
  <section class="sec" style="padding-top:6px"><div class="wrap day edBody">
    <nav class="edToc" aria-label="Sommaire"><b>Sommaire</b>${toc}</nav>
    ${d.aRetenir?.length ? `<div class="edKey"><b>À retenir</b><ul>${d.aRetenir.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
${sectionsHTML(d.sections.slice(0, Math.ceil(d.sections.length / 2)))}
    ${ctaHTML('Ce sujet vous concerne ?')}
${sectionsHTML(d.sections.slice(Math.ceil(d.sections.length / 2)))}
    ${d.faq?.length ? `<h2 id="faq">Questions fréquentes</h2><div class="faq">${d.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>` : ''}
    <div class="poll" data-poll="dossier-${d.slug}" hidden></div>
    ${liensHTML(d.liens)}
    ${sourcesHTML(d.sources)}
    ${related(all, d, '', 'Autres dossiers')}
    ${related(questions, {}, '../questions/', 'Questions de dirigeants')}
  </div></section>` + foot('../../', 'dossier-' + d.slug);
}

/* ── Question ── */
function questionPage(q, all) {
  const url = `${HOLDING}/lab/questions/${q.slug}.html`;
  const title = `${q.question.replace(/\s*\?$/, ' ?')} | Groupe Solution`;
  const full = [q.reponseCourte, ...q.sections.flatMap(s => [s.h2, ...(s.paragraphes || []), ...(s.liste || [])])].join(' ');
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'QAPage', url, inLanguage: 'fr-FR', mainEntity: { '@type': 'Question', name: q.question, text: q.question, answerCount: 1, datePublished: q.date, author: org,
      acceptedAnswer: { '@type': 'Answer', text: full.slice(0, 4000), datePublished: q.date, url, author, upvoteCount: 0 } } },
    crumbs([['Groupe Solution', HOLDING + '/'], ['Questions', `${HOLDING}/lab/questions/`], [q.question, url]])] };
  return head({ title, desc: q.description, url, jsonld }) + `
  <div class="wrap crumbs"><a href="../../index.html">Groupe Solution</a> › <a href="./">Questions de dirigeants</a> › <span>${esc(q.cat)}</span></div>
  <section class="hero actHero" style="padding-bottom:26px"><div class="wrap day">
    <div class="kicker reveal">Question de dirigeant · ${esc(q.cat)}</div>
    <h1 class="reveal" style="font-size:clamp(28px,4vw,44px);margin-top:16px">${esc(q.question)}</h1>
    <div class="edShort reveal"><b>La réponse courte</b><p>${esc(q.reponseCourte)}</p></div>
    <p class="edMeta">La rédaction de Groupe Solution · ${esc(fdate(q.date))}${q.maj ? ` · mis à jour le ${esc(fdate(q.maj))}` : ''}</p>
  </div></section>
  <section class="sec" style="padding-top:6px"><div class="wrap day edBody">
${sectionsHTML(q.sections)}
    ${ctaHTML('Vous voulez la réponse pour votre cas précis ?')}
    <div class="poll" data-poll="question-${q.slug}" hidden></div>
    ${liensHTML(q.liens)}
    ${sourcesHTML(q.sources)}
    ${related(all, q, '', 'D’autres questions de dirigeants')}
  </div></section>` + foot('../../', 'question-' + q.slug);
}

/* ── Index ── */
function listIndex({ kind, list, title, h1, lead, desc, empty }) {
  const url = `${HOLDING}/lab/${kind}/`;
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: h1, url, description: desc, hasPart: list.map(x => ({ '@type': kind === 'questions' ? 'QAPage' : 'Article', name: x.titre || x.question, url: `${url}${x.slug}.html`, datePublished: x.date })) },
    crumbs([['Groupe Solution', HOLDING + '/'], ['Lab', HOLDING + '/lab/'], [h1, url]])] };
  return head({ title, desc, url, jsonld, ogType: 'website' }) + `
  <div class="wrap crumbs"><a href="../../index.html">Groupe Solution</a> › <a href="../">Lab</a> › <span>${esc(h1)}</span></div>
  <section class="hero actHero" style="padding-bottom:26px"><div class="wrap day" style="text-align:center">
    <div class="kicker reveal">${kind === 'questions' ? 'Questions · réponses sourcées' : 'Dossiers · chaque lundi'}</div>
    <h1 class="reveal" style="margin-top:16px">${esc(h1)}</h1>
    <p class="lead reveal" style="margin-left:auto;margin-right:auto">${esc(lead)}</p>
  </div></section>
  <section class="sec" style="padding-top:10px"><div class="wrap day">
    ${list.length ? `<div class="edList">${list.map(x => `<a class="reveal" href="${x.slug}.html"><span class="cat">${esc(x.cat)}</span><b>${esc(x.titre || x.question)}</b><p>${esc(x.chapo || x.reponseCourte)}</p><time datetime="${x.date}">${esc(fdate(x.date))}</time></a>`).join('')}</div>` : `<p class="dayIntro" style="text-align:center">${esc(empty)}</p>`}
    <div class="archive"><a href="../actus/">Les actus du jour<span>chaque matin</span></a><a href="../${kind === 'questions' ? 'dossiers' : 'questions'}/">${kind === 'questions' ? 'Les dossiers de fond' : 'Les questions de dirigeants'}<span>${kind === 'questions' ? 'chaque lundi' : 'deux fois par semaine'}</span></a><a href="../pouls/">Le pouls des dirigeants<span>votes en direct</span></a></div>
  </div></section>` + foot('../../', kind);
}

/* ── Le pouls des dirigeants ── */
function poulsPage(actus, dossiers, questions) {
  const url = `${HOLDING}/lab/pouls/`;
  const title = 'Le pouls des dirigeants : l’IA vue par les entreprises | Groupe Solution';
  const desc = 'Votez sur l’actualité IA et numérique : utile pour votre entreprise, à surveiller ou pas pour vous ? Les résultats des dirigeants en direct.';
  const items = [
    ...actus.flatMap(d => d.items.map(it => ({ id: `actu-${d.date}-${slugify(it.titre).slice(0, 80)}`, t: it.titre, u: `../actus/${d.date}.html#${slugify(it.titre)}`, c: it.cat, d: d.date }))).slice(0, 15),
    ...dossiers.slice(0, 4).map(x => ({ id: `dossier-${x.slug}`, t: x.titre, u: `../dossiers/${x.slug}.html`, c: 'Dossier', d: x.date })),
    ...questions.slice(0, 6).map(x => ({ id: `question-${x.slug}`, t: x.question, u: `../questions/${x.slug}.html`, c: 'Question', d: x.date }))
  ];
  const jsonld = { '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', name: 'Le pouls des dirigeants', url, description: desc }, crumbs([['Groupe Solution', HOLDING + '/'], ['Lab', HOLDING + '/lab/'], ['Le pouls', url]])] };
  return head({ title, desc, url, jsonld, ogType: 'website' }) + `
  <div class="wrap crumbs"><a href="../../index.html">Groupe Solution</a> › <a href="../">Lab</a> › <span>Le pouls des dirigeants</span></div>
  <section class="hero actHero" style="padding-bottom:26px"><div class="wrap day" style="text-align:center">
    <div class="kicker reveal">Votes en direct</div>
    <h1 class="reveal" style="margin-top:16px">Le pouls des dirigeants.</h1>
    <p class="lead reveal" style="margin-left:auto;margin-right:auto">L’IA et le numérique changent vite. Qu’est-ce qui est vraiment utile pour une entreprise, et qu’est-ce qui peut attendre ? Votez en un clic : les résultats de tous les lecteurs s’affichent aussitôt.</p>
  </div></section>
  <section class="sec" style="padding-top:6px"><div class="wrap day">
    <div id="poulsTop" class="edKey" hidden><b>Ce que les dirigeants jugent le plus utile</b><ol></ol></div>
    <div class="poulsList">
${items.map(x => `      <article class="news"><span class="cat">${esc(x.c)} · ${esc(fdate(x.d))}</span><h3><a href="${x.u}">${esc(x.t)}</a></h3><div class="poll" data-poll="${x.id}" data-title="${esc(x.t)}" data-url="${x.u}" hidden></div></article>`).join('\n')}
    </div>
    <p id="poulsOff" class="dayIntro" style="text-align:center">Les votes s’ouvrent très bientôt. En attendant, <a href="../actus/" style="text-decoration:underline">lisez les actus du jour</a>.</p>
  </div></section>
  <script>
  document.addEventListener('gs-poll-counts', function (e) {
    var off = document.getElementById('poulsOff'); if (off) off.hidden = true;
    var rows = [].slice.call(document.querySelectorAll('[data-poll]')).map(function (el) { var c = e.detail[el.getAttribute('data-poll')] || {}; var n = (c.utile || 0) + (c.surveiller || 0) + (c.pasmoi || 0); return { t: el.getAttribute('data-title'), u: el.getAttribute('data-url'), n: n, p: n ? Math.round((c.utile || 0) * 100 / n) : 0 }; })
      .filter(function (r) { return r.n >= 3; }).sort(function (a, b) { return b.p - a.p || b.n - a.n; }).slice(0, 5);
    if (!rows.length) return;
    var box = document.getElementById('poulsTop'), ol = box.querySelector('ol');
    rows.forEach(function (r) { var li = document.createElement('li'), a = document.createElement('a'); a.href = r.u; a.textContent = r.t; li.appendChild(a); li.appendChild(document.createTextNode(' — ' + r.p + ' % « utile » (' + r.n + ' votes)')); ol.appendChild(li); });
    box.hidden = false;
  });
  </script>` + foot('../../', 'pouls');
}


/* ── Confidentialité (ce que le site fait réellement des données) ── */
function confidentialitePage() {
  const url = `${HOLDING}/confidentialite.html`;
  const title = 'Confidentialité et données personnelles | Groupe Solution';
  const desc = 'Ce que groupsolution.fr fait de vos données : mesure d’audience avec consentement, formulaires, assistant IA, votes et parcours sur-mesure sans pistage.';
  const S = [
    ['Qui est responsable ?', ['Groupe Solution (Titouan Bedos), Montpellier. Pour toute question ou demande sur vos données : <a href="mailto:contact@groupsolution.fr">contact@groupsolution.fr</a> ou 07 82 29 85 59.']],
    ['Mesure d’audience', ['Google Analytics n’est chargé qu’après votre accord, donné dans le bandeau affiché à la première visite. Sans accord, aucun cookie de mesure n’est déposé. Votre choix est mémorisé dans votre navigateur, et vous pouvez le changer à tout moment.', '<button type="button" class="btn" id="consentReset">Modifier mon choix sur les cookies</button>']],
    ['Formulaires de contact', ['Les informations que vous saisissez (nom, téléphone ou e-mail, message, page d’origine) nous sont transmises par e-mail via le service Brevo, ou Formspree en secours, uniquement pour vous répondre. Elles ne sont ni revendues ni utilisées pour de la prospection sans votre accord.']],
    ['Assistant du site', ['Quand l’assistant IA est actif, vos questions et des extraits de pages du site sont envoyés à l’API Claude d’Anthropic pour rédiger la réponse. N’y saisissez pas d’informations sensibles. L’historique de la conversation est conservé uniquement dans votre navigateur. Si vous demandez à être rappelé, votre prénom, votre numéro et la conversation en cours (y compris l’éventuelle analyse de votre entreprise) nous sont transmis par e-mail, comme pour un formulaire, pour préparer l’appel sans vous faire tout répéter.']],
    ['Analyse de votre entreprise', ['Uniquement si vous le demandez en donnant le nom de votre entreprise, son SIREN ou l’adresse de votre site : nous interrogeons l’annuaire public officiel des entreprises (raison sociale, activité, date de création, tranche d’effectif, commune — sans les noms des dirigeants) et nous lisons la page d’accueil de votre site comme le ferait n’importe quel internaute. Ces éléments servent à personnaliser les réponses de l’assistant pendant votre visite ; nous ne les conservons pas.']],
    ['Plans d’innovation, esquisses et Laboratoire d’idées', ['Quand vous demandez un plan d’innovation ou une esquisse de site sur la page d’accueil, votre conversation est envoyée à notre fournisseur d’IA (Anthropic) pour les générer ; nous ne la conservons pas. Une version anonyme et générique du plan (secteur, région ou territoire, idée), rédigée par l’IA sans nom ni détail identifiant et passée à un filtre automatique qui écarte tout lien, numéro ou adresse e-mail, est préparée pendant une heure : elle n’est publiée dans le Laboratoire d’idées que si vous cliquez sur « Publier anonymement ». Sans clic, elle est supprimée automatiquement.']],
    ['Votes « Le pouls des dirigeants »', ['Seul votre choix est comptabilisé. Pour éviter les votes en double, votre adresse IP est transformée en une empreinte calculée avec une clé secrète (HMAC-SHA-256), qui ne permet pas de retrouver l’adresse ; elle est conservée 30 jours puis supprimée automatiquement. L’adresse IP elle-même n’est jamais enregistrée. Les compteurs sont stockés chez Upstash, via notre hébergeur Vercel.']],
    ['Parcours sur-mesure', ['Pour vous proposer la page de votre commune et la prochaine étape la plus utile, le site utilise deux indices : votre ville approximative, estimée à partir de votre connexion par notre hébergeur au moment de la visite et jamais conservée ; les pages consultées sur ce site, mémorisées uniquement dans votre navigateur (le temps de la visite, ou plus longtemps si vous avez accepté la mesure d’audience). Sans l’expérience sur-mesure par IA (ci-dessous), rien n’est transmis à des tiers ; dans tous les cas, aucun profil n’est constitué sur nos serveurs et aucune donnée n’est croisée avec d’autres sites.', '<button type="button" class="btn" id="persoOff">Désactiver les suggestions personnalisées</button> <span id="persoState" style="margin-left:10px;font-size:14px"></span>']],
    ['Expérience sur-mesure par IA (optionnelle)', ['Uniquement si vous l’activez (case du bandeau, invitation sur le site ou bouton ci-dessous), certaines pages adaptent leur titre, leur texte d’accroche et leurs recommandations à ce qui vous intéresse. Pour cela, nous envoyons à notre fournisseur d’IA, Anthropic, une liste de signaux anonymes : titres des pages consultées sur ce site, commune approximative, nombre de visites, moment de la journée, type d’appareil et site de provenance. Ni votre nom, ni votre e-mail, ni votre adresse IP ne sont transmis. Aucun humain chez Groupe Solution ne consulte ces données, nous ne les stockons pas et elles ne sont jamais revendues. Le résultat n’est conservé que dans votre navigateur (le temps de la visite, ou plus longtemps si vous avez accepté la mesure d’audience).', '<button type="button" class="btn" id="aiToggle">Activer l’expérience sur-mesure par IA</button> <span id="aiState" style="margin-left:10px;font-size:14px"></span>']],
    ['Hébergement', ['Le site est hébergé par Vercel Inc. Les journaux techniques de l’hébergeur (adresse IP, date, page demandée) servent à la sécurité et au bon fonctionnement du service.']],
    ['Vos droits', ['Vous pouvez demander l’accès, la rectification ou la suppression de vos données, ou vous opposer à leur traitement, en écrivant à <a href="mailto:contact@groupsolution.fr">contact@groupsolution.fr</a>. Vous pouvez aussi adresser une réclamation à la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>).']]
  ];
  const jsonld = { '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', name: 'Confidentialité', url, description: desc }, crumbs([['Groupe Solution', HOLDING + '/'], ['Confidentialité', url]])] };
  return head({ title, desc, url, jsonld, pre: '', ogType: 'website' }) + `
  <div class="wrap crumbs"><a href="index.html">Groupe Solution</a> › <span>Confidentialité</span></div>
  <section class="hero actHero" style="padding-bottom:20px"><div class="wrap day">
    <div class="kicker">Données personnelles</div>
    <h1 style="font-size:clamp(30px,4.2vw,46px);margin-top:16px">Ce que ce site fait de vos données.</h1>
    <p class="lead">En clair, sans jargon : ce qui est collecté, pourquoi, et comment le désactiver.</p>
  </div></section>
  <section class="sec" style="padding-top:6px"><div class="wrap day edBody">
${S.map(([h, ps]) => `      <h2>${h}</h2>\n${ps.map(p => `      <p>${p}</p>`).join('\n')}`).join('\n')}
  </div></section>
  <script>
  (function () {
    var b = document.getElementById('persoOff'), st = document.getElementById('persoState');
    function off() { try { return localStorage.getItem('gs-perso-off') || sessionStorage.getItem('gs-perso-off'); } catch (e) { return null; } }
    function paint() { st.textContent = off() ? 'Suggestions désactivées.' : 'Suggestions actives.'; b.textContent = off() ? 'Réactiver les suggestions personnalisées' : 'Désactiver les suggestions personnalisées'; }
    b.addEventListener('click', function () {
      if (off()) { try { localStorage.removeItem('gs-perso-off'); sessionStorage.removeItem('gs-perso-off'); } catch (e) {} }
      else { try { localStorage.setItem('gs-perso-off', '1'); sessionStorage.setItem('gs-perso-off', '1'); localStorage.removeItem('gs-perso-v1'); sessionStorage.removeItem('gs-perso-v1'); } catch (e) {} }
      paint();
    });
    paint();
    var a = document.getElementById('aiToggle'), as = document.getElementById('aiState');
    function aiOn() { try { return localStorage.getItem('gs-perso-ai') === 'granted'; } catch (e) { return false; } }
    function paintAI() { as.textContent = aiOn() ? 'Expérience sur-mesure activée.' : 'Expérience sur-mesure désactivée.'; a.textContent = aiOn() ? 'Désactiver l’expérience sur-mesure par IA' : 'Activer l’expérience sur-mesure par IA'; }
    a.addEventListener('click', function () { try { var v = aiOn() ? 'denied' : 'granted'; localStorage.setItem('gs-perso-ai', v); sessionStorage.setItem('gs-perso-ai', v); } catch (e) {} paintAI(); });
    paintAI();
    var cr = document.getElementById('consentReset');
    cr.addEventListener('click', function () { if (window.GSConsent) window.GSConsent.reset(); else { try { localStorage.removeItem('gs-consent-v1'); } catch (e) {} location.reload(); } });
  })();
  </script>` + foot('', 'confidentialite').replace(/<section class="sec alt">[\s\S]*?<\/section>/, '');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dossiers = loadDossiers(), questions = loadQuestions(), actus = loadActus();
  for (const k of ['dossiers', 'questions', 'pouls']) mkdirSync(join(ROOT, 'lab', k), { recursive: true });
  dossiers.forEach(d => writeFileSync(join(ROOT, 'lab', 'dossiers', d.slug + '.html'), dossierPage(d, dossiers, questions), 'utf8'));
  questions.forEach(q => writeFileSync(join(ROOT, 'lab', 'questions', q.slug + '.html'), questionPage(q, questions), 'utf8'));
  writeFileSync(join(ROOT, 'lab', 'dossiers', 'index.html'), listIndex({ kind: 'dossiers', list: dossiers, title: 'Dossiers IA, automatisation et réglementation pour les entreprises | Groupe Solution', h1: 'Les dossiers de la semaine', lead: 'Chaque lundi, un sujet de fond — IA, automatisation, réglementation — expliqué pour les dirigeants, avec ses sources.', desc: 'Chaque lundi, un dossier de fond sur l’IA, l’automatisation et la réglementation numérique, sourcé et expliqué pour les dirigeants de TPE et PME.', empty: 'Le premier dossier arrive lundi.' }), 'utf8');
  writeFileSync(join(ROOT, 'lab', 'questions', 'index.html'), listIndex({ kind: 'questions', list: questions, title: 'Questions de dirigeants sur l’IA et l’automatisation | Groupe Solution', h1: 'Les questions des dirigeants', lead: 'Les questions que se posent les entreprises sur l’IA, l’automatisation et le numérique — avec une réponse courte, une réponse complète et des sources.', desc: 'Les vraies questions des dirigeants sur l’IA, l’automatisation et le numérique : réponses courtes, explications complètes et sources vérifiées.', empty: 'Les premières réponses arrivent très bientôt.' }), 'utf8');
  writeFileSync(join(ROOT, 'lab', 'pouls', 'index.html'), poulsPage(actus, dossiers, questions), 'utf8');
  writeFileSync(join(ROOT, 'confidentialite.html'), confidentialitePage(), 'utf8');
  console.log(`✓ Éditorial : ${dossiers.length} dossier(s), ${questions.length} question(s), page Le pouls`);
}
