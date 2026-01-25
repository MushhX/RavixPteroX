export type Role = "admin" | "user";

const rolePerms: Record<Role, string[]> = {
  admin: ["*"] as const,
  user: ["ptero:read", "ptero:power"]
};

export function resolvePerms(role: Role): string[] {
  return rolePerms[role] ?? [];
}

export function hasPerm(perms: string[], required: string): boolean {
  if (perms.includes("*")) return true;
  return perms.includes(required);
}
