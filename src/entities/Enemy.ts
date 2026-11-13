import Phaser from 'phaser';
import { COMBAT } from '../config/game';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private readonly startX: number;
  private readonly endX: number;
  private health: number = COMBAT.enemyHealth;
  private direction = 1;
  private stunnedUntil = 0;
  private readonly bar: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, startX: number, endX: number) {
    super(scene, (startX + endX) / 2, 149, 'enemy');
    this.startX = startX;
    this.endX = endX;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.bar = scene.add.rectangle(this.x - 7, this.y - 12, 14, 2, 0xffcc80)
      .setOrigin(0, 0.5);
  }

  update(time: number): void {
    if (!this.active) return;
    if (this.x <= this.startX) this.direction = 1;
    if (this.x >= this.endX) this.direction = -1;
    this.setVelocityX(time < this.stunnedUntil ? 0 : this.direction * COMBAT.enemySpeed);
    this.setTint(time < this.stunnedUntil ? 0xffffff : 0xff9478);
    this.bar.setPosition(this.x - 7, this.y - 12);
  }

  takeDamage(amount: number, time: number): void {
    if (!this.active) return;
    this.health = Math.max(0, this.health - amount);
    this.stunnedUntil = time + 150;
    this.bar.setDisplaySize(14 * this.health / COMBAT.enemyHealth, 2);
    if (this.health === 0) {
      this.disableBody(true, true);
      this.bar.setVisible(false);
    }
  }

  resetEnemy(): void {
    this.health = COMBAT.enemyHealth;
    this.stunnedUntil = 0;
    this.direction = 1;
    this.enableBody(true, (this.startX + this.endX) / 2, 149, true, true);
    this.setVelocity(0, 0);
    this.bar.setVisible(true).setDisplaySize(14, 2);
    this.update(0);
  }
}
