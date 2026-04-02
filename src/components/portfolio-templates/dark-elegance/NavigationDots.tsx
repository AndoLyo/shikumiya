"use client";

import { motion } from "framer-motion";

const STYLE = `
  .de-dot {
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .de-dot:hover {
    border-color: var(--de-gold) !important;
    background: rgba(201,169,110,0.2) !important;
  }
  .de-nav-btn {
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .de-nav-btn:hover {
    color: var(--de-gold) !important;
    border-color: rgba(201,169,110,0.4) !important;
  }
`;

interface NavigationDotsProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
  onAboutClick: () => void;
  onContactClick: () => void;
  isAboutOpen: boolean;
  isContactOpen: boolean;
}

export function NavigationDots({
  total,
  current,
  onDotClick,
  onAboutClick,
  onContactClick,
  isAboutOpen,
  isContactOpen,
}: NavigationDotsProps) {
  return (
    <>
      <style>{STYLE}</style>
      <nav
        style={{
          position: "fixed",
          right: "216px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
        aria-label="スライドナビゲーション"
      >
        {/* Slide dots */}
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            className="de-dot"
            onClick={() => onDotClick(i)}
            aria-label={`スライド ${i + 1}`}
            style={{
              width: i === current ? "8px" : "6px",
              height: i === current ? "8px" : "6px",
              borderRadius: "50%",
              border: "1px solid",
              borderColor: i === current ? "var(--de-gold)" : "rgba(201,169,110,0.3)",
              background: i === current ? "var(--de-gold)" : "transparent",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}

        {/* Thin separator */}
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "var(--de-border)",
            marginTop: "4px",
            marginBottom: "4px",
          }}
        />

        {/* About button */}
        <motion.button
          className="de-nav-btn"
          onClick={onAboutClick}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "none",
            border: "1px solid",
            borderColor: isAboutOpen ? "var(--de-gold)" : "var(--de-border)",
            color: isAboutOpen ? "var(--de-gold)" : "var(--de-text-muted)",
            padding: "0",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            letterSpacing: "0.05em",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            textTransform: "uppercase",
          }}
          aria-label="Aboutパネルを開く"
          aria-pressed={isAboutOpen}
        >
          A
        </motion.button>

        {/* Contact button */}
        <motion.button
          className="de-nav-btn"
          onClick={onContactClick}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "none",
            border: "1px solid",
            borderColor: isContactOpen ? "var(--de-gold)" : "var(--de-border)",
            color: isContactOpen ? "var(--de-gold)" : "var(--de-text-muted)",
            padding: "0",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            letterSpacing: "0.05em",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            textTransform: "uppercase",
          }}
          aria-label="コンタクトを開く"
          aria-pressed={isContactOpen}
        >
          C
        </motion.button>
      </nav>
    </>
  );
}
