# Handoff: Calm Wings HUD — "Wayfinding Mono" redesign

## Overview
Redesign of the scroll-flythrough HUD in the Calm Wings app: the checkpoint info card, tip panel, progress bar, step label, and hotspots. Direction chosen after exploration: **"Wayfinding Mono, tightened"** — signage-inspired, heavy dark glass, mono micro-labels, numbered progress chips, gold reserved exclusively for the active step.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs in the existing Calm Wings codebase** (React 19 + TypeScript + vanilla CSS with tokens, Vite). Map the values below onto the existing files:

- `src/styles/tokens.css` — update/add tokens
- `src/styles/hud.css` — replace component styles
- `src/components/hud/{StepLabel,ProgressBar,InfoCard,TipPanel,Hotspot}.tsx` — small structural changes
- `src/data/checkpointConfig.ts` — add sector tag per checkpoint

## Fidelity
**High-fidelity (hifi).** Recreate pixel-perfectly. All values below are final. Reference screens: `HUD Variants.dc.html` ids `3a`–`3d` (final), designed at 1280×720; positions use the same px offsets the current app uses at any viewport (24–28px insets, centered progress bar).

## Design Tokens

New/changed (keep existing scroll + animation tokens):

```css
--color-bg-card: rgba(8, 14, 24, 0.65);      /* one glass surface for ALL panels */
--color-accent-gold: #FFC531;                 /* signage gold */
--color-ink-on-gold: #141A26;                 /* text on gold */
--color-text-primary: #FFFFFF;
--color-text-body: rgba(255, 255, 255, 0.75);
--color-text-tip: rgba(255, 255, 255, 0.72);
--color-border-glass: rgba(255, 255, 255, 0.12);
--color-chip-done: rgba(255, 255, 255, 0.14);
--color-chip-done-text: rgba(255, 255, 255, 0.75);
--color-chip-next-border: rgba(255, 255, 255, 0.18);
--color-chip-next-text: rgba(255, 255, 255, 0.4);
--glass-blur: 28px;                           /* + saturate(130%) */
--radius-card: 12px;
--radius-chip: 8px;
--radius-tag: 6px;
--font-display: 'Space Grotesk', sans-serif;  /* titles + body */
--font-mono: 'Space Mono', monospace;         /* all labels, tags, numbers */
```

Glass recipe for every panel:
`background: rgba(8,14,24,0.65); backdrop-filter: blur(28px) saturate(130%); border: 1px solid rgba(255,255,255,0.12);`

The **solid white info card is removed** — every surface uses the same dark glass. Inter and Outfit are replaced by Space Grotesk + Space Mono (Google Fonts, weights 400–700).

## Screens / Views
Same HUD on all 4 checkpoints; only content, sector tag, and chip states change.

### Step Label (top-left, 28px inset)
- Pill: glass recipe, radius 10px, padding 9px 16px, flex row gap 10px.
- Sector tag: Space Mono 13px, letter-spacing 0.08em, color #FFC531. Values per checkpoint: `ENT // 01`, `CHK // 02`, `SEC // 03`, `GTE // 04`.
- Divider: 1×14px, rgba(255,255,255,0.2).
- Name: Space Grotesk 13px, rgba(255,255,255,0.85). Values: "Entrance — Doors", "Check-in Counter", "Security Check", "Boarding Gate".

### Progress Bar (top-center, 28px from top)
- Container: glass recipe, radius 12px, padding 8px 10px, flex row gap 8px.
- Chips, three states (replaces the dot system):
  - **Done**: 30×30px, radius 8px, background rgba(255,255,255,0.14), Space Mono 11px, color rgba(255,255,255,0.75), number only ("01").
  - **Active**: height 30px, radius 8px, background #FFC531, padding 0 12px, flex gap 8px; number Space Mono 11px bold #141A26 + name Space Mono 11px letter-spacing 0.08em #141A26 (e.g. "03 SECURITY"). The active chip is the ONLY gold fill on screen.
  - **Upcoming**: 30×30px, radius 8px, transparent, border 1px rgba(255,255,255,0.18), Space Mono 11px, color rgba(255,255,255,0.4).
- Chip names: ENTRANCE, CHECK-IN, SECURITY, BOARDING.

### Info Card (left, vertically centered, 28px inset, max-width 390px; 12px gap to tip panel below)
- Panel: glass recipe, radius 12px, padding 22px 24px, box-shadow 0 12px 40px rgba(0,0,0,0.4).
- Header row: flex, gap 12px, align center, margin-bottom 12px.
  - Icon: 32×32px, radius 8px, background #FFC531, "i" in Space Mono 700 15px #141A26.
  - Title: Space Grotesk 600 20px #FFFFFF.
- Body: Space Grotesk 400 14px / 1.6, rgba(255,255,255,0.75), `text-wrap: pretty`. Copy unchanged from `checkpointConfig.ts`.

### Tip Panel (below info card)
- Panel: glass recipe, radius 12px, padding 14px 18px, flex row gap 12px, align flex-start.
- "TIP" tag (replaces 💡 emoji): Space Mono 10px, letter-spacing 0.1em, color #FFC531, border 1px rgba(255,197,49,0.5), radius 6px, padding 3px 8px, flex-shrink 0.
- Text: Space Grotesk 13px / 1.55, rgba(255,255,255,0.72). Copy unchanged.

### Hotspots (positions unchanged from config)
- Dot: 13×13px circle, #FFC531, box-shadow 0 0 12px rgba(255,197,49,0.8).
- Pulse ring: 1.5px solid #FFC531, existing `pulse` keyframes, duration 2.4s ease-out infinite (was 2s).
- Label (22px below dot, centered): Space Mono 10px, letter-spacing 0.1em, color #FFC531, glass recipe background, border 1px rgba(255,197,49,0.35), radius 6px, padding 5px 10px, UPPERCASE (e.g. "X-RAY BELT").

## Interactions & Behavior
- Flow in/out: keep the existing phase system (`hud-enter` / `hud-enter-active` / `hud-exit`, 600ms ease-out in, 400ms ease-in out, translateY(20px) + fade). Stagger element entrances: step label 0ms, progress bar 100ms, card cluster 200ms, hotspots 300ms + 80ms per additional hotspot (CSS `animation-delay` or `transition-delay`).
- Progress chip states derive from `activeCheckpoint` exactly as today (`i < active` → done, `i === active` → active, else upcoming). Animate state changes with a 300ms ease background/width transition.
- Optional (shown as a tweak in the prototype): reveal upcoming/done chip names on hover as a small mono label under the chip (9px, letter-spacing 0.1em, rgba(255,255,255,0.55), 38px below chip top).

## State Management
No new state. Existing `useCheckpointPhase` + `activeCheckpoint` props cover everything. Add `sectorTag: string` (ENT/CHK/SEC/GTE // NN) to `CheckpointConfig` or derive from `id`.

## Assets
- Backgrounds in the prototype are the repo's own scene stills (`calm-wings/assets/*.jpeg`) — the real app keeps its canvas spritesheet; no new assets needed.
- Fonts: Space Grotesk (400/500/600) + Space Mono (400/700) from Google Fonts; drop Inter/Outfit from the HUD (Journey Complete screen untouched by this handoff).

## Screenshots
`screenshots/` — full 1280×720 captures of the four final screens (01-entrance, 02-checkin, 03-security, 04-boarding). Note: labels under done/upcoming progress chips are visible because the hover-reveal tweak was on when captured; default is active-only.

## Files
- `HUD Variants.dc.html` — open in a browser. Section "TURN 3" (ids 3a–3d) is the final design across all four checkpoints; turns 1–2 are the exploration history (1a = faithful recreation of the current UI for diffing).
- `assets/` — scene stills the prototype references.
