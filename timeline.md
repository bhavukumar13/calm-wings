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

### 2026-07-15

`[2026-07-15 02:30] [ORCHESTRATOR] [MAJOR]` — Old architecture scrapped. `brief.md`, `agents.md`, old `package.json` (Remotion deps), and `node_modules/` deleted. New design spec written: `docs/specs/2026-07-15-calm-wings-design.md`. Clean `package.json` created (Vite + React 19 + TypeScript, no Remotion). Timeline reset.

`[2026-07-15 02:30] [ORCHESTRATOR] [DECISION]` — Architecture locked: ComfyUI (FLUX) → AnimateDiff SD1.5 → spritesheet (8×8 grid, 64 frames) → Canvas scroll-scrub engine → React HUD overlay (cosmetic, no interaction) → Vercel deploy. Post-MVP upgrade: Higgsfield API replaces AnimateDiff for video quality.

`[2026-07-15 02:30] [ORCHESTRATOR] [DECISION]` — Grilling session complete (20 questions). Key decisions: portfolio piece (creative engineer flex), Approach B (scroll-scrubbed real flythrough video), no user interaction (pure scroll storytelling), scene continuity via Approach C (spatial overlap between clips), 16 frames per clip (2s @ 8fps), canvas-based frame renderer with spritesheet, deadline Friday 2026-07-17 morning.

`[2026-07-15 00:56] [HUMAN] [DECISION]` — Original project scoped and kicked off. Old architecture (Remotion + CSS 2.5D + 5 agents) was superseded by the grilling session above.

---

## Open Items

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | Generate 4 FLUX keyframe scene images in ComfyUI | Emo | ⬜ Not Started |
| 2 | Run AnimateDiff SD1.5 on each keyframe (16 frames, camera-forward) | Emo | ⬜ Not Started |
| 3 | Extract 64 frames → composite spritesheet (8×8 grid) | Agent | ⬜ Not Started |
| 4 | Generate 1 FLUX journey complete image (cabin, thumbs up) | Emo | ⬜ Not Started |
| 5 | Scaffold Vite + React 19 + TS project, tokens.css, global.css | Agent | ⬜ Not Started |
| 6 | Build scroll-canvas engine (useScrollFrame hook, ScrollCanvas, render loop) | Agent | ⬜ Not Started |
| 7 | Build HUD overlay components (InfoCard, TipPanel, Hotspot, StepLabel, ProgressBar) | Agent | ⬜ Not Started |
| 8 | Build JourneyComplete component + checkpoint config data | Agent | ⬜ Not Started |
| 9 | Integration: wire all components, HUD phase machine, CSS flow animations | Agent | ⬜ Not Started |
| 10 | CSS transitions tuning + responsive adjustments | Agent | ⬜ Not Started |
| 11 | README with pipeline diagram | Agent | ⬜ Not Started |
| 12 | Deploy to Vercel | Emo | ⬜ Not Started |

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-15 | Portfolio piece (not product) — creative engineer flex | Showcases technical pipeline, not distribution |
| 2026-07-15 | Approach B — scroll-scrubbed real flythrough video | More impressive than CSS parallax, matches reference inspiration |
| 2026-07-15 | Canvas + spritesheet (not `<video>` element) | Engineering flex, smooth reverse scroll, pixel-perfect frame control |
| 2026-07-15 | No user interaction — pure scroll storytelling | Simpler, ships faster, HUD is visual atmosphere only |
| 2026-07-15 | Scene continuity via Approach C (spatial overlap in art direction) | No extra transition clips needed, shows art direction thinking |
| 2026-07-15 | 16 frames per clip, 2s @ 8fps (AnimateDiff SD1.5) | Fast to generate on 3060 12GB, enough for quick flythrough |
| 2026-07-15 | AnimateDiff SD1.5 for MVP, Higgsfield (Seedance/Kling) for post-MVP | Get shipping by Friday, upgrade quality later |
| 2026-07-15 | No Remotion, no CSS 2.5D, no HyperFrames | Wrong tools for scroll-scrubbed video, adds unnecessary indirection |
| 2026-07-15 | Orchestrated via Hermes agents, Emo picks all models/prompts | Right division of labor — creative direction human, execution automated |
