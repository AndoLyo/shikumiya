"use client";

import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative z-10 flex h-screen items-center justify-center px-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[700px] rounded-3xl border border-white/[0.08] bg-white/[0.03] p-12 text-center shadow-2xl shadow-violet-500/5 backdrop-blur-2xl md:p-16"
      >
        {/* Violet dot */}
        <div className="mb-6 flex justify-center">
          <div className="h-2 w-2 rounded-full bg-violet-500" />
        </div>

        {/* Name */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white md:text-6xl">
          YOUR NAME
        </h1>

        {/* Gradient line */}
        <div className="my-6 flex justify-center">
          <div className="h-px w-[60px] bg-gradient-to-r from-violet-500 to-cyan-500" />
        </div>

        {/* Subtitle */}
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-white/50">
          クリエイティブ デベロッパー &amp; デザイナー
        </p>

        {/* Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#works"
            className="rounded-full border border-violet-500/30 bg-violet-500/20 px-6 py-2.5 font-mono text-xs text-violet-300 transition-colors hover:bg-violet-500/30"
          >
            作品を見る
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/[0.1] bg-white/[0.05] px-6 py-2.5 font-mono text-xs text-white/60 transition-colors hover:bg-white/[0.1]"
          >
            お問い合わせ
          </a>
        </div>
      </motion.div>
    </section>
  );
}
