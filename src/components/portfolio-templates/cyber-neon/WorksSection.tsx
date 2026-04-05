"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteData } from "@/lib/SiteDataContext";

const STYLE = `
  @keyframes cn-thumb-glow {
    0%, 100% { box-shadow: 0 0 8px var(--cn-cyan), 0 0 16px rgba(0,240,255,0.4); }
    50% { box-shadow: 0 0 14px var(--cn-cyan), 0 0 30px rgba(0,240,255,0.6); }
  }
  .cn-thumb-active {
    animation: cn-thumb-glow 2s ease-in-out infinite;
  }
`;

interface Work {
  id: number;
  title: string;
  category: string;
  gradient: string;
  aspectClass: string;
}

const works: Work[] = [
  {
    id: 1,
    title: "ネオン・エクスタシー",
    category: "サイバーパンク",
    gradient: "linear-gradient(135deg, #0A0A14 0%, #1a0a2e 30%, #FF00E5 60%, #00F0FF 100%)",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: 2,
    title: "デジタル・レイン",
    category: "グリッチアート",
    gradient: "linear-gradient(160deg, #050510 0%, #00F0FF 40%, #0A4A1A 80%, #BFFF00 100%)",
    aspectClass: "aspect-video",
  },
  {
    id: 3,
    title: "クロム・ドリーム",
    category: "未来都市",
    gradient: "linear-gradient(120deg, #0A0A14 0%, #2a1a4e 40%, #FF00E5 70%, #12121F 100%)",
    aspectClass: "aspect-square",
  },
  {
    id: 4,
    title: "ブレードランナー2089",
    category: "SF・ノワール",
    gradient: "linear-gradient(200deg, #0A0A14 0%, #FF00E5 30%, #0A0A14 60%, #00F0FF 100%)",
    aspectClass: "aspect-[4/5]",
  },
  {
    id: 5,
    title: "シンセウェーブ都市",
    category: "レトロフューチャー",
    gradient: "linear-gradient(140deg, #0A0A14 0%, #1a1a3e 25%, #BFFF00 55%, #FF00E5 80%, #0A0A14 100%)",
    aspectClass: "aspect-[16/9]",
  },
  {
    id: 6,
    title: "量子コア",
    category: "テック・アート",
    gradient: "linear-gradient(170deg, #050510 0%, #00F0FF 25%, #0A0A14 55%, #FF00E5 85%, #12121F 100%)",
    aspectClass: "aspect-[3/4]",
  },
];

export function WorksSection() {
  const siteData = useSiteData();
  const hasDataWorks = siteData?.works && siteData.works.length > 0;

  const displayWorks: Work[] = hasDataWorks
    ? siteData!.works.map((w, i) => ({
        id: i + 1,
        title: w.title,
        category: "",
        gradient: "",
        aspectClass: "aspect-auto",
      }))
    : works;

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const activeWork = displayWorks[activeIndex];

  const go = (dir: number) => {
    setDirection(dir);
    setActiveIndex((prev) => (prev + dir + displayWorks.length) % displayWorks.length);
  };

  return (
    <section
      id="works"
      className="tpl-snap-section flex-col gap-0 px-0 py-0"
      style={{ background: "var(--cn-surface)" }}
    >
      <style>{STYLE}</style>

      {/* Section label */}
      <div
        className="absolute top-6 left-8 z-20 font-mono text-xs tracking-[0.4em] uppercase"
        style={{ color: "var(--cn-cyan)", textShadow: "0 0 8px var(--cn-cyan)" }}
      >
        // 02_WORKS
      </div>

      {/* Main content area */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 py-16 gap-6">
        {/* Large featured artwork */}
        <div className="relative w-full max-w-2xl flex items-center justify-center">
          {/* Nav arrows */}
          <button
            onClick={() => go(-1)}
            className="absolute left-0 z-20 p-2 transition-all duration-200 hover:scale-110"
            style={{
              color: "var(--cn-cyan)",
              filter: "drop-shadow(0 0 6px var(--cn-cyan))",
            }}
            aria-label="前の作品"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-0 z-20 p-2 transition-all duration-200 hover:scale-110"
            style={{
              color: "var(--cn-cyan)",
              filter: "drop-shadow(0 0 6px var(--cn-cyan))",
            }}
            aria-label="次の作品"
          >
            <ChevronRight size={32} />
          </button>

          {/* Artwork frame */}
          <div
            className="relative mx-12 overflow-hidden"
            style={{
              border: "1px solid var(--cn-cyan)",
              boxShadow:
                "0 0 20px rgba(0,240,255,0.25), 0 0 60px rgba(0,240,255,0.1), inset 0 0 20px rgba(0,240,255,0.05)",
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeWork.id}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d * 80, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d * -80, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`w-full max-w-sm sm:max-w-md md:max-w-lg ${hasDataWorks ? "" : activeWork.aspectClass} max-h-[45vh]`}
                style={{
                  background: hasDataWorks ? "var(--cn-surface)" : activeWork.gradient,
                  minWidth: "260px",
                }}
              >
                {hasDataWorks && siteData!.works[activeIndex] && (
                  <img
                    src={siteData!.works[activeIndex].src}
                    alt={siteData!.works[activeIndex].title}
                    className="w-full h-auto block"
                    style={{ objectFit: "contain" }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Corner accents */}
            {["top-1 left-1", "top-1 right-1 rotate-90", "bottom-1 left-1 -rotate-90", "bottom-1 right-1 rotate-180"].map((pos, i) => (
              <svg
                key={i}
                className={`absolute ${pos} w-4 h-4`}
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M0 8 L0 0 L8 0"
                  stroke="var(--cn-cyan)"
                  strokeWidth="1.5"
                />
              </svg>
            ))}
          </div>
        </div>

        {/* Artwork info overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWork.id + "-info"}
            className="flex flex-col items-center gap-1 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="text-xs font-mono tracking-[0.35em] uppercase"
              style={{ color: "var(--cn-magenta)", textShadow: "0 0 8px var(--cn-magenta)" }}
            >
              {activeWork.category}
            </span>
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider"
              style={{
                color: "var(--cn-text)",
                fontFamily: "'Courier New', monospace",
              }}
            >
              {activeWork.title}
            </h2>
            <span
              className="text-xs font-mono"
              style={{ color: "var(--cn-text-muted)" }}
            >
              {String(activeIndex + 1).padStart(2, "0")} / {String(displayWorks.length).padStart(2, "0")}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Thumbnail strip */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 max-w-full px-2">
          {displayWorks.map((work, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={work.id}
                onClick={() => {
                  setDirection(i > activeIndex ? 1 : -1);
                  setActiveIndex(i);
                }}
                className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 overflow-hidden transition-all duration-300 ${
                  isActive ? "cn-thumb-active scale-110" : "opacity-50 hover:opacity-80"
                }`}
                style={{
                  border: isActive
                    ? "1px solid var(--cn-cyan)"
                    : "1px solid rgba(0,240,255,0.2)",
                }}
                aria-label={work.title}
              >
                {hasDataWorks && siteData!.works[i] ? (
                  <img
                    src={siteData!.works[i].src}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ background: work.gradient }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
