"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

const STYLE = `
  .fg-glass-card {
    background: rgba(28, 28, 38, 0.65);
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border: 1px solid var(--fg-border);
  }
  @keyframes fg-pill-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  .fg-pill {
    transition: all 0.3s ease;
  }
  .fg-pill:hover {
    background: rgba(108,99,255,0.2) !important;
    border-color: var(--fg-accent) !important;
    color: var(--fg-accent-light) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(108,99,255,0.2);
  }
  @keyframes fg-profile-ring {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.03); }
  }
  .fg-profile-ring {
    animation: fg-profile-ring 4s ease-in-out infinite;
  }
  .fg-about-bg-layer {
    background:
      radial-gradient(ellipse 70% 50% at 20% 60%, rgba(108,99,255,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 80% 30%, rgba(165,160,255,0.04) 0%, transparent 60%);
  }
`;

const SKILLS = [
  "Midjourney",
  "Stable Diffusion",
  "ComfyUI",
  "ControlNet",
  "Photoshop",
  "Lightroom",
  "LoRA Training",
  "プロンプト設計",
  "スタイル開発",
  "AI × 写真合成",
];

const STATS = [
  { value: "180+", label: "作品数" },
  { value: "3年", label: "AI創作歴" },
  { value: "12", label: "受賞歴" },
];

export function AboutSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "Yuki Sora";
  const subtitleText = data?.subtitle || "AI アーティスト";
  const locationText = data?.location || "Tokyo, Japan";
  const bioText = data?.bio || "";
  const profileImage = data?.profileImage;
  const displaySkills = data?.skills && data.skills.length > 0 ? data.skills : (data?.tools && data.tools.length > 0 ? data.tools : (data ? [] : SKILLS));
  const displayStats = data
    ? (data.stats && data.stats.length > 0
        ? data.stats.slice(0, 3).map((s) => { const p = s.split(":"); return { value: p[0] || s, label: p[1] || "" }; })
        : [])
    : STATS;

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 px-6 sm:px-10 overflow-hidden"
      style={{ background: "var(--fg-surface)" }}
    >
      <style>{STYLE}</style>

      {/* Parallax background layers */}
      <motion.div
        className="fg-about-bg-layer absolute inset-0 pointer-events-none"
        style={{ y: yParallax }}
      />

      {/* Floating background shapes */}
      <div
        className="absolute top-12 right-12 w-40 h-40 rounded-full pointer-events-none opacity-30"
        style={{
          border: "1px solid var(--fg-border)",
          background:
            "radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-16 left-8 w-24 h-24 rounded-lg pointer-events-none opacity-20"
        style={{
          border: "1px solid var(--fg-border)",
          transform: "rotate(20deg)",
        }}
      />

      {/* Section header */}
      <motion.div
        className="relative z-10 text-center mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p
          className="text-xs tracking-[0.5em] uppercase mb-3 font-medium"
          style={{ color: "var(--fg-accent)" }}
        >
          About
        </p>
        <h2
          className="text-4xl sm:text-5xl font-black tracking-tight"
          style={{ color: "var(--fg-text)" }}
        >
          アーティストについて
        </h2>
      </motion.div>

      {/* Main glass card */}
      <motion.div
        className="fg-glass-card relative z-10 max-w-4xl mx-auto rounded-2xl p-8 sm:p-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Gradient border top accent */}
        <div
          className="absolute top-0 left-12 right-12 h-px rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--fg-accent), var(--fg-accent-light), var(--fg-accent), transparent)",
            opacity: 0.6,
          }}
        />

        <div className="grid md:grid-cols-[200px_1fr] gap-10 items-start">
          {/* Left — Profile */}
          <motion.div
            className="flex flex-col items-center md:items-start gap-6"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {/* Profile image placeholder */}
            <div className="relative">
              {/* Outer ring */}
              <div
                className="fg-profile-ring absolute -inset-3 rounded-full"
                style={{
                  border: "1px solid rgba(108,99,255,0.3)",
                  boxShadow: "0 0 20px rgba(108,99,255,0.15)",
                }}
              />
              {/* Inner ring */}
              <div
                className="absolute -inset-1.5 rounded-full"
                style={{ border: "1px solid rgba(108,99,255,0.15)" }}
              />
              {/* Avatar */}
              <div
                className="w-28 h-28 rounded-full overflow-hidden"
                style={{
                  background: profileImage ? "var(--fg-surface)" :
                    "linear-gradient(135deg, var(--fg-surface) 0%, #2d2860 50%, var(--fg-accent) 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                {profileImage ? (
                  <img src={profileImage} alt={artistName} className="w-full h-full object-cover" />
                ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "radial-gradient(circle at 40% 35%, rgba(165,160,255,0.5) 0%, transparent 55%), radial-gradient(circle at 65% 65%, rgba(108,99,255,0.6) 0%, transparent 45%)",
                  }}
                />)}
              </div>
            </div>

            {/* Name */}
            <div className="text-center md:text-left">
              <h3
                className="text-xl font-bold"
                style={{ color: "var(--fg-text)" }}
              >
                {subtitleText}
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--fg-accent-light)" }}
              >
                {artistName}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--fg-text-muted)" }}
              >
                {locationText}
              </p>
            </div>

            {/* Stats */}
            {displayStats.length > 0 && <div className="flex flex-row md:flex-col gap-4 md:gap-3 w-full">
              {displayStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center md:text-left"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div
                    className="text-2xl font-black"
                    style={{ color: "var(--fg-accent-light)" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[11px] tracking-wider"
                    style={{ color: "var(--fg-text-muted)" }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>}
          </motion.div>

          {/* Right — Bio + Skills */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Bio */}
            <div>
              <h4
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--fg-text)" }}
              >
                創作について
              </h4>
              <div
                className="space-y-3 text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--fg-text-muted)" }}
              >
                {bioText ? <p>{bioText}</p> : (!data ? (<><p>
                  AIと人間の感性が交差する境界線をテーマに、浮遊するような幻想的な作品を制作しています。
                  3年前にMidjourneyと出会い、AIが持つ無限の可能性に魅了されてから、毎日新しい世界を生み出し続けています。
                </p>
                <p>
                  「重力から解放された美しさ」が一貫したテーマ。光と影が生み出す奥行き、
                  現実と幻想の境目を漂うような作品を通して、見る人の日常に宇宙的な静けさをお届けします。
                </p></>) : null)}
              </div>
            </div>

            {/* Skills */}
            {displaySkills.length > 0 && <div>
              <h4
                className="text-sm font-semibold mb-4 tracking-wider uppercase"
                style={{ color: "var(--fg-text)" }}
              >
                使用ツール・スキル
              </h4>
              <div className="flex flex-wrap gap-2">
                {displaySkills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    className="fg-pill text-xs px-3 py-1.5 rounded-full font-medium cursor-default"
                    style={{
                      background: "rgba(108,99,255,0.1)",
                      border: "1px solid rgba(108,99,255,0.2)",
                      color: "var(--fg-text-muted)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + i * 0.04,
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
