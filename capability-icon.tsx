import type { ComponentType } from "react";
import { IconAiModel, IconWriting, IconImage, IconVideo, IconWebsite, IconAiAutomation } from "@/components/icons/capability";
import type { CapabilityIconKey } from "@/content/capabilities";

// Only icons that exist in the canonical set. There is deliberately no
// AI Agent icon (both proposals were rejected) — the "Agents" entry has no
// icon key and renders a plain orb instead.
const ICONS: Record<CapabilityIconKey, ComponentType<{ size?: number; className?: string }>> = {
  "ai-model": IconAiModel,
  writing: IconWriting,
  image: IconImage,
  video: IconVideo,
  website: IconWebsite,
  "ai-automation": IconAiAutomation,
};

/** Decorative: the entry's name is always present as text beside it. */
export function CapabilityIcon({ icon }: { icon: CapabilityIconKey | undefined }) {
  if (!icon) return <span className="zl-cap-orb" aria-hidden="true" />;
  const Icon = ICONS[icon];
  return (
    <span className="zl-cap-icon" aria-hidden="true">
      <Icon size={20} />
    </span>
  );
}
