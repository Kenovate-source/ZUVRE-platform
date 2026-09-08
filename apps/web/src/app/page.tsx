import { ZuvreWordmark } from "@/components/zuvre-wordmark";
import { ThemeToggle } from "@/components/theme-toggle";
import { ZuriCompanion } from "@/components/zuri-companion";
import { EcosystemConstellation } from "@/components/ecosystem-constellation";
import { SpotlightButton } from "@/components/spotlight-button";
import { ZuvreUniverseBackground } from "@/components/universe";
import { IconImage, IconWebsite, IconAiModel, IconWriting } from "@/components/icons";
import { IconCheck } from "@/components/icons/navigation-ui";
import Link from "next/link";

const CAPABILITIES = [
  { name: "AI Chat", status: "live" as const, note: "Runs through the real capability contract — see docs/09-capability-system.md.", Icon: IconAiModel },
  { name: "Image Generation", status: "arriving" as const, note: "Same execution pipeline, same permission model, no new UI required.", Icon: IconImage },
  { name: "Website & App Building", status: "arriving" as const, note: "One grant model. One audit trail. One visual language.", Icon: IconWebsite },
  { name: "Writing & Text", status: "arriving" as const, note: "Rewrite, improve, summarize, expand — the same contract, a different capability.", Icon: IconWriting },
  { name: "Research", status: "arriving" as const, note: "Sources, comparisons, structured findings — able to work outside ZUVRE when you allow it.", Icon: null },
  { name: "Stickers", status: "arriving" as const, note: "Made, not just used.", Icon: null },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ================= HEADER ================= */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <ZuvreWordmark withTagline />
        <ThemeToggle />
      </header>

      {/* ================= HERO ================= */}
      <section className="relative mx-auto max-w-5xl overflow-hidden px-6 pb-20 pt-8">
        <ZuvreUniverseBackground variant="hero" />

        <div className="relative z-10 grid gap-10 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex flex-col items-start gap-6">
            <span className="zuvre-badge zuvre-badge-accent">Phase 0 · Foundation</span>
            <h1 className="font-display text-4xl leading-tight text-text-primary sm:text-5xl">
              Something is waking up{" "}
              <em className="not-italic text-accent-primary">inside ZUVRE.</em>
            </h1>
            <p className="max-w-lg text-text-secondary">
              Not a chatbot. Not a website builder. Not another dashboard.
              ZUVRE is a place where AI, agents, and everything you make
              share one living ecosystem — and it's built to hold far more
              than what's switched on today.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/register" className="zuvre-button-primary zuvre-focus-ring zuvre-spotlight">
                Enter ZUVRE
              </Link>
              <SpotlightButton variant="secondary">What is ZUVRE?</SpotlightButton>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end">
            <ZuriCompanion size={140} pose="welcoming" expression="reassuring" />
          </div>
        </div>
      </section>

      {/* ================= WHAT IS ZUVRE ================= */}
      <section className="relative mx-auto max-w-3xl overflow-hidden px-6 pb-24">
        <ZuvreUniverseBackground variant="spacious" />
        <p className="relative z-10 zuvre-eyebrow mb-4">What is ZUVRE?</p>
        <p className="relative z-10 font-display text-2xl leading-relaxed text-text-primary sm:text-3xl">
          ZUVRE is the substrate underneath — the thing that lets an idea
          become a conversation, a conversation become a capability, and a
          capability become something you can hold, share, and build on top
          of. It doesn't ask you to pick a tool first. You arrive, and the
          ecosystem figures out what you need.
        </p>
      </section>

      {/* ================= THE ECOSYSTEM ================= */}
      <section className="relative mx-auto max-w-3xl overflow-hidden px-6 pb-24">
        <ZuvreUniverseBackground variant="ecosystem" />
        <p className="relative z-10 zuvre-eyebrow mb-8 text-center">The Ecosystem</p>
        <div className="relative z-10">
          <EcosystemConstellation />
        </div>
        <p className="relative z-10 mx-auto mt-8 max-w-md text-center text-sm text-text-secondary">
          ZUVRE AI is live in Phase 0. Everything orbiting it — agents,
          creation, research, your own control center — is architected and
          arriving as the ecosystem grows.
        </p>
      </section>

      {/* ================= CAPABILITIES (flowing list, not a card wall) ================= */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <p className="zuvre-eyebrow mb-6">Capabilities</p>
        <div className="zuvre-card divide-y divide-border">
          {CAPABILITIES.map((cap) => (
            <div key={cap.name} className="zuvre-list-row flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                {cap.Icon ? (
                  <cap.Icon size={20} className="shrink-0 text-text-secondary" />
                ) : (
                  <span className="w-5 shrink-0" aria-hidden="true" />
                )}
                <div>
                  <h3 className="font-display text-base text-text-primary">{cap.name}</h3>
                  <p className="mt-0.5 text-sm text-text-secondary">{cap.note}</p>
                </div>
              </div>
              <span className={cap.status === "live" ? "zuvre-badge zuvre-badge-accent shrink-0" : "zuvre-badge shrink-0"}>
                {cap.status === "live" ? <IconCheck size={13} /> : null}
                {cap.status === "live" ? "Live" : "Arriving"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= AGENTS + ZUVRE AI ================= */}
      <section className="mx-auto grid max-w-3xl gap-6 px-6 pb-24 sm:grid-cols-2">
        <div className="zuvre-card zuvre-card-interactive p-6">
          <p className="zuvre-eyebrow mb-3">Agents</p>
          <p className="text-sm text-text-secondary">
            Agents work across ZUVRE — and, with your explicit permission,
            outside it too. Nothing an agent does happens without the same
            grant and audit system that governs every capability. You
            decide what it can touch.
          </p>
        </div>
        <div className="zuvre-card zuvre-card-interactive p-6">
          <p className="zuvre-eyebrow mb-3">ZUVRE AI</p>
          <p className="text-sm text-text-secondary">
            A conversational personality that adapts to how you talk —
            serious, casual, brief, detailed — without pretending to know
            how you feel. Emoji, stickers, and a tone it actually listens
            for are part of where this is headed.
          </p>
        </div>
      </section>

      {/* ================= YOUR CONTROL ================= */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="zuvre-panel-raised flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <p className="zuvre-eyebrow mb-2">Your World, Your Control</p>
            <p className="text-sm text-text-secondary">
              Every capability, every agent, every permission ZUVRE AI has
              is visible and revocable — by you, and by the platform owner
              through a control center built to go far beyond a normal
              admin panel. Nothing acts on your behalf silently.
            </p>
          </div>
          <SpotlightButton variant="secondary" className="shrink-0">Read the Product Bible</SpotlightButton>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative mx-auto max-w-3xl overflow-hidden px-6 pb-16 pt-8 text-center">
        <ZuvreUniverseBackground variant="cta" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl text-text-primary">Come in. It's still becoming itself.</h2>
          <Link href="/register" className="zuvre-button-primary zuvre-focus-ring zuvre-spotlight">
            Enter ZUVRE
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 pb-12">
        <p className="text-xs text-text-muted">
          ZUVRE is in its foundation phase. Capabilities marked "Arriving"
          are part of the architecture but not yet live — see STATUS.md in
          the repository for the exact, honest breakdown.
        </p>
      </footer>
    </main>
  );
}
