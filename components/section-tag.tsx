"use client";

import { motion } from "motion/react";

/** "02 ─── ABOUT" label with a line that draws itself in. */
export function SectionTag({ index, label, title }: { index: number; label: string; title: string }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        <span>{String(index).padStart(2, "0")}</span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-px w-16 origin-left bg-accent"
        />
        <span>{label}</span>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl"
      >
        {title}
      </motion.h2>
    </div>
  );
}
