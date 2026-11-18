import Image from "next/image";
import { BRAND_ASSETS } from "@/content/brand-assets";

/**
 * Horizontal brand lockup assembled from the canonical Logo Mark Symbol and
 * Wordmark files (the "Logo Lockups" file is a composite sheet, so it is not
 * used live). Pronunciation ("Zoo-vray") stays out of the visible UI.
 */
export function ZuvreWordmark({ withTagline = false }: { withTagline?: boolean }) {
  const { logoMarkSmall, wordmark } = BRAND_ASSETS;
  return (
    <span className="zl-lockup" title="ZUVRE — pronounced Zoo-vray">
      <Image src={logoMarkSmall.src} width={logoMarkSmall.width} height={logoMarkSmall.height} alt="" className="zl-brand-mark" priority />
      <span className="zl-lockup-text">
        <Image src={wordmark.src} width={wordmark.width} height={wordmark.height} alt="ZUVRE" className="zl-brand-word" priority />
        {withTagline ? <span className="zl-lockup-tagline">Give Thought a World.</span> : null}
      </span>
    </span>
  );
}
