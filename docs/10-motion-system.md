# ZUVRE Motion System

**Status:** Specifications for all 8 canonical sequences from `ZUVRE
MOTION REFERENCE FRAME SYSTEM.png`. That file is a storyboard/keyframe
reference, not a production motion asset — no video/Lottie file exists
for any sequence. Two sequences already have real, working CSS
implementations (marked below); the rest are specification only until a
surface in the actual product needs them, per the implementation-driven
production principle.

Every sequence must feel: smooth, intentional, elegant, spatial,
intelligent, organic, calm, responsive. Avoid: excessive bouncing,
random spinning, hyperactive movement, aggressive transitions, constant
glow, generic loading spinners, cheap effects. Stillness is part of the
ZUVRE experience — a sequence that does nothing at rest is doing its job.

---

## 1. Logo Reveal

- **Purpose:** Introduce the mark on first load or a fresh entry into ZUVRE.
- **Trigger:** Initial page load; first paint of a surface where the mark is the focal element.
- **Duration:** ~900ms total.
- **Easing:** `easingReveal` (`cubic-bezier(0.2, 0, 0, 1)`) — slow-start, fast-settle.
- **Movement behavior:** The ring traces in (stroke-dashoffset animation), the Z glyph fades/scales in slightly after, the accent dot appears last with a brief glow pulse.
- **Start state:** Ring undrawn (dashoffset = full path length), glyph and dot at 0 opacity.
- **End state:** Fully drawn ring, full-opacity glyph and dot, no residual glow.
- **Reduced-motion behavior:** Skip straight to end state, no animation.
- **Implementation format:** CSS (`stroke-dasharray`/`stroke-dashoffset` + opacity transition) — no JS/library needed.
- **Status:** Specification only — not yet implemented; `page.tsx` doesn't currently have a loading moment for this to play during.

## 2. Idea → Creation Transition

- **Purpose:** Visualize a single thought becoming a structured creation.
- **Trigger:** A capability execution completing and producing a first-time artifact.
- **Duration:** ~1400ms.
- **Easing:** `easingReveal` for the emergence phase, `easingStandard` for settle.
- **Movement behavior:** A single point of light expands into a loose particle field, particles converge toward a recognizable form, form resolves to full clarity.
- **Start state:** Single point, full brightness, everything else absent.
- **End state:** The actual artifact/result UI, fully rendered, no residual particles.
- **Reduced-motion behavior:** Fade directly from "nothing" to "result" over 200ms, no particle motion.
- **Implementation format:** CSS/SVG for the particle field if simple enough; otherwise Framer Motion once this becomes a real surface.
- **Status:** Specification only — no capability currently produces a first-time artifact moment to attach this to.

## 3. Orbital Motion

- **Purpose:** Convey connection and structure without implying loading/waiting.
- **Trigger:** Any surface displaying the ecosystem constellation or a similar orbital arrangement.
- **Duration:** Continuous, ~40–60s per full rotation (deliberately slow — this is ambient, not a loading indicator).
- **Easing:** Linear (constant angular velocity reads as "orbit," not "animation").
- **Movement behavior:** Satellite nodes drift slowly around a fixed center; never accelerates or bounces.
- **Start state / End state:** N/A — continuous, no defined start/end.
- **Reduced-motion behavior:** Static — nodes render at a fixed position, no rotation.
- **Implementation format:** CSS `@keyframes` with `transform: rotate()` on a wrapping group, or SVG `<animateTransform>`.
- **Status:** Specification only. `ecosystem-constellation.tsx` currently renders statically — this would be the next real enhancement to that component, not implemented in this pass since the static version already communicates the intended structure.

## 4. Thought Particle Behavior

- **Purpose:** Ambient background texture representing "the ecosystem thinking."
- **Trigger:** Present continuously on hero-type surfaces (low-key, background layer).
- **Duration:** Continuous, slow drift.
- **Easing:** `ease-in-out`, staggered per-particle.
- **Movement behavior:** Small motes drift slowly, fade in/out individually — never uniform, never synchronized.
- **Reduced-motion behavior:** Static scatter, no drift.
- **Implementation format:** CSS, many small elements with staggered animation-delay.
- **Status:** Specification only.

## 5. Zuri Presence / Arrival

- **Purpose:** Zuri entering a surface — a calm arrival, not a pop-in.
- **Trigger:** Zuri becoming relevant to the current context (e.g., first-time guidance).
- **Duration:** ~600ms.
- **Easing:** `easingReveal`.
- **Movement behavior:** Fade + slight rise (8–12px), settling into the breathing idle state.
- **Start state:** 0 opacity, offset down slightly.
- **End state:** Full opacity, idle breathing loop begins (`.zuvre-mascot-breathe`, already implemented).
- **Reduced-motion behavior:** Instant appearance, breathing loop disabled.
- **Implementation format:** CSS transition on mount.
- **Status:** **Blocked on the Zuri asset itself**, not the motion — see `zuri-companion.tsx`. The breathing/core-flicker CSS this would attach to already exists and works (`.zuvre-mascot-breathe`, `.zuvre-mascot-core` in `globals.css`) — it's currently unused because there's no image to animate.

## 6. Zuri Thinking → Response

- **Purpose:** Show Zuri processing before delivering a response.
- **Trigger:** ZUVRE AI generating a reply while Zuri is visibly present.
- **Duration:** Variable (matches actual generation time) with a minimum ~400ms so it never flickers.
- **Easing:** `easingStandard`.
- **Movement behavior:** Subtle core-pulse intensifies slightly during "thinking," settles on response arrival.
- **Reduced-motion behavior:** No pulse intensification — a static "thinking" state (e.g., a still label) instead.
- **Implementation format:** CSS class toggle driven by request state.
- **Status:** Specification only — blocked on both the Zuri asset and a UI surface where Zuri sits alongside a live AI response.

## 7. UI / Interface Transitions

- **Purpose:** General element-enter, card-transform, panel-open, view-change motion.
- **Trigger:** Routine UI state changes.
- **Duration:** 120–420ms depending on scale (`motion.durationFast/Base/Slow` in `packages/ui/src/tokens.ts`).
- **Easing:** `easingStandard` for most transitions; `easingReveal` for anything emphasized (a newly-created card, a panel opening for the first time).
- **Movement behavior:** Small, purposeful — never a full-screen wipe or aggressive slide.
- **Reduced-motion behavior:** All durations collapse to near-zero (already enforced globally — see the `prefers-reduced-motion` block in `globals.css`).
- **Implementation format:** CSS transitions — this is already the working pattern throughout `globals.css` (`.zuvre-button-primary`, `.zuvre-input`, etc.).
- **Status:** **Already implemented** — this is the one sequence family with real, working, in-use CSS today.

## 8. Creation in Progress

- **Purpose:** Show a capability actively executing, without a generic spinner.
- **Trigger:** `CapabilityExecution.status === "RUNNING"`.
- **Duration:** Variable, matches actual execution time.
- **Easing:** `ease-in-out`, looping.
- **Movement behavior:** A soft pulse or slow bloom-intensity shift on the surface producing the result — not a spinning loader icon.
- **Start state:** Empty/quiet surface.
- **End state:** Result rendered, pulse stops.
- **Reduced-motion behavior:** Static "In progress…" label, no pulsing.
- **Implementation format:** CSS, reusing `.zuvre-bloom`'s existing radial-gradient mechanism with an added opacity pulse.
- **Status:** Specification only — the one real capability execution (`ai.chat` via `/api/capabilities/execute`) is currently synchronous and fast enough that no loading state is rendered at all client-side yet.

---

## Summary

| # | Sequence | Status |
|---|---|---|
| 1 | Logo Reveal | Spec only |
| 2 | Idea → Creation | Spec only |
| 3 | Orbital Motion | Spec only |
| 4 | Thought Particle Behavior | Spec only |
| 5 | Zuri Presence/Arrival | Spec only — blocked on Zuri asset |
| 6 | Zuri Thinking → Response | Spec only — blocked on Zuri asset + UI surface |
| 7 | UI/Interface Transitions | **Implemented** |
| 8 | Creation in Progress | Spec only |

Consistent with the implementation-driven principle: nothing here was
built ahead of an actual surface needing it, except #7, which was already
load-bearing in the existing component vocabulary before this document
was written.
