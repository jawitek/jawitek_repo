# Pogo Pogo — gra

Zręcznościowa gra przeglądarkowa. Kapibara w okularach siedzi bez emocji na
skuterze wodnym i trzyma na głowie flaminga, który ma histerię. Skuter płynie
sam, gracz tylko skręca — a każdy skręt rozbuja flaminga siłą bezwładności.
Wychylenie ponad 50° oznacza koniec przejazdu.

Serwowana pod `/<repo>/pogo-pogo/`, niezależnie od pozostałych projektów w repo.
Zakres MVP opisuje [`SPEC.md`](SPEC.md).

```
pogo-pogo/
├── index.html        3 ekrany: menu, HUD, wipeout
├── css/style.css     scena 9:16, arcade UI, brak scrollowania na mobile
├── js/game.js        pętla gry, fizyka wahadła, kolizje, trasa, rysowanie
└── assets/           favicon + miejsce na sprite'y SVG
```

Bez build-stepu i bez zależności. Lokalnie: `python3 -m http.server` w tym
katalogu i wejście na `http://localhost:8000/`. Produkcyjnie: GitHub Pages.

## Sterowanie

| Wejście | Efekt |
| --- | --- |
| Przytrzymanie lewej połowy ekranu | skręt w lewo |
| Przytrzymanie prawej połowy ekranu | skręt w prawo |
| Puszczenie | skuter sam się stabilizuje |
| `A` / `D`, strzałki | to samo z klawiatury (do testów na PC) |
| `Spacja` / `Enter` / dotyk | start i restart |

## Jak działa totem

To jest cała gra, więc warto wiedzieć, które stałe kręcą trudnością — wszystkie
są w bloku „ustawienia" na górze `js/game.js`.

Skuter porusza się w poziomie sztywno. Z jego **przyspieszenia** (nie prędkości)
liczona jest siła wpychana w kąt flaminga:

```
ω += (−ax · COUPLE − SPRING · θ) · dt      ω -= ω · DAMP · dt      θ += ω · dt
```

- `COUPLE` (0.012) — ile bezwładności skutera trafia w ptaka. Wyżej = ostrzej.
- `SPRING` (30) — siła ściągająca do pionu. Wyżej = wybaczniej.
- `DAMP` (2.6) — tłumienie. Niżej = dłuższe bujanie po skręcie.
- `TILT_LIMIT` (50°) — próg wywrotki.

Wahadło ma okres ok. **1,15 s**, więc rezonans wypada przy zmianie kierunku co
~0,57 s — i to jest sedno trudności. Szczytowe wychylenia zmierzone symulacją
tej samej fizyki:

| styl jazdy | szczyt | wynik |
| --- | --- | --- |
| pojedynczy skręt i trzymanie | 32° | bezpiecznie |
| młócenie co 0,2 s | 26° | bezpiecznie (zbyt szybko, drgania się znoszą) |
| slalom co 0,3 s | 33° | bezpiecznie |
| slalom co 0,8 s | 48° | na granicy, ekran już czerwony |
| slalom co 0,45 s | 56° | **wywrotka** |
| szarpanie w rezonans co 0,57 s | — | **wywrotka po ~1,5 s** |

Czyli: samo skręcanie nie zabija, zabija skręcanie *w rytm wahadła*. Karana jest
panika, a nie manewrowanie. Gdy kąt przekroczy 55% progu, ekran zaczyna
czerwienieć — to jedyne ostrzeżenie, jakie gracz dostaje.

Sprzężenie idzie przez impuls Δv (`ω += −COUPLE · Δvx`), więc nie zależy od
kroku całkowania, a fizyka i tak chodzi stałym krokiem 1/120 s niezależnie od
klatkażu — próg 50° wypada tak samo na 30 i na 144 fps.

## Grafika

Gra próbuje wczytać z `assets/` siedem plików SVG:

`jetski` · `capybara` · `flamingo` · `obstacle_buoy` · `obstacle_shark` ·
`water_tile` · `totem_duo`

**Żadnego z nich jeszcze nie ma w repo.** Każdy element ma dlatego wektorowy
kształt zastępczy rysowany w kodzie (funkcje `fb*` w `game.js`), więc gra jest
w pełni grywalna już teraz. Wrzucenie pliku pod właściwą nazwą podmienia go
automatycznie — bez zmian w kodzie.

O czym warto pamiętać przy eksporcie z Claude Design:

- **Ustaw `width`/`height` w SVG.** Bez zadeklarowanego rozmiaru przeglądarka
  raportuje 0 i plik zostanie potraktowany jak brakujący. Dotyczy to zwłaszcza
  `water_tile`, który idzie przez `createPattern` — bez rozmiaru woda cicho
  wróci do wersji proceduralnej.
- **Punkty zaczepienia.** `capybara` i `flamingo` są rysowane „od dołu": dolna
  krawędź pliku to miejsce styku. Flaming obraca się dokładnie wokół dolnej
  krawędzi swojego pudełka — tam ma być staw, czyli czubek głowy kapibary.
- **Docelowe pudełka** (px, przy scenie 360×640): jetski 92×62, capybara 58×64,
  flamingo 48×78, bojka 40×52, rekin 64×46. Proporcje warto zachować.
- **Rekin** jest odbijany w poziomie zależnie od kierunku płynięcia, więc
  powinien być narysowany jako płynący w prawo.
- `totem_duo` trafia na ekran menu jako `<img>`. Dopóki go nie ma, menu rysuje
  totem z tych samych kształtów zastępczych.

## Czego tu jeszcze nie ma

- **Rampa wodna** z pierwotnego specu (skok, bonus za czas w powietrzu,
  turbulencja przy lądowaniu). MVP ma tylko bojki i rekiny.
- **Monety / ananasy.** Pierwsza notatka je wymieniała, prompt do gameplayu już
  nie — HUD liczy wyłącznie metry. Dorobienie to zbieracz + drugi licznik.
- **Dźwięk.** Zero audio.
- **Perspektywa.** Kamera jest prosto z góry/zza pojazdu. Izometrii, o której
  wspomina spec, nie ma i wymagałaby innych sprite'ów.
