"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ZuriCompanion } from "@/components/zuri-companion";
import { useReducedMotion } from "@/components/universe/use-reduced-motion";

/**
 * Zuri as a reusable presence — the "mascot motion system" for every place
 * Zuri appears outside the hero (the ecosystem journey, the invitation, auth
 * screens, onboarding, empty states). See docs/12-zuri-motion.md.
 *
 * The artwork is ONE flattened pose, so nothing is torn into fake layers.
 * Motion is whole-image and deterministic:
 *   arrive   — a short fade/rise on first paint (never blocks content)
 *   breathe  — slow idle scale/float (CSS, off under reduced motion)
 *   turn     — pointer proximity tilts Zuri toward the cursor; a PURE
 *              FUNCTION of cursor position (same position ⇒ same pose),
 *              active only within ~1.6 body-widths, only on fine pointers,
 *              only while visible, never under reduced motion
 *   near     — a soft glow while the cursor is close
 *   nudge    — a single small lean when `nudgeKey` changes, so Zuri
 *              visibly "follows along" with what it is guiding
 * `caption` is static, authored copy — Zuri never pretends to think.
 */

export type ZuriPresenceSize = "sm" | "md" | "lg";

export function ZuriPresence({
  size = "md",
  caption,
  nudgeKey,
  className,
}: {
  size?: ZuriPresenceSize;
  caption?: ReactNode;
  nudgeKey?: string | number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let visible = false;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let isNear = false;

    const io = new IntersectionObserver((entries) => {
      visible = Boolean(entries[0]?.isIntersecting);
    });
    io.observe(el);

    const apply = () => {
      raf = 0;
      el.style.setProperty("--zp-x", tx.toFixed(3));
      el.style.setProperty("--zp-y", ty.toFixed(3));
      el.dataset.near = isNear ? "true" : "false";
    };
    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.4); // aim at the face, not the feet
      const reach = Math.max(260, r.width * 1.6);
      isNear = Math.hypot(dx, dy) < reach;
      tx = isNear ? Math.max(-1, Math.min(1, dx / reach)) : 0;
      ty = isNear ? Math.max(-1, Math.min(1, dy / reach)) : 0;
      if (raf === 0) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={ref} className={`zp zp--${size}${className ? ` ${className}` : ""}`} data-near="false">
      <div className="zp-body">
        <div className="zp-nudge" key={nudgeKey ?? "static"} data-nudge={nudgeKey === undefined ? "off" : "on"}>
          <ZuriCompanion className="zp-img" decorative sizes={size === "lg" ? "20rem" : size === "md" ? "14rem" : "9rem"} />
        </div>
      </div>
      {caption ? <p className="zp-caption zuvre-panel-raised">{caption}</p> : null}
    </div>
  );
}
