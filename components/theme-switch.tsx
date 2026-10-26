"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_KEY } from "@/lib/theme";

// Watch the `dark` class on <html> so the icon always matches the real theme.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
const readIsDark = () => document.documentElement.classList.contains("dark");

/**
 * THEME TOGGLE: flips the `dark` class on <html> (Tailwind's dark: styles key off it)
 * and saves the choice in localStorage so it survives a reload.
 */
export function ThemeSwitch() {
  const isDark = useSyncExternalStore(subscribe, readIsDark, () => true);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-9 place-items-center border border-line text-fg transition-colors hover:border-accent hover:text-accent"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
