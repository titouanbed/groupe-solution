/* Groupe Solution — logique des outils gratuits (/outils/).
   ─────────────────────────────────────────────────────────
   ⚠️ GRILLE DE PRIX INDICATIVE : à ajuster librement ci-dessous (en €).
      [min, max] pour chaque type ; options ajoutées aux deux bornes.
   ───────────────────────────────────────────────────────── */
(function () {
  var PRIX = {
    base: { 'vitrine': [250, 600], 'vitrine-plus': [600, 1500], 'reservation': [900, 2500], 'ecommerce': [1500, 4500], 'surmesure': [3500, 12000] },
    pagesIncluses: { 'vitrine': 3, 'vitrine-plus': 8, 'reservation': 6, 'ecommerce': 10, 'surmesure': 10 },
    parPage: [40, 90],                                   // au-delà des pages incluses
    options: { redaction: [150, 450], gbp: [90, 250], multilingue: [250, 800], logo: [150, 450], devisauto: [400, 1500], blog: [150, 400] },
    suiviMensuel: [29, 79]
  };
  var LIB = { 'vitrine': 'Site vitrine simple', 'vitrine-plus': 'Site vitrine complet', 'reservation': 'Site avec réservation en ligne', 'ecommerce': 'Boutique en ligne', 'surmesure': 'Plateforme sur-mesure' };
  var OPT = { redaction: 'Rédaction des textes', gbp: 'Fiche Google Business', multilingue: 'Version multilingue', logo: 'Logo / identité', devisauto: 'Devis automatique', blog: 'Blog / actualités' };
  var fmt = function (n) { return new Intl.NumberFormat('fr-FR').format(Math.round(n / 10) * 10) + ' €'; };
  var $ = function (id) { return document.getElementById(id); };
  function setResult(txt) { var r = $('toolResult'); if (r) r.value = txt; var m = document.querySelector('#expressForm textarea'); if (m && !m.dataset.touched) m.value = txt + '\n\nMon projet : '; }
  document.addEventListener('input', function (e) { if (e.target.matches && e.target.matches('#expressForm textarea')) e.target.dataset.touched = '1'; });

  /* ── Simulateur de prix ── */
  var prix = $('prixTool');
  if (prix) {
    var upd = function () {
      var type = prix.querySelector('[name=type]:checked').value;
      var pages = +$('pages').value; $('pagesOut').textContent = pages;
      var min = PRIX.base[type][0], max = PRIX.base[type][1];
      var extra = Math.max(0, pages - PRIX.pagesIncluses[type]);
      min += extra * PRIX.parPage[0]; max += extra * PRIX.parPage[1];
      var chosen = [].slice.call(prix.querySelectorAll('[name=opt]:checked')).map(function (x) { return x.value; });
      chosen.forEach(function (o) { min += PRIX.options[o][0]; max += PRIX.options[o][1]; });
      var suivi = prix.querySelector('[name=suivi]:checked').value === 'oui';
      $('prixOut').textContent = type === 'vitrine' && !chosen.length && extra === 0 ? 'dès ' + fmt(min) : fmt(min) + ' – ' + fmt(max);
      $('suiviOut').textContent = suivi ? '+ suivi : ' + PRIX.suiviMensuel[0] + ' à ' + PRIX.suiviMensuel[1] + ' € / mois' : '';
      var items = [LIB[type] + ', ' + pages + ' page' + (pages > 1 ? 's' : ''), 'Design pensé mobile, rapide', 'Bases du référencement + conformité légale'].concat(chosen.map(function (o) { return OPT[o]; }));
      $('prixList').innerHTML = items.map(function (i) { return '<li>' + i + '</li>'; }).join('');
      setResult('Simulateur : ' + LIB[type] + ', ' + pages + ' pages' + (chosen.length ? ', options : ' + chosen.map(function (o) { return OPT[o]; }).join(', ') : '') + (suivi ? ', avec suivi mensuel' : '') + ' → estimation ' + $('prixOut').textContent + '.');
    };
    prix.addEventListener('input', upd); prix.addEventListener('change', upd); upd();
  }

  /* ── Test de visibilité ── */
  var test = $('testTool');
  if (test) {
    var Q = JSON.parse(test.getAttribute('data-q'));
    var updT = function () {
      var total = 0, max = 0, answered = 0, gaps = [];
      Q.forEach(function (q) {
        max += q.w;
        var c = test.querySelector('[name="' + q.k + '"]:checked');
        if (c) { answered++; total += q.w * +c.value; if (+c.value < 1) gaps.push({ a: q.a, loss: q.w * (1 - +c.value) }); }
      });
      if (!answered) return;
      var score = Math.round(total / max * 100);
      $('testScore').textContent = answered === Q.length ? score + '/100' : score + '/100…';
      $('testBar').style.width = score + '%';
      $('testMsg').textContent = answered < Q.length ? (Q.length - answered) + ' question(s) restante(s).' :
        score >= 80 ? 'Très bonne visibilité locale. Prochaine étape : convertir et automatiser.' :
        score >= 50 ? 'Des bases solides, mais des clients vous échappent encore.' :
        'Une grande partie de vos clients potentiels trouve vos concurrents avant vous.';
      gaps.sort(function (a, b) { return b.loss - a.loss; });
      $('testActions').innerHTML = gaps.slice(0, 3).map(function (g) { return '<div>' + g.a + '</div>'; }).join('');
      if (answered === Q.length) {
        setResult('Test de visibilité Google : ' + score + '/100. Priorités : ' + gaps.slice(0, 3).map(function (g) { return g.a.split(':')[0]; }).join(' | '));
        if (window.gtag && !test.dataset.sent) { test.dataset.sent = 1; gtag('event', 'visibility_test_complete', { score: score }); }
      }
    };
    test.addEventListener('change', updT);
  }

  /* ── Calculateur d'automatisation ── */
  var calc = $('calcTool');
  if (calc) {
    var updC = function () {
      var rate = +$('rate').value; $('rateOut').textContent = rate + ' €';
      var rows = [].slice.call(calc.querySelectorAll('[data-k]')).map(function (cb) {
        var h = +calc.querySelector('[data-h="' + cb.dataset.k + '"]').value || 0;
        return { on: cb.checked, h: h, label: cb.nextElementSibling.childNodes[0].textContent.trim() };
      }).filter(function (r) { return r.on && r.h > 0; });
      var week = rows.reduce(function (s, r) { return s + r.h; }, 0);
      var yearH = week * 45, cost = yearH * rate, saved = cost * 0.6;
      $('calcCost').textContent = fmt(cost);
      $('calcHours').textContent = new Intl.NumberFormat('fr-FR').format(yearH) + ' heures par an (' + week + ' h / semaine)';
      $('calcSaved').textContent = fmt(saved) + ' récupérables chaque année';
      $('calcDays').textContent = Math.round(yearH * 0.6 / 7) + ' journées de travail rendues';
      var top = rows.slice().sort(function (a, b) { return b.h - a.h; })[0];
      $('calcTop').textContent = top ? 'Priorité probable : ' + top.label.toLowerCase() : 'Cochez au moins une tâche';
      setResult('Calculateur : ' + week + ' h/semaine de tâches répétitives (' + rows.map(function (r) { return r.label.toLowerCase() + ' ' + r.h + ' h'; }).join(', ') + '), coût estimé ' + fmt(cost) + '/an, ' + fmt(saved) + ' récupérables.');
    };
    calc.addEventListener('input', updC); calc.addEventListener('change', updC); updC();
  }
})();
