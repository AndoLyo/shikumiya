"use client";

import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { useSiteData } from "@/lib/SiteDataContext";

const floatingShapes = [
  { id: 1, shape: "circle", size: 60, top: "12%", left: "8%", color: "#FFE066", delay: 0 },
  { id: 2, shape: "circle", size: 40, top: "25%", right: "10%", color: "#7EC8E3", delay: 0.4 },
  { id: 3, shape: "circle", size: 80, bottom: "30%", left: "5%", color: "#A8E6CF", delay: 0.8 },
  { id: 4, shape: "circle", size: 30, top: "60%", right: "8%", color: "#FF7EB3", delay: 0.2 },
  { id: 5, shape: "circle", size: 50, bottom: "20%", right: "15%", color: "#FFE066", delay: 0.6 },
  { id: 6, shape: "star", size: 24, top: "18%", left: "30%", color: "#FF7EB3", delay: 1.0 },
  { id: 7, shape: "star", size: 18, bottom: "35%", right: "30%", color: "#7EC8E3", delay: 0.3 },
];

const floatAnim = {
  y: [-8, 8, -8],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export default function HeroSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "Hana";
  const subtitleText = data?.subtitle || "";
  const catchcopyText = data?.catchcopy || "";

  return (
    <section
      className="relative overflow-hidden pt-32 pb-0 md:pt-44"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Floating decorative shapes */}
      {floatingShapes.map((s) => (
        <motion.div
          key={s.id}
          className="pointer-events-none absolute"
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: (s as { left?: string }).left,
            right: (s as { right?: string }).right,
            bottom: (s as { bottom?: string }).bottom,
            opacity: 0.55,
          }}
          animate={{
            y: s.id % 2 === 0 ? [-8, 8, -8] : [8, -8, 8],
          }}
          transition={{
            duration: 3.5 + s.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        >
          {s.shape === "star" ? (
            <Star
              className="fill-current"
              style={{ color: s.color, width: s.size, height: s.size }}
            />
          ) : (
            <div
              className="rounded-full"
              style={{
                width: s.size,
                height: s.size,
                backgroundColor: s.color,
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        {/* Badge */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--color-surface)",
            color: "var(--color-accent)",
            border: "2px solid var(--color-border)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Sparkles className="h-4 w-4" />
          <span>イラストレーター ＆ AIアーティスト</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl"
          style={{ color: "var(--color-text)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          Hello! I&apos;m{" "}
          <span
            className="relative inline-block"
            style={{ color: "var(--color-accent)" }}
          >
            Hana
            {/* underline squiggle */}
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="8"
              viewBox="0 0 120 8"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2 6 Q30 2 60 6 Q90 10 118 6"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {" "}✨
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mb-10 max-w-lg text-lg leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
        >
          かわいい世界観を描き続けるイラストレーター。
          <br />
          AI生成とアナログの融合で、唯一無二の作品を。
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          <a
            href="#gallery"
            className="rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(255,126,179,0.5)] transition-all duration-200 hover:shadow-[0_6px_28px_rgba(255,126,179,0.6)] hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            作品を見る
          </a>
          <a
            href="#about"
            className="rounded-full border-2 px-8 py-3.5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            About me
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-14 flex items-center justify-center gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {[
            { num: "200+", label: "作品数" },
            { num: "5K+", label: "フォロワー" },
            { num: "3年", label: "制作歴" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-2xl font-extrabold"
                style={{ color: "var(--color-accent)" }}
              >
                {stat.num}
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Wavy SVG bottom divider */}
      <div className="relative mt-16 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 80"
          className="block w-full"
          preserveAspectRatio="none"
          height="80"
          aria-hidden="true"
          style={{ fill: "var(--color-surface)" }}
        >
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
