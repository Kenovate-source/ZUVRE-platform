"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Layer 5: "the world knows you are there." A soft radial glow that lags
 * gently toward the cursor. Updates a CSS custom property directly via
 * the DOM ref in the event handler (no setState, no re-render per mouse
 * move) and lets a CSS transition do the actual lagging/easing — cheap
 * and smooth. Disabled entirely on coarse pointers (touch) and under
 * prefers-reduced-motion, both of which fall back to a fixed, centered
 * glow with no tracking.
 */
export function AmbientLight() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const el = ref.current;
    if (!el) return;

    let rafPending = false;
    let lastX = 0;
    let lastY = 0;

    function onMove(e: PointerEvent) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          // Re-read ref.current fresh here rather than relying on the
          // outer `el` — TypeScript's non-null narrowing from the guard
          // above doesn't survive across this nested closure boundary
          // (confirmed: even `const` narrowing is closure-local), and a
          // real guard is safer than an assertion regardless — the node
          // could theoretically unmount between the event firing and this
          // callback running. `parentElement` gets the same treatment: an
          // explicit guard instead of a blind `!`, since nothing upstream
          // actually establishes it's non-null.
          const node = ref.current;
          if (!node) return;
          const parent = node.parentElement;
          if (!parent) return;
          const rect = parent.getBoundingClientRect();
          const x = ((lastX - rect.left) / rect.width) * 100;
          const y = ((lastY - rect.top) / rect.height) * 100;
          // Only move if the pointer is roughly within this section —
          // keeps the effect restrained rather than tracking globally.
          if (x >= -20 && x <= 120 && y >= -20 && y <= 120) {
            node.style.setProperty("--pointer-x", `${x}%`);
            node.style.setProperty("--pointer-y", `${y}%`);
          }
          rafPending = false;
        });
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  return <div ref={ref} className="zuvre-ambient-light" aria-hidden="true" />;
}
