"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const PARTICLE_COUNT = 40;

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: (i * 37 + 13) % 100,
        y: (i * 53 + 7) % 100,
        size: 1 + (i % 4),
        duration: 8 + (i % 7) * 2,
        delay: (i % 5) * 1.5,
        isCyan: i % 4 !== 0,
      })),
    []
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[160vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background image with parallax */}
        <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
          <Image
            src="/portfolio/hero-main.webp"
            alt="Hero background"
            fill
            className="object-cover object-[center_25%]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0a0a0f_100%)]" />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: p.isCyan
                  ? "rgba(0, 229, 255, 0.6)"
                  : "rgba(212, 168, 83, 0.5)",
                boxShadow: p.isCyan
                  ? "0 0 8px rgba(0, 229, 255, 0.4)"
                  : "0 0 8px rgba(212, 168, 83, 0.3)",
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, p.id % 2 === 0 ? 20 : -20, 0],
                opacity: [0.1, 0.9, 0.1],
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
          style={{ opacity: contentOpacity }}
        >
          {/* Subtitle tag */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-mono text-text-secondary text-[11px] tracking-[0.3em] uppercase">
              AI Automation for Creators
            </span>
          </motion.div>

          {/* Catchcopy */}
          <motion.p
            className="font-serif text-white/90 text-xl sm:text-2xl md:text-3xl mb-4 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            SNS投稿も、記事執筆も、サムネ作成も。<br className="hidden sm:block" />
            <span className="text-shimmer">あなたの代わりにAIが動く仕組み</span>、作りませんか？
          </motion.p>

          {/* Main title */}
          <motion.h1
            className="font-serif text-white font-bold leading-none tracking-wider"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            しくみや
          </motion.h1>

          {/* English subtitle */}
          <motion.p
            className="font-mono text-primary text-xs sm:text-sm tracking-[0.3em] uppercase mt-4 glow-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Build Systems, Share Everything
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="flex items-center gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/40" />
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/40" />
          </motion.div>

          {/* Description */}
          <motion.p
            className="mt-8 max-w-[700px] text-text-secondary text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            専門特化したAIエージェントチームが、コンテンツ制作を丸ごと自動化。<br className="hidden sm:block" />
            記事の構成から執筆、SNS投稿、サムネイル設計まで — その仕組みと作り方を、すべて公開しています。
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <a
              href="#problem"
              className="px-8 py-3.5 rounded-xl bg-primary/10 border border-primary/40 text-primary font-mono text-xs tracking-widest uppercase hover:bg-primary/20 hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              仕組みを見る
            </a>
            <a
              href="https://note.com/ando_lyo_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl border border-white/[0.08] text-text-secondary text-sm font-mono tracking-wider hover:text-white hover:border-white/20 transition-all duration-300"
            >
              → noteで記事を読む
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10" />
      </div>
    </section>
  );
}
