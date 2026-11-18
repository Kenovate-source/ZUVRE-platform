"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/components/universe/use-reduced-motion";

/**
 * Drives the environment from REAL scroll position — nothing here is timed
 * or random. On every (rAF-throttled) scroll it:
 *   1. finds the section crossing 45% of the viewport and exposes its name
 *      as <html data-zl-atmosphere="…"> — CSS cross-fades the matching
 *      environment layer;
 *   2. publishes the scroll offset as --zl-scroll for subtle depth parallax
 *      (skipped entirely under prefers-reduced-motion).
 * Sections opt in with a data-zl-section="name" attribute. Cleans up fully
 * on unmount so other routes never inherit landing-page state.
 */
export function AtmosphereController() {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-zl-section]"));
    if (sections.length === 0) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      if (!reduced) root.style.setProperty("--zl-scroll", String(Math.round(window.scrollY)));

      const probe = window.innerHeight * 0.45;
      let active: HTMLElement | undefined = sections[0];
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) {
          active = section;
          break;
        }
      }
      const name = active?.dataset.zlSection;
      if (name && root.dataset.zlAtmosphere !== name) root.dataset.zlAtmosphere = name;
    };
    const schedule = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf !== 0) cancelAnimationFrame(raf);
      delete root.dataset.zlAtmosphere;
      root.style.removeProperty("--zl-scroll");
    };
  }, [reduced]);

  return null;
}
