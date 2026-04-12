"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-primary to-primary/60 origin-left z-50"
      style={{
        scaleX,
        boxShadow: "0 0 10px rgba(0, 229, 255, 0.6), 0 0 20px rgba(0, 229, 255, 0.2)",
      }}
    />
  );
}
