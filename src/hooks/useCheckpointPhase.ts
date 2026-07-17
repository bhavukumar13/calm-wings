import type { HudPhase } from '../types/simulation';

const SCROLL_PER_CHECKPOINT = 1250;
const VIDEO_SCROLL = 800;
const TOTAL_SCROLL = 5000;

// Breathing room is 450px (SCROLL_PER_CHECKPOINT - VIDEO_SCROLL). revealProgress
// ramps 0->1 over the first REVEAL_RAMP px, holds at 1, then ramps 1->0 over the
// last REVEAL_RAMP px — i.e. 100px ramp-in / 250px hold / 100px ramp-out.
const REVEAL_RAMP = 100;
const BREATHING_SCROLL = SCROLL_PER_CHECKPOINT - VIDEO_SCROLL;

/**
 * Determines which checkpoint is active and what HUD phase we're in
 * based on scroll position.
 */
export function useCheckpointPhase(scrollY: number): {
  activeCheckpoint: number;
  hudPhase: HudPhase;
  revealProgress: number;
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

  // Scroll-linked reveal (Phase 6) — continuous 0->1->0 across breathing room,
  // independent of the discrete hudPhase thresholds above.
  let revealProgress = 0;
  if (isBreathingRoom) {
    if (breathingProgress < REVEAL_RAMP) {
      revealProgress = breathingProgress / REVEAL_RAMP;
    } else if (breathingProgress > BREATHING_SCROLL - REVEAL_RAMP) {
      revealProgress = (BREATHING_SCROLL - breathingProgress) / REVEAL_RAMP;
    } else {
      revealProgress = 1;
    }
  }
  revealProgress = Math.max(0, Math.min(1, revealProgress));

  return { activeCheckpoint: checkpoint, hudPhase, revealProgress };
}