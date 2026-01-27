type LoginResponse = {
  accessToken: string;
  user: { id: string; email: string; role: string; perms: string[] };
  csrfToken: string;
};

export type MeResponse = {
  user: { id: string; email: string; role: string; perms: string[] };
};

let accessToken: string | null = null;
let csrfToken: string | null = null;

function backendUrl() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) return "";
  return url.replace(/\/$/, "");
}

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${backendUrl()}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers ?? {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(csrfToken ? { "x-csrf-token": csrfToken } : {})
    }
  });

  if (res.status === 401 && path !== "/api/v1/auth/refresh") {
    const refreshed = await refresh();
    if (refreshed) {
      return request(path, init);
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function login(email: string, password: string) {
  const data = (await request("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })) as LoginResponse;

  accessToken = data.accessToken;
  csrfToken = data.csrfToken;

  try {
    localStorage.setItem("ravix_access", accessToken);
    localStorage.setItem("ravix_csrf", csrfToken);
  } catch {}

  return data;
}

export async function me(): Promise<MeResponse> {
  return request("/api/v1/auth/me", { method: "GET" }) as Promise<MeResponse>;
}

export async function logout(): Promise<void> {
  await request("/api/v1/auth/logout", { method: "POST" });
  accessToken = null;
  csrfToken = null;
  try {
    localStorage.removeItem("ravix_access");
    localStorage.removeItem("ravix_csrf");
  } catch {}
}

export function loadTokensFromStorage() {
  try {
    accessToken = localStorage.getItem("ravix_access");
    csrfToken = localStorage.getItem("ravix_csrf");
  } catch {}
}

export async function refresh(): Promise<boolean> {
  try {
    const data = (await request("/api/v1/auth/refresh", {
      method: "POST"
    })) as { accessToken: string };

    accessToken = data.accessToken;

    try {
      localStorage.setItem("ravix_access", accessToken);
    } catch {}

    return true;
  } catch {
    return false;
  }
}

export async function getServers() {
  return request("/api/v1/ptero/client/servers", { method: "GET" });
}

export async function powerServer(serverId: string, signal: "start" | "stop" | "restart" | "kill") {
  return request(`/api/v1/ptero/client/servers/${serverId}/power`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signal })
  });
}

export async function listPlugins() {
  return request("/api/v1/plugins", { method: "GET" });
}

export async function listMarketplaceItems() {
  return request("/api/v1/marketplace/items", { method: "GET" });
}

export async function adminListUsers() {
  return request("/api/v1/admin/users", { method: "GET" });
}

export async function adminCreateUser(input: { email: string; password: string; role: "admin" | "user" }) {
  return request("/api/v1/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
}

export async function adminPatchUser(
  id: string,
  input: { role?: "admin" | "user"; password?: string }
) {
  return request(`/api/v1/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
}

export async function adminRevokeUserSessions(id: string) {
  return request(`/api/v1/admin/users/${id}/revoke-sessions`, { method: "POST" });
}

export async function adminListAudit(limit = 50) {
  const q = new URLSearchParams({ limit: String(limit) }).toString();
  return request(`/api/v1/admin/audit?${q}`, { method: "GET" });
}
