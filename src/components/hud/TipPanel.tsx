import '../../styles/hud.css';

interface TipPanelProps {
  tip: string;
}

export default function TipPanel({ tip }: TipPanelProps) {
  return (
    <div className="tip-panel">
      <span className="tip-panel__tag">TIP</span>
      <span className="tip-panel__text">{tip}</span>
    </div>
  );
}
