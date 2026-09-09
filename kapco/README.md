# KAP CO — brand guidelines

Logo and brand identity proposal for **KAP CO**, the KAP Holding company that
packs dry staples (rice, groats, beans, lentils) and mills flours from them.
Served at `/<repo>/kapco/`, independent of the other sites in this repo.

```
kapco/
├── index.html      the guidelines, one long page: strategy, family, logotype,
│                   colours, typography, packaging system, stationery, files
├── css/style.css   stylesheet; no JS is needed
├── brand/          logo masters (SVG, outlined) + PNG exports + the PDF export
└── assets/         favicon, sibling lockups for the "family" chapter
```

No build step, no fonts loaded from anywhere. The page uses the system
Helvetica Neue / Helvetica / Arial stack, as the family guidelines prescribe.
Bump `?v=N` on the CSS and image references when redeploying.

## How the logo was built

The KAP family logos (`KAP` Helvetica Bold + suffix Helvetica Light, Dark
Green, corner bracket in a per-company colour) exist only as PDFs. The KAP CO
lockup was built to be pixel-consistent with its siblings:

- **K, A, P and the bracket** are the vector paths extracted from the KAP IN
  guidelines PDF, unchanged.
- **C and O** are Helvetica Neue Light outlines scaled to the same cap height
  (714 font units → 183.14 pt) and placed with the same KAP|suffix gap
  (0.14 H) and suffix|bracket gap (0.09 H) as KAP IN.
- Everything is outlined, so the SVGs render identically without the font.
- The bracket takes **Tilled Earth `#6F6134`**, the one hue the family had
  not used, and the colour of the field the products come from. Ecru
  `#E1C68F` was the first proposal; the owner asked for a colour closer to
  soil, chose this one from five soil tones, and rejected a barley-ear
  variant, so the logotype stays pure like RE, IN and VC.

The generator script is not in the repo (it needs the fonts embedded in the
source PDFs, which cannot be redistributed). Rebuilding the logo means
re-extracting from the PDFs; editing the SVGs directly is fine for colour
changes.

## Decisions worth knowing

- **Two logo variants beyond the family set.** `kap-co-descriptor.svg` adds
  "FOOD COMMODITIES" (outlined Helvetica Neue Light as a stand-in for the
  family's Frutiger claim). `kap-co-grain.svg` puts a grain inside the O,
  allowed on packaging only — a nod to the bird inside KONSDROB's O.
- **Harvest palette** (Champagne, Eggshell, Mustard, Persian Orange, Ecru,
  Moss, Black Bean, Platinum) is the owner's chosen set from the reference
  palettes and drives the packaging colour coding by product group.
- **Pantone for Tilled Earth is a suggestion** (7769 C as a starting point). The core colours keep the
  family's Pantone references; the harvest palette is HEX/RGB only and needs
  a press proof before the first print run.
- **`family-konsdrob.png`** is a crop of the KONSDROB logo proposal
  (version 1, dark). Replace it with the final file once the logo is
  approved.
- **`brand/KAP_CO_brand_guidelines.pdf`** is a Chromium print of
  `index.html` (A4 landscape). Regenerate it after editing the page.
