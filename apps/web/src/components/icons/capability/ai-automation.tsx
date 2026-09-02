import type { ZuvreIconProps } from "../_shared";
/** Capability / AI Automation — gear with connected/branching nodes. */
export function IconAiAutomation({ size = 24, className }: ZuvreIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="AI Automation">
      <circle cx="9" cy="12" r="3.4" />
      <circle cx="17.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <path d="M11.8 10.2 16.3 7.9M11.8 13.8l5.7 2.2" />
    </svg>
  );
}
