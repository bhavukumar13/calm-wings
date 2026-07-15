/** A single hotspot overlaid on the scene (cosmetic only — no click handler) */
export interface HotspotConfig {
  id: string;
  label: string;
  position: { x: string; y: string };
}

/** Defines a single checkpoint in the simulation */
export interface CheckpointConfig {
  id: number;
  label: string;
  title: string;
  infoCard: {
    title: string;
    body: string;
  };
  tip: string;
  hotspots: HotspotConfig[];
  frameRange: {
    start: number;
    end: number;
  };
}

/** HUD phase — determines visibility and animation state of overlay elements */
export type HudPhase = 'pre' | 'flow-in' | 'active' | 'flow-out' | 'post';

/** Scroll state passed around the app */
export interface ScrollState {
  scrollY: number;
  frameIndex: number;
  activeCheckpoint: number;
  hudPhase: HudPhase;
}
