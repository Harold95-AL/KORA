import Phaser from 'phaser';
import { WORLD, CAMERA } from '../config/game';
import { PLAYER_SHEETS, PLAYER_ANIMATIONS, PLAYER_FRAME } from '../config/playerAnimations';
import { PROTOTYPE_LEVEL as LEVEL } from '../data/prototypeLevel';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { CombatSystem } from '../systems/CombatSystem';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private restartKey!: Phaser.Input.Keyboard.Key;
  private completed = false;
  private enemies: Enemy[] = [];
  private combat!: CombatSystem;
  private collisionOutline!: Phaser.GameObjects.Graphics;
  private showCollision = false;

  constructor() {
    super('GameScene');
  }

  preload(): void {
    const base = import.meta.env.BASE_URL;
    for (const sheet of PLAYER_SHEETS) {
      this.load.spritesheet(sheet.key, base + 'assets/sprites/' + sheet.file, {
        frameWidth: PLAYER_FRAME.width, frameHeight: PLAYER_FRAME.height,
      });
    }
  }

  create(): void {
    this.game.events.emit('screen-change', 'playing');
    this.game.events.emit('course-status', false);
    this.completed = false;
    const camera = this.cameras.main;
    camera.setBackgroundColor('#081522');
    camera.setBounds(0, CAMERA.top, LEVEL.width, WORLD.height);
    this.physics.world.setBounds(0, CAMERA.top, LEVEL.width, LEVEL.height - CAMERA.top);
    // El borde inferior queda abierto para detectar caídas en los huecos.
    this.physics.world.setBoundsCollision(true, true, true, false);

    const scenery = this.add.graphics();
    for (let x = 20; x < LEVEL.width; x += 90) {
      scenery.fillStyle(0x0d2231);
      scenery.fillTriangle(x - 35, 156, x + 35, -30 + (x % 55), x + 100, 156);
      scenery.fillStyle(0x102c3d);
      scenery.fillTriangle(x, 156, x + 25, 62 + (x % 35), x + 50, 156);
      scenery.fillStyle(0x185364);
      scenery.fillTriangle(x + 58, 156, x + 65, 130, x + 72, 156);
    }

    for (const [key, width, height, color] of [
      ['enemy', 14, 14, 0xffffff],
      ['shot', 6, 3, 0x80ceff],
    ] as const) {
      if (this.textures.exists(key)) continue;
      const texture = this.add.graphics();
      texture.fillStyle(color);
      texture.fillRect(0, 0, width, height);
      texture.generateTexture(key, width, height);
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

    for (const animation of PLAYER_ANIMATIONS) {
      if (this.anims.exists(animation.key)) continue;
      this.anims.create({
        key: animation.key,
        frames: this.anims.generateFrameNumbers(animation.texture, {
          start: animation.start, end: animation.end,
        }),
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      });
    }
    this.player = new Player(this, LEVEL.spawn.x, LEVEL.spawn.y);
    this.physics.add.collider(this.player, platforms);
    this.enemies = [
      new Enemy(this, 130, 198),
      new Enemy(this, 290, 435),
      new Enemy(this, 540, 684),
      new Enemy(this, 800, 910),
    ];
    this.combat = new CombatSystem(this, this.player, this.enemies, platforms);
    camera.startFollow(this.player, true);
    camera.setDeadzone(CAMERA.deadzoneWidth, WORLD.height);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('KORA requiere entrada de teclado.');
    this.restartKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.collisionOutline = this.add.graphics().setDepth(20);

    const changeCollision = (visible: boolean): void => {
      this.showCollision = visible;
    };
    this.game.events.on('player-collision', changeCollision);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('player-collision', changeCollision);
    });

    this.add.rectangle(928, 132, 2, 48, 0x80f5e4);
    this.add.triangle(936, 114, 0, 0, 16, 6, 0, 12, 0x80f5e4);
  }

  update(time: number): void {
    this.player.update(time);

    this.enemies.forEach((enemy) => enemy.update(time));
    this.combat.update(time);
    for (const enemy of this.enemies) {
      if (enemy.active && this.physics.overlap(this.player, enemy)) {
        this.player.takeDamage(time);
      }
    }

    const restartPressed = Phaser.Input.Keyboard.JustDown(this.restartKey);
    if (this.player.health <= 0 || this.player.y > LEVEL.height || restartPressed) {
      this.player.respawn(LEVEL.spawn.x, LEVEL.spawn.y);
      this.enemies.forEach((enemy) => enemy.resetEnemy());
      this.combat.reset();
      this.cameras.main.stopFollow();
      this.cameras.main.setScroll(0, CAMERA.top);
      this.cameras.main.startFollow(this.player, true);
    }

    this.collisionOutline.clear();
    if (this.showCollision) {
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      this.collisionOutline.lineStyle(1, 0xff4fbd, 1);
      this.collisionOutline.strokeRect(body.x, body.y, body.width, body.height);
    }

    const completed = this.player.x >= 910;
    if (completed !== this.completed) {
      this.completed = completed;
      this.game.events.emit('course-status', completed);
    }
  }
}
