# KORA

Videojuego universitario de acción y plataformas 2D para navegador.
Exploración de un planeta de cristales y energía, desde el accidente de
una nave hasta el núcleo. Un jugador, controles de teclado y alcance
reducido con desarrollo incremental.

## Tecnologías
- Phaser 4.2.1: renderizado, escenas, cámara y Arcade Physics.
- TypeScript 7.0.2 con strict.
- Vite 8.3.8: desarrollo y distribución.
- Git y GitHub.
- Resolución interna: 480 × 270, formato 16:9.
- Protagonista de 32 px de altura.
Tiled y LocalStorage están previstos; todavía no forman parte del flujo actual.

## Instalar y ejecutar
Entorno utilizado: Node.js 24 y npm.

    npm install
    npm run dev

Abrir la dirección local indicada por Vite.
package-lock.json fija las dependencias.

## Compilar y previsualizar
    npm run build
    npm run preview

El build comprueba TypeScript y genera dist/.
Vite avisa del tamaño del paquete de Phaser; la compilación termina
correctamente. No se añaden efectos gráficos costosos.

## Flujo actual
1. Menú principal: Jugar está habilitado. Continuar, Ajustes y Créditos
   son opciones visuales deshabilitadas.
2. Prólogo: diez viñetas, seis segundos cada una. Espacio avanza y
   Omitir prólogo permite entrar directamente a la primera sección.
3. Sección 1.1, La nave destruida: nave dañada, terminal, diagnóstico,
   compuerta bloqueada y recorrido inicial.
4. Salida del cráter: cierre provisional con Repetir sección y Volver
   al menú. La siguiente sección, 1.2 El primer contacto, está pendiente.

## Controles de 1.1
- A / D o flechas izquierda / derecha: caminar.
- Espacio o flecha arriba: saltar.
- E: interactuar cerca de terminal, compuerta y salida.
- E, Espacio o botón: avanzar/cerrar diálogo.
- R: reiniciar sección fuera de los diálogos.
- Pantalla completa: botón superior derecho; Esc sale.
- Mostrar colisión: revela la caja temporal del cuerpo, sin cola.

El diagnóstico del terminal debe completarse antes de abandonar el cráter.
La compuerta permanece bloqueada; la salida está por el sendero al este.
Los diálogos detienen el movimiento. La grieta es poco profunda y permite
volver a subir mediante salto.
No hay enemigos ni ataques en esta sección de introducción.

## Presentación
La vista aprovecha la ventana y conserva 16:9. En pantallas de otro formato
aparecen bandas para no deformar los sprites. Si el navegador rechaza
pantalla completa, se ofrece una vista ampliada dentro de la ventana.
La interfaz HTML mantiene texto nítido a resolución de pantalla.

Animaciones: reposo, carrera, ascenso, caída provisional y aterrizaje.
El aterrizaje se interrumpe al correr o saltar sin bloquear controles.
La caída usa provisionalmente poses de la hoja de salto.
La colisión corporal definitiva sigue pendiente; la actual mide 10 × 16.

## Organización principal
- src/main.ts: arranque y registro de escenas.
- src/scenes/MenuScene.ts: menú inicial.
- src/scenes/PrologueScene.ts: secuencia de viñetas y transición.
- src/scenes/CrashSiteScene.ts: sección 1.1.
- src/data/crashSite.ts: recorrido y textos del diagnóstico.
- src/world/buildCrashSite.ts: terreno y objetos del accidente.
- src/systems/DialogueSystem.ts: conversaciones.
- src/ui/dialogue.ts: interfaz y controles de diálogo.
- src/entities/Player.ts: movimiento, animaciones y salud.
- src/config/: parámetros y definición de animaciones.
- public/assets/: recursos gráficos que consume el juego.
- docs/: decisiones, fuentes gráficas y verificaciones.

El prototipo anterior de combate se conserva en GameScene, Enemy y
CombatSystem. Incluye ataques cercano y a distancia, patrullas, salud y
daño. No se inicia desde el menú; servirá de base para la sección 1.2.

## Comprobación manual
Iniciar partida, omitir o completar prólogo, leer el terminal, examinar
la compuerta, recorrer las plataformas y salir por el este.
Comprobar que los diálogos no provocan saltos al cerrarse.
Probar R, Repetir sección, Volver al menú y pantalla completa.

Detalles de comprobaciones realizadas:
- docs/levels/1.1-crash-site.md
- docs/storyboards/prologue-v1.md
- docs/art/protagonist-motion-v1.md

## Siguiente hito
Probar y pulir 1.1. Después, 1.2 El primer contacto: introducir combate,
primer enemigo y checkpoint. Vidas, cronómetro, guardado y audio todavía
están pendientes. No hay persistencia ni autenticación.

## Repositorio
https://github.com/Harold95-AL/KORA

Los avances se guardan en commits locales; publicar solo con autorización:

    git push origin master

.gitignore excluye node_modules, dist, .env, claves y temporales.
No introducir secretos en archivos versionados.
