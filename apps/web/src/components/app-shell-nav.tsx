import Link from "next/link";
import { ZuvreWordmark } from "@/components/zuvre-wordmark";
import { SignOutButton } from "@/components/sign-out-button";
import { IconHome, IconSettings } from "@/components/icons/core";

/**
 * The Phase 1 information architecture, per
 * ZUVRE_Phase1_Implementation_Blueprint.md §6: Home / Worlds / Chat /
 * Settings only. Deliberately not Create/Explore/Capabilities/Library —
 * with exactly one working capability (ai.chat), those would be
 * navigation leading nowhere real.
 *
 * Home and Settings reuse real icons already built in Phase 0. Worlds
 * and Chat stay text-only rather than being given a fabricated icon —
 * no capability icon genuinely represents either concept yet, and
 * inventing one here would contradict the "don't invent fake assets"
 * rule just as much as inventing a fake page would.
 */
export function AppShellNav() {
  return (
    <nav className="zuvre-app-nav">
      <div className="mb-6 px-2">
        <ZuvreWordmark />
      </div>

      <Link href="/app/home" className="zuvre-app-nav-link">
        <IconHome size={18} />
        Home
      </Link>
      <Link href="/app/worlds" className="zuvre-app-nav-link">
        Worlds
      </Link>
      <Link href="/app/chat" className="zuvre-app-nav-link">
        Chat
      </Link>
      <Link href="/app/settings" className="zuvre-app-nav-link">
        <IconSettings size={18} />
        Settings
      </Link>

      <div className="mt-auto pt-4">
        <SignOutButton />
      </div>
    </nav>
  );
}
