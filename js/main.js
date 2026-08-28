(function () {
  'use strict';

  // ---- reveal ao rolar ----
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ---- filtro de projetos ----
  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('.card');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      var i = 0;
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(' ');
        var show = key === 'all' || cats.indexOf(key) !== -1;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          card.style.setProperty('--i', i++);
          card.classList.add('is-in');
        }
      });
    });
    btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
  });

  // ---- imagens de projeto que ainda não existem: esconde sem quebrar o layout ----
  document.querySelectorAll('.shot img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.visibility = 'hidden';
      img.parentElement.classList.add('shot-missing');
    });
  });
})();
