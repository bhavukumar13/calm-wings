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
| Build Tool | Vite 8 |
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
