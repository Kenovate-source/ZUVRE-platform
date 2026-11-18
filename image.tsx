import type { ZuvreIconProps } from "../_shared";
/** Capability / Image — picture frame with mountain + sun. */
export function IconImage({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Image">
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <circle cx="9" cy="9.5" r="1.6" />
      <path d="M4 16.5l5-5 3.5 3.5L17 10l3 3" />
    </svg>
  );
}
