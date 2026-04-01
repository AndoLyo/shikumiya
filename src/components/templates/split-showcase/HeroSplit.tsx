"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

const textVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      ease: "easeOut" as const,
      staggerChildren: 0.15,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const imageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" as const, delay: 0.3 },
  },
};

export function HeroSplit() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col md:flex-row overflow-hidden"
    >
      {/* Left half — Text */}
      <motion.div
        className="relative z-10 w-full md:w-1/2 min-h-[60vh] md:min-h-screen flex items-center justify-center px-10 md:px-16 lg:px-24"
        style={{ backgroundColor: "var(--color-bg)" }}
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-md">
          <motion.div
            variants={childVariants}
            className="mb-8"
          >
            <div
              className="h-[2px] w-[40px]"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
          </motion.div>

          <motion.h1
            variants={childVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold leading-[1.1] mb-6"
            style={{ color: "var(--color-text)" }}
          >
            YOUR
            <br />
            NAME
          </motion.h1>

          <motion.p
            variants={childVariants}
            className="text-sm font-mono uppercase mb-12"
            style={{
              color: "var(--color-accent)",
              letterSpacing: "0.3em",
            }}
          >
            フォトグラファー &amp; ビジュアルアーティスト
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            variants={childVariants}
            className="flex items-center gap-3 opacity-60"
            style={{ color: "var(--color-text)" }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" as const }}
            >
              <ChevronDown size={16} />
            </motion.div>
            <span
              className="text-xs font-mono uppercase"
              style={{ letterSpacing: "0.2em" }}
            >
              スクロールして探索
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Right half — Image placeholder */}
      <motion.div
        className="relative w-full md:w-1/2 min-h-[40vh] md:min-h-screen overflow-hidden"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900"
          style={{ y: imageY }}
        >
          {/* Subtle decorative grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
