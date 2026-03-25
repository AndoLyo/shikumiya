"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroSplash({
  onEnter,
}: {
  onEnter: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Background subtle gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.05)_0%,transparent_70%)]" />

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Year / Brand mark */}
            <motion.h1
              className="font-serif text-gold font-bold leading-none glow-gold select-none"
              style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              LYO VISION
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="font-mono text-gold-light/70 text-xs sm:text-sm tracking-[0.5em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              しくみや ― AIで仕組みを作り、全部公開する人
            </motion.p>

            {/* Decorative line */}
            <motion.div
              className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            />

            {/* Enter button */}
            <motion.button
              onClick={handleEnter}
              className="mt-8 px-10 py-3 border border-gold/50 text-gold font-mono text-sm tracking-[0.3em] uppercase
                         hover:bg-gold/10 hover:border-gold transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ENTER
            </motion.button>

            {/* Note */}
            <motion.p
              className="mt-4 text-text-muted text-xs font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.0 }}
            >
              AIで事業を回す、すべてを記録する
            </motion.p>
          </motion.div>

          {/* Corner decorations */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-gold/20" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-gold/20" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-gold/20" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-gold/20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
