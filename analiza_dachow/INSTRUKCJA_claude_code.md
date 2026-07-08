# Analiza dachów i silosów — instrukcja Claude Code

## Opcja A: uruchom skrypt bezpośrednio
```bash
pip install requests shapely pyproj pandas openpyxl folium
python analiza_dachow_silosow.py
```

## Opcja B: prompt do wklejenia w Claude Code
> Uruchom skrypt `analiza_dachow_silosow.py` (zainstaluj zależności: requests, shapely, pyproj, pandas, openpyxl, folium). Po wykonaniu otwórz `porownanie_zakladow.xlsx` i przedstaw mi ranking zakładów wg powierzchni dachu obiektów przemysłowych. Następnie sprawdź na mapach HTML, czy promienie analizy poprawnie obejmują teren każdego zakładu — jeśli obrys łapie sąsiednie posesje albo ucina halę, skoryguj promień/współrzędne w SITES i uruchom ponownie. Na końcu dodaj do porównania zakład Cenos w Prostkach (pow. ełcki) i Sonko — zgeokoduj je przez Nominatim i zweryfikuj na mapie satelitarnej.

## Co liczy skrypt
- **Dach [m²]** = suma pól obrysów budynków z OSM (w PL import z BDOT10k — dane geodezyjne, dokładność wysoka). Rzut dachu ≈ obrys budynku.
- **Filtr przemysłowy**: budynki ≥300 m² lub otagowane industrial/warehouse/silo — odcina domy sąsiadów w promieniu.
- **Silosy**: obiekty otagowane `man_made=silo|storage_tank` lub `building=silo`. UWAGA: tagowanie silosów w OSM jest niepełne — traktuj jako dolne ograniczenie i zweryfikuj wizualnie na mapach HTML (podkład satelitarny Esri jest w wygenerowanych mapach).
- Pola liczone w układzie PL-1992 (EPSG:2180) — metrycznie poprawne.

## Współrzędne zakładów (zweryfikowane przez Google Places)
| Zakład | Adres | Lat, Lon |
|---|---|---|
| Kupiec | Kupiecka 17, Paprotnia (gm. Krzymów) | 52.165498, 18.399932 |
| Cenos | Sikorskiego 22, Września | 52.316849, 17.583826 |
| Melvit | Nowowiejska 35, Kruki k. Ostrołęki | 53.085611, 21.508093 |
| Rol-Ryż | Celna 2, Gdynia (port) | 54.529354, 18.524515 |
| Konpack Polska I | Gosławicka 1, Konin | 52.291113, 18.264355 |

## Znane punkty odniesienia (z prasy branżowej)
- Kupiec, Paprotnia: rozbudowa przez Projprzem Budownictwo za ok. 25,5 mln zł brutto (obiekt produkcyjno-magazynowy); wcześniej hala magazynowa 3,3 tys. m² (GW: Commercecon) — użyj do sanity-checku wyniku.
- Rol-Ryż, Gdynia: historyczna łuszczarnia ryżu z 1928 r. + 3 silosy zabytkowe w porcie — kompleks zwarty, mały promień (250 m), żeby nie łapać sąsiednich obiektów portowych.
- Cenos ma DRUGI zakład produkcyjny w Prostkach (pow. ełcki) — siedziba we Wrześni to nie całość mocy produkcyjnych.
- Melvit ma zakłady w Krukach i (do weryfikacji) drugą lokalizację produkcyjną — sprawdź w Claude Code.

## Zastrzeżenia interpretacyjne
1. Dach ≠ moc produkcyjna: część dachu to magazyny wysokiego składowania (kubatura!), biura, wiaty. Traktuj jako proxy skali, nie wprost.
2. Rol-Ryż działa na terenie portowym (grunt Skarbu Państwa/ZMPG) — porównanie wartości nieruchomości z zakładami na gruntach własnych jest nieuprawnione bez korekty.
3. Konpack: promień 300 m od Gosławickiej 1 — zweryfikuj na mapie, czy to pełny teren zakładu, czy tylko biuro.
