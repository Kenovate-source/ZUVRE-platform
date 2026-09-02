/**
 * Zuri — integration contract, asset pending.
 *
 * Zuri is ZUVRE's canonical companion character — see
 * `Zuri - Master Character.png` and the accompanying expression/pose/
 * UI-companion reference sheets (Canonical Asset & Brand Authority Map
 * §7). No production-ready transparent Zuri asset exists yet: every
 * reference image has a baked-in dark background, and this environment
 * has no image-generation or reliable background-removal tooling to
 * fabricate one honestly.
 *
 * This component exists so the rest of the app can integrate against a
 * stable contract (size, expression, pose) now, and receive a real asset
 * later via a drop-in change to this one file — nothing that renders
 * <ZuriCompanion /> needs to know or care when that happens.
 *
 * It deliberately does NOT render a stand-in illustration. A placeholder
 * "creature" here would risk being mistaken for the real, approved
 * character — exactly what the brand-owner's rules on asset handling
 * warn against. Instead it renders a visually unmistakable pending state
 * (.zuvre-pending-slot — dashed border, muted, no shadow/glow).
 */

// Matches the 12 expressions in `Zuri - Expression Sheet.png`.
export type ZuriExpression =
  | "neutral" | "curious" | "happy" | "excited" | "thoughtful" | "surprised"
  | "confused" | "concerned" | "sad" | "determined" | "playful" | "reassuring";

// Matches the 16 poses in `Zuri - Pose  Interaction Sheet.png`.
export type ZuriPose =
  | "default" | "greeting" | "listening" | "thinking" | "explaining" | "pointing"
  | "presenting" | "surprised" | "celebrating" | "encouraging" | "relaxed"
  | "device-interaction" | "symbol-interaction" | "walking" | "observing" | "welcoming";

export function ZuriCompanion({
  size = 140,
  expression = "neutral",
  pose = "default",
  className,
}: {
  size?: number;
  expression?: ZuriExpression;
  pose?: ZuriPose;
  className?: string;
}) {
  return (
    <div
      className={`zuvre-pending-slot flex flex-col items-center justify-center gap-1 ${className ?? ""}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Zuri — ${expression}, ${pose} (production asset pending)`}
      title="Zuri — canonical reference exists; production-ready transparent asset is pending"
    >
      <span className="zuvre-eyebrow text-center text-[0.6rem] leading-tight">
        Zuri
        <br />
        asset pending
      </span>
    </div>
  );
}
