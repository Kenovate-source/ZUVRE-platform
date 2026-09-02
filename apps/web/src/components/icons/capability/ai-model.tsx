import type { ZuvreIconProps } from "../_shared";
/** Capability / AI Model & Intelligence — atom (orbits + core). */
export function IconAiModel({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="AI Model / Intelligence">
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.6" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.6" transform="rotate(120 12 12)" />
    </svg>
  );
}
