/* Groupe Solution — logique des outils gratuits (/outils/).
   Aucun prix n'est affiché : tout est sur devis. */
(function () {
  var fmt = function (n) { return new Intl.NumberFormat('fr-FR').format(Math.round(n / 10) * 10) + ' €'; };
  var $ = function (id) { return document.getElementById(id); };
  function setResult(txt) { var r = $('toolResult'); if (r) r.value = txt; var m = document.querySelector('#expressForm textarea'); if (m && !m.dataset.touched) m.value = txt + '\n\nMon projet : '; }
  document.addEventListener('input', function (e) { if (e.target.matches && e.target.matches('#expressForm textarea')) e.target.dataset.touched = '1'; });

  /* ── Configurateur de projet ── */
  var cfg = $('cfgTool');
  if (cfg) {
    var LIB = { vitrine: 'Site vitrine', reservation: 'Site avec réservation en ligne', ecommerce: 'Boutique en ligne', plateforme: 'Plateforme / outil métier sur-mesure', automatisation: 'Automatisation (sans nouveau site)' };
    var updCfg = function () {
      var type = cfg.querySelector('[name=type]:checked').value;
      var opts = [].slice.call(cfg.querySelectorAll('[name=opt]:checked')).map(function (x) { return x.value; });
      var ia = [].slice.call(cfg.querySelectorAll('[name=ia]:checked')).map(function (x) { return x.value; });
      var when = cfg.querySelector('[name=when]:checked').value;
      var pts = { vitrine: 1, reservation: 2, ecommerce: 3, plateforme: 4, automatisation: 2 }[type] + opts.length * 0.5 + ia.length;
      var level = pts <= 2 ? 'Essentiel' : pts <= 4.5 ? 'Avancé' : 'Sur-mesure';
      $('cfgLevel').textContent = level;
      $('cfgLevelTxt').textContent = level === 'Essentiel' ? 'Un projet simple, rapide à cadrer.' : level === 'Avancé' ? 'Plusieurs briques à orchestrer : on vous propose un phasage.' : 'Un vrai projet logiciel : on commence par un atelier de cadrage.';
      var items = [LIB[type]].concat(opts, ia, ['Calendrier : ' + when.toLowerCase()]);
      $('cfgList').innerHTML = items.map(function (i) { return '<li>' + i + '</li>'; }).join('');
      setResult('Configurateur (' + level + ') : ' + items.join(' ; ') + '.');
    };
    cfg.addEventListener('change', updCfg); updCfg();
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
