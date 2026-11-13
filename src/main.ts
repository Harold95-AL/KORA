import Phaser from 'phaser';
import './style.css';
import { WORLD } from './config/game';
import { GameScene } from './scenes/GameScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: WORLD.width,
  height: WORLD.height,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#081522',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    autoRound: true,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: WORLD.gravity }, debug: false },
  },
  scene: [GameScene],
});
