"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "./universe/use-reduced-motion";

/**
 * A radial map, not a card grid: ZUVRE AI sits at the center, and the rest
 * of the ecosystem orbits it. This is the visual answer to "communicate
 * that ZUVRE is a living ecosystem rather than a collection of tools" —
 * see docs/03-brand-book.md §14.
 *
 * Interactive: hovering a node (or its label) highlights that connection
 * and dims the others; every node breathes gently and independently
 * (staggered delay, not synchronized — avoids reading as a loading
 * indicator); a single soft pulse travels the connections in sequence,
 * cycling roughly every 3.4s. Nothing here spins continuously — this is
 * "alive and stable," not a spinner.
 */

const SATELLITES = [
  { label: "Capabilities", x: 50, y: 12 },
  { label: "Agents", x: 84, y: 31 },
  { label: "Creation & Research", x: 84, y: 69 },
  { label: "Your World, Your Control", x: 50, y: 88 },
  { label: "Links & QR", x: 16, y: 69 },
  { label: "The Outside World", x: 16, y: 31 },
] as const;

const CENTER = { x: 50, y: 37.5 };
const PULSE_INTERVAL_MS = 3400;

export function EcosystemConstellation() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pulseIndex, setPulseIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setPulseIndex((i) => (i + 1) % SATELLITES.length);
    }, PULSE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const pulseTarget = SATELLITES[pulseIndex];
  const pulsePath = `M ${CENTER.x} ${CENTER.y} L ${pulseTarget.x} ${pulseTarget.y * 0.75}`;

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl">
      <svg
        viewBox="0 0 100 75"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {SATELLITES.map((s, i) => {
          const isActive = hovered === i;
          const isDimmed = hovered !== null && hovered !== i;
          return (
            <line
              key={s.label}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={s.x}
              y2={s.y * 0.75}
              className={`zuvre-constellation-line ${isActive ? "zuvre-constellation-line-active" : ""} ${
                isDimmed ? "zuvre-constellation-line-dimmed" : ""
              }`}
            />
          );
        })}

        {!reducedMotion && (
          <circle key={pulseIndex} r={1.1} className="zuvre-constellation-pulse">
            <animateMotion dur="1.4s" path={pulsePath} fill="freeze" />
            <animate attributeName="opacity" values="0;0.9;0" dur="1.4s" fill="freeze" />
          </circle>
        )}

        {SATELLITES.map((s, i) => (
          <circle
            key={s.label}
            cx={s.x}
            cy={s.y * 0.75}
            r={2.2}
            className={`zuvre-constellation-node zuvre-constellation-node-breathe ${
              hovered === i ? "zuvre-constellation-node-active" : ""
            }`}
            style={{ "--breathe-delay": `${i * 380}ms` } as CSSProperties}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={4.5}
          fill="var(--zuvre-accent-primary)"
          className="zuvre-constellation-node-breathe"
          style={{ "--breathe-delay": "0ms" } as CSSProperties}
        />
      </svg>

      {/* Center label */}
      <div
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
        style={{ left: "50%", top: "50%" }}
      >
        <span className="zuvre-badge zuvre-badge-accent mt-3 whitespace-nowrap">ZUVRE AI · Live</span>
      </div>

      {/* Satellite labels — hoverable, matching the node's highlight state */}
      {SATELLITES.map((s, i) => (
        <div
          key={s.label}
          className={`zuvre-constellation-label absolute -translate-x-1/2 -translate-y-1/2 cursor-default whitespace-nowrap px-2 text-center text-xs font-medium text-text-secondary ${
            hovered === i ? "zuvre-constellation-label-active" : ""
          } ${hovered !== null && hovered !== i ? "zuvre-constellation-label-dimmed" : ""}`}
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          {s.label}
        </div>
      ))}
    </div>
  );
}
