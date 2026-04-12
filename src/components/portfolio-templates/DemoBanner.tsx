"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

/**
 * テンプレートデモページ上部に表示するしくみやCTAバナー。
 * 5秒後に自動で閉じる。手動で即閉じも可能。
 */
export default function DemoBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white text-center py-2.5 px-4 text-sm font-medium shadow-lg"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-3">
            <Link href="/start" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span>これはデモサイトです。このデザインでホームページを作りませんか？</span>
              <span className="bg-white/20 rounded-full px-3 py-0.5 text-xs font-bold inline-flex items-center gap-1">
                今すぐ始める <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
            <button onClick={() => setVisible(false)} className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer" aria-label="閉じる">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
