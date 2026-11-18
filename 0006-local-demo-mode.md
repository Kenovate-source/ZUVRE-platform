# ADR-0006 — Local demo mode is a separate, development-only adapter

**Context:** the authentication backend is not deployable yet, but the experience must be explorable and testable locally.
**Decision:** add a browser-only demo sign-in (localStorage + PBKDF2) under its own routes (`/demo/*`) and components, instead of changing the
real auth design. It is enabled only when `NEXT_PUBLIC_ZUVRE_LOCAL_DEMO=1` **and** `NODE_ENV !== "production"`; the flag is read in exactly one file.
**Rejected:** a silent fallback to local auth when the API is unreachable (would downgrade production security); mock API routes that mimic the
real ones (would blur demo and real behaviour); storing plaintext or reversibly-encrypted passwords.
**Consequences:** the real `/api/auth/*`, cookie sessions, middleware and `/app/*` are untouched; demo and real can't be confused (banners, separate routes,
"No AI is connected" notices); a production build ignores the flag entirely (tested). See `docs/11-local-demo-mode.md`.
