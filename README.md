# RavixPteroX

RavixPteroX es una plataforma de gestión avanzada e independiente creada por Ravix Studios para ampliar Pterodactyl **exclusivamente mediante su API oficial**, sin modificar el core ni acceder a la base de datos del panel.

## Objetivos

- Estabilidad y compatibilidad futura (sin tocar el core de Pterodactyl)
- Seguridad por diseño (JWT, rotación de tokens, rate-limiting, auditoría)
- Arquitectura desacoplada (backend y frontend independientes)
- Extensibilidad (plugins/addons + marketplace)

## Arquitectura (resumen)

- **Frontend**: Next.js (UI moderna) consumiendo el backend vía HTTPS.
- **Backend**: API propia (auth, permisos, auditoría) que actúa como capa externa.
- **Pterodactyl**: se integra vía **Client API** y/o **Application API** según necesidad.

Detalles: `docs/ARCHITECTURE.md`.

## Requisitos

- Node.js >= 20
- Una instancia de Pterodactyl accesible por HTTPS

## Configuración rápida

1) Instala dependencias:

```bash
npm install
```

2) Configura variables de entorno:

- Copia `backend/.env.example` a `backend/.env`
- Copia `frontend/.env.example` a `frontend/.env.local`

3) Ejecuta en desarrollo:

```bash
npm run dev
```

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

## Uso

Guía completa:

- `docs/USAGE.md`

## Instalación / Desinstalación / HTTPS

Guía de despliegue (producción):

- `docs/DEPLOYMENT.md`

Incluye:

- instalación (deploy)
- desinstalación (rollback/retirada)
- cómo poner `https://` (Caddy/Nginx) y redirección HTTP->HTTPS

Incluye:

- instalación y arranque
- variables de entorno
- flujo de autenticación (JWT + refresh)
- CSRF (cookie + header)
- endpoints principales
- troubleshooting

## Plugins

Guía completa:

- `docs/PLUGINS.md`

Los plugins del backend viven en:

- `backend/src/plugins/`

El registro central está en:

- `backend/src/plugins/index.ts`

Puedes listar plugins (y su metadata) con:

- `GET /api/v1/plugins`

## Seguridad

Ver `docs/SECURITY.md`.

## Roadmap

Ver `docs/ROADMAP.md`.

## Contribuir

Ver `CONTRIBUTING.md`.
