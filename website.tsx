import type { ZuvreIconProps } from "../_shared";
/** Capability / Website Creation — browser window with code brackets. */
export function IconWebsite({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Website Creation">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <line x1="3" y1="8.6" x2="21" y2="8.6" />
      <path d="M9.5 12.5 7.5 14.5l2 2M14.5 12.5l2 2-2 2" />
    </svg>
  );
}
