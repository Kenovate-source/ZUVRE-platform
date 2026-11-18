import Image from "next/image";
import Link from "next/link";
import { EnterLink } from "./enter-link";
import { ZuriPresence } from "@/components/zuri/zuri-presence";
import { BRAND_ASSETS } from "@/content/brand-assets";

export function InvitationSection() {
  const { logoPrimary, orbs } = BRAND_ASSETS;
  return (
    <section className="zl-section zl-invite" data-zl-section="invitation" aria-labelledby="invite-title">
      <Image src={orbs.src} width={orbs.width} height={orbs.height} alt="" className="zl-decor zl-decor--orbs" aria-hidden="true" />
      <div className="zl-invite-zuri"><ZuriPresence size="md" caption="Come in. I'll be here." /></div>
      <div className="zl-wrap zl-invite-inner">
        <div className="zl-invite-emblem-wrap">
          <Image src={logoPrimary.src} width={logoPrimary.width} height={logoPrimary.height} alt="" className="zl-invite-emblem" sizes="(min-width: 960px) 20rem, 62vw" />
        </div>
        <h2 id="invite-title" className="zl-h2">Come in. It&apos;s still becoming itself.</h2>
        <p className="zl-lede">
          Create an account, open a World, and start the conversation. What ZUVRE becomes will be shaped by the
          thoughts people bring to it.
        </p>
        <div className="zl-invite-cta">
          <EnterLink className="zuvre-button-primary zuvre-focus-ring" />
          <Link href="/login" className="zuvre-button-secondary zuvre-focus-ring">Sign in</Link>
        </div>
      </div>
    </section>
  );
}
