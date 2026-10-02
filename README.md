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
