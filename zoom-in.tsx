import type { ZuvreIconProps } from "../_shared";
/** Navigation/UI (Set 2) / Zoom In — magnifying glass with plus. */
export function IconZoomIn({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Zoom In">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="10.5" y1="7.8" x2="10.5" y2="13.2" />
      <line x1="7.8" y1="10.5" x2="13.2" y2="10.5" />
      <line x1="15.3" y1="15.3" x2="20" y2="20" />
    </svg>
  );
}
