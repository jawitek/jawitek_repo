# Kanno Noodle — website

Live at https://jawitek.github.io/jawitek_repo/

The production website lives at the repository root, built from the design
bundle the client exported from Claude Design (`Kanno Noodle Website.html`).
It is a B2B site for the noodle production business: Japanese recipes,
production in central Poland.

- `index.html` — single page: hero, stats, about, noodle portfolio,
  production/packing, quality & site, contact form, footer
- `css/style.css` — full stylesheet, including the responsive layer the
  desktop-only prototype did not have
- `js/main.js` — scroll reveals, egg-variant filter, contact form, mobile menu
- `assets/` — logo (dark and white wordmark variants), hero and section
  photography, six product shots, packaging and map images, favicon

All photography ships with the repo — nothing is hotlinked, so the site
renders identically offline and on any host.

No build step. Serve the repository root with any static host: GitHub Pages
(currently in use), Netlify, or `python3 -m http.server` locally.

### Known gaps

- **Languages.** The header shows EN / PL / JA exactly as designed, but only
  English copy exists — the PL and JA chips are inert until translations are
  supplied.
- **Contact form.** There is no backend. Submitting composes a pre-filled
  message to hello@kanno.pl in the visitor's mail client. Wiring it to a form
  service (Formspree, Netlify Forms) or an endpoint would make it a true form.
- **Product photo mapping.** The bundle shipped six unnamed product images;
  they were matched to the five noodle styles by appearance. Worth a check
  against the real product line, and easy to swap in `index.html`.

The older "Direction A · Editorial / Wabi" concept and the Instagram post
grid remain in `project/` and `kanno-instagram.html` for reference.

---

# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 1 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/Kanno Instagram.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `Kanno` project files (HTML prototypes, assets, components)
