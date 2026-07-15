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