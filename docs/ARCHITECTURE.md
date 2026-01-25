# Arquitectura

## Principios

- Separación de responsabilidades.
- Integración con Pterodactyl únicamente por API.
- Seguridad por defecto.
- Escalabilidad horizontal (stateless en backend, sesiones/tokens persistidos en DB).

## Componentes

### Backend

- API propia (`/api/v1`) para:
  - autenticación y sesiones
  - roles y permisos
  - auditoría
  - proxy seguro hacia Pterodactyl
  - sistema de plugins

### Frontend

- Next.js consumiendo el backend.
- UI preparada para temas (dark mode) y multi-idioma (estructura base).

### Integración Pterodactyl

- **Client API**: operaciones de usuario (servidores, consola, recursos).
- **Application API**: operaciones administrativas (si se habilita).

RavixPteroX no toca la base de datos de Pterodactyl ni modifica su core.

### Plugins

- Un plugin es un módulo que registra rutas o capacidades en el backend.
- El core permanece ligero; los addons se cargan desde `backend/src/plugins`.

El backend expone la metadata de plugins en:

- `GET /api/v1/plugins`
