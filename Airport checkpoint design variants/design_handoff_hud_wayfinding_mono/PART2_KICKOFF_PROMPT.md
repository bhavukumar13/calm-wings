# Part 2 kickoff prompt — paste into the new session

We're implementing **Part 2 (Interactive & UX layer)** of the Calm Wings HUD "Wayfinding Mono" redesign.

Repo root (selected folder): `C:\Users\itsle\calm-wings`
Plan + task tracker live here — read BOTH before doing anything:
- `Airport checkpoint design variants\design_handoff_hud_wayfinding_mono\IMPLEMENTATION_PLAN.md`
- `Airport checkpoint design variants\design_handoff_hud_wayfinding_mono\TASKS.md`

App stack: React 19 + TypeScript + vanilla CSS with tokens, Vite. HUD code is in `src/components/hud/`, `src/components/HUDOverlay.tsx`, hooks in `src/hooks/`, styles in `src/styles/`, data in `src/data/checkpointConfig.ts`, types in `src/types/simulation.ts`.

## Do this first
Part 1 (Phases 0–5, the visual redesign) is marked complete in TASKS.md, but **verify it against the actual `src/` code before starting** — do not assume it's built. Report what you find. Part 2 Phase 6 rewrites Part 1's entrance animation, so I need to know if you're building on existing code or if Part 1 still needs doing.

## Scope — Part 2 only (Phases 6–12 in the plan)
Build in order, one phase at a time, keeping TASKS.md checkboxes updated:
- **Phase 6 — Sticky scroll-linked HUD entrance.** Replace the 600ms timed CSS entrance with a scroll-driven reveal: derive `revealProgress` (0→1) from breathing-room scroll in `useCheckpointPhase.ts`, pass to `HUDOverlay.tsx`, drive opacity/translateY off a `--reveal` custom prop in `hud.css`, with per-element stagger offsets; hold ("sticky") across the active band, reverse-fade on exit. This supersedes Part 1's `transition-delay` stagger.
- **Phase 7 — Hover hotspot cards.** Hover-only (no keyboard/touch — accepted). Text-only mini glass card (title + 1–2 lines) anchored near the dot, 150ms scale+fade, no sibling dimming. Add `detail: { title, body }` to `HotspotConfig`.
- **Phase 8 — Ambient dot float** (subtle CSS bob, pause on hover).
- **Phase 9 — Scroll progress rail** (new `ScrollRail.tsx`, fill = `scrollY / TOTAL_SCROLL`, **right edge**).
- **Phase 10 — Checkpoint scroll-snap** (`scroll-snap-type: y proximity`, snap to each checkpoint's video-start rest point).
- **Phase 11 — Reduced-motion fallback + intro card** (new `IntroCard.tsx` at scroll 0).
- **Phase 12 — Verification.**

## Resolved decisions (don't re-litigate)
- Hotspot trigger: **hover-only**. Overlay: **text-only** mini card. Focus: **nothing dims**. Card entrance: **150ms scale+fade**.
- Sticky HUD: **scroll-linked entrance** (replaces the timed pop — this is the main goal).
- Scroll-snap: **`proximity`** (gentle), snap to **video-start rest point** so it doesn't skip the HUD reveal.
- Rail: **right edge**.
- **OD-1 (hotspot copy):** you draft the ~11 hotspot card blurbs from the existing `infoCard`/`tip` context and show them to me for review **before** wiring Phase 7.

## Working rules (follow strictly)
1. Ask, don't assume — if intent/architecture/requirements are unclear, ask before writing code.
2. Simplest solution first — no abstractions or flexibility I didn't request.
3. Don't touch unrelated code — leave files/functions outside the current phase alone.
4. Flag uncertainty explicitly — if you're not confident about an approach or detail, say so before proceeding.

Start by reading the two docs and verifying Part 1's state, then propose your Phase 6 approach before coding.
