/* Réalisations ajoutées par Titouan depuis son tableau de bord : affichées ici sans rebuild du site.
   <div data-real="grille|bande" data-max="6"></div> — le bloc parent [data-real-wrap] reste masqué s'il n'y a rien. */
(function () {
  var zones = document.querySelectorAll('[data-real]'); if (!zones.length) return;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  fetch('/api/devis?real=1').then(function (r) { return r.ok ? r.json() : { items: [] }; }).then(function (j) {
    var items = (j.items || []); if (!items.length) return;
    [].forEach.call(zones, function (z) {
      var max = +z.getAttribute('data-max') || 24, list = items.slice(0, max);
      z.innerHTML = list.map(function (x) {
        var meta = [x.secteur, x.lieu, x.annee].filter(Boolean).join(' · '), host = x.lien ? x.lien.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : '';
        return '<article class="rlCard">' + (x.lien ? '<a href="' + esc(x.lien) + '" target="_blank" rel="noopener" aria-label="' + esc(x.titre) + '">' : '<div>') +
          '<div class="rlPh">' + (x.img ? '<img src="/api/devis?img=' + x.id + '&amp;v=' + x.img + '" alt="' + esc(x.titre) + '" loading="lazy" width="800" height="600">' : '<span>' + esc(x.titre.charAt(0)) + '</span>') + '</div>' +
          '<div class="rlTx">' + (meta ? '<small>' + esc(meta) + '</small>' : '') + '<h3>' + esc(x.titre) + '</h3>' + (x.texte ? '<p>' + esc(x.texte) + '</p>' : '') + (host ? '<span class="rlLk">' + esc(host) + ' ↗</span>' : '') + '</div>' + (x.lien ? '</a>' : '</div>') + '</article>';
      }).join('');
      var w = z.closest('[data-real-wrap]'); if (w) w.hidden = false;
    });
    var ld = document.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Réalisations de Groupe Solution', itemListElement: items.map(function (x, i) { return { '@type': 'ListItem', position: i + 1, item: { '@type': 'CreativeWork', name: x.titre, description: x.texte || undefined, url: x.lien || undefined, image: x.img ? location.origin + '/api/devis?img=' + x.id + '&v=' + x.img : undefined, creator: { '@type': 'Organization', name: 'Groupe Solution' } } }; }) });
    document.head.appendChild(ld);
  }).catch(function () {});
})();
