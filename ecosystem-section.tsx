import Image from "next/image";
import { BRAND_ASSETS } from "@/content/brand-assets";
import { STATUS_DEFINITION } from "@/content/capabilities";
import { EcosystemJourney } from "./ecosystem-journey";
import { StatusChip } from "./status-chip";

export function EcosystemSection() {
  const { network } = BRAND_ASSETS;
  return (
    <section id="ecosystem" className="zl-section zl-section--tight" data-zl-section="ecosystem" aria-labelledby="ecosystem-title">
      {/* Approved "Connection Networks" artwork, as a slow-parallax backdrop */}
      <Image src={network.src} width={network.width} height={network.height} alt="" className="zl-decor zl-decor--network" aria-hidden="true" />
      <div className="zl-wrap">
        <div className="zl-eco-head">
          <div>
            <p className="zl-eyebrow">The living ecosystem</p>
            <h2 id="ecosystem-title" className="zl-h2">One connected system, not a shelf of tools.</h2>
          </div>
          <div className="zl-eco-intro">
            <p className="zl-lede">
              Everything ZUVRE is meant to do belongs to one of five families, all gathered around Worlds. Scroll
              through them — or select a node — to see what is real today and what is still ahead.
            </p>
            <p className="zl-legend">
              <span><StatusChip status="available" /> {STATUS_DEFINITION.available}</span>
              <span><StatusChip status="planned" /> {STATUS_DEFINITION.planned}</span>
            </p>
          </div>
        </div>
        <EcosystemJourney />
      </div>
    </section>
  );
}
