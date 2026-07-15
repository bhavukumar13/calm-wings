import '../../styles/hud.css';

interface ProgressBarProps {
  activeCheckpoint: number;
  total: number;
}

export default function ProgressBar({ activeCheckpoint, total }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`progress-bar__dot ${i === activeCheckpoint ? 'active' : ''} ${i < activeCheckpoint ? 'done' : ''}`}
        />
      ))}
    </div>
  );
}
