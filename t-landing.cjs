// Landing / journey / accessibility / contrast / reduced-motion / no-JS / responsive battery.
// Run:  node build.cjs && node t-landing.cjs     (ONLY=GE node t-landing.cjs  → run just groups G and E)
const { chromium, newHarnessContext, watch, ORIGIN, REPO } = require("./lib.cjs");
const sharp = (() => { for (const b of [process.env.NODE_GLOBALS || "/home/claude/.npm-global/lib/node_modules", "/opt/npm-tools/node_modules"]) { try { return require(require.resolve("sharp", { paths: [b] })); } catch {} } throw new Error("sharp not found"); })();
const fs = require("fs"), path = require("path");
const results = []; const assert = (c, m) => { if (!c) throw new Error(m); };
async function t(name, fn) { if (process.env.ONLY && !process.env.ONLY.split("").some((c) => name.startsWith(c))) return; try { const d = await fn(); results.push({ name, ok: true }); console.log("PASS  " + name + (d ? "  — " + d : "")); } catch (e) { results.push({ name, ok: false }); console.log("FAIL  " + name + "  — " + String(e.message).slice(0, 420)); } }
const NOSMOOTH = { content: "html{scroll-behavior:auto!important}" };
const jump = (p, y) => p.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
const toEl = (p, sel, off = 0) => p.evaluate(([s, o]) => { const e = document.querySelector(s); scrollTo({ top: e.getBoundingClientRect().top + scrollY - o, behavior: "instant" }); }, [sel, off]);
const toChapter = (p, id) => p.evaluate((i) => { const c = document.getElementById("chapter-" + i); scrollTo({ top: c.getBoundingClientRect().top + scrollY - innerHeight / 2 + c.offsetHeight / 2, behavior: "instant" }); }, id);
const activeChapter = (p) => p.evaluate(() => document.querySelector(".zl-chapter[data-active=true]").dataset.nodeId);
function routes() { const base = path.join(REPO, "apps/web/src/app"), out = []; (function walk(d, segs) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) { if (e.name === "api") continue; walk(path.join(d, e.name), /^\(.*\)$/.test(e.name) ? segs : [...segs, e.name]); } else if (e.name === "page.tsx") out.push("/" + segs.join("/")); } })(base, []); return out; }
const L = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };

async function contrast(page, items) {
  const rows = [];
  for (const [sel, min] of items) {
    if (!(await page.locator(sel).first().count())) { rows.push({ sel, skip: true }); continue; }
    await page.evaluate((s) => document.querySelector(s).scrollIntoView({ behavior: "instant", block: "center" }), sel); await page.waitForTimeout(1500);
    const info = await page.evaluate((s) => { const e = document.querySelector(s), r = e.getBoundingClientRect(), raw = getComputedStyle(e).color, nums = raw.match(/[\d.]+/g).map(Number); const c = raw.startsWith("color(") ? nums.slice(0, 3).map((v) => v * 255) : nums; /* color-mix() computes to color(srgb 0..1) */ return { r: { x: Math.max(0, Math.floor(r.left)), y: Math.max(0, Math.floor(r.top)), width: Math.max(1, Math.floor(Math.min(r.width, innerWidth - Math.max(0, r.left)))), height: Math.max(1, Math.floor(Math.min(r.height, innerHeight - Math.max(0, r.top)))) }, c }; }, sel);
    const h = await page.addStyleTag({ content: "*{color:transparent!important;text-shadow:none!important;border-color:transparent!important}.zl-chip::before{background:transparent!important;border-color:transparent!important}" });
    const buf = await page.screenshot({ clip: info.r }); await h.evaluate((el) => el.remove());
    const { data, info: im } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const lums = []; for (let i = 0; i < data.length; i += im.channels) lums.push(L(data[i], data[i + 1], data[i + 2]));
    lums.sort((a, b) => a - b); const worst = lums[Math.floor(lums.length * 0.99)], Lt = L(info.c[0], info.c[1], info.c[2]);
    const ratio = (Math.max(Lt, worst) + 0.05) / (Math.min(Lt, worst) + 0.05); rows.push({ sel, ratio: +ratio.toFixed(2), min, ok: ratio >= min });
  } return rows;
}
const ITEMS = [[".zl-hero-copy .zl-lede", 4.5], [".zl-status-line", 4.5], [".zl-status-line a", 4.5], ["#idea .zl-lede", 4.5], ["#ecosystem .zl-lede", 4.5], [".zl-control-copy .zl-lede", 4.5], ["#today .zl-lede", 4.5], [".zl-invite .zl-lede", 4.5], [".zl-footer p", 4.5], [".zl-hero-copy .zl-eyebrow", 4.5], ["#idea .zl-eyebrow", 4.5], [".zl-zuri-hint", 4.5], [".zl-stage-btn-index", 4.5], [".zl-node-count", 4.5], [".zl-cap-kind", 4.5], [".zl-cap-note", 4.5], [".zl-panel-blurb", 4.5], [".zl-zuri-line", 4.5], [".zl-step-note", 4.5], [".zl-legend span", 4.5], [".zl-h1", 3], ["#idea .zl-h2", 3], [".zl-chip--planned", 4.5], [".zl-chip--available", 4.5]];

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] }); const ROUTES = routes(); console.log("real routes:", ROUTES.join(" "));
  const ctx = await newHarnessContext(browser, { viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); const issues = watch(p); await p.goto(ORIGIN + "/", { waitUntil: "load" }); await p.addStyleTag(NOSMOOTH); await p.waitForTimeout(1000);

  await t("A1 hydrates cleanly: no console errors/warnings, no failed/404 requests, exactly one canvas", async () => { assert(issues.length === 0, JSON.stringify(issues)); assert(ctx.__missing.length === 0, "404: " + ctx.__missing); assert((await p.locator("canvas").count()) === 1, "canvas count"); });
  await t("A2 semantics: one h1, no skipped levels, header/main/footer, labelled navs, alt on every image, a name on every control", async () => {
    const r = await p.evaluate(() => { const hs = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => +h.tagName[1]); let skip = false; for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) skip = true; return { h1: hs.filter((x) => x === 1).length, skip, lm: !!document.querySelector("header") && !!document.querySelector("main#main") && !!document.querySelector("footer"), navs: [...document.querySelectorAll("nav")].every((n) => n.getAttribute("aria-label")), noAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length, unnamed: [...document.querySelectorAll("a,button,summary")].filter((e) => !(e.getAttribute("aria-label") || e.textContent || "").trim()).length }; });
    assert(r.h1 === 1 && !r.skip && r.lm && r.navs && r.noAlt === 0 && r.unnamed === 0, JSON.stringify(r)); });
  await t("A3 every brand image loads (scroll the page, then wait for the lazy loader)", async () => {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 120)); } });
    for (let i = 0; i < 20; i++) { if (await p.evaluate(() => [...document.images].every((m) => m.complete && m.naturalWidth > 0))) break; await p.waitForTimeout(250); } await jump(p, 0);
    const r = await p.evaluate(() => [...document.images].map((i) => ({ s: i.getAttribute("src"), ok: i.complete && i.naturalWidth > 0 }))); assert(r.every((i) => i.ok), JSON.stringify(r.filter((i) => !i.ok))); return r.length + " images"; });
  await t("A4 every anchor has a target; every internal link is a real route", async () => {
    const links = await p.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"))); const bad = [];
    for (const h of links) { if (h.startsWith("#")) { if (!(await p.evaluate((id) => !!document.getElementById(id), h.slice(1)))) bad.push(h); } else if (h.startsWith("/") && !ROUTES.includes(h)) bad.push(h); }
    assert(bad.length === 0, "bad: " + bad); return [...new Set(links)].sort().join(" "); });

  await t("B1 hero Zuri: honest note opens/closes by click, Enter, Space, Escape", async () => {
    const z = p.locator(".zl-zuri"), note = p.locator("#zuri-note"); assert(!(await note.isVisible()) && (await z.getAttribute("aria-expanded")) === "false", "starts closed");
    await z.click(); assert(await note.isVisible() && /not yet connected/i.test(await note.innerText()), "opens + honest"); await p.keyboard.press("Escape"); assert(!(await note.isVisible()), "Escape");
    await z.focus(); await p.keyboard.press("Enter"); assert(await note.isVisible(), "Enter"); await p.keyboard.press("Space"); assert(!(await note.isVisible()), "Space"); });
  await t("B2 hero Zuri states + deterministic parallax (same position → same value; leave → reset)", async () => {
    const r = await p.evaluate(() => { const e = document.querySelector(".zl-stage").getBoundingClientRect(); return { l: e.left, t: e.top, w: e.width, h: e.height }; });
    const px = () => p.evaluate(() => document.querySelector(".zl-stage").style.getPropertyValue("--zl-px")), st = () => p.evaluate(() => document.querySelector(".zl-stage").dataset.zuri);
    await p.mouse.move(r.l + 8, r.t + 8); await p.waitForTimeout(160); const a1 = await px(), s1 = await st(); await p.mouse.move(r.l + r.w - 8, r.t + r.h - 8); await p.waitForTimeout(160); const b = await px();
    await p.mouse.move(r.l + 8, r.t + 8); await p.waitForTimeout(160); const a2 = await px(); await p.mouse.move(5, 5); await p.waitForTimeout(160); const z = await px(), s2 = await st();
    assert(+a1 < -0.9 && +b > 0.9 && a1 === a2 && +z === 0 && s1 === "curious" && s2 === "idle", JSON.stringify({ a1, b, a2, z, s1, s2 })); return JSON.stringify({ a1, b, z, s1, s2 }); });

  await t("C1 thought path: stages are buttons; selection reports TRUTHFUL status; progress is scroll-linked", async () => {
    await toEl(p, "#idea", 0); await p.waitForTimeout(400); const btn = (n) => p.locator(".zl-stage-btn", { hasText: n }), d = p.locator("#zl-path-detail");
    await btn("Form").click(); assert(/planned/i.test(await d.innerText()) && /not yet/i.test(await d.innerText()), "Form planned"); await btn("World").click(); assert(/available now/i.test(await d.innerText()), "World available");
    await jump(p, 0); await p.waitForTimeout(250); const lo = await p.evaluate(() => +document.querySelector(".zl-path").style.getPropertyValue("--zl-progress"));
    await p.evaluate(() => { const s = document.getElementById("idea"); scrollTo({ top: s.offsetTop + s.offsetHeight * 0.6, behavior: "instant" }); }); await p.waitForTimeout(350);
    const hi = await p.evaluate(() => +document.querySelector(".zl-path").style.getPropertyValue("--zl-progress")), reached = await p.evaluate(() => document.querySelectorAll('.zl-stage-btn[data-reached="true"]').length);
    assert(lo < 0.3 && hi > 0.9 && reached === 5, JSON.stringify({ lo, hi, reached })); });

  const ids = ["worlds", "converse", "create", "build", "act", "share"], LINES = { worlds: "gathers", converse: "works today", create: "none of it built yet", build: "aren't", act: "permissions you can see", share: "come after" };
  await t("D1 journey: the constellation stays pinned (position: sticky) on desktop", async () => { assert((await p.evaluate(() => getComputedStyle(document.querySelector(".zl-journey-sticky")).position)) === "sticky", "not sticky"); });
  await t("D2 journey follows REAL scroll: chapter in view ⇒ matching node pressed, chapter active, Zuri line matches", async () => {
    for (const id of ids) { await toChapter(p, id); await p.waitForTimeout(500);
      const r = await p.evaluate(() => ({ pressed: [...document.querySelectorAll(".zl-node")].filter((n) => n.getAttribute("aria-pressed") === "true").map((n) => n.getAttribute("aria-controls")), active: [...document.querySelectorAll(".zl-chapter")].filter((c) => c.dataset.active === "true").map((c) => c.dataset.nodeId), line: document.querySelector(".zl-zuri-line").textContent }));
      assert(r.pressed.length === 1 && r.pressed[0] === "chapter-" + id && r.active.length === 1 && r.active[0] === id && r.line.includes(LINES[id]), id + " → " + JSON.stringify(r)); } return ids.join(" → "); });
  await t("D3 selecting a node scrolls to ITS chapter and activates it (click)", async () => {
    await toEl(p, "#ecosystem", 80); await p.waitForTimeout(500); await p.locator(".zl-node", { hasText: "Build" }).first().click(); await p.waitForTimeout(1900);
    const r = await p.evaluate(() => { const c = document.getElementById("chapter-build").getBoundingClientRect(); return { dy: Math.abs(c.top + c.height / 2 - innerHeight / 2), active: document.getElementById("chapter-build").dataset.active }; }); assert(r.dy < 260 && r.active === "true", JSON.stringify(r)); return JSON.stringify(r); });
  await t("D4 hover previews the connection but never changes the active chapter", async () => {
    const before = await activeChapter(p); await p.locator(".zl-node", { hasText: "Create" }).first().hover(); await p.waitForTimeout(250);
    const st = await p.evaluate(() => [...document.querySelectorAll(".zl-link-line")].map((l) => l.dataset.state)); assert(before === (await activeChapter(p)) && st.includes("hover") && st.includes("selected"), JSON.stringify({ before, st })); });
  await t("D5 keyboard: arrows move between nodes, Enter jumps to the chapter, Home returns to Worlds", async () => {
    await p.locator(".zl-node").first().focus(); await p.keyboard.press("ArrowRight"); await p.keyboard.press("ArrowRight"); await p.keyboard.press("Enter"); await p.waitForTimeout(1900); assert((await activeChapter(p)) === "create", "Enter on 3rd node");
    await p.keyboard.press("Home"); await p.keyboard.press("Enter"); await p.waitForTimeout(1900); assert((await activeChapter(p)) === "worlds", "Home"); });
  await t("D6 'Create an account' appears ONLY in chapters where something is genuinely available", async () => {
    const r = await p.evaluate(() => [...document.querySelectorAll(".zl-chapter")].map((c) => ({ id: c.dataset.nodeId, cta: !!c.querySelector('a[href="/register"]'), live: !!c.querySelector(".zl-cap-item--available") }))); assert(r.every((c) => c.cta === c.live), JSON.stringify(r)); return r.filter((c) => c.cta).map((c) => c.id).join(",") + " have a CTA"; });
  await t("D7 Zuri proximity (guide): near ⇒ glow + turn toward cursor; far ⇒ rest; deterministic", async () => {
    await toChapter(p, "create"); await p.waitForTimeout(700); const box = await p.evaluate(() => { const r = document.querySelector(".zl-journey-guide .zp").getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
    const read = () => p.evaluate(() => { const z = document.querySelector(".zl-journey-guide .zp"); return { near: z.dataset.near, x: z.style.getPropertyValue("--zp-x"), y: z.style.getPropertyValue("--zp-y") }; });
    await p.mouse.move(box.x + box.w * 0.9, box.y + box.h * 0.4); await p.waitForTimeout(200); const n1 = await read(); await p.mouse.move(box.x + box.w * 0.9, box.y + box.h * 0.4); await p.waitForTimeout(100); const n2 = await read();
    await p.mouse.move(box.x + 900, box.y + box.h * 0.4); await p.waitForTimeout(200); const far = await read(); /* same row, far to the right: must stay inside the viewport or no event fires */ assert(n1.near === "true" && +n1.x > 0 && n1.x === n2.x && n1.y === n2.y && far.near === "false" && +far.x === 0, JSON.stringify({ n1, n2, far })); return JSON.stringify({ n1, far }); });

  await t("E1 truthfulness: exactly one live CAPABILITY (matches code); live experiences are the 3 evidenced ones; no 'in development' wording", async () => {
    const boot = fs.readFileSync(path.join(REPO, "apps/web/src/server/capabilities/bootstrap.ts"), "utf8"); const registered = (boot.match(/const definitions = \[([^\]]*)\]/) || [])[1].split(",").map((s) => s.trim()).filter(Boolean).length;
    const dom = await p.evaluate(() => { const live = [...document.querySelectorAll(".zl-cap-item--available")]; return { cap: live.filter((li) => li.querySelector(".zl-cap-kind").textContent === "capability").length, exp: live.filter((li) => li.querySelector(".zl-cap-kind").textContent === "experience").length, total: document.querySelectorAll(".zl-cap-item").length, text: document.body.innerText.toLowerCase() }; });
    assert(registered === 1 && dom.cap === 1 && dom.exp === 3 && dom.total === 21, JSON.stringify({ registered, ...dom, text: undefined })); for (const bad of ["in development", "coming soon", "beta", "light mode"]) assert(!dom.text.includes(bad), "found '" + bad + "'");
    assert(!(await p.evaluate(() => document.documentElement.outerHTML.toLowerCase().includes("ai-agent"))), "ai-agent ref"); return "registered " + registered + " = live capability " + dom.cap + "; 21 entries"; });
  await t("E2 environment follows real scroll: arrival → idea → ecosystem → control → today → invitation → back (latency measured)", async () => {
    const waitFor = async (want) => { const t0 = Date.now(); for (;;) { const v = await p.evaluate(() => document.documentElement.dataset.zlAtmosphere); if (v === want) return Date.now() - t0; if (Date.now() - t0 > 3000) throw new Error("expected '" + want + "' but atmosphere stayed '" + v + "'"); await p.waitForTimeout(40); } }; const lat = [];
    for (const id of ["idea", "ecosystem", "control", "today"]) { await toEl(p, "#" + id, 0); lat.push(id + ":" + (await waitFor(id)) + "ms"); }
    await p.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: "instant" })); lat.push("invitation:" + (await waitFor("invitation")) + "ms"); await jump(p, 0); lat.push("arrival:" + (await waitFor("arrival")) + "ms");
    assert((await p.evaluate(() => document.querySelectorAll('.zl-reveal[data-reveal="hidden"]').length)) === 0, "reveal replayed"); return lat.join("  "); });
  await t("E3 hero drifts and fades as you scroll away (scroll-driven depth), restored at the top", async () => {
    await jump(p, 0); await p.waitForTimeout(300); const top = await p.evaluate(() => +getComputedStyle(document.querySelector(".zl-hero-stagewrap")).opacity); await jump(p, 600); await p.waitForTimeout(300);
    const mid = await p.evaluate(() => +getComputedStyle(document.querySelector(".zl-hero-stagewrap")).opacity); await jump(p, 0); assert(top > 0.99 && mid < 0.6, JSON.stringify({ top, mid })); return JSON.stringify({ top, mid }); });
  await t("F1 theme toggle works and persists across reload (Nocturne ⇄ Aubade)", async () => {
    await p.locator('button[role="radio"]:visible', { hasText: "Aubade" }).first().click(); assert((await p.evaluate(() => document.documentElement.dataset.zuvreTheme)) === "aubade" && (await p.evaluate(() => localStorage.getItem("zuvre-theme"))) === "aubade", "applied");
    await p.reload({ waitUntil: "load" }); await p.addStyleTag(NOSMOOTH); await p.waitForTimeout(500); assert((await p.evaluate(() => document.documentElement.dataset.zuvreTheme)) === "aubade", "persisted"); await p.locator('button[role="radio"]:visible', { hasText: "Nocturne" }).first().click(); });
  await t("F2 keyboard: first Tab stop is the skip link; visible focus ring on skip link, CTA, stage button, node", async () => {
    const q = await ctx.newPage(); await q.goto(ORIGIN + "/", { waitUntil: "load" }); await q.waitForTimeout(500); await q.keyboard.press("Tab"); const first = await q.evaluate(() => document.activeElement.textContent.trim()); assert(/skip to content/i.test(first), first);
    const ring = async (sel) => { await q.locator(sel).first().focus(); await q.keyboard.press("Shift+Tab"); await q.keyboard.press("Tab"); return q.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2; }); };
    for (const sel of [".zl-skip", ".zl-hero-cta a", ".zl-stage-btn", ".zl-node"]) assert(await ring(sel), "no ring on " + sel); await q.close(); });
  await ctx.close();

  for (const theme of ["nocturne", "aubade"]) { const c = await newHarnessContext(browser, { viewport: { width: 1440, height: 900 } }); const q = await c.newPage(); await q.goto(ORIGIN + "/?theme=" + theme, { waitUntil: "load" }); await q.addStyleTag(NOSMOOTH); await q.waitForTimeout(700);
    await t("G " + theme + ": text contrast over the REAL rendered backdrop (worst-case pixel)", async () => { const rows = await contrast(q, ITEMS), bad = rows.filter((r) => !r.skip && !r.ok); console.log("      " + rows.filter((r) => !r.skip).map((r) => r.sel.replace(/\.zl-|#/g, "") + "=" + r.ratio).join("  "));
      assert(bad.length === 0, "below min: " + bad.map((r) => r.sel + " " + r.ratio + "<" + r.min).join("; ")); return rows.filter((r) => !r.skip).length + " samples, min " + Math.min(...rows.filter((r) => !r.skip).map((r) => r.ratio)); }); await c.close(); }

  { const c = await newHarnessContext(browser, { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }); const q = await c.newPage(); const iss = watch(q); await q.goto(ORIGIN + "/", { waitUntil: "load" }); await q.addStyleTag(NOSMOOTH); await q.waitForTimeout(900);
    await t("H1 reduced motion: NO continuous CSS animation anywhere (incl. Zuri), no scroll/pointer parallax, nothing hidden", async () => {
      const anim = await q.evaluate(() => [...document.querySelectorAll(".zl-root *")].filter((e) => { const a = getComputedStyle(e).animationName; return a && a !== "none"; }).map((e) => e.className.toString().slice(0, 28)));
      await jump(q, 1200); await q.waitForTimeout(300); const sv = await q.evaluate(() => document.documentElement.style.getPropertyValue("--zl-scroll")); await jump(q, 0);
      const box = await q.locator(".zl-stage").boundingBox(); await q.mouse.move(box.x + 6, box.y + 6); await q.waitForTimeout(200); const px = await q.evaluate(() => document.querySelector(".zl-stage").style.getPropertyValue("--zl-px"));
      const hidden = await q.evaluate(() => document.querySelectorAll('.zl-reveal[data-reveal="hidden"]').length); assert(anim.length === 0 && sv === "" && (px === "" || +px === 0) && hidden === 0, JSON.stringify({ anim, sv, px, hidden })); });
    await t("H2 reduced motion: canvas is one static frame; journey still follows scroll; Zuri note works", async () => {
      const a = await q.evaluate(() => document.querySelector("canvas").toDataURL()); await q.waitForTimeout(900); assert(a === (await q.evaluate(() => document.querySelector("canvas").toDataURL())), "canvas animated");
      await toChapter(q, "act"); await q.waitForTimeout(500); assert((await activeChapter(q)) === "act", "journey scroll"); await jump(q, 0); await q.locator(".zl-zuri").click(); assert(await q.locator("#zuri-note").isVisible(), "note"); assert(iss.length === 0, JSON.stringify(iss)); }); await c.close(); }
  { const c = await newHarnessContext(browser, { viewport: { width: 1440, height: 900 } }); const q = await c.newPage(); await q.goto(ORIGIN + "/", { waitUntil: "load" }); await q.waitForTimeout(900);
    await t("H3 control: with motion allowed the canvas DOES animate; one rAF loop (~60/s), not a runaway", async () => {
      const a = await q.evaluate(() => document.querySelector("canvas").toDataURL()); await q.waitForTimeout(900); assert(a !== (await q.evaluate(() => document.querySelector("canvas").toDataURL())), "canvas static");
      const n = await q.evaluate(() => new Promise((res) => { let c2 = 0; const o = window.requestAnimationFrame; window.requestAnimationFrame = (cb) => { c2++; return o(cb); }; setTimeout(() => { window.requestAnimationFrame = o; res(c2); }, 2000); })); assert(n > 40 && n < 170, "rAF/2s " + n); return n + " rAF/2s"; }); await c.close(); }
  { const c = await newHarnessContext(browser, { viewport: { width: 1440, height: 900 }, javaScriptEnabled: false }); const q = await c.newPage(); await q.goto(ORIGIN + "/", { waitUntil: "load" }); await q.waitForTimeout(400);
    await t("I1 no-JS: all content is server-rendered and visible (h1, 6 chapters / 21 entries, controls, steps)", async () => {
      const r = await q.evaluate(() => ({ h1: document.querySelector("h1").innerText, chapters: document.querySelectorAll(".zl-chapter").length, entries: document.querySelectorAll(".zl-cap-item").length, ledger: document.querySelectorAll(".zl-ledger li").length, steps: document.querySelectorAll(".zl-step").length, hidden: document.querySelectorAll('.zl-reveal[data-reveal="hidden"]').length, deep: +getComputedStyle(document.querySelector(".zl-env--deep")).opacity }));
      assert(/Give Thought/.test(r.h1) && r.chapters === 6 && r.entries === 21 && r.ledger === 6 && r.steps === 4 && r.hidden === 0 && r.deep > 0.4, JSON.stringify(r)); return JSON.stringify(r); }); await c.close(); }

  { let bad = 0; const rows = [];
    for (const w of [320, 360, 375, 390, 430, 768, 1024, 1440]) { const c = await newHarnessContext(browser, { viewport: { width: w, height: 800 }, isMobile: w < 800, hasTouch: w < 800 }); const q = await c.newPage(); const iss = watch(q); await q.goto(ORIGIN + "/", { waitUntil: "load" }); await q.waitForTimeout(450);
      const r = await q.evaluate(() => { const vw = innerWidth, kids = [...document.querySelectorAll(".zl-header .zl-brand, .zl-header-actions > *")].filter((e) => getComputedStyle(e).display !== "none"); return { over: document.documentElement.scrollWidth - vw, hdr: Math.round(Math.max(...kids.map((e) => e.getBoundingClientRect().right))) <= vw - 8 }; });
      const ok = r.over <= 0 && r.hdr && iss.length === 0; if (!ok) bad++; rows.push(w + (ok ? "✓" : "✗")); await c.close(); }
    await t("J1 no horizontal overflow and the header fits at 320/360/375/390/430/768/1024/1440", async () => { assert(bad === 0, rows.join(" ")); return rows.join(" "); }); }
  { const c = await newHarnessContext(browser, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); const q = await c.newPage(); const iss = watch(q); await q.goto(ORIGIN + "/", { waitUntil: "load" }); await q.addStyleTag(NOSMOOTH); await q.waitForTimeout(900);
    await t("K1 mobile: primary CTA inside the first screen; Zuri note opens inside the viewport by tap", async () => {
      const r = await q.evaluate(() => ({ b: Math.round(document.querySelector(".zl-hero-cta a").getBoundingClientRect().bottom), vh: innerHeight })); assert(r.b <= r.vh, JSON.stringify(r));
      await q.locator(".zl-zuri").tap(); const n = await q.evaluate(() => { const b = document.querySelector("#zuri-note").getBoundingClientRect(); return { l: Math.round(b.left), r: Math.round(b.right), vw: innerWidth }; }); assert(n.l >= 0 && n.r <= n.vw, JSON.stringify(n)); await q.locator(".zl-zuri").tap(); });
    await t("K2 mobile: menu by tap has links + Enter + a working theme toggle that syncs both instances", async () => {
      await q.locator(".zl-menu > summary").tap(); const names = await q.locator(".zl-menu-panel a").allInnerTexts(); assert(["The idea", "Ecosystem", "Control", "Today", "Sign in", "Enter ZUVRE"].every((n) => names.includes(n)), names.join("|"));
      await q.locator('.zl-menu-panel button[role="radio"]', { hasText: "Aubade" }).tap(); const r = await q.evaluate(() => ({ a: document.documentElement.dataset.zuvreTheme, c: [...document.querySelectorAll('button[role="radio"]')].filter((b) => b.textContent === "Aubade").map((b) => b.getAttribute("aria-checked")) })); assert(r.a === "aubade" && r.c.every((x) => x === "true"), JSON.stringify(r)); });
    await t("K3 mobile: tapping a node jumps to its chapter (no hover needed)", async () => { await toEl(q, "#ecosystem", 70); await q.waitForTimeout(500); await q.locator(".zl-node", { hasText: "Act" }).first().tap(); await q.waitForTimeout(1900); assert((await activeChapter(q)) === "act", "act not active"); });
    await t("K4 mobile: touch targets ≥24px (inline links exempt per WCAG 2.5.8); no console issues after interaction", async () => {
      const tiny = await q.evaluate(() => { const o = []; for (const e of document.querySelectorAll("a,button,summary")) { const s = getComputedStyle(e); if (s.display === "none" || s.visibility === "hidden") continue; const b = e.getBoundingClientRect(); if (!b.width || !b.height) continue; if (s.display === "inline" && e.closest("p")) continue; if (b.width < 24 || b.height < 24) o.push((e.textContent || "").trim().slice(0, 20) + " " + Math.round(b.width) + "x" + Math.round(b.height)); } return o; }); assert(tiny.length === 0 && iss.length === 0, JSON.stringify({ tiny, iss })); }); await c.close(); }

  await browser.close(); const failed = results.filter((r) => !r.ok); console.log("\nLANDING BATTERY:", results.length - failed.length + "/" + results.length + " passed"); process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error("HARNESS ERROR", e); process.exit(2); });
