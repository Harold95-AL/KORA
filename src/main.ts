import Phaser from 'phaser';
import './style.css';
import { WORLD, COMBAT } from './config/game';
import { GameScene } from './scenes/GameScene';
import { CrashSiteScene } from './scenes/CrashSiteScene';
import { setupDialogueUI } from './ui/dialogue';
import { MenuScene } from './scenes/MenuScene';
import { PrologueScene } from './scenes/PrologueScene';
import { setupFrontEnd } from './ui/frontEnd';
import { setupDisplay } from './ui/display';

setupDisplay();

const game = new Phaser.Game({
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
  scene: [MenuScene, PrologueScene, CrashSiteScene, GameScene],
});

setupFrontEnd(game);
setupDialogueUI(game);

// La interfaz usa texto del navegador, independiente del lienzo del juego.
const status = document.querySelector<HTMLParagraphElement>('#course-status');
if (!status) throw new Error('No se encontró el estado del recorrido.');

game.events.on('course-status', (completed: boolean) => {
  status.textContent = completed
    ? 'Recorrido completado · R: repetir'
    : 'Avanza hacia la derecha · R: reiniciar';
});

const health = document.querySelector<HTMLParagraphElement>('#player-health');
if (!health) throw new Error('No se encontró el indicador de salud.');
game.events.on('player-health', (value: number) => {
  health.textContent = 'Salud: ' + value + ' / ' + COMBAT.playerHealth;
});

const collisionToggle = document.querySelector<HTMLInputElement>('#show-collision');
if (!collisionToggle) throw new Error('Falta el control de colisión.');
collisionToggle.addEventListener('change', () => {
  game.registry.set('show-collision', collisionToggle.checked);
  game.events.emit('player-collision', collisionToggle.checked);
  collisionToggle.blur();
});

game.events.on('objective-change', (objective: string) => {
  status.textContent = objective;
});
const levelTitle = document.querySelector<HTMLElement>('#level-title');
const controlsHint = document.querySelector<HTMLElement>('#controls-hint');
if (!levelTitle || !controlsHint) throw new Error('Faltan los indicadores del nivel.');
game.events.on('level-title', (title: string) => { levelTitle.textContent = title; });
game.events.on('controls-change', (controls: string) => { controlsHint.textContent = controls; });
