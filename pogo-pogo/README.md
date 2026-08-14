# Pogo Pogo — gra

Zręcznościowa gra przeglądarkowa. Kapibara w okularach siedzi bez emocji na
skuterze wodnym i trzyma na głowie flaminga, który ma histerię. Skuter płynie
sam, gracz tylko skręca — a każdy skręt rozbuja flaminga siłą bezwładności.
Utrzymanie wychylenia ponad 62° oznacza koniec przejazdu.

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

## Wersjonowanie zasobów — PODBIJ PRZY KAŻDYM WDROŻENIU

Adresy plików mają `?v=N`. Bez tego przeglądarka trzyma stary `game.js`
i stare sprite'y po wdrożeniu, a gracz ogląda poprzednią wersję gry mimo
udanej publikacji na Pages. Zdarzyło się to raz i kosztowało sporo zamieszania,
bo build kończył się sukcesem i wszystko *wyglądało* na wdrożone.

Podbicie wersji to **dwa miejsca**:

- `index.html` — cztery wystąpienia `?v=N` (favicon, CSS, skrypt, splash)
- `js/game.js` — stała `VER`, od której wersjonują się sprite'y w `assets/`

Ta sama konwencja co na stronie Kanno w korzeniu repo (tam licznik idzie
niezależnie).

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

## Obszar kolizji i czas na reakcję

Skuter ma **elipsę**, nie koło: `HIT_W` 20 px w poziomie, `HIT_H` 26 px w pionie.
Zahaczenie palika bokiem było najczęstszą przyczyną poczucia niesprawiedliwości —
grafika skutera ma 96 px szerokości, ale kadłub z załogą jest dużo węższy, więc
w poziomie liczy się mniej więcej szerokość kapibary. W pionie zostało po
staremu. `CLEAR` liczy się od `HIT_W`, więc korytarz przejazdu sam się dostroił.

Sam skuter siedzi też niżej — `SKI_Y` z 0,74 na 0,81 wysokości ekranu. To czysty
zysk czasu: przy 600 px/s przeszkoda leci przez ekran 0,96 s zamiast 0,89 s,
a przy 190 px/s — 3,04 s zamiast 2,81 s.

## Skocznia wodna

Czerwona skocznia (`ramp.svg`) nie zabija — wyrzuca w powietrze na `JUMP_TIME`
(1,2 s). Idzie zawsze sama, w zasięgu korytarza, żeby dało się ją złapać, ale
korytarza **nie przesuwa**: minięcie jej nic nie kosztuje.

W locie:

- totem rośnie do `1 + JUMP_SCALE` (1,25×), jakby leciał w stronę kamery,
- **cień zostaje na wodzie i odjeżdża w dół** — to on niesie informację o locie.
  Totem celowo nie przesuwa się w górę: podnoszenie go i powiększanie naraz
  dublowałoby sygnał i rozjeżdżało pozycję z tym, gdzie faktycznie wyląduje,
- woda przewija się szybciej (`JUMP_BOOST`, +35% w szczycie),
- kolizje są wyłączone, a po wodowaniu jeszcze przez `LAND_GRACE` (0,3 s) —
  bez tego dało się wylądować wprost na bojce, której w locie nie było jak ominąć,
- bezwładność flaminga jest `AIR_COUPLE` (1,5×) mocniejsza.

Przy wodowaniu obowiązuje ostrzejszy próg `LAND_LIMIT` (25°). Przekroczenie to
natychmiastowy koniec — „Twarde lądowanie!". Poniżej progu: rozbryzg, `+50 m`
i napis „PERFECT LANDING!".

**Zwykły próg 62° jest w locie zawieszony.** Rozliczenie następuje przy
wodowaniu i jest ostrzejsze; utrzymanie obu naraz karałoby dwa razy za to samo.

Konsekwencja dla gracza jest prosta i o to chodziło: **w powietrzu nie rusza się
sterowania.** Wchodząc w skok z dowolnym wychyleniem, sprężyna zdąży ściągnąć
ptaka do pionu w 1,2 s (tłumienie zbija amplitudę do ~21% na okres). Kto skręca
w locie, ląduje na ryju.

## Przedmioty, drugie życie i near miss

Dwa sloty w interfejsie, na wysokości postaci nad strefami kciuków. Puste są
wygaszone, pełne świecą. Łapią dotyk (reszta HUD ma `pointer-events: none`)
i nie uruchamiają sterowania, bo obsługa dotyku sceny pomija cele wewnątrz
`<button>`.

**Zasada unikalności:** dany przedmiot nie pojawi się na rzece, dopóki gracz go
trzyma albo jest aktywny. Na wodzie nigdy nie leżą więc dwa zegary naraz.

### Zegar (lewy slot, `Q` lub dotknięcie)

3 s na `SLOW_FACTOR` (30%) prędkości, przy łagodniejszym wahadle
(`SLOW_COUPLE` 0,45× bezwładności, `SLOW_DAMP` 1,7× tłumienia). Po zakończeniu
tempo jest **resetowane do bazowego** i rozpędza się od nowa z `SPEED_RECOVER`
(110 px/s²). To druga połowa nagrody: nie tylko trzy sekundy spokoju, ale
i oddech po nich — powrót do 600 px/s zajmuje potem ok. 3,7 s.

### Serce (prawy slot, biernie)

Jedno dodatkowe życie. Pochłania **każdą** śmiertelną przyczynę — bojkę,
rekina, przewrócony totem i twarde lądowanie — bo wszystkie idą przez jedną
funkcję `fatal()`. Zamiast końca przejazdu:

- serce pęka (różowe cząstki),
- flaming wylatuje za burtę, kręcąc się,
- gra toczy się dalej **samą kapibarą**: bez wahadła sterowanie jest stabilne,
  ale nie ma już żadnej ochrony,
- kolejne zebrane serce **odradza flaminga** zamiast trafić do slotu.

Bez ptaka Reaction Cam wraca do twarzy rysowanych w kodzie, bo `face_chill.svg`
i `face_panic.svg` mają flaminga wkomponowanego na stałe. Osobny `face_alone.svg`
domknąłby to ładniej.

### Near miss

Minięcie bojki albo rekina bliżej niż `NEAR_MISS` (15 px prześwitu między
obrysami) daje `+10 m` i komiksowy dymek. Rozliczane dokładnie w chwili
mijania — gdy przeszkoda przecina wysokość skutera — a nie w każdej klatce, więc
jedno minięcie liczy się raz.

### Podgląd stanu do testów

Zbieranie przedmiotów jest zbyt rzadkie, by trafić w nie losowo w teście, a
pochłonięcia śmierci przez serce nie widać w DOM. `game.js` wystawia więc
`window.pogoDebug()` — **wyłącznie** gdy adres zawiera `?debug`. Mechaniki są
sprawdzane na wymuszonych buildach (np. każda fala to przedmiot).

## Reaction Cam

Okrągły podgląd twarzy w lewym górnym rogu, z neonową obwódką. Cała treść jest
funkcją dwóch liczb: kąta wahadła i `panic` (0–1).

| stan | warunek | co widać |
| --- | --- | --- |
| spokój | kąt < 15° | flaming czujny, dziób zamknięty, ramka złota |
| panika | kąt ≥ 15° **albo** gwałtowny skręt | głowa drży, oczy rosną, źrenice się kurczą, dziób się otwiera, ramka przechodzi w koral |
| wipeout | koniec przejazdu | rozbryzg w obiektyw, potem woda podchodzi do góry, bąbelki |

Przez cały skok panika jest wymuszona na 1 — flaming panikuje w powietrzu
niezależnie od kąta.

Kapibara jest we wszystkich stanach identyczna — to jest cały żart.

**Grafika: `face_chill.svg` i `face_panic.svg`.** Obie to gotowe kompozycje
okienka — okrąg `r=62` w płótnie 128. Spokojna leży zawsze pod spodem, panika
jest nakładana z przezroczystością równą `panic`, więc reakcja jest płynnym
przenikaniem, a nie przełącznikiem. Kapibara to w obu plikach ten sam kształt,
więc przenikanie jej nie rusza — zmienia się wyłącznie flaming.

Twarze **nie** przechodzą przez dopasowanie do obrysu, którym idzie reszta
sprite'ów: mają wpasować się w ramkę tak, jak skomponował je autor, a
dociąganie do narysowanych pikseli przesunęłoby kadr. Wpasowanie liczone jest
z promienia 62, nie z obrysu treści.

Gdyby plików zabrakło, okienko rysuje twarze w kodzie (funkcja `drawCam` ma
pełną gałąź zapasową) — mniej ładnie, ale gra działa.

**Panika jest stanem fizyki, nie odczytem chwili.** Pierwsza wersja liczyła ją
wprost z `ski.ax`, ale `ax` jest niezerowe tylko przez 0,17 s rozpędu — mina
wracała do spokoju w środku skrętu i migotała. Teraz `bird.panic` dąży do
wartości docelowej z szybkim atakiem (18/s) i wolnym opadaniem (3,5/s).

Okienko rysuje się po przywróceniu bazowej macierzy, więc nie drga razem
z ekranem przy wywrotce — to interfejs, nie część świata.

## Krzywa trudności

Trudność rośnie **skokowo i bez sufitu**. Pierwsza wersja zatrzymywała wszystko
na szóstym progu i po ~540 m gra robiła się płaska — dało się jechać 4 000 m
i poddać z nudów.

Pierwsze dwa progi są bliżej startu (`LEVEL_1` 50 m, `LEVEL_2` 115 m), bo
początek za długo nie robił nic ciekawego. Dalej co `LEVEL_M` (80 m).

| próg | dystans | prędkość | odstęp fal | bojki w fali |
| --- | --- | --- | --- | --- |
| 0 | 0 m | 190 px/s | 0,86–1,28 s | 1 |
| 1 | 50 m | 248 px/s | 0,75–1,11 s | 1 |
| 2 | 115 m | 306 px/s | 0,65–0,97 s | 1–2 |
| 4 | 275 m | 422 px/s | 0,49–0,73 s | 1–2 |
| 8 | 595 m | 600 px/s (sufit) | 0,28–0,42 s | 1–3 |
| 12 | 915 m | 600 px/s | 0,16–0,24 s | 1–3 |
| 16+ | 1235 m | 600 px/s | 0,14–0,21 s (podłoga) | 1–3 |

Prędkość ma sufit 600 px/s, bo powyżej niego czas dojazdu przeszkody spada
poniżej czasu potrzebnego na przejechanie pasa — to już nie jest trudność,
tylko loteria. Powyżej ósmego progu rośnie już wyłącznie gęstość i to ona
kończy przejazd.

Skok prędkości bez sygnału czyta się jak zacięcie, więc na każdym progu pulsuje
licznik metrów (klasa `bump`). To jedyne, co odróżnia próg od błędu.

### Fala buduje się wokół korytarza

Wcześniej bojki lądowały w losowych miejscach, więc większość fal w ogóle nie
stała graczowi na drodze — stąd wrażenie, że „mało słupków". Teraz jest
odwrotnie: najpierw wybierany jest **korytarz przejazdu** (`safeX`), a bojki są
rozstawiane wszędzie poza nim. Każda fala wymusza więc konkretną pozycję.

Korytarz może odsunąć się od poprzedniego najwyżej o tyle, ile skuter zdąży
pokonać przez czas między falami:

```
reach = 0.35 · min(SKI_VX_MAX · gapTime,  ½ · SKI_ACCEL · gapTime²)
```

Drugi człon jest istotny: przy odstępie 0,17 s ogranicza nie prędkość
maksymalna, tylko rozpęd — z miejsca skuter przejedzie wtedy 22 px, a nie 42.
Współczynnik 0,35 dobrany empirycznie: symulacja idealnego gracza przez 180 s
daje przy nim **zero** ścian nie do ominięcia, przy 0,8 było ich kilkanaście.
Zapas idzie na to, że skuter zwykle nadjeżdża rozpędzony w przeciwną stronę,
a zawracanie zjada prawie cały budżet ruchu.

Dzięki tej gwarancji bojki nie muszą już trzymać szerokiego rozstawu między
sobą (`BUOY_SEP` spadł ze 128 na 52 px — tyle, żeby się nie nakładały) i mogą
tworzyć ścianę z jedną luką. `CLEAR` (24 px luzu ponad sumę promieni) ustala,
ile wolno się pomylić: węziej robi się z tego rzut monetą, szerzej — dobry
gracz przestaje ginąć w ogóle.

Rekin przecina ekran w poprzek, więc zawsze idzie sam, i na wyższych progach
tnie szybciej (do 200 px/s) — wolny przelatywał bokiem i nic nie robił. Jego
udział w falach spadł z 58% na maks. 38%, bo to bojki są kośćcem trudności.

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
