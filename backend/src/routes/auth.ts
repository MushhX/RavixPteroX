import { Express, Request, Response } from "express";
import { randomBytes } from "node:crypto";
import { requireAuth } from "../middleware/auth.js";
import { requireCsrf } from "../middleware/csrf.js";
import {
  authenticateWithPassword,
  bindRefreshTokenToSession,
  issueTokensForSession,
  parseLoginInput,
  revokeSession,
  rotateRefreshToken
} from "../services/auth.js";
import { writeAudit } from "../services/audit.js";
import { AppConfig } from "../services/config.js";
import { Db } from "../services/db.js";
import { verifyEncryptedJwt } from "../services/jwt.js";

export function registerAuthRoutes(app: Express, deps: { config: AppConfig; db: Db }) {
  const { config, db } = deps;

  app.post("/api/v1/auth/login", async (req: Request, res: Response) => {
    try {
      const input = parseLoginInput(req.body);
      const auth = authenticateWithPassword(
        db,
        config,
        input,
        req.ip,
        req.header("user-agent") ?? undefined
      );

      const tokens = await issueTokensForSession(config, auth.user, auth.sessionId);
      bindRefreshTokenToSession(db, auth.sessionId, tokens.refreshToken);

      const csrfToken = randomBytes(32).toString("base64url");

      res.cookie(config.cookieNameRefresh, tokens.refreshToken, {
        httpOnly: true,
        secure: config.cookieSecure,
        sameSite: "lax",
        path: "/api/v1/auth"
      });

      res.cookie(config.cookieNameCsrf, csrfToken, {
        httpOnly: false,
        secure: config.cookieSecure,
        sameSite: "lax",
        path: "/"
      });

      writeAudit(db, {
        actorUserId: auth.user.id,
        action: "auth.login",
        ip: req.ip,
        userAgent: req.header("user-agent") ?? undefined
      });

      res.json({
        accessToken: tokens.accessToken,
        user: auth.user,
        csrfToken
      });
    } catch (e) {
      res.status(401).json({ error: "invalid_credentials" });
    }
  });

  app.post("/api/v1/auth/refresh", async (req: Request, res: Response) => {
    const refreshToken = (req.cookies as Record<string, unknown> | undefined)?.[config.cookieNameRefresh];

    if (typeof refreshToken !== "string") {
      res.status(401).json({ error: "unauthorized" });
      return;
    }

    try {
      const rotated = await rotateRefreshToken(
        db,
        config,
        refreshToken,
        req.ip,
        req.header("user-agent") ?? undefined
      );

      res.cookie(config.cookieNameRefresh, rotated.refreshToken, {
        httpOnly: true,
        secure: config.cookieSecure,
        sameSite: "lax",
        path: "/api/v1/auth"
      });

      writeAudit(db, {
        actorUserId: rotated.userId,
        action: "auth.refresh",
        ip: req.ip,
        userAgent: req.header("user-agent") ?? undefined
      });

      res.json({ accessToken: rotated.accessToken });
    } catch {
      res.status(401).json({ error: "unauthorized" });
    }
  });

  app.post("/api/v1/auth/logout", requireCsrf(config), async (req: Request, res: Response) => {
    const refreshToken = (req.cookies as Record<string, unknown> | undefined)?.[config.cookieNameRefresh];

    if (typeof refreshToken === "string") {
      try {
        const payload = await verifyEncryptedJwt(config, refreshToken);
        if (payload.sid) {
          revokeSession(db, payload.sid);
        }
        writeAudit(db, {
          actorUserId: payload.sub,
          action: "auth.logout",
          ip: req.ip,
          userAgent: req.header("user-agent") ?? undefined
        });
      } catch {
      }
    }

    res.clearCookie(config.cookieNameRefresh, { path: "/api/v1/auth" });
    res.status(204).send();
  });

  app.get("/api/v1/auth/me", requireAuth(config), (req: Request, res: Response) => {
    if (!req.auth) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }

    const row = db
      .prepare("SELECT id, email, role FROM users WHERE id = ?")
      .get(req.auth.userId) as { id: string; email: string; role: string } | undefined;

    if (!row) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }

    res.json({
      user: {
        id: row.id,
        email: row.email,
        role: req.auth.role,
        perms: req.auth.perms
      }
    });
  });
}
