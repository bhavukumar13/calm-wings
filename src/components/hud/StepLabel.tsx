import type { CSSProperties } from 'react';
import '../../styles/hud.css';

interface StepLabelProps {
  sectorTag: string;
  name: string;
  reveal: number;
}

export default function StepLabel({ sectorTag, name, reveal }: StepLabelProps) {
  return (
    <div className="step-label" style={{ '--reveal': reveal } as CSSProperties}>
      <span className="step-label__tag">{sectorTag}</span>
      <span className="step-label__divider" />
      <span className="step-label__name">{name}</span>
    </div>
  );
}
