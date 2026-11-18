import type { ZuvreIconProps } from "../_shared";
/** Core / Notifications — bell. */
export function IconNotifications({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Notifications">
      <path d="M7 10a5 5 0 0 1 10 0c0 4 1.5 5.5 1.5 5.5h-13S7 14 7 10Z" />
      <path d="M10.3 18.5a1.8 1.8 0 0 0 3.4 0" />
    </svg>
  );
}
