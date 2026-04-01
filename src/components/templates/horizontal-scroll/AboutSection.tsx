"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-8 py-32">
      {/* Background accent glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(230,57,70,0.04)_0%,_transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-xs tracking-[0.3em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          About
        </motion.p>

        {/* Large heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          ABOUT
        </motion.h2>

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-10 h-[2px] w-16 origin-left"
          style={{ backgroundColor: "var(--color-accent)" }}
        />

        {/* Bio text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 space-y-6"
        >
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-text)" }}>
            マルチメディアデザイナーとして、ブランディングからインタラクティブ体験まで幅広く手がけています。
          </p>
          <p className="leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            10年以上の経験で培った視点を活かし、心に残るビジュアル体験を提供します。
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 flex justify-center gap-16"
        >
          {[
            { number: "60+", label: "プロジェクト" },
            { number: "12", label: "年" },
            { number: "8", label: "受賞" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "var(--color-accent)" }}
              >
                {stat.number}
              </p>
              <p
                className="mt-1 text-xs tracking-[0.2em] uppercase"
                style={{ color: "var(--color-text-muted)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
