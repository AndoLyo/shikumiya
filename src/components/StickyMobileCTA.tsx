"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the first screen
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-primary/20 px-4 py-3">
            <Link
              href="/order"
              className="block w-full max-w-md mx-auto text-center py-3 rounded-xl bg-primary text-[#0a0a0f] text-sm font-bold tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
            >
              ¥980でサイトを作る →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
