# 12 — Zuri motion system

## What the artwork allows
The only production-usable Zuri asset is **`Zuri - Master Character.png`**: one flattened pose, **opaque** (dark blue-teal
background baked in, ≈ RGB 16,23,33), no layers, no alpha. The expression / pose / companion sheets are composite reference
sheets, not standalone assets. Therefore:
- Nothing is cut into fake layers (ears, tail, eyes are **not** animated independently) — that would damage the character.
- The opaque rectangle is dissolved **in CSS** (feathered mask + a matching "portal" glow). No pixel of the original is changed
  and the image is never labelled transparent.
- Specific expressions/poses are **not** faked. `ZuriCompanion` renders the explicit "asset pending" slot for any
  expression/pose other than the master.

## The states (whole-image transforms only)
| State | Trigger | Effect | Reduced motion |
|---|---|---|---|
| arrive | first paint | 800 ms fade/rise from 25% opacity (content never waits for it) | off |
| breathe | idle | 7 s slow float + 1.2% scale | off |
| turn | cursor within ~1.6 body-widths (fine pointers only, element visible) | tilt toward the cursor: `rotateY ±7°`, `rotateX ±4°`, ≤8 px shift — **a pure function of cursor position** | off |
| near | same proximity | soft teal glow | off |
| nudge | `nudgeKey` changes (the ecosystem journey changes chapter) | one 700 ms lean | off |
| curious / attentive (hero) | pointer inside the stage / note open | brightness lift / glow | unchanged (no motion) |

Determinism is tested: same cursor position ⇒ same pose; moving away ⇒ rest (`t-landing.cjs` B2, D7).

## Where Zuri appears
Hero (interactive note) · ecosystem journey (guide whose caption follows the active chapter) · invitation · login/register ·
demo onboarding, empty states and home. Captions are **authored, static strings** (`ZURI_LINES`, onboarding) — Zuri never
claims to think or understand.

## Implementation
`components/zuri/zuri-presence.tsx` (reusable) · `components/zuri-companion.tsx` (the asset) · hero wiring in
`components/landing/arrival-stage.tsx` · CSS "Zuri motion system" section in `app/landing.css`.

## Known visual limit
The opaque artwork dissolves fully into dark and teal scenes (measured edge steps ≤ 3 RGB levels). Against a **warm gold backdrop**
(the invitation scene) its cool-navy background still reads faintly as a panel — the CSS can only feather it, not recolour it.
A transparent master removes this entirely.

## What remains limited by the source art (production work needed)
Transparent character master · separated layers (ears/tail/eyes/gems) for real rigging · extracted expression and pose masters
for contextual states · a small-UI companion export. Until then the character reads as a living presence, not a rigged puppet.
