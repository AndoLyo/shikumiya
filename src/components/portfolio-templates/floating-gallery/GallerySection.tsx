"use client";

import { useState, useRef, useCallback, MouseEvent } from "react";
import { motion } from "framer-motion";

const STYLE = `
  .fg-gallery-perspective {
    perspective: 1200px;
    perspective-origin: 50% 40%;
  }
  .fg-card-3d {
    transform-style: preserve-3d;
    transition: box-shadow 0.3s ease;
  }
  .fg-card-image {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
  .fg-card-overlay {
    background: linear-gradient(
      to top,
      rgba(17, 17, 24, 0.92) 0%,
      rgba(17, 17, 24, 0.5) 40%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.35s ease;
  }
  .fg-card-3d:hover .fg-card-overlay {
    opacity: 1;
  }
  .fg-card-info {
    transform: translateY(8px);
    transition: transform 0.35s ease;
  }
  .fg-card-3d:hover .fg-card-info {
    transform: translateY(0);
  }
  @media (hover: none) {
    .fg-card-3d {
      transform: none !important;
    }
    .fg-card-overlay {
      opacity: 1 !important;
    }
    .fg-card-info {
      transform: none !important;
    }
  }
  @keyframes fg-section-glow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }
`;

interface Work {
  id: number;
  title: string;
  category: string;
  year: string;
  gradient: string;
  size: "tall" | "wide" | "square";
  depthOffset: number; /* px of default translateZ */
}

const WORKS: Work[] = [
  {
    id: 1,
    title: "星の海原",
    category: "宇宙・幻想",
    year: "2024",
    gradient:
      "linear-gradient(135deg, #0d0d1a 0%, #1a0d2e 30%, #6C63FF 65%, #A5A0FF 100%)",
    size: "tall",
    depthOffset: 20,
  },
  {
    id: 2,
    title: "深淵の光",
    category: "アンビエント",
    year: "2024",
    gradient:
      "linear-gradient(160deg, #111118 0%, #1C1C26 25%, #3a3070 55%, #6C63FF 80%, #A5A0FF 100%)",
    size: "square",
    depthOffset: 40,
  },
  {
    id: 3,
    title: "虚空の彫刻",
    category: "3D・立体",
    year: "2024",
    gradient:
      "linear-gradient(200deg, #0a0a14 0%, #6C63FF 35%, #2a204e 65%, #A5A0FF 100%)",
    size: "tall",
    depthOffset: 10,
  },
  {
    id: 4,
    title: "光の結晶",
    category: "ジオメトリック",
    year: "2023",
    gradient:
      "linear-gradient(115deg, #1C1C26 0%, #A5A0FF 30%, #6C63FF 60%, #111118 100%)",
    size: "wide",
    depthOffset: 55,
  },
  {
    id: 5,
    title: "夢幻の庭",
    category: "自然・幻想",
    year: "2023",
    gradient:
      "linear-gradient(150deg, #111118 0%, #1a1630 30%, #4a3090 55%, #6C63FF 75%, #A5A0FF 100%)",
    size: "tall",
    depthOffset: 30,
  },
  {
    id: 6,
    title: "消えゆく記憶",
    category: "アブストラクト",
    year: "2024",
    gradient:
      "linear-gradient(175deg, #0d0d1a 0%, #6C63FF 25%, #1C1C26 55%, #A5A0FF 85%, #111118 100%)",
    size: "square",
    depthOffset: 15,
  },
  {
    id: 7,
    title: "時の断片",
    category: "コンセプト",
    year: "2023",
    gradient:
      "linear-gradient(125deg, #111118 0%, #2d2860 35%, #6C63FF 60%, #A5A0FF 80%, #1C1C26 100%)",
    size: "tall",
    depthOffset: 45,
  },
  {
    id: 8,
    title: "無限回廊",
    category: "建築・空間",
    year: "2024",
    gradient:
      "linear-gradient(190deg, #0a0a14 0%, #A5A0FF 20%, #6C63FF 45%, #1C1C26 75%, #111118 100%)",
    size: "wide",
    depthOffset: 25,
  },
];

const SIZE_CLASSES: Record<Work["size"], string> = {
  tall: "aspect-[4/5]",
  wide: "aspect-[16/9]",
  square: "aspect-square",
};

interface TiltState {
  x: number;
  y: number;
  glowX: number;
  glowY: number;
}

function FloatingCard({ work, index }: { work: Work; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ x: 0, y: 0, glowX: 50, glowY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;  // 0..1
    const cy = (e.clientY - rect.top) / rect.height;   // 0..1
    const rotateY = (cx - 0.5) * 20;   // ±10deg
    const rotateX = (0.5 - cy) * 16;   // ±8deg
    setTilt({
      x: rotateX,
      y: rotateY,
      glowX: cx * 100,
      glowY: cy * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const defaultZ = work.depthOffset;
  const hoverZ = defaultZ + 40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div
        ref={cardRef}
        className={`fg-card-3d relative overflow-hidden rounded-xl cursor-pointer ${SIZE_CLASSES[work.size]}`}
        style={{
          transform: `translateZ(${isHovered ? hoverZ : defaultZ}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          boxShadow: isHovered
            ? `0 ${20 + tilt.x * 2}px ${60 + Math.abs(tilt.y) * 2}px rgba(0,0,0,0.7),
               0 0 0 1px rgba(108,99,255,0.3),
               0 0 40px rgba(108,99,255,0.2)`
            : `0 ${defaultZ * 0.4}px ${defaultZ * 1.2}px rgba(0,0,0,0.5),
               0 0 0 1px rgba(108,99,255,${0.08 + defaultZ * 0.001})`,
          border: "1px solid var(--fg-border)",
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image / gradient placeholder */}
        <div
          className="fg-card-image absolute inset-0 w-full h-full object-cover"
          style={{ background: work.gradient }}
        />

        {/* Dynamic glow highlight */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(165,160,255,0.15) 0%, transparent 60%)`,
            }}
          />
        )}

        {/* Info overlay */}
        <div className="fg-card-overlay absolute inset-0 flex flex-col justify-end p-4">
          <div className="fg-card-info">
            <span
              className="text-[10px] tracking-[0.35em] uppercase font-medium mb-1 block"
              style={{ color: "var(--fg-accent-light)" }}
            >
              {work.category}
            </span>
            <h3
              className="text-base font-bold leading-tight"
              style={{ color: "var(--fg-text)" }}
            >
              {work.title}
            </h3>
            <span
              className="text-xs mt-0.5 block"
              style={{ color: "var(--fg-text-muted)" }}
            >
              {work.year}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function GallerySection() {
  return (
    <section
      id="gallery"
      className="relative py-24 px-6 sm:px-10 lg:px-16"
      style={{ background: "var(--fg-bg)" }}
    >
      <style>{STYLE}</style>

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(108,99,255,0.05) 0%, transparent 70%)",
          animation: "fg-section-glow 6s ease-in-out infinite",
        }}
      />

      {/* Section header */}
      <motion.div
        className="relative z-10 text-center mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p
          className="text-xs tracking-[0.5em] uppercase mb-3 font-medium"
          style={{ color: "var(--fg-accent)" }}
        >
          Works
        </p>
        <h2
          className="text-4xl sm:text-5xl font-black tracking-tight"
          style={{ color: "var(--fg-text)" }}
        >
          浮遊するギャラリー
        </h2>
        <p
          className="mt-3 text-sm max-w-sm mx-auto leading-relaxed"
          style={{ color: "var(--fg-text-muted)" }}
        >
          カードにカーソルを重ねると奥行きが生まれる。
          <br />
          3D空間に漂う作品たちをご覧ください。
        </p>
      </motion.div>

      {/* 3D perspective container */}
      <div className="fg-gallery-perspective relative z-10 max-w-6xl mx-auto">
        {/* Grid layout — 4 columns on large, 2 on medium, 1 on small */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Row 1: tall, square, tall, square */}
          {WORKS.slice(0, 4).map((work, i) => (
            <FloatingCard key={work.id} work={work} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-5 sm:mt-6">
          {/* Row 2: tall, wide (spans 2 cols), tall */}
          <FloatingCard work={WORKS[4]} index={4} />

          <div className="sm:col-span-2">
            <FloatingCard work={WORKS[5]} index={5} />
          </div>

          <FloatingCard work={WORKS[6]} index={6} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-5 sm:mt-6">
          {/* Row 3: wide (full) */}
          <div className="sm:col-span-2 lg:col-span-4">
            <FloatingCard work={WORKS[7]} index={7} />
          </div>
        </div>
      </div>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(108,99,255,0.04) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
