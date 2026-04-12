"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="h-16 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/[0.06] flex items-center justify-center px-4 gap-3">
            <a
              href="https://note.com/ando_lyo_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 max-w-sm block text-center py-2.5 rounded-xl bg-primary text-[#0a0a0f] font-mono text-xs tracking-widest uppercase font-bold transition-all duration-300"
            >
              無料で記事を読む
            </a>
            <a
              href="https://note.com/ando_lyo_ai/membership"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl border border-gold/40 text-gold font-mono text-[10px] tracking-widest uppercase font-bold transition-all duration-300"
            >
              Join
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
