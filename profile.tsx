import type { ZuvreIconProps } from "../_shared";
/** Core / Profile — person in a circle. */
export function IconProfile({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Profile">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="9.8" r="2.6" />
      <path d="M6.7 18.2a5.6 5.6 0 0 1 10.6 0" />
    </svg>
  );
}
