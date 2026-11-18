import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@zuvre/auth/edge";

/**
 * Cheap, JWT-signature-only gate for /app/*. Middleware runs on the Edge
 * runtime by default, where Prisma Client isn't usable — so this
 * deliberately does NOT check revocation (that needs a DB call). It
 * exists to redirect obviously-unauthenticated requests fast, not to be
 * the sole authorization boundary. The /app layout
 * (apps/web/src/app/app/layout.tsx) calls the DB-backed
 * getCurrentSession() as the real, authoritative check — this is
 * defense in depth, not a duplicate of it. See ADR-0004.
 */

const COOKIE_NAME = process.env.AUTH_SESSION_COOKIE_NAME ?? "zuvre_session";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let authenticated = false;
  if (token) {
    try {
      await verifySessionToken(token);
      authenticated = true;
    } catch {
      authenticated = false;
    }
  }

  if (!authenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
