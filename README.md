# jawitek_repo — static sites

Independent static sites, one folder each, served by GitHub Pages from `main`.
No build step: every folder is plain HTML/CSS/JS and can be served by any
static host (`python3 -m http.server` locally).

| Site | Folder | URL |
| --- | --- | --- |
| Kanno Noodle | `kanno/` | https://jawitek.github.io/jawitek_repo/kanno/ |
| Na Zaspę 3 | `nazaspe3/` | https://jawitek.github.io/jawitek_repo/nazaspe3/ |
| Pogo Pogo | `pogo-pogo/` | https://jawitek.github.io/jawitek_repo/pogo-pogo/ |

The repository root holds only a redirect from `/` to `/kanno/`, so links to
the old root address keep working.

```
├── index.html      redirect to kanno/
├── kanno/          Kanno Noodle — B2B site for the ramen noodle production
│   ├── index.html
│   ├── privacy.html             GDPR privacy policy, EN
│   ├── polityka-prywatnosci.html  the same policy, PL (the original)
│   ├── instagram.html   Instagram post grid mockup
│   ├── css/ js/ assets/  js/i18n.js holds all copy in EN / PL / JA
│   └── brand/           logo master files (SVG / PDF / PNG)
├── nazaspe3/       Na Zaspę 3 — office space to let, Gdańsk Nowy Port
│   ├── index.html
│   ├── css/ js/ assets/
│   └── README.md        details, and what is still stubbed
├── pogo-pogo/      Pogo Pogo — browser game
│   ├── index.html
│   ├── css/ js/ assets/
│   └── README.md SPEC.md
├── .agents/skills/ nano-banana-2 image generation skill
└── .nojekyll       serve files verbatim, no Jekyll processing
```

## Adding another site

Give it its own folder with its own `css/`, `js/` and `assets/`, exactly like
the ones above, and it will be served at `/<folder>/`. Nothing is shared
between sites, so nothing collides.

## History

Kanno Noodle and Na Zaspę 3 were implemented from Claude Design prototypes.
The design bundles that produced them — `project/` (Kanno prototypes,
`direction-a.jsx` and friends) and `chats/` (the design conversation
transcript) — were removed from `main` once the sites were built: they were
working material, and everything in the repository is published publicly by
GitHub Pages. They remain in the git history if you ever need them:

```
git log --oneline --diff-filter=D -- project chats
git checkout <commit>^ -- project chats
```

The Kanno logo master files were kept out of that removal and live in
`kanno/brand/`.

## Known gaps — Kanno

- **Japanese privacy policy.** The site itself switches fully between EN / PL
  / JA, but the policy exists in Polish and English only — the JA footer link
  serves the English page.
- **Contact form.** No backend. Submitting composes a pre-filled message to
  hello@kanno.pl in the visitor's mail client. Wiring it to a form service
  (Formspree, Netlify Forms) would make it a true form.
- **Product photo mapping.** The design bundle shipped six unnamed product
  images, matched to the five noodle styles by appearance. Worth checking
  against the real product line; easy to swap in `kanno/index.html`.
- **`instagram.html` hotlinks Unsplash** for six of its photos, so that page
  depends on an external host. The main site hotlinks nothing.

`nazaspe3/README.md` and `pogo-pogo/README.md` cover those two sites.
