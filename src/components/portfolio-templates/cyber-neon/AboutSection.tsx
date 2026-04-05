"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSiteData } from "@/lib/SiteDataContext";

const STYLE = `
  @keyframes cn-cursor-blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  .cn-cursor {
    display: inline-block;
    width: 8px;
    height: 1em;
    background: var(--cn-cyan);
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: cn-cursor-blink 1s step-end infinite;
  }
  @keyframes cn-bar-fill {
    from { width: 0%; }
  }
  .cn-skill-bar {
    animation: cn-bar-fill 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes cn-hud-flash {
    0%, 90%, 100% { opacity: 1; }
    92%, 98% { opacity: 0.3; }
  }
  .cn-hud-stat {
    animation: cn-hud-flash 6s ease-in-out infinite;
  }
`;

const defaultTerminalLines = [
  { prefix: "> ", text: "NAME:", value: "AIアーティスト" },
  { prefix: "> ", text: "SPEC:", value: "サイバーパンク / SF / グリッチアート" },
  { prefix: "> ", text: "TOOL:", value: "Midjourney / Stable Diffusion / ComfyUI" },
  { prefix: "> ", text: "BASE:", value: "Tokyo, Japan // 2047.04.03" },
  { prefix: "> ", text: "MISSION:", value: "AIと人間の境界を溶かす作品を作り続ける" },
];

const defaultSkills = [
  { name: "Midjourney", level: 92, color: "var(--cn-cyan)" },
  { name: "Stable Diffusion", level: 85, color: "var(--cn-magenta)" },
  { name: "ComfyUI", level: 78, color: "var(--cn-lime)" },
  { name: "Post Processing", level: 88, color: "var(--cn-cyan)" },
];

const defaultHudStats = [
  { label: "WORKS", value: "200+" },
  { label: "CLIENTS", value: "48" },
  { label: "AWARDS", value: "12" },
];

function TerminalLines({ visible, lines }: { visible: boolean; lines: typeof defaultTerminalLines }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setVisibleCount(0);
    const timers = lines.map((_, i) =>
      setTimeout(() => setVisibleCount((prev) => Math.max(prev, i + 1)), i * 280 + 200)
    );
    return () => timers.forEach(clearTimeout);
  }, [visible, lines]);

  return (
    <div className="space-y-2 font-mono text-xs sm:text-sm">
      {lines.slice(0, visibleCount).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="flex gap-2"
        >
          <span style={{ color: "var(--cn-lime)" }}>{line.prefix}</span>
          <span style={{ color: "var(--cn-text-muted)" }}>{line.text}</span>
          <span style={{ color: "var(--cn-text)" }}>{line.value}</span>
        </motion.div>
      ))}
      {visibleCount < lines.length && (
        <div className="flex gap-2">
          <span style={{ color: "var(--cn-lime)" }}>&gt; </span>
          <span className="cn-cursor" />
        </div>
      )}
    </div>
  );
}

export function AboutSection() {
  const data = useSiteData();
  const [hasEntered, setHasEntered] = useState(false);

  const terminalLines = data ? [
    { prefix: "> ", text: "NAME:", value: data.artistName },
    ...(data.artStyle ? [{ prefix: "> ", text: "SPEC:", value: data.artStyle }] : []),
    ...(data.tools && data.tools.length > 0 ? [{ prefix: "> ", text: "TOOL:", value: data.tools.join(" / ") }] : []),
    ...(data.location ? [{ prefix: "> ", text: "BASE:", value: data.location }] : []),
    ...(data.motto ? [{ prefix: "> ", text: "MISSION:", value: data.motto }] : []),
  ] : defaultTerminalLines;

  const skills = data?.skills
    ? data.skills.map((s, i) => ({
        name: s,
        level: 80 + Math.floor(Math.random() * 15),
        color: ["var(--cn-cyan)", "var(--cn-magenta)", "var(--cn-lime)"][i % 3],
      }))
    : defaultSkills;

  const hudStats = data
    ? (data.stats && data.stats.length > 0
        ? data.stats.slice(0, 3).map((s) => {
            const parts = s.split(":");
            return { label: parts[1] || "", value: parts[0] || s };
          })
        : [])
    : defaultHudStats;

  const bioText = data?.bio || "AIと人間の感性が交わる境界線をテーマに作品を制作。サイバーパンクの美学をAIと融合させ、\n            見る者を近未来へと誘う体験を提供しています。";

  return (
    <section
      id="about"
      className="tpl-snap-section"
      style={{ background: "var(--cn-bg)" }}
    >
      <style>{STYLE}</style>

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Section label */}
      <div
        className="absolute top-6 left-8 z-20 font-mono text-xs tracking-[0.4em] uppercase"
        style={{ color: "var(--cn-cyan)", textShadow: "0 0 8px var(--cn-cyan)" }}
      >
        // 03_ABOUT
      </div>

      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-start"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        onViewportEnter={() => setHasEntered(true)}
        transition={{ duration: 0.4 }}
      >
        {/* Left — Terminal block */}
        <div className="flex flex-col gap-6">
          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-sm overflow-hidden"
            style={{
              border: "1px solid var(--cn-border)",
              boxShadow: "0 0 20px rgba(0,240,255,0.08)",
            }}
          >
            {/* Terminal titlebar */}
            <div
              className="px-4 py-2 flex items-center gap-2 font-mono text-xs"
              style={{
                background: "rgba(0,240,255,0.06)",
                borderBottom: "1px solid var(--cn-border)",
                color: "var(--cn-text-muted)",
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--cn-magenta)" }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--cn-lime)" }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--cn-cyan)" }}
              />
              <span className="ml-2 tracking-wider">SYSTEM_PROFILE.exe</span>
            </div>

            {/* Terminal body */}
            <div className="p-5" style={{ background: "rgba(10,10,20,0.8)" }}>
              <TerminalLines visible={hasEntered} lines={terminalLines} />
            </div>
          </motion.div>

          {/* HUD stats */}
          {hudStats.length > 0 && <div className="flex gap-4">
            {hudStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="cn-hud-stat flex-1 text-center p-3 rounded-sm"
                style={{
                  border: "1px solid var(--cn-border)",
                  background: "rgba(0,240,255,0.03)",
                  animationDelay: `${i * 2}s`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
              >
                <div
                  className="text-2xl sm:text-3xl font-black font-mono"
                  style={{
                    color: "var(--cn-cyan)",
                    textShadow: "0 0 12px var(--cn-cyan)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[10px] font-mono tracking-[0.3em] uppercase mt-1"
                  style={{ color: "var(--cn-text-muted)" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>}
        </div>

        {/* Right — Skill bars */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div>
            <h2
              className="text-2xl sm:text-3xl font-black font-mono uppercase mb-1"
              style={{
                color: "var(--cn-text)",
                textShadow: "0 0 20px rgba(224,224,255,0.2)",
              }}
            >
              SKILL_MATRIX
            </h2>
            <div
              className="h-px w-24"
              style={{
                background:
                  "linear-gradient(90deg, var(--cn-cyan), var(--cn-magenta), transparent)",
              }}
            />
          </div>

          <div className="space-y-5">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 + 0.4 }}
              >
                <div className="flex justify-between items-baseline mb-1.5">
                  <span
                    className="font-mono text-xs tracking-wider uppercase"
                    style={{ color: "var(--cn-text)" }}
                  >
                    {skill.name}
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: skill.color, textShadow: `0 0 8px ${skill.color}` }}
                  >
                    {skill.level}%
                  </span>
                </div>
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="cn-skill-bar h-full rounded-full"
                    style={{
                      width: `${skill.level}%`,
                      background: `linear-gradient(90deg, ${skill.color}, transparent)`,
                      boxShadow: `0 0 8px ${skill.color}`,
                      animationDelay: `${i * 0.15 + 0.5}s`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bio */}
          <p
            className="text-sm leading-relaxed font-mono mt-2 whitespace-pre-wrap"
            style={{ color: "var(--cn-text-muted)" }}
          >
            {bioText}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
