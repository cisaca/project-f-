# Portal Especial — Full Stack

Aplicación romántica/mística inspirada en el diseño del Portal Especial.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- API REST para validar fechas
- CSS propio, SVG y animaciones
- Responsive

## Ejecutar

Requiere Node.js 18+.

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173
API: http://localhost:3001

## Configurar fechas

Edita `server/.env`:

```env
PORT=3001
VALID_DATE_1=2010-08-25
VALID_DATE_2=2020-02-14
```

La segunda fecha es un ejemplo y debes reemplazarla por la que quieras.

También puedes copiar `server/.env.example` como `.env`.

## Producción

```bash
npm run build
npm start
```

El servidor Express sirve la aplicación compilada de `client/dist`.

## Transición de loros

Al desbloquear con la fecha correcta, una bandada de siluetas de loros llena la pantalla
y luego cae revelando la siguiente escena. Se ajusta en `client/src/main.jsx`:

- `COVER_MS`: cuánto tarda la bandada en cubrir la pantalla.
- `FALL_MS`: duración de la caída.
- `spacing` en `makeFlock()`: separación entre loros (menor = más cobertura, más loros).

Respeta `prefers-reduced-motion`: si el dispositivo lo tiene activado, se omite la animación.

## Desplegar en Vercel

1. Sube el proyecto a GitHub (el `.gitignore` ya excluye `server/.env` y `node_modules`).
2. En Vercel: **Add New → Project** e importa el repositorio. Deja la raíz del proyecto en `/`.
   La configuración de build ya viene en `vercel.json`
   (Build: `npm run build`, Output: `client/dist`).
3. Antes de desplegar, en **Settings → Environment Variables** agrega:
   - `VALID_DATE_1` = `AAAA-MM-DD`
   - `VALID_DATE_2` = `AAAA-MM-DD` (opcional)
4. Deploy. La web se sirve como estática y `/api/unlock` corre como función serverless (`api/unlock.js`).

Si cambias las variables de entorno, haz **Redeploy** para que se apliquen.

Nota: en local la API es `server/index.js` (Express) y en Vercel es `api/unlock.js`.
Si cambias las reglas de validación, hazlo en ambos archivos.

## Cartita 2 · Recuerdos

Collage tipo scrapbook con scroll vertical (4 hojas). Todo está en `client/src/Memories.jsx`.

- **Fotos:** copia tus imágenes a `client/public/recuerdos/` como `1.jpg`, `2.jpg`… hasta `24.jpg`.
  Si falta alguna, se ve un marco rosa con una cámara.
- **Textos y acomodo:** edita `MEMORY_PAGES` (cada elemento tiene `x`, `y`, `w`, `rot`, `z`).
- **Colores y fondos:** `client/src/memories.css`.

### Gatitos del fondo

Los gatitos que flotan por el fondo son imágenes PNG con fondo transparente, en
`client/public/gatos/` (`gato-1.png` … `gato-6.png`). Para cambiarlas, reemplaza esos archivos
con los tuyos (mismos nombres). En `FLOAT_PICS` (`client/src/Cats.jsx`) defines cuántas veces
aparece cada una, su tamaño, velocidad y si sube flotando o cruza la pantalla de lado a lado.
En la primera hoja hay además un gatito dibujado que saluda (texto en `CAT_SAYS`).

## Cartita 3 · Abre cuando…

Buzón de sobres sellados con cielo nocturno. Todo está en `client/src/Letters.jsx` (textos) y `client/src/letters.css` (estilos).

- **Sobres y cartas:** edita `LETTERS`. Cada sobre tiene `title`, `tone` (color), `seal` (dibujo del sello), `text` (párrafos), `ps`, y opcionalmente `photo`, `unlock`, `requires`, `glow`.
- **Firma y despedida:** `SIGNATURE` al inicio del archivo.
- **Candado por fecha:** `unlock: "AAAA-MM-DD"`. La fecha de hoy la entrega el servidor (`/api/now`, en `server/index.js` y en `api/now.js` para Vercel), así que no se adelanta cambiando el reloj del teléfono. Si la API no responde, usa la fecha del dispositivo.
- **Sobre dorado final:** `requires: "all"` se abre cuando ya leíste todos los sobres que no tienen fecha.
- **Fotos en una carta:** copia la imagen a `client/public/abrir/` y pon `photo: "abrir/1.jpg"`.
- **Progreso:** los sobres leídos se recuerdan en el navegador (`localStorage`, clave `portal-abre-cuando:v1`).
- Respeta `prefers-reduced-motion`.

## Cartita 4 · El oráculo de nosotros (quiz)

Quiz con cartas de tarot a la luz de las velas. Todo está en `client/src/Oracle.jsx` (preguntas) y `client/src/oracle.css` (estilos).

- **Preguntas:** edita `QUESTIONS`. Tipos: `choice` (opción múltiple, `answer` = posición correcta desde 0), `tf` (verdadero/falso, `answer: true|false`), `order` (los `items` van en el orden correcto y se mezclan solos) y `love` (la pregunta final del cariño infinito, no cuenta en el puntaje).
- **Cada carta:** `card` (nombre), `art` (sun, moon, star, lovers, magic, eye, crown, paw, key, world, fool, wheel), `hint` (pista del gatito), `right` / `wrong` (lo que dice el oráculo).
- **Lecturas finales:** `RESULTS` (según el porcentaje de aciertos). **Premio por puntaje perfecto:** `COUPON` (pon `null` para quitarlo).
- **Título y subtítulo:** `TITLE` y `SUBTITLE` al inicio del archivo.
- Se recuerda la última lectura en el navegador (`localStorage`, clave `portal-oraculo:v1`). Respeta `prefers-reduced-motion`.

## Cartita 5 · La puerta (cuenta regresiva al 18 de diciembre)

Una puerta de piedra sellada con cadenas y una cerradura de corazón. Cuenta hacia el día especial y, cuando llega la hora, se abre y aparece tu carta.

- **Se desbloquea** al completar las 4 cartitas anteriores (el progreso se guarda en el navegador): firmar los acuerdos, llegar al final de Recuerdos, abrir todos los sobres sin fecha de "Abre cuando…" y terminar la lectura del Oráculo.
- **Pista en el menú:** `DOOR_CLUE` al inicio de `client/src/main.jsx` (ahora: «Se abre una semana antes de Navidad ✦»).
- **Tu carta, las pistas y la hora de apertura** se editan en **`secret/final.json`**. Ese archivo vive solo en el servidor: la carta no viaja al navegador hasta que llega la hora, y la hora la manda el servidor (no el reloj del teléfono).
  - `opensAt`: fecha y hora exactas con zona horaria. Ahora: `2026-12-18T00:00:00-03:00` (medianoche del 18 de diciembre, Chile en horario de verano). También se puede cambiar con la variable de entorno `FINAL_OPENS_AT` (sin tocar archivos).
  - `teaser`: la frase misteriosa que se ve mientras tanto.
  - `clues`: pistas que se revelan solas cuando faltan N días (`daysBefore`).
  - `letter`: `kicker`, `title`, `paragraphs` (cada uno aparece de a uno), `plan` (cuadritos tipo Cuándo/Dónde), `ps`, `signature` y `event` (opcional, activa el botón «Agregar a mi calendario»; hay un ejemplo en `_ejemplo_evento`).
- **Vista previa** (solo en tu computador con `npm run dev`; en Vercel queda desactivada a menos que pongas `FINAL_ALLOW_PREVIEW=1`):
  - `http://localhost:5173/?preview=open` → como si ya fuera el día (puedes ver la apertura y leer tu carta).
  - `http://localhost:5173/?preview=5d` → como si faltaran 5 días (también `3h`, `40m`, `12s`).
  - Para ver otra vez la apertura, borra los datos del sitio o la clave `portal-progreso:v1` del navegador.
- **Vercel:** `api/final.js` (usa `shared/final.cjs` y `secret/final.json`; `vercel.json` ya incluye esos archivos). La lógica es la misma en `server/index.js` (local) y en `api/final.js`, porque ambos usan `shared/final.cjs`.
