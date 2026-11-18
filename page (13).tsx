import { AtmosphereController } from "@/components/landing/atmosphere-controller";
import { LivingBackdrop } from "@/components/landing/living-backdrop";
import { LandingHeader } from "@/components/landing/landing-header";
import { ArrivalSection } from "@/components/landing/arrival-section";
import { IdeaSection } from "@/components/landing/idea-section";
import { EcosystemSection } from "@/components/landing/ecosystem-section";
import { ControlSection } from "@/components/landing/control-section";
import { TodaySection } from "@/components/landing/today-section";
import { InvitationSection } from "@/components/landing/invitation-section";
import { LandingFooter } from "@/components/landing/landing-footer";

/**
 * The ZUVRE landing experience — one continuous scroll through a single
 * living environment, in the order set out in the brief:
 *   arrival → the idea → the living ecosystem (capabilities) →
 *   agency & control → what you can use today → the invitation.
 * Server component: only the pieces that need browser APIs (backdrop
 * canvas, atmosphere/scroll controller, arrival stage, thought path,
 * ecosystem explorer, reveal) are client components.
 */
export default function LandingPage() {
  return (
    <div className="zl-root">
      <LivingBackdrop />
      <AtmosphereController />
      <a className="zl-skip" href="#main">Skip to content</a>
      <LandingHeader />
      <main id="main">
        <ArrivalSection />
        <IdeaSection />
        <EcosystemSection />
        <ControlSection />
        <TodaySection />
        <InvitationSection />
      </main>
      <LandingFooter />
    </div>
  );
}
