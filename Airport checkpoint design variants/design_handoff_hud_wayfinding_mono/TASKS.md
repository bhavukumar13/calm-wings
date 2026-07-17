# TASKS — HUD "Wayfinding Mono" redesign

Tracks the work in `IMPLEMENTATION_PLAN.md`. Check off as you go.

## Blockers — resolve first
- [x] Decide chip-name source (uncertainty #1) — DECIDED: add `chipName` to `CheckpointConfig`
- [x] Confirm `index.html` font swap (uncertainty #2) — DECIDED: in scope; replace Inter/Outfit `<link>` with `family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700`
- [x] Confirm body font change (uncertainty #3) — DECIDED: whole app, via `--font-primary` → Space Grotesk
- [x] Confirm StepLabel name strings + prop restructure (uncertainty #4) — DECIDED: proceed as proposed (`Entrance — Doors` / `Check-in Counter` / `Security Check` / `Boarding Gate`, split props)
- [x] Confirm pulse keyframe start size (uncertainty #5) — DECIDED: keep 13px

## Phase 0 — Fonts
- [x] Swap Google Fonts `<link>` in `index.html` to Space Grotesk + Space Mono

## Phase 1 — Tokens (`src/styles/tokens.css`)
- [x] Update `--color-bg-card`, `--color-accent-gold`, `--glass-blur`, `--radius-card`, `--font-display`, `--font-primary`
- [x] Add ink/body/tip/border/chip color tokens
- [x] Add `--radius-chip`, `--radius-tag`, `--font-mono`
- [x] Stop referencing `--color-bg-card-light` in HUD (keep for JourneyComplete)

## Phase 2 — Data
- [x] Add `sectorTag` to `CheckpointConfig` type (`src/types/simulation.ts`)
- [x] Add sectorTag values (`ENT // 01` … `GTE // 04`) in `checkpointConfig.ts`
- [x] Add chip-name / StepLabel-name fields per blocker decisions

## Phase 3 — Components (`src/components/hud/`)
- [x] StepLabel: sector tag + divider + name
- [x] ProgressBar: three-state chips (done / active / upcoming)
- [x] ProgressBar: optional hover-reveal chip names
- [x] InfoCard: gold icon square + white title
- [x] TipPanel: replace emoji with `TIP` mono tag
- [x] Hotspot: markup unchanged (styling in Phase 4)
- [x] HUDOverlay: wire new StepLabel props if needed

## Phase 4 — Styles (`src/styles/hud.css`)
- [x] Apply glass recipe uniformly to all panels
- [x] Restyle step label, progress chips, info card, tip panel, hotspot
- [x] Add per-element entrance stagger (0 / 100 / 200 / 300+80ms)
- [x] Update `@keyframes pulse` start size + 2.4s duration
- [x] Whole-app body font: `--font-primary` → Space Grotesk in `tokens.css` (no `global.css` edit needed)

## Phase 5 — Verification
- [x] `tsc` / `npm run build` clean
- [x] Scroll all 4 checkpoints, compare to `screenshots/01–04` @ 1280×720
- [x] Only active chip is gold; uniform glass; correct fonts; stagger order; pulse flush
- [x] JourneyComplete screen unaffected

---

# Part 2 — Interactive & UX layer

## Part 2 blockers — resolve before coding
- [x] OD-1: Hotspot card copy — DECIDED: I draft from existing infoCard/tip context (for your review)
- [x] OD-2: Scroll-snap vs. scroll-linked entrance — DECIDED: `proximity` snapping + snap to video-start rest point
- [x] OD-3: Rail placement — DECIDED: right edge

## Phase 6 — Sticky scroll-linked HUD entrance
- [x] `useCheckpointPhase.ts`: derive + return `revealProgress` (0→1) from breathing-room scroll (100px ramp-in / 250px hold / 100px ramp-out, per user decision)
- [x] `HUDOverlay.tsx`: consume `revealProgress`, set `--reveal` + per-element stagger offsets (computed in JS via `reveal()` helper, per user decision)
- [x] `hud.css`: drive opacity/translateY off `--reveal`; hold across active band; reverse on exit
- [x] Supersedes Phase 4 timed stagger (delays → scroll offsets)
- [x] Follow-up (user feedback): narrowed the video freeze to the hold band only (breathingProgress 100–350) — `useScrollFrame.ts` now adds a subtle ambient zoom (`ambientScale`) during the two 100px ramp bands so the background doesn't read as fully dead while the HUD fades in/out; locks solid only during the hold. Wired through `App.tsx` → `ScrollCanvas.tsx` as a CSS transform on `.canvas-container`.

## Phase 7 — Interactive hotspot cards (hover-only)
- [x] Add `detail: { title, body }` to `HotspotConfig` + copy (OD-1) — 9 hotspots (plan said 11; actual config has 9), copy reviewed and approved by user
- [x] `Hotspot.tsx`: hover reveals mini glass card, 150ms scale+fade, no sibling dim
- [x] Edge-clip guard for cards near viewport bounds — fixed 200px width, centered under dot; safe at all 9 hotspot positions on the 1280×720 reference viewport, no dynamic edge-detection added yet
- [x] `hud.css`: `.hotspot__card` glass styles

## Phase 8 — Ambient dot float
- [ ] `hud.css`: subtle `@keyframes float` on `.hotspot__dot`; pause on hover

## Phase 9 — Scroll progress rail
- [ ] New `ScrollRail.tsx`, fill height = `scrollY / TOTAL_SCROLL`
- [ ] Wire `scrollY` from `App.tsx`; default right edge (OD-3)
- [ ] Rail track + fill styles

## Phase 10 — Checkpoint scroll-snap
- [ ] Confirm OD-2 first
- [ ] `scroll-snap-type: y proximity` + per-checkpoint snap targets (split `.scroll-spacer`)

## Phase 11 — Reduced-motion + intro card
- [ ] `@media (prefers-reduced-motion: reduce)`: disable pulse/float/snap; reveal = opacity cross-fade
- [ ] New `IntroCard.tsx` at scroll 0 (title + "scroll to begin"), fades out on scroll-in

## Phase 12 — Verification (Part 2)
- [ ] Sticky entrance tracks scroll, no pop; holds + reverse-fades at boundaries
- [ ] Hover cards clean, no edge clip, no sibling dim
- [ ] Float subtle + pauses on hover; rail fills 0→100%; snap gentle, doesn't skip reveal
- [ ] Reduced-motion path verified; intro card shows at load, clears on scroll
- [ ] Accepted limitation: hotspot cards are hover-only (no keyboard/touch)
