/** Ajusta el lienzo y el HUD juntos, conservando la proporción del juego. */
export function setupDisplay(): void {
  const frame = document.querySelector<HTMLDivElement>('#game-frame');
  const surface = document.querySelector<HTMLDivElement>('#game-surface');
  const button = document.querySelector<HTMLButtonElement>('#fullscreen-button');
  const message = document.querySelector<HTMLParagraphElement>('#display-message');
  if (!frame || !surface || !button || !message) {
    throw new Error('Faltan elementos de presentación del juego.');
  }

  const fit = (): void => {
    const width = Math.floor(Math.min(frame.clientWidth, frame.clientHeight * 16 / 9));
    surface.style.width = width + 'px';
    surface.style.height = width * 9 / 16 + 'px';
  };
  const observer = new ResizeObserver(fit);
  observer.observe(frame);
  fit();

  const syncButton = (): void => {
    const expanded = document.fullscreenElement === frame || frame.classList.contains('is-expanded');
    button.textContent = document.fullscreenElement === frame
      ? 'Salir de pantalla completa (Esc)'
      : expanded ? 'Salir de vista ampliada (Esc)' : 'Pantalla completa';
    if (!expanded) message.textContent = '';
    button.setAttribute('aria-pressed', String(expanded));
  };

  button.addEventListener('click', async () => {
    button.blur();
    button.disabled = true;
    message.textContent = '';
    try {
      if (document.fullscreenElement === frame) {
        await document.exitFullscreen();
      } else if (frame.classList.contains('is-expanded')) {
        frame.classList.remove('is-expanded');
      } else if (document.fullscreenEnabled) {
        try {
          await frame.requestFullscreen();
        } catch {
          frame.classList.add('is-expanded');
          message.textContent = 'Vista ampliada: el navegador no permitió ocultar sus barras.';
        }
      } else {
        frame.classList.add('is-expanded');
        message.textContent = 'Vista ampliada dentro del navegador.';
      }
    } catch {
      message.textContent = 'No se pudo cambiar la presentación. Prueba con Esc.';
    } finally {
      button.disabled = false;
      syncButton();
    }
  });

  document.addEventListener('fullscreenchange', syncButton);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && frame.classList.contains('is-expanded')) {
      frame.classList.remove('is-expanded');
      syncButton();
    }
  });
}
