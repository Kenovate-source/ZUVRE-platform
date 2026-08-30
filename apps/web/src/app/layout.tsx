import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZUVRE",
  description: "A radically flexible AI-powered digital ecosystem.",
};

// Runs before hydration so a returning visitor's saved theme (Nocturne or
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
  // for why ZUVRE has two rich, dark-native worlds rather than a
  // conventional light/dark pair.
  return (
    <html lang="en" data-zuvre-theme="nocturne">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body min-h-screen antialiased">{children}</body>
    </html>
  );
}
