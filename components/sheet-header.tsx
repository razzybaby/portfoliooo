"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { person, sections } from "@/lib/content";
import { ThemeSwitch } from "@/components/theme-switch";

/** Fixed top bar styled like a drawing's title strip: "SHEET 02 / 05 · ABOUT". */
export function SheetHeader() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  // Highlight whichever section is in the middle of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sections.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) setActive(index);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const sheet = String(active + 1).padStart(2, "0");
  const total = String(sections.length).padStart(2, "0");

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#home" className="flex items-center gap-3 font-mono text-xs">
          <span className="grid size-8 place-items-center border border-accent font-semibold text-accent">
            {person.initials}
          </span>
          <span className="hidden text-muted sm:inline">
            SHEET {sheet} / {total} · <span className="text-fg uppercase">{sections[active].label}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                i === active ? "text-accent" : "text-muted hover:text-fg"
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-9 place-items-center border border-line md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Scroll progress drawn like a dimension line */}
      <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-accent" />

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-b border-line bg-bg md:hidden"
          >
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 border-t border-line px-6 py-3 font-mono text-sm uppercase"
              >
                <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
