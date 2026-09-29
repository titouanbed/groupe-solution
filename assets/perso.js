/* ═══════════════════════════════════════════════════════════
   PARCOURS SUR-MESURE — le site s'adapte à chaque visiteur, sans pistage.

   Signaux (tous « first-party », rien n'est envoyé à un tiers ni stocké côté serveur) :
   • ville approximative : /api/geo (déduite de l'IP par Vercel, non conservée) → commune la plus proche ;
   • intérêt : les pages vues sur CE site (site internet, référencement, IA, automatisation), mémorisées
     dans le navigateur — sessionStorage par défaut, localStorage seulement si le visiteur a accepté
     la mesure d'audience (gs-consent-v1 = granted) ;
   • moment : heure de Paris (joignable maintenant / rappel), nombre de pages vues, visite de retour.

   Effets : une carte discrète (une seule à la fois, 3 max par visite) — commune du visiteur, prochaine
   étape la plus utile, invitation à appeler au bon moment, « reprendre où vous en étiez » —, et
   l'assistant qui connaît la commune du visiteur. Chaque carte a un « Pourquoi ? » et un bouton
   pour tout désactiver.
   ═══════════════════════════════════════════════════════════ */
(function () {
  if (window.GSPerso) return;
  var KEY = 'gs-perso-v1', OFF = 'gs-perso-off', CONSENT = 'gs-consent-v1', SESS = 'gs-perso-s';
  function st(kind) { try { var s = window[kind]; s.setItem('_t', '1'); s.removeItem('_t'); return s; } catch (e) { return null; } }
  var LS = st('localStorage'), SS = st('sessionStorage');
  function get(s, k) { try { return s ? s.getItem(k) : null; } catch (e) { return null; } }
  function set(s, k, v) { try { if (s) s.setItem(k, v); } catch (e) {} }
  function del(s, k) { try { if (s) s.removeItem(k); } catch (e) {} }

  var api = window.GSPerso = { placeName: null, interest: null, disable: disable, enable: enable };
  if (get(LS, OFF) || get(SS, OFF)) { api.off = true; return; }

  var consent = get(LS, CONSENT);
  var persist = consent === 'granted';
  if (consent === 'denied') del(LS, KEY);           // refus → aucune mémoire au-delà de la visite
  var store = persist ? LS : SS;

  var P;
  try { P = JSON.parse(get(store, KEY) || get(SS, KEY) || 'null'); } catch (e) { P = null; }
  if (!P || typeof P !== 'object') P = { v: 0, pages: [], k: {}, geo: null, shown: 0, seen: {} };
  var newSession = !get(SS, SESS);
  if (newSession) { P.v = (P.v || 0) + 1; P.shown = 0; P.seen = {}; P.sp = 0; set(SS, SESS, '1'); }
  function save() { var j = JSON.stringify(P); set(store, KEY, j); if (store !== SS) set(SS, KEY, j); }

  /* ── 1. Ce que la page dit de l'intérêt du visiteur ── */
  var path = location.pathname.replace(/index\.html$/, '');
  function classify(p) {
    if (/referencement|test-visibilite|vitrine-gbp|apparaitre-google/.test(p)) return 'seo';
    if (/agent-vocal|chatbot|agence-ia|lab\/questions\/(agent|chatgpt)|lab\/veille|lab\/actus|lab\/api/.test(p)) return 'ia';
    if (/automatisation|calculateur|logiciel|integration-api|processus|lab\/dossiers|relances|devis/.test(p)) return 'auto';
    if (/site-internet|creation-site|configurateur|agence-web|realisations/.test(p)) return 'site';
    return null;
  }
  var kind = classify(path);
  if (kind) P.k[kind] = (P.k[kind] || 0) + 1;
  var last = P.pages[P.pages.length - 1];
  if (!last || last.p !== path) P.pages.push({ p: path, t: (document.title || '').split(' | ')[0].slice(0, 90), k: kind });
  P.pages = P.pages.slice(-15);
  P.sp = (P.sp || 0) + 1;                          // pages vues pendant cette visite
  var interest = ['auto', 'ia', 'site', 'seo'].sort(function (a, b) { return (P.k[b] || 0) - (P.k[a] || 0); })[0];
  if (!P.k[interest]) interest = null;
  api.interest = interest;
  save();

  /* ── 2. Contenus proposés selon l'intérêt (pages existantes) ── */
  var RECO = {
    site: [['/outils/configurateur-site-internet.html', 'Configurez votre projet de site en 2 minutes', 'Pages, fonctionnalités, délais : repartez avec un cahier des charges clair.'],
      ['/services/creation-site-internet.html', 'Création de site internet : la méthode complète', 'Ce qui fait qu’un site génère des demandes, étape par étape.'],
      ['/outils/test-visibilite-google.html', 'Testez votre visibilité Google (1 min)', 'Un score et les 3 corrections prioritaires.']],
    seo: [['/outils/test-visibilite-google.html', 'Testez votre visibilité Google (1 min)', 'Un score et les 3 corrections prioritaires.'],
      ['/services/referencement-local.html', 'Référencement local : sortir dans votre ville', 'Fiche Google, avis, pages locales : ce qui compte vraiment.'],
      ['/montpellier/guides/apparaitre-google-maps-montpellier.html', 'Guide : apparaître sur Google Maps', 'Les réglages qui font la différence.']],
    ia: [['/services/agent-vocal-ia.html', 'Un agent vocal IA qui décroche pour vous', 'Ce qu’il sait faire, ses limites, et le cadre légal.'],
      ['/lab/questions/chatgpt-donnees-clients-rgpd.html', 'IA et données clients : ce qui est permis', 'La réponse courte, puis la réponse complète et sourcée.'],
      ['/services/agent-ia-chatbot.html', 'Un assistant IA branché sur vos documents', 'Répondre juste, 24 h/24, à partir de vos propres informations.']],
    auto: [['/outils/calculateur-automatisation.html', 'Combien vous coûtent vos tâches répétitives ?', 'Le calculateur gratuit, en 1 minute.'],
      ['/lab/questions/automatiser-entreprise-par-ou-commencer.html', 'Par où commencer pour automatiser ?', 'La méthode en 5 étapes, sans jargon.'],
      ['/services/automatisation-processus.html', 'Automatisation des processus métier', 'Les cas où ça rapporte vraiment, et comment on s’y prend.']]
  };
  function visited(u) { return P.pages.some(function (x) { return x.p === u; }) || path === u; }

  /* ── 3. Moment : joignable maintenant ? (heure de Paris, lun–ven 9 h–19 h) ── */
  function openNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: 'numeric', hourCycle: 'h23', weekday: 'short' }).formatToParts(new Date());
      var h = +parts.filter(function (x) { return x.type === 'hour'; })[0].value, d = parts.filter(function (x) { return x.type === 'weekday'; })[0].value;
      return !/Sat|Sun/.test(d) && h >= 9 && h < 19;
    } catch (e) { return true; }
  }

  /* ── 4. Carte ── */
  var css = document.createElement('style');
  css.textContent = '#gsP{position:fixed;left:16px;bottom:16px;z-index:880;width:min(360px,calc(100vw - 32px));background:#fff;color:#171613;border:1px solid #ECEAE3;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.18);padding:16px 18px 14px;font:15px/1.5 "Plus Jakarta Sans",system-ui,sans-serif;transform:translateY(20px);opacity:0;transition:transform .35s,opacity .35s}' +
    '#gsP.in{transform:none;opacity:1}#gsP .k{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#E61E4D}#gsP b{display:block;font-size:16.5px;line-height:1.35;margin:6px 26px 4px 0}#gsP p{margin:0;color:#565349;font-size:14px}' +
    '#gsP .go{display:inline-block;margin-top:12px;background:#171613;color:#fff;padding:9px 15px;border-radius:999px;font-weight:800;font-size:14px;text-decoration:none;border:0;cursor:pointer}#gsP .go2{margin-left:12px;font-weight:700;font-size:13.5px;color:#171613;text-decoration:underline;background:none;border:0;cursor:pointer}' +
    '#gsP .x{position:absolute;top:10px;right:10px;width:28px;height:28px;border:0;border-radius:50%;background:#F4F2EC;cursor:pointer;font-size:16px;line-height:1}#gsP .why{display:block;margin-top:10px;font-size:12px;color:#8C887E;background:none;border:0;padding:0;cursor:pointer;text-decoration:underline}' +
    '#gsP .whyT{display:none;margin-top:8px;font-size:12.5px;color:#565349;background:#F7F6F2;border-radius:12px;padding:10px 12px}#gsP .whyT.on{display:block}#gsP .whyT button{margin-top:6px;border:0;background:none;color:#E61E4D;font-weight:800;cursor:pointer;padding:0}' +
    '@media(max-width:900px){#gsP{bottom:84px;left:10px;width:calc(100vw - 92px);padding:14px 14px 12px}#gsP b{font-size:15.5px}}@media(prefers-reduced-motion:reduce){#gsP{transition:none}}';
  document.head.appendChild(css);

  function ga(e, p) { if (window.gtag) window.gtag('event', e, p || {}); }
  function show(c) {
    if (document.getElementById('gsP')) return;
    P.shown = (P.shown || 0) + 1; P.seen[c.id] = 1; save();
    var el = document.createElement('aside');
    el.id = 'gsP'; el.setAttribute('aria-label', 'Suggestion');
    el.innerHTML = '<button class="x" type="button" aria-label="Fermer">×</button><span class="k"></span><b></b><p></p>' +
      (c.href ? '<a class="go"></a>' : '<button class="go" type="button"></button>') + (c.alt ? '<button class="go2" type="button"></button>' : '') +
      '<button class="why" type="button">Pourquoi cette suggestion ?</button><div class="whyT">' + c.why +
      ' Rien n’est transmis à des tiers. <a href="/confidentialite.html" style="color:inherit">En savoir plus</a><br><button type="button" class="off">Désactiver les suggestions</button></div>';
    el.querySelector('.k').textContent = c.kicker; el.querySelector('b').textContent = c.title; el.querySelector('p').textContent = c.text;
    var go = el.querySelector('.go'); go.textContent = c.cta;
    if (c.href) go.href = c.href; else go.addEventListener('click', c.action);
    go.addEventListener('click', function () { ga('perso_click', { perso_card: c.id }); });
    if (c.alt) { var a2 = el.querySelector('.go2'); a2.textContent = c.alt[0]; a2.addEventListener('click', c.alt[1]); }
    el.querySelector('.x').addEventListener('click', function () { el.remove(); ga('perso_close', { perso_card: c.id }); });
    el.querySelector('.why').addEventListener('click', function () { el.querySelector('.whyT').classList.toggle('on'); });
    el.querySelector('.off').addEventListener('click', function () { disable(); el.remove(); });
    document.body.appendChild(el);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
    ga('perso_show', { perso_card: c.id });
  }

  var WHY_PAGES = 'D’après les pages consultées sur ce site (mémorisées uniquement dans votre navigateur).';
  var WHY_GEO = 'D’après votre ville approximative, estimée à partir de votre connexion et non conservée.';
  var onContact = /echanger|contact|recherche|mentions|confidentialite/.test(path);

  function pickCard() {
    if (onContact || (P.shown || 0) >= 3) return null;
    var cards = [];
    // a) Retour : reprendre où l'on en était (accueil, visite de retour)
    if (P.v > 1 && newSession && (path === '/' || path === '/index.html')) {
      var prev = P.pages.slice(0, -1).reverse().filter(function (x) { return x.k && x.p !== path; })[0];
      if (prev && !P.seen.back) cards.push({ id: 'back', kicker: 'Bon retour', title: 'Reprendre où vous en étiez ?', text: prev.t, cta: 'Reprendre →', href: prev.p, why: WHY_PAGES });
    }
    // b) Sa commune
    var g = P.geo;
    if (g && g.n && !P.seen.geo) {
      var target = interest === 'site' || interest === 'seo' ? g.site : g.auto;
      if (path !== g.site && path !== g.auto && path !== target)
        cards.push({ id: 'geo', kicker: '📍 ' + g.n, title: interest === 'site' || interest === 'seo' ? 'Votre site internet ' + (g.a || aN(g.n)) : 'Ce qu’on peut automatiser pour les entreprises ' + (g.a || aN(g.n)),
          text: 'Une page dédiée aux entreprises de votre commune : enjeux locaux, exemples concrets, contact direct.', cta: 'Voir la page ' + g.n + ' →', href: target, why: WHY_GEO });
    }
    // c) Le bon moment pour échanger (après quelques pages)
    if (P.sp >= 3 && !P.seen.call) {
      cards.push(openNow()
        ? { id: 'call', kicker: 'Vous avez vu ' + P.sp + ' pages', title: 'Et si on en parlait 10 minutes ?', text: 'Vous décrivez votre besoin, on vous dit franchement ce qui est faisable. Sans engagement.', cta: '📞 07 82 29 85 59', href: 'tel:+33782298559', alt: ['Être rappelé', function () { if (window.GSAssistant) window.GSAssistant.callback(); }], why: WHY_PAGES }
        : { id: 'call', kicker: 'Vous avez vu ' + P.sp + ' pages', title: 'Laissez votre numéro, on vous rappelle', text: 'Nous sommes en dehors des heures d’appel : on vous rappelle au moment qui vous arrange.', cta: 'Être rappelé', action: function () { if (window.GSAssistant) window.GSAssistant.callback(); else location.href = '/echanger.html#rendez-vous'; }, why: WHY_PAGES });
    }
    // d) Prochaine étape la plus utile selon l'intérêt
    if (interest && !P.seen['reco-' + path]) {
      var r = (RECO[interest] || []).filter(function (x) { return !visited(x[0]); })[0];
      if (r) cards.push({ id: 'reco-' + path, kicker: 'Pour aller plus loin', title: r[1], text: r[2], cta: 'Voir →', href: r[0], why: WHY_PAGES });
    }
    return cards[0] || null;
  }
  function aN(n) { return /^Le /.test(n) ? 'au ' + n.slice(3) : /^Les /.test(n) ? 'aux ' + n.slice(4) : 'à ' + n; }

  var armed = false;
  function arm() {
    if (armed) return; armed = true;
    var fired = false;
    function fire() {
      if (fired) return;
      var cb = document.getElementById('gsConsent');   // on attend que le bandeau cookies soit fermé
      if (cb && cb.getBoundingClientRect().height > 0 && getComputedStyle(cb).display !== 'none') { setTimeout(fire, 3000); return; }
      fired = true; var c = pickCard(); if (c) show(c);
    }
    setTimeout(fire, 12000);
    window.addEventListener('scroll', function () { if ((scrollY + innerHeight) / document.documentElement.scrollHeight > 0.55) fire(); }, { passive: true });
  }

  /* ── 5. Commune approximative (une fois par visite) ── */
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, ' ').trim(); }
  var DOM = { RE: 'reunion', YT: 'mayotte', GF: 'guyane', MQ: 'martinique', GP: 'guadeloupe', NC: 'nouvelle-caledonie', PF: 'polynesie-francaise' };
  var DOMN = { RE: ['La Réunion', 'à La Réunion'], YT: ['Mayotte', 'à Mayotte'], GF: ['Guyane', 'en Guyane'], MQ: ['Martinique', 'en Martinique'], GP: ['Guadeloupe', 'en Guadeloupe'], NC: ['Nouvelle-Calédonie', 'en Nouvelle-Calédonie'], PF: ['Polynésie française', 'en Polynésie française'] };
  function locate() {
    if (P.geo !== null && P.geo !== undefined && !newSession) { done(); return; }
    fetch('/api/geo').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (g) {
      if (DOM[g.country]) { var u = '/' + DOM[g.country] + '/site-internet-' + DOM[g.country] + '.html'; P.geo = { n: DOMN[g.country][0], a: DOMN[g.country][1], site: u, auto: u }; save(); return done(); }
      if (g.country !== 'FR') { P.geo = false; save(); return done(); }
      return fetch('/assets/perso-places.json').then(function (r) { return r.json(); }).then(function (list) {
        var c = norm(g.city), best = null, bd = 1e9;
        list.forEach(function (x) {
          if (c && norm(x.n) === c) { best = x; bd = 0; }
          if (bd > 0 && g.lat != null) { var dx = (x.lo - g.lng) * Math.cos(x.la * Math.PI / 180), dy = x.la - g.lat, d = Math.sqrt(dx * dx + dy * dy) * 111; if (d < bd) { bd = d; best = x; } }
        });
        P.geo = best && bd <= 25 ? { n: best.n, site: best.site, auto: best.auto } : false;
        save(); done();
      });
    }).catch(function () { P.geo = false; save(); done(); });
  }
  function done() {
    if (P.geo && P.geo.n) api.placeName = P.geo.n;
    arm();
  }

  function disable() { set(LS, OFF, '1'); set(SS, OFF, '1'); del(LS, KEY); del(SS, KEY); api.off = true; api.placeName = null; ga('perso_off'); }
  function enable() { del(LS, OFF); del(SS, OFF); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', locate); else locate();
})();
