"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STYLE = `
  @keyframes de-progress {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
  .de-progress-fill {
    transform-origin: left center;
  }
  .de-arrow-btn {
    transition: opacity 0.3s ease, background 0.3s ease, border-color 0.3s ease;
  }
  .de-arrow-btn:hover {
    background: rgba(201,169,110,0.1) !important;
    border-color: var(--de-gold) !important;
  }
  .de-mini-btn {
    transition: all 0.25s ease;
    letter-spacing: 0.3em;
    font-size: 9px;
    text-transform: uppercase;
  }
  .de-mini-btn:hover {
    color: var(--de-gold) !important;
    border-color: rgba(201,169,110,0.5) !important;
  }
`;

interface Work {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  gradient: string;
  aspectRatio: string;
}

const works: Work[] = [
  {
    id: 1,
    title: "黄昏の女神",
    subtitle: "Goddess at Dusk",
    category: "デジタルポートレート",
    year: "2025",
    gradient:
      "linear-gradient(160deg, #0D0D0D 0%, #1a0a05 25%, #3d1a00 55%, #C9A96E 85%, #E4D5B7 100%)",
    aspectRatio: "3/4",
  },
  {
    id: 2,
    title: "静寂の庭",
    subtitle: "Garden of Silence",
    category: "ランドスケープ",
    year: "2025",
    gradient:
      "linear-gradient(200deg, #0D0D0D 0%, #0a1a12 30%, #1a3020 60%, #C9A96E 100%)",
    aspectRatio: "16/9",
  },
  {
    id: 3,
    title: "金の刹那",
    subtitle: "Gilded Moment",
    category: "アブストラクト",
    year: "2024",
    gradient:
      "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 40%, #C9A96E 70%, #0D0D0D 100%)",
    aspectRatio: "1/1",
  },
  {
    id: 4,
    title: "深淵の鏡",
    subtitle: "Mirror of the Abyss",
    category: "ダークファンタジー",
    year: "2024",
    gradient:
      "linear-gradient(170deg, #0D0D0D 0%, #0a0a1a 30%, #1a0a1a 60%, #8B6914 85%, #C9A96E 100%)",
    aspectRatio: "2/3",
  },
  {
    id: 5,
    title: "光の残像",
    subtitle: "Afterimage of Light",
    category: "エクスペリメンタル",
    year: "2024",
    gradient:
      "linear-gradient(140deg, #0D0D0D 0%, #1a1500 35%, #C9A96E 60%, #E4D5B7 80%, #0D0D0D 100%)",
    aspectRatio: "16/9",
  },
  {
    id: 6,
    title: "永遠の瞬間",
    subtitle: "Eternal Instant",
    category: "ファインアート",
    year: "2024",
    gradient:
      "linear-gradient(115deg, #0D0D0D 5%, #1a0d05 40%, #C9A96E 65%, #1A1A1A 100%)",
    aspectRatio: "3/4",
  },
  {
    id: 7,
    title: "影の詩",
    subtitle: "Poetry of Shadow",
    category: "シルエットアート",
    year: "2023",
    gradient:
      "linear-gradient(180deg, #0D0D0D 0%, #151005 40%, #2a1f00 65%, #C9A96E 90%, #E4D5B7 100%)",
    aspectRatio: "4/5",
  },
  {
    id: 8,
    title: "黎明の息吹",
    subtitle: "Breath of Dawn",
    category: "ネイチャーアート",
    year: "2023",
    gradient:
      "linear-gradient(155deg, #0D0D0D 0%, #0a0505 20%, #3d2000 55%, #C9A96E 80%, #E4D5B7 100%)",
    aspectRatio: "16/9",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

interface HeroSliderProps {
  externalSlide?: number;
  onSlideChange?: (index: number) => void;
  onAboutClick?: () => void;
  onContactClick?: () => void;
}

export function HeroSlider({
  externalSlide,
  onSlideChange,
  onAboutClick,
  onContactClick,
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external slide control (from NavigationDots)
  useEffect(() => {
    if (externalSlide === undefined || externalSlide === current) return;
    const dir = externalSlide > current ? 1 : -1;
    setDirection(dir);
    setCurrent(externalSlide);
    setProgressKey((k) => k + 1);
  }, [externalSlide]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setCurrent(index);
      setProgressKey((k) => k + 1);
      onSlideChange?.(index);
    },
    [onSlideChange]
  );

  const next = useCallback(() => {
    const nextIdx = (current + 1) % works.length;
    goTo(nextIdx, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    const prevIdx = (current - 1 + works.length) % works.length;
    goTo(prevIdx, -1);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setTimeout(next, AUTO_PLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, isPaused, next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const work = works[current];

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: dir > 0 ? 1.04 : 0.96,
    }),
    center: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: dir > 0 ? 0.96 : 1.04,
      transition: { duration: 0.5, ease: "easeIn" as const },
    }),
  };

  return (
    <div
      className="de-hero relative w-full overflow-hidden"
      style={{
        height: "100vh",
        background: "var(--de-bg)",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{STYLE}</style>

      {/* Full-screen image area */}
      <div className="absolute inset-0" style={{ right: "200px" }}>
        <AnimatePresence custom={direction} mode="sync">
          <motion.div
            key={work.id}
            className="absolute inset-0 flex items-center justify-center"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px",
              }}
            >
              {/* Artwork placeholder — object-contain equivalent */}
              <div
                style={{
                  background: work.gradient,
                  aspectRatio: work.aspectRatio,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  boxShadow:
                    "0 0 60px rgba(0,0,0,0.9), 0 0 120px rgba(0,0,0,0.6)",
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(13,13,13,0.7) 100%)",
          }}
        />

        {/* Prev arrow (left edge) */}
        <button
          className="de-arrow-btn absolute left-6"
          onClick={prev}
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "1px solid var(--de-border)",
            color: "var(--de-gold)",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            opacity: 0.7,
            zIndex: 10,
          }}
          aria-label="前の作品"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Next arrow (right edge, near panel) */}
        <button
          className="de-arrow-btn absolute right-6"
          onClick={next}
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "1px solid var(--de-border)",
            color: "var(--de-gold)",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            opacity: 0.7,
            zIndex: 10,
          }}
          aria-label="次の作品"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          right: "200px",
          height: "2px",
          background: "rgba(201,169,110,0.1)",
        }}
      >
        {!isPaused && (
          <motion.div
            key={progressKey}
            className="de-progress-fill absolute inset-0"
            style={{ background: "var(--de-gold)", transformOrigin: "left center" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: AUTO_PLAY_INTERVAL / 1000,
              ease: "linear",
            }}
          />
        )}
      </div>

      {/* Top-left label */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{ padding: "24px 28px" }}
      >
        <div
          style={{
            fontSize: "9px",
            letterSpacing: "0.4em",
            color: "var(--de-text-muted)",
            textTransform: "uppercase",
          }}
        >
          AI Art Collection
        </div>
      </div>

      {/* Bottom-left: About / Contact buttons */}
      <div
        className="absolute bottom-0 left-0 flex items-center gap-3"
        style={{ padding: "20px 28px" }}
      >
        {onAboutClick && (
          <button
            className="de-mini-btn"
            onClick={onAboutClick}
            style={{
              background: "none",
              border: "1px solid var(--de-border)",
              color: "var(--de-text-muted)",
              padding: "7px 16px",
              cursor: "pointer",
            }}
          >
            About
          </button>
        )}
        {onContactClick && (
          <button
            className="de-mini-btn"
            onClick={onContactClick}
            style={{
              background: "none",
              border: "1px solid var(--de-border)",
              color: "var(--de-text-muted)",
              padding: "7px 16px",
              cursor: "pointer",
            }}
          >
            Contact
          </button>
        )}
      </div>

      {/* Right info panel */}
      <div
        className="absolute top-0 right-0 bottom-0 flex flex-col"
        style={{
          width: "200px",
          background: "var(--de-surface)",
          borderLeft: "1px solid var(--de-border)",
        }}
      >
        {/* Logo / Name */}
        <div
          className="flex items-center justify-center"
          style={{
            padding: "32px 20px 24px",
            borderBottom: "1px solid var(--de-border)",
          }}
        >
          <div className="text-center">
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "10px",
                letterSpacing: "0.4em",
                color: "var(--de-gold)",
                textTransform: "uppercase",
              }}
            >
              Portfolio
            </div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "18px",
                letterSpacing: "0.12em",
                color: "var(--de-text)",
                marginTop: "4px",
                fontStyle: "italic",
              }}
            >
              Lyo
            </div>
          </div>
        </div>

        {/* Work info */}
        <div className="flex-1 flex flex-col justify-center" style={{ padding: "0 20px" }}>
          {/* Slide number (large, translucent) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`num-${work.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "52px",
                color: "var(--de-gold)",
                lineHeight: 1,
                opacity: 0.18,
                marginBottom: "16px",
                userSelect: "none",
              }}
            >
              {String(current + 1).padStart(2, "0")}
            </motion.div>
          </AnimatePresence>

          {/* Gold rule */}
          <div
            style={{
              height: "1px",
              background: "var(--de-gold)",
              opacity: 0.35,
              marginBottom: "16px",
            }}
          />

          {/* Category */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cat-${work.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                fontSize: "8px",
                letterSpacing: "0.28em",
                color: "var(--de-gold)",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              {work.category}
            </motion.div>
          </AnimatePresence>

          {/* Title + subtitle */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${work.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "14px",
                  color: "var(--de-text)",
                  lineHeight: 1.5,
                  marginBottom: "4px",
                }}
              >
                {work.title}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--de-text-muted)",
                  fontStyle: "italic",
                  lineHeight: 1.4,
                }}
              >
                {work.subtitle}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Year */}
          <div
            style={{
              marginTop: "20px",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "var(--de-text-muted)",
            }}
          >
            {work.year}
          </div>
        </div>

        {/* Bottom: count + nav */}
        <div
          style={{
            padding: "20px",
            borderTop: "1px solid var(--de-border)",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.22em",
              color: "var(--de-text-muted)",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            {String(current + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
          </div>

          <div className="flex items-center justify-between">
            <button
              className="de-arrow-btn"
              onClick={prev}
              style={{
                background: "none",
                border: "1px solid var(--de-border)",
                color: "var(--de-gold)",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="前の作品"
            >
              <ChevronLeft size={15} />
            </button>

            {/* Auto-play indicator dot */}
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: isPaused ? "transparent" : "var(--de-gold)",
                border: "1px solid var(--de-gold)",
                opacity: 0.5,
                transition: "all 0.3s",
              }}
            />

            <button
              className="de-arrow-btn"
              onClick={next}
              style={{
                background: "none",
                border: "1px solid var(--de-border)",
                color: "var(--de-gold)",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="次の作品"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
