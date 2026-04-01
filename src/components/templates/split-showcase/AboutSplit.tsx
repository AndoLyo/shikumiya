"use client";

import { motion } from "framer-motion";
import { Camera, Palette, Eye, Sun } from "lucide-react";

const skills = [
  { label: "Photography", icon: Camera },
  { label: "Art Direction", icon: Palette },
  { label: "Visual Identity", icon: Eye },
  { label: "Lighting Design", icon: Sun },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
      ease: "easeOut" as const,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" as const, delay: 0.3 },
  },
};

export function AboutSplit() {
  return (
    <section
      className="min-h-screen flex flex-col md:flex-row"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Left — Text */}
      <motion.div
        className="w-full md:w-1/2 min-h-[60vh] md:min-h-screen flex items-center justify-center px-10 md:px-16 lg:px-24 py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-md">
          <motion.p
            variants={childVariants}
            className="text-xs font-mono uppercase mb-6"
            style={{ color: "var(--color-accent)", letterSpacing: "0.3em" }}
          >
            About
          </motion.p>

          <motion.h2
            variants={childVariants}
            className="text-4xl md:text-5xl font-serif font-bold mb-8"
            style={{ color: "var(--color-text)" }}
          >
            The Artist
            <br />
            Behind the Lens
          </motion.h2>

          {/* Gold ornamental line */}
          <motion.div
            variants={childVariants}
            className="h-[1px] w-16 mb-8"
            style={{ backgroundColor: "var(--color-accent)" }}
          />

          <motion.p
            variants={childVariants}
            className="text-sm leading-relaxed mb-6"
            style={{ color: "var(--color-muted)" }}
          >
            With over a decade of experience in visual storytelling, I specialize
            in capturing the extraordinary within the ordinary. My work spans
            editorial, commercial, and fine art photography.
          </motion.p>

          <motion.p
            variants={childVariants}
            className="text-sm leading-relaxed mb-10"
            style={{ color: "var(--color-muted)" }}
          >
            Based in Tokyo, I draw inspiration from the interplay of light and
            architecture, seeking to create images that evoke emotion and invite
            contemplation.
          </motion.p>

          {/* Skill pills */}
          <motion.div variants={childVariants} className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill.label}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase border rounded-full"
                style={{
                  borderColor: "var(--color-accent)",
                  color: "var(--color-accent)",
                  letterSpacing: "0.1em",
                  opacity: 0.8,
                }}
              >
                <skill.icon size={12} />
                {skill.label}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right — Image placeholder */}
      <motion.div
        className="w-full md:w-1/2 min-h-[40vh] md:min-h-screen relative overflow-hidden"
        variants={imageVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div
          className="absolute inset-4 md:inset-8 border"
          style={{ borderColor: "var(--color-accent)", opacity: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900" />
        </div>
      </motion.div>
    </section>
  );
}
