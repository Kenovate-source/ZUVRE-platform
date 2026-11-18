#!/usr/bin/env node
// Static verification of the landing/demo surface. Dependency-free. Exit 1 on any failure.
//   - every capability marked available/in-development points at REAL code, and the live-capability
//     count equals what the server actually registers (no marketing claim without an implementation)
//   - every "available" claim in the narrative (Thought → World path) is backed by an evidenced entry
//   - every referenced brand asset exists, with EXACT filename case (Vercel runs on case-sensitive Linux)
//   - every literal route link resolves to a real page
//   - no rejected-asset / light-mode references (comments ignored); the demo-mode production guard is present
//   - no real .env file, API key, or private key is shipped
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "apps/web/src");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
const results = [];
const check = (name, fn) => { try { results.push([true, name, fn()]); } catch (e) { results.push([false, name, e.message]); } };
const need = (c, m) => { if (!c) throw new Error(m); };

function exactCaseExists(abs) {
  let cur = ROOT;
  for (const seg of path.relative(ROOT, abs).split(path.sep)) { if (!fs.existsSync(cur) || !fs.readdirSync(cur).includes(seg)) return false; cur = path.join(cur, seg); }
  return true;
}
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", "dist"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
const field = (text, name) => (text.match(new RegExp("\\b" + name + ":\\s*\"([^\"]+)\"")) || [])[1];

const caps = read("apps/web/src/content/capabilities.ts");
const claims = [...caps.matchAll(/\{[^{}]*?status:\s*"(available|in-development)"[^{}]*?\}/gs)].map((m) => ({ text: m[0], status: m[1] }));
const stages = claims.filter((c) => /\btoday:/.test(c.text)).map((c) => ({ id: field(c.text, "id"), backedBy: field(c.text, "backedBy") }));
const entries = claims.filter((c) => !/\btoday:/.test(c.text)).map((c) => ({ status: c.status, id: field(c.text, "id"), kind: field(c.text, "kind"), evidence: field(c.text, "evidence"), capabilityId: field(c.text, "capabilityId") }));

check("every available / in-development entry carries evidence that points at a file that exists", () => {
  for (const o of entries) { need(o.evidence, `"${o.id}" is ${o.status} but has no evidence path`); need(fs.existsSync(path.join(ROOT, o.evidence)), `"${o.id}" evidence missing: ${o.evidence}`); }
  return `${entries.length} entries checked`;
});
check("live CAPABILITY count equals the capabilities the server actually registers", () => {
  const boot = read("apps/web/src/server/capabilities/bootstrap.ts");
  const registered = ((boot.match(/const definitions = \[([^\]]*)\]/) || [])[1] || "").split(",").map((s) => s.trim()).filter(Boolean);
  const live = entries.filter((o) => o.status === "available" && o.kind === "capability");
  need(live.length === registered.length, `${live.length} marked live vs ${registered.length} registered`);
  for (const o of live) { need(o.capabilityId, `"${o.id}" lacks capabilityId`); need(read(o.evidence).includes(`"${o.capabilityId}"`), `${o.evidence} does not define "${o.capabilityId}"`); }
  return `${live.length} live = ${registered.length} registered (${live.map((o) => o.capabilityId).join(", ")})`;
});
check("every 'available' stage of the Thought → World path is backed by an evidenced entry", () => {
  for (const st of stages) { need(st.backedBy, `stage "${st.id}" claims availability but has no backedBy`); need(entries.some((o) => o.id === st.backedBy && o.status === "available"), `stage "${st.id}" is backed by unknown/non-available "${st.backedBy}"`); }
  return stages.map((x) => x.id + " <- " + x.backedBy).join(", ");
});
check("nothing is described as 'in development' without work-in-progress evidence", () => {
  const dev = entries.filter((o) => o.status === "in-development"); return dev.length === 0 ? "none claimed" : dev.length + " claimed, all evidenced";
});
check("every referenced brand asset exists with EXACT filename case", () => {
  const refs = new Set([...read("apps/web/src/content/brand-assets.ts").matchAll(/src:\s*"(\/brand\/[^"]+)"/g)].map((m) => m[1]));
  for (const css of ["apps/web/src/app/landing.css", "apps/web/src/app/globals.css"]) for (const m of read(css).matchAll(/url\("?(\/brand\/[^")]+)"?\)/g)) refs.add(m[1]);
  for (const r of refs) need(exactCaseExists(path.join(ROOT, "apps/web/public", r)), "missing or wrong case: " + r);
  return refs.size + " asset paths";
});
check("derived favicon/app icons exist", () => { for (const f of ["icon.png", "apple-icon.png", "favicon.ico"]) need(exactCaseExists(path.join(SRC, "app", f)), f + " missing"); return "icon.png apple-icon.png favicon.ico"; });
check("canonical originals are preserved in brand/source/", () => {
  for (const f of ["LOGO SYSTEM/ZUVRE Primary Logo.png", "LOGO SYSTEM/ZUVRE Logo Mark  Symbol.png", "LOGO SYSTEM/ZUVRE Wordmark.png", "ZURI/Zuri - Master Character.png"]) need(exactCaseExists(path.join(ROOT, "brand/source", f)), f);
  return "logo x3 + Zuri master";
});
check("every literal route link in the content resolves to a real page", () => {
  const appDir = path.join(SRC, "app"); const pages = new Set(["/"]);
  for (const f of walk(appDir)) if (f.endsWith("page.tsx")) pages.add("/" + path.relative(appDir, path.dirname(f)).split(path.sep).filter((s) => s && !/^\(.*\)$/.test(s)).join("/"));
  const hrefs = [...caps.matchAll(/href:\s*"(\/[^"]*)"/g)].map((m) => m[1]);
  for (const h of hrefs) need(pages.has(h), "no page for " + h);
  return hrefs.length + " hrefs -> " + pages.size + " pages";
});
check("no rejected-asset or light-mode references in source (comments ignored)", () => {
  const bad = [];
  for (const f of walk(SRC)) {
    if (!/\.(tsx?|css)$/.test(f)) continue;
    const s = stripComments(fs.readFileSync(f, "utf8")); const rel = path.relative(ROOT, f);
    if (/IconAiAgent|ai-agent|robot-head|Orbit\s*&\s*Execute/i.test(s)) bad.push(rel + " (rejected AI Agent icon)");
    if (/data-zuvre-theme=["']light["']/.test(s)) bad.push(rel + " (light mode)");
  }
  need(bad.length === 0, bad.join("; ")); return "clean";
});
check("LOCAL DEMO MODE is guarded so a production build can never enable it", () => {
  const c = read("apps/web/src/lib/demo/config.ts");
  need(/NEXT_PUBLIC_ZUVRE_LOCAL_DEMO\s*===\s*"1"/.test(c) && /NODE_ENV\s*!==\s*"production"/.test(c), "config.ts must require BOTH the flag and a non-production build");
  const readers = walk(SRC).filter((f) => /\.tsx?$/.test(f) && !f.endsWith(path.join("demo", "config.ts")) && /process\.env\.NEXT_PUBLIC_ZUVRE_LOCAL_DEMO/.test(fs.readFileSync(f, "utf8")));
  need(readers.length === 0, "flag read outside config.ts: " + readers.map((f) => path.relative(ROOT, f)));
  return "single guarded source of truth";
});
check("demo passwords are never stored in plaintext (only PBKDF2 salt + hash are written)", () => {
  const a = read("apps/web/src/lib/demo/auth.ts");
  need(a.includes("derivePasswordHash") && !/password\s*:\s*input\.password/.test(a), "auth.ts must hash before saving"); return "salt + hash only";
});
check("no real .env, API key or private key is shipped", () => {
  const bad = [];
  for (const f of walk(ROOT)) {
    const rel = path.relative(ROOT, f);
    if (/(^|\/)\.env(\..+)?$/.test(rel) && !rel.endsWith(".env.example")) bad.push(rel + " (env file)");
    if (/\.(pem|key|p12)$/.test(rel)) bad.push(rel);
    if (/\.(tsx?|mjs|cjs|json|md|css|ya?ml)$/.test(rel) && /sk-ant-[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AUTH_SECRET=[A-Za-z0-9+/]{24,}/.test(fs.readFileSync(f, "utf8"))) bad.push(rel + " (secret-looking string)");
  }
  need(bad.length === 0, bad.join("; ")); return "clean";
});

let failed = 0;
for (const [ok, name, d] of results) { if (!ok) failed++; console.log((ok ? "PASS  " : "FAIL  ") + name + (d ? "  - " + d : "")); }
console.log(`\nverify-landing: ${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
