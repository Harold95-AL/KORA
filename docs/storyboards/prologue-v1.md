# Menú y prólogo — primera integración

## Flujo actual
MenuScene → PrologueScene → GameScene (recorrido de prueba).
La sección 1.1, La nave destruida, todavía no está construida.
El recorrido sigue siendo un entorno de pruebas y no se presenta como nivel final.

## Menú principal
Fondo tomado de la viñeta del impacto aportada por el usuario.
Título KORA, botón Jugar y opciones Continuar, Ajustes y Créditos.
Solo Jugar está habilitado. Las otras opciones son visuales y están
deshabilitadas semánticamente: no tienen comportamiento ni guardado.
Pantalla completa sigue disponible como control de presentación.

El menú tiene su propia escena de Phaser; el mundo, enemigos, salud y
cronómetro de juego no se ejecutan detrás del menú ni del prólogo.
La interfaz y los dibujos se presentan en HTML a resolución de pantalla.

## Prólogo provisional
Fuentes originales aportadas:
- KORA_ Señal del planeta cristalino.png.
- Kora_ El impacto cristalino.png.

Copias conservadas en docs/storyboards/prologue-{signal,impact}-source.png.
Se extrajeron cinco viñetas de cada lámina, sin regenerar los dibujos.
Recursos: public/assets/prologue/panel-01.png a panel-10.png.
Los textos impresos en las ilustraciones se conservan, incluidos los
rótulos de cierre de las láminas; podrán editarse al pulir el prólogo.

Diez imágenes, seis segundos cada una: duración automática aproximada de
un minuto, contando tiempo activo de la escena.
Cada imagen aparece con un fundido breve. No hay zoom que corte los diálogos.
Se respeta la proporción de cada viñeta mediante bandas oscuras.
La preferencia de movimiento reducido desactiva el fundido.

Espacio pasa a la siguiente viñeta y reinicia sus seis segundos.
Omitir prólogo entra directamente al recorrido de prueba.
Al terminar la última viñeta se entra automáticamente al recorrido.
Por ahora no hay música, voces ni efectos de sonido.

## Archivos
- src/scenes/MenuScene.ts: arranque y acción Jugar.
- src/scenes/PrologueScene.ts: tiempos, avance y transición al juego.
- src/data/prologue.ts: orden, imágenes y descripciones.
- src/ui/frontEnd.ts: menú HTML, imágenes, fundidos y progreso.
- src/main.ts: registro de escenas y conexión de la interfaz.
- index.html / src/style.css: presentación de menú y cinematografía.

## Verificación manual
Recargar abre el menú. No debe aparecer ni moverse el jugador detrás.
Jugar inicia el prólogo una sola vez. Continuar, Ajustes y Créditos no actúan.
Dejar transcurrir aproximadamente un minuto entra al recorrido.
Espacio avanza una viñeta; mantenerlo pulsado no debe saltarlas todas.
Omitir entra al recorrido sin esperar. El HUD se muestra solo al jugar.
Comprobar pantalla completa, salida con Esc y controles del personaje.

## Alcance narrativo
Estas láminas son el storyboard provisional aportado por el usuario.
Esta integración no decide el nombre del protagonista, los detalles de su
especie ni el origen definitivo de la señal o de la anomalía.

Verificado en navegador durante esta integración:
- Menú inicial y tres opciones deshabilitadas.
- Jugar inicia la primera viñeta.
- Avance automático hasta el recorrido al terminar el prólogo.
- Espacio avanza de 01 a 02.
- Omitir prólogo entra al recorrido y muestra el HUD.
- Recargar vuelve al menú.
- Build de TypeScript y Vite correcto.
