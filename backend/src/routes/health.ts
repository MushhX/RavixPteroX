import { Express, Request, Response } from "express";
import { AppConfig } from "../services/config.js";

export function registerHealthRoutes(app: Express, deps: { config: AppConfig }) {
  const { config } = deps;
  app.get("/api/v1/health", (_req: Request, res: Response) => {
    res.json({ ok: true, mode: config.mode, now: Date.now() });
  });
}
