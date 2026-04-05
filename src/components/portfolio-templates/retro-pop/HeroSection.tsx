"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

// Scattered geometric shape data
const shapes = [
  { id: 1, type: "circle", size: 80, top: "10%", left: "3%", color: "var(--rp-yellow)", rotate: 0, delay: 0 },
  { id: 2, type: "circle", size: 48, top: "20%", right: "5%", color: "var(--rp-teal)", rotate: 0, delay: 0.3 },
  { id: 3, type: "square", size: 56, top: "55%", left: "2%", color: "var(--rp-pink)", rotate: 20, delay: 0.6 },
  { id: 4, type: "circle", size: 36, bottom: "20%", right: "8%", color: "var(--rp-orange)", rotate: 0, delay: 0.2 },
  { id: 5, type: "square", size: 40, top: "15%", left: "48%", color: "var(--rp-teal)", rotate: 45, delay: 0.9 },
  { id: 6, type: "circle", size: 24, bottom: "35%", left: "20%", color: "var(--rp-pink)", rotate: 0, delay: 0.4 },
  { id: 7, type: "square", size: 32, bottom: "12%", right: "25%", color: "var(--rp-yellow)", rotate: 15, delay: 0.7 },
];

// Star SVG for sparkles
function Star({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

// Zigzag SVG
function Zigzag({ color }: { color: string }) {
  return (
    <svg width="120" height="20" viewBox="0 0 120 20" fill="none" aria-hidden="true">
      <polyline
        points="0,10 10,0 20,10 30,0 40,10 50,0 60,10 70,0 80,10 90,0 100,10 110,0 120,10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  );
}

export default function HeroSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "RETRO";
  const subtitleText = data?.subtitle || "";
  const catchcopyText = data?.catchcopy || "";

  return (
    <section
      className="relative overflow-hidden pt-36 pb-0 min-h-screen flex flex-col justify-center"
      style={{ backgroundColor: "var(--rp-bg)" }}
    >
      {/* Scattered geometric shapes */}
      {shapes.map((s) => (
        <motion.div
          key={s.id}
          className="pointer-events-none absolute"
          style={{
            width: s.size,
            height: s.size,
            top: (s as { top?: string }).top,
            left: (s as { left?: string }).left,
            right: (s as { right?: string }).right,
            bottom: (s as { bottom?: string }).bottom,
            rotate: s.rotate,
            opacity: 0.75,
          }}
          animate={{
            y: s.id % 2 === 0 ? [-10, 10, -10] : [10, -10, 10],
            rotate: [s.rotate, s.rotate + (s.id % 2 === 0 ? 8 : -8), s.rotate],
          }}
          transition={{
            duration: 3 + s.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        >
          {s.type === "circle" ? (
            <div
              className="w-full h-full rounded-full border-2"
              style={{
                backgroundColor: s.color,
                borderColor: "var(--rp-border)",
              }}
            />
          ) : (
            <div
              className="w-full h-full border-2"
              style={{
                backgroundColor: s.color,
                borderColor: "var(--rp-border)",
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Stars / sparkles */}
      <div className="pointer-events-none absolute top-[18%] left-[18%] opacity-80">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star size={28} color="var(--rp-orange)" />
        </motion.div>
      </div>
      <div className="pointer-events-none absolute bottom-[30%] right-[12%] opacity-70">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          <Star size={20} color="var(--rp-teal)" />
        </motion.div>
      </div>
      <div className="pointer-events-none absolute top-[45%] right-[22%] opacity-80">
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Star size={16} color="var(--rp-pink)" />
        </motion.div>
      </div>

      {/* Main content — deliberately asymmetric */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 pb-20">
        {/* Zigzag accent */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Zigzag color="var(--rp-orange)" />
        </motion.div>

        {/* Kicker badge */}
        <motion.div
          className="mb-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border-2"
          style={{
            backgroundColor: "var(--rp-teal)",
            borderColor: "var(--rp-border)",
            color: "#fff",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          ★ イラストレーター ＆ AIアーティスト ★
        </motion.div>

        {/* Big display heading */}
        <motion.h1
          className="font-black leading-none uppercase mb-4"
          style={{ color: "var(--rp-text)" }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          <span
            className="block text-[clamp(3rem,10vw,9rem)] tracking-tighter"
            style={{ transform: "rotate(-2deg)", display: "inline-block" }}
          >
            YUKI&apos;S
          </span>
          <span
            className="block text-[clamp(3rem,10vw,9rem)] tracking-tighter relative"
            style={{ transform: "rotate(1deg)", display: "inline-block" }}
          >
            <span
              className="relative z-10"
              style={{ color: "var(--rp-orange)", WebkitTextStroke: "3px var(--rp-border)" }}
            >
              PORTFOLIO
            </span>
          </span>
        </motion.h1>

        {/* Sub text + colored block */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-start gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
        >
          {/* Yellow block */}
          <div
            className="shrink-0 px-5 py-4 border-2 rotate-1"
            style={{ backgroundColor: "var(--rp-yellow)", borderColor: "var(--rp-border)" }}
          >
            <p
              className="text-sm font-black uppercase tracking-wider"
              style={{ color: "var(--rp-text)" }}
            >
              ✦ 200+ WORKS
            </p>
            <p
              className="text-sm font-black uppercase tracking-wider"
              style={{ color: "var(--rp-text)" }}
            >
              ✦ 5K FOLLOWERS
            </p>
            <p
              className="text-sm font-black uppercase tracking-wider"
              style={{ color: "var(--rp-text)" }}
            >
              ✦ 3 YEARS EXP.
            </p>
          </div>

          <div>
            <p
              className="text-base leading-relaxed max-w-md font-medium"
              style={{ color: "var(--rp-text-muted)" }}
            >
              大胆な色彩と遊び心あふれるスタイルで、
              <br />
              AIと手描きを融合した唯一無二の世界を表現。
              <br />
              90年代ポップカルチャーからインスパイアされた
              <br />
              エネルギッシュな作品を制作しています。
            </p>

            {/* CTA row */}
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="#works"
                className="inline-block px-7 py-3 text-sm font-black uppercase tracking-wider text-white border-2 transition-all duration-150 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1A1A2E] active:translate-y-0 active:shadow-none"
                style={{
                  backgroundColor: "var(--rp-orange)",
                  borderColor: "var(--rp-border)",
                }}
              >
                VIEW WORKS →
              </a>
              <a
                href="#about"
                className="inline-block px-7 py-3 text-sm font-black uppercase tracking-wider border-2 transition-all duration-150 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1A1A2E] active:translate-y-0 active:shadow-none"
                style={{
                  backgroundColor: "var(--rp-bg)",
                  borderColor: "var(--rp-border)",
                  color: "var(--rp-text)",
                }}
              >
                ABOUT ME
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom border stripe */}
      <div className="w-full flex" aria-hidden="true">
        {["var(--rp-orange)", "var(--rp-teal)", "var(--rp-yellow)", "var(--rp-pink)", "var(--rp-orange)", "var(--rp-teal)", "var(--rp-yellow)", "var(--rp-pink)"].map(
          (c, i) => (
            <div key={i} className="h-3 flex-1" style={{ backgroundColor: c }} />
          )
        )}
      </div>
    </section>
  );
}
