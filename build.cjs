// Bundles the REAL pages/components (not copies) with esbuild for headless-Chromium testing. Only next/image,
// next/link and next/navigation are shimmed. Two variants: dev (demo mode on) and prod (NODE_ENV=production with
// the demo flag STILL set — the demo must stay off). Requires global: esbuild (via tsx), react, react-dom, playwright, sharp.
const G = process.env.NODE_GLOBALS || "/home/claude/.npm-global/lib/node_modules";
// The sandbox's tool layout varies between images (global modules may be symlinks into /opt/npm-tools), so search.
const ROOTS = [G + "/tsx", G, "/opt/npm-tools/node_modules"];
const esbuild = (() => { for (const base of ROOTS) { try { return require(require.resolve("esbuild", { paths: [base] })); } catch {} } throw new Error("esbuild not found; set NODE_GLOBALS"); })();
const path = require("path"), fs = require("fs");
const REPO = path.resolve(__dirname, "../..");
const variants = { dev: { NODE_ENV: "development", DEMO: "1" }, prod: { NODE_ENV: "production", DEMO: "1" } };
const common = (v) => ({ bundle: true, jsx: "automatic", nodePaths: [G, "/opt/npm-tools/node_modules"], logLevel: "warning",
  alias: { "@": path.join(REPO, "apps/web/src"), "next/image": path.resolve(__dirname, "src/next-image.tsx"), "next/link": path.resolve(__dirname, "src/next-link.tsx"), "next/navigation": path.resolve(__dirname, "src/next-navigation.ts") },
  define: { "process.env.NODE_ENV": JSON.stringify(v.NODE_ENV), "process.env.NEXT_PUBLIC_ZUVRE_LOCAL_DEMO": JSON.stringify(v.DEMO) } });
(async () => {
  fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
  for (const [name, v] of Object.entries(variants)) {
    await esbuild.build({ ...common(v), entryPoints: [path.join(__dirname, "src/entry-client.tsx")], outfile: path.join(__dirname, "dist/client-" + name + ".js"), platform: "browser", format: "iife" });
    await esbuild.build({ ...common(v), entryPoints: [path.join(__dirname, "src/entry-server.tsx")], outfile: path.join(__dirname, "dist/server-" + name + ".cjs"), platform: "node", format: "cjs" });
    require("child_process").execSync(`node ${path.join(__dirname, "dist/server-" + name + ".cjs")} ${path.join(__dirname, "dist/ssr-" + name + ".html")} /`);
  }
  let g = fs.readFileSync(path.join(REPO, "apps/web/src/app/globals.css"), "utf8").replace(/@tailwind [a-z]+;/g, "").replace(/theme\("fontFamily\.mono"\)/g, "var(--font-mono), ui-monospace, monospace");
  const l = fs.readFileSync(path.join(REPO, "apps/web/src/app/landing.css"), "utf8");
  // Harness-only: the few Tailwind utilities pre-existing components use (Tailwind isn't installed in the sandbox).
  const tw = ".flex{display:flex}.items-center{align-items:center}.gap-1{gap:.25rem}.p-1{padding:.25rem}.rounded-md{border-radius:6px}.px-3{padding-inline:.75rem}.py-1\\.5{padding-block:.375rem}.text-sm{font-size:.875rem}.font-medium{font-weight:500}.bg-accent-primary{background:var(--zuvre-accent-primary)}.text-accent-primary-contrast{color:var(--zuvre-accent-primary-contrast)}.text-text-secondary{color:var(--zuvre-text-secondary)}.mt-auto{margin-top:auto}.pt-4{padding-top:1rem}.hover\\:text-text-primary:hover{color:var(--zuvre-text-primary)}button{font:inherit}body{margin:0;font-family:ui-sans-serif,system-ui,sans-serif}a{color:inherit;text-decoration:none}*{box-sizing:border-box}";
  fs.writeFileSync(path.join(__dirname, "dist/styles.css"), g + "\n" + l + "\n" + tw);
  console.log("built client+server x {dev,prod}, SSR landing, styles");
})().catch((e) => { console.error(e); process.exit(1); });
