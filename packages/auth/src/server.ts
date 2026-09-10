/**
 * The full @zuvre/auth surface — password hashing, session issuing/
 * verification, permissions, and the owner-audit wrapper. Node.js
 * runtime ONLY: API routes, Server Components, Server Actions. Never
 * middleware (Edge runtime — use "@zuvre/auth/edge" instead) and never a
 * Client Component (use "@zuvre/auth/client-safe" instead).
 *
 * password.ts and owner.ts both carry `import "server-only"` — importing
 * either from a Client Component now fails the build immediately with a
 * clear message, rather than silently working until deploy time the way
 * this file's own history (see the Phase 1 build-fix report) shows a
 * bare barrel export can.
 */
export * from "./password";
export * from "./session";
export * from "./owner";
export * from "./permissions";
