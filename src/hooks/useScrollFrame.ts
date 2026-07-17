import { useEffect, useRef, useState } from 'react';

const FRAMES_PER_CLIP = 16;
const SCROLL_PER_CHECKPOINT = 1250;
const VIDEO_SCROLL = 800;
const TOTAL_SCROLL = 5000;

// Ambient motion: the held frame only locks fully still during the HUD's hold
// band (breathingProgress 100-350, matching useCheckpointPhase.ts's reveal
// ramp). During the two 100px ramp-in/ramp-out bands — and during active
// video scrubbing — a slow accumulator drives a subtle zoom so the background
// doesn't read as fully dead while the HUD is transitioning in or out.
const AMBIENT_RAMP = 100;
const AMBIENT_HOLD_END = 350;
const AMBIENT_AMPLITUDE = 0.015;
const AMBIENT_FREQUENCY = 0.004;

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
  const [ambientScale, setAmbientScale] = useState(1);

  const prevScrollRef = useRef(0);
  const ambientAccumRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrollY(y);
          setFrameIndex(scrollToFrame(y));

          // Only accumulate scroll distance while inside a ramp band; frozen
          // during the hold band and during active video scrubbing.
          const clampedScroll = Math.max(0, Math.min(y, TOTAL_SCROLL));
          const localScroll = clampedScroll % SCROLL_PER_CHECKPOINT;
          const breathingProgress = localScroll - VIDEO_SCROLL;
          const inRampBand =
            breathingProgress >= 0 &&
            (breathingProgress < AMBIENT_RAMP || breathingProgress > AMBIENT_HOLD_END);

          const delta = y - prevScrollRef.current;
          prevScrollRef.current = y;
          if (inRampBand) {
            ambientAccumRef.current += delta;
          }
          setAmbientScale(1 + AMBIENT_AMPLITUDE * Math.sin(ambientAccumRef.current * AMBIENT_FREQUENCY));

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY, frameIndex, ambientScale };
}
