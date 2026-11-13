import Phaser from 'phaser';
import type { DialogueLine } from '../data/crashSite';

export interface DialogueView extends DialogueLine {
  index: number;
  total: number;
}

export class DialogueSystem {
  private lines: readonly DialogueLine[] = [];
  private index = 0;
  private onComplete?: () => void;
  private readonly scene: Phaser.Scene;
  private readonly onNext = (): void => this.advance();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    scene.game.events.on('dialogue-next', this.onNext);
  }

  get active(): boolean {
    return this.index < this.lines.length;
  }

  start(lines: readonly DialogueLine[], onComplete?: () => void): void {
    if (this.active || lines.length === 0) return;
    this.lines = lines;
    this.index = 0;
    this.onComplete = onComplete;
    this.publish();
  }

  advance(): void {
    if (!this.active) return;
    this.index += 1;
    if (this.active) {
      this.publish();
    } else {
      const complete = this.onComplete;
      this.onComplete = undefined;
      this.lines = [];
      this.scene.game.events.emit('dialogue-change', null);
      complete?.();
    }
  }

  private publish(): void {
    const line = this.lines[this.index];
    this.scene.game.events.emit('dialogue-change', {
      ...line, index: this.index + 1, total: this.lines.length,
    } satisfies DialogueView);
  }

  destroy(): void {
    this.scene.game.events.off('dialogue-next', this.onNext);
    this.scene.game.events.emit('dialogue-change', null);
    this.lines = [];
    this.onComplete = undefined;
  }
}
