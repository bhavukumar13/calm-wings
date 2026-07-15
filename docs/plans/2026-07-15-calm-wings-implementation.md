# Calm Wings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a scroll-driven airport flythrough experience using AI-generated video frames composited into a spritesheet, rendered on a canvas with scroll-scrubbing, with cosmetic HUD overlays.

**Architecture:** Google Flow (Veo 3.1) generated 4 flythrough video clips + 5 keyframe images + 1 journey complete image. A Python/ffmpeg script extracts 64 frames from the 4 clips into an 8×8 spritesheet. A React 19 + Vite web app loads the spritesheet onto a canvas, maps scroll position to frame index, and overlays cosmetic HUD components (info cards, tips, hotspots) that flow in/out via CSS transitions at each checkpoint.

**Tech Stack:** React 19, TypeScript, Vite, Canvas 2D API, Vanilla CSS, ffmpeg, Python PIL/Pillow

## Global Constraints

- Project root: `G:\.shortcut-targets-by-id\1aBPs7hhQpl1bzyOnxaK6OgY8GGAPPIU2\Vibe To Viable\`
- Assets folder: `G:\.shortcut-targets-by-id\1aBPs7hhQpl1bzyOnxaK6OgY8GGAPPIU2\Vibe To Viable\assets\`
- React 19.2.7, react-dom 19.2.7
- Vite 6.x, TypeScript 5.5+
- No Remotion, no CSS 2.5D, no HyperFrames
- No user interaction — pure scroll storytelling
- Desktop-only (1280px+ viewports)
- Design tokens (from spec):
  - `--color-bg-primary: #0A1628`
  - `--color-bg-card: rgba(10, 22, 40, 0.85)`
  - `--color-bg-card-light: rgba(255, 255, 255, 0.95)`
  - `--color-accent-gold: #F5A623`
  - `--color-accent-blue: #3B82F6`
  - `--color-text-primary: #FFFFFF`
  - `--color-text-dark: #1A1A2E`
  - `--color-success: #22C55E`
  - `--font-primary: 'Inter', sans-serif`
  - `--font-display: 'Outfit', sans-serif`
  - `--radius-card: 16px`
  - `--glass-blur: 12px`
- Scroll constants:
  - `TOTAL_FRAMES = 64` (4 clips × 16 frames)
  - `FRAMES_PER_CLIP = 16`
  - `SCROLL_PER_CHECKPOINT = 1250px`
  - `VIDEO_SCROLL = 800px` (scroll distance where video plays)
  - `BREATHING_SCROLL = 450px` (scroll distance where HUD is visible, video paused)
  - `TOTAL_SCROLL = 5000px`

---

## File Structure

```
Vibe To Viable/
├── assets/                          ← Phase 0 output (already exists)
│   ├── Airport_terminal_entrance_first_…_202607151808.jpeg
│   ├── Airport_check-in_area_first_person_202607151808.jpeg
│   ├── Airport_security_screening_area_…_202607151808.jpeg
│   ├── Airport_boarding_gate_first_person_202607151808.jpeg
│   ├── Jet_bridge_interior_first_person_202607151808.jpeg
│   ├── Young_traveler_giving_thumbs_up_202607151808.jpeg
│   ├── Camera_moves_through_airport_ter…_202607151808.mp4
│   ├── Camera_moves_toward_security_scr…_202607151808.mp4
│   ├── Camera_moves_toward_boarding_gate_202607151808.mp4
│   └── Camera_moves_through_jet_bridge_202607151808.mp4
├── src/
│   ├── assets/
│   │   ├── spritesheet.jpg           ← Task 1 output
│   │   └── journey-complete.jpg      ← Task 1 output (copy from assets/)
│   ├── components/
│   │   ├── ScrollCanvas.tsx          ← Task 3
│   │   ├── HUDOverlay.tsx            ← Task 4
│   │   ├── JourneyComplete.tsx       ← Task 5
│   │   └── hud/
│   │       ├── InfoCard.tsx          ← Task 4
│   │       ├── TipPanel.tsx          ← Task 4
│   │       ├── Hotspot.tsx           ← Task 4
│   │       ├── StepLabel.tsx         ← Task 4
│   │       └── ProgressBar.tsx       ← Task 4
│   ├── hooks/
│   │   ├── useScrollFrame.ts         ← Task 3
│   │   └── useCheckpointPhase.ts     ← Task 3
│   ├── data/
│   │   └── checkpointConfig.ts       ← Task 4
│   ├── types/
│   │   └── simulation.ts            ← Task 2
│   ├── styles/
│   │   ├── tokens.css               ← Task 2
│   │   ├── global.css               ← Task 2
│   │   ├── canvas.css               ← Task 3
│   │   └── hud.css                  ← Task 4
│   ├── App.tsx                      ← Task 6
│   ├── main.tsx                     ← Task 2
│   └── vite-env.d.ts                ← Task 2
├── index.html                       ← Task 2
├── package.json                     ← already exists
├── tsconfig.json                    ← Task 2
├── vite.config.ts                   ← Task 2
├── .gitignore                       ← Task 2
├── README.md                        ← Task 7
├── brief.md                         ← already exists
├── timeline.md                      ← already exists
├── user journey.md                  ← already exists
├── docs/
│   ├── specs/
│   │   └── 2026-07-15-calm-wings-design.md
│   └── guides/
│       └── google-flow-asset-generation.md
└── ref image/
    └── (17 reference mockups)
```

---

## Task 1: Frame Extraction & Spritesheet Generation

> **Provider:** Kimi (kimi2.5)
> **Persona:** Backend engineer (ffmpeg, Python)
> **Complexity:** Low
> **Depends on:** Phase 0 assets (complete)

**Files:**
- Create: `scripts/generate-spritesheet.py`
- Create: `src/assets/spritesheet.jpg`
- Create: `src/assets/journey-complete.jpg`
- Read: `assets/*.mp4`, `assets/Young_traveler_giving_thumbs_up*.jpeg`

**Interfaces:**
- Consumes: 4 MP4 files from `assets/` folder
- Produces: `src/assets/spritesheet.jpg` (8×8 grid, 512×288 per frame, 4096×2304 total, JPEG quality 85) and `src/assets/journey-complete.jpg` (copy of the journey complete image)

- [ ] **Step 1: Verify ffmpeg is available**

Run: `ffmpeg -version`
Expected: Version string printed. If not available, install via `winget install ffmpeg` or download from https://ffmpeg.org.

- [ ] **Step 2: Install Python Pillow**

Run: `pip install Pillow`
Expected: Successfully installed (or already satisfied).

- [ ] **Step 3: Write the spritesheet generation script**

```python
#!/usr/bin/env python3
"""
Calm Wings — Spritesheet Generator
Extracts 16 frames from each of 4 video clips and composites them into an 8×8 spritesheet.
"""

import os
import subprocess
import sys
from PIL import Image

# Configuration
ASSETS_DIR = os.path.join(os.path.dirname(__file__), "..", "assets")
SRC_ASSETS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "assets")
FRAMES_PER_CLIP = 16
FRAME_W = 512
FRAME_H = 288
GRID_COLS = 8
GRID_ROWS = 8
JPEG_QUALITY = 85

# Video files in order (entrance → check-in → security → boarding)
VIDEO_FILES = [
    "Camera_moves_through_airport_ter",  # clip 1: entrance → check-in
    "Camera_moves_toward_security_scr",  # clip 2: check-in → security
    "Camera_moves_toward_boarding_gate", # clip 3: security → boarding
    "Camera_moves_through_jet_bridge",   # clip 4: boarding → jet bridge
]

# Journey complete image
JOURNEY_COMPLETE_GLOB = "Young_traveler_giving_thumbs_up"

def find_video_files():
    """Find actual video files by prefix matching (handles truncated filenames)."""
    all_files = os.listdir(ASSETS_DIR)
    video_paths = []
    for prefix in VIDEO_FILES:
        matches = [f for f in all_files if f.startswith(prefix) and f.endswith(".mp4")]
        if not matches:
            print(f"ERROR: No video file starting with '{prefix}' found in {ASSETS_DIR}")
            sys.exit(1)
        video_paths.append(os.path.join(ASSETS_DIR, matches[0]))
    return video_paths

def find_journey_complete():
    """Find the journey complete image."""
    all_files = os.listdir(ASSETS_DIR)
    matches = [f for f in all_files if f.startswith(JOURNEY_COMPLETE_GLOB) and f.endswith((".jpeg", ".jpg"))]
    if not matches:
        print(f"ERROR: No journey complete image found starting with '{JOURNEY_COMPLETE_GLOB}'")
        sys.exit(1)
    return os.path.join(ASSETS_DIR, matches[0])

def extract_frames(video_path, clip_index, temp_dir):
    """Extract 16 evenly-spaced frames from a video using ffmpeg."""
    # Get video duration
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", video_path],
        capture_output=True, text=True
    )
    duration = float(result.stdout.strip())
    print(f"  Clip {clip_index+1}: {os.path.basename(video_path)} — {duration:.2f}s")

    frames = []
    for frame_idx in range(FRAMES_PER_CLIP):
        # Calculate timestamp for this frame
        timestamp = (duration * frame_idx) / FRAMES_PER_CLIP

        # Extract frame at timestamp
        output_path = os.path.join(temp_dir, f"clip{clip_index}_frame{frame_idx:03d}.jpg")
        subprocess.run([
            "ffmpeg", "-y", "-ss", str(timestamp),
            "-i", video_path,
            "-frames:v", "1",
            "-vf", f"scale={FRAME_W}:{FRAME_H}",
            "-q:v", "2",
            output_path
        ], capture_output=True, check=True)
        frames.append(output_path)

    return frames

def build_spritesheet(all_frames, output_path):
    """Composite all frames into an 8×8 spritesheet."""
    sheet = Image.new("RGB", (GRID_COLS * FRAME_W, GRID_ROWS * FRAME_H), (0, 0, 0))

    for i, frame_path in enumerate(all_frames):
        row = i // GRID_COLS
        col = i % GRID_COLS
        x = col * FRAME_W
        y = row * FRAME_H

        frame = Image.open(frame_path)
        frame = frame.resize((FRAME_W, FRAME_H), Image.LANCZOS)
        sheet.paste(frame, (x, y))
        print(f"  Placed frame {i} at row={row}, col={col}")

    sheet.save(output_path, "JPEG", quality=JPEG_QUALITY)
    print(f"\nSpritesheet saved: {output_path}")
    print(f"Size: {sheet.size[0]}×{sheet.size[1]}")

def copy_journey_complete(source_path, dest_path):
    """Copy and resize the journey complete image."""
    img = Image.open(source_path)
    # Keep original size but ensure it's JPEG
    img.save(dest_path, "JPEG", quality=90)
    print(f"Journey complete image copied: {dest_path}")

def main():
    print("=== Calm Wings Spritesheet Generator ===\n")

    # Find files
    video_paths = find_video_files()
    journey_complete_path = find_journey_complete()

    # Create output directory
    os.makedirs(SRC_ASSETS_DIR, exist_ok=True)

    # Create temp directory for individual frames
    temp_dir = os.path.join(os.path.dirname(__file__), "..", "tmp_frames")
    os.makedirs(temp_dir, exist_ok=True)

    # Extract frames from all clips
    all_frames = []
    for clip_idx, video_path in enumerate(video_paths):
        print(f"\nExtracting frames from clip {clip_idx+1}...")
        frames = extract_frames(video_path, clip_idx, temp_dir)
        all_frames.extend(frames)

    print(f"\nTotal frames extracted: {len(all_frames)}")

    # Build spritesheet
    print("\nBuilding spritesheet...")
    spritesheet_path = os.path.join(SRC_ASSETS_DIR, "spritesheet.jpg")
    build_spritesheet(all_frames, spritesheet_path)

    # Copy journey complete image
    print("\nCopying journey complete image...")
    journey_dest = os.path.join(SRC_ASSETS_DIR, "journey-complete.jpg")
    copy_journey_complete(journey_complete_path, journey_dest)

    # Cleanup temp frames
    import shutil
    shutil.rmtree(temp_dir)
    print("\nTemp frames cleaned up.")

    print("\n=== Done! Assets ready for web app. ===")

if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run the spritesheet generation script**

Run: `python scripts/generate-spritesheet.py`
Expected: Output showing 64 frames extracted, spritesheet saved to `src/assets/spritesheet.jpg`, journey complete image copied.

- [ ] **Step 5: Verify outputs exist**

Run: `ls -la src/assets/spritesheet.jpg src/assets/journey-complete.jpg`
Expected: Both files exist. Spritesheet should be ~500KB-2MB.

- [ ] **Step 6: Commit**

```bash
cd "G:/.shortcut-targets-by-id/1aBPs7hhQpl1bzyOnxaK6OgY8GGAPPIU2/Vibe To Viable"
git add scripts/generate-spritesheet.py src/assets/
git commit -m "feat: generate spritesheet from Flow video assets"
```

---

## Task 2: Project Scaffold

> **Provider:** OpenRouter (qwen3.6-plus)
> **Persona:** Frontend architect
> **Complexity:** Medium
> **Depends on:** Task 1 (needs src/assets/ to exist for imports)

**Files:**
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/vite-env.d.ts`
- Create: `src/types/simulation.ts`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `.gitignore`

**Interfaces:**
- Consumes: `package.json` (already exists)
- Produces:
  - `CheckpointConfig` interface in `src/types/simulation.ts`
  - `HudPhase` type in `src/types/simulation.ts`
  - `HotspotConfig` interface in `src/types/simulation.ts`
  - Design tokens in `src/styles/tokens.css`
  - Working `npm run dev` with blank page (no errors)

- [ ] **Step 1: Install dependencies**

Run: `npm install`
Expected: node_modules created, no errors.

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet" />
    <title>Calm Wings — Airport Flythrough</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 7: Create src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 8: Create src/types/simulation.ts**

```typescript
/** A single clickable hotspot overlaid on the scene (cosmetic only — no click handler) */
export interface HotspotConfig {
  id: string;
  label: string;
  position: { x: string; y: string }; // CSS percentage positions
}

/** Defines a single checkpoint in the simulation */
export interface CheckpointConfig {
  id: number;
  label: string;           // e.g. "1. ENTRANCE — DOORS"
  title: string;           // e.g. "Airport Entrance"
  infoCard: {
    title: string;         // e.g. "Welcome to the Airport"
    body: string;          // 2-3 sentences
  };
  tip: string;             // Practical travel tip
  hotspots: HotspotConfig[];
  frameRange: {
    start: number;         // 0, 16, 32, 48
    end: number;           // 15, 31, 47, 63
  };
}

/** HUD phase — determines visibility and animation state of overlay elements */
export type HudPhase = 'pre' | 'flow-in' | 'active' | 'flow-out' | 'post';

/** Scroll state passed around the app */
export interface ScrollState {
  scrollY: number;
  frameIndex: number;
  activeCheckpoint: number;     // 0-3
  hudPhase: HudPhase;
}
```

- [ ] **Step 9: Create src/styles/tokens.css**

```css
:root {
  /* Colors */
  --color-bg-primary: #0A1628;
  --color-bg-card: rgba(10, 22, 40, 0.85);
  --color-bg-card-light: rgba(255, 255, 255, 0.95);
  --color-accent-gold: #F5A623;
  --color-accent-blue: #3B82F6;
  --color-text-primary: #FFFFFF;
  --color-text-dark: #1A1A2E;
  --color-text-secondary: rgba(255, 255, 255, 0.7);
  --color-success: #22C55E;
  --color-danger: #EF4444;
  --color-boarding: #F59E0B;

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-display: 'Outfit', sans-serif;

  /* Spacing */
  --radius-card: 16px;
  --radius-button: 24px;
  --radius-pill: 999px;
  --glass-blur: 12px;

  /* Scroll constants */
  --total-frames: 64;
  --frames-per-clip: 16;
  --scroll-per-checkpoint: 1250px;
  --video-scroll: 800px;
  --breathing-scroll: 450px;
  --total-scroll: 5000px;

  /* HUD animation */
  --hud-enter-duration: 600ms;
  --hud-exit-duration: 400ms;
  --hud-easing: ease-out;
}
```

- [ ] **Step 10: Create src/styles/global.css**

```css
@import './tokens.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow-x: hidden;
}

body {
  font-family: var(--font-primary);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  position: relative;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-primary);
}

::-webkit-scrollbar-thumb {
  background: rgba(245, 166, 35, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 166, 35, 0.5);
}
```

- [ ] **Step 11: Create .gitignore**

```
node_modules/
dist/
tmp_frames/
*.local
.DS_Store
desktop.ini
```

- [ ] **Step 12: Create placeholder App.tsx**

```typescript
export default function App() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent-gold)' }}>
        Calm Wings — Scaffold Ready
      </h1>
    </div>
  );
}
```

- [ ] **Step 13: Verify dev server runs**

Run: `npm run dev`
Expected: Vite dev server starts on http://localhost:3000, page shows "Calm Wings — Scaffold Ready" in gold text.

- [ ] **Step 14: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React 19 + TypeScript project with design tokens"
```

---

## Task 3: Canvas Scroll-Scrub Engine

> **Provider:** NVIDIA (GLM-5.2)
> **Persona:** Senior graphics engineer
> **Complexity:** High
> **Depends on:** Task 2 (needs scaffold, types, tokens)

**Files:**
- Create: `src/hooks/useScrollFrame.ts`
- Create: `src/hooks/useCheckpointPhase.ts`
- Create: `src/components/ScrollCanvas.tsx`
- Create: `src/styles/canvas.css`

**Interfaces:**
- Consumes: `ScrollState`, `HudPhase` from `src/types/simulation.ts`, CSS tokens from `src/styles/tokens.css`, `src/assets/spritesheet.jpg`
- Produces:
  - `useScrollFrame()` hook → returns `{ scrollY, frameIndex }`
  - `useCheckpointPhase(frameIndex)` hook → returns `{ activeCheckpoint, hudPhase }`
  - `<ScrollCanvas frameIndex={number} />` component

- [ ] **Step 1: Create src/hooks/useScrollFrame.ts**

```typescript
import { useEffect, useState } from 'react';

const FRAMES_PER_CLIP = 16;
const SCROLL_PER_CHECKPOINT = 1250;
const VIDEO_SCROLL = 800;
const TOTAL_SCROLL = 5000;

/**
 * Maps scroll position to a frame index (0-63).
 * Each checkpoint gets 1250px of scroll:
 *   - First 800px: video plays (frames 0-15 within clip)
 *   - Last 450px: breathing room (video paused on last frame, HUD visible)
 */
function scrollToFrame(scrollY: number): number {
  const clampedScroll = Math.max(0, Math.min(scrollY, TOTAL_SCROLL));
  const checkpoint = Math.floor(clampedScroll / SCROLL_PER_CHECKPOINT);
  const localScroll = clampedScroll % SCROLL_PER_CHECKPOINT;

  if (localScroll < VIDEO_SCROLL) {
    const frameInClip = Math.floor((localScroll / VIDEO_SCROLL) * FRAMES_PER_CLIP);
    return checkpoint * FRAMES_PER_CLIP + Math.min(frameInClip, FRAMES_PER_CLIP - 1);
  } else {
    return checkpoint * FRAMES_PER_CLIP + FRAMES_PER_CLIP - 1;
  }
}

export function useScrollFrame() {
  const [scrollY, setScrollY] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrollY(y);
          setFrameIndex(scrollToFrame(y));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY, frameIndex };
}
```

- [ ] **Step 2: Create src/hooks/useCheckpointPhase.ts**

```typescript
import type { HudPhase } from '../types/simulation';

const FRAMES_PER_CLIP = 16;
const SCROLL_PER_CHECKPOINT = 1250;
const VIDEO_SCROLL = 800;
const TOTAL_SCROLL = 5000;

/**
 * Determines which checkpoint is active and what HUD phase we're in
 * based on scroll position.
 */
export function useCheckpointPhase(scrollY: number): {
  activeCheckpoint: number;
  hudPhase: HudPhase;
} {
  const clampedScroll = Math.max(0, Math.min(scrollY, TOTAL_SCROLL));
  const checkpoint = Math.floor(clampedScroll / SCROLL_PER_CHECKPOINT);
  const localScroll = clampedScroll % SCROLL_PER_CHECKPOINT;

  // HUD is visible during breathing room (last 450px of each checkpoint)
  const isBreathingRoom = localScroll >= VIDEO_SCROLL;

  // Check if we're at the very start of breathing room (flow-in)
  const breathingProgress = localScroll - VIDEO_SCROLL;
  const FLOW_IN_THRESHOLD = 50;  // first 50px of breathing room = flow-in
  const FLOW_OUT_START = 400;    // last 50px of breathing room = flow-out

  let hudPhase: HudPhase = 'pre';

  if (isBreathingRoom) {
    if (breathingProgress < FLOW_IN_THRESHOLD) {
      hudPhase = 'flow-in';
    } else if (breathingProgress > FLOW_OUT_START) {
      hudPhase = 'flow-out';
    } else {
      hudPhase = 'active';
    }
  } else {
    // Not in breathing room — check if we just left the previous one
    hudPhase = localScroll < 100 && checkpoint > 0 ? 'flow-out' : 'pre';
  }

  return { activeCheckpoint: checkpoint, hudPhase };
}
```

- [ ] **Step 3: Create src/styles/canvas.css**

```css
.canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  background-color: var(--color-bg-primary);
}

.canvas-container canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Scroll spacer — creates the scrollable height */
.scroll-spacer {
  width: 100%;
  height: 5000px;
  pointer-events: none;
}
```

- [ ] **Step 4: Create src/components/ScrollCanvas.tsx**

```typescript
import { useEffect, useRef } from 'react';
import '../styles/canvas.css';

interface ScrollCanvasProps {
  frameIndex: number;
}

const FRAME_W = 512;
const FRAME_H = 288;
const GRID_COLS = 8;

export default function ScrollCanvas({ frameIndex }: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const lastFrameRef = useRef<number>(-1);

  // Load spritesheet
  useEffect(() => {
    const img = new Image();
    img.src = new URL('../assets/spritesheet.jpg', import.meta.url).href;
    img.onload = () => {
      imageRef.current = img;
      // Force a draw once loaded
      drawFrame(frameIndex);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw frame when frameIndex changes
  useEffect(() => {
    drawFrame(frameIndex);
  }, [frameIndex]);

  function drawFrame(idx: number) {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    // Only redraw if frame actually changed
    if (idx === lastFrameRef.current) return;
    lastFrameRef.current = idx;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const col = idx % GRID_COLS;
    const row = Math.floor(idx / GRID_COLS);

    // Set canvas resolution to match display
    const dpr = window.devicePixelRatio || 1;
    const displayW = window.innerWidth;
    const displayH = window.innerHeight;

    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;

    ctx.scale(dpr, dpr);

    // Clear and draw
    ctx.fillStyle = '#0A1628';
    ctx.fillRect(0, 0, displayW, displayH);

    // Calculate cover dimensions (like object-fit: cover)
    const imgAspect = FRAME_W / FRAME_H;
    const canvasAspect = displayW / displayH;
    let drawW, drawH, drawX, drawY;

    if (imgAspect > canvasAspect) {
      // Image is wider — fit height, crop width
      drawH = displayH;
      drawW = drawH * imgAspect;
      drawX = (displayW - drawW) / 2;
      drawY = 0;
    } else {
      // Image is taller — fit width, crop height
      drawW = displayW;
      drawH = drawW / imgAspect;
      drawX = 0;
      drawY = (displayH - drawH) / 2;
    }

    ctx.drawImage(
      img,
      col * FRAME_W, row * FRAME_H, FRAME_W, FRAME_H,  // source
      drawX, drawY, drawW, drawH                         // dest (cover fit)
    );
  }

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        lastFrameRef.current = -1; // Force redraw
        drawFrame(frameIndex);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameIndex]);

  return (
    <>
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
      <div className="scroll-spacer" />
    </>
  );
}
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors (may need to create a placeholder spritesheet.jpg in src/assets/ for the import to resolve — use any 4096×2304 JPEG or the one from Task 1).

- [ ] **Step 6: Commit**

```bash
git add src/hooks/ src/components/ScrollCanvas.tsx src/styles/canvas.css
git commit -m "feat: canvas scroll-scrub engine with frame-accurate rendering"
```

---

## Task 4: HUD Overlay Components

> **Provider:** OpenRouter (qwen3.6-plus)
> **Persona:** UI engineer
> **Complexity:** Medium
> **Depends on:** Task 2 (needs scaffold, types, tokens)

**Files:**
- Create: `src/components/hud/InfoCard.tsx`
- Create: `src/components/hud/TipPanel.tsx`
- Create: `src/components/hud/Hotspot.tsx`
- Create: `src/components/hud/StepLabel.tsx`
- Create: `src/components/hud/ProgressBar.tsx`
- Create: `src/components/HUDOverlay.tsx`
- Create: `src/data/checkpointConfig.ts`
- Create: `src/styles/hud.css`

**Interfaces:**
- Consumes: `CheckpointConfig`, `HudPhase` from `src/types/simulation.ts`
- Produces:
  - `<HUDOverlay checkpoint={CheckpointConfig} phase={HudPhase} />` component
  - `checkpoints` array in `src/data/checkpointConfig.ts`

- [ ] **Step 1: Create src/data/checkpointConfig.ts**

```typescript
import type { CheckpointConfig } from '../types/simulation';

export const checkpoints: CheckpointConfig[] = [
  {
    id: 1,
    label: '1. ENTRANCE — DOORS',
    title: 'Airport Entrance',
    infoCard: {
      title: 'Welcome to the Airport',
      body: "You've arrived at the terminal entrance. Look for the Departures signage above the doors. Have your ID and boarding pass ready before you walk in.",
    },
    tip: 'Keep your documents in an easily accessible pocket — you\'ll need them at every checkpoint.',
    hotspots: [
      { id: 'h1-1', label: 'Departures Sign', position: { x: '50%', y: '20%' } },
      { id: 'h1-2', label: 'Entry Doors', position: { x: '50%', y: '55%' } },
    ],
    frameRange: { start: 0, end: 15 },
  },
  {
    id: 2,
    label: '2. CHECK-IN COUNTER',
    title: 'Check-in & Baggage Drop',
    infoCard: {
      title: 'Check-in Counter',
      body: 'Present your ID and booking reference at the airline counter. The agent will verify your documents, check your luggage, and issue your boarding pass. Keep your boarding pass safe — you\'ll need it at every subsequent checkpoint.',
    },
    tip: 'Weigh your luggage at home. Excess baggage fees are expensive and can slow you down.',
    hotspots: [
      { id: 'h2-1', label: 'Check-in Counter', position: { x: '50%', y: '45%' } },
      { id: 'h2-2', label: 'FIDS Board', position: { x: '50%', y: '15%' } },
    ],
    frameRange: { start: 16, end: 31 },
  },
  {
    id: 3,
    label: '3. SECURITY CHECK',
    title: 'Security Screening',
    infoCard: {
      title: 'Security Screening',
      body: 'Place your electronics (laptop, power bank, charger) and liquids in a tray. Remove your belt and jacket if asked. Walk through the metal detector. Collect your belongings from the X-ray belt on the other side.',
    },
    tip: 'Wear easy-to-remove shoes. Keep liquids in a clear zip-lock bag — 100ml max per item.',
    hotspots: [
      { id: 'h3-1', label: 'X-ray Belt', position: { x: '35%', y: '50%' } },
      { id: 'h3-2', label: 'Metal Detector', position: { x: '60%', y: '40%' } },
      { id: 'h3-3', label: 'Tray Area', position: { x: '25%', y: '65%' } },
    ],
    frameRange: { start: 32, end: 47 },
  },
  {
    id: 4,
    label: '4. BOARDING GATE',
    title: 'Boarding & Jet Bridge',
    infoCard: {
      title: 'Boarding Gate',
      body: 'Check the FIDS screen for your gate number and flight status. When boarding is announced, join the queue for your group. Present your boarding pass at the gate. Walk through the jet bridge to the aircraft door. Find your seat, stow your luggage, and fasten your seatbelt.',
    },
    tip: 'Check the FIDS screen regularly — gates can change at the last minute. Listen for announcements.',
    hotspots: [
      { id: 'h4-1', label: 'FIDS Screen', position: { x: '40%', y: '25%' } },
      { id: 'h4-2', label: 'Jet Bridge', position: { x: '55%', y: '55%' } },
    ],
    frameRange: { start: 48, end: 63 },
  },
];
```

- [ ] **Step 2: Create src/components/hud/StepLabel.tsx**

```tsx
import '../../styles/hud.css';

interface StepLabelProps {
  label: string;
}

export default function StepLabel({ label }: StepLabelProps) {
  return (
    <div className="step-label">
      {label}
    </div>
  );
}
```

- [ ] **Step 3: Create src/components/hud/InfoCard.tsx**

```tsx
import '../../styles/hud.css';

interface InfoCardProps {
  title: string;
  body: string;
}

export default function InfoCard({ title, body }: InfoCardProps) {
  return (
    <div className="info-card">
      <div className="info-card__icon">ℹ</div>
      <div className="info-card__content">
        <h3 className="info-card__title">{title}</h3>
        <p className="info-card__body">{body}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create src/components/hud/TipPanel.tsx**

```tsx
import '../../styles/hud.css';

interface TipPanelProps {
  tip: string;
}

export default function TipPanel({ tip }: TipPanelProps) {
  return (
    <div className="tip-panel">
      <span className="tip-panel__icon">💡</span>
      <span className="tip-panel__text">{tip}</span>
    </div>
  );
}
```

- [ ] **Step 5: Create src/components/hud/Hotspot.tsx**

```tsx
import '../../styles/hud.css';

interface HotspotProps {
  label: string;
  x: string;
  y: string;
}

export default function Hotspot({ label, x, y }: HotspotProps) {
  return (
    <div className="hotspot" style={{ left: x, top: y }}>
      <div className="hotspot__pulse" />
      <div className="hotspot__dot" />
      <span className="hotspot__label">{label}</span>
    </div>
  );
}
```

- [ ] **Step 6: Create src/components/hud/ProgressBar.tsx**

```tsx
import '../../styles/hud.css';

interface ProgressBarProps {
  activeCheckpoint: number;
  total: number;
}

export default function ProgressBar({ activeCheckpoint, total }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`progress-bar__dot ${i === activeCheckpoint ? 'active' : ''} ${i < activeCheckpoint ? 'done' : ''}`}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Create src/components/HUDOverlay.tsx**

```tsx
import type { CheckpointConfig, HudPhase } from '../types/simulation';
import StepLabel from './hud/StepLabel';
import InfoCard from './hud/InfoCard';
import TipPanel from './hud/TipPanel';
import Hotspot from './hud/Hotspot';
import ProgressBar from './hud/ProgressBar';
import '../styles/hud.css';

interface HUDOverlayProps {
  checkpoint: CheckpointConfig;
  phase: HudPhase;
  activeCheckpoint: number;
  totalCheckpoints: number;
}

export default function HUDOverlay({
  checkpoint,
  phase,
  activeCheckpoint,
  totalCheckpoints,
}: HUDOverlayProps) {
  const visible = phase === 'active' || phase === 'flow-in' || phase === 'flow-out';
  const animationClass =
    phase === 'flow-in' ? 'hud-enter' :
    phase === 'flow-out' ? 'hud-exit' :
    phase === 'active' ? 'hud-enter-active' :
    '';

  if (!visible) return null;

  return (
    <div className={`hud-overlay ${animationClass}`}>
      <ProgressBar activeCheckpoint={activeCheckpoint} total={totalCheckpoints} />
      <StepLabel label={checkpoint.label} />
      <div className="hud-overlay__left">
        <InfoCard title={checkpoint.infoCard.title} body={checkpoint.infoCard.body} />
        <TipPanel tip={checkpoint.tip} />
      </div>
      <div className="hud-overlay__hotspots">
        {checkpoint.hotspots.map((h) => (
          <Hotspot key={h.id} label={h.label} x={h.position.x} y={h.position.y} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Create src/styles/hud.css**

```css
/* === HUD Overlay Container === */
.hud-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
}

/* === Flow Animations === */
.hud-enter {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--hud-enter-duration) var(--hud-easing),
              transform var(--hud-enter-duration) var(--hud-easing);
}

.hud-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--hud-enter-duration) var(--hud-easing),
              transform var(--hud-enter-duration) var(--hud-easing);
}

.hud-exit {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--hud-exit-duration) ease-in,
              transform var(--hud-exit-duration) ease-in;
}

/* Apply exit animation to children */
.hud-exit .hud-overlay__left,
.hud-exit .step-label,
.hud-exit .progress-bar,
.hud-exit .hud-overlay__hotspots {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--hud-exit-duration) ease-in,
              transform var(--hud-exit-duration) ease-in;
}

/* === Step Label === */
.step-label {
  position: absolute;
  top: 24px;
  left: 24px;
  background: var(--color-bg-card);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  color: var(--color-text-primary);
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.05em;
  border: 1px solid rgba(245, 166, 35, 0.3);
}

/* === Progress Bar === */
.progress-bar {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  padding: 8px 16px;
  background: var(--color-bg-card);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-bar__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: background 300ms ease, transform 300ms ease;
}

.progress-bar__dot.active {
  background: var(--color-accent-gold);
  transform: scale(1.4);
  box-shadow: 0 0 8px var(--color-accent-gold);
}

.progress-bar__dot.done {
  background: var(--color-success);
}

/* === Info Card === */
.hud-overlay__left {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 360px;
}

.info-card {
  display: flex;
  gap: 12px;
  background: var(--color-bg-card-light);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.info-card__icon {
  font-size: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-blue);
  color: white;
  border-radius: 50%;
  flex-shrink: 0;
}

.info-card__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin-bottom: 8px;
}

.info-card__body {
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-dark);
  opacity: 0.85;
}

/* === Tip Panel === */
.tip-panel {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--color-bg-card);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-radius: var(--radius-card);
  padding: 16px 20px;
  border: 1px solid rgba(245, 166, 35, 0.2);
}

.tip-panel__icon {
  font-size: 18px;
  flex-shrink: 0;
}

.tip-panel__text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

/* === Hotspots === */
.hud-overlay__hotspots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
}

.hotspot__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-accent-gold);
  box-shadow: 0 0 12px var(--color-accent-gold);
}

.hotspot__pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--color-accent-gold);
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    width: 16px;
    height: 16px;
    opacity: 1;
  }
  100% {
    width: 48px;
    height: 48px;
    opacity: 0;
  }
}

.hotspot__label {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-accent-gold);
  background: var(--color-bg-card);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(245, 166, 35, 0.3);
}
```

- [ ] **Step 9: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add src/components/ src/data/ src/styles/hud.css
git commit -m "feat: HUD overlay components with flow-in/out animations and checkpoint config"
```

---

## Task 5: Journey Complete Screen

> **Provider:** Kimi (kimi2.5)
> **Persona:** Junior frontend
> **Complexity:** Low
> **Depends on:** Task 2 (needs scaffold, tokens)

**Files:**
- Create: `src/components/JourneyComplete.tsx`
- Modify: `src/styles/hud.css` (add journey complete styles at the bottom)

**Interfaces:**
- Consumes: CSS tokens from `src/styles/tokens.css`, `src/assets/journey-complete.jpg`
- Produces: `<JourneyComplete visible={boolean} />` component

- [ ] **Step 1: Create src/components/JourneyComplete.tsx**

```tsx
import '../styles/hud.css';

interface JourneyCompleteProps {
  visible: boolean;
}

const checkpointLabels = [
  'Airport Entrance',
  'Check-in & Baggage Drop',
  'Security Screening',
  'Boarding & Jet Bridge',
];

const learnings = [
  'How to navigate from terminal entrance to boarding gate',
  'What documents to keep ready at each checkpoint',
  'How security screening works — tray, scanner, collection',
  'How to find your gate using the FIDS display',
];

const proTip = 'Arrive at least 2 hours before domestic flights and 3 hours before international flights. The earlier you arrive, the less stressful every checkpoint feels.';

export default function JourneyComplete({ visible }: JourneyCompleteProps) {
  if (!visible) return null;

  return (
    <div className="journey-complete">
      <div className="journey-complete__overlay" />
      <div className="journey-complete__content">
        <div className="journey-complete__image">
          <img src={new URL('../assets/journey-complete.jpg', import.meta.url).href} alt="Seated in aircraft cabin" />
        </div>
        <div className="journey-complete__card">
          <div className="journey-complete__badge">🎉 JOURNEY COMPLETE</div>
          <h2 className="journey-complete__title">Great! You've walked through the airport.</h2>

          <div className="journey-complete__steps">
            {checkpointLabels.map((label, i) => (
              <div key={i} className="journey-complete__step">
                <span className="journey-complete__step-num">{i + 1}</span>
                <span className="journey-complete__step-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="journey-complete__learnings">
            <h3>You learned:</h3>
            <ul>
              {learnings.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="journey-complete__tip">
            <span className="journey-complete__tip-icon">💡</span>
            <span>{proTip}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add journey complete styles to src/styles/hud.css**

Append to the end of `src/styles/hud.css`:

```css
/* === Journey Complete === */
.journey-complete {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.journey-complete__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-bg-primary);
  animation: fadeIn 800ms ease-out;
}

.journey-complete__content {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 40px;
  max-width: 1200px;
  width: 100%;
  padding: 40px;
  animation: slideUp 800ms ease-out 200ms both;
}

.journey-complete__image {
  flex: 0 0 40%;
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.journey-complete__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.journey-complete__card {
  flex: 1;
  background: var(--color-bg-card-light);
  border-radius: var(--radius-card);
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.journey-complete__badge {
  display: inline-block;
  background: var(--color-success);
  color: white;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.journey-complete__title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin-bottom: 24px;
}

.journey-complete__steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.journey-complete__step {
  display: flex;
  align-items: center;
  gap: 12px;
}

.journey-complete__step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-accent-gold);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.journey-complete__step-label {
  font-size: 14px;
  color: var(--color-text-dark);
}

.journey-complete__learnings {
  margin-bottom: 20px;
}

.journey-complete__learnings h3 {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--color-text-dark);
  margin-bottom: 8px;
}

.journey-complete__learnings ul {
  list-style: none;
  padding: 0;
}

.journey-complete__learnings li {
  font-size: 13px;
  color: var(--color-text-dark);
  opacity: 0.8;
  padding: 4px 0;
  padding-left: 20px;
  position: relative;
}

.journey-complete__learnings li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
  font-weight: 700;
}

.journey-complete__tip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(245, 166, 35, 0.1);
  border: 1px solid rgba(245, 166, 35, 0.3);
  border-radius: var(--radius-card);
  padding: 16px;
}

.journey-complete__tip-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.journey-complete__tip span:last-child {
  font-size: 13px;
  color: var(--color-text-dark);
  line-height: 1.5;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/JourneyComplete.tsx src/styles/hud.css
git commit -m "feat: journey complete screen with summary card and learnings"
```

---

## Task 6: Integration & Polish

> **Provider:** NVIDIA (GLM-5.2)
> **Persona:** Senior frontend
> **Complexity:** High
> **Depends on:** Tasks 2, 3, 4, 5 (needs all components and hooks)

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles/hud.css` (tune transition timings if needed)
- Modify: `src/styles/canvas.css` (if responsive adjustments needed)

**Interfaces:**
- Consumes: All components from Tasks 3-5, all types from Task 2
- Produces: Working `src/App.tsx` that composes the full experience

- [ ] **Step 1: Write src/App.tsx**

```tsx
import { useScrollFrame } from './hooks/useScrollFrame';
import { useCheckpointPhase } from './hooks/useCheckpointPhase';
import { checkpoints } from './data/checkpointConfig';
import ScrollCanvas from './components/ScrollCanvas';
import HUDOverlay from './components/HUDOverlay';
import JourneyComplete from './components/JourneyComplete';

const TOTAL_SCROLL = 5000;

export default function App() {
  const { scrollY, frameIndex } = useScrollFrame();
  const { activeCheckpoint, hudPhase } = useCheckpointPhase(scrollY);

  // Clamp activeCheckpoint to valid range
  const clampedCheckpoint = Math.min(activeCheckpoint, checkpoints.length - 1);
  const currentCheckpoint = checkpoints[clampedCheckpoint];

  // Journey complete is visible when scroll reaches the end
  const isJourneyComplete = scrollY >= TOTAL_SCROLL - 10;

  return (
    <>
      <ScrollCanvas frameIndex={frameIndex} />
      <HUDOverlay
        checkpoint={currentCheckpoint}
        phase={hudPhase}
        activeCheckpoint={clampedCheckpoint}
        totalCheckpoints={checkpoints.length}
      />
      <JourneyComplete visible={isJourneyComplete} />
    </>
  );
}
```

- [ ] **Step 2: Verify dev server runs with full experience**

Run: `npm run dev`
Expected: Page loads, canvas shows first frame of spritesheet. Scrolling advances frames. At ~800px scroll, HUD flows in for checkpoint 1. At ~1250px, next clip starts and HUD flows out. Continues through all 4 checkpoints. At ~5000px, journey complete screen appears.

- [ ] **Step 3: Test reverse scrolling**

Scroll down to checkpoint 3, then scroll back up to checkpoint 1.
Expected: Canvas shows correct frames in reverse. No jank, no stutter. HUD appears/disappears correctly.

- [ ] **Step 4: Test fast scrolling**

Scroll rapidly from top to bottom.
Expected: Canvas keeps up. Frames may skip but no blank flashes. HUD may not fully animate but should appear/disappear.

- [ ] **Step 5: Test at different viewport widths**

Resize browser to 1280px, 1440px, 1920px widths.
Expected: Canvas covers full viewport. HUD elements are positioned correctly (left side, top-left, top-center). No overflow.

- [ ] **Step 6: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 7: Run production build**

Run: `npm run build`
Expected: Build succeeds, output in `dist/`.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate all components into complete scroll experience"
```

---

## Task 7: README & Cleanup

> **Provider:** Kimi (kimi2.5)
> **Persona:** Tech writer
> **Complexity:** Low
> **Depends on:** Task 6 (needs working app)

**Files:**
- Create: `README.md`
- Modify: `.gitignore` (ensure it's complete)

- [ ] **Step 1: Create README.md**

```markdown
# Calm Wings

A scroll-driven, first-person airport flythrough experience. Scroll to walk through 4 airport checkpoints — entrance, check-in, security, and boarding — each rendered as AI-generated video frames composited into a spritesheet and scroll-scrubbed on an HTML canvas.

## Live Demo

[Deployed URL will be added after deploy]

## How It Works

```
Google Flow (Veo 3.1 + Imagen)
  → 4 illustrated keyframe scene images
  → 4 flythrough video clips (Start/End Frame interpolation)
  → 1 journey complete image
        ↓
ffmpeg + Python (Pillow)
  → Extract 16 frames per clip (64 total)
  → Composite into 8×8 spritesheet (512×288 per frame)
        ↓
React 19 + Canvas 2D API
  → Scroll position maps to frame index (0-63)
  → Canvas draws spritesheet subregion via drawImage()
  → HUD overlays flow in/out at each checkpoint (CSS transitions)
        ↓
Deployed as static site on Vercel
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Video Generation | Google Flow (Veo 3.1) |
| AI Image Generation | Google Flow (Imagen / Nano Banana) |
| Frame Compositing | ffmpeg + Python Pillow |
| Runtime | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Canvas | Native Canvas 2D API |
| Styling | Vanilla CSS (CSS variables, glassmorphism) |
| Deployment | Vercel (static) |

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and scroll.

## Project Structure

```
src/
├── components/
│   ├── ScrollCanvas.tsx       # Canvas + scroll-scrub render loop
│   ├── HUDOverlay.tsx         # Master HUD container
│   ├── JourneyComplete.tsx    # Final summary screen
│   └── hud/                   # InfoCard, TipPanel, Hotspot, StepLabel, ProgressBar
├── hooks/
│   ├── useScrollFrame.ts      # scroll → frame index
│   └── useCheckpointPhase.ts  # frame → checkpoint + HUD phase
├── data/
│   └── checkpointConfig.ts    # 4 checkpoint definitions
├── types/
│   └── simulation.ts          # TypeScript interfaces
├── assets/
│   ├── spritesheet.jpg        # 8×8 grid of 64 frames
│   └── journey-complete.jpg   # Final summary image
└── styles/                    # tokens, global, canvas, hud CSS
```

## Credits

Built by Emo. AI assets generated with Google Flow. Scroll engine built with React + Canvas 2D.
```

- [ ] **Step 2: Verify .gitignore is complete**

Check that `.gitignore` includes: `node_modules/`, `dist/`, `tmp_frames/`, `*.local`, `.DS_Store`, `desktop.ini`

- [ ] **Step 3: Commit**

```bash
git add README.md .gitignore
git commit -m "docs: add README with pipeline diagram and run instructions"
```

---

## Execution Order

```
Task 1 (Kimi)     — Spritesheet           ← can start now (Phase 0 done)
Task 2 (OpenRouter) — Scaffold            ← can start in parallel with Task 1
  ↓
Task 3 (NVIDIA)    — Canvas Engine         ← after Task 2
Task 4 (OpenRouter) — HUD Components       ← after Task 2, parallel with Task 3
Task 5 (Kimi)      — Journey Complete      ← after Task 2, parallel with Task 3/4
  ↓
Task 6 (NVIDIA)    — Integration           ← after Tasks 3, 4, 5
  ↓
Task 7 (Kimi)      — README               ← after Task 6
```

Parallel execution plan:
- **Wave 1:** Task 1 + Task 2 (both can start immediately)
- **Wave 2:** Task 3 + Task 4 + Task 5 (all three in parallel, after Task 2 completes)
- **Wave 3:** Task 6 (after all Wave 2 tasks complete)
- **Wave 4:** Task 7 (after Task 6)
