export const PLAYER_SHEETS = [
  { key: 'player-run', file: 'protagonist-run-v1-32.png' },
  { key: 'player-idle', file: 'protagonist-idle-v1-32.png' },
  { key: 'player-jump', file: 'protagonist-jump-v1-32.png' },
  { key: 'player-land', file: 'protagonist-land-v1-32.png' },
] as const;

export const PLAYER_ANIMATIONS = [
  { key: 'player-idle', texture: 'player-idle', start: 0, end: 3, frameRate: 4, repeat: -1 },
  { key: 'player-run', texture: 'player-run', start: 0, end: 7, frameRate: 12, repeat: -1 },
  { key: 'player-rise', texture: 'player-jump', start: 0, end: 2, frameRate: 14, repeat: 0 },
  { key: 'player-fall', texture: 'player-jump', start: 3, end: 5, frameRate: 14, repeat: 0 },
  { key: 'player-land', texture: 'player-land', start: 0, end: 2, frameRate: 20, repeat: 0 },
] as const;

export type PlayerAnimation = typeof PLAYER_ANIMATIONS[number]['key'];
export const PLAYER_FRAME = { width: 64, height: 32 } as const;
export const LANDING_DURATION = 150;
