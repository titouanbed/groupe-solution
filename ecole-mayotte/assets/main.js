// Groupe Solution — Mayotte — script partagé (vanilla JS, aucune dépendance)

document.addEventListener('DOMContentLoaded', function () {

  // ===== Saut à l'ancre : idempotent, pour ne jamais s'additionner au saut natif du navigateur =====
  // Cause racine identifiée par l'Agent 2 (isolée sur une page de test minimale, sans police ni CSS du
  // site) : sur une navigation neuve avec un hash dans l'URL, le navigateur fait déjà lui-même un saut
  // natif vers l'ancre. Un scrollIntoView() programmatique déclenché ensuite (sur load ou fonts.ready)
  // s'ADDITIONNE à ce saut natif au lieu de le corriger, d'où des atterrissages qui dépassent largement
  // la cible — jamais un problème de police, de scroll-behavior ou de scroll anchoring (les trois pistes
  // essayées avant celle-ci, voir research_log.md). Correctif : ne rappeler scrollIntoView() que si la
  // cible n'est PAS déjà en haut du viewport — sinon le saut natif a déjà fait son travail, un saut JS
  // par-dessus ne ferait qu'ajouter une erreur.
  function jumpToHash() {
    if (!window.location.hash) return;
    var target = document.querySelector(window.location.hash);
    if (!target) return;
    if (Math.abs(target.getBoundingClientRect().top) < 2) return; // déjà bien positionné
    target.scrollIntoView();
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(jumpToHash); // saut principal
  } else {
    jumpToHash();
  }
  if (document.readyState === 'complete') {
    jumpToHash(); // filet de sécurité, page déjà chargée au moment où ce script s'exécute
  } else {
    window.addEventListener('load', jumpToHash); // filet de sécurité, une seule fois, sur un événement réel
  }
  window.addEventListener('pageshow', jumpToHash); // retour depuis le cache navigateur (bfcache)
  window.addEventListener('hashchange', jumpToHash); // clic sur un lien d'ancre, page déjà chargée

  // ===== Apparition au scroll : fondu-montée léger, une fois par élément =====
  // Respecte prefers-reduced-motion (géré en CSS : .reveal reste visible sans animation) et reste
  // utilisable sans JS (voir <noscript> dans le <head>, qui force .reveal visible si le script ne
  // tourne jamais). Ne boucle jamais : chaque élément est désobservé dès son apparition.
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  // ===== Bouton "Retour" des annexes : ramène EXACTEMENT à l'ancre du socle d'origine =====
  // Les liens du socle vers une annexe portent ?from=section-X en plus du hash cible.
  // La page d'annexe lit ce paramètre et construit le lien de retour dessus.
  var backLink = document.querySelector('[data-back-link]');
  if (backLink) {
    var params = new URLSearchParams(window.location.search);
    var from = params.get('from');
    var base = backLink.getAttribute('data-base') || '../index.html';
    backLink.setAttribute('href', from ? base + '#' + from : base + '#section-1');
  }

  // ===== Sélecteur de profil (Section 11 — formulaire de contact) =====
  var roleButtons = document.querySelectorAll('.role-btn');
  var roleInput = document.getElementById('role-input');
  if (roleButtons.length && roleInput) {
    roleButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        roleButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        roleInput.value = btn.getAttribute('data-role');
      });
    });
  }

  // ===== Formulaire de contact : soumission AJAX vers Formspree, message de confirmation inline =====
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('form-msg');
      var submitBtn = form.querySelector('button[type="submit"]');

      if (roleInput && !roleInput.value) {
        msg.textContent = 'Merci de préciser qui vous êtes avant d’envoyer.';
        msg.className = 'form-msg err';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          msg.textContent = 'Message envoyé. Merci — nous revenons vers vous rapidement.';
          msg.className = 'form-msg ok';
          form.reset();
          if (roleButtons.length) { roleButtons.forEach(function (b) { b.classList.remove('active'); }); }
        } else {
          response.json().then(function (data) {
            var detail = (data && data.errors) ? data.errors.map(function (er) { return er.message; }).join(', ') : 'Réessayez dans un instant, ou écrivez directement à contact@groupsolution.fr.';
            msg.textContent = 'L’envoi a échoué. ' + detail;
            msg.className = 'form-msg err';
          }).catch(function () {
            msg.textContent = 'L’envoi a échoué. Réessayez, ou écrivez directement à contact@groupsolution.fr.';
            msg.className = 'form-msg err';
          });
        }
      }).catch(function () {
        msg.textContent = 'L’envoi a échoué (connexion). Réessayez, ou écrivez directement à contact@groupsolution.fr.';
        msg.className = 'form-msg err';
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer';
      });
    });
  }

});
