# Uso

## Arranque rápido (desarrollo)

1) Requisitos

- Node.js >= 20
- (Opcional) Una instancia de Pterodactyl accesible

## Zonas (UI)

- **Zona Usuario**: `http://localhost:3000/dashboard`
- **Zona Admin**: `http://localhost:3000/admin`

Notas:

- El login redirige automáticamente:
  - `admin` -> `/admin`
  - `user` -> `/dashboard`
- Si accedes a `/admin/*` sin rol admin, te redirige a `/dashboard`.
2) Variables de entorno

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env.local`

3) Instalar dependencias

Desde la **raíz**:

```bash
npm install
```

4) Ejecutar

```bash
npm run dev
```

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

## Credenciales iniciales

En el primer arranque, el backend crea un usuario admin si no existe:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Ambas se definen en `backend/.env`.

## Configurar Pterodactyl

### Client API

Para que el dashboard pueda listar servidores y enviar señales de power:

- `PTERO_BASE_URL` (ej: `https://panel.example.com`)
- `PTERO_CLIENT_API_KEY`

Notas:

- RavixPteroX **no** accede a la DB del panel.
- RavixPteroX **no** modifica el core.

## Variables de entorno (backend)

Archivo: `backend/.env`

- `PORT`: puerto del backend (default `8080`)
- `FRONTEND_ORIGIN`: origen permitido para CORS (default `http://localhost:3000`)
- `DB_PATH`: ruta del SQLite (default `./data/ravixpterox.sqlite`)

- `JWT_SIGNING_SECRET`: secreto de firma (obligatorio)
- `JWT_ENCRYPTION_SECRET`: secreto de cifrado (obligatorio)
- `ACCESS_TOKEN_TTL_SECONDS`: TTL del access token
- `REFRESH_TOKEN_TTL_SECONDS`: TTL del refresh token

- `COOKIE_SECURE`: `true` en producción con HTTPS

- `PTERO_BASE_URL`: URL del panel
- `PTERO_CLIENT_API_KEY`: key Client API (para endpoints /client)
- `PTERO_APP_API_KEY`: reservado para features administrativas (no usado en MVP)

## Variables de entorno (frontend)

Archivo: `frontend/.env.local`

- `NEXT_PUBLIC_BACKEND_URL`: URL del backend (default `http://localhost:8080`)

## Flujo de autenticación

- `POST /api/v1/auth/login`
  - Devuelve `accessToken` (JWT cifrado) y `csrfToken`
  - Escribe cookie `ravix_refresh` (refresh token) `httpOnly`

- `POST /api/v1/auth/refresh`
  - Usa la cookie `ravix_refresh` para rotar y devolver nuevo `accessToken`

- `POST /api/v1/auth/logout`
  - Requiere CSRF
  - Revoca la sesión (según `sid` dentro del refresh token)

### CSRF (cómo enviar el token)

En operaciones mutables protegidas por CSRF (ej. logout, power), el backend exige:

- Cookie `ravix_csrf`
- Header `x-csrf-token` con el mismo valor

El frontend incluido lo gestiona automáticamente.

## Endpoints principales

### Health

- `GET /api/v1/health`

### Auth

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Pterodactyl (proxy seguro)

- `GET /api/v1/ptero/client/servers`
- `POST /api/v1/ptero/client/servers/:serverId/power`

### Plugins

- `GET /api/v1/plugins` (lista plugins y metadata)

### Admin

Estas rutas requieren usuario `admin`:

- `GET /api/v1/admin/users`
- `POST /api/v1/admin/users` (**CSRF**)
- `PATCH /api/v1/admin/users/:id` (**CSRF**)
- `POST /api/v1/admin/users/:id/revoke-sessions` (**CSRF**)
- `GET /api/v1/admin/audit`

## Ejemplos con curl

### 1) Login

```bash
curl -i -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"ChangeMe123!"}'
```

Guarda las cookies `ravix_refresh` y `ravix_csrf`.

### 2) Listar plugins

```bash
curl -i http://localhost:8080/api/v1/plugins
```

### 3) Refresh token

```bash
curl -i -X POST http://localhost:8080/api/v1/auth/refresh \
  --cookie "ravix_refresh=..."
```

### 4) Listar servidores (Client API)

```bash
curl -i http://localhost:8080/api/v1/ptero/client/servers \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### 5) Power (requiere CSRF)

```bash
curl -i -X POST http://localhost:8080/api/v1/ptero/client/servers/<serverId>/power \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <CSRF_TOKEN>" \
  --cookie "ravix_csrf=<CSRF_TOKEN>" \
  -d '{"signal":"restart"}'
```

## Troubleshooting

- Si ves errores TypeScript tipo "Cannot find module 'express' / 'react'":
  - Asegúrate de haber ejecutado `npm install`.

- Si el dashboard no muestra servidores:
  - Configura `PTERO_CLIENT_API_KEY` correctamente.
  - Verifica `PTERO_BASE_URL`.

- Si las acciones de power devuelven 403 (CSRF):
  - Asegúrate de estar logueado.
  - Verifica que el frontend esté enviando `x-csrf-token`.
