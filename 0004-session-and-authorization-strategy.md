# ADR 0004: Session Cookie Strategy & Workspace Authorization Boundary

**Status:** Accepted

## Context

Phase 0 shipped real auth *primitives* (`packages/auth`: JWT session
issuing/verification, scrypt password hashing, RBAC permission matching)
but nothing ever called them. The one existing API route
(`/api/capabilities/execute`) accepted an arbitrary client-supplied
`workspaceId` with no session check at all — its own code comment said
so. Phase 1 needs a real activation of these primitives plus a concrete
answer to "how does a request prove who it's from, and how do we stop it
claiming access to a workspace it doesn't belong to."

## Decision

**Session transport:** an HTTP-only, `SameSite=Lax`, secure-in-production
cookie (name from `AUTH_SESSION_COOKIE_NAME`, already defined in
`.env.example`) carrying the JWT from `issueSessionToken`. Read/written
via `next/headers`'s `cookies()` API — this is Next.js-specific, so it
lives in `apps/web/src/server/auth/`, not in the framework-agnostic
`packages/auth` (per ADR-0001's package-boundary rule: `packages/auth`
stays consumable outside a Next.js context).

**The `Session` DB row is the source of truth for revocation.** The JWT's
`sid` claim references a real `Session.id`; logout (and future admin
action) revokes by setting `Session.revokedAt`, not just by deleting the
cookie client-side. A verified-but-revoked token is treated as invalid.

**Workspace authorization boundary — the actual security fix:** every
route that touches workspace-scoped data must derive `workspaceId` from
a real `WorkspaceMember` row for the *authenticated* user
(`WorkspaceMember.userId === session.userId && WorkspaceMember.workspaceId === requested`),
never from an unchecked request body field. This is centralized in one
function (`requireWorkspaceAccess`, `apps/web/src/server/auth/
workspace-access.ts`) used by both the (now-fixed) capability-execute
route and the new chat route, rather than duplicated per route.

**Registration creates a personal workspace synchronously**, matching
the schema's own long-standing comment ("a personal account is a
single-member Workspace created automatically at signup"): `User` →
`Workspace` (kind `PERSONAL`, plan `spark`) → `Role` (`owner`, seeded
from `packages/auth`'s existing `DEFAULT_ROLE_PERMISSIONS` constant,
which existed but nothing inserted it) → `WorkspaceMember`, all in one
request.

## Alternatives Considered

- **NextAuth/Auth.js** — rejected for Phase 1: `packages/auth` already
  has working, real primitives; adopting a third-party auth framework
  now would mean either running two auth systems side by side or
  discarding real existing code for no functional gain.
- **Trusting client-supplied `workspaceId` with a lighter check (just
  "does this workspace exist")** — rejected outright; this is exactly
  the gap being fixed, not a variant of it.

## Consequences

- Email verification is explicitly deferred (no email infrastructure
  exists anywhere in the repo yet) — `User.emailVerifiedAt` stays null
  through Phase 1. Registration signs the user in immediately.
- Registration depends on a `Plan` row with id `spark` existing in the
  database (seeded by `packages/db/prisma/seed.ts`). This is a real
  deployment dependency, not something this change can guarantee from
  application code alone.
