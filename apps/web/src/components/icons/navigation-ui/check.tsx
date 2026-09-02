import type { ZuvreIconProps } from "../_shared";
/** Navigation/UI (Set 2) / Check-Success — checkmark in a circle. */
export function IconCheck({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Check / Success">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.3 12.3 10.8 14.8 15.7 9.5" />
    </svg>
  );
}
