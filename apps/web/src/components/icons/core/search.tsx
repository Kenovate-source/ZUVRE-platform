import type { ZuvreIconProps } from "../_shared";
/** Core / Search — magnifying glass. */
export function IconSearch({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Search">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.3" y1="15.3" x2="20" y2="20" />
    </svg>
  );
}
