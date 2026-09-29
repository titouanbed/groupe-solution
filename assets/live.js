/* ═══════════════════════════════════════════════════════════
   Groupe Solution — données EN DIRECT via API ouvertes (exécutées dans le
   navigateur du visiteur, aucune clé, aucun cookie).
   • [data-live-place]  : météo (Open-Meteo), mer (Open-Meteo Marine),
                          données officielles de la commune (geo.api.gouv.fr).
   • #demoEntreprise    : API Recherche d'entreprises (SIRENE, État).
   • #demoAdresse       : Base Adresse Nationale (autocomplétion).
   • #demoMeteo         : géocodage BAN + prévisions Open-Meteo.
   • #demoFeries        : jours fériés (calendrier.api.gouv.fr).
   Chaque bloc se masque proprement si le service ne répond pas.
   ═══════════════════════════════════════════════════════════ */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var nf = new Intl.NumberFormat('fr-FR');
  function getJSON(url, ms) {
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 7000);
    return fetch(url, { signal: ctrl ? ctrl.signal : undefined, headers: { Accept: 'application/json' } })
      .then(function (r) { clearTimeout(t); if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  /* Codes météo WMO → libellé + pictogramme */
  var WMO = { 0: ['Ciel dégagé', '☀️'], 1: ['Plutôt dégagé', '🌤️'], 2: ['Partiellement nuageux', '⛅'], 3: ['Couvert', '☁️'], 45: ['Brouillard', '🌫️'], 48: ['Brouillard givrant', '🌫️'],
    51: ['Bruine légère', '🌦️'], 53: ['Bruine', '🌦️'], 55: ['Bruine forte', '🌧️'], 61: ['Pluie faible', '🌦️'], 63: ['Pluie', '🌧️'], 65: ['Pluie forte', '🌧️'],
    71: ['Neige faible', '🌨️'], 73: ['Neige', '🌨️'], 75: ['Neige forte', '❄️'], 80: ['Averses', '🌦️'], 81: ['Averses', '🌧️'], 82: ['Fortes averses', '⛈️'], 95: ['Orage', '⛈️'], 96: ['Orage et grêle', '⛈️'], 99: ['Orage et grêle', '⛈️'] };
  var wmo = function (c) { return WMO[c] || ['—', '🌡️']; };
  var DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

  function meteo(lat, lng) {
    return getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng +
      '&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FParis&forecast_days=4');
  }
  function marine(lat, lng) {
    return getJSON('https://marine-api.open-meteo.com/v1/marine?latitude=' + lat + '&longitude=' + lng + '&hourly=wave_height,sea_surface_temperature&timezone=Europe%2FParis&forecast_days=1');
  }
  function meteoHTML(d) {
    var c = d.current, w = wmo(c.weather_code), days = '';
    for (var i = 1; i < d.daily.time.length; i++) {
      var dt = new Date(d.daily.time[i] + 'T12:00:00'), ww = wmo(d.daily.weather_code[i]);
      days += '<div class="lv-day"><span>' + DAYS[dt.getDay()] + '</span><b>' + ww[1] + '</b><span>' + Math.round(d.daily.temperature_2m_min[i]) + '° / ' + Math.round(d.daily.temperature_2m_max[i]) + '°</span></div>';
    }
    return '<div class="lv-now"><span class="lv-ico">' + w[1] + '</span><div><b>' + Math.round(c.temperature_2m) + ' °C</b><span>' + esc(w[0]) + ' · ressenti ' + Math.round(c.apparent_temperature) + ' °C</span><span>Vent ' + Math.round(c.wind_speed_10m) + ' km/h · humidité ' + c.relative_humidity_2m + ' %</span></div></div><div class="lv-days">' + days + '</div>';
  }

  /* ── Bloc « En direct » des pages communes ── */
  document.querySelectorAll('[data-live-place]').forEach(function (box) {
    var lat = box.dataset.lat, lng = box.dataset.lng, cp = box.dataset.cp, nom = box.dataset.name, seaEl = $('[data-lv=mer]', box), comEl = $('[data-lv=commune]', box), metEl = $('[data-lv=meteo]', box);
    var shown = 0, done = function (ok) { if (ok) { shown++; box.hidden = false; } };
    meteo(lat, lng).then(function (d) { metEl.innerHTML = meteoHTML(d); done(true); }).catch(function () { metEl.closest('.lv-card').remove(); });
    if (seaEl) marine(box.dataset.seaLat || lat, box.dataset.seaLng || lng).then(function (d) {
      var h = new Date().getHours(), wave = d.hourly.wave_height[h], sst = d.hourly.sea_surface_temperature ? d.hourly.sea_surface_temperature[h] : null;
      if (wave == null && sst == null) throw 0;
      seaEl.innerHTML = '<div class="lv-now"><span class="lv-ico">🌊</span><div>' + (sst != null ? '<b>' + Math.round(sst) + ' °C</b><span>température de la mer</span>' : '') + (wave != null ? '<span>Houle ' + wave.toFixed(1).replace('.', ',') + ' m</span>' : '') + '</div></div>';
      done(true);
    }).catch(function () { seaEl.closest('.lv-card').remove(); });
    if (comEl && cp) getJSON('https://geo.api.gouv.fr/communes?codePostal=' + cp + '&fields=nom,code,population,surface,codeDepartement,epci&format=json').then(function (list) {
      var norm = function (s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, ''); };
      var target = norm(box.dataset.insee || nom), c = list.filter(function (x) { return norm(x.nom) === target; })[0] || (list.length === 1 ? list[0] : null);
      if (!c || !c.population) throw 0;
      var dens = c.surface ? Math.round(c.population / (c.surface / 100)) : null;
      comEl.innerHTML = '<div class="lv-now"><span class="lv-ico">🏛️</span><div><b>' + nf.format(c.population) + ' habitants</b><span>Code INSEE ' + esc(c.code) + (dens ? ' · ' + nf.format(dens) + ' hab./km²' : '') + '</span>' + (c.epci && c.epci.nom ? '<span>' + esc(c.epci.nom) + '</span>' : '') + '</div></div>';
      done(true);
    }).catch(function () { comEl.closest('.lv-card').remove(); });
  });

  /* ── Démo 1 : vérifier une entreprise (API Recherche d'entreprises) ── */
  var de = $('#demoEntreprise');
  if (de) {
    var inp = $('input', de), out = $('.demoOut', de), tmr;
    inp.addEventListener('input', function () {
      clearTimeout(tmr); var q = inp.value.trim();
      if (q.length < 3) { out.innerHTML = ''; return; }
      tmr = setTimeout(function () {
        out.innerHTML = '<p class="demoWait">Interrogation du registre public…</p>';
        getJSON('https://recherche-entreprises.api.gouv.fr/search?q=' + encodeURIComponent(q) + '&per_page=5').then(function (d) {
          if (!d.results || !d.results.length) { out.innerHTML = '<p class="demoWait">Aucun résultat.</p>'; return; }
          out.innerHTML = d.results.map(function (e) {
            var s = e.siege || {};
            return '<div class="demoRow"><b>' + esc(e.nom_complet) + '</b><span>SIREN ' + esc(e.siren) + ' · ' + esc(s.libelle_commune || '') + ' · créée le ' + esc(e.date_creation || '—') + '</span><span>' + (e.etat_administratif === 'A' ? '✅ Active' : '⛔ Cessée') + ' · ' + esc(e.activite_principale || '') + (e.tranche_effectif_salarie ? ' · tranche d’effectif ' + esc(e.tranche_effectif_salarie) : '') + '</span></div>';
          }).join('');
        }).catch(function () { out.innerHTML = '<p class="demoWait">Le service public ne répond pas pour le moment. Réessayez dans un instant.</p>'; });
      }, 450);
    });
  }

  /* ── Démo 2 : autocomplétion d'adresse (BAN) ── */
  var da = $('#demoAdresse');
  if (da) {
    var ia = $('input', da), oa = $('.demoOut', da), ta;
    ia.addEventListener('input', function () {
      clearTimeout(ta); var q = ia.value.trim();
      if (q.length < 4) { oa.innerHTML = ''; return; }
      ta = setTimeout(function () {
        getJSON('https://api-adresse.data.gouv.fr/search/?q=' + encodeURIComponent(q) + '&limit=5').then(function (d) {
          oa.innerHTML = (d.features || []).map(function (f) {
            var p = f.properties, g = f.geometry.coordinates;
            return '<div class="demoRow"><b>' + esc(p.label) + '</b><span>Code INSEE ' + esc(p.citycode) + ' · GPS ' + g[1].toFixed(5) + ', ' + g[0].toFixed(5) + ' · fiabilité ' + Math.round(p.score * 100) + ' %</span></div>';
          }).join('') || '<p class="demoWait">Aucune adresse trouvée.</p>';
        }).catch(function () { oa.innerHTML = '<p class="demoWait">Le service ne répond pas pour le moment.</p>'; });
      }, 300);
    });
  }

  /* ── Démo 3 : météo d'une commune ── */
  var dm = $('#demoMeteo');
  if (dm) {
    var im = $('input', dm), om = $('.demoOut', dm), bm = $('button', dm);
    var go = function () {
      var q = im.value.trim(); if (!q) return;
      om.innerHTML = '<p class="demoWait">Géocodage puis prévisions…</p>';
      getJSON('https://api-adresse.data.gouv.fr/search/?q=' + encodeURIComponent(q) + '&type=municipality&limit=1').then(function (d) {
        var f = d.features && d.features[0]; if (!f) throw new Error('none');
        var g = f.geometry.coordinates;
        return meteo(g[1], g[0]).then(function (m) { om.innerHTML = '<p class="demoWait">' + esc(f.properties.label) + '</p>' + meteoHTML(m); });
      }).catch(function () { om.innerHTML = '<p class="demoWait">Commune introuvable ou service indisponible.</p>'; });
    };
    bm.addEventListener('click', go); im.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  }

  /* ── Démo 4 : jours fériés ── */
  var df = $('#demoFeries');
  if (df) {
    var y = new Date().getFullYear();
    getJSON('https://calendrier.api.gouv.fr/jours-feries/metropole/' + y + '.json').then(function (d) {
      var today = new Date().toISOString().slice(0, 10);
      $('.demoOut', df).innerHTML = Object.keys(d).map(function (k) {
        var past = k < today, dt = new Date(k + 'T12:00:00');
        return '<div class="demoRow' + (past ? ' past' : '') + '"><b>' + esc(d[k]) + '</b><span>' + dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + '</span></div>';
      }).join('');
    }).catch(function () { $('.demoOut', df).innerHTML = '<p class="demoWait">Service momentanément indisponible.</p>'; });
  }
})();
