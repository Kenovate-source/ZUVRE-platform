/**
 * ZUVRE Design Tokens — "Nocturne & Aubade"
 * Full rationale in docs/03-brand-book.md — this file is the executable
 * source of truth; the Brand Book should never drift from it.
 *
 * ZUVRE has no "light mode." Both worlds are deep and dark — the
 * difference between them is atmosphere and light, not brightness:
 *
 *   Nocturne — indigo-black night, antique gold, garnet.
 *              The ecosystem at rest: ink, brass instruments, candlelight.
 *   Aubade   — plum-brown dark, warm copper-rose, fading violet.
 *              The ecosystem waking: the hour before sunrise, still dark,
 *              already warming at the edges.
 *
 * "Aubade" is a dawn song — a piece written for the moment night gives
 * way to morning while it's still dark outside. Both names are ZUVRE's
 * own vocabulary, not generic material/color labels, and neither implies
 * a light or cream background — see docs/03-brand-book.md §1–2.
 *
 * Every color below was checked against WCAG AA contrast requirements
 * (see docs/03-brand-book.md §4 for the actual computed ratios).
 */

export type ZuvreThemeName = "nocturne" | "aubade";

export interface ZuvreTheme {
  name: ZuvreThemeName;
  label: string;
  tagline: string;
  colors: {
    background: string;
    surface: string;
    surfaceRaised: string;
    /** Subtle hairline for decorative dividers/card edges — not for interactive component boundaries. */
    border: string;
    /** Higher-contrast border for inputs, selects, and other interactive component outlines (WCAG 1.4.11, ≥3:1). */
    borderInteractive: string;
    textPrimary: string;
    textSecondary: string;
    /** Metadata/timestamps/decorative only — not guaranteed to hit AA on its own. */
    textMuted: string;
    accentPrimary: string;
    accentPrimaryContrast: string;
    accentSecondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
}

export const nocturne: ZuvreTheme = {
  name: "nocturne",
  label: "Nocturne",
  tagline: "Ink, brass, and candlelight.",
  colors: {
    background: "#14121B",
    surface: "#1E1B27",
    surfaceRaised: "#28232F",
    border: "#362F3D",
    borderInteractive: "#71627A",
    textPrimary: "#ECE6DD",
    textSecondary: "#B9AFA0",
    textMuted: "#8A8079",
    accentPrimary: "#C89B4A", // antique gold
    accentPrimaryContrast: "#1B1408",
    accentSecondary: "#B25A6B", // garnet
    success: "#4E9A72",
    warning: "#B98A3E",
    danger: "#C36B5C",
    info: "#6E8CB0",
  },
};

export const aubade: ZuvreTheme = {
  name: "aubade",
  label: "Aubade",
  tagline: "The dark hour before the ecosystem wakes.",
  colors: {
    background: "#1B1416",
    surface: "#241C1F",
    surfaceRaised: "#2F2429",
    border: "#3D2F34",
    borderInteractive: "#8C6E70",
    textPrimary: "#EDE3DE",
    textSecondary: "#C2AFA8",
    textMuted: "#8F7C77",
    accentPrimary: "#CB8259", // warm copper-rose, dawn light
    accentPrimaryContrast: "#1D1109",
    accentSecondary: "#8C6AA0", // fading-night violet
    success: "#6FA37E",
    warning: "#C99552",
    danger: "#C97462",
    info: "#7B93A8",
  },
};

export const zuvreThemes: Record<ZuvreThemeName, ZuvreTheme> = { nocturne, aubade };

/**
 * Typographic signature: a warm editorial serif for display moments, a
 * clean sans for reading, and a wide-tracked mono for "index card" /
 * ledger-style labels (eyebrows, IDs, technical surfaces) — the mono
 * treatment is a deliberate recognizability device, not just a code font.
 */
export const typography = {
  fontDisplay: '"Fraunces", ui-serif, Georgia, serif',
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"IBM Plex Mono", ui-monospace, monospace',
  scale: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.5rem",
  },
  /** Wide letter-spacing for mono "eyebrow" labels — part of the signature. */
  eyebrowTracking: "0.16em",
};

// Slightly tighter than a "friendly SaaS" rounding scale — considered and
// architectural rather than bubbly.
export const radii = { sm: "5px", md: "9px", lg: "13px", xl: "18px", pill: "999px" };

export const spacing = {
  1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px",
  6: "24px", 8: "32px", 10: "40px", 12: "48px", 16: "64px",
};

export const motion = {
  durationFast: "120ms",
  durationBase: "220ms",
  durationSlow: "420ms",
  easingStandard: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Slow-start, fast-settle — used for hover/reveal moments; meant to feel
   * like a considered mechanism (a vault door, a hinge), not a bouncy pop. */
  easingReveal: "cubic-bezier(0.2, 0, 0, 1)",
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
};

/**
 * Elevation and glow — both themes use soft, hue-tinted shadows (never flat
 * black) and a very low-opacity accent glow reserved for focus states and
 * a small number of premium "vitrine" moments. This is the one place a
 * gradient is sanctioned — never as a full-bleed background wash.
 */
export const elevation = {
  nocturne: {
    shadowCard: "0 1px 2px rgba(8, 6, 12, 0.4), 0 8px 24px -8px rgba(8, 6, 12, 0.55)",
    shadowModal: "0 24px 64px -16px rgba(6, 4, 10, 0.65)",
    glowAccent: "0 0 0 3px rgba(200, 155, 74, 0.18)",
    hairlineHighlight: "inset 0 1px 0 rgba(236, 230, 221, 0.06)",
  },
  aubade: {
    shadowCard: "0 1px 2px rgba(10, 6, 7, 0.4), 0 8px 24px -8px rgba(10, 6, 7, 0.55)",
    shadowModal: "0 24px 64px -16px rgba(8, 5, 6, 0.65)",
    glowAccent: "0 0 0 3px rgba(203, 130, 89, 0.18)",
    hairlineHighlight: "inset 0 1px 0 rgba(237, 227, 222, 0.06)",
  },
};
