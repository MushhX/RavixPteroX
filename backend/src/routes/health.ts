import { Express, Request, Response } from "express";

export function registerHealthRoutes(app: Express) {
  app.get("/api/v1/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });
}
