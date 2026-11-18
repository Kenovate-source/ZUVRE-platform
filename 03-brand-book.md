# ZUVRE Brand Book (Repository Reference)

**Governing authority:** the ZUVRE Brand Handoff Package and the Final
Canonical Asset & Brand Authority Map (external documents, brand-owner
maintained) are authoritative. This file is a repository-context summary
kept in sync with them — if the two ever disagree, the external documents
win. This file previously documented an earlier, self-authored
placeholder identity (different hex values, Fraunces typeface, a
different logo/mascot) built before the canonical package existed; that
version is fully superseded as of this revision.

## 1. Brand

**ZUVRE.** Tagline: **"Give Thought a World."** Transformation
philosophy: Thought → Movement → Form → Creation → World.

Personality: Intelligent, Curious, Warm, Sophisticated, Creative,
Purposeful, Expansive — plus Premium, Spacious, Alive, slightly
otherworldly, human-centered.

## 2. Visual Worlds

- **Nocturne** — primary world. Signature accent: ZUVRE Gold.
- **Aubade** — alternate world. **Not a light mode.** A dark, organic
  moss/patina world. Signature accents: Patina and Moss.

## 3. Color Tokens

Tier 1 (canonical, locked):

| Token | Hex |
|---|---|
| Nocturne 950 (background) | `#0E0C14` |
| Nocturne 900 (surface) | `#121019` |
| Nocturne 850 (surfaceRaised) | `#181520` |
| Nocturne 800 (border) | `#211D29` |
| ZUVRE Gold | `#D6A64A` |
| Ivory Text | `#F2EEE5` |
| Patina | `#5E8178` |
| Glass | `#8DAFA4` |
| Moss | `#687552` |

**Interpretive note (flagged, not silently assumed):** the governing docs
specify one neutral ramp (Nocturne 950–800) and no separate Aubade ramp.
This repository treats that ramp as shared between both worlds, with
Patina/Moss/Glass differentiating Aubade and Gold/Glass differentiating
Nocturne. See `packages/ui/src/tokens.ts` header and
`ZUVRE_Implementation_Readiness_and_Brand_Integration_Plan.md` for the
full reasoning — this is open to correction.

`textSecondary`, `textMuted`, `borderInteractive`, and the semantic
colors (success/warning/danger/info) are **not** canonical brand values —
the Brand Book defines identity, not a full UI token system. They're
derived mathematically from the Tier 1 palette (WCAG-checked; see
`packages/ui/src/tokens.ts` for the exact derivation and ratios).

Tier 2 atmospheric colors (broader emeralds/teals/blues/purples visible
in the approved atmospheric reference sheets) are permitted only for
backgrounds, environments, lighting, decorative elements, motion, and
spatial depth — never for core UI/buttons/text.

## 4. Typography

- **Cormorant Garamond** — editorial/display.
- **Inter** — UI, product, body.
- **IBM Plex Mono** — technical/system/metadata.

Loaded via `next/font/google` in `apps/web/src/app/layout.tsx` (real
font loading — previously these were declared as CSS strings with
nothing actually loading them). "ZUVRE Sans" is not canonical and is not
implemented — it appeared only in a composite presentation artifact.

## 5. Logo

Canonical authority: the six dedicated files under `LOGO SYSTEM/` in the
approved visual assets (Primary Logo, Logo Mark/Symbol, Wordmark, Logo
Lockups, Monochrome Variants, Small-Size/Favicon Marks). `zuvre-mark.tsx`
is a **deliberately simplified production reconstruction** of the
monochrome variant specifically (the one source classified as faithfully
vector-viable) — a ring, a bold Z glyph, and an accent dot. It omits a
secondary interweaving curved-stroke detail present in the canonical
monochrome mark, because that detail couldn't be verified precisely
enough to reconstruct faithfully without a rendering tool to check the
result. The full ornate gold/glass chrome version is not attempted — see
`ZUVRE_Production_Conversion_Plan_and_Asset_Manifest.md` for why (it
requires a genuine redesign-to-spec pass, not a mechanical conversion).

Pronunciation ("Zoo-vray") stays out of visible UI — available via
`title`/`aria-label` only, per `zuvre-wordmark.tsx`.

## 6. Zuri

ZUVRE's canonical companion character. No production-ready transparent
asset exists yet. `zuri-companion.tsx` establishes the integration
contract (size/expression/pose props matching the canonical 12
expressions and 16 poses) but deliberately renders an unmistakable
"asset pending" state rather than a fabricated stand-in — see that
file's header comment for the full reasoning. Do not redesign Zuri or
substitute another mascot.

## 7. Icon System

Three canonical families: Core (`Core ZUVRE Icon Set.png`), Capability
(`Capability Icons 1/2.png`), Navigation/UI (`Navigation UI Icon Set
2.png` only — Set 1 is archived, non-governing). Implemented as
individual React SVG components under
`apps/web/src/components/icons/{core,capability,navigation-ui}/`, a
curated subset per family (not the full library — implementation-driven,
not bulk conversion; see `ZUVRE_Implementation_Readiness_and_Brand_Integration_Plan.md`).

**AI Agent has no icon.** Both the original robot-head glyph and a
proposed "Orbit & Execute" replacement were rejected. The capability
icon index deliberately does not export an "AI Agent" icon — see that
file's header comment. Do not add one without explicit brand-owner
approval.

## 8. Component Vocabulary

Unchanged mechanism from the prior foundation — `.zuvre-card`,
`.zuvre-panel-raised`, `.zuvre-badge`/`.zuvre-badge-accent`,
`.zuvre-button-primary`/`.zuvre-button-secondary`, `.zuvre-input`,
`.zuvre-eyebrow`, `.zuvre-focus-ring` in `apps/web/src/app/globals.css`,
now carrying canonical color values. One addition:
`.zuvre-pending-slot` — a visually unmistakable dashed-border state for
any canonical element (like Zuri) that doesn't have a production asset
yet, so a placeholder can never be mistaken for finished content.

## 9. Motion

See `docs/10-motion-system.md` for all 8 canonical sequences (purpose,
trigger, duration, easing, states, reduced-motion behavior,
implementation format). Only "UI/Interface Transitions" is actually
implemented today; the rest are specifications, built only when a real
surface needs them.

## 10. Atmospheric System

`.zuvre-atmosphere`/`.zuvre-bloom` in `globals.css` — re-hued to
canonical Gold/Glass (Nocturne) and Patina/Moss (Aubade), mechanism
unchanged from the prior foundation.

## 11. Plan Naming

Unchanged: **Spark** (free), **Ember** (personal), **Atlas** (teams),
**Orbit** (organizations) — no collision with Nocturne/Aubade or any
canonical brand element.
