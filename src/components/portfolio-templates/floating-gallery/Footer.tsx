"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

const STYLE = `
  .fg-footer-glow {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(108,99,255,0.5) 25%,
      rgba(165,160,255,0.7) 50%,
      rgba(108,99,255,0.5) 75%,
      transparent 100%
    );
    box-shadow: 0 0 16px rgba(108,99,255,0.35), 0 0 48px rgba(108,99,255,0.15);
  }
  .fg-footer-separator {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(108,99,255,0.15) 20%,
      rgba(108,99,255,0.25) 50%,
      rgba(108,99,255,0.15) 80%,
      transparent 100%
    );
  }
`;

export function Footer() {
  const data = useSiteData();
  const artistName = data?.artistName || "Yuki Sora";
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative"
      style={{ background: "var(--fg-bg)" }}
    >
      <style>{STYLE}</style>

      <div className="fg-footer-separator" />

      <motion.div
        className="relative max-w-6xl mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 select-none"
        >
          <div className="relative w-5 h-5">
            <div
              className="absolute inset-0 rounded-sm rotate-45"
              style={{
                background:
                  "linear-gradient(135deg, var(--fg-accent), var(--fg-accent-light))",
                opacity: 0.8,
              }}
            />
            <div
              className="absolute inset-[3px] rounded-sm rotate-45"
              style={{ background: "var(--fg-bg)" }}
            />
          </div>
          <span
            className="text-xs font-semibold tracking-wider"
            style={{ color: "var(--fg-text-muted)" }}
          >
            FLOAT<span style={{ color: "var(--fg-accent)" }}>.</span>
          </span>
        </div>

        {/* Copyright */}
        <p
          className="text-xs text-center"
          style={{ color: "var(--fg-text-muted)" }}
        >
          &copy; {year} {artistName}. All rights reserved.
        </p>

        {/* Template label */}
        <p
          className="text-xs tracking-wider"
          style={{ color: "rgba(120, 120, 160, 0.5)" }}
        >
          Floating Gallery Template
        </p>
      </motion.div>

      {/* Bottom indigo glow line */}
      <div className="fg-footer-glow" />
    </footer>
  );
}
