/* Groupe Solution — apparitions, calculateur du coût des tâches répétitives, formulaire express.
   Utilisé par l'accueil et les pages /automatisation/*. */
(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduced || !('IntersectionObserver' in window)) els.forEach(function (x) { x.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e, i) { if (!e.style.transitionDelay) e.style.transitionDelay = Math.min((i % 4) * 70, 210) + 'ms'; io.observe(e); });
  }
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* ── Calculateur ── */
  var fmt = new Intl.NumberFormat('fr-FR');
  document.querySelectorAll('[data-calc]').forEach(function (root) {
    var p = root.querySelector('[name=people]'), h = root.querySelector('[name=hours]'), r = root.querySelector('[name=rate]');
    var o = function (k) { return root.querySelector('[data-out=' + k + ']'); };
    function upd() {
      var people = +p.value, hours = +h.value, rate = +r.value;
      o('people').textContent = people; o('hours').textContent = hours + ' h'; o('rate').textContent = rate + ' €';
      var yearH = people * hours * 45;               // 45 semaines travaillées
      var cost = yearH * rate;
      var saved = Math.round(cost * 0.6 / 100) * 100; // hypothèse prudente : 60 % automatisable
      o('cost').textContent = fmt.format(Math.round(cost / 100) * 100) + ' €';
      o('yearh').textContent = fmt.format(yearH) + ' h';
      o('saved').textContent = fmt.format(saved) + ' €';
      o('days').textContent = fmt.format(Math.round(yearH * 0.6 / 7)) + ' j';
      var cta = root.querySelector('[data-out=cta]');
      if (cta) cta.dataset.topic = 'Calculateur : ~' + fmt.format(yearH) + ' h/an de tâches répétitives (' + people + ' pers. × ' + hours + ' h/sem.)';
    }
    [p, h, r].forEach(function (x) { x.addEventListener('input', upd); });
    upd();
    var cta = root.querySelector('[data-out=cta]');
    if (cta) cta.addEventListener('click', function () {
      var t = document.querySelector('#express textarea, #bkTopic');
      if (t && !t.value) t.value = cta.dataset.topic + '. La tâche qui me prend le plus de temps : ';
      if (window.gtag) gtag('event', 'calculator_cta');
    });
  });

  // Demande enregistrée d'abord dans le tableau de bord (/api/lead), Formspree seulement en secours : rien ne se perd.
  function postLead(action, fd) {
    var o = {}; fd.forEach(function (v, k) { if (typeof v === 'string') o[k] = v; }); if (!o.page) o.page = location.pathname;
    try { var s = sessionStorage.getItem('gsSid'); if (s && !o.sid) o.sid = s; var sr = sessionStorage.getItem('gsSrc'); if (sr && !o.provenance) o.provenance = sr; } catch (e) {}
    var backup = function () { return fetch(action, { method: 'POST', body: fd, headers: { Accept: 'application/json' }, gsDirect: true }); };
    return fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(o) })
      .then(function (r) { return r.ok || r.status === 429 || r.status === 403 ? r : backup(); }).catch(backup);
  }
  /* ── Formulaire express ── */
  var f = document.getElementById('expressForm');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var b = f.querySelector('button[type=submit]'), label = b.textContent;
    b.textContent = 'Envoi…'; b.disabled = true;
    postLead(f.action, new FormData(f))
      .then(function (res) {
        if (res.ok) {
          f.outerHTML = '<div class="ok"><b>C’est reçu, merci.</b><p>Je reviens vers vous sous 24 h ouvrées avec une première idée concrète. Pressé ? <a href="tel:+33782298559"><strong>07 82 29 85 59</strong></a></p></div>';
          if (window.gtag) gtag('event', 'generate_lead', { method: 'express_form' });
        } else { alert('Une erreur est survenue. Réessayez ou appelez le 07 82 29 85 59.'); }
      })
      .catch(function () { alert('Connexion impossible. Réessayez ou appelez le 07 82 29 85 59.'); })
      .finally(function () { if (document.body.contains(b)) { b.textContent = label; b.disabled = false; } });
  });
})();
(function () {
  /* Tableaux : sur téléphone, chaque ligne devient une fiche ; chaque cellule reprend le titre de sa colonne. */
  [].forEach.call(document.querySelectorAll('.tbl table'), function (t) {
    var heads = [].map.call(t.querySelectorAll('thead th'), function (h) { return h.textContent.trim(); });
    if (heads.length < 2) return;
    [].forEach.call(t.querySelectorAll('tbody tr'), function (tr) {
      [].forEach.call(tr.children, function (c, i) { if (c.tagName === 'TD' && heads[i]) c.setAttribute('data-l', heads[i]); });
    });
    t.classList.add('stk');
  });
})();
