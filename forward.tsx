import type { ZuvreIconProps } from "../_shared";
/** Navigation/UI (Set 2) / Forward — right arrow. */
export function IconForward({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Forward">
      <line x1="4.5" y1="12" x2="19.5" y2="12" />
      <path d="M14 6.5 19.5 12 14 17.5" />
    </svg>
  );
}
