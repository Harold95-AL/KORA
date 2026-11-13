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
Resolución interna 320 × 180, recorrido de 960 px, plataformas sólidas,
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

## Protagonista: carrera a 32 px
Altura elegida: 32 px. Se retiró el selector de 32/40.
Hoja: public/assets/sprites/protagonist-run-v1-32.png, 512 × 32.
Ocho cuadros de 64 × 32, con escala y alineación comunes, a 12 FPS.
La carrera solo se reproduce al moverse en el suelo. Al detenerse o
saltar se usa por ahora el primer cuadro fijo de la misma hoja.
Idle animado y poses propias de salto/caída siguen pendientes.

Se conserva la caja provisional de 10 × 16 para no modificar la
jugabilidad durante la integración gráfica. La cola queda fuera.
Mostrar colisión permite comprobarla. No es la caja corporal definitiva.

Prueba: correr en ambas direcciones, soltar las teclas, saltar y aterrizar,
usar R y comprobar que no aparecen recortes ni saltos de escala entre cuadros.
Documentación del recurso: docs/art/protagonist-run-v1.md.
