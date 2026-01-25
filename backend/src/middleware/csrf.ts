import { Request, Response, NextFunction } from "express";
import { AppConfig } from "../services/config.js";

export function requireCsrf(config: AppConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const cookieToken = (req.cookies as Record<string, unknown> | undefined)?.[config.cookieNameCsrf];
    const headerToken = req.header("x-csrf-token");

    if (typeof cookieToken !== "string" || typeof headerToken !== "string") {
      res.status(403).json({ error: "csrf" });
      return;
    }

    if (cookieToken !== headerToken) {
      res.status(403).json({ error: "csrf" });
      return;
    }

    next();
  };
}
