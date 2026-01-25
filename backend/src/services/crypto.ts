import { createHash, randomBytes } from "node:crypto";

export function sha256Base64Url(input: string): string {
  const h = createHash("sha256").update(input, "utf8").digest("base64url");
  return h;
}

export function randomTokenBase64Url(bytes: number): string {
  return randomBytes(bytes).toString("base64url");
}

export function to32ByteKey(secret: string): Uint8Array {
  const hash = createHash("sha256").update(secret, "utf8").digest();
  return new Uint8Array(hash);
}
