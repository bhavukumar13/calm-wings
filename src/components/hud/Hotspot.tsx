import type { CSSProperties } from 'react';
import '../../styles/hud.css';

interface HotspotProps {
  label: string;
  x: string;
  y: string;
  reveal: number;
  detail: { title: string; body: string };
}

export default function Hotspot({ label, x, y, reveal, detail }: HotspotProps) {
  return (
    <div className="hotspot" style={{ left: x, top: y, '--reveal': reveal } as CSSProperties}>
      <div className="hotspot__pulse" />
      <div className="hotspot__dot" />
      <span className="hotspot__label">{label}</span>
      <div className="hotspot__card">
        <span className="hotspot__card-title">{detail.title}</span>
        <p className="hotspot__card-body">{detail.body}</p>
      </div>
    </div>
  );
}
