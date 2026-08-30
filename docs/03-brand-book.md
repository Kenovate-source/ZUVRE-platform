# ZUVRE Brand Book

**Name pronunciation:** Zoo-vray — kept out of the visible interface (see
§12); available to anyone who looks for it via `title`/`aria-label`.
**Personality:** warm, intelligent, sophisticated, welcoming, mysterious,
calm, futuristic, human, imaginative, premium, alive, slightly magical.

## 1. The Core Idea: Nocturne & Aubade

ZUVRE has no "light mode." Both of its visual worlds are dark, richly
hued, and built for long sessions — the difference between them is
**atmosphere and light**, not brightness. Neither uses white, cream,
off-white, or beige as a background or surface color anywhere.

- **Nocturne** — indigo-black, antique gold, garnet. The ecosystem at
  rest: ink, brass instruments, candlelight.
- **Aubade** — plum-brown dark, warm copper-rose, fading violet. The
  ecosystem waking: the hour before sunrise — still dark, already
  warming at the edges.

An *aubade* is a piece of music or poetry written for that specific
in-between hour — night giving way to morning while it's still dark
outside. Both names are ZUVRE's own vocabulary, not generic
material/color labels (the project's first two naming attempts —
Solmere/Duskmere, then Obsidian/Verdigris — were rejected for exactly
that reason: too close to ordinary theme-naming conventions, or too
literally tied to materials rather than to ZUVRE's own identity). Neither
name implies a light or cream background.

Think of Nocturne and Aubade as two hours in the same day, not two
products. Someone should recognize either one as ZUVRE within five
seconds: the deep, saturated-but-never-neon backgrounds, the warm
metallic accent, the wide-tracked mono "eyebrow" labels, the serif
display type, and the mark's open-ring-and-spark motif are the signature,
independent of which hour it is.

## 2. Why This Direction

Default "AI product" visual language (neon purple/violet on pure black,
glowing orbs, sci-fi sans type) has become generic to the point of being
invisible, and reads cold rather than warm and human. A generic
cyberpunk treatment was equally ruled out — it trades "mysterious" for
"loud," which isn't the brand. Deep jewel tones with warm metallic
accents borrow from museum vitrines, bound ledgers, and old brass
instruments — premium reference points that are warm rather than
sterile, alive rather than synthetic, and hard to confuse with a generic
SaaS dashboard or a typical AI startup.

## 3. The Palette

### Nocturne

| Token | Value | Use |
|---|---|---|
| background | `#14121B` | app background |
| surface | `#1E1B27` | cards, panels |
| surfaceRaised | `#28232F` | modals, popovers |
| border | `#362F3D` | decorative hairlines, card edges |
| borderInteractive | `#71627A` | input/select outlines |
| textPrimary | `#ECE6DD` | body text |
| textSecondary | `#B9AFA0` | secondary text |
| accentPrimary | `#C89B4A` | antique gold — primary actions, focus |
| accentSecondary | `#B25A6B` | garnet — secondary emphasis |

### Aubade

| Token | Value | Use |
|---|---|---|
| background | `#1B1416` | app background |
| surface | `#241C1F` | cards, panels |
| surfaceRaised | `#2F2429` | modals, popovers |
| border | `#3D2F34` | decorative hairlines, card edges |
| borderInteractive | `#8C6E70` | input/select outlines |
| textPrimary | `#EDE3DE` | body text |
| textSecondary | `#C2AFA8` | secondary text |
| accentPrimary | `#CB8259` | warm copper-rose — primary actions, focus |
| accentSecondary | `#8C6AA0` | fading-night violet — secondary emphasis |

Full token set including semantic colors (success/warning/danger/info),
shadows, and glow values: `packages/ui/src/tokens.ts` — that file is the
executable source of truth; this table summarizes it, not the reverse.

## 4. Accessibility — Actually Verified, Not Assumed

Every text/background pairing below was computed against the real WCAG
2.1 relative-luminance formula, because "highly readable and accessible"
is a requirement, not a hope:

| Pairing | Nocturne | Aubade | WCAG AA target |
|---|---|---|---|
| textPrimary on background | 14.95:1 | 14.37:1 | ≥4.5:1 (normal text) |
| textPrimary on surface | 13.64:1 | 13.20:1 | ≥4.5:1 |
| textSecondary on background | 8.57:1 | 8.63:1 | ≥4.5:1 |
| accentPrimary on background | 7.28:1 | 5.94:1 | ≥3:1 (large text/icons) |
| accentPrimaryContrast on accentPrimary (button text) | 7.17:1 | 6.05:1 | ≥4.5:1 |
| danger on background | 4.93:1 | 5.32:1 | ≥4.5:1 |
| borderInteractive on background | 3.29:1 | 3.95:1 | ≥3:1 (WCAG 1.4.11 non-text) |

All pairings clear their target with margin. `textMuted` (used only for
timestamps and decorative metadata, never as the sole carrier of meaning)
sits just under the normal-text threshold by design — the quietest tone
in the system, never used for anything that must be independently
readable on its own.

When Aubade's palette was rehued away from an earlier teal-green draft
(kept from the rejected "Verdigris" naming, which didn't thematically fit
a piece written for dawn) toward the current plum-brown/copper-rose, the
new values were recomputed from scratch rather than assumed to still
pass — they do, with the numbers above.

## 5. Typography

- **Display:** Fraunces — a warm, slightly editorial serif for headlines
  and considered moments.
- **Body:** Inter — proven legibility at UI sizes, gets out of the way.
- **Mono:** IBM Plex Mono, set at wide letter-spacing (`0.16em`) for
  uppercase "eyebrow" labels (section headers, the wordmark's tagline).
  This wide-tracked mono-label pairing — an editorial serif headline
  above a ledger-style mono label — is the single most recognizable
  typographic signature in the system; see `.zuvre-eyebrow` in
  `apps/web/src/app/globals.css`.

## 6. Component Vocabulary — The Extensibility Contract

Every future capability (image generation, the game builder, the Owner
Control Center, third-party surfaces) should be built from this same,
already-implemented set of primitives rather than inventing new visual
treatments. They're real CSS classes in
`apps/web/src/app/globals.css`, demonstrated in `apps/web/src/app/page.tsx`:

| Class | Use |
|---|---|
| `.zuvre-card` | Default content container — surface color, hairline border, soft hue-tinted shadow, subtle inner top highlight |
| `.zuvre-panel-raised` | Modals, popovers, elevated panels |
| `.zuvre-badge` / `.zuvre-badge-accent` | Status tags, labels, notification pills |
| `.zuvre-button-primary` / `.zuvre-button-secondary` | The two button treatments; nothing else should be invented for a third |
| `.zuvre-input` | Form inputs — uses `borderInteractive`, focuses to a soft accent glow, never a hard outline |
| `.zuvre-eyebrow` | Wide-tracked uppercase mono label |
| `.zuvre-focus-ring` | Keyboard-focus treatment — a soft glow, not a harsh browser-default outline |
| `.zuvre-atmosphere` / `.zuvre-bloom` | Soft, low-opacity radial glows for hero/atmospheric moments — see §14 |
| `.zuvre-mascot-breathe` / `.zuvre-mascot-core` | The companion's idle motion — see §13 |
| `.zuvre-constellation-line` / `.zuvre-constellation-node` | The radial ecosystem map — see §14 |

A capability package that needs a visual treatment not covered here
should extend this vocabulary (propose a new class in this same file) —
not invent a one-off style scoped to itself.

## 7. Elevation, Borders, and the "Vitrine" Detail

Shadows are always hue-tinted toward the active theme's background (never
flat black) and kept low-opacity — see `elevation` in
`packages/ui/src/tokens.ts`. Cards additionally carry a 1px inset
highlight along their top edge, simulating soft ambient light catching
the top of a glass case.

Two border tokens exist deliberately: `border` (quiet, ~1.4–1.6:1
contrast, for decorative dividers and card edges) and `borderInteractive`
(≥3:1, for anything the user is meant to click into — inputs, selects).

## 8. Motion

Short, purposeful transitions only (120/220/420ms — see `motion` in
`packages/ui/src/tokens.ts`), respecting `prefers-reduced-motion`
unconditionally. Hover and reveal moments use `easingReveal`
(`cubic-bezier(0.2, 0, 0, 1)`) — a slow-start, fast-settle curve meant to
feel like a considered mechanism rather than a bouncy pop. The companion's
idle breathing and core flicker (§13) are the only continuous/ambient
animations in the system, are both slow (3.4–5.2s cycles) and low-
amplitude, and both disable entirely under `prefers-reduced-motion`.

## 9. Iconography

Rounded-corner, single-weight line icons — no gradient fills, no
skeuomorphism, no filled/solid icon sets.

## 10. Plan Naming

Unchanged and still consistent with this identity: **Spark** (free),
**Ember** (personal), **Atlas** (teams), **Orbit** (organizations) — see
`18-monetization-entitlements.md` (outlined, see `docs/README.md`).
None of these collide with Nocturne/Aubade or with each other.

## 11. What Changed From Earlier Directions

For traceability: Phase 0 shipped a cream/white daylight placeholder
(Solmere) paired with a charcoal-plum evening theme (Duskmere), then a
material-named pair (Obsidian/Verdigris) that fixed the white-background
problem but still read as generic color/theme naming rather than ZUVRE's
own vocabulary. This document and `packages/ui/src/tokens.ts` /
`apps/web/src/app/globals.css` are the final replacement: **Nocturne**
and **Aubade**. No file in the repository should reference "Solmere,"
"Duskmere," "Obsidian," or "Verdigris" after this change except this
section's own historical note.

## 12. The Mark

The ZUVRE mark (`apps/web/src/components/zuvre-mark.tsx`) is an open ring
with a spark riding its one open edge, plus a smaller inner arc
suggesting depth — orbits within orbits, the way capabilities will
eventually nest and multiply. The ring is never closed, because ZUVRE
isn't: there's always room for one more capability, one more agent, one
more thing orbiting the center.

The wordmark lockup (`zuvre-wordmark.tsx`) pairs the mark with "ZUVRE" set
in Fraunces. The pronunciation ("Zoo-vray") is deliberately **not**
rendered as visible text anywhere in the interface — it's available via
`title="ZUVRE — pronounced Zoo-vray"` for anyone curious or using
assistive technology, but it's not a permanent fixture of the UI the way
it was in the Phase 0 foundation shell's "ZUVRE — ZOO-VRAY" header.

**Honesty note:** this is a real, rendered, working mark — not a
placeholder box — but it's a v0.1 foundation built by an engineer with
precise SVG geometry, not a professional identity designer's illustration
pass. It's built to be structurally reusable (single component, theme-
driven via CSS variables, no hardcoded colors) specifically so a real
designer can refine or replace its exact curves later without anything
that renders `<ZuvreMark />` needing to change. See `STATUS.md`.

## 13. The Companion

`apps/web/src/components/zuvre-companion.tsx` is not a mascot in the
theme-park sense — a small, quiet presence meant to eventually appear
anywhere in ZUVRE a guide is useful (onboarding, an empty state, ZUVRE
AI's own conversational surface), not permanently fixed to one hero
section. Its glowing core uses the exact same "spark" motif as the mark's
open-ring spark, so the two read as one family: the mark is the
ecosystem's symbol, the companion is something that lives inside it.

**Extensibility contract:** the component takes a `mood` prop
(`ZuvreCompanionMood`). Only `"idle"` is implemented today — a soft
breathing motion (`.zuvre-mascot-breathe`) and a slow core flicker
(`.zuvre-mascot-core`), both disabled under `prefers-reduced-motion`. Any
future surface that wants the companion to react (greeting, thinking,
celebrating) should add a case to this prop's type and this component's
render logic — never fork a second mascot component or hardcode a
one-off version elsewhere.

**Honesty note, same as §12:** this is real and working, not a
placeholder, but its exact silhouette is a v0.1 engineering pass, not
final illustrated artwork. A name for the companion hasn't been
established in any prior discussion — none is invented here.

## 14. The Landing Experience

The Phase 0 landing page (`apps/web/src/app/page.tsx`) is built to feel
like entering a place, not reading a product page:

- The hero pairs the companion with soft, low-opacity radial "blooms"
  (`.zuvre-atmosphere` / `.zuvre-bloom`) instead of a flat background —
  atmosphere without a heavy asset or animation library.
- "The Ecosystem" is a radial constellation
  (`ecosystem-constellation.tsx`) — ZUVRE AI at the center, everything
  else orbiting it — rather than a card grid. This is the visual answer
  to "communicate that ZUVRE is a living ecosystem rather than a
  collection of tools."
- Capabilities are a flowing list, not a wall of identical tiles, and
  every capability that isn't live yet is labeled **Arriving**, never
  presented as functional. One footer line makes the same point in
  prose, so honesty doesn't depend on the reader parsing six repeated
  badges.
- Copy avoids corporate landing-page register throughout ("Something is
  waking up inside ZUVRE," "Come in. It's still becoming itself.")
  without overclaiming what's actually built.

No new dependency was added to build any of this — the blooms,
constellation lines, and companion motion are all plain CSS/SVG.

## 15. Extending This System

Anything new — a future capability's UI, an Owner Control Center screen,
a marketing page — should start from §6's component vocabulary and the
tokens in `packages/ui/src/tokens.ts`, not from a fresh design. If a
genuinely new pattern is needed (the constellation visual is itself an
example: it isn't in §6's original card/button/badge set, but it followed
the same token discipline), add it here and to `globals.css` rather than
letting it live as a one-off.
