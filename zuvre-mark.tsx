import Image from "next/image";
import { BRAND_ASSETS } from "@/content/brand-assets";

/**
 * The ZUVRE symbol — the canonical "ZUVRE Logo Mark Symbol" artwork.
 *
 * Phase 0 shipped a hand-redrawn SVG approximation here. That has been
 * REMOVED: the real, supplied logo exists, and redrawing it is exactly what
 * the brand rules forbid. This renders the canonical raster (a cropped,
 * optimized export — never stretched: only the height is set).
 * `size` is the rendered height in pixels.
 */
export function ZuvreMark({ size = 32, className }: { size?: number; className?: string }) {
  const { src, width, height } = BRAND_ASSETS.logoMarkSmall;
  return <Image src={src} width={width} height={height} alt="ZUVRE" className={className} style={{ height: size, width: "auto" }} priority />;
}
