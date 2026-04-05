"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

const categories = ["すべて", "キャラクター", "風景", "AIアート", "コミック"];

type WorkItem = {
  id: number;
  title: string;
  category: string;
  gradient: string;
  aspectRatio: string; // CSS aspect-ratio value e.g. "1/1", "3/4", "4/3"
  emoji: string;
};

const works: WorkItem[] = [
  {
    id: 1,
    title: "桜の妖精",
    category: "キャラクター",
    gradient: "linear-gradient(135deg, #FFB7C5 0%, #FF7EB3 100%)",
    aspectRatio: "3/4",
    emoji: "🌸",
  },
  {
    id: 2,
    title: "空の島",
    category: "風景",
    gradient: "linear-gradient(135deg, #7EC8E3 0%, #A8E6CF 100%)",
    aspectRatio: "4/3",
    emoji: "☁️",
  },
  {
    id: 3,
    title: "星空の魔女",
    category: "AIアート",
    gradient: "linear-gradient(135deg, #C9A0E0 0%, #7EC8E3 100%)",
    aspectRatio: "1/1",
    emoji: "✨",
  },
  {
    id: 4,
    title: "猫カフェ日常",
    category: "コミック",
    gradient: "linear-gradient(135deg, #FFE066 0%, #FFB347 100%)",
    aspectRatio: "3/4",
    emoji: "🐱",
  },
  {
    id: 5,
    title: "パステル海岸",
    category: "風景",
    gradient: "linear-gradient(135deg, #A8E6CF 0%, #7EC8E3 100%)",
    aspectRatio: "4/3",
    emoji: "🌊",
  },
  {
    id: 6,
    title: "夢見る少女",
    category: "キャラクター",
    gradient: "linear-gradient(135deg, #FF7EB3 0%, #FFE066 100%)",
    aspectRatio: "1/1",
    emoji: "💭",
  },
  {
    id: 7,
    title: "AI花園",
    category: "AIアート",
    gradient: "linear-gradient(135deg, #FF7EB3 0%, #A8E6CF 100%)",
    aspectRatio: "3/4",
    emoji: "🌺",
  },
  {
    id: 8,
    title: "ふわふわ日記",
    category: "コミック",
    gradient: "linear-gradient(135deg, #FFE066 0%, #FF7EB3 100%)",
    aspectRatio: "4/3",
    emoji: "📔",
  },
  {
    id: 9,
    title: "光の精霊",
    category: "AIアート",
    gradient: "linear-gradient(135deg, #7EC8E3 0%, #C9A0E0 100%)",
    aspectRatio: "1/1",
    emoji: "💫",
  },
  {
    id: 10,
    title: "たそがれ公園",
    category: "風景",
    gradient: "linear-gradient(135deg, #FFB7C5 0%, #FFE066 100%)",
    aspectRatio: "3/4",
    emoji: "🌇",
  },
  {
    id: 11,
    title: "うさぎの冒険",
    category: "コミック",
    gradient: "linear-gradient(135deg, #A8E6CF 0%, #FFE066 100%)",
    aspectRatio: "4/3",
    emoji: "🐰",
  },
  {
    id: 12,
    title: "月下の舞踏会",
    category: "キャラクター",
    gradient: "linear-gradient(135deg, #C9A0E0 0%, #FF7EB3 100%)",
    aspectRatio: "1/1",
    emoji: "🌙",
  },
];

const pillColors: Record<string, { bg: string; text: string; activeBg: string }> = {
  "すべて": { bg: "#FFF0F5", text: "#B89AB5", activeBg: "#FF7EB3" },
  "キャラクター": { bg: "#FFF0F5", text: "#B89AB5", activeBg: "#FF7EB3" },
  "風景": { bg: "#F0FAFE", text: "#7EC8E3", activeBg: "#7EC8E3" },
  "AIアート": { bg: "#F3EFF8", text: "#C9A0E0", activeBg: "#C9A0E0" },
  "コミック": { bg: "#FFFBEE", text: "#C89A20", activeBg: "#FFE066" },
};

export default function GallerySection() {
  const siteData = useSiteData();
  const hasDataWorks = siteData?.works && siteData.works.length > 0;

  const [activeCategory, setActiveCategory] = useState("すべて");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filtered =
    activeCategory === "すべて"
      ? works
      : works.filter((w) => w.category === activeCategory);

  return (
    <section
      id="gallery"
      className="py-20 px-5 sm:px-8"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="mb-2 text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-accent)" }}
          >
            Gallery
          </p>
          <h2
            className="text-3xl font-extrabold md:text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            作品一覧
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
            イラスト・AIアートをご覧ください
          </p>
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          className="mb-10 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const colors = pillColors[cat] || pillColors["すべて"];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={
                  isActive
                    ? {
                        backgroundColor: colors.activeBg,
                        color: cat === "コミック" ? "#4A3548" : "white",
                        boxShadow: `0 4px 12px ${colors.activeBg}66`,
                      }
                    : {
                        backgroundColor: colors.bg,
                        color: colors.text,
                        border: `1.5px solid var(--color-border)`,
                      }
                }
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Masonry layout using CSS columns */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="columns-2 md:columns-3 lg:columns-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.map((work, index) => (
              <motion.div
                key={work.id}
                className="mb-4 break-inside-avoid"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
              >
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-2xl"
                  style={{
                    aspectRatio: work.aspectRatio,
                    background: work.gradient,
                  }}
                  onMouseEnter={() => setHoveredId(work.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Emoji placeholder centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="transition-transform duration-300 group-hover:scale-110"
                      style={{
                        fontSize: work.aspectRatio === "4/3" ? "3.5rem" : "2.5rem",
                      }}
                      role="img"
                      aria-label={work.title}
                    >
                      {work.emoji}
                    </span>
                  </div>

                  {/* Hover overlay with title */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-end rounded-2xl p-4 transition-all duration-300 ${
                      hoveredId === work.id ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background:
                        "linear-gradient(to top, rgba(74,53,72,0.85) 0%, rgba(74,53,72,0.2) 60%, transparent 100%)",
                    }}
                  >
                    <p className="text-sm font-bold text-white drop-shadow">{work.title}</p>
                    <p className="mt-1 rounded-full px-3 py-0.5 text-[10px] font-semibold text-white/80 bg-white/20">
                      {work.category}
                    </p>
                  </div>

                  {/* Corner badge */}
                  <div
                    className="absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: "var(--color-text)",
                    }}
                  >
                    #{work.id.toString().padStart(2, "0")}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
