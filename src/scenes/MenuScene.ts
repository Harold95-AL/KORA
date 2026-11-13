import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#07121f');
    this.game.events.emit('screen-change', 'menu');
    const play = (): void => {
      this.scene.start('PrologueScene');
    };
    this.game.events.once('play-game', play);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('play-game', play);
    });
  }
}
