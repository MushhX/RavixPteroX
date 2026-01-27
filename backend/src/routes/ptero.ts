import { Express, Request, Response } from "express";
import { z } from "zod";
import { AuthedRequest, requireAuth, requirePerm } from "../middleware/auth.js";
import { requireCsrf } from "../middleware/csrf.js";
import { writeAudit } from "../services/audit.js";
import { AppConfig } from "../services/config.js";
import { Db } from "../services/db.js";

const demoServers = {
  data: [
    {
      object: "server",
      attributes: {
        identifier: "demo-1",
        name: "Survival SMP",
        description: "Minecraft 1.20 · Survival",
        node: "eu-1",
        status: { state: "running", uptimeSec: 86_400 },
        limits: { cpu: 200, memoryMiB: 4096, diskMiB: 20_480 },
        usage: {
          cpuPercent: 42,
          memoryMiB: 2310,
          diskMiB: 12_800,
          networkRxMiB: 12_340,
          networkTxMiB: 8_120
        },
        sftp: { ip: "192.0.2.10", port: 2022 },
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 120
      }
    },
    {
      object: "server",
      attributes: {
        identifier: "demo-2",
        name: "Node API",
        description: "Production API · Node 20",
        node: "eu-2",
        status: { state: "stopped", uptimeSec: 0 },
        limits: { cpu: 100, memoryMiB: 2048, diskMiB: 10_240 },
        usage: {
          cpuPercent: 0,
          memoryMiB: 0,
          diskMiB: 4_900,
          networkRxMiB: 3_210,
          networkTxMiB: 2_980
        },
        sftp: { ip: "192.0.2.11", port: 2022 },
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30
      }
    }
  ]
};

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
    async (req: AuthedRequest, res: Response) => {
      if (config.mode === "demo") {
        const actorUserId = req.auth?.userId;
        writeAudit(db, {
          actorUserId,
          action: "ptero.client.servers.list",
          ip: req.ip,
          userAgent: req.header("user-agent") ?? undefined
        });
        res.json(demoServers);
        return;
      }

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
    async (req: AuthedRequest, res: Response) => {
      const serverId = req.params.serverId;
      const input = PowerSchema.safeParse(req.body);

      if (!input.success) {
        res.status(400).json({ error: "invalid_body" });
        return;
      }

      if (config.mode === "demo") {
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
        return;
      }

      if (!config.pteroClientApiKey) {
        res.status(500).json({ error: "ptero_client_api_key_missing" });
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
