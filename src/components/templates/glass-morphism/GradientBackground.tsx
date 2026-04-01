"use client";

import { motion } from "framer-motion";

const orbs = [
  {
    className: "top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-500/30 blur-[120px]",
    animate: { x: [0, 30, -20, 0], y: [0, -40, 20, 0] },
    duration: 20,
  },
  {
    className: "top-[40%] right-[-5%] w-[450px] h-[450px] bg-cyan-500/25 blur-[100px]",
    animate: { x: [0, -25, 30, 0], y: [0, 30, -35, 0] },
    duration: 18,
  },
  {
    className: "bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-pink-500/20 blur-[140px]",
    animate: { x: [0, 20, -30, 0], y: [0, -25, 40, 0] },
    duration: 25,
  },
  {
    className: "top-[20%] left-[50%] w-[400px] h-[400px] bg-blue-500/15 blur-[100px]",
    animate: { x: [0, -30, 15, 0], y: [0, 40, -20, 0] },
    duration: 15,
  },
];

export function GradientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${orb.className}`}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />
      ))}
      {/* Noise / grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}
