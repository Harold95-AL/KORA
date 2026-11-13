import Phaser from 'phaser';
import { WORLD } from '../config/game';
import { Player } from '../entities/Player';

export class GameScene extends Phaser.Scene {
  private player!: Player;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#081522');
    this.physics.world.setBounds(0, 0, WORLD.width, WORLD.height);

    // Geometría provisional: sin recursos externos ni efectos costosos.
    const scenery = this.add.graphics();
    scenery.fillStyle(0x102c3d);
    scenery.fillTriangle(180, 156, 205, 58, 230, 156);
    scenery.fillTriangle(222, 156, 247, 94, 272, 156);
    scenery.fillStyle(0x185364);
    scenery.fillTriangle(28, 156, 35, 126, 42, 156);
    scenery.fillTriangle(280, 156, 288, 119, 296, 156);

    const texture = this.add.graphics();
    texture.fillStyle(0x80f5e4);
    texture.fillRect(0, 0, 10, 16);
    texture.fillStyle(0x14384c);
    texture.fillRect(5, 3, 5, 4);
    texture.generateTexture('player', 10, 16);
    texture.destroy();

    const ground = this.add.rectangle(160, 168, 320, 24, 0x204856);
    this.physics.add.existing(ground, true);
    this.add.rectangle(160, 157, 320, 2, 0x48c9c1);

    this.player = new Player(this, 56, 130);
    this.physics.add.collider(this.player, ground);
    this.add.text(12, 12, 'KORA', {
      fontFamily: 'monospace', fontSize: '12px', color: '#80f5e4',
    });
  }

  update(): void {
    this.player.update();
  }
}
