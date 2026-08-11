/* Na Zaspę 3 — interactions
   Replaces the design prototype's React runtime with plain DOM code. The room
   rows live in the HTML, so the full list still renders without JavaScript;
   this file only filters, sorts and links them to the contact form.
   ------------------------------------------------------------------------- */
(function () {
  "use strict";

  var LEASING_EMAIL = "office@kapholding.pl";

  /* ------------------------------------------------------------ menu */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

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

  /* ------------------------------------------------------ room table */
  var tbody = document.getElementById("tbody");
  var rows = Array.prototype.slice.call(tbody.querySelectorAll(".row"));
  var chips = Array.prototype.slice.call(document.querySelectorAll("#chips .chip"));
  var countEl = document.getElementById("count");
  var sortBtn = document.getElementById("sort");
  var selection = document.getElementById("selection");
  var selectionLabel = document.getElementById("selection-label");
  var roomField = document.getElementById("f-room");

  var floor = -1;      // -1 = all
  var sortByArea = false;
  var order = rows.slice();   // the original, floor-ordered sequence

  function plural(n) {
    if (n === 1) return " pokój";
    if (n < 5) return " pokoje";
    return " pokoi";
  }

  function render() {
    var shown = 0;
    var list = sortByArea
      ? order.slice().sort(function (a, b) { return b.dataset.m2 - a.dataset.m2; })
      : order;

    list.forEach(function (r) {
      tbody.appendChild(r);                       // re-appending applies the order
      var on = floor === -1 || +r.dataset.floor === floor;
      r.hidden = !on;
      if (on) shown++;
    });

    countEl.textContent = shown + plural(shown);
    sortBtn.textContent = sortByArea ? "Sortuj: metraż ↓" : "Sortuj: kondygnacja";
  }

  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      floor = +c.dataset.floor;
      chips.forEach(function (o) { o.classList.toggle("is-on", o === c); });
      render();
    });
  });

  sortBtn.addEventListener("click", function () {
    sortByArea = !sortByArea;
    render();
  });

  function select(row) {
    rows.forEach(function (r) { r.classList.toggle("is-on", r === row); });

    var id = row.dataset.id;
    var area = row.querySelector(".rarea").textContent.trim();
    var fl = row.querySelector(".rfloor").textContent.trim();
    var label = id + " · " + area + " · " + fl;

    selectionLabel.textContent = "Wybrano: " + label;
    selection.hidden = false;
    if (roomField) roomField.value = label;
  }

  rows.forEach(function (r) {
    r.addEventListener("click", function () { select(r); });
    r.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(r); }
    });
  });

  render();

  /* ------------------------------------------------------------- faq */
  Array.prototype.forEach.call(document.querySelectorAll(".faq-item"), function (item) {
    var btn = item.querySelector("button");
    var sign = item.querySelector("i");
    btn.addEventListener("click", function () {
      var open = !item.classList.contains("is-open");
      // one open at a time, matching the prototype
      Array.prototype.forEach.call(document.querySelectorAll(".faq-item"), function (o) {
        o.classList.remove("is-open");
        o.querySelector("i").textContent = "+";
        o.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (open) {
        item.classList.add("is-open");
        sign.textContent = "–";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ------------------------------------------------------------ form */
  var form = document.getElementById("form");
  var card = form.closest(".form-card");
  var sent = document.getElementById("form-sent");
  var back = document.getElementById("form-back");
  var err = document.getElementById("f-err");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    var name = f.name.value.trim();
    var email = f.email.value.trim();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      err.hidden = false;
      (name ? f.email : f.name).focus();
      return;
    }
    err.hidden = true;

    var body = [
      "Imię i nazwisko: " + name,
      "Firma: " + (f.company.value.trim() || "—"),
      "E-mail: " + email,
      "Telefon: " + (f.phone.value.trim() || "—"),
      "Interesujący pokój: " + (f.room.value.trim() || "—"),
      "",
      "Wiadomość:",
      f.message.value.trim() || "—"
    ].join("\n");

    window.location.href =
      "mailto:" + LEASING_EMAIL +
      "?subject=" + encodeURIComponent("Zapytanie o najem — Na Zaspę 3") +
      "&body=" + encodeURIComponent(body);

    card.setAttribute("data-sent", "");
    sent.hidden = false;
  });

  back.addEventListener("click", function () {
    card.removeAttribute("data-sent");
    sent.hidden = true;
    form.elements.name.focus();
  });
})();
