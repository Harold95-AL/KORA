import Phaser from 'phaser';
import { PROLOGUE_PANELS, PROLOGUE_PANEL_DURATION } from '../data/prologue';

type Screen = 'menu' | 'prologue' | 'playing';

function element<T extends HTMLElement>(selector: string): T {
  const target = document.querySelector<T>(selector);
  if (!target) throw new Error('Falta un elemento de interfaz: ' + selector);
  return target;
}

/** Texto y arte a resolución de pantalla; Phaser gestiona escenas y tiempos. */
export function setupFrontEnd(game: Phaser.Game): void {
  const menu = element<HTMLElement>('#main-menu');
  const prologue = element<HTMLElement>('#prologue');
  const hud = element<HTMLElement>('.game-hud');
  const play = element<HTMLButtonElement>('#play-button');
  const skip = element<HTMLButtonElement>('#skip-prologue');
  const image = element<HTMLImageElement>('#prologue-image');
  const chapter = element<HTMLElement>('#prologue-chapter');
  const counter = element<HTMLElement>('#prologue-counter');
  const progress = element<HTMLElement>('#prologue-progress');
  const base = import.meta.env.BASE_URL;
  let imageTransition: Animation | undefined;
  let progressTransition: Animation | undefined;

  // Precarga las viñetas mientras se muestra el menú.
  for (const panel of PROLOGUE_PANELS) {
    const preload = new Image();
    preload.src = base + 'assets/prologue/' + panel.image;
  }

  game.events.on('screen-change', (screen: Screen) => {
    document.body.dataset.screen = screen;
    menu.hidden = screen !== 'menu';
    prologue.hidden = screen !== 'prologue';
    hud.hidden = screen !== 'playing';
    if (screen === 'menu') {
      play.disabled = false;
      play.focus({ preventScroll: true });
    }
    if (screen !== 'prologue') {
      imageTransition?.cancel();
      progressTransition?.cancel();
    }
  });

  play.addEventListener('click', () => {
    if (play.disabled) return;
    play.disabled = true;
    play.blur();
    game.events.emit('play-game');
  });
  skip.addEventListener('click', () => {
    skip.blur();
    game.events.emit('skip-prologue');
  });

  game.events.on('prologue-panel', (index: number) => {
    const panel = PROLOGUE_PANELS[index];
    if (!panel) return;
    image.src = base + 'assets/prologue/' + panel.image;
    image.alt = panel.description;
    chapter.textContent = panel.chapter;
    counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + PROLOGUE_PANELS.length;
    imageTransition?.cancel();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      imageTransition = image.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 650, easing: 'ease-out', fill: 'both' },
      );
    }
    progressTransition?.cancel();
    progressTransition = progress.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: PROLOGUE_PANEL_DURATION, fill: 'both' },
    );
  });
}
