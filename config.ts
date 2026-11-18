/**
 * LOCAL DEMO MODE — a browser-only stand-in for the real authentication
 * backend, so ZUVRE can be explored and demonstrated with no database.
 *
 * It is ISOLATED from real authentication by construction:
 *   - It is ON only when BOTH `NEXT_PUBLIC_ZUVRE_LOCAL_DEMO=1` is set AND the
 *     build is not a production build (`NODE_ENV !== "production"`). A
 *     production build (`next build` / a Vercel deploy) can therefore never
 *     enable it, whatever the environment variables say. Both values are
 *     inlined at build time.
 *   - When it is OFF, every demo route renders an explanatory notice and the
 *     real /login and /register forms (which talk to the real API) are used.
 *   - It never touches the real session cookie, the database, or any API.
 *
 * It is NOT production security: accounts live in this browser's localStorage
 * and anyone with access to the browser profile can read or delete them.
 * See docs/11-local-demo-mode.md.
 */
export const DEMO_MODE_ENABLED: boolean =
  process.env.NEXT_PUBLIC_ZUVRE_LOCAL_DEMO === "1" && process.env.NODE_ENV !== "production";

/** Every localStorage key this mode owns starts with this prefix (and nothing else does). */
export const DEMO_STORAGE_PREFIX = "zuvre.demo.v1";
