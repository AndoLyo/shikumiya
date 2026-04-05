"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

const STYLE = `
  .de-hero-scroll-line {
    animation: de-hero-pulse 1.8s ease-in-out infinite;
  }
  @keyframes de-hero-pulse {
    0%, 100% { opacity: 0.3; transform: translateY(0); }
    50% { opacity: 0.6; transform: translateY(6px); }
  }
`;

interface HeroSectionProps {
  onEnter?: () => void;
}

export function HeroSection({ onEnter }: HeroSectionProps) {
  const data = useSiteData();
  const artistName = data?.artistName || "Your Name";
  const subtitleText = data?.subtitle || "Digital Artist";

  return (
    <section
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "var(--de-bg)",
        cursor: onEnter ? "pointer" : undefined,
      }}
      onClick={onEnter}
    >
      <style>{STYLE}</style>

      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--de-gold), transparent)",
          transformOrigin: "center",
        }}
      />

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          fontSize: "9px",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "var(--de-gold)",
          marginBottom: "20px",
        }}
      >
        Portfolio
      </motion.div>

      {/* Artist name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(44px, 9vw, 88px)",
          fontStyle: "italic",
          fontWeight: "normal",
          letterSpacing: "0.06em",
          color: "var(--de-text)",
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        {artistName}
      </motion.h1>

      {/* Gold rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        style={{
          width: "60px",
          height: "1px",
          background: "var(--de-gold)",
          margin: "24px 0",
          transformOrigin: "center",
        }}
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        style={{
          fontSize: "11px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--de-text-muted)",
          margin: 0,
        }}
      >
        {subtitleText}
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--de-text-muted)",
          }}
        >
          Enter
        </span>
        <div
          className="de-hero-scroll-line"
          style={{
            width: "1px",
            height: "24px",
            background: "var(--de-gold)",
          }}
        />
      </motion.div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--de-gold), transparent)",
          transformOrigin: "center",
          opacity: 0.4,
        }}
      />
    </section>
  );
}
