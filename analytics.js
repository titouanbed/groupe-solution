/* ═══════════════════════════════════════════════════════════
   Groupe Solution — mesure d'audience + consentement (RGPD, au plus simple)
   ───────────────────────────────────────────────────────────
   ⚠️  UN SEUL ENDROIT À CONFIGURER : collez votre ID GA4 ci-dessous.
       Tant que l'ID reste "G-XXXXXXXXXX", RIEN ne se charge et aucun
       bandeau n'apparaît (le site se comporte comme avant).
   • Aucun cookie n'est déposé avant le clic « Accepter » (conforme CNIL).
   • content_group = "holding" ou "mayotte" → ventilation par zone dans GA4.
   • La géo (Pays › Région › Ville, dont les DOM-TOM) est native dans GA4.
   ═══════════════════════════════════════════════════════════ */
(function () {
  var GA_ID = 'G-G8RWE633G4'; // ID GA4 Groupe Solution (holding + zones géo)
  // Démo intégrée dans le chat de l'accueil : pas de bandeau ni d'assistant en double, liens ouverts dans la page principale.
  var EMBED = window.self !== window.top && /[?&]embed=1/.test(location.search);
  if (EMBED) document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href]'); if (a && !/^(#|javascript:)/.test(a.getAttribute('href'))) a.target = '_top'; }, true);

  /* Provenance de la visite (LinkedIn, Google…), gardée le temps de l'onglet : le chat s'adapte
     et Titouan sait d'où viennent ses contacts. Aucune donnée personnelle. */
  try {
    if (!sessionStorage.getItem('gsSrc')) {
      var qs = (location.search.match(/[?&](?:src|utm_source)=([a-z0-9_-]{2,30})/i) || [])[1], rf = document.referrer || '', src = '';
      if (qs) src = qs.toLowerCase();
      else if (/linkedin\.|lnkd\.in/i.test(rf) || /LinkedInApp/i.test(navigator.userAgent)) src = 'linkedin';
      else if (/google\./i.test(rf)) src = 'google';
      else if (/facebook\.|fb\.|instagram\./i.test(rf)) src = 'meta';
      else if (/bing\.|duckduckgo\.|qwant\.|ecosia\./i.test(rf)) src = 'recherche';
      else if (rf && rf.indexOf(location.host) < 0) src = 'lien';
      else if (!rf) src = 'direct';
      if (src) sessionStorage.setItem('gsSrc', src);
    }
  } catch (e) {}

  /* Trafic du site (tableau de bord de Titouan, onglet « Trafic ») : mesure maison, sans cookie et sans adresse IP.
     Tous les visiteurs : compteurs anonymes (page, provenance, appareil ; la ville est estimée par l'hébergeur).
     Parcours de la visite (pages dans l'ordre, actions) : seulement si le visiteur a accepté la mesure d'audience.
     Les visites de Titouan lui-même (connecté à son espace) ne sont pas comptées. */
  var gsT = function () {};
  (function () {
    try {
      if (EMBED || /^\/admin/.test(location.pathname) || localStorage.getItem('gs-admin-token') || navigator.webdriver) return;
      var nouv = !sessionStorage.getItem('gsT');
      if (nouv) sessionStorage.setItem('gsT', '1');
      var vid = function () { var v = sessionStorage.getItem('gsVid'); if (!v) { v = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).replace(/[^a-z0-9]/g, '').slice(0, 20); sessionStorage.setItem('gsVid', v); } return v; };
      var dejaE = {};
      gsT = function (e, x) {
        try {
          if (e !== 'pv' && e !== 'fin') { var k = e + location.pathname; if (dejaE[k]) return; dejaE[k] = 1; }   // une action comptée une fois par page
          var ok = localStorage.getItem('gs-consent-v1') === 'granted', rf = '';
          try { rf = document.referrer && new URL(document.referrer).host !== location.host ? new URL(document.referrer).host : ''; } catch (er) {}
          var body = JSON.stringify({ e: e, p: location.pathname, s: sessionStorage.getItem('gsSrc') || '', d: innerWidth < 760 ? 'mobile' : 'ordi', n: e === 'pv' && nouv ? 1 : 0, v: ok ? vid() : '', t: ok ? document.title.slice(0, 90) : '', r: ok ? rf : '', x: ok && x ? String(x).slice(0, 60) : '' });
          if (e === 'pv') nouv = false;
          var blob = new Blob([body], { type: 'application/json' });
          if (!(navigator.sendBeacon && navigator.sendBeacon('/api/t', blob))) fetch('/api/t', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true }).catch(function () {});
        } catch (er) {}
      };
      window.gsTrack = gsT;
      gsT('pv');
      document.addEventListener('click', function (ev) {
        var a = ev.target.closest && ev.target.closest('a[href]'); if (!a) return;
        var h = a.getAttribute('href') || '';
        if (/^tel:/i.test(h)) gsT('tel'); else if (/^mailto:/i.test(h)) gsT('mail'); else if (/wa\.me|whatsapp/i.test(h)) gsT('whatsapp');
      }, true);
      document.addEventListener('submit', function (ev) { var f = ev.target; gsT('form', f && (f.id || f.getAttribute('name')) || ''); }, true);
      // Durée de la visite (parcours détaillé seulement) : un signal quand la page est quittée.
      document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && localStorage.getItem('gs-consent-v1') === 'granted') gsT('fin'); });
    } catch (e) {}
  })();

  /* Lieu du visiteur, le même partout sur le site : choix du visiteur > fuseau horaire de l'appareil
     (Mayotte et La Réunion n'ont pas le même) > adresse IP estimée par l'hébergeur. */
  window.gsGeoFix = window.gsGeoFix || function (g) {
    var L = { MTP: { country: 'FR', city: 'Montpellier', lat: 43.61, lng: 3.88 }, FR: { country: 'FR', city: '' }, YT: { country: 'YT' }, RE: { country: 'RE' }, GP: { country: 'GP' }, MQ: { country: 'MQ' }, GF: { country: 'GF' }, NC: { country: 'NC' }, PF: { country: 'PF' } };
    try { var c = localStorage.getItem('gs-lieu'); if (c && L[c]) return L[c]; } catch (e) {}
    var TZ = { 'Indian/Mayotte': 'YT', 'Indian/Reunion': 'RE', 'America/Guadeloupe': 'GP', 'America/Martinique': 'MQ', 'America/Cayenne': 'GF', 'Pacific/Noumea': 'NC', 'Pacific/Tahiti': 'PF', 'Pacific/Marquesas': 'PF', 'Pacific/Gambier': 'PF' }, tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    if (TZ[tz] && (!g || g.country !== TZ[tz])) return { country: TZ[tz] };
    // Appareil réglé sur l'heure de Paris mais adresse IP d'outre-mer (fournisseur, VPN) : on ne devine pas.
    if (g && tz === 'Europe/Paris' && /^(YT|RE|GP|MQ|GF|NC|PF)$/.test(g.country)) return { country: 'FR', city: '' };
    return g;
  };
  window.gsGeoGet = function () { return window.gsGeo || (window.gsGeo = fetch('/api/geo').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }).then(window.gsGeoFix)); };

  /* Aucune demande perdue : tout envoi de formulaire vers Formspree passe d'abord par /api/lead
     (enregistré dans le tableau de bord, e-mail via Brevo) ; Formspree ne sert qu'en secours. */
  if (window.fetch && window.FormData && !window.__gsLeadWrap) {
    window.__gsLeadWrap = 1;
    var _f = window.fetch.bind(window);
    window.fetch = function (input, init) {
      try {
        var url = typeof input === 'string' ? input : (input && input.url) || '';
        if (/\/api\/assistant/.test(url)) gsT('chat'); else if (/\/api\/book/.test(url) && init && String(init.method || '').toUpperCase() === 'POST') gsT('rdv'); else if (/\/api\/lead/.test(url)) gsT('lead');
        if (/^https:\/\/formspree\.io\//.test(url) && init && !init.gsDirect && String(init.method || '').toUpperCase() === 'POST' && init.body instanceof FormData) {
          var o = {}; init.body.forEach(function (v, k) { if (typeof v === 'string') o[k] = v; });
          if (!o.page) o.page = location.pathname;
          try { var sd = sessionStorage.getItem('gsSid'); if (sd && !o.sid) o.sid = sd; var sr = sessionStorage.getItem('gsSrc'); if (sr && !o.provenance) o.provenance = sr; } catch (e) {}
          var backup = function () { return _f(input, init); };
          return _f('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(o) })
            .then(function (r) { return r.ok || r.status === 429 || r.status === 403 ? r : backup(); }).catch(backup);
        }
      } catch (e) {}
      return _f(input, init);
    };
  }

  /* Assistant du site + barre d'appel mobile : chargés sur toutes les pages publiques
     depuis ce point unique (voir /assets/assistant.js). */
  if (!EMBED && !/\/ecole-mayotte\//.test(location.pathname) && !/\/vitrine-gbp\.html$/.test(location.pathname)) {
    var sa = document.createElement('script'); sa.src = '/assets/assistant.js'; sa.defer = true;
    (document.body || document.head).appendChild(sa);
    // Parcours sur-mesure (commune du visiteur, prochaine étape utile) — voir /assets/perso.js
    var sp = document.createElement('script'); sp.src = '/assets/perso.js'; sp.defer = true;
    (document.body || document.head).appendChild(sp);
  }

  if (!GA_ID || /X{4,}/.test(GA_ID)) return; // pas d'ID réel → on ne fait rien

  var STORE = 'gs-consent-v1';

  /* Retirer son choix doit être aussi simple que le donner (CNIL) : window.GSConsent.reset()
     efface le choix et les cookies Google Analytics, puis réaffiche le bandeau. */
  window.GSConsent = {
    reset: function () {
      try { localStorage.removeItem(STORE); localStorage.removeItem('gs-perso-ai'); } catch (e) {}
      var dom = location.hostname.replace(/^www\./, '');
      document.cookie.split(';').forEach(function (c) {
        var n = c.split('=')[0].trim();
        if (/^_ga/.test(n)) ['', '; domain=.' + dom, '; domain=' + location.hostname].forEach(function (d) { document.cookie = n + '=; Max-Age=0; path=/' + d; });
      });
      location.reload();
    }
  };

  /* Silos géographiques : ajoutez ici le slug de chaque nouvelle zone.
     La zone est déduite du 1er segment d'URL → content_group dans GA4. */
  var ZONES = ['montpellier', 'automatisation', 'outils', 'lab', 'mayotte', 'reunion', 'guyane', 'martinique', 'guadeloupe', 'nouvelle-caledonie', 'polynesie-francaise'];
  var seg = (location.pathname.split('/')[1] || '').toLowerCase();
  var zone = ZONES.indexOf(seg) !== -1 ? seg : 'holding';
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  // Les événements déjà prévus pour Google Analytics (inscription, demande…) sont aussi comptés dans « Trafic ».
  window.gtag = function (a, b) { if (a === 'event' && b) gsT(String(b)); if (read() === 'granted') gtag.apply(null, arguments); };

  function loadGA() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { content_group: zone, anonymize_ip: true });
  }

  function read()  { try { return localStorage.getItem(STORE); } catch (e) { return null; } }
  function write(v){ try { localStorage.setItem(STORE, v); } catch (e) {} }

  // Choix distinct pour l'expérience sur-mesure par IA (voir /assets/perso.js et /api/perso)
  function writeAI(v){ try { localStorage.setItem('gs-perso-ai', v); } catch (e) {} }
  function decide(v) {
    write(v);
    var box = document.getElementById('gscAI');
    writeAI(v === 'granted' && box && box.checked ? 'granted' : 'denied');
    var b = document.getElementById('gsConsent');
    if (b && b.parentNode) b.parentNode.removeChild(b);
    if (v === 'granted') loadGA();
    document.dispatchEvent(new CustomEvent('gs-consent', { detail: { analytics: v, ai: box && box.checked && v === 'granted' } }));
  }

  function injectStyles() {
    var css =
      '#gsConsent{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;display:flex;justify-content:center;font-family:system-ui,-apple-system,"Plus Jakarta Sans",Inter,sans-serif}' +
      '#gsConsent .gsc-card{max-width:640px;width:100%;background:#171613;color:#fff;border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.28);padding:18px 20px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}' +
      '#gsConsent .gsc-txt{margin:0;font-size:13.5px;line-height:1.55;color:#EDEBE6;flex:1;min-width:220px}' +
      '#gsConsent .gsc-btns{display:flex;gap:10px;align-items:center;margin-left:auto}' +
      '#gsConsent .gsc-refuse{background:transparent;color:#CFCCC6;border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer}' +
      '#gsConsent .gsc-refuse:hover{color:#fff;border-color:rgba(255,255,255,.5)}' +
      '#gsConsent .gsc-accept{background:#E61E4D;color:#fff;border:0;border-radius:999px;padding:11px 22px;font-size:13px;font-weight:800;cursor:pointer}' +
      '#gsConsent .gsc-accept:hover{background:#C81E47}' +
      '#gsConsent .gsc-ai{flex-basis:100%;display:flex;gap:10px;align-items:flex-start;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.5;color:#EDEBE6;cursor:pointer}' +
      '#gsConsent .gsc-ai input{margin-top:3px;width:17px;height:17px;accent-color:#E61E4D;flex-shrink:0}#gsConsent .gsc-ai b{color:#fff}#gsConsent .gsc-ai small{display:none;color:#B9B5AD;font-size:12px;margin-top:4px}#gsConsent .gsc-ai.on small{display:block}' +
      '#gsConsent .gsc-more{background:none;border:0;color:#fff;text-decoration:underline;font:inherit;font-size:12.5px;cursor:pointer;padding:0 0 0 6px}' +
      '#gsConsent a{color:#fff;text-decoration:underline}' +
      '@media(max-width:560px){#gsConsent{left:10px;right:10px;bottom:10px}#gsConsent .gsc-card{padding:13px 14px;gap:10px;border-radius:14px}#gsConsent .gsc-txt{font-size:12.5px;line-height:1.45;min-width:0}#gsConsent .gsc-ai{padding:8px 10px;font-size:12.5px}#gsConsent .gsc-btns{width:100%}#gsConsent .gsc-refuse,#gsConsent .gsc-accept{flex:1;text-align:center;padding:10px 12px}}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  function showBanner() {
    if (EMBED) return;
    var d = document.createElement('div');
    d.id = 'gsConsent';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Consentement : mesure d’audience et expérience sur-mesure');
    d.innerHTML =
      '<div class="gsc-card">' +
        '<p class="gsc-txt">Nous mesurons l’audience du site (Google Analytics) pour l’améliorer. ' +
        'Aucun cookie de suivi n’est déposé sans votre accord. <a href="/confidentialite.html">En savoir plus</a></p>' +
        '<label class="gsc-ai"><input type="checkbox" id="gscAI" />' +
          '<span><b>Expérience sur-mesure par IA</b> (facultatif) <button type="button" class="gsc-more" aria-expanded="false">Voir plus</button>' +
          '<small>Le site adapte ses titres et ses conseils à ce qui vous intéresse. Analyse automatique par IA (Anthropic) des pages vues ici, de la page en cours, de votre commune approximative, du site d’où vous venez et du type d’appareil. Aucun humain de notre équipe ne consulte ces données, nous ne les stockons pas et ne les revendons jamais ; ni votre nom, ni votre e-mail, ni votre adresse IP ne sont transmis.</small></span>' +
        '</label>' +
        '<div class="gsc-btns">' +
          '<button type="button" class="gsc-refuse" id="gscRefuse">Tout refuser</button>' +
          '<button type="button" class="gsc-accept" id="gscAccept">Accepter</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(d);
    // Détail de l'analyse IA : replié par défaut (« Voir plus »), affiché dès que la case est cochée, avant d'accepter.
    var ai = document.getElementById('gscAI');
    var box = ai.closest('.gsc-ai'), more = d.querySelector('.gsc-more');
    ai.addEventListener('change', function () { if (ai.checked) box.classList.add('on'); });
    more.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); var o = box.classList.toggle('on'); more.textContent = o ? 'Voir moins' : 'Voir plus'; more.setAttribute('aria-expanded', o); });
    document.getElementById('gscAccept').addEventListener('click', function () { decide('granted'); });
    document.getElementById('gscRefuse').addEventListener('click', function () { decide('denied'); });
  }

  function init() {
    var c = read();
    if (c === 'granted') { loadGA(); return; }
    if (c === 'denied')  { return; }
    injectStyles();
    showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
