# Status analizy — 2026-07-08

Skrypt `analiza_dachow_silosow.py` **nie mógł zostać uruchomiony w środowisku Claude Code on the web**:
polityka sieciowa (egress proxy) tego środowiska zwraca `403 Forbidden` dla hostów:

- `overpass-api.de` (Overpass API — obrysy budynków i silosy z OSM)
- `nominatim.openstreetmap.org` (geokodowanie Cenos Prostki i Sonko)

Zablokowana jest zarówno ścieżka `requests`/`curl` (proxy), jak i wbudowany fetch harnessa.
Zależności Pythona (requests, shapely, pyproj, pandas, openpyxl, folium) instalują się poprawnie —
rejestry pakietów są na liście dozwolonych.

## Jak odblokować

1. W ustawieniach środowiska Claude Code on the web zmień politykę sieciową na taką, która
   dopuszcza `overpass-api.de` i `nominatim.openstreetmap.org`
   (dokumentacja: https://code.claude.com/docs/en/claude-code-on-the-web), **albo**
2. uruchom skrypt lokalnie:
   ```bash
   pip install requests shapely pyproj pandas openpyxl folium
   python analiza_dachow_silosow.py
   ```

## Co pozostało do zrobienia po odblokowaniu (wg INSTRUKCJA_claude_code.md)

- [ ] Uruchomić skrypt dla 5 zakładów z `SITES`.
- [ ] Przedstawić ranking wg powierzchni dachu obiektów przemysłowych (`porownanie_zakladow.xlsx`).
- [ ] Zweryfikować na mapach HTML promienie analizy (obrys nie może łapać sąsiednich posesji ani ucinać hal) i skorygować `SITES`.
- [ ] Dodać Cenos Prostki (pow. ełcki) i Sonko — geokodować przez Nominatim, zweryfikować na podkładzie satelitarnym.
- [ ] Sanity-check wyników wg punktów odniesienia z instrukcji (Kupiec ~3,3 tys. m² hala + rozbudowa; Rol-Ryż mały promień 250 m).
