"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useSiteData } from "./SiteDataContext";

// Speed lines SVG as inline component
function SpeedLines({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Radial speed lines emanating from center */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * 360;
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + Math.cos(rad) * 60;
        const y1 = 200 + Math.sin(rad) * 60;
        const x2 = 200 + Math.cos(rad) * 220;
        const y2 = 200 + Math.sin(rad) * 220;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--cp-border)"
            strokeWidth={i % 4 === 0 ? "2.5" : "1"}
            strokeOpacity={i % 3 === 0 ? "0.35" : "0.15"}
          />
        );
      })}
    </svg>
  );
}

// Star burst shape
function StarBurst({
  size,
  color,
  points = 8,
}: {
  size: number;
  color: string;
  points?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2;
  const innerR = size / 4;
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <polygon points={pts.join(" ")} fill={color} stroke="var(--cp-border)" strokeWidth="2" />
    </svg>
  );
}

export default function HeroSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "YUKI";
  const subtitleText = data?.subtitle || "マンガ作家 ＆ イラストレーター";
  const catchcopyText = data?.catchcopy || "";
  const heroImage = data?.heroImage;

  // Default description when no data
  const defaultDescription = (
    <>
      少年マンガからラブコメまで、
      <br />
      <span style={{ color: "var(--cp-red)" }}>圧倒的画力</span>
      でキャラクターに魂を込める。
      <br />
      AIとの融合で新時代のマンガを創造中！
    </>
  );

  return (
    <section
      className="relative overflow-hidden pt-28 pb-0 md:pt-36"
      style={{ backgroundColor: "var(--cp-bg)", minHeight: "90vh" }}
    >
      {/* Halftone background layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(26,26,26,0.07) 1px, transparent 1px)`,
          backgroundSize: "18px 18px",
        }}
      />

      {/* Speed lines behind title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <SpeedLines className="w-[600px] h-[600px] md:w-[900px] md:h-[900px] opacity-60" />
      </div>

      {/* Decorative star bursts */}
      <motion.div
        className="absolute top-24 left-6 md:left-16 pointer-events-none"
        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <StarBurst size={64} color="var(--cp-yellow)" />
      </motion.div>
      <motion.div
        className="absolute top-32 right-6 md:right-20 pointer-events-none"
        animate={{ rotate: [0, -20, 20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <StarBurst size={48} color="var(--cp-red)" points={6} />
      </motion.div>
      <motion.div
        className="absolute bottom-36 left-10 md:left-32 pointer-events-none"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <StarBurst size={40} color="var(--cp-blue)" points={6} />
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-8 md:right-28 pointer-events-none"
        animate={{ rotate: [0, -12, 12, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <StarBurst size={56} color="var(--cp-yellow)" />
      </motion.div>

      {/* BANG impact text */}
      <motion.div
        className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "backOut" }}
      >
        <span
          className="text-6xl md:text-8xl font-black uppercase italic"
          style={{
            color: "var(--cp-yellow)",
            WebkitTextStroke: "3px var(--cp-border)",
            textShadow: "5px 5px 0 var(--cp-border)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          BANG!
        </span>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-16 md:pt-20">
        {/* Genre badge */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-widest"
          style={{
            backgroundColor: "var(--cp-blue)",
            color: "#ffffff",
            border: "2.5px solid var(--cp-border)",
            borderRadius: "2px",
            boxShadow: "3px 3px 0 var(--cp-border)",
          }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          ★ {subtitleText} ★
        </motion.div>

        {/* Title with outline stroke */}
        <motion.h1
          className="mb-6 text-5xl font-black uppercase leading-none md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
        >
          <span
            style={{
              color: "var(--cp-bg)",
              WebkitTextStroke: "3px var(--cp-border)",
              display: "block",
              textShadow: "4px 4px 0 var(--cp-border)",
              letterSpacing: "-0.02em",
            }}
          >
            {artistName}
          </span>
          {!data && (
            <span
              style={{
                color: "var(--cp-red)",
                WebkitTextStroke: "3px var(--cp-border)",
                display: "block",
                textShadow: "4px 4px 0 var(--cp-border)",
                letterSpacing: "-0.02em",
                marginTop: "-0.1em",
              }}
            >
              COMICS
            </span>
          )}
        </motion.h1>

        {/* Description — action pose panel */}
        <motion.div
          className="mx-auto mb-8 max-w-lg px-6 py-4"
          style={{
            backgroundColor: "var(--cp-surface)",
            border: "3px solid var(--cp-border)",
            borderRadius: "0px",
            boxShadow: "6px 6px 0 var(--cp-border)",
            position: "relative",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Panel number */}
          <span
            className="absolute -top-3 -left-3 text-xs font-black px-1.5 py-0.5"
            style={{
              backgroundColor: "var(--cp-yellow)",
              border: "2px solid var(--cp-border)",
              color: "var(--cp-text)",
            }}
          >
            P.1
          </span>
          <p
            className="text-base font-bold leading-relaxed"
            style={{ color: "var(--cp-text)" }}
          >
            {catchcopyText || defaultDescription}
          </p>
        </motion.div>

        {/* CTA — speech bubble button */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <a
            href="#works"
            className="relative px-8 py-3.5 text-sm font-black uppercase tracking-wider text-white transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
            style={{
              backgroundColor: "var(--cp-red)",
              border: "3px solid var(--cp-border)",
              borderRadius: "4px",
              boxShadow: "5px 5px 0 var(--cp-border)",
            }}
          >
            作品を読む ▶
          </a>
          <a
            href="#about"
            className="relative px-8 py-3.5 text-sm font-black uppercase tracking-wider transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
            style={{
              backgroundColor: "var(--cp-yellow)",
              border: "3px solid var(--cp-border)",
              borderRadius: "4px",
              boxShadow: "5px 5px 0 var(--cp-border)",
              color: "var(--cp-text)",
            }}
          >
            ABOUT ME
          </a>
        </motion.div>

        {/* Stats row — comic panel style */}
        <motion.div
          className="mt-14 grid grid-cols-3 gap-0 mx-auto max-w-sm"
          style={{
            border: "3px solid var(--cp-border)",
            boxShadow: "5px 5px 0 var(--cp-border)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {(data?.stats
            ? data.stats.slice(0, 3).map((s) => {
                const parts = s.split(":");
                return { num: parts[0] || s, label: parts[1] || "" };
              })
            : [
                { num: "500+", label: "作品数" },
                { num: "10K+", label: "フォロワー" },
                { num: "5年", label: "制作歴" },
              ]
          ).map((stat, i) => (
            <div
              key={stat.label}
              className="py-4 text-center"
              style={{
                borderRight: i < 2 ? "3px solid var(--cp-border)" : "none",
                backgroundColor:
                  i === 0 ? "var(--cp-yellow)" : i === 1 ? "var(--cp-surface)" : "var(--cp-red)",
              }}
            >
              <p
                className="text-xl font-black"
                style={{ color: i === 2 ? "#ffffff" : "var(--cp-text)" }}
              >
                {stat.num}
              </p>
              <p
                className="text-[10px] font-bold uppercase tracking-wide"
                style={{ color: i === 2 ? "rgba(255,255,255,0.85)" : "var(--cp-text-muted)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-1 mt-10 pb-8"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: "var(--cp-text-muted)" }}
        >
          READ MORE
        </span>
        <ChevronDown size={20} style={{ color: "var(--cp-border)" }} />
      </motion.div>

      {/* Bottom panel border */}
      <div
        className="w-full mt-4"
        style={{ height: "6px", backgroundColor: "var(--cp-border)" }}
      />
    </section>
  );
}
