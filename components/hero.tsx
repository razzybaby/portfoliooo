"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { person } from "@/lib/content";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/+=";

/** Letters cycle through random glyphs, then lock in left to right. */
function useDecode(text: string) {
  const [output, setOutput] = useState(text);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const locked = Math.floor(frame / 2);
      setOutput(
        text
          .split("")
          .map((ch, i) => (ch === " " || i < locked ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (locked >= text.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [text, reduce]);

  return output;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const name = useDecode(person.fullName.toUpperCase());

  // As you scroll past, the grid drifts and the title block recedes.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section ref={ref} id="home" className="relative flex min-h-svh items-center overflow-hidden">
      <motion.div
        style={{ y: gridY }}
        className="blueprint-grid absolute -inset-y-24 inset-x-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative mx-auto w-full max-w-6xl px-4 pt-20 sm:px-6"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-xs uppercase tracking-[0.25em] text-muted"
        >
          Drawing no. {person.rollNo} · {person.college}
        </motion.p>

        <h1
          aria-label={person.fullName}
          className="mt-6 font-mono text-[15vw] leading-none font-bold tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span aria-hidden>{name}</span>
        </h1>

        {/* Dimension line that "measures" the name */}
        <div className="mt-5 flex items-center gap-3 text-accent">
          <span className="h-3 w-px bg-current" />
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 1, ease: "easeInOut" }}
            className="h-px flex-1 origin-left bg-current sm:max-w-xl"
          />
          <span className="h-3 w-px bg-current" />
          <span className="font-mono text-[10px] tracking-widest whitespace-nowrap">
            {person.title.toUpperCase()}
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-10 max-w-xl text-lg text-muted sm:text-2xl"
        >
          {person.headline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a
            href="#projects"
            className="bg-accent px-5 py-3 font-mono text-xs font-semibold tracking-wider text-bg uppercase transition-opacity hover:opacity-85"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="border border-line px-5 py-3 font-mono text-xs tracking-wider uppercase transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to About"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted"
      >
        <ArrowDown size={18} />
      </motion.a>
    </section>
  );
}
