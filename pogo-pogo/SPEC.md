# GAME SPECIFICATION: POGO POGO (MVP)

> Notatka od właściciela projektu, zapisana bez zmian. To jest źródło prawdy
> dla MVP — nic z tego nie jest jeszcze zaimplementowane.

## 1. Executive Summary
* **Title:** Pogo Pogo
* **Genre:** Hyper-casual / Arcade Endless Runner with Physics
* **Platform:** Web / Mobile Browser (HTML5 Canvas via GitHub Pages) -> Mobile (iOS/Android)
* **Visual Style:** 2D Flat Vector / Cartoon Comic, vibrant summer palette, isometric top-down (rear-view angle).
* **Core Hook:** Unhinged physical slapstick – a stoic, unbothered Capybara balancing a hyper-panicking Flamingo in a wobbly totem on a jet ski.

---

## 2. Character & Vehicle Dynamics (The Cast)

### A. The Vehicle (Base): Jet Ski
* **Behavior:** Directly responds to player input (Left / Right).
* **Visual:** Bright retro jet ski cutting through blue water with spray/foam particles.

### B. Bottom Totem: Stoic Capybara
* **Role:** The Anchor.
* **Attitude:** Completely relaxed, wearing cool sunglasses, zero reaction to impending doom.
* **Physics:** Firmly attached to the jet ski. Rotates slightly with the turns.

### C. Top Totem: Panicked Flamingo
* **Role:** The Chaos Element (Inverted Pendulum).
* **Attitude:** Total hysteria, wide bulging eyes, wings flailing.
* **Physics:** Connected to the Capybara's head via an elastic pivot/spring joint.
  * Rapid left/right movements whip the Flamingo violently due to inertia.
  * If the tilt angle exceeds 50°, the Flamingo falls off into the water (Game Over).

---

## 3. Core Gameplay Loop

1. **Start:** Jet ski accelerates forward automatically at constant speed.
2. **Steering (Touch / Mouse):**
   * *Hold Left Screen:* Jet ski maneuvers left.
   * *Hold Right Screen:* Jet ski maneuvers right.
   * *Release:* Realigns toward center.
3. **Challenge:** Avoid obstacles while counter-steering to keep the Flamingo balanced.
4. **Failure State (Wipeout):**
   * Direct collision with any obstacle.
   * Totem collapse (Flamingo tilts past maximum threshold).
5. **Reward:** Distance traveled (meters) + collectible golden coins/pineapples.

---

## 4. MVP Scope & Obstacles (Summer Theme)

* **Obstacle 1: Red/White Buoy (Static):** Fixed obstacle forcing precise slaloms.
* **Obstacle 2: Shark Fin (Slow Horizontal Movement):** Moves across the screen, forcing quick dodge-and-counter maneuvers.
* **Obstacle 3: Water Ramp (Bonus/Hazard):** Launches the vehicle for bonus airtime points, but creates severe landing turbulence for the Flamingo.

---

## 5. UI & Game Screens

* **Screen 1: Main Menu (Overlay):** Title logo, "TAP TO RIDE" prompt, High Score display.
* **Screen 2: Gameplay HUD:** Distance Counter (Top-Center), Coin Counter (Top-Right).
* **Screen 3: Game Over Screen:** "WIPEOUT!" banner, Final Score, Best Score, Instant "RETRY" button.

---

## 6. Technical Stack for MVP
* **Format:** Single or modular HTML5 / JavaScript (Canvas API or Phaser.js).
* **Deployment:** Hosted directly on GitHub Pages.
* **Assets:** Modular transparent PNG sprites (`jetski.png`, `capybara.png`, `flamingo.png`, `buoy.png`, `shark.png`).

---

## Rozstrzygnięcia przyjęte w implementacji

Dopisane po zbudowaniu MVP — nie są częścią oryginalnej notatki.

1. **Format grafik: SVG, nie PNG.** Sekcja 6 wymienia PNG-i, ale kolejny
   prompt do gameplayu podał listę plików `.svg` i taką przyjęto. Gra ma
   dla każdego elementu kształt zastępczy rysowany w kodzie, więc działa
   też bez żadnych plików.
2. **Czysty Canvas 2D, bez Phasera.** Reszta repo nie ma build-stepu ani
   zależności i to zostaje.
3. **Perspektywa: zza pojazdu, kamera prosto z góry.** „isometric top-down
   (rear-view angle)" opisuje dwie różne rzeczy; izometrii nie ma i jej
   dodanie wymagałoby przerysowania sprite'ów.
4. **Bez rampy.** Sekcja 4 wymienia ją jako trzecią przeszkodę, ale prompt
   do gameplayu zawęził MVP do bojek i rekinów. Lot i turbulencja przy
   lądowaniu są więc poza zakresem.
5. **Bez monet i ananasów.** Sekcja 3 obiecuje zbieractwo, sekcja 5 daje na
   nie licznik — prompt do gameplayu zostawił w HUD tylko dystans.
   Zaimplementowano dystans.
