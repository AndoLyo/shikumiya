"use client";

import { motion } from "framer-motion";

const skills = [
  "UI/UX Design",
  "Branding",
  "React / Next.js",
  "Figma",
  "Illustration",
  "Photography",
];

export default function AboutSection() {
  return (
    <section id="about" className="px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20">
        {/* Left — Image placeholder with decorative blob */}
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Blob behind image */}
          <svg
            className="pointer-events-none absolute -top-8 -left-8 z-0"
            width="340"
            height="340"
            viewBox="0 0 340 340"
            aria-hidden="true"
          >
            <path
              d="M170 30C240 30 310 80 320 160C330 240 280 310 200 325C120 340 40 290 25 210C10 130 100 30 170 30Z"
              fill="var(--color-accent)"
              opacity="0.15"
            />
          </svg>
          {/* Image placeholder */}
          <div
            className="relative z-10 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl"
            style={{
              background:
                "linear-gradient(160deg, #e8ddd0 0%, #c9b99a 100%)",
            }}
          >
            <div className="flex h-full items-center justify-center">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                Your Photo Here
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right — Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-accent-gold)" }}
          >
            About
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            はじめまして、太郎です。
          </h2>
          <p
            className="mt-6 leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            東京を拠点に活動するデザイナー・デベロッパーです。温かみのあるデザインで、人とブランドをつなげることを大切にしています。
          </p>
          <p
            className="mt-4 leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            仕事以外では、自然の中を散歩したり、新しいカフェを開拓したりするのが好きです。
          </p>

          {/* Skills tags */}
          <div className="mt-8 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border px-4 py-1.5 text-xs font-medium"
                style={{
                  borderColor: "var(--color-accent-gold)",
                  color: "var(--color-accent-gold)",
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
