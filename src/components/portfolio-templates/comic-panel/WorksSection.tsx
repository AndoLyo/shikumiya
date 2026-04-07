"use client";

import { motion } from "framer-motion";
import { useSiteData } from "./SiteDataContext";

type WorkItem = {
  id: number;
  title: string;
  category: string;
  gradient: string;
  emoji: string;
  panelLabel: string;
};

const works: WorkItem[] = [
  {
    id: 1,
    title: "疾風のKEN",
    category: "少年マンガ",
    gradient: "linear-gradient(135deg, #E63946 0%, #FF6B6B 100%)",
    emoji: "⚡",
    panelLabel: "P.01",
  },
  {
    id: 2,
    title: "星屑ガール",
    category: "ラブコメ",
    gradient: "linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)",
    emoji: "⭐",
    panelLabel: "P.02",
  },
  {
    id: 3,
    title: "DARK KNIGHT",
    category: "バトル",
    gradient: "linear-gradient(135deg, #1A1A1A 0%, #444444 100%)",
    emoji: "🗡️",
    panelLabel: "P.03",
  },
  {
    id: 4,
    title: "春風メモリー",
    category: "日常系",
    gradient: "linear-gradient(135deg, #FFC107 0%, #FFE082 100%)",
    emoji: "🌸",
    panelLabel: "P.04",
  },
  {
    id: 5,
    title: "電脳戦士",
    category: "SFアクション",
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
    emoji: "🤖",
    panelLabel: "P.05",
  },
  {
    id: 6,
    title: "ねこまた学園",
    category: "学園ファンタジー",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
    emoji: "🐱",
    panelLabel: "P.06",
  },
  {
    id: 7,
    title: "海賊王への道",
    category: "冒険",
    gradient: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
    emoji: "🏴‍☠️",
    panelLabel: "P.07",
  },
  {
    id: 8,
    title: "AI少女NANA",
    category: "SF",
    gradient: "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
    emoji: "💫",
    panelLabel: "P.08",
  },
  {
    id: 9,
    title: "武道家伝説",
    category: "格闘",
    gradient: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    emoji: "🥊",
    panelLabel: "P.09",
  },
];

// Manga panel grid layout definitions
// Layout: 6 panels arranged as: [2 wide] [1 tall + 2 stacked] [3 equal]
const panelLayout = [
  // Row 1: 2 wide panels
  { colSpan: "col-span-3", rowSpan: "row-span-2", index: 0 },
  { colSpan: "col-span-3", rowSpan: "row-span-2", index: 1 },
  // Row 2: 1 tall + 2 stacked
  { colSpan: "col-span-2", rowSpan: "row-span-4", index: 2 },
  { colSpan: "col-span-2", rowSpan: "row-span-2", index: 3 },
  { colSpan: "col-span-2", rowSpan: "row-span-2", index: 4 },
  // Row 3: 3 equal
  { colSpan: "col-span-2", rowSpan: "row-span-2", index: 5 },
  { colSpan: "col-span-2", rowSpan: "row-span-2", index: 6 },
  { colSpan: "col-span-2", rowSpan: "row-span-2", index: 7 },
  // Extra panel
  { colSpan: "col-span-6", rowSpan: "row-span-2", index: 8 },
];

function PanelCard({ work, delay }: { work: WorkItem; delay: number }) {
  return (
    <motion.div
      className="relative overflow-hidden group cursor-pointer"
      style={{
        background: work.gradient,
        border: "3px solid var(--cp-border)",
        borderRadius: "0px",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{
        scale: 1.05,
        zIndex: 10,
        boxShadow: "10px 10px 0 var(--cp-border)",
        rotate: 1,
        transition: { duration: 0.15 },
      }}
    >
      {/* Panel number label */}
      <div
        className="absolute top-2 left-2 z-10 px-1.5 py-0.5 text-[10px] font-black"
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          border: "1.5px solid var(--cp-border)",
          color: "var(--cp-text)",
          lineHeight: 1.2,
        }}
      >
        {work.panelLabel}
      </div>

      {/* Emoji / artwork placeholder centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-5xl md:text-6xl select-none"
          role="img"
          aria-label={work.title}
          whileHover={{ scale: 1.2, rotate: [-5, 5, 0] }}
          transition={{ duration: 0.3 }}
        >
          {work.emoji}
        </motion.span>
      </div>

      {/* Halftone dot overlay on image area */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "10px 10px",
        }}
      />

      {/* Hover info overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background:
            "linear-gradient(to top, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.4) 60%, transparent 100%)",
        }}
      >
        <p className="text-sm font-black text-white leading-tight">{work.title}</p>
        <div
          className="mt-1 inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider self-start"
          style={{
            backgroundColor: "var(--cp-yellow)",
            border: "1.5px solid rgba(255,255,255,0.6)",
            color: "var(--cp-text)",
          }}
        >
          {work.category}
        </div>
      </div>

      {/* Speed lines on hover — corner decoration */}
      <div
        className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          background:
            "linear-gradient(225deg, rgba(255,255,255,0.3) 0%, transparent 60%)",
        }}
      />
    </motion.div>
  );
}

function DataWorkCard({
  work,
  index,
}: {
  work: { src: string; title: string };
  index: number;
}) {
  return (
    <motion.div
      className="relative overflow-hidden group"
      style={{
        border: "3px solid var(--cp-border)",
        borderRadius: "0px",
        backgroundColor: "var(--cp-surface)",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{
        scale: 1.05,
        zIndex: 10,
        boxShadow: "10px 10px 0 var(--cp-border)",
        rotate: 1,
        transition: { duration: 0.15 },
      }}
    >
      {/* Panel number label */}
      <div
        className="absolute top-2 left-2 z-10 px-1.5 py-0.5 text-[10px] font-black"
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          border: "1.5px solid var(--cp-border)",
          color: "var(--cp-text)",
          lineHeight: 1.2,
        }}
      >
        P.{String(index + 1).padStart(2, "0")}
      </div>

      {/* Image — full display, no cropping */}
      <img
        src={work.src}
        alt={work.title}
        className="w-full h-auto block transition-transform duration-500 group-hover:scale-110"
        style={{ objectFit: "contain" }}
      />

      {/* Halftone dot overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "10px 10px",
        }}
      />

      {/* Hover info overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background:
            "linear-gradient(to top, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.4) 40%, transparent 100%)",
        }}
      >
        <p className="text-sm font-black text-white leading-tight">{work.title}</p>
      </div>
    </motion.div>
  );
}

export default function WorksSection() {
  const data = useSiteData();
  const hasDataWorks = data?.works && data.works.length > 0;

  return (
    <section
      id="works"
      className="py-16 px-5 sm:px-8"
      style={{ backgroundColor: "var(--cp-bg)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          className="mb-10 flex items-center gap-4"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="px-4 py-2"
            style={{
              backgroundColor: "var(--cp-red)",
              border: "3px solid var(--cp-border)",
              boxShadow: "4px 4px 0 var(--cp-border)",
            }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-white">
              Chapter 01
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
            WORKS
          </h2>
          {/* Decorative horizontal rule */}
          <div
            className="flex-1 h-[3px]"
            style={{ backgroundColor: "var(--cp-border)" }}
          />
        </motion.div>

        {/* Manga panel grid */}
        {hasDataWorks ? (
          /* Data-driven: masonry-like grid with natural aspect ratios */
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-[4px]"
            style={{
              border: "3px solid var(--cp-border)",
              boxShadow: "8px 8px 0 var(--cp-border)",
              backgroundColor: "var(--cp-border)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            {data!.works.map((work, i) => (
              <DataWorkCard key={i} work={work} index={i} />
            ))}
          </motion.div>
        ) : (
          /* Demo: original manga panel layout */
          <motion.div
            className="grid gap-[4px]"
            style={{
              gridTemplateColumns: "repeat(6, 1fr)",
              gridTemplateRows: "repeat(10, 80px)",
              border: "3px solid var(--cp-border)",
              boxShadow: "8px 8px 0 var(--cp-border)",
              backgroundColor: "var(--cp-border)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Row 1: two wide panels */}
            <div
              className="contents"
              style={{ gridColumn: "span 3", gridRow: "span 2" }}
            >
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  style={{ gridColumn: "span 3", gridRow: "span 2" }}
                >
                  <PanelCard work={works[idx]} delay={idx * 0.08} />
                </div>
              ))}
            </div>

            {/* Row 2-3: 1 tall left + 2 stacked right */}
            <div style={{ gridColumn: "span 2", gridRow: "span 4" }}>
              <PanelCard work={works[2]} delay={0.16} />
            </div>
            <div style={{ gridColumn: "span 2", gridRow: "span 2" }}>
              <PanelCard work={works[3]} delay={0.22} />
            </div>
            <div style={{ gridColumn: "span 2", gridRow: "span 2" }}>
              <PanelCard work={works[4]} delay={0.28} />
            </div>

            {/* Row 4: 3 equal panels */}
            {[5, 6, 7].map((idx, i) => (
              <div key={idx} style={{ gridColumn: "span 2", gridRow: "span 2" }}>
                <PanelCard work={works[idx]} delay={0.34 + i * 0.07} />
              </div>
            ))}

            {/* Row 5: Full-width wide panel */}
            <div style={{ gridColumn: "span 6", gridRow: "span 2" }}>
              <PanelCard work={works[8]} delay={0.55} />
            </div>
          </motion.div>
        )}

        {/* View more button */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a
            href="#contact"
            className="px-8 py-3 text-sm font-black uppercase tracking-wider transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
            style={{
              backgroundColor: "var(--cp-surface)",
              border: "3px solid var(--cp-border)",
              boxShadow: "5px 5px 0 var(--cp-border)",
              color: "var(--cp-text)",
            }}
          >
            MORE WORKS →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
