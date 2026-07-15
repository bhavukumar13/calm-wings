import '../../styles/hud.css';

interface HotspotProps {
  label: string;
  x: string;
  y: string;
}

export default function Hotspot({ label, x, y }: HotspotProps) {
  return (
    <div className="hotspot" style={{ left: x, top: y }}>
      <div className="hotspot__pulse" />
      <div className="hotspot__dot" />
      <span className="hotspot__label">{label}</span>
    </div>
  );
}
