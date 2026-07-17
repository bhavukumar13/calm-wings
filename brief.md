# Calm Wings — Project Brief

> **Codename:** Calm Wings
> **Type:** Portfolio piece (creative engineer flex)
> **Date:** 2026-07-15 (MVP build) · updated 2026-07-16 (HUD redesign + interactivity)
> **Deadline:** Friday 2026-07-17 morning
> **Status:** ✅ BUILD COMPLETE — HUD "Wayfinding Mono" redesign + Part 2 interactivity (scroll-linked reveal, hover hotspot cards) shipped. Ready for deploy.

---

## 1. What This Is

Calm Wings is a scroll-driven, first-person airport flythrough experience. The user scrolls to "walk" through 4 airport checkpoints — entrance, check-in, security, boarding — each rendered as AI-generated video frames composited into a spritesheet and scroll-scrubbed on an HTML canvas. At each checkpoint, the video holds and a HUD overlay (info cards, tips, glowing hotspots, step badge) reveals in sync with scroll — opacity and offset driven directly by scroll position rather than a timed transition — stays visible while the user scrolls through a "breathing room" section, then reverse-fades as the next clip begins. Hovering a hotspot dot reveals a small info card with a title and short description.

No interaction is required to progress. No clicking, no task completion, no locks. The user scrolls through the entire experience start to finish. The HUD overlays are visual atmosphere — they appear, linger, and disappear. The one interactive touch is hover-only (hotspot info cards); there is no click or keyboard path, by design.

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
      HUD overlay: "Wayfinding Mono" visual design (dark glass, mono micro-labels,
        numbered progress chips, gold reserved for the active step) + scroll-linked
        reveal (opacity/offset driven by scroll, holds mid-checkpoint, reverse-fades
        on exit) + hover-only hotspot info cards
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
Scroll 800px → 1250px: Video holds; HUD 1 reveals in sync with scroll (100px
  ramp-in), holds fully visible (250px), reverse-fades out (100px ramp-out).
  Background stays subtly alive (ambient zoom) during the two ramp bands and
  locks fully still only during the 250px hold.
Scroll 1250px → 2050px: Video clip 2 plays (check-in flythrough)
Scroll 2050px → 2500px: HUD 2 reveals the same way
Scroll 2500px → 3300px: Video clip 3 plays (security flythrough)
Scroll 3300px → 3750px: HUD 3 reveals the same way
Scroll 3750px → 4550px: Video clip 4 plays (boarding flythrough)
Scroll 4550px → 5000px: HUD 4 reveals the same way
Scroll 5000px: Journey Complete screen (static image + summary card)
```

Hovering any hotspot dot at any point during a checkpoint's HUD window reveals a small glass card with a title and 1–2 line description (hover-only, no keyboard/touch path — accepted tradeoff).

---

## 5. Design Tokens (current, post-redesign)

```css
--color-bg-primary:      #0A1628
--color-bg-card:         rgba(8, 14, 24, 0.65)
--color-bg-card-light:   rgba(255, 255, 255, 0.95)  /* Journey Complete only */
--color-accent-gold:     #FFC531
--color-accent-blue:     #3B82F6
--color-text-primary:    #FFFFFF
--color-text-dark:       #1A1A2E
--color-text-body:       rgba(255, 255, 255, 0.75)
--color-text-tip:        rgba(255, 255, 255, 0.72)
--color-border-glass:    rgba(255, 255, 255, 0.12)
--color-ink-on-gold:     #141A26
--font-primary:          'Space Grotesk', sans-serif
--font-display:          'Space Grotesk', sans-serif
--font-mono:             'Space Mono', monospace
--radius-card:           12px
--radius-chip:           8px
--radius-tag:            6px
--glass-blur:            28px (+ saturate(130%))
```

Glass recipe applied uniformly to every HUD panel: `background: var(--color-bg-card); backdrop-filter: blur(28px) saturate(130%); border: 1px solid var(--color-border-glass);`

> Superseded the original MVP tokens (Inter/Outfit fonts, `#F5A623` gold, 16px radius, 12px blur, solid-white info card) — see the "Wayfinding Mono" handoff below for the full rationale.

---

## 6. References

- [Design Spec](./docs/specs/2026-07-15-calm-wings-design.md) — original technical specification (MVP build)
- [Implementation Plan](./docs/plans/2026-07-15-calm-wings-implementation.md) — original 7-task build plan (MVP build)
- [Google Flow Asset Guide](./docs/guides/google-flow-asset-generation.md) — how to generate assets
- [HUD Redesign Handoff](./Airport%20checkpoint%20design%20variants/design_handoff_hud_wayfinding_mono/) — "Wayfinding Mono" visual redesign + Part 2 interactivity plan and task tracker
- [Timeline](./timeline.md) — living changelog and open items
- [User Journey](./user%20journey.md) — 24-stage airport journey map (reference for checkpoint content)
- [Reference Images](./ref%20image/) — 17 mockups showing visual style targets
- [Vectr Inspiration](https://www.vectrfl.com/) — scroll-driven animation reference

---

## 7. Scope Boundaries

**In scope (MVP — COMPLETE):**
- ✅ 4 checkpoint flythrough videos (Google Flow / Veo 3.1, 8s each)
- ✅ Canvas scroll-scrub engine (spritesheet → drawImage, 64 frames)
- ✅ HUD overlay, "Wayfinding Mono" visual redesign
- ✅ Scroll-linked HUD reveal (replaces the original timed CSS transition)
- ✅ Hover-only hotspot info cards (title + description)
- ✅ Journey complete screen (static image + card)
- ✅ Clean repo + README with pipeline diagram
- ✅ Desktop-only, production build passes

**Out of scope (MVP):**
- ❌ User interaction beyond hover / clicking / task completion
- ❌ Keyboard or touch path for hotspot cards (hover-only, accepted tradeoff)
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
