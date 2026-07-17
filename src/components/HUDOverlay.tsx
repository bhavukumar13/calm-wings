import type { CSSProperties } from 'react';
import type { CheckpointConfig, HudPhase } from '../types/simulation';
import StepLabel from './hud/StepLabel';
import InfoCard from './hud/InfoCard';
import TipPanel from './hud/TipPanel';
import Hotspot from './hud/Hotspot';
import ProgressBar from './hud/ProgressBar';
import '../styles/hud.css';

interface HUDOverlayProps {
  checkpoint: CheckpointConfig;
  phase: HudPhase;
  activeCheckpoint: number;
  checkpoints: CheckpointConfig[];
  revealProgress: number;
}

// Per-element stagger: each element ramps from 0->1 over a `duration`-wide
// slice of revealProgress, starting at its own `offset`. Same formula runs in
// reverse as revealProgress falls back to 0, so exit stagger mirrors entrance
// (elements with the highest offset — hotspots — fade out first).
function reveal(progress: number, offset: number, duration = 0.4): number {
  return Math.max(0, Math.min(1, (progress - offset) / duration));
}

export default function HUDOverlay({
  checkpoint,
  phase,
  activeCheckpoint,
  checkpoints,
  revealProgress,
}: HUDOverlayProps) {
  const visible = phase === 'active' || phase === 'flow-in' || phase === 'flow-out';

  if (!visible) return null;

  const revealLabel = reveal(revealProgress, 0);
  const revealProgressBar = reveal(revealProgress, 0.08);
  const revealCard = reveal(revealProgress, 0.16);

  return (
    <div className="hud-overlay">
      <ProgressBar activeCheckpoint={activeCheckpoint} checkpoints={checkpoints} reveal={revealProgressBar} />
      <StepLabel sectorTag={checkpoint.sectorTag} name={checkpoint.name} reveal={revealLabel} />
      <div
        className="hud-overlay__left"
        style={{ '--reveal': revealCard } as CSSProperties}
      >
        <InfoCard title={checkpoint.infoCard.title} body={checkpoint.infoCard.body} />
        <TipPanel tip={checkpoint.tip} />
      </div>
      <div className="hud-overlay__hotspots">
        {checkpoint.hotspots.map((h, i) => (
          <Hotspot
            key={h.id}
            label={h.label}
            x={h.position.x}
            y={h.position.y}
            reveal={reveal(revealProgress, 0.24 + i * 0.08)}
            detail={h.detail}
          />
        ))}
      </div>
    </div>
  );
}
