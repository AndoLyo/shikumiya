"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const PARTICLE_COUNT = 50;

// Geometric shapes for moufdesign-inspired decoration
function GeometricDecorations() {
  return (
    <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
      {/* Triangles */}
      <motion.div
        className="absolute top-[12%] left-[8%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[52px] border-b-primary/[0.06]" />
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] right-[12%]"
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-gold/[0.06]" />
      </motion.div>

      {/* Squares */}
      <motion.div
        className="absolute top-[25%] right-[20%] w-16 h-16 border border-primary/[0.06] rotate-45"
        animate={{ scale: [1, 1.1, 1], rotate: [45, 55, 45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[30%] left-[15%] w-10 h-10 border border-gold/[0.05] rotate-12"
        animate={{ scale: [1, 0.9, 1], rotate: [12, -12, 12] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Circles */}
      <motion.div
        className="absolute top-[60%] left-[5%] w-20 h-20 rounded-full border border-primary/[0.04]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[15%] right-[5%] w-12 h-12 rounded-full border border-gold/[0.05]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Lines */}
      <div className="absolute top-[40%] left-0 w-[200px] h-px bg-gradient-to-r from-primary/[0.06] to-transparent" />
      <div className="absolute bottom-[40%] right-0 w-[150px] h-px bg-gradient-to-l from-gold/[0.05] to-transparent" />
    </div>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: (i * 37 + 13) % 100,
        y: (i * 53 + 7) % 100,
        size: 1 + (i % 5),
        duration: 6 + (i % 8) * 2,
        delay: (i % 6) * 1.2,
        isCyan: i % 5 !== 0,
        isLarge: i % 12 === 0,
      })),
    []
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  return (
    <section ref={sectionRef} id="hero" className="relative h-[180vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
        >
          <Image
            src="/portfolio/hero-main.webp"
            alt="Hero background"
            fill
            className="object-cover object-[center_25%]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 to-transparent h-[30%]" />
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0a0a0f_100%)]" />
        </motion.div>

        {/* Geometric decorations (moufdesign) */}
        <GeometricDecorations />

        {/* Floating particles with enhanced variety */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.isLarge ? p.size * 2 : p.size,
                height: p.isLarge ? p.size * 2 : p.size,
                background: p.isCyan
                  ? `rgba(0, 229, 255, ${p.isLarge ? 0.3 : 0.6})`
                  : `rgba(212, 168, 83, ${p.isLarge ? 0.25 : 0.5})`,
                boxShadow: p.isLarge
                  ? p.isCyan
                    ? "0 0 15px rgba(0, 229, 255, 0.3)"
                    : "0 0 15px rgba(212, 168, 83, 0.2)"
                  : "none",
              }}
              animate={{
                y: [0, -60 - (p.id % 3) * 20, 0],
                x: [0, p.id % 2 === 0 ? 25 : -25, 0],
                opacity: [0.05, p.isLarge ? 0.6 : 0.9, 0.05],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <motion.div
          className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {/* Subtitle tag */}
          <motion.div
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-text-secondary text-[11px] tracking-[0.3em] uppercase">
              AI Automation for Creators
            </span>
          </motion.div>

          {/* Catchcopy */}
          <motion.p
            className="font-serif text-white/90 text-xl sm:text-2xl md:text-3xl mb-5 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            SNS投稿も、記事執筆も、サムネ作成も。
            <br className="hidden sm:block" />
            <span className="text-shimmer">あなたの代わりにAIが動く仕組み</span>
            、作りませんか？
          </motion.p>

          {/* Main title - hiraomakoto bold typography */}
          <motion.h1
            className="font-serif text-white font-bold leading-none tracking-wider"
            style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            しくみや
          </motion.h1>

          {/* English subtitle with decorative elements */}
          <motion.div
            className="flex items-center gap-4 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/40" />
            <p className="font-mono text-primary text-xs sm:text-sm tracking-[0.3em] uppercase glow-text">
              Build Systems, Share Everything
            </p>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/40" />
          </motion.div>

          {/* Description */}
          <motion.p
            className="mt-8 max-w-[700px] text-text-secondary text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            専門特化したAIエージェントチームが、コンテンツ制作を丸ごと自動化。
            <br className="hidden sm:block" />
            記事の構成から執筆、SNS投稿、サムネイル設計まで —
            その仕組みと作り方を、すべて公開しています。
          </motion.p>

          {/* CTA buttons - Anthropic Learn filled + outline style */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <a
              href="#problem"
              className="group px-8 py-3.5 rounded-xl bg-primary text-[#0a0a0f] font-bold font-mono text-xs tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 flex items-center gap-2"
              data-cursor="pointer"
            >
              無料で仕組みを学ぶ
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://note.com/ando_lyo_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-3.5 rounded-xl border border-white/[0.12] text-text-secondary text-sm font-mono tracking-wider hover:text-white hover:border-white/25 hover:bg-white/[0.03] transition-all duration-300 flex items-center gap-2"
              data-cursor="pointer"
            >
              noteで記事を読む
              <svg
                className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 10L10 2M10 2H4M10 2V8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>

          <motion.p
            className="mt-4 text-text-muted text-xs font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            ※ すべての記事の70%は無料で公開中
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="font-mono text-[9px] text-text-muted tracking-[0.3em] uppercase">
            Scroll
          </span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10" />
      </div>
    </section>
  );
}
