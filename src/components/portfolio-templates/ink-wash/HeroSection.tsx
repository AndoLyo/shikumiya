"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

// Abstract ink splash / brush stroke SVG shapes
function InkSplash({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main large brush stroke blob */}
      <path
        d="M120 240 C100 180, 150 100, 230 80 C310 60, 420 90, 470 160 C520 230, 510 330, 450 380 C390 430, 290 440, 220 410 C150 380, 100 340, 90 290 C80 250, 100 240, 120 240Z"
        fill="var(--color-text)"
        opacity="0.07"
      />
      {/* Brush tail stroke top right */}
      <path
        d="M380 60 C400 40, 440 30, 470 50 C500 70, 495 100, 470 110 C445 120, 410 105, 395 90 C382 77, 375 68, 380 60Z"
        fill="var(--color-text)"
        opacity="0.05"
      />
      {/* Small ink drop bottom left */}
      <circle cx="85" cy="400" r="18" fill="var(--color-text)" opacity="0.04" />
      <circle cx="70" cy="415" r="8" fill="var(--color-text)" opacity="0.03" />
      {/* Thin ink stroke line */}
      <path
        d="M140 420 C180 410, 240 418, 290 415"
        stroke="var(--color-text)"
        strokeWidth="1"
        opacity="0.08"
        strokeLinecap="round"
      />
      {/* Accent vermillion drop */}
      <circle cx="490" cy="380" r="12" fill="var(--color-accent)" opacity="0.18" />
      <circle cx="503" cy="392" r="5" fill="var(--color-accent)" opacity="0.12" />
    </svg>
  );
}

// Paper texture via SVG noise filter
function PaperTexture() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <filter id="paper-noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#paper-noise)" opacity="0.035" />
    </svg>
  );
}

export default function HeroSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "SUMI SAI";
  const subtitleText = data?.subtitle || "";
  const catchcopyText = data?.catchcopy || "";

  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <PaperTexture />

      {/* Background ink splash decoration */}
      <motion.div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[55vw] max-w-[640px] opacity-0"
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
      >
        <InkSplash className="w-full h-auto" />
      </motion.div>

      {/* Secondary small splash top-left */}
      <motion.div
        className="pointer-events-none absolute left-0 top-20 w-[30vw] max-w-[280px] opacity-0"
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.6 }}
      >
        <svg viewBox="0 0 300 280" fill="none" aria-hidden="true">
          <path
            d="M40 140 C30 100, 60 50, 110 40 C160 30, 210 60, 230 110 C250 160, 230 210, 190 230 C150 250, 90 240, 60 210 C35 185, 35 160, 40 140Z"
            fill="var(--color-text)"
            opacity="0.045"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl w-full px-8 sm:px-12 pt-36 pb-24 flex flex-col md:flex-row items-start md:items-end gap-12">
        {/* Left: vertical calligraphy title */}
        <div className="flex gap-6 items-start">
          {/* Large vertical Japanese title */}
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
          >
            {(data ? artistName.split("").slice(0, 3) : ["墨", "の", "美"]).map((char, i) => (
              <span
                key={i}
                className="block text-[5rem] sm:text-[7rem] md:text-[8rem] leading-none font-bold select-none"
                style={{
                  color: "var(--color-text)",
                  writingMode: "vertical-rl",
                  letterSpacing: "0.05em",
                  animationDelay: `${i * 100}ms`,
                }}
              >
                {char}
              </span>
            ))}
          </motion.div>

          {/* Thin vertical accent line */}
          <motion.div
            className="hidden sm:block w-px self-stretch mt-4 mb-4"
            style={{ backgroundColor: "var(--color-accent)" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Right: subtitle + CTA */}
        <div className="flex-1 max-w-md">
          <motion.p
            className="text-xs tracking-[0.35em] uppercase mb-4"
            style={{ color: "var(--color-accent)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Ink Wash Portfolio
          </motion.p>

          <motion.h1
            className="text-2xl sm:text-3xl font-medium leading-relaxed mb-6"
            style={{ color: "var(--color-text)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            {catchcopyText || (!data ? (<>静謐な筆致で<br />世界を描く。</>) : "")}
          </motion.h1>

          <motion.p
            className="text-sm leading-loose mb-10"
            style={{ color: "var(--color-text-muted)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {subtitleText || (!data ? (<>日本の伝統美と現代のデジタルアートが交わる場所。<br />墨の濃淡が生み出す、唯一無二の表現世界へ。</>) : "")}
          </motion.p>

          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            <a
              href="#works"
              className="text-sm tracking-[0.2em] px-8 py-3 border transition-all duration-300 hover:opacity-75"
              style={{
                borderColor: "var(--color-text)",
                color: "var(--color-text)",
              }}
            >
              作品を見る
            </a>
            <a
              href="#about"
              className="text-sm tracking-[0.15em] transition-opacity hover:opacity-60"
              style={{ color: "var(--color-text-muted)" }}
            >
              紹介 →
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom ink brush stroke line */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <svg viewBox="0 0 120 8" fill="none" aria-hidden="true">
          <path
            d="M5 4 C20 2, 40 6, 60 4 C80 2, 100 6, 115 4"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}
