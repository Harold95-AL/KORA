# Animaciones de movimiento — V1

## Fuentes aportadas por el usuario
- KORA en reposo, hoja de sprites.png: 4 cuadros.
- Animación de aterrizaje de Kora.png: 3 cuadros.
- Seis geckos astronautas en salto.png: 6 cuadros.

Copias originales conservadas en docs/art/protagonist-{idle,land,jump}-v1-source.png.
Se prepararon directamente a partir de los PNG del usuario; no se
regeneraron las poses ni se utilizó un nuevo prompt de imágenes.

## Preparación
Detección de grupos por canal alfa, separación de cuadros, referencia de
altura común dentro de cada hoja y centrado del cuerpo. Reducción por vecino
más cercano. No se estiraron individualmente las poses flexionadas.
Limpieza de residuos de alfa: menos de 128 se vuelve transparente y el resto
opaco, para conservar bordes definidos a resolución baja.

Marcos comunes 64 × 32, cuerpo centrado y espacio lateral para la cola:
- protagonista idle: 256 × 32 (4 cuadros).
- protagonista land: 192 × 32 (3 cuadros).
- protagonista jump: 384 × 32 (6 cuadros).
Archivos: public/assets/sprites/protagonist-{idle,land,jump}-v1-32.png.
La referencia de escala se mantiene en 32 px; poses flexionadas ocupan menos.
Los dibujos de origen tienen pequeñas diferencias entre hojas que podrán
refinarse después de probar las transiciones dentro del juego.

## Reproducción
Configuración central en src/config/playerAnimations.ts:
- Reposo: 4 cuadros a 4 FPS, cíclico.
- Carrera existente: 8 cuadros a 12 FPS, cíclico.
- Ascenso: cuadros 0–2 de jump, 14 FPS, una vez.
- Caída provisional: cuadros 3–5 de jump, 14 FPS, una vez.
- Aterrizaje: 3 cuadros a 20 FPS, una vez (150 ms).

Las secuencias no cíclicas conservan su último cuadro hasta cambiar de estado.
La caída emplea poses de salto: no es todavía una caída extendida definitiva.

Player selecciona la animación según apoyo en el suelo y velocidad vertical.
Al detectar un aterrizaje, reproduce la secuencia si el jugador permanece
quieto. Correr la interrumpe inmediatamente; saltar tiene prioridad sobre
cualquier animación. No se añade demora de control ni se cambia el salto.

Se conserva la caja física temporal de 10 × 16, excluyendo la cola.
El ajuste definitivo de colisiones al cuerpo sigue pendiente.

## Comprobaciones
- TypeScript y build de Vite correctos.
- Revisión en navegador de carga, reposo, salto y aterrizaje.
- Prueba manual recomendada: dejar quieto, correr a ambos lados, saltar
  parado y corriendo, salir de una plataforma, aterrizar y saltar enseguida,
  usar R en el aire y probar ambos ataques.
