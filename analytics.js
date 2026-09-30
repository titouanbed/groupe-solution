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

  /* Assistant du site + barre d'appel mobile : chargés sur toutes les pages publiques
     depuis ce point unique (voir /assets/assistant.js). */
  if (!/\/ecole-mayotte\//.test(location.pathname) && !/\/vitrine-gbp\.html$/.test(location.pathname)) {
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
      '#gsConsent .gsc-ai input{margin-top:3px;width:17px;height:17px;accent-color:#E61E4D;flex-shrink:0}#gsConsent .gsc-ai b{color:#fff}#gsConsent .gsc-ai small{display:block;color:#B9B5AD;font-size:12px;margin-top:2px}' +
      '#gsConsent a{color:#fff;text-decoration:underline}' +
      '@media(max-width:560px){#gsConsent{left:10px;right:10px;bottom:10px}#gsConsent .gsc-card{padding:13px 14px;gap:10px;border-radius:14px}#gsConsent .gsc-txt{font-size:12.5px;line-height:1.45;min-width:0}#gsConsent .gsc-ai{padding:8px 10px;font-size:12.5px}#gsConsent .gsc-ai small{display:none}#gsConsent .gsc-ai.on small{display:block}#gsConsent .gsc-btns{width:100%}#gsConsent .gsc-refuse,#gsConsent .gsc-accept{flex:1;text-align:center;padding:10px 12px}}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  function showBanner() {
    var d = document.createElement('div');
    d.id = 'gsConsent';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Consentement : mesure d’audience et expérience sur-mesure');
    d.innerHTML =
      '<div class="gsc-card">' +
        '<p class="gsc-txt">Nous mesurons l’audience du site (Google Analytics) pour l’améliorer. ' +
        'Aucun cookie de suivi n’est déposé sans votre accord. <a href="/confidentialite.html">En savoir plus</a></p>' +
        '<label class="gsc-ai"><input type="checkbox" id="gscAI" />' +
          '<span><b>✨ Expérience sur-mesure par IA</b> (facultatif) : le site adapte ses titres et ses conseils à ce qui vous intéresse.' +
          '<small>Analyse automatique par IA (Anthropic) des pages vues ici, de la page en cours, de votre commune approximative, du site d’où vous venez et du type d’appareil. Aucun humain de notre équipe ne consulte ces données, nous ne les stockons pas et ne les revendons jamais ; ni votre nom, ni votre e-mail, ni votre adresse IP ne sont transmis.</small></span>' +
        '</label>' +
        '<div class="gsc-btns">' +
          '<button type="button" class="gsc-refuse" id="gscRefuse">Tout refuser</button>' +
          '<button type="button" class="gsc-accept" id="gscAccept">Accepter</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(d);
    // Sur téléphone, le détail de l'analyse IA s'affiche dès que la case est cochée (avant d'accepter).
    var ai = document.getElementById('gscAI');
    ai.addEventListener('change', function () { ai.closest('.gsc-ai').classList.toggle('on', ai.checked); });
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
