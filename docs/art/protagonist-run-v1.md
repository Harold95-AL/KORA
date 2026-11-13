# Carrera del protagonista — recurso V1

Altura elegida por el usuario: 32 píxeles. Ya no hay selector de escalas.
Se mantienen abiertos el nombre, los detalles de la especie y la función
narrativa del equipamiento.

## Origen y preparación
Entrada del usuario: Sprite de carrera del explorador gecko.png.
Su PNG original tiene transparencia real y ocho poses.
Corrección mediante la herramienta integrada image_gen, conservando identidad
y poses y dando margen al último fotograma. No se usó CLI ni API externa.
Fuente corregida: docs/art/protagonist-run-v1-source.png.
Prompt completo: docs/art/protagonist-run-v1-prompt.txt.

Se detectaron los ocho grupos de píxeles por proyección del canal alfa.
Se utilizó una única altura de referencia para todos los cuadros; no se
estiró cada pose por separado. Reducción por vecino más cercano, conservando
transparencia, alineación horizontal por el cuerpo y línea vertical común.
La pequeña variación natural de las poses se conserva.

Salida: public/assets/sprites/protagonist-run-v1-32.png.
Dimensiones 512 × 32, ocho cuadros de 64 × 32. Márgenes transparentes
a ambos lados permiten reflejar la animación sin desplazar el cuerpo.

## Integración
GameScene carga la hoja y registra una animación de ocho cuadros a 12 FPS.
Player la reproduce únicamente con velocidad horizontal estando en el suelo.
Soltar la dirección, saltar o caer detiene la carrera y muestra el cuadro 0.
Esta pose fija conserva el diseño al cambiar de estado; no es una animación
de reposo, salto ni caída terminada.

La posición física y el movimiento siguen siendo los del prototipo.
Caja temporal 10 × 16, centrada en el tronco inferior, sin cola.
Su ajuste definitivo al cuerpo sigue pendiente y se hará como cambio de
jugabilidad separado. El checkbox Mostrar colisión sigue disponible.

## Verificación
Compilación TypeScript y Vite. Revisión en navegador de carga de la hoja,
movimiento en ambas direcciones y retirada de los controles de escala.
Pendiente de aprobación visual del usuario: ritmo completo de carrera,
transición cíclica y consistencia artística fina.

## Siguiente recurso
Reposo y poses propias de ascenso/caída con el mismo diseño de esta hoja.
