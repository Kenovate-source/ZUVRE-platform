const { chromium, newHarnessContext, ORIGIN } = require("./lib.cjs");
(async () => {
  const b = await chromium.launch({ args: ["--no-sandbox"] });
  const ctx = await newHarnessContext(b, { viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  await p.goto(ORIGIN + "/", { waitUntil: "load" }); await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" }); await p.waitForTimeout(1600);
  await p.screenshot({ path: "/tmp/crops/f_hero.png" });
  await p.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: "instant" })); await p.waitForTimeout(2200);
  await p.screenshot({ path: "/tmp/crops/f_invite.png" });
  const c2 = await newHarnessContext(b, { viewport: { width: 1440, height: 900 } }); const q = await c2.newPage();
  await q.goto(ORIGIN + "/?theme=aubade", { waitUntil: "load" }); await q.waitForTimeout(1600); await q.screenshot({ path: "/tmp/crops/f_aubade.png" });
  await b.close();
})();
