/* Kanno Noodle — site behavior */
(function () {
  'use strict';

  /* ---------- Scroll reveal ---------- */

  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Egg-variant filter ----------
     Only the badge and the allergen line change: every style is produced
     both with and without egg, so the card set stays the same. */

  var VARIANTS = {
    all:   { badge: 'With or without egg', allergens: 'Gluten (egg optional)' },
    egg:   { badge: 'With egg',            allergens: 'Gluten, egg' },
    noegg: { badge: 'Egg-free',            allergens: 'Gluten' }
  };

  function initFilters() {
    var group = document.getElementById('filters');
    if (!group) return;

    group.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.chip');
      if (!btn) return;

      var variant = VARIANTS[btn.getAttribute('data-filter')] || VARIANTS.all;

      group.querySelectorAll('.chip').forEach(function (c) {
        c.classList.toggle('on', c === btn);
      });

      document.querySelectorAll('.card').forEach(function (card) {
        if (card.classList.contains('card-custom')) return;
        card.querySelector('.badge').textContent = variant.badge;
        card.querySelector('.allergens').textContent = variant.allergens;
      });
    });
  }

  /* ---------- Contact form ----------
     No backend yet: hand the inquiry to the visitor's mail client and
     confirm in place, so nothing is silently dropped. */

  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var name = [data.get('firstName'), data.get('lastName')].filter(Boolean).join(' ');
      var body = [
        'Name: ' + name,
        'E-mail: ' + data.get('email'),
        'Contacting as: ' + data.get('role'),
        '',
        data.get('message') || ''
      ].join('\n');

      window.location.href = 'mailto:hello@kanno.pl' +
        '?subject=' + encodeURIComponent('Noodle inquiry — ' + name) +
        '&body=' + encodeURIComponent(body);

      document.getElementById('submit-btn').textContent = 'Thank you — we will reply shortly';
      var note = document.getElementById('form-note');
      note.textContent = 'Your mail client should open with the inquiry ready to send. If it does not, write to hello@kanno.pl.';
      note.hidden = false;
    });
  }

  /* ---------- Mobile nav ---------- */

  function initBurger() {
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');
    if (!burger || !nav) return;

    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  initReveal();
  initFilters();
  initForm();
  initBurger();
})();
