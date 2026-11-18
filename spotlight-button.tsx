"use client";

import { useRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";

/**
 * A restrained "magnetic light" hover: the glow follows the cursor within
 * the button via a CSS custom property, set directly on the DOM node (no
 * setState/re-render per mouse move). Kept as its own small client
 * component specifically so the rest of page.tsx can stay a server
 * component — converting the whole page to "use client" just to attach
 * one hover handler would be the wrong trade.
 */
export function SpotlightButton({
  variant = "primary",
  children,
  className,
  ...props
}: {
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);

  function onMouseMove(e: MouseEvent<HTMLButtonElement>) {
    // Capture into a local const and guard on it directly, rather than
    // checking indirectly via getBoundingClientRect()'s result — that
    // told TypeScript nothing about ref.current itself (a mutable
    // property), which is why the two lines below previously needed
    // non-null assertions. Narrowing a local const persists for the rest
    // of this function (no nested closure here), so no assertions needed.
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    node.style.setProperty("--spot-x", `${x}%`);
    node.style.setProperty("--spot-y", `${y}%`);
  }

  const base = variant === "primary" ? "zuvre-button-primary" : "zuvre-button-secondary";

  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      className={`${base} zuvre-focus-ring zuvre-spotlight ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
