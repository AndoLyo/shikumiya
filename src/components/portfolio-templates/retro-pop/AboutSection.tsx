"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

const skills = [
  { label: "Procreate", bg: "var(--rp-orange)", color: "#fff" },
  { label: "Stable Diffusion", bg: "var(--rp-teal)", color: "#fff" },
  { label: "Midjourney", bg: "var(--rp-pink)", color: "#fff" },
  { label: "Adobe Illustrator", bg: "var(--rp-yellow)", color: "var(--rp-text)" },
  { label: "キャラクターデザイン", bg: "var(--rp-orange)", color: "#fff" },
  { label: "AIアート", bg: "var(--rp-teal)", color: "#fff" },
  { label: "コンセプトアート", bg: "var(--rp-pink)", color: "#fff" },
  { label: "SNS運用", bg: "var(--rp-yellow)", color: "var(--rp-text)" },
];

// Zigzag SVG divider
function ZigzagDivider({ color }: { color: string }) {
  return (
    <svg
      width="100%"
      height="30"
      viewBox="0 0 1200 30"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={Array.from({ length: 61 }, (_, i) => `${i * 20},${i % 2 === 0 ? 0 : 30}`).join(" ")}
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function AboutSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "RETRO";
  const bioText = data?.bio || "";
  const profileImage = data?.profileImage;

  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--rp-bg)" }}
    >
      {/* Zigzag top border */}
      <div style={{ backgroundColor: "var(--rp-surface)" }}>
        <ZigzagDivider color="var(--rp-border)" />
      </div>

      <div className="py-20 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Layout: two-column colored blocks */}
          <div className="flex flex-col md:flex-row gap-0 md:gap-0 overflow-hidden border-2" style={{ borderColor: "var(--rp-border)" }}>

            {/* Left block — teal */}
            <motion.div
              className="relative flex flex-col items-center justify-center p-10 md:p-14 md:w-2/5 shrink-0"
              style={{ backgroundColor: "var(--rp-teal)" }}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Profile circle with thick dashed border */}
              <div className="relative mb-6">
                {/* Outer dashed circle */}
                <div
                  className="absolute -inset-4 rounded-full border-4 border-dashed border-white/60 animate-spin"
                  style={{ animationDuration: "12s" }}
                />
                {/* Profile image placeholder */}
                <div
                  className="relative w-44 h-44 rounded-full border-4 flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: "var(--rp-yellow)",
                    borderColor: "var(--rp-border)",
                  }}
                >
                  <span className="text-7xl select-none" role="img" aria-label="プロフィール画像">
                    🎨
                  </span>
                </div>

                {/* Badge sticker */}
                <div
                  className="absolute -bottom-2 -right-2 px-3 py-1 border-2 rotate-6 text-xs font-black uppercase"
                  style={{
                    backgroundColor: "var(--rp-orange)",
                    borderColor: "var(--rp-border)",
                    color: "#fff",
                  }}
                >
                  PRO
                </div>
              </div>

              {/* Name */}
              <h3
                className="text-2xl font-black uppercase tracking-tight text-center mb-1"
                style={{ color: "#fff", WebkitTextStroke: "1px var(--rp-border)" }}
              >
                YUKI
              </h3>
              <p className="text-sm font-bold uppercase text-white/80 tracking-wider text-center">
                Illustrator / AI Artist
              </p>

              {/* Social dots */}
              <div className="mt-6 flex gap-3">
                {[
                  { label: "X", bg: "var(--rp-border)" },
                  { label: "IG", bg: "var(--rp-pink)" },
                  { label: "pixiv", bg: "var(--rp-orange)" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className="w-10 h-10 border-2 flex items-center justify-center text-[10px] font-black text-white transition-all duration-150 hover:-translate-y-1 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                    style={{
                      backgroundColor: s.bg,
                      borderColor: "var(--rp-border)",
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right block — cream */}
            <motion.div
              className="flex-1 p-10 md:p-14 border-t-2 md:border-t-0 md:border-l-2"
              style={{
                backgroundColor: "var(--rp-bg)",
                borderColor: "var(--rp-border)",
              }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              {/* Section label */}
              <p
                className="text-xs font-black uppercase tracking-widest mb-2"
                style={{ color: "var(--rp-orange)" }}
              >
                ★ ABOUT ME
              </p>
              <h2
                className="text-3xl font-black uppercase tracking-tight mb-6 md:text-4xl"
                style={{ color: "var(--rp-text)" }}
              >
                わたしについて
              </h2>

              {/* Quote block */}
              <div
                className="mb-6 px-5 py-4 border-l-4 rotate-[-0.5deg]"
                style={{
                  backgroundColor: "var(--rp-surface)",
                  borderColor: "var(--rp-orange)",
                  border: "2px solid var(--rp-border)",
                  borderLeft: "6px solid var(--rp-orange)",
                }}
              >
                <p
                  className="text-base italic font-bold leading-relaxed"
                  style={{ color: "var(--rp-text)" }}
                >
                  「90年代の大胆さと現代のAIを掛け合わせた、
                  まだ誰も見たことのないビジュアルを追い求めています。」
                </p>
              </div>

              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: "var(--rp-text-muted)" }}
              >
                2021年よりデジタルイラストをスタート。
                90年代ポップカルチャーとメンフィスデザインにインスパイアされた
                大胆な色使いと幾何学模様が持ち味。2023年よりAI画像生成を取り入れ、
                独自のレトロポップスタイルを確立。SNS・クライアントワークを通じて
                累計200点以上の作品を発表。
              </p>

              {/* Skills stickers */}
              <div>
                <p
                  className="text-xs font-black uppercase tracking-widest mb-3"
                  style={{ color: "var(--rp-text-muted)" }}
                >
                  SKILLS
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <motion.span
                      key={skill.label}
                      className="px-3 py-1.5 text-xs font-black uppercase tracking-wide border-2"
                      style={{
                        backgroundColor: skill.bg,
                        color: skill.color,
                        borderColor: "var(--rp-border)",
                        transform: `rotate(${(i % 3 - 1) * 1.5}deg)`,
                        display: "inline-block",
                      }}
                      whileHover={{ scale: 1.08, rotate: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {skill.label}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Zigzag bottom border */}
      <div style={{ backgroundColor: "var(--rp-yellow)" }}>
        <ZigzagDivider color="var(--rp-border)" />
      </div>
    </section>
  );
}
