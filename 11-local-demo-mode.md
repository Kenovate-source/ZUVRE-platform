# 11 — Local demo mode

Status: implemented (ADR-0006). Validated by `scripts/validation/t-demo.cjs` (25 checks).

## What it is
A **browser-only stand-in for sign-in**, so ZUVRE can be explored and demonstrated before the real
authentication backend (database + sessions) is connected. It lets a visitor sign up, log in, stay
signed in across refreshes, use a small demo app (Home → onboarding, Worlds, a conversation space,
Settings) and log out.

## What it is NOT
- **Not authentication.** Accounts are records in this browser's `localStorage`. Anyone with access to
  the browser profile can read, copy or delete them. Do not use a password you use elsewhere.
- **Not the product.** No server, no database, **no AI**. The conversation space saves what you type and
  says plainly that nothing will reply. It never fabricates an answer.
- **Not available in production.** See *Isolation*.

## Run it
```bash
pnpm install
pnpm dev:demo            # sets NEXT_PUBLIC_ZUVRE_LOCAL_DEMO=1 for you → http://localhost:3000
```
or put `NEXT_PUBLIC_ZUVRE_LOCAL_DEMO=1` in `apps/web/.env.local` and run `pnpm dev`
(Next.js reads env files from `apps/web/` only). Use **`http://localhost:3000`** — Web Crypto (needed to
hash passwords) only exists in a secure context; on a LAN IP over http the form explains this instead of failing.

## The flow
| Step | Where | Notes |
|---|---|---|
| Explore with no account | `/`, `/login`, `/register` | public; nothing is written to storage |
| Sign up | `/register` | name, email (stays in the browser), password ≥ 8 chars; validated field-by-field |
| One-click guest | `/login` or `/register` | no email/password; stored as a guest with no credential fields |
| Log in | `/login` | email is case-insensitive; wrong password and unknown email give the *same* message |
| Use the app | `/demo/home`, `/demo/worlds`, `/demo/worlds/<id>`, `/demo/chat`, `/demo/settings` | needs a demo session; otherwise redirected to `/login` |
| Refresh | any `/demo/*` | session restored from storage |
| Log out | nav → *Log out* | clears the **session**, keeps accounts |
| Reset | `/demo/settings` → *Reset all local demo data…* | removes **only** keys starting `zuvre.demo.v1.` |

When a demo session exists, the landing page's primary button becomes **"Continue in the demo"**.

## How it works
- `apps/web/src/lib/demo/config.ts` — the single guard (see below).
- `password.ts` — **PBKDF2-HMAC-SHA-256, 150 000 iterations, 16-byte random salt** via Web Crypto. The password is
  never stored, logged or transmitted; only `salt` + derived `hash` are kept.
- `store.ts` — the only code that touches `localStorage`; every read tolerates unavailable storage / corrupt JSON.
- `auth.ts` — validation, sign-up, log-in, guest, session restore, log-out.
- `components/demo/*` — provider (syncs across tabs via the `storage` event), forms, gate, shell, pages.

Keys: `zuvre.demo.v1.accounts`, `.session`, `.worlds.<accountId>`, `.messages.<accountId>.<scope>`, `.onboarding.<accountId>`.

## Isolation from real authentication
1. Demo mode is **on only if** `NEXT_PUBLIC_ZUVRE_LOCAL_DEMO === "1"` **and** `NODE_ENV !== "production"`. Both are inlined at
   build time, so **`next build` / a Vercel deployment can never enable it**, whatever env vars are set.
   (`t-demo.cjs` builds a production bundle with the flag still `1` and proves: `/login` is the real form, `/demo/*` is
   refused, and a *planted* demo session is ignored.)
2. `verify-landing.mjs` fails if the flag is read anywhere except `config.ts`.
3. It never touches the real session cookie, `/api/auth/*`, the database or any network endpoint (the suite asserts zero
   off-origin requests).
4. The real `/login`/`/register` forms and `/app/*` routes are untouched and are what render whenever demo mode is off.

## Known limits
- Browser storage is not private from the user's own machine; a local attacker can brute-force a stored hash.
- Accounts don't sync between browsers; clearing site data deletes them.
- Private/incognito windows may block or discard storage (the forms report this).
- There is no password reset (use *Reset all local demo data*).
