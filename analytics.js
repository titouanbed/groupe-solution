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
  var GA_ID = 'G-XXXXXXXXXX'; // TODO — remplacer par le vrai ID GA4 (ex : G-ABCD123456)

  if (!GA_ID || /X{4,}/.test(GA_ID)) return; // pas d'ID réel → on ne fait rien

  var STORE = 'gs-consent-v1';
  var zone = location.pathname.indexOf('/mayotte/') !== -1 ? 'mayotte' : 'holding';
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

  function decide(v) {
    write(v);
    var b = document.getElementById('gsConsent');
    if (b && b.parentNode) b.parentNode.removeChild(b);
    if (v === 'granted') loadGA();
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
      '@media(max-width:560px){#gsConsent .gsc-btns{width:100%}#gsConsent .gsc-refuse,#gsConsent .gsc-accept{flex:1;text-align:center}}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  function showBanner() {
    var d = document.createElement('div');
    d.id = 'gsConsent';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Consentement à la mesure d’audience');
    d.innerHTML =
      '<div class="gsc-card">' +
        '<p class="gsc-txt">Nous mesurons l’audience du site (Google Analytics) pour l’améliorer. ' +
        'Aucun cookie de suivi n’est déposé sans votre accord.</p>' +
        '<div class="gsc-btns">' +
          '<button type="button" class="gsc-refuse" id="gscRefuse">Refuser</button>' +
          '<button type="button" class="gsc-accept" id="gscAccept">Accepter</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(d);
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
