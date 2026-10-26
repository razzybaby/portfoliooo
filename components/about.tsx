"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { person } from "@/lib/content";
import { SectionTag } from "@/components/section-tag";

/** One word whose opacity is tied to how far the paragraph has scrolled. */
function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

export function About() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ["start 0.85", "end 0.45"],
  });
  const { scrollYProgress: photoProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(photoProgress, [0, 1], ["-8%", "8%"]);
  const frameRotate = useTransform(photoProgress, [0, 1], [-3, 3]);

  const words = person.about.split(" ");

  return (
    <section id="about" className="relative border-t border-line py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTag index={2} label="About" title="The person behind the drawings" />

        <div className="grid items-start gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="md:sticky md:top-28">
            <motion.div
              ref={photoRef}
              style={{ rotate: frameRotate }}
              className="crop-marks mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden border border-line bg-panel"
            >
              {person.photo ? (
                <motion.div style={{ y: photoY }} className="relative -top-[8%] h-[116%]">
                  <Image
                    src={person.photo}
                    alt={`Portrait of ${person.fullName}`}
                    fill
                    sizes="(min-width: 768px) 320px, 80vw"
                    className="object-cover"
                  />
                </motion.div>
              ) : (
                <div className="blueprint-grid grid h-full place-items-center">
                  <motion.span
                    style={{ y: photoY }}
                    className="font-mono text-7xl font-bold text-accent"
                    aria-hidden
                  >
                    {person.initials}
                  </motion.span>
                </div>
              )}
            </motion.div>
            <dl className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-px border border-line bg-line font-mono text-[11px]">
              {[
                ["Course", "B.Tech CSE"],
                ["Batch", person.batch],
                ["Roll no.", person.rollNo],
                ["Based in", "Jaipur"],
              ].map(([k, v]) => (
                <div key={k} className="bg-bg p-3">
                  <dt className="text-muted uppercase">{k}</dt>
                  <dd className="mt-1 text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p ref={textRef} className="text-2xl leading-snug font-medium sm:text-3xl">
              {words.map((word, i) => (
                <Word key={i} progress={textProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {word}
                </Word>
              ))}
            </p>

            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              {person.principles.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="border border-line bg-panel p-5"
                >
                  <p className="font-mono text-xs text-accent">STEP {i + 1}</p>
                  <h3 className="mt-2 text-xl font-semibold">{p.label}</h3>
                  <p className="mt-2 text-sm text-muted">{p.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
