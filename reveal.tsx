"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/components/universe/use-reduced-motion";

/**
 * Fades content in once, the first time it scrolls into view. Server HTML is
 * fully visible; an element is only hidden after mount AND only if it starts
 * offscreen — so there is no flash, and no-JS / reduced-motion visitors see
 * everything immediately. It never replays when you scroll back.
 */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setState("shown");
      return;
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setState("shown");
      return;
    }
    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`zl-reveal ${className ?? ""}`}
      data-reveal={state}
      style={{ "--zl-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
