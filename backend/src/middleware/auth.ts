import { Request, Response, NextFunction } from "express";
import { AppConfig } from "../services/config.js";
import { verifyEncryptedJwt } from "../services/jwt.js";
import { hasPerm } from "../services/rbac.js";

export type AuthedRequest = Request & {
  auth?: {
    userId: string;
    role: string;
    perms: string[];
  };
};

export function requireAuth(config: AppConfig) {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    const h = req.headers.authorization;
    const token = typeof h === "string" && h.startsWith("Bearer ") ? h.slice(7) : null;

    if (!token) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }

    try {
      const payload = await verifyEncryptedJwt(config, token);
      req.auth = { userId: payload.sub, role: payload.role, perms: payload.perms };
      next();
    } catch {
      res.status(401).json({ error: "unauthorized" });
    }
  };
}

export function requirePerm(required: string) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.auth) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }

    if (!hasPerm(req.auth.perms, required)) {
      res.status(403).json({ error: "forbidden" });
      return;
    }

    next();
  };
}
