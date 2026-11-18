#!/usr/bin/env node
// Starts the Next.js dev server with LOCAL DEMO MODE enabled — no database, no secrets, no .env file needed.
// (Demo mode is development-only: a production build can never enable it. See docs/11-local-demo-mode.md.)
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const web = path.join(root, "apps/web");

let nextBin;
try {
  nextBin = createRequire(path.join(web, "package.json")).resolve("next/dist/bin/next");
} catch {
  console.error("Next.js is not installed yet. Run `pnpm install` from the repository root first.");
  process.exit(1);
}

console.log(`
  ZUVRE — LOCAL DEMO MODE  (browser-only accounts · development only)
  Open  http://localhost:3000   (use "localhost" — not a LAN IP; see docs/11-local-demo-mode.md)
`);

const child = spawn(process.execPath, [nextBin, "dev"], {
  cwd: web,
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_ZUVRE_LOCAL_DEMO: "1" },
});
child.on("exit", (code) => process.exit(code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
