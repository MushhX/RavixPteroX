# Plugins

## Objetivo

El sistema de plugins permite extender RavixPteroX sin inflar el núcleo.

Un plugin puede:

- Registrar rutas HTTP en el backend
- Integrar servicios externos
- Añadir módulos como tickets, billing, marketplace, etc.

## Dónde van

Los plugins viven en:

- `backend/src/plugins/`

El registro central está en:

- `backend/src/plugins/index.ts`

## Estructura del plugin

Un plugin implementa `RavixPlugin`:

- `meta`: información pública del plugin
- `register(app, ctx)`: función que registra rutas/capacidades

`ctx` incluye:

- `config`: configuración del backend
- `db`: acceso a la DB interna de RavixPteroX (NO es la DB de Pterodactyl)

## Crear un plugin (paso a paso)

1) Crea un archivo en `backend/src/plugins/`, por ejemplo:

- `backend/src/plugins/myPlugin.ts`

2) Exporta un objeto `RavixPlugin`:

- define `meta`
- registra rutas en `register`

3) Registra el plugin en `backend/src/plugins/index.ts`:

- importa tu plugin
- añádelo al array `builtinPlugins`

4) Reinicia el backend

## Ejemplo completo (código)

Crea `backend/src/plugins/myPlugin.ts`:

```ts
import { Express, Request, Response } from "express";
import { z } from "zod";
import { RavixPlugin } from "../services/plugins.js";

const Body = z.object({ name: z.string().min(1).max(80) });

export const myPlugin: RavixPlugin = {
  meta: {
    id: "my.plugin",
    name: "My Plugin",
    version: "0.1.0",
    description: "Ejemplo de plugin con validación de input.",
    routes: ["POST /api/v1/plugins/my-plugin/hello"]
  },
  register: (app: Express, ctx) => {
    app.post("/api/v1/plugins/my-plugin/hello", (req: Request, res: Response) => {
      const parsed = Body.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_body" });
        return;
      }

      res.json({
        message: `Hola ${parsed.data.name}`,
        nodeEnv: ctx.config.nodeEnv
      });
    });
  }
};
```

Luego edita `backend/src/plugins/index.ts`:

```ts
import { myPlugin } from "./myPlugin.js";

export const builtinPlugins = [examplePlugin, marketplaceStubPlugin, myPlugin];
```

## Ejemplo mínimo

Mira `backend/src/plugins/examplePlugin.ts`.

## Buenas prácticas

- Mantén el núcleo del plugin pequeño y modular.
- Valida inputs (zod) en endpoints.
- Usa `ctx.db` para persistencia propia del plugin.
- Evita guardar secretos en código: usa `.env`.
- No hagas peticiones directas a la DB de Pterodactyl.

## Marketplace

El plugin `marketplaceStubPlugin` es un ejemplo **stub**:

- `GET /api/v1/marketplace/items`
- `POST /api/v1/marketplace/purchase` (no implementado)

Sirve como plantilla para implementar:

- catálogo real
- pagos
- reparto 95/5
- auditoría
