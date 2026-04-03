"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "var(--sw-bg)",
      }}
    >
      {/* Artist name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(40px, 8vw, 80px)",
          fontWeight: 300,
          letterSpacing: "0.08em",
          color: "var(--sw-text)",
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        Your Name
      </motion.h1>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "40px",
          height: "1px",
          background: "var(--sw-accent)",
          margin: "24px 0",
          transformOrigin: "center",
        }}
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{
          fontSize: "11px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "var(--sw-text-muted)",
          margin: 0,
        }}
      >
        Digital Artist
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
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
            color: "var(--sw-text-muted)",
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "1px",
            height: "24px",
            background: "var(--sw-text-muted)",
            opacity: 0.4,
          }}
        />
      </motion.div>
    </section>
  );
}
