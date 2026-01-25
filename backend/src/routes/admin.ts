import { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requireAuth, requirePerm } from "../middleware/auth.js";
import { requireCsrf } from "../middleware/csrf.js";
import { writeAudit } from "../services/audit.js";
import { AppConfig } from "../services/config.js";
import { Db } from "../services/db.js";

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "user"]).default("user")
});

const PatchUserSchema = z.object({
  role: z.enum(["admin", "user"]).optional(),
  password: z.string().min(8).optional()
});

const AuditQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(200).optional().default(50),
  before: z.coerce.number().optional()
});

export function registerAdminRoutes(app: Express, deps: { config: AppConfig; db: Db }) {
  const { config, db } = deps;

  app.get(
    "/api/v1/admin/users",
    requireAuth(config),
    requirePerm("admin:users"),
    (_req: Request, res: Response) => {
      const users = db
        .prepare("SELECT id, email, role, created_at FROM users ORDER BY created_at DESC")
        .all() as Array<{ id: string; email: string; role: string; created_at: number }>;

      res.json({ users });
    }
  );

  app.post(
    "/api/v1/admin/users",
    requireAuth(config),
    requirePerm("admin:users"),
    requireCsrf(config),
    (req: Request, res: Response) => {
      const parsed = CreateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_body" });
        return;
      }

      const id = randomUUID();
      const now = Date.now();
      const passwordHash = bcrypt.hashSync(parsed.data.password, 12);

      try {
        db.prepare(
          "INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)"
        ).run(id, parsed.data.email, passwordHash, parsed.data.role, now);

        writeAudit(db, {
          actorUserId: req.auth?.userId,
          action: "admin.user.create",
          target: id,
          meta: { email: parsed.data.email, role: parsed.data.role },
          ip: req.ip,
          userAgent: req.header("user-agent") ?? undefined
        });

        res.status(201).json({ id });
      } catch {
        res.status(409).json({ error: "email_already_exists" });
      }
    }
  );

  app.patch(
    "/api/v1/admin/users/:id",
    requireAuth(config),
    requirePerm("admin:users"),
    requireCsrf(config),
    (req: Request, res: Response) => {
      const parsed = PatchUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_body" });
        return;
      }

      const userId = req.params.id;
      const existing = db
        .prepare("SELECT id FROM users WHERE id = ?")
        .get(userId) as { id: string } | undefined;

      if (!existing) {
        res.status(404).json({ error: "not_found" });
        return;
      }

      if (parsed.data.role) {
        db.prepare("UPDATE users SET role = ? WHERE id = ?").run(parsed.data.role, userId);
      }

      if (parsed.data.password) {
        const passwordHash = bcrypt.hashSync(parsed.data.password, 12);
        db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, userId);
      }

      writeAudit(db, {
        actorUserId: req.auth?.userId,
        action: "admin.user.update",
        target: userId,
        meta: parsed.data,
        ip: req.ip,
        userAgent: req.header("user-agent") ?? undefined
      });

      res.status(204).send();
    }
  );

  app.post(
    "/api/v1/admin/users/:id/revoke-sessions",
    requireAuth(config),
    requirePerm("admin:users"),
    requireCsrf(config),
    (req: Request, res: Response) => {
      const userId = req.params.id;

      db.prepare("UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL").run(
        Date.now(),
        userId
      );

      writeAudit(db, {
        actorUserId: req.auth?.userId,
        action: "admin.user.revoke_sessions",
        target: userId,
        ip: req.ip,
        userAgent: req.header("user-agent") ?? undefined
      });

      res.status(204).send();
    }
  );

  app.get(
    "/api/v1/admin/audit",
    requireAuth(config),
    requirePerm("admin:audit"),
    (req: Request, res: Response) => {
      const q = AuditQuerySchema.parse(req.query);

      const rows =
        q.before != null
          ? (db
              .prepare(
                "SELECT id, actor_user_id, action, target, meta_json, ip, user_agent, created_at FROM audit_logs WHERE created_at < ? ORDER BY created_at DESC LIMIT ?"
              )
              .all(q.before, q.limit) as any[])
          : (db
              .prepare(
                "SELECT id, actor_user_id, action, target, meta_json, ip, user_agent, created_at FROM audit_logs ORDER BY created_at DESC LIMIT ?"
              )
              .all(q.limit) as any[]);

      const logs = rows.map((r) => ({
        id: r.id,
        actorUserId: r.actor_user_id,
        action: r.action,
        target: r.target,
        meta: r.meta_json ? JSON.parse(r.meta_json) : null,
        ip: r.ip,
        userAgent: r.user_agent,
        createdAt: r.created_at
      }));

      writeAudit(db, {
        actorUserId: req.auth?.userId,
        action: "admin.audit.list",
        ip: req.ip,
        userAgent: req.header("user-agent") ?? undefined
      });

      res.json({ logs });
    }
  );
}
