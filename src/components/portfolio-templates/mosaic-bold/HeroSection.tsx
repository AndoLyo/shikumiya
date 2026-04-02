"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const STYLE = `
  .mb-hero {
    min-height: 100vh;
    background: var(--mb-bg);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0;
    position: relative;
    overflow: hidden;
  }
  .mb-hero-diagonal {
    position: absolute;
    top: 0;
    right: 0;
    width: 38%;
    height: 100%;
    background: var(--mb-accent);
    clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
    pointer-events: none;
    opacity: 0.08;
  }
  .mb-display-text {
    font-size: clamp(4rem, 14vw, 13rem);
    font-weight: 900;
    letter-spacing: -0.05em;
    line-height: 0.85;
    color: var(--mb-text);
    text-transform: uppercase;
    font-family: 'Arial Black', 'Arial', sans-serif;
    user-select: none;
  }
  .mb-stats-row {
    display: flex;
    gap: 0;
    border-top: 1px solid var(--mb-border);
    border-bottom: 1px solid var(--mb-border);
  }
  .mb-stat-cell {
    flex: 1;
    padding: 1.25rem 2rem;
    border-right: 1px solid var(--mb-border);
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .mb-stat-cell:last-child {
    border-right: none;
  }
  .mb-stat-num {
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 900;
    letter-spacing: -0.03em;
    color: var(--mb-text);
    font-family: 'Arial Black', 'Arial', sans-serif;
    line-height: 1;
  }
  .mb-stat-label {
    font-family: 'Courier New', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--mb-text-muted);
  }
  .mb-hero-sub {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--mb-text-muted);
  }
`;

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

function Counter({ target, suffix = "", duration = 1800 }: CounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const stats = [
  { num: 87, suffix: "", label: "Works" },
  { num: 5, suffix: " Yrs", label: "Experience" },
  { num: 42, suffix: "", label: "Clients" },
];

export function HeroSection() {
  return (
    <section className="mb-hero" style={{ paddingTop: "clamp(6rem, 15vw, 14rem)" }}>
      <style>{STYLE}</style>

      {/* Diagonal stripe decoration */}
      <div className="mb-hero-diagonal" />

      {/* Accent top-left vertical bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "clamp(1.5rem, 5vw, 4rem)",
          width: "3px",
          height: "clamp(4rem, 12vw, 10rem)",
          background: "var(--mb-accent)",
        }}
      />

      {/* Main display text */}
      <div className="px-6 md:px-10 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-hero-sub mb-4">AIアートポートフォリオ — 2025</p>
          <h1 className="mb-display-text">
            VISUAL
            <br />
            <span style={{ color: "var(--mb-accent)" }}>IMPACT</span>
            <br />
            STUDIO
          </h1>
        </motion.div>

        <motion.p
          className="mt-8 mb-hero-sub max-w-lg"
          style={{ color: "var(--mb-text-muted)", lineHeight: 1.8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          大胆なビジュアルと鋭いタイポグラフィで、<br />
          見る者の記憶に刻む作品を。
        </motion.p>
      </div>

      {/* Stats row */}
      <motion.div
        className="mb-stats-row"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
      >
        {stats.map((s) => (
          <div key={s.label} className="mb-stat-cell">
            <div className="mb-stat-num">
              <Counter target={s.num} suffix={s.suffix} />
            </div>
            <div className="mb-stat-label">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
