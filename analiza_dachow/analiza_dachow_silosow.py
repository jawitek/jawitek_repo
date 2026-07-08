#!/usr/bin/env python3
"""
Analiza powierzchni dachów (obrysów budynków) i liczby silosów
dla zakładów produkcyjnych branży ryż/kasze w Polsce.

Źródło danych: OpenStreetMap (Overpass API) — obrysy budynków w Polsce
pochodzą w większości z importu BDOT10k, więc pokrycie jest niemal pełne.

Uruchomienie (Claude Code):
    pip install requests shapely pyproj pandas openpyxl folium
    python analiza_dachow_silosow.py

Wynik:
    - porownanie_zakladow.xlsx  (arkusz zbiorczy + szczegóły per budynek)
    - mapa_<zaklad>.html        (mapa weryfikacyjna per zakład)
"""

import time
import requests
import pandas as pd
from shapely.geometry import Polygon
from pyproj import Transformer
import folium

# ---------------------------------------------------------------
# ZAKŁADY: (nazwa, lat, lon, promień w metrach)
# Promień dobrany tak, by objąć teren zakładu; skoryguj po obejrzeniu map HTML.
# ---------------------------------------------------------------
SITES = [
    ("Kupiec (Paprotnia, Kupiecka 17)",        52.165498, 18.399932, 400),
    ("Cenos (Września, Sikorskiego 22)",        52.316849, 17.583826, 350),
    ("Melvit (Kruki k. Ostrołęki)",             53.085611, 21.508093, 450),
    ("Rol-Ryż (Gdynia, Celna 2 - port)",        54.529354, 18.524515, 250),
    ("Konpack Polska I (Konin, Gosławicka 1)",  52.291113, 18.264355, 300),
    # Do uzupełnienia / geokodowania ręcznego, jeśli chcesz rozszerzyć:
    # ("Cenos - zakład Prostki (pow. ełcki)",   53.7053,   22.4370,  400),  # zweryfikuj współrzędne
    # ("Sonko (Bielany Wrocławskie)",           51.0350,   16.9660,  350),  # zweryfikuj współrzędne
]

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
# Transformacja do układu PL-1992 (EPSG:2180) — metryczny, dokładne pola
T = Transformer.from_crs("EPSG:4326", "EPSG:2180", always_xy=True)

SILO_FILTER = (
    'nwr["man_made"~"silo|storage_tank"](around:{r},{lat},{lon});'
    'nwr["building"="silo"](around:{r},{lat},{lon});'
)


def overpass(query: str) -> dict:
    for attempt in range(3):
        resp = requests.post(OVERPASS_URL, data={"data": query}, timeout=120)
        if resp.status_code == 200:
            return resp.json()
        time.sleep(15 * (attempt + 1))  # rate limit — odczekaj
    resp.raise_for_status()


def fetch_buildings(lat: float, lon: float, r: int) -> list[dict]:
    q = f"""
    [out:json][timeout:90];
    (
      way["building"](around:{r},{lat},{lon});
      relation["building"](around:{r},{lat},{lon});
    );
    out geom tags;
    """
    data = overpass(q)
    out = []
    for el in data.get("elements", []):
        geom = el.get("geometry")
        if not geom and el.get("type") == "relation":
            # dla relacji bierz obrys pierwszego outer membera z geometrią
            for m in el.get("members", []):
                if m.get("role") == "outer" and m.get("geometry"):
                    geom = m["geometry"]
                    break
        if not geom or len(geom) < 4:
            continue
        pts = [T.transform(p["lon"], p["lat"]) for p in geom]
        try:
            poly = Polygon(pts)
            if not poly.is_valid:
                poly = poly.buffer(0)
            area = poly.area
        except Exception:
            continue
        tags = el.get("tags", {})
        out.append({
            "osm_id": f'{el["type"]}/{el["id"]}',
            "building": tags.get("building", ""),
            "name": tags.get("name", ""),
            "levels": tags.get("building:levels", ""),
            "area_m2": round(area, 0),
            "centroid": poly.centroid,
            "geometry_ll": geom,
        })
    return out


def fetch_silos(lat: float, lon: float, r: int) -> list[dict]:
    q = f"""
    [out:json][timeout:90];
    (
      {SILO_FILTER.format(r=r, lat=lat, lon=lon)}
    );
    out center tags;
    """
    data = overpass(q)
    silos = []
    for el in data.get("elements", []):
        tags = el.get("tags", {})
        kind = tags.get("man_made") or tags.get("building")
        c = el.get("center") or {"lat": el.get("lat"), "lon": el.get("lon")}
        silos.append({
            "osm_id": f'{el["type"]}/{el["id"]}',
            "typ": kind,
            "lat": c.get("lat"),
            "lon": c.get("lon"),
        })
    return silos


def make_map(site_name, lat, lon, r, buildings, silos):
    m = folium.Map(location=[lat, lon], zoom_start=17, tiles=None)
    folium.TileLayer(
        tiles="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attr="Esri World Imagery", name="Satelita").add_to(m)
    folium.Circle([lat, lon], radius=r, color="blue", fill=False,
                  tooltip=f"Promień analizy {r} m").add_to(m)
    for b in buildings:
        coords = [(p["lat"], p["lon"]) for p in b["geometry_ll"]]
        folium.Polygon(coords, color="red", weight=1, fill=True, fill_opacity=0.3,
                       tooltip=f'{b["area_m2"]:.0f} m² | {b["building"]} {b["name"]}').add_to(m)
    for s in silos:
        folium.CircleMarker([s["lat"], s["lon"]], radius=5, color="orange",
                            fill=True, tooltip=f'silos/zbiornik: {s["typ"]}').add_to(m)
    fname = "mapa_" + "".join(c if c.isalnum() else "_" for c in site_name)[:40] + ".html"
    m.save(fname)
    return fname


def main():
    summary, details = [], []
    for name, lat, lon, r in SITES:
        print(f"\n=== {name} ===")
        buildings = fetch_buildings(lat, lon, r)
        time.sleep(5)
        silos = fetch_silos(lat, lon, r)
        time.sleep(5)

        # heurystyka: budynki przemysłowe vs. reszta (mieszkalne/garaże sąsiadów)
        industrial = [b for b in buildings if b["area_m2"] >= 300 or
                      b["building"] in ("industrial", "warehouse", "silo", "manufacture", "storage_tank")]
        total_all = sum(b["area_m2"] for b in buildings)
        total_ind = sum(b["area_m2"] for b in industrial)
        biggest = max(buildings, key=lambda b: b["area_m2"], default=None)

        summary.append({
            "Zakład": name,
            "Budynki ogółem [szt.]": len(buildings),
            "Dach ogółem [m²]": total_all,
            "Dach - obiekty przemysłowe (>=300 m²) [m²]": total_ind,
            "Największy budynek [m²]": biggest["area_m2"] if biggest else 0,
            "Silosy/zbiorniki (OSM) [szt.]": len(silos),
            "Mapa": make_map(name, lat, lon, r, buildings, silos),
        })
        for b in buildings:
            details.append({"Zakład": name, "OSM": b["osm_id"], "Typ": b["building"],
                            "Nazwa": b["name"], "Kondygnacje": b["levels"],
                            "Powierzchnia [m²]": b["area_m2"]})
        print(f"  budynki: {len(buildings)}, dach przemysłowy: {total_ind:,.0f} m², silosy: {len(silos)}")

    df_sum = pd.DataFrame(summary).sort_values(
        "Dach - obiekty przemysłowe (>=300 m²) [m²]", ascending=False)
    df_det = pd.DataFrame(details).sort_values(
        ["Zakład", "Powierzchnia [m²]"], ascending=[True, False])
    with pd.ExcelWriter("porownanie_zakladow.xlsx", engine="openpyxl") as xl:
        df_sum.to_excel(xl, sheet_name="Podsumowanie", index=False)
        df_det.to_excel(xl, sheet_name="Budynki szczegółowo", index=False)
    print("\nZapisano: porownanie_zakladow.xlsx + mapy HTML")


if __name__ == "__main__":
    main()
