/**
 * A radial map, not a card grid: ZUVRE AI sits at the center, and the rest
 * of the ecosystem orbits it. This is the visual answer to "communicate
 * that ZUVRE is a living ecosystem rather than a collection of tools" —
 * see docs/03-brand-book.md §14. Lines/nodes are decorative SVG; labels
 * are real HTML so they stay crisp, themeable, and accessible.
 */

const SATELLITES = [
  { label: "Capabilities", x: 50, y: 12 },
  { label: "Agents", x: 84, y: 31 },
  { label: "Creation & Research", x: 84, y: 69 },
  { label: "Your World, Your Control", x: 50, y: 88 },
  { label: "Links & QR", x: 16, y: 69 },
  { label: "The Outside World", x: 16, y: 31 },
] as const;

export function EcosystemConstellation() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl">
      <svg
        viewBox="0 0 100 75"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {SATELLITES.map((s) => (
          <line
            key={s.label}
            x1={50}
            y1={37.5}
            x2={s.x}
            y2={s.y * 0.75}
            className="zuvre-constellation-line"
          />
        ))}
        {SATELLITES.map((s) => (
          <circle key={s.label} cx={s.x} cy={s.y * 0.75} r={2.2} className="zuvre-constellation-node" />
        ))}
        <circle cx={50} cy={37.5} r={4.5} fill="var(--zuvre-accent-primary)" />
      </svg>

      {/* Center label */}
      <div
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
        style={{ left: "50%", top: "50%" }}
      >
        <span className="zuvre-badge zuvre-badge-accent mt-3 whitespace-nowrap">ZUVRE AI · Live</span>
      </div>

      {/* Satellite labels */}
      {SATELLITES.map((s) => (
        <div
          key={s.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-2 text-center text-xs font-medium text-text-secondary"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        >
          {s.label}
        </div>
      ))}
    </div>
  );
}
