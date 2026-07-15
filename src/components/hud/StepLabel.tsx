import '../../styles/hud.css';

interface StepLabelProps {
  label: string;
}

export default function StepLabel({ label }: StepLabelProps) {
  return (
    <div className="step-label">
      {label}
    </div>
  );
}
