# Calm Wings — Project Timeline

> **Living document.** Every agent that makes a change — major or minor — MUST append an entry here.
> Format: `[YYYY-MM-DD HH:MM] [AGENT] [TYPE] — Description`
> Reverse-chronological order (newest on top).

---

## Legend

| Tag | Meaning |
|-----|---------|
| `[MAJOR]` | Architecture decision, pipeline chosen, stack changed, scope changed |
| `[MINOR]` | File created/modified, component added, bug fixed, asset generated |
| `[DECISION]` | A design or technical choice locked |
| `[BLOCKED]` | Work blocked — waiting on dependency or approval |
| `[UNBLOCKED]` | Blocker resolved |
| `[HUMAN]` | Action taken by Emo |

---

## Timeline

### 2026-07-16

> Timestamps below are approximate (logged during/after the work, not from precise session logging) — correct them if you have the real times.

`[2026-07-16 ~12:00] [ORCHESTRATOR] [MINOR]` — Phase 7 complete: hover-only hotspot info cards. Added `detail: { title, body }` to `HotspotConfig`, drafted and user-approved copy for all 9 hotspots (plan doc said 11; actual config has 9), wired `.hotspot__card` in `hud.css` (150ms scale+fade, pure CSS `:hover`, no sibling dimming, fixed offset below the label).

`[2026-07-16 ~11:30] [ORCHESTRATOR] [MINOR]` — User feedback after testing Phase 6: background froze for the entire breathing-room window even while the HUD was still fading in/out, reading as two disconnected acts ("bg halts → HUD pops on a corpse → HUD leaves while bg still dead"). Narrowed the hard freeze to just the hold band (breathingProgress 100–350px); added a subtle ambient zoom (`ambientScale`, driven by a scroll accumulator that only advances during the two 100px ramp bands) in `useScrollFrame.ts`, wired through `App.tsx` → `ScrollCanvas.tsx` as a CSS transform, so the background stays visibly alive during the transitions and locks solid only during the hold.

`[2026-07-16 ~10:45] [ORCHESTRATOR] [MAJOR]` — Phase 6 complete: sticky scroll-linked HUD entrance. Replaced the timed 600ms CSS transition with a continuous `revealProgress` (0→1) derived from breathing-room scroll offset in `useCheckpointPhase.ts` — 100px ramp-in / 250px hold / 100px ramp-out (widened from an initial 50/350/50 split per user request for a more gradual reveal). `HUDOverlay.tsx` computes per-element staggered reveal values and drives them via a `--reveal` CSS custom property in `hud.css`. Supersedes the Phase 4 `transition-delay` stagger entirely (`.hud-enter`/`.hud-enter-active`/`.hud-exit` classes removed).

`[2026-07-16 ~10:00] [ORCHESTRATOR] [DECISION]` — Kicked off Part 2 (Interactive & UX layer) of the HUD redesign. Verified Part 1 "Wayfinding Mono" redesign (Phases 0–5) against actual `src/` code before starting — confirmed fully implemented (fonts, tokens, three-state progress chips, glass recipe, entrance stagger all matched the handoff spec in `design_handoff_hud_wayfinding_mono/`). Exact date/session the Part 1 redesign itself was built is not logged here — it predates this session and was already marked complete in `TASKS.md` when this session began.

`[2026-07-16 ~09:00] [MAJOR]` — HUD "Wayfinding Mono" visual redesign (Phases 0–5 of `design_handoff_hud_wayfinding_mono/IMPLEMENTATION_PLAN.md`) completed at some point before this entry: Space Grotesk/Space Mono fonts replace Inter/Outfit, dark-glass tokens replace the solid-white info card, three-state progress chips (done/active/upcoming) replace the anonymous dot system, "TIP" mono tag replaces the emoji, per-element entrance stagger added. Logged retroactively during Part 2 verification — no original timeline entry exists for this work.

### 2026-07-15

`[2026-07-15 19:15] [ORCHESTRATOR] [MINOR]` — Fixed scroll bug: `height: 100%` on body was preventing page from scrolling. Changed to `min-height: 100%`. Dev server now shows full scroll experience.

`[2026-07-15 19:10] [ORCHESTRATOR] [MAJOR]` — All 7 implementation tasks complete. Canvas scroll-scrub engine, HUD overlay components, journey complete screen, and README all built and committed. TypeScript compiles clean, production build passes (198KB JS / 63KB gzipped, 1.5MB spritesheet). Subagent providers (Kimi, OpenRouter) hit HTTP 429 rate limits — all tasks executed directly by orchestrator.

`[2026-07-15 19:05] [ORCHESTRATOR] [MAJOR]` — Spritesheet generated: 64 frames extracted from 4 Veo 3.1 video clips (16 frames per clip, 512×288 each), composited into 8×8 grid (4096×2304, 1.5MB JPEG). Journey complete image copied. Committed at 5b4bbfa.

`[2026-07-15 19:00] [ORCHESTRATOR] [MAJOR]` — Project scaffolded: Vite 8 + React 19 + TypeScript 7. npm install succeeded (node_modules copied from local drive due to Google Drive EBADF npm bug). Design tokens, types, and global CSS created. Dev server runs at localhost:3000. Committed at bfd78e0.

`[2026-07-15 18:50] [ORCHESTRATOR] [DECISION]` — Architecture finalized after 20-question grilling session:
  - Portfolio piece (creative engineer flex)
  - Approach B: scroll-scrubbed real flythrough video (not CSS parallax)
  - Canvas-based frame renderer with spritesheet (not `<video>` element)
  - No user interaction — pure scroll storytelling
  - Scene continuity via Approach C (spatial overlap in art direction)
  - Google Flow (Veo 3.1) for asset generation — replaces ComfyUI + AnimateDiff
  - Higgsfield API (Seedance/Kling) as post-MVP upgrade path
  - Deadline: Friday 2026-07-17 morning

`[2026-07-15 18:40] [HUMAN] [MAJOR]` — Phase 0 assets generated via Google Flow and placed in `assets/` folder. 5 keyframe JPEGs (1376×768, 16:9), 4 flythrough MP4 clips (1280×720, 8s, 24fps, 192 frames each), 1 journey complete JPEG. All assets reviewed and PASS: consistent anime illustration style, navy/gold/blue palette, spatial continuity between scenes, no watermarks.

`[2026-07-15 18:30] [ORCHESTRATOR] [DECISION]` — Switched from ComfyUI + AnimateDiff SD1.5 to Google Flow (Veo 3.1) for asset generation. Reason: Flow's Start/End Frames feature solves scene continuity natively, Veo 3.1 quality vastly superior to AnimateDiff SD1.5, no local GPU dependency. ComfyUI remains as fallback.

`[2026-07-15 18:20] [ORCHESTRATOR] [MAJOR]` — Old architecture scrapped. `brief.md`, `agents.md`, old `package.json` (Remotion deps), and `node_modules/` deleted. New design spec written: `docs/specs/2026-07-15-calm-wings-design.md`. Clean `package.json` created (Vite + React 19 + TypeScript, no Remotion).

`[2026-07-15 18:00] [ORCHESTRATOR] [DECISION]` — Grilling session complete (20 questions). Key decisions: portfolio piece, Approach B, no interaction, canvas spritesheet, deadline Friday morning, orchestrated via Hermes agents.

`[2026-07-15 00:56] [HUMAN] [DECISION]` — Original project scoped and kicked off. Old architecture (Remotion + CSS 2.5D + 5 agents) was superseded by the grilling session above.

---

## Open Items

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | Generate 4 FLUX keyframe scene images in ComfyUI | Emo | ✅ Done (via Google Flow) |
| 2 | Run AnimateDiff SD1.5 on each keyframe | Emo | ✅ Done (via Google Flow Veo 3.1) |
| 3 | Extract 64 frames → composite spritesheet | Orchestrator | ✅ Done |
| 4 | Generate 1 FLUX journey complete image | Emo | ✅ Done (via Google Flow) |
| 5 | Scaffold Vite + React 19 + TS project | Orchestrator | ✅ Done |
| 6 | Build scroll-canvas engine | Orchestrator | ✅ Done |
| 7 | Build HUD overlay components | Orchestrator | ✅ Done |
| 8 | Build JourneyComplete component | Orchestrator | ✅ Done |
| 9 | Integration: wire all components | Orchestrator | ✅ Done |
| 10 | CSS transitions tuning + responsive | Orchestrator | ✅ Done |
| 11 | README with pipeline diagram | Orchestrator | ✅ Done |
| 12 | Deploy to Vercel | Emo | ⬜ Pending |
| 13 | HUD "Wayfinding Mono" visual redesign (Phases 0–5) | Orchestrator | ✅ Done |
| 14 | HUD Part 2 — scroll-linked reveal, hover hotspot cards (Phases 6–7) | Orchestrator | ✅ Done |
| 15 | HUD Part 2 — ambient dot float, scroll rail, scroll-snap, reduced-motion, intro card (Phases 8–12) | Orchestrator | ⬜ Pending |

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-15 | Portfolio piece (not product) — creative engineer flex | Showcases technical pipeline, not distribution |
| 2026-07-15 | Approach B — scroll-scrubbed real flythrough video | More impressive than CSS parallax, matches reference inspiration |
| 2026-07-15 | Canvas + spritesheet (not `<video>` element) | Engineering flex, smooth reverse scroll, pixel-perfect frame control |
| 2026-07-15 | No user interaction — pure scroll storytelling | Simpler, ships faster, HUD is visual atmosphere only |
| 2026-07-15 | Scene continuity via Approach C (spatial overlap) | No extra transition clips, shows art direction thinking |
| 2026-07-15 | Google Flow (Veo 3.1) for asset generation | Start/End Frames solves continuity natively, superior quality, no GPU dependency |
| 2026-07-15 | No Remotion, no CSS 2.5D, no HyperFrames | Wrong tools for scroll-scrubbed video |
| 2026-07-15 | Orchestrated via Hermes agents, Emo picks all models/prompts | Creative direction human, execution automated |
| 2026-07-15 | Higgsfield API (Seedance/Kling) as post-MVP upgrade | Get shipping by Friday, upgrade quality later |
| 2026-07-16 | HUD redesign: "Wayfinding Mono" direction — dark glass, mono micro-labels, gold reserved for active step only | Signage-inspired, tightens visual hierarchy vs. original MVP HUD |
| 2026-07-16 | Scroll-linked HUD reveal (100px ramp-in / 250px hold / 100px ramp-out) replaces timed CSS transition | Fixes "video freezes → pause → HUD pops" disconnect; ties HUD motion directly to scroll |
| 2026-07-16 | Background locks fully still only during the hold band; ambient zoom during the two ramp bands | User feedback: hard freeze for the whole breathing room read as two disconnected acts |
| 2026-07-16 | Hotspot cards are hover-only, no keyboard/touch path | Explicit accepted tradeoff — simplicity over full accessibility for this interaction |
