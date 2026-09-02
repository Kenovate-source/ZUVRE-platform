import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Real font loading (next/font self-hosts at build time — no runtime CDN
// dependency, no flash of unstyled/fallback text). Previously these three
// typefaces were only declared as CSS font-family strings with nothing
// actually loading them — see ZUVRE_Implementation_Readiness_and_Brand_Integration_Plan.md §A.
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZUVRE — Give Thought a World.",
  description: "A radically flexible AI-powered digital ecosystem.",
};

// Runs before hydration so a returning visitor's saved world (Nocturne or
// Aubade) applies on first paint instead of flashing the default — see
// apps/web/src/components/theme-toggle.tsx for where this is written.
const themeInitScript = `
  try {
    var stored = window.localStorage.getItem("zuvre-theme");
    if (stored === "nocturne" || stored === "aubade") {
      document.documentElement.setAttribute("data-zuvre-theme", stored);
    }
  } catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Defaults to Nocturne for first-time visitors. See docs/03-brand-book.md
  // for why ZUVRE has two dark-native worlds rather than a conventional
  // light/dark pair — Aubade is not a light mode.
  return (
    <html
      lang="en"
      data-zuvre-theme="nocturne"
      className={`${cormorantGaramond.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body min-h-screen antialiased">{children}</body>
    </html>
  );
}
