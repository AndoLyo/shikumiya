"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const PARTICLE_COUNT = 30;

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: (i * 37 + 13) % 100,
        y: (i * 53 + 7) % 100,
        size: 1 + (i % 3),
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
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[150vh]"
    >
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
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
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
                  ? "0 0 6px rgba(0, 229, 255, 0.4)"
                  : "0 0 6px rgba(212, 168, 83, 0.3)",
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, p.id % 2 === 0 ? 15 : -15, 0],
                opacity: [0.2, 0.8, 0.2],
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
          {/* Presenter text */}
          <motion.p
            className="font-mono text-text-secondary text-xs tracking-[0.4em] uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI Automation for Creators & Solo Businesses
          </motion.p>

          {/* Catchcopy - visitor perspective */}
          <motion.p
            className="font-serif text-white/90 text-lg sm:text-2xl mb-2 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            SNS投稿も、記事執筆も、サムネ作成も。<br className="hidden sm:block" />
            あなたの代わりにAIが動く仕組み、作りませんか？
          </motion.p>

          {/* Main title */}
          <motion.h1
            className="font-serif text-white font-bold leading-none tracking-wider"
            style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            しくみや
          </motion.h1>

          {/* Subtitle */}
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
            <div className="w-12 h-px bg-primary/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="w-12 h-px bg-primary/30" />
          </motion.div>

          {/* Description - value for the visitor */}
          <motion.p
            className="mt-6 max-w-[700px] text-text-secondary text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            24体のAIエージェントが、コンテンツ制作を丸ごと自動化。<br className="hidden sm:block" />
            記事の構成から執筆、SNS投稿、サムネイル設計まで — その仕組みと作り方を、すべて公開しています。
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <a
              href="#problem"
              className="px-8 py-3 bg-primary/10 border border-primary text-primary font-mono text-xs tracking-widest uppercase hover:bg-primary/20 transition-all"
            >
              仕組みを見る
            </a>
            <a
              href="https://note.com/ando_lyo_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted text-sm font-mono tracking-wider hover:text-primary transition-colors"
            >
              → noteで記事を読む
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
