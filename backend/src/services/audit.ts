import { randomUUID } from "node:crypto";
import { Db } from "./db.js";

export type AuditEvent = {
  actorUserId?: string;
  action: string;
  target?: string;
  meta?: unknown;
  ip?: string;
  userAgent?: string;
};

export function writeAudit(db: Db, event: AuditEvent) {
  const now = Date.now();
  const id = randomUUID();

  db.prepare(
    "INSERT INTO audit_logs (id, actor_user_id, action, target, meta_json, ip, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    id,
    event.actorUserId ?? null,
    event.action,
    event.target ?? null,
    event.meta ? JSON.stringify(event.meta) : null,
    event.ip ?? null,
    event.userAgent ?? null,
    now
  );
}
