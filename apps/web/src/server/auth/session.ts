import { cookies } from "next/headers";
import { cache } from "react";
import { issueSessionToken, verifySessionToken } from "@zuvre/auth/server";
import { rawDb } from "@zuvre/db";

/**
 * Cookie-based session management for apps/web. Deliberately kept out of
 * packages/auth (framework-agnostic by design, per ADR-0001) — this file
 * is the Next.js-specific layer that actually reads/writes the cookie
 * and consults the database for revocation. See ADR-0004 for the full
 * rationale.
 *
 * `cookies()` from next/headers is synchronous in Next.js 14 (this
 * project's pinned version) — not awaited here on purpose.
 */

const COOKIE_NAME = process.env.AUTH_SESSION_COOKIE_NAME ?? "zuvre_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface CurrentSession {
  userId: string;
  sessionId: string;
}

/**
 * Creates a real Session row, issues a JWT referencing it, and sets the
 * session cookie. The DB row — not just the JWT's own expiry — is the
 * source of truth for revocation.
 */
export async function createSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  const session = await rawDb.session.create({
    data: { userId, expiresAt },
  });

  const token = await issueSessionToken({ sub: userId, sid: session.id }, SESSION_DURATION_SECONDS);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

/**
 * The authoritative session check — verifies both the JWT signature and
 * the live Session row (catching revocation/expiry a still-validly-
 * signed JWT wouldn't reflect on its own). Requires a database call, so
 * this is only usable from the Node.js runtime (Server Components,
 * Route Handlers) — NOT from middleware, which runs on the Edge runtime
 * by default. Middleware (apps/web/src/middleware.ts) does a cheaper,
 * JWT-signature-only check instead; this function is the real,
 * authoritative gate, called from the (app) layout as defense in depth.
 * Returns null for every failure mode — callers should treat that as
 * "not authenticated," never throw.
 *
 * Wrapped in React's cache() so multiple independent calls within the
 * same request (the (app) layout and each leaf page all resolve the
 * session themselves, deliberately, rather than threading it through
 * props — see ZUVRE_Phase1_Implementation_Blueprint.md §12) dedupe into
 * one actual database query.
 */
export const getCurrentSession = cache(async (): Promise<CurrentSession | null> => {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  let claims;
  try {
    claims = await verifySessionToken(token);
  } catch {
    return null;
  }

  const session = await rawDb.session.findUnique({ where: { id: claims.sid } });
  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }
  if (session.userId !== claims.sub) {
    return null; // defense in depth — should never happen unless a token was forged
  }

  return { userId: session.userId, sessionId: session.id };
});

/** Revokes the current session (DB row) and clears the cookie. */
export async function destroySession(): Promise<void> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) {
    try {
      const claims = await verifySessionToken(token);
      await rawDb.session.update({
        where: { id: claims.sid },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Token already invalid/malformed — nothing to revoke in the DB,
      // still clear the cookie below.
    }
  }
  cookies().delete(COOKIE_NAME);
}
