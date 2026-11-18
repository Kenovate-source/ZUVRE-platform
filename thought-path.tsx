"use client";

import { useEffect, useRef, useState } from "react";
import { PHILOSOPHY_STAGES } from "@/content/capabilities";
import { StatusChip } from "./status-chip";

/**
 * Thought → Movement → Form → Creation → World as something you move
 * through. A track fills as the section scrolls past (real scroll position,
 * no timers); each stage lights up once reached. Stages are buttons: pick
 * one to read what it means AND whether it exists today — the path never
 * implies a stage works when it doesn't.
 */
export function ThoughtPath() {
  const pathRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(1);
  const [selectedId, setSelectedId] = useState(PHILOSOPHY_STAGES[0]?.id ?? "thought");

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const section = path.closest<HTMLElement>("[data-zl-section]") ?? path;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.62 - rect.top) / (rect.height * 0.55)));
      path.style.setProperty("--zl-progress", progress.toFixed(3));
      const last = PHILOSOPHY_STAGES.length - 1;
      const count = PHILOSOPHY_STAGES.filter((_, i) => progress >= i / last - 0.001).length;
      setReached((prev) => (prev === count ? prev : count));
    };
    const schedule = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, []);

  const selected = PHILOSOPHY_STAGES.find((s) => s.id === selectedId);

  return (
    <div>
      <div className="zl-path" ref={pathRef} role="group" aria-label="From thought to world">
        <div className="zl-path-track" aria-hidden="true">
          <div className="zl-path-fill" />
          <div className="zl-path-orb" />
        </div>
        {PHILOSOPHY_STAGES.map((stage, i) => (
          <button
            key={stage.id}
            type="button"
            className="zl-stage-btn"
            aria-pressed={selectedId === stage.id}
            aria-controls="zl-path-detail"
            data-reached={i < reached}
            onClick={() => setSelectedId(stage.id)}
          >
            <span className="zl-stage-btn-index">{`0${i + 1}`}</span>
            <span className="zl-stage-btn-name">{stage.name}</span>
          </button>
        ))}
      </div>

      {selected ? (
        <div id="zl-path-detail" className="zl-path-detail zuvre-card" role="region" aria-live="polite" aria-label={`${selected.name}: what it means`}>
          <p className="zl-detail-line">{selected.line}</p>
          <p className="zl-detail-today">
            <StatusChip status={selected.status} />
            <span>{selected.today}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
