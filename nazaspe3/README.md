# Na Zaspę 3 — office & retail building website

Static marketing site for an office/retail building for rent, served at
`/<repo>/nazaspe3/`. Completely self-contained — it shares nothing with the
Kanno Noodle site at the repository root.

```
nazaspe3/
├── index.html        single page: hero, key figures, building, availability,
│                     specification, location, drawings, contact, footer
├── css/style.css     full stylesheet incl. the responsive layer
├── js/i18n.js        English copy (Polish is the source language, in the HTML)
├── js/main.js        language switch, sticky header, floor picker, scroll
│                     reveals, contact form
└── assets/favicon.svg
```

No build step. Serve any way you like — `python3 -m http.server` locally,
GitHub Pages in production.

## How it works

**Bilingual PL / EN.** Polish lives directly in `index.html`, marked with
`data-i18n` keys; `main.js` snapshots it on load, and `i18n.js` holds only the
English dictionary. To edit Polish copy, edit the HTML — there is no second
place to keep in sync. The choice is remembered in `localStorage`; Polish is
the default.

**Floor picker.** The schematic section and the availability list are driven by
matching `data-floor` attributes. Clicking either side selects the floor on
both. Adding a floor means adding a `<g class="fl" data-floor="…">` band to the
section SVG and a `.fl-row` with the same `data-floor` — no JS changes.

**Drawings** (elevation, typical floor plan, site plan) are hand-drawn inline
SVG, styled from the stylesheet, so they follow the palette and stay sharp at
any size. There is no photography: the building is not built yet, and stock
photos of a different building would misrepresent it. Swap in real
visualisations when they exist.

**Contact form** has no backend. On submit it validates name and e-mail, then
composes a pre-filled message to the leasing address in the visitor's mail
client — nothing is silently dropped. Point it at a form service (Formspree,
Netlify Forms, etc.) if you want inbox delivery without a mail client.

## Before this goes to real tenants

The building data is a complete, self-consistent set for a building of this
type, but it was written to fill the design — **not supplied by the owner**.
Check every number before publishing:

- areas, floor availability and the "status as of" date in `#powierzchnie`
- the technical specification table in `#budynek`
- completion date (currently Q1 2027) and BREEAM level
- contact details — `najem@nazaspe3.pl` and `+48 58 000 00 00` are
  placeholders, in `index.html` and in the `mailto:` builder in `js/main.js`
- distances and travel times in `#lokalizacja`

The footer already carries the standard Polish disclaimer that the page is not
an offer within the meaning of the Civil Code.

## Fonts

Instrument Serif + Inter are loaded from Google Fonts. If they fail to load the
page falls back to Georgia and the system sans and still reads correctly.
