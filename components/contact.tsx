"use client";

import { motion } from "motion/react";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { person } from "@/lib/content";
import { SectionTag } from "@/components/section-tag";

/** Contact laid out as the title block in the corner of an engineering drawing. */
export function Contact() {
  const rows = [
    { icon: Mail, label: "Email", value: person.email, href: `mailto:${person.email}` },
    { icon: Github, label: "GitHub", value: person.github.replace("https://", ""), href: person.github },
    { icon: Linkedin, label: "LinkedIn", value: "Connect on LinkedIn", href: person.linkedin },
    { icon: MapPin, label: "Location", value: person.city, href: "" },
  ].filter((r) => r.label === "Location" || r.href);

  return (
    <section id="contact" className="blueprint-grid border-t border-line py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTag index={5} label="Contact" title="Let's build something" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="crop-marks ml-auto max-w-2xl border-2 border-fg/70 bg-bg"
        >
          <div className="grid grid-cols-[1fr_auto] border-b-2 border-fg/70">
            <div className="p-5">
              <p className="font-mono text-[10px] text-muted uppercase">Drawn by</p>
              <p className="text-2xl font-semibold">{person.fullName}</p>
            </div>
            <div className="border-l-2 border-fg/70 p-5 text-right font-mono">
              <p className="text-[10px] text-muted uppercase">Rev.</p>
              <p className="text-2xl text-accent">{person.batch}</p>
            </div>
          </div>
          {rows.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <>
                <Icon size={16} className="shrink-0 text-accent" />
                <span className="w-20 shrink-0 font-mono text-[11px] text-muted uppercase">{label}</span>
                <span className="min-w-0 break-words">{value}</span>
              </>
            );
            return href ? (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center gap-3 border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-accent/10"
              >
                {inner}
              </a>
            ) : (
              <div
                key={label}
                className="flex items-center gap-3 border-b border-line px-5 py-4 last:border-b-0"
              >
                {inner}
              </div>
            );
          })}
        </motion.div>

        <p className="mt-16 text-center font-mono text-[11px] text-muted">
          © {new Date().getFullYear()} {person.fullName} · {person.college}
        </p>
      </div>
    </section>
  );
}
