"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useMemo } from "react";

function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: `${(i * 37 + 13) % 100}%`,
      y: `${(i * 53 + 7) % 100}%`,
      size: 2 + (i % 4),
      color: i % 2 === 0 ? "var(--color-accent-cyan)" : "var(--color-accent-pink)",
      duration: 4 + (i % 5),
      delay: (i % 7) * 0.3,
    }));
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

export function HeroSection() {
  return (
    <section
      className="tpl-snap-section"
      style={{
        background: "linear-gradient(180deg, #0a0a1a 0%, #121228 50%, #0a0a1a 100%)",
      }}
    >
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <Particles />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-8xl font-light tracking-widest"
          style={{ fontFamily: "'Georgia', serif" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          YOUR NAME
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl tracking-[0.3em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          クリエイティブ デベロッパー & デザイナー
        </motion.p>

        <motion.div
          className="tpl-ornament-line mt-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} style={{ color: "var(--color-text-muted)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
