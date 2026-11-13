import type { PlatformDefinition } from './prototypeLevel';

export interface DialogueLine {
  speaker: string;
  text: string;
}

export const CRASH_SITE = {
  width: 1440,
  height: 300,
  spawn: { x: 244, y: 162 },
  terminal: { x: 300, y: 170 },
  hatch: { x: 128, y: 170 },
  exit: { x: 1380, y: 156 },
  platforms: [
    { x: 0, top: 170, width: 400, height: 130 },
    { x: 400, top: 156, width: 208, height: 144 },
    { x: 608, top: 140, width: 132, height: 160 },
    { x: 740, top: 156, width: 80, height: 144 },
    { x: 820, top: 190, width: 32, height: 110 },
    { x: 852, top: 156, width: 588, height: 144 },
    { x: 478, top: 128, width: 48, height: 8 },
    { x: 1010, top: 128, width: 48, height: 8 },
    { x: 1076, top: 102, width: 48, height: 8 },
  ] satisfies PlatformDefinition[],
} as const;

export const TERMINAL_DIALOGUE: readonly DialogueLine[] = [
  { speaker: 'Terminal de la nave', text: 'Diagnóstico de emergencia. Propulsión y comunicaciones fuera de servicio.' },
  { speaker: 'Terminal de la nave', text: 'La reserva de energía no permite reparar la nave. La compuerta de acceso permanece bloqueada.' },
  { speaker: 'Terminal de la nave', text: 'Necesitamos una fuente de energía externa. El camino al este conduce fuera del cráter.' },
];

export const TERMINAL_REMINDER: readonly DialogueLine[] = [
  { speaker: 'Terminal de la nave', text: 'Sin energía suficiente para iniciar las reparaciones. Busca una fuente externa fuera del cráter.' },
];

export const HATCH_DIALOGUE: readonly DialogueLine[] = [
  { speaker: 'Explorador', text: 'La compuerta no responde. Debo revisar el terminal de la nave.' },
];

export const HATCH_AFTER_DIAGNOSIS: readonly DialogueLine[] = [
  { speaker: 'Explorador', text: 'No hay energía para abrirla. Tendré que buscar una fuente fuera del cráter.' },
];

export const EXIT_BEFORE_DIAGNOSIS: readonly DialogueLine[] = [
  { speaker: 'Explorador', text: 'Antes de abandonar el lugar del accidente, debería comprobar el estado de la nave en el terminal.' },
];
