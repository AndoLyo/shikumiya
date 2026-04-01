"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function IntroSection() {
  return (
    <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-8">
      {/* Background subtle gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,57,70,0.03)_0%,_transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        {/* Name */}
        <h1
          className="text-[clamp(3rem,12vw,10rem)] font-bold leading-[0.9] tracking-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          YOUR NAME
        </h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 text-sm tracking-[0.3em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          クリエイティブディレクター / デジタルデザイナー
        </motion.p>

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          className="mx-auto mt-8 h-[2px] w-16 origin-left"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-12 flex items-center gap-3 text-xs tracking-[0.2em] uppercase"
        style={{ color: "var(--color-text-muted)" }}
      >
        <span>スクロールして探索</span>
        <motion.span
          animate={{ x: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowRight size={14} />
        </motion.span>
      </motion.div>
    </section>
  );
}
