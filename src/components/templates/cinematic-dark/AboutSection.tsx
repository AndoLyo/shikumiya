"use client";

import { motion } from "framer-motion";

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Figma",
  "Tailwind CSS",
  "Framer Motion",
  "Three.js",
];

export function AboutSection() {
  return (
    <section className="tpl-snap-section" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-16">
        {/* Left — decorative gradient blob */}
        <motion.div
          className="relative w-64 h-64 lg:w-80 lg:h-80 shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-40"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent-cyan), var(--color-accent-pink), transparent)",
            }}
          />
          <div
            className="absolute inset-4 rounded-full blur-xl opacity-30"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent-pink), var(--color-accent-cyan), transparent)",
            }}
          />
        </motion.div>

        {/* Right — text content */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.3em] mb-2"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            ABOUT
          </h2>
          <div className="tpl-ornament-line mb-8" />

          <p
            className="text-xl font-light mb-2"
            style={{ color: "var(--color-text)" }}
          >
            Your Name
          </p>
          <p
            className="text-sm tracking-widest uppercase mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            クリエイティブ デベロッパー / デザイナー
          </p>

          <p
            className="leading-relaxed mb-8 max-w-lg"
            style={{ color: "var(--color-text-muted)" }}
          >
            デザインとテクノロジーの交差点で、心に響く体験を生み出しています。一つひとつのプロジェクトに物語を込めて、見る人の記憶に残る作品を目指しています。
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-1.5 text-xs tracking-widest uppercase rounded-full border transition-colors duration-300 hover:border-[var(--color-accent-cyan)] hover:text-[var(--color-accent-cyan)]"
                style={{
                  borderColor: "var(--color-text-muted)",
                  color: "var(--color-text-muted)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
