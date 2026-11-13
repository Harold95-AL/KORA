# KORA

Prototipo universitario de acción y plataformas 2D para navegador.
Stack confirmado: Phaser 4, TypeScript y Vite.

## Ejecutar
Requiere Node.js compatible con Vite (entorno inicial: Node 24).

    npm install
    npm run dev

Abrir la URL local que indique Vite.

## Compilar
    npm run build
    npm run preview

## Controles
- A / D o flechas izquierda / derecha: caminar.
- Espacio o flecha arriba: saltar al estar en el suelo.
- Soltar y volver a pulsar para otro salto.

## Organización
- src/main.ts: arranque de Phaser, escala y física.
- src/config/game.ts: resolución y parámetros de movimiento.
- src/scenes/GameScene.ts: escenario provisional y colisiones.
- src/entities/Player.ts: entrada y movimiento del personaje.

Resolución inicial provisional: 320 × 180; pixel art nítido y escalado FIT.
Arcade Physics; figuras simples sin iluminación, filtros ni recursos finales.
Salud, vidas, combate, narrativa y checkpoints se implementarán por etapas.
El sistema ofensivo y los detalles narrativos pendientes siguen sin decidirse.

## Comprobación manual
Caminar en ambas direcciones, saltar y aterrizar; comprobar que no se
atraviesa el suelo ni los límites. Mantener salto no debe repetirlo.
Redimensionar la ventana y comprobar que se conserva la proporción.

## Siguiente hito
Añadir plataformas y un recorrido pequeño antes de introducir combate.

## Objetivo y alcance
Crear una aventura corta de acción y plataformas en un planeta de cristales
y energía. Este primer hito implementa únicamente caminar, saltar, gravedad,
suelo y colisiones. Las figuras son provisionales.

## Tecnologías verificadas
Phaser 4.2.1, Vite 8.3.8 y TypeScript 7.0.2.
TypeScript utiliza strict. El archivo package-lock.json fija la instalación.

## Repositorio
https://github.com/Harold95-AL/KORA

Para publicar el commit inicial, tras revisar la identidad de Git:

    git push -u origin HEAD

No incluir secretos en el repositorio. .env.example solo debe contener
valores de ejemplo. No se publica automáticamente desde el proyecto.
