import Phaser from 'phaser';
import { WORLD } from '../config/game';
import { CRASH_SITE as LEVEL } from '../data/crashSite';

/** Decoración estática y colisiones sencillas del lugar del accidente. */
export function buildCrashSite(scene: Phaser.Scene): Phaser.Physics.Arcade.StaticGroup {
  scene.add.image(0, 0, 'crash-background').setOrigin(0).setScrollFactor(0)
    .setDisplaySize(WORLD.width, WORLD.height).setDepth(-10);

  const points = (values: readonly { x: number; y: number }[]): Phaser.Math.Vector2[] =>
    values.map(({ x, y }) => new Phaser.Math.Vector2(x, y));
  const rocks = scene.add.graphics().setDepth(1);
  rocks.fillStyle(0x0a1725);
  rocks.fillPoints(points([
    { x: 0, y: 170 }, { x: 24, y: 151 }, { x: 62, y: 157 },
    { x: 95, y: 169 }, { x: 225, y: 171 }, { x: 290, y: 155 },
    { x: 345, y: 153 }, { x: 400, y: 170 },
  ]), true);
  scene.add.image(24, 172, 'crashed-ship').setOrigin(0, 1).setDepth(2);

  const terrain = scene.add.graphics().setDepth(3);
  const platforms = scene.physics.add.staticGroup();
  for (const platform of LEVEL.platforms) {
    const body = scene.add.rectangle(
      platform.x + platform.width / 2, platform.top + platform.height / 2,
      platform.width, platform.height, 0, 0,
    );
    platforms.add(body);
    terrain.fillStyle(0x142d3c);
    terrain.fillRect(platform.x, platform.top, platform.width, platform.height);
    terrain.fillStyle(0x2d5360);
    terrain.fillRect(platform.x, platform.top, platform.width, 5);
    terrain.fillStyle(0x527e7e);
    terrain.fillRect(platform.x, platform.top, platform.width, 1);
    for (let x = platform.x + 4; x < platform.x + platform.width - 7; x += 16) {
      terrain.fillStyle((x % 3 === 0) ? 0x294956 : 0x1c3b4a);
      terrain.fillRect(x, platform.top + 8 + (x % 4) * 3, 9, 3);
      if (platform.height > 30) {
        terrain.fillStyle(0x0f2331);
        terrain.fillRect(x + 3, platform.top + 28 + (x % 5) * 4, 12, 2);
      }
    }
  }

  const props = scene.add.graphics().setDepth(4);
  // Fragmentos del casco: decorativos y sin daño por contacto.
  for (const [x, y, width] of [[210, 168, 23], [332, 168, 16], [354, 167, 11], [565, 154, 18]] as const) {
    props.fillStyle(0x646078);
    props.fillPoints(points([
      { x, y }, { x: x + 4, y: y - 5 },
      { x: x + width, y: y - 3 }, { x: x + width - 2, y },
    ]), true);
    props.fillStyle(0xbf8150);
    props.fillRect(x + 5, y - 3, 5, 1);
  }
  for (const [x, floor, height] of [[352, 170, 14], [666, 140, 19], [900, 156, 12], [1180, 156, 24], [1260, 156, 15]] as const) {
    props.fillStyle(0x227a86);
    props.fillPoints(points([
      { x, y: floor }, { x: x - 4, y: floor - height + 4 },
      { x: x + 1, y: floor - height }, { x: x + 6, y: floor - 4 },
    ]), true);
    props.fillStyle(0x4ee6e6);
    props.fillTriangle(x + 1, floor - height, x + 6, floor - 4, x + 1, floor - 2);
    props.fillStyle(0x99efe1);
    props.fillRect(x, floor - height + 2, 1, 4);
  }

  const tx = LEVEL.terminal.x;
  props.fillStyle(0x121c2b);
  props.fillRect(tx - 5, 162, 10, 8);
  props.fillStyle(0x4d5669);
  props.fillRect(tx - 9, 143, 18, 19);
  props.fillStyle(0x102a38);
  props.fillRect(tx - 7, 145, 14, 11);
  props.fillStyle(0x4ee6e6);
  props.fillRect(tx - 5, 148, 6, 2);
  props.fillRect(tx - 5, 152, 10, 1);
  props.fillStyle(0xd68b52);
  props.fillRect(tx + 4, 159, 2, 2);

  const hatch = scene.add.rectangle(LEVEL.hatch.x, 156, 18, 28, 0x1a2334).setDepth(3.5);
  platforms.add(hatch);
  props.lineStyle(2, 0x77738d);
  props.strokeRect(119, 142, 18, 28);
  props.fillStyle(0xc57d48);
  props.fillRect(123, 153, 10, 3);
  props.fillStyle(0x8d5355);
  props.fillRect(126, 145, 3, 4);

  for (let index = 0; index < 4; index += 1) {
    const puff = scene.add.rectangle(87 + index * 4, 118, 9, 7, 0x84909c, 0.22).setDepth(5);
    scene.tweens.add({
      targets: puff, x: puff.x + 12, y: 76 - index * 4, alpha: 0,
      scaleX: 1.8, scaleY: 1.6, duration: 2300 + index * 180,
      delay: index * 550, repeat: -1,
    });
  }

  // Balizas del sendero exterior; no representan tecnología de una civilización.
  props.fillStyle(0x3a5863);
  props.fillRect(1366, 130, 3, 26);
  props.fillStyle(0x80e5d7);
  props.fillTriangle(1370, 130, 1382, 136, 1370, 142);
  return platforms;
}
