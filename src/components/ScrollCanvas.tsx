import { useEffect, useRef } from 'react';
import '../styles/canvas.css';

interface ScrollCanvasProps {
  frameIndex: number;
}

const FRAME_W = 512;
const FRAME_H = 288;
const GRID_COLS = 8;

export default function ScrollCanvas({ frameIndex }: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const lastFrameRef = useRef<number>(-1);

  useEffect(() => {
    const img = new Image();
    img.src = new URL('../assets/spritesheet.jpg', import.meta.url).href;
    img.onload = () => {
      imageRef.current = img;
      drawFrame(frameIndex);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    drawFrame(frameIndex);
  }, [frameIndex]);

  function drawFrame(idx: number) {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    if (idx === lastFrameRef.current) return;
    lastFrameRef.current = idx;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const col = idx % GRID_COLS;
    const row = Math.floor(idx / GRID_COLS);

    const dpr = window.devicePixelRatio || 1;
    const displayW = window.innerWidth;
    const displayH = window.innerHeight;

    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;

    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#0A1628';
    ctx.fillRect(0, 0, displayW, displayH);

    const imgAspect = FRAME_W / FRAME_H;
    const canvasAspect = displayW / displayH;
    let drawW, drawH, drawX, drawY;

    if (imgAspect > canvasAspect) {
      drawH = displayH;
      drawW = drawH * imgAspect;
      drawX = (displayW - drawW) / 2;
      drawY = 0;
    } else {
      drawW = displayW;
      drawH = drawW / imgAspect;
      drawX = 0;
      drawY = (displayH - drawH) / 2;
    }

    ctx.drawImage(
      img,
      col * FRAME_W, row * FRAME_H, FRAME_W, FRAME_H,
      drawX, drawY, drawW, drawH
    );
  }

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        lastFrameRef.current = -1;
        drawFrame(frameIndex);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameIndex]);

  return (
    <>
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
      <div className="scroll-spacer" />
    </>
  );
}
