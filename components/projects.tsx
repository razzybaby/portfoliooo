"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, Github, Search, X } from "lucide-react";
import { allStacks, projects } from "@/lib/content";
import { SectionTag } from "@/components/section-tag";

export function Projects() {
  const [query, setQuery] = useState("");
  const [stack, setStack] = useState<string | null>(null);

  /**
   * SEARCH + FILTER: both values live in state. On every keystroke or chip
   * click we re-run .filter(): a project stays if its name OR any technology
   * contains the search text, and (if a chip is picked) it uses that technology.
   */
  const q = query.trim().toLowerCase();
  const visible = projects.filter((p) => {
    const matchesText =
      q === "" || p.name.toLowerCase().includes(q) || p.stack.some((t) => t.toLowerCase().includes(q));
    const matchesChip = stack === null || p.stack.includes(stack);
    return matchesText && matchesChip;
  });

  return (
    <section id="projects" className="border-t border-line py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTag index={4} label="Projects" title="Spec sheets" />

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 border border-line bg-panel px-4 focus-within:border-accent">
            <Search size={16} className="shrink-0 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or technology: Python, Quiz, Book…"
              aria-label="Search projects"
              className="h-12 w-full min-w-0 bg-transparent font-mono text-sm outline-none placeholder:text-muted"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={16} className="text-muted hover:text-fg" />
              </button>
            )}
          </label>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by technology">
            {[null, ...allStacks].map((t) => {
              const on = stack === t;
              return (
                <button
                  key={t ?? "all"}
                  type="button"
                  onClick={() => setStack(t)}
                  aria-pressed={on}
                  className={`border px-3 py-1.5 font-mono text-xs transition-colors ${
                    on ? "border-accent bg-accent text-bg" : "border-line text-muted hover:text-fg"
                  }`}
                >
                  {t ?? "All"}
                </button>
              );
            })}
          </div>

          <p className="font-mono text-xs text-muted" aria-live="polite">
            Showing {visible.length} of {projects.length}
          </p>
        </div>

        <motion.ul layout className="mt-8 grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group flex flex-col border border-line bg-panel"
              >
                <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] text-muted uppercase">
                  <span>Sheet P-{String(projects.indexOf(p) + 1).padStart(2, "0")}</span>
                  <span>{p.stack[0]}</span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-xl font-semibold transition-colors group-hover:text-accent">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{p.summary}</p>
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <span className="text-accent">+</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.stack.map((t) => (
                      <span key={t} className="bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent">
                        {t}
                      </span>
                    ))}
                  </div>
                  {(p.repo || p.demo) && (
                    <div className="mt-auto flex gap-4 pt-6 font-mono text-xs">
                      {p.repo && (
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 hover:text-accent"
                        >
                          <Github size={14} /> Code
                        </a>
                      )}
                      {p.demo && (
                        <a
                          href={p.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 hover:text-accent"
                        >
                          <ExternalLink size={14} /> Live demo
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {visible.length === 0 && (
          <div className="mt-8 border border-dashed border-line p-10 text-center">
            <p className="font-mono text-sm">No projects match “{query || stack}”.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStack(null);
              }}
              className="mt-4 font-mono text-xs text-accent underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
