"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: image moves slower
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Year countdown: 2026 -> 1980
  const year = useTransform(scrollYProgress, [0, 1], [2026, 1980]);
  const yearOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8],
    [0, 1, 1, 0]
  );
  // Text fades
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[200vh]"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background image with parallax */}
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          <Image
            src="/portfolio/hero-main.webp"
            alt="Hero background"
            fill
            className="object-cover object-[center_25%]"
            priority
            sizes="100vw"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        </motion.div>

        {/* Year countdown overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ opacity: yearOpacity }}
        >
          <motion.span
            className="font-serif text-white/10 font-bold select-none"
            style={{ fontSize: "clamp(6rem, 20vw, 16rem)" }}
          >
            <YearDisplay year={year} />
          </motion.span>
        </motion.div>

        {/* Rewinding text */}
        <motion.div
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
          style={{ opacity: yearOpacity }}
        >
          <span className="font-mono text-primary/60 text-xs tracking-[0.5em] uppercase">
            Rewinding...
          </span>
        </motion.div>

        {/* Main content */}
        <motion.div
          className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: contentOpacity }}
        >
          {/* Presenter text */}
          <motion.p
            className="font-mono text-text-secondary text-xs tracking-[0.4em] uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI Prompt Engineer & System Architect
          </motion.p>

          {/* Catchcopy */}
          <motion.p
            className="font-serif text-white/90 text-lg sm:text-2xl mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            プロンプトで描く、未来のビジョン。
          </motion.p>

          {/* Main title */}
          <motion.h1
            className="font-serif text-white font-bold leading-none tracking-wider"
            style={{ fontSize: "clamp(2.5rem, 8vw, 8rem)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            LYO VISION
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="font-mono text-primary text-xs sm:text-sm tracking-[0.5em] uppercase mt-4 glow-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            AI Art &times; Autonomous Systems
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="flex items-center gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <div className="w-12 h-px bg-primary/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="w-12 h-px bg-primary/30" />
          </motion.div>

          {/* Activity time */}
          <motion.div
            className="mt-6 font-mono text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <span className="text-text-muted tracking-widest">Activity Since: </span>
            <span className="text-primary">2023 —</span>
          </motion.div>

          {/* Description */}
          <motion.p
            className="mt-6 max-w-[700px] text-text-secondary text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            AIアートプロンプトの研究3年。画像生成AIのプロンプト設計から、
            自律型AIエージェントシステムの開発まで。
            すべてのクリエイターに、テクノロジーの力を。
          </motion.p>

          {/* Quote */}
          <motion.p
            className="mt-4 text-white/80 text-base sm:text-lg font-serif italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.7 }}
          >
            &ldquo;出し惜しみしない。失敗も含めてすべて共有する。&rdquo;
          </motion.p>

          {/* Platforms */}
          <motion.div
            className="mt-6 flex items-center gap-3 text-text-muted text-xs font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.9 }}
          >
            <a href="https://note.com/ando_lyo_ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">note</a>
            <span className="text-primary/40">|</span>
            <a href="https://x.com/ando_lyo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">X</a>
            <span className="text-primary/40">|</span>
            <a href="https://github.com/ando-lyo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
            <span className="text-primary/40">|</span>
            <a href="https://www.instagram.com/ando_lyo_ai/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
          </motion.div>

          {/* CTA */}
          <motion.a
            href="https://note.com/ando_lyo_ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 text-primary text-sm font-mono tracking-wider hover:underline underline-offset-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.1 }}
          >
            → noteで活動をチェック
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// Year display component that rounds the motion value
function YearDisplay({ year }: { year: MotionValue<number> }) {
  const rounded = useTransform(year, (v: number) => Math.round(v));
  return <motion.span>{rounded}</motion.span>;
}
