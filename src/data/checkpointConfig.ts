import type { CheckpointConfig } from '../types/simulation';

export const checkpoints: CheckpointConfig[] = [
  {
    id: 1,
    label: '1. ENTRANCE — DOORS',
    sectorTag: 'ENT // 01',
    chipName: 'ENTRANCE',
    name: 'Entrance — Doors',
    title: 'Airport Entrance',
    infoCard: {
      title: 'Welcome to the Airport',
      body: "You've arrived at the terminal entrance. Look for the Departures signage above the doors. Have your ID and boarding pass ready before you walk in.",
    },
    tip: "Keep your documents in an easily accessible pocket — you'll need them at every checkpoint.",
    hotspots: [
      {
        id: 'h1-1',
        label: 'Departures Sign',
        position: { x: '50%', y: '20%' },
        detail: {
          title: 'Departures Signage',
          body: 'Overhead signage pointing you toward the departures hall. Confirm your terminal number here before heading in.',
        },
      },
      {
        id: 'h1-2',
        label: 'Entry Doors',
        position: { x: '50%', y: '55%' },
        detail: {
          title: 'Terminal Entrance',
          body: 'The main doors into the terminal. Have your ID and boarding pass out before you walk through.',
        },
      },
    ],
    frameRange: { start: 0, end: 15 },
  },
  {
    id: 2,
    label: '2. CHECK-IN COUNTER',
    sectorTag: 'CHK // 02',
    chipName: 'CHECK-IN',
    name: 'Check-in Counter',
    title: 'Check-in & Baggage Drop',
    infoCard: {
      title: 'Check-in Counter',
      body: "Present your ID and booking reference at the airline counter. The agent will verify your documents, check your luggage, and issue your boarding pass.",
    },
    tip: 'Weigh your luggage at home. Excess baggage fees are expensive and can slow you down.',
    hotspots: [
      {
        id: 'h2-1',
        label: 'Check-in Counter',
        position: { x: '50%', y: '45%' },
        detail: {
          title: 'Check-in Counter',
          body: 'Present your ID and booking reference here. The agent verifies your documents and checks your luggage before issuing a boarding pass.',
        },
      },
      {
        id: 'h2-2',
        label: 'FIDS Board',
        position: { x: '50%', y: '15%' },
        detail: {
          title: 'Flight Information Display',
          body: 'Shows real-time status for every departing flight. Confirm your flight number and check-in deadline here.',
        },
      },
    ],
    frameRange: { start: 16, end: 31 },
  },
  {
    id: 3,
    label: '3. SECURITY CHECK',
    sectorTag: 'SEC // 03',
    chipName: 'SECURITY',
    name: 'Security Check',
    title: 'Security Screening',
    infoCard: {
      title: 'Security Screening',
      body: 'Place your electronics (laptop, power bank, charger) and liquids in a tray. Remove your belt and jacket if asked. Walk through the metal detector. Collect your belongings from the X-ray belt on the other side.',
    },
    tip: 'Wear easy-to-remove shoes. Keep liquids in a clear zip-lock bag — 100ml max per item.',
    hotspots: [
      {
        id: 'h3-1',
        label: 'X-ray Belt',
        position: { x: '35%', y: '50%' },
        detail: {
          title: 'X-ray Belt',
          body: 'Your tray and bags pass through here for scanning. Collect your belongings on the far side once they clear.',
        },
      },
      {
        id: 'h3-2',
        label: 'Metal Detector',
        position: { x: '60%', y: '40%' },
        detail: {
          title: 'Metal Detector',
          body: 'Walk through after emptying your pockets. An alarm means a manual pat-down or re-scan.',
        },
      },
      {
        id: 'h3-3',
        label: 'Tray Area',
        position: { x: '25%', y: '65%' },
        detail: {
          title: 'Tray Area',
          body: 'Load electronics, liquids, belts, and jackets into separate trays before they go through the scanner.',
        },
      },
    ],
    frameRange: { start: 32, end: 47 },
  },
  {
    id: 4,
    label: '4. BOARDING GATE',
    sectorTag: 'GTE // 04',
    chipName: 'BOARDING',
    name: 'Boarding Gate',
    title: 'Boarding & Jet Bridge',
    infoCard: {
      title: 'Boarding Gate',
      body: 'Check the FIDS screen for your gate number and flight status. When boarding is announced, join the queue for your group. Present your boarding pass at the gate. Walk through the jet bridge to the aircraft door.',
    },
    tip: 'Check the FIDS screen regularly — gates can change at the last minute. Listen for announcements.',
    hotspots: [
      {
        id: 'h4-1',
        label: 'FIDS Screen',
        position: { x: '40%', y: '25%' },
        detail: {
          title: 'Gate & Status Display',
          body: 'Confirms your gate number and boarding status. Gates can change last minute, so check back periodically.',
        },
      },
      {
        id: 'h4-2',
        label: 'Jet Bridge',
        position: { x: '55%', y: '55%' },
        detail: {
          title: 'Jet Bridge',
          body: 'The enclosed walkway from the gate to the aircraft door. Have your boarding pass ready to scan at the entrance.',
        },
      },
    ],
    frameRange: { start: 48, end: 63 },
  },
];
