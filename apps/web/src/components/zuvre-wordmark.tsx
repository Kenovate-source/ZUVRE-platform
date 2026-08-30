import { ZuvreMark } from "./zuvre-mark";

/**
 * The primary brand lockup: mark + wordmark. Pronunciation ("Zoo-vray") is
 * intentionally not shown as visible text — it lives in `title`/`aria-label`
 * for anyone who's curious or using assistive tech, not as a permanent
 * fixture of the interface. See docs/03-brand-book.md §12.
 */
export function ZuvreWordmark({ withTagline = false }: { withTagline?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" title="ZUVRE — pronounced Zoo-vray">
      <ZuvreMark size={26} />
      <div className="flex flex-col">
        <span className="font-display text-lg font-medium tracking-tight text-text-primary">
          ZUVRE
        </span>
        {withTagline ? (
          <span className="zuvre-eyebrow text-[0.65rem] leading-none">An ecosystem, alive</span>
        ) : null}
      </div>
    </div>
  );
}
