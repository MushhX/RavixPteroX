import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { AppConfig } from "./config.js";

export type Db = Database.Database;

export function initDb(config: AppConfig): Db {
  mkdirSync(dirname(config.dbPath), { recursive: true });
  const db = new Database(config.dbPath);

  db.pragma("journal_mode = WAL");

  db.exec(
    [
      "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL, created_at INTEGER NOT NULL)",
      "CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, refresh_token_hash TEXT NOT NULL, created_at INTEGER NOT NULL, last_used_at INTEGER NOT NULL, revoked_at INTEGER, ip TEXT, user_agent TEXT, FOREIGN KEY(user_id) REFERENCES users(id))",
      "CREATE TABLE IF NOT EXISTS audit_logs (id TEXT PRIMARY KEY, actor_user_id TEXT, action TEXT NOT NULL, target TEXT, meta_json TEXT, ip TEXT, user_agent TEXT, created_at INTEGER NOT NULL)"
    ].join(";")
  );

  ensureAdminUser(db, config);

  return db;
}

function ensureAdminUser(db: Db, config: AppConfig) {
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(config.adminEmail) as { id: string } | undefined;

  if (existing) return;

  const id = randomUUID();
  const passwordHash = bcrypt.hashSync(config.adminPassword, 12);
  const now = Date.now();

  db.prepare(
    "INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)"
  ).run(id, config.adminEmail, passwordHash, "admin", now);
}
