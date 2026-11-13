import Phaser from 'phaser';
import { WORLD } from '../config/game';
import { PROTOTYPE_LEVEL as LEVEL } from '../data/prototypeLevel';
import { Player } from '../entities/Player';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private restartKey!: Phaser.Input.Keyboard.Key;
  private status!: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  create(): void {
    const camera = this.cameras.main;
    camera.setBackgroundColor('#081522');
    camera.setBounds(0, 0, LEVEL.width, WORLD.height);
    this.physics.world.setBounds(0, 0, LEVEL.width, LEVEL.height);
    // El borde inferior queda abierto para detectar caídas en los huecos.
    this.physics.world.setBoundsCollision(true, true, true, false);

    const scenery = this.add.graphics();
    for (let x = 20; x < LEVEL.width; x += 90) {
      scenery.fillStyle(0x102c3d);
      scenery.fillTriangle(x, 156, x + 25, 62 + (x % 35), x + 50, 156);
      scenery.fillStyle(0x185364);
      scenery.fillTriangle(x + 58, 156, x + 65, 130, x + 72, 156);
    }

    if (!this.textures.exists('player')) {
      const texture = this.add.graphics();
      texture.fillStyle(0x80f5e4);
      texture.fillRect(0, 0, 10, 16);
      texture.fillStyle(0x14384c);
      texture.fillRect(5, 3, 5, 4);
      texture.generateTexture('player', 10, 16);
      texture.destroy();
    }

    const platforms = this.physics.add.staticGroup();
    for (const platform of LEVEL.platforms) {
      const surface = this.add.rectangle(
        platform.x + platform.width / 2,
        platform.top + platform.height / 2,
        platform.width, platform.height, 0x204856,
      );
      platforms.add(surface);
      this.add.rectangle(
        platform.x + platform.width / 2, platform.top + 1,
        platform.width, 2, 0x48c9c1,
      );
    }

    this.player = new Player(this, LEVEL.spawn.x, LEVEL.spawn.y);
    this.physics.add.collider(this.player, platforms);
    camera.startFollow(this.player, true);
    camera.setDeadzone(70, WORLD.height);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('KORA requiere entrada de teclado.');
    this.restartKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.add.text(12, 10, 'KORA / RECORRIDO DE PRUEBA', {
      fontFamily: 'monospace', fontSize: '8px', color: '#80f5e4',
    }).setScrollFactor(0).setDepth(10);
    this.status = this.add.text(12, 23, 'Avanza hacia la derecha', {
      fontFamily: 'monospace', fontSize: '8px', color: '#c6e7ed',
    }).setScrollFactor(0).setDepth(10);

    this.add.rectangle(928, 132, 2, 48, 0x80f5e4);
    this.add.triangle(936, 114, 0, 0, 16, 6, 0, 12, 0x80f5e4);
  }

  update(): void {
    this.player.update();

    if (this.player.y > LEVEL.height || Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.player.setPosition(LEVEL.spawn.x, LEVEL.spawn.y);
      this.player.setVelocity(0, 0);
      this.cameras.main.stopFollow();
      this.cameras.main.setScroll(0, 0);
      this.cameras.main.startFollow(this.player, true);
    }

    this.status.setText(
      this.player.x >= 910
        ? 'Recorrido completado / R: repetir'
        : 'Avanza hacia la derecha / R: reiniciar',
    );
  }
}
