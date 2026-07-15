import type { CheckpointConfig } from '../types/simulation';

export const checkpoints: CheckpointConfig[] = [
  {
    id: 1,
    label: '1. ENTRANCE — DOORS',
    title: 'Airport Entrance',
    infoCard: {
      title: 'Welcome to the Airport',
      body: "You've arrived at the terminal entrance. Look for the Departures signage above the doors. Have your ID and boarding pass ready before you walk in.",
    },
    tip: "Keep your documents in an easily accessible pocket — you'll need them at every checkpoint.",
    hotspots: [
      { id: 'h1-1', label: 'Departures Sign', position: { x: '50%', y: '20%' } },
      { id: 'h1-2', label: 'Entry Doors', position: { x: '50%', y: '55%' } },
    ],
    frameRange: { start: 0, end: 15 },
  },
  {
    id: 2,
    label: '2. CHECK-IN COUNTER',
    title: 'Check-in & Baggage Drop',
    infoCard: {
      title: 'Check-in Counter',
      body: "Present your ID and booking reference at the airline counter. The agent will verify your documents, check your luggage, and issue your boarding pass.",
    },
    tip: 'Weigh your luggage at home. Excess baggage fees are expensive and can slow you down.',
    hotspots: [
      { id: 'h2-1', label: 'Check-in Counter', position: { x: '50%', y: '45%' } },
      { id: 'h2-2', label: 'FIDS Board', position: { x: '50%', y: '15%' } },
    ],
    frameRange: { start: 16, end: 31 },
  },
  {
    id: 3,
    label: '3. SECURITY CHECK',
    title: 'Security Screening',
    infoCard: {
      title: 'Security Screening',
      body: 'Place your electronics (laptop, power bank, charger) and liquids in a tray. Remove your belt and jacket if asked. Walk through the metal detector. Collect your belongings from the X-ray belt on the other side.',
    },
    tip: 'Wear easy-to-remove shoes. Keep liquids in a clear zip-lock bag — 100ml max per item.',
    hotspots: [
      { id: 'h3-1', label: 'X-ray Belt', position: { x: '35%', y: '50%' } },
      { id: 'h3-2', label: 'Metal Detector', position: { x: '60%', y: '40%' } },
      { id: 'h3-3', label: 'Tray Area', position: { x: '25%', y: '65%' } },
    ],
    frameRange: { start: 32, end: 47 },
  },
  {
    id: 4,
    label: '4. BOARDING GATE',
    title: 'Boarding & Jet Bridge',
    infoCard: {
      title: 'Boarding Gate',
      body: 'Check the FIDS screen for your gate number and flight status. When boarding is announced, join the queue for your group. Present your boarding pass at the gate. Walk through the jet bridge to the aircraft door.',
    },
    tip: 'Check the FIDS screen regularly — gates can change at the last minute. Listen for announcements.',
    hotspots: [
      { id: 'h4-1', label: 'FIDS Screen', position: { x: '40%', y: '25%' } },
      { id: 'h4-2', label: 'Jet Bridge', position: { x: '55%', y: '55%' } },
    ],
    frameRange: { start: 48, end: 63 },
  },
];
