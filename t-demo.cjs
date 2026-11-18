// End-to-end verification of LOCAL DEMO MODE (login, signup, session, logout, the demo app, failure states,
// security properties, cross-tab sync, corrupt-storage resilience) and of PRODUCTION ISOLATION.
// Run:  node build.cjs && node t-demo.cjs        (needs playwright + chromium)
const { chromium, newHarnessContext, watch, ORIGIN, INSECURE_ORIGIN } = require("./lib.cjs");
const results = [];
const assert = (c, m) => { if (!c) throw new Error(m); };
async function t(name, fn) { try { const d = await fn(); results.push({ name, ok: true }); console.log("PASS  " + name + (d ? "  — " + d : "")); } catch (e) { results.push({ name, ok: false }); console.log("FAIL  " + name + "  — " + String(e.message).slice(0, 500)); } }
const NOSMOOTH = { content: "html{scroll-behavior:auto!important}" };
const path = (p) => p.evaluate(() => location.pathname);
const toPath = (p, want, ms = 4000) => p.waitForFunction((w) => location.pathname === w, want, { timeout: ms }).then(() => true).catch(async () => { throw new Error("expected " + want + " but at " + (await path(p))); });
const ls = (p) => p.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)])));
const PW = "correct horse battery", EMAIL = "Ada@Example.com", NAME = "Ada <img src=x onerror=window.__xss=1>";
const go = async (p, url) => { await p.goto(ORIGIN + url, { waitUntil: "load" }); await p.addStyleTag(NOSMOOTH); await p.waitForTimeout(250); };
const lab = (p, text) => p.getByLabel(text, { exact: false }).first();
const btn = (p, name) => p.getByRole("button", { name });
async function signUp(p, name, email, pw) { await go(p, "/register"); await lab(p, "What should we call you?").fill(name); await lab(p, "Email").fill(email); await lab(p, "Password").fill(pw); await btn(p, "Create a local demo account").click(); }
async function logIn(p, email, pw) { await go(p, "/login"); await lab(p, "Email").fill(email); await lab(p, "Password").fill(pw); await btn(p, "Log in to the local demo").click(); }

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const ctx = await newHarnessContext(browser, { viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); const issues = watch(p);
  const external = []; p.on("request", (r) => { const u = new URL(r.url()); if (u.origin !== ORIGIN) external.push(r.url()); });

  // ---- steps 1–3: public browsing with no account ----
  await t("1–3 public: the landing page loads and is explorable with NO account and NO redirect", async () => {
    await go(p, "/"); assert((await path(p)) === "/", "redirected"); assert(/Give Thought/.test(await p.locator("h1").innerText()), "h1");
    await p.locator('.zl-nav a[href="#ecosystem"]').click(); await p.waitForTimeout(250); assert((await path(p)) === "/", "anchor nav should stay on the page");
    const k = Object.keys(await ls(p)).filter((x) => x.startsWith("zuvre.demo")); assert(k.length === 0, "landing wrote demo keys: " + k);
  });
  await t("public routes need no session: /login and /register render their forms; /demo/* is the only gated area", async () => {
    await go(p, "/login"); assert(await lab(p, "Password").isVisible() && (await p.locator(".zw-demo-banner").count()) === 1, "login");
    await go(p, "/register"); assert(await lab(p, "What should we call you?").isVisible(), "register");
    await go(p, "/demo/home"); await toPath(p, "/login"); assert(await p.locator(".zw-demo-banner").isVisible(), "redirected to the demo login");
  });

  await t("insecure context (http on a non-localhost host): signup explains WHY it cannot work instead of failing silently", async () => {
    const ic = await newHarnessContext(browser, { viewport: { width: 1440, height: 900 } }); const q = await ic.newPage();
    await q.goto(INSECURE_ORIGIN + "/register", { waitUntil: "load" }); await q.getByLabel("What should we call you?").fill("Ada"); await q.getByLabel("Email", { exact: false }).first().fill("a@b.co"); await q.getByLabel("Password", { exact: false }).first().fill("long enough pw");
    await q.getByRole("button", { name: "Create a local demo account" }).click(); await q.waitForSelector(".zw-form-error");
    assert(/secure context/i.test(await q.locator(".zw-form-error").innerText()) && (await q.evaluate(() => location.pathname)) === "/register", "message/nav");
    assert((await q.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("zuvre.demo.v1.accounts")).length)) === 0, "must not store anything it could not hash"); await ic.close();
  });

  // ---- signup validation ----
  await t("signup validation: each bad input is named, announced, and tied to its field (aria-invalid + aria-describedby)", async () => {
    await go(p, "/register"); const submit = () => btn(p, "Create a local demo account").click();
    const err = async () => ({ text: await p.locator(".zw-field-error").first().innerText(), invalid: await p.locator('[aria-invalid="true"]').count(), described: await p.evaluate(() => { const i = document.querySelector('[aria-invalid="true"]'); const id = i && i.getAttribute("aria-describedby"); return !!(id && document.getElementById(id)); }) });
    await submit(); let e = await err(); assert(/call you/i.test(e.text) && e.invalid === 1 && e.described, "empty name: " + JSON.stringify(e));
    await lab(p, "What should we call you?").fill("Ada"); await submit(); e = await err(); assert(/valid email/i.test(e.text) && e.described, "no email: " + JSON.stringify(e));
    await lab(p, "Email").fill("nope"); await submit(); e = await err(); assert(/valid email/i.test(e.text), "bad email");
    await lab(p, "Email").fill("a@b.co"); await lab(p, "Password").fill("short"); await submit(); e = await err(); assert(/8 characters/i.test(e.text) && e.described, "short pw: " + JSON.stringify(e));
    assert((await path(p)) === "/register", "must not navigate on invalid input");
  });

  // ---- steps 9/10: create an account ----
  await t("signup works: lands in /demo/home; hostile display name is rendered as TEXT (no injection)", async () => {
    await signUp(p, NAME, EMAIL, PW); await toPath(p, "/demo/home"); await p.waitForSelector("h1.zw-h1");
    assert((await p.locator("h1.zw-h1").innerText()).startsWith("Welcome, Ada <img"), "name shown as text");
    assert((await p.locator('img[src="x"]').count()) === 0 && (await p.evaluate(() => window.__xss)) === undefined, "XSS: injected markup was live");
  });
  await t("security: password NEVER stored; only salted PBKDF2 hash; email normalised; nothing sent off-origin; only prefixed keys written", async () => {
    const s = await ls(p), blob = JSON.stringify(s), acct = JSON.parse(s["zuvre.demo.v1.accounts"])[0];
    assert(!blob.includes(PW) && !blob.toLowerCase().includes("battery"), "plaintext password found in storage");
    assert(acct.email === "ada@example.com" && /^[A-Za-z0-9+/=]{20,}$/.test(acct.salt) && /^[A-Za-z0-9+/=]{40,}$/.test(acct.hash) && acct.iterations === 150000 && acct.guest === false, JSON.stringify({ ...acct, hash: "…", salt: "…" }));
    const foreign = Object.keys(s).filter((k) => !k.startsWith("zuvre.demo.v1.") && k !== "zuvre-theme"); assert(foreign.length === 0, "unprefixed keys: " + foreign);
    assert(external.length === 0, "off-origin requests: " + external); return "iterations " + acct.iterations + ", hash " + acct.hash.length + " chars";
  });

  // ---- onboarding + Zuri ----
  await t("onboarding: Zuri guides 3 steps (real artwork loaded), ends at Worlds, and never returns once finished", async () => {
    await go(p, "/demo/home"); await p.waitForSelector(".zw-onboarding");
    assert((await p.evaluate(() => { const i = document.querySelector(".zw-onboarding .zp img"); return i && i.complete && i.naturalWidth > 0; })) === true, "Zuri artwork");
    const cap = async () => p.locator(".zw-onboarding .zp-caption").innerText();
    const c1 = await cap(); await btn(p, "Next").click(); const c2 = await cap(); await btn(p, "Next").click(); const c3 = await cap();
    assert(new Set([c1, c2, c3]).size === 3 && /nothing replies/i.test(c3), "captions: " + [c1, c2, c3].join(" | "));
    await p.getByRole("link", { name: "Create my first World" }).click(); await toPath(p, "/demo/worlds");
    await go(p, "/demo/home"); await p.waitForSelector("h1.zw-h1"); assert((await p.locator(".zw-onboarding").count()) === 0, "onboarding returned");
  });

  // ---- steps 5–7: the app, persistence across refresh ----
  await t("worlds: validated create, listing, open; conversation saves what you write and states NO AI is connected (never fabricates a reply)", async () => {
    await go(p, "/demo/worlds"); await p.waitForSelector("#w-name");
    await btn(p, "Create World").click(); assert(/name/i.test(await p.locator("#w-error").innerText()), "empty name error");
    await p.fill("#w-name", "Test World"); await p.fill("#w-desc", "A place for a thought"); await btn(p, "Create World").click();
    await p.waitForSelector('ul[aria-label="Your Worlds"]'); assert((await p.locator(".zw-world-name").first().innerText()) === "Test World", "listed");
    await p.locator(".zw-world-link").first().click(); await p.waitForSelector(".zw-convo");
    assert(/No AI is connected/i.test(await p.locator(".zw-banner").innerText()), "honesty banner");
    await btn(p, "Save").click(); assert(/something first/i.test(await p.locator('[id^="compose-error"]').innerText()), "empty message error");
    await p.getByLabel("Write a message").fill("hello world"); await btn(p, "Save").click(); await p.waitForSelector(".zw-bubble");
    assert((await p.locator(".zw-bubble").count()) === 1 && /saved locally/i.test(await p.locator(".zw-bubble-meta").innerText()), "exactly one bubble: nothing invented");
  });
  await t("step 7: REFRESH restores the session — still signed in, same page, and the world + message are still there", async () => {
    const before = await path(p); await p.reload({ waitUntil: "load" }); await p.waitForSelector(".zw-bubble", { timeout: 5000 });
    assert((await path(p)) === before && (await p.locator(".zw-bubble").innerText()).includes("hello world"), "state lost on refresh"); return "still at " + before;
  });
  await t("deleting a World is two-step (Keep cancels) and removes its conversation too", async () => {
    await go(p, "/demo/worlds"); await p.waitForSelector(".zw-world-name");
    await p.getByRole("button", { name: "Delete Test World" }).click(); await btn(p, "Keep").click(); assert((await p.locator(".zw-world-name").count()) === 1, "Keep should cancel");
    const id = (await p.locator(".zw-world-link").first().getAttribute("href")).split("/").pop();
    await p.getByRole("button", { name: "Delete Test World" }).click(); await btn(p, "Delete for good").click(); await p.waitForSelector(".zw-empty");
    assert(!Object.keys(await ls(p)).some((k) => k.includes("messages") && k.endsWith(id)), "orphaned conversation left behind");
  });

  // ---- step 8: logout ----
  await t("step 8: log out clears the SESSION (not the account), lands on the public landing page, and re-gates /demo", async () => {
    await go(p, "/demo/settings"); await p.waitForSelector(".zw-facts"); await p.locator(".zw-navbtn").click(); await toPath(p, "/");
    const s = await ls(p); assert(!s["zuvre.demo.v1.session"] && s["zuvre.demo.v1.accounts"], "session should be gone, account kept");
    await go(p, "/demo/home"); await toPath(p, "/login");
  });

  // ---- failure states + step 11 ----
  await t("login failures: wrong password and unknown email give the IDENTICAL generic message (no account enumeration); empty/invalid are named", async () => {
    await logIn(p, "ada@example.com", "wrong password!"); await p.waitForSelector(".zw-form-error"); const a = await p.locator(".zw-form-error").innerText();
    await logIn(p, "nobody@example.com", "whatever12345"); await p.waitForSelector(".zw-form-error"); const b = await p.locator(".zw-form-error").innerText();
    assert(a === b && /don't match/i.test(a) && (await path(p)) === "/login", JSON.stringify({ a, b }));
    await go(p, "/login"); await btn(p, "Log in to the local demo").click(); assert(/email/i.test(await p.locator(".zw-field-error").first().innerText()), "empty email message");
  });
  await t("login succeeds (email is case-insensitive) and the display name comes back", async () => {
    await logIn(p, "ADA@example.COM", PW); await toPath(p, "/demo/home"); await p.waitForSelector("h1.zw-h1"); assert((await p.locator("h1.zw-h1").innerText()).startsWith("Welcome, Ada"), "name");
  });
  await t("landing CTAs adapt: signed in ⇒ \"Continue in the demo\" → /demo/home; signed out ⇒ \"Enter ZUVRE\" → /register", async () => {
    await go(p, "/"); await p.waitForFunction(() => /Continue in the demo/.test(document.querySelector(".zl-hero-cta a").textContent), null, { timeout: 4000 });
    const r = await p.evaluate(() => [document.querySelector(".zl-header-actions .zuvre-button-primary"), document.querySelector(".zl-hero-cta a")].map((a) => a.getAttribute("href"))); assert(r.every((h) => h === "/demo/home"), JSON.stringify(r));
  });

  // ---- cross-tab ----
  await t("cross-tab: logging out in one tab signs the other tab out without a reload", async () => {
    const p2 = await ctx.newPage(); await go(p2, "/demo/home"); await p2.waitForSelector("h1.zw-h1");
    await go(p, "/demo/settings"); await p.waitForSelector(".zw-facts"); await p.locator(".zw-navbtn").click(); await toPath(p, "/");
    await toPath(p2, "/login", 5000); await p2.close();
  });

  // ---- duplicate + guest + isolation ----
  await t("duplicate signup is refused with a clear message", async () => {
    await signUp(p, "Another Ada", "ada@example.com", "another password"); await p.waitForSelector(".zw-field-error"); assert(/already exists/i.test(await p.locator(".zw-field-error").first().innerText()), "dup message"); assert((await path(p)) === "/register", "navigated");
  });
  await t("guest entry: one click, no email/password stored, and it is labelled as a guest", async () => {
    await go(p, "/login"); await btn(p, "Continue as a demo guest").click(); await toPath(p, "/demo/home");
    const guest = JSON.parse((await ls(p))["zuvre.demo.v1.accounts"]).find((a) => a.guest); assert(guest && guest.email === "" && !guest.hash && !guest.salt, "guest record: " + JSON.stringify(guest));
    await go(p, "/demo/settings"); await p.waitForSelector(".zw-facts"); assert(/Demo guest/.test(await p.locator(".zw-facts").innerText()), "guest label");
  });
  await t("accounts are isolated: B cannot see A's Worlds, and A's World URL is 'not here' for B", async () => {
    await p.locator(".zw-navbtn").click(); await toPath(p, "/"); await logIn(p, "ada@example.com", PW); await toPath(p, "/demo/home");
    await go(p, "/demo/worlds"); await p.fill("#w-name", "Ada's secret"); await btn(p, "Create World").click(); await p.waitForSelector(".zw-world-name");
    const url = await p.locator(".zw-world-link").first().getAttribute("href"); await go(p, "/demo/settings"); await p.locator(".zw-navbtn").click(); await toPath(p, "/");
    await signUp(p, "Grace", "grace@example.com", "grace password"); await toPath(p, "/demo/home");
    await go(p, "/demo/worlds"); await p.waitForSelector(".zw-empty"); await go(p, url); await p.waitForSelector("h1.zw-h1"); assert(/isn.t here/i.test(await p.locator("h1.zw-h1").innerText()), "B saw A's world");
  });

  // ---- reset ----
  await t("reset erases ONLY demo data (prefix) and leaves unrelated localStorage alone", async () => {
    await p.evaluate(() => localStorage.setItem("foreign.key", "keep-me")); await go(p, "/demo/settings"); await p.waitForSelector(".zw-facts");
    await p.getByRole("button", { name: /Reset all local demo data/ }).click(); await btn(p, /Yes, erase/).click(); await toPath(p, "/");
    const s = await ls(p); assert(Object.keys(s).filter((k) => k.startsWith("zuvre.demo.v1.")).length === 0 && s["foreign.key"] === "keep-me", JSON.stringify(Object.keys(s)));
  });

  // ---- resilience ----
  await t("corrupt/blocked storage degrades gracefully: garbage JSON ⇒ signed out, redirected, NO crash", async () => {
    await p.evaluate(() => { localStorage.setItem("zuvre.demo.v1.accounts", "{not json"); localStorage.setItem("zuvre.demo.v1.session", "💥"); });
    await go(p, "/demo/home"); await toPath(p, "/login"); assert(await p.locator(".zw-demo-banner").isVisible(), "login should render");
  });
  await t("whole run: no console errors/warnings/page errors and zero off-origin requests", async () => { assert(issues.length === 0, JSON.stringify(issues)); assert(external.length === 0, "external: " + external); });
  await ctx.close();

  // ---- PRODUCTION ISOLATION: NODE_ENV=production with NEXT_PUBLIC_ZUVRE_LOCAL_DEMO=1 STILL SET ----
  { const pc = await newHarnessContext(browser, { viewport: { width: 1440, height: 900 } }, "prod"); const q = await pc.newPage(); const iss = watch(q);
    await t("PRODUCTION (flag still =1): /login is the REAL sign-in — no demo banner, no guest button, no demo wording", async () => {
      await q.goto(ORIGIN + "/login", { waitUntil: "load" }); await q.waitForSelector("form");
      const html = (await q.content()).toLowerCase();
      assert((await q.locator(".zw-demo-banner").count()) === 0 && !html.includes("local demo") && !html.includes("demo guest"), "demo UI leaked into production");
      assert(await q.getByRole("button", { name: "Sign in" }).count() === 1, "real form's button");
    });
    await t("PRODUCTION: /demo/* is refused with an explanation (it cannot be enabled by the flag)", async () => {
      await q.goto(ORIGIN + "/demo/home", { waitUntil: "load" }); await q.waitForSelector(".zw-gate-card"); assert(/Local demo mode is off/.test(await q.locator(".zw-gate-card").innerText()), "notice");
    });
    await t("PRODUCTION: a planted demo session is ignored (CTA stays 'Enter ZUVRE' → /register) and nothing is read or written", async () => {
      await q.evaluate(() => { localStorage.setItem("zuvre.demo.v1.accounts", JSON.stringify([{ id: "a", email: "x@y.z", displayName: "Planted", guest: false, createdAt: "" }])); localStorage.setItem("zuvre.demo.v1.session", JSON.stringify({ accountId: "a", createdAt: "" })); });
      await q.goto(ORIGIN + "/", { waitUntil: "load" }); await q.waitForTimeout(700);
      const cta = await q.evaluate(() => ({ t: document.querySelector(".zl-hero-cta a").textContent, h: document.querySelector(".zl-hero-cta a").getAttribute("href") })); assert(cta.t === "Enter ZUVRE" && cta.h === "/register", JSON.stringify(cta));
      const keys = Object.keys(await ls(q)).filter((k) => k.startsWith("zuvre.demo.v1.")).sort(); assert(keys.join() === "zuvre.demo.v1.accounts,zuvre.demo.v1.session", "keys changed: " + keys);
      assert(iss.length === 0, JSON.stringify(iss));
    }); await pc.close(); }

  // ---- mobile ----
  { const mc = await newHarnessContext(browser, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); const m = await mc.newPage(); const iss = watch(m);
    await t("mobile (390px): signup → demo app → worlds, no horizontal overflow, nav usable, nothing clipped", async () => {
      await signUp(m, "Mobile Ada", "mobile@example.com", "mobile password 1"); await toPath(m, "/demo/home"); await m.waitForSelector("h1.zw-h1");
      const ov = async () => m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert((await ov()) <= 0, "overflow on home"); await m.screenshot({ path: "/tmp/crops/m_demo_home.png" });
      await m.getByRole("link", { name: "Worlds" }).first().tap(); await toPath(m, "/demo/worlds"); await m.waitForSelector("#w-name"); assert((await ov()) <= 0, "overflow on worlds");
      assert(await m.evaluate(() => [...document.querySelectorAll(".zuvre-app-nav a, .zuvre-app-nav button")].every((e) => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth + 1; })), "nav clipped"); assert(iss.length === 0, JSON.stringify(iss));
    }); await mc.close(); }

  await browser.close();
  const failed = results.filter((r) => !r.ok); console.log("\nDEMO BATTERY:", results.length - failed.length + "/" + results.length + " passed"); process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error("HARNESS ERROR", e); process.exit(2); });
