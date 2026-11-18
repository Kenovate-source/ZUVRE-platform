# 13 — The landing experience

## Structure (one continuous scroll through one living environment)
1. **Arrival** — real logo emblem, Zuri, flow-path art and orbit rings in layered depth; tagline as the H1; honest "Live today" status.
2. **The idea** — *Thought → Movement → Form → Creation → World* as a scroll-filled path; every stage states whether it exists today.
3. **The living ecosystem** — a **pinned journey**: the constellation stays in view (`position: sticky`) while chapters scroll; the
   active node always equals the chapter being read; selecting a node scrolls to its chapter; Zuri guides.
4. **Agency & control** — real, evidenced protections vs. planned ones, each labelled.
5. **Today** — the real path through the product, with real routes.
6. **Invitation** — emblem, luminous orbs, Zuri, and the way in (or "Continue in the demo").

The page is a server component; only the pieces needing browser APIs are client components. **No scroll hijacking**, no forced intro.

## What is driven by what (nothing is timed or random)
- **Scroll** → which environment layer is visible (`data-zl-atmosphere`), the hero's drift/fade, the idea-path fill, the active journey chapter.
- **Pointer** (fine pointers, never under reduced motion) → hero layer parallax; Zuri's turn/glow.
- **Selection** (click/tap/Enter/Space) → journey jumps, thought-path detail, Zuri's note.
- **Hover** only *previews* a connection; it never changes content (so touch and keyboard reach everything).

## Assets (from `ZUVRE_Final_Visual_Assets.zip`) — used / not used
| Supplied file | Use |
|---|---|
| `ZUVRE Primary Logo.png` (RGBA) | hero + invitation emblem (cropped to bounds, WebP) |
| `ZUVRE Logo Mark  Symbol.png` (RGBA) | header, auth, app nav, constellation hub; **favicon / apple icon** derived from it |
| `ZUVRE Wordmark.png` (RGBA) | header, auth, app nav lockup |
| `Zuri - Master Character.png` (opaque) | hero, journey guide, invitation, auth, onboarding, empty states |
| `ZUVRE Background  Texture Elements.png` (reference sheet) | 4 approved panels cropped → soft environment layers (Deep Atmospheric, Dark Mode Environments, Spatial Depth, Gradient Fields) |
| `ZUVRE Decorative  Atmospheric Elements.png` (reference sheet) | 4 panels cropped + luminance-to-alpha → flow paths, orbital core, connection network, luminous orbs |
| Logo Lockups / Monochrome Variants / Small-Size Favicon Marks / Complete Logo Asset Sheets | **not used live** (composite sheets). The lockup is assembled from the mark + wordmark; icons derived from the mark |
| Core / Capability / Navigation icon sheets | **not used as images.** Icons are SVG components built earlier from the documented geometry (8 core, 6 capability, 6 nav); the AI Agent icon stays excluded (both proposals rejected) |
| Zuri Expression / Pose / Companion / Complete sheets | **not used** (composites; only the master is a standalone asset) |
| `MOTION REFERENCE FRAME SYSTEM.png`, `COMPLETE VISUAL ASSET SHEET.png`, Brand Book PDF, Production Spec | reference only |
| Light Mode Environments panel | **never used** (not approved) |

Originals are preserved untouched in `brand/source/`. Everything in `apps/web/public/brand/` and the app icons is generated
by `scripts/build-brand-assets.py` (reproducible). **Limits:** the background/decor crops are ~500 px sources used only as
soft, feathered, low-opacity layers — production 3840×2160 masters are still needed; the 16 px favicon is a gold/green smudge
(32/48 px read correctly) pending the simplified small-size mark; the old hand-redrawn SVG logo mark was **removed**.

## Capability status (single source: `apps/web/src/content/capabilities.ts`)
Vocabulary: **Available now · In development · Planned.** *In development* exists in the type but **no entry uses it** — nothing
in the repository documents work in progress on an unbuilt capability.
- **Available:** AI chat (the only registered capability, `ai.chat`), plus the Worlds, persistent-conversation and account/workspace *experiences*.
- **Planned (17):** research, learning, writing, image, video, audio, stickers, documents, website, app, game, agents, automation,
  integrations, publishing, monetization, collaboration.
`pnpm verify:landing` fails if an "available" claim lacks evidence, if live capabilities ≠ registered capabilities, or if an
available stage of the narrative isn't backed by an evidenced entry.

## Accessibility & performance measures
Skip link; one `h1`, no skipped heading levels; labelled landmarks; visible focus rings; keyboard-operable explorer (arrows/Home/End);
`aria-pressed`/`aria-expanded`/`aria-controls`; status announcements; every status in words, not colour alone; AA contrast measured on the
rendered backdrop in both worlds (min 4.6:1); `prefers-reduced-motion` removes all continuous motion and parallax; one canvas total
(pauses offscreen/hidden); lazy-loaded below-fold art; reserved image boxes (no layout shift); full content readable with JavaScript off.
Small accent text uses a blended accent-text tone (`--zl-accent-text`) because pure Patina measured 3.0:1 on the brighter backdrop.
