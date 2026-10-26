"use client";

import { motion } from "motion/react";
import { skillTable } from "@/lib/content";
import { SectionTag } from "@/components/section-tag";

/** Skills laid out like a drawing's bill of materials. */
export function Skills() {
  return (
    <section id="skills" className="blueprint-grid border-t border-line py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTag index={3} label="Skills" title="Bill of materials" />

        <div className="border border-line bg-bg/90 backdrop-blur-sm">
          <div className="hidden grid-cols-[4rem_14rem_1fr] border-b border-line font-mono text-[11px] tracking-widest text-muted uppercase sm:grid">
            <span className="border-r border-line p-3">Item</span>
            <span className="border-r border-line p-3">Group</span>
            <span className="p-3">Parts</span>
          </div>

          {skillTable.map((row, i) => (
            <motion.div
              key={row.group}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="grid border-b border-line last:border-b-0 sm:grid-cols-[4rem_14rem_1fr]"
            >
              <span className="hidden border-r border-line p-4 font-mono text-sm text-accent sm:block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="px-4 pt-4 font-semibold sm:border-r sm:border-line sm:p-4">{row.group}</span>
              <ul className="flex flex-wrap gap-2 p-4">
                {row.items.map((item) => (
                  <li
                    key={item}
                    className="border border-line px-3 py-1 font-mono text-xs transition-colors hover:border-accent hover:text-accent"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
