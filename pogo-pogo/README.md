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
- `TILT_LIMIT` (62°) — próg wywrotki.
- `TILT_GRACE` (0,15 s) — jak długo wolno być poza progiem, zanim totem padnie.

Wahadło ma okres ok. **1,15 s**, więc rezonans wypada przy zmianie kierunku co
~0,57 s — i to jest sedno trudności. Szczytowe wychylenia zmierzone symulacją
tej samej fizyki:

| styl jazdy | szczyt | wynik |
| --- | --- | --- |
| pojedynczy skręt i trzymanie | 32° | bezpiecznie |
| wjazd w krawędź z pełnej prędkości | 32° | bezpiecznie |
| młócenie co 0,2 s | 24° | bezpiecznie (zbyt szybko, drgania się znoszą) |
| slalom co 0,3 s | 33° | bezpiecznie |
| slalom co 0,45 s | 56° | napięcie, ekran czerwony |
| slalom co 0,8 s | 49° | napięcie |
| szarpanie w rezonans co 0,57 s | 71° | **wywrotka** |

Czyli: samo skręcanie nie zabija, zabija skręcanie *w rytm wahadła*. Gdy kąt
przekroczy 55% progu, ekran zaczyna czerwienieć — to jedyne ostrzeżenie, jakie
gracz dostaje.

### Dlaczego próg to 62°, a nie 50° ze specyfikacji

Pierwsza wersja trzymała się `SPEC.md` i przewracała totem przy 50° natychmiast.
Playtest to obalił: slalom co 0,45 s daje szczyt 56°, a to jest dokładnie tempo,
w jakim omija się bojki. Gra karała więc to, czego sama wymagała — po dwóch
manewrach było po przejeździe.

Dwie zmiany naprawiają to bez rozbrajania mechaniki:

1. **Próg podniesiony do 62°**, powyżej szczytu normalnego slalomu.
2. **Tolerancja 0,15 s** — przekroczenie progu nie kończy przejazdu od razu,
   dopiero utrzymanie się poza nim. Jeden pechowy wychył wybacza; narastający
   rezonans nie, bo tam kąt zostaje po złej stronie progu.

Zmierzone: przy 62°/0,15 s ginie wyłącznie uporczywy rezonans. Slalom, wjazd
w krawędź i spokojna jazda przeżywają.

### Dojazd do krawędzi nie może zabijać

Obcięcie pozycji do krawędzi zeruje prędkość, a `ax` jest liczone **po** tym
obcięciu. Dzięki temu skuter dociśnięty do bandy ma `ax = 0` i nie wpycha
niczego w ptaka. Gdyby liczyć `ax` przed obcięciem, sterowanie w bandę
generowałoby impuls w każdym kroku i wjazd w krawędź stałby się wyrokiem
(zmierzone: 50° zamiast 32°). Wygląda to na drobiazg, a decyduje o tym, czy
krawędź jest ścianą, czy pułapką.

## Płynność

Sprzężenie wahadła idzie przez impuls Δv (`ω += −COUPLE · Δvx`), więc nie zależy
od kroku całkowania, a fizyka i tak chodzi **stałym krokiem 1/120 s** — próg
wypada tak samo na 30 i na 144 fps.

Sam stały krok wprowadza jednak własny problem: liczba kroków na klatkę nie
dzieli się równo przy żadnym odświeżaniu. Przy 120 Hz **38% klatek nie dostaje
ani jednego kroku, a 38% dostaje dwa** — świat raz stoi, raz przeskakuje
podwójnie, mimo idealnie równych czasów klatek. Właśnie to czuć jako szarpanie
na dobrym telefonie.

Dlatego `render(a)` dostaje resztę akumulatora i rysuje o nią do przodu:
pozycje, kąt flaminga i przewijanie wody są ekstrapolowane o `a`. Zmierzone
przesunięcie świata na klatkę przy 400 px/s:

| ekran | bez interpolacji | z interpolacją |
| --- | --- | --- |
| 60 Hz | 3,33–10,00 px | 6,63–6,70 px |
| 120 Hz | 0,00–6,67 px | 3,32–3,35 px |
| 144 Hz | 0,00–3,33 px | 2,76–2,79 px |

Drugie źródło kosztu to SVG: przeglądarka rasteryzuje go przy **każdym**
`drawImage`, a totem jest rysowany z obrotem w każdej klatce. Sprite'y są więc
raz przepalane na bitmapy w rozdzielczości ekranu (`bakeAll`, powtarzane przy
zmianie rozmiaru okna), a w pętli rysowania trafia już tylko gotowa bitmapa 1:1.
Kafelek wody idzie tą samą drogą — wzorzec powstaje z przepalonego płótna,
a `setTransform` na wzorcu sprowadza go z powrotem do jednostek logicznych.

## Krzywa trudności

Sterowana jedną funkcją `difficulty()` — 0 na starcie, 1 po `RAMP_M` (900 m):

| | start | po 900 m |
| --- | --- | --- |
| prędkość | 190 px/s | 500 px/s |
| odstęp między falami | 0,94–1,67 s | 0,35–0,62 s |
| szansa na rekina | 6% | 52% |
| bojek w fali | 1 | 1–3 |

Rekin wchodzi z boku i przecina ekran, więc zawsze pojawia się sam — o „kilku
rekinach naraz" decyduje częstotliwość fal, nie ich liczebność. Bojki
przeciwnie: wchodzą grupami, a przy losowaniu pozycji pilnowany jest minimalny
rozstaw `BUOY_SEP` (128 px), więc między każdą parą zawsze zostaje luka szersza
niż skuter. Bez tego dałoby się wygenerować ścianę nie do ominięcia.

## Grafika

W `assets/` leży siedem SVG z Claude Design (projekt `pogo-pogo-graphics`):

`jetski` · `capybara` · `flamingo` · `obstacle_buoy` · `obstacle_shark` ·
`water_tile` · `totem_duo`

Każdy element ma **dodatkowo** wektorowy kształt zastępczy rysowany w kodzie
(funkcje `fb*` w `game.js`). Gdyby plik zniknął albo się nie wczytał, gra nadal
działa — po prostu z prostszą grafiką.

### Skalowanie liczone z obrysu, nie z rozmiaru pliku

Pliki mają kwadratowe płótno (256×256, bojka i rekin 128×128), ale postacie nie
wypełniają go ani nie są w nim wyśrodkowane — kapibara zajmuje 68% szerokości,
flaming ma rozłożone skrzydła, bojka ma pod sobą cień. Wrzucenie ich w sztywne
prostokątne pudełka rozciągnęłoby postacie i przesunęło punkt obrotu flaminga
w puste miejsce pod nogami.

Dlatego `game.js` przy starcie **mierzy rzeczywisty obrys narysowanych pikseli**
każdego sprite'a (`measureContent`) i dopiero według niego skaluje i zaczepia.
W `BOX` podaje się wyłącznie docelową **szerokość treści** i punkt zaczepienia —
wysokość wynika z proporcji obrysu. Dzięki temu podmiana grafiki na inaczej
wykadrowaną niczego nie psuje.

Pomiar wymaga odczytu pikseli, co przy otwarciu przez `file://` rzuca
`SecurityError`. Wtedy kod przyjmuje, że treść wypełnia całe płótno — grafika
będzie odrobinę mniejsza i przesunięta, ale gra działa. Przez HTTP (Pages,
`python3 -m http.server`) pomiar jest dokładny.

### Przy podmianie grafik

- **Zostaw `width`/`height` w SVG.** Bez zadeklarowanego rozmiaru przeglądarka
  raportuje 0 i plik zostanie potraktowany jak brakujący. Najbardziej boli przy
  `water_tile`, który idzie przez `createPattern` — bez rozmiaru woda po cichu
  wróci do wersji proceduralnej.
- **Flaming obraca się wokół dolnej krawędzi swojego obrysu**, czyli stóp. Tam
  wypada staw na głowie kapibary. Nogi muszą sięgać dołu rysunku.
- **Docelowe szerokości treści** (px, przy scenie 360×640): jetski 96,
  capybara 56, flamingo 62, bojka 44, rekin 58. Stałe `CAPY_DY` i `PIVOT_DY`
  ustawiają wysokość totemu.
- **Rekin** jest odbijany w poziomie zależnie od kierunku płynięcia, więc
  powinien być narysowany jako płynący w prawo.
- `totem_duo` trafia na ekran menu jako `<img>`; wtedy menu przełącza się na
  wyśrodkowany układ. Bez niego menu rysuje totem na canvasie w dolnej części.

## Czego tu jeszcze nie ma

- **Rampa wodna** z pierwotnego specu (skok, bonus za czas w powietrzu,
  turbulencja przy lądowaniu). MVP ma tylko bojki i rekiny.
- **Monety / ananasy.** Pierwsza notatka je wymieniała, prompt do gameplayu już
  nie — HUD liczy wyłącznie metry. Dorobienie to zbieracz + drugi licznik.
- **Dźwięk.** Zero audio.
- **Perspektywa.** Kamera jest prosto z góry/zza pojazdu. Izometrii, o której
  wspomina spec, nie ma i wymagałaby innych sprite'ów.
