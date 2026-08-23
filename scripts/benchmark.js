#!/usr/bin/env node
import { performance } from 'perf_hooks';

// Synthetic benchmark comparing setting canvas properties on every frame vs setting them only once on resize.
// On real browser DOM Canvas, setting `canvas.width` or `canvas.height` (even to the same value) clears the canvas
// backbuffer and resets all context state (transform matrix, fillStyle, clip, etc.), causing severe rendering overhead.

function benchmarkOldPattern(frames) {
  // Mock canvas object tracking state mutations
  let stateResets = 0;
  const canvas = {
    _w: 0, _h: 0, style: {},
    set width(v) { this._w = v; stateResets++; },
    get width() { return this._w; },
    set height(v) { this._h = v; stateResets++; },
    get height() { return this._h; }
  };
  const ctx = {
    scale: (x, y) => {},
    fillRect: (x, y, w, h) => {},
    drawImage: () => {}
  };

  const dpr = 2;
  const displayW = 1920;
  const displayH = 1080;

  const start = performance.now();
  for (let i = 0; i < frames; i++) {
    // OLD PATTERN: executed every frame
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;

    ctx.scale(dpr, dpr);
    ctx.fillRect(0, 0, displayW, displayH);
    ctx.drawImage();
  }
  const end = performance.now();
  return { timeMs: end - start, stateResets };
}

function benchmarkNewPattern(frames) {
  let stateResets = 0;
  const canvas = {
    _w: 0, _h: 0, style: {},
    set width(v) { this._w = v; stateResets++; },
    get width() { return this._w; },
    set height(v) { this._h = v; stateResets++; },
    get height() { return this._h; }
  };
  const ctx = {
    scale: (x, y) => {},
    fillRect: (x, y, w, h) => {},
    drawImage: () => {}
  };

  const dpr = 2;
  const displayW = 1920;
  const displayH = 1080;

  const start = performance.now();

  // NEW PATTERN: executed once on setup / resize
  canvas.width = displayW * dpr;
  canvas.height = displayH * dpr;
  canvas.style.width = `${displayW}px`;
  canvas.style.height = `${displayH}px`;
  ctx.scale(dpr, dpr);

  // Per-frame loop: only draw operations
  for (let i = 0; i < frames; i++) {
    ctx.fillRect(0, 0, displayW, displayH);
    ctx.drawImage();
  }
  const end = performance.now();
  return { timeMs: end - start, stateResets };
}

const N = 100000;
console.log(`Running benchmark with ${N} frame draws...`);
const oldRes = benchmarkOldPattern(N);
const newRes = benchmarkNewPattern(N);

console.log('--- BASELINE (OLD PATTERN) ---');
console.log(`Time: ${oldRes.timeMs.toFixed(2)} ms`);
console.log(`Canvas resets: ${oldRes.stateResets}`);

console.log('--- OPTIMIZED (NEW PATTERN) ---');
console.log(`Time: ${newRes.timeMs.toFixed(2)} ms`);
console.log(`Canvas resets: ${newRes.stateResets}`);
