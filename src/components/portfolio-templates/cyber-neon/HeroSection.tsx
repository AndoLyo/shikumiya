"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/* CSS animations injected once via a style tag */
const STYLE = `
  @keyframes cn-scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes cn-glitch-1 {
    0%, 94%, 100% { clip-path: inset(0 0 100% 0); transform: translateX(0); }
    95% { clip-path: inset(30% 0 50% 0); transform: translateX(-6px); }
    97% { clip-path: inset(10% 0 80% 0); transform: translateX(4px); }
  }
  @keyframes cn-glitch-2 {
    0%, 91%, 100% { clip-path: inset(0 0 100% 0); transform: translateX(0); }
    92% { clip-path: inset(60% 0 20% 0); transform: translateX(5px); }
    94% { clip-path: inset(80% 0 5% 0); transform: translateX(-3px); }
  }
  @keyframes cn-border-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  @keyframes cn-enter-pulse {
    0%, 100% { box-shadow: 0 0 10px var(--cn-cyan), 0 0 20px var(--cn-cyan); }
    50% { box-shadow: 0 0 20px var(--cn-cyan), 0 0 50px var(--cn-cyan), 0 0 80px rgba(0,240,255,0.3); }
  }
  .cn-scanline {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .cn-scanline::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(0, 240, 255, 0.06);
    animation: cn-scanline 4s linear infinite;
    box-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
  }
  .cn-grid-bg {
    background-image:
      linear-gradient(rgba(0,240,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,240,255,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .cn-glitch-title {
    position: relative;
  }
  .cn-glitch-title::before {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: var(--cn-magenta);
    animation: cn-glitch-1 8s ease-in-out infinite;
  }
  .cn-glitch-title::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: var(--cn-cyan);
    animation: cn-glitch-2 8s ease-in-out infinite;
  }
  .cn-neon-frame {
    position: absolute;
    inset: 12px;
    pointer-events: none;
    animation: cn-border-pulse 3s ease-in-out infinite;
  }
  .cn-neon-frame::before, .cn-neon-frame::after {
    content: '';
    position: absolute;
    border: 1px solid var(--cn-cyan);
    box-shadow: 0 0 8px var(--cn-cyan), inset 0 0 8px rgba(0,240,255,0.05);
  }
  .cn-neon-frame::before {
    inset: 0;
  }
  .cn-neon-frame::after {
    inset: 6px;
    border-color: rgba(0,240,255,0.3);
  }
  .cn-enter-btn {
    animation: cn-enter-pulse 2.5s ease-in-out infinite;
  }
`;

function scrollToWorks() {
  const container = document.querySelector(".tpl-snap-container");
  if (!container) return;
  container.scrollTo({ top: container.clientHeight, behavior: "smooth" });
}

export function HeroSection() {
  return (
    <section
      className="tpl-snap-section cn-grid-bg"
      style={{ background: "var(--cn-bg)" }}
    >
      <style>{STYLE}</style>

      {/* Scanline overlay */}
      <div className="cn-scanline" />

      {/* Neon corner frame */}
      <div className="cn-neon-frame" />

      {/* Corner decorations */}
      {[
        "top-3 left-3",
        "top-3 right-3 rotate-90",
        "bottom-3 left-3 -rotate-90",
        "bottom-3 right-3 rotate-180",
      ].map((pos, i) => (
        <svg
          key={i}
          className={`absolute ${pos} w-6 h-6 pointer-events-none`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M0 12 L0 0 L12 0"
            stroke="var(--cn-cyan)"
            strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 0 4px var(--cn-cyan))" }}
          />
        </svg>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 select-none">
        {/* Eyebrow */}
        <motion.p
          className="text-xs font-mono tracking-[0.5em] uppercase mb-6"
          style={{ color: "var(--cn-cyan)", textShadow: "0 0 10px var(--cn-cyan)" }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          // AIアート ポートフォリオ
        </motion.p>

        {/* Glitch title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h1
            className="cn-glitch-title text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase"
            data-text="CYBER.EXE"
            style={{
              color: "var(--cn-text)",
              fontFamily: "'Courier New', monospace",
              textShadow: "0 0 30px rgba(224,224,255,0.3)",
            }}
          >
            CYBER.EXE
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-4 text-sm sm:text-base font-mono tracking-[0.25em]"
          style={{ color: "var(--cn-text-muted)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          サイバーパンク & SFアート / AI生成作品集
        </motion.p>

        {/* Divider */}
        <motion.div
          className="my-8 h-px w-48"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--cn-cyan), var(--cn-magenta), transparent)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        />

        {/* Enter button */}
        <motion.button
          onClick={scrollToWorks}
          className="cn-enter-btn px-10 py-3 font-mono text-sm tracking-[0.4em] uppercase border transition-all duration-300"
          style={{
            color: "var(--cn-cyan)",
            borderColor: "var(--cn-cyan)",
            background: "rgba(0,240,255,0.05)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          whileHover={{
            background: "rgba(0,240,255,0.12)",
            letterSpacing: "0.6em",
          }}
          whileTap={{ scale: 0.97 }}
        >
          ENTER
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span
          className="text-[10px] font-mono tracking-[0.3em] uppercase"
          style={{ color: "var(--cn-text-muted)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} style={{ color: "var(--cn-cyan)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
