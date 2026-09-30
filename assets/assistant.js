/* ═══════════════════════════════════════════════════════════
   Groupe Solution — assistant du site (toutes les pages).
   • Mode IA : /api/assistant (Claude) si une clé est configurée côté serveur.
   • Mode local (gratuit, par défaut) : recherche dans /assets/site-index.json
     et réponse à partir des questions-réponses et pages du site.
   • Toujours : appel direct, demande de rappel, RDV — aucun visiteur sans issue.
   Expose aussi window.GSSearch(query) pour la page /recherche.html.
   ═══════════════════════════════════════════════════════════ */
(function () {
  if (window.__gsAssistant) return; window.__gsAssistant = 1;

  /* Toutes les demandes des formulaires (Formspree) passent d'abord par /api/lead (e-mail via Brevo,
     sans le plafond de 50/mois) ; si l'API n'est pas configurée ou échoue → Formspree, comme avant.
     Une limite atteinte (429) n'est PAS contournée par Formspree. */
  if (window.fetch && window.FormData && !window.__gsLeadWrap) {
    window.__gsLeadWrap = 1;
    var _fetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      try {
        var url = typeof input === 'string' ? input : (input && input.url) || '';
        if (/^https:\/\/formspree\.io\//.test(url) && init && !init.gsDirect && String(init.method || '').toUpperCase() === 'POST' && init.body instanceof FormData) {
          var o = {}; init.body.forEach(function (v, k) { if (typeof v === 'string') o[k] = v; });
          if (!o.page) o.page = location.pathname;
          return _fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(o) })
            .then(function (r) { return r.ok || r.status === 429 || r.status === 403 ? r : _fetch(input, init); })
            .catch(function () { return _fetch(input, init); });
        }
      } catch (e) {}
      return _fetch(input, init);
    };
  }
  var TEL = '07 82 29 85 59', TEL_HREF = 'tel:+33782298559', RDV = '/echanger.html#rendez-vous', FORM = 'https://formspree.io/f/mzebrvjg';
  // Identifiant de conversation tiré au hasard (onglet en cours) : relie les échanges d'une même visite dans /admin/.
  var SID = (function () { try { var v = sessionStorage.getItem('gsSid'); if (!v) { var a = new Uint8Array(16); crypto.getRandomValues(a); v = Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); sessionStorage.setItem('gsSid', v); } return v; } catch (e) { return ''; } })();
  var store = { get: function (k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } }, set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  // Icônes (trait, currentColor) — même famille que /assets/icons.js.
  var IC = { telephone: '<path d="M6.5 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/>', envoyer: '<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/>', etincelle: '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z"/>', check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>' };
  var ico = function (n) { return '<svg class="gsi" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-4px;margin-right:6px">' + IC[n] + '</svg>'; };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ga = function (e, p) { if (window.gtag) gtag('event', e, p || {}); };

  /* ── Recherche locale ── */
  var STOP = 'le la les un une des de du d l et ou a au aux en dans pour par sur avec sans ce cet cette ces se sa son ses vos votre nos notre vous nous je tu il elle on qui que quoi est sont etre avoir fait faire plus moins tres comment quel quelle quels quelles pourquoi quand ne pas y'.split(' ');
  var stopSet = {}; STOP.forEach(function (w) { stopSet[w] = 1; });
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function toks(s) { return norm(s).split(' ').filter(function (w) { return w.length > 1 && !stopSet[w]; }).map(function (w) { return w.length > 5 ? w.replace(/(s|x)$/, '') : w; }); }
  var IDX = null, IDF = {}, loading = null, KB = { places: [], metiers: [], services: [] };
  function loadIndex() {
    if (IDX) return Promise.resolve(IDX);
    if (loading) return loading;
    loading = fetch('/assets/site-index.json').then(function (r) { return r.json(); }).then(function (d) {
      var df = {}, N = d.c.length;
      d.c.forEach(function (c) { c._t = toks(c.t + ' ' + c.h); c._x = toks(c.x); var seen = {}; c._t.concat(c._x).forEach(function (w) { if (!seen[w]) { seen[w] = 1; df[w] = (df[w] || 0) + 1; } }); });
      Object.keys(df).forEach(function (w) { IDF[w] = Math.log(1 + N / df[w]); });
      IDX = d.c; KB = { places: d.places || [], metiers: d.metiers || [], services: d.services || [] };
      KB.places.forEach(function (p) { p._n = norm(p.n); });
      return IDX;
    }).catch(function (e) { loading = null; throw e; }); // un échec réseau ne bloque pas la suite de la visite
    return loading;
  }
  function search(q, n) {
    var qt = toks(q), here = location.pathname.replace(/index\.html$/, '');
    if (!qt.length) return [];
    return IDX.map(function (c) {
      var s = 0;
      qt.forEach(function (w) {
        var idf = IDF[w] || 0;
        c._t.forEach(function (x) { if (x === w) s += 2.2 * idf; else if (w.length > 4 && x.indexOf(w) === 0) s += 1.2 * idf; });
        c._x.forEach(function (x) { if (x === w) s += idf; else if (w.length > 4 && x.indexOf(w) === 0) s += 0.5 * idf; });
      });
      if (c.q) s *= 1.25; if (c.u === here) s *= 1.35;
      return { c: c, s: s };
    }).filter(function (r) { return r.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, n || 8);
  }
  window.GSSearch = function (q, n) { return loadIndex().then(function () { return search(q, n || 20); }); };

  /* ── Rendu texte (liens internes, gras, listes) ── */
  function md(t) {
    var h = esc(t).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*\n]+)\*/g, '<i>$1</i>');
    // Liens autorisés : pages du site (jamais « //autre-site » ni « /\autre-site »), téléphone, e-mail du site.
    h = h.replace(/\[([^\]]+)\]\((\/(?![\/\\])[^)\s\\]*|https:\/\/www\.groupsolution\.fr\/[^)\s\\]*|tel:\+?[0-9]+|mailto:[\w.+-]+@groupsolution\.fr)\)/g, '<a href="$2">$1</a>');
    return h.split(/\n{2,}/).map(function (p) {
      if (/^\s*[-•] /m.test(p)) return '<ul>' + p.split('\n').filter(Boolean).map(function (l) { return '<li>' + l.replace(/^\s*[-•] /, '') + '</li>'; }).join('') + '</ul>';
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  /* ── Intentions reconnues (connaissance structurée du site) ── */
  var CALLME = '\n\nLe plus simple : [appelez Titouan au ' + TEL + '](' + TEL_HREF + '), ou cliquez sur « Être rappelé ».';
  function findPlace(nq) {
    var best = null;
    KB.places.forEach(function (p) { if (p._n.length > 2 && (' ' + nq + ' ').indexOf(' ' + p._n + ' ') !== -1 && (!best || p._n.length > best._n.length)) best = p; });
    return best;
  }
  var METIER_KEYS = [[/restaurant|restaurateur|bistrot|brasserie|pizzeria|traiteur/, 'restaurant'], [/artisan|plombier|electricien|macon|peintre|menuisier|couvreur|chauffagiste|paysagiste|batiment/, 'artisan du bâtiment'],
    [/kine|osteo|infirmier|dentiste|medecin|psychologue|orthophoniste|sante|praticien/, 'professionnel de santé'], [/avocat|juriste/, 'avocat'], [/comptable|expert comptable/, 'cabinet comptable'],
    [/immobilier|agence immo|agent immobilier/, 'agence immobilière'], [/coiffeur|coiffure|barbier|esthetique|institut|onglerie/, 'salon de coiffure ou institut'], [/coach|salle de sport|yoga|pilates|fitness/, 'coach sportif ou salle de sport'],
    [/gite|chambre d hote|hotel|hebergement|camping|location saisonniere/, 'hébergement'], [/vigneron|domaine|cave|viticole|vin/, 'domaine viticole'], [/boutique|magasin|commerce|commercant/, 'commerce'],
    [/garage|garagiste|carrosserie|mecanique/, 'garage automobile'], [/formation|organisme de formation|cfa|ecole/, 'organisme de formation'], [/menage|jardinage|domicile|nettoyage|lavage/, 'services à domicile']];
  function intent(q) {
    var nq = norm(q), place = findPlace(nq);
    if (/\b(appel|appeler|telephone|numero|joindre|contact|contacter|rappel|rappeler|rdv|rendez vous|visio|parler)\b/.test(nq) && !place)
      return 'Avec plaisir ! Trois façons de joindre Titouan :\n- [' + TEL + '](' + TEL_HREF + ') — réponse rapide\n- [Réserver 10 minutes en visio](' + RDV + ')\n- [contact@groupsolution.fr](mailto:contact@groupsolution.fr)\n\nOu cliquez sur « Être rappelé » : il vous rappelle.';
    if (/\b(qui|fondateur|titouan|equipe|entreprise|groupe solution|vous etes)\b/.test(nq) && /\b(qui|fondateur|titouan|equipe|vous etes)\b/.test(nq))
      return 'Groupe Solution est un **éditeur de logiciels et d’automatisations**, basé dans la métropole de Montpellier et fondé par **Titouan Bedos**. Nous concevons des sites internet, des agents IA et des automatisations sur-mesure, et nous opérons nos propres plateformes (Solution Recrutement, Solution Alternance, Aides Particuliers). Notre devise : *nous gagnons de l’argent uniquement si vous en gagnez.* [En savoir plus](/a-propos.html)' + CALLME;
    if (/\b(delai|combien de temps|quand|rapide|vite)\b/.test(nq))
      return 'Le délai dépend du projet : une première automatisation simple peut être livrée en quelques jours, un site ou un outil plus complet se construit par étapes. **Le délai est fixé noir sur blanc dans le devis**, gratuit.' + CALLME;
    if (place) {
      var m = null; METIER_KEYS.some(function (k) { if (k[0].test(nq)) { m = k[1]; return true; } });
      var mp = m && KB.metiers.filter(function (x) { return x.l === m; })[0];
      return 'Oui, nous intervenons ' + (/^(Le |Les )/.test(place.n) ? '' : 'à ') + '**' + place.n + '** (' + place.cp + ', ' + place.s + ') : échanges par téléphone ou visio, déplacement quand c’est utile. Tout y est :\n- [Création de site internet à ' + place.n + '](' + place.site + ')\n- [Automatisation & IA à ' + place.n + '](' + place.auto + ')' + (mp ? '\n- [Site internet pour ' + mp.p + '](' + mp.u + ')' : '') + CALLME;
    }
    if (/\b(intervenez|travaillez|deplacez|venez|zone|secteur)\b/.test(nq))
      return 'Nous sommes basés à **Montpellier** et intervenons dans toute la métropole, l’Hérault et le Gard (75 communes ont leur page), **partout en France à distance**, et dans les DOM-TOM via nos agences locales. Dites-moi votre commune, je vous donne la page qui vous concerne.' + CALLME;
    var mk = null; METIER_KEYS.some(function (k) { if (k[0].test(nq)) { mk = k[1]; return true; } });
    var met = mk && KB.metiers.filter(function (x) { return x.l === mk; })[0];
    if (met && /\b(site|internet|web|automatis|ia|logiciel|outil|client|reservation)\b/.test(nq))
      return 'Pour les ' + met.p + ', nous avons une page complète : ce que doit contenir votre site, les erreurs qui font perdre des clients, et ce que l’IA peut automatiser pour vous → [Site internet pour ' + met.p + '](' + met.u + ').' + CALLME;
    return null;
  }

  /* ── Réponse locale (sans IA générative) ── */
  var PRICE = /\b(prix|tarif|tarifs|cout|coute|combien|budget|devis|cher)\b/;
  function localAnswer(q, res) {
    var nq = norm(q);
    if (PRICE.test(nq)) return 'Chaque projet est chiffré **sur devis, gratuitement** : le prix dépend de vos besoins (pages, fonctionnalités, automatisations, connexions à vos outils). Le plus simple : [configurez votre projet en 2 minutes](/outils/configurateur-site-internet.html) ou appelez le [' + TEL + '](' + TEL_HREF + ') — réponse rapide.';
    if (/\b(bonjour|salut|hello|bonsoir)\b/.test(nq) && nq.split(' ').length < 4) return 'Bonjour ! Posez-moi votre question sur un site internet, une automatisation, l’IA ou votre commune : je vous réponds à partir du contenu du site, et je peux aussi vous mettre en relation avec Titouan.';
    var it = intent(q); if (it) return it;
    if (!res.length) return 'Je n’ai pas trouvé de réponse précise sur le site. Le plus rapide est d’en parler directement : [appelez le ' + TEL + '](' + TEL_HREF + ') ou laissez votre numéro ci-dessous, Titouan vous rappelle.';
    var top = res[0].c, out = '';
    if (top.q) out += '**' + top.h + '**\n' + top.x + '\n\nSource : [' + top.t + '](' + top.u + ')';
    else out += 'Voici ce que j’ai trouvé : **' + (top.h || top.t) + '** — ' + top.x + '\n\n[Lire la page](' + top.u + ')';
    var more = res.slice(1).filter(function (r, i, a) { return r.c.u !== top.u && a.findIndex(function (x) { return x.c.u === r.c.u; }) === i; }).slice(0, 3);
    if (more.length) out += '\n\nÀ lire aussi :\n' + more.map(function (r) { return '- [' + r.c.t + '](' + r.c.u + ')'; }).join('\n');
    return out + '\n\nUne question plus précise ? [Appelez le ' + TEL + '](' + TEL_HREF + ') ou demandez à être rappelé.';
  }

  /* ── Interface ── */
  var css = '#gsA-btn{position:fixed;right:18px;bottom:18px;z-index:9998;display:flex;align-items:center;gap:10px;padding:13px 18px 13px 14px;border:0;border-radius:999px;background:#171613;color:#fff;font:800 14px/1 "Plus Jakarta Sans",Inter,system-ui,sans-serif;box-shadow:0 14px 34px rgba(0,0,0,.28);cursor:pointer;transition:transform .2s}#gsA-btn:hover{transform:translateY(-2px)}' +
    '#gsA-btn i{width:28px;height:28px;border-radius:50%;background:#E61E4D;display:grid;place-items:center;font-style:normal;font-size:15px;position:relative}#gsA-btn i::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(230,30,77,.5);animation:gsAp 2s infinite}@keyframes gsAp{0%{transform:scale(.9);opacity:1}100%{transform:scale(1.5);opacity:0}}' +
    '#gsA{position:fixed;right:18px;bottom:18px;z-index:9999;width:min(400px,calc(100vw - 24px));height:min(620px,calc(100vh - 36px));display:none;flex-direction:column;background:#fff;border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.3);overflow:hidden;font:15px/1.55 "Plus Jakarta Sans",Inter,system-ui,sans-serif;color:#171613}#gsA.open{display:flex}' +
    '#gsA header{background:#171613;color:#fff;padding:16px 18px;display:flex;align-items:center;gap:12px}#gsA header b{display:block;font-size:15px}#gsA header small{display:block;font-size:12px;color:#BDB9AE;margin-top:2px}#gsA header .x{margin-left:auto;background:none;border:0;color:#fff;font-size:22px;cursor:pointer;line-height:1}' +
    '#gsA .dot{width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.25);flex-shrink:0}#gsA .msgs{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#F7F6F3}' +
    '#gsA .m{max-width:88%;padding:10px 13px;border-radius:16px;font-size:14.5px}#gsA .m p{margin:0 0 6px}#gsA .m p:last-child{margin:0}#gsA .m ul{margin:4px 0;padding-left:18px}#gsA .m a{color:#C81E47;font-weight:700}#gsA .bot{background:#fff;border:1px solid #ECEAE3;align-self:flex-start;border-bottom-left-radius:4px}#gsA .me{background:#171613;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}' +
    '#gsA .chips{display:flex;flex-wrap:wrap;gap:6px}#gsA .chips button{border:1px solid #DFDCD2;background:#fff;border-radius:999px;padding:7px 11px;font:700 12.5px inherit;font-family:inherit;cursor:pointer;color:#171613}#gsA .chips button:hover{border-color:#E61E4D;color:#C81E47}' +
    '#gsA form.ask{display:flex;gap:8px;padding:12px;border-top:1px solid #ECEAE3;background:#fff}#gsA form.ask input{flex:1;min-width:0;border:1px solid #DFDCD2;border-radius:12px;padding:11px 12px;font:15px inherit;font-family:inherit}#gsA form.ask input:focus{outline:none;border-color:#E61E4D}#gsA form.ask button{border:0;border-radius:12px;background:#E61E4D;color:#fff;font-weight:800;padding:0 14px;cursor:pointer}' +
    '#gsA .cta{display:flex;gap:8px;padding:0 12px 12px;background:#fff}#gsA .cta a,#gsA .cta button{flex:1;text-align:center;border-radius:12px;padding:10px;font:800 13px inherit;font-family:inherit;text-decoration:none;cursor:pointer;border:1px solid #DFDCD2;background:#fff;color:#171613}#gsA .cta a.tel{background:#171613;color:#fff;border-color:#171613}' +
    '#gsA .cb{display:grid;gap:8px}#gsA .cb input{border:1px solid #DFDCD2;border-radius:10px;padding:9px 11px;font:14px inherit;font-family:inherit}#gsA .cb button{border:0;border-radius:10px;background:#E61E4D;color:#fff;font-weight:800;padding:10px;cursor:pointer}#gsA .cb .cbn{font-size:11.5px;color:#77736A;line-height:1.4}' +
    '#gsA .nb,#gsA .nb2{display:inline-block;border-radius:999px;padding:8px 12px;font:800 12.5px inherit;font-family:inherit;text-decoration:none;cursor:pointer}#gsA .nb{background:#E61E4D;color:#fff!important;border:0}#gsA .nb2{background:#fff;border:1px solid #DFDCD2;color:#171613}' +
    '#gsA-tip{position:fixed;right:18px;bottom:78px;z-index:9998;max-width:280px;background:#fff;border:1px solid #ECEAE3;border-radius:16px 16px 4px 16px;box-shadow:0 14px 40px rgba(0,0,0,.18);padding:12px 34px 12px 14px;font:600 13.5px/1.45 "Plus Jakarta Sans",Inter,system-ui,sans-serif;color:#171613;cursor:pointer;animation:gsAi .4s ease}#gsA-tip b{color:#C81E47}#gsA-tip .c{position:absolute;right:8px;top:6px;border:0;background:none;font-size:16px;color:#8C887E;cursor:pointer}@keyframes gsAi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@media(max-width:760px){body.gsA-sticky #gsA-tip{bottom:146px}#gsA-tip{bottom:72px;right:12px}}' +
    '#gsA .typing span{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:#8C887E;animation:gsAt 1s infinite}#gsA .typing span:nth-child(2){animation-delay:.15s}#gsA .typing span:nth-child(3){animation-delay:.3s}@keyframes gsAt{0%,80%,100%{opacity:.3}40%{opacity:1}}' +
    '#gsA .note{font-size:11px;color:#8C887E;text-align:center;padding:0 12px 8px;background:#fff}' +
    '.gsA-call{display:none}@media(max-width:760px){#gsA-btn span{display:none}#gsA-btn{padding:12px}body.gsA-sticky #gsA-btn{bottom:86px}#gsA{right:12px;bottom:12px}' +
    '.gsA-call{display:flex;position:fixed;left:10px;bottom:10px;z-index:9997;gap:8px;align-items:center;background:#171613;color:#fff;padding:12px 16px;border-radius:999px;font:800 14px "Plus Jakarta Sans",Inter,system-ui,sans-serif;text-decoration:none;box-shadow:0 12px 30px rgba(0,0,0,.25)}}' +
    '@media(prefers-reduced-motion:reduce){#gsA-btn i::after,#gsA .typing span{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var hasSticky = !!document.querySelector('.gs-sticky');
  if (hasSticky) document.body.classList.add('gsA-sticky');
  else { var call = document.createElement('a'); call.className = 'gsA-call'; call.href = TEL_HREF; call.innerHTML = ico('telephone') + TEL; document.body.appendChild(call); }

  var btn = document.createElement('button');
  btn.id = 'gsA-btn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Ouvrir l’assistant');
  btn.innerHTML = '<i>' + ico('etincelle').replace('margin-right:6px', 'margin:0') + '</i><span>Une question ?</span>';
  document.body.appendChild(btn);

  var place = document.querySelector('[data-live-place]');
  var pagePlace = place ? place.getAttribute('data-name') : null;
  // Commune de la page, sinon commune approximative du visiteur (assets/perso.js), si la personnalisation est active.
  function aN(n) { return /^Le /.test(n) ? 'au ' + n.slice(3) : /^Les /.test(n) ? 'aux ' + n.slice(4) : 'à ' + n; }
  function pn() { return pagePlace || (window.GSPerso && window.GSPerso.placeName) || null; }
  var panel = document.createElement('div');
  panel.id = 'gsA'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Assistant Groupe Solution');
  panel.innerHTML = '<header><span class="dot"></span><div><b>Assistant Groupe Solution</b><small>Assistant automatique · répond à partir du site</small></div><button class="x" type="button" aria-label="Fermer">×</button></header>' +
    '<div class="msgs" aria-live="polite"></div>' +
    '<form class="ask"><input name="q" placeholder="Votre question…" autocomplete="off" maxlength="600" aria-label="Votre question" /><button type="submit" aria-label="Envoyer">' + ico('envoyer').replace('margin-right:6px', 'margin:0') + '</button></form>' +
    '<div class="cta"><a class="tel" href="' + TEL_HREF + '">' + ico('telephone') + 'Appeler</a><button type="button" class="cbk">Être rappelé</button><a href="' + RDV + '">Visio 10 min</a></div>' +
    '<div class="note">Réponses automatiques, à vérifier avec nous. Les échanges sont conservés 30 jours pour mieux vous répondre, jamais revendus. <a href="/confidentialite.html">En savoir plus</a></div>';
  document.body.appendChild(panel);
  var msgs = panel.querySelector('.msgs'), form = panel.querySelector('form.ask'), input = form.q;
  var hist = store.get('gsA-h') || [], mode = store.get('gsA-mode') || 'api';

  function add(role, html, save) {
    var d = document.createElement('div'); d.className = 'm ' + (role === 'user' ? 'me' : 'bot'); d.innerHTML = html; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
  }
  function chips() {
    var list = pn() ? ['Que pouvez-vous automatiser ' + aN(pn()) + ' ?', 'Un site internet pour mon activité', 'Comment se passe un projet ?', 'Combien ça coûte ?']
      : ['Que peut faire un agent IA pour moi ?', 'Un site internet pour mon activité', 'Comment se passe un projet ?', 'Combien ça coûte ?'];
    var d = add('bot', '<div class="chips">' + list.map(function (c) { return '<button type="button">' + esc(c) + '</button>'; }).join('') + '</div>');
    d.style.background = 'transparent'; d.style.border = '0'; d.style.padding = '0';
    d.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { ask(b.textContent); }); });
  }
  function greet() {
    add('bot', md('Bonjour ! Je réponds à vos questions sur nos sites internet, nos automatisations et l’IA' + (pn() ? ', y compris pour **' + pn() + '**' : '') + '. Vous pouvez aussi appeler directement le [' + TEL + '](' + TEL_HREF + ').'));
    chips();
  }
  function restore() { hist.forEach(function (m) { add(m.role, m.role === 'user' ? esc(m.content) : md(m.content)); }); }

  function ask(q) {
    q = String(q || '').trim(); if (!q) return;
    add('user', esc(q)); input.value = '';
    var typing = add('bot', '<span class="typing"><span></span><span></span><span></span></span>');
    ga('assistant_question', { mode: mode });
    loadIndex().then(function () {
      var res = search(q, 8);
      var ctx = res.slice(0, 6).map(function (r) { return { u: r.c.u, t: r.c.t, h: r.c.h, x: r.c.x }; });
      var done = function (answer) { typing.remove(); add('bot', md(answer)); asked++; if (asked === 2) nudge(); else if (asked === 4) callback(); hist.push({ role: 'user', content: q }, { role: 'assistant', content: answer }); hist = hist.slice(-16); store.set('gsA-h', hist); };
      if (mode === 'local') return done(localAnswer(q, res));
      fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: q, page: location.pathname, context: ctx, sid: SID, src: (function () { try { return sessionStorage.getItem('gsSrc') || ''; } catch (e) { return ''; } })(), history: hist.slice(-8) }) })
        .then(function (r) { if (r.status === 503 || r.status === 404) { mode = 'local'; store.set('gsA-mode', 'local'); throw 0; } if (!r.ok) throw 0; return r.json(); })
        .then(function (d) { done(d.answer || localAnswer(q, res)); })
        .catch(function () { done(localAnswer(q, res)); });
    }).catch(function () { typing.remove(); add('bot', md('Je rencontre un souci technique. Appelez directement le [' + TEL + '](' + TEL_HREF + ').')); });
  }

  function callback() {
    var d = add('bot', '<form class="cb"><b>Titouan vous rappelle au plus vite.</b><input name="nom" placeholder="Votre prénom" required autocomplete="given-name" /><input name="telephone" type="tel" placeholder="Votre téléphone" required autocomplete="tel" /><button type="submit">Être rappelé</button><small class="cbn">La conversation ci-dessus est jointe à votre demande, pour vous rappeler sans vous faire tout répéter.</small></form>');
    var f = d.querySelector('form');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(f); fd.append('page', location.pathname); fd.append('source', 'assistant'); fd.append('sid', SID);
      fd.append('conversation', hist.map(function (m) { return (m.role === 'user' ? 'Visiteur : ' : 'Assistant : ') + m.content; }).join('\n').slice(-3000));
      f.querySelector('button').textContent = 'Envoi…';
      fetch(FORM, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }).then(function (r) {
        if (!r.ok) throw 0; d.innerHTML = ico('check') + md('C’est noté, merci ! Titouan vous rappelle au plus vite. Pour une urgence : [' + TEL + '](' + TEL_HREF + ').'); ga('generate_lead', { method: 'assistant_callback' });
      }).catch(function () { d.innerHTML = md('L’envoi n’a pas abouti. Appelez directement le [' + TEL + '](' + TEL_HREF + ').'); });
    });
    d.querySelector('input').focus();
  }

  var asked = 0;
  function nudge() {
    var d = add('bot', md('Vous avez un projet précis ? **Dix minutes avec Titouan** suffisent souvent pour trouver des pistes concrètes — gratuit, sans engagement.') + '<div class="chips" style="margin-top:8px"><a class="nb" href="' + TEL_HREF + '">' + ico('telephone') + 'Appeler maintenant</a><button type="button" class="nb2">Être rappelé</button></div>');
    d.querySelector('.nb2').addEventListener('click', callback); ga('assistant_nudge');
  }
  var started = false;
  function open() {
    panel.classList.add('open'); btn.style.display = 'none';
    if (!started) { started = true; if (hist.length) restore(); else greet(); loadIndex(); }
    setTimeout(function () { input.focus(); }, 60); ga('assistant_open');
  }
  function close() { panel.classList.remove('open'); btn.style.display = ''; }
  btn.addEventListener('click', open);
  // reply(q, history) : même cerveau que le widget (index du site + Claude, repli local gratuit), utilisé par le chat de l'accueil.
  function reply(q, history, opts) {
    // Accueil + IA active : pas besoin de l'index du site (1,3 Mo) — l'IA connaît le plan du site.
    // L'index n'est chargé qu'en mode secours (sans IA ou en cas d'erreur).
    if (opts && opts.mode === 'accueil' && mode !== 'local') {
      return fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: q, page: location.pathname, context: [], sid: SID, src: (function () { try { return sessionStorage.getItem('gsSrc') || ''; } catch (e) { return ''; } })(), history: (history || []).slice(-10), mode: 'accueil' }) })
        .then(function (r) { if (r.status === 503 || r.status === 404) { mode = 'local'; store.set('gsA-mode', 'local'); throw 0; } if (!r.ok) throw 0; return r.json(); })
        .then(function (d) { if (!d.answer) throw 0; return { answer: d.answer, fiche: d.fiche || null, ruptures: d.ruptures || null, memo: d.memo || null }; })
        .catch(function () { return loadIndex().then(function () { return { answer: localAnswer(q, search(q, 8)), local: true }; }); });
    }
    return loadIndex().then(function () {
      var res = search(q, 8);
      var ctx = res.slice(0, 6).map(function (r) { return { u: r.c.u, t: r.c.t, h: r.c.h, x: r.c.x }; });
      if (mode === 'local') return { answer: localAnswer(q, res), local: true };
      return fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: q, page: location.pathname, context: ctx, sid: SID, src: (function () { try { return sessionStorage.getItem('gsSrc') || ''; } catch (e) { return ''; } })(), history: (history || []).slice(-10), mode: (opts && opts.mode) || 'widget' }) })
        .then(function (r) { if (r.status === 503 || r.status === 404) { mode = 'local'; store.set('gsA-mode', 'local'); throw 0; } if (!r.ok) throw 0; return r.json(); })
        .then(function (d) { return { answer: d.answer || localAnswer(q, res), fiche: d.fiche || null, memo: d.memo || null }; })
        .catch(function () { return { answer: localAnswer(q, res), local: true }; });
    });
  }
  window.GSAssistant = { sid: SID, open: open, callback: function () { open(); callback(); }, ask: function (q) { open(); ask(q); }, reply: reply, md: md };
  document.dispatchEvent(new Event('gs-assistant-ready'));
  panel.querySelector('.x').addEventListener('click', close);
  panel.querySelector('.cbk').addEventListener('click', callback);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  /* Bulle d'accueil proactive (une fois par session, après 25 s) */
  if (!store.get('gsA-tip') && !document.getElementById('aiBox')) setTimeout(function () {
    if (panel.classList.contains('open')) return;
    var t = document.createElement('div'); t.id = 'gsA-tip'; t.setAttribute('role', 'button');
    t.innerHTML = (pn() ? 'Un projet <b>' + esc(aN(pn())) + '</b> ? ' : 'Un projet ? ') + 'Posez votre question, je réponds tout de suite — ou appelez Titouan.<button class="c" type="button" aria-label="Fermer">×</button>';
    document.body.appendChild(t); store.set('gsA-tip', 1); ga('assistant_tip');
    t.addEventListener('click', function (e) { if (e.target.classList.contains('c')) { t.remove(); return; } t.remove(); open(); });
    setTimeout(function () { if (t.parentNode) t.remove(); }, 15000);
  }, 25000);
  document.querySelectorAll('[data-open-assistant]').forEach(function (el) { el.addEventListener('click', function (e) { e.preventDefault(); open(); }); });
})();
