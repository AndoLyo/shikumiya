"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const works = [
  {
    id: "01",
    title: "墨の庭",
    titleEn: "Sumi Garden",
    category: "水墨画",
    src: "/portfolio/work_01.webp",
  },
  {
    id: "02",
    title: "静水面",
    titleEn: "Still Water",
    category: "風景",
    src: "/portfolio/work_03.webp",
  },
  {
    id: "03",
    title: "竹の声",
    titleEn: "Voice of Bamboo",
    category: "自然",
    src: "/portfolio/work_06.webp",
  },
  {
    id: "04",
    title: "朱の月",
    titleEn: "Vermillion Moon",
    category: "抽象",
    src: "/portfolio/work_09.webp",
  },
  {
    id: "05",
    title: "霧の峰",
    titleEn: "Misty Peak",
    category: "山水",
    src: "/portfolio/work_12.webp",
  },
  {
    id: "06",
    title: "花びら雨",
    titleEn: "Petal Rain",
    category: "花鳥",
    src: "/portfolio/work_15.webp",
  },
];

// Brush stroke underline for section heading
function BrushUnderline() {
  return (
    <svg
      className="mt-3"
      width="80"
      height="8"
      viewBox="0 0 80 8"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 4 C10 2, 25 6, 40 4 C55 2, 68 6, 78 4"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Ink dot scroll indicator
function InkDot({ active }: { active?: boolean }) {
  return (
    <span
      className="inline-block rounded-full transition-all duration-300"
      style={{
        width: active ? "18px" : "6px",
        height: "6px",
        backgroundColor: active
          ? "var(--color-accent)"
          : "var(--color-border)",
      }}
    />
  );
}

function WorkCard({ work, index }: { work: (typeof works)[number]; index: number }) {
  return (
    <motion.div
      className="group relative flex-shrink-0 cursor-pointer"
      style={{
        width: "240px",
        scrollSnapAlign: "start",
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
    >
      {/* Kakejiku (掛け軸) hanging scroll card */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "3/4",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "2px 4px 16px rgba(44, 44, 44, 0.08), inset 0 0 0 4px var(--color-surface)",
        }}
      >
        {/* Top decorative bar (scroll rod) */}
        <div
          className="absolute top-0 left-0 right-0 z-10 h-[6px]"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        {/* Bottom decorative bar */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 h-[6px]"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        {/* Image area — object-contain to preserve any aspect ratio */}
        <div
          className="absolute inset-[6px] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          <Image
            src={work.src}
            alt={work.title}
            fill
            className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="240px"
          />
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-[6px] z-20 flex items-end p-4 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
          style={{ background: "linear-gradient(to top, rgba(44,44,44,0.55) 0%, transparent 60%)" }}
        >
          <span
            className="text-xs tracking-[0.2em]"
            style={{ color: "var(--color-surface)" }}
          >
            詳しく見る
          </span>
        </div>

        {/* Ink number watermark */}
        <span
          className="absolute top-8 right-3 z-10 text-[2.5rem] font-bold leading-none select-none opacity-5 pointer-events-none"
          style={{ color: "var(--color-text)" }}
        >
          {work.id}
        </span>
      </div>

      {/* Title below card — vertical Japanese text */}
      <div className="mt-4 flex items-start gap-3">
        {/* Category badge */}
        <span
          className="mt-1 text-[10px] tracking-[0.15em] px-2 py-0.5 border flex-shrink-0"
          style={{
            borderColor: "var(--color-accent-secondary)",
            color: "var(--color-accent-secondary)",
          }}
        >
          {work.category}
        </span>
        <div>
          <p
            className="text-sm font-medium tracking-[0.08em]"
            style={{ color: "var(--color-text)" }}
          >
            {work.title}
          </p>
          <p
            className="text-xs mt-0.5 tracking-[0.1em]"
            style={{ color: "var(--color-text-muted)" }}
          >
            {work.titleEn}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorksSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="works"
      className="py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* Section header */}
      <div className="mx-auto max-w-6xl px-8 sm:px-12 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Selected Works
          </p>
          <h2
            className="text-2xl sm:text-3xl font-semibold tracking-[0.05em]"
            style={{ color: "var(--color-text)" }}
          >
            作品一覧
          </h2>
          <BrushUnderline />
        </motion.div>

        <motion.p
          className="mt-6 text-sm leading-loose max-w-lg"
          style={{ color: "var(--color-text-muted)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          墨の濃淡と余白が織りなす、静寂の世界。それぞれの作品に込められた
          <br className="hidden md:block" />
          息遣いを感じてください。
        </motion.p>
      </div>

      {/* Horizontal scrolling gallery */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto pb-6 px-8 sm:px-12"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Left spacer for alignment with content */}
        <div className="flex-shrink-0 w-0" aria-hidden="true" />

        {works.map((work, i) => (
          <WorkCard key={work.id} work={work} index={i} />
        ))}

        {/* End card — "see more" */}
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{ width: "200px", scrollSnapAlign: "start" }}
        >
          <div className="text-center">
            <div
              className="w-12 h-px mb-4 mx-auto"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <p
              className="text-xs tracking-[0.25em] leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              さらに
              <br />
              見る
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicators (ink dots) */}
      <div className="flex justify-center items-center gap-2 mt-8 px-8">
        {works.map((_, i) => (
          <InkDot key={i} active={i === 0} />
        ))}
      </div>

      {/* Brush stroke SVG at section bottom */}
      <div className="mx-auto max-w-6xl px-8 sm:px-12 mt-16">
        <svg
          width="100%"
          height="6"
          viewBox="0 0 1000 6"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 3 C80 1, 200 5, 350 3 C500 1, 650 5, 800 3 C900 1, 960 4, 1000 3"
            stroke="var(--color-border)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}
