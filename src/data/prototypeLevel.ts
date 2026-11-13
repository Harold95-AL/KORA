export interface PlatformDefinition {
  x: number;
  top: number;
  width: number;
  height: number;
}

export const PROTOTYPE_LEVEL = {
  width: 960,
  height: 240,
  spawn: { x: 40, y: 140 },
  platforms: [
    { x: 0, top: 156, width: 220, height: 84 },
    { x: 250, top: 156, width: 210, height: 84 },
    { x: 490, top: 156, width: 220, height: 84 },
    { x: 740, top: 156, width: 220, height: 84 },
    { x: 100, top: 128, width: 44, height: 8 },
    { x: 164, top: 102, width: 42, height: 8 },
    { x: 300, top: 128, width: 48, height: 8 },
    { x: 366, top: 102, width: 44, height: 8 },
    { x: 540, top: 126, width: 44, height: 8 },
    { x: 604, top: 100, width: 44, height: 8 },
    { x: 790, top: 128, width: 44, height: 8 },
    { x: 852, top: 102, width: 44, height: 8 },
  ] satisfies PlatformDefinition[],
} as const;
