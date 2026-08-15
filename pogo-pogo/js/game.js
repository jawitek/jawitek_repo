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

  /* Ułożenie totemu jest LICZONE, nie wpisane. Wysokości sprite'ów biorą się
     z obrysu treści, więc każda podmiana grafiki albo zmiana skali
     przesuwałaby styki — a ręczne stałe trzeba by wtedy dostrajać od nowa.
     `capyDy` i `pivotDy` wylicza layoutTotem() po przepaleniu bitmap.    */
  var CAPY_SEAT  = 0.10;              // dół kapibary, ułamek wysokości skutera nad jego środkiem
  var HEAD_SINK  = 7;                 // o tyle stopy flaminga wchodzą w obrys czaszki
  var capyDy     = -18;               // przeliczane
  var pivotDy    = -72;               // przeliczane
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

  var SPEED_MIN  = 248;               // px/s na starcie — dawny próg z 50 m
  var SPEED_STEP = 58;                // przyrost na próg
  /* Sufit o jeden próg niżej, niż pozwalałby wzór. 596 px/s okazało się nie do
     utrzymania w grze: przeszkoda przelatywała ekran w 0,96 s, a przejechanie
     całego pasa zajmuje 1,1 s — więc reakcja bywała fizycznie niemożliwa.
     Przy 538 px/s jest to 1,07 s i wraca margines. Wyżej rośnie już tylko
     gęstość trasy.                                                       */
  var SPEED_CAP  = 538;
  /* Gra zaczyna się od razu na dawnym progu z 50 m, a kolejny wchodzi na 60 m
     zamiast na 115 m. Rozbieg był za długi — pierwsze kilkanaście sekund nie
     stawiało żadnego oporu. Dalsze progi zostają co LEVEL_M.            */
  var LEVEL_1    = 60;                // pierwszy próg ponad prędkość startową
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
  var RAMP_W = 30, RAMP_H = 20;       // strefa najazdu na skocznię

  /* Skocznia wodna. Kontakt nie zabija — wyrzuca w powietrze. W locie
     kolizje są wyłączone, ale bezwładność flaminga jest mocniejsza,
     a przy lądowaniu obowiązuje ostrzejszy próg wychylenia.            */
  var JUMP_TIME  = 1.2;               // czas lotu
  var JUMP_SCALE = 0.25;              // o tyle rośnie totem w szczycie
  var JUMP_BOOST = 0.35;              // o tyle przyspiesza woda w szczycie
  var AIR_COUPLE = 1.5;               // mnożnik bezwładności w powietrzu
  var LAND_LIMIT = 25 * Math.PI / 180;
  var LAND_GRACE = 0.30;              // nietykalność tuż po wodowaniu
  var JUMP_BONUS = 50;                // metrów za udane lądowanie

  /* Przedmioty. Slow-mo resetuje narastające tempo — po nim gra rozpędza się
     od nowa, co jest właściwą nagrodą: nie tylko 3 s spokoju, ale i oddech
     po nich. Serce działa biernie jako jedno dodatkowe życie.           */
  var ITEM_R      = 22;               // promień zbierania
  var SLOW_TIME   = 3.0;
  var SLOW_FACTOR = 0.30;
  var SLOW_COUPLE = 0.45;             // w spowolnieniu ptak buja się łagodniej
  var SLOW_DAMP   = 1.7;              // i szybciej się uspokaja
  var SPEED_RECOVER = 110;            // px/s² rozpędzania po spowolnieniu
  var NEAR_MISS   = 15;               // px prześwitu liczone jako „o włos"
  var NEAR_BONUS  = 10;               // metrów za near miss
  var NEAR_TEXTS  = ["LUCKY!", "CLOSE ONE!", "STILL CHILL", "SWEATY!"];
  var ITEM_CLOCK  = 0.05;             // szansa na zegar w fali
  var ITEM_HEART  = 0.09;             // szansa na serce w fali

  /* Rekin patroluje sinusoidą zamiast przecinać ekran po prostej — gracz musi
     przewidzieć tor płetwy, a nie tylko zauważyć przeszkodę.            */
  /* Częstotliwość liczona na sztukę, tak żeby PRĘDKOŚĆ BOCZNA nie przekraczała
     SHARK_VLAT. Stała częstotliwość dawała v = amp · FREQ · przewijanie, więc
     przy 600 px/s i amplitudzie 50 rekin śmigał 900 px/s — 3,6× szybciej niż
     gracz. Długość fali trzymana w rozsądnych granicach, żeby tor pozostał
     czytelny na jednym ekranie.                                          */
  var SHARK_VLAT = 140;               // px/s, maks. prędkość boczna
  var SHARK_WAVE = [520, 1200];       // dopuszczalna długość fali w px
  var SHARK_AMP  = [30, 50];          // wychylenie w bok
  var SHARK_TILT = 6 * Math.PI / 180; // kąt natarcia płetwy

  var PARALLAX   = 1.4;               // o ile szybciej lecą kreski pędu
  var WATER_LAG  = 0.8;               // tło płynie wolniej niż przeszkody
  var WAKE_LIFE  = 0.75;              // jak długo żyje bąbelek smugi
  var BEST_KEY = "pogo-pogo:best";

  /* Wersja zasobów. Przeglądarki trzymały stary game.js i stare sprite'y po
     wdrożeniu — gracz widział poprzednią wersję gry mimo udanej publikacji.
     PODBIJ TĘ LICZBĘ (i te w index.html) przy każdym wdrożeniu.          */
  var VER = "16";

  /* -------------------------------------------------------------- dźwięk
     Wszystko syntezowane w Web Audio — zero plików, zero pobierania, działa
     offline. Przeglądarki blokują dźwięk do pierwszego gestu użytkownika,
     więc kontekst powstaje dopiero przy pierwszym dotknięciu; wcześniejsze
     próby byłyby ciche bez żadnego błędu.                                */

  var MUTE_KEY = "pogo-pogo:mute";
  var audio = { ctx: null, out: null, muted: false };
  try { audio.muted = localStorage.getItem(MUTE_KEY) === "1"; } catch (e) {}

  function audioWake() {
    if (audio.muted) return null;
    if (!audio.ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        audio.ctx = new AC();
        audio.out = audio.ctx.createGain();
        audio.out.gain.value = 0.32;
        audio.out.connect(audio.ctx.destination);
      } catch (e) { return null; }
    }
    if (audio.ctx.state === "suspended") audio.ctx.resume();
    return audio.ctx;
  }

  /* Pojedynczy ton z obwiednią. f2 daje zjazd albo wzlot częstotliwości. */
  function tone(f, f2, dur, type, gain, delay) {
    var c = audio.ctx; if (!c) return;
    var t = c.currentTime + (delay || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(f, t);
    if (f2 && f2 !== f) o.frequency.exponentialRampToValueAtTime(Math.max(1, f2), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain || 0.25, t + Math.min(0.02, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(audio.out);
    o.start(t); o.stop(t + dur + 0.02);
  }

  /* Szum — plusk, rozbryzg, świst minięcia. */
  function noise(dur, gain, from, to, delay) {
    var c = audio.ctx; if (!c) return;
    var t = c.currentTime + (delay || 0);
    var n = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var src = c.createBufferSource(); src.buffer = buf;
    var f = c.createBiquadFilter(); f.type = "bandpass";
    f.frequency.setValueAtTime(from, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    f.Q.value = 0.9;
    var g = c.createGain(); g.gain.value = gain;
    src.connect(f); f.connect(g); g.connect(audio.out);
    src.start(t); src.stop(t + dur);
  }

  var SOUNDS = {
    ui:     function () { tone(420, 640, 0.10, "square", 0.18); },
    tier:   function () { tone(660, 660, 0.07, "square", 0.16);
                          tone(990, 990, 0.09, "square", 0.16, 0.08); },
    jump:   function () { tone(200, 720, 0.20, "square", 0.24);
                          noise(0.18, 0.20, 500, 2200); },
    land:   function () { noise(0.26, 0.28, 1800, 380);
                          tone(520, 780, 0.12, "triangle", 0.20, 0.04); },
    near:   function () { noise(0.16, 0.13, 900, 2600); },
    clock:  function () { tone(880, 240, 0.42, "triangle", 0.22); },
    shield: function () { tone(520, 780, 0.09, "triangle", 0.22);
                          tone(880, 1180, 0.14, "triangle", 0.20, 0.08); },
    lose:   function () { tone(320, 70, 0.34, "sawtooth", 0.24);
                          noise(0.28, 0.22, 1400, 300); },
    crash:  function () { noise(0.34, 0.30, 1200, 220);
                          tone(180, 55, 0.36, "sawtooth", 0.26); }
  };

  function snd(name) {
    if (audio.muted || !SOUNDS[name]) return;
    if (!audioWake()) return;
    try { SOUNDS[name](); } catch (e) {}
  }

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
    capybara:       { w: 68, anchor: "bottom", fbW: 58, fbH: 64, fb: fbCapybara },
    flamingo:       { w: 62, anchor: "bottom", fbW: 48, fbH: 78, fb: fbFlamingo },
    obstacle_buoy:  { w: 44, anchor: "center", fbW: 40, fbH: 52, fb: fbBuoy },
    obstacle_shark: { w: 58, anchor: "center", fbW: 64, fbH: 46, fb: fbShark },
    shark_fin:      { w: 58, anchor: "center", fbW: 64, fbH: 46, fb: fbShark },
    ramp:           { w: 82, anchor: "center", fbW: 82, fbH: 52, fb: fbRamp },
    item_slowmo:    { w: 40, anchor: "center", fbW: 40, fbH: 40, fb: fbSlowmo },
    item_heart:     { w: 40, anchor: "center", fbW: 40, fbH: 40, fb: fbHeart }
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
    layoutTotem();
  }

  /* Kapibara siada na siodełku, flaming staje jej na głowie. Oba styki
     wynikają z rzeczywistych wysokości przepalonych bitmap, więc powiększenie
     kapibary albo nowy rysunek nie zostawiają dziury ani zachodzenia.    */
  function layoutTotem() {
    var skiH  = BAKE.jetski   ? BAKE.jetski.h   : BOX.jetski.fbH;
    var capyH = BAKE.capybara ? BAKE.capybara.h : BOX.capybara.fbH;
    capyDy  = -skiH * CAPY_SEAT;
    pivotDy = capyDy - capyH + HEAD_SINK;
  }

  /* Twarze do Reaction Cam NIE idą przez dopasowanie do obrysu jak reszta
     sprite'ów. Są skomponowane jako okrąg (r=62 w płótnie 128) i mają być
     wpasowane w ramkę okienka — dociąganie do narysowanych pikseli
     przeskalowałoby je względem kadru, który autor sam ustawił.        */
  var FACE = {};

  function bakeFaces() {
    ["face_chill", "face_panic", "face_alone"].forEach(function (n) {
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
    waterCanvas = null;
    var img = ART.water_tile;
    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    var side = Math.max(2, Math.round(WATER_TILE * scaleX));
    var c = document.createElement("canvas");
    c.width = side; c.height = side;
    var g = c.getContext("2d", { willReadFrequently: true });
    g.imageSmoothingQuality = "high";
    g.drawImage(img, 0, 0, side, side);
    waterCanvas = c;
    waterMirror = !isSeamless(g, side);
  }

  /* Czy przeciwległe krawędzie kafelka do siebie pasują? Przy zwykłym
     powtarzaniu stykają się ze sobą, więc rozjazd widać jako szew. Mierzymy
     to zamiast zakładać — kafelek bywa podmieniany, a od odpowiedzi zależy,
     czy wolno użyć taniego `repeat`, czy trzeba odbijać.
     Gdy odczyt pikseli jest niemożliwy (file://), wybieramy lustro: nigdy nie
     pokazuje szwu, więc jest bezpieczniejszym domyślnym.                */
  function isSeamless(g, side) {
    try {
      var d = g.getImageData(0, 0, side, side).data;
      var at = function (x, y) { return (y * side + x) * 4; };
      var sumH = 0, sumV = 0;
      for (var i = 0; i < side; i++) {
        var a = at(0, i), b = at(side - 1, i);
        sumH += Math.abs(d[a] - d[b]) + Math.abs(d[a + 1] - d[b + 1]) + Math.abs(d[a + 2] - d[b + 2]);
        var c2 = at(i, 0), e = at(i, side - 1);
        sumV += Math.abs(d[c2] - d[e]) + Math.abs(d[c2 + 1] - d[e + 1]) + Math.abs(d[c2 + 2] - d[e + 2]);
      }
      return (sumH / side) < 24 && (sumV / side) < 24;
    } catch (err) {
      return false;
    }
  }

  /* Kafelkowanie LUSTRZANE, nie zwykłe powtarzanie.

     Dostarczony kafelek nie jest bezszwowy: ma pionowy gradient na całą
     wysokość i plamy światła, które nie zawijają się na krawędziach. Przy
     zwykłym `repeat` widać przez to twarde pasy co 256 px i pionowy szew.
     Odbijanie co drugiej kolumny i co drugiego wiersza sprawia, że stykają
     się zawsze dwie identyczne krawędzie — szwy znikają dla DOWOLNEGO
     kafelka, także takiego, który ktoś wgra później. Kosztem jest lustrzana
     powtarzalność wzoru, na wodzie niezauważalna.                      */
  function drawWaterTiles(scroll) {
    var t = WATER_TILE;
    var period = waterMirror ? t * 2 : t;   // z lustrem wzór powtarza się co dwa
    var off = mod(scroll * WATER_LAG, period);
    var cols = Math.ceil(W / t) + 1;
    var first = -Math.ceil(period / t) - 1;

    /* `+ off`, nie `- off`: tło ma uciekać w dół pod skuterem, tak samo jak
       nadpływające przeszkody. Przy przejściu z wzorca na kafelki znak się
       odwrócił i woda płynęła pod prąd.                                 */
    for (var i = first; i * t + off < H + t; i++) {
      var y = i * t + off;
      for (var j = 0; j < cols; j++) {
        if (!waterMirror) {
          ctx.drawImage(waterCanvas, j * t, y, t, t);
          continue;
        }
        ctx.save();
        ctx.translate(j * t + t / 2, y + t / 2);
        ctx.scale(mod(j, 2) === 1 ? -1 : 1, mod(i, 2) === 1 ? -1 : 1);
        ctx.drawImage(waterCanvas, -t / 2, -t / 2, t, t);
        ctx.restore();
      }
    }
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

  function fbRamp(w, h) {                         // zaczep: środek
    var hw = w / 2, hh = h / 2;
    ctx.lineJoin = "round";

    ctx.fillStyle = "rgba(4,40,64,.2)";
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.8, hw * 0.9, hh * 0.25, 0, 0, 6.2832);
    ctx.fill();

    ctx.fillStyle = "#D9534F";                    // pływaki
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.45, hw * 0.92, hh * 0.28, 0, 0, 6.2832);
    ctx.fill();
    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#F0AD4E";                    // najazd
    ctx.beginPath();
    ctx.moveTo(-hw * 0.72, hh * 0.4);
    ctx.lineTo(-hw * 0.5, -hh * 0.85);
    ctx.lineTo(hw * 0.5, -hh * 0.85);
    ctx.lineTo(hw * 0.72, hh * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#FFF";                     // strzałki w górę
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    for (var i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * hw * 0.3 - 8, hh * 0.1);
      ctx.lineTo(i * hw * 0.3, -hh * 0.4);
      ctx.lineTo(i * hw * 0.3 + 8, hh * 0.1);
      ctx.stroke();
    }
  }

  function fbSlowmo(w, h) {                       // zaczep: środek
    var r = w * 0.42;
    ctx.lineJoin = "round";
    ctx.fillStyle = "#FFC94D";
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = "#1A1A1A"; ctx.lineWidth = 3.5; ctx.stroke();
    ctx.fillStyle = "#FFF6E0";
    ctx.beginPath(); ctx.arc(0, 0, r * 0.72, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = "#1A1A1A"; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, -r * 0.5);
    ctx.moveTo(0, 0); ctx.lineTo(r * 0.36, r * 0.16);
    ctx.stroke();
    ctx.beginPath();                                // koronka
    ctx.moveTo(-r * 0.26, -r * 1.06); ctx.lineTo(r * 0.26, -r * 1.06);
    ctx.lineWidth = 5; ctx.stroke();
  }

  function fbHeart(w, h) {                          // zaczep: środek
    var k = w * 0.030;
    ctx.save();
    ctx.scale(k, k);
    ctx.beginPath();
    ctx.moveTo(0, 11);
    ctx.bezierCurveTo(-13, 1, -12, -9, -5.5, -9);
    ctx.bezierCurveTo(-1.5, -9, 0, -5.5, 0, -5.5);
    ctx.bezierCurveTo(0, -5.5, 1.5, -9, 5.5, -9);
    ctx.bezierCurveTo(12, -9, 13, 1, 0, 11);
    ctx.closePath();
    ctx.fillStyle = "#FF6F9C"; ctx.fill();
    ctx.strokeStyle = "#1A1A1A"; ctx.lineWidth = 2.2; ctx.lineJoin = "round";
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.65)";
    ctx.beginPath(); ctx.ellipse(-4.4, -3.6, 2.2, 1.5, -0.5, 0, 6.2832); ctx.fill();
    ctx.restore();
  }

  /* ---------------------------------------------------------------- woda */

  var waterCanvas = null, waterMirror = false;

  /* Warstwa 2 paralaksy: kreski pędu przy krawędziach, przewijane PARALLAX
     razy szybciej niż woda. Krawędzie, bo środek jest zajęty przez trasę,
     a szybszy ruch peryferiami czyta się jako prędkość, nie jako bałagan. */
  var lines = [];
  for (var li = 0; li < 26; li++) {
    var leftSide = li % 2 === 0;
    lines.push({
      x: leftSide ? rand(6, 54) : rand(W - 54, W - 6),
      y: rand(0, H),
      len: rand(16, 46),
      w: rand(1.5, 3),
      a: rand(0.10, 0.30)
    });
  }

  var foam = [];
  for (var i = 0; i < 46; i++) {
    foam.push({ x: rand(0, W), y: rand(0, H), r: rand(1, 3.2), s: rand(0.55, 1.25) });
  }

  function drawWater(scroll, t) {
    if (waterCanvas) {
      drawWaterTiles(scroll);

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
        var wy = mod(i * 48 + scroll * WATER_LAG, H + 96) - 48;
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
      ctx.arc(f.x, mod(f.y + scroll * WATER_LAG * f.s, H + 20) - 10, f.r, 0, 6.2832);
      ctx.fill();
    }

    /* kreski pędu — druga warstwa, szybsza od wody */
    ctx.lineCap = "round";
    for (var q = 0; q < lines.length; q++) {
      var ln = lines[q];
      var ly = mod(ln.y + scroll * PARALLAX, H + 80) - 40;
      ctx.strokeStyle = "rgba(255,255,255," + ln.a.toFixed(2) + ")";
      ctx.lineWidth = ln.w;
      ctx.beginPath();
      ctx.moveTo(ln.x, ly);
      ctx.lineTo(ln.x, ly + ln.len);
      ctx.stroke();
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
    slotS:  document.getElementById("slot-slowmo"),
    slotH:  document.getElementById("slot-heart"),
    slotArc: document.getElementById("slot-arc"),
    splash: document.getElementById("splash"),
    sticker: document.getElementById("over-sticker"),
    mute:   document.getElementById("mute")
  };

  function show(node, on) {
    node.hidden = !on;
    node.classList.toggle("is-on", !!on);
  }

  var best = 0;
  try { best = parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (e) {}
  function saveBest() { try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) {} }

  el.retry.addEventListener("click", function (e) { e.stopPropagation(); startRun(); });

  function refreshMute() {
    el.mute.textContent = audio.muted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
    el.mute.classList.toggle("is-off", audio.muted);
    el.mute.setAttribute("aria-pressed", audio.muted ? "true" : "false");
  }
  el.mute.addEventListener("click", function (e) {
    e.stopPropagation();
    audio.muted = !audio.muted;
    try { localStorage.setItem(MUTE_KEY, audio.muted ? "1" : "0"); } catch (err) {}
    refreshMute();
    if (!audio.muted) snd("ui");        // potwierdzenie, że dźwięk wrócił
  });
  refreshMute();

  /* Grafiki ekranów są opcjonalne: pokazują się dopiero, gdy plik faktycznie
     się wczyta. Splash ma dodatkowo zapas — jeśli nie ma jeszcze title_art,
     zostaje dotychczasowe totem_duo zamiast pustego miejsca.            */
  function optionalImage(img, onShow) {
    if (!img) return;
    var show = function () {
      if (!img.naturalWidth) return;
      img.hidden = false;
      if (onShow) onShow();
    };
    var fallback = function () {
      var alt = img.getAttribute("data-fallback");
      if (alt) { img.removeAttribute("data-fallback"); img.src = alt; }
    };
    img.addEventListener("load", show);
    img.addEventListener("error", fallback);

    /* Obrazek stoi w HTML PRZED skryptem, więc bywa wczytany, zanim ten kod
       się wykona — zdarzenie `load` już wtedy nie przyjdzie i grafika
       zostawała ukryta. Stan sprawdzamy więc też od razu.                */
    if (img.complete) { if (img.naturalWidth) show(); else fallback(); }
  }

  optionalImage(el.splash, function () { el.menu.classList.add("has-splash"); });
  optionalImage(el.sticker);

  /* Ikony przedmiotów: dopóki plików nie ma, w slotach zostaje znak
     zastępczy. Gdy się pojawią, podmieniają się same.                  */
  Array.prototype.forEach.call(document.querySelectorAll(".slot-ico"), function (img) {
    var swap = function () {
      if (!img.naturalWidth) return;
      img.hidden = false;
      var g = img.parentNode.querySelector(".slot-glyph");
      if (g) g.hidden = true;
    };
    img.addEventListener("load", swap);
    if (img.complete) swap();      // patrz optionalImage: load mógł już minąć
  });

  /* Sloty pokazują wyłącznie to, co gracz FAKTYCZNIE ma. Puste są ukryte —
     stale widoczna, wygaszona ikona zegara sugerowała przedmiot w zapasie,
     którego nie było.                                                    */
  function refreshSlots() {
    el.slotS.classList.toggle("is-full", game.slowT > 0);
    el.slotS.classList.toggle("is-live", game.slowT > 0);
    el.slotH.classList.toggle("is-full", game.slots.heart);
  }

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
    items: [],
    wake: [],
    pops: [],
    slots: { heart: false },
    spawned: 0,
    slowT: 0,
    hasBird: true,
    flyaway: null,
    jumpT: 0,
    landGrace: 0,
    toast: null,
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
    game.spawn = 1.1 * SPEED_MIN;
    game.spawned = 0;
    game.items.length = 0;
    game.wake.length = 0;
    game.pops.length = 0;
    game.slots.heart = false;
    game.slowT = 0;
    game.hasBird = true;
    game.flyaway = null;
    game.jumpT = 0;
    game.landGrace = 0;
    game.toast = null;
    game.gapTime = 1.1;
    game.safeX = W / 2;
    game.level = 0;
    game.shake = 0;
    el.dist.classList.remove("bump");
    game.wipe = null;

    refreshSlots();
    snd("ui");
    show(el.menu, false);
    show(el.over, false);
    el.hud.hidden = false;
    el.dist.textContent = "0";
  }

  function tap() {
    if (game.mode === MENU) startRun();
    else if (game.mode === OVER && game.lockout <= 0) startRun();
  }

  /* Każde śmiertelne zdarzenie idzie tędy. Serce w slocie zamienia je na
     utratę flaminga zamiast końca przejazdu.                           */
  function fatal(cause) {
    if (game.slots.heart) {
      game.slots.heart = false;
      refreshSlots();
      loseBird();
      return;
    }
    wipeout(cause);
  }

  function loseBird() {
    snd("lose");
    game.hasBird = false;
    game.bird.a = 0; game.bird.w = 0; game.bird.over = 0; game.bird.panic = 0;
    game.landGrace = Math.max(game.landGrace, 0.8);   // chwila na otrząśnięcie się
    game.shake = 10;

    /* flaming wylatuje bokiem, kręcąc się */
    var dir = Math.random() < 0.5 ? -1 : 1;
    game.flyaway = {
      x: game.ski.x, y: SKI_Y + pivotDy,
      vx: dir * rand(190, 260), vy: -rand(340, 420),
      rot: 0, vrot: dir * rand(7, 11)
    };

    for (var i = 0; i < 22; i++) {                    // pękające serce
      game.spray.push({
        x: game.ski.x + rand(-10, 10), y: SKI_Y + pivotDy,
        vx: rand(-150, 150), vy: rand(-220, -40),
        r: rand(2, 4.5), life: rand(0.4, 0.9), pink: true
      });
    }
    pop(game.ski.x, SKI_Y + pivotDy - 20, "FLAMING ZA BURTĄ!", 1.1);
  }

  function wipeout(cause) {
    snd("crash");
    game.mode = WIPE;
    game.shake = 14;
    game.wipe = {
      t: 0,
      cause: cause,
      /* flaming odlatuje w stronę, w którą był wychylony */
      x: game.ski.x + Math.sin(game.bird.a) * 40,
      y: SKI_Y + pivotDy - 30,
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
      : game.wipe && game.wipe.cause === "land"
        ? "Twarde lądowanie!"
        : "A niech to flaming kopnie!";
    el.hud.hidden = true;
    show(el.over, true);
  }

  /* Parabola lotu: 0 przy odbiciu i przy wodowaniu, 1 w szczycie. */
  function jumpH() {
    if (game.jumpT <= 0) return 0;
    return Math.sin(Math.PI * (1 - game.jumpT / JUMP_TIME));
  }

  function toast(text) { game.toast = { text: text, t: 0 }; }

  /* Komiksowy dymek w miejscu zdarzenia — near miss, spowolnienie, utrata
     flaminga. Rośnie, unosi się i gaśnie.                              */
  function pop(x, y, text, size) {
    game.pops.push({ x: x, y: y, text: text, t: 0, size: size || 1 });
    if (game.pops.length > 8) game.pops.shift();
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
    return 1 + Math.floor((d - LEVEL_1) / LEVEL_M);
  }

  function spawnDelay() {
    return Math.max(0.17, 1.05 * Math.pow(0.87, level())) * rand(0.82, 1.22);
  }

  /* gapTime — ile czasu minęło od poprzedniej fali. Z tego wynika, jak daleko
     skuter zdążył się przemieścić, a więc jak daleko wolno odsunąć korytarz. */
  function spawnWave(gapTime) {
    game.spawned++;                 // licznik fal — do pomiarów gęstości
    var L = level();
    var d = clamp(L / 6, 0, 1);

    /* Rekin przecina ekran w poprzek, więc idzie sam. Na wyższych progach
       tnie szybciej — wolny rekin przelatywał bokiem i nic nie robił.   */
    if (Math.random() < 0.10 + 0.28 * d) {
      var sr = 0.35 * Math.min(SKI_VX_MAX * gapTime,
                               0.5 * SKI_ACCEL * gapTime * gapTime);
      var base = clamp(game.safeX + rand(-sr, sr), LANE_LO, LANE_HI);
      var amp = rand(SHARK_AMP[0], SHARK_AMP[1]);
      var wave = clamp(6.2832 * amp * game.speed / SHARK_VLAT,
                       SHARK_WAVE[0], SHARK_WAVE[1]);
      game.obstacles.push({
        type: "shark",
        baseX: base, x: base, y: -60, vx: 0,
        phase: rand(0, 6.2832),
        amp: amp, freq: 6.2832 / wave,
        r: HIT_SHARK
      });
      return;
    }

    /* Przedmiot idzie sam, w zasięgu korytarza. Zasada unikalności: dany
       przedmiot nie pojawia się, dopóki gracz go trzyma albo jest aktywny —
       więc na rzece nigdy nie leżą dwa zegary naraz.                    */
    /* Osobne szanse zamiast losowania z jednej puli. Wcześniej, gdy gracz
       trzymał serce, zegar dostawał całe 13% fal — teraz jego częstotliwość
       nie zależy od tego, co gracz ma w drugim slocie.                  */
    var kind = null;
    if (game.slowT <= 0 && Math.random() < ITEM_CLOCK) kind = "item_slowmo";
    else if (!game.slots.heart && Math.random() < ITEM_HEART) kind = "item_heart";
    if (kind) {
      var ir = 0.35 * Math.min(SKI_VX_MAX * gapTime,
                               0.5 * SKI_ACCEL * gapTime * gapTime);
      game.items.push({
        kind: kind,
        x: clamp(game.safeX + rand(-ir, ir), LANE_LO, LANE_HI),
        y: -60
      });
      return;
    }

    /* Skocznia idzie sama, w zasięgu korytarza, żeby dało się ją złapać —
       ale korytarza NIE przesuwa, więc można ją minąć bez kary.        */
    if (L >= 1 && Math.random() < 0.15) {
      var rr = 0.35 * Math.min(SKI_VX_MAX * gapTime,
                               0.5 * SKI_ACCEL * gapTime * gapTime);
      game.obstacles.push({
        type: "ramp",
        x: clamp(game.safeX + rand(-rr, rr), LANE_LO, LANE_HI),
        y: -60, vx: 0, r: 0, used: false
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

    /* faza powietrzna — odliczanie przed resztą, żeby `h` było aktualne */
    var wasAir = game.jumpT > 0;
    if (wasAir) game.jumpT = Math.max(0, game.jumpT - dt);
    if (game.landGrace > 0) game.landGrace -= dt;
    var h = jumpH();

    /* Spowolnienie: przez SLOW_TIME lecimy na SLOW_FACTOR prędkości, a po
       jego końcu tempo jest RESETOWANE do bazowego i rozpędza się od nowa.
       To druga połowa nagrody — nie tylko 3 s spokoju, ale i oddech po. */
    var wasSlow = game.slowT > 0;
    if (wasSlow) {
      game.slowT -= dt;
      if (game.slowT <= 0) {
        game.slowT = 0;
        game.speed = SPEED_MIN;      // reset narastającego tempa
        refreshSlots();
      }
    }

    var levelSpeed = Math.min(SPEED_CAP, SPEED_MIN + SPEED_STEP * level());
    var target = levelSpeed * (1 + JUMP_BOOST * h);
    if (game.slowT > 0) target *= SLOW_FACTOR;

    if (game.slowT > 0) game.speed += (target - game.speed) * Math.min(1, 9 * dt);
    else game.speed = Math.min(target, game.speed + SPEED_RECOVER * dt);

    /* Skok prędkości bez sygnału czyta się jak zacięcie — licznik metrów
       pulsuje, żeby było wiadomo, że to gra przyspieszyła.              */
    var lv = level();
    if (lv !== game.level) {
      game.level = lv;
      snd("tier");
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
    if (game.hasBird) {
      /* W powietrzu wiatr i brak oporu wody bujają ptakiem mocniej,
         w spowolnieniu odwrotnie — łatwiej go opanować.               */
      var couple = COUPLE * (h > 0 ? AIR_COUPLE : 1) * (game.slowT > 0 ? SLOW_COUPLE : 1);
      var damp = DAMP * (game.slowT > 0 ? SLOW_DAMP : 1);
      b.w += (-ski.ax * couple - SPRING * b.a) * dt;
      b.w -= b.w * Math.min(1, damp * dt);
      b.a += b.w * dt;
    } else {
      /* Bez flaminga nie ma wahadła — sterowanie jest po prostu stabilne. */
      b.a = 0; b.w = 0; b.over = 0; b.panic = 0;
    }

    /* Panika dla Reaction Cam. Sam odczyt chwilowy migotałby: `ax` jest
       niezerowe tylko przez 0,17 s rozpędu, więc mina wracałaby do spokoju
       w środku skrętu. Szybki atak, wolne opadanie.                      */
    var pt = !game.hasBird ? 0 : (game.jumpT > 0) ? 1 : panicTarget();
    b.panic += (pt - b.panic) * Math.min(1, (pt > b.panic ? 18 : 3.5) * dt);

    /* Przekroczenie progu nie kończy przejazdu od razu — dopiero utrzymanie
       się poza nim. Jeden pechowy wychył wybacza, uporczywe szarpanie nie. */
    /* W locie zwykły próg nie obowiązuje — rozliczenie następuje przy
       wodowaniu, i to ostrzejsze. Inaczej kara byłaby podwójna.        */
    if (game.jumpT > 0 || !game.hasBird) {
      b.over = 0;
    } else if (Math.abs(b.a) > TILT_LIMIT) {
      b.over += dt;
      if (b.over > TILT_GRACE) { fatal("tilt"); return; }
    } else {
      b.over = 0;
    }

    /* wodowanie */
    if (wasAir && game.jumpT === 0) {
      if (game.hasBird && Math.abs(b.a) > LAND_LIMIT) { fatal("land"); return; }
      game.dist += JUMP_BONUS;
      game.landGrace = LAND_GRACE;
      snd("land");
      toast("PERFECT LANDING!  +" + JUMP_BONUS + " m");
      for (var sp = 0; sp < 34; sp++) splash(ski.x + rand(-26, 26), SKI_Y + 12, 1.6);
    }

    if (game.toast) {
      game.toast.t += dt;
      if (game.toast.t > 1.5) game.toast = null;
    }

    if (game.flyaway) {
      var fa = game.flyaway;
      fa.vy += 620 * dt;
      fa.x += fa.vx * dt; fa.y += fa.vy * dt; fa.rot += fa.vrot * dt;
      if (fa.y > H + 120 || fa.x < -120 || fa.x > W + 120) game.flyaway = null;
    }

    for (var pi = game.pops.length - 1; pi >= 0; pi--) {
      game.pops[pi].t += dt;
      if (game.pops[pi].t > 0.6) game.pops.splice(pi, 1);
    }

    /* trasa */
    /* Odstęp między falami jest DYSTANSEM, nie czasem. Liczony czasem
       oznaczał, że w spowolnieniu świat sunie na 30% prędkości, a fale wciąż
       sypią się co tyle samo sekund — czyli trzy razy gęściej w przestrzeni.
       Zegar zamiast ulgi dawał ścianę przeszkód.                         */
    game.spawn -= game.speed * dt;
    if (game.spawn <= 0) {
      spawnWave(game.gapTime);
      game.gapTime = spawnDelay();
      game.spawn = game.gapTime * levelSpeed;
    }
    moveObstacles(dt);

    /* kolizje — okrąg skutera kontra okrąg przeszkody */
    for (var i = 0; i < game.obstacles.length; i++) {
      var o = game.obstacles[i];

      if (o.type === "ramp") {
        /* Skocznia nie zabija. Łapiemy ją tylko na wodzie i tylko raz. */
        if (!o.used && game.jumpT <= 0) {
          var rx = (o.x - ski.x) / (HIT_W + RAMP_W);
          var ry = (o.y - SKI_Y) / (HIT_H + RAMP_H);
          if (rx * rx + ry * ry < 1) {
            o.used = true;
            game.jumpT = JUMP_TIME;
            snd("jump");
            for (var t0 = 0; t0 < 16; t0++) splash(ski.x + rand(-20, 20), SKI_Y + 10, 1.2);
          }
        }
        continue;
      }

      /* W powietrzu i chwilę po wodowaniu przelatujemy nad wszystkim */
      if (game.jumpT > 0 || game.landGrace > 0) continue;

      var dx = (o.x - ski.x) / (HIT_W + o.r);
      var dy = (o.y - SKI_Y) / (HIT_H + o.r);
      if (dx * dx + dy * dy < 1) { fatal("hit"); return; }

      /* Near miss: rozliczany dokładnie w chwili mijania, po prześwicie
         między obrysami.                                               */
      if (!o.nearDone && o.y >= SKI_Y) {
        o.nearDone = true;
        var gap = Math.abs(o.x - ski.x) - (o.r + HIT_W);
        if (gap >= 0 && gap < NEAR_MISS) {
          game.dist += NEAR_BONUS;
          snd("near");
          pop(o.x, SKI_Y - 24, NEAR_TEXTS[Math.floor(Math.random() * NEAR_TEXTS.length)], 1);
        }
      }
    }

    /* zbieranie przedmiotów */
    for (var k2 = game.items.length - 1; k2 >= 0; k2--) {
      var it = game.items[k2];
      it.y += game.speed * dt;
      if (it.y > H + 80) { game.items.splice(k2, 1); continue; }

      var idx = it.x - ski.x, idy = it.y - SKI_Y;
      if (idx * idx + idy * idy < (ITEM_R + HIT_W) * (ITEM_R + HIT_W)) {
        game.items.splice(k2, 1);
        if (it.kind === "item_slowmo") {
          game.slowT = SLOW_TIME;          // odpala się samo po najechaniu
          snd("clock");
          pop(ski.x, SKI_Y - 96, "SLOW-MO!", 1.15);
        } else {
          /* Serce ZAWSZE ląduje w slocie jako tarcza. Jeśli flaminga nie ma,
             przy okazji go odradza — ale nie zamiast ochrony. Wcześniej
             gałąź odradzania pomijała slot, więc serce zebrane po stracie
             wskrzeszało ptaka i znikało, zostawiając gracza bez tarczy.  */
          if (!game.hasBird) {
            game.hasBird = true;
            game.bird.a = 0; game.bird.w = 0; game.bird.panic = 0;
            pop(ski.x, SKI_Y - 118, "FLAMING WRACA!", 1.1);
          } else {
            pop(ski.x, SKI_Y - 96, "TARCZA", 0.9);
          }
          game.slots.heart = true;
          snd("shield");
        }
        refreshSlots();
        for (var s2 = 0; s2 < 12; s2++) splash(it.x, it.y, 0.9);
      }
    }

    /* Smuga: bąbelki wypuszczane parami spod siodełka, rozchodzące się na
       boki. Niosą je te same piksele co wodę (pełna prędkość przewijania),
       więc trójkąt zostaje w wodzie, a nie ciągnie się za ekranem.      */
    game.wakeAcc = (game.wakeAcc || 0) + dt;
    while (game.wakeAcc > 0.022) {
      game.wakeAcc -= 0.022;
      for (var wsd = -1; wsd <= 1; wsd += 2) {
        game.wake.push({
          x: ski.x + wsd * 7, y: SKI_Y + 20,
          vx: wsd * rand(26, 46) + ski.vx * 0.25,
          r: rand(1.8, 3.6),
          life: WAKE_LIFE
        });
      }
    }
    for (var wi = game.wake.length - 1; wi >= 0; wi--) {
      var wp = game.wake[wi];
      wp.life -= dt;
      if (wp.life <= 0) { game.wake.splice(wi, 1); continue; }
      wp.x += wp.vx * dt;
      wp.y += game.speed * dt;
      if (wp.y > H + 20) game.wake.splice(wi, 1);
    }

    updateSpray(dt);
  }

  function moveObstacles(dt) {
    for (var i = game.obstacles.length - 1; i >= 0; i--) {
      var o = game.obstacles[i];
      o.y += game.speed * dt;

      if (o.type === "shark") {
        /* Patrol sinusoidalny wokół toru, po którym rekin wszedł. Faza
           liczona z przebytej drogi, nie z czasu — dzięki temu spowolnienie
           i skok nie zmieniają kształtu toru, tylko tempo jego pokonywania. */
        var ph = o.y * o.freq + o.phase;
        o.x = clamp(o.baseX + Math.sin(ph) * o.amp, 12, W - 12);
        o.lean = Math.cos(ph);          // >0 płynie w prawo, <0 w lewo
      } else {
        o.x += o.vx * dt;
      }

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

    /* smuga za skuterem — pod wszystkim, bo leży na wodzie */
    for (var wj = 0; wj < game.wake.length; wj++) {
      var w2 = game.wake[wj];
      var wl = w2.life / WAKE_LIFE;
      ctx.globalAlpha = wl * 0.65;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(w2.x + w2.vx * a, w2.y + game.speed * a, w2.r * (0.4 + 0.6 * wl),
              0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* piana i kilwater pod obiektami */
    ctx.fillStyle = "rgba(255,255,255,.8)";
    for (var i = 0; i < game.spray.length; i++) {
      var p = game.spray[i];
      ctx.globalAlpha = clamp(p.life * 2, 0, 1) * 0.85;
      ctx.fillStyle = p.pink ? "#FF6F9C" : "rgba(255,255,255,.8)";
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
      } else if (o.type === "ramp") {
        ctx.rotate(Math.sin(game.t * 1.6 + o.x) * 0.05);
        sprite("ramp");
      } else {
        /* Kąt natarcia proporcjonalny do prędkości bocznej — płetwa tnie falę
           w stronę, w którą płynie.                                        */
        /* Płetwa jest odbijana w stronę płynięcia, a potem przechylana
           w tej samej, odbitej ramce — stąd kąt zawsze dodatni.        */
        var lean = o.lean || 0;
        ctx.scale(lean < 0 ? -1 : 1, 1);
        ctx.rotate(SHARK_TILT * Math.abs(lean));
        sprite(ART.shark_fin ? "shark_fin" : "obstacle_shark");
      }
      ctx.restore();
    }

    /* przedmioty — kołyszą się na wodzie */
    for (var ii = 0; ii < game.items.length; ii++) {
      var it = game.items[ii];
      ctx.save();
      ctx.translate(it.x, it.y + game.speed * a);
      ctx.translate(0, Math.sin(game.t * 3 + it.x) * 3);
      ctx.rotate(Math.sin(game.t * 2 + it.x) * 0.12);
      sprite(it.kind);
      ctx.restore();
    }

    if (game.mode === MENU) { drawIdleTotem(); return; }

    drawRider(a);

    /* Pierścień odliczania — jedna zmienna CSS na klatkę, i tylko przez
       te trzy sekundy, w których zegar działa.                         */
    if (game.slowT > 0) {
      el.slotArc.style.setProperty("--p",
        clamp((game.slowT - a) / SLOW_TIME, 0, 1).toFixed(3));
    }

    drawPops(a);
    drawToast(a);

    /* Reaction Cam to interfejs, a nie świat — wraca do bazowej macierzy,
       żeby nie drgała razem z ekranem przy wywrotce.                    */
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    drawCam(a);
  }

  /* Skuter + kapibara + flaming. W trakcie WIPEOUT flaming leci osobno. */
  function drawRider(a) {
    var ski = game.ski;
    var tilt = game.bird.a + game.bird.w * a;
    var h = jumpH();
    var sx = ski.x + ski.vx * a;

    /* Cień zostaje na wodzie i odjeżdża w dół — to on niesie informację
       o locie. Totem tylko rośnie, jakby leciał w stronę kamery.       */
    if (h > 0.002) {
      ctx.fillStyle = "rgba(4,40,64," + (0.32 * (1 - 0.35 * h)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.ellipse(sx, SKI_Y + 26 + 30 * h, 44 * (1 - 0.2 * h), 13 * (1 - 0.2 * h),
                  0, 0, 6.2832);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(sx, SKI_Y);
    if (h > 0.002) ctx.scale(1 + JUMP_SCALE * h, 1 + JUMP_SCALE * h);
    ctx.rotate(ski.roll * 0.5);
    sprite("jetski");

    /* kapibara siedzi sztywno, tylko lekko kładzie się w skręt */
    ctx.save();
    ctx.translate(0, capyDy);
    ctx.rotate(ski.roll * 0.35);
    sprite("capybara");
    ctx.restore();

    /* flaming obraca się wokół stawu na czubku głowy kapibary.
       Po wipeoucie i po utracie serca już go tu nie ma.              */
    if (game.mode === PLAY && game.hasBird) {
      ctx.save();
      ctx.translate(0, pivotDy);
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

    /* flaming wyrzucony za burtę po zużyciu serca */
    if (game.flyaway) {
      ctx.save();
      ctx.translate(game.flyaway.x + game.flyaway.vx * a,
                    game.flyaway.y + game.flyaway.vy * a);
      ctx.rotate(game.flyaway.rot + game.flyaway.vrot * a);
      sprite("flamingo");
      ctx.restore();
    }

    /* ostrzeżenie: im bliżej progu, tym mocniejsza czerwona winieta */
    var risk = game.hasBird ? clamp((Math.abs(tilt) / TILT_LIMIT - 0.55) / 0.45, 0, 1) : 0;
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
  var ALONE_ZOOM = 1.16;                 // patrz drawCam: chowa własną ramkę pliku

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

    if (!game.hasBird && FACE.face_alone) {
      /* Po utracie flaminga w okienku zostaje sama kapibara. Bez tego pliku
         kod rysuje ją samodzielnie (gałąź zapasowa niżej), bo face_chill
         i face_panic mają ptaka wkomponowanego na stałe.                */
      ctx.save();
      /* Ten plik ma własną obwódkę, której face_chill i face_panic nie mają.
         Rysujemy go odrobinę większy, żeby jego ramka wypadła poza obcięcie
         i została jedna obwódka — ta rysowana przez okienko.            */
      var fa2 = FACE.face_alone, z = fa2.s * ALONE_ZOOM;
      ctx.drawImage(fa2.c, -z / 2, -z / 2, z, z);
      ctx.restore();
    } else if (FACE.face_chill && game.hasBird) {
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
    if (game.mode === PLAY && game.hasBird) {
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

  /* Dymki zdarzeń: rosną skokiem, unoszą się i gasną w 0,6 s. */
  function drawPops(a) {
    for (var i = 0; i < game.pops.length; i++) {
      var p = game.pops[i];
      var t = clamp((p.t + a) / 0.6, 0, 1);
      var sc = (0.6 + 0.55 * Math.min(1, t / 0.22)) * p.size;
      ctx.save();
      ctx.globalAlpha = 1 - t * t;
      ctx.translate(clamp(p.x, 44, W - 44), p.y - t * 34);
      ctx.scale(sc, sc);
      ctx.rotate(-0.06);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 italic 20px 'Trebuchet MS','Segoe UI',sans-serif";
      ctx.lineJoin = "round";
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#08324A";
      ctx.fillStyle = "#FFF6E5";
      ctx.strokeText(p.text, 0, 0);
      ctx.fillText(p.text, 0, 0);
      ctx.restore();
    }
  }

  /* Komunikat po udanym wodowaniu — wypływa w górę i gaśnie. */
  function drawToast(a) {
    if (!game.toast) return;
    var t = game.toast.t + a;
    var al = clamp(1 - (t - 0.9) / 0.55, 0, 1);
    if (al <= 0) return;

    ctx.save();
    ctx.globalAlpha = al;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 italic 25px 'Trebuchet MS','Segoe UI',sans-serif";
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#08324A";
    ctx.fillStyle = "#FFC94D";
    var y = H * 0.42 - Math.min(t, 1.2) * 26;
    ctx.strokeText(game.toast.text, W / 2, y);
    ctx.fillText(game.toast.text, W / 2, y);
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
    ctx.translate(0, capyDy);
    sprite("capybara");
    ctx.restore();
    ctx.save();
    ctx.translate(0, pivotDy);
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

  /* Podgląd stanu dla testów — włączany wyłącznie przez ?debug w adresie.
     Bez niego gra nie wystawia na zewnątrz niczego, a części mechanik
     (serce pochłaniające śmierć, powrót flaminga) nie da się rzetelnie
     sprawdzić z poziomu DOM.                                           */
  if (location.search.indexOf("debug") >= 0) {
    window.pogoDebug = function () {
      return {
        mode: game.mode, dist: Math.floor(game.dist),
        hasBird: game.hasBird, slowT: game.slowT, jumpT: game.jumpT,
        speed: Math.round(game.speed),
        heart: game.slots.heart, obs: game.obstacles.length, spawned: game.spawned
      };
    };
  }

  /* ---------------------------------------------------------------- start */

  loadArt(
    ["jetski", "capybara", "flamingo", "obstacle_buoy", "obstacle_shark",
     "water_tile", "totem_duo", "face_chill", "face_panic", "ramp",
     "item_slowmo", "item_heart", "shark_fin", "face_alone"],
    function () {
      el.bestM.textContent = best;
      baked = true;
      resize();          // resize sam przepala bitmapy pod aktualną skalę
      requestAnimationFrame(frame);
    }
  );
})();
