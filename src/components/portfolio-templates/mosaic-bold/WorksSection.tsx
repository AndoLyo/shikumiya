"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const STYLE = `
  .mb-mosaic-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 280px;
    grid-auto-flow: dense;
    gap: 1px;
    background: var(--mb-border);
    width: 100%;
  }
  @media (max-width: 900px) {
    .mb-mosaic-grid {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 240px;
    }
  }
  @media (max-width: 560px) {
    .mb-mosaic-grid {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 180px;
    }
  }
  .mb-tile {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: var(--mb-surface);
  }
  .mb-tile--wide {
    grid-column: span 2;
  }
  .mb-tile--tall {
    grid-row: span 2;
  }
  .mb-tile--big {
    grid-column: span 2;
    grid-row: span 2;
  }
  .mb-tile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: grayscale(100%);
    transition: filter 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .mb-tile:hover .mb-tile-img {
    filter: grayscale(0%);
    transform: scale(1.04);
  }
  .mb-tile-overlay {
    position: absolute;
    inset: 0;
    background: rgba(10, 10, 10, 0);
    transition: background 0.35s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.25rem;
  }
  .mb-tile:hover .mb-tile-overlay {
    background: rgba(10, 10, 10, 0.7);
  }
  .mb-tile-title {
    font-family: 'Arial Black', 'Arial', sans-serif;
    font-weight: 900;
    font-size: clamp(0.9rem, 2vw, 1.3rem);
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #FFFFFF;
    transform: translateY(12px);
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    line-height: 1.1;
  }
  .mb-tile:hover .mb-tile-title {
    transform: translateY(0);
    opacity: 1;
  }
  .mb-tile-category {
    font-family: 'Courier New', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--mb-accent);
    transform: translateY(8px);
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.05s;
    margin-bottom: 0.4rem;
  }
  .mb-tile:hover .mb-tile-category {
    transform: translateY(0);
    opacity: 1;
  }
  .mb-tile-accent-corner {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 32px 32px 0 0;
    border-color: var(--mb-accent) transparent transparent transparent;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .mb-tile:hover .mb-tile-accent-corner {
    opacity: 1;
  }
`;

interface Work {
  id: number;
  title: string;
  category: string;
  span: "normal" | "wide" | "tall" | "big";
  gradient: string;
}

const works: Work[] = [
  {
    id: 1,
    title: "フラクタル都市",
    category: "Generative Art",
    span: "big",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 30%, #6b6b6b 60%, #0A0A0A 100%)",
  },
  {
    id: 2,
    title: "モノクロ螺旋",
    category: "Abstract",
    span: "normal",
    gradient: "linear-gradient(160deg, #F5F5F5 0%, #BDBDBD 40%, #757575 80%, #212121 100%)",
  },
  {
    id: 3,
    title: "鋼鉄の詩",
    category: "Digital Sculpture",
    span: "normal",
    gradient: "linear-gradient(200deg, #0A0A0A 0%, #424242 40%, #9E9E9E 70%, #F5F5F5 100%)",
  },
  {
    id: 4,
    title: "インパクト・ゼロ",
    category: "Typography",
    span: "wide",
    gradient: "linear-gradient(90deg, #FF3D00 0%, #FF6D00 20%, #1a1a1a 50%, #0A0A0A 100%)",
  },
  {
    id: 5,
    title: "影と光の境界",
    category: "Contrast Study",
    span: "tall",
    gradient: "linear-gradient(180deg, #FFFFFF 0%, #9E9E9E 35%, #212121 65%, #0A0A0A 100%)",
  },
  {
    id: 6,
    title: "解体と再構築",
    category: "Collage",
    span: "normal",
    gradient: "linear-gradient(120deg, #FF3D00 0%, #3d3d3d 50%, #0A0A0A 100%)",
  },
  {
    id: 7,
    title: "無音の叫び",
    category: "Emotional Series",
    span: "normal",
    gradient: "linear-gradient(150deg, #F5F5F5 0%, #BDBDBD 60%, #757575 100%)",
  },
  {
    id: 8,
    title: "幾何学的瞑想",
    category: "Geometric",
    span: "wide",
    gradient: "linear-gradient(110deg, #0A0A0A 0%, #424242 35%, #FF3D00 55%, #1a1a1a 100%)",
  },
  {
    id: 9,
    title: "テクスチャ爆発",
    category: "Texture",
    span: "normal",
    gradient: "linear-gradient(170deg, #9E9E9E 0%, #424242 40%, #212121 70%, #0A0A0A 100%)",
  },
  {
    id: 10,
    title: "最後の直線",
    category: "Minimal",
    span: "normal",
    gradient: "linear-gradient(45deg, #F5F5F5 0%, #FF3D00 50%, #0A0A0A 100%)",
  },
];

function getTileClass(span: Work["span"]) {
  switch (span) {
    case "wide":
      return "mb-tile mb-tile--wide";
    case "tall":
      return "mb-tile mb-tile--tall";
    case "big":
      return "mb-tile mb-tile--big";
    default:
      return "mb-tile";
  }
}

export function WorksSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="works" style={{ background: "var(--mb-bg)" }}>
      <style>{STYLE}</style>

      {/* Section header */}
      <div
        className="px-6 md:px-10 py-12"
        style={{ borderTop: "1px solid var(--mb-border)" }}
      >
        <div className="flex items-end justify-between gap-4">
          <motion.h2
            className="font-black uppercase"
            style={{
              fontFamily: "'Arial Black', 'Arial', sans-serif",
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: "var(--mb-text)",
            }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            WORKS
          </motion.h2>
          <motion.span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--mb-text-muted)",
              paddingBottom: "0.5rem",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {works.length} Selected Works
          </motion.span>
        </div>
      </div>

      {/* Mosaic grid */}
      <motion.div
        className="mb-mosaic-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5 }}
      >
        {works.map((work, i) => (
          <motion.div
            key={work.id}
            className={getTileClass(work.span)}
            onMouseEnter={() => setHoveredId(work.id)}
            onMouseLeave={() => setHoveredId(null)}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.4) }}
          >
            {/* Gradient image placeholder */}
            <div
              className="mb-tile-img"
              style={{ background: work.gradient }}
              role="img"
              aria-label={work.title}
            />

            {/* Hover overlay */}
            <div className="mb-tile-overlay">
              <div className="mb-tile-category">{work.category}</div>
              <div className="mb-tile-title">{work.title}</div>
            </div>

            {/* Accent corner triangle */}
            <div className="mb-tile-accent-corner" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
