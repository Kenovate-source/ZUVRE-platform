# ZUVRE Brand Book

**Name pronunciation:** Zoo-vray
**Personality:** warm, intelligent, sophisticated, welcoming, mysterious, calm,
futuristic, human, imaginative, premium.

## 1. The Core Idea: Two Vaults, Not Light/Dark

ZUVRE has no "light mode." Both of its visual worlds are deep, richly
hued, and built for long sessions — the difference between them is
**mood and material**, not brightness. Neither uses white, cream,
off-white, or beige as a background or surface color anywhere.

- **Obsidian** — volcanic-glass indigo-black, antique gold, garnet. The
  ecosystem at night: ink, brass instruments, candlelight.
- **Verdigris** — oxidised-copper deep teal-green, warm copper, amethyst.
  The ecosystem in a greenhouse at dusk: patina, glass, moss.

Think of them as two rooms in the same building — an alchemist's study
and its adjoining conservatory — rather than a feature toggle. Someone
should be able to see either one for five seconds and know it's ZUVRE:
the deep, saturated-but-never-neon backgrounds, the warm metallic accent,
the wide-tracked mono "eyebrow" labels, and the serif display type are
the recognizable signature, independent of which world they're in.

This replaces the earlier Solmere/Duskmere placeholder direction, which
used a cream daylight background — explicitly ruled out for the final
identity.

## 2. Why This Direction

Default "AI product" visual language (neon purple/violet on pure black,
glowing orbs, sci-fi sans type) has become generic to the point of being
invisible, and reads cold rather than warm and human. A conventional
light-mode-with-white-background also fights "mysterious, premium" — white
paper is clean and modern, but it's the visual language of productivity
software, not of an ecosystem meant to feel like a considered, ambitious,
slightly enigmatic place. Deep jewel tones with warm metallic accents
borrow from museum vitrines, bound ledgers, and old brass instruments —
premium reference points that are warm rather than sterile, and are hard
to confuse with a generic SaaS dashboard or a typical AI startup.

## 3. The Palette

### Obsidian

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

### Verdigris

| Token | Value | Use |
|---|---|---|
| background | `#101B18` | app background |
| surface | `#182620` | cards, panels |
| surfaceRaised | `#213229` | modals, popovers |
| border | `#2C4137` | decorative hairlines, card edges |
| borderInteractive | `#567364` | input/select outlines |
| textPrimary | `#E7E9DE` | body text |
| textSecondary | `#AEB6A6` | secondary text |
| accentPrimary | `#C97C4D` | warm copper — primary actions, focus |
| accentSecondary | `#8C6AA0` | amethyst — secondary emphasis |

Full token set including semantic colors (success/warning/danger/info),
shadows, and glow values: `packages/ui/src/tokens.ts` — that file is the
executable source of truth; this table is a summary of it, not the other
way around.

## 4. Accessibility — Actually Verified, Not Assumed

Every text/background pairing below was computed against the real WCAG 2.1
relative-luminance formula (not eyeballed), because "highly readable and
accessible" is a requirement, not a hope:

| Pairing | Obsidian | Verdigris | WCAG AA target |
|---|---|---|---|
| textPrimary on background | 14.95:1 | 14.35:1 | ≥4.5:1 (normal text) |
| textPrimary on surface | 13.64:1 | 12.80:1 | ≥4.5:1 |
| textSecondary on background | 8.57:1 | 8.42:1 | ≥4.5:1 |
| accentPrimary on background | 7.28:1 | 5.43:1 | ≥3:1 (large text/icons) |
| accentPrimaryContrast on accentPrimary (button text) | 7.17:1 | 5.80:1 | ≥4.5:1 |
| danger on background | 4.93:1 | 5.14:1 | ≥4.5:1 |
| borderInteractive on background | 3.29:1 | 3.38:1 | ≥3:1 (WCAG 1.4.11 non-text) |

All pairings clear their target with margin. `textMuted` (used only for
timestamps and decorative metadata, never as the sole carrier of meaning)
sits just under the normal-text threshold by design — it's intentionally
the quietest tone in the system and is never used for anything that must
be independently readable.

Two colors were iteratively adjusted specifically to hit these numbers:
`danger` was brightened from an earlier draft that measured 4.10:1/4.35:1
(below AA) to the values above, and a dedicated `borderInteractive` token
was introduced because the quieter decorative `border` token (1.4–1.6:1,
intentionally subtle for card hairlines) isn't sufficient contrast for a
form input's outline.

## 5. Typography

- **Display:** Fraunces — a warm, slightly editorial serif for headlines
  and considered moments; unchanged from the earlier direction because it
  was already correct for "warm, sophisticated, human."
- **Body:** Inter — proven legibility at UI sizes, gets out of the way.
- **Mono:** IBM Plex Mono, set at wide letter-spacing (`0.16em`) for
  uppercase "eyebrow" labels (section headers, IDs, the `ZUVRE — ZOO-VRAY`
  wordmark treatment). This wide-tracked mono-label pairing — an editorial
  serif headline above a ledger-style mono label — is the single most
  recognizable typographic signature in the system; see
  `.zuvre-eyebrow` in `apps/web/src/app/globals.css`.

## 6. Component Vocabulary — The Extensibility Contract

Every future capability (image generation, the game builder, the Owner
Control Center, third-party surfaces) should be built from this same,
already-implemented set of primitives rather than inventing new visual
treatments. They're real CSS classes in
`apps/web/src/app/globals.css`, demonstrated in `apps/web/src/app/page.tsx`:

| Class | Use |
|---|---|
| `.zuvre-card` | Default content container — surface color, hairline border, soft hue-tinted shadow, subtle inner top highlight (the "museum vitrine" detail) |
| `.zuvre-panel-raised` | Modals, popovers, elevated panels — uses `surfaceRaised` and a deeper shadow |
| `.zuvre-badge` / `.zuvre-badge-accent` | Status tags, labels, notification pills |
| `.zuvre-button-primary` / `.zuvre-button-secondary` | The two button treatments; nothing else should be invented for a third |
| `.zuvre-input` | Form inputs — uses `borderInteractive`, focuses to a soft accent glow (`--zuvre-glow-accent`), never a hard outline |
| `.zuvre-eyebrow` | Wide-tracked uppercase mono label |
| `.zuvre-focus-ring` | Keyboard-focus treatment — a soft glow, not a harsh browser-default outline, applied consistently |

A capability package that needs a visual treatment not covered here
should extend this vocabulary (propose a new class in this same file) —
not invent a one-off style scoped to itself. This is the mechanism that
keeps ZUVRE's UI coherent as the ecosystem grows past what any one team
can review line-by-line.

## 7. Elevation, Borders, and the "Vitrine" Detail

Shadows are always hue-tinted toward the active theme's background (never
flat black) and kept low-opacity — see `elevation` in
`packages/ui/src/tokens.ts`. Cards additionally carry a 1px inset
highlight along their top edge (`hairlineHighlight`), simulating soft
ambient light catching the top of a glass case — a small, consistent
detail meant to reinforce "museum vitrine" rather than "flat SaaS card."

Two border tokens exist deliberately: `border` (quiet, ~1.4–1.6:1
contrast, for decorative dividers and card edges where a loud line would
feel cheap) and `borderInteractive` (≥3:1, for anything the user is meant
to click into — inputs, selects). Don't use `border` for an input outline;
it will fail accessibility and look like a rendering bug, not a choice.

## 8. Motion

Short, purposeful transitions only (120/220/420ms — see `motion` in
`packages/ui/src/tokens.ts`), respecting `prefers-reduced-motion`
unconditionally. Hover and reveal moments use `easingReveal`
(`cubic-bezier(0.2, 0, 0, 1)`) — a slow-start, fast-settle curve meant to
feel like a considered mechanism (a hinge, a vault door) rather than a
bouncy pop. Nothing in ZUVRE should feel springy or playful in its motion.

## 9. Iconography

Rounded-corner, single-weight line icons — no gradient fills, no
skeuomorphism, no filled/solid icon sets (they read as heavier and more
generic-SaaS than ZUVRE's typographic weight elsewhere).

## 10. Plan Naming

Unchanged from the original direction and still consistent with this
identity: **Spark** (free), **Ember** (personal), **Atlas** (teams),
**Orbit** (organizations) — see `18-monetization-entitlements.md` (status:
outlined, see `docs/README.md`) for entitlement details. These names
don't collide with the theme names (Obsidian/Verdigris) or with each
other.

## 11. What Changed From the Placeholder Direction

For traceability: the original Phase 0 delivery shipped a placeholder
pairing (Solmere — cream/white daylight — and Duskmere — charcoal-plum
evening). That placeholder is fully replaced by this document and by
`packages/ui/src/tokens.ts` / `apps/web/src/app/globals.css`. No file in
the repository should still reference "Solmere" or "Duskmere" after this
change; if one is found, it's a stale reference to fix, not an
alternate valid theme.
