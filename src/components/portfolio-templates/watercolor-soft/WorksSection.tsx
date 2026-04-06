"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

type WorkItem = {
  id: number;
  title: string;
  category: string;
  gradient: string;
  aspectRatio: string;
  emoji: string;
  accentColor: string;
};

const works: WorkItem[] = [
  {
    id: 1,
    title: "春霞の水辺",
    category: "風景",
    gradient: "linear-gradient(135deg, #B8D9EE 0%, #7FB5D5 100%)",
    aspectRatio: "4/3",
    emoji: "🌸",
    accentColor: "#7FB5D5",
  },
  {
    id: 2,
    title: "白い花の静物",
    category: "静物",
    gradient: "linear-gradient(135deg, #F0E8F0 0%, #E8B4C8 100%)",
    aspectRatio: "4/3",
    emoji: "🌼",
    accentColor: "#E8B4C8",
  },
  {
    id: 3,
    title: "霧の森",
    category: "風景",
    gradient: "linear-gradient(135deg, #B5D5C0 0%, #8FBFA0 100%)",
    aspectRatio: "4/3",
    emoji: "🌿",
    accentColor: "#8FBFA0",
  },
  {
    id: 4,
    title: "夕暮れの港",
    category: "風景",
    gradient: "linear-gradient(135deg, #F5D9B8 0%, #F0C9A6 100%)",
    aspectRatio: "4/3",
    emoji: "⚓",
    accentColor: "#F0C9A6",
  },
  {
    id: 5,
    title: "庭の朝露",
    category: "植物",
    gradient: "linear-gradient(135deg, #C5E0E8 0%, #7FB5D5 60%, #B8D9C0 100%)",
    aspectRatio: "4/3",
    emoji: "💧",
    accentColor: "#7FB5D5",
  },
  {
    id: 6,
    title: "秋の実り",
    category: "静物",
    gradient: "linear-gradient(135deg, #EECFB8 0%, #F0C9A6 60%, #E8B4C8 100%)",
    aspectRatio: "4/3",
    emoji: "🍂",
    accentColor: "#F0C9A6",
  },
  {
    id: 7,
    title: "雨の日の窓",
    category: "情景",
    gradient: "linear-gradient(135deg, #B0C8E0 0%, #7FB5D5 100%)",
    aspectRatio: "4/3",
    emoji: "🌧",
    accentColor: "#7FB5D5",
  },
  {
    id: 8,
    title: "野の花",
    category: "植物",
    gradient: "linear-gradient(135deg, #D8ECD0 0%, #8FBFA0 100%)",
    aspectRatio: "4/3",
    emoji: "🌾",
    accentColor: "#8FBFA0",
  },
  {
    id: 9,
    title: "夜の月明かり",
    category: "情景",
    gradient: "linear-gradient(135deg, #C8C0E8 0%, #B4C8E8 60%, #7FB5D5 100%)",
    aspectRatio: "4/3",
    emoji: "🌙",
    accentColor: "#7FB5D5",
  },
];

const categories = ["すべて", "風景", "植物", "静物", "情景"];

export default function WorksSection() {
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
      id="works"
      className="py-24 px-5 sm:px-8"
      style={{ backgroundColor: "var(--wc-surface)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--wc-blue)" }}
          >
            Portfolio
          </p>
          <h2
            className="relative mb-4 inline-block text-3xl font-semibold md:text-4xl"
            style={{ color: "var(--wc-text)" }}
          >
            作品一覧
            {/* Watercolor underline stroke SVG */}
            <svg
              className="absolute -bottom-2 left-0 w-full overflow-visible"
              height="10"
              viewBox="0 0 160 10"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2,7 C30,2 70,9 110,5 C140,2 155,8 158,7"
                stroke="var(--wc-pink)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.65"
              />
            </svg>
          </h2>
          <p className="mt-5 text-sm italic" style={{ color: "var(--wc-text-muted)" }}>
            水彩画・ドローイング・混合技法
          </p>
        </motion.div>

        {/* Category filter — demo only */}
        {!hasDataWorks && (
          <motion.div
            className="mb-12 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
                  style={
                    isActive
                      ? {
                          backgroundColor: "var(--wc-blue)",
                          color: "#ffffff",
                          boxShadow: "0 4px 14px rgba(127,181,213,0.4)",
                        }
                      : {
                          backgroundColor: "var(--wc-bg)",
                          color: "var(--wc-text-muted)",
                          border: "1px solid var(--wc-border)",
                        }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Works grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasDataWorks ? (
            siteData!.works.map((work, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.07, ease: "easeOut" }}
              >
                <div
                  className="group cursor-pointer overflow-hidden rounded-3xl transition-all duration-400"
                  style={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    border: "1px solid var(--wc-border)",
                  }}
                >
                  <div className="relative overflow-hidden" style={{ background: "var(--wc-bg)" }}>
                    <img src={work.src} alt={work.title} className="w-full h-auto block" />
                  </div>
                  <div className="px-5 py-4" style={{ backgroundColor: "var(--wc-surface)" }}>
                    <p className="text-sm font-medium" style={{ color: "var(--wc-text)" }}>
                      {work.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            filtered.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.07, ease: "easeOut" }}
              >
                <div
                  className="group cursor-pointer overflow-hidden rounded-3xl transition-all duration-400"
                  style={{
                    boxShadow:
                      hoveredId === work.id
                        ? `0 16px 48px ${work.accentColor}44, 0 4px 16px rgba(0,0,0,0.06)`
                        : "0 4px 20px rgba(0,0,0,0.06)",
                    transform: hoveredId === work.id ? "translateY(-4px)" : "translateY(0)",
                    transition: "box-shadow 0.35s ease, transform 0.35s ease",
                    border: hoveredId === work.id
                      ? `1px solid ${work.accentColor}55`
                      : "1px solid var(--wc-border)",
                  }}
                  onMouseEnter={() => setHoveredId(work.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image container with fixed 4/3 aspect ratio */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "4/3", background: work.gradient }}
                  >
                    {/* Soft color wash overlay for watercolor feel */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `radial-gradient(ellipse at 70% 30%, white 0%, transparent 60%)`,
                      }}
                    />
                    {/* Emoji placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-5xl transition-transform duration-500 group-hover:scale-110"
                        role="img"
                        aria-label={work.title}
                      >
                        {work.emoji}
                      </span>
                    </div>
                    {/* Hover overlay */}
                    <div
                      className={`absolute inset-0 flex items-end p-4 transition-all duration-400 ${
                        hoveredId === work.id ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        background:
                          "linear-gradient(to top, rgba(61,61,61,0.55) 0%, transparent 60%)",
                      }}
                    >
                      <span className="rounded-full px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                        {work.category}
                      </span>
                    </div>
                  </div>

                  {/* Card info below image */}
                  <div
                    className="px-5 py-4"
                    style={{ backgroundColor: "var(--wc-surface)" }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--wc-text)" }}
                    >
                      {work.title}
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--wc-text-muted)" }}
                    >
                      {work.category}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
