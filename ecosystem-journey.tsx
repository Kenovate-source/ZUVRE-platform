"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BRAND_ASSETS } from "@/content/brand-assets";
import { FAMILIES, WORLDS_HUB, ZURI_LINES, type CapabilityEntry } from "@/content/capabilities";
import { useReducedMotion } from "@/components/universe/use-reduced-motion";
import { ZuriPresence } from "@/components/zuri/zuri-presence";
import { CapabilityIcon } from "./capability-icon";
import { StatusChip } from "./status-chip";

/**
 * A pinned scene: the constellation stays in view while the visitor reads
 * through the ecosystem chapter by chapter. The ACTIVE node always equals the
 * chapter being read — scrolling drives it (IntersectionObserver on the
 * chapters, nothing timed), and activating a node (click, tap, Enter, Space)
 * scrolls to its chapter. Hovering only previews the connection. Page
 * scrolling is never hijacked: the stage is plain `position: sticky`.
 *
 * Every chapter is server-rendered HTML, so the whole inventory is readable
 * with JavaScript off; the orrery and Zuri are the enhancement. Nothing here
 * is a demo — planned entries say so and offer no "try it" control.
 */

interface JourneyNode {
  id: string;
  label: string;
  blurb: string;
  entries: readonly CapabilityEntry[];
  x: number;
  y: number;
  hub: boolean;
}

const RADIUS = 36;
const NODES: readonly JourneyNode[] = [
  { id: WORLDS_HUB.id, label: WORLDS_HUB.name, blurb: WORLDS_HUB.blurb, entries: WORLDS_HUB.entries, x: 50, y: 50, hub: true },
  ...FAMILIES.map((family, i) => {
    const angle = ((-90 + (360 / FAMILIES.length) * i) * Math.PI) / 180;
    return {
      id: family.id,
      label: family.name,
      blurb: family.blurb,
      entries: family.entries,
      x: Number((50 + RADIUS * Math.cos(angle)).toFixed(2)),
      y: Number((50 + RADIUS * Math.sin(angle)).toFixed(2)),
      hub: false,
    };
  }),
];

function summarize(entries: readonly CapabilityEntry[]) {
  const available = entries.filter((e) => e.status === "available").length;
  return { available, planned: entries.length - available };
}

export function EcosystemJourney() {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(WORLDS_HUB.id);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const chapters = useRef<Record<string, HTMLElement | null>>({});
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll drives the active node: whichever chapter crosses the middle band.
  useEffect(() => {
    const els = Object.values(chapters.current).filter((el): el is HTMLElement => el !== null);
    if (els.length === 0 || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target instanceof HTMLElement ? entry.target.dataset.nodeId : undefined;
          if (entry.isIntersecting && id) setActiveId(id);
        }
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function goTo(id: string) {
    setActiveId(id);
    chapters.current[id]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const current = buttons.current.findIndex((b) => b === document.activeElement);
    if (current === -1) return;
    e.preventDefault();
    const last = NODES.length - 1;
    let next = current;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = current === last ? 0 : current + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = current === 0 ? last : current - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    buttons.current[next]?.focus();
  }

  const active = NODES.find((n) => n.id === activeId) ?? NODES[0];
  const activeSummary = active ? summarize(active.entries) : { available: 0, planned: 0 };

  return (
    <div className="zl-journey">
      <div className="zl-journey-sticky">
        <div className="zl-orrery" role="group" aria-label="ZUVRE ecosystem. Select a node to jump to its chapter." onKeyDown={onKeyDown}>
          <svg className="zl-orrery-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <circle className="zl-orrery-ring" cx="50" cy="50" r={RADIUS} />
            <circle className="zl-orrery-ring" cx="50" cy="50" r={RADIUS * 0.55} />
            {NODES.filter((n) => !n.hub).map((n) => {
              const isActive = n.id === activeId;
              const state = isActive ? "selected" : n.id === hoverId ? "hover" : "idle";
              return (
                <line key={n.id} className="zl-link-line" x1={50} y1={50} x2={n.x} y2={n.y} data-state={state} data-dim={activeId !== WORLDS_HUB.id && !isActive && state === "idle"} />
              );
            })}
            {active && !active.hub ? (
              <circle key={active.id} className="zl-pulse" r={1.15}>
                <animateMotion dur="2.4s" repeatCount="indefinite" path={`M 50 50 L ${active.x} ${active.y}`} />
              </circle>
            ) : null}
          </svg>

          {NODES.map((n, i) => {
            const s = summarize(n.entries);
            return (
              <button
                key={n.id}
                ref={(el) => { buttons.current[i] = el; }}
                type="button"
                className={`zl-node${n.hub ? " zl-node--hub" : ""}${s.available > 0 ? " zl-node--live" : ""}`}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                aria-pressed={n.id === activeId}
                aria-controls={`chapter-${n.id}`}
                onClick={() => goTo(n.id)}
                onPointerEnter={() => setHoverId(n.id)}
                onPointerLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(n.id)}
                onBlur={() => setHoverId(null)}
              >
                {n.hub ? (
                  <>
                    <Image src={BRAND_ASSETS.logoMarkSmall.src} width={BRAND_ASSETS.logoMarkSmall.width} height={BRAND_ASSETS.logoMarkSmall.height} alt="" className="zl-node-hubmark" />
                    <span className="zl-node-hublabel">{n.label}</span>
                  </>
                ) : (
                  <>
                    <span>{n.label}</span>
                    <span className="zl-node-count">{s.available > 0 ? `${s.available} live · ` : ""}{s.planned} planned</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="zl-journey-guide">
          <ZuriPresence size="sm" nudgeKey={activeId} />
          <p className="zl-zuri-line zuvre-panel-raised" role="status">{ZURI_LINES[activeId] ?? ""}</p>
        </div>
        <p className="zl-sr-only" role="status">
          Reading {active?.label}: {activeSummary.available} available now, {activeSummary.planned} planned.
        </p>
      </div>

      <div className="zl-chapters">
        {NODES.map((n) => {
          const s = summarize(n.entries);
          return (
            <section
              key={n.id}
              id={`chapter-${n.id}`}
              ref={(el) => { chapters.current[n.id] = el; }}
              className="zl-chapter"
              data-node-id={n.id}
              data-active={n.id === activeId}
              aria-labelledby={`chapter-${n.id}-title`}
            >
              <div>
                <p className="zl-eyebrow" style={{ marginBottom: ".5rem" }}>{n.hub ? "The centre" : "Capability family"}</p>
                <h3 id={`chapter-${n.id}-title`} className="zl-panel-title">{n.label}</h3>
              </div>
              <p className="zl-panel-blurb">{n.blurb}</p>
              <ul className="zl-cap-list">
                {n.entries.map((entry) => (
                  <li key={entry.id} className={`zl-cap-item zl-cap-item--${entry.status}`}>
                    <CapabilityIcon icon={entry.icon} />
                    <span>
                      <span className="zl-cap-name">
                        {entry.name}
                        <span className="zl-cap-kind">{entry.kind === "capability" ? "capability" : "experience"}</span>
                      </span>
                      <span className="zl-cap-note">{entry.note}</span>
                    </span>
                    <StatusChip status={entry.status} />
                  </li>
                ))}
              </ul>
              {s.available > 0 ? (
                <div className="zl-panel-foot">
                  <Link href="/register" className="zuvre-button-primary zuvre-focus-ring">
                    Create an account to use {s.available === 1 ? "this" : "these"}
                  </Link>
                </div>
              ) : (
                <p className="zl-muted zl-chapter-note">Nothing here is usable yet — it&apos;s listed so you can see where the ecosystem is heading, not as a demo.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
