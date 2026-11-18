const { chromium, newHarnessContext, ORIGIN } = require("./lib.cjs");
(async () => {
  const b = await chromium.launch({ args: ["--no-sandbox"] });
  const ctx = await newHarnessContext(b, { viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  await p.goto(ORIGIN + "/login", { waitUntil: "load" }); await p.getByRole("button", { name: "Continue as a demo guest" }).click(); await p.waitForFunction(() => location.pathname === "/demo/home");
  await p.waitForTimeout(1500); await p.screenshot({ path: "/tmp/crops/a_home.png" });
  await p.getByRole("button", { name: "Skip" }).click(); await p.getByRole("link", { name: "Worlds" }).first().click(); await p.waitForSelector("#w-name");
  await p.fill("#w-name", "The Garden of Unfinished Ideas"); await p.fill("#w-desc", "Half-formed thoughts, kept somewhere safe"); await p.getByRole("button", { name: "Create World" }).click(); await p.waitForSelector(".zw-world-link");
  await p.locator(".zw-world-link").first().click(); await p.waitForSelector(".zw-convo"); await p.getByLabel("Write a message").fill("What if thought had a place to live?"); await p.getByRole("button", { name: "Save" }).click(); await p.waitForSelector(".zw-bubble");
  await p.waitForTimeout(800); await p.screenshot({ path: "/tmp/crops/a_world.png" });
  await b.close();
})();
