/* ==========================================================================
   Pogo Pogo — MVP
   Kapibara siedzi sztywno na skuterze; flaming jest do niej doczepiony
   sprężystym stawem i to on jest właściwą grą. Skręt rozbuja flaminga siłą
   bezwładności, sprężyna ściąga go z powrotem do pionu, a utrzymanie się poza
   progiem wychylenia kończy przejazd.

   Grafika: pliki z assets/*.svg, jeśli istnieją. Jeśli nie — każdy element
   ma wektorowy fallback rysowany w kodzie, więc gra jest grywalna zawsze.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------ ustawienia */

  var W = 360, H = 640;               // logiczna rozdzielczość (9:16)

  var SKI_Y      = H * 0.74;          // skuter stoi w miejscu, świat płynie
  var SKI_VX_MAX = 250;               // px/s
  var SKI_ACCEL  = 1500;              // px/s² przy wciśniętym kierunku
  var SKI_DRAG   = 5.5;               // wyhamowanie bez dotyku
  var SKI_MARGIN = 44;                // tyle, żeby skuter nie wystawał za ekran

  var CAPY_DY    = -18;               // gdzie siada kapibara względem środka skutera
  var PIVOT_DY   = -72;               // staw flaminga względem środka skutera
  var SPRING     = 30;                // rad/s² na radian wychylenia
  var DAMP       = 2.6;               // tłumienie
  var COUPLE     = 0.012;             // ile bezwładności skutera trafia w ptaka

  /* Próg wywrotki i ile wolno go przekraczać. Sam próg 50° ze specyfikacji
     zabijał slalom co 0,45 s — czyli dokładnie tempo omijania przeszkód.
     Gra karała to, czego sama wymagała. Przy 62° z tolerancją 0,15 s ginie
     już tylko uporczywe szarpanie w rytm wahadła (patrz README).        */
  var TILT_LIMIT = 62 * Math.PI / 180;
  var TILT_GRACE = 0.15;

  var FIXED      = 1 / 120;           // stały krok fizyki — próg musi wypadać
                                      // tak samo przy 30 i 144 fps

  var SPEED_MIN  = 190, SPEED_MAX = 500;   // px/s przewijania wody
  var RAMP_M     = 900;               // po tylu metrach pełna prędkość i gęstość
  var PX_PER_M   = 18;

  var WATER_TILE = 256;               // logiczny bok kafelka wody
  var BUOY_SEP   = 128;               // najmniejszy rozstaw bojek w jednej fali

  var HIT_SKI = 26, HIT_BUOY = 18, HIT_SHARK = 20;
  var BEST_KEY = "pogo-pogo:best";

  /* ------------------------------------------------------------ narzędzia */

  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var rand  = function (a, b) { return a + Math.random() * (b - a); };
  var mod   = function (a, n) { return ((a % n) + n) % n; };

  /* -------------------------------------------------------------- canvas */

  var stage  = document.getElementById("stage");
  var canvas = document.getElementById("game");
  var ctx    = canvas.getContext("2d");
  var scaleX = 1, scaleY = 1;

  function resize() {
    var rect = stage.getBoundingClientRect();
    var dpr  = Math.min(window.devicePixelRatio || 1, 3);

    canvas.width  = Math.round(rect.width  * dpr);
    canvas.height = Math.round(rect.height * dpr);
    scaleX = canvas.width  / W;
    scaleY = canvas.height / H;
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    ctx.imageSmoothingQuality = "high";

    stage.style.setProperty("--stage-h", rect.height + "px");

    if (baked) bakeAll();   // bitmapy muszą pasować do nowej rozdzielczości
  }
  var baked = false;
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);

  /* -------------------------------------------------------------- grafika
     Każdy sprite ma docelowe pudełko i punkt zaczepienia. Jeśli SVG nie
     wczyta się (albo jeszcze go nie ma), rysujemy kształt zastępczy w tym
     samym pudełku — reszta kodu nie widzi różnicy.                        */

  var ART = {};   // nazwa -> HTMLImageElement albo null
  var FIT = {};   // nazwa -> obrys treści w pliku, znormalizowany 0..1

  /* Docelowa szerokość TREŚCI na ekranie i punkt zaczepienia. Wysokość
     wynika z proporcji obrysu, więc podmiana grafiki na inaczej
     wykadrowaną nie zniekształci postaci.                              */
  var BOX = {
    jetski:         { w: 96, anchor: "center", fbW: 92, fbH: 62, fb: fbJetski },
    capybara:       { w: 56, anchor: "bottom", fbW: 58, fbH: 64, fb: fbCapybara },
    flamingo:       { w: 62, anchor: "bottom", fbW: 48, fbH: 78, fb: fbFlamingo },
    obstacle_buoy:  { w: 44, anchor: "center", fbW: 40, fbH: 52, fb: fbBuoy },
    obstacle_shark: { w: 58, anchor: "center", fbW: 64, fbH: 46, fb: fbShark }
  };

  function loadArt(list, done) {
    var left = list.length;
    if (!left) return done();
    list.forEach(function (name) {
      var img = new Image();
      img.onload = function () {
        ART[name] = (img.naturalWidth || img.width) ? img : null;
        if (ART[name] && BOX[name]) FIT[name] = measureContent(img);
        if (--left === 0) done();
      };
      img.onerror = function () {
        ART[name] = null;
        if (--left === 0) done();
      };
      img.src = "assets/" + name + ".svg";
    });
  }

  /* Znajduje ciasny obrys narysowanych pikseli. Pliki z Claude Design mają
     kwadratowe płótno z marginesami, a postać siedzi w nim gdzie indziej niż
     na środku — bez tego kapibara byłaby rozciągnięta, a flaming obracałby
     się wokół pustego miejsca pod nogami.                                 */
  function measureContent(img) {
    var S = 96, full = { x0: 0, y0: 0, x1: 1, y1: 1 };
    try {
      var c = document.createElement("canvas");
      c.width = c.height = S;
      var g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(img, 0, 0, S, S);
      var d = g.getImageData(0, 0, S, S).data;   // przy file:// rzuci SecurityError
      var minX = S, minY = S, maxX = -1, maxY = -1;
      for (var y = 0; y < S; y++) {
        for (var x = 0; x < S; x++) {
          if (d[(y * S + x) * 4 + 3] > 12) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < 0) return full;
      return { x0: minX / S, y0: minY / S, x1: (maxX + 1) / S, y1: (maxY + 1) / S };
    } catch (e) {
      return full;   // canvas skażony (file://) — traktuj płótno jako treść
    }
  }

  /* Przepalenie SVG na bitmapy w rozdzielczości ekranu. Przeglądarka
     rasteryzuje SVG przy każdym drawImage, a totem jest rysowany z obrotem
     w każdej klatce — na telefonie to realny koszt. Po przepaleniu rysowanie
     jest zwykłym przerzutem pikseli 1:1. Powtarzane przy zmianie rozmiaru. */
  var BAKE = {};

  function bakeAll() {
    for (var name in BOX) {
      var cfg = BOX[name], img = ART[name];
      if (!img) { BAKE[name] = null; continue; }

      var f  = FIT[name] || { x0: 0, y0: 0, x1: 1, y1: 1 };
      var fw = f.x1 - f.x0, fh = f.y1 - f.y0;
      var cw = cfg.w;
      var ch = cw / ((fw * img.naturalWidth) / (fh * img.naturalHeight));

      var pw = Math.max(1, Math.round(cw * scaleX));
      var ph = Math.max(1, Math.round(ch * scaleY));
      var c  = document.createElement("canvas");
      c.width = pw; c.height = ph;
      var g = c.getContext("2d");
      g.imageSmoothingQuality = "high";
      g.drawImage(img, -f.x0 * (pw / fw), -f.y0 * (ph / fh), pw / fw, ph / fh);

      BAKE[name] = { c: c, w: cw, h: ch };
    }
    bakeWater();
  }

  function bakeWater() {
    waterPattern = false;
    var img = ART.water_tile;
    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    var side = Math.max(2, Math.round(WATER_TILE * scaleX));
    var c = document.createElement("canvas");
    c.width = side; c.height = side;
    c.getContext("2d").drawImage(img, 0, 0, side, side);
    try {
      var p = ctx.createPattern(c, "repeat");
      /* Kafelek jest w pikselach urządzenia, a malujemy w jednostkach
         logicznych — skalujemy wzorzec z powrotem, żeby wyszło 1:1.    */
      if (p.setTransform) p.setTransform(new DOMMatrix([1 / scaleX, 0, 0, 1 / scaleY, 0, 0]));
      waterPattern = p;
    } catch (e) { waterPattern = false; }
  }

  /* Rysuje sprite zaczepiony punktem BOX[name].anchor w (0,0). */
  function sprite(name) {
    var b = BAKE[name];
    if (!b) { var cfg = BOX[name]; cfg.fb(cfg.fbW, cfg.fbH); return; }
    ctx.drawImage(b.c, -b.w / 2,
      BOX[name].anchor === "bottom" ? -b.h : -b.h / 2, b.w, b.h);
  }

  /* -------------------------------------------------- kształty zastępcze */

  function fbJetski(w, h) {                       // zaczep: środek
    var hw = w / 2, hh = h / 2;

    ctx.fillStyle = "rgba(4,40,64,.22)";          // cień na wodzie
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.75, hw * 0.9, hh * 0.32, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#FF7043";                    // kadłub, widok od tyłu
    ctx.beginPath();
    ctx.moveTo(-hw * 0.86, hh * 0.55);
    ctx.quadraticCurveTo(-hw * 1.0, -hh * 0.25, -hw * 0.44, -hh * 0.85);
    ctx.lineTo(hw * 0.44, -hh * 0.85);
    ctx.quadraticCurveTo(hw * 1.0, -hh * 0.25, hw * 0.86, hh * 0.55);
    ctx.quadraticCurveTo(0, hh * 1.05, -hw * 0.86, hh * 0.55);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#FFF3E0";                    // pas
    ctx.fillRect(-hw * 0.8, hh * 0.05, hw * 1.6, hh * 0.2);

    ctx.fillStyle = "#2E3B47";                    // siedzisko
    ctx.beginPath();
    ctx.ellipse(0, -hh * 0.35, hw * 0.42, hh * 0.3, 0, 0, 6.2832);
    ctx.fill();

    ctx.strokeStyle = "#CFD8DC";                  // kierownica
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-hw * 0.5, -hh * 0.72);
    ctx.lineTo(hw * 0.5, -hh * 0.72);
    ctx.stroke();
  }

  function fbCapybara(w, h) {                     // zaczep: dół
    ctx.fillStyle = "#A9764A";                    // tułów
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.32, w * 0.42, h * 0.32, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#8B5E33";                    // cień tułowia
    ctx.beginPath();
    ctx.ellipse(w * 0.14, -h * 0.28, w * 0.26, h * 0.24, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#B8814F";                    // głowa
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.74, w * 0.33, h * 0.25, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#8B5E33";                    // uszy
    ctx.beginPath();
    ctx.ellipse(-w * 0.27, -h * 0.9, w * 0.09, h * 0.07, 0, 0, 6.2832);
    ctx.ellipse(w * 0.27, -h * 0.9, w * 0.09, h * 0.07, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#20262B";                    // okulary — całkowity luz
    ctx.beginPath();
    ctx.ellipse(-w * 0.14, -h * 0.78, w * 0.13, h * 0.075, 0, 0, 6.2832);
    ctx.ellipse(w * 0.14, -h * 0.78, w * 0.13, h * 0.075, 0, 0, 6.2832);
    ctx.fill();
    ctx.fillRect(-w * 0.06, -h * 0.79, w * 0.12, h * 0.025);

    ctx.fillStyle = "#6E4426";                    // pysk
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.63, w * 0.11, h * 0.05, 0, 0, 6.2832);
    ctx.fill();
  }

  function fbFlamingo(w, h) {                     // zaczep: dół (staw)
    ctx.strokeStyle = "#F2A03D";                  // nogi
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-w * 0.09, 0); ctx.lineTo(-w * 0.05, -h * 0.24);
    ctx.moveTo(w * 0.11, 0);  ctx.lineTo(w * 0.04, -h * 0.24);
    ctx.stroke();

    ctx.fillStyle = "#FF6F9C";                    // korpus
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.4, w * 0.4, h * 0.19, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#FF9AB8";                    // skrzydło w panice
    ctx.beginPath();
    ctx.ellipse(-w * 0.12, -h * 0.42, w * 0.26, h * 0.12, -0.5, 0, 6.2832);
    ctx.fill();

    ctx.strokeStyle = "#FF6F9C";                  // szyja — esownica
    ctx.lineWidth = w * 0.15;
    ctx.beginPath();
    ctx.moveTo(w * 0.06, -h * 0.5);
    ctx.quadraticCurveTo(w * 0.42, -h * 0.62, w * 0.2, -h * 0.8);
    ctx.stroke();

    ctx.fillStyle = "#FF83A9";                    // głowa
    ctx.beginPath();
    ctx.ellipse(w * 0.12, -h * 0.87, w * 0.19, h * 0.1, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#FFF";                       // wytrzeszcz
    ctx.beginPath();
    ctx.ellipse(w * 0.08, -h * 0.9, w * 0.1, h * 0.065, 0, 0, 6.2832);
    ctx.fill();
    ctx.fillStyle = "#1A1A1A";
    ctx.beginPath();
    ctx.ellipse(w * 0.1, -h * 0.9, w * 0.045, h * 0.032, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#FFC94D";                    // dziób
    ctx.beginPath();
    ctx.moveTo(w * 0.28, -h * 0.89);
    ctx.lineTo(w * 0.52, -h * 0.83);
    ctx.lineTo(w * 0.27, -h * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1A1A1A";
    ctx.beginPath();
    ctx.moveTo(w * 0.44, -h * 0.85);
    ctx.lineTo(w * 0.52, -h * 0.83);
    ctx.lineTo(w * 0.43, -h * 0.812);
    ctx.closePath();
    ctx.fill();
  }

  function fbBuoy(w, h) {                         // zaczep: środek
    ctx.strokeStyle = "#455A64";                  // maszt
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.12); ctx.lineTo(0, -h * 0.46);
    ctx.stroke();
    ctx.fillStyle = "#FFC94D";
    ctx.beginPath();
    ctx.arc(0, -h * 0.5, w * 0.1, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#E53935";                    // pływak
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.4, 0, 6.2832);
    ctx.fill();
    ctx.fillStyle = "#FAFAFA";
    ctx.fillRect(-w * 0.4, -w * 0.13, w * 0.8, w * 0.26);
    ctx.fillStyle = "rgba(0,0,0,.14)";
    ctx.beginPath();
    ctx.ellipse(w * 0.1, w * 0.1, w * 0.3, w * 0.28, 0, 0, 6.2832);
    ctx.fill();
  }

  function fbShark(w, h) {                        // zaczep: środek
    ctx.fillStyle = "rgba(255,255,255,.55)";      // kilwater
    ctx.beginPath();
    ctx.ellipse(0, h * 0.3, w * 0.45, h * 0.14, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#546E7A";                    // płetwa
    ctx.beginPath();
    ctx.moveTo(-w * 0.3, h * 0.28);
    ctx.quadraticCurveTo(-w * 0.05, h * 0.1, w * 0.16, -h * 0.44);
    ctx.quadraticCurveTo(w * 0.2, h * 0.05, w * 0.32, h * 0.28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#78909C";
    ctx.beginPath();
    ctx.moveTo(-w * 0.3, h * 0.28);
    ctx.quadraticCurveTo(-w * 0.05, h * 0.1, w * 0.16, -h * 0.44);
    ctx.quadraticCurveTo(-w * 0.02, h * 0.06, -w * 0.06, h * 0.28);
    ctx.closePath();
    ctx.fill();
  }

  /* ---------------------------------------------------------------- woda */

  var waterPattern = null;
  var foam = [];
  for (var i = 0; i < 46; i++) {
    foam.push({ x: rand(0, W), y: rand(0, H), r: rand(1, 3.2), s: rand(0.55, 1.25) });
  }

  function drawWater(scroll, t) {
    if (waterPattern) {
      var tile = WATER_TILE;
      ctx.save();
      ctx.translate(0, mod(scroll, tile) - tile);
      ctx.fillStyle = waterPattern;
      ctx.fillRect(0, 0, W, H + tile);
      ctx.restore();

      /* Kafelek jest jasny i płaski — przyciemnienie góry ratuje czytelność
         licznika, a dołu daje głębię. Środek zostaje nietknięty.        */
      var d = ctx.createLinearGradient(0, 0, 0, H);
      d.addColorStop(0, "rgba(1,58,96,.24)");
      d.addColorStop(0.32, "rgba(1,58,96,0)");
      d.addColorStop(1, "rgba(1,58,96,.20)");
      ctx.fillStyle = d;
      ctx.fillRect(0, 0, W, H);
    } else {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#29B6F6");
      g.addColorStop(0.55, "#0288D1");
      g.addColorStop(1, "#0166A3");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.lineCap = "round";
      for (var i = 0; i < 16; i++) {
        var wy = mod(i * 48 - scroll, H + 96) - 48;
        ctx.beginPath();
        for (var x = -20; x <= W + 20; x += 24) {
          var yy = wy + Math.sin(x * 0.028 + i * 1.7 + t * 1.4) * 4;
          if (x === -20) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
        }
        ctx.strokeStyle = "rgba(255,255,255," + (0.05 + 0.045 * (i % 3)) + ")";
        ctx.lineWidth = 2 + (i % 3);
        ctx.stroke();
      }
    }

    ctx.fillStyle = "rgba(255,255,255,.5)";       // piana
    for (var k = 0; k < foam.length; k++) {
      var f = foam[k];
      ctx.beginPath();
      ctx.arc(f.x, mod(f.y - scroll * f.s, H + 20) - 10, f.r, 0, 6.2832);
      ctx.fill();
    }
  }

  /* -------------------------------------------------------------- wejście */

  var input = { left: false, right: false, pointer: 0 };

  function steerDir() {
    var d = 0;
    if (input.left)  d -= 1;
    if (input.right) d += 1;
    if (!d) d = input.pointer;
    return clamp(d, -1, 1);
  }

  var pointers = {};   // id -> -1 | 1

  function updatePointer() {
    var sum = 0, n = 0;
    for (var id in pointers) { sum += pointers[id]; n++; }
    input.pointer = n ? clamp(sum, -1, 1) : 0;
  }

  function halfOf(clientX) {
    var rect = stage.getBoundingClientRect();
    return clientX - rect.left < rect.width / 2 ? -1 : 1;
  }

  stage.addEventListener("pointerdown", function (e) {
    if (e.target.closest && e.target.closest("button")) return;
    stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
    pointers[e.pointerId] = halfOf(e.clientX);
    updatePointer();
    tap();
    e.preventDefault();
  });
  stage.addEventListener("pointermove", function (e) {
    if (!(e.pointerId in pointers)) return;
    pointers[e.pointerId] = halfOf(e.clientX);
    updatePointer();
  });
  function release(e) { delete pointers[e.pointerId]; updatePointer(); }
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  window.addEventListener("blur", function () { pointers = {}; updatePointer(); });

  window.addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    if (k === "arrowleft"  || k === "a") { input.left  = true; e.preventDefault(); }
    if (k === "arrowright" || k === "d") { input.right = true; e.preventDefault(); }
    if (k === " " || k === "enter") { tap(); e.preventDefault(); }
  });
  window.addEventListener("keyup", function (e) {
    var k = e.key.toLowerCase();
    if (k === "arrowleft"  || k === "a") input.left  = false;
    if (k === "arrowright" || k === "d") input.right = false;
  });

  /* iOS Safari: bez pinch-zoom i bez double-tap-zoom nad sceną */
  ["gesturestart", "gesturechange", "gestureend"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { e.preventDefault(); });
  });

  /* ----------------------------------------------------------------- UI */

  var el = {
    menu:   document.getElementById("screen-menu"),
    over:   document.getElementById("screen-over"),
    hud:    document.getElementById("hud"),
    dist:   document.getElementById("hud-dist"),
    bestM:  document.getElementById("best-menu"),
    score:  document.getElementById("over-score"),
    bestO:  document.getElementById("over-best"),
    cause:  document.getElementById("over-cause"),
    retry:  document.getElementById("retry"),
    splash: document.getElementById("splash")
  };

  function show(node, on) {
    node.hidden = !on;
    node.classList.toggle("is-on", !!on);
  }

  var best = 0;
  try { best = parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (e) {}
  function saveBest() { try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) {} }

  el.retry.addEventListener("click", function (e) { e.stopPropagation(); startRun(); });

  /* --------------------------------------------------------------- świat */

  var MENU = 0, PLAY = 1, WIPE = 2, OVER = 3;

  var game = {
    mode: MENU,
    t: 0,
    scroll: 0,
    speed: SPEED_MIN,
    dist: 0,
    ski: { x: W / 2, vx: 0, ax: 0, roll: 0 },
    bird: { a: 0, w: 0, over: 0 },
    scrollV: 0,
    obstacles: [],
    spray: [],
    spawn: 0,
    shake: 0,
    wipe: null,
    lockout: 0
  };

  function startRun() {
    game.mode = PLAY;
    game.scroll = 0;
    game.speed = SPEED_MIN;
    game.dist = 0;
    game.ski.x = W / 2; game.ski.vx = 0; game.ski.ax = 0; game.ski.roll = 0;
    game.bird.a = 0; game.bird.w = 0; game.bird.over = 0;
    game.obstacles.length = 0;
    game.spray.length = 0;
    game.spawn = 1.1;
    game.shake = 0;
    game.wipe = null;

    show(el.menu, false);
    show(el.over, false);
    el.hud.hidden = false;
    el.dist.textContent = "0";
  }

  function tap() {
    if (game.mode === MENU) startRun();
    else if (game.mode === OVER && game.lockout <= 0) startRun();
  }

  function wipeout(cause) {
    game.mode = WIPE;
    game.shake = 14;
    game.wipe = {
      t: 0,
      cause: cause,
      /* flaming odlatuje w stronę, w którą był wychylony */
      x: game.ski.x + Math.sin(game.bird.a) * 40,
      y: SKI_Y + PIVOT_DY - 30,
      vx: Math.sin(game.bird.a) * 260 + game.ski.vx * 0.6,
      vy: -260,
      rot: game.bird.a,
      vrot: game.bird.w * 0.7 + (game.bird.a >= 0 ? 6 : -6)
    };
    for (var i = 0; i < 26; i++) splash(game.ski.x, SKI_Y, 1.6);
  }

  function endRun() {
    game.mode = OVER;
    game.lockout = 0.5;          // żeby dotyk kończący przejazd nie restartował go od razu
    var score = Math.floor(game.dist);
    if (score > best) { best = score; saveBest(); }
    el.score.textContent = score;
    el.bestO.textContent = best;
    el.bestM.textContent = best;
    el.cause.textContent = game.wipe && game.wipe.cause === "tilt"
      ? "Flaming poszedł do wody."
      : "Skuter w przeszkodę.";
    el.hud.hidden = true;
    show(el.over, true);
  }

  function splash(x, y, k) {
    game.spray.push({
      x: x, y: y,
      vx: rand(-90, 90) * k,
      vy: rand(-150, -20) * k,
      r: rand(1.5, 4),
      life: rand(0.3, 0.75)
    });
  }

  /* 0 na starcie, 1 po RAMP_M metrach — steruje prędkością, gęstością trasy
     i tym, ile przeszkód wchodzi naraz.                                  */
  function difficulty() { return clamp(game.dist / RAMP_M, 0, 1); }

  function spawnDelay() {
    return rand(0.82, 1.45) * (1.15 - 0.72 * difficulty());
  }

  function spawnWave() {
    var d = difficulty();

    /* Rekin wchodzi z boku i przecina ekran, więc idzie sam — o „kilku
       rekinach naraz" decyduje częstotliwość, nie liczebność fali.      */
    if (Math.random() < 0.06 + 0.46 * d) {
      var fromLeft = Math.random() < 0.5;
      game.obstacles.push({
        type: "shark",
        x: fromLeft ? -50 : W + 50,
        y: -60,
        vx: (fromLeft ? 1 : -1) * rand(45, 95),
        r: HIT_SHARK
      });
      return;
    }

    /* Fala bojek: 1 na starcie, z czasem 2, rzadziej 3. Rozstaw pilnowany
       przy losowaniu, więc między każdą parą zawsze da się przejechać.  */
    var n = 1;
    if (Math.random() < 0.32 * d) n++;
    if (Math.random() < 0.10 * d) n++;

    var lo = SKI_MARGIN - 6, hi = W - SKI_MARGIN + 6;
    var xs = [];
    for (var tries = 0; tries < 40 && xs.length < n; tries++) {
      var x = rand(lo, hi), ok = true;
      for (var i = 0; i < xs.length; i++) {
        if (Math.abs(xs[i] - x) < BUOY_SEP) { ok = false; break; }
      }
      if (ok) xs.push(x);
    }

    for (var k = 0; k < xs.length; k++) {
      game.obstacles.push({ type: "buoy", x: xs[k], y: -60, vx: 0, r: HIT_BUOY });
    }
  }

  /* ------------------------------------------------------------- symulacja */

  function update(dt) {
    game.t += dt;
    if (game.lockout > 0) game.lockout -= dt;
    if (game.shake > 0) game.shake = Math.max(0, game.shake - dt * 40);

    /* Menu i ekran końcowy: woda płynie dalej, żeby tło żyło. */
    if (game.mode === MENU || game.mode === OVER) {
      game.scrollV = SPEED_MIN * 0.5;
      game.scroll += game.scrollV * dt;
      updateSpray(dt);
      return;
    }

    if (game.mode === WIPE) {
      game.scrollV = game.speed;
      game.scroll += game.speed * dt;
      game.speed = Math.max(SPEED_MIN * 0.4, game.speed - 320 * dt);
      moveObstacles(dt);
      updateSpray(dt);

      var f = game.wipe;
      f.t += dt;
      f.vy += 900 * dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.rot += f.vrot * dt;
      if (f.t > 0.75) endRun();
      return;
    }

    /* ------------------------------------------------------------- PLAY */

    game.speed = SPEED_MIN + (SPEED_MAX - SPEED_MIN) * difficulty();
    game.scrollV = game.speed;
    game.scroll += game.speed * dt;
    game.dist += game.speed * dt / PX_PER_M;
    el.dist.textContent = Math.floor(game.dist);

    /* skuter — sztywno w poziomie, przyspieszenie napędza wahadło */
    var ski = game.ski;
    var dir = steerDir();
    var prevVx = ski.vx;

    if (dir) ski.vx = clamp(ski.vx + dir * SKI_ACCEL * dt, -SKI_VX_MAX, SKI_VX_MAX);
    else     ski.vx -= ski.vx * Math.min(1, SKI_DRAG * dt);

    ski.x += ski.vx * dt;
    if (ski.x < SKI_MARGIN)     { ski.x = SKI_MARGIN;     ski.vx = 0; }
    if (ski.x > W - SKI_MARGIN) { ski.x = W - SKI_MARGIN; ski.vx = 0; }

    ski.ax = dt > 0 ? (ski.vx - prevVx) / dt : 0;
    ski.roll += (clamp(ski.vx / SKI_VX_MAX, -1, 1) * 0.34 - ski.roll) * Math.min(1, 9 * dt);

    /* flaming — odwrócone wahadło na sprężynie.
       Skręt w lewo (ax < 0) wyrzuca ptaka w prawo, stąd minus.          */
    var b = game.bird;
    b.w += (-ski.ax * COUPLE - SPRING * b.a) * dt;
    b.w -= b.w * Math.min(1, DAMP * dt);
    b.a += b.w * dt;

    /* Przekroczenie progu nie kończy przejazdu od razu — dopiero utrzymanie
       się poza nim. Jeden pechowy wychył wybacza, uporczywe szarpanie nie. */
    if (Math.abs(b.a) > TILT_LIMIT) {
      b.over += dt;
      if (b.over > TILT_GRACE) { wipeout("tilt"); return; }
    } else {
      b.over = 0;
    }

    /* trasa */
    game.spawn -= dt;
    if (game.spawn <= 0) { spawnWave(); game.spawn = spawnDelay(); }
    moveObstacles(dt);

    /* kolizje — okrąg skutera kontra okrąg przeszkody */
    for (var i = 0; i < game.obstacles.length; i++) {
      var o = game.obstacles[i];
      var dx = o.x - ski.x, dy = o.y - SKI_Y;
      var rr = o.r + HIT_SKI;
      if (dx * dx + dy * dy < rr * rr) { wipeout("hit"); return; }
    }

    /* kilwater — częstotliwość liczona z czasu, nie z liczby kroków */
    if (Math.random() < 45 * dt) {
      splash(ski.x + rand(-14, 14), SKI_Y + 18, 0.5);
    }
    updateSpray(dt);
  }

  function moveObstacles(dt) {
    for (var i = game.obstacles.length - 1; i >= 0; i--) {
      var o = game.obstacles[i];
      o.y += game.speed * dt;
      o.x += o.vx * dt;
      if (o.y > H + 90 || o.x < -110 || o.x > W + 110) game.obstacles.splice(i, 1);
    }
  }

  function updateSpray(dt) {
    for (var i = game.spray.length - 1; i >= 0; i--) {
      var p = game.spray[i];
      p.life -= dt;
      if (p.life <= 0) { game.spray.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += (p.vy + game.speed * 0.35) * dt;
      p.vy += 220 * dt;
    }
  }

  /* ----------------------------------------------------------- rysowanie */

  /* `a` to reszta akumulatora: ile czasu minęło od ostatniego kroku fizyki.
     Bez niej świat przesuwa się skokami — przy 120 Hz co trzecia klatka nie
     dostaje żadnego kroku, a co trzecia dostaje dwa, i to widać jako
     szarpanie mimo równych czasów klatek.                                */
  function render(a) {
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

    if (game.shake > 0) {
      ctx.translate(rand(-game.shake, game.shake) * 0.5,
                    rand(-game.shake, game.shake) * 0.5);
    }

    drawWater(game.scroll + game.scrollV * a, game.t + a);

    /* piana i kilwater pod obiektami */
    ctx.fillStyle = "rgba(255,255,255,.8)";
    for (var i = 0; i < game.spray.length; i++) {
      var p = game.spray[i];
      ctx.globalAlpha = clamp(p.life * 2, 0, 1) * 0.85;
      ctx.beginPath();
      ctx.arc(p.x + p.vx * a, p.y + (p.vy + game.speed * 0.35) * a, p.r, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* przeszkody — sortowane po y, żeby bliższe zasłaniały dalsze */
    game.obstacles.sort(function (p, q) { return p.y - q.y; });
    for (var k = 0; k < game.obstacles.length; k++) {
      var o = game.obstacles[k];
      ctx.save();
      ctx.translate(o.x + o.vx * a, o.y + game.speed * a);
      if (o.type === "buoy") {
        ctx.rotate(Math.sin(game.t * 2 + o.x) * 0.09);
        sprite("obstacle_buoy");
      } else {
        ctx.scale(o.vx < 0 ? -1 : 1, 1);
        sprite("obstacle_shark");
      }
      ctx.restore();
    }

    if (game.mode === MENU) { drawIdleTotem(); return; }

    drawRider(a);
  }

  /* Skuter + kapibara + flaming. W trakcie WIPEOUT flaming leci osobno. */
  function drawRider(a) {
    var ski = game.ski;
    var tilt = game.bird.a + game.bird.w * a;

    ctx.save();
    ctx.translate(ski.x + ski.vx * a, SKI_Y);
    ctx.rotate(ski.roll * 0.5);
    sprite("jetski");

    /* kapibara siedzi sztywno, tylko lekko kładzie się w skręt */
    ctx.save();
    ctx.translate(0, CAPY_DY);
    ctx.rotate(ski.roll * 0.35);
    sprite("capybara");
    ctx.restore();

    /* flaming obraca się wokół stawu na czubku głowy kapibary.
       Po wipeoucie już go tu nie ma — jest w wodzie.                 */
    if (game.mode === PLAY) {
      ctx.save();
      ctx.translate(0, PIVOT_DY);
      ctx.rotate(tilt);
      sprite("flamingo");
      ctx.restore();
    }
    ctx.restore();

    if (game.mode === WIPE && game.wipe) {
      ctx.save();
      ctx.translate(game.wipe.x + game.wipe.vx * a, game.wipe.y + game.wipe.vy * a);
      ctx.rotate(game.wipe.rot + game.wipe.vrot * a);
      sprite("flamingo");
      ctx.restore();
    }

    /* ostrzeżenie: im bliżej progu, tym mocniejsza czerwona winieta */
    var risk = clamp((Math.abs(tilt) / TILT_LIMIT - 0.55) / 0.45, 0, 1);
    if (risk > 0 && game.mode === PLAY) {
      var v = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.62);
      v.addColorStop(0, "rgba(229,57,53,0)");
      v.addColorStop(1, "rgba(229,57,53," + (risk * 0.55).toFixed(3) + ")");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* Na menu totem stoi spokojnie i tylko się kołysze. */
  function drawIdleTotem() {
    if (!el.splash.hidden) return;      // jest splash art, nie dublujemy

    var sway = Math.sin(game.t * 1.6) * 0.09;
    ctx.save();
    ctx.translate(W / 2, SKI_Y + 62);
    sprite("jetski");
    ctx.save();
    ctx.translate(0, CAPY_DY);
    sprite("capybara");
    ctx.restore();
    ctx.save();
    ctx.translate(0, PIVOT_DY);
    ctx.rotate(sway);
    sprite("flamingo");
    ctx.restore();
    ctx.restore();
  }

  /* --------------------------------------------------------------- pętla */

  var last = 0, acc = 0;

  function frame(now) {
    if (!last) last = now;
    var dt = Math.min((now - last) / 1000, 0.25);   // po powrocie z tła nie skacz
    last = now;

    /* Fizyka zawsze krokiem FIXED: wychylenie flaminga decyduje o przegranej,
       więc nie może zależeć od tego, ile klatek wyrabia urządzenie.        */
    acc += dt;
    var steps = 0;
    while (acc >= FIXED && steps < 40) { update(FIXED); acc -= FIXED; steps++; }
    if (steps === 40) acc = 0;

    render(acc);
    requestAnimationFrame(frame);
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) last = 0;
  });

  /* ---------------------------------------------------------------- start */

  loadArt(
    ["jetski", "capybara", "flamingo", "obstacle_buoy", "obstacle_shark",
     "water_tile", "totem_duo"],
    function () {
      if (ART.totem_duo) {
        el.splash.hidden = false;
        el.menu.classList.add("has-splash");   // totem jest w splashu, nie na canvasie
      }
      el.bestM.textContent = best;
      baked = true;
      resize();          // resize sam przepala bitmapy pod aktualną skalę
      requestAnimationFrame(frame);
    }
  );
})();
