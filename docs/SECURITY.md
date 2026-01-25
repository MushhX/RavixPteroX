# Seguridad

## Medidas incluidas en el scaffold

- HTTPS recomendado (terminación TLS en proxy/reverse proxy).
- JWT con expiración configurable.
- Refresh tokens con rotación (revocación por sesión).
- Rate limiting por IP.
- Headers de seguridad con Helmet.
- CORS estricto y cookies con `httpOnly`.
- Protección CSRF (token de doble envío).
- Auditoría de acciones críticas.

## Recomendaciones

- Usa un reverse proxy (Nginx/Caddy/Traefik) con TLS.
- Configura `COOKIE_SECURE=true` en producción.
- Cambia `JWT_*_SECRET` por valores largos y aleatorios.
- Limita el alcance de las keys de Pterodactyl.

## HTTPS

RavixPteroX asume que en producción el tráfico público llega por **HTTPS**.

- Termina TLS en un reverse proxy (Caddy/Nginx/Traefik).
- Redirige HTTP -> HTTPS.

Ver guía: `docs/DEPLOYMENT.md`.

## Checklist rápido de producción

- `FRONTEND_ORIGIN=https://...`
- `COOKIE_SECURE=true`
- Secretos JWT fuertes
- TLS activo
