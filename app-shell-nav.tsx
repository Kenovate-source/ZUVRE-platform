import Link from "next/link";
import type { ReactNode } from "react";
import { ZuvreWordmark } from "@/components/zuvre-wordmark";
import { IconHome, IconSettings } from "@/components/icons/core";

/**
 * Phase 1 information architecture: Home / Worlds / Chat / Settings only —
 * with one working capability, anything more would be navigation to nowhere.
 * Rendered for both the real application (/app/*) and LOCAL DEMO MODE
 * (/demo/*); each passes its own sign-out control. Hrefs are literal route
 * strings so Next's typedRoutes can check them.
 */
const ROUTES = {
  app: [
    { href: "/app/home", label: "Home", icon: "home" },
    { href: "/app/worlds", label: "Worlds" },
    { href: "/app/chat", label: "Chat" },
    { href: "/app/settings", label: "Settings", icon: "settings" },
  ],
  demo: [
    { href: "/demo/home", label: "Home", icon: "home" },
    { href: "/demo/worlds", label: "Worlds" },
    { href: "/demo/chat", label: "Chat" },
    { href: "/demo/settings", label: "Settings", icon: "settings" },
  ],
} as const;

export function AppShellNav({ variant, signOut }: { variant: "app" | "demo"; signOut: ReactNode }) {
  return (
    <nav className="zuvre-app-nav" aria-label={variant === "demo" ? "Local demo" : "Application"}>
      <div className="zw-nav-brand"><ZuvreWordmark /></div>
      {variant === "demo" ? <p className="zw-nav-tag">Local demo</p> : null}
      {ROUTES[variant].map((item) => (
        <Link key={item.href} href={item.href} className="zuvre-app-nav-link">
          {"icon" in item && item.icon === "home" ? <IconHome size={18} /> : null}
          {"icon" in item && item.icon === "settings" ? <IconSettings size={18} /> : null}
          {!("icon" in item) ? <span className="zw-nav-ico" aria-hidden="true" /> : null}
          {item.label}
        </Link>
      ))}
      <div className="mt-auto pt-4">{signOut}</div>
    </nav>
  );
}
