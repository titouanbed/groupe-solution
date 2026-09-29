/* « Le pouls des dirigeants » — vote en un clic sous chaque actu / dossier / question.
   Chaque bloc : <div class="poll" data-poll="actu:2026-09-29:slug"></div>
   Tant que /api/vote n'est pas configuré (503), rien ne s'affiche. */
(function () {
  var polls = [].slice.call(document.querySelectorAll('[data-poll]'));
  if (!polls.length || !window.fetch) return;
  var LABELS = [['utile', 'Utile pour mon entreprise'], ['surveiller', 'À surveiller'], ['pasmoi', 'Pas pour moi']];
  var KEY = 'gs-votes';
  var mine = {};
  try { mine = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) {} }

  function render(el, counts) {
    var id = el.getAttribute('data-poll'), voted = mine[id], c = counts || { utile: 0, surveiller: 0, pasmoi: 0 };
    var total = c.utile + c.surveiller + c.pasmoi;
    el.innerHTML = '<p class="poll-q">' + (voted ? 'Merci ! L’avis des lecteurs :' : 'Votre avis de dirigeant ?') + '</p><div class="poll-opts">' +
      LABELS.map(function (l) {
        var pct = total ? Math.round(c[l[0]] * 100 / total) : 0;
        return voted
          ? '<div class="poll-res' + (voted === l[0] ? ' me' : '') + '"><span class="bar" style="width:' + pct + '%"></span><span class="lab">' + l[1] + '</span><b>' + pct + ' %</b></div>'
          : '<button type="button" data-v="' + l[0] + '">' + l[1] + '</button>';
      }).join('') + '</div>' + (voted && total ? '<p class="poll-n">' + total + ' vote' + (total > 1 ? 's' : '') + ' · <a href="/lab/pouls/">Le pouls des dirigeants →</a></p>' : '');
    el.hidden = false;
    [].forEach.call(el.querySelectorAll('button[data-v]'), function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-v');
        mine[id] = v; save();
        c[v] = (c[v] || 0) + 1; render(el, c);
        fetch('/api/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id, choice: v }) })
          .then(function (r) { return r.json(); }).then(function (d) { if (d.counts) render(el, d.counts); }).catch(function () {});
        if (window.gtag) window.gtag('event', 'poll_vote', { poll_id: id, choice: v });
      });
    });
  }

  var ids = polls.map(function (el) { el.hidden = true; return el.getAttribute('data-poll'); });
  fetch('/api/vote?ids=' + encodeURIComponent(ids.join(',')).replace(/%2C/g, ','))
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (d) {
      polls.forEach(function (el) { render(el, d.counts[el.getAttribute('data-poll')]); });
      document.dispatchEvent(new CustomEvent('gs-poll-counts', { detail: d.counts }));
    })
    .catch(function () { /* non configuré : widget masqué */ });
})();
