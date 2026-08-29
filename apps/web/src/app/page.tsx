import { ThemeToggle } from "@/components/theme-toggle";

const CAPABILITY_PREVIEWS = [
  {
    name: "AI Chat",
    status: "live" as const,
    description: "Converse with ZUVRE's AI through the same capability contract every future tool will use.",
  },
  {
    name: "Image Generation",
    status: "planned" as const,
    description: "Registers into the identical execution, permission, and artifact pipeline — no new UI required.",
  },
  {
    name: "Website Builder",
    status: "planned" as const,
    description: "Same grant model, same audit trail, same visual language — see docs/09-capability-system.md.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-8">
        <p className="zuvre-eyebrow">ZUVRE — ZOO-VRAY</p>
        <ThemeToggle />
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-6 pb-16 pt-8">
        <span className="zuvre-badge zuvre-badge-accent">Phase 0 Foundation</span>
        <h1 className="font-display text-4xl leading-tight text-text-primary sm:text-5xl">
          A place to think, make, and build —{" "}
          <em className="not-italic text-accent-primary">with an ecosystem that grows with you.</em>
        </h1>
        <p className="max-w-xl text-text-secondary">
          Capabilities, agents, and the Owner Control Center all register into
          this same interface as they come online — nothing here needs to be
          rebuilt as ZUVRE grows. This page is served by the same code that
          will eventually host every tool in the ecosystem.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button className="zuvre-button-primary zuvre-focus-ring">Enter ZUVRE</button>
          <button className="zuvre-button-secondary zuvre-focus-ring">Read the Product Bible</button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <p className="zuvre-eyebrow mb-4">Capability Registry</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {CAPABILITY_PREVIEWS.map((cap) => (
            <div key={cap.name} className="zuvre-card flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-text-primary">{cap.name}</h3>
                <span
                  className={
                    cap.status === "live"
                      ? "zuvre-badge zuvre-badge-accent"
                      : "zuvre-badge"
                  }
                >
                  {cap.status === "live" ? "Live" : "Planned"}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="zuvre-panel-raised flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="zuvre-eyebrow">Two Visual Worlds</p>
            <p className="max-w-md text-sm text-text-secondary">
              No light mode, no plain dark mode — <strong className="text-text-primary">Obsidian</strong>{" "}
              and <strong className="text-text-primary">Verdigris</strong> are two distinct, richly
              hued worlds built for long sessions. Try the toggle above.
            </p>
          </div>
          <input
            className="zuvre-input w-full text-sm sm:w-64"
            placeholder="Try typing here — this is a .zuvre-input"
          />
        </div>
      </section>
    </main>
  );
}
