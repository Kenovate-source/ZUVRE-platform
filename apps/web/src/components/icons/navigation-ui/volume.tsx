import type { ZuvreIconProps } from "../_shared";
/** Navigation/UI (Set 2) / Volume — speaker with sound waves. */
export function IconVolume({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Volume">
      <path d="M4.5 10v4h3.2L12 17.5v-11L7.7 10Z" strokeLinejoin="round" />
      <path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.3 7.2a7 7 0 0 1 0 9.6" />
    </svg>
  );
}
