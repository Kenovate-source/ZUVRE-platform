"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BRAND_ASSETS } from "@/content/brand-assets";
import { ZuriCompanion } from "@/components/zuri-companion";
import { useReducedMotion } from "@/components/universe/use-reduced-motion";

/**
 * The arrival scene: real canonical artwork in layered depth.
 *   back → front:  flow paths · orbit rings · orbital core · Zuri · logo emblem
 *
 * Interaction is deterministic and visitor-driven:
 *  • pointer position (fine pointers only, never under reduced motion) shifts
 *    each layer by a fixed depth factor — same position, same result;
 *  • activating Zuri (click, tap, Enter, Space) toggles a short, honest note
 *    about what Zuri is today; Escape closes it.
 * Ambient float/breathe/orbit motion is CSS-only and switched off by
 * prefers-reduced-motion.
 */
export function ArrivalStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [noteOpen, setNoteOpen] = useState(false);
  const [pointerIn, setPointerIn] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      raf = 0;
      stage.style.setProperty("--zl-px", nx.toFixed(3));
      stage.style.setProperty("--zl-py", ny.toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2));
      ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height - 0.5) * 2));
      if (raf === 0) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      nx = 0;
      ny = 0;
      if (raf === 0) raf = requestAnimationFrame(apply);
    };
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape" && noteOpen) setNoteOpen(false);
  }

  const { flowPaths, orbitalCore, logoPrimary } = BRAND_ASSETS;

  return (
    <div className="zl-stage" ref={stageRef} onKeyDown={onKeyDown} data-zuri={noteOpen ? "attentive" : pointerIn ? "curious" : "idle"} onPointerEnter={() => setPointerIn(true)} onPointerLeave={() => setPointerIn(false)}>
      <Image src={flowPaths.src} width={flowPaths.width} height={flowPaths.height} alt="" className="zl-stage-flow" aria-hidden="true" />

      <svg className="zl-stage-rings" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <ellipse className="zl-ring zl-ring--a" cx="50" cy="50" rx="46" ry="40" />
        <g transform="rotate(24 50 50)">
          <ellipse className="zl-ring zl-ring--b" cx="50" cy="50" rx="37" ry="46" />
        </g>
        <g className="zl-orbit-group">
          <circle className="zl-ring-orb" cx="96" cy="50" r="1.3" />
        </g>
      </svg>

      <Image src={orbitalCore.src} width={orbitalCore.width} height={orbitalCore.height} alt="" className="zl-stage-core" aria-hidden="true" />

      <button
        type="button"
        className="zl-zuri"
        aria-expanded={noteOpen}
        aria-controls="zuri-note"
        aria-label="Meet Zuri"
        onClick={() => setNoteOpen((open) => !open)}
      >
        <ZuriCompanion className="zl-zuri-img" priority decorative sizes="(min-width: 960px) 26rem, 56vw" />
      </button>
      <span className="zl-zuri-hint" aria-hidden="true">{noteOpen ? "Esc to close" : "Meet Zuri ↑"}</span>

      <div className="zl-stage-emblem-wrap">
        <Image
          src={logoPrimary.src}
          width={logoPrimary.width}
          height={logoPrimary.height}
          alt="ZUVRE emblem: a gold ring around a gold Z, with a luminous green orb on an emerald orbit"
          className="zl-stage-emblem"
          sizes="(min-width: 960px) 17rem, 38vw"
          priority
        />
      </div>

      <div id="zuri-note" className="zl-zuri-note zuvre-panel-raised" hidden={!noteOpen} role="region" aria-label="About Zuri">
        <strong>Zuri</strong>
        ZUVRE&apos;s companion. For now Zuri is a presence on this page — not yet connected to the AI, and not
        yet animated. Expressions, poses and a transparent character asset are still being produced.
      </div>
    </div>
  );
}
