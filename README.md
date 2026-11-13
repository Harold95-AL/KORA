# KORA

Videojuego universitario de acción y plataformas 2D para navegador.
Un planeta de cristales y energía, con una aventura corta como objetivo.
Desarrollo incremental: actualmente hay un recorrido y combate de prueba.

## Tecnologías
Phaser 4.2.1, TypeScript 7.0.2 (strict), Vite 8.3.8.
Entorno inicial: Node.js 24 y npm. package-lock.json fija las dependencias.

## Instalación y ejecución
    npm install
    npm run dev

Abrir la dirección local que indique Vite.

## Distribución
    npm run build
    npm run preview

El build comprueba TypeScript y genera dist/. Vite advierte del tamaño del
paquete de Phaser; no impide compilar. No hay filtros ni iluminación costosa.

## Controles
- A / D o flechas: caminar.
- Espacio o flecha arriba: saltar. Soltar y pulsar para volver a saltar.
- J: golpe de energía en la dirección del personaje.
- K: disparo horizontal en la dirección del personaje.
- R: reiniciar el recorrido y restaurar enemigos y salud.

## Prototipo actual
Resolución interna 480 × 270, recorrido de 960 px, plataformas sólidas,
tres huecos, cámara lateral y bandera final. Texto HTML a resolución de
pantalla para conservar la legibilidad.

Los dos ataques son opciones complementarias, sin jerarquía de arma
principal o secundaria. Valores provisionales:
- Golpe: zona cercana de 26 px, 2 de daño, puede alcanzar varios enemigos
  una vez por golpe. Duración 110 ms y recuperación de 320 ms.
- Disparo: 1 de daño, velocidad 260 px/s, duración máxima 700 ms
  (aproximadamente 182 px), recuperación de 320 ms. Desaparece al tocar una
  plataforma o al primer enemigo. Los disparos no atraviesan enemigos.
- Los ataques tienen recuperaciones independientes, sin munición limitada.
- Cuatro enemigos patrullan, con 3 de salud, barra y destello al recibir daño.
- El contacto enemigo quita 1 de salud al jugador, con 900 ms de
  invulnerabilidad y parpadeo. Salud inicial: 3.
- Al caer o perder la salud se restaura la prueba completa desde el inicio.
  Esta regla de prototipo no define todavía el sistema final de vidas
  ni checkpoints. Alcanzar la bandera permite seguir probando.

## Archivos
- src/main.ts: arranque de Phaser y conexión del HUD mediante eventos.
- src/config/game.ts: parámetros de movimiento, resolución y combate.
- src/data/prototypeLevel.ts: posiciones del recorrido y aparición.
- src/scenes/GameScene.ts: construcción del mundo, enemigos y reinicio.
- src/entities/Player.ts: movimiento, orientación, salud e invulnerabilidad.
- src/entities/Enemy.ts: patrulla, salud y respuesta al daño.
- src/systems/CombatSystem.ts: golpe, proyectiles, impactos y limpieza.
- index.html / src/style.css: interfaz nítida y controles.

## Comprobación manual
1. Caminar, saltar, aterrizar y cruzar los huecos sin atravesar el suelo.
2. Golpear cerca con J: dos golpes derrotan a un enemigo; lejos no daña.
3. Disparar con K: tres impactos derrotan a un enemigo; comprobar ambas
   direcciones, impactos en plataformas y expiración de disparos.
4. Combinar J y K. Mantener pulsada una tecla no repite el ataque.
5. Tocar un enemigo: comprobar daño, parpadeo y protección breve.
6. Perder toda la salud, caer o pulsar R: regresar al inicio con salud 3,
   enemigos restaurados y sin proyectiles ni golpes activos.
7. Llegar a la bandera y reiniciar: el mensaje debe actualizarse.
8. Redimensionar la ventana: texto legible y proporción del juego conservada.

## Decisiones y siguiente hito
Confirmados: Phaser 4 y combate cercano y a distancia con utilidad propia.
Los números, reglas finales de muerte y diseño de enemigos son provisionales.
Siguiente paso: evaluar alcance, ritmo y claridad de los dos ataques antes
de incorporar más contenido. Vidas, checkpoints y narrativa vendrán después.

## GitHub
https://github.com/Harold95-AL/KORA

Los avances se guardan en commits locales. Publicar solo con autorización:

    git push origin master

.gitignore excluye node_modules, dist, .env, claves y temporales.
No introducir secretos en archivos versionados.

## Protagonista: animaciones a 32 px
Reposo cíclico, carrera, ascenso, caída provisional y aterrizaje.
Todas las hojas usan cuadros de 64 × 32 y transparencia limpia.
Los cuadros de caída provienen de la segunda mitad de la hoja de salto;
la postura extendida definitiva sigue pendiente.

Las animaciones se eligen por apoyo y velocidad del personaje.
El aterrizaje dura 150 ms y se interrumpe al correr o volver a saltar,
sin bloquear controles ni modificar la física.
Se conserva la caja temporal de 10 × 16, con la cola fuera.

Configuración: src/config/playerAnimations.ts.
Recursos: public/assets/sprites/protagonist-{idle,run,jump,land}-v1-32.png.
Fuentes y detalles: docs/art/protagonist-motion-v1.md.
El selector de escala anterior fue retirado: se eligieron 32 px.

Probar reposo, carrera a ambos lados, salto parado/en movimiento, caída
desde una plataforma, aterrizaje y salto inmediato, reinicio en el aire
y ambos ataques. Mostrar colisión permite inspeccionar la caja temporal.

## Presentación y pantalla completa
La vista normal usa el espacio disponible de la ventana, sin límite de
960 px. El escenario y el HUD se ajustan juntos a 16:9 sin deformación.
La resolución interna sigue siendo 480 × 270; ampliar la presentación
no cambia el tamaño del mundo ni el área visible de la cámara.

Botón Pantalla completa en la esquina superior derecha del juego.
Esc o el botón de salida vuelven a la vista normal. La solicitud nativa
se realiza al pulsar el botón, como exige el navegador. Si no está
disponible o se rechaza, se usa una vista ampliada dentro de la ventana.
Las bandas oscuras conservan la proporción en pantallas de otro formato.
El HUD y el botón de salida permanecen dentro del contenedor ampliado.

Implementación: src/ui/display.ts, index.html y src/style.css.
ResizeObserver ajusta el área del juego al cambiar la ventana o el modo.
Phaser conserva su escala FIT y el pixel art utiliza image-rendering:
pixelated. No se aumenta el coste de la resolución interna del juego.

Prueba manual: entrar/salir varias veces, salir con Esc, redimensionar
la ventana y comprobar HUD, salto y controles después del cambio.
Comprobado en navegador integrado: vista ampliada, entrada a pantalla
completa y alternativa cuando el navegador la rechaza, salida con Esc.

## Encuadre más alejado
Resolución interna actual: 480 × 270, relación 16:9.
Los sprites conservan su escala de 32 px: el personaje ocupa aproximadamente
un tercio menos de altura de pantalla frente al encuadre anterior de 320 × 180.
Se ve un 50 % más de mundo horizontal y verticalmente.

Cámara: límite superior -64 y zona horizontal de seguimiento de 105 px.
El suelo queda en la parte inferior del encuadre; las plataformas conservan
sus coordenadas y distancias. El límite físico superior se amplió para
acompañar al encuadre. El fondo provisional cubre el área adicional.
El salto, velocidad, ataques, colisiones y resolución de las hojas de sprites
no se modifican. La interfaz HTML sigue a resolución de pantalla.

La presentación mantiene pantalla completa y bandas según la proporción.
Se comprobó build, encuadre y salto en navegador.

## Inicio de partida y prólogo
Al abrir el juego aparece el menú principal.
Solo Jugar está habilitado; Continuar, Ajustes y Créditos son opciones
visuales deshabilitadas. No existe guardado de partida todavía.

Jugar inicia las diez viñetas del prólogo aportadas por el usuario:
seis segundos por imagen, duración automática aproximada de un minuto.
Espacio avanza una viñeta y Omitir prólogo entra directamente al recorrido.
El HUD y las físicas del recorrido solo se activan al terminar el prólogo.

La presentación usa fundidos sencillos, proporción completa de cada viñeta
y texto a resolución de pantalla. No hay audio aún.
La salida actual es el recorrido de prueba, hasta construir la sección 1.1.
Recargar vuelve al menú. Detalles y fuentes: docs/storyboards/prologue-v1.md.
