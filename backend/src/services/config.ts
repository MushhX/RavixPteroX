import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().optional().default("development"),
  PORT: z.coerce.number().optional().default(8080),
  FRONTEND_ORIGIN: z.string().optional().default("http://localhost:3000"),
  DB_PATH: z.string().optional().default("./data/ravixpterox.sqlite"),
  JWT_SIGNING_SECRET: z.string().min(1),
  JWT_ENCRYPTION_SECRET: z.string().min(1),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().optional().default(900),
  REFRESH_TOKEN_TTL_SECONDS: z.coerce.number().optional().default(2_592_000),
  COOKIE_NAME_REFRESH: z.string().optional().default("ravix_refresh"),
  COOKIE_NAME_CSRF: z.string().optional().default("ravix_csrf"),
  COOKIE_SECURE: z.coerce.boolean().optional().default(false),
  ADMIN_EMAIL: z.string().email().optional().default("admin@example.com"),
  ADMIN_PASSWORD: z.string().min(8).optional().default("ChangeMe123!"),
  PTERO_BASE_URL: z.string().url().optional().default("https://panel.example.com"),
  PTERO_CLIENT_API_KEY: z.string().optional().default(""),
  PTERO_APP_API_KEY: z.string().optional().default("")
});

export type AppConfig = {
  nodeEnv: string;
  port: number;
  frontendOrigin: string;
  dbPath: string;
  jwtSigningSecret: string;
  jwtEncryptionSecret: string;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  cookieNameRefresh: string;
  cookieNameCsrf: string;
  cookieSecure: boolean;
  adminEmail: string;
  adminPassword: string;
  pteroBaseUrl: string;
  pteroClientApiKey: string;
  pteroAppApiKey: string;
};

export function loadConfig(env: NodeJS.ProcessEnv): AppConfig {
  const parsed = EnvSchema.parse(env);

  return {
    nodeEnv: parsed.NODE_ENV,
    port: parsed.PORT,
    frontendOrigin: parsed.FRONTEND_ORIGIN,
    dbPath: parsed.DB_PATH,
    jwtSigningSecret: parsed.JWT_SIGNING_SECRET,
    jwtEncryptionSecret: parsed.JWT_ENCRYPTION_SECRET,
    accessTokenTtlSeconds: parsed.ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenTtlSeconds: parsed.REFRESH_TOKEN_TTL_SECONDS,
    cookieNameRefresh: parsed.COOKIE_NAME_REFRESH,
    cookieNameCsrf: parsed.COOKIE_NAME_CSRF,
    cookieSecure: parsed.COOKIE_SECURE,
    adminEmail: parsed.ADMIN_EMAIL,
    adminPassword: parsed.ADMIN_PASSWORD,
    pteroBaseUrl: parsed.PTERO_BASE_URL.replace(/\/$/, ""),
    pteroClientApiKey: parsed.PTERO_CLIENT_API_KEY,
    pteroAppApiKey: parsed.PTERO_APP_API_KEY
  };
}
