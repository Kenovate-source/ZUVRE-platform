/**
 * The ZUVRE Companion — v0.1 foundation.
 *
 * Not a mascot in the theme-park sense — a small, quiet presence meant to
 * eventually appear anywhere in ZUVRE a guide is useful (onboarding, an
 * empty state, ZUVRE AI's conversational surface) rather than being
 * permanently stuck in one hero section. Its core is the same "spark"
 * motif as the ring in <ZuvreMark />, so the two read as one family: the
 * mark is the ecosystem's symbol, the companion is something that lives
 * inside it.
 *
 * `mood` is the extensibility contract: only "idle" is implemented in this
 * pass, but any future surface should drive behavior through this prop
 * rather than reaching into the SVG or forking the component. A real
 * illustrator's pass on the actual silhouette is still pending — see
 * docs/03-brand-book.md §13 and STATUS.md. What's shipped here is real,
 * rendered, and structurally reusable, not a placeholder box.
 */
export type ZuvreCompanionMood = "idle";

export function ZuvreCompanion({
  size = 120,
  mood = "idle",
  className,
}: {
  size?: number;
  mood?: ZuvreCompanionMood;
  className?: string;
}) {
  void mood; // only one mood implemented today — see contract note above

  return (
    <div className={`zuvre-mascot-breathe ${className ?? ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 140" fill="none" role="img" aria-label="ZUVRE companion">
        <defs>
          <linearGradient id="zuvre-companion-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--zuvre-accent-secondary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--zuvre-surface-raised)" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* body */}
        <ellipse cx="60" cy="82" rx="40" ry="46" fill="url(#zuvre-companion-body)" stroke="var(--zuvre-border-interactive)" strokeWidth="1" opacity="0.9" />
        {/* head bump — merges with body for a soft, single-silhouette read */}
        <ellipse cx="60" cy="46" rx="27" ry="24" fill="url(#zuvre-companion-body)" stroke="var(--zuvre-border-interactive)" strokeWidth="1" opacity="0.9" />

        {/* the spark / core — same motif as the ring's spark in ZuvreMark */}
        <circle className="zuvre-mascot-core" cx="60" cy="50" r="6.5" fill="var(--zuvre-accent-primary)" />

        {/* drifting motes — quiet, not sparkly/childish */}
        <circle cx="34" cy="66" r="1.6" fill="var(--zuvre-accent-primary)" opacity="0.5" />
        <circle cx="88" cy="72" r="2" fill="var(--zuvre-accent-primary)" opacity="0.4" />
        <circle cx="78" cy="30" r="1.4" fill="var(--zuvre-accent-primary)" opacity="0.5" />
      </svg>
    </div>
  );
}
