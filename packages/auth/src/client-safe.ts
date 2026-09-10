/**
 * The ONLY part of @zuvre/auth safe to import from a Client Component.
 * `permissions.ts` is pure string/array logic with zero I/O — no
 * node:crypto, no @zuvre/db, no Node-only APIs of any kind. Nothing else
 * in this package belongs here. See packages/auth/README boundary note
 * (below) and apps/web/src/middleware.ts / server files for how the
 * other two tiers (./edge, ./server) are used instead.
 */
export * from "./permissions";
