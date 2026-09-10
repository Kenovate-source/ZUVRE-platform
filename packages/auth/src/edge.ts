/**
 * For middleware.ts and anything else running on the Edge runtime —
 * NOT for Client Components (session verification is a server/middleware
 * concern regardless of whether it happens to be technically bundleable
 * client-side).
 *
 * `session.ts` uses `jose`, which is deliberately Edge/Web-Crypto-API
 * compatible — safe here. `password.ts` (node:crypto) and `owner.ts`
 * (@zuvre/db → Prisma, needs a real Node.js process) are NOT — Prisma
 * does not run on the Edge runtime, so pulling either of those into
 * middleware would break exactly the same way node:crypto did, just for
 * a different reason. This is the actual root cause of the reported
 * build failure: middleware.ts was importing the full @zuvre/auth
 * barrel, not a Client Component — see the Phase 1 build-fix report.
 */
export * from "./session";
export * from "./permissions";
