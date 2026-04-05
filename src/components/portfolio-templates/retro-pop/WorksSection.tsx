"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useSiteData } from "@/lib/SiteDataContext";

type WorkItem = {
  id: number;
  title: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  gradient: string;
  emoji: string;
  // CSS Grid placement
  colSpan: number; // 1 or 2
  rowSpan: number; // 1 or 2
  rotation: number; // degrees, -5 to 5
};

const works: WorkItem[] = [
  {
    id: 1,
    title: "ネオンシティの夜",
    category: "CG/デジタル",
    categoryColor: "#fff",
    categoryBg: "var(--rp-orange)",
    gradient: "linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)",
    emoji: "🌆",
    colSpan: 2,
    rowSpan: 2,
    rotation: -2,
  },
  {
    id: 2,
    title: "レトロガール",
    category: "キャラクター",
    categoryColor: "#fff",
    categoryBg: "var(--rp-pink)",
    gradient: "linear-gradient(135deg, #EF476F 0%, #FF7EB3 100%)",
    emoji: "💃",
    colSpan: 1,
    rowSpan: 1,
    rotation: 3,
  },
  {
    id: 3,
    title: "Y2Kドリーム",
    category: "AIアート",
    categoryColor: "var(--rp-text)",
    categoryBg: "var(--rp-yellow)",
    gradient: "linear-gradient(135deg, #FFD166 0%, #FFE599 100%)",
    emoji: "✨",
    colSpan: 1,
    rowSpan: 2,
    rotation: 2,
  },
  {
    id: 4,
    title: "ポップアートクイーン",
    category: "イラスト",
    categoryColor: "#fff",
    categoryBg: "var(--rp-teal)",
    gradient: "linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%)",
    emoji: "👑",
    colSpan: 1,
    rowSpan: 1,
    rotation: -3,
  },
  {
    id: 5,
    title: "メンフィスパターン",
    category: "デザイン",
    categoryColor: "#fff",
    categoryBg: "var(--rp-orange)",
    gradient: "linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)",
    emoji: "◆",
    colSpan: 1,
    rowSpan: 1,
    rotation: 4,
  },
  {
    id: 6,
    title: "サイバーポップ",
    category: "AIアート",
    categoryColor: "var(--rp-text)",
    categoryBg: "var(--rp-yellow)",
    gradient: "linear-gradient(135deg, #FFD166 0%, #06D6A0 100%)",
    emoji: "🤖",
    colSpan: 2,
    rowSpan: 1,
    rotation: -1,
  },
  {
    id: 7,
    title: "カセットテープの夢",
    category: "CG/デジタル",
    categoryColor: "#fff",
    categoryBg: "var(--rp-pink)",
    gradient: "linear-gradient(135deg, #EF476F 0%, #9B5DE5 100%)",
    emoji: "📼",
    colSpan: 1,
    rowSpan: 2,
    rotation: -2,
  },
  {
    id: 8,
    title: "ストリートアート",
    category: "イラスト",
    categoryColor: "#fff",
    categoryBg: "var(--rp-teal)",
    gradient: "linear-gradient(135deg, #00B4D8 0%, #EF476F 100%)",
    emoji: "🎨",
    colSpan: 1,
    rowSpan: 1,
    rotation: 3,
  },
  {
    id: 9,
    title: "バブルガムポップ",
    category: "キャラクター",
    categoryColor: "#fff",
    categoryBg: "var(--rp-orange)",
    gradient: "linear-gradient(135deg, #FF6B35 0%, #EF476F 100%)",
    emoji: "🫧",
    colSpan: 1,
    rowSpan: 1,
    rotation: -4,
  },
];

export default function WorksSection() {
  const siteData = useSiteData();
  const hasDataWorks = siteData?.works && siteData.works.length > 0;

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section
      id="works"
      className="py-20 px-5 sm:px-8"
      style={{ backgroundColor: "var(--rp-surface)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div>
              <p
                className="mb-2 text-xs font-black uppercase tracking-widest"
                style={{ color: "var(--rp-orange)" }}
              >
                ★ PORTFOLIO
              </p>
              <h2
                className="text-4xl font-black uppercase tracking-tight md:text-6xl"
                style={{ color: "var(--rp-text)" }}
              >
                MY WORKS
              </h2>
            </div>
            {/* Sticker accent */}
            <div
              className="shrink-0 mb-1 px-4 py-2 border-2 rotate-3 inline-flex items-center gap-1 self-start sm:self-end"
              style={{
                backgroundColor: "var(--rp-teal)",
                borderColor: "var(--rp-border)",
                color: "#fff",
              }}
            >
              <span className="text-xs font-black uppercase">ALL ORIGINALS</span>
            </div>
          </div>

          {/* Thick bottom underline */}
          <div
            className="mt-4 h-1.5 w-24"
            style={{ backgroundColor: "var(--rp-orange)", border: "1px solid var(--rp-border)" }}
          />
        </motion.div>

        {/* Collage grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "180px",
          }}
        >
          {works.map((work, index) => {
            const isHovered = hoveredId === work.id;
            return (
              <motion.div
                key={work.id}
                className="relative cursor-pointer overflow-hidden border-[3px] group"
                style={{
                  gridColumn: `span ${work.colSpan}`,
                  gridRow: `span ${work.rowSpan}`,
                  borderColor: "var(--rp-border)",
                  background: work.gradient,
                  transform: `rotate(${work.rotation}deg)`,
                  transformOrigin: "center center",
                  boxShadow: isHovered
                    ? `6px 6px 0px var(--rp-border)`
                    : `3px 3px 0px var(--rp-border)`,
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
                onMouseEnter={() => setHoveredId(work.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{
                  rotate: work.rotation * -0.5,
                  scale: 1.03,
                  zIndex: 10,
                }}
              >
                {/* Emoji center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="select-none transition-transform duration-300 group-hover:scale-125"
                    style={{
                      fontSize: work.colSpan === 2 && work.rowSpan === 2 ? "5rem" : work.rowSpan === 2 ? "3.5rem" : "2.5rem",
                    }}
                    role="img"
                    aria-label={work.title}
                  >
                    {work.emoji}
                  </span>
                </div>

                {/* Category sticker */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide border-2 z-10"
                  style={{
                    backgroundColor: work.categoryBg,
                    color: work.categoryColor,
                    borderColor: "var(--rp-border)",
                    transform: `rotate(${-work.rotation * 1.5}deg)`,
                  }}
                >
                  {work.category}
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-end p-4"
                  style={{
                    background: "linear-gradient(to top, rgba(26,26,46,0.9) 0%, rgba(26,26,46,0.3) 60%, transparent 100%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-white font-black text-sm uppercase tracking-wide drop-shadow-lg">
                    {work.title}
                  </p>
                  <p className="text-white/60 text-xs font-bold mt-0.5">
                    #{work.id.toString().padStart(2, "0")}
                  </p>
                </motion.div>

                {/* Corner number badge */}
                <div
                  className="absolute bottom-2 right-3 text-[10px] font-black opacity-30 select-none"
                  style={{ color: "#fff" }}
                >
                  {work.id.toString().padStart(2, "0")}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View all CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="#"
            className="inline-block px-10 py-4 text-sm font-black uppercase tracking-widest text-white border-2 transition-all duration-150 hover:-translate-y-1 hover:shadow-[5px_5px_0px_#1A1A2E] active:translate-y-0 active:shadow-none"
            style={{
              backgroundColor: "var(--rp-text)",
              borderColor: "var(--rp-border)",
            }}
          >
            VIEW ALL WORKS →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
