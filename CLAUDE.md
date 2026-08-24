# jawitek_repo — notatki dla agentów

Repo trzyma kilka niezależnych stron statycznych, każda w swoim podkatalogu,
serwowanych z GitHub Pages. Bez build-stepu i bez zależności — to jest wybór,
nie zaniedbanie. Utrzymuj go.

```
/            strona Kanno Noodle (przekierowanie do kanno/)
kanno/       strona firmowa Kanno Noodle
nazaspe3/    biurowiec na wynajem, Gdańsk Nowy Port
pogo-pogo/   gra zręcznościowa
lingaroo/    angielski dla dzieci (Calm Technology / Montessori);
             docelowo osobne repo i aplikacja Android/iOS — patrz README projektu
```

Każdy projekt ma własny `README.md` z opisem i decyzjami projektowymi.
Zaczynaj od niego.

## Konwencje obowiązujące w całym repo

**Wersjonuj adresy zasobów.** Wszystkie odwołania do CSS, JS i grafik mają
`?v=N`, podbijane przy każdym wdrożeniu. Bez tego przeglądarka serwuje stary
kod po udanej publikacji, a to najgorszy tryb awarii, jaki tu wystąpił: build
kończy się sukcesem, wszystko *wygląda* na wdrożone, a gracz ogląda poprzednią
wersję. Zdarzyło się i kosztowało sporo zamieszania. Liczniki są niezależne
per projekt.

**Nie dokładaj zależności.** Żaden projekt nie ma npm, bundlera ani biblioteki
z CDN. Efekty, dźwięk i grafika są robione środkami przeglądarki.

**Grafika jest podmieniana często i bywa uszkodzona.** Dwukrotnie w tym repo
plik `jetski.svg` okazał się kopią `flamingo.svg`. Zanim uznasz, że problem
jest w kodzie, **sprawdź plik** — wyrenderuj go osobno albo porównaj z innym.

---

# Czego nauczyła praca nad `pogo-pogo/`

Poniższe jest przenośne na dowolną grę na Canvas 2D. Jeśli zaczynasz nowy
projekt w innym repo, skopiuj tę sekcję do jego `CLAUDE.md`.

## Pętla i płynność

**Stały krok fizyki + interpolacja przy rysowaniu.** Sam stały krok nie
wystarczy: liczba kroków na klatkę nie dzieli się równo przez żadne
odświeżanie. Przy kroku 1/120 s i ekranie 120 Hz **38% klatek nie dostaje ani
jednego kroku, a 38% dostaje dwa** — świat raz stoi, raz przeskakuje podwójnie,
przy idealnie równych czasach klatek. Widać to jako szarpanie i nie znajdziesz
tego, patrząc na FPS. Lekarstwo: `render(a)` dostaje resztę akumulatora
i ekstrapoluje o nią pozycje.

**Sprzężenia wyrażaj przez impuls, nie przez chwilową siłę.** Jeśli
`ω += −COUPLE · Δv`, wynik nie zależy od kroku całkowania. To pozwala stroić
raz i nie przejmować się klatkażem.

**Przepal SVG na bitmapy.** Przeglądarka rasteryzuje SVG przy *każdym*
`drawImage`. Obiekt rysowany z obrotem w każdej klatce to realny koszt na
telefonie. Przepalaj raz, przy starcie i przy zmianie rozmiaru okna.

## Grafika i assety

**Licz układ z geometrii, nie wpisuj stałych.** Wysokości bierz z obrysu
narysowanych pikseli, a punkty styku wyprowadzaj z nich. W tym projekcie
grafika była podmieniana pięć razy i za każdym razem elementy schodziły się
same, bez dostrajania. Ręczne stałe wymagałyby pięciu rund poprawek.

**Mierz, nie zakładaj.** Czy kafelek jest bezszwowy? Porównaj przeciwległe
krawędzie w kodzie i wybierz sposób rysowania na podstawie wyniku. Gdzie jest
treść w pliku? Zmierz obrys. Jakie proporcje miał autor na myśli? Zmierz je
z pliku poglądowego, jeśli taki jest.

**Każdy asset musi mieć wersję zapasową rysowaną w kodzie.** Dzięki temu brak
pliku kosztuje wygląd, a nie działanie — i można pracować, zanim grafika
dojdzie. To się opłaciło wielokrotnie.

**SVG musi mieć zadeklarowane `width`/`height`.** Bez tego przeglądarka
raportuje rozmiar 0 i plik jest traktowany jak brakujący.

**`<img>` w HTML bywa wczytany, zanim wykona się skrypt.** Nasłuch `load`
podpięty później nigdy nie zadziała, a obrazek zostanie ukryty na zawsze.
Zawsze sprawdzaj też `img.complete` od razu.

## Projektowanie rozgrywki

**Nie karz tego, czego gra wymaga.** Pierwsza wersja przewracała totem przy
wychyleniu, które powstaje przy normalnym omijaniu przeszkód. Gra karała
dokładnie ten manewr, który sama wymuszała. Zanim ustawisz próg porażki,
policz, jakie wartości generuje **poprawna** gra.

**Uczciwość gwarantuj konstrukcją, nie losem.** Generator trasy najpierw
wybiera korytarz przejazdu, a przeszkody stawia wszędzie poza nim. Korytarz
może się przesunąć najwyżej o tyle, ile gracz zdąży pokonać — z uwzględnieniem
**rozpędu**, nie tylko prędkości maksymalnej. Symulacja idealnego gracza
pokazała, że przy naiwnym wzorze co kilkanaście sekund powstaje ściana nie do
ominięcia.

**Odstępy licz dystansem, nie czasem.** Inaczej spowolnienie czasu zagęszcza
trasę: świat sunie wolniej, a zdarzenia sypią się co tyle samo sekund.

**Sufit prędkości wynika z arytmetyki, nie z wyczucia.** Porównaj czas
przelotu przeszkody przez ekran z czasem potrzebnym na przejechanie całej
szerokości. Gdy ten pierwszy jest krótszy, unik jest **fizycznie niemożliwy**
i gra przestaje być testem umiejętności.

**Skokowe zmiany muszą mieć sygnał.** Nagłe przyspieszenie bez potwierdzenia
w interfejsie czyta się jak zacięcie, a nie jak zamierzony próg.

**Jedna funkcja na śmierć.** Wszystkie przyczyny przegranej kieruj przez jeden
punkt. Dzięki temu tarcza, drugie życie czy statystyka obejmują je wszystkie
i nie da się przeoczyć ścieżki.

**Interfejs pokazuje tylko to, co gracz ma.** Stale widoczna, wygaszona ikona
sugeruje przedmiot w zapasie, którego nie ma.

## Testowanie gry

Gra jest losowa i czasowa, więc zwykłe testy nie wystarczą.

**Buduj rigi z wymuszoną konfiguracją.** Zdarzenia rzadkie — skocznia,
przedmiot, konkretna przeszkoda — są nie do trafienia losowo. Kopiuj projekt
do katalogu testowego i podmieniaj prawdopodobieństwa na 1, zamiast czekać na
szczęście.

**Wystaw stan wyłącznie za flagą.** `window.pogoDebug()` powstaje tylko przy
`?debug` w adresie. Bez tego części mechanik nie da się sprawdzić z poziomu
DOM.

**Sprawdzaj niezmienniki, nie sekwencje.** „Ikona widoczna dokładnie wtedy,
gdy efekt działa" obowiązuje zawsze. „Po trzech sekundach efekt się kończy"
przestaje obowiązywać, gdy gracz zbierze kolejny przedmiot.

**Mierz właściwą wielkość.** Licząc *przeszkody* zamiast *fal* dostałem
fałszywy alarm, że spowolnienie zagęszcza trasę — bo w spowolnieniu przedmiot
nie może się zrespić i jego sloty zamieniają się w przeszkody. Zanim uznasz
wynik pomiaru za błąd w grze, sprawdź, czy nie jest artefaktem pomiaru.
Zdarzyło się to trzy razy.

**Uwzględniaj animacje przejść.** Asercja sprawdzająca widoczność tuż po
zmianie stanu złapie trwające zanikanie i zgłosi fałszywy błąd.

**Weryfikuj rzeczy, których nie widać na zrzucie.** Kierunek przewijania tła
sprawdzaj korelacją kolumny pikseli w dwóch chwilach. Dźwięk — przechwytując
Web Audio i licząc uruchomione źródła, bo headless nie ma głośnika.

## Dźwięk

**Kontekst audio twórz dopiero przy pierwszym geście użytkownika.**
Przeglądarki blokują dźwięk do interakcji, a próba wcześniej kończy się ciszą
**bez żadnego błędu w konsoli** — nie ma czego zauważyć.

**Wyciszenie z zapisem stanu jest obowiązkowe**, nie opcjonalne. Gra na
telefonie w miejscu publicznym bez tego jest bezużyteczna.

Efekty da się zsyntezować w Web Audio (oscylator z obwiednią + szum przez
filtr pasmowy) — bez plików, bez pobierania, bez pierwszej zależności.

## Narzędzia

**Nie używaj `pkill -f` ze wzorcem pasującym do własnego polecenia.** `pkill -f
"http.server 877"` dopasowuje linię poleceń bieżącej powłoki i ją zabija —
w połowie pracy, bez śladu w wyniku.
