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
  totalCheckpoints: number;
}

export default function HUDOverlay({
  checkpoint,
  phase,
  activeCheckpoint,
  totalCheckpoints,
}: HUDOverlayProps) {
  const visible = phase === 'active' || phase === 'flow-in' || phase === 'flow-out';
  const animationClass =
    phase === 'flow-in' ? 'hud-enter' :
    phase === 'flow-out' ? 'hud-exit' :
    phase === 'active' ? 'hud-enter-active' :
    '';

  if (!visible) return null;

  return (
    <div className={`hud-overlay ${animationClass}`}>
      <ProgressBar activeCheckpoint={activeCheckpoint} total={totalCheckpoints} />
      <StepLabel label={checkpoint.label} />
      <div className="hud-overlay__left">
        <InfoCard title={checkpoint.infoCard.title} body={checkpoint.infoCard.body} />
        <TipPanel tip={checkpoint.tip} />
      </div>
      <div className="hud-overlay__hotspots">
        {checkpoint.hotspots.map((h) => (
          <Hotspot key={h.id} label={h.label} x={h.position.x} y={h.position.y} />
        ))}
      </div>
    </div>
  );
}
