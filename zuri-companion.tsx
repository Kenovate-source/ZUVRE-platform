import Image from "next/image";
import { BRAND_ASSETS } from "@/content/brand-assets";

/**
 * Zuri — ZUVRE's canonical companion character.
 *
 * Only ONE production-usable Zuri asset exists: "Zuri - Master Character.png"
 * (opaque, dark background baked in — it has NO transparency and this
 * component never pretends otherwise). The expression and pose sheets are
 * composite reference sheets, not standalone assets, so any request for a
 * specific expression/pose other than the master still renders the explicit
 * "asset pending" slot instead of a fabricated or cropped stand-in.
 *
 * Presentation of the opaque master (feathered edge, depth) is done in CSS
 * by the caller via className; the source pixels are never altered.
 */

export type ZuriExpression =
  | "neutral" | "curious" | "happy" | "excited" | "thoughtful" | "surprised"
  | "confused" | "concerned" | "sad" | "determined" | "playful" | "reassuring";

export type ZuriPose =
  | "default" | "greeting" | "listening" | "thinking" | "explaining" | "pointing"
  | "presenting" | "surprised" | "celebrating" | "encouraging" | "relaxed"
  | "device-interaction" | "symbol-interaction" | "walking" | "observing" | "welcoming";

export function ZuriCompanion({
  expression = "neutral",
  pose = "default",
  className,
  sizes = "(min-width: 960px) 420px, 70vw",
  priority = false,
  decorative = false,
  size,
}: {
  expression?: ZuriExpression;
  pose?: ZuriPose;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** When the image sits inside a control that already has an accessible name. */
  decorative?: boolean;
  /** Fixed pixel width. Omit to let CSS size it. */
  size?: number;
}) {
  const isMaster = expression === "neutral" && pose === "default";

  if (!isMaster) {
    const box = size ?? 140;
    return (
      <div
        className={`zuvre-pending-slot flex flex-col items-center justify-center gap-1 ${className ?? ""}`}
        style={{ width: box, height: box }}
        role="img"
        aria-label={`Zuri — ${expression}, ${pose} (production asset pending)`}
        title="Zuri — only the master character artwork exists; this expression/pose needs production art"
      >
        <span className="zuvre-eyebrow text-center text-[0.6rem] leading-tight">
          Zuri
          <br />
          asset pending
        </span>
      </div>
    );
  }

  const { src, width, height } = BRAND_ASSETS.zuriMaster;
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={decorative ? "" : "Zuri, ZUVRE's companion — a small, curious creature with iridescent crystalline ears and a gold leaf crown"}
      className={className}
      sizes={sizes}
      priority={priority}
      style={size ? { width: size, height: "auto" } : undefined}
      draggable={false}
    />
  );
}
