import Phaser from 'phaser';
import { PLAYER, COMBAT } from '../config/game';
import { LANDING_DURATION } from '../config/playerAnimations';
import type { PlayerAnimation } from '../config/playerAnimations';

export class Player extends Phaser.Physics.Arcade.Sprite {
  facing = 1;
  health: number = COMBAT.playerHealth;
  private invulnerableUntil = 0;
  private wasGrounded = false;
  private landingUntil = 0;
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly leftKey: Phaser.Input.Keyboard.Key;
  private readonly rightKey: Phaser.Input.Keyboard.Key;
  private readonly jumpKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-idle', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 0.75);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(10, 16, false);
    body.setOffset(27, 16);
    this.play('player-idle');

    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error('KORA requiere entrada de teclado.');
    this.cursors = keyboard.createCursorKeys();
    this.leftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.rightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.jumpKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update(time: number, controlsEnabled = true): void {
    this.setAlpha(time < this.invulnerableUntil && Math.floor(time / 70) % 2 === 0 ? 0.35 : 1);
    const left = controlsEnabled && (this.cursors.left.isDown || this.leftKey.isDown);
    const right = controlsEnabled && (this.cursors.right.isDown || this.rightKey.isDown);
    if (left !== right) this.facing = right ? 1 : -1;
    this.setFlipX(this.facing < 0);
    this.setVelocityX((Number(right) - Number(left)) * PLAYER.speed);

    // Consumir ambas pulsaciones evita un salto pendiente al aterrizar.
    const upPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const spacePressed = Phaser.Input.Keyboard.JustDown(this.jumpKey);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (controlsEnabled && (upPressed || spacePressed) && body.blocked.down) {
      this.setVelocityY(-PLAYER.jumpSpeed);
    }

    const grounded = body.blocked.down && body.velocity.y >= 0;
    if (!grounded) {
      this.landingUntil = 0;
      this.showAnimation(body.velocity.y < 0 ? 'player-rise' : 'player-fall');
    } else {
      if (!this.wasGrounded) this.landingUntil = time + LANDING_DURATION;
      // Correr o volver a saltar interrumpe el aterrizaje sin bloquear controles.
      if (body.velocity.x !== 0) {
        this.landingUntil = 0;
        this.showAnimation('player-run');
      } else if (time < this.landingUntil) {
        this.showAnimation('player-land');
      } else {
        this.showAnimation('player-idle');
      }
    }
    this.wasGrounded = grounded;
  }

  private showAnimation(key: PlayerAnimation): void {
    // Una secuencia no cíclica conserva su último cuadro al terminar.
    if (this.anims.currentAnim?.key !== key) this.play(key);
  }

  takeDamage(time: number): boolean {
    if (time < this.invulnerableUntil || this.health <= 0) return false;
    this.health -= 1;
    this.invulnerableUntil = time + COMBAT.invulnerability;
    this.scene.game.events.emit('player-health', this.health);
    return true;
  }

  respawn(x: number, y: number): void {
    (this.body as Phaser.Physics.Arcade.Body).reset(x, y);
    this.setVelocity(0, 0);
    this.play('player-idle');
    this.wasGrounded = false;
    this.landingUntil = 0;
    this.health = COMBAT.playerHealth;
    this.invulnerableUntil = this.scene.time.now + COMBAT.invulnerability;
    this.setAlpha(1);
    this.scene.game.events.emit('player-health', this.health);
  }
}
