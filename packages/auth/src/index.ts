/**
 * Root @zuvre/auth import — deliberately client-safe by default (see
 * ./client-safe.ts). This means an accidental `import { x } from
 * "@zuvre/auth"` from a Client Component is safe rather than merely
 * "fails loudly" — the dangerous surfaces require an explicit subpath:
 *
 *   @zuvre/auth/client-safe   — pure logic, any environment (this file's contents)
 *   @zuvre/auth/edge          — + session (jose, Edge-compatible) — for middleware.ts
 *   @zuvre/auth/server        — + password/session (node:crypto, @zuvre/db) — Node.js only
 *
 * See the Phase 1 build-fix report for why this boundary exists: the
 * previous unconditional `export * from "./password"` here is what
 * pulled node:crypto into an incompatible build target.
 */
export * from "./client-safe";
