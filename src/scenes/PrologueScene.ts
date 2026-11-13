import Phaser from 'phaser';
import { PROLOGUE_PANELS, PROLOGUE_PANEL_DURATION } from '../data/prologue';

export class PrologueScene extends Phaser.Scene {
  private panelIndex = 0;
  private finished = false;
  private panelTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super('PrologueScene');
  }

  create(): void {
    this.panelIndex = 0;
    this.finished = false;
    this.cameras.main.setBackgroundColor('#02070c');
    this.game.events.emit('screen-change', 'prologue');
    const skip = (): void => this.finish();
    const next = (event: KeyboardEvent): void => {
      if (!event.repeat) this.advance();
    };
    this.game.events.once('skip-prologue', skip);
    this.input.keyboard?.on('keydown-SPACE', next);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.panelTimer?.remove(false);
      this.game.events.off('skip-prologue', skip);
      this.input.keyboard?.off('keydown-SPACE', next);
    });
    this.showPanel();
  }

  private showPanel(): void {
    this.game.events.emit('prologue-panel', this.panelIndex);
    this.panelTimer = this.time.delayedCall(PROLOGUE_PANEL_DURATION, () => this.advance());
  }

  private advance(): void {
    if (this.finished) return;
    this.panelTimer?.remove(false);
    this.panelIndex += 1;
    if (this.panelIndex >= PROLOGUE_PANELS.length) {
      this.finish();
    } else {
      this.showPanel();
    }
  }

  private finish(): void {
    if (this.finished || !this.scene.isActive()) return;
    this.finished = true;
    this.panelTimer?.remove(false);
    this.scene.start('CrashSiteScene');
  }
}
