/* Na Zaspę 3 — interactions
   ------------------------------------------------------------------------- */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- i18n */
  var PL = { text: {}, ph: {} };

  function snapshotPolish() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      PL.text[el.dataset.i18n] = el.textContent;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      PL.ph[el.dataset.i18nPh] = el.getAttribute("placeholder") || "";
    });
  }

  function setLang(lang) {
    var en = window.I18N_EN || {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.dataset.i18n;
      var v = lang === "en" ? en[k] : PL.text[k];
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var k = el.dataset.i18nPh;
      var v = lang === "en" ? en[k] : PL.ph[k];
      if (typeof v === "string") el.setAttribute("placeholder", v);
    });

    document.documentElement.lang = lang;
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.lang === lang);
      b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
    });
    try { localStorage.setItem("nz3-lang", lang); } catch (e) {}
  }

  snapshotPolish();
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });
  // Polish is the default; English only when the visitor has chosen it before.
  var saved = null;
  try { saved = localStorage.getItem("nz3-lang"); } catch (e) {}
  if (saved === "en") setLang("en");

  /* -------------------------------------------------------------- header */
  var head = document.getElementById("head");
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function onScroll() {
    head.classList.toggle("is-stuck", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ------------------------------------------------------ active section */
  var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* --------------------------------------------------------- hero lights */
  var lights = document.getElementById("lights");
  if (lights) {
    // Grid matches the #win pattern: 60 × 52 px cells over the office volume.
    var cells = [];
    for (var x = 370; x < 1080; x += 60) {
      for (var y = 264; y < 576; y += 52) cells.push([x, y]);
    }
    for (var i = 0; i < 26; i++) {
      var c = cells[(i * 37 + 11) % cells.length];
      var r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.setAttribute("x", c[0] + 8);
      r.setAttribute("y", c[1] + 10);
      r.setAttribute("width", 44);
      r.setAttribute("height", 32);
      r.setAttribute("class", "on");
      r.style.animationDelay = ((i * 0.83) % 7).toFixed(2) + "s";
      lights.appendChild(r);
    }
  }

  /* -------------------------------------------------------- floor picker */
  var rows = Array.prototype.slice.call(document.querySelectorAll(".fl-row"));
  var bands = Array.prototype.slice.call(document.querySelectorAll("#secFloors .fl"));

  // Mark the let floor on the section drawing.
  bands.forEach(function (b) {
    var row = rows.filter(function (r) { return r.dataset.floor === b.dataset.floor; })[0];
    if (row && row.classList.contains("is-taken")) b.classList.add("is-let");
  });

  function select(floor) {
    rows.forEach(function (r) {
      var on = r.dataset.floor === floor;
      r.classList.toggle("is-open", on);
      r.classList.toggle("is-on", on);
      r.setAttribute("aria-expanded", on ? "true" : "false");
    });
    bands.forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.floor === floor);
    });
  }

  rows.forEach(function (r) {
    r.addEventListener("click", function () { select(r.dataset.floor); });
    r.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select(r.dataset.floor);
      }
    });
  });

  bands.forEach(function (b) {
    b.style.cursor = "pointer";
    b.addEventListener("click", function () {
      select(b.dataset.floor);
      var row = rows.filter(function (r) { return r.dataset.floor === b.dataset.floor; })[0];
      if (row && window.innerWidth < 900) {
        row.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      }
    });
  });

  select("4");

  /* -------------------------------------------------------------- reveal */
  if ("IntersectionObserver" in window) {
    var revealables = document.querySelectorAll(
      ".sec-head, .two > *, .fact, .floors > *, .am, .map-fig, .dist, .draw, .contact > *"
    );
    revealables.forEach(function (el, i) {
      el.classList.add("rv");
      el.style.transitionDelay = (Math.min(i % 6, 5) * 55) + "ms";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------- form */
  var form = document.getElementById("form");
  var ferr = document.getElementById("ferr");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    var name = f.name.value.trim();
    var email = f.email.value.trim();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      ferr.hidden = false;
      (name ? f.email : f.name).focus();
      return;
    }
    ferr.hidden = true;

    var en = document.documentElement.lang === "en";
    var subject = en
      ? "Leasing enquiry — Na Zaspę 3"
      : "Zapytanie o najem — Na Zaspę 3";

    var body = [
      (en ? "Name: " : "Imię i nazwisko: ") + name,
      (en ? "Company: " : "Firma: ") + (f.company.value.trim() || "—"),
      (en ? "E-mail: " : "E-mail: ") + email,
      (en ? "Area: " : "Powierzchnia: ") + (f.area.value.trim() || "—") + " m²",
      (en ? "Timing: " : "Termin: ") + f.when.value,
      "",
      (en ? "Message:" : "Wiadomość:"),
      f.message.value.trim() || "—"
    ].join("\n");

    window.location.href =
      "mailto:najem@nazaspe3.pl?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    form.classList.add("is-sent");
    var btn = form.querySelector("button[type=submit]");
    var original = btn.textContent;
    btn.textContent = en ? "Opening your mail app…" : "Otwieram program pocztowy…";
    setTimeout(function () {
      btn.textContent = original;
      form.classList.remove("is-sent");
    }, 4000);
  });

  /* ---------------------------------------------------- year in the foot */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
