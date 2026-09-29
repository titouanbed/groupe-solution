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

  /* ── Formulaire express ── */
  var f = document.getElementById('expressForm');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var b = f.querySelector('button[type=submit]'), label = b.textContent;
    b.textContent = 'Envoi…'; b.disabled = true;
    fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (res.ok) {
          f.outerHTML = '<div class="ok"><b>C’est reçu, merci.</b><p>Je reviens vers vous sous 24 h — souvent le jour même — avec une première idée concrète. Pressé ? <a href="tel:+33782298559"><strong>07 82 29 85 59</strong></a></p></div>';
          if (window.gtag) gtag('event', 'generate_lead', { method: 'express_form' });
        } else { alert('Une erreur est survenue. Réessayez ou appelez le 07 82 29 85 59.'); }
      })
      .catch(function () { alert('Connexion impossible. Réessayez ou appelez le 07 82 29 85 59.'); })
      .finally(function () { if (document.body.contains(b)) { b.textContent = label; b.disabled = false; } });
  });
})();
