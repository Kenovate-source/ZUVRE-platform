# ZUVRE — Status Report

This file is the single source of truth for what in this repository is
**real and implemented**, what is **designed but not implemented**, and
what has **not been validated** because this environment has no network
access. Nothing below claims a test ran that didn't, or a package
installed that wasn't.

> **Deployment note:** three build-breaking issues found during the first
> Vercel deploy attempt (missing lockfile, missing pnpm install hardening,
> a Prisma output-path mismatch) have been fixed in this codebase. See
> `DEPLOYMENT.md` for exact Vercel settings and the one remaining local
> step — generating `pnpm-lock.yaml` on a machine with network access —
> that this environment cannot perform. **A new migration is also
> required for Phase 1** — see "Phase 1: What's Actually Implemented"
> below.

## Phase 1: What's Actually Implemented

- **The `World` model** — didn't exist before Phase 1. Added to
  `packages/db/prisma/schema.prisma`, with `Conversation.worldId`
  (optional) linking conversations to a World. Full relation-pairing
  verified programmatically across the whole schema (34/34 pairs
  matched) — see ADR-0004.
- **Real authentication**: `/register`, `/login`, `/logout` API routes,
  cookie-based sessions (`apps/web/src/server/auth/session.ts`) wrapping
  the previously-unused `packages/auth` primitives, backed by real
  `Session` DB rows (not just JWT expiry) so revocation actually works.
  Registration creates a personal `Workspace`, seeds an `owner` `Role`
  from the previously-unused `DEFAULT_ROLE_PERMISSIONS` constant, and
  creates the `WorkspaceMember` linking them — all in one transaction.
- **The capability-execution security gap is fixed.** The
  `/api/capabilities/execute` route previously trusted a client-supplied
  `workspaceId` outright (its own prior comment admitted this). It now
  calls `requireWorkspaceAccess()`
  (`apps/web/src/server/auth/workspace-access.ts`), which verifies the
  authenticated session belongs to an ACTIVE `WorkspaceMember` of the
  exact workspace requested — not just that *someone* is logged in.
- **`middleware.ts`** — fast, Edge-compatible JWT-signature check
  gating `/app/*`, with the DB-backed authoritative check happening in
  the `/app` layout (Edge runtime can't run Prisma) — documented
  explicitly as defense-in-depth, not redundant duplication.
- **Persistent AI chat** — `/api/chat` (new route) wraps the *unchanged*
  `ai.chat` capability with real `Conversation`/`Message` persistence.
  History sent to the capability is capped at the most recent 50
  messages, matching `ai.chat`'s own input schema limit (`.max(50)`) —
  found and fixed during this pass; loading unbounded history would have
  made any conversation past 50 messages fail silently.
- **The application shell**: `/app` section (`apps/web/src/app/app/`), protected layout,
  Home / Worlds / Chat / Settings pages — the trimmed information
  architecture from `ZUVRE_Phase1_Implementation_Blueprint.md` §6.
  Create/Explore/Capabilities/Library were deliberately not built —
  there's one real capability; that navigation would lead nowhere.
- **Worlds**: create (Server Action), list, detail page that resumes the
  most recent conversation's messages on return — satisfying "return to
  your World and continue interacting," not just "create and view."
- **`run-capability.ts`** — the grant-check/execute/record logic
  extracted from the execute route so the new chat route reuses it
  instead of duplicating it. Behavior unchanged from the original route.
- **ADR-0004** documents the session/authorization architecture decision.

**Known Phase 1 simplifications, stated plainly, not hidden:**
- Email verification is deferred — no email infrastructure exists
  anywhere in the repo. Registration signs the user in immediately.
- One personal workspace per user, resolved fresh per request rather
  than stored in the session — correct for Phase 1's actual scope (no
  team workspaces yet), revisit if that changes.
- Handles/workspace slugs always get a random suffix rather than
  retrying on collision.
- No rate-limiting or CSRF mitigation on the new auth routes — flagged
  as a real risk in the blueprint (§14), not resolved in this pass.
- Settings page is read-only (display name/handle/email) — no editing.

## Phase 0: What's Actually Implemented

- **Monorepo scaffold**: pnpm workspace + Turborepo config, shared strict
  TypeScript config, 4 packages + 1 app, all with real (not placeholder)
  source code.
- **Data model**: a complete, heavily-commented Prisma schema covering
  identity, workspaces/roles/members, the capability system, agents,
  conversations/memory, plans/entitlements/billing, links/QR, and audit
  logs — `packages/db/prisma/schema.prisma`.
- **Workspace isolation guard**: `scopedDb()` / `ownerDb()` in
  `packages/db/src/scope.ts`.
- **Capability SDK**: `defineCapability`, `capabilityRegistry`, and the
  full execution-context contract — `packages/capability-sdk`.
- **AI Gateway**: provider-agnostic routing with fallback and usage
  tracking, plus one real provider adapter (Anthropic, raw `fetch`, no
  SDK dependency) — `packages/ai-gateway`.
- **Auth foundation**: RBAC permission matching, JWT session issuing/
  verification, scrypt password hashing, and an owner-action audit
  wrapper — `packages/auth`. (As of Phase 1, actually wired into real
  routes — see above.)
- **Design system tokens**: canonical ZUVRE brand tokens (Tier 1 — exact
  hex from the Brand Handoff Package: Nocturne 950–800, ZUVRE Gold,
  Ivory, Patina, Glass, Moss) plus derived UI tokens, WCAG-checked, not
  eyeballed — `packages/ui/src/tokens.ts`, `apps/web/src/app/globals.css`.
- **Real font loading**: Cormorant Garamond / Inter / IBM Plex Mono via
  `next/font/google`.
- **Brand identity system**: a production-reconstructed logo mark, a
  wordmark with the real tagline ("Give Thought a World."), and a Zuri
  integration contract that renders an explicit "asset pending" state
  rather than a fabricated illustration.
- **Icon system**: 20 real SVG icon components across Core (8),
  Capability (6, AI Agent explicitly excluded), and Navigation/UI (6,
  from the canonical Set 2 only).
- **Motion system documentation**: all 8 canonical sequences specified;
  one (UI/Interface Transitions) actually implemented.
- **Landing experience**: the marketing page at `/` — untouched by
  Phase 1 except that its "Enter ZUVRE" buttons now genuinely link to
  `/register` instead of being decorative.
- **One real, end-to-end capability**: `ai.chat`, registered via
  `bootstrapCapabilities()`.
- **Documentation**: Product Bible, Architecture, Brand Book, Capability
  System Spec, 4 ADRs (0001–0004), docs index.
- **Seed data**: plan definitions (Spark/Ember/Atlas/Orbit) and platform
  role stubs — `packages/db/prisma/seed.ts`. **Phase 1 registration
  depends on the "spark" Plan row existing** — a real deployment
  dependency this codebase cannot guarantee on its own.

## What's Designed But NOT Implemented

- Any capability besides `ai.chat`.
- The Owner Control Center UI (schema and audit plumbing exist; no
  dashboard screens).
- Agent execution runtime (schema exists; no planner/executor code).
- Async/queued job worker (ADR-0003 — deliberately deferred).
- Billing/payment provider integration.
- Email verification, password reset, multi-workspace switching.
- 15 of the 20 originally-requested documentation files remain
  outlined-and-linked rather than standalone (see `docs/README.md`).
- Full ornate chrome/glass logo, production Zuri assets, AI Agent icon,
  ~40 remaining icons, 7 of 8 motion sequences — all previously flagged,
  unchanged by Phase 1 since this pass was scoped to functional
  platform work, not visual assets (per the Phase 1 mission's own
  explicit instruction not to block on them).

## Tests

**No tests exist yet, and none were run.** This environment has no
network access, so `pnpm install` cannot complete and nothing here has
been compiled, type-checked with the project's own toolchain, linted, or
executed as a real build. Concretely:

- `pnpm install` / `next build` / `prisma generate` / `prisma migrate` —
  **not run** (no registry access, no database connection).
- Unit/integration/API/authorization/workspace-isolation tests — none
  written; real outstanding work, not a hidden gap.

**What actually was validated this pass** (see the Phase 1 implementation
report for full detail): the entire Prisma schema's relation pairing,
checked programmatically (34/34 correct); every import in all 67
TypeScript files in `apps/web/src`, checked programmatically (0 broken);
every new Prisma call's field names, cross-referenced by hand against
the actual schema; a full sweep for `noUncheckedIndexedAccess`-risk
patterns across all new files (0 found); the discriminated-union
authorization-result type, the Prisma `$transaction` callback pattern,
and the actual (not simplified) `session.ts` file, each compiled
successfully against the real global TypeScript compiler under this
project's exact `strict`/`noUncheckedIndexedAccess` settings, using
hand-written stub types for `next/headers`/`react`/the two workspace
packages involved. That is real, evidence-based static verification —
still not the same guarantee as a passing `pnpm build` against the
actual installed dependencies and a real database, which this
environment cannot run.

## Required Before Deploying Phase 1

```bash
pnpm install
pnpm --filter @zuvre/db migrate dev   # creates the World table + Conversation.worldId column
pnpm exec tsx packages/db/prisma/seed.ts   # if not already run — registration needs the "spark" Plan row
pnpm build
```

## Recommended Next Phase

1. Run the above, fix whatever a real build surfaces.
2. Write the test suite against Phase 1's new auth/World/chat flows
   before adding more surface area.
3. Add rate-limiting to the auth routes (flagged as an unresolved risk
   in `ZUVRE_Phase1_Implementation_Blueprint.md` §14).
4. Stand up the Owner Control Center's first screen.
5. Add a second real capability now that the World/chat pattern exists
   to extend.

