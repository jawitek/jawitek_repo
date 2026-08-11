/* Kanno Noodle — site behavior */
(function () {
  'use strict';

  var I18N = window.KANNO_I18N;
  var LANGS = ['EN', 'PL', 'JP'];

  var STEP_PHOTOS = [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&q=80&auto=format&fit=crop'
  ];

  var MARQUEE_WORDS = ['Ramen', 'Udon', 'Soba', 'IFS Food', 'Authentic Japanese', 'Made in Poland', 'Since 1949', 'Tokyo · Warsaw', 'For HoReCa'];

  /* ---------- Build static, language-independent structures ---------- */

  function buildMarquee() {
    var track = document.getElementById('marquee-track');
    var html = '';
    for (var i = 0; i < 2; i++) {
      MARQUEE_WORDS.forEach(function (w) { html += '<span>' + w + '</span>'; });
    }
    track.innerHTML = html;
  }

  function buildStoryMeta() {
    var host = document.getElementById('story-meta');
    var html = '';
    for (var i = 0; i < 4; i++) {
      html += '<div><b data-i18n="storyMeta.' + i + '.0"></b><span data-i18n="storyMeta.' + i + '.1"></span></div>';
    }
    host.innerHTML = html;
  }

  function buildProcessGrid() {
    var host = document.getElementById('process-grid');
    var html = '';
    for (var i = 0; i < 4; i++) {
      html +=
        '<div class="step reveal" data-delay="' + (i * 120) + '">' +
          '<div class="n" data-i18n="steps.' + i + '.n"></div>' +
          '<h3 data-i18n="steps.' + i + '.title"></h3>' +
          '<p data-i18n="steps.' + i + '.body"></p>' +
          '<div class="photo step-img">' +
            '<img src="' + STEP_PHOTOS[i] + '" alt="" loading="lazy">' +
            '<span class="cap" data-i18n="stepImg.' + i + '"></span>' +
          '</div>' +
        '</div>';
    }
    host.innerHTML = html;
  }

  function buildBizPoints() {
    var host = document.getElementById('biz-points');
    var html = '';
    for (var i = 0; i < 4; i++) {
      html +=
        '<div class="biz-point">' +
          '<h4 data-i18n="bizPoints.' + i + '.0"></h4>' +
          '<p data-i18n="bizPoints.' + i + '.1"></p>' +
        '</div>';
    }
    host.innerHTML = html;
  }

  /* ---------- Language switching ---------- */

  function resolve(dict, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, dict);
  }

  function renderContactTitle(title) {
    var host = document.getElementById('contact-title');
    var words = title.split(' ');
    host.innerHTML = words.map(function (w, i) {
      return i === words.length - 1
        ? '<span class="it">' + w + '</span>'
        : '<span>' + w + ' </span>';
    }).join('');
  }

  function applyLang(lang) {
    if (!I18N[lang]) lang = 'EN';
    var t = I18N[lang];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = resolve(t, el.getAttribute('data-i18n'));
      if (typeof val === 'string') el.textContent = val;
    });

    renderContactTitle(t.contactTitle);

    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-lang') === lang);
    });

    document.documentElement.lang = lang === 'JP' ? 'ja' : lang.toLowerCase();
    try { localStorage.setItem('kannoLang', lang); } catch (e) { /* private mode */ }
  }

  /* ---------- Scroll reveal ---------- */

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
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
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) {
      var d = el.getAttribute('data-delay');
      if (d) el.style.transitionDelay = d + 'ms';
      io.observe(el);
    });
  }

  /* ---------- Hero parallax ---------- */

  function initParallax() {
    var el = document.getElementById('hero-figure');
    if (!el) return;
    var onScroll = function () {
      var rect = el.getBoundingClientRect();
      var t = Math.max(-300, Math.min(300, -rect.top * 0.08));
      el.style.setProperty('--p', t + 'px');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Cinematic intro ---------- */

  function finishIntro(instant) {
    var intro = document.getElementById('intro');
    document.body.classList.remove('intro-pending');
    document.body.classList.add('site-in');
    if (instant) {
      intro.classList.add('off');
    } else {
      document.body.classList.add('intro-done');
      setTimeout(function () { intro.classList.add('off'); }, 950);
    }
    try { sessionStorage.setItem('kannoIntroSeen', '1'); } catch (e) { /* private mode */ }
  }

  function initIntro() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var seen = false;
    try { seen = sessionStorage.getItem('kannoIntroSeen') === '1'; } catch (e) { /* private mode */ }

    if (reduced || seen) {
      finishIntro(true);
      return;
    }

    var timer = setTimeout(function () { finishIntro(false); }, 4800);
    document.getElementById('intro-skip').addEventListener('click', function () {
      clearTimeout(timer);
      finishIntro(false);
    });
  }

  /* ---------- Mobile nav ---------- */

  function initBurger() {
    var burger = document.getElementById('burger');
    var links = document.getElementById('nav-links');
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Boot ---------- */

  buildMarquee();
  buildStoryMeta();
  buildProcessGrid();
  buildBizPoints();

  var startLang = 'EN';
  try { startLang = localStorage.getItem('kannoLang') || 'EN'; } catch (e) { /* private mode */ }
  if (LANGS.indexOf(startLang) === -1) startLang = 'EN';
  applyLang(startLang);

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });

  initReveal();
  initParallax();
  initIntro();
  initBurger();
})();
