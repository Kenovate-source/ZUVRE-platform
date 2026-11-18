"use client";

import { ThoughtParticles } from "@/components/universe/thought-particles";
import { AmbientLight } from "@/components/universe/ambient-light";

/**
 * The only canvas on the landing page. Reuses the existing, already-audited
 * particle/connection system and cursor light (reduced-motion → one static
 * frame; pauses offscreen and in hidden tabs; fine-pointer-only light).
 */
export function BackdropEffects() {
  return (
    <div className="zl-fx">
      <ThoughtParticles density="normal" />
      <AmbientLight />
    </div>
  );
}
