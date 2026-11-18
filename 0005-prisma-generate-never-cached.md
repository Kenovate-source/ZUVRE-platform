# ADR-0005 — `prisma generate` is never cached by Turborepo

**Status:** accepted. **Context:** Vercel failed with `Property 'world' does not exist on type 'PrismaClient'` although the
schema contained `World`. The log showed `@zuvre/db:build: cache hit` followed by a *replayed* "Generated Prisma Client" line: Turborepo
restored stored output instead of running `prisma generate` against the current schema, because `build` declared outputs (`.next/**`,
`dist/**`) that nothing Prisma produces — so a cache hit could never restore the generated client.

**Decision:** `turbo.json` gets a package-specific task `"@zuvre/db#build": { "cache": false, "outputs": ["node_modules/.prisma/**", "node_modules/@prisma/client/**"] }`.
Generation is cheap; correctness beats caching. The schema, the `World` model and the web code are unchanged.

**Consequences:** `@zuvre/db#build` always executes before dependants (`^build`). If a deploy ever still shows the old client, redeploy once with
the build cache cleared. A stale `prisma/generated/` line in `.gitignore` is harmless (the client is generated into `node_modules/.prisma`).
**Not verified here:** an actual Vercel build (no network in the authoring sandbox) — see `VALIDATION-REPORT.md`.
