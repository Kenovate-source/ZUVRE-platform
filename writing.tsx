import type { ZuvreIconProps } from "../_shared";
/** Capability / Writing — document with lines + pencil. */
export function IconWriting({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Writing">
      <path d="M6 4.5h8l4 4v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z" />
      <path d="M8.5 12h5M8.5 15h4" />
      <path d="M16 17.3 19.3 14l1.7 1.7L17.7 19z" />
    </svg>
  );
}
