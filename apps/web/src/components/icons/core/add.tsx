import type { ZuvreIconProps } from "../_shared";
/** Core / Add — plus in a circle (matches "Create / New"). */
export function IconAdd({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Add">
      <circle cx="12" cy="12" r="8.5" />
      <line x1="12" y1="8.3" x2="12" y2="15.7" />
      <line x1="8.3" y1="12" x2="15.7" y2="12" />
    </svg>
  );
}
