import Phaser from 'phaser';
import { COMBAT } from '../config/game';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';

interface Shot {
  sprite: Phaser.Physics.Arcade.Sprite;
  expires: number;
}

export class CombatSystem {
  private readonly meleeKey: Phaser.Input.Keyboard.Key;
  private readonly shotKey: Phaser.Input.Keyboard.Key;
  private readonly slash: Phaser.GameObjects.Rectangle;
  private readonly struck = new Set<Enemy>();
  private shots: Shot[] = [];
  private meleeUntil = 0;
  private nextMelee = 0;
  private nextShot = 0;
  private meleeDirection = 1;

  private readonly scene: Phaser.Scene;
  private readonly player: Player;
  private readonly enemies: Enemy[];
  private readonly platforms: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene, player: Player, enemies: Enemy[],
    platforms: Phaser.Physics.Arcade.StaticGroup) {
    this.scene = scene;
    this.player = player;
    this.enemies = enemies;
    this.platforms = platforms;
    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error('KORA requiere entrada de teclado.');
    this.meleeKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.shotKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.slash = scene.add.rectangle(0, 0, COMBAT.meleeReach, 22, 0x8af5e2, 0.65)
      .setVisible(false).setDepth(2);
  }

  update(time: number): void {
    const meleePressed = Phaser.Input.Keyboard.JustDown(this.meleeKey);
    const shotPressed = Phaser.Input.Keyboard.JustDown(this.shotKey);
    if (meleePressed && time >= this.nextMelee) {
      this.nextMelee = time + COMBAT.meleeCooldown;
      this.meleeUntil = time + COMBAT.meleeDuration;
      this.meleeDirection = this.player.facing;
      this.struck.clear();
    }
    if (shotPressed && time >= this.nextShot) {
      this.nextShot = time + COMBAT.shotCooldown;
      const sprite = this.scene.physics.add.sprite(
        this.player.x + this.player.facing * 9, this.player.y, 'shot');
      (sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      sprite.setVelocityX(this.player.facing * COMBAT.shotSpeed);
      this.shots.push({ sprite, expires: time + COMBAT.shotLifetime });
    }

    this.slash.setVisible(time < this.meleeUntil);
    if (this.slash.visible) {
      this.slash.setPosition(
        this.player.x + this.meleeDirection * (5 + COMBAT.meleeReach / 2),
        this.player.y);
      for (const enemy of this.enemies) {
        if (enemy.active && !this.struck.has(enemy) &&
          Phaser.Geom.Intersects.RectangleToRectangle(this.slash.getBounds(), enemy.getBounds())) {
          this.struck.add(enemy);
          enemy.takeDamage(COMBAT.meleeDamage, time);
        }
      }
    }

    this.shots = this.shots.filter(({ sprite, expires }) => {
      let remove = time >= expires || sprite.x < 0 ||
        sprite.x > this.scene.physics.world.bounds.width;
      if (!remove) remove = this.scene.physics.world.collide(sprite, this.platforms);
      for (const enemy of this.enemies) {
        if (!remove && enemy.active && this.scene.physics.overlap(sprite, enemy)) {
          enemy.takeDamage(COMBAT.shotDamage, time);
          remove = true;
        }
      }
      if (remove) sprite.destroy();
      return !remove;
    });
  }

  reset(): void {
    this.shots.forEach(({ sprite }) => sprite.destroy());
    this.shots = [];
    this.meleeUntil = this.nextMelee = this.nextShot = 0;
    this.slash.setVisible(false);
    this.struck.clear();
  }
}
