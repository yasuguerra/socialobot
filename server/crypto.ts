/**
 * AES-256-GCM token encryption helper.
 *
 * Uses `TOKEN_ENCRYPTION_KEY` (base64-encoded 32 bytes) from the env. Tokens
 * stored in Firestore are wrapped as `iv:ciphertext:authTag` in base64 with
 * colons so they're trivially parseable but unreadable without the key.
 */
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGO = "aes-256-gcm";

function loadKey(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("TOKEN_ENCRYPTION_KEY env var is required for OAuth token storage");
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error(`TOKEN_ENCRYPTION_KEY must decode to 32 bytes (got ${key.length})`);
  }
  return key;
}

export function encryptToken(plaintext: string): string {
  const key = loadKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("base64"), ciphertext.toString("base64"), authTag.toString("base64")].join(":");
}

export function decryptToken(envelope: string): string {
  const key = loadKey();
  const [ivB64, ctB64, tagB64] = envelope.split(":");
  if (!ivB64 || !ctB64 || !tagB64) {
    throw new Error("Malformed token envelope");
  }
  const decipher = createDecipheriv(ALGO, key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ctB64, "base64")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}
