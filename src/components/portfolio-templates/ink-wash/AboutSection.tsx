"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

// Skills as hanko (判子) seal stamp style
const skills = [
  { label: "水墨画", en: "Sumi-e" },
  { label: "水彩", en: "Watercolor" },
  { label: "AIアート", en: "AI Art" },
  { label: "デジタル", en: "Digital" },
  { label: "ポスター", en: "Poster" },
  { label: "装飾", en: "Ornamental" },
];

// Ink brush circle frame SVG — hanko / seal style for photo
function InkCircleFrame({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer imperfect ink circle */}
      <path
        d="M150 20 C200 18, 255 50, 272 100 C290 150, 278 215, 240 248 C202 282, 145 292, 98 272 C50 252, 22 202, 20 155 C18 108, 48 55, 95 30 C118 19, 135 20, 150 20Z"
        stroke="var(--color-text)"
        strokeWidth="3"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner thin circle */}
      <path
        d="M150 35 C195 34, 243 63, 258 108 C273 153, 262 208, 228 238 C194 268, 142 275, 100 255 C57 234, 34 188, 34 150 C34 112, 55 65, 95 44 C116 34, 132 35, 150 35Z"
        stroke="var(--color-text)"
        strokeWidth="0.8"
        fill="none"
        opacity="0.25"
      />
      {/* Ink brush gap effect — break in the circle top */}
      <path
        d="M148 20 C149 20, 151 20, 153 20"
        stroke="var(--color-bg)"
        strokeWidth="4"
        fill="none"
      />
    </svg>
  );
}

// Hanko seal stamp for skill
function HankoStamp({ label, en }: { label: string; en: string }) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center"
      style={{ width: "72px", height: "72px" }}
      whileHover={{ rotate: -5, scale: 1.08 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Outer square stamp border */}
      <div
        className="absolute inset-0 border-2"
        style={{ borderColor: "var(--color-accent)", opacity: 0.75 }}
      />
      {/* Inner border */}
      <div
        className="absolute inset-[4px] border"
        style={{ borderColor: "var(--color-accent)", opacity: 0.3 }}
      />
      {/* Label */}
      <span
        className="relative z-10 text-[11px] font-bold leading-tight text-center"
        style={{
          color: "var(--color-accent)",
          writingMode: "vertical-rl",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
      {/* English subtitle at bottom */}
      <span
        className="absolute bottom-1.5 text-[7px] tracking-wider"
        style={{ color: "var(--color-accent)", opacity: 0.6 }}
      >
        {en}
      </span>
    </motion.div>
  );
}

export default function AboutSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "墨彩";
  const bioText = data?.bio || "";
  const profileImage = data?.profileImage;

  return (
    <section
      id="about"
      className="py-24 md:py-36 px-8 sm:px-12"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left — ink-frame photo */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-[320px]">
              {/* Ink brush circle frame (decorative, behind) */}
              <InkCircleFrame className="absolute -inset-6 sm:-inset-8 z-0 pointer-events-none" />

              {/* Photo container — circular clip */}
              <div
                className="relative z-10 overflow-hidden"
                style={{
                  borderRadius: "50%",
                  aspectRatio: "1/1",
                  backgroundColor: "var(--color-border)",
                }}
              >
                {/* Photo placeholder — replace with Image */}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(145deg, #e8dfd0 0%, #c9b99a 60%, #a89270 100%)",
                  }}
                >
                  <span
                    className="text-sm tracking-[0.1em] text-center px-4"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    あなたの
                    <br />
                    写真
                  </span>
                </div>
              </div>

              {/* Vermillion seal stamp decoration */}
              <motion.div
                className="absolute -bottom-2 -right-2 z-20"
                initial={{ rotate: -12, scale: 0, opacity: 0 }}
                whileInView={{ rotate: -12, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
              >
                <div
                  className="w-14 h-14 flex items-center justify-center border-2"
                  style={{
                    borderColor: "var(--color-accent)",
                    backgroundColor: "rgba(199, 62, 58, 0.08)",
                  }}
                >
                  <span
                    className="text-[10px] font-bold leading-tight text-center"
                    style={{
                      color: "var(--color-accent)",
                      writingMode: "vertical-rl",
                    }}
                  >
                    印
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          >
            <p
              className="text-xs tracking-[0.35em] uppercase mb-4"
              style={{ color: "var(--color-accent-secondary)" }}
            >
              About
            </p>
            <h2
              className="text-2xl sm:text-3xl font-semibold tracking-[0.04em] mb-6 leading-snug"
              style={{ color: "var(--color-text)" }}
            >
              はじめまして、
              <br />
              <span style={{ color: "var(--color-accent-secondary)" }}>
                山田 蒼
              </span>
              です。
            </h2>

            <p
              className="text-sm leading-loose mb-5"
              style={{ color: "var(--color-text-muted)" }}
            >
              東京を拠点に活動する墨彩画家・デジタルアーティストです。
              伝統的な水墨画の技法とAI画像生成を融合させ、
              古代と未来が交わる独自の作品世界を追求しています。
            </p>

            <p
              className="text-sm leading-loose mb-10"
              style={{ color: "var(--color-text-muted)" }}
            >
              余白の美しさと、墨の偶然性を大切にしながら、
              見る人の心に静寂をもたらす作品を届けたいと思っています。
            </p>

            {/* Divider brush stroke */}
            <svg
              className="mb-8"
              width="60"
              height="4"
              viewBox="0 0 60 4"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2 C15 0.5, 35 3.5, 58 2"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Skills as hanko stamps */}
            <p
              className="text-xs tracking-[0.25em] mb-5"
              style={{ color: "var(--color-text-muted)" }}
            >
              専門分野
            </p>
            <div className="flex flex-wrap gap-4">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                >
                  <HankoStamp label={skill.label} en={skill.en} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
