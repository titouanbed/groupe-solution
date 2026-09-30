/* ═══════════════════════════════════════════════════════════
   ACCUEIL · « Dites-nous ce qui vous freine » — conversation IA en pleine page.
   Même cerveau que l'assistant du site (window.GSAssistant.reply : index du site + Claude,
   repli local gratuit). Sur téléphone, la conversation passe en plein écran.
   Coûts maîtrisés : 10 questions max par visite, puis invitation à appeler.
   ═══════════════════════════════════════════════════════════ */
(function () {
  var sec = document.getElementById('heroAI'); if (!sec) return;
  var form = document.getElementById('aiBox'), input = document.getElementById('aiInput'), log = document.getElementById('aiLog');
  var send = form.querySelector('.aiSend'), chips = document.getElementById('aiChips');
  var TEL = '07 82 29 85 59', TEL_HREF = 'tel:+33782298559', MAX_Q = 10;
  var hist = [], busy = false, ctaShown = false, actsShown = false, made = { plan: 0, maquette: 0 };
  var asked = 0; try { asked = +sessionStorage.getItem('gsHomeQ') || 0; } catch (e) {}
  function ga(e, p) { if (window.gtag) window.gtag('event', e, p || {}); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function md(t) { return window.GSAssistant && window.GSAssistant.md ? window.GSAssistant.md(t) : esc(t).replace(/\n/g, '<br>'); }
  var mobile = function () { return matchMedia('(max-width:760px)').matches; };

  /* Zone de saisie : hauteur automatique, Entrée pour envoyer (Maj+Entrée = retour à la ligne) */
  function grow() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 168) + 'px'; }
  input.addEventListener('input', function () { grow(); stopType(); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : submit(); } });

  /* Exemples qui s'écrivent tout seuls dans la zone vide */
  var EX = ['Je suis artisan, je passe mes soirées sur les devis…', 'On a un logiciel de gestion, mais il ne parle à rien…', 'Je lance mon entreprise, par où commencer ?', 'Notre standard sonne dans le vide pendant les chantiers…', 'Je veux que plus de clients me trouvent sur Google…', 'On ressaisit toutes nos factures fournisseurs à la main…'];
  var ti = 0, tc = 0, tdir = 1, ttm = null, typing = true;
  function tick() {
    if (!typing || input.value || document.activeElement === input) { input.placeholder = 'Parlez-nous de votre entreprise…'; ttm = setTimeout(tick, 1200); return; }
    var w = EX[ti]; tc += tdir; input.placeholder = w.slice(0, tc);
    if (tc >= w.length) { tdir = -1; ttm = setTimeout(tick, 1800); return; }
    if (tc <= 0) { tdir = 1; ti = (ti + 1) % EX.length; }
    ttm = setTimeout(tick, tdir > 0 ? 42 : 18);
  }
  function stopType() { typing = false; input.placeholder = 'Parlez-nous de votre entreprise…'; }
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) ttm = setTimeout(tick, 900);

  /* Messages */
  function add(cls, html) { var d = document.createElement('div'); d.className = 'aiMsg ' + cls; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; sec.scrollTop = 0; return d; }
  function open() {
    if (sec.classList.contains('chatting')) return;
    sec.classList.add('chatting'); document.documentElement.classList.add('gsChat');
    if (mobile()) { document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; }
    else sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function close() {
    sec.classList.remove('chatting'); document.documentElement.classList.remove('gsChat');
    document.documentElement.style.overflow = ''; document.body.style.overflow = '';
  }
  sec.querySelector('.aiClose').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sec.classList.contains('chatting') && mobile()) close(); });

  function brain() {
    return new Promise(function (resolve) {
      if (window.GSAssistant && window.GSAssistant.reply) return resolve(window.GSAssistant);
      var t = setTimeout(function () { resolve(null); }, 6000);
      document.addEventListener('gs-assistant-ready', function () { clearTimeout(t); resolve(window.GSAssistant); }, { once: true });
    });
  }

  function cta(force) {
    if (ctaShown && !force) return; ctaShown = true;
    var d = document.createElement('div'); d.className = 'aiCta';
    d.innerHTML = '<b>Le plus rapide : en parler 10 minutes avec Titouan.</b><a href="' + TEL_HREF + '">📞 ' + TEL + '</a><button type="button">Être rappelé</button>';
    d.querySelector('a').addEventListener('click', function () { ga('home_ai_call'); });
    d.querySelector('button').addEventListener('click', function () {
      var f = document.createElement('form');
      f.innerHTML = '<input name="nom" placeholder="Votre prénom" autocomplete="given-name" required><input name="telephone" type="tel" placeholder="Votre téléphone" autocomplete="tel" required><button type="submit">Être rappelé aujourd’hui</button>';
      this.replaceWith(f); f.querySelector('input').focus();
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(f); fd.append('page', '/'); fd.append('source', 'accueil-ia');
        fd.append('conversation', hist.map(function (m) { return (m.role === 'user' ? 'Visiteur : ' : 'Assistant : ') + m.content; }).join('\n').slice(-3500));
        f.querySelector('button').textContent = 'Envoi…';
        fetch('https://formspree.io/f/mzebrvjg', { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw 0; d.innerHTML = '<b>✅ C’est noté, merci ! Titouan vous rappelle au plus vite.</b>'; ga('generate_lead', { method: 'accueil_ia' }); })
          .catch(function () { d.innerHTML = '<b>Petit souci d’envoi.</b><a href="' + TEL_HREF + '">📞 Appeler le ' + TEL + '</a>'; });
      });
    });
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }


  /* ── Démonstrations en direct : plan d'innovation (schéma) et esquisse du futur site ── */
  function acts() {
    if (actsShown) return; actsShown = true;
    var d = document.createElement('div'); d.className = 'aiActs';
    d.innerHTML = '<span>Aller plus loin, en direct :</span><button type="button" data-k="plan">✨ Mon plan d’innovation</button><button type="button" data-k="maquette">🎨 Esquisser mon site</button>';
    [].forEach.call(d.querySelectorAll('button'), function (b) { b.addEventListener('click', function () { concept(b.getAttribute('data-k'), b); }); });
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function concept(kind, btn) {
    if (busy || made[kind] >= 2) return;
    busy = true; made[kind]++; if (btn) btn.disabled = true;
    ga('home_ai_concept', { kind: kind });
    var wait = add('b', '<span class="aiGen">' + (kind === 'plan' ? 'Notre IA imagine votre plan d’innovation' : 'Notre IA esquisse votre futur site') + '<span class="aiDotsT"><i></i><i></i><i></i></span></span>');
    fetch('/api/concept', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: kind, conversation: hist.slice(-8), zone: (window.GSPerso && window.GSPerso.placeName) || '' }) })
      .then(function (r) { if (r.status !== 200) throw r.status; return r.json(); })
      .then(function (d) { wait.remove(); if (kind === 'plan') renderPlan(d.plan, d.publishId); else renderMaq(d.maquette); cta(); })
      .catch(function () { wait.remove(); add('b', md('Je n’arrive pas à le générer pour l’instant. Le plus simple : en parler 10 minutes avec Titouan au [' + TEL + '](' + TEL_HREF + ').')); made[kind]--; if (btn) btn.disabled = false; })
      .then(function () { busy = false; });
  }
  function renderPlan(p, publishId) {
    var c = el('div', 'aiPlan');
    c.appendChild(el('span', 'k', 'Plan d’innovation · imaginé pour vous'));
    c.appendChild(el('h3', null, p.titre)); c.appendChild(el('p', 'acc', p.accroche));
    var flow = el('ol', 'flow');
    p.etapes.forEach(function (e, i) { var li = el('li'); li.style.animationDelay = (i * 0.12) + 's'; var n = el('span', 'n', e.emoji || String(i + 1)); var t = el('div'); t.appendChild(el('b', null, e.titre)); t.appendChild(el('p', null, e.detail)); if (e.techno) t.appendChild(el('em', null, e.techno)); li.appendChild(n); li.appendChild(t); flow.appendChild(li); });
    c.appendChild(flow);
    var star = el('div', 'star'); star.appendChild(el('span', null, '💡 L’idée phare')); star.appendChild(el('b', null, p.idee_phare.titre)); star.appendChild(el('p', null, p.idee_phare.description)); c.appendChild(star);
    var ul = el('ul', 'ben'); p.benefices.forEach(function (x) { ul.appendChild(el('li', null, x)); }); c.appendChild(ul);
    c.appendChild(el('p', 'next', '👉 Premier pas : ' + p.premier_pas));
    if (publishId) {
      var pb = el('button', 'pub', 'Publier anonymement cette idée dans le Laboratoire d’idées'); pb.type = 'button';
      pb.addEventListener('click', function () {
        pb.disabled = true; pb.textContent = 'Publication…';
        fetch('/api/idees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: publishId }) })
          .then(function (r) { if (!r.ok) throw 0; return r.json(); })
          .then(function (d) { pb.outerHTML = '<a class="pub done" href="/idees/' + (d.secteur && d.secteur !== 'autre' ? d.secteur + '.html' : '') + '">✅ Idée publiée anonymement — voir le Laboratoire d’idées →</a>'; ga('home_ai_idea_published'); })
          .catch(function () { pb.textContent = 'Publication impossible pour le moment'; });
      });
      c.appendChild(pb);
      c.appendChild(el('small', null, 'Seule une version générique est publiée : ni nom, ni détail permettant de vous identifier.'));
    }
    log.appendChild(c); log.scrollTop = log.scrollHeight; sec.scrollTop = 0;
    hist.push({ role: 'assistant', content: 'Plan d’innovation proposé : ' + p.titre + ' — ' + p.etapes.map(function (e) { return e.titre; }).join(' → ') + '. Idée phare : ' + p.idee_phare.titre });
  }
  function renderMaq(m) {
    var w = el('div', 'aiMaq'); w.style.setProperty('--mc', m.couleur);
    w.setAttribute('data-style', m.style || 'chaleureux');
    var bar = el('div', 'bar'); bar.innerHTML = '<i></i><i></i><i></i>'; bar.appendChild(el('span', null, (m.nom || 'votre-entreprise').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28) + '.fr'));
    w.appendChild(bar);
    var pg = el('div', 'pg');
    var nav = el('div', 'nav'); nav.appendChild(el('b', null, m.nom)); nav.appendChild(el('span', null, 'Contact')); pg.appendChild(nav);
    var hero = el('div', 'hero'); hero.appendChild(el('h4', null, m.accroche)); hero.appendChild(el('p', null, m.sous_titre)); hero.appendChild(el('span', 'btn', m.bouton)); pg.appendChild(hero);
    var sv = el('div', 'sv'); m.services.forEach(function (s) { var x = el('div'); x.appendChild(el('span', null, s.emoji)); x.appendChild(el('b', null, s.titre)); x.appendChild(el('p', null, s.texte)); sv.appendChild(x); }); pg.appendChild(sv);
    if (m.argument_local) pg.appendChild(el('p', 'loc', '📍 ' + m.argument_local));
    w.appendChild(pg);
    log.appendChild(w);
    log.appendChild(el('p', 'aiNote', 'Esquisse générée en direct par notre IA. Votre vrai site sera conçu avec vous, sur-mesure.'));
    log.scrollTop = log.scrollHeight; sec.scrollTop = 0;
    hist.push({ role: 'assistant', content: 'Esquisse de site proposée : « ' + m.accroche + ' » — ' + m.services.map(function (s) { return s.titre; }).join(', ') });
  }

  function ask(q) {
    q = String(q || '').trim(); if (!q || busy) return;
    open(); stopType();
    if (asked >= MAX_Q) { add('b', md('On a déjà bien avancé ! Pour la suite, le plus efficace est d’en parler de vive voix : Titouan vous dit en 10 minutes ce qui est faisable et comment.')); cta(true); input.disabled = true; send.disabled = true; return; }
    busy = true; send.disabled = true;
    add('u', esc(q)); input.value = ''; grow();
    var wait = add('b', '<span class="aiDotsT" aria-label="L’assistant écrit"><i></i><i></i><i></i></span>');
    asked++; try { sessionStorage.setItem('gsHomeQ', asked); } catch (e) {}
    ga('home_ai_question', { n: asked });
    brain().then(function (A) {
      if (!A) return { answer: 'Je rencontre un petit souci technique. Le plus simple : appelez Titouan au [' + TEL + '](' + TEL_HREF + '), il vous répond directement.' };
      return A.reply(q, hist);
    }).then(function (r) {
      wait.remove();
      add('b', md(r.answer));
      // Interface générative : les pages citées par l'IA deviennent des cartes d'action sous sa réponse.
      var seen = {}, refs = []; (r.answer.match(/\[[^\]]{2,70}\]\((\/[^)\s]*)\)/g) || []).forEach(function (m) { var x = m.match(/\[([^\]]+)\]\(([^)]+)\)/); if (x && !seen[x[2]] && refs.length < 3) { seen[x[2]] = 1; refs.push(x); } });
      if (refs.length) { var rf = document.createElement('div'); rf.className = 'aiRefs'; refs.forEach(function (x) { var a = document.createElement('a'); a.href = x[2]; a.textContent = x[1]; a.addEventListener('click', function () { ga('home_ai_ref', { url: x[2] }); }); rf.appendChild(a); }); log.appendChild(rf); log.scrollTop = log.scrollHeight; }
      hist.push({ role: 'user', content: q }, { role: 'assistant', content: r.answer }); hist = hist.slice(-16);
      var userTurns = hist.filter(function (m) { return m.role === 'user'; }).length;
      if (userTurns >= 1) acts();
      if (userTurns >= 2 || /appel|rappel|devis|10 minutes|07 82/i.test(r.answer)) cta();
    }).catch(function () {
      wait.remove(); add('b', md('Je rencontre un petit souci technique. Appelez Titouan au [' + TEL + '](' + TEL_HREF + ').'));
    }).then(function () { busy = false; send.disabled = false; if (!mobile()) input.focus(); });
  }

  /* Tant que la zone de saisie est visible, la bulle d'assistant et le bouton d'appel flottants s'effacent */
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { document.documentElement.classList.toggle('gsHeroIn', es[0].isIntersecting); }, { threshold: 0.25 }).observe(form);

  function submit(e) { if (e) e.preventDefault(); ask(input.value); }
  form.addEventListener('submit', submit);
  if (chips) [].forEach.call(chips.querySelectorAll('button'), function (b) { b.addEventListener('click', function () { ga('home_ai_chip'); ask(b.textContent); }); });
})();
