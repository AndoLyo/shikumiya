"use client";

import { motion } from "framer-motion";
import { useSiteData } from "./SiteDataContext";

const skills = [
  { label: "キャラクターデザイン", value: 95, color: "var(--cp-red)" },
  { label: "背景・パース", value: 82, color: "var(--cp-blue)" },
  { label: "デジタルペイント", value: 90, color: "var(--cp-yellow)" },
  { label: "AI画像生成", value: 88, color: "var(--cp-red)" },
  { label: "ストーリー構成", value: 78, color: "var(--cp-blue)" },
];

const onomatopoeia = [
  { text: "ドドド", top: "8%", left: "2%", rotate: -15, color: "var(--cp-red)", size: "1.6rem" },
  { text: "ゴゴゴ", bottom: "12%", right: "3%", rotate: 12, color: "var(--cp-border)", size: "1.4rem" },
  { text: "ビリビリ", top: "55%", left: "1%", rotate: -8, color: "var(--cp-blue)", size: "1.1rem" },
  { text: "ズキュン", top: "20%", right: "2%", rotate: 10, color: "var(--cp-yellow)", size: "1.2rem" },
];

function SkillBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-black uppercase tracking-wide" style={{ color: "var(--cp-text)" }}>
          {label}
        </span>
        <span
          className="text-sm font-black"
          style={{
            color: "#ffffff",
            backgroundColor: color,
            padding: "0 6px",
            border: "1.5px solid var(--cp-border)",
            borderRadius: "2px",
          }}
        >
          {value}
        </span>
      </div>
      <div
        className="relative h-5 overflow-hidden"
        style={{ border: "2.5px solid var(--cp-border)", backgroundColor: "#f0f0f0" }}
      >
        {/* Halftone fill background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(26,26,26,0.1) 1px, transparent 1px)`,
            backgroundSize: "8px 8px",
          }}
        />
        {/* Animated fill bar */}
        <motion.div
          className="absolute top-0 left-0 h-full"
          style={{ backgroundColor: color }}
          initial={{ width: "0%" }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        >
          {/* Diagonal stripes on bar */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 4px,
                rgba(255,255,255,0.5) 4px,
                rgba(255,255,255,0.5) 8px
              )`,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const data = useSiteData();
  const profileImage = data?.profileImage;
  const bioText = data?.bio || "";
  const mottoText = data?.motto || "";
  const artistName = data?.artistName || "YUKI";

  return (
    <section
      id="about"
      className="relative overflow-hidden py-20 px-5 sm:px-8"
      style={{
        backgroundColor: "var(--cp-surface)",
        borderTop: "4px solid var(--cp-border)",
        borderBottom: "4px solid var(--cp-border)",
      }}
    >
      {/* Background halftone */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(26,26,26,0.05) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Onomatopoeia decorations */}
      {onomatopoeia.map((o, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none font-black select-none"
          style={{
            top: o.top,
            left: (o as { left?: string }).left,
            right: (o as { right?: string }).right,
            bottom: (o as { bottom?: string }).bottom,
            rotate: `${o.rotate}deg`,
            color: o.color,
            fontSize: o.size,
            WebkitTextStroke: "1px var(--cp-border)",
            opacity: 0.4,
            letterSpacing: "0.05em",
            writingMode: "vertical-rl",
          }}
          animate={{ opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {o.text}
        </motion.div>
      ))}

      <div className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          className="mb-12 flex items-center gap-4"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="px-4 py-2"
            style={{
              backgroundColor: "var(--cp-blue)",
              border: "3px solid var(--cp-border)",
              boxShadow: "4px 4px 0 var(--cp-border)",
            }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-white">
              Chapter 02
            </span>
          </div>
          <h2
            className="text-3xl font-black uppercase md:text-4xl"
            style={{
              color: "var(--cp-text)",
              WebkitTextStroke: "1px var(--cp-border)",
              textShadow: "3px 3px 0 rgba(26,26,26,0.12)",
            }}
          >
            ABOUT
          </h2>
          <div
            className="flex-1 h-[3px]"
            style={{ backgroundColor: "var(--cp-border)" }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* Left: Profile panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile image — circular panel with thick border */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div
                  className="w-36 h-36 rounded-full overflow-hidden flex items-center justify-center"
                  style={{
                    border: "4px solid var(--cp-border)",
                    boxShadow: "6px 6px 0 var(--cp-border)",
                    background: profileImage ? "var(--cp-surface)" : "linear-gradient(135deg, #FFC107 0%, #E63946 100%)",
                  }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={artistName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl" role="img" aria-label="作者">
                      🎨
                    </span>
                  )}
                </div>
                {/* Status badge */}
                <div
                  className="absolute -bottom-2 -right-2 px-3 py-1 text-xs font-black text-white"
                  style={{
                    backgroundColor: "var(--cp-red)",
                    border: "2px solid var(--cp-border)",
                    borderRadius: "2px",
                    boxShadow: "2px 2px 0 var(--cp-border)",
                    transform: "rotate(3deg)",
                  }}
                >
                  漫画家
                </div>
              </div>
            </div>

            {/* Bio — speech bubble */}
            <div className="relative">
              {/* Speech bubble pointer */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "14px solid transparent",
                  borderRight: "14px solid transparent",
                  borderBottom: "16px solid var(--cp-border)",
                }}
              />
              <div
                className="absolute -top-[13px] left-1/2 -translate-x-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderBottom: "14px solid var(--cp-surface)",
                  zIndex: 1,
                }}
              />
              {/* Speech bubble body */}
              <div
                className="relative px-6 py-5"
                style={{
                  backgroundColor: "var(--cp-surface)",
                  border: "3px solid var(--cp-border)",
                  borderRadius: "8px",
                  boxShadow: "5px 5px 0 var(--cp-border)",
                }}
              >
                <p
                  className="text-sm font-bold leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--cp-text)" }}
                >
                  {bioText || (
                    <>
                      はじめまして、YUKIです！
                      <br />
                      少年誌でのデビュー経験を持つプロの漫画家。
                      <br />
                      アクションから日常系まで幅広いジャンルを手掛け、
                      <span style={{ color: "var(--cp-red)", fontWeight: 900 }}>
                        AIとの協働
                      </span>
                      で制作スピードを3倍に！
                      <br />
                      あなたの物語を最高のビジュアルで表現します。
                    </>
                  )}
                </p>

                {/* Data panels within speech bubble */}
                <div
                  className="mt-4 grid grid-cols-2 gap-[2px]"
                  style={{ border: "2px solid var(--cp-border)" }}
                >
                  {(data ? [
                    ...(data.location ? [{ label: "拠点", value: data.location }] : []),
                    ...(data.artStyle ? [{ label: "スタイル", value: data.artStyle }] : []),
                    ...(data.tools && data.tools.length > 0 ? [{ label: "ツール", value: data.tools.join(", ") }] : []),
                    ...(data.stats && data.stats.length > 0 ? [{ label: "実績", value: data.stats.join(", ") }] : []),
                  ] : [
                    { label: "拠点", value: "東京" },
                    { label: "スタイル", value: "少年〜青年" },
                    { label: "ツール", value: "CLIP STUDIO + AI" },
                    { label: "実績", value: "商業誌5本" },
                  ]).map((item, i) => (
                    <div
                      key={i}
                      className="px-3 py-2"
                      style={{
                        backgroundColor: i % 2 === 0 ? "#f8f8f0" : "var(--cp-surface)",
                        borderRight: i % 2 === 0 ? "2px solid var(--cp-border)" : "none",
                        borderBottom: i < 2 ? "2px solid var(--cp-border)" : "none",
                      }}
                    >
                      <p
                        className="text-[10px] font-black uppercase tracking-wider"
                        style={{ color: "var(--cp-text-muted)" }}
                      >
                        {item.label}
                      </p>
                      <p className="text-xs font-black mt-0.5" style={{ color: "var(--cp-text)" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Skills panel (only show when no custom data, or when skills provided) */}
          {(!data || (data.skills && data.skills.length > 0)) && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Skills header */}
              <div
                className="mb-5 px-4 py-2 inline-flex items-center gap-2"
                style={{
                  backgroundColor: "var(--cp-yellow)",
                  border: "2.5px solid var(--cp-border)",
                  boxShadow: "3px 3px 0 var(--cp-border)",
                }}
              >
                <span className="text-sm font-black uppercase tracking-wider" style={{ color: "var(--cp-text)" }}>
                  ⚡ POWER STATS
                </span>
              </div>

              {/* Skill bars */}
              <div
                className="p-5"
                style={{
                  border: "3px solid var(--cp-border)",
                  backgroundColor: "var(--cp-surface)",
                  boxShadow: "6px 6px 0 var(--cp-border)",
                }}
              >
                {(data?.skills
                  ? data.skills.map((s, i) => ({
                      label: s,
                      value: 80 + Math.floor(Math.random() * 15),
                      color: ["var(--cp-red)", "var(--cp-blue)", "var(--cp-yellow)"][i % 3],
                    }))
                  : skills
                ).map((skill, i) => (
                  <SkillBar
                    key={skill.label}
                    label={skill.label}
                    value={skill.value}
                    color={skill.color}
                    delay={0.3 + i * 0.12}
                  />
                ))}
              </div>

              {/* Awards / achievements — only show for demo (no data) */}
              {!data && (
                <div className="mt-6">
                  <div
                    className="mb-3 px-4 py-2 inline-flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--cp-border)",
                      border: "2.5px solid var(--cp-border)",
                    }}
                  >
                    <span className="text-sm font-black uppercase tracking-wider text-white">
                      🏆 ACHIEVEMENTS
                    </span>
                  </div>
                  <div
                    className="p-4 grid grid-cols-1 gap-2"
                    style={{
                      border: "3px solid var(--cp-border)",
                      boxShadow: "5px 5px 0 var(--cp-border)",
                    }}
                  >
                    {[
                      { icon: "🥇", text: "マンガ賞 準大賞受賞 2022" },
                      { icon: "📚", text: "週刊少年誌 連載経験あり" },
                      { icon: "🌐", text: "海外ファン 50カ国以上" },
                      { icon: "🤖", text: "AIコラボ 先駆者として登壇" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-3 py-2"
                        style={{
                          backgroundColor: i % 2 === 0 ? "#f8f8f0" : "transparent",
                          borderLeft: "3px solid var(--cp-yellow)",
                        }}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-xs font-bold" style={{ color: "var(--cp-text)" }}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
