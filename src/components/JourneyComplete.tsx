import '../styles/hud.css';

interface JourneyCompleteProps {
  visible: boolean;
}

const checkpointLabels = [
  'Airport Entrance',
  'Check-in & Baggage Drop',
  'Security Screening',
  'Boarding & Jet Bridge',
];

const learnings = [
  'How to navigate from terminal entrance to boarding gate',
  'What documents to keep ready at each checkpoint',
  'How security screening works — tray, scanner, collection',
  'How to find your gate using the FIDS display',
];

const proTip = 'Arrive at least 2 hours before domestic flights and 3 hours before international flights. The earlier you arrive, the less stressful every checkpoint feels.';

export default function JourneyComplete({ visible }: JourneyCompleteProps) {
  if (!visible) return null;

  return (
    <div className="journey-complete">
      <div className="journey-complete__overlay" />
      <div className="journey-complete__content">
        <div className="journey-complete__image">
          <img src={new URL('../assets/journey-complete.jpg', import.meta.url).href} alt="Seated in aircraft cabin" />
        </div>
        <div className="journey-complete__card">
          <div className="journey-complete__badge">🎉 JOURNEY COMPLETE</div>
          <h2 className="journey-complete__title">Great! You've walked through the airport.</h2>

          <div className="journey-complete__steps">
            {checkpointLabels.map((label, i) => (
              <div key={i} className="journey-complete__step">
                <span className="journey-complete__step-num">{i + 1}</span>
                <span className="journey-complete__step-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="journey-complete__learnings">
            <h3>You learned:</h3>
            <ul>
              {learnings.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="journey-complete__tip">
            <span className="journey-complete__tip-icon">💡</span>
            <span>{proTip}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
