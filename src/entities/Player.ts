import Phaser from 'phaser';
import { PLAYER, COMBAT } from '../config/game';

export class Player extends Phaser.Physics.Arcade.Sprite {
  facing = 1;
  health: number = COMBAT.playerHealth;
  private invulnerableUntil = 0;
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly leftKey: Phaser.Input.Keyboard.Key;
  private readonly rightKey: Phaser.Input.Keyboard.Key;
  private readonly jumpKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player-32');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setVisualHeight(32);

    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error('KORA requiere entrada de teclado.');
    this.cursors = keyboard.createCursorKeys();
    this.leftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.rightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.jumpKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update(time: number): void {
    this.setAlpha(time < this.invulnerableUntil && Math.floor(time / 70) % 2 === 0 ? 0.35 : 1);
    const left = this.cursors.left.isDown || this.leftKey.isDown;
    const right = this.cursors.right.isDown || this.rightKey.isDown;
    if (left !== right) this.facing = right ? 1 : -1;
    this.setFlipX(this.facing < 0);
    this.setVelocityX((Number(right) - Number(left)) * PLAYER.speed);

    // Consumir ambas pulsaciones evita un salto pendiente al aterrizar.
    const upPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const spacePressed = Phaser.Input.Keyboard.JustDown(this.jumpKey);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if ((upPressed || spacePressed) && body.blocked.down) {
      this.setVelocityY(-PLAYER.jumpSpeed);
    }
  }

  setVisualHeight(height: 32 | 40): void {
    this.setTexture('player-' + height);
    // Marcos simétricos: el cuerpo permanece centrado al mirar a ambos lados.
    // La cola es decorativa. Ambas escalas comparten la física ya validada.
    this.setOrigin(0.5, 1 - 8 / height);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(10, 16, false);
    body.setOffset(height - 5, height - 16);
    body.updateFromGameObject();
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
    this.health = COMBAT.playerHealth;
    this.invulnerableUntil = this.scene.time.now + COMBAT.invulnerability;
    this.setAlpha(1);
    this.scene.game.events.emit('player-health', this.health);
  }
}
