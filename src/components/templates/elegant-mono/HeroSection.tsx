"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { OrnamentalDivider } from "./OrnamentalDivider";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #222222 0%, #1a1a1a 50%, #111111 100%)",
      }}
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-8"
      >
        {/* Top ornament */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="flex justify-center"
        >
          <OrnamentalDivider width={160} color="#555555" />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-8xl font-normal tracking-[0.3em] uppercase"
          style={{
            color: "var(--color-text)",
            fontFamily: "'Georgia', serif",
          }}
        >
          Portfolio
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <OrnamentalDivider width={240} />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-lg md:text-xl italic tracking-[0.15em]"
          style={{ color: "var(--color-text-muted)" }}
        >
          デザインとクリエイティブ
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute left-1/2 -translate-x-1/2 mt-24"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "var(--color-text-muted)" }}
            >
              Scroll
            </span>
            <div
              className="w-px h-8"
              style={{ background: "var(--color-text-muted)" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
