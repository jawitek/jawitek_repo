# jawitek_repo — notatki dla agentów

Repo trzyma kilka niezależnych stron statycznych, każda w swoim podkatalogu,
serwowanych z GitHub Pages. Bez build-stepu i bez zależności — to jest wybór,
nie zaniedbanie. Utrzymuj go.

```
/            strona Kanno Noodle (przekierowanie do kanno/)
kanno/       strona firmowa Kanno Noodle
nazaspe3/    biurowiec na wynajem, Gdańsk Nowy Port
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

**Grafika jest podmieniana często i bywa uszkodzona.** Zdarzyło się tu
dwukrotnie, że wgrany plik SVG był bajt w bajt kopią zupełnie innego pliku.
Zanim uznasz, że problem jest w kodzie, **sprawdź plik** — wyrenderuj go
osobno albo porównaj z innym.
