import Link from "next/link";
import { EnterLink } from "./enter-link";
import { inventoryCounts } from "@/content/capabilities";
import { ArrivalStage } from "./arrival-stage";

export function ArrivalSection() {
  const counts = inventoryCounts();
  return (
    <section className="zl-section zl-hero" data-zl-section="arrival" aria-labelledby="arrival-title">
      <div className="zl-wrap zl-hero-grid">
        <div className="zl-hero-copy">
          <p className="zl-eyebrow">Thought → Movement → Form → Creation → World</p>
          <h1 id="arrival-title" className="zl-h1">
            Give Thought <span className="zl-accent">a World.</span>
          </h1>
          <p className="zl-lede">
            ZUVRE is a living ecosystem where an idea can become a conversation, a capability, and a place of your
            own to build in — with every step under your control.
          </p>
          <div className="zl-hero-cta">
            <EnterLink className="zuvre-button-primary zuvre-focus-ring" />
            <a href="#idea" className="zuvre-button-secondary zuvre-focus-ring">What is ZUVRE?</a>
          </div>
          <p className="zl-status-line">
            <span className="zl-chip zl-chip--available">Live today</span>
            <span>
              Worlds and AI conversation. {counts.planned} more capabilities across {counts.families} families are
              planned — <a href="#ecosystem" className="zl-accent">see exactly where things stand</a>.
            </span>
          </p>
        </div>
        <div className="zl-hero-stagewrap">
          <ArrivalStage />
        </div>
      </div>
    </section>
  );
}
