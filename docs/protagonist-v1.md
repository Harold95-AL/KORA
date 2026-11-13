# Estado actual
Se eligió 32 px y se integró la carrera. Ver docs/art/protagonist-run-v1.md.
La comparación descrita abajo es un registro de la prueba anterior.

# Protagonista de KORA — Concepto V1.0

## Identidad aprobada
Alienígena reptiliano inspirado en un gecko. Cabeza corta, ancha y
ligeramente angular; cuerpo compacto y robusto; cola larga. Piel crema
con manchas violetas, ojos ámbar, pañuelo naranja, traje espacial ligero
grafito y detalles tecnológicos cian. Personalidad misteriosa, resistente
y observadora.

El nombre, los detalles de la especie y las funciones narrativas del
equipo siguen abiertos. La lámina de referencia no confirma esos datos.

## Prueba de escala
Un único sprite lateral estático, provisional. No son animaciones finales.
Resolución del juego: 320 × 180. Se comparan alturas de 32 y 40 px.
Cada versión tiene un marco transparente de ancho doble (64 × 32 y
80 × 40). El espacio transparente equilibra la cola para mantener el
cuerpo centrado también al reflejar el sprite.

Los pies conservan su posición al cambiar la textura. La colisión se
mantiene en 10 × 16, igual que en el prototipo anterior, para aislar la
comparación visual. Es una caja temporal del tronco inferior, no una
decisión final de hitbox. No incluye la cola en ninguna orientación.
La caja definitiva y la relación entre personaje y plataformas se
ajustarán después de elegir el tamaño.

Controles: botones sobre el juego o teclas 1 y 2. La casilla Mostrar
colisión dibuja un rectángulo magenta. R reinicia sin cambiar la escala.
Recargar la página vuelve a 32 px. No se guarda una preferencia definitiva.

## Producción del recurso
Herramienta integrada image_gen; no se utilizó la API ni CLI.
Referencia: Hoja de concepto pixel art de KORA.png aportada por el usuario.
Fuente generada: docs/art/protagonist-v1-source.png.
Prompt completo: docs/art/protagonist-v1-prompt.txt.
PNG consumidos:
- public/assets/sprites/protagonist-v1-32.png
- public/assets/sprites/protagonist-v1-40.png

Se recortó el margen transparente y se redujo por vecino más cercano,
conservando alfa, sin suavizado. Los dos PNG proceden del mismo diseño.
Son recursos de evaluación; al aprobar la escala habrá que refinar
manualmente la cuadrícula y preparar los fotogramas de animación.

## Criterio de elección
Comparar legibilidad del ojo, pañuelo, cola y silueta, espacio libre de
pantalla y proporción frente a plataformas y enemigos. No producir
animaciones complejas antes de confirmar la escala.
