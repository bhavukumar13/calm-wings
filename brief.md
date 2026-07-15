# Calm Wings — Project Brief

> **Codename:** Calm Wings
> **Type:** Portfolio piece (creative engineer flex)
> **Date:** 2026-07-15
> **Deadline:** Friday 2026-07-17 morning
> **Status:** Pre-Development → Ready for implementation plan

---

## 1. What This Is

Calm Wings is a scroll-driven, first-person airport flythrough experience. The user scrolls to "walk" through 4 airport checkpoints — entrance, check-in, security, boarding — each rendered as a 2-second AI-generated flyforward video clip. At each checkpoint, the video pauses and a HUD overlay (info cards, tips, glowing hotspots, step badge) flows in, stays visible while the user scrolls through a "breathing room" section, then flows out as the next clip begins.

No interaction is required to progress. No clicking, no task completion, no locks. The user scrolls through the entire experience start to finish. The HUD overlays are visual atmosphere — they appear, linger, and disappear.

The repo and README are part of the portfolio piece. The viewer should open the deployed site, scroll through the experience, then check the GitHub and think: **"How did they build this?"**

---

## 2. Architecture

```
Asset Pipeline:
  ComfyUI (FLUX-dev-fp8) → 4 illustrated scene keyframe images
       ↓
  ComfyUI (AnimateDiff SD1.5, mm_sd_v15_v2) → 4 video clips, 16 frames each (2s @ 8fps)
       ↓
  ffmpeg / frame extraction → 64 frames → 1 spritesheet (8×8 grid, 512×288 per frame)
       ↓
  Web App (React 19 + Vite + TypeScript):
    Canvas scroll-scrub engine (drawImage from spritesheet)
    HUD overlay (pure React DOM, CSS flow-in/out transitions)
    Journey complete screen (static FLUX image + summary card)
       ↓
  Deploy: static export to Vercel

Post-MVP upgrade: AnimateDiff → Higgsfield API (Seedance/Kling image-to-video)
  Web app stays identical — only asset quality changes.
```

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Scene generation | ComfyUI + FLUX-dev-fp8 |
| Video animation | ComfyUI + AnimateDiff SD1.5 (mm_sd_v15_v2) |
| Frame compositing | ffmpeg / ComfyUI VideoHelperSuite → spritesheet |
| Runtime | React 19 + TypeScript |
| Build tool | Vite |
| Canvas | Native `<canvas>` 2D API |
| Styling | Vanilla CSS (modular, CSS variables) |
| Deployment | Static export (Vercel) |

---

## 4. Experience Flow

```
Scroll 0px → 800px: Video clip 1 plays (entrance flythrough, 16 frames)
Scroll 800px → 1250px: Video paused, HUD 1 flows in (info card + tips + hotspots + step badge)
Scroll 1250px → 2050px: Video clip 2 plays (check-in flythrough)
Scroll 2050px → 2500px: Video paused, HUD 2 flows in
Scroll 2500px → 3300px: Video clip 3 plays (security flythrough)
Scroll 3300px → 3750px: Video paused, HUD 3 flows in
Scroll 3750px → 4550px: Video clip 4 plays (boarding flythrough)
Scroll 4550px → 5000px: Video paused, HUD 4 flows in
Scroll 5000px: Journey Complete screen (static image + summary card)
```

---

## 5. Design Tokens

```css
--color-bg-primary:      #0A1628
--color-bg-card:         rgba(10, 22, 40, 0.85)
--color-bg-card-light:   rgba(255, 255, 255, 0.95)
--color-accent-gold:     #F5A623
--color-accent-blue:     #3B82F6
--color-text-primary:    #FFFFFF
--color-text-dark:       #1A1A2E
--color-success:         #22C55E
--font-primary:          'Inter', sans-serif
--font-display:          'Outfit', sans-serif
--radius-card:           16px
--glass-blur:            12px
```

---

## 6. References

- [Design Spec](./docs/specs/2026-07-15-calm-wings-design.md) — full technical specification
- [Timeline](./timeline.md) — living changelog and open items
- [User Journey](./user%20journey.md) — 24-stage airport journey map (reference for checkpoint content)
- [Reference Images](./ref%20image/) — 17 mockups showing visual style targets
- [Vectr Inspiration](https://www.vectrfl.com/) — scroll-driven animation reference

---

## 7. Scope Boundaries

**In scope (MVP):**
- 4 checkpoint flythrough videos (AnimateDiff SD1.5, 16 frames each)
- Canvas scroll-scrub engine (spritesheet → drawImage)
- HUD overlay with flow-in/out animations (cosmetic, no interaction)
- Journey complete screen (static image + card)
- Clean repo + README with pipeline diagram
- Desktop-only, deployed to Vercel

**Out of scope (MVP):**
- User interaction / clicking / task completion
- Scroll locks or blocking
- Remotion / CSS 2.5D parallax / HyperFrames
- Multiple airports / dynamic routing
- Mobile responsive
- Accessibility / ARIA
- Backend / API
- Gamification / scores / timers
- Sound / audio
- Higgsfield API (post-MVP upgrade)
- Play Again button
