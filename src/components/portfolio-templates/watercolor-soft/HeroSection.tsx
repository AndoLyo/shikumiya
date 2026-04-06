"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

// Floating watercolor dots config
const floatingDots = [
  { id: 1, size: 72, top: "14%", left: "6%", color: "#7FB5D5", delay: 0, duration: 7 },
  { id: 2, size: 48, top: "20%", right: "8%", color: "#E8B4C8", delay: 0.6, duration: 8 },
  { id: 3, size: 96, bottom: "28%", left: "4%", color: "#8FBFA0", delay: 1.2, duration: 9 },
  { id: 4, size: 36, top: "55%", right: "6%", color: "#F0C9A6", delay: 0.3, duration: 6.5 },
  { id: 5, size: 56, bottom: "18%", right: "12%", color: "#7FB5D5", delay: 0.9, duration: 7.5 },
  { id: 6, size: 28, top: "35%", left: "18%", color: "#E8B4C8", delay: 1.5, duration: 8.5 },
  { id: 7, size: 44, top: "68%", left: "25%", color: "#F0C9A6", delay: 0.4, duration: 7.2 },
];

export default function HeroSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "Mizuki";
  const subtitleText = data?.subtitle || "Watercolor Artist";
  const catchcopyText = data?.catchcopy || "";

  return (
    <section
      className="relative overflow-hidden pt-36 pb-0 md:pt-48"
      style={{ backgroundColor: "var(--wc-bg)" }}
    >
      {/* Large watercolor splash SVG — background organic shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top left splash */}
        <svg
          className="absolute -top-16 -left-20 w-[520px] opacity-20"
          viewBox="0 0 400 380"
        >
          <defs>
            <radialGradient id="splash1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7FB5D5" stopOpacity="1" />
              <stop offset="100%" stopColor="#7FB5D5" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="190" rx="180" ry="170" fill="url(#splash1)" />
          <path
            d="M80,80 C120,40 220,60 280,120 C340,180 340,280 280,320 C220,360 120,340 80,280 C40,220 40,120 80,80Z"
            fill="url(#splash1)"
            opacity="0.6"
          />
        </svg>

        {/* Right side splash */}
        <svg
          className="absolute -top-8 -right-16 w-[440px] opacity-15"
          viewBox="0 0 400 360"
        >
          <defs>
            <radialGradient id="splash2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8B4C8" stopOpacity="1" />
              <stop offset="100%" stopColor="#E8B4C8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M50,60 C110,20 260,30 320,100 C380,170 360,300 280,340 C200,380 80,350 40,260 C0,170 -10,100 50,60Z"
            fill="url(#splash2)"
          />
        </svg>

        {/* Bottom center splash */}
        <svg
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] opacity-10"
          viewBox="0 0 500 200"
        >
          <defs>
            <radialGradient id="splash3" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#8FBFA0" stopOpacity="1" />
              <stop offset="100%" stopColor="#8FBFA0" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="250" cy="160" rx="240" ry="120" fill="url(#splash3)" />
        </svg>
      </div>

      {/* Floating watercolor dots */}
      {floatingDots.map((dot) => (
        <motion.div
          key={dot.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            top: dot.top,
            left: (dot as { left?: string }).left,
            right: (dot as { right?: string }).right,
            bottom: (dot as { bottom?: string }).bottom,
            backgroundColor: dot.color,
            opacity: 0.18,
            filter: "blur(2px)",
          }}
          animate={{
            y: dot.id % 2 === 0 ? [-10, 10, -10] : [10, -10, 10],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.delay,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        {/* Soft label */}
        <motion.p
          className="mb-5 text-sm font-medium tracking-[0.2em] uppercase"
          style={{ color: "var(--wc-blue)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {subtitleText || "Watercolor Artist"}
        </motion.p>

        {/* Main heading */}
        <motion.h1
          className="mb-6 text-5xl font-light leading-tight md:text-7xl"
          style={{ color: "var(--wc-text)", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        >
          {data ? (
            <span className="relative font-semibold" style={{ color: "var(--wc-blue)" }}>
              {artistName}
            </span>
          ) : (
            <>
              Painting the
              <br />
              <span
                className="relative font-semibold"
                style={{ color: "var(--wc-blue)" }}
              >
                Unseen
                {/* Watercolor underline SVG */}
                <svg
                  className="absolute -bottom-1 left-0 w-full overflow-visible"
                  height="12"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2,8 C40,2 80,10 120,6 C160,2 190,9 198,8"
                    stroke="var(--wc-pink)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                  <path
                    d="M10,10 C50,5 90,11 130,8 C170,5 195,10 200,9"
                    stroke="var(--wc-blue)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </svg>
              </span>
            </>
          )}
        </motion.h1>

        {/* Subtitle in italic style */}
        <motion.p
          className="mx-auto mb-10 max-w-md text-lg leading-relaxed italic"
          style={{ color: "var(--wc-text-muted)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
        >
          {catchcopyText || (!data ? (<>水彩の柔らかな色づかいで、<br />夢のような世界を描き続けています。</>) : "")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <a
            href="#works"
            className="rounded-full px-9 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_6px_24px_rgba(127,181,213,0.55)] hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--wc-blue)" }}
          >
            作品を見る
          </a>
          <a
            href="#about"
            className="rounded-full border px-9 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-white/50 hover:-translate-y-0.5"
            style={{
              borderColor: "var(--wc-border)",
              color: "var(--wc-text-muted)",
            }}
          >
            About me
          </a>
        </motion.div>

        {/* Soft stats */}
        {(() => {
          const displayStats = data
            ? (data.stats && data.stats.length > 0
                ? data.stats.slice(0, 3).map((s) => { const p = s.split(":"); return { num: p[0] || s, label: p[1] || "" }; })
                : [])
            : [
                { num: "150+", label: "作品数" },
                { num: "3K+", label: "フォロワー" },
                { num: "5年", label: "制作歴" },
              ];
          return displayStats.length > 0 ? (
            <motion.div
              className="mt-16 flex items-center justify-center gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {displayStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="text-2xl font-semibold"
                    style={{ color: "var(--wc-blue)" }}
                  >
                    {stat.num}
                  </p>
                  <p
                    className="mt-1 text-xs font-medium tracking-wide"
                    style={{ color: "var(--wc-text-muted)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          ) : null;
        })()}
      </div>

      {/* Organic wavy bottom — transitions into WorksSection */}
      <div className="relative mt-20 w-full overflow-hidden leading-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 100"
          className="block w-full"
          preserveAspectRatio="none"
          height="100"
          style={{ fill: "var(--wc-surface)" }}
        >
          <path d="M0,50 C180,100 360,10 540,55 C720,100 900,20 1080,60 C1260,100 1380,45 1440,55 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </section>
  );
}
