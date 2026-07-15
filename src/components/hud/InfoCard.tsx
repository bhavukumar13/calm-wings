import '../../styles/hud.css';

interface InfoCardProps {
  title: string;
  body: string;
}

export default function InfoCard({ title, body }: InfoCardProps) {
  return (
    <div className="info-card">
      <div className="info-card__icon">i</div>
      <div className="info-card__content">
        <h3 className="info-card__title">{title}</h3>
        <p className="info-card__body">{body}</p>
      </div>
    </div>
  );
}
