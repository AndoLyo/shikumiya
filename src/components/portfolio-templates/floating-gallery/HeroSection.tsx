"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const STYLE = `
  @keyframes fg-float-shape {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-18px) rotate(4deg); }
    66% { transform: translateY(-8px) rotate(-3deg); }
  }
  @keyframes fg-float-shape-2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    40% { transform: translateY(-24px) rotate(-5deg); }
    70% { transform: translateY(-10px) rotate(3deg); }
  }
  @keyframes fg-star-twinkle {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.6; }
  }
  @keyframes fg-scroll-bounce {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(8px); opacity: 0.5; }
  }
  .fg-shape-1 { animation: fg-float-shape 7s ease-in-out infinite; }
  .fg-shape-2 { animation: fg-float-shape-2 9s ease-in-out infinite; }
  .fg-shape-3 { animation: fg-float-shape 11s ease-in-out infinite reverse; }
  .fg-shape-4 { animation: fg-float-shape-2 8s ease-in-out infinite 2s; }
  .fg-scroll-bounce { animation: fg-scroll-bounce 2s ease-in-out infinite; }
  .fg-star { animation: fg-star-twinkle var(--twinkle-dur, 3s) ease-in-out infinite var(--twinkle-delay, 0s); }
  .fg-gradient-text {
    background: linear-gradient(135deg, var(--fg-accent-light) 0%, var(--fg-accent) 40%, #9D96FF 70%, var(--fg-text) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

/* Star field — static positions seeded for SSR safety */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: ((i * 137.508 + 42) % 100),
  y: ((i * 79.431 + 13) % 100),
  r: i % 3 === 0 ? 1.5 : i % 3 === 1 ? 1 : 0.75,
  dur: 2.5 + (i % 5) * 0.6,
  delay: (i % 7) * 0.4,
}));

/* Floating geometric shapes */
const SHAPES = [
  {
    className: "fg-shape-1",
    style: {
      top: "18%",
      left: "8%",
      width: 80,
      height: 80,
      borderRadius: "12px",
      border: "1px solid rgba(108,99,255,0.25)",
      background:
        "linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(165,160,255,0.04) 100%)",
      rotate: "25deg",
    },
  },
  {
    className: "fg-shape-2",
    style: {
      top: "55%",
      left: "5%",
      width: 50,
      height: 50,
      borderRadius: "50%",
      border: "1px solid rgba(108,99,255,0.2)",
      background: "rgba(108,99,255,0.05)",
    },
  },
  {
    className: "fg-shape-3",
    style: {
      top: "20%",
      right: "10%",
      width: 100,
      height: 100,
      border: "1px solid rgba(165,160,255,0.18)",
      background:
        "linear-gradient(225deg, rgba(165,160,255,0.06) 0%, transparent 100%)",
      rotate: "-15deg",
    },
  },
  {
    className: "fg-shape-4",
    style: {
      top: "65%",
      right: "8%",
      width: 60,
      height: 60,
      borderRadius: "50%",
      border: "1px solid rgba(108,99,255,0.15)",
      background: "rgba(165,160,255,0.04)",
    },
  },
  {
    className: "fg-shape-1",
    style: {
      top: "40%",
      left: "22%",
      width: 30,
      height: 30,
      borderRadius: "6px",
      background: "rgba(108,99,255,0.12)",
      rotate: "45deg",
    },
  },
  {
    className: "fg-shape-3",
    style: {
      top: "35%",
      right: "22%",
      width: 24,
      height: 24,
      borderRadius: "4px",
      background: "rgba(165,160,255,0.1)",
      rotate: "30deg",
    },
  },
];

function scrollToGallery() {
  const el = document.getElementById("gallery");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax layers
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const yFore = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--fg-bg)" }}
    >
      <style>{STYLE}</style>

      {/* Layer 1 (BG): Star field */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: yBg }}
      >
        {mounted && STARS.map((star) => (
          <div
            key={star.id}
            className="fg-star absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.r * 2,
              height: star.r * 2,
              background: "var(--fg-accent-light)",
              "--twinkle-dur": `${star.dur}s`,
              "--twinkle-delay": `${star.delay}s`,
            } as React.CSSProperties}
          />
        ))}
        {/* Radial glow center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(108,99,255,0.07) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Layer 2 (MID): Floating geometric shapes */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: yMid }}
      >
        {SHAPES.map((shape, i) => (
          <div
            key={i}
            className={`absolute ${shape.className}`}
            style={shape.style as React.CSSProperties}
          />
        ))}
      </motion.div>

      {/* Layer 3 (FORE): Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 select-none"
        style={{ y: yFore, opacity }}
      >
        {/* Eyebrow label */}
        <motion.p
          className="text-xs tracking-[0.5em] uppercase mb-6 font-medium"
          style={{ color: "var(--fg-accent-light)" }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          AI アーティスト ポートフォリオ
        </motion.p>

        {/* Main title */}
        <motion.h1
          className="fg-gradient-text text-6xl sm:text-8xl md:text-[10rem] font-black leading-none tracking-tight"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          FLOAT
        </motion.h1>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="text-6xl sm:text-8xl md:text-[10rem] font-black leading-none tracking-tight"
            style={{ color: "var(--fg-text)", opacity: 0.12 }}
          >
            GALLERY
          </h1>
          <h1
            className="fg-gradient-text text-6xl sm:text-8xl md:text-[10rem] font-black leading-none tracking-tight absolute inset-0"
            style={{ opacity: 0.9 }}
          >
            GALLERY
          </h1>
        </motion.div>

        {/* Divider line */}
        <motion.div
          className="my-8 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div
            className="h-px w-16"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--fg-accent))",
            }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--fg-accent)" }}
          />
          <div
            className="h-px w-16"
            style={{
              background:
                "linear-gradient(90deg, var(--fg-accent), transparent)",
            }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-sm sm:text-base max-w-md leading-relaxed"
          style={{ color: "var(--fg-text-muted)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          奥行きと光が交差する空間で、AIが生み出した作品たちが浮遊する。
          <br />
          没入型の3Dギャラリー体験へ。
        </motion.p>

        {/* CTA */}
        <motion.button
          onClick={scrollToGallery}
          className="mt-10 px-8 py-3 text-sm tracking-widest font-semibold rounded-full transition-all duration-300"
          style={{
            background:
              "linear-gradient(135deg, var(--fg-accent), rgba(108,99,255,0.7))",
            color: "var(--fg-text)",
            boxShadow:
              "0 0 24px rgba(108,99,255,0.35), 0 4px 24px rgba(0,0,0,0.4)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          whileHover={{
            scale: 1.05,
            boxShadow:
              "0 0 36px rgba(108,99,255,0.55), 0 8px 32px rgba(0,0,0,0.5)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          ENTER GALLERY
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8 }}
        style={{ opacity }}
      >
        <span
          className="text-[10px] tracking-[0.4em] uppercase"
          style={{ color: "var(--fg-text-muted)" }}
        >
          Scroll
        </span>
        <div className="fg-scroll-bounce">
          <ChevronDown size={16} style={{ color: "var(--fg-accent)" }} />
        </div>
      </motion.div>
    </section>
  );
}
