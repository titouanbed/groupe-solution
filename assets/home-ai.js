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
  var hist = [], busy = false, ctaShown = false;
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
