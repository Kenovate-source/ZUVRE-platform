import Link from "next/link";
import type { ReactNode } from "react";
import { LivingBackdrop } from "@/components/landing/living-backdrop";
import { ZuvreWordmark } from "@/components/zuvre-wordmark";
import { ZuriPresence } from "@/components/zuri/zuri-presence";
import { DEMO_MODE_ENABLED } from "@/lib/demo/config";

/**
 * The entrance doors (/login, /register) live in the same universe as the
 * landing page and the app. When LOCAL DEMO MODE is on, that is stated
 * plainly on the card — nobody should mistake it for real authentication.
 */
export function AuthScene({ title, intro, children, footer, caption }: { title: string; intro?: string; children: ReactNode; footer: ReactNode; caption: string }) {
  return (
    <div className="zl-root zw-auth">
      <LivingBackdrop quiet />
      <main className="zw-auth-main">
        <Link href="/" className="zw-auth-brand" aria-label="ZUVRE — back to the landing page"><ZuvreWordmark withTagline /></Link>
        <div className="zw-auth-grid">
          <div className="zw-auth-card zuvre-card">
            {DEMO_MODE_ENABLED ? (
              <p className="zw-demo-banner" role="note">
                <strong>Local demo mode.</strong> Accounts are stored only in this browser. This is not real authentication.
              </p>
            ) : null}
            <h1 className="zw-auth-title">{title}</h1>
            {intro ? <p className="zw-note">{intro}</p> : null}
            {children}
          </div>
          <div className="zw-auth-zuri"><ZuriPresence size="md" caption={caption} /></div>
        </div>
        <p className="zw-auth-footer">{footer}</p>
      </main>
    </div>
  );
}
