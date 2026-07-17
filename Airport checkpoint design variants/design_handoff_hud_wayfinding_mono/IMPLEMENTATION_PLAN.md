# Implementation Plan — HUD "Wayfinding Mono" redesign

Recreate the `Wayfinding Mono, tightened` HUD (handoff README, screens `3a`–`3d`) in the existing Calm Wings app. Grounded in the real source under `calm-wings/src/` as of 2026-07-16.

**Scope — two parts:**
- **Part 1 — Wayfinding Mono visual redesign (Phases 0–5).** Visual/structural rework of the 5 HUD pieces + tokens + fonts + config fields. No hook or scroll-logic changes here — `useCheckpointPhase` and `activeCheckpoint` cover it.
- **Part 2 — Interactive & UX layer (Phases 6–11).** New behavior the user requested on top of the redesign: sticky scroll-linked HUD entrance, hover-reveal hotspot cards, ambient dot float, a scroll progress rail, checkpoint scroll-snap, reduced-motion fallback, and an intro card. **This part does change scroll logic** (`useCheckpointPhase` / `useScrollFrame`) and adds state — see Part 2 decisions.

---

## Uncertainties to resolve before coding

These are genuine gaps between the README and the actual repo. Confirm before writing code (per rule 1 — ask, don't assume):

1. **Chip names source. — DECIDED: option (a).** README wants progress chips labeled `ENTRANCE / CHECK-IN / SECURITY / BOARDING` and the active chip rendered as e.g. `03 SECURITY`. The repo has no such field — current chips are anonymous dots. **Resolution:** add a `chipName: string` field to `CheckpointConfig` (single source of truth) with values `ENTRANCE / CHECK-IN / SECURITY / BOARDING`. Reflected in Phase 2 below.
2. **`index.html` font swap. — DECIDED: in scope.** Not in the README's file list (§Overview lists tokens/hud/components/config only), but the Google Fonts `<link>` (currently Inter + Outfit) lives in `index.html`. **Resolution:** edit `index.html` — replace the Inter/Outfit `<link>` with `family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700`. See Phase 0.
3. **`global.css` body font. — DECIDED: whole app.** `body` uses `--font-primary: 'Inter'`. **Resolution:** change the whole-app body font to Space Grotesk by redefining `--font-primary: 'Space Grotesk', sans-serif` in `tokens.css` (one token change propagates to the `body` rule — simplest). Reflected in Phase 1.
4. **StepLabel restructure. — DECIDED: proceed as proposed.** Current `StepLabel` renders one flat `checkpoint.label` string (`"1. ENTRANCE — DOORS"`). The new design needs two separate parts (gold mono sector tag + white name) with a divider. **Resolution:** restructure `StepLabel` to take split props and add a `name` field to `CheckpointConfig` with values `"Entrance — Doors"`, `"Check-in Counter"`, `"Security Check"`, `"Boarding Gate"`. Reflected in Phase 2/3.
5. **Pulse keyframe start size. — DECIDED: 13px.** `@keyframes pulse` animates `16px → 48px`. New dot is `13px`. **Resolution:** update the keyframe start to `13px` so the ring originates flush with the smaller dot. Reflected in Phase 4.

---

## Phase 0 — Fonts

**`index.html`** — replace the Inter/Outfit `<link>` with:
`family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700`

## Phase 1 — Tokens (`src/styles/tokens.css`)

Update these existing tokens and add the new ones. Keep all scroll + `--hud-*` animation tokens untouched.

| Token | Current | New |
|---|---|---|
| `--color-bg-card` | `rgba(10,22,40,0.85)` | `rgba(8,14,24,0.65)` |
| `--color-accent-gold` | `#F5A623` | `#FFC531` |
| `--glass-blur` | `12px` | `28px` (apply with `saturate(130%)`) |
| `--radius-card` | `16px` | `12px` |
| `--font-display` | `'Outfit'` | `'Space Grotesk'` |
| `--font-primary` | `'Inter'` | `'Space Grotesk'` (whole-app body, per uncertainty #3) |

Add: `--color-ink-on-gold: #141A26`, `--color-text-body: rgba(255,255,255,0.75)`, `--color-text-tip: rgba(255,255,255,0.72)`, `--color-border-glass: rgba(255,255,255,0.12)`, `--color-chip-done: rgba(255,255,255,0.14)`, `--color-chip-done-text: rgba(255,255,255,0.75)`, `--color-chip-next-border: rgba(255,255,255,0.18)`, `--color-chip-next-text: rgba(255,255,255,0.4)`, `--radius-chip: 8px`, `--radius-tag: 6px`, `--font-mono: 'Space Mono', monospace`.

**Glass recipe (every panel):** `background: var(--color-bg-card); backdrop-filter: blur(28px) saturate(130%); -webkit-backdrop-filter: same; border: 1px solid var(--color-border-glass);`

Note: `--color-bg-card-light` (solid white) becomes unused by the HUD after this — leave it if `JourneyComplete` still uses it (it does), just stop referencing it in `.info-card`.

## Phase 2 — Data (`src/data/checkpointConfig.ts` + `src/types/simulation.ts`)

- Add `sectorTag: string` to `CheckpointConfig` (type file): values `'ENT // 01'`, `'CHK // 02'`, `'SEC // 03'`, `'GTE // 04'`.
- Add `chipName: string` to `CheckpointConfig` (per resolved uncertainty #1): `ENTRANCE`, `CHECK-IN`, `SECURITY`, `BOARDING`.
- Add a display `name: string` to `CheckpointConfig` for StepLabel (per resolved uncertainty #4): `Entrance — Doors`, `Check-in Counter`, `Security Check`, `Boarding Gate`.

## Phase 3 — Components (`src/components/hud/*.tsx`)

- **StepLabel** — accept `sectorTag` + `name`; render gold mono tag, `1×14px` divider, white Space-Grotesk name.
- **ProgressBar** — replace dot map with three-state chip map driven by the same `i < active / i === active / else` logic. Active chip = number + name, gold fill, ink-on-gold text. Done = filled number chip. Upcoming = bordered number chip. Optional hover-reveal name under done/upcoming chips.
- **InfoCard** — no structural change needed; icon `"i"` gets gold rounded-square styling, title goes white. Class/markup mostly unchanged.
- **TipPanel** — replace the `💡` emoji span with a `TIP` mono tag span (bordered gold pill).
- **Hotspot** — markup unchanged; styling only.

## Phase 4 — Styles (`src/styles/hud.css`)

Rewrite the component style blocks to the README's exact values: step-label pill (radius 10, pad 9/16), progress chips (30px, three states, gold active), info card (glass, gold icon square, white title, `text-wrap: pretty`), tip panel (TIP tag), hotspot (13px dot, 1.5px ring @ 2.4s, mono glass label). Apply the glass recipe uniformly.

**Entrance stagger (trickiest part):** current enter is a single container transition — there is no per-element stagger today. To get step-label 0ms / progress 100ms / card 200ms / hotspots 300ms + 80ms each, add per-element `transition-delay` (or `animation-delay`) on the children under `.hud-enter-active`. This restructures the enter animation; verify it doesn't fight the existing container-level transition in `HUDOverlay.tsx`.

Update `@keyframes pulse` start size to `13px` (see uncertainty #5).

## Phase 5 — Verification

- `npm run build` / `tsc` clean (new config field typed).
- Run `npm run dev`, scroll through all 4 checkpoints; compare against `screenshots/01–04` at 1280×720.
- Check: only the active chip is gold anywhere on screen; glass is uniform across all panels; fonts loaded (no Inter/Outfit fallback); stagger order correct on flow-in; pulse ring flush with dot.
- Confirm `JourneyComplete` screen is visually unaffected (out of scope for this handoff).

---

# Part 2 — Interactive & UX layer

New behavior requested on top of the visual redesign. Build **after** Part 1 is working so the redesign stays reviewable on its own.

## Part 2 decisions (from Q&A)

- **Hotspot trigger — hover-only.** No click and no keyboard path (explicitly chosen). Accepted tradeoff: hotspot cards are **not reachable by keyboard or touch**.
- **Hotspot overlay — text-only mini card.** A small glass card anchored near the dot with a title + 1–2 line description. No image. Needs new copy per hotspot (see OD-1).
- **Focus behavior — nothing dims.** The card sits on top; info card, tip, and other dots stay fully visible.
- **Card entrance — 150ms scale+fade** (matches the HUD's staggered feel).
- **Sticky HUD — scroll-linked entrance.** Replace the 600ms timed CSS entrance with opacity+offset driven by scroll through the breathing room: each element starts displaced+transparent, slides to its dedicated spot and reaches full opacity as you scroll, holds across the active band, reverse-fades toward the exit. Fixes the "video freezes → pause → HUD pops" beat.
- **Ambient dot float** — subtle idle bob on hotspot dots.
- **Scroll progress rail** — thin vertical gold rail showing overall journey progress (`scrollY / 5000`).
- **Checkpoint scroll-snap** — gentle snap so each checkpoint settles at its rest spot.
- **Reduced-motion fallback** — respect `prefers-reduced-motion`.
- **Intro card at start** — brief title + "scroll to begin" at scroll 0.

## Open sub-decisions — ALL RESOLVED

- **OD-1 — Hotspot card copy. — DECIDED.** 11 hotspots across the 4 checkpoints need new title+description text that doesn't exist today. **Resolution:** I draft it from the existing `infoCard`/`tip` context for your review (Phase 7).
- **OD-2 — Scroll-snap vs. scroll-linked entrance. — DECIDED.** A hard `scroll-snap-type: mandatory` can jump past the breathing-room scroll travel the sticky entrance rides on. **Resolution:** use `proximity` (gentle) snapping and snap to the checkpoint's video-start rest point, leaving the breathing-room band free to drive the HUD reveal (Phase 10).
- **OD-3 — Rail placement. — DECIDED:** right edge (Phase 9).

## Phase 6 — Sticky scroll-linked HUD entrance

Replaces the timed entrance from Phase 4. In `useCheckpointPhase.ts`, additionally derive a `revealProgress` (0→1) from the breathing-room scroll offset and return it. `HUDOverlay.tsx` consumes it and sets a CSS custom prop (e.g. `--reveal`) plus per-element stagger offsets; `hud.css` drives each element's `opacity` and `translateY` off `--reveal` instead of `.hud-enter-active` transitions. Element holds at full opacity across the active band ("sticky"), reverse-maps on exit. **Note:** this supersedes the Phase 4 `transition-delay` stagger — the stagger becomes per-element scroll offsets, not timed delays. Files: `useCheckpointPhase.ts`, `HUDOverlay.tsx`, `hud.css`. (See OD-2.)

## Phase 7 — Interactive hotspot cards (hover-only)

- **Data:** add `detail: { title: string; body: string }` to `HotspotConfig` (`types/simulation.ts`) + copy in `checkpointConfig.ts` (OD-1).
- **`Hotspot.tsx`:** hover state reveals a `.hotspot__card` mini glass card near the dot; 150ms scale+fade in; no sibling dimming. Guard against viewport-edge clipping (start with a fixed offset, refine if a card clips).
- **`hud.css`:** `.hotspot__card` — glass recipe, `--radius-card`, Space Grotesk body + Space Mono title tag.

## Phase 8 — Ambient dot float

`hud.css`: a subtle `@keyframes float` (≈ translateY ±2px, ~3s ease-in-out infinite) on `.hotspot__dot`; pause on `:hover`. Purely cosmetic, no JS.

## Phase 9 — Scroll progress rail

New `ScrollRail.tsx` (thin fixed vertical track, gold fill height = `scrollY / TOTAL_SCROLL`). Wire `scrollY` from `App.tsx` (already available). Default right edge (OD-3). New styles in `hud.css` or a small `rail.css`.

## Phase 10 — Checkpoint scroll-snap

Gentle `scroll-snap-type: y proximity` with snap targets at checkpoint rest positions. Current scroll is window-driven via a single `.scroll-spacer` sizing `TOTAL_SCROLL`, so snap points need real snap-align targets — likely splitting the spacer into per-checkpoint sections. Files: `canvas.css` / `global.css` (+ possibly `ScrollCanvas.tsx` markup). **Confirm OD-2 first.**

## Phase 11 — Reduced-motion + intro card

- **Reduced-motion:** `@media (prefers-reduced-motion: reduce)` — disable pulse, float, and snap smoothing; make the HUD reveal a plain opacity cross-fade (drop the translate); soften card entrance. Add to `hud.css` / `global.css`.
- **Intro card:** small component shown while `scrollY` is below checkpoint 1's active band — title + "scroll to begin", fading out as you scroll in. New `IntroCard.tsx` + a threshold check in `App.tsx` (or a `pre` phase). Confirm copy.

## Phase 12 — Verification (Part 2)

- Sticky entrance tracks scroll smoothly with no pop; elements hold then reverse-fade at boundaries.
- Hover cards appear/disappear cleanly, don't clip at screen edges, don't dim siblings.
- Ambient float is subtle and pauses on hover; rail fills 0→100% across the journey; snap feels gentle (not jarring) and doesn't skip the HUD reveal (OD-2).
- `prefers-reduced-motion` path disables motion as specified; intro card shows at load and clears on scroll-in.
- Keyboard/touch: confirm the accepted limitation (hotspot cards hover-only) is acceptable in final review.

---

## Files touched

**Part 1:** `index.html` · `src/styles/tokens.css` (includes whole-app body font via `--font-primary`) · `src/styles/hud.css` · `src/types/simulation.ts` · `src/data/checkpointConfig.ts` · `src/components/hud/{StepLabel,ProgressBar,InfoCard,TipPanel,Hotspot}.tsx` · `src/components/HUDOverlay.tsx` (prop wiring for StepLabel).

**Part 2 (adds/edits):** `src/hooks/useCheckpointPhase.ts` (revealProgress) · `src/components/HUDOverlay.tsx` (scroll-linked reveal) · `src/components/hud/Hotspot.tsx` (hover cards) · `src/types/simulation.ts` + `src/data/checkpointConfig.ts` (hotspot `detail` copy) · `src/App.tsx` (wire scrollY, mount rail + intro) · **new** `src/components/ScrollRail.tsx` · **new** `src/components/IntroCard.tsx` · `src/styles/canvas.css` / `src/styles/global.css` (scroll-snap, reduced-motion) · `src/styles/hud.css` (cards, float, reveal).
