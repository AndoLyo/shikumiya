"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.05) 0%, #0c0c0c 70%)" }}
    >
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" as const }}
          className="text-4xl sm:text-5xl md:text-8xl font-serif font-bold"
          style={{ color: "#e8e8e8" }}
        >
          YOUR NAME
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" as const }}
          className="mx-auto mt-8 mb-6 origin-center"
          style={{ width: 60, height: 1, backgroundColor: "#6366f1" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-mono text-sm tracking-widest uppercase"
          style={{ color: "#6366f1" }}
        >
          クリエイティブ デベロッパー &amp; デザイナー
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
        >
          <ChevronDown size={24} style={{ color: "#6366f1" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
