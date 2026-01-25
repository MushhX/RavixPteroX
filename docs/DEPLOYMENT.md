# Deployment (Instalar / Desinstalar)

Este documento describe cómo desplegar RavixPteroX (backend + frontend) y cómo retirarlo de forma segura.

## Recomendación de arquitectura

- **Reverse proxy** (Nginx/Caddy/Traefik) terminando TLS (HTTPS)
- **Frontend** (Next.js) detrás del proxy
- **Backend** (API) detrás del proxy
- RavixPteroX es **stateless** excepto por el SQLite (`DB_PATH`) y las cookies/tokens.

## Instalación (producción, genérica)

### 1) Preparar el servidor

- Node.js >= 20
- Un dominio (ej. `panel.tudominio.com`)
- Puertos abiertos:
  - 80/443 hacia el reverse proxy
  - (interno) 3000 para frontend
  - (interno) 8080 para backend

### 2) Descargar el proyecto

```bash
git clone <tu-repo> ravixpterox
cd ravixpterox
npm install
```

### 3) Configurar variables de entorno

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env.local`

Ajustes típicos en producción:

- `backend/.env`
  - `FRONTEND_ORIGIN=https://panel.tudominio.com`
  - `COOKIE_SECURE=true`
  - `JWT_SIGNING_SECRET=<secreto-largo>`
  - `JWT_ENCRYPTION_SECRET=<secreto-largo>`
  - `PTERO_BASE_URL=https://TU_PANEL_PTERO`

- `frontend/.env.local`
  - `NEXT_PUBLIC_BACKEND_URL=https://panel.tudominio.com` (o la URL pública del backend si lo separas)

### 4) Build

```bash
npm run build
```

### 5) Ejecutar como servicio

Opciones comunes:

- **PM2** (Node)
- **systemd** (Linux)
- **Docker** (si lo adaptas)

Ejemplo (PM2, orientativo):

- backend:
  - comando: `npm run start -w backend`
- frontend:
  - comando: `npm run start -w frontend`

## HTTPS (pasar de http:// a https://)

RavixPteroX no “genera” certificados; se recomienda HTTPS mediante **reverse proxy**.

### Opción A: Caddy (recomendado por simplicidad)

Caddy obtiene certificados automáticamente con Let’s Encrypt.

`/etc/caddy/Caddyfile` (ejemplo):

```caddy
panel.tudominio.com {
  encode gzip

  # Frontend (Next)
  reverse_proxy / 127.0.0.1:3000

  # Backend (API)
  reverse_proxy /api/* 127.0.0.1:8080
}
```

Notas:

- El frontend llama al backend por la misma origin (`https://panel.tudominio.com`), y el proxy enruta `/api/*`.
- Asegúrate de tener:
  - `FRONTEND_ORIGIN=https://panel.tudominio.com`
  - `COOKIE_SECURE=true`

### Opción B: Nginx + Certbot

1) Configura Nginx para proxy.
2) Emite cert con Certbot.
3) Redirige HTTP->HTTPS.

Ejemplo simplificado de Nginx:

```nginx
server {
  listen 80;
  server_name panel.tudominio.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;
  server_name panel.tudominio.com;

  # ssl_certificate ...
  # ssl_certificate_key ...

  location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

## Desinstalación (retirar el panel)

### 1) Parar servicios

- Si usas PM2:
  - `pm2 stop <app>`
  - `pm2 delete <app>`
- Si usas systemd:
  - `systemctl stop ...`
  - `systemctl disable ...`

### 2) Eliminar reverse proxy

- Quita el vhost/Caddyfile
- Recarga el servicio (nginx/caddy)

### 3) Eliminar datos y código

RavixPteroX guarda su estado en:

- `backend/DB_PATH` (por defecto `backend/data/ravixpterox.sqlite`)

Para desinstalación completa:

- Borra el directorio del proyecto
- Borra el archivo SQLite

### 4) Revocar secretos

- Cambia los secretos JWT si se reutilizaban
- Revoca las API keys usadas para Pterodactyl si procede

## Checklist de producción

- `COOKIE_SECURE=true`
- `FRONTEND_ORIGIN=https://...`
- `NEXT_PUBLIC_BACKEND_URL=https://...`
- TLS activo (HTTP->HTTPS)
- Secretos JWT fuertes
- Backups del SQLite si usas DB local
