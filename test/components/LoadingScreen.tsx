"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
    }, 1200);

    // Prevent scroll during loading
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0f]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Geometric decorations */}
          <div className="absolute top-[15%] left-[10%] w-20 h-20 border border-primary/10 rotate-45" />
          <div className="absolute bottom-[20%] right-[15%] w-16 h-16 rounded-full border border-gold/10" />
          <div className="absolute top-[40%] right-[10%] w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[26px] border-b-primary/10" />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 bg-primary rounded-full" />
              <div>
                <p className="font-serif text-2xl font-bold text-white tracking-wide">
                  しくみや
                </p>
                <p className="font-mono text-[10px] tracking-[0.3em] text-text-secondary uppercase">
                  Build Systems, Share Everything
                </p>
              </div>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-px bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/60"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Transition mask slices (hiraomakoto inspired) */}
          <motion.div
            className="absolute inset-0 flex"
            initial={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="flex-1 bg-[#0a0a0f]"
                exit={{ scaleY: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{ transformOrigin: i === 1 ? "bottom" : "top" }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
