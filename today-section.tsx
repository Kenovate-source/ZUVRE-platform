import Link from "next/link";
import { FAMILIES, TODAY_STEPS, WORLDS_HUB, inventoryCounts } from "@/content/capabilities";
import { Reveal } from "./reveal";
import { StatusChip } from "./status-chip";

export function TodaySection() {
  const counts = inventoryCounts();
  const availableNow = [
    ...WORLDS_HUB.entries.filter((e) => e.status === "available"),
    ...FAMILIES.flatMap((f) => f.entries.filter((e) => e.status === "available")),
  ];
  return (
    <section id="today" className="zl-section" data-zl-section="today" aria-labelledby="today-title">
      <div className="zl-wrap">
        <div className="zl-today-head">
          <p className="zl-eyebrow">The present experience</p>
          <h2 id="today-title" className="zl-h2">What you can do right now.</h2>
          <p className="zl-lede">ZUVRE is early. This is the real path through it today — no demos, nothing simulated.</p>
        </div>

        <Reveal>
          <ol className="zl-steps">
            {TODAY_STEPS.map((step) => (
              <li key={step.id} className="zl-step zuvre-card">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <Link href={step.href} className="zuvre-button-secondary zuvre-focus-ring">{step.cta}</Link>
                {step.needsAccount ? <span className="zl-step-note">Requires you to be signed in.</span> : null}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120}>
          <div className="zl-today-split">
            <div className="zuvre-card">
              <h3><StatusChip status="available" /> Usable today</h3>
              <ul>
                {availableNow.map((entry) => (
                  <li key={entry.id}>{entry.name}</li>
                ))}
              </ul>
            </div>
            <div className="zuvre-card">
              <h3><StatusChip status="planned" /> Not built yet</h3>
              <p style={{ margin: 0, color: "var(--zuvre-text-secondary)", fontSize: ".92rem", lineHeight: 1.6 }}>
                {counts.planned} planned capabilities — including image, video, audio, documents, websites, apps, games,
                agents and publishing — are part of the design and not yet available.{" "}
                <a href="#ecosystem" className="zl-accent">Explore them</a>.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
