import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { AppConfig } from "./config.js";
import { sha256Base64Url } from "./crypto.js";
import { Db } from "./db.js";
import { issueAccessToken, issueRefreshToken, verifyEncryptedJwt } from "./jwt.js";
import { resolvePerms, Role } from "./rbac.js";

export type LoginInput = {
  email: string;
  password: string;
};

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export function parseLoginInput(body: unknown): LoginInput {
  return LoginSchema.parse(body);
}

export type AuthResult = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: Role; perms: string[] };
  sessionId: string;
};

export function authenticateWithPassword(
  db: Db,
  config: AppConfig,
  input: LoginInput,
  ip?: string,
  userAgent?: string
): AuthResult {
  const row = db
    .prepare("SELECT id, email, password_hash, role FROM users WHERE email = ?")
    .get(input.email) as
    | { id: string; email: string; password_hash: string; role: string }
    | undefined;

  if (!row) {
    throw new Error("invalid_credentials");
  }

  const ok = bcrypt.compareSync(input.password, row.password_hash);
  if (!ok) {
    throw new Error("invalid_credentials");
  }

  const role = (row.role === "admin" ? "admin" : "user") as Role;
  const perms = resolvePerms(role);
  const sessionId = randomUUID();
  const now = Date.now();

  db.prepare(
    "INSERT INTO sessions (id, user_id, refresh_token_hash, created_at, last_used_at, revoked_at, ip, user_agent) VALUES (?, ?, ?, ?, ?, NULL, ?, ?)"
  ).run(sessionId, row.id, "", now, now, ip ?? null, userAgent ?? null);

  return {
    accessToken: "",
    refreshToken: "",
    user: { id: row.id, email: row.email, role, perms },
    sessionId
  };
}

export async function issueTokensForSession(
  config: AppConfig,
  user: { id: string; role: Role; perms: string[] },
  sessionId: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = await issueAccessToken(config, {
    sub: user.id,
    role: user.role,
    perms: user.perms
  });

  const refreshToken = await issueRefreshToken(config, {
    sub: user.id,
    role: user.role,
    perms: user.perms,
    sid: sessionId
  });

  return { accessToken, refreshToken };
}

export function bindRefreshTokenToSession(db: Db, sessionId: string, refreshToken: string) {
  const hash = sha256Base64Url(refreshToken);
  db.prepare(
    "UPDATE sessions SET refresh_token_hash = ?, last_used_at = ? WHERE id = ? AND revoked_at IS NULL"
  ).run(hash, Date.now(), sessionId);
}

export function revokeSession(db: Db, sessionId: string) {
  db.prepare("UPDATE sessions SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL").run(
    Date.now(),
    sessionId
  );
}

export async function rotateRefreshToken(
  db: Db,
  config: AppConfig,
  refreshToken: string,
  ip?: string,
  userAgent?: string
): Promise<{ accessToken: string; refreshToken: string; userId: string; role: Role; perms: string[] }> {
  const payload = await verifyEncryptedJwt(config, refreshToken);

  if (!payload.sid) {
    throw new Error("invalid_token");
  }

  const sessionRow = db
    .prepare("SELECT id, user_id, revoked_at FROM sessions WHERE id = ?")
    .get(payload.sid) as { id: string; user_id: string; revoked_at: number | null } | undefined;

  if (!sessionRow || sessionRow.revoked_at) {
    throw new Error("invalid_token");
  }

  const presentedHash = sha256Base64Url(refreshToken);

  const tokenRow = db
    .prepare("SELECT refresh_token_hash FROM sessions WHERE id = ?")
    .get(payload.sid) as { refresh_token_hash: string } | undefined;

  if (!tokenRow || tokenRow.refresh_token_hash !== presentedHash) {
    revokeSession(db, payload.sid);
    throw new Error("invalid_token");
  }

  const userRow = db
    .prepare("SELECT id, role FROM users WHERE id = ?")
    .get(sessionRow.user_id) as { id: string; role: string } | undefined;

  if (!userRow) {
    revokeSession(db, payload.sid);
    throw new Error("invalid_token");
  }

  const role = (userRow.role === "admin" ? "admin" : "user") as Role;
  const perms = resolvePerms(role);

  db.prepare(
    "UPDATE sessions SET last_used_at = ?, ip = COALESCE(?, ip), user_agent = COALESCE(?, user_agent) WHERE id = ?"
  ).run(Date.now(), ip ?? null, userAgent ?? null, payload.sid);

  const newAccess = await issueAccessToken(config, {
    sub: userRow.id,
    role,
    perms
  });

  const newRefresh = await issueRefreshToken(config, {
    sub: userRow.id,
    role,
    perms,
    sid: payload.sid
  });

  db.prepare(
    "UPDATE sessions SET refresh_token_hash = ?, last_used_at = ? WHERE id = ? AND revoked_at IS NULL"
  ).run(sha256Base64Url(newRefresh), Date.now(), payload.sid);

  return {
    accessToken: newAccess,
    refreshToken: newRefresh,
    userId: userRow.id,
    role,
    perms
  };
}
