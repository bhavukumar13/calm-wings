import type { CSSProperties } from 'react';
import type { CheckpointConfig } from '../../types/simulation';
import '../../styles/hud.css';

interface ProgressBarProps {
  checkpoints: CheckpointConfig[];
  activeCheckpoint: number;
  reveal: number;
}

export default function ProgressBar({ checkpoints, activeCheckpoint, reveal }: ProgressBarProps) {
  return (
    <div className="progress-bar" style={{ '--reveal': reveal } as CSSProperties}>
      {checkpoints.map((checkpoint, i) => {
        const number = String(i + 1).padStart(2, '0');
        const state = i === activeCheckpoint ? 'active' : i < activeCheckpoint ? 'done' : 'upcoming';

        return (
          <div key={checkpoint.id} className={`progress-bar__chip progress-bar__chip--${state}`}>
            <span className="progress-bar__chip-number">{number}</span>
            {state === 'active' && (
              <span className="progress-bar__chip-name">{checkpoint.chipName}</span>
            )}
            {state !== 'active' && (
              <span className="progress-bar__chip-hover-name">{checkpoint.chipName}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
