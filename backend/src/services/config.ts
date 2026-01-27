import { z } from "zod";

const CommonEnvSchema = z.object({
  NODE_ENV: z.string().optional().default("development"),
  PORT: z.coerce.number().optional().default(8080),
  FRONTEND_ORIGIN: z.string().optional().default("http://localhost:3000"),
  DB_PATH: z.string().optional().default("./data/ravixpterox.sqlite"),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().optional().default(900),
  REFRESH_TOKEN_TTL_SECONDS: z.coerce.number().optional().default(2_592_000),
  COOKIE_NAME_REFRESH: z.string().optional().default("ravix_refresh"),
  COOKIE_NAME_CSRF: z.string().optional().default("ravix_csrf"),
  COOKIE_SECURE: z.coerce.boolean().optional().default(false),
  ADMIN_EMAIL: z.string().email().optional().default("admin@example.com"),
  ADMIN_PASSWORD: z.string().min(8).optional().default("ChangeMe123!"),
  PTERO_BASE_URL: z.string().url().optional().default("https://panel.example.com"),
  PTERO_CLIENT_API_KEY: z.string().optional().default(""),
  PTERO_APP_API_KEY: z.string().optional().default(""),
  RAVIX_MODE: z.enum(["normal", "demo"]).optional().default("normal")
});

const StrictSecretsSchema = z.object({
  JWT_SIGNING_SECRET: z.string().min(1),
  JWT_ENCRYPTION_SECRET: z.string().min(1)
});

const DemoSecretsSchema = z.object({
  JWT_SIGNING_SECRET: z.string().min(1).optional().default("demo_jwt_signing_secret"),
  JWT_ENCRYPTION_SECRET: z.string().min(1).optional().default("demo_jwt_encryption_secret")
});

export type AppConfig = {
  mode: "normal" | "demo";
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
  const common = CommonEnvSchema.parse(env);
  const secrets = (common.RAVIX_MODE === "demo" ? DemoSecretsSchema : StrictSecretsSchema).parse(env);

  return {
    mode: common.RAVIX_MODE,
    nodeEnv: common.NODE_ENV,
    port: common.PORT,
    frontendOrigin: common.FRONTEND_ORIGIN,
    dbPath: common.DB_PATH,
    jwtSigningSecret: secrets.JWT_SIGNING_SECRET,
    jwtEncryptionSecret: secrets.JWT_ENCRYPTION_SECRET,
    accessTokenTtlSeconds: common.ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenTtlSeconds: common.REFRESH_TOKEN_TTL_SECONDS,
    cookieNameRefresh: common.COOKIE_NAME_REFRESH,
    cookieNameCsrf: common.COOKIE_NAME_CSRF,
    cookieSecure: common.COOKIE_SECURE,
    adminEmail: common.ADMIN_EMAIL,
    adminPassword: common.ADMIN_PASSWORD,
    pteroBaseUrl: common.PTERO_BASE_URL.replace(/\/$/, ""),
    pteroClientApiKey: common.PTERO_CLIENT_API_KEY,
    pteroAppApiKey: common.PTERO_APP_API_KEY
  };
}
