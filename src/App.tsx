import { useScrollFrame } from './hooks/useScrollFrame';
import { useCheckpointPhase } from './hooks/useCheckpointPhase';
import { checkpoints } from './data/checkpointConfig';
import ScrollCanvas from './components/ScrollCanvas';
import HUDOverlay from './components/HUDOverlay';
import JourneyComplete from './components/JourneyComplete';

const TOTAL_SCROLL = 5000;

export default function App() {
  const { scrollY, frameIndex, ambientScale } = useScrollFrame();
  const { activeCheckpoint, hudPhase, revealProgress } = useCheckpointPhase(scrollY);

  const clampedCheckpoint = Math.min(activeCheckpoint, checkpoints.length - 1);
  const currentCheckpoint = checkpoints[clampedCheckpoint];
  const isJourneyComplete = scrollY >= TOTAL_SCROLL - 10;

  return (
    <>
      <ScrollCanvas frameIndex={frameIndex} ambientScale={ambientScale} />
      <HUDOverlay
        checkpoint={currentCheckpoint}
        phase={hudPhase}
        activeCheckpoint={clampedCheckpoint}
        checkpoints={checkpoints}
        revealProgress={revealProgress}
      />
      <JourneyComplete visible={isJourneyComplete} />
    </>
  );
}
