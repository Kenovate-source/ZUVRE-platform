const G = process.env.NODE_GLOBALS || "/home/claude/.npm-global/lib/node_modules";
const { chromium } = (() => { for (const base of [G, "/opt/npm-tools/node_modules"]) { try { return require(require.resolve("playwright", { paths: [base] })); } catch {} } throw new Error("playwright not found"); })();
const fs = require("fs"), path = require("path");
const REPO = path.resolve(__dirname, "../..");
const PUB = path.join(REPO, "apps/web/public"), ICON = path.join(REPO, "apps/web/src/app/favicon.ico");
const TYPES = { ".webp": "image/webp", ".png": "image/png", ".js": "text/javascript", ".css": "text/css", ".ico": "image/x-icon" };
// http://localhost is a SECURE CONTEXT (like real `pnpm dev`), so Web Crypto exists. harness.local is NOT, which lets
// the suite test the insecure-context failure message deliberately.
const ORIGIN = "http://localhost:4173";
const INSECURE_ORIGIN = "http://harness.local";
function shell(variant, theme, urlPath) {
  const f = path.join(__dirname, "dist/ssr-" + variant + ".html"); let ssr = urlPath === "/" && fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
  const preloads = (ssr.match(/<link rel="preload"[^>]*>/g) || []).join(""); ssr = ssr.replace(/<link rel="preload"[^>]*>/g, "");
  return '<!doctype html><html lang="en" data-zuvre-theme="' + theme + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>ZUVRE harness</title>' + preloads + '<link rel="stylesheet" href="/styles.css"></head><body><div id="root">' + ssr + '</div><script src="/client.js"></script></body></html>';
}
/** Serves the real bundles/CSS/brand assets from disk via request routing (no ports, no network). variant: "dev" | "prod". */
async function newHarnessContext(browser, opts = {}, variant = "dev") {
  const ctx = await browser.newContext(opts); ctx.setDefaultTimeout(8000); const missing = [];
  const handler = (route) => {
    const url = new URL(route.request().url());
    const file = (f, type) => { try { return route.fulfill({ body: fs.readFileSync(f), contentType: type || TYPES[path.extname(f)] || "application/octet-stream" }); } catch { missing.push(url.pathname); return route.fulfill({ status: 404, body: "nf" }); } };
    if (url.pathname === "/client.js") return file(path.join(__dirname, "dist/client-" + variant + ".js"));
    if (url.pathname === "/styles.css") return file(path.join(__dirname, "dist/styles.css"));
    if (url.pathname === "/favicon.ico") return file(ICON);
    if (url.pathname.startsWith("/brand/")) return file(path.join(PUB, url.pathname));
    return route.fulfill({ body: shell(variant, url.searchParams.get("theme") === "aubade" ? "aubade" : "nocturne", url.pathname), contentType: "text/html" }); // SPA fallback ≈ App Router
  };
  await ctx.route(ORIGIN + "/**", handler); await ctx.route(INSECURE_ORIGIN + "/**", handler);
  ctx.__missing = missing; return ctx;
}
function watch(page) { const issues = []; page.on("console", (m) => { if (["error", "warning"].includes(m.type())) issues.push(m.type() + ": " + m.text()); }); page.on("pageerror", (e) => issues.push("pageerror: " + e.message)); page.on("requestfailed", (r) => issues.push("requestfailed: " + r.url())); return issues; }
module.exports = { chromium, newHarnessContext, watch, ORIGIN, INSECURE_ORIGIN, REPO, G };
