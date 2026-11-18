import Image from "next/image";
import Link from "next/link";
import { EnterLink } from "./enter-link";
import { BRAND_ASSETS } from "@/content/brand-assets";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "#idea", label: "The idea" },
  { href: "#ecosystem", label: "Ecosystem" },
  { href: "#control", label: "Control" },
  { href: "#today", label: "Today" },
] as const;

/**
 * Brand lockup assembled from the canonical Logo Mark Symbol and Wordmark
 * (the "Logo Lockups" file is a composite sheet, so it is not used live).
 * In-page links are plain anchors to real section ids; account links go to
 * the real /login and /register routes. The theme toggle renders in the
 * header on wide screens and inside the menu on narrow ones.
 */
export function LandingHeader() {
  const { logoMarkSmall, wordmark } = BRAND_ASSETS;
  return (
    <header className="zl-header">
      <Link href="/" className="zl-brand" aria-label="ZUVRE — home">
        <Image src={logoMarkSmall.src} width={logoMarkSmall.width} height={logoMarkSmall.height} alt="" className="zl-brand-mark" priority />
        <Image src={wordmark.src} width={wordmark.width} height={wordmark.height} alt="" className="zl-brand-word" priority />
      </Link>

      <nav className="zl-nav" aria-label="Primary">
        {NAV.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </nav>

      <div className="zl-header-actions">
        <span className="zl-theme-header"><ThemeToggle /></span>
        <Link href="/login" className="zl-link zl-hide-sm">Sign in</Link>
        <EnterLink className="zuvre-button-primary zuvre-focus-ring" />
        <details className="zl-menu">
          <summary aria-label="Open navigation menu">Menu</summary>
          <div className="zl-menu-panel">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
            <Link href="/login">Sign in</Link>
            <EnterLink />
            <div className="zl-theme-menu"><ThemeToggle /></div>
          </div>
        </details>
      </div>
    </header>
  );
}
