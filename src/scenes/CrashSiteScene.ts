import Phaser from 'phaser';
import { CAMERA, COMBAT, WORLD } from '../config/game';
import { PLAYER_ANIMATIONS, PLAYER_FRAME, PLAYER_SHEETS } from '../config/playerAnimations';
import {
  CRASH_SITE as LEVEL, TERMINAL_DIALOGUE, TERMINAL_REMINDER,
  HATCH_DIALOGUE, HATCH_AFTER_DIAGNOSIS, EXIT_BEFORE_DIAGNOSIS,
} from '../data/crashSite';
import { Player } from '../entities/Player';
import { DialogueSystem } from '../systems/DialogueSystem';
import { buildCrashSite } from '../world/buildCrashSite';

export class CrashSiteScene extends Phaser.Scene {
  private player!: Player;
  private dialogue!: DialogueSystem;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private restartKey!: Phaser.Input.Keyboard.Key;
  private collisionOutline!: Phaser.GameObjects.Graphics;
  private showCollision = false;
  private diagnosed = false;
  private completed = false;
  private lastHint = '';

  constructor() {
    super('CrashSiteScene');
  }

  preload(): void {
    const base = import.meta.env.BASE_URL;
    for (const sheet of PLAYER_SHEETS) {
      this.load.spritesheet(sheet.key, base + 'assets/sprites/' + sheet.file, {
        frameWidth: PLAYER_FRAME.width, frameHeight: PLAYER_FRAME.height,
      });
    }
    this.load.image('crash-background', base + 'assets/levels/crash-site/background.png');
    this.load.image('crashed-ship', base + 'assets/levels/crash-site/ship.png');
  }

  create(): void {
    this.diagnosed = false;
    this.completed = false;
    this.lastHint = '';
    this.showCollision = Boolean(this.game.registry.get('show-collision'));
    this.physics.resume();
    this.game.events.emit('screen-change', 'playing');
    this.game.events.emit('level-title', '1.1 / La nave destruida');
    this.game.events.emit('player-health', COMBAT.playerHealth);
    this.game.events.emit('objective-change', 'Revisa el terminal de la nave.');
    this.game.events.emit('controls-change', 'A / D o flechas: moverse · Espacio o ↑: saltar · E: interactuar · R: reiniciar sección');

    const camera = this.cameras.main;
    camera.setBackgroundColor('#07121f');
    camera.setBounds(0, CAMERA.top, LEVEL.width, WORLD.height);
    this.physics.world.setBounds(0, CAMERA.top, LEVEL.width, LEVEL.height - CAMERA.top);
    this.physics.world.setBoundsCollision(true, true, true, false);
    const platforms = buildCrashSite(this);

    for (const animation of PLAYER_ANIMATIONS) {
      if (this.anims.exists(animation.key)) continue;
      this.anims.create({
        key: animation.key,
        frames: this.anims.generateFrameNumbers(animation.texture, {
          start: animation.start, end: animation.end,
        }),
        frameRate: animation.frameRate, repeat: animation.repeat,
      });
    }

    this.player = new Player(this, LEVEL.spawn.x, LEVEL.spawn.y);
    this.player.setDepth(10);
    this.physics.add.collider(this.player, platforms);
    camera.startFollow(this.player, true);
    camera.setDeadzone(CAMERA.deadzoneWidth, WORLD.height);
    this.dialogue = new DialogueSystem(this);
    this.collisionOutline = this.add.graphics().setDepth(20);
    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('KORA requiere entrada de teclado.');
    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.restartKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    const collision = (visible: boolean): void => { this.showCollision = visible; };
    const replay = (): void => { if (this.completed) this.scene.restart(); };
    const menu = (): void => { if (this.completed) this.scene.start('MenuScene'); };
    this.game.events.on('player-collision', collision);
    this.game.events.on('retry-section', replay);
    this.game.events.on('return-menu', menu);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.dialogue.destroy();
      this.game.events.emit('interaction-hint', '');
      this.game.events.off('player-collision', collision);
      this.game.events.off('retry-section', replay);
      this.game.events.off('return-menu', menu);
    });
  }

  update(time: number): void {
    if (this.completed) return;
    const restart = Phaser.Input.Keyboard.JustDown(this.restartKey);
    const interact = Phaser.Input.Keyboard.JustDown(this.interactKey);
    if (restart && !this.dialogue.active) {
      this.scene.restart();
      return;
    }

    if (this.dialogue.active) {
      const next = Phaser.Input.Keyboard.JustDown(this.spaceKey);
      this.player.update(time, false);
      this.hint('');
      if (interact || next) this.dialogue.advance();
    } else {
      this.player.update(time);
      this.updateInteraction(interact);
    }

    if (this.player.y > LEVEL.height) {
      this.player.respawn(LEVEL.spawn.x, LEVEL.spawn.y);
      this.cameras.main.stopFollow();
      this.cameras.main.setScroll(0, CAMERA.top);
      this.cameras.main.startFollow(this.player, true);
    }

    this.collisionOutline.clear();
    if (this.showCollision) {
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      this.collisionOutline.lineStyle(1, 0xff4fbd);
      this.collisionOutline.strokeRect(body.x, body.y, body.width, body.height);
    }
  }

  private near(target: { x: number; y: number }): boolean {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    return body.blocked.down && Math.abs(this.player.x - target.x) < 36 &&
      Math.abs(body.bottom - target.y) < 20;
  }

  private updateInteraction(interact: boolean): void {
    if (this.near(LEVEL.terminal)) {
      this.hint('E · Revisar terminal');
      if (interact) {
        this.player.setVelocityX(0);
        this.dialogue.start(this.diagnosed ? TERMINAL_REMINDER : TERMINAL_DIALOGUE, () => {
          this.diagnosed = true;
          this.game.events.emit('objective-change', 'Busca energía fuera del cráter. Sigue el camino al este.');
        });
        this.hint('');
      }
    } else if (this.near(LEVEL.hatch)) {
      this.hint('E · Examinar compuerta');
      if (interact) {
        this.player.setVelocityX(0);
        this.dialogue.start(this.diagnosed ? HATCH_AFTER_DIAGNOSIS : HATCH_DIALOGUE);
        this.hint('');
      }
    } else if (this.near(LEVEL.exit)) {
      this.hint('E · Seguir hacia el primer contacto');
      if (interact) {
        this.player.setVelocityX(0);
        if (!this.diagnosed) {
          this.dialogue.start(EXIT_BEFORE_DIAGNOSIS);
          this.hint('');
        } else {
          this.completeSection();
        }
      }
    } else if (this.player.x > 350 && this.player.x < 650) {
      this.hint('Espacio o ↑ · Salta para subir por las rocas');
    } else if (this.player.x > 760 && this.player.x < 890) {
      this.hint('Puedes saltar la grieta o salir de ella con otro salto');
    } else if (!this.diagnosed && this.player.x < 350) {
      this.hint('A / D o ← → · Explora el lugar del accidente');
    } else {
      this.hint('');
    }
  }

  private hint(text: string): void {
    if (text === this.lastHint) return;
    this.lastHint = text;
    this.game.events.emit('interaction-hint', text);
  }

  private completeSection(): void {
    this.completed = true;
    this.player.setVelocity(0, 0);
    this.player.play('player-idle');
    this.physics.pause();
    this.hint('');
    this.game.events.emit('screen-change', 'section-end');
  }
}
