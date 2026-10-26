"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { buildLog } from "@/lib/content";
import { useMedia } from "@/lib/use-media";

/**
 * Pinned section: on desktop the page "pauses" here while the five build steps
 * slide sideways as you scroll down. On mobile they simply stack.
 */
export function BuildLog() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const isDesktop = useMedia("(min-width: 768px)");
  const [distance, setDistance] = useState(0);

  // How far the track must slide so the last card ends inside the screen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 48));
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} aria-label="Build log" className="relative border-t border-line md:h-[300vh]">
      <div className="py-24 md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:overflow-hidden md:py-0">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">Build log</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Five projects, one learning curve
          </h2>
          <div className="mt-6 hidden h-px bg-line md:block">
            <motion.div style={{ scaleX: lineScale }} className="h-px origin-left bg-accent" />
          </div>
        </div>

        <motion.ol
          ref={trackRef}
          style={{ x: isDesktop ? x : 0 }}
          className="mx-auto mt-12 flex max-w-6xl flex-col gap-5 px-4 sm:px-6 md:mx-0 md:w-max md:max-w-none md:flex-row md:gap-8 md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
        >
          {buildLog.map((item) => (
            <li
              key={item.step}
              className="crop-marks shrink-0 border border-line bg-panel p-7 md:w-[26rem] md:p-10"
            >
              <span className="font-mono text-6xl font-bold text-accent/30 md:text-8xl">{item.step}</span>
              <h3 className="mt-6 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-muted">{item.text}</p>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
