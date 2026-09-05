# ZUVRE PHASE 1 — IMPLEMENTATION BLUEPRINT

**Status: planning only.** No files were modified to produce this
document. Everything below is grounded in files actually opened in the
local repository during this task — no GitHub, no live deployment, no
web access were used or claimed. Where something is uncertain or
missing, that's stated explicitly rather than assumed.

---

## 1. Repository Reality Report

### Structure (every file, not a summary from memory)

```
zuvre/
  package.json, pnpm-workspace.yaml, turbo.json, tsconfig.base.json
  .env.example, .npmrc, .gitignore
  STATUS.md, README.md, DEPLOYMENT.md
  docs/
    01-product-bible.md, 03-brand-book.md, 06-architecture.md,
    09-capability-system.md, 10-motion-system.md, README.md
    adr/0001-monorepo-and-stack.md, 0002-capability-contract.md,
        0003-deferred-worker-infra.md
  apps/web/                          Next.js 14 App Router
    src/app/
      layout.tsx, page.tsx, globals.css   (landing page — Phase 0)
      api/capabilities/execute/route.ts   (the ONLY API route that exists)
    src/components/                       (20 icons, universe/, brand components)
    src/server/ai/gateway-instance.ts, server/capabilities/{ai-chat,bootstrap}.ts
  packages/
    db/        Prisma schema (complete), scoped client, seed.ts
    capability-sdk/   defineCapability, registry, execution context
    ai-gateway/       provider abstraction, one Anthropic adapter
    auth/             session (JWT), password (scrypt), permissions, owner audit
    ui/               design tokens (Nocturne/Aubade)
```

**Confirmed absent** (checked directly, not inferred): no
`middleware.ts` anywhere. No `api/auth/*` routes. No cookie-handling
code anywhere (`grep` for `next/headers`, `cookies()`,
`AUTH_SESSION_COOKIE_NAME` usage returns nothing outside `.env.example`
itself). No `World` model in the Prisma schema. No test files anywhere.
No `pnpm-lock.yaml`.

### What's real vs. designed-only (per STATUS.md, cross-checked against actual files)

**Real and working:**
- Prisma schema: Identity (User/Session/RecoveryFactor), Workspace/Role/WorkspaceMember, Capability system (CapabilityDefinition/Grant/Execution), Agent/AgentRun, Conversation/Message, MemoryItem, Plan/Subscription/EntitlementOverride, ZuvreLink/QrCode, AuditLog.
- `scopedDb()`/`ownerDb()` workspace-isolation guard (`packages/db/src/scope.ts`).
- Capability SDK contract + one real capability (`ai.chat`) wired through the one real API route.
- AI Gateway with a real Anthropic adapter.
- Auth **primitives**: `hashPassword`/`verifyPassword` (scrypt), `issueSessionToken`/`verifySessionToken` (JWT via `jose`), `hasPermission`/`assertPermission`, `withOwnerAudit`. All real, working code — confirmed by reading each file.
- Brand tokens, 20 icon components, landing page, motion-system spec doc.

**Confirmed NOT implemented (verified, not assumed):**
- **No route consumes any auth primitive.** The one API route
  (`execute/route.ts`) contains this exact comment: *"authentication
  (identifying the calling user/session) is omitted here for brevity in
  this foundation."* It accepts an arbitrary client-supplied
  `workspaceId` with zero session verification. This is a live security
  gap, not just a missing feature — flagged again in §14.
- No registration/login/logout logic anywhere — session issuing exists
  as a function, but nothing ever calls it.
- No personal-workspace-auto-creation logic (the schema's own comment
  says this should happen at signup; no code does it).
- No default-Role-seeding per workspace (`packages/auth`'s
  `DEFAULT_ROLE_PERMISSIONS` constant exists but nothing inserts these
  into the `Role` table for a new workspace).
- No `World` concept at any layer — data model, API, or UI.
- `ai.chat` (`apps/web/src/server/capabilities/ai-chat.ts`) is
  **entirely stateless**: it takes `message` + an optional client-
  supplied `history` array and never touches `Conversation`/`Message` at
  all, despite those models existing in the schema.

---

## 2. Phase 0 Completion Boundary

**Complete, per this task's instruction — not reopening:** landing page,
visual/brand system, logo, Zuri contract, icon system, motion
documentation, monorepo/tooling scaffold, Prisma schema (as a *schema*,
not as a fully-consumed data layer), capability contract architecture.

**Intentionally unfinished, carried into Phase 1 scope:** everything
listed as "not implemented" above — auth activation, Worlds (didn't
exist even as a concept at the data layer), AI persistence, any
authenticated application shell.

---

## 3. Phase 1 Scope

1. Real authentication: register, login, logout, session persistence, a protected application shell.
2. A `World` data model (new — doesn't exist) and the minimum UI to create/view/enter one.
3. `ai.chat` made stateful: real `Conversation`/`Message` persistence, optionally associated with a `World`.
4. The authenticated shell (nav, ZUVRE Home) a signed-in user lands in.
5. The specific, now-necessary security fix to the capability-execute route once real sessions exist (derive `workspaceId` from the session, don't trust the client).

## 4. Explicit Non-Goals (unchanged from the brief, confirmed against the repo — nothing here suggests otherwise)

Multi-agent orchestration, game/website/app/video/music generation, a marketplace, social features, collaboration systems, the Owner Control Center UI, a worker/queue (ADR-0003 already defers this — no Phase 1 capability needs async execution), any capability besides `ai.chat`, final production visual assets (logo/Zuri/motion — parallel track).

---

## 5. Complete User Journey

```
Visitor (/)
  → existing Phase 0 landing page, untouched
  → "Enter ZUVRE" → /register (new) or /login (new)

Authentication
  → /register: email + password + display name + handle
      → hashPassword() [exists] → create User
      → create personal Workspace (kind=PERSONAL) [logic doesn't exist yet]
      → seed a default "owner" Role for that workspace [logic doesn't exist yet]
      → create WorkspaceMember linking User↔Workspace↔Role
      → issueSessionToken() [exists] → create Session row → set cookie
  → /login: verifyPassword() [exists] → same session issuance
  → redirect to /app/home

Entry (protected shell)
  → middleware.ts [new] gates /app/* — no valid session cookie → redirect /login
  → (app) route group layout [new] resolves session → user + active workspace,
    renders the authenticated shell (nav, header)

Home (/app/home) [new]
  → recent Worlds, a way to start a new conversation, a way to create a World
  → deliberately NOT a dashboard of every future capability — one real
    capability exists; the home screen should reflect that honestly

AI (/app/chat or inside a World) [new]
  → conversation UI → POST to a (now-authenticated) capability-execute
    path → ai.chat runs → reply persisted as Message rows, tied to a
    Conversation, optionally tied to a World

World (/app/worlds, /app/worlds/[worldId]) [new]
  → create (name + description) → enter → see associated conversations
```

---

## 6. Information Architecture

The prompt's candidate list (Home / Create / Worlds / Conversations /
Explore / Capabilities / Library / Settings) is **larger than Phase 1's
real surface area** — with exactly one working capability, an
"Explore/Capabilities" browsing section would be a list of one item
wearing a full IA slot it doesn't need yet. Recommended trim:

| Nav item | Included in Phase 1? | Reasoning |
|---|---|---|
| **Home** | Yes | Entry point, required by the journey |
| **Worlds** | Yes | Central Phase 1 concept |
| **Chat** (AI) | Yes | The one real capability, needs a home |
| **Settings** | Minimal only | Account basics (display name, sign out) — not a full settings system |
| Create | **Deferred** | "Create" implies a capability picker; with one capability, this collapses into "start a conversation" — no separate surface needed yet |
| Explore / Capabilities | **Deferred** | Nothing to browse yet beyond `ai.chat`; building this now is premature per the non-goals |
| Conversations (as a standalone top-level section) | **Folded into Worlds/Home** | A conversation without a World is just "Chat"; a conversation library section is more naturally a future Worlds sub-view than its own nav item yet |
| Library | **Deferred** | No artifacts are produced yet (`ai.chat` returns text only, no `emitArtifact` calls) |

## 7. Data Architecture

**Existing models directly reusable, no changes needed:** `User`,
`Session`, `Workspace`, `WorkspaceMember`, `Role`, `CapabilityGrant`,
`CapabilityExecution`, `AuditLog`.

**Existing models needing a small, additive change:**
- `Conversation` — needs an optional `worldId` field + relation. Optional
  (not required) because a chat not yet organized into a World should
  still be possible, matching "minimum viable."

**Missing model — must be created:**
```prisma
model World {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  name        String
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  conversations Conversation[]

  @@index([workspaceId])
}
```
Kept deliberately minimal — no `artifacts`/`agents`/`files` relations
yet, since nothing in Phase 1 produces those. Extending it later is
additive (new optional relations), not a breaking change.

**Required migration:** yes, a real one — adding a model and a foreign
key is a genuine schema change requiring `prisma migrate dev` against a
real database. **This cannot be generated or applied in this sandbox**
(no database connection, no installed Prisma CLI) — the migration SQL
itself can be authored and reviewed here, but running it against a real
Postgres instance is outside this environment's capability.

**Not needed:** no changes to `Message`, `CapabilityExecution`, or
anything else — `Message.conversationId` already gives Worlds an
indirect path to conversation history via `Conversation.worldId`.

**Also needed, not a schema change:** default-Role seeding logic (code,
not schema) — `packages/auth`'s `DEFAULT_ROLE_PERMISSIONS` constant
already defines `owner`/`editor`/`viewer` permission sets; Phase 1 needs
the registration flow to actually insert a `Role` row per new workspace
using that constant. This is new application logic, not a migration.

## 8. Authentication Activation Plan

The primitives in `packages/auth` are real and reusable as-is — this is
activation, not a rebuild:

1. **New Next.js-specific session helper** (`apps/web/src/server/auth/`) —
   `packages/auth` is framework-agnostic by design (ADR 0001's package-
   boundary rule), so the `next/headers` `cookies()` calls belong in
   `apps/web`, wrapping `verifySessionToken`/`issueSessionToken`.
2. **New API routes**: `POST /api/auth/register`, `POST /api/auth/login`,
   `POST /api/auth/logout`. Register: `hashPassword` → create `User` →
   create personal `Workspace` → seed default `Role` → create
   `WorkspaceMember` → create `Session` row → `issueSessionToken` → set
   cookie (`AUTH_SESSION_COOKIE_NAME`, already defined in `.env.example`).
3. **New `middleware.ts`** — redirects unauthenticated requests away from
   the protected route group.
4. **New `(app)` route group layout** — resolves the session server-side,
   loads the user's active workspace, passes it down; this is also where
   a *missing* session gets a defense-in-depth redirect (middleware
   alone is fast but shouldn't be the only gate).
5. **Required fix to the existing capability-execute route** — once a
   real session exists, `workspaceId` must be derived from the verified
   session (checking the user is actually a member of that workspace),
   not accepted verbatim from the request body as it is today. This
   isn't new scope — it's closing the gap the route's own comment
   already flags.

**Deliberately deferred, flagged as a scope decision rather than silently
assumed:** email verification. `User.emailVerifiedAt` exists in the
schema, but no email-sending infrastructure exists anywhere in this
repository, and setting one up is real, separate scope. Recommendation:
Phase 1 registration creates the account and signs the user in
immediately, leaving `emailVerifiedAt` null — verification becomes a
Phase 2 concern. This needs your confirmation, not an assumption.

## 9. Worlds Architecture

Minimum viable, per §7's schema: a named, described container scoped to
a workspace, that conversations can optionally belong to. A Phase 1 user
can: create one (name + description), see a list of their worlds, enter
one, see its associated conversations, and start a new conversation from
inside it. No files, no artifacts, no agents, no collaborators yet — all
additive later.

## 10. AI Integration Architecture

Today, `ai.chat` takes a `history` array from the client and returns
`{ reply: string }` with no persistence at all. Phase 1 needs:

- The chat UI page sends `{ message, conversationId? }` instead of a raw history array.
- If `conversationId` is absent, the server creates a new `Conversation` (optionally with `worldId` if the chat was started from inside a World).
- Before calling `capability.execute`, load the `Conversation`'s prior `Message` rows to build history server-side (not trust client-supplied history for what's persisted — the client can still show its own optimistic UI).
- After a successful execution, persist both the user's message and the assistant's reply as `Message` rows.
- This is a change to **how the route/capability is called and what happens around it**, not to the capability contract itself (`ctx.reportProgress`/`emitArtifact`/`requestPermission` are unaffected) — consistent with ADR-0002's contract boundary.

## 11. Route Architecture

| Route | Type | Notes |
|---|---|---|
| `/` | existing | Phase 0 landing — untouched |
| `/register` | new page | |
| `/login` | new page | |
| `/api/auth/register` | new API route | |
| `/api/auth/login` | new API route | |
| `/api/auth/logout` | new API route | |
| `/app/home` | new page (protected) | |
| `/app/worlds` | new page (protected) | list + create entry point |
| `/app/worlds/[worldId]` | new page (protected) | |
| `/app/chat` | new page (protected) | conversation not yet tied to a World |
| `/app/settings` | new page (protected), minimal | |
| `/api/capabilities/execute` | **existing, modified** | add session-derived `workspaceId`, per §8 |

`middleware.ts` matches on `/app/:path*` (and the new `/api/*` routes
that need auth) to gate access before rendering.

## 12. Component Architecture

- **`app/(app)/layout.tsx`** — server component, resolves session,
  renders the authenticated shell (nav using the *already-built* icons —
  `IconHome`, `IconSettings`, `IconProfile` all exist and fit directly,
  a genuine continuity point with Phase 0's icon work).
- **List/detail pages** (Worlds list, World detail, Home) — server
  components, direct `scopedDb` reads, matching the existing pattern
  from `execute/route.ts`. No client-side data-fetching library needed.
- **Chat UI** — the one place a client component is genuinely required
  (interactive composer, message list, loading state). Kept as a small,
  localized client component per the precedent already set by
  `SpotlightButton`/`EcosystemConstellation` in Phase 0 — not a whole-
  page `"use client"` conversion.
- **Forms** (register/login/create-World) — small localized client
  components for the interactive parts (inputs, submit handling), pages
  themselves stay server components where possible.
- **Reused as-is:** all 20 icons, the design tokens, the component
  vocabulary classes (`.zuvre-card`, `.zuvre-button-primary`, etc.) —
  nothing about the brand system needs to change for Phase 1.

## 13. Implementation Batches

**Batch A — Data & server-side auth logic (no UI yet)**
`World` model + migration authoring, `Conversation.worldId`, role-seeding
logic, register/login business logic as pure functions. Verifiable by
schema/code review alone — no dependency on later batches.

**Batch B — Auth routes, middleware, protected shell**
The three `/api/auth/*` routes, `middleware.ts`, the `(app)` layout with
a placeholder "you're in" page. Verifiable by tracing the request flow
logic end-to-end on paper.

**Batch C — Home + Worlds**
`/app/home`, `/app/worlds`, `/app/worlds/[worldId]`, create-World flow.

**Batch D — AI chat, made stateful**
Chat UI + the `ai.chat`/route changes from §10, including the required
`workspaceId` security fix.

**Batch E — Settings + polish**
Minimal settings page, nav wiring, accessibility/reduced-motion pass on
any new interactive components (per the established Phase 0 standard).

## 14. Risks and Dependencies

- **No installed dependencies, no database connection, no network** —
  unchanged from every prior session. Nothing in Phase 1 can be
  build-tested or migration-applied in this sandbox. This is the
  dominant cross-cutting risk for every batch's validation.
- **The capability-execute route's missing auth check is a live gap
  today**, not just a future one — Batch D must close it, not just add
  auth alongside it.
- **No rate-limiting or CSRF mitigation exists anywhere.** New POST auth
  routes are a meaningfully larger attack surface than the current
  single capability route. Needs an explicit decision (even a minimal
  one) before Batch B ships, not silent deferral.
- **No email infrastructure** — affects the verification-deferral
  decision in §8.
- **`noUncheckedIndexedAccess: true`** applies to all new code (confirmed
  in `tsconfig.base.json`) — Worlds/Chat list rendering must follow the
  same guard/`.entries()` patterns already established and audited in
  the universe components.

## 15. Validation Strategy

Given the sandbox's confirmed inability to `pnpm install`/`build`/`test`:
each batch gets (a) careful manual consistency review — import paths,
Prisma field names matching the schema, env vars matching
`.env.example`, the same standard STATUS.md already holds every prior
piece of work to; (b) isolated compilation of any genuinely tricky
TypeScript (indexing, narrowing) against the real global `tsc` with
minimal stub types, the technique already proven effective in this
project's recent TypeScript-error fixes; (c) explicit, unambiguous
labeling of what's **CONFIRMED** (verified by one of the above) vs. **NOT
VERIFIED** (would require a real `pnpm install && pnpm build` this
environment cannot run) in every batch's own report — never blurred
together.

## 16. Recommended First Batch

**Batch A.** The `World` model and the auth *business logic* (not UI)
are the foundation everything else depends on, and they're the most
independently verifiable piece available — a Prisma schema addition can
be checked by careful relation-pairing review the same way the AI Agent
icon's rejected geometry and the `noUncheckedIndexedAccess` fixes were
checked, without needing a running database or built app. Building UI
against unstable server logic risks rework; getting the data layer and
registration/login functions right first avoids that.

---

**This is the complete blueprint. No implementation has begun, no files
were modified. Waiting for review and direction before Batch A starts.**
