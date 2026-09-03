/**
 * Layer 3: large partial orbital arcs, mostly off-canvas, so only a
 * fragment is ever visible — "you are seeing a small part of a much
 * larger system." Same open-arc construction technique as the ZUVRE mark
 * (a circle with a deliberate gap), just enormous and faint. Pure SVG +
 * CSS keyframe rotation (`.zuvre-orbital-arc` in globals.css) — no JS.
 * Rotation is disabled under prefers-reduced-motion via the existing
 * global media-query pattern already used for the mascot keyframes.
 */
export function OrbitalField() {
  return (
    <svg
      className="absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g className="zuvre-orbital-arc-a" style={{ transformOrigin: "78% 20%" }}>
        <circle cx="78" cy="20" r="70" fill="none" stroke="var(--zuvre-accent-primary)" strokeWidth="0.15" strokeDasharray="140 90" opacity="0.35" />
      </g>
      <g className="zuvre-orbital-arc-b" style={{ transformOrigin: "15% 85%" }}>
        <circle cx="15" cy="85" r="55" fill="none" stroke="var(--zuvre-accent-secondary)" strokeWidth="0.12" strokeDasharray="100 70" opacity="0.3" />
      </g>
    </svg>
  );
}
