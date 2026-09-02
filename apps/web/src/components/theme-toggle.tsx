"use client";

import { useEffect, useState } from "react";

type ZuvreThemeName = "nocturne" | "aubade";

const THEMES: { name: ZuvreThemeName; label: string; tagline: string }[] = [
  { name: "nocturne", label: "Nocturne", tagline: "Ink, gold, and quiet focus." },
  { name: "aubade", label: "Aubade", tagline: "Patina, moss, and organic growth — not a light mode." },
];

const STORAGE_KEY = "zuvre-theme";

export function ThemeToggle() {
  const [active, setActive] = useState<ZuvreThemeName>("nocturne");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ZuvreThemeName | null;
    if (stored === "nocturne" || stored === "aubade") {
      setActive(stored);
      document.documentElement.setAttribute("data-zuvre-theme", stored);
    }
  }, []);

  function select(theme: ZuvreThemeName) {
    setActive(theme);
    document.documentElement.setAttribute("data-zuvre-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }

  return (
    <div className="zuvre-card flex items-center gap-1 p-1" role="radiogroup" aria-label="ZUVRE visual world">
      {THEMES.map((theme) => (
        <button
          key={theme.name}
          role="radio"
          aria-checked={active === theme.name}
          onClick={() => select(theme.name)}
          className={`zuvre-focus-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            active === theme.name
              ? "bg-accent-primary text-accent-primary-contrast"
              : "text-text-secondary hover:text-text-primary"
          }`}
          title={theme.tagline}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}
