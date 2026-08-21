/* Kanno Noodle — site behavior */
(function () {
  'use strict';

  var I18N = window.KANNO_I18N || {};
  var LANGS = ['EN', 'PL', 'JA'];
  var DEFAULT_LANG = 'EN';
  var lang = DEFAULT_LANG;

  /* ---------- Contact form delivery ----------------------------------------
     GitHub Pages serves static files only, so the form is posted to Web3Forms,
     which relays it to the inbox(es) configured on that account.

     To switch the form on:
       1. Get an access key at https://web3forms.com (free tier, no account
          needed beyond confirming the address).
       2. Paste it below.
       3. Add the second recipient in the Web3Forms dashboard — the free tier
          allows more than one address on a key.

     While the key is empty the form falls back to opening the visitor's mail
     client, so nothing breaks and no inquiry is silently dropped. */

  var FORM_ENDPOINT = 'https://api.web3forms.com/submit';
  var FORM_ACCESS_KEY = '';
  var FALLBACK_MAIL = 'hello@kanno.pl';

  function dict() { return I18N[lang] || I18N[DEFAULT_LANG] || {}; }

  function resolve(path) {
    return path.split('.').reduce(function (o, k) {
      return (o == null) ? undefined : o[k];
    }, dict());
  }

  /* ---------- Language ---------- */

  function applyLang(next) {
    if (LANGS.indexOf(next) === -1 || !I18N[next]) next = DEFAULT_LANG;
    lang = next;
    var t = dict();

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = v;
    });

    // Values that legitimately carry markup (line breaks in addresses etc.).
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-i18n-html'));
      if (typeof v === 'string') el.innerHTML = v;
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-i18n-alt'));
      if (typeof v === 'string') el.setAttribute('alt', v);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-i18n-placeholder'));
      if (typeof v === 'string') el.setAttribute('placeholder', v);
    });

    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var v = resolve(el.getAttribute('data-i18n-content'));
      if (typeof v === 'string') el.setAttribute('content', v);
    });

    if (t.meta && t.meta.title) document.title = t.meta.title;
    document.documentElement.lang = t.htmlLang || 'en';

    var privacy = document.getElementById('privacy-link');
    if (privacy && t.privacyHref) privacy.setAttribute('href', t.privacyHref);

    // Re-apply the active egg filter so badges and allergens follow the language.
    applyVariant(currentVariant);

    document.querySelectorAll('#lang button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-lang') === lang);
    });

    try { localStorage.setItem('kannoLang', lang); } catch (e) { /* private mode */ }
  }

  function initLang() {
    // The legal pages ship one file per language and load no dictionary.
    if (!I18N[DEFAULT_LANG]) return;

    var stored = null;
    try { stored = localStorage.getItem('kannoLang'); } catch (e) { /* private mode */ }
    applyLang(stored || DEFAULT_LANG);

    var group = document.getElementById('lang');
    if (!group) return;
    group.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button[data-lang]');
      if (btn) applyLang(btn.getAttribute('data-lang'));
    });
  }

  /* ---------- Egg-variant filter ----------
     Only the badge and the allergen line change: every style is produced
     both with and without egg, so the card set stays the same. */

  var currentVariant = 'all';

  function applyVariant(variant) {
    if (['all', 'egg', 'noegg'].indexOf(variant) === -1) variant = 'all';
    currentVariant = variant;

    var t = dict().products || {};
    var badge = variant === 'egg' ? t.badgeEgg : variant === 'noegg' ? t.badgeNoEgg : t.badgeAll;
    var allergens = variant === 'egg' ? t.allergensEgg : variant === 'noegg' ? t.allergensNoEgg : t.allergensAll;

    document.querySelectorAll('.card').forEach(function (card) {
      if (card.classList.contains('card-custom')) return;
      var b = card.querySelector('.badge');
      var a = card.querySelector('.allergens');
      if (b && typeof badge === 'string') b.textContent = badge;
      if (a && typeof allergens === 'string') a.textContent = allergens;
    });

    document.querySelectorAll('#filters .chip').forEach(function (c) {
      c.classList.toggle('on', c.getAttribute('data-filter') === variant);
    });
  }

  function initFilters() {
    var group = document.getElementById('filters');
    if (!group) return;
    group.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.chip');
      if (btn) applyVariant(btn.getAttribute('data-filter'));
    });
  }

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

  /* ---------- Contact form ---------- */

  function showNote(text, isError) {
    var note = document.getElementById('form-note');
    if (!note) return;
    note.textContent = text;
    note.classList.toggle('form-note-error', !!isError);
    note.hidden = false;
  }

  function fieldValues(form, t) {
    var data = new FormData(form);
    return {
      name: [data.get('firstName'), data.get('lastName')].filter(Boolean).join(' '),
      email: data.get('email') || '',
      role: data.get('role') || '',
      message: data.get('message') || '',
      botcheck: data.get('botcheck'),
      t: t
    };
  }

  // No access key configured: hand the inquiry to the visitor's mail client
  // rather than pretending it was sent.
  function submitByMail(v) {
    var t = v.t;
    var body = [
      t.mailName + ': ' + v.name,
      t.mailEmail + ': ' + v.email,
      t.mailRole + ': ' + v.role,
      '',
      v.message
    ].join('\n');

    window.location.href = 'mailto:' + FALLBACK_MAIL +
      '?subject=' + encodeURIComponent(t.mailSubject + ' — ' + v.name) +
      '&body=' + encodeURIComponent(body);

    document.getElementById('submit-btn').textContent = t.submitSent;
    showNote(t.formNote, false);
  }

  function submitToService(form, v) {
    var t = v.t;
    var btn = document.getElementById('submit-btn');
    var original = btn.textContent;

    btn.disabled = true;
    btn.textContent = t.submitSending || original;

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: FORM_ACCESS_KEY,
        subject: t.mailSubject + ' — ' + v.name,
        from_name: 'kanno.pl',
        name: v.name,
        email: v.email,
        role: v.role,
        message: v.message,
        language: lang,
        botcheck: v.botcheck
      })
    })
      .then(function (res) { return res.json().catch(function () { return { success: res.ok }; }); })
      .then(function (out) {
        if (!out || !out.success) throw new Error((out && out.message) || 'send failed');
        btn.textContent = t.submitSent;
        showNote(t.formSent, false);
        form.reset();
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = original;
        showNote(t.formError, true);
      });
  }

  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var v = fieldValues(form, dict().contact || {});

      // Honeypot: only a bot fills this in.
      if (v.botcheck) return;

      if (FORM_ACCESS_KEY) submitToService(form, v);
      else submitByMail(v);
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

  initLang();
  initFilters();
  initReveal();
  initForm();
  initBurger();
})();
