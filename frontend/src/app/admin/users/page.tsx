"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  adminCreateUser,
  adminListUsers,
  adminPatchUser,
  adminRevokeUserSessions,
  loadTokensFromStorage,
  refresh
} from "@/lib/api";

type UserRow = { id: string; email: string; role: string; created_at: number };

type UsersResponse = { users: UserRow[] };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      loadTokensFromStorage();
      await refresh();
      const data = (await adminListUsers()) as UsersResponse;
      setUsers(data.users);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createUser(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await adminCreateUser({ email, password, role });
      setEmail("");
      setPassword("");
      setRole("user");
      await load();
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "create_failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Usuarios</h1>
        <p className="text-sm text-zinc-600">Gestión de usuarios y roles.</p>
      </div>

      {loading ? <div>Cargando...</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <section className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold">Crear usuario</h2>
        <form className="mt-4 grid md:grid-cols-4 gap-3" onSubmit={createUser}>
          <input
            className="rounded-md border px-3 py-2"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="rounded-md border px-3 py-2"
            placeholder="password (min 8)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <select
            className="rounded-md border px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "user")}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button className="rounded-md bg-zinc-900 text-white px-3 py-2" type="submit">
            Crear
          </button>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Listado</h2>
          <button className="rounded-md border px-3 py-2 bg-white" onClick={load}>
            Recargar
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {users.map((u) => (
            <div key={u.id} className="rounded-lg border p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{u.email}</div>
                <div className="text-xs text-zinc-500">
                  {u.id} · {u.role}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="rounded-md border px-2 py-1 bg-white"
                  onClick={async () => {
                    await adminPatchUser(u.id, { role: u.role === "admin" ? "user" : "admin" });
                    await load();
                  }}
                >
                  Toggle role
                </button>
                <button
                  className="rounded-md border px-2 py-1 bg-white"
                  onClick={async () => {
                    await adminRevokeUserSessions(u.id);
                    await load();
                  }}
                >
                  Revoke sessions
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
