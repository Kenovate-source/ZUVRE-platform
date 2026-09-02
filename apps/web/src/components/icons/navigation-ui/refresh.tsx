import type { ZuvreIconProps } from "../_shared";
/** Navigation/UI (Set 2) / Refresh — circular arrow. */
export function IconRefresh({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Refresh">
      <path d="M19 12a7 7 0 1 1-2.3-5.2" />
      <path d="M19 4.5v4.3h-4.3" />
    </svg>
  );
}
