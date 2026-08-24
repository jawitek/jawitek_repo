# LingaRoo — angielski dla dzieci, spokojnie

Gra do nauki angielskiego dla dzieci (ok. 3–8 lat) z kangurem LingaRoo.
Projekt jest świadomym przeciwieństwem krzykliwych gier mobilnych:
**Calm Technology, niska stymulacja, duch pedagogiki Montessori**.

> Docelowo osobne repozytorium i aplikacja Android/iOS. Na razie rozwijane
> tutaj jako samodzielny katalog — patrz „Droga do sklepów" niżej.

## Zasady projektu (nienegocjowalne)

- **Zero neonów, migania, konfetti i presji czasu.** Paleta to drewno, len,
  matowy papier i tablica kredowa. Ruch jest powolny i celowy: oddech,
  kiwnięcie, podskok. `prefers-reduced-motion` wyłącza i to.
- **Bez punktów, rankingów i porażek.** Błędne dopasowanie tylko delikatnie
  kołysze kartą — dziecko poprawia się samo (samokontrola błędu à la
  Montessori). Jedyna „nagroda" to spokojna ścieżka pięciu kamieni
  i podskok LingaRoo.
- **Jedna rzecz naraz.** Na ekranie jest jedno zadanie, duże cele dotykowe,
  żadnych pasków, bannerów, odznak.
- **Dziecko słyszy wyłącznie angielski** (lektor `speechSynthesis`).
  Polskie napisy to małe podpowiedzi dla rodzica/czytającego dziecka —
  można je wyłączyć w Strefie Rodzica.
- **Zero zależności.** Brak npm, bundlera i bibliotek z CDN. Grafika to SVG
  rysowane w kodzie (stringi w `js/data.js`), dźwięki są syntezowane
  (Web Audio), lektor jest systemowy. Jedyny zasób z sieci to font
  Quicksand — z systemowym krojem zapasowym i cache w service workerze,
  więc jego brak niczego nie psuje.

## Aktywności

| Tryb | Co robi dziecko | Montessori |
|---|---|---|
| **Słówka** | ogląda kartę, słucha słowa, przewija dalej | okres 1: nazywanie |
| **Znajdź słowo** | słyszy „Where is the owl?" i wskazuje jedną z trzech kart | okres 2: rozpoznawanie |
| **Tablica (Tap & Say)** | LingaRoo mówi słowo, dziecko powtarza na głos; litery odsłaniają się kredą | okres 3: odtwarzanie |
| **Pary** | dopasowuje, co do czego pasuje: dog–bone, spider–web, hammer–nail…; trafiona para znika z półki | dobieranie |

Słownictwo: **16 tematów, ~190 słów** — Zwierzęta (18), Warzywa, Owoce,
Kolory, Dom, Ubrania, Zawody, Pojazdy, Liczby, Kształty, Ciało, Jedzenie,
Czynności, Pogoda, Zabawki, Przeciwieństwa (po 12) — oraz **28 par**
(w tym 6 prawdziwych przeciwieństw). Dane są czysto deklaratywne
(`THEMES`, `PAIRS` w `js/data.js`); nowy temat to nowy wpis z SVG, bez
zmian w logice. Zawody i liczby mają generatory (`personSvg`,
`numberSvg`) — wspólna sylwetka + akcesoria.

### Lekcje: postęp bez punktów, głębia zamiast pośpiechu

Słowa tematu leżą w **lekcjach po 6 słów** (`BOX_SIZE`), otwieranych po
kolei. Lekcję otwierającą następną domyka **pełny cykl trzech spotkań**
ze słowami: obejrzenie kart + Znajdź słowo + Tablica (jedyny punkt
zaliczania to ekran końca sesji — postęp nie ma bocznych ścieżek; ekran
końcowy podpowiada, czego jeszcze brakuje). Nowa lekcja zaczyna się od
poznania słówek, nie od zgadywania.

**Powtórki mają własną głębię:** powtórny quiz tej samej lekcji ćwiczy
czytanie (napis→obrazek i obrazek→napis, bez podpowiedzi lektora),
a kafelek **Powtórka** na ekranie głównym miesza słowa ze wszystkich
ukończonych lekcji, biorąc najpierw najsłabiej utrwalone. Osobno od
cyklu **dojrzewa utrwalenie**: słowo jest „pewne", gdy padło poprawnie
w dwóch różnych dniach; lekcja z samymi pewnymi słowami dostaje pełną
łezkę (jasna łezka = cykl domknięty, kontur = przed cyklem).

Postęp jest per profil w `localStorage` (`lingaroo.progress.<id>`);
Strefa Rodzica ma wyzerowanie (z potwierdzeniem drugim dotknięciem).

### Wymowa: zapraszamy, nie oceniamy

Domyślnie działa **tryb echa**: LingaRoo wymawia słowo, dziecko powtarza,
nikt nie ocenia — po chwili wspólna radość i słowo pisane „kredą".
W Strefie Rodzica można włączyć **sprawdzanie wymowy** (Web Speech API,
rozpoznawanie po angielsku). To świadomie opcja, nie domyślne zachowanie:

1. rozpoznawania mowy nie ma w Safari/iOS — tryb echa działa wszędzie;
2. ocena wymowy 4-latka przez maszynę bywa frustrująca, a frustracja jest
   dokładnie tym, czego ta gra ma nie robić.

Nawet przy włączonym sprawdzaniu porażka nie istnieje: nietrafiona próba to
łagodne „Let's try that again" i ponowne wymówienie wzoru.

## Strefa Rodzica

Za bramką „przytrzymaj kółko 3 sekundy" (dziecko przypadkiem nie wejdzie):
dźwięk/wyciszenie (zapamiętywane), tempo lektora, test lektora z diagnozą
głosów angielskich, polskie podpowiedzi, sprawdzanie wymowy, a dla
aktywnego profilu: wyzerowanie postępów i usunięcie profilu (oba
z potwierdzeniem drugim dotknięciem).

## Profile

Do **6 profili na urządzeniu** — bez haseł, bez kont, bez chmury. Ekran
„Kto dziś się bawi?" pokazuje kafelki z imieniem i zwierzątkiem-awatarem;
przełączenie to jeden dotyk (kafelek awatara na ekranie głównym). Każdy
profil ma własny postęp lekcji (`lingaroo.progress.<id>` w localStorage);
postęp sprzed epoki profili migruje na pierwszy utworzony profil.
Ograniczenie wpisane w projekt: profil żyje w tej przeglądarce, na tym
urządzeniu — synchronizacji między urządzeniami celowo nie ma (byłaby
pierwszym miejscem, gdzie dane dziecka opuszczają sprzęt).

## Architektura

```
index.html            powłoka + rejestracja SW; zasoby z ?v=N
css/style.css         cała „materiałowość": tokeny kolorów, drewno, tablica
js/data.js            paleta, SVG rysowane w kodzie, THEMES, PAIRS, ikony UI
js/audio.js           Settings (localStorage), lektor TTS, dzwonek/tyk WebAudio,
                      opcjonalne rozpoznawanie mowy
js/app.js             ekrany i nawigacja po hashu (#home, #cards/animals, …)
sw.js                 cache-first, nazwa cache z numerem wersji
manifest.webmanifest  PWA: standalone, portret, ikony
icons/                generowane z SVG (patrz niżej)
```

Konwencje odziedziczone po `pogo-pogo/` (sprawdzone w boju):

- **`?v=N` na każdym zasobie** — podbijaj przy wdrożeniu razem z
  `LINGAROO_V` w `sw.js`, inaczej przeglądarki serwują starą wersję.
- **Kontekst audio i TTS odblokowywane pierwszym gestem** — wcześniej iOS
  milczy bez żadnego błędu.
- **Wyciszenie z zapisem stanu jest obowiązkowe.**
- **Stan diagnostyczny tylko za flagą**: `?debug` → `window.lingaDebug()`.
- **Timery ekranu sprzątane przy nawigacji** — stary ekran nie strzela
  setTimeoutem w nowy.

Ikony PWA generuje się z SVG przez headless Chromium (bez nowych zależności):
zrzut `icon.html` w 512 px, skalowanie do 192 px canvasem + `--dump-dom`.

## Droga do sklepów (Android / iOS)

Etap 1 — **PWA (teraz)**: działa w przeglądarce, „Dodaj do ekranu
początkowego" na Androidzie i iOS, offline po pierwszej wizycie.

Etap 2 — **opakowanie**: ten sam kod pakuje się w [Capacitor]
(https://capacitorjs.com) (Android Studio / Xcode) albo Android **Trusted
Web Activity** ([Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)).
Opakowanie żyje w osobnym katalogu narzędziowym — rdzeń gry pozostaje
czystym HTML/CSS/JS bez build-stepu.

Etap 3 — sklepowe wymagania: polityka prywatności (tu prosta: **żadne dane
nie opuszczają urządzenia**), grafiki sklepowe, konta deweloperskie.

## Pomysły na później

- kolejne tematy: warzywa, ubrania, dom, liczby 1–10;
- pełna lekcja trójstopniowa jako prowadzona sekwencja;
- tryb „cichej pracy": tylko dopasowywanie, ekran bez żadnego tekstu;
- nagrania lektorskie (pliki) zamiast TTS, gdy projekt dorobi się assetów —
  interfejs `Sound.speak()` już to izoluje;
- delikatny dziennik dla rodzica: które słowa dziecko ostatnio ćwiczyło
  (lokalnie, bez chmury).
