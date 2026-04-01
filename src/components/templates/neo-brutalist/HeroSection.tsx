"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const blockVariants = {
  hidden: (custom: { x: number; y: number }) => ({
    x: custom.x,
    y: custom.y,
    opacity: 0,
  }),
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 12,
      duration: 1.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

interface ColorBlock {
  id: number;
  bg: string;
  width: number;
  height: number;
  top: string;
  left: string;
  rotate: number;
  origin: { x: number; y: number };
}

export function HeroSection() {
  const blocks = useMemo<ColorBlock[]>(
    () => [
      {
        id: 0,
        bg: "#ff5722",
        width: 180,
        height: 140,
        top: "12%",
        left: "8%",
        rotate: 3,
        origin: { x: -300, y: -200 },
      },
      {
        id: 1,
        bg: "#2563eb",
        width: 120,
        height: 160,
        top: "55%",
        left: "75%",
        rotate: -6,
        origin: { x: 400, y: 100 },
      },
      {
        id: 2,
        bg: "#fbbf24",
        width: 200,
        height: 100,
        top: "30%",
        left: "60%",
        rotate: 5,
        origin: { x: 300, y: -300 },
      },
      {
        id: 3,
        bg: "#ff5722",
        width: 100,
        height: 180,
        top: "65%",
        left: "15%",
        rotate: -3,
        origin: { x: -400, y: 200 },
      },
    ],
    []
  );

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Colored blocks behind text */}
      {blocks.map((block) => (
        <motion.div
          key={block.id}
          custom={block.origin}
          variants={blockVariants}
          initial="hidden"
          animate="visible"
          className="absolute z-0"
          style={{
            width: block.width,
            height: block.height,
            top: block.top,
            left: block.left,
            backgroundColor: block.bg,
            border: "3px solid #1a1a1a",
            rotate: block.rotate,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="font-black uppercase leading-[0.9] tracking-[-0.05em]"
          style={{
            fontSize: "clamp(3rem, 10vw, 10rem)",
            color: "#1a1a1a",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          YOUR NAME
        </motion.h1>

        {/* Thick black horizontal rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="w-full h-1 bg-[#1a1a1a] origin-left mt-4 mb-6"
        />

        {/* Two-column info row */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="flex justify-between items-start"
        >
          <p className="font-mono text-sm text-[#1a1a1a]">
            デザイナー / デベロッパー
          </p>
          <p className="font-mono text-sm text-[#1a1a1a] text-right">
            東京拠点
          </p>
        </motion.div>
      </div>
    </section>
  );
}
