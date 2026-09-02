import type { ZuvreIconProps } from "../_shared";
/** Capability / Video — play button in a framed rectangle. */
export function IconVideo({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Video">
      <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
      <path d="M10.5 9.3v5.4l4.5-2.7z" strokeLinejoin="round" />
    </svg>
  );
}
