/**
 * Browser-side password hashing for LOCAL DEMO MODE only.
 *
 * PBKDF2-HMAC-SHA-256 via the Web Crypto API with a random per-account salt.
 * Passwords are never stored, logged, or sent anywhere — only
 * `salt + derived key` are kept in localStorage. This is a convenience to
 * avoid plaintext storage in a demo; it is NOT a substitute for server-side
 * authentication (a local attacker can still brute-force the stored hash).
 * Requires a secure context (https:// or http://localhost).
 */
const ITERATIONS = 150_000;
const KEY_BITS = 256;

function toBase64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

/**
 * Returns an ArrayBuffer (not a Uint8Array): since TypeScript 5.7 a bare `Uint8Array`
 * is `Uint8Array<ArrayBufferLike>`, which is NOT assignable to Web Crypto's
 * `BufferSource` — that failed type-checking. A plain ArrayBuffer is accepted by
 * every TypeScript version, with no cast.
 */
function fromBase64(b64: string): ArrayBuffer {
  const s = atob(b64);
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i += 1) view[i] = s.charCodeAt(i);
  return buf;
}

export function webCryptoAvailable(): boolean {
  return typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined";
}

export function newSalt(): string {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return toBase64(salt);
}

export async function derivePasswordHash(password: string, saltB64: string, iterations = ITERATIONS): Promise<string> {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromBase64(saltB64), iterations },
    material,
    KEY_BITS
  );
  return toBase64(new Uint8Array(bits));
}

/** Compares without bailing out at the first differing character. */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const PASSWORD_ITERATIONS = ITERATIONS;
