/* Icônes Groupe Solution — trait 1,8 px, 24 × 24, couleur héritée (currentColor).
   window.GSIcon('nom', 'classe') → chaîne <svg>. Noms utilisables aussi par l'IA (plans, esquisses). */
(function () {
  var P = {
    recherche: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    idee: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.7.6 1.1 1.4 1.1 2.4h5.4c0-1 .4-1.8 1.1-2.4A6 6 0 0 0 12 3z"/>',
    esquisse: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 13h5M8 16h8"/>',
    devis: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 15.5h5M10 8.5h2"/>',
    telephone: '<path d="M6.5 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/>',
    rappel: '<path d="M6.5 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/><path d="M15 3.5a5.5 5.5 0 0 1 5.5 5.5M15 7a2 2 0 0 1 2 2"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    site: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.6 5.3 3.6 8.5s-1.1 6.1-3.6 8.5c-2.5-2.4-3.6-5.3-3.6-8.5S9.5 5.9 12 3.5z"/>',
    lieu: '<path d="M12 21s-6.5-6-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.3"/>',
    fleche: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    fusee: '<path d="M9.5 14.5 7 12c1.2-4.3 4.5-7.8 11.5-9-.8 7-4.6 10.3-9 11.5z"/><path d="M7 12H4l2.5-3.5H10M12 17v3l3.5-2.5V14"/><circle cx="14.5" cy="9" r="1.4"/>',
    document: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    calendrier: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    message: '<path d="M4 5.5h16v11H9l-4 3.5v-3.5H4z"/><path d="M8 10h8M8 13h5"/>',
    robot: '<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9.5 13h.01M14.5 13h.01M9.5 16.5h5"/><circle cx="12" cy="3.5" r="1"/>',
    graphique: '<path d="M4 20V4M4 20h16"/><path d="m7.5 15 3.5-4 3 2.5 5-6"/>',
    engrenage: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
    camera: '<path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    carte: '<path d="M9 5 3.5 7v12L9 17l6 2 5.5-2V5L15 7z"/><path d="M9 5v12M15 7v12"/>',
    panier: '<path d="M4 5h2l2.2 10.5h9.3L19.5 8H7"/><circle cx="9.5" cy="19" r="1.2"/><circle cx="16.5" cy="19" r="1.2"/>',
    facture: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 11.5h6M9 15h3"/>',
    cloche: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    bouclier: '<path d="M12 3 5 6v5.5c0 4.5 3 8 7 9.5 4-1.5 7-5 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    eclair: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    cible: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    utilisateurs: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M15.5 5.5a3.2 3.2 0 0 1 0 6.2M17.5 14.2A5.5 5.5 0 0 1 20.5 19"/>',
    camion: '<path d="M3 6h11v10H3zM14 9.5h4l3 3.5v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    outil: '<path d="M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    etoile: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    envoyer: '<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
    etincelle: '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z"/><path d="M19 15.5c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3z"/>',
    maison: '<path d="M4 11 12 4l8 7v9h-5.5v-5.5h-5V20H4z"/>',
    sante: '<path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z"/><path d="M9 12h2l1-2 1.5 4 1-2h1.5"/>',
    feuille: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19 13 11"/>'
  };
  window.GSIcon = function (name, cls) {
    var p = P[name] || P.etincelle;
    return '<svg class="gsi' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  };
  window.GSIcon.names = Object.keys(P);
})();
