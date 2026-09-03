"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Layers 2 + 4 combined: slow-drifting "thought" particles that form faint
 * connections when near each other. Canvas + requestAnimationFrame rather
 * than N individually-animated DOM nodes — the standard, much cheaper
 * technique for this kind of effect, and it's the one place in this system
 * where rAF is genuinely justified (per the brief's own preference order).
 *
 * Respects prefers-reduced-motion (renders one static frame, no loop),
 * pauses via IntersectionObserver when scrolled off-screen and via
 * visibilitychange when the tab is hidden, and scales particle count down
 * on small viewports. Fully cleaned up on unmount.
 */

type Density = "low" | "normal" | "high";
const COUNTS: Record<Density, number> = { low: 10, normal: 18, high: 26 };

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function ThoughtParticles({ density = "normal" }: { density?: Density }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isSmall = window.innerWidth < 640;
    let count = COUNTS[density];
    if (isSmall) count = Math.round(count * 0.6);

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];

    function resize() {
      const rect = parent!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        r: 1 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    resize();
    seed();

    const accentHex =
      getComputedStyle(document.documentElement).getPropertyValue("--zuvre-accent-primary").trim() || "#D6A64A";
    const [r, g, b] = hexToRgb(accentHex);

    let t = 0;
    function drawFrame() {
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      const maxDist = 140;
      // .entries() rather than index-based access — with
      // noUncheckedIndexedAccess (tsconfig.base.json), particles[i] would
      // type as Particle | undefined even though the loop bounds already
      // guarantee validity. Iterating avoids the indexing question
      // entirely instead of asserting past it. `j <= i` preserves the
      // original "each unique pair checked once" behavior of the old
      // `j = i + 1` loop.
      for (const [i, a] of particles.entries()) {
        for (const [j, bp] of particles.entries()) {
          if (j <= i) continue;
          const dx = a.x - bp.x;
          const dy = a.y - bp.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx!.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(bp.x, bp.y);
            ctx!.stroke();
          }
        }
      }

      for (const p of particles) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.012 + p.phase);
        const alpha = 0.15 + pulse * 0.22;
        ctx!.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      t += 1;
    }

    if (reducedMotion) {
      drawFrame(); // one static frame — depth preserved, no motion
      return;
    }

    let rafId = 0;
    let running = false;

    function loop() {
      drawFrame();
      rafId = requestAnimationFrame(loop);
    }
    function start() {
      if (!running) {
        running = true;
        loop();
      }
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    function onVisibility() {
      if (document.hidden) stop();
      else io.takeRecords(); // re-evaluated on next intersection callback
    }
    document.addEventListener("visibilitychange", onVisibility);

    let resizeRaf = 0;
    function onResize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resize();
        seed();
      });
    }
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [density, reducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />;
}
