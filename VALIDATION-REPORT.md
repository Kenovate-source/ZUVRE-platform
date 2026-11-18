# Validation report

Authoring environment: offline sandbox (no internet, no package installs, no database, no Vercel). Everything below was actually run
unless it is listed under **Not run**. Tools: TypeScript 6.0.3, esbuild 0.27, React 19.2 (sandbox copy), Playwright + headless Chromium, sharp.

## Passed (executed, results observed)
| Check | Command | Result |
|---|---|---|
| Static truthfulness / assets / secrets | `node scripts/verify-landing.mjs` | **12 / 12** — live capabilities (1) = registered (1); every "available" claim evidenced; asset paths exist with exact case; no rejected-asset / light-mode refs; demo guard present; no `.env`/keys |
| Strict type-check | `node scripts/validation/typecheck.cjs` | **0 errors, 82 files** under `strict` + `noUncheckedIndexedAccess`, `typedRoutes` emulated from the file tree (13 routes). Negative control confirmed it rejects unchecked indexing, `string`/unknown hrefs and missing `alt` |
| Landing / journey / a11y / contrast / motion / no-JS / responsive / touch | `node scripts/validation/t-landing.cjs` | **30 / 30** — real pages+components bundled and driven in Chromium. Contrast measured on the *rendered* backdrop: min **4.64 : 1** (Nocturne), **4.65 : 1** (Aubade); reduced motion → zero animations; no-JS → full content; no overflow/header fit at 320–1440 px |
| Local demo auth, demo app, security, isolation | `node scripts/validation/t-demo.cjs` | **25 / 25** — sign-up, log-in (case-insensitive), refresh-restore, log-out, validation, no account-enumeration, hostile display name rendered as text, password never stored (PBKDF2 150 k + salt), cross-tab sign-out, account isolation, corrupt-storage resilience, insecure-context message, reset touches only `zuvre.demo.v1.*`, zero off-origin requests, **production bundle with the flag still `1` keeps demo off** |
| Asset pipeline | `python3 scripts/build-brand-assets.py …` | derivatives regenerate reproducibly; originals preserved in `brand/source/` |

## Defects found by this validation and fixed
Aubade small-text contrast (Patina 3.0 : 1 → accent-text tone) · header overflowing at 360 px · Zuri card edge visible at small sizes (size-aware feather + portal glow) ·
`Uint8Array`→`BufferSource` type error (TS ≥ 5.7) · logo emblem occluded by Zuri's box · decorative-art rectangles (luminance-to-alpha) · nav icon misalignment ·
unverifiable "available" claims in the narrative path (now `backedBy`-checked). Earlier in the same engagement: route-group URL bug, missing default `ai.chat` grant,
`Record<string,…>` indexing, unused `@ts-expect-error` (TS2578), Prisma-generate caching (ADR-0005).

## Not run / not verifiable here — do these before trusting a deploy
| Item | Why | What to do |
|---|---|---|
| `pnpm install`, `next build`, `next lint` | no network (registry 403) | run `pnpm install && pnpm build` |
| A real Vercel build / deployment | offline | deploy; follow `DEPLOYMENT.md` checklist |
| Type-check of Prisma/zod/jose server code and the `/app/*` DB pages | no generated Prisma client or packages offline | `pnpm typecheck` after install |
| `/app/*` pages and real sign-in in a browser | need a database | run with a DB; test register → home → chat |
| Real AI responses | need `ANTHROPIC_API_KEY` | configure and send a message |
| Tailwind-styled pre-existing pieces (theme toggle, chat bubbles) rendering | Tailwind not installed offline (harness uses small stand-in CSS) | eyeball in the browser |
| Other browsers / real devices / GPU performance | only headless Chromium was available | test Safari, Firefox, a phone; watch CPU on the landing page |
| `pnpm dev:demo` launcher itself | Next not installed (script syntax-checked only) | run it once after install |
| Screen-reader behaviour | no AT available | spot-check with VoiceOver/NVDA |

## Harness caveats
`next/image`, `next/link`, `next/navigation` are shimmed (plain `<img>`/`<a>`); fonts fall back to system serif/sans (Cormorant/Inter/Plex load only under Next);
React/Next typings are stubs (element props typed loosely). This is strong evidence about the **real component code and CSS**, not a substitute for a Next.js build.
