import { Express, Request, Response } from "express";
import { z } from "zod";
import { requireAuth, requirePerm } from "../middleware/auth.js";
import { requireCsrf } from "../middleware/csrf.js";
import { writeAudit } from "../services/audit.js";
import { AppConfig } from "../services/config.js";
import { Db } from "../services/db.js";

const PowerSchema = z.object({
  signal: z.enum(["start", "stop", "restart", "kill"])
});

async function pteroFetch(config: AppConfig, path: string, init: RequestInit, apiKey: string) {
  const url = `${config.pteroBaseUrl}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`ptero_error:${res.status}:${text}`);
  }

  return text ? JSON.parse(text) : null;
}

export function registerPteroRoutes(app: Express, deps: { config: AppConfig; db: Db }) {
  const { config, db } = deps;

  app.get(
    "/api/v1/ptero/client/servers",
    requireAuth(config),
    requirePerm("ptero:read"),
    async (req: Request, res: Response) => {
      if (!config.pteroClientApiKey) {
        res.status(500).json({ error: "ptero_client_api_key_missing" });
        return;
      }

      try {
        const data = await pteroFetch(
          config,
          "/api/client/servers",
          { method: "GET" },
          config.pteroClientApiKey
        );

        const actorUserId = req.auth?.userId;
        writeAudit(db, {
          actorUserId,
          action: "ptero.client.servers.list",
          ip: req.ip,
          userAgent: req.header("user-agent") ?? undefined
        });

        res.json(data);
      } catch (e) {
        res.status(502).json({ error: "ptero_upstream_error" });
      }
    }
  );

  app.post(
    "/api/v1/ptero/client/servers/:serverId/power",
    requireAuth(config),
    requirePerm("ptero:power"),
    requireCsrf(config),
    async (req: Request, res: Response) => {
      if (!config.pteroClientApiKey) {
        res.status(500).json({ error: "ptero_client_api_key_missing" });
        return;
      }

      const serverId = req.params.serverId;
      const input = PowerSchema.safeParse(req.body);

      if (!input.success) {
        res.status(400).json({ error: "invalid_body" });
        return;
      }

      try {
        await pteroFetch(
          config,
          `/api/client/servers/${serverId}/power`,
          { method: "POST", body: JSON.stringify({ signal: input.data.signal }) },
          config.pteroClientApiKey
        );

        const actorUserId = req.auth?.userId;
        writeAudit(db, {
          actorUserId,
          action: "ptero.client.server.power",
          target: serverId,
          meta: input.data,
          ip: req.ip,
          userAgent: req.header("user-agent") ?? undefined
        });

        res.status(204).send();
      } catch {
        res.status(502).json({ error: "ptero_upstream_error" });
      }
    }
  );
}
