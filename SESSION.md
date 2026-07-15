# Calm Wings — Session Summary

> **Session date:** 2026-07-15
> **Project path:** `G:\.shortcut-targets-by-id\1aBPs7hhQpl1bzyOnxaK6OgY8GGAPPIU2\Vibe To Viable\`
> **GitHub:** https://github.com/bhavukumar13/calm-wings
> **Status:** ✅ Build complete, dev server working, ready to deploy

---

## What We Did This Session

### 1. Grilling Session (20 questions)

Started with `/brainstorming` + `/grill-me` on the project folder. The project had an old architecture (Remotion + CSS 2.5D + 5-agent roster). Through 20 rounds of relentless questioning, we established:

- **Portfolio piece** — creative engineer flex, not a product
- **Approach B** — scroll-scrubbed real flythrough video (not CSS parallax)
- **Canvas + spritesheet** — not `<video>` element (engineering flex, smooth reverse scroll)
- **No user interaction** — pure scroll storytelling, HUD is cosmetic
- **Scene continuity via Approach C** — spatial overlap in art direction
- **Google Flow (Veo 3.1)** for asset generation — replaced ComfyUI + AnimateDiff
- **Higgsfield API** as post-MVP upgrade path
- **Deadline:** Friday 2026-07-17 morning

### 2. Old Architecture Scrapped

Deleted: `brief.md` (Remotion), `agents.md` (5-agent roster), old `package.json` (Remotion deps), `node_modules/`, `timeline.md` (old decisions). Rewrote from scratch.

### 3. Design Spec Written

`docs/specs/2026-07-15-calm-wings-design.md` — full technical spec covering architecture, asset pipeline, web app structure, scroll math, HUD phase machine, design tokens, build plan.

### 4. Google Flow Asset Guide Written

`docs/guides/google-flow-asset-generation.md` — step-by-step guide for generating all assets (5 keyframe images + 4 flythrough videos + 1 journey complete image) using Google Flow's Veo 3.1 + Imagen.

### 5. Assets Generated (Phase 0 — by Emo)

Emo generated all assets via Google Flow:
- 5 keyframe JPEGs (1376×768, 16:9, anime illustration style)
- 4 flythrough MP4 clips (1280×720, 8s, 24fps, 192 frames each)
- 1 journey complete JPEG

All assets reviewed and PASS: consistent art style, navy/gold/blue palette, spatial continuity between scenes, no watermarks.

### 6. Implementation Plan Written

`docs/plans/2026-07-15-calm-wings-implementation.md` — 7-task build plan with complete code for every file, provider assignments (Kimi/OpenRouter/NVIDIA), and dependency graph.

### 7. Build Executed (All 7 Tasks)

Provider subagents hit HTTP 429 rate limits on every dispatch. All tasks executed directly by orchestrator:

| Task | What | Files Created |
|------|------|---------------|
| 1 | Spritesheet | `scripts/generate-spritesheet.py`, `src/assets/spritesheet.jpg` (4096×2304, 1.5MB), `src/assets/journey-complete.jpg` |
| 2 | Scaffold | `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/types/simulation.ts`, `src/styles/tokens.css`, `src/styles/global.css`, `.gitignore` |
| 3 | Canvas Engine | `src/hooks/useScrollFrame.ts`, `src/hooks/useCheckpointPhase.ts`, `src/components/ScrollCanvas.tsx`, `src/styles/canvas.css` |
| 4 | HUD Components | `src/components/hud/StepLabel.tsx`, `InfoCard.tsx`, `TipPanel.tsx`, `Hotspot.tsx`, `ProgressBar.tsx`, `src/components/HUDOverlay.tsx`, `src/data/checkpointConfig.ts`, `src/styles/hud.css` |
| 5 | Journey Complete | `src/components/JourneyComplete.tsx` (+ journey CSS in `hud.css`) |
| 6 | Integration | `src/App.tsx` — wires all components together |
| 7 | README | `README.md` with pipeline diagram |

### 8. Bug Fixed

`height: 100%` on body was preventing scrolling. Changed to `min-height: 100%`. Dev server now shows full scroll experience.

### 9. GitHub Repo Created

Pushed to https://github.com/bhavukumar13/calm-wings (public). Teammates can clone and run.

### 10. Graphify Run

Ran `/graphify` on the codebase. Output in `graphify-out/`:
- `graph.json` — 99 nodes, 118 edges, 11 communities
- `graph.html` — interactive visualization
- `GRAPH_REPORT.md` — plain-language report
- `obsidian/` — Obsidian vault export

---

## Git History

```
333d086 docs: update brief.md and timeline.md to reflect completed build
a1801b6 fix: allow body to expand for scrolling (height:100% → min-height:100%)
12bbce2 feat: complete web app — canvas engine, HUD overlays, journey complete, README
bfd78e0 feat: scaffold Vite + React 19 + TypeScript project with design tokens
5b4bbfa feat: generate spritesheet from Flow video assets
3ac523b initial: project setup with design spec, implementation plan, and Phase 0 assets
```

---

## Architecture (As Built)

```
Google Flow (Veo 3.1 + Imagen)
  → 5 illustrated keyframe images
  → 4 flythrough video clips (8s each, Start/End Frame interpolation)
  → 1 journey complete image
       ↓
ffmpeg + Python (Pillow)
  → Extract 16 frames per clip (64 total)
  → Composite into 8×8 spritesheet (512×288 per frame, 4096×2304 total)
       ↓
React 19 + Canvas 2D API
  → Scroll position maps to frame index (0-63)
  → Canvas draws spritesheet subregion via drawImage()
  → HUD overlays flow in/out at each checkpoint (CSS transitions)
       ↓
Deploy: static export to Vercel (PENDING)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI assets | Google Flow (Veo 3.1 + Imagen / Nano Banana) |
| Frame compositing | ffmpeg + Python Pillow |
| Runtime | React 19.2.7 + TypeScript 7 |
| Build tool | Vite 8.1.4 |
| Canvas | Native Canvas 2D API |
| Styling | Vanilla CSS (CSS variables, glassmorphism) |

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root — composes ScrollCanvas + HUDOverlay + JourneyComplete |
| `src/components/ScrollCanvas.tsx` | Canvas element + scroll-scrub render loop |
| `src/hooks/useScrollFrame.ts` | scroll position → frame index (0-63) |
| `src/hooks/useCheckpointPhase.ts` | frame index → checkpoint + HUD phase |
| `src/components/HUDOverlay.tsx` | Master HUD container |
| `src/components/hud/*.tsx` | InfoCard, TipPanel, Hotspot, StepLabel, ProgressBar |
| `src/components/JourneyComplete.tsx` | Final summary screen |
| `src/data/checkpointConfig.ts` | 4 checkpoint definitions (text, tips, hotspots) |
| `src/types/simulation.ts` | TypeScript interfaces |
| `src/assets/spritesheet.jpg` | 8×8 grid of 64 frames (1.5MB) |
| `src/assets/journey-complete.jpg` | Final summary image |
| `src/styles/tokens.css` | CSS design tokens |
| `src/styles/hud.css` | HUD styles + flow animations |
| `src/styles/canvas.css` | Canvas + scroll spacer styles |
| `scripts/generate-spritesheet.py` | Frame extraction + spritesheet compositing |

---

## Known Issues

1. **npm install on Google Drive** — `npm install` fails with `EBADF` error on the `G:\` drive path. Workaround: install on local drive (`C:\Users\itsle\calm-wings-temp`) and copy `node_modules/` over. Teammates cloning from GitHub to their local drive won't hit this.

2. **Provider rate limits** — Kimi (kimi2.5) and OpenRouter (qwen3.6-plus) both returned HTTP 429 on subagent dispatches. NVIDIA (GLM-5.2) via OpenRouter also 429'd. All tasks were executed directly by the orchestrator. For future sessions: either use different providers or execute directly.

3. **Desktop-only** — No mobile responsive layout. Intentional for MVP.

---

## What's Next

1. **Deploy to Vercel** — `npx vercel` or connect GitHub repo to Vercel dashboard
2. **Test the scroll experience** — open http://localhost:3000, scroll through all 4 checkpoints
3. **Polish** — tune CSS transition timings, adjust hotspot positions if needed
4. **Post-MVP upgrade** — replace spritesheet with Higgsfield API (Seedance/Kling) higher quality video frames

---

## How to Resume in a New Session

```
1. Clone or cd to the project folder
2. npm install (if node_modules missing)
3. npm run dev → http://localhost:3000
4. Read this file (SESSION.md) for full context
5. Read brief.md for project overview
6. Read timeline.md for decision history
7. Read docs/specs/2026-07-15-calm-wings-design.md for technical spec
8. Read docs/plans/2026-07-15-calm-wings-implementation.md for build plan
9. Check graphify-out/ for codebase knowledge graph
```

Or just ask: "Read SESSION.md in the calm-wings project and tell me where we left off"
