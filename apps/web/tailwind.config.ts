import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--zuvre-background)",
        surface: "var(--zuvre-surface)",
        "surface-raised": "var(--zuvre-surface-raised)",
        border: "var(--zuvre-border)",
        "border-interactive": "var(--zuvre-border-interactive)",
        "text-primary": "var(--zuvre-text-primary)",
        "text-secondary": "var(--zuvre-text-secondary)",
        "text-muted": "var(--zuvre-text-muted)",
        "accent-primary": "var(--zuvre-accent-primary)",
        "accent-primary-contrast": "var(--zuvre-accent-primary-contrast)",
        "accent-secondary": "var(--zuvre-accent-secondary)",
        success: "var(--zuvre-success)",
        warning: "var(--zuvre-warning)",
        danger: "var(--zuvre-danger)",
        info: "var(--zuvre-info)",
      },
      fontFamily: {
        // Reads the CSS variables next/font/google actually loads in
        // layout.tsx — Cormorant Garamond / Inter / IBM Plex Mono, per
        // the Brand Handoff Package. "ZUVRE Sans" is not canonical and is
        // not implemented — see the Canonical Asset & Brand Authority Map §5.
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { xl2: "18px" },
      boxShadow: {
        "zuvre-card": "var(--zuvre-shadow-card)",
        "zuvre-modal": "var(--zuvre-shadow-modal)",
        "zuvre-glow": "var(--zuvre-glow-accent)",
      },
    },
  },
  plugins: [],
} satisfies Config;
