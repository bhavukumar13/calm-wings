import type { HudPhase } from '../types/simulation';

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