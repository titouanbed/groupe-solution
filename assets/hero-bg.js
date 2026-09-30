/* ═══════════════════════════════════════════════════════════
   ACCUEIL · fond « plan d'étude » — des schémas de solutions se dessinent à l'encre,
   comme sur la table d'un bureau d'études : Demande → Devis → Signature → Facture…
   Chaque tracé raconte une automatisation réelle que nous construisons.
   • Tracés hors de la zone du titre et de la saisie (mesurée en direct).
   • Pause quand l'accueil n'est pas visible ou que l'onglet est caché ; mouvement réduit respecté.
   ═══════════════════════════════════════════════════════════ */
(function () {
  var cv = document.getElementById('aiCanvas'), sec = document.getElementById('heroAI');
  if (!cv || !sec || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var FLOWS = [
    ['Demande', 'Devis', 'Signature', 'Facture', 'Paiement'],
    ['Appel manqué', 'Agent vocal', 'Rendez-vous', 'SMS de rappel'],
    ['Facture fournisseur', 'Lecture IA', 'Contrôle', 'Comptabilité'],
    ['Ventes', 'Météo', 'Prévision', 'Commande'],
    ['Formulaire', 'CRM', 'Relance J+3', 'Client signé'],
    ['Chantier', 'Photos', 'Compte rendu', 'Client informé'],
    ['Question client', 'Assistant IA', 'Vos documents', 'Réponse sourcée'],
    ['Devis signé', 'Planning', 'Équipe', 'Intervention'],
    ['Avis Google', 'Réponse', 'Visibilité', 'Appels'],
    ['Stock', 'Seuil', 'Fournisseur', 'Livraison']
  ];
  var INK = '23,22,19', ACC = '230,30,77';
  var W = 0, H = 0, dpr = 1, mobile = false, flows = [], order = [], next = 0, raf = 0, running = false, last = 0;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var font = '600 12px "Plus Jakarta Sans", system-ui, sans-serif';

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function keepOut() {
    // Zone réservée au titre, à la conversation et à la saisie (+ marge).
    var w = sec.querySelector('.aiWrap'); if (!w) return { x0: W * .3, x1: W * .7, y0: H * .2, y1: H * .8 };
    var r = w.getBoundingClientRect(), s = sec.getBoundingClientRect(), m = mobile ? 6 : 26;
    return { x0: r.left - s.left - m, x1: r.right - s.left + m, y0: r.top - s.top - m, y1: r.bottom - s.top + m };
  }
  function bands() {
    var k = keepOut(), b = [];
    if (k.x0 > 150) b.push({ x0: 18, x1: k.x0, y0: 24, y1: H - 24 });
    if (W - k.x1 > 150) b.push({ x0: k.x1, x1: W - 18, y0: 24, y1: H - 24 });
    if (k.y0 > 90) b.push({ x0: 14, x1: W - 14, y0: 14, y1: k.y0 });
    if (H - k.y1 > 90) b.push({ x0: 14, x1: W - 14, y0: k.y1, y1: H - 14 });
    return b;
  }
  function measure(t) { ctx.font = font; return ctx.measureText(t).width + 18; }

  // Un flux = une suite d'étapes posées en escalier dans une bande libre, reliées par des traits orthogonaux.
  function makeFlow(labels, band) {
    var bw = band.x1 - band.x0, bh = band.y1 - band.y0, vertical = bh > bw;
    var n = labels.length, pts = [];
    for (var i = 0; i < n; i++) {
      var w = measure(labels[i]), t = n > 1 ? i / (n - 1) : .5, x, y;
      if (vertical) { x = band.x0 + 10 + Math.random() * Math.max(10, bw - w - 20); y = band.y0 + 20 + t * (bh - 40); }
      else { x = band.x0 + 10 + t * Math.max(10, bw - w - 20); y = band.y0 + 16 + Math.random() * Math.max(10, bh - 40); }
      pts.push({ x: x, y: y, w: w, h: 26, label: labels[i] });
    }
    var path = [];
    for (var j = 0; j < n - 1; j++) {
      var a = pts[j], c = pts[j + 1];
      var ax = a.x + a.w / 2, ay = a.y + a.h / 2, cx = c.x + c.w / 2, cy = c.y + c.h / 2;
      var seg = vertical ? [[ax, a.y + a.h], [ax, (ay + cy) / 2], [cx, (ay + cy) / 2], [cx, c.y]]
                         : [[a.x + a.w, ay], [(ax + cx) / 2, ay], [(ax + cx) / 2, cy], [c.x, cy]];
      path.push(seg);
    }
    var len = 0; path.forEach(function (s) { for (var k = 1; k < s.length; k++) len += Math.abs(s[k][0] - s[k - 1][0]) + Math.abs(s[k][1] - s[k - 1][1]); });
    return { pts: pts, path: path, len: len, p: 0, born: performance.now(), life: 15000 + Math.random() * 5000, alpha: 0 };
  }
  function overlaps(f) {
    return flows.some(function (g) { return g.pts.some(function (a) { return f.pts.some(function (b) { return Math.abs(a.x - b.x) < (a.w + b.w) / 2 + 8 && Math.abs(a.y - b.y) < 30; }); }); });
  }
  function spawn() {
    var b = bands(); if (!b.length) return;
    for (var tries = 0; tries < 6; tries++) {
      var band = b[Math.floor(Math.random() * b.length)];
      if (!order.length) order = shuffle(FLOWS.slice());
      var labels = order.pop();
      if (mobile) labels = labels.slice(0, 3);
      var f = makeFlow(labels, band);
      if (!overlaps(f)) { flows.push(f); return; }
    }
  }

  function drawPath(f, upto) {
    var done = 0;
    ctx.beginPath();
    for (var i = 0; i < f.path.length; i++) {
      var s = f.path[i]; ctx.moveTo(s[0][0], s[0][1]);
      for (var k = 1; k < s.length; k++) {
        var d = Math.abs(s[k][0] - s[k - 1][0]) + Math.abs(s[k][1] - s[k - 1][1]);
        if (done + d <= upto) { ctx.lineTo(s[k][0], s[k][1]); done += d; }
        else { var r = Math.max(0, (upto - done) / d); ctx.lineTo(s[k - 1][0] + (s[k][0] - s[k - 1][0]) * r, s[k - 1][1] + (s[k][1] - s[k - 1][1]) * r); ctx.stroke(); return { x: s[k - 1][0] + (s[k][0] - s[k - 1][0]) * r, y: s[k - 1][1] + (s[k][1] - s[k - 1][1]) * r, end: false }; }
      }
    }
    ctx.stroke(); return { end: true };
  }
  function box(p, a, accent) {
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(255,255,255,.82)'; ctx.strokeStyle = 'rgba(' + (accent ? ACC : INK) + ',' + (accent ? .55 : .28) + ')';
    ctx.lineWidth = 1; ctx.setLineDash(accent ? [] : [3, 3]);
    var r = 7; ctx.beginPath(); ctx.moveTo(p.x + r, p.y); ctx.arcTo(p.x + p.w, p.y, p.x + p.w, p.y + p.h, r); ctx.arcTo(p.x + p.w, p.y + p.h, p.x, p.y + p.h, r); ctx.arcTo(p.x, p.y + p.h, p.x, p.y, r); ctx.arcTo(p.x, p.y, p.x + p.w, p.y, r); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = 'rgba(' + (accent ? ACC : INK) + ',' + (accent ? .9 : .62) + ')'; ctx.font = font; ctx.textBaseline = 'middle'; ctx.fillText(p.label, p.x + 9, p.y + p.h / 2 + .5);
    ctx.globalAlpha = 1;
  }
  function frame(now) {
    raf = 0; if (!running) return;
    var dt = Math.min(64, now - (last || now)); last = now;
    ctx.clearRect(0, 0, W, H);
    if (now > next && flows.length < (mobile ? 2 : 5)) { spawn(); next = now + (mobile ? 3800 : 2200); }
    flows = flows.filter(function (f) { return now - f.born < f.life; });
    flows.forEach(function (f) {
      var age = now - f.born, fade = Math.min(1, age / 600, (f.life - age) / 1400);
      f.p = reduced ? f.len : Math.min(f.len, f.p + dt * .085);
      ctx.strokeStyle = 'rgba(' + INK + ',' + (.26 * fade) + ')'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      var head = drawPath(f, f.p);
      // Étapes atteintes par le tracé.
      var shown = 1 + Math.floor((f.p / f.len) * (f.pts.length - 1) + .02);
      f.pts.forEach(function (p, i) { if (i < shown) box(p, fade, i === f.pts.length - 1); });
      // La plume.
      if (!head.end) { ctx.fillStyle = 'rgba(' + ACC + ',' + (.9 * fade) + ')'; ctx.beginPath(); ctx.arc(head.x, head.y, 2.6, 0, 6.3); ctx.fill(); }
      else if (!reduced) {
        // Une fois le schéma terminé, une « donnée » le parcourt en boucle.
        var t = ((age / 2600) % 1) * f.len, q = pointAt(f, t);
        if (q) { ctx.fillStyle = 'rgba(' + ACC + ',' + (.55 * fade) + ')'; ctx.beginPath(); ctx.arc(q.x, q.y, 2.2, 0, 6.3); ctx.fill(); }
      }
    });
    if (!reduced) raf = requestAnimationFrame(frame);
  }
  function pointAt(f, t) {
    var done = 0;
    for (var i = 0; i < f.path.length; i++) { var s = f.path[i]; for (var k = 1; k < s.length; k++) { var d = Math.abs(s[k][0] - s[k - 1][0]) + Math.abs(s[k][1] - s[k - 1][1]); if (done + d >= t) { var r = d ? (t - done) / d : 0; return { x: s[k - 1][0] + (s[k][0] - s[k - 1][0]) * r, y: s[k - 1][1] + (s[k][1] - s[k - 1][1]) * r }; } done += d; } }
    return null;
  }
  function resize() {
    var r = sec.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.round(r.width); H = Math.round(r.height); mobile = W < 760;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); flows = []; next = 0;
    if (reduced) { for (var i = 0; i < (mobile ? 2 : 4); i++) spawn(); running = true; frame(performance.now()); running = false; }
  }
  function start() { if (running || reduced || sec.classList.contains('chatting')) return; running = true; last = 0; raf = requestAnimationFrame(frame); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  var visible = true;
  resize();
  window.addEventListener('resize', function () { clearTimeout(resize.t); resize.t = setTimeout(function () { resize(); if (visible) start(); }, 200); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible && !document.hidden ? start() : stop(); }).observe(sec);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : visible && start(); });
  // Pendant la conversation, le fond se fige (lecture confortable, batterie préservée).
  new MutationObserver(function () { if (sec.classList.contains('chatting')) { stop(); ctx.clearRect(0, 0, W, H); } else { resize(); start(); } }).observe(sec, { attributes: true, attributeFilter: ['class'] });
  start();
})();
