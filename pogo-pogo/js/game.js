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

  /* Skuter stoi w miejscu, świat płynie. Im niżej, tym dłużej przeszkoda
     jedzie przez ekran, zanim dojedzie — czysty zysk czasu na reakcję.  */
  var SKI_Y      = H * 0.81;
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

  var SPEED_MIN  = 190;               // px/s przewijania wody na starcie
  var SPEED_STEP = 58;                // przyrost na próg
  var SPEED_CAP  = 600;               // wyżej czas reakcji spada poniżej uczciwego
  var LEVEL_1    = 50;                // pierwszy próg — blisko startu
  var LEVEL_2    = 115;               // drugi próg
  var LEVEL_M    = 80;                // dalej co tyle metrów
  var PX_PER_M   = 18;

  var WATER_TILE = 256;               // logiczny bok kafelka wody
  var BUOY_SEP   = 52;                // tyle, żeby bojki się nie nakładały
  var LANE_LO    = SKI_MARGIN + 8;
  var LANE_HI    = W - SKI_MARGIN - 8;
  var CLEAR      = HIT_BUOY + HIT_W + 24;     // korytarz przejazdu: 24 px luzu

  /* Obszar kolizji skutera jest elipsą, nie kołem: zahaczenie palika bokiem
     było najczęstszą przyczyną poczucia niesprawiedliwości, a skuter ma
     96 px szerokości przy dużo węższym kadłubie. W poziomie liczy się więc
     mniej więcej szerokość kapibary, w pionie zostaje po staremu.       */
  var HIT_W = 20, HIT_H = 26;
  var HIT_BUOY = 18, HIT_SHARK = 20;
  var BEST_KEY = "pogo-pogo:best";

  /* Wersja zasobów. Przeglądarki trzymały stary game.js i stare sprite'y po
     wdrożeniu — gracz widział poprzednią wersję gry mimo udanej publikacji.
     PODBIJ TĘ LICZBĘ (i te w index.html) przy każdym wdrożeniu.          */
  var VER = "2";

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
      img.src = "assets/" + name + ".svg?v=" + VER;
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
    bakeFaces();
  }

  /* Twarze do Reaction Cam NIE idą przez dopasowanie do obrysu jak reszta
     sprite'ów. Są skomponowane jako okrąg (r=62 w płótnie 128) i mają być
     wpasowane w ramkę okienka — dociąganie do narysowanych pikseli
     przeskalowałoby je względem kadru, który autor sam ustawił.        */
  var FACE = {};

  function bakeFaces() {
    ["face_chill", "face_panic"].forEach(function (n) {
      var img = ART[n];
      if (!img) { FACE[n] = null; return; }
      var size = 2 * CAM_R * (64 / 62) * 1.02;      // r=62 ma trafić w CAM_R
      var px = Math.max(2, Math.round(size * scaleX));
      var c = document.createElement("canvas");
      c.width = c.height = px;
      var g = c.getContext("2d");
      g.imageSmoothingQuality = "high";
      g.drawImage(img, 0, 0, px, px);
      FACE[n] = { c: c, s: size };
    });
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
    bird: { a: 0, w: 0, over: 0, panic: 0 },
    scrollV: 0,
    obstacles: [],
    spray: [],
    spawn: 0,
    gapTime: 1.1,
    safeX: W / 2,
    level: 0,
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
    game.bird.a = 0; game.bird.w = 0; game.bird.over = 0; game.bird.panic = 0;
    game.obstacles.length = 0;
    game.spray.length = 0;
    game.spawn = 1.1;
    game.gapTime = 1.1;
    game.safeX = W / 2;
    game.level = 0;
    game.shake = 0;
    el.dist.classList.remove("bump");
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
      : "A niech to flaming kopnie!";
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

  /* Trudność rośnie skokowo i BEZ SUFITU. Wcześniej wszystko zatrzymywało się
     na szóstym progu, więc po ~540 m gra była płaska w nieskończoność —
     dawało się jechać kilka tysięcy metrów z nudów. Prędkość ma sufit, bo
     powyżej niego czas reakcji spada poniżej uczciwego, ale gęstość trasy
     rośnie dalej i to ona kończy przejazd.                                */
  function level() {
    var d = game.dist;
    if (d < LEVEL_1) return 0;
    if (d < LEVEL_2) return 1;
    return 2 + Math.floor((d - LEVEL_2) / LEVEL_M);
  }

  function spawnDelay() {
    return Math.max(0.17, 1.05 * Math.pow(0.87, level())) * rand(0.82, 1.22);
  }

  /* gapTime — ile czasu minęło od poprzedniej fali. Z tego wynika, jak daleko
     skuter zdążył się przemieścić, a więc jak daleko wolno odsunąć korytarz. */
  function spawnWave(gapTime) {
    var L = level();
    var d = clamp(L / 6, 0, 1);

    /* Rekin przecina ekran w poprzek, więc idzie sam. Na wyższych progach
       tnie szybciej — wolny rekin przelatywał bokiem i nic nie robił.   */
    if (Math.random() < 0.10 + 0.28 * d) {
      var fromLeft = Math.random() < 0.5;
      game.obstacles.push({
        type: "shark",
        x: fromLeft ? -50 : W + 50,
        y: -60,
        vx: (fromLeft ? 1 : -1) * rand(60, 90 + 110 * d),
        r: HIT_SHARK
      });
      return;
    }

    /* Fala bojek buduje się WOKÓŁ korytarza, a nie losowo. Korytarz może
       odsunąć się najwyżej o tyle, ile skuter zdąży pokonać przez gapTime,
       więc każda kolejna fala jest osiągalna z luki w poprzedniej. Dzięki
       tej gwarancji bojki nie muszą już trzymać szerokiego rozstawu między
       sobą i mogą tworzyć ścianę z jedną luką.                          */
    /* Przy krótkich odstępach ogranicza nie prędkość maksymalna, tylko
       rozpęd — z miejsca w 0,17 s skuter przejedzie 22 px, a nie 42.   */
    var reach = 0.35 * Math.min(SKI_VX_MAX * gapTime,
                                      0.5 * SKI_ACCEL * gapTime * gapTime);
    var safeX = clamp(game.safeX + rand(-reach, reach), LANE_LO, LANE_HI);

    var n = 1 + (Math.random() < 0.55 * clamp(L / 4, 0, 1) ? 1 : 0)
              + (Math.random() < 0.30 * clamp(L / 8, 0, 1) ? 1 : 0);

    var xs = [];
    for (var tries = 0; tries < 60 && xs.length < n; tries++) {
      var x = rand(LANE_LO - 14, LANE_HI + 14);
      if (Math.abs(x - safeX) < CLEAR) continue;      // korytarz zostaje pusty
      var ok = true;
      for (var i = 0; i < xs.length; i++) {
        if (Math.abs(xs[i] - x) < BUOY_SEP) { ok = false; break; }
      }
      if (ok) xs.push(x);
    }

    for (var k = 0; k < xs.length; k++) {
      game.obstacles.push({ type: "buoy", x: xs[k], y: -60, vx: 0, r: HIT_BUOY });
    }
    game.safeX = safeX;
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

    game.speed = Math.min(SPEED_CAP, SPEED_MIN + SPEED_STEP * level());

    /* Skok prędkości bez sygnału czyta się jak zacięcie — licznik metrów
       pulsuje, żeby było wiadomo, że to gra przyspieszyła.              */
    var lv = level();
    if (lv !== game.level) {
      game.level = lv;
      el.dist.classList.remove("bump");
      void el.dist.offsetWidth;          // wymuszenie restartu animacji
      el.dist.classList.add("bump");
    }
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

    /* Panika dla Reaction Cam. Sam odczyt chwilowy migotałby: `ax` jest
       niezerowe tylko przez 0,17 s rozpędu, więc mina wracałaby do spokoju
       w środku skrętu. Szybki atak, wolne opadanie.                      */
    var pt = panicTarget();
    b.panic += (pt - b.panic) * Math.min(1, (pt > b.panic ? 18 : 3.5) * dt);

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
    if (game.spawn <= 0) {
      spawnWave(game.gapTime);
      game.gapTime = spawnDelay();
      game.spawn = game.gapTime;
    }
    moveObstacles(dt);

    /* kolizje — okrąg skutera kontra okrąg przeszkody */
    for (var i = 0; i < game.obstacles.length; i++) {
      var o = game.obstacles[i];
      var dx = (o.x - ski.x) / (HIT_W + o.r);
      var dy = (o.y - SKI_Y) / (HIT_H + o.r);
      if (dx * dx + dy * dy < 1) { wipeout("hit"); return; }
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

    /* Reaction Cam to interfejs, a nie świat — wraca do bazowej macierzy,
       żeby nie drgała razem z ekranem przy wywrotce.                    */
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    drawCam(a);
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

  /* ------------------------------------------------------------ REACTION CAM
     Okrągły podgląd twarzy w lewym górnym rogu. Rysowany w kodzie, a nie
     z podmienianych SVG, bo mimika musi reagować w czasie rzeczywistym na
     kąt wahadła — gotowe sprite'y mają zamrożone twarze.
     Cała treść jest funkcją dwóch liczb: `tilt` i `panic`.               */

  var CAM_X = 56, CAM_Y = 60, CAM_R = 38;
  var PANIC_FROM = 15 * Math.PI / 180;   // od tego kąta flaming zaczyna panikować

  /* Do czego panika DĄŻY: wychylenie albo gwałtowność skrętu. Szarpnięcie
     kierownicą przeraża ptaka, zanim jeszcze zdąży się przechylić.       */
  function panicTarget() {
    var byTilt  = clamp((Math.abs(game.bird.a) - PANIC_FROM) / (TILT_LIMIT - PANIC_FROM), 0, 1);
    var bySteer = clamp(Math.abs(game.ski.ax) / SKI_ACCEL, 0, 1) * 0.7;
    return Math.max(byTilt, bySteer);
  }

  /* Ramka przechodzi ze złotej w koralową płynnie — próg skokowy migotał
     w okolicy wartości granicznej.                                      */
  function ringColor(p) {
    return "rgb(" + Math.round(255 + 0 * p) + "," +
                    Math.round(201 + (112 - 201) * p) + "," +
                    Math.round(77 + (67 - 77) * p) + ")";
  }

  function drawCam(a) {
    if (game.mode === MENU) return;

    var tilt  = game.bird.a + game.bird.w * a;
    var panic = game.bird.panic;
    var wiped = (game.mode === WIPE || game.mode === OVER);
    var wt    = wiped && game.wipe ? clamp((game.wipe.t + a) / 0.45, 0, 1) : 0;

    ctx.save();
    ctx.translate(CAM_X, CAM_Y);

    /* ---------------------------------------------------- wnętrze okienka */
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, CAM_R, 0, 6.2832);
    ctx.clip();

    var g = ctx.createLinearGradient(0, -CAM_R, 0, CAM_R);
    g.addColorStop(0, "#3CB4E0");
    g.addColorStop(1, "#0A6FA8");
    ctx.fillStyle = g;
    ctx.fillRect(-CAM_R, -CAM_R, CAM_R * 2, CAM_R * 2);

    ctx.strokeStyle = "rgba(255,255,255,.22)";   // woda w tle płynie
    ctx.lineWidth = 2;
    for (var i = 0; i < 3; i++) {
      var wy = mod(i * 26 - (game.scroll + game.scrollV * a) * 0.3, 78) - 39;
      ctx.beginPath();
      ctx.moveTo(-CAM_R, wy);
      ctx.lineTo(CAM_R, wy);
      ctx.stroke();
    }

    if (FACE.face_chill) {
      /* Dostarczone twarze: spokojna zawsze pod spodem, panika nakładana
         z przezroczystością, więc reakcja jest płynna, a nie przełącznikiem.
         Kapibara jest w obu plikach tym samym kształtem, więc przenikanie
         jej nie rusza — zmienia się wyłącznie flaming.                  */
      ctx.save();
      if (panic > 0.02) {
        ctx.translate(rand(-1, 1) * 2.4 * panic, rand(-1, 1) * 2.4 * panic);
      }
      ctx.rotate(tilt * 0.18);

      var fc = FACE.face_chill;
      ctx.drawImage(fc.c, -fc.s / 2, -fc.s / 2, fc.s, fc.s);

      var pa = wiped ? 1 : clamp(panic * 1.35, 0, 1);
      if (pa > 0.01 && FACE.face_panic) {
        var fp = FACE.face_panic;
        ctx.globalAlpha = pa;
        ctx.drawImage(fp.c, -fp.s / 2, -fp.s / 2, fp.s, fp.s);
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    } else {

    /* Zapas, gdyby plików twarzy zabrakło. Obie głowy razem zajmują całą
       średnicę, więc treść jedzie mniejsza — inaczej dziób i podbródek
       ucinają się o krawędź.                                           */
    ctx.save();
    ctx.scale(0.86, 0.86);

    /* --- kapibara: niewzruszona bez względu na wszystko ---------------- */
    ctx.save();
    ctx.translate(0, 17);
    ctx.lineJoin = "round";

    ctx.fillStyle = "#8B5E33";
    ctx.beginPath();
    ctx.ellipse(-21, -15, 7, 6, 0, 0, 6.2832);
    ctx.ellipse(21, -15, 7, 6, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#A9764A";
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 22, 0, 0, 6.2832);
    ctx.fill();
    ctx.strokeStyle = "#3A2716";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#FF6F9C";                    // różowe okulary
    ctx.beginPath();
    ctx.ellipse(-11, -4, 10, 7, 0, 0, 6.2832);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(11, -4, 10, 7, 0, 0, 6.2832);
    ctx.fill();
    ctx.strokeStyle = "#3A2716";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(-11, -4, 10, 7, 0, 0, 6.2832);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(11, -4, 10, 7, 0, 0, 6.2832);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-2, -4); ctx.lineTo(2, -4);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,.6)";       // odblask w szkłach
    ctx.beginPath();
    ctx.ellipse(-14, -7, 3.4, 2, -0.5, 0, 6.2832);
    ctx.ellipse(8, -7, 3.4, 2, -0.5, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#8B5E33";                    // pysk
    ctx.beginPath();
    ctx.ellipse(0, 11, 9, 6, 0, 0, 6.2832);
    ctx.fill();
    ctx.fillStyle = "#3A2716";
    ctx.beginPath();
    ctx.ellipse(0, 8, 3.6, 2.4, 0, 0, 6.2832);
    ctx.fill();
    ctx.restore();

    /* --- flaming: cała ekspresja siedzi tutaj -------------------------- */
    if (game.mode === PLAY) {
      ctx.save();
      ctx.translate(0, 6);
      ctx.rotate(tilt * 1.5);                     // wychylenie wzmocnione
      if (panic > 0.02) {                          // drżenie głowy
        ctx.translate(rand(-1, 1) * 2.4 * panic, rand(-1, 1) * 2.4 * panic);
      }
      ctx.translate(0, -34);
      ctx.lineJoin = "round";

      ctx.strokeStyle = "#FF6F9C";                // szyja
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 32);
      ctx.quadraticCurveTo(7, 15, 2, 5);
      ctx.stroke();

      ctx.fillStyle = "#FF83A9";                  // głowa
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 11, 0, 0, 6.2832);
      ctx.fill();
      ctx.strokeStyle = "#7A2540";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      var er = 3.8 + 3.4 * panic;                 // oczy rosną w panice
      ctx.fillStyle = "#FFF";
      ctx.beginPath();
      ctx.ellipse(-4, -2, er, er * 0.95, 0, 0, 6.2832);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(6, -2, er, er * 0.95, 0, 0, 6.2832);
      ctx.fill();
      ctx.strokeStyle = "#7A2540";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(-4, -2, er, er * 0.95, 0, 0, 6.2832);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(6, -2, er, er * 0.95, 0, 0, 6.2832);
      ctx.stroke();

      var pr = 2.2 - 0.8 * panic;                 // źrenice się kurczą
      ctx.fillStyle = "#151515";
      ctx.beginPath();
      ctx.arc(-4, -2, pr, 0, 6.2832);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(6, -2, pr, 0, 6.2832);
      ctx.fill();

      var open = 5 + 11 * panic;                  // dziób się otwiera
      ctx.fillStyle = "#FFC94D";
      ctx.strokeStyle = "#7A2540";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(9, 2);
      ctx.lineTo(26, -1 - open * 0.35);
      ctx.lineTo(26, -1 + open * 0.65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();   // koniec zmniejszenia treści
    }

    /* --- wipeout: najpierw uderzenie, potem zmoczenie ------------------ */
    if (wiped) {
      /* faza 1: rozbryzg w obiektyw, pierwsze ~0,15 s */
      if (wt < 0.34) {
        var f = 1 - wt / 0.34;
        ctx.fillStyle = "rgba(255,255,255," + (f * 0.75).toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(0, 6, CAM_R * (0.3 + 1.1 * (1 - f)), 0, 6.2832);
        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255," + (f * 0.9).toFixed(3) + ")";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        for (var sp = 0; sp < 8; sp++) {
          var ang = sp * 0.7854 + 0.3;
          var r0 = CAM_R * (0.25 + 0.7 * (1 - f));
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * r0, 6 + Math.sin(ang) * r0);
          ctx.lineTo(Math.cos(ang) * (r0 + 9), 6 + Math.sin(ang) * (r0 + 9));
          ctx.stroke();
        }
      }

      /* faza 2: woda podchodzi — na tyle przezroczysta, żeby zmoczoną
         kapibarę było widać pod powierzchnią.                          */
      var lv = CAM_R - 2 * CAM_R * wt;
      ctx.fillStyle = "rgba(41,182,246,.62)";
      ctx.beginPath();
      ctx.moveTo(-CAM_R, lv);
      for (var x = -CAM_R; x <= CAM_R; x += 7) {
        ctx.lineTo(x, lv + Math.sin(x * 0.4 + (game.t + a) * 11) * 3.2);
      }
      ctx.lineTo(CAM_R, CAM_R);
      ctx.lineTo(-CAM_R, CAM_R);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,.7)";   // lustro wody
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var x2 = -CAM_R; x2 <= CAM_R; x2 += 7) {
        var yy = lv + Math.sin(x2 * 0.4 + (game.t + a) * 11) * 3.2;
        if (x2 === -CAM_R) ctx.moveTo(x2, yy); else ctx.lineTo(x2, yy);
      }
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,.85)";    // bąbelki
      for (var bb = 0; bb < 7; bb++) {
        var bx = -26 + bb * 9;
        var by = lv + 10 + mod(bb * 13 - (game.t + a) * 40, 42);
        ctx.beginPath();
        ctx.arc(bx, by, 1.6 + (bb % 3), 0, 6.2832);
        ctx.fill();
      }
    }

    ctx.restore();   // koniec obcięcia do koła

    /* ------------------------------------------------------------ ramka */
    ctx.beginPath();
    ctx.arc(0, 0, CAM_R + 1, 0, 6.2832);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#08324A";
    ctx.stroke();

    var ring = ringColor(wiped ? 1 : panic);
    ctx.shadowColor = ring;
    ctx.shadowBlur = 8 + 8 * (wiped ? 1 : panic);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = ring;
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* czerwona kropka „na żywo" — puls 1 Hz */
    if (!wiped && Math.sin((game.t + a) * 6.2832) > -0.3) {
      ctx.fillStyle = "#FF3B30";
      ctx.beginPath();
      ctx.arc(CAM_R * 0.72, -CAM_R * 0.72, 4, 0, 6.2832);
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "#08324A";
      ctx.stroke();
    }

    ctx.restore();
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
     "water_tile", "totem_duo", "face_chill", "face_panic"],
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
