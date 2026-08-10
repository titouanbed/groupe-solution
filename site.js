/* Groupe Solution — JS partagé (pages secondaires) : année + reveal au scroll */
(function(){
  var y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveal = [].slice.call(document.querySelectorAll('.reveal'));
  if(reduced || !('IntersectionObserver' in window)){
    reveal.forEach(function(x){ x.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.14, rootMargin:'0px 0px -8% 0px' });
  reveal.forEach(function(e,i){ e.style.transitionDelay = Math.min((i%4)*65,195) + 'ms'; io.observe(e); });
})();
