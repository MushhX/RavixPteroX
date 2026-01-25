import { EncryptJWT, jwtDecrypt, SignJWT, jwtVerify } from "jose";
import { AppConfig } from "./config.js";
import { to32ByteKey } from "./crypto.js";

export type JwtPayload = {
  sub: string;
  role: string;
  perms: string[];
  sid?: string;
};

export async function issueAccessToken(
  config: AppConfig,
  payload: JwtPayload
): Promise<string> {
  const signingKey = to32ByteKey(config.jwtSigningSecret);
  const encryptionKey = to32ByteKey(config.jwtEncryptionSecret);

  const jws = await new SignJWT({ role: payload.role, perms: payload.perms })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${config.accessTokenTtlSeconds}s`)
    .sign(signingKey);

  const jwe = await new EncryptJWT({ jws })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${config.accessTokenTtlSeconds}s`)
    .encrypt(encryptionKey);

  return jwe;
}

export async function issueRefreshToken(
  config: AppConfig,
  payload: JwtPayload
): Promise<string> {
  const signingKey = to32ByteKey(config.jwtSigningSecret);
  const encryptionKey = to32ByteKey(config.jwtEncryptionSecret);

  const jws = await new SignJWT({ role: payload.role, perms: payload.perms, sid: payload.sid })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${config.refreshTokenTtlSeconds}s`)
    .sign(signingKey);

  const jwe = await new EncryptJWT({ jws })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${config.refreshTokenTtlSeconds}s`)
    .encrypt(encryptionKey);

  return jwe;
}

export async function verifyEncryptedJwt(
  config: AppConfig,
  token: string
): Promise<JwtPayload> {
  const encryptionKey = to32ByteKey(config.jwtEncryptionSecret);
  const signingKey = to32ByteKey(config.jwtSigningSecret);

  const { payload: outer } = await jwtDecrypt(token, encryptionKey);

  const jws = outer.jws;
  if (typeof jws !== "string") {
    throw new Error("invalid token");
  }

  const { payload } = await jwtVerify(jws, signingKey);

  const sub = payload.sub;
  const role = payload.role;
  const perms = payload.perms;
  const sid = payload.sid;

  if (typeof sub !== "string" || typeof role !== "string" || !Array.isArray(perms)) {
    throw new Error("invalid token");
  }

  return {
    sub,
    role,
    perms: perms.filter((p) => typeof p === "string"),
    sid: typeof sid === "string" ? sid : undefined
  };
}
