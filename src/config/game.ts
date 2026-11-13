// Un salto de unos 44 px con un recorrido completo de aproximadamente 0,5 s.
export const WORLD = { width: 480, height: 270, gravity: 1400 } as const;
// Más espacio por encima del recorrido sin desplazar sus plataformas.
export const CAMERA = { top: -64, deadzoneWidth: 105 } as const;
export const PLAYER = { speed: 90, jumpSpeed: 350 } as const;

export const COMBAT = {
  meleeDamage: 2, meleeReach: 26, meleeDuration: 110, meleeCooldown: 320,
  shotDamage: 1, shotSpeed: 260, shotLifetime: 700, shotCooldown: 320,
  enemyHealth: 3, enemySpeed: 24, playerHealth: 3, invulnerability: 900,
} as const;
