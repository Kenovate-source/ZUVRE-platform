import { ThoughtParticles } from "./thought-particles";
import { OrbitalField } from "./orbital-field";
import { AmbientLight } from "./ambient-light";

/**
 * The single reusable background for every section — instantiated with a
 * different `variant` rather than duplicated per-section. This is Layer 6
 * (section-specific atmosphere): each variant tunes which layers are
 * present and how strong Layer 1 (depth) reads, so the page feels like
 * travelling deeper into the world rather than repeating one background.
 */
export type UniverseVariant = "hero" | "spacious" | "ecosystem" | "cta";

const VARIANTS: Record<
  UniverseVariant,
  { particles: "low" | "normal" | "high" | "none"; orbitals: boolean; cursorLight: boolean; depth: "soft" | "medium" | "strong" }
> = {
  // Hero: "something is waking up" — particles gathering, orbital structure, energy.
  hero: { particles: "normal", orbitals: true, cursorLight: true, depth: "medium" },
  // What Is ZUVRE: more spacious, quieter — thought becoming form, not noise.
  spacious: { particles: "low", orbitals: false, cursorLight: false, depth: "soft" },
  // Ecosystem: alive but restrained — the constellation itself carries the motion here.
  ecosystem: { particles: "low", orbitals: true, cursorLight: true, depth: "soft" },
  // Final CTA: expansive, luminous — entering a larger world.
  cta: { particles: "normal", orbitals: true, cursorLight: true, depth: "strong" },
};

export function ZuvreUniverseBackground({ variant = "spacious" }: { variant?: UniverseVariant }) {
  const cfg = VARIANTS[variant];
  return (
    <div className="zuvre-universe" aria-hidden="true">
      <div className={`zuvre-universe-depth zuvre-universe-depth-${cfg.depth}`} />
      {cfg.orbitals && <OrbitalField />}
      {cfg.particles !== "none" && <ThoughtParticles density={cfg.particles} />}
      {cfg.cursorLight && <AmbientLight />}
    </div>
  );
}
