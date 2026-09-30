/* Pages communes (site internet) — modale, FAQ, apparition, test de visibilité. */
(function () {
  var modal = document.getElementById('contactModal');
  var sujet = document.getElementById('fSujet');
  window.openModal = function (topic) {
    if (sujet) sujet.value = typeof topic === 'string' ? topic : '';
    modal.classList.add('open'); document.body.classList.add('modal-open');
    var first = document.getElementById('fNom'); if (first) setTimeout(function () { first.focus(); }, 150);
  };
  window.closeModal = function () { modal.classList.remove('open'); document.body.classList.remove('modal-open'); };
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.setAttribute('role', 'button'); q.setAttribute('tabindex', '0');
    function toggle() {
      var item = q.parentElement, open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!open) item.classList.add('open');
    }
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 50); }, { passive: true });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }); }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });

  /* Test de visibilité : score /5 + recommandation, CTA qui pré-remplit la demande. */
  var quiz = document.querySelector('.gs-quiz');
  if (quiz) {
    var qs = [].slice.call(quiz.querySelectorAll('.gs-q')), res = quiz.querySelector('.gs-result');
    var commune = quiz.getAttribute('data-commune');
    qs.forEach(function (q) {
      q.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          q.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on'); q.dataset.v = b.dataset.v; render();
        });
      });
    });
    function render() {
      var done = qs.filter(function (q) { return q.dataset.v !== undefined; });
      if (done.length < qs.length) return;
      var score = done.reduce(function (s, q) { return s + (+q.dataset.v); }, 0);
      var txt, color;
      if (score <= 2) { color = '#EC4899'; txt = "Des clients de " + commune + " vous cherchent… et tombent sur vos concurrents. C'est la situation où quelques actions simples rapportent le plus vite."; }
      else if (score <= 4) { color = '#f59e0b'; txt = "Les bases sont là, mais il reste des fuites. Deux ou trois réglages ciblés peuvent nettement augmenter les demandes que vous recevez."; }
      else { color = '#10b981'; txt = "Bravo, vous êtes au-dessus de la moyenne locale. L'étape suivante : automatiser ce qui vous prend encore du temps."; }
      res.hidden = false;
      res.innerHTML = '<div class="score" style="color:' + color + '">' + score + '/5</div><p>' + txt + '</p>' +
        '<button type="button" class="btn btn-primary" id="quizCta">Recevoir mes 3 actions prioritaires</button>';
      document.getElementById('quizCta').addEventListener('click', function () {
        openModal('Test visibilité : ' + score + '/5');
        var m = document.getElementById('fMsg'); if (m && !m.value) m.value = "J'ai obtenu " + score + "/5 au test de visibilité. J'aimerais savoir quoi améliorer en priorité.";
      });
      if (window.gtag) gtag('event', 'quiz_complete', { score: score });
    }
  }

  var form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]'), label = btn.innerHTML;
    btn.innerHTML = 'Envoi en cours…'; btn.style.opacity = '0.7';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (r.ok) {
          form.innerHTML = '<div style="text-align:center;padding:20px 0"><div style="font-size:2.4rem">✓</div><h3 style="margin:10px 0">Merci, c\'est bien reçu.</h3><p style="color:#6b7280">Je vous recontacte sous 24 h ouvrées. Pour aller plus vite : <a href="tel:+33782298559" style="color:#EC4899;font-weight:700">07 82 29 85 59</a>.</p></div>';
          if (window.gtag) gtag('event', 'generate_lead', { method: 'form' });
        } else alert('Une erreur est survenue. Réessayez ou appelez le 07 82 29 85 59.');
      })
      .catch(function () { alert('Erreur réseau, vérifiez votre connexion.'); })
      .finally(function () { btn.innerHTML = label; btn.style.opacity = '1'; });
  });
})();
