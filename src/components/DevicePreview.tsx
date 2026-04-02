"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Smartphone, ExternalLink } from "lucide-react";

interface DevicePreviewProps {
  url: string;
  title?: string;
}

export default function DevicePreview({ url, title }: DevicePreviewProps) {
  const [mode, setMode] = useState<"pc" | "phone">("pc");

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Toggle buttons + external link */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMode("pc")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs tracking-wider transition-all duration-300 ${
            mode === "pc"
              ? "bg-primary text-[#0a0a0f]"
              : "bg-white/[0.05] text-text-muted hover:bg-white/[0.1]"
          }`}
        >
          <Monitor className="w-4 h-4" />
          PC
        </button>
        <button
          onClick={() => setMode("phone")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs tracking-wider transition-all duration-300 ${
            mode === "phone"
              ? "bg-primary text-[#0a0a0f]"
              : "bg-white/[0.05] text-text-muted hover:bg-white/[0.1]"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          スマホ
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/[0.05] text-text-muted hover:text-primary hover:bg-white/[0.1] font-mono text-xs tracking-wider transition-all duration-300"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          新しいタブで開く
        </a>
      </div>

      {/* Device frame */}
      <AnimatePresence mode="wait">
        {mode === "pc" ? (
          <motion.div
            key="pc"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[960px]"
          >
            {/* Laptop frame */}
            <div className="bg-[#1a1a1a] border border-white/[0.1] rounded-2xl p-2 pt-2">
              {/* Top bar (camera dot) */}
              <div className="flex justify-center mb-2">
                <div className="w-2 h-2 rounded-full bg-white/[0.15]" />
              </div>
              {/* Screen */}
              <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-white">
                <iframe
                  src={url}
                  title={title || "Preview"}
                  className="w-full h-full border-none"
                  loading="lazy"
                />
              </div>
            </div>
            {/* Laptop stand */}
            <div className="mx-auto w-[40%] h-3 bg-[#1a1a1a] border-x border-b border-white/[0.1] rounded-b-lg" />
            <div className="mx-auto w-[60%] h-1.5 bg-[#1a1a1a] border-x border-b border-white/[0.1] rounded-b-xl" />
          </motion.div>
        ) : (
          <motion.div
            key="phone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-[375px] max-w-full"
          >
            {/* Phone frame */}
            <div className="bg-[#1a1a1a] border-[3px] border-white/[0.15] rounded-[2.5rem] p-3 pt-3">
              {/* Notch */}
              <div className="flex justify-center mb-2">
                <div className="w-24 h-5 bg-[#0a0a0a] rounded-full" />
              </div>
              {/* Screen */}
              <div className="w-full aspect-[9/19.5] rounded-2xl overflow-hidden bg-white">
                <iframe
                  src={url}
                  title={title || "Preview"}
                  className="w-full h-full border-none"
                  loading="lazy"
                />
              </div>
              {/* Home indicator */}
              <div className="flex justify-center mt-3">
                <div className="w-28 h-1 bg-white/[0.2] rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
