/**
 * The ZUVRE Mark — v0.1 foundation.
 *
 * An open ring (the ecosystem, always in motion, never "closed") with a
 * spark at one edge (the thing being carried around it — a capability, an
 * agent, a thought). A second, smaller inner arc suggests depth — orbits
 * within orbits, the way capabilities will eventually nest and multiply.
 *
 * This is real, rendered geometry — not a placeholder box — but it is a
 * v0.1 foundation mark, built to be structurally sound and reusable
 * (single source, currentColor-free, theme-driven via CSS variables) so a
 * professional visual design pass can refine or replace the exact curves
 * later without anything that references <ZuvreMark /> needing to change.
 * See docs/03-brand-book.md §12.
 */
export function ZuvreMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="ZUVRE"
    >
      {/* inner depth arc */}
      <path
        d="M22.26 33.85 A10 10 0 0 0 22.26 14.15"
        stroke="var(--zuvre-border-interactive)"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* outer ring, open */}
      <path
        d="M37.02 34.93 A17 17 0 1 1 37.02 13.07"
        stroke="var(--zuvre-accent-primary)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      {/* the spark, riding the open edge */}
      <circle cx="37.02" cy="13.07" r="3.4" fill="var(--zuvre-accent-primary)" />
    </svg>
  );
}
