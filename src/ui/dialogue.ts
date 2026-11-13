import Phaser from 'phaser';
import type { DialogueView } from '../systems/DialogueSystem';

export function setupDialogueUI(game: Phaser.Game): void {
  const box = document.querySelector<HTMLElement>('#dialogue-box');
  const speaker = document.querySelector<HTMLElement>('#dialogue-speaker');
  const text = document.querySelector<HTMLElement>('#dialogue-text');
  const counter = document.querySelector<HTMLElement>('#dialogue-counter');
  const next = document.querySelector<HTMLButtonElement>('#dialogue-next');
  const hint = document.querySelector<HTMLElement>('#interaction-hint');
  const area = document.querySelector<HTMLElement>('#game');
  if (!box || !speaker || !text || !counter || !next || !hint || !area) {
    throw new Error('Faltan los elementos del diálogo.');
  }

  game.events.on('dialogue-change', (view: DialogueView | null) => {
    const wasOpen = !box.hidden;
    box.hidden = !view;
    if (view) {
      speaker.textContent = view.speaker;
      text.textContent = view.text;
      counter.textContent = view.index + ' / ' + view.total;
      next.textContent = view.index === view.total ? 'Cerrar · E / Espacio' : 'Continuar · E / Espacio';
      hint.hidden = true;
      if (!wasOpen) next.focus({ preventScroll: true });
    } else if (wasOpen) {
      area.focus({ preventScroll: true });
    }
  });

  next.addEventListener('click', () => game.events.emit('dialogue-next'));
  next.addEventListener('keydown', (event) => {
    if (![' ', 'Enter', 'e', 'E'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (!event.repeat) game.events.emit('dialogue-next');
  });

  game.events.on('interaction-hint', (message: string) => {
    hint.textContent = message;
    hint.hidden = !message || !box.hidden;
  });
  game.events.on('screen-change', (screen: string) => {
    if (screen !== 'playing') {
      box.hidden = true;
      hint.hidden = true;
    }
  });
}
