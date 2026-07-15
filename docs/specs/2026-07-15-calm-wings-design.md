# Calm Wings — Design Spec

> **Type:** Portfolio piece (creative engineer flex)
> **Date:** 2026-07-15
> **Deadline:** Friday 2026-07-17 morning
> **Status:** Approved (pending user review)

---

## 1. What This Is

Calm Wings is a scroll-driven, first-person airport flythrough experience. The user scrolls to "walk" through 4 airport checkpoints — entrance, check-in, security, boarding — each rendered as a 2-second AI-generated flyforward video clip. At each checkpoint, the video pauses and a HUD overlay (info cards, tips, glowing hotspots, step badge) flows in, stays visible while the user scrolls through a "breathing room" section, then flows out as the next clip begins.

No interaction is required to progress. No clicking, no task completion, no locks. The user scrolls through the entire experience start to finish. The HUD overlays are visual atmosphere — they appear, linger, and disappear.

The repo and README are part of the portfolio piece. The viewer should open the deployed site, scroll through the experience, then check the GitHub and think: **"How did they build this?"**

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│                   ASSET PIPELINE                     │
│                                                      │
│  ComfyUI (FLUX-dev-fp8)                              │
│    → 4 illustrated scene keyframe images             │
│    (entrance, check-in, security, boarding)          │
│         │                                            │
│         ▼                                            │
│  ComfyUI (AnimateDiff SD1.5 mm_sd_v15_v2)            │
│    → 4 video clips, 16 frames each at 8fps (2s)      │
│    (image-to-video, camera-forward motion prompt)     │
│         │                                            │
│         ▼                                            │
│  ffmpeg / ComfyUI VideoHelperSuite                   │
│    → Extract 64 individual frames (JPEG)             │
│    → Composite into 1 spritesheet (8×8 grid, 512×288) │
│         │                                            │
│         ▼                                            │
│  ┌─────────────────────────────────────────────┐     │
│  │           WEB APP (React 19 + Vite)          │     │
│  │                                               │     │
│  │  ┌───────────────────────────────────────┐   │     │
│  │  │  Canvas Scroll-Scrub Engine            │   │     │
│  │  │  - Load spritesheet (1 Image)          │   │     │
│  │  │  - scroll → frame index (0-63)         │   │     │
│  │  │  - drawImage(sheet, sx, sy, ...)       │   │     │
│  │  │  - requestAnimationFrame render loop   │   │     │
│  │  └───────────────────────────────────────┘   │     │
│  │  ┌───────────────────────────────────────┐   │     │
│  │  │  HUD Overlay (pure React DOM)          │   │     │
│  │  │  - InfoCard, TipPanel, Hotspots        │   │     │
│  │  │  - StepLabel, ProgressBar              │   │     │
│  │  │  - CSS flow-in / flow-out transitions  │   │     │
│  │  └───────────────────────────────────────┘   │     │
│  │  ┌───────────────────────────────────────┐   │     │
│  │  │  Journey Complete (static Image + card) │   │     │
│  │  └───────────────────────────────────────┘   │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  Deploy: static export to Vercel                     │
└─────────────────────────────────────────────────────┘

UPGRADE PATH (post-MVP):
  AnimateDiff SD1.5 → replaced by Higgsfield API
  (Seedance/Kling image-to-video from FLUX keyframes)
  Web app stays identical — only asset quality changes.
```

---

## 3. Asset Pipeline

### 3.1 Scene Keyframe Generation (ComfyUI + FLUX)

**Model:** `flux1-dev-fp8.safetensors`

**4 keyframe images:**

| # | Scene | Prompt Direction |
|---|-------|-----------------|
| 1 | Airport entrance | Terminal sliding glass doors, "Welcome" sign, departures signage visible through glass. Camera at eye level, standing at entrance. Semi-realistic anime illustration style, warm lighting, navy/blue palette with gold accents. |
| 2 | Check-in counters | Airline check-in counters (01-05) with queue barriers, FIDS board in background. Camera mid-room, looking toward counters. Same art style, lighting consistent with scene 1. **Background should show the entrance doors the user just came through.** |
| 3 | Security screening | X-ray belt, metal detector gate, CISF personnel, tray area. Camera facing security equipment. Same art style. **Background should show the check-in area behind.** |
| 4 | Boarding gate | Gate A12, FIDS screen, boarding queue, jet bridge visible ahead. Camera near gate entrance. Same art style. **Background should show the airside terminal corridor.** |

**Scene continuity constraint (Approach C):** Each scene's background must visually lead into the next scene's foreground. The user should feel spatial continuity when the canvas swaps from clip 1's final frame to clip 2's first frame.

**Output:** 4 images at 16:9 aspect ratio, minimum 1024×576 resolution (FLUX native).

### 3.2 Video Clip Generation (ComfyUI + AnimateDiff)

**Models:**
- Checkpoint: SD1.5-compatible (use FLUX output as img2img input or use a separate SD1.5 checkpoint for AnimateDiff)
- Motion module: `mm_sd_v15_v2.ckpt`
- Custom node: `comfyui-animatediff-evolved`

**Per clip:**
- Input: keyframe image from step 3.1
- Frames: 16
- FPS: 8 (2 seconds of video)
- Motion prompt: "Camera slowly pushes forward through the scene, smooth dolly motion, no subject movement, ambient atmosphere"
- Resolution: 512×288 (16:9 widescreen, SD1.5 friendly on 3060 12GB)

**Output:** 4 MP4 clips, 2 seconds each, 16 frames each → 64 total frames.

### 3.3 Frame Extraction & Spritesheet

- Extract all 64 frames from the 4 clips as individual JPEGs (quality 80)
- Composite into a single spritesheet image:
  - Grid: 8 columns × 8 rows
  - Frame size: 512×288
  - Spritesheet size: 4096×2304
  - Format: JPEG quality 85
  - Estimated file size: ~500KB-1MB

**Frame ordering in spritesheet:**
```
Row 0: Clip 1 frames 0-7
Row 1: Clip 1 frames 8-15
Row 2: Clip 2 frames 0-7
Row 3: Clip 2 frames 8-15
Row 4: Clip 3 frames 0-7
Row 5: Clip 3 frames 8-15
Row 6: Clip 4 frames 0-7
Row 7: Clip 4 frames 8-15
```

Frame index 0-63 maps linearly: `frameIndex = row * 8 + col`.

### 3.4 Journey Complete Image

- 1 FLUX-generated image: anime-style character seated in aircraft cabin, thumbs up, window view
- Static — no animation needed
- Displayed as a React DOM overlay, not on the canvas

### 3.5 Post-MVP Upgrade Path

Replace step 3.2 with Higgsfield API:

```
POST https://platform.higgsfield.ai/bytedance/seedance/v1/pro/image-to-video
  image_url: <FLUX keyframe URL>
  prompt: "Camera slowly pushes forward through the airport scene, smooth dolly motion"
```

Poll `/requests/{request_id}/status` until `completed`, download MP4 from `video.url`.

Same frame extraction → spritesheet process. Web app unchanged.

---

## 4. Web App

### 4.1 Stack

| Layer | Technology |
|-------|-----------|
| Runtime | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Vanilla CSS (modular, CSS variables) |
| Canvas | Native `<canvas>` 2D API |
| Deployment | Static export (Vercel) |

### 4.2 Component Structure

```
src/
├── App.tsx                    # Root — composes everything
├── components/
│   ├── ScrollCanvas.tsx       # Canvas element + scroll-scrub render loop
│   ├── HUDOverlay.tsx         # Master HUD container — shows/hides per checkpoint
│   ├── hud/
│   │   ├── InfoCard.tsx        # White ℹ info card
│   │   ├── TipPanel.tsx        # Bottom 💡 tip card
│   │   ├── Hotspot.tsx         # Golden ⊙ marker (CSS pulse, cosmetic only)
│   │   ├── StepLabel.tsx       # Top-left badge ("1. ENTRANCE")
│   │   └── ProgressBar.tsx     # Top bar with 4 checkpoint dots
│   └── JourneyComplete.tsx     # Final static image + summary card
├── hooks/
│   ├── useScrollFrame.ts       # scroll position → frame index (0-63)
│   └── useCheckpointPhase.ts   # frame index → which checkpoint + HUD phase
├── data/
│   └── checkpointConfig.ts     # 4 checkpoints: frame ranges, HUD content, colors
├── types/
│   └── simulation.ts           # TypeScript interfaces
├── assets/
│   └── spritesheet.jpg         # The 8×8 grid spritesheet
└── styles/
    ├── tokens.css              # Design tokens (colors, fonts, radii)
    ├── global.css              # Reset + typography
    ├── canvas.css              # Canvas styles
    └── hud.css                 # HUD overlay styles + flow animations
```

### 4.3 Scroll-Scrub Canvas Engine

**Core mechanic:**

```typescript
// Total scrollable height: ~5000px
// 4 checkpoints, each gets ~1250px of scroll
//
// Within each checkpoint's 1250px:
//   - First ~800px: video plays (16 frames, scroll maps to frame 0-15)
//   - Last ~450px: "breathing room" — video paused on last frame,
//     HUD is visible, scrolling advances through dead space
//
// At the boundary between checkpoints:
//   - Frame index jumps from clip N's last frame to clip N+1's first frame
//   - HUD N flows out, HUD N+1 flows in (CSS transition)

const TOTAL_FRAMES = 64;        // 4 clips × 16 frames
const FRAMES_PER_CLIP = 16;
const SCROLL_PER_CHECKPOINT = 1250; // px
const VIDEO_SCROLL = 800;       // px per clip's video phase
const BREATHING_SCROLL = 450;   // px per clip's HUD phase
const TOTAL_SCROLL = 4 * SCROLL_PER_CHECKPOINT; // 5000px

function scrollToFrame(scrollY: number): number {
  const checkpoint = Math.floor(scrollY / SCROLL_PER_CHECKPOINT);
  const localScroll = scrollY % SCROLL_PER_CHECKPOINT;

  if (localScroll < VIDEO_SCROLL) {
    // Video phase — map scroll to frames 0-15 within this clip
    const frameInClip = Math.floor((localScroll / VIDEO_SCROLL) * FRAMES_PER_CLIP);
    return checkpoint * FRAMES_PER_CLIP + Math.min(frameInClip, FRAMES_PER_CLIP - 1);
  } else {
    // Breathing room — video paused on last frame of this clip
    return checkpoint * FRAMES_PER_CLIP + FRAMES_PER_CLIP - 1;
  }
}
```

**Canvas render loop:**

```typescript
function renderFrame(ctx, spritesheet, frameIndex) {
  const col = frameIndex % 8;
  const row = Math.floor(frameIndex / 8);
  const frameW = 512;
  const frameH = 288;

  ctx.drawImage(
    spritesheet,
    col * frameW, row * frameH, frameW, frameH,  // source
    0, 0, canvas.width, canvas.height            // dest
  );
}
```

- Use `requestAnimationFrame` to check if scroll changed → redraw canvas
- Only redraw when frame index actually changes (avoid unnecessary draws)
- Reverse scrolling: just draw the previous frame. Instant, no stutter. This is the canvas advantage.

### 4.4 HUD Overlay System

**Phase machine per checkpoint:**

| Phase | Trigger | Visual |
|-------|---------|--------|
| **Pre** | scroll < checkpoint start | HUD hidden |
| **Flow In** | scroll enters breathing room (last 450px of checkpoint) | HUD elements slide up + fade in (CSS transition, 600ms) |
| **Active** | scroll within breathing room | HUD fully visible, stays in place |
| **Flow Out** | scroll enters next checkpoint's video phase | HUD elements slide down + fade out (CSS transition, 400ms) |
| **Post** | scroll in next checkpoint | HUD hidden |

**HUD elements per checkpoint (all cosmetic — no click handlers):**

- **StepLabel** — top-left pill badge: "1. ENTRANCE — DOORS"
- **InfoCard** — left side, white glass card: title + 2-3 sentence description of what's happening at this stage
- **Hotspots** — 2-3 golden ⊙ circles positioned over scene elements with CSS pulse animation. Purely visual — draw attention, no onClick.
- **TipPanel** — bottom-left, dark card with 💡 icon: practical travel tip
- **ProgressBar** — top center, 4 dots, current checkpoint highlighted

**Flow animations (CSS):**

```css
.hud-enter {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease-out, transform 600ms ease-out;
}
.hud-enter-active {
  opacity: 1;
  transform: translateY(0);
}
.hud-exit {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease-in, transform 400ms ease-in;
}
.hud-exit-active {
  opacity: 0;
  transform: translateY(20px);
}
```

### 4.5 Journey Complete Screen

Triggers when scroll reaches the end (frame index = 63, last breathing room ends).

- Canvas fades to black (CSS overlay)
- FLUX-generated static image fades in (character seated in cabin, thumbs up)
- Summary card slides in:
  - "Great! You've walked through the airport."
  - 4 checkpoint labels listed (static text, not dynamic)
  - "You learned:" section with 3-4 static bullet points
  - Pro tip box (💡 icon, static text)
- No "Play Again" button (no interaction model). Scroll ends here. User can scroll back up to revisit.

### 4.6 Checkpoint Configuration

```typescript
interface CheckpointConfig {
  id: number;
  label: string;           // "1. ENTRANCE — DOORS"
  title: string;           // "Airport Entrance"
  infoCard: {
    title: string;        // "Welcome to the Airport"
    body: string;          // 2-3 sentences
  };
  tip: string;             // Practical travel tip
  hotspots: {
    x: string;             // CSS % position
    y: string;
    label: string;         // Visual label (not interactive)
  }[];
  frameRange: {
    start: number;         // 0, 16, 32, 48
    end: number;           // 15, 31, 47, 63
  };
  sceneImage: string;      // Journey complete uses this if needed
}

const checkpoints: CheckpointConfig[] = [
  {
    id: 1,
    label: "1. ENTRANCE — DOORS",
    title: "Airport Entrance",
    infoCard: {
      title: "Welcome to the Airport",
      body: "You've arrived at the terminal entrance. Look for the Departures signage above the doors. Have your ID and boarding pass ready before you walk in.",
    },
    tip: "Keep your documents in an easily accessible pocket — you'll need them at every checkpoint.",
    hotspots: [
      { x: "50%", y: "45%", label: "Departures Sign" },
      { x: "30%", y: "60%", label: "Entry Doors" },
    ],
    frameRange: { start: 0, end: 15 },
    sceneImage: "/assets/scene-entrance.jpg",
  },
  // ... checkpoints 2-4 similar
];
```

---

## 5. Design Tokens

```css
:root {
  --color-bg-primary:      #0A1628;
  --color-bg-card:         rgba(10, 22, 40, 0.85);
  --color-bg-card-light:   rgba(255, 255, 255, 0.95);
  --color-accent-gold:     #F5A623;
  --color-accent-blue:     #3B82F6;
  --color-text-primary:    #FFFFFF;
  --color-text-dark:       #1A1A2E;
  --color-success:         #22C55E;
  --font-primary:          'Inter', sans-serif;
  --font-display:          'Outfit', sans-serif;
  --radius-card:           16px;
  --radius-button:         24px;
  --glass-blur:            12px;
}
```

---

## 6. Build Plan & Agent Delegation

### Phase 1: Assets (Emo + ComfyUI) — Wednesday PM

| Step | Who | Task | Output |
|------|-----|------|--------|
| 1.1 | Emo | Generate 4 FLUX keyframe images in ComfyUI (iterate on prompt for art style) | 4 PNG/JPG images |
| 1.2 | Emo | Run AnimateDiff workflow for each keyframe (16 frames, camera-forward) | 4 MP4 clips |
| 1.3 | Agent | Extract 64 frames, composite spritesheet | `spritesheet.jpg` (8×8 grid) |
| 1.4 | Emo | Generate 1 FLUX journey complete image | `journey-complete.jpg` |

### Phase 2: Web App (Hermes agents) — Wednesday night / Thursday

| Step | Who | Task | Parallel? |
|------|-----|------|-----------|
| 2.1 | Agent A | Scaffold Vite + React 19 + TS project, tokens.css, global.css | Solo — runs first |
| 2.2 | Agent B | Build scroll-canvas engine (useScrollFrame hook, ScrollCanvas component, render loop) | After 2.1 |
| 2.2 | Agent C | Build HUD overlay components (InfoCard, TipPanel, Hotspot, StepLabel, ProgressBar, HUDOverlay) | After 2.1, ✅ parallel with B |
| 2.3 | Agent D | Build JourneyComplete component + wire checkpoint config data | After 2.1, ✅ parallel with B/C |
| 2.4 | Agent A | Integration: wire all components into App.tsx, HUD phase machine, CSS flow animations | After B, C, D |

### Phase 3: Polish & Ship — Thursday night

| Step | Who | Task |
|------|-----|------|
| 3.1 | Agent | CSS transitions tuning (flow-in/out timing, easing) |
| 3.2 | Agent | Responsive adjustments (1280px, 1440px, 1920px) |
| 3.3 | Agent | README with pipeline diagram (ASCII or mermaid), clean repo structure |
| 3.4 | Emo | Deploy to Vercel, share link |

---

## 7. Out of Scope (MVP)

- ❌ User interaction / clicking / task completion
- ❌ Scroll locks or blocking
- ❌ Remotion
- ❌ CSS 2.5D parallax / HyperFrames
- ❌ Multiple airports / dynamic routing
- ❌ Mobile responsive (desktop-first)
- ❌ Accessibility / ARIA
- ❌ Backend / API
- ❌ Gamification / scores / timers
- ❌ Sound / audio
- ❌ Higgsfield API (post-MVP upgrade)
- ❌ Play Again button

---

## 8. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| AnimateDiff clips flicker / inconsistent | High — visual quality | Accept SD1.5 quality for MVP, upgrade to Higgsfield later |
| FLUX keyframe art style inconsistent across 4 scenes | Medium — visual continuity | Lock the prompt template first (style + lighting + palette), only change scene description between checkpoints |
| Canvas scroll-scrub jank on lower-end machines | Medium — UX | Only redraw on frame index change, keep canvas at 512×288 (small draw calls) |
| 36-hour timeline is tight | High — shipping | Assets Wednesday PM, web app Wednesday night + Thursday, deploy Thursday night. Buffer Friday morning. |
| Scene continuity (Approach C) doesn't work — clips look disconnected | Medium — immersion | Add a brief crossfade between clips (CSS opacity on a second canvas layer) as fallback |

---

## 9. README Structure

```markdown
# Calm Wings

Scroll-driven airport flythrough experience.

## Live Demo
[deployed URL]

## How It Works

[Pipeline diagram: ComfyUI FLUX → AnimateDiff → Spritesheet → Canvas Scroll-Scrub]

## Tech Stack
- ComfyUI + FLUX-dev (scene generation)
- AnimateDiff SD1.5 (video animation)
- React 19 + TypeScript + Vite
- Canvas 2D API (scroll-scrubbed frame renderer)
- Vanilla CSS (HUD overlay + flow animations)

## Run Locally
npm install && npm run dev
```
