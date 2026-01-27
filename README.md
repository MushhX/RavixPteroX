# RavixPteroX

RavixPteroX es una plataforma de gestión avanzada e independiente creada por Ravix Studios para ampliar Pterodactyl **exclusivamente mediante su API oficial**, sin modificar el core ni acceder a la base de datos del panel.

## Ejecución (todo en uno)

1) Instala dependencias:

```bash
npm install
```

2) Desarrollo (normal):

Requiere configurar `backend/.env`.

```bash
npm run dev
```

3) Demo (sin Pterodactyl):

No requiere secrets JWT ni API keys. Devuelve datos mock para visualizar el dashboard.

```bash
npm run demo
```

4) Producción (build + start):

```bash
npm run start
```

Puertos por defecto:

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

## Objetivos

- Estabilidad y compatibilidad futura (sin tocar el core de Pterodactyl)
- Seguridad por diseño (JWT, rotación de tokens, rate-limiting, auditoría)
- Arquitectura desacoplada (backend y frontend independientes)
- Extensibilidad (plugins/addons + marketplace)

## ✨ Características Principales

### 🎨 8 Temas Premium
- **Light (Snow)** - Diseño limpio y brillante
- **Dark (Midnight)** - Modo oscuro profesional
- **Blue (Ocean)** - Tonos azules frescos
- **Graphite** - Monocromático elegante
- **Sunset** - Gradientes cálidos naranja y rosa
- **Neon** - Vibrante cian y magenta
- **Forest** - Tonos verdes naturales
- **Purple Haze** - Paleta púrpura elegante

### 📊 Módulos del Dashboard
- **Analytics** - Gráficos de rendimiento en tiempo real
- **File Manager** - Navegador de archivos completo
- **Database** - Gestión de bases de datos MySQL
- **Backups** - Sistema de respaldos automático y manual
- **Console** - Terminal en vivo
- **Logs** - Visor de logs con filtros
- **Billing** - Sistema completo de pagos y facturación

### ⚙️ Panel de Administración
- **Users** - Gestión de usuarios y roles
- **Audit** - Registro de auditoría
- **Plugins** - Marketplace de plugins
- **Customize** - Personalización completa del dashboard
- **Payments** - Administración de pagos y suscripciones

### 💳 Sistema de Pagos
- Integración con Stripe y PayPal
- Gestión de suscripciones
- Historial de facturas (descarga PDF)
- Sistema de créditos
- Análisis de ingresos

### 🎯 Componentes UI Premium
- Toast notifications animadas
- Sistema de modales
- Navegación por pestañas
- Sidebar colapsable
- Animaciones suaves (shimmer, glow, float)
- Badges inteligentes

## Arquitectura (resumen)

- **Frontend**: Next.js (UI moderna) consumiendo el backend vía HTTPS.
- **Backend**: API propia (auth, permisos, auditoría) que actúa como capa externa.
- **Pterodactyl**: se integra vía **Client API** y/o **Application API** según necesidad.

El frontend puede funcionar en modo "single origin" proxyando `/api/*` al backend (por defecto a `http://localhost:8080`).

## Requisitos

- Node.js >= 20
- Una instancia de Pterodactyl accesible por HTTPS

## Configuración rápida

Variables de entorno:

- Backend: `backend/.env`
- Frontend (opcional): `frontend/.env.local`

En demo no es necesario crear `.env`.

## Modo demo

Activa el modo demo con `RAVIX_MODE=demo` (el script `npm run demo` ya lo aplica). En demo:

- Los secrets JWT tienen defaults sólo para demo.
- La integración con Pterodactyl devuelve datos mock (listar servidores y power) para poder visualizar.

Credenciales por defecto (si no cambias `ADMIN_*`):

- Email: `admin@example.com`
- Password: `ChangeMe123!`

## Configuración

Backend (`backend/.env`):

Plantilla mínima:

```env
RAVIX_MODE=normal
PORT=8080
FRONTEND_ORIGIN=http://localhost:3000
DB_PATH=./data/ravixpterox.sqlite

JWT_SIGNING_SECRET=change_me
JWT_ENCRYPTION_SECRET=change_me

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!

PTERO_BASE_URL=https://panel.example.com
PTERO_CLIENT_API_KEY=
PTERO_APP_API_KEY=
```

- `RAVIX_MODE`: `normal` | `demo`
- `PORT`: puerto del backend
- `FRONTEND_ORIGIN`: origen permitido para CORS
- `DB_PATH`: ruta del SQLite
- `JWT_SIGNING_SECRET`, `JWT_ENCRYPTION_SECRET`: obligatorios en `normal`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: usuario admin inicial
- `PTERO_BASE_URL`, `PTERO_CLIENT_API_KEY`: necesarios para integrar Client API en `normal`

Frontend (`frontend/.env.local`, opcional):

Plantilla mínima:

```env
NEXT_PUBLIC_BACKEND_URL=
BACKEND_URL=http://localhost:8080
```

- `NEXT_PUBLIC_BACKEND_URL`: si se define, el frontend llamará al backend por URL absoluta
- `BACKEND_URL`: URL del backend usada por el proxy interno de Next para `/api/*` (default `http://localhost:8080`)

## Uso

- Zona Usuario: `http://localhost:3000/dashboard`
- Zona Admin: `http://localhost:3000/admin`

## Instalación / Desinstalación / HTTPS

Para producción se recomienda un reverse proxy (Caddy/Nginx) y enrutar:

- `/` -> frontend
- `/api/*` -> backend

## Plugins

- Plugins en `backend/src/plugins/`
- Registro en `backend/src/plugins/index.ts`
- Listado: `GET /api/v1/plugins`

## Seguridad

- HTTPS recomendado
- CORS + cookies
- CSRF (doble envío)
- Auditoría

## Roadmap

Ver secciones internas del proyecto para próximos hitos.

## Contribuir

Ver `CONTRIBUTING.md`.
