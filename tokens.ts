/**
 * ZUVRE Design Tokens
 *
 * Source of truth for Tier 1 values: the ZUVRE Final Canonical Asset &
 * Brand Authority Map + Brand Handoff Package (2026-09-01). This file
 * replaces an earlier, self-authored placeholder palette that predated
 * that package — see git history / STATUS.md for that lineage.
 *
 * ZUVRE has no "light mode." Both worlds are dark:
 *   Nocturne — the primary world. Signature accent: ZUVRE Gold.
 *   Aubade   — the alternate world. NOT a light mode — a dark, organic
 *              moss/patina world. Signature accents: Patina and Moss.
 *
 * IMPORTANT INTERPRETIVE NOTE (flagged, not silently assumed): the
 * governing docs specify exactly one neutral background ramp (Nocturne
 * 950/900/850/800) and no separate Aubade neutral ramp. This file treats
 * that ramp as shared infrastructure for both worlds, with Patina/Moss/
 * Glass as Aubade's differentiating accent layer and Gold/Glass as
 * Nocturne's. If a distinct Aubade neutral ramp exists or is intended,
 * this needs correcting — see ZUVRE_Implementation_Readiness_and_Brand_Integration_Plan.md.
 *
 * textSecondary, textMuted, borderInteractive, and the four semantic
 * colors (success/warning/danger/info) have no canonical value in the
 * Brand Book — it defines identity, not a full UI token system. Each is
 * derived mathematically from the canonical palette below (WCAG-checked,
 * not eyeballed) and is clearly NOT a brand-canonical value.
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
    /** Higher-contrast border for inputs, selects, and other interactive component outlines (WCAG 1.4.11, ≥3:1). Derived, not canonical. */
    borderInteractive: string;
    textPrimary: string;
    /** Derived, not canonical. */
    textSecondary: string;
    /** Metadata/timestamps/decorative only — derived, not guaranteed AA on its own. */
    textMuted: string;
    accentPrimary: string;
    accentPrimaryContrast: string;
    accentSecondary: string;
    /** Derived, not canonical. Shared across both worlds (semantic meaning shouldn't shift with theme). */
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
}

// ---------------------------------------------------------------------------
// Tier 1 — canonical, verbatim from the Brand Handoff Package. Do not alter
// without an explicit brand-owner decision.
// ---------------------------------------------------------------------------
const NOCTURNE_950 = "#0E0C14"; // background
const NOCTURNE_900 = "#121019"; // surface
const NOCTURNE_850 = "#181520"; // surfaceRaised
const NOCTURNE_800 = "#211D29"; // border (decorative)
const ZUVRE_GOLD = "#D6A64A";
const IVORY_TEXT = "#F2EEE5";
const PATINA = "#5E8178";
const GLASS = "#8DAFA4";
const MOSS = "#687552";

// ---------------------------------------------------------------------------
// Derived (not canonical) — see file header note. Computed via WCAG relative
// luminance, not chosen by eye.
// ---------------------------------------------------------------------------
const TEXT_SECONDARY = "#A9A6A2"; // Ivory mixed 32% toward bg — 8.01:1 on 950
const TEXT_MUTED = "#757272"; // Ivory mixed 55% toward bg — 4.07:1 on 950 (decorative tier)
const BORDER_INTERACTIVE = "#656263"; // 3.22:1 on 950 — clears WCAG 1.4.11
const SUCCESS = "#6FA88B"; // brightened Patina family — 7.07:1
const WARNING = "#CC8A3E"; // shifted orange, distinct from Gold — 6.73:1
const DANGER = "#C06B57"; // muted terracotta — 5.07:1
const DARK_ON_ACCENT = NOCTURNE_950; // button-label color on both Gold and Patina — 8.70:1 / 4.52:1 respectively

export const nocturne: ZuvreTheme = {
  name: "nocturne",
  label: "Nocturne",
  tagline: "Give Thought a World.",
  colors: {
    background: NOCTURNE_950,
    surface: NOCTURNE_900,
    surfaceRaised: NOCTURNE_850,
    border: NOCTURNE_800,
    borderInteractive: BORDER_INTERACTIVE,
    textPrimary: IVORY_TEXT,
    textSecondary: TEXT_SECONDARY,
    textMuted: TEXT_MUTED,
    accentPrimary: ZUVRE_GOLD,
    accentPrimaryContrast: DARK_ON_ACCENT,
    accentSecondary: GLASS,
    success: SUCCESS,
    warning: WARNING,
    danger: DANGER,
    info: GLASS,
  },
};

export const aubade: ZuvreTheme = {
  name: "aubade",
  label: "Aubade",
  tagline: "Give Thought a World.",
  colors: {
    background: NOCTURNE_950,
    surface: NOCTURNE_900,
    surfaceRaised: NOCTURNE_850,
    border: NOCTURNE_800,
    borderInteractive: BORDER_INTERACTIVE,
    textPrimary: IVORY_TEXT,
    textSecondary: TEXT_SECONDARY,
    textMuted: TEXT_MUTED,
    accentPrimary: PATINA,
    accentPrimaryContrast: DARK_ON_ACCENT,
    accentSecondary: MOSS,
    success: SUCCESS,
    warning: WARNING,
    danger: DANGER,
    info: GLASS,
  },
};

export const zuvreThemes: Record<ZuvreThemeName, ZuvreTheme> = { nocturne, aubade };

/**
 * Typography — locked per the Brand Handoff Package. "ZUVRE Sans" is not
 * canonical (appeared only in a composite presentation artifact) and must
 * not be used — see the Canonical Asset & Brand Authority Map §5.
 */
export const typography = {
  fontDisplay: '"Cormorant Garamond", ui-serif, Georgia, serif',
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
  eyebrowTracking: "0.16em",
};

// Not specified by the Brand Handoff Package (UI-engineering scale, not
// brand identity) — carried forward unchanged from the prior foundation.
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
  easingReveal: "cubic-bezier(0.2, 0, 0, 1)",
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
};

/** Shadows re-derived from the canonical Nocturne 950 background hex. */
export const elevation = {
  nocturne: {
    shadowCard: "0 1px 2px rgba(6, 5, 9, 0.4), 0 8px 24px -8px rgba(6, 5, 9, 0.55)",
    shadowModal: "0 24px 64px -16px rgba(4, 3, 7, 0.65)",
    glowAccent: "0 0 0 3px rgba(214, 166, 74, 0.18)", // Gold
    hairlineHighlight: "inset 0 1px 0 rgba(242, 238, 229, 0.06)", // Ivory
  },
  aubade: {
    shadowCard: "0 1px 2px rgba(6, 5, 9, 0.4), 0 8px 24px -8px rgba(6, 5, 9, 0.55)",
    shadowModal: "0 24px 64px -16px rgba(4, 3, 7, 0.65)",
    glowAccent: "0 0 0 3px rgba(94, 129, 120, 0.22)", // Patina
    hairlineHighlight: "inset 0 1px 0 rgba(242, 238, 229, 0.06)",
  },
};
