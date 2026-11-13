import Phaser from 'phaser';
import { PLAYER } from '../config/game';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly leftKey: Phaser.Input.Keyboard.Key;
  private readonly rightKey: Phaser.Input.Keyboard.Key;
  private readonly jumpKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error('KORA requiere entrada de teclado.');
    this.cursors = keyboard.createCursorKeys();
    this.leftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.rightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.jumpKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update(): void {
    const left = this.cursors.left.isDown || this.leftKey.isDown;
    const right = this.cursors.right.isDown || this.rightKey.isDown;
    this.setVelocityX((Number(right) - Number(left)) * PLAYER.speed);

    // Consumir ambas pulsaciones evita un salto pendiente al aterrizar.
    const upPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const spacePressed = Phaser.Input.Keyboard.JustDown(this.jumpKey);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if ((upPressed || spacePressed) && body.blocked.down) {
      this.setVelocityY(-PLAYER.jumpSpeed);
    }
  }
}
