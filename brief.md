# Calm Wings — Project Brief

> **Codename:** Calm Wings
> **Type:** Portfolio piece (creative engineer flex)
> **Date:** 2026-07-15
> **Deadline:** Friday 2026-07-17 morning
> **Status:** ✅ BUILD COMPLETE — Ready for deploy

---

## 1. What This Is

Calm Wings is a scroll-driven, first-person airport flythrough experience. The user scrolls to "walk" through 4 airport checkpoints — entrance, check-in, security, boarding — each rendered as AI-generated video frames composited into a spritesheet and scroll-scrubbed on an HTML canvas. At each checkpoint, the video pauses and a HUD overlay (info cards, tips, glowing hotspots, step badge) flows in, stays visible while the user scrolls through a "breathing room" section, then flows out as the next clip begins.

No interaction is required to progress. No clicking, no task completion, no locks. The user scrolls through the entire experience start to finish. The HUD overlays are visual atmosphere — they appear, linger, and disappear.

The repo and README are part of the portfolio piece. The viewer should open the deployed site, scroll through the experience, then check the GitHub and think: **"How did they build this?"**

---

## 2. Architecture (As Built)

```
Asset Pipeline (COMPLETE):
  Google Flow (Veo 3.1 + Imagen)
    → 5 illustrated keyframe scene images
    → 4 flythrough video clips (8s each, 1280×720, 24fps, Start/End Frame interpolation)
    → 1 journey complete image
         ↓
  ffmpeg + Python (Pillow)
    → Extract 16 frames per clip (64 total, sampled every 0.5s)
    → Composite into 8×8 spritesheet (512×288 per frame, 4096×2304 total)
         ↓
  Web App (COMPLETE):
    React 19 + TypeScript + Vite 8
      Canvas scroll-scrub engine (spritesheet → drawImage, rAF render loop)
      HUD overlay (pure React DOM, CSS flow-in/out transitions, cosmetic only)
      Journey complete screen (static image + summary card)
         ↓
  Deploy: static export to Vercel (PENDING — Emo to deploy)

Post-MVP upgrade path: Replace AnimateDiff spritesheet with Higgsfield API
(Seedance/Kling image-to-video) for higher quality video frames.
Web app stays identical — only asset quality changes.
```

---

## 3. Tech Stack (As Built)

| Layer | Technology |
|-------|-----------|
| AI Video Generation | Google Flow (Veo 3.1) |
| AI Image Generation | Google Flow (Imagen / Nano Banana) |
| Frame Compositing | ffmpeg + Python Pillow |
| Runtime | React 19.2.7 + TypeScript 7 |
| Build tool | Vite 8.1.4 |
| Canvas | Native Canvas 2D API |
| Styling | Vanilla CSS (CSS variables, glassmorphism) |
| Deployment | Vercel (static) — pending |

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
- [Implementation Plan](./docs/plans/2026-07-15-calm-wings-implementation.md) — 7-task build plan
- [Google Flow Asset Guide](./docs/guides/google-flow-asset-generation.md) — how to generate assets
- [Timeline](./timeline.md) — living changelog and open items
- [User Journey](./user%20journey.md) — 24-stage airport journey map (reference for checkpoint content)
- [Reference Images](./ref%20image/) — 17 mockups showing visual style targets
- [Vectr Inspiration](https://www.vectrfl.com/) — scroll-driven animation reference

---

## 7. Scope Boundaries

**In scope (MVP — COMPLETE):**
- ✅ 4 checkpoint flythrough videos (Google Flow / Veo 3.1, 8s each)
- ✅ Canvas scroll-scrub engine (spritesheet → drawImage, 64 frames)
- ✅ HUD overlay with flow-in/out animations (cosmetic, no interaction)
- ✅ Journey complete screen (static image + card)
- ✅ Clean repo + README with pipeline diagram
- ✅ Desktop-only, production build passes

**Out of scope (MVP):**
- ❌ User interaction / clicking / task completion
- ❌ Scroll locks or blocking
- ❌ Remotion / CSS 2.5D parallax / HyperFrames
- ❌ Multiple airports / dynamic routing
- ❌ Mobile responsive
- ❌ Accessibility / ARIA
- ❌ Backend / API
- ❌ Gamification / scores / timers
- ❌ Sound / audio
- ❌ Higgsfield API (post-MVP upgrade)
- ❌ Play Again button
