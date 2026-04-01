"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-24 md:pt-44 md:pb-32">
      {/* SVG geometric triangle pattern — decorative background */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="triangles"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 10 L70 70 L10 70 Z"
              fill="none"
              stroke="var(--color-accent-gold)"
              strokeWidth="0.5"
              opacity="0.12"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#triangles)" />
      </svg>

      {/* SVG blob — yellow accent behind text */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <svg
          width="700"
          height="600"
          viewBox="0 0 700 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M350 50C480 50 620 120 650 250C680 380 600 500 450 540C300 580 120 520 70 380C20 240 220 50 350 50Z"
            fill="var(--color-accent)"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.h1
          className="text-4xl font-bold leading-tight tracking-tight md:text-6xl"
          style={{ color: "var(--color-text)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          心地よいデザインを、
          <br />
          <span style={{ color: "var(--color-accent-gold)" }}>あなたに。</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          温かみのある色合いと、丁寧なレイアウト。
          <br />
          人を招き入れるデジタル空間をつくります。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <a
            href="#works"
            className="mt-10 inline-block rounded-full px-8 py-3 text-sm font-semibold shadow-md transition-transform hover:scale-105"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text)",
            }}
          >
            作品を見る
          </a>
        </motion.div>
      </div>

      {/* Bottom decorative triangles */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-full"
        height="60"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 60 L720 10 L1440 60 Z"
          fill="var(--color-bg)"
          opacity="0.6"
        />
      </svg>
    </section>
  );
}
