/* « Pour vous » (accueil, sous le chat) : le bloc s'adapte à qui visite.
   Sources, par ordre de priorité : métier choisi par le visiteur (puces) → entreprise analysée ou métier
   évoqué dans le chat → zone approximative (déduite par l'hébergeur, jamais enregistrée).
   Si le visiteur a refusé l'adaptation (gs-perso-off), seul son choix explicite est pris en compte. */
(function () {
  var box = document.getElementById('pourvous'); if (!box) return;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ls = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } };
  var off = function () { try { return !!(localStorage.getItem('gs-perso-off') || sessionStorage.getItem('gs-perso-off')); } catch (e) { return false; } };

  // Métiers : idées concrètes, sans chiffre inventé, chacune reliée à une page utile.
  var M = {
    restaurant: { n: 'Restaurant', un: 'un restaurant', re: /restau|brasserie|pizz|traiteur|\bbar\b|caf[ée]|boulang|p[âa]tiss|cuisine|snack|food/i, p: 'idees/restaurant.html', d: 'demos/#resa', i: [
      ['Réservations prises même en plein service', 'Un agent répond au téléphone et en ligne, note la table et confirme par SMS.', 'services/agent-vocal-ia.html'],
      ['Des réponses soignées à chaque avis Google', 'Rédigées dans votre ton, validées en un clic : votre note travaille pour vous.', 'demos/#avis'],
      ['Factures fournisseurs saisies toutes seules', 'Photographiées, lues, vérifiées et envoyées à votre comptabilité.', 'demos/#facture']] },
    artisan: { n: 'Artisan · BTP', un: 'un artisan', re: /artisan|plomb|[ée]lectric|ma[çc]on|menuis|peint|couvr|chauffag|btp|b[âa]timent|r[ée]nov|enseign|signal[ée]t|charpent|carrel|serrur|paysag/i, p: 'idees/artisan.html', d: 'demos/#facture', i: [
      ['Vos devis prêts depuis le chantier', 'Vous décrivez à l’oral, le devis se prépare avec vos tarifs et part au client.', 'services/automatisation-processus.html'],
      ['Relances de devis et de factures automatiques', 'Polies, au bon moment, jusqu’à la signature ou au paiement.', 'services/automatisation-entreprise.html'],
      ['Plus aucun appel manqué les mains occupées', 'L’agent vocal prend le message, qualifie la demande et vous l’envoie.', 'services/agent-vocal-ia.html']] },
    sante: { n: 'Santé', un: 'un cabinet de santé', re: /m[ée]decin|kin[ée]|dentist|infirm|ost[ée]o|sant[ée]|pharmac|psy|orthophon|v[ée]t[ée]rin|sage-femme|podolog|cabinet m[ée]dical/i, p: 'idees/professionnel-de-sante.html', d: 'demos/#resa', i: [
      ['Rendez-vous et rappels sans secrétariat saturé', 'Prise de rendez-vous en ligne et au téléphone, rappels automatiques, moins d’absences.', 'services/agent-vocal-ia.html'],
      ['Un accueil téléphonique qui ne sonne jamais dans le vide', 'Il répond aux questions pratiques et oriente les urgences vers vous.', 'services/agent-ia-chatbot.html'],
      ['Courriers et documents classés tout seuls', 'Comptes rendus, ordonnances reçues, factures : lus et rangés au bon endroit.', 'demos/#facture']] },
    commerce: { n: 'Commerce', un: 'un commerce', re: /boutique|commerce|magasin|vente|e-commerce|[ée]picer|fleur|opticien|librair|pr[êe]t-[àa]-porter/i, p: 'idees/commerce-boutique.html', d: 'demos/#avis', i: [
      ['Une fiche Google qui fait venir en boutique', 'Horaires justes, photos, avis traités : vous êtes choisi quand on cherche près de soi.', 'services/referencement-local.html'],
      ['Stock et commandes reliés à votre caisse', 'Alertes de réassort, commandes fournisseurs préparées, fini les ruptures surprises.', 'services/integration-api-connecteurs.html'],
      ['Clients fidèles relancés au bon moment', 'Messages personnalisés selon les achats, sans y passer vos soirées.', 'services/automatisation-entreprise.html']] },
    immobilier: { n: 'Immobilier', un: 'une agence immobilière', re: /immobili|syndic|gestion locative|transaction|agent co/i, p: 'idees/agence-immobiliere.html', d: 'demos/#resa', i: [
      ['Chaque demande de visite qualifiée en direct', 'Budget, critères, disponibilités : l’agent trie et propose les créneaux.', 'services/agent-ia-chatbot.html'],
      ['Annonces rédigées et diffusées en un geste', 'À partir de vos notes et photos, sur tous vos supports.', 'services/automatisation-processus.html'],
      ['Dossiers locataires complets, sans relances', 'Pièces demandées, vérifiées et classées automatiquement.', 'demos/#facture']] },
    beaute: { n: 'Beauté · coiffure', un: 'un salon', re: /coiff|esth[ée]ti|beaut[ée]|onglerie|spa\b|barbier|institut|massage/i, p: 'idees/coiffeur-esthetique.html', d: 'demos/#resa', i: [
      ['Un agenda qui se remplit tout seul', 'Réservation en ligne et au téléphone, rappels la veille, créneaux libérés reproposés.', 'services/agent-vocal-ia.html'],
      ['Des avis clients qui arrivent naturellement', 'Un message au bon moment après le rendez-vous, et une réponse à chacun.', 'demos/#avis'],
      ['Vos clientes fidèles relancées', 'Au rythme de leurs habitudes, avec la bonne attention.', 'services/automatisation-entreprise.html']] },
    hebergement: { n: 'Hébergement', un: 'un hébergement', re: /h[ôo]tel|g[îi]te|chambre d.h[ôo]te|camping|saisonni|h[ée]bergement|location de vacances|r[ée]sidence/i, p: 'idees/hebergement-gite.html', d: 'demos/#resa', i: [
      ['Réservations en direct, moins de commissions', 'Un site qui convertit et un agent qui répond aux questions, jour et nuit.', 'services/creation-site-internet.html'],
      ['Arrivées et départs sans aller-retour', 'Codes, consignes et livret d’accueil envoyés au bon moment, dans la bonne langue.', 'services/automatisation-processus.html'],
      ['Chaque avis reçoit sa réponse', 'Soignée, dans votre ton, validée en un clic.', 'demos/#avis']] },
    cabinet: { n: 'Cabinet · conseil', un: 'un cabinet', re: /comptab|avocat|notaire|conseil|expert|assurance|courtier|juridique|gestion de patrimoine/i, p: 'idees/expert-comptable.html', d: 'demos/#facture', i: [
      ['Les pièces clients collectées sans relances', 'Demandées, reçues, vérifiées et classées automatiquement.', 'demos/#facture'],
      ['Un assistant qui connaît vos dossiers', 'Il retrouve la bonne information dans vos documents, en quelques secondes.', 'services/agent-ia-entreprise-exemples.html'],
      ['Des tâches récurrentes qui se font seules', 'Échéances, courriers types, comptes rendus : préparés pour relecture.', 'services/automatisation-processus.html']] },
    transport: { n: 'Transport', un: 'une entreprise de transport', re: /transport|logisti|livraison|taxi|vtc|d[ée]m[ée]nag|coursier|fret/i, p: 'idees/transport-logistique.html', d: 'demos/#facture', i: [
      ['Bons de livraison lus et saisis tout seuls', 'Photo du bon, données dans votre outil, facture prête.', 'demos/#facture'],
      ['Clients prévenus automatiquement', 'Départ, retard, livraison : le bon message part au bon moment.', 'services/automatisation-entreprise.html'],
      ['Planning et tournées dans un seul outil', 'Un logiciel simple, pensé pour vos chauffeurs et votre exploitation.', 'services/logiciel-de-gestion-sur-mesure.html']] },
    industrie: { n: 'Industrie · atelier', un: 'une PME industrielle', re: /industri|usine|fabrication|atelier|production|usinage|m[ée]tallurg|plasturg/i, p: 'idees/industrie-pme.html', d: 'demos/#facture', i: [
      ['Devis techniques préparés plus vite', 'Vos règles de calcul dans un outil, pour répondre avant les autres.', 'services/logiciel-sur-mesure-pme.html'],
      ['Commandes et bons saisis sans ressaisie', 'Lus automatiquement et envoyés dans votre ERP.', 'demos/#facture'],
      ['Suivi de production visible en temps réel', 'Un tableau de bord clair, alimenté par vos outils existants.', 'services/integration-api-connecteurs.html']] },
    formation: { n: 'Formation · sport', un: 'un organisme de formation', re: /formation|[ée]cole|organisme|coach|salle de sport|fitness|enseignement|cours/i, p: 'idees/organisme-de-formation.html', d: 'demos/#resa', i: [
      ['Inscriptions et documents gérés tout seuls', 'Dossiers complets, conventions et attestations générées automatiquement.', 'services/automatisation-processus.html'],
      ['Un assistant qui répond aux futurs inscrits', 'Programmes, dates, financements : réponses justes, jour et nuit.', 'services/agent-ia-chatbot.html'],
      ['Relances et rappels sans y penser', 'Séances, pièces manquantes, paiements : chaque rappel part à temps.', 'services/automatisation-entreprise.html']] },
    garage: { n: 'Garage', un: 'un garage', re: /garage|mécani|m[ée]cani|carrosserie|contr[ôo]le technique|pneu/i, p: 'idees/garage-automobile.html', d: 'demos/#resa', i: [
      ['Rendez-vous atelier pris au téléphone et en ligne', 'L’agent note le véhicule, le besoin et propose un créneau.', 'services/agent-vocal-ia.html'],
      ['Clients prévenus quand la voiture est prête', 'Avec le devis complémentaire à valider en un clic.', 'services/automatisation-entreprise.html'],
      ['Rappels d’entretien qui font revenir', 'Au bon kilométrage, au bon moment.', 'services/automatisation-processus.html']] }
  };
  var DEF = null; // contenu par défaut : celui déjà présent dans la page (sobre, sans adaptation)
  var DOM = { RE: ['reunion', 'La Réunion', 'à La Réunion'], YT: ['mayotte', 'Mayotte', 'à Mayotte'], GP: ['guadeloupe', 'Guadeloupe', 'en Guadeloupe'], MQ: ['martinique', 'Martinique', 'en Martinique'], GF: ['guyane', 'Guyane', 'en Guyane'], NC: ['nouvelle-caledonie', 'Nouvelle-Calédonie', 'en Nouvelle-Calédonie'], PF: ['polynesie-francaise', 'Polynésie française', 'en Polynésie française'] };
  var st = { m: null, src: '', lieu: null, dom: null };

  function detect(t) { for (var k in M) if (M[k].re.test(t || '')) return k; return null; }
  function chips() {
    $('pvChips').innerHTML = Object.keys(M).map(function (k) { return '<button type="button" data-m="' + k + '"' + (st.m === k ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + '>' + esc(M[k].n) + '</button>'; }).join('');
    [].forEach.call($('pvChips').children, function (b) { b.onclick = function () { var k = b.getAttribute('data-m'); if (st.m === k && st.src === 'choix') { ls('gs-metier', null); st.m = null; st.src = ''; } else { ls('gs-metier', k); st.m = k; st.src = 'choix'; } paint(true); if (window.gtag) gtag('event', 'home_pourvous_metier', { metier: k }); }; });
  }
  function paint(anim) {
    var list = $('pvList');
    var go = function () {
      var m = st.m && M[st.m], lieu = st.lieu;
      if (!m && !lieu) { $('pvKick').textContent = DEF.kick; $('pvTitle').innerHTML = DEF.title; list.innerHTML = DEF.list; $('pvAct').innerHTML = DEF.act; }
      else {
        $('pvKick').textContent = 'Pour vous' + (m ? ' · ' + m.n : '') + (lieu ? ' · ' + lieu : '');
        $('pvTitle').innerHTML = m ? 'Pour ' + esc(m.un) + (lieu ? ' ' + esc(st.lieuDe) : '') + ', voici <i>par où nous commencerions</i>.' : esc(cap(st.lieuDe)) + ', voici ce que nous construisons <i>le plus souvent</i>.';
        if (m) {
          list.innerHTML = m.i.map(function (x) { return '<li><a href="' + x[2] + '"><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></a></li>'; }).join('');
          $('pvAct').innerHTML = '<a class="btn dark" href="' + m.d + '">Essayer la démo</a><a class="edLink" href="' + m.p + '">Toutes les idées pour ' + esc(m.un) + '</a><a class="edLink" href="#heroAI" id="pvAsk">En parler dans le chat</a>';
          var a = $('pvAsk'); if (a) a.onclick = function () { var i = document.getElementById('aiInput'); if (i) { i.value = 'Je suis ' + m.un + (lieu ? ' ' + st.lieuDe : '') + '. '; setTimeout(function () { i.focus(); }, 400); } };
        } else { list.innerHTML = DEF.list; $('pvAct').innerHTML = DEF.act + (st.dom ? '<a class="edLink" href="' + st.dom + '/automatisation-' + st.dom + '.html">Nos solutions ' + esc(st.lieuDe) + '</a>' : ''); }
      }
      // Photo : le territoire du visiteur en outre-mer, sinon l'atelier.
      var img = $('pvImg'), src = st.dom ? (st.dom === 'mayotte' ? 'assets/mayotte-900.webp' : 'assets/' + st.dom + '/hero-900.webp') : 'assets/visuel-solutions-900.webp';
      if (img.getAttribute('src') !== src) { img.style.opacity = 0; img.onload = function () { img.style.opacity = 1; }; img.src = src; img.alt = st.dom ? 'Paysage ' + st.lieuDe : DEF.alt; }
      $('pvCap').textContent = st.dom === 'mayotte' ? 'Mayotte, où Titouan est installé.' : st.dom ? cap(st.lieu) + '.' : '';
      var why = $('pvWhy'); why.hidden = !(m || lieu); $('pvWhyTx').hidden = true;
      chips(); list.style.opacity = 1;
    };
    if (anim) { list.style.opacity = 0; setTimeout(go, 220); } else go();
  }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  $('pvWhy').onclick = function () {
    var t = $('pvWhyTx'), parts = [];
    if (st.src === 'choix') parts.push('le métier que vous avez choisi (gardé sur cet appareil)'); else if (st.src === 'chat') parts.push('ce que vous avez dit dans le chat');
    if (st.lieu) parts.push('votre zone approximative, déduite par notre hébergeur et jamais enregistrée');
    t.innerHTML = 'Adapté selon ' + esc(parts.join(' et ')) + '. <label style="display:inline-flex;gap:6px;align-items:center;margin:0 10px 0 0">Vous êtes ailleurs ? <select id="pvLieu" style="font:inherit;border:1px solid var(--line2);border-radius:8px;padding:3px 6px;background:#fff"><option value="">Choisir…</option><option value="MTP">Montpellier et Hérault</option><option value="YT">Mayotte</option><option value="RE">La Réunion</option><option value="GP">Guadeloupe</option><option value="MQ">Martinique</option><option value="GF">Guyane</option><option value="NC">Nouvelle-Calédonie</option><option value="PF">Polynésie française</option><option value="FR">Ailleurs en France</option></select></label><button type="button" id="pvOff">Ne plus adapter</button>';
    $('pvLieu').onchange = function () { if (!this.value) return; ls('gs-lieu', this.value); location.reload(); };
    t.hidden = !t.hidden;
    $('pvOff').onclick = function () { try { localStorage.setItem('gs-perso-off', '1'); sessionStorage.setItem('gs-perso-off', '1'); } catch (e) {} ls('gs-metier', null); st = { m: null, src: '', lieu: null, dom: null }; paint(true); };
  };

  DEF = { kick: $('pvKick').textContent, title: $('pvTitle').innerHTML, list: $('pvList').innerHTML, act: $('pvAct').innerHTML, alt: $('pvImg').alt };
  var saved = ls('gs-metier'); if (saved && M[saved]) { st.m = saved; st.src = 'choix'; }
  paint(false);
  if (off()) return;
  // Le chat fait connaître le métier : la page suit, sans rien enregistrer.
  document.addEventListener('gs:ctx', function (e) {
    if (st.src === 'choix' || off()) return;
    var k = detect(e.detail && e.detail.texte); if (k && k !== st.m) { st.m = k; st.src = 'chat'; paint(true); }
  });
  (window.gsGeo = window.gsGeo || fetch('/api/geo').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }).then(window.gsGeoFix || function (g) { return g; })).then(function (g) {
    if (!g || off()) return;
    var d = DOM[g.country];
    if (d) { st.lieu = d[1]; st.lieuDe = d[2]; st.dom = d[0]; }
    else if (g.country === 'FR' && g.city) { st.lieu = g.city; st.lieuDe = 'à ' + g.city; }
    else return;
    paint(true);
  });
})();
